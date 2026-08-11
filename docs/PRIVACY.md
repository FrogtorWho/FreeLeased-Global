# Privacy Policy

**FreeLeased — Open-source Leasehold Governance Platform**
**Effective:** 2026-08-11 · **Version:** 1.0
**Owner:** Sam Peacock · `sam.peacock1@gmail.com`

> **TL;DR (summary)** — FreeLeased is local-first. Your lease
> uploads are processed on your device or, where you opt in,
> on our EU/UK-hosted infrastructure. We never sell data. We
> never train third-party models on your data. The legally
> binding text is below.

This Privacy Policy describes how FreeLeased ("we", "our",
"the project") collects, uses, discloses, and retains
information when you use our open-source application,
website, APIs, or any associated services (collectively, the
"Service"). The project is operated by Sam Peacock as a solo
founder under UK GDPR / UK Data Protection Act 2018 and
(where applicable) EU GDPR (Regulation (EU) 2016/679). For
Caribbean users, we additionally respect the data-protection
regimes of the user's operating jurisdiction, listed in
[`project/research/regulatory-landscape.md`](../project/research/regulatory-landscape.md:1).

---

## 1. Data controller

The data controller for the FreeLeased hosted services is
Sam Peacock ("Founder"), reachable at `sam.peacock1@gmail.com`.
If you self-host the project (as encouraged by our
[`LICENSE`](https://github.com/sam-peacock/FreeLeased-Global/blob/main/LICENSE)),
**you are the data controller** for any data flowing through
your instance. The Founder is not a joint controller.

---

## 2. What data we collect

### 2.1 Lease documents and case data (you upload)

If you upload a lease, tenancy agreement, service-charge
demand, RTM notice, or other case file, that **file content
and any extracted fields** are processed by:

1. **Local browser** (the default for `npm run dev`, PWA,
   offline mode) — file content never leaves your device.
2. **Our hosted inference endpoint** (only if you click
   "Analyse with cloud LLM") — the file is uploaded via
   HTTPS to the inference provider (Nebius, Giotto, MiniMax,
   or your local Ollama endpoint if configured). See the
   failover order in [`src/lib/llm.server.ts`](../src/lib/llm.server.ts:1).
3. **Our optional trace-export endpoint** (OllyGarden OTLP) —
   *only sampled metadata* (trace ID, span name, jurisdiction,
   severity) is exported. **No file content, no PII, no
   pseudonym, no claim text.**

### 2.2 Account data (if you sign in)

| Field | Why | Retention |
|---|---|---|
| Email address | Sign-in, sign-off queue, audit alerts | Until you delete account + 30 days |
| Display name | Cooperative features (group ballots) | Until you delete account + 30 days |
| Org / tenant ID | Multi-tenant data isolation | Until you delete the org + 90 days |

### 2.3 Telemetry (opt-out by default)

| What | Why | Retention | Opt-out? |
|---|---|---|---|
| Anonymous page view counts | Improve the docs site | Aggregated; 90 days | Yes — see §7 |
| Crash reports (stack trace only, no PII) | Stability | 30 days | Yes |
| LLM spans (jurisdiction, severity, *not* file content) | Observability | 30 days | Yes |

We **do not** use third-party analytics that track users
across sites (no Google Analytics, no Facebook Pixel, no
Hotjar). We **do not** use cookies for tracking. See
[`docs/COOKIES.md`](COOKIES.md:1).

### 2.4 Data we never collect

- Biometric data
- Financial account credentials (we don't ask for them)
- Special-category data under Art. 9 (race, religion, health,
  sexual orientation, political opinion, trade-union
  membership) — unless you explicitly upload a tribunal ruling
  that contains it
- Children's data (the Service is not directed at children
  under 16)

---

## 3. Lawful basis (UK GDPR Article 6)

| Processing | Lawful basis |
|---|---|
| Authenticated sign-in | (b) Contract — to deliver the Service you signed up for |
| Lease analysis on cloud LLM | (a) Consent — you click an explicit "Analyse with cloud LLM" button |
| Anonymised telemetry | (f) Legitimate interest — service improvement; we balance against your rights and let you opt out (§7) |
| Defensive security logging (rate-limits, abuse) | (f) Legitimate interest — protect the Service |
| On-device processing | (a) Consent — your browser is the processor |

We do **not** rely on (f) for anything that involves profiling
or automated decision-making producing legal effects about you
(Article 22). The Service is HITL-gated by design: every
high-severity claim requires human sign-off
([`src/lib/signing.ts`](../src/lib/signing.ts:1)).

---

## 4. Where we store data — sovereignty promises

- **Default — local device.** Lease files never leave your
  browser unless you click "Analyse with cloud LLM".
- **Hosted tenants — EU/UK first.** Our hosted Postgres runs
  in `eu-west-2` (London). Replicas in `eu-central-1`
  (Frankfurt). Backup in `eu-west-1` (Ireland).
- **Caribbean institutional tenants — sovereign-edge** when
  configured (see [`docs/local-edge-llm.md`](local-edge-llm.md:1)).
  No trans-Atlantic round trip by default.
- **OTLP traces** — scrubbed for PII before export; OllyGarden
  ingest endpoint in `eu-west-2`. We retain the right to
  disable OllyGarden for any tenant on request.

---

## 5. Sharing your data

We do not sell data. We do not share with third-party
advertisers. We share data only with:

| Recipient | Why | Safeguard |
|---|---|---|
| Inference provider (Nebius, Giotto, MiniMax, Ollama) | To perform the analysis you requested | DPA + data-residency contract; see §6 |
| Cloud infrastructure (Vercel/Netlify, Supabase, OllyGarden) | To operate the Service | Encrypted at rest + in transit; sub-processors listed at `docs/sub-processors.md` (forthcoming) |
| Legal authorities | If compelled by UK/EU court order | Minimised disclosure; user notified unless gagged |

---

## 6. Sub-processors (current list)

> Last updated 2026-08-11. Material changes trigger a
> 30-day notice before they take effect.

| Provider | Function | Data location | DPA URL |
|---|---|---|---|
| Vercel (when deployed) | Static site hosting | Global edge | https://vercel.com/legal/dpa |
| Supabase (when deployed) | Postgres + auth | `eu-west-2` | https://supabase.com/legal/dpa |
| OllyGarden | OTLP trace ingest | `eu-west-2` | https://ollygarden.cloud/dpa |
| Nebius AI Studio | LLM inference (Tier 2 fallback) | EU region | https://nebius.com/legal/dpa |
| Giotto.ai | LLM inference (Tier 3 fallback) | EU region | https://giotto.ai/dpa |
| MiniMax (configured) | LLM inference (Tier 4 fallback) | Global | https://minimax.com/dpa |

---

## 7. Your rights

| Right | How to exercise it |
|---|---|
| Access (Art. 15) | Email `sam.peacock1@gmail.com` with subject "DSR — Access" |
| Rectification (Art. 16) | Edit in-product; or email |
| Erasure / Right to be forgotten (Art. 17) | Email subject "DSR — Delete"; we erase within 30 days |
| Restriction (Art. 18) | Email subject "DSR — Restrict" |
| Portability (Art. 20) | We export your data as JSON + signed PDF within 30 days |
| Object (Art. 21) | Opt out of telemetry from `Settings → Privacy` |
| Withdraw consent (Art. 7(3)) | Same as object — §7 row above |

The in-product `Settings → Privacy` panel covers the most
common rights; complex requests are handled within 30 days.

---

## 8. International transfers

If you are in the EEA/UK and we transfer data outside the
EEA/UK (e.g., to a Caribbean sovereign-edge tenant), we
rely on:

- Adequacy decisions (where applicable)
- Standard Contractual Clauses (for any further transfers)
- Explicit consent for one-off transfers

The Caribbean sovereign-edge path actually **avoids** most
EEA→US transfers; we recommend it for institutional
customers who want data to stay in-region.

---

## 9. Retention

| Data type | Retention |
|---|---|
| Lease files you upload | Until you delete them + 30 days |
| Audit log (signed) | 7 years (UK limitation period for contractual claims) |
| Sign-off queue entries | Until resolved + 7 years (audit trail) |
| Anonymised telemetry | 90 days aggregated |
| OTLP traces | 30 days raw |
| Backups | 30 days encrypted |

---

## 10. Security

See [`docs/SECURITY.md`](SECURITY.md:1) for our security
disclosure policy and [`docs/THREAT-MODEL.md`](THREAT-MODEL.md:1)
for our STRIDE threat model. We use:

- TLS 1.2+ for all transit
- AES-256 at rest
- Per-tenant encryption keys (Tier 1+ customers)
- Pseudonymisation on any upload to a research dataset
  ([`src/lib/pseudonym.ts`](../src/lib/pseudonym.ts:1))
- PII-stays-on-device in offline mode
  ([`src/lib/offline.ts`](../src/lib/offline.ts:1))

---

## 11. Children

The Service is not directed at children under 16. We do not
knowingly collect data from children. If you believe a
child has used the Service, email us; we will erase the data.

---

## 12. Changes to this policy

We will notify you of material changes via:

- An in-product banner on next sign-in
- A 30-day advance notice on the public marketing site
- An email if you are a paying institutional customer

The current version is always at
[`docs/PRIVACY.md`](PRIVACY.md:1) with an `Effective:` date.

---

## 13. Complaints

If you are unhappy with how we handle your data, you can
complain to:

- **UK**: Information Commissioner's Office (ICO), `https://ico.org.uk`
- **EU**: Your national supervisory authority
- **Caribbean**: See your jurisdiction's data-protection
  authority (e.g., Barbados Data Protection Office, Jamaica
  Office of the Information Commissioner)

We would prefer to resolve the issue first — email
`sam.peacock1@gmail.com` with subject "Privacy complaint".

— Sam Peacock, Founder, FreeLeased
2026-08-11
