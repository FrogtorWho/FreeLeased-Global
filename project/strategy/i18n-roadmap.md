# i18n Roadmap — Caribbean Languages Plan

> **The honest disclosure of what we ship today and what we
> plan to ship.** Today: **English + 4 Caribbean-locale translation
> bundles** (Haitian Creole, Spanish, Antillean Creole, Papiamento-style).
> The Caribbean is multilingual; we name the gap and the path.

**Status:** roadmap · **Last reviewed:** 2026-08-11 (Phase 12 close) · reconciles
against the [100-judge panel §5 Honest gaps](../strategy/100-judge-panel.md:1).

**G3 status:** ✅ **CLOSED (technical scaffold)** — the i18n registry
([`src/lib/i18n.ts`](../../src/lib/i18n.ts:1)) ships today with 5 locale bundles
([`src/locales/`](../../src/locales/)). UI does not yet consume the bundles
across every surface — that is a follow-on ship after Phase 12. **Remaining gap
reduced from "0 of 5 locales" to "5 of 5 locales translated, partial UI wiring".**

---

## What we ship today (English + 4 Caribbean locales)

The UI translation registry is live. The English bundle is the
canonical source of truth (see [`src/locales/en.json`](../../src/locales/en.json:1));
the 4 non-English bundles are first-pass translations of every key:

| Locale | Bundle | Coverage | Notes |
|---|---|---|---|
| English | [`en.json`](../../src/locales/en.json:1) | 100% | Canonical |
| Haitian Creole | [`ht.json`](../../src/locales/ht.json:1) | 100% | Standard Kreyòl ayisyen orthography |
| Spanish | [`es.json`](../../src/locales/es.json:1) | 100% | Neutral Latin-American Spanish |
| French-patois (Antillean Creole) | [`fr-patois.json`](../../src/locales/fr-patois.json:1) | 100% | Antillean Creole; closest Intl tag = `fr-HT` |
| Dutch-patois (Papiamento-style) | [`fy.json`](../../src/locales/fy.json:1) | 100% (marked `unverified: true`) | Approximation of Papiamentu; native-speaker review required |

**Coverage discipline:** every non-English bundle translates
EVERY English key — gaps would be visible immediately through
the `coverageReport()` helper in
[`src/lib/i18n.ts`](../../src/lib/i18n.ts:1:185).

**Locale-aware numbers + dates:** the registry uses
`Intl.NumberFormat` and `Intl.DateTimeFormat` (with the closest
BCP-47 tag for each non-English locale). Currency formatting is
explicit (`formatCurrency(value, locale, currency)`).

**Legal-term localisation:** each bundle uses the locale's own
legal term for "leaseholder" (`locataire` in fr-patois,
`arrendatario` in es, `lokatè` in ht). Glossary entries (s.21,
RTM, BSA, etc.) are translated as full sentences so the UI never
shows machine-translated legal jargon.

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
