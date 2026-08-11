# FreeLeased Pricing — v1.0

> **Public pricing page (canonical source of truth).** Three tiers,
> transparent, GDPR-residency-aware, no hidden fees. As honest as
> the rest of the docs.
> **Version:** 1.0 · **Date:** 2026-08-11 · **Status:** public

---

## TL;DR

| Tier | Who | Price | Includes |
|---|---|---|---|
| **Free Resident** | Individual UK / Caribbean leaseholder | **£0 / yr** | 1 lease audit / month, basic rights discovery, community forum |
| **Pro Advisor** | Active RTM / enfranchisement leaseholder, solicitor's clerk | **£10 / month** (£96 / yr, billed annually) | Unlimited audits, full rights catalogue, consensus-gated compliance reports, dossier export (JSON) |
| **Institution** | Housing associations, RTM companies, managing agents | **£49 / unit / yr** (min £490 / yr) | Multi-lease dashboard, bulk audit, white-label reports, API access, GDPR-DPA |

**No hidden fees.** No per-document charges. No transaction fees.
No data-brokerage. No "premium support" upsell. No card-on-file
"free trial that auto-renews".

---

## Tier 1 — Free Resident (£0 / yr)

**For:** an individual UK leaseholder or Caribbean condominium owner
who wants to understand what their lease says.

### What you get

- **1 lease audit per calendar month** (resets on the 1st of each month)
- Basic rights discovery (the conviction-classed dossier summary)
- Community forum read + post
- Glossary tooltips
- 7-day email support (best-effort)

### What you don't get

- Unlimited audits
- Dossier export (JSON / PDF)
- API access
- HITL sign-off queue visibility (free users see only their own rows)
- Multi-lease portfolio view

### The fine print

- No card on file.
- No auto-renew (you can't auto-renew what you didn't pay for).
- You can leave any time. Your pseudonymised audit rows are kept
  for 30 days, then purged (you can request earlier deletion via
  `deletion@freeleased.com`).
- The audit ledger is **anonymised and never shared** with insurers,
  lenders, or marketers.

---

## Tier 2 — Pro Advisor (£10 / month, £96 / yr)

**For:** an active UK leaseholder pursuing RTM / lease extension /
freehold acquisition, OR a solicitor's clerk running one or two
dossiers per week.

### What you get (everything in Free, plus…)

- **Unlimited lease audits** (no per-document charge)
- **Full rights catalogue** — every Act, every section, every case
- **Consensus-gated compliance reports** — the same reports the
  Sign-off Queue surfaces to institutional users
- **Dossier export** (JSON, with rowHash for integrity)
- **HITL sign-off queue access** (you see your own pending rows)
- **Priority email support** (24-hour response SLA)
- **Quarterly newsletter** (regulatory updates only, no marketing)

### What you don't get

- Bulk audit (no CSV-of-leases upload)
- White-label reports (no co-branding)
- API access (no programmatic queries)
- Multi-tenant isolation (see Institution tier for that)

### The fine print

- Billed monthly at £10, OR annually at £96 (save £24 / yr).
- **No auto-renew without your consent.** The annual plan sends
  a 14-day reminder email before charging. You can cancel any time
  and we pro-rate the unused days to the original payment method.
- 30-day money-back guarantee on the first annual subscription.
- The audit ledger is **pseudonymised by default**. You can
  optionally bind your pseudonym to your real identity for
  cross-device sign-in, but you can also stay fully pseudonymous.

---

## Tier 3 — Institution (£49 / unit / yr, min £490 / yr)

**For:** housing associations, RTM companies, managing agents,
solicitors running a portfolio of leasehold cases, Caribbean
strata corporations.

### What you get (everything in Pro, plus…)

- **Multi-lease dashboard** — see 10 to 10,000 leases at once
- **Bulk audit** — upload a CSV of lease refs, get back a dossier
  per lease in a single batch
- **White-label reports** — your logo, your colour palette
- **API access** — programmatic access to the dossier builder
  (rate-limited per the DPA; see below)
- **Multi-tenant isolation** — your portfolio data never touches
  another institution's data
- **Dedicated DPA** — GDPR Art. 28 processor agreement, signed
- **Named CSM** (customer success manager) on accounts ≥ £5,000 / yr
- **SLA** — 99.9% uptime, 4-hour response on P1 incidents

### What you don't get

