# Threat Model (STRIDE)

**FreeLeased — Open-source Leasehold Governance Platform**
**Effective:** 2026-08-11 · **Version:** 1.0

> **Method.** This threat model uses the **STRIDE**
> classification (Spoofing, Tampering, Repudiation,
> Information disclosure, Denial of service, Elevation of
> privilege). For each threat we record: surface,
> attacker, asset, controls in place, residual risk,
> mitigation roadmap.
>
> Scope: **hosted Service** (web UI + API). Self-hosted
> deployments inherit the operator's threat model and
> should run a STRIDE pass of their own with this as a
> baseline.

---

## 0. Trust boundaries

```
+--------------------------------+
|         User Browser           |   <-- Trusted (TPM-equiv. sandbox)
+--------------------------------+
              |  HTTPS
              v
+--------------------------------+
|    Public marketing site       |   <-- Edge CDN (Vercel/Netlify)
|    freeleased.org              |       static, no state
+--------------------------------+
              |  HTTPS
              v
+--------------------------------+
|      Web UI (React)            |   <-- Browser sandbox
|      app.freeleased.org        |
+--------------------------------+
              |  HTTPS (bearer token)
              v
+--------------------------------+
|      API (Hono/custom-routes)  |   <-- AuthN + AuthZ + rate-limit
|      api.freeleased.org        |
+--------------------------------+
              |
   +----------+----------+--------------------------+
   |          |          |                          |
   v          v          v                          v
+-------+ +---------+ +---------------+    +-------------------+
|Postgres| |Supabase | | LLM Providers |    | OllyGarden OTLP   |
| EU-W2 | | (auth)  | | Nebius/Giotto |    |  (eu-west-2)      |
+-------+ +---------+ +---------------+    +-------------------+
```

The boundaries that matter:

1. **Browser → marketing site.** Marketing has no state and
   no auth.
2. **Browser → web UI.** Bearer token stored in `httpOnly`
   cookie + CSRF token in localStorage (and on form
   submissions).
3. **Web UI → API.** Same-origin + bearer; tenant-scoped
   queries only.
4. **API → Postgres.** Per-tenant row-level security
   (RLS) where the schema permits.
5. **API → LLM providers.** Lease uploads flow through
   *only* on explicit consent. Failover chain is ordered
   in [`src/lib/llm.server.ts`](../src/lib/llm.server.ts:1).

---

## 1. Spoofing (S)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| S1 | Attacker claims to be a tenant admin | API auth | Authenticity of admin actions | Bearer token + signed sign-off queue + audit log | LOW |
| S2 | Attacker forges OTLP spans | OTLP exporter | Trace provenance | HMAC over payload; OllyGarden validates | LOW |
| S3 | Phishing a user into a "lookalike" login | Marketing → UI | User credentials | TLS + HSTS + `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` | MEDIUM |
| S4 | LLM provider returns a forged "official" verdict | LLM tier 2/3/4 | Verdict integrity | Conviction-cap (0.99/0.75/0.60/0.33) + tier-1 anchor check + HITL sign-off on high severity | LOW |
| S5 | Carried-over tokens from a previous session | Auth | Tenant isolation | 30-day sliding expiry + revocation on password change | LOW |

---

## 2. Tampering (T)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| T1 | Self-hosted operator modifies code to exfiltrate | Self-hosted code | Operator's own tenants | Apache-2.0 licence permits; documented in `TERMS.md §3` | LOW (acknowledged risk) |
| T2 | Tenant A modifies Tenant B's records via API | API → Postgres | Cross-tenant integrity | Per-tenant JWT claim + RLS + integrity hash | LOW |
| T3 | An attacker modifies a "signed" dossier post-hoc | Sign-off queue | Audit trail | `lib/signing.ts` uses immutable hash + WORM-style append-only log | LOW |
| T4 | A malicious LLM tier injects a tampered verdict | LLM tier 2/3/4 | Verdict integrity | Conviction caps + fact-check-register (`src/lib/citation.ts`) + HITL | LOW |
| T5 | An attacker modifies a public marketing page | Static site | Brand integrity | Edge CDN with locked deploy tokens; no `</form>` on the marketing site | LOW |

---

## 3. Repudiation (R)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| R1 | A user denies having signed a dossier | Sign-off queue | Accountability | Cryptographic signature with non-repudiation (ed25519) + timestamp | LOW |
| R2 | The Founder denies a permission grant | API audit log | Permitted-access trail | Append-only log with rolling HMAC chain (`src/lib/signing.ts`) | LOW |
| R3 | A regulator subpoenas logs; we cannot prove chain of custody | Postgres + OTLP | Forensic evidential weight | Chain-of-custody baked into WORM-style archive; hash-chained | LOW |

---

