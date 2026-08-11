# Spine v1 → v2 Migration Plan

> **Status:** active · **Version:** 1.0 · **Owner:** FreeLeased core
> **Date:** 2026-08-11

This is the step-by-step plan to migrate `src/data/spine.ts` (v1) to the
new `LegislativeFramework` schema (v2) defined in
[`src/data/legislative-framework-schema.ts`](../data/legislative-framework-schema.ts:1).
It is deliberately **non-destructive** — v1 is preserved while v2 lands in
parallel under [`src/data/spine-v2.ts`](../data/spine-v2.ts:1) as a read-only
bridge that re-exports a v1-compatible view.

> The workflow that produces each framework JSON is described in
> [`project/strategy/jurisdiction-onboarding-workflow.md`](../../project/strategy/jurisdiction-onboarding-workflow.md:1).

---

## 0. Why migrate

The v1 spine ([`src/data/spine.ts`](../data/spine.ts:1)) mixes three concerns:

- jurisdiction metadata (registry, statistical office, climate)
- flat lists of statutes (`STATUTES[]`)
- flat lists of data sources (`SOURCES[]`)
- hidden rights (re-exported from `patterns.ts`)

The v2 schema (`LegislativeFramework`) separates those concerns **per
jurisdiction**, captures the legal hierarchy (primary acts → regulations →
statutory instruments → reform amendments → leading cases → procedural rules
→ enforcement bodies → remedies), and enforces a **canonical 4-class
conviction set** (`established | heuristic | contested | unfalsifiable`).

The v2 schema is **strict** about:

- every URL parses
- every conviction is in the canonical set
- every contributor pseudonym is `[PERSON_NAME]`-safe
- every cross-link (`parentActId`, `amendsActId`, `relevantActs[]`,
  `legalBasis[]`) resolves to an `id` elsewhere in the framework

v1 records that fail any of these checks are **preserved in the v1 file**
with `unverified: true` (or, in the bridge layer, in a `legacy[]` array
exposed for back-compat).

---

## 1. Migration phases

### Phase 0 — Bridge (this PR)
- [x] Land [`src/data/spine-v2.ts`](../data/spine-v2.ts:1) — imports the
      framework JSONs for UK + BB and re-exports a v1-compatible view.
- [x] Land the framework JSONs (UK, BB).
- [x] Land the schema, workflow, scrape scaffold, and tests.

### Phase 1 — Co-existence
- [ ] Import `spine-v2.ts` in [`src/App.tsx`](../../src/App.tsx:1) via a
      feature flag (`USE_SPINE_V2`); verify parity.
- [ ] Confirm both spines return equivalent counts for UK/BB primary acts
      (target: every v1 UK/BB statute maps to a v2 record, possibly with
      `unverified: true`).
- [ ] Confirm `STATUTES[]` re-export from `spine-v2.ts` matches v1 by
      `id` and `shortTitle`.

### Phase 2 — Backfill other jurisdictions
- [ ] Add JM, KY, TT, BS, GY, BZ, VG framework JSONs (one PR each).
- [ ] Add Caribbean-LII scrape runs to fill leading-cases sections.

### Phase 3 — Cutover
- [ ] Update every consumer (`App.tsx`, [`src/lib/jurisdiction.ts`](../../src/lib/jurisdiction.ts:1),
      [`src/lib/maturity.ts`](../../src/lib/maturity.ts:1) if present,
      [`src/lib/knowledge-graph.ts`](../../src/lib/knowledge-graph.ts:1))
      to read from `spine-v2.ts`.
- [ ] Mark [`src/data/spine.ts`](../data/spine.ts:1) `legacy` and remove
      the `STATUTES[]` and `JURISDICTIONS[]` exports (keep them as
      deprecated re-exports for one minor version).
- [ ] Remove the feature flag.

---

## 2. Field-by-field mapping

| v1 (`spine.ts`) | v2 (`LegislativeFramework`) | Notes |
|---|---|---|
| `JURISDICTIONS[].code` | `LegislativeFramework.jurisdiction.code` | One framework per code. |
| `JURISDICTIONS[].name` | `LegislativeFramework.jurisdiction.name` |  |
| `JURISDICTIONS[].registry` | `LegislativeFramework.jurisdiction.officialGazette` | UK uses legislation.gov.uk; BB uses barbadoslawcourts.gov.bb. |
| `JURISDICTIONS[].inPilot` | (kept on `JURISDICTIONS[]` only) |  |
| `STATUTES[]` (entry) | `LegislativeFramework.primaryActs[]` | One record per statute. |
| `STATUTES[].id` | `primaryActs[].id` | Preserve where possible. |
| `STATUTES[].jurisdiction` | framework-scoped | No longer on the record. |
| `STATUTES[].shortTitle` | `primaryActs[].shortTitle` |  |
| `STATUTES[].citation` | `primaryActs[].chapterNumber` + `summary` |  |
| `STATUTES[].url` | `primaryActs[].sourceUrl` |  |
| `STATUTES[].covers` | `primaryActs[].summary` + `leaseholderRelevantSections[]` |  |
| `STATUTES[].conviction` | `primaryActs[].conviction` | Mapped to the canonical 4-class set (see §3). |
| `STATUTES[].note` | `primaryActs[].lastAmended` / `unverified` |  |
| (none in v1) | `regulations[]`, `statutoryInstruments[]`, `reformAmendments[]`, `leadingCases[]`, `proceduralRules[]`, `enforcementBodies[]`, `remedies[]` | All new in v2. |
| `SOURCES[]` (UK-legislation) | `LegislativeFramework.proceduralRules[]` + cross-links | Source-tier info is not in the framework — kept on a separate `SOURCES` map (out of scope of this PR). |
| `HIDDEN_RIGHTS[]` | `LegislativeFramework.remedies[]` (cross-link only) | Rights ↔ remedies cross-link lives in `patterns.ts`; framework exposes `legalBasis[]` to link back. |