- Custom LLM training on your data (we don't do this anyway)
- White-labelled mobile apps (the PWA / MobileCapture route is shared)
- On-premise deployment (planned for Q3 2027)

### The fine print

- Billed annually. £49 per unit, with a £490 minimum (10 units).
  Volume discount at 100+ units: £39 / unit. 1,000+ units: £29 / unit.
- **GDPR Data Processing Agreement (DPA) is mandatory.** Signed
  before the first API call. The DPA covers: data residency
  (EU-only by default), sub-processor list, breach notification
  (72h), audit rights, deletion SLA (30 days).
- **Data residency is configurable.** Default: same-region as your
  organisation. UK institution → UK region. Caribbean institution
  → US-east region (closest to Caribbean, no EU transfer unless
  requested). EU institution → EU-west region.
- **No data brokerage.** Your portfolio data is never used to
  train models, never sold, never shared with third parties except
  as explicitly named in the DPA.

---

## What every tier gets (the universal floor)

These are not features you pay for — they are the project's
non-negotiables:

- **Pseudonymisation by default.** Every audit row is keyed by a
  `[PERSON_NAME-XXXX]` pseudonym, not a real name.
- **On-device default.** `USE_LOCAL_EDGE=1` is the project default
  (see G8 — local LLM by default). Cloud LLMs are opt-in per session.
- **Document-only, not legal advice.** Every dossier carries the
  disclaimer.
- **Conviction classes are public.** Every claim is tagged
  `established` / `heuristic` / `contested` / `unfalsifiable`.
- **HITL sign-off is mandatory for `contested` claims.** Nothing
  resident-facing is surfaced without a human in the loop.
- **Open-source.** The deterministic engines and the dossier
  builder are Apache-2.0. You can self-host if you want.

---

## Pricing rationale (the why)

| Choice | Rationale |
|---|---|
| **Free tier exists** | The data flywheel (more leases audited → better spine → better product) is real, and the unit cost is $0 (local LLM, deterministic engines). We can afford free. |
| **£10/mo for Pro** | Below the price of one hour with a junior solicitor. We are not competing with solicitors; we are the pre-solicitor triage tool. |
| **£49/unit/yr Institution** | Comparable to existing leasehold-management SaaS (e.g., Arthur, Groundbreaker). Cheaper because we don't have a sales team, just a CSM. |
| **No per-document charges** | The marginal cost of an audit is essentially zero (local LLM). Charging per document is the kind of dark pattern we explicitly reject. |
| **No "premium" upsell** | "Premium support" is the language of a vendor that wants to charge twice for the same thing. We don't. |

---

## What changes over time

We reserve the right to change prices with 30 days' notice to
existing subscribers. We will never raise prices for existing
subscribers within the first 12 months of their subscription.

If you joined at £10/mo and we later introduce a £15/mo tier with
new features, you stay at £10/mo for the life of your subscription.

---

## For institutions: how to start

1. **Email `institutions@freeleased.com`** with your portfolio size
   and use case.
2. **We sign a DPA** within 5 business days.
3. **You get an API key + dashboard access** within 24 hours of
   DPA execution.
4. **First month is free** for accounts ≥ £5,000 / yr.

We do not do cold calls. We do not do "discovery sessions" that
last 4 hours. We do not require procurement portal access. The
DPA is 4 pages; the contract is 2 pages; you can sign in DocuSign
or with a wet signature.

---

## What we will NEVER do (the negative list)

- ❌ Charge per document.
- ❌ Charge per "AI query" or "token".
- ❌ Sell your data to brokers, lenders, or insurers.
- ❌ Train models on your data.
- ❌ Auto-renew without explicit consent.
- ❌ Hide pricing behind a "Contact us" form.
- ❌ Make the free tier unusable to push upgrades.
- ❌ Add "premium support" tiers.

---

## Cross-references

- [`revenue-ledger-v1.md`](revenue-ledger-v1.md:1) — the current
  revenue ledger ($0; pre-seed in flight).
- [`revenue-model-gtm.md`](revenue-model-gtm.md:1) — the canonical
  TAM/SAM/SOM + tier rationale.
- [`real-pilot-onboarding.md`](../../pilot-audit/real-pilot-onboarding.md:1)
  — the pilot procedure (privacy guarantees hold across all tiers).
- [`consent-template.md`](../../pilot-audit/consent-template.md:1) —
  the consent form every tier inherits.

---

**Version:** 1.0 · **Date:** 2026-08-11 · **Owner:** Sam Peacock

This pricing page is public, durable, and reconciled by
`scripts/reconcile-docs.ts`. If you find a discrepancy between
this page and the codebase, file an issue — we will treat it as
a bug.