## 4. Information disclosure (I)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| I1 | LLM tier 2/3/4 logs/uploads claim text | LLM fallback | Tenant claim confidentiality | DPA + scrubbing on tenant request; consent-gated | MEDIUM (inherent to using 3rd-party LLM) |
| I2 | Cross-tenant data leak via Postgres join | API → Postgres | Cross-tenant confidentiality | Per-tenant resolver + RLS + integration tests | LOW |
| I3 | OTLP span leaks PII | OTLP exporter | End-user PII | Boundary redactor in `src/lib/ollygarden.ts` scrubs: email, phone, name-pattern, IP | LOW |
| I4 | Public marketing site leaks staging data | Static → S3 | Internal data | Marketing is wholly static; rendered at deploy time from approved sources | LOW |
| I5 | Self-host operator logs PII to disk | Self-host | End-user PII | Documented in `TERMS.md §3` + `SECURITY.md §5` | MEDIUM (inherent to self-host) |
| I6 | CSV export includes other tenant's data | Exports API | Cross-tenant confidentiality | Per-tenant API key scoping; tested | LOW |
| I7 | Phishing-induced credential leak | User | Account takeover | Mandatory TOTP for institutional tier; recommended for free tier | MEDIUM |

---

## 5. Denial of service (D)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| D1 | LLM inference rate-limit exhaustion | LLM tier | Service availability for all | Tier-1 default is local Ollama → no external rate cap; tiers 2/3/4 have explicit per-tenant budgets (`src/lib/llm.server.ts`) | LOW |
| D2 | API exhaustion | API | Service availability | Token-bucket per-tenant (100 req/min free, 1000/min Pro, custom Institutional) + global Circuit Breaker at 5k req/s | LOW |
| D3 | Marketing site DDoS | Marketing CDN | Reputation / CDN cost | CDN absorbs at the edge; static cache; Vercel/Netlify native DDoS | LOW |
| D4 | Storage exhaustion (Postgres) | Postgres | Backup / compute cost | Alarms at 70/85/95% storage; tier-rate clause in `TERMS.md §6` | LOW |
| D5 | OllyGarden OTLP outage | Traces | Observability | Runbook RB-OLLYGARDEN-OUTAGE in `src/lib/slo.ts:148`; falls back to `OTLP_SINK=local` | LOW |

---

## 6. Elevation of privilege (E)

| ID | Threat | Surface | Asset | Controls | Residual risk |
|----|--------|---------|-------|----------|---------------|
| E1 | Free-tier user promotes themselves to Pro | Billing | Business model | Server-side tier enforcement; client UI is a hint | LOW |
| E2 | Pro-tier user accesses Institutional endpoints | API | Cross-tier exposure | Per-tier route allowlist in `custom-routes.ts`; per-tier JWT claim | LOW |
| E3 | Tenant admin promotes another to "Founder" | IAM | Pivilege escalation | No "Founder" role exists in the application — only tenant-admin / member / observer | LOW |
| E4 | Container escape from a sandboxed LLM worker | LLM tier | Host | Each worker runs in a separate gVisor sandbox; ephemeral | LOW |
| E5 | Self-host operator uses admin API to read all tenants | Self-host | Operator's own data, but a delegation risk | Self-host has only ONE tenant by default; multi-tenant is opt-in | MEDIUM (documented) |

---

## 7. Out-of-scope / accepted risks

| ID | Risk | Why accepted | Disclosure |
|----|------|--------------|------------|
| O1 | Sovereign Edge operator has root | Operational necessity | `SECURITY.md §5.2`, `TERMS.md §3` |
| O2 | Inference providers see uploaded claim text | Functional requirement of cloud-LLM tier | `PRIVACY.md §3` |
| O3 | Single-founder single-tenant kill scenario | Pre-funding | Risk-register entry RE-001 |

---

## 8. Mitigations roadmap

| When | Mitigation | Threats addressed |
|---|---|---|
| Now | Static site CSP `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'` | T5, I4 |
| Now | Mandatory 2FA on Institutional tier | I7 |
| Now | Per-tenant row-level security in Postgres | T2, I2 |
| T+7 days | SOPS-encrypted secrets; documented in `CONTRIBUTING.md` | S3 |
| T+30 days | SAST (Semgrep) in CI for src/ and custom-routes | T2, T4, E2 |
| T+30 days | DAST (OWASP ZAP) smoke test weekly | I2, I4, D2 |
| T+90 days | SOC-2 Type-1 readiness pack | R2, R3 |

---

## 9. Review cadence

- **Quarterly**: full STRIDE pass, signed by Founder
- **On material change**: trigger STRIDE, no later than 14 days after merge
- **On security incident**: post-mortem appended to this doc
- **External review**: planned for Q4 2026 if budget permits

---

## 10. Related

- [`docs/SECURITY.md`](SECURITY.md:1) — disclosure policy
- [`SECURITY-AUDIT.md`](../SECURITY-AUDIT.md:1) — OWASP Top 10 pass
- [`docs/PRIVACY.md`](PRIVACY.md:1) — data-handling rules
- [`docs/RUNBOOK.md`](RUNBOOK.md:1) — operational runbook

— Sam Peacock, Founder, FreeLeased
2026-08-11