---

## 3. Conviction-class mapping (v1 → v2 canonical set)

The v1 spine uses six conviction labels; the v2 schema uses the canonical
four. The mapping below is applied during the bridge layer:

| v1 | v2 | Rationale |
|---|---|---|
| `confirmed` 🔥 | `established` | Highest-confidence claim; sources corroborate. |
| `verified` ✅ | `established` | Already aligned to "established" by the truth protocol. |
| `primary` ⭐ | `established` | A primary source backs the claim. |
| `quantitative` 📊 | `heuristic` | Numeric but methodology-dependent. |
| `inference` 💭 | `heuristic` | Pattern-based; jurisdiction wording varies. |
| `pending` ⏳ | `contested` | Cannot yet be settled; capped at contested. |

Where a v1 record carries `note` describing a missing source, the bridge
sets `unverified: true` and caps conviction at `heuristic`.

> The canonical 4-class set is defined in
> [`src/data/legislative-framework-schema.ts`](../data/legislative-framework-schema.ts:38)
> (`CONVICTION_CLASSES`) and must match `src/lib/fairness.ts`.

---

## 4. What v1 records do we keep without migrating

Some v1 records are out of scope for v2's *legislative* focus. They stay
in `src/data/spine.ts` (v1) until a parallel schema lands:

- `SOURCES[]` — the registry / statistical-office / climate / hurricane
  source list. This will land in a `DataSourceFramework` (out of scope
  here).
- `JURISDICTIONS[].inPilot` / `pilotResidents` — pilot-programme metadata.
  Will land in a `PilotStatusFramework` (out of scope here).
- `HIDDEN_RIGHTS[]` — the exploitation-pattern axis. Lives in
  [`src/data/patterns.ts`](../data/patterns.ts:1); v2 cross-links via
  `remedies[].formTemplateId`.

---

## 5. Acceptance criteria (per framework)

A jurisdiction's framework JSON is publishable when:

1. `LegislativeFrameworkSchema.parse()` returns no issues.
2. Every `extractUrls()` URL round-trips through `new URL()`.
3. Every `findUnverified()` record's `conviction` is in
   `{heuristic, contested}` (never `established`).
4. Every `primaryActs[].id` referenced by `relevantActs[]`,
   `parentActId`, `amendsActId`, `amendingActId`, or `legalBasis[]`
   resolves to an `id` elsewhere in the same framework.
5. `frameworkCounts()` returns ≥3 primary acts for the jurisdiction.

These are enforced by [`scripts/test-legislative-schema.ts`](../../scripts/test-legislative-schema.ts:1).

---

## 6. Rollback

If v2 lands and breaks a consumer, the rollback is a single import swap:

```ts
// before
import { JURISDICTIONS, STATUTES } from "./data/spine-v2";
// after
import { JURISDICTIONS, STATUTES } from "./data/spine";
```

This is safe because `spine-v2.ts` is read-only and never mutates v1.

---

## 7. References

- Schema: [`src/data/legislative-framework-schema.ts`](../data/legislative-framework-schema.ts:1)
- Workflow: [`project/strategy/jurisdiction-onboarding-workflow.md`](../../project/strategy/jurisdiction-onboarding-workflow.md:1)
- v1 spine: [`src/data/spine.ts`](../data/spine.ts:1)
- v2 bridge: [`src/data/spine-v2.ts`](../data/spine-v2.ts:1)
- Frameworks: [`src/data/frameworks/uk-framework.json`](../data/frameworks/uk-framework.json:1), [`src/data/frameworks/bb-framework.json`](../data/frameworks/bb-framework.json:1)
- Tests: [`scripts/test-legislative-schema.ts`](../../scripts/test-legislative-schema.ts:1)
- Scrape scaffold: [`scripts/scrape-jurisdiction.ts`](../../scripts/scrape-jurisdiction.ts:1)

---

*Last updated: 2026-08-11 — initial migration plan written alongside v2 schema and workflow.*
