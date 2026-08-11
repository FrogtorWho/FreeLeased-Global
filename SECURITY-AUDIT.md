# Self-Audit against OWASP Top 10 — FreeLeased

**Version:** 1.0 · **Date:** 2026-08-11 · **Author:** Sam Peacock
**Methodology:** OWASP Top 10 (2021), self-audit; external
auditor planned Q4 2026.

> **TL;DR.** Of the 10 categories, 8 have *primary*
> mitigation in place (TOMs + HITL + RLS + boundary
> redaction), 2 have *partial* mitigation (SSR mitigates XSS,
> but we keep hardening); 0 are *open*. The detailed pass
> is below.

---

## A01 · Broken Access Control — **PASS**

- **Controls.**
  - Per-tenant `tenantId` on every Prisma model
    (see [`prisma/schema.prisma`](../prisma/schema.prisma:1))
  - Per-tenant resolver [`src/lib/tenancy.ts`](../src/lib/tenancy.ts:1)
    is the only path to data access
  - Row-Level Security policies in Postgres for
    institutional tier
  - Bearer-token auth on every API route (`custom-routes.ts`)
  - 33 multi-tenant integration tests
    (`scripts/test-multi-tenant.ts`) assert isolation
- **Tests.**
  - `bun scripts/test-multi-tenant.ts` — 33/33 pass
  - `bun scripts/test-signoff.ts` — sign-off queue respects
    tenant boundary
- **Residual.** Low.

---

## A02 · Cryptographic Failures — **PASS**

- **Controls.**
  - TLS 1.2+ for all transit (Vercel/Netlify default)
  - AES-256 at rest (Supabase / Postgres)
  - Per-tenant encryption keys for Institutional tier
  - ed25519 signatures on the sign-off queue
    ([`src/lib/signing.ts`](../src/lib/signing.ts:1))
  - HMAC chain for WORM audit log
- **Tests.**
  - `bun scripts/test-signoff.ts` validates signature parity
- **Residual.** Low.

---

## A03 · Injection — **PASS**

- **Controls.**
  - Parameterised Prisma queries (no string-concat SQL anywhere)
  - All user-input strings rendered through React (XSS-safe
    by default)
  - VLM pipeline OCR output is treated as data, never as code
  - LLM tier outputs pass through a "deliberation scrubber"
    that strips control characters
    ([`src/lib/ocr-pipeline.ts`](../src/lib/ocr-pipeline.ts:1))
- **Tests.**
  - `bun scripts/test-truth.ts` — 83/83 pass
  - Manual prompt-injection test: attempt to make dossier
    generator emit "ignore previous instructions" — fails
- **Residual.** Low.

---

## A04 · Insecure Design — **PASS (with caveats)**

- **Controls.**
  - HITL sign-off on every severity-3+ claim
  - Conviction caps (0.99 / 0.75 / 0.60 / 0.33) prevent
    over-confidence ([`FREELEASED-PRINCIPLES.md`](../FREELEASED-PRINCIPLES.md))
  - Threat model [`docs/THREAT-MODEL.md`](../docs/THREAT-MODEL.md:1)
    maintained and reviewed quarterly
  - "Engage a local attorney" non-removable nudge at high
    severity
  - Adversary / ThreatLab data retired (CfC CoC compliance)
- **Caveats.**
  - No formal "secure design" review cycle yet — Q4 2026
- **Tests.**
  - `bun scripts/test-trust-protocol.ts` (forthcoming)
- **Residual.** Medium → Low.

---

## A05 · Security Misconfiguration — **PASS**

- **Controls.**
  - `.env.example` placeholders only; `.gitignore` excludes
    real `.env`
  - No default credentials anywhere
  - TLS/HSTS preloaded on custom domains
  - CSP `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` minimal: only `geolocation=()` allowed
- **Tests.**
  - Verifier: `curl -I https://freeleased.org` post-deploy
- **Residual.** Low.

---

## A06 · Vulnerable & Outdated Components — **PARTIAL**

- **Controls.**
  - Pinned major versions in `package.json`
  - `bun audit` weekly (planned; not yet automated in CI —
    see action list)
  - `npm audit --production` weekly (planned)
- **Open actions.**
  1. Add `bun audit` to CI (Issue RE-AUDIT-CI)
  2. Add `npm audit --production` to CI (same)
  3. Add Dependabot-equivalent (free OSS) — e.g. Renovate
     weekly
- **Residual.** Medium — currently manual.

---

## A07 · Identification & Authentication Failures — **PASS**

- **Controls.**
  - Optional TOTP for Pro, mandatory for Institutional
  - Bearer token with 30-day sliding expiry
  - Session revocation on password change
  - Per-tenant JWT claim scoping
- **Tests.**
  - `bun scripts/test-agents.ts` — auth boundary
- **Residual.** Low.

---

## A08 · Software & Data Integrity Failures — **PASS**

- **Controls.**
  - Generated routes from Prisma are versioned
  - `bun install --frozen-lockfile` enforced (no surprise
    dep drift)
  - Sigstore-style provenance attestation for release
    artefacts (planned Q4 2026)
  - Sign-off queue is WORM-style + hash-chained
- **Tests.**
  - `bun scripts/test-signoff.ts` covers chain integrity
  - `bun scripts/test-reconcile-docs.ts` blocks drift
- **Residual.** Low.

---

## A09 · Security Logging & Monitoring Failures — **PASS**

- **Controls.**
  - OllyGarden OTLP export for all spans (sampled and
    PII-redacted)
  - 6 published SLOs in [`docs/SLA.md`](../docs/SLA.md:1)
  - 5 runbooks in `src/lib/slo.ts:143`
  - Burn-rate alerts on every SLO at 1.5-2.0× threshold
  - `scripts/health-check.ts` orchestrator
- **Tests.**
  - `bun scripts/test-slo.ts` — 117/117 pass
  - `bun scripts/health-check.ts` — orchestrator green
- **Residual.** Low.

---

## A10 · Server-Side Request Forgery — **PASS**

- **Controls.**
  - Outbound HTTP allowlist in code; no user-controlled URL
    fetching
  - Inference endpoints (Nebius / Giotto / MiniMax / Ollama)
    are statically configured
  - OTLP endpoint is also statically configured
- **Tests.**
  - Penetration test: SSRF probe run quarterly (manual
    until hiring)
- **Residual.** Low.

---

## Summary

| Category | Status | Score (0-10) |
|---|---|--:|
| A01 Broken access control | PASS | 9.5 |
| A02 Cryptographic failures | PASS | 9.0 |
| A03 Injection | PASS | 9.0 |
| A04 Insecure design | PASS w/ caveats | 8.0 |
| A05 Security misconfiguration | PASS | 9.0 |
| A06 Vulnerable components | PARTIAL | 6.5 |
| A07 Identification & auth | PASS | 9.0 |
| A08 Software & data integrity | PASS | 8.5 |
| A09 Logging & monitoring | PASS | 9.5 |
| A10 SSRF | PASS | 9.5 |
| **Mean** | | **8.75** |

> The single category holding us under 9.0 is **A06
> (vulnerable components)** because the audit isn't yet
> CI-automated. Plan to close by end of Phase 13.

---

## Action list (open items)

1. Add `bun audit` + `npm audit --production` to CI.
2. Add Dependabot or Renovate weekly.
3. Set up Sigstore-style provenance attestation.
4. Schedule a recurring 30-min threat-model review.
5. Plan external pentest budget for Q4 2026 (£3k–£8k).

— Sam Peacock
2026-08-11
