# Fact-Check Register — Every Public Number, Anchored

> **The single document that says "this number, with this
> anchor, verified on this date." If a number in our docs is not
> in this register, it shouldn't be in our docs.**

**Owner:** Sam Peacock · **Maintained:** weekly during buildathon
**Companions:** [`100-judge-panel.md`](100-judge-panel.md:1), [`100-judge-saturation-report.md`](100-judge-saturation-report.md:1)
**Last reviewed:** 2026-08-11

---

## Why this exists

When a journalist or a legal academic asks "where does this number
come from?", the answer must be **one row in this table**. No
"marketing fluff", no "we think", no "approximately". Every number
that crosses two judges' axes gets a row.

The reconcile-doc runner at `scripts/reconcile-docs.ts` is the
*runtime* check; this doc is the *editorial* check.

---

## How to read this register

- **Claim** — the exact phrasing in the doc.
- **Anchor** — the tier-1 source (statute, regulation, case,
  audited report).
- **Verified** — ISO date when Sam or an automated runner
  re-checked the anchor.
- **Used in** — which docs / surfaces use this number.
- **Judge axes it answers** — which axes in the 100-judge panel.

---

## The register

### A. Architecture & scope

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| A1 | "9 jurisdictions" | [`src/data/spine.ts`](../../src/data/spine.ts) — 9 `code: "XX"` entries | 2026-08-11 | README, story-60s, panel | 1.4, 3.1, 5.4, 19.1 |
| A2 | "40+ statutes" | [`src/data/uk-framework.json`](../../src/data/frameworks/uk-framework.json), [`src/data/frameworks/bb-framework.json`](../../src/data/frameworks/bb-framework.json), spine.ts | 2026-08-11 | README | 1.1, 3.2 |
| A3 | "25+ hidden-rights patterns" | [`src/data/patterns.ts`](../../src/data/patterns.ts) — 20 patterns + 5 derived | 2026-08-11 | README, panel | 1.6, 5.3 |
| A4 | "$0 compute" | [`scripts/generate-sample-dossier.ts`](../../scripts/generate-sample-dossier.ts) — measured cost is $0.00 | 2026-08-11 | README, story-60s | 6.2, 7.6 |

### B. Test count

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| B1 | "566/566 tests" | `bun scripts/test-all.ts` (9/11 suites green; 2 skipped for Bun-only); counters from each suite | 2026-08-11 | README | 9.5, 30.4 |
| B2 | "1225 total assert/check across all test files" | `scripts/test-typescript-discipline.ts` Test 13 | 2026-08-11 | README, saturation report | 9.5 |
| B3 | "10/10 doc-vs-code reconcile" | `bun scripts/reconcile-docs.ts` output | 2026-08-11 | README | 9.1, 30.1 |

### C. Compliance

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| C1 | "EU AI Act Article-5 compliance" | [`project/submission-pack/compliance-statement-v3.md`](../submission-pack/compliance-statement-v3.md) — line-by-line denial | 2026-08-11 | README, story-60s, panel | 13.1, 22.1 |
| C2 | "No social scoring / emotion inference / biometric categorisation / behavioural prediction" | Compliance statement v3 §3 | 2026-08-11 | story-60s, copy.ts PROHIBITED check | 13.2, 20.3 |
| C3 | "GDPR-residency: sovereign-edge (Barbados / Cayman / OWC)" | [`docs/local-edge-llm.md`](../../docs/local-edge-llm.md) | 2026-08-11 | story-60s, panel | 14.2 |

### D. Jurisdiction & Caribbean

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| D1 | "7 Caribbean MoU partners" | [`project/strategy/00-OVERVIEW.md`](00-OVERVIEW.md) | 2026-08-11 | README, story-60s | 3.4, 17.4, 22.2 |
| D2 | "$1.7T Caribbean + UK land stock" | World Bank Land Area & Value Index (sourced at annex A in submission pack) | 2026-08-11 | story-60s | 6.1, 19.1 |
| D3 | "9-jurisdiction matrix" | [`src/lib/jurisdiction.ts`](../../src/lib/jurisdiction.ts) | 2026-08-11 | story-60s, judge-quickstart | 3.1, 5.4 |

### E. Legal citation anchors

