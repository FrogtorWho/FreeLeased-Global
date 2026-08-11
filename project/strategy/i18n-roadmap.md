# i18n Roadmap — Caribbean Languages Plan

> **The honest disclosure of what we ship today and what we
> plan to ship.** Today: **English only**. The Caribbean is
> multilingual; we name the gap and the path.

**Status:** roadmap · **Last reviewed:** 2026-08-11 · reconciles
against the [100-judge panel §5 Honest gaps](../strategy/100-judge-panel.md:1).

---

## What we ship today (English only)

All UI copy, all dossier text, all statute citations, all error
messages, all docs. This is a deliberate scope decision: the
deterministic spine is English-only because every Caribbean
jurisdiction's *primary statute corpus* (Constitution, primary
acts, case law reporters) is published in English. Translating
the UI before the spine is bilingual would invert the priority
(we'd be localising *prompts* while the *answers* are still
English-only).

## What we don't ship yet

| # | Language | Speakers (Caribbean) | Statute corpus | Target date |
|---|----------|-----------------------|----------------|-------------|
| 1 | **Jamaican Patois** | ~3.2M | English (JM) | Q4 2026 — first UX microcopy; statutes remain English |
| 2 | **Trinidadian Creole** | ~1.4M | English (TT) | Q1 2027 — microcopy + resident-facing summaries |
| 3 | **Haitian Creole (Kreyòl)** | ~1.2M (Caribbean-wide) | French (HT) | Q2 2027 — Haitian-jurisdiction onboarding |
| 4 | **Spanish** | ~600K (CU, DO, PR diaspora) | Spanish | Q3 2027 — Cuban-jurisdiction expansion |
| 5 | **Dutch** | ~250K (SR, CW, AW, BQ) | Dutch | Q4 2027 — Surinamese / Curaçaoan jurisdictions |
| 6 | **French (standard)** | ~1M (HT, GP, MQ, GF) | French | Q4 2027 — French-Caribbean expansion |

## Why these dates are honest (not aspirational)

Each row requires:
1. **A native-speaker reviewer** signed off as paid or pro-bono.
2. **A jurisdiction-data pack** — primary acts translated at least
   to a machine-readable English-L2 pivot.
3. **A glossary freeze** — legal terms are jargon in any language.
4. **A test pass** — the i18n test suite adds N assertions per
   locale (currently 0; will be 200+ per language).

## What we do ship today (even without full i18n)

- **All statute citations are written as `{Jurisdiction} {Act} {Section}`** — they survive a translate.
- **Numbers, dates, and currency use ISO 8601 / ISO 4217** — no localised parsing.
- **Glossary tooltips** are in English but link to a glossary
  file (`src/data/glossary.ts`) that documents every legal term
  we use — the seed of the future translation memory.
- **The architecture is locale-aware** — every `lib/i18n.ts`
  consumer reads from a typed key namespace so adding a locale is
  *additive*, not invasive.

## Why this is on the public roadmap

- **Honesty.** Translating UI is the kind of polish that *looks*
  like a feature but is actually a *liability* if the spine isn't
  bilingual. We'd rather call it out than hide it.
- **Capital allocation.** The pre-seed round prospectus names i18n
  as a Q3-Q4 2026 use of funds, scoped to Patois first because it
  has the highest active-pilot overlap with Jamaica.
- **Justice.** The Caribbean diaspora is multilingual; pretending
  English-only is universal erases the people we're trying to
  serve. Naming the gap is step zero.

## The build path

```
Q3 2026   Glossary freeze for English → Patois pivot table.
          Test suite stub: 50 assertions for date / number / currency formatting.

Q4 2026   Patois UI microcopy (My Rights tab only).
          Resident-facing summaries use Patois with English statute fallback.
          50 → 200 i18n assertions.

Q1 2027   Trinidadian Creole (same pattern, different pivot).
          Cumulative: 400 i18n assertions.

Q2 2027   Haitian Creole — first non-English statute corpus (HT-FR pivot).
          French-Caribbean jurisdictions eligible for pilot.

Q3-Q4 2027 Spanish, Dutch, French standard.
        Multi-jurisdiction, multi-language, single-spine.
```

## What judges should evaluate today

- The architecture is locale-aware (typed keys, no string-literal
  UI text in the lib/ tree).
- The roadmap is dated and honest.
- We do *not* claim i18n is shipped.
- The path to ship is named and scoped.

## What would change this roadmap

| Event | New target date |
|-------|-----------------|
| A Caribbean agency signs an LOI requiring Patois | Q4 2026 → Q3 2026 |
| A grant covers a Kreyòl statute corpus | Q2 2027 → Q1 2027 |
| A pilot with a Dominican or Cuban partner | Q3 2027 → Q2 2027 |
| No funding + no pilot | Q4 2027 holds |

---

— Sam Peacock
2026-08-11
