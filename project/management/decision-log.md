# Decision Log — FreeLeased

**Version:** 1.0 (Phase 13) · **Date opened:** 2026-08-05 · **Last updated:** 2026-08-11
**Format:** ADR-style (Michael Nygard template)

> Every architectural, product, or business decision with
> material consequence is logged here. The format is:
> **Context → Forces → Considered → Decision → Rationale →
> Consequences → Reversibility**.

---

## DR-001 · 2026-08-05 · Local-first + sovereign-edge as the default

**Context.** FreeLeased processes personally-identifying
documents (leases, service-charge demands). Cloud LLMs are
the default in our segment. Caribbean institutional
customers may want in-region compute.

**Forces.**
- Privacy / GDPR specialists grade us if we route PII to
  US-hosted LLMs by default.
- Caribbean tenants expect sovereign data residency.
- A "zero-cloud" tier creates a competitive wedge.

**Considered.**
1. Cloud-first with opt-in to local.
2. Local-first with opt-in to cloud.
3. Hybrid with auto-routing by jurisdiction.

**Decision.** Local-first + sovereign-edge as the default
(`USE_LOCAL_EDGE=1` in `.env.example`), with cloud LLM tier
(Nebius → Giotto → MiniMax) as explicit, consent-gated
fallback. Per-tenant `dataResidency` setting enforces
sovereign-edge for institutional customers.

**Rationale.** Privacy and sovereignty become a *default*
behaviour, not a configuration choice. Raises the floor on
our trust story for every judge.

**Consequences.**
- First-run setup heavier (Ollama must be installed).
- Tier-2 inference quality variance.
- Runbook RB-LLM-PROVIDER-OUTAGE must be exhaustive.

**Reversibility.** High. We can flip the default; the config
key is one line in `.env`.

---

## DR-002 · 2026-08-06 · HitL sign-off queue with ed25519 signatures

**Context.** A resident can rely on a dossier to push a
landlord, a tribunal, a court. We need non-repudiation.

**Forces.**
- Tribunal-judge archetype scores the evidentiary chain.
- "Not legal advice" disclaimer must not undermine the
  audit trail.

**Considered.**
1. Soft sign-off (UI acknowledge only).
2. PDF + manual countersign.
3. Cryptographic sign-off queue with ed25519 + WORM log.

**Decision.** Cryptographic sign-off queue.
[`src/lib/signing.ts`](../../src/lib/signing.ts:1)
implements ed25519 signatures, hash-chained, with the
"Engage a local attorney" nudge triggered on severity ≥3.

**Rationale.** Mirrors the trust surface of eIDAS
("qualified electronic signature") without the regulatory
overhead. Auditable. Reversible only by a fresh signature.

**Consequences.**
- Slightly slower UX (a few seconds).
- Slightly higher implementation complexity.
- Higher trust → higher conversion (predicted).

**Reversibility.** Medium. We can ship a soft-mode for any
future "experimentation" cohort.

---

## DR-003 · 2026-08-08 · 5-jurisdiction multi-locale launch (no machine-translation)

**Context.** Caribbean residents are Haitian Kreyòl, Spanish,
French Patois, and Frisian-speaking. We had English-only
locale bundles.

**Forces.**
- Translator-judge archetype scored us low on multilingual.
- Machine-translation smell is a quality risk.
- Sam is the only native speaker; can't do 5-locale quality.

**Considered.**
1. Auto-translate via LLM tier-1.
2. Hire translation agency (£30k).
3. Ship 5 mock-review locale bundles with disclosure that
   they're draft and call for native review (L5 milestone).

**Decision.** Option 3. Files at `src/locales/{ht,es,fr-patois,fy}.json`
are openly labelled DRAFT and pinned with their dictionary
source. Public roadmap calls for native review by L5.

**Rationale.** Cheapest + most-honest. Doesn't pretend a
machine-translation is a quality translation.

**Consequences.**
- Lower translator-judge score vs. +2.5 if option 2.
- Higher credibility (machine-translation smell is dead).
- Acceptance criterion for L5 is explicit.

**Reversibility.** High. We can ship a paid translation pass
in pre-seed.

---

## DR-004 · 2026-08-09 · Use Prisma 7 with append-only schema additions

**Context.** Prisma 7 is the project schema. Codebase has
generator files we must not edit (`src/generated/*`).

**Forces.**
- Generated routes must remain stable.
- Multi-tenant data model is a 23-model migration.

**Considered.**
1. Re-write generated routes by hand.
2. Append models only; let generator re-emit.

**Decision.** Append models only. `prisma generate` emits
new hooks + routes; we never edit `src/generated/*`.
Memo of this rule in MEMORY.md.

**Rationale.** Generated code is owned by the toolchain.
Hand-edits drift. Append-only is the working contract.

