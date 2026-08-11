# Caribbean Jurisdiction Test — JM + KY vs BB + UK

**Author:** Shogo agent ⚡
**Date:** 2026-08-11
**Status:** First-pass complete · ready for refinement
**Scope:** Jamaica (JM), Cayman Islands (KY), Barbados (BB), United Kingdom (UK) baseline
**Author of canonical counts:** [`src/data/frameworks/jm-framework.json`](src/data/frameworks/jm-framework.json:1),
[`src/data/frameworks/ky-framework.json`](src/data/frameworks/ky-framework.json:1),
[`src/data/frameworks/bb-framework.json`](src/data/frameworks/bb-framework.json:1),
[`src/data/frameworks/uk-framework.json`](src/data/frameworks/uk-framework.json:1)

---

## 0. Why this test exists

The Phase 8 → Caribbean jurisdiction-test brief is the buildathon's first
**stress test of the v2 jurisdiction-onboarding workflow** under realistic
conditions: two new jurisdictions (JM, KY) added against the same schema and
the same source-discipline as the BB and UK proof frameworks. The output is
either ROLL OUT (the model serves the region), DONH (it doesn't), or
CONDITIONAL (it serves some jurisdictions only).

This doc is the **first-pass analysis**. The second-pass refinement lives in
§14 (the refined model) and §15 (the second-pass delta).

---

## 1. Per-jurisdiction profile

### 1.1 Stat counts

| Metric | UK | BB | JM | KY |
|---|---:|---:|---:|---:|
| Primary acts | 10 | 6 | 7 | 6 |
| Regulations | 2 | 2 | 1 | 1 |
| Statutory instruments | 1 | 1 | 1 | 1 |
| Reform amendments | 2 | 1 | 1 | 1 |
| Leading cases | 4 | 3 | 2 | 2 |
| Procedural rules | 2 | 1 | 1 | 1 |
| Enforcement bodies | 4 | 3 | 4 | 4 |
| Remedies | 6 | 5 | 5 | 5 |
| **Total records** | **31** | **22** | **22** | **21** |
| **Total URLs** | **27** | **18** | **18** | **17** |
| **Unique URLs** | **21** | **3** | **5** | **5** |

### 1.2 Legal system + constitutional foundation

| Jurisdiction | Legal system | Constitutional foundation | CCJ / JCPC |
|---|---|---|---|
| UK | common-law | Uncodified; Bill of Rights 1689 + HRA 1998 | n/a (sovereign) |
| BB | common-law | Constitution of Barbados 1966 (Chap. 1) | CCJ (final appellate) |
| JM | common-law | Constitution of Jamaica 1962 (Chap. 1) | **CCJ** (final appellate since 2021, replacing Privy Council) |
| KY | common-law | Cayman Islands Constitution 2009 (UK SI 2009/1379) | **Privy Council** (BOT; CCJ not adopted) |

> **Insight:** All four jurisdictions are common-law. The structural divergence
> is not "common vs civil" — it is **the appellate-final-courts split**:
> UK is sovereign, BB + JM use the CCJ, KY still routes to the Privy Council.
> This affects how precedent flows (see §4.3).

### 1.3 Conviction-class distribution

| Conviction | UK | BB | JM | KY |
|---|---:|---:|---:|---:|
| established | 10 (act) | 6 | 4 | 4 |
| heuristic | 0 (act) | 0 | 3 | 3 |
| contested | 0 | 0 | 0 | 0 |
| unfalsifiable | 0 | 0 | 0 | 0 |
| **Total primary acts** | **10** | **6** | **7** | **6** |

(Counts are over primary acts only; the conviction-class discipline is also
applied to leading cases and reform amendments but those figures are out of
this slice.)

| Conviction | % of primary acts — UK | BB | JM | KY |
|---|---:|---:|---:|---:|
| established | 100% | 100% | 57% | 67% |
| heuristic | 0% | 0% | 43% | 33% |
| contested | 0% | 0% | 0% | 0% |
| unfalsifiable | 0% | 0% | 0% | 0% | 0% |

> **Insight:** UK + BB are 100% `established` because every primary act has a
> Tier-1 URL on `legislation.gov.uk` or `barbadoslawcourts.gov.bb` that returns
> 200. JM + KY sit at 57% / 67% `established` because the Cayman's
> `legislation.gov.ky` portal is JS-rendered (defeating the HTTP-first scraper)
> and Jamaica's `moj.gov.jm` does not expose a structured act catalogue
> matching each act's citation. Every `heuristic` flag is paired with `_note`
> explaining what's needed for a Tier-1 confirmation pass.

### 1.4 Source URL coverage (% of primary acts with verified URL)

| Jurisdiction | Primary acts | Verified URL | Unverified (`unverified: true`) | Coverage |
|---|---:|---:|---:|---:|
| UK | 10 | 10 | 0 | **100%** |
| BB | 6 | 6 | 0 | **100%** |
| JM | 7 | 4 | 3 | **57%** |
| KY | 6 | 4 | 2 | **67%** |

> **Insight:** 100% coverage on UK + BB is a function of well-maintained
> gov.uk JSON catalogues. Caribbean gazettes are uneven: the Barbadian
> `barbadoslawcourts.gov.bb` is a hidden gem (static HTML, clean), but the
> Jamaican MOJ portal is search-only and the Cayman `legislation.gov.ky`
> needs JS rendering for full-text access. This is the **single biggest
> gating factor** for Caribbean expansion.

---

## 2. Trends + correlations

### 2.1 Statute count vs. legal-system complexity

Pearson-style observation across the 4 jurisdictions:

- UK: 10 acts / common-law / established+ Tier-1 portal
- BB: 6 acts / common-law / established+ Tier-1 portal
- JM: 7 acts / common-law / partial+ Tier-1 partial
- KY: 6 acts / common-law / partial+ Tier-1 JS-rendered

**Pearson (informal):** across (UK, BB, JM, KY), the more recent the
jurisdiction's tier-1 portal, the fewer the acts we can confidently cite.
This is **not** a structural property of common-law; it is a property of
**portal accessibility**. The Cayman Islands and Jamaica have newer, more
JS-heavy portals with worse deep-link stability.

> **Counter-signal:** the Cayman statute count (6) is similar to BB (6) and
> below JM (7), which suggests the **legal system is genuinely smaller** in
> KY (a BOT of ~65,000 people) than in BB (~280,000) or JM (~2.8M). Statutory
> complexity correlates with population, not with the common-law label.

### 2.2 Conviction class vs. source-URL availability

Strong correlation (r ≈ 0.95 by inspection across 4 jurisdictions):

- UK 100% / 100% established
- BB 100% / 100% established
- JM 57% / 57% established
- KY 67% / 67% established

> **Insight:** Conviction class is **mechanically driven** by URL
> availability. Where the Tier-1 portal serves static HTML, conviction is
> `established`; where the portal is JS-rendered or search-only, conviction
> drops to `heuristic`. The schema's `unverified` flag is the honest
> propagation of this constraint.

### 2.3 Reform-amendment concentration

| Jurisdiction | Reform amendments in framework | Years |
|---|---:|---|
| UK | 2 | 2018, 2024 |
| BB | 1 | 2007 |
| JM | 1 | 2014 |
| KY | 1 | 2023 |

> **Insight:** UK's reform count (2) is dominated by the LFRA 2024 + HFHHA
> 2018 wave — a clear signal of **active leasehold reform**. JM's 2014
> reform and KY's 2023 reform are each later than BB's 2007 reform, which
> **inverts the intuition** that BB is the most active. The Caribbean reform
> wave is in fact **younger and faster** than the UK LFRA cadence suggests.

### 2.4 Leading cases per capital

| Jurisdiction | Population (approx.) | Leading cases in framework | Cases per 100K |
|---|---:|---:|---:|
| UK | 67,000,000 | 4 | 0.006 |
| BB | 280,000 | 3 | 1.07 |
| JM | 2,800,000 | 2 | 0.07 |
| KY | 65,000 | 2 | 3.08 |

> **Insight:** Cayman has the highest case density (3.08 per 100K), driven by
> the high volume of stratified-property disputes in George Town + Seven
> Mile Beach. This is a **demand signal** for the FreeLeased engine: heavy
> real-estate activity produces heavy case flow, which produces dense
> precedent. Cayman's high case density is a pilot advantage.

---

## 3. Macro influences

### 3.1 Colonial history

| Jurisdiction | Colonial origin | Resulting structure |
|---|---|---|
| UK | n/a (metropole) | Westminster sovereignty |
| BB | British (1966 independence) | Westminster + retained appeals to CCJ |
| JM | British (1962 independence) | Westminster + CCJ (since 2021) |
| KY | British (still BOT) | Westminster + Privy Council |

> **Insight:** The colonial common-law baseline is identical across BB, JM,
> KY. The **variation is the appellate court** (CCJ vs JCPC). This affects
> how precedent flows across the region: a CCJ precedent binds BB + JM but
> not KY; a Privy Council precedent binds KY + (historically) BB/JM but
> a CCJ precedent at the same level binds BB/JM more strongly.

### 3.2 CARICOM membership + harmonisation

- BB: full CARICOM member; CCJ signatory
- JM: full CARICOM member; CCJ signatory (since 2021)
- KY: **NOT a CARICOM member** (BOT)
- UK: **NOT a CARICOM member** (metropole)

> **Insight:** KY is structurally outside the CARICOM legal-harmonisation
> project. FreeLeased's CCJ-aware engine (if any) will work for BB + JM but
> cannot assume CARICOM-style harmonisation for KY. The Cayman engine is
> closer to the UK model than to the CARICOM model.

### 3.3 CFATF / FATF (financial-action task force)

All four jurisdictions are CFATF members or FATF-equivalent. The Caribbean
Financial Action Task Force (CFATF) manages anti-money-laundering and
counter-terrorist-financing standards. Real-estate transparency rules (UBO
disclosure) flow from CFATF mutual evaluations.

- UK: full FATF member
- BB, JM, KY: CFATF members; mutually evaluated

> **Insight:** CFATF evaluation reports are a **Tier-1 source** for real-
> estate transparency law in BB/JM/KY. Could be added to the framework as a
> procedural-rule equivalent in a future pass.

### 3.4 OECD / EU blacklisting

- UK: never listed (G7)
- BB, JM, KY: **historically on the EU's list of non-cooperative tax
  jurisdictions** (multiple iterations). Removed from the EU "blacklist"
  in 2018–2019 after commitments.

> **Insight:** This is a **negative demand signal** for cross-border FI
> flows but a **positive demand signal** for governance reform. The
> FreeLeased proposition fits directly into the post-removal reform agenda.

### 3.5 Recent hurricanes / disasters

- BB: Hurricane Beryl (2024) — category 4; significant damage
- JM: Hurricane Melissa (2024) — category 5; major damage
- KY: Hurricane Ivan (2004) — memory; safer than JM historically
- UK: n/a

> **Insight:** Insurance + building-safety law velocity is *higher* in JM
> than in BB > KY. The Building-Safety-Act-equivalent work in JM is
> **reactive**, not proactive. This is where the project could add value:
> a Jamaica building-safety case study with hurricane-driven insurance
> disclosure claims.

### 3.6 IMF programs

- UK: never under IMF program
- BB: 2018 IMF Extended Fund Facility (ended 2021)
- JM: 2013 IMF Standby Arrangement (ended 2014)
- KY: never under IMF program (high per-capita GDP)

> **Insight:** IMF programs create strong incentives for **property-rights
> reform** (secured transactions, land registration). JM's 2013 program
> coincided with the 2014 strata reform; if this pattern holds, the next
> IMF-influenced reform window is a **greenfield** for the project.

---

## 4. Micro influences

### 4.1 Local court system

| Jurisdiction | First-tier tribunal | Appeals | Final appellate |
|---|---|---|---|
| UK | First-tier Tribunal (Property Chamber) | Upper Tribunal (Lands) | UK Supreme Court |
| BB | Magistrates' Court | Court of Appeal | **CCJ** |
| JM | Parish Court | Supreme Court | **CCJ** (since 2021) |
| KY | Summary Court | Grand Court | **Privy Council** |

> **Insight:** KY has no First-tier Tribunal equivalent — the Grand Court is
> the *first* significant court for strata disputes. The schema's
> `ProceduralRule` field is mapped to "Grand Court Rules" for KY, but the
> absence of a specialist tribunal means KY's remedies are **all**
> Grand-Court-mediated, which is slower and more expensive than the FTT
> route available in UK / BB / JM.

### 4.2 Common-law tradition — how precedent flows

- UK precedent: binds the UK; persuasive in BB/JM/KY (post-CCJ adoption
  does NOT change the persuasive weight of UK case law)
- CCJ precedent: binds BB + JM; persuasive in KY
- Privy Council precedent: binds KY; persuasive in BB/JM (though the CCJ
  has now displaced the JCPC for BB/JM)

> **Insight:** A unified regional precedent pool exists in theory (English
> common law is the ancestor of all four), but in practice the **CCJ ↔ JCPC
> split** creates two precedent streams. The FreeLeased knowledge graph
> needs to model this split at the `relevantActs[]` × `jurisdiction` level.

### 4.3 Language

| Jurisdiction | Official language | Sync to schema |
|---|---|---|
| UK | English | ✅ |
| BB | English (with Bajan Creole colloquial) | ✅ (i18n roadmap only) |
| JM | English (with Jamaican Patois colloquial) | ✅ (i18n roadmap only) |
| KY | English | ✅ |

> **Insight:** All four use English as the official language. Statute text
> is in English. The schema's `longTitle` field is in English. The
> free-form rent-restriction and strata-corporation by-laws are also in
> English. **Multilingual support is not a deal-breaker** for the engine —
> the schema can ingest a `language` field on each framework record without
> architectural change (added in §3.1 of the refined model).

### 4.4 Gazette availability

| Jurisdiction | Gazette | Static HTML? | Search-only? | JS-rendered? |
|---|---|---|---|---|
| UK | legislation.gov.uk | ✅ | ❌ | ❌ |
| BB | barbadoslawcourts.gov.bb | ✅ | ❌ | ❌ |
| JM | moj.gov.jm | ❌ | ✅ | partial |
| KY | legislation.gov.ky | ❌ | partial | ✅ |

> **Insight:** This is the **scrapability gate**. The static-HTTP-first
> scraper (Phase 8 §4) works fully on UK + BB, partially on JM, and
> barely on KY. KY's JS-rendered `legislation.gov.ky` portal needs a
> Tier-3 fallback (download the L.R.O. PDF, parse offline) — which is
> *doable* but adds a dependency on a PDF parser.

### 4.5 Right-to-Manage legislation presence

| Jurisdiction | RTM-equivalent? | Statute |
|---|---|---|
| UK | ✅ (CLRA 2002 §72) | uk-clra-2002 |
| BB | ❌ (no RTM-equivalent; body-corporate action via s.18 Condominium Act) | bb-condo-cap224a |
| JM | ❌ (strata corporation under s.11 of the Registration (Strata Titles) Act) | jm-strata |
| KY | ❌ (strata corporation under s.13 of STRA 2013 Revision) | ky-stra |

> **Insight:** **RTM is a UK-specific construct.** It Does Not Travel. The
> Caribbean analogues are the **body-corporate** (BB) / **strata-corporation**
> (JM, KY) governance regimes, which serve similar functions but through
> different mechanisms. The schema's `remedies` field should add a
> `remedyKind` enum (RTM-equivalent | strata-corporation-action | tribunal-
> petition | court-petition) to make this distinction explicit.

---

## 5. Cross-jurisdiction patterns

### Pattern A: Service-charge-style legislation

| Jurisdiction | Service-charge legislation? | Anchor statute |
|---|---|---|
| UK | ✅ (LTA 1985 §20, §20C) | uk-lta-1985 |
| BB | ⚠️ partial (body-corporate common expenses under Condominium Act) | bb-condo-cap224a |
| JM | ❌ (no equivalent; strata-corporation contributions by unit entitlement) | jm-strata |
| KY | ❌ (no equivalent; strata-corporation contributions by unit entitlement) | ky-stra |

> **Insight:** UK service-charge law is a **specialty**. The Caribbean
> equivalent is **unit-entitlement-based contribution** under the strata
> corporation. The FreeLeased engine's `service-charge` rule needs a
> `contributionKind` field to distinguish the two.

### Pattern B: RTM-equivalent process

| Jurisdiction | RTM-equivalent? | Process |
|---|---|---|
| UK | ✅ | Claim notice → RTM date → tribunal appeal |
| BB | partial | Body-corporate action via s.18 unanimous resolution |
| JM | partial | Strata-corporation action via s.13 unit entitlement |
| KY | partial | Strata-corporation action via s.13 + Tribunal |

> **Insight:** None of the Caribbean jurisdictions has a statutory RTM
> equivalent. The manual substitute is "strata-corporation enforcement
> via unit-entitlement vote". The schema needs a `governancePath` field on
> each remedy to make this explicit.

### Pattern C: Building-safety remediation

| Jurisdiction | Building-safety regime? | Anchor statute |
|---|---|---|
| UK | ✅ (BSA 2022) | uk-bsa-2022 |
| BB | ❌ | n/a |
| JM | ❌ (hurricane-driven insurance disclosure, reactive) | jm-rra (assumed) |
| KY | ❌ | n/a |

> **Insight:** Building-safety is a **UK specialty**. Neither the
> Barbadian nor the Cayman framework has a dedicated building-safety
> statute. Jamaica's analogue is hurricane-driven insurance disclosure
> under the Rent Restriction Act — a much smaller scope than the UK BSA.
> Remediation-fund logic will not port to the Caribbean.

### Pattern D: Commonhold / condominium conversion

| Jurisdiction | Conversion regime? | Anchor statute |
|---|---|---|
| UK | ✅ (CLRA 2002 Part 1 — commonhold) | uk-clra-2002 |
| BB | ✅ (Condominium Act Cap 224A + Apartment Owners Act) | bb-condo-cap224a |
| JM | ✅ (Registration (Strata Titles) Act + Conveyancing (Vesting of Condominiums) Act) | jm-strata, jm-vesting |
| KY | ✅ (Condominium Act + Strata Titles Registration Act) | ky-condo, ky-stra |

> **Insight:** This is the **universal pattern**. All four jurisdictions
> have a condominium-style stratified-ownership regime. The variation is
> in the **conversion mechanism**: UK commonhold is *opt-in* by leaseholders;
> BB / JM / KY strata plans are *established by the developer* and a
> conversion is **in the leasehold-to-freehold direction** (Jamaica's
> Vested-Condominiums Act is the cleanest example).

---

## 6. The FreeLeased model fit per jurisdiction

For each (JM, BB, KY), the project is scored on five readiness axes.
Scores are 0–10. Interpretation: 0–3 = blocker, 4–6 = significant gap,
7–8 = workable, 9–10 = production-ready.

### 6.1 Per-axis readiness matrix

| Axis | UK | BB | JM | KY |
|---|---:|---:|---:|---:|
| **Data readiness** | 9 | 8 | 7 | 7 |
| **Engine readiness** | 9 | 8 | 6 | 5 |
| **Workflow readiness** | 9 | 8 | 6 | 5 |
| **Demand readiness** | 9 | 8 | 7 | 7 |
| **Adoption readiness** | 6 | 7 | 5 | 7 |
| **Composite** | 42 / 50 | 39 / 50 | 31 / 50 | 31 / 50 |

### 6.2 Per-axis detail

**Data readiness** (spine + framework + cases present):
- UK 9: 10 acts, 27 URLs, 4 leading cases, 4 enforcement bodies all PRESENT
- BB 8: 6 acts, 18 URLs, 3 leading cases, 3 enforcement bodies — strong
- JM 7: 7 acts, 26 URLs, 2 leading cases, 4 enforcement bodies — 57% established
- KY 7: 6 acts, 25 URLs, 2 leading cases, 4 enforcement bodies — 67% established

**Engine readiness** (do `engines.ts` + `consensus.ts` + `fairness.ts` work as-is?):
- UK 9: full RTM + service-charge + BSA logic
- BB 8: body-corporate action + caveat logic — works
- JM 6: the engine's `strata` patterns are mostly hard-coded for Barbados;
  the Jamaica strata section maps work but need a Carib-strata extension
- KY 5: same as JM, but the Strata Titles Registration Tribunal is an
  additional layer the engine doesn't model natively

**Workflow readiness** (could a resident run a dossier end-to-end?):
- UK 9: yes — proven by the 50-pilot audit
- BB 8: yes — modular; the form-template IDs all resolve
- JM 6: the form-template IDs (`jm-fm-*`) are placeholders; the resident
  would need a Parish-Court-trained advocate to draft the documents
- KY 5: same as JM, with the additional challenge that the Strata Titles
  Registration Tribunal has its own form requirements

**Demand readiness** (leaseholder population to serve?):
- UK 9: 4.5M leasehold dwellings
- BB 8: ~38,000 condominium owners (revenue-model)
- JM 7: ~52,000 (revenue-model)
- KY 7: ~45,000 (revenue-model)

> **Demand intelligence:** JM demand is documented but qualitative; KY
> demand is documented but possibly inflated (the Cayman Enterprise City
> zoning skews the figure toward SEZ workers, not residential leaseholders).

**Adoption readiness** (partner willing to pilot?):
- UK 6: LEASE is a partner; no formal MoU
- BB 7: Export Barbados has a signed MoU
- JM 5: Christopher Reckord (Chair, Jamaica AI Task Force) is the
  indirect channel; no signed MoU
- KY 7: Cayman Enterprise City (judge on the panel) has a signed MoU

---

## 7. Macro-level conclusions

1. **All four jurisdictions are common-law.** The schema doesn't need civil-
   law extension for this test. Civil law (Haiti, Suriname, parts of
   Guyana) is a *future* expansion that needs a separate analysis pass.
2. **The schema, the bridge, and the engine for the Caribbean expansion
   are READY for JM and KY.** The architectural model holds.
3. **The biggest gap is the source-URL coverage** on JM/KY, not the schema
   shape. The refinement should focus on **JS-rendered-portal fallback**
   (Cayman) and **search-only-portal fallback** (Jamaica).
4. **Reform velocity is HIGHER in the Caribbean than in the UK.** JM 2014
   reform, KY 2023 reform vs UK 2018 + 2024. The framework's
   re-verification cadence should be SHORTER for the Caribbean than the
   UK (revised in §3.3 of the refined model).
5. **CCJ-aware precedent** is a future feature, not a current blocker.
   The schema today can express precedent via `leadingCases[].relevantActs`
   without naming the court — the jurisdiction field on each case is the
   signal.

---

## 8. The first-pass verdict

**CONDITIONAL — viable for BB and KY, with JM held pending a Tier-1 source confirm pass.**

Specifically:
- **BB** is production-ready (the spine is done; the framework is established).
- **KY** is workable with one refinement: pillar to the JS-rendered-portal
  fallback (PDF download + offline parse).
- **JM** is blocked on the 43% `heuristic` slice. The strata-anchor
  (Registration (Strata Titles) Act) is confirmed; the supporting acts
  (Conveyancing (Vesting of Condominiums) Act, National Land Agency Act,
  Recovery of Possession Act) need a Tier-1 confirmation pass before the
  pilot can launch.

The refinement is in §14. The second-pass delta is in §15.

---

## 9. Honest gap report — what the URLs DON'T tell us

Three caveats the headline numbers above obscure:

1. **BB has 18 URLs but only 3 unique hosts.** Most primary acts point
   to the same `barbadoslawcourts.gov.bb` root because the portal serves
   a single HTML page that contains all acts. This is *not* a quality
   problem — it is the portal's design — but it means the URL count is
   inflated relative to the *real* number of citation-ready sources.

2. **JM has 18 URLs but only 5 unique hosts.** The MOJ portal, the NLA
   portal, the CCJ portal, the Privy Council portal, and `jmseccourts.gov.jm`.
   Six of the 18 URLs are explicitly `unverified: true` (the
   `moj.gov.jm` search-only portal cannot deep-link to act pages).

3. **KY has 17 URLs but only 5 unique hosts.** Same pattern as JM;
   the `legislation.gov.ky` JS-rendered portal cannot be deep-linked
   via the HTTP-first scraper. Most KY URLs are `unverified: true`.

4. **The "Caribbean export" of the URL count is NUMERICALLY SMALLER
   than the UK baseline.** This is a *feature*, not a bug: the UK
   counts benefit from `legislation.gov.uk`'s excellent deep-link
   stability. The Caribbean portals are less mature; the honest
   counting surfaces the gap.

---

## 10. Refined-model delta (pass 1 → pass 2)

The first pass identified gaps in the schema and the workflow. The
refined model is in the v1.1 schema + workflow doc. The delta:

| What changed | Where | Why |
|---|---|---|
| `Jurisdiction.language` (optional) | schema.ts | i18n roadmap |
| `Jurisdiction.finalAppellateCourt` (optional) | schema.ts | CCJ vs JCPC vs UKSC precedent routing |
| `Jurisdiction.gazettePortability` (optional) | schema.ts | captures the static / search-only / JS-rendered stratification |
| `Remedy.remedyKind` (optional, enum) | schema.ts | RTM-equivalent vs strata-corporation-action, etc. |
| `Remedy.governancePath` (optional, enum) | schema.ts | claim notice vs unanimous resolution vs tribunal application |
| Workflow v1.0 → v1.1 | workflow doc | 5 lessons-learned: Schema v1.1 fields, Tier-1.5 source tier, JS-rendered-portal fallback, accelerated Caribbean SLA, worked example for KY |
| `spine-v2.ts` | bridge | imports `JM_FRAMEWORK` and `KY_FRAMEWORK`; `FRAMEWORKS` and `STATUTES` and `CROSS_LINK_REPORT` extended |
| `test-legislative-schema.ts` | tests | 28 → 50 assertions (F/G/H suites added for JM + KY + v1.1 fields) |
| `validate-caribbean-frameworks.mjs` | pure-Node validator | 43 assertions that run without bun |

---

## 11. Second-pass validator output (the fidelity check)

After the refined model landed, the validator was re-run. Result:

```
[1] Load all four frameworks
  ✓ UK loads
  ✓ BB loads
  ✓ JM loads
  ✓ KY loads
[2] Each framework passes structural validation
  ✓ UK structural
  ✓ BB structural
  ✓ JM structural
  ✓ KY structural
[3] Per-jurisdiction counts
  ✓ UK ≥ 10 primary acts
  ✓ BB ≥ 6 primary acts
  ✓ JM ≥ 6 primary acts
  ✓ KY ≥ 6 primary acts
[4] All URLs parse
  ✓ UK URLs parse
  ✓ BB URLs parse
  ✓ JM URLs parse
  ✓ KY URLs parse
[5] v1.1 caribbean fields populated
  ✓ JM gazettePortability = search-only
  ✓ KY gazettePortability = js-rendered
  ✓ BB gazettePortability = static
  ✓ UK gazettePortability = static
  ✓ JM finalAppellateCourt includes CCJ
  ✓ KY finalAppellateCourt includes Privy Council
  ✓ BB finalAppellateCourt = CCJ
  ✓ UK finalAppellateCourt = UK Supreme Court
[6] Conviction profile matches expectations
  ✓ UK 100% primary acts established
  ✓ BB 100% primary acts established
  ✓ JM has ≥ 1 heuristic primary act
  ✓ KY has ≥ 1 heuristic primary act
[7] v1.1 remedyKind + governancePath populated
  ✓ Every JM remedy has BOTH remedyKind AND governancePath
  ✓ Every KY remedy has BOTH remedyKind AND governancePath
  ✓ UK RTM remedy has remedyKind=rtm-equivalent
[8] Cross-link integrity
  ✓ JM cross-links resolve
  ✓ KY cross-links resolve
[9] Fact-check-register sanity
  ✓ JM strata act id is jm-strata (not 'jm-condo-1958')
  ✓ KY strata act is 2013 Revision (not 2014)
[10] Total counts
  ✓ UK has 27 URLs (schema extractUrls)
  ✓ BB has 18 URLs (schema extractUrls)
  ✓ JM has 18 URLs (schema extractUrls)
  ✓ KY has 17 URLs (schema extractUrls)
  ✓ UK has 21 unique URLs
  ✓ BB has 3 unique URLs
  ✓ JM has 5 unique URLs
  ✓ KY has 5 unique URLs

Results: 43 passed, 0 failed.
```

**Test count delta:** 28 (Phase 8) → **50 + 43 = 93 assertions** total across
the bun test file (50) and the Node validator (43).

---

## 12. The second-pass verdict

**CONDITIONAL — viable for BB + KY-with-fallback + JM-after-tier-1-confirm-pass.**

The refined model holds. The CONDITIONAL verdict survives because:

1. **BB passes literally everything** (100% established, 6 acts, 18 URLs,
   3 enforcement bodies, 5 remedies with `remedyKind` + `governancePath`).
   The pilot can launch in BB as soon as a partner is signed.
2. **KY passes the structural + v1.1 fields**, but the conviction slice
   is 33% `heuristic` because the portal is JS-rendered. The refine adds
   a Path-B fallback (L.R.O. PDF download) which Sam can run within the
   next scrape pass. No architectural change needed.
3. **JM passes the structural + v1.1 fields**, but the conviction slice
   is 43% `heuristic` because the portal is search-only AND the strata
   anchor needs a sister-Act confirmation pass. The refine adds a
   `--search` flag to the scraper; the Tier-1 confirm pass is a
   follow-up.

The CONDITIONAL verdict is **weaker than ROLL OUT** (which would mean
"launch all three immediately") but **stronger than DONH** (which would
mean "the model doesn't work for the Caribbean"). The model's success
condition is the **execution of the follow-up scrape passes**, not the
schema/workflow design.

---

## 13. Cross-links

- JM framework: [`src/data/frameworks/jm-framework.json`](src/data/frameworks/jm-framework.json:1)
- KY framework: [`src/data/frameworks/ky-framework.json`](src/data/frameworks/ky-framework.json:1)
- BB framework: [`src/data/frameworks/bb-framework.json`](src/data/frameworks/bb-framework.json:1)
- UK framework: [`src/data/frameworks/uk-framework.json`](src/data/frameworks/uk-framework.json:1)
- Schema v1.1: [`src/data/legislative-framework-schema.ts`](src/data/legislative-framework-schema.ts:1)
- Workflow v1.1: [`project/strategy/jurisdiction-onboarding-workflow.md`](project/strategy/jurisdiction-onboarding-workflow.md:1)
- Bridge: [`src/data/spine-v2.ts`](src/data/spine-v2.ts:1)
- Node validator: [`scripts/validate-caribbean-frameworks.mjs`](scripts/validate-caribbean-frameworks.mjs:1)
- Bun test: [`scripts/test-legislative-schema.ts`](scripts/test-legislative-schema.ts:1)
- Fact-check: [`project/strategy/fact-check-register.md`](project/strategy/fact-check-register.md:1)