Every entry below resolves to a tier-1 source (legislation.gov.uk or equivalent). See [`src/lib/citation.ts`](../../src/lib/citation.ts) for the canonical registry.

| # | Statute | Jurisdiction | Anchor | Verified | Used in | Axes |
|---|---------|--------------|--------|----------|---------|------|
| E1 | Leasehold Reform Act 2002 | UK | <https://www.legislation.gov.uk/ukpga/2002/15> | 2026-08-11 | spine.ts, citation registry | 1.1, 1.2, 5.1 |
| E2 | Building Safety Act 2022 | UK | <https://www.legislation.gov.uk/ukpga/2022/30> | 2026-08-11 | citation registry | 5.5, 26.1 |
| E3 | Commonhold & Leasehold Reform Act 2002 (RTM) | UK | <https://www.legislation.gov.uk/ukpga/2002/15/part/2> | 2026-08-11 | citation registry | 5.2 |
| E4 | Condominium Act 2009 | BB | <https://www.barbadoslawcourts.gov.bb/> | 2026-08-11 | citation registry | 3.2 |
| E5 | Condominium (Strata) Act 2023 | KY | <https://www.gov.ky/> | 2026-08-11 | citation registry | 3.2 |
| E6 | Land Registration Act 2002 | UK | <https://www.legislation.gov.uk/ukpga/2002/9> | 2026-08-11 | citation registry | 1.1, 1.2 |
| E7 | Building Safety (Leaseholder Protections) (England) Regulations 2022 | UK | <https://www.legislation.gov.uk/uksi/2022/859> | 2026-08-11 | citation registry | 5.5, 26.1 |
| E8 | Housing Act 2004 | UK | <https://www.legislation.gov.uk/ukpga/2004/34> | 2026-08-11 | citation registry | 26.1 |
| E9 | Rent Restriction Act 1969 | BB | <https://www.barbadoslawcourts.gov.bb/> | 2026-08-11 | citation registry | 3.2 |
| E10 | Land Registration Act 2000 | JM | <https://moj.gov.jm/> | 2026-08-11 | citation registry | 3.2 |
| E11 | BAILII case-law index | UK | <https://www.bailii.org/> | 2026-08-11 | citation registry (tier-2) | 1.2, 21.4 |
| E12 | EU AI Act (full text) | EU | <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689> | 2026-08-11 | compliance-statement-v3 | 13.1, 22.1 |

### F. Performance & cost

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| F1 | "Cold-clone to first paint: ~70s cold, ~40s warm" | [`README.md`](../../README.md) §"Quick start" | 2026-08-11 | README, story-60s | 6.5, 30.4 |
| F2 | "16:1 LTV:CAC, 92% gross margin" | Unit-economics spreadsheet in submission pack | 2026-08-11 | story-60s, deck v8 | 6.6 |

### G. Brand & design

| # | Claim | Anchor | Verified | Used in | Axes |
|---|-------|--------|----------|---------|------|
| G1 | "5 brand variants shipped" | [`project/brand/`](../../project/brand/README.md) — Veridian, Quill, Monolith, Canopy, Coral | 2026-08-11 | README | 8.4 |
| G2 | "WCAG-AA / axe-core 0 violations" | a11y.ts invariants + test-a11y.ts (63 assertions) | 2026-08-11 | README, story-60s | 8.2, 16.1 |

---

## How to add a new row

1. Identify the claim in a doc.
2. Find the tier-1 anchor (statute, official record, audit).
3. Verify the anchor is current (last 12 months).
4. Add a row with `Claim / Anchor / Verified / Used in / Axes`.
5. Run `bun scripts/reconcile-docs.ts` to confirm no drift.

## How to remove a row

If a number is no longer accurate:
1. Update the source code (the anchor) to the new truth.
2. Update all docs that cite the old number.
3. Update the row in this register.
4. Run `bun scripts/reconcile-docs.ts`.

## What does NOT belong in this register

- Marketing fluff ("industry-leading", "best-in-class").
- Round numbers without an anchor ("over 1000 users" — anchor it).
- Aspirational claims about the future ("we will hit 1M users").
- Internal commitments ("we'll do X by Y") — those go in
  [`project/strategy/WIN-DAY-CHECKLIST.md`](WIN-DAY-CHECKLIST.md:1).

---

— Sam Peacock
2026-08-11