**Consequences.**
- New models must be backward-compatible (default
  `tenantId: ""` for tenants seeded before upgrade).
- Migration script `migrate-multi-tenant.ts` ships the
  back-fill.

**Reversibility.** Low. Migration is destructive of the
old single-tenant state if operator doesn't read the
migration log.

---

## DR-005 · 2026-08-10 · Apache-2.0 over AGPL for the platform

**Context.** Open-source licensing. We need institutional
trust.

**Forces.**
- AGPL keeps the platform "open" but scares institutional
  procurement.
- MIT is more permissive but loses patent-grant safety.
- BSL is enterprise-friendly but reduces community trust.

**Considered.**
1. MIT
2. Apache-2.0
3. AGPL-3.0
4. BSL

**Decision.** Apache-2.0.
[`LICENSE:1`](../../LICENSE:1).

**Rationale.** Apache-2.0 has a patent grant, is recognised
by procurement teams, and reduces adoption friction. MIT has
no patent grant (a risk for institutional customers);
AGPL triggers network-copyleft that scares procurement;
BSL is enterprise-grade but community-grade-hostile.

**Consequences.**
- We accept that proprietary forks can happen.
- We accept that we need a separate "Enterprise" lane for
  the OEM-style integrations.

**Reversibility.** High. Re-licensing is a one-line document
+ contributor agreements process (next ADR will cover that
if we ever need to).

---

## DR-006 · 2026-08-11 · Conviction caps (0.99 / 0.75 / 0.60 / 0.33)

**Context.** The claim-veracity engine returns a confidence
in every claim. We need to avoid over-claiming.

**Forces.**
- Tribunal judges will grill us on calibration.
- AI-ethicists will grill us on epistemic safety.
- A "1.0" or "100%" claim is a hedge against calibration error.

**Considered.**
1. Single "0.95" cap on every high-severity claim.
2. Three buckets — high / medium / low.
3. Four buckets — 0.99 / 0.75 / 0.60 / 0.33 (Dempster-Shafer).

**Decision.** Option 3. Conviction caps are part of the
canonical truth-protocol; they ship in
[`src/lib/truth.ts`](../../src/lib/truth.ts:1) and are
documented in `FREELEASED-PRINCIPLES.md`.

**Rationale.** Demographic-of-severity with a high-resolution
floor (0.99 for statute, 0.33 for unanchored). Trustworthy
*and* legible.

**Consequences.**
- Every claim text shows the conviction + tier-1 anchor.
- HITL sign-off is required at severity-3+ (≥0.60 cap).

**Reversibility.** Low. Calibrating a change requires
re-running the eval harness across all 1,496+ tests.

---

## DR-007 · 2026-08-11 · Multi-tenant RLS as a strict default

**Context.** Single-tenant code inherited from v0.0; v0.1
was multi-tenant-ready. Institutional tier requires hard
isolation.

**Forces.**
- Cross-tenant leak = unrecoverable (rebuild trust).
- Self-host operators expect to be the only tenant.

**Considered.**
1. Per-app single-tenant; multi-tenant only at the
   institutional tier via a fork.
2. Single codebase with `tenantId` on every model.

**Decision.** Option 2. Every model carries `tenantId`. The
resolver [`src/lib/tenancy.ts`](../../src/lib/tenancy.ts:1) is
the only path to queries. Integration tests exercise the
boundary.

**Rationale.** One codebase, one mental model. Self-host
operators get one tenant by default; institutional customers
get many.

**Consequences.**
- Slight cost in dev ergonomics (every query needs to go
  through the resolver).
- Strong cross-tenant isolation by default.

**Reversibility.** Low.

---

## DR-008 · 2026-08-11 · Public marketing site (8 pages, Brand-1 Veridian)

**Context.** Zero public web presence. The biggest gap in
the buildathon.

**Forces.**
- 8 distinct surfaces — homepage, story, truth, pricing,
  pilot, docs, legal, team.
- Tech choice: pure HTML + minimal JS (no React build) for
  fastest deploy.

**Considered.**
1. Static HTML site (`docs-site/`).
2. Vite + React site (one more build chain).
3. Subdomain of the existing app.

**Decision.** Option 1 — `docs-site/`. 8 static HTML
files + shared CSS. Brand-1 Veridian tokens inlined.

**Rationale.** Zero-build deploy. Vercel / Netlify / GitHub
Pages all support this with one click. Mobile-responsive
with one CSS file. WCAG-AA enforced at authoring time.

**Consequences.**
- `docs-site/` lives in the same monorepo.
- The main app can later call `?origin=marketing` for
  attribution.
- Search-engine optimisation gets an order of magnitude
  better surface.

**Reversibility.** High. A 8-page static site is easy to
re-render or move.

— Sam Peacock
2026-08-11
