# Public Changelog — FreeLeased

**Audience:** the public, judges, customers, contributors.
**Source:** derived from [`CHANGELOG.md`](../CHANGELOG.md)
(filtered for what the outside world cares about).

> Each entry is grouped by release and tagged with
> **Added**, **Changed**, **Fixed**, **Removed**, **Honest**.
> The internal CHANGELOG.md has more detail for engineers.

---

## v0.4 — Pre-seed (2026-08-11)

**Added**
- Public marketing site (`docs-site/`) — 8 pages, Brand-1
  Veridian, mobile-responsive, WCAG-AA
- [`docs/PRIVACY.md`](PRIVACY.md:1) — UK GDPR-aligned privacy
  policy with sovereign-edge commitments
- [`docs/TERMS.md`](TERMS.md:1) — Terms of Use with
  responsible "not legal advice" framing
- [`docs/COOKIES.md`](COOKIES.md:1) — Cookie policy (zero
  cookies by design)
- [`docs/SECURITY.md`](SECURITY.md:1) — security disclosure
  policy + bounty programme
- [`docs/THREAT-MODEL.md`](THREAT-MODEL.md:1) — STRIDE
  threat model
- [`docs/RUNBOOK.md`](RUNBOOK.md:1) — operational runbook
- [`docs/SLA.md`](SLA.md:1) — published SLOs and SLAs
- Five Caribbean jurisdictions deep-dive: Cayman, Jamaica,
  Barbados, Trinidad & Tobago, BVI

**Changed**
- Pricing page now public at `/pricing`
- README links to the docs-site for non-engineer readers
- Founder bio published at `/team`

**Fixed**
- PII redaction in the OTLP boundary (I3 in
  [`THREAT-MODEL.md`](THREAT-MODEL.md#4-information-disclosure-i))

**Removed**
- Adversary / ThreatLab data (was retired for CfC Code of
  Conduct compliance; see [`MEMORY.md:54`](../MEMORY.md:54))

**Honest gaps**
- ❌ Live demo URL is currently a private Shogo AI tunnel;
  public deploy is the next milestone
- ❌ Star / fork / watcher counts are not on a public repo yet
- ❌ First paying user does not exist yet (we say so)
- ❌ Demo video not yet recorded (script lives at
  `project/demo/demo-video-script.md`)

---

## v0.3 — i18n + pilot readiness (2026-08-11, Phase 12)

**Added**
- 5 locale bundles: English, Haitian Kreyòl, Spanish,
  French Patois, Frisian — `src/locales/`
- [`src/lib/i18n.ts`](../src/lib/i18n.ts:1) — locale registry
- [`src/lib/pseudonym.ts`](../src/lib/pseudonym.ts:1) — PII
  redaction generator (used in pilot data)
- [`project/pilot-audit/real-pilot-onboarding.md`](../project/pilot-audit/real-pilot-onboarding.md:1)
  — real leaseholder-onboarding procedure
- [`project/pilot-audit/consent-template.md`](../project/pilot-audit/consent-template.md:1)
  — informed-consent template

**Changed**
- All Frontiers UI strings externalised — no hard-coded copy
  in the React tree

**Honest gaps**
- All locale bundles are machine + human-mock reviewed; a
  native Patois / Kweyol speaker review is on the L5 milestone

---

## v0.2 — multi-tenant + climate (2026-08-11, Phase 12)

**Added**
- 23-model schema with `tenantId` on every model —
  [`prisma/schema.prisma`](../prisma/schema.prisma:1)
- Tenant resolver in [`src/lib/tenancy.ts`](../src/lib/tenancy.ts:1)
- Multi-tenant integration tests (`test-multi-tenant.ts`,
  33 assertions)
- Climate JSON for 6 coastal jurisdictions +
  [`src/lib/climate-overlay.ts`](../src/lib/climate-overlay.ts:1)
- Building-safety / EWS1 schema extension with 3 leading
  UK cases

**Changed**
- All Prisma queries go through the tenant resolver, even in
  single-tenant dev mode (catches misuse early)

---

## v0.1 — core engine (2026-08-06, Phase 1-11)

**Added**
- Truth reconciliation engine ([`src/lib/reconciliation.ts`](../src/lib/reconciliation.ts:1))
- Knowledge graph ([`src/lib/knowledge-graph.ts`](../src/lib/knowledge-graph.ts:1))
- Multi-source federation ([`src/lib/federation.ts`](../src/lib/federation.ts:1))
- Citation engine ([`src/lib/citation.ts`](../src/lib/citation.ts:1))
- VLM pipeline ([`src/lib/vlm-pipeline.ts`](../src/lib/vlm-pipeline.ts:1))
- Veracity engine ([`src/lib/veracity.ts`](../src/lib/veracity.ts:1))
- 8 generated routes, 23 model types
- 1,496+ test assertions across 24 test files

**Honest gaps**
- Cloud-LLM fallback was off by default in v0.1; switched on
  in v0.3 with `USE_LOCAL_EDGE=1` default

---

## How this changelog relates to internal `CHANGELOG.md`

- **Public (this file):** user-visible changes, honesty
  disclosures, public commitments.
- **Internal ([`CHANGELOG.md`](../CHANGELOG.md)):** every
  commit hash, every test-delta, every refactor.

Reviewers: when the public and internal drift, **the public
wins.** Fix the internal, not the public.

— Sam Peacock, Founder, FreeLeased
2026-08-11
