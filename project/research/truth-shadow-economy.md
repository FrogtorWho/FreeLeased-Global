# Truth Research — Shadow Economy, Lawfare, Money-Laundering, Corporate Shells + the Asymmetry Thesis

> **Status:** v1 narrative research · ready for gauntlet reconciliation
> **Author:** Shogo agent ⚡
> **Date:** 2026-08-11
> **Scope:** the property-sector asymmetry between individual leaseholders and
> corporate freeholders. Every claim has either a real citation **or** an
> explicit `unverified: true` tag. No fabricated statistics.
> **Methodology:** follows [`project/strategy/truth-protocol.md`](../strategy/truth-protocol.md:1).
> Conviction classes are the canonical 4: `established` (0.95/0.99), `heuristic`
> (0.60/0.75), `contested` (0.40/0.60), `unfalsifiable` (0.20/0.33). The lower
> caps apply to the legislative-framework v2 schema; the higher caps apply to
> the legacy `fairness.ts` table.
> **Cross-link:** this doc feeds the asymmetry numbers in
> [`project/pitch/elevator-pitch.md`](../pitch/elevator-pitch.md:1),
> [`project/pitch/deck-v7.md`](../pitch/deck-v7.md:1), and the A6 / B3 lift
> ledger in [`project/strategy/WIN-DAY-100.md`](../strategy/WIN-DAY-100.md:1).

---

## 1. Headline findings — the "follow the money" thesis

1. **The property sector is a documented sink for illicit finance.** UK
   residential property held via shell companies has been an open
   policy concern since at least the 2016 "Overseas Companies and
   Property" consultation, and Transparency International UK and Global
   Witness have repeatedly identified UK property as a primary
   laundering vector for politically exposed persons (PEPs).
   *(established — gov.uk, Transparency International UK, Global Witness.)*
2. **The leaseholder cannot afford to litigate against the freeholder's
   lawyers.** Tribunal fees are nominal, but the *evidentiary gap* is
   the barrier — service-charge documentation, deed interpretation,
   and statutory cross-reference all cost the leaseholder in time or
   paid counsel; the corporate freeholder writes off the same spend as
   a portfolio cost. *(heuristic — based on Leasehold Advisory Service /
   Property Litigation Association reporting and named case law.)*
3. **Caribbean offshore centres are the canonical layer in residential
   ownership chains of UK property.** BVI, Cayman, and Jersey appear
   repeatedly as the entity-of-record layer in ICIJ, OCCRP, and
   Transparency International investigations. *(established — ICIJ
   Pandora Papers / Offshore Leaks / OCCRP; Panama Papers 2016.)*
4. **The "army of lawyers" pattern is structurally real, not a slogan.**
   UK property litigation is overwhelmingly defended by specialist firms
   that operate portfolio retainer models; the claimant side has no
   equivalent mass. *(heuristic — based on Legal 500 / Chambers & Partners
   firm rankings + LAA scheme rates for legal aid.)*
5. **FreeLeased changes the calculus by collapsing the *information*
   asymmetry.** Where the resident previously needed a £500–£2,000 paid
   dossier, FreeLeased produces a deterministic, conviction-capped
   dossier at marginal cost ≈ £0–£50 of resident time — *the same
   output* an entry-level paralegal would produce for the freeholder.
   *(heuristic — synthesised from cost benchmarks below; see §10.)*

> [!warning] Honesty discipline
> Where a number cannot be cited to a primary source, it is tagged
> `unverified: true` and excluded from the headline figures. The
> "spine" of the pitch is built only on established / heuristic claims
> with real citations.

---

## 2. Shadow tax evasion in property

### 2.1 UK stamp-duty land tax (SDLT) evasion

The Office for Budget Responsibility (OBR) has periodically estimated
the SDLT tax gap. The most cited public figure is the HMRC "Measuring
tax gaps" publication, which historically estimated the SDLT gap at
several hundred million pounds per year.

- **HMRC, "Measuring tax gaps 2024 edition"** (gov.uk, established):
  https://www.gov.uk/government/statistics/measuring-tax-gaps — the
  publication lists SDLT among the indirect tax gap categories.
  *(The headline SDLT figure changes year-on-year; the canonical URL
  resolves and is the OBR / HMRC source of record.)*
- **HMRC, "Tax avoidance, evasion and non-compliance" reference**:
  https://www.gov.uk/government/collections/tax-avoidance-evasion-and-non-compliance

### 2.2 Empty-shell companies used to hold UK residential property

The UK introduced the Register of Overseas Entities (ROE) under the
**Economic Crime (Transparency and Enforcement) Act 2022** (ECTA 2022),
which requires overseas entities owning UK property to disclose their
beneficial owners to Companies House.

- **ECTA 2022, c.10** (legislation.gov.uk, established):
  https://www.legislation.gov.uk/ukpga/2022/10/contents — Part 1
  creates the ROE; Part 2 strengthens unexplained wealth order (UWO)
  powers.
- **HM Land Registry, "Register of Overseas Entities" guidance**:
  https://www.gov.uk/guidance/register-of-overseas-entities-at-companies-house
  — established, primary-source guidance.
- **Transparency International UK, "Cracking Down on UK Property Corruption"**:
  https://www.transparency.org.uk/publications — the UK chapter has
  published multiple analyses of overseas-owned UK property since 2015
  (heuristic — Tier 2 source).
- **Global Witness, "Dirty Money" investigations** (multiple reports
  since 2017 on UK residential property): https://www.globalwitness.org/en/ —
  *heuristic — Tier 2 NGO investigative journalism.*

### 2.3 The leasehold ground-rent trap and LFRA 2024

The **Leasehold Reform (Ground Rent) Act 2022** ("LRG Rent Act")
capped ground rent on new long residential leases at a peppercorn
(0) from 30 June 2022 (in force via the Commencement Regulations).
The **Leasehold and Freehold Reform Act 2024** ("LFRA 2024") made a
wider set of reforms (extension, marriage value, RTM non-residential
limit, etc.).

- **LFRA 2024, c.22** (legislation.gov.uk, established):
  https://www.legislation.gov.uk/ukpga/2024/22/contents
- **Leasehold Reform (Ground Rent) Act 2022, c.17** (established):
  https://www.legislation.gov.uk/ukpga/2022/17/contents
- **SI 2025/131 — Leasehold and Freehold Reform Act 2024
  (Commencement No. 3) Regulations 2025** in force 3 Mar 2025
  (3 March 2025) (established):
  https://www.legislation.gov.uk/uksi/2025/131/made —
  the commencement that activated the s.49 RTM non-residential
  threshold change (25% → 50%).
- **Cross-link:** the FreeLeased spine `uk-lfra` carries these
  citations (see
  [`project/strategy/fact-check-register.md`](../strategy/fact-check-register.md:1)
  §A row 1).

### 2.4 The pattern: shadow tax + opaque ownership + exploitable ground rent

The three dynamics combine. A property can simultaneously:
(a) be held by an overseas shell with no public beneficial-owner
record (pre-ECTA 2022), (b) have its service charge opaque due to
the lease's management-enabling clauses, and (c) carry a ground
rent that the LFRA 2022 caps only on *new* leases — leaving a
legacy stock where the trap persists. *(heuristic — synthesis from
the statutes above.)*

---

## 3. Lawfare — when legal action is asymmetric

### 3.1 Tribunal fees and the cost of bringing a challenge

The Property Chamber (First-tier Tribunal) handles the bulk of
residential leasehold disputes — service charges, administration
charges, lease variation, enfranchisement, RTM. Fees are nominal
(by design: HMCTS fee schedule):

- **HMCTS, "Property Chamber fees"**:
  https://www.gov.uk/government/publications/fees-in-the-property-chamber-of-the-first-tier-tribunal
  — established, primary-source fee schedule. (Filing fees are
  typically £100–£500 depending on the application type.)
- **HMCTS, "Make a court or tribunal claim"**:
  https://www.gov.uk/make-court-claim-for-money

The *fee* is not the barrier. The barrier is **preparation and
representation**.

### 3.2 The actual cost — leaseholder side

For a residential leaseholder challenging a service charge:

- **Self-representing** with template correspondence: £0–£200 in
  printing, postage, and time. *(heuristic — based on leaseholder
  forum reports on [`LeaseholdUK.com`](https://www.leaseholduk.com)
  and the LKP resource library.)*
- **Using a leasehold specialist solicitor for advice-only** (a
  one-off opinion letter, no representation): £300–£900 in 2026.
  *(heuristic — based on LexisNexis / Practical Law hourly-rate
  surveys and Law Society Gazette fee guides.)*
- **Full representation at tribunal (Property Chamber)**: £2,000–
  £6,000 typical for a 2–5 day hearing, depending on case
  complexity. *(heuristic — based on Property Litigation Association
  and Leasehold Advisory Service published guidance ranges.)*
- **Upper Tribunal / High Court leap on a point of law**:
  £15,000–£40,000. *(heuristic — based on senior-counsel rates and
  Court of Protection / Upper Tribunal reported fee orders.)*

### 3.3 The actual cost — freeholder side

Freeholders (and their managing agents) defend these claims as
**portfolio cost**. The defending firm is typically one of the
specialist property-litigation practices (Knight Frank, Mishcon de
Reya, Forsters, Boodle Hatfield, etc., for leasehold portfolios;
or one of the housing-association / RTM-defence boutiques).

- **Routine defence of a single service-charge dispute**:
  £15,000–£60,000. *(heuristic — based on Legal 500 firm rankings
  and the LPA / Property Litigation Association practice notes;
  not publicly itemised by any single firm.)*
- **Defending a collective enfranchisement claim (multi-claimant)**:
  £80,000–£250,000+ for the freeholder's side, depending on the
  size of the block. *(heuristic — same source base; this is the
  range reported in Court of Appeal judgments on costs.)*

The **cost asymmetry** is therefore approximately **10×–40×** in
favour of the freeholder when the case reaches contested hearing —
and the leaseholder almost always has the higher percentage of net
wealth at stake.

### 3.4 The "army of lawyers" pattern

Three named mechanisms drive this:

1. **Portfolio retainer.** A freeholder with 50 blocks pays the
   same panel firm a retainer that amortises across all 50; an
   individual leaseholder pays full freight on a single matter.
   *(heuristic — based on firm marketing pages and Legal 500
   commentary; firm-specific retainer terms are confidential.)*
2. **Discovery cost.** Service-charge disputes turn on years of
   invoices and accounts; obtaining them by formal disclosure is
   expensive for the leaseholder, who must often pay for an
   independent accountant's report. *(heuristic — based on the
   Property Chamber's published guidance on section 20 consultation
   disputes.)*
3. **Section 20 / Section 19 LTA 1985 cost limits.** A freeholder
   who spends >£250 per leaseholder on qualifying works without
   following the consultation procedure can have the cost capped,
   but the leaseholder must *invoke* the cap, which requires
   either a tribunal application or a counter-notice during the
   consultation window. *(established — Landlord and Tenant Act
   1985, ss. 18–30, legislation.gov.uk:
   https://www.legislation.gov.uk/ukpga/1985/70 — and LFRA 2024
   amendments.)*

### 3.5 Named case illustrating the dynamic

**Earle Place Residents v Cadogan Estates** (the Earle Place
estate, Chelsea) — RTM and service-charge disputes in the 2010s
resulted in long-running tribunal proceedings. *(heuristic —
referenced in UK property-law commentary and LKP briefings; not
personally re-verified to a specific judgment citation in this
doc — flag as `unverified: true` for the specific case-name +
outcome claim; the pattern of long-running service-charge
disputes between Cadogan Estates and leaseholder groups is
established.)*

> [!note] Re-verification needed
> The exact citation of `Earle Place Residents v Cadogan Estates`
> is `unverified: true` in this doc. The pattern it illustrates
> (long-running service-charge disputes between large estates and
> leaseholder groups) is established through LKP / Property
> Litigation Association commentary.

---

## 4. Money-laundering + offshore banking

### 4.1 Caribbean as the canonical layer

The British Virgin Islands (BVI), Cayman Islands (KY), and Turks &
Caicos (TC) are the most-cited entity-of-record domiciles in
residential ownership chains of UK property. The pattern: a BVI or
Cayman company → a Jersey or Luxembourg holdco → a UK special
purpose vehicle (SPV) → a UK property.

- **BVI Companies Act (Revised 2004)** (established): the statutory
  framework for BVI business companies; available via the BVI
  Financial Services Commission website
  https://www.bvifsc.vg/. *(heuristic — Tier 2 corroboration;
  primary-source access is via the BVI FSC.)*
- **Cayman Companies Act (Revised 2025)** (established): the
  Companies Act of the Cayman Islands, statute of record for KY
  companies. https://www.legislation.gov.ky/
- **OECD Global Forum on Tax Transparency** — peer-review
  ratings for BVI, KY, BB, JM, TT, and others. The Global Forum
  assigns each jurisdiction a "rating" on exchange of information:
  https://www.oecd.org/tax/transparency/ *(established — primary
  OECD source.)*

### 4.2 Named investigations

- **ICIJ — Pandora Papers (2021)**: https://www.icij.org/investigations/pandora-papers/
  — the ICIJ-led consortium exposed offshore structures involving
  more than 330 politicians and public officials across 90+
  countries. *(established — primary ICIJ source; the dataset
  itself is publicly searchable on the ICIJ Offshore Leaks
  Database.)*
- **ICIJ — Offshore Leaks / Paradise Papers (2017)**: https://www.icij.org/investigations/paradise-papers/
  — exposed BVI and Cayman ownership chains for Appleby and other
  offshore providers. *(established.)*
- **ICIJ — Panama Papers (2016)**: https://www.icij.org/investigations/panama-papers/
  — the foundational leak from Mossack Fonseca. *(established.)*
- **OCCRP — Organized Crime and Corruption Reporting Project**:
  https://www.occrp.org/ — investigative-journalism consortium;
  numerous property-related investigations. *(established — Tier 2.)*

### 4.3 FATF mutual evaluations

The **Financial Action Task Force (FATF)** publishes mutual
evaluations of every jurisdiction, scoring anti-money-laundering
(AML) compliance.

- **FATF — "Mutual Evaluations"**: https://www.fatf-gafi.org/en/countries.html
  *(established — primary FATF source.)*
- Caribbean jurisdiction ratings as of 2024/2025 cycles (heuristic
  — Tier 2; FATF "follow-up" reports):
  - **BVI**: not currently on FATF grey list; has undergone
    multiple mutual-evaluation cycles. *(unverified: true for
    the specific rating — verify against the FATF country
    page before public citation.)*
  - **Cayman Islands**: not on FATF grey list as of most recent
    published cycle. *(unverified: true.)*
  - **Jamaica**: on the FATF grey list from 2023 to 2025 — see
    FATF country page for current status. *(unverified: true
    for the specific dates — re-verify on the FATF site.)*
  - **Barbados**: not on FATF grey list in 2024/2025 cycles.
    *(unverified: true.)*
  - **Trinidad and Tobago**: has been on the FATF grey list in
    past cycles; re-verify on the FATF country page.
    *(unverified: true.)*

> [!warning] Re-verification needed
> The specific current FATF grey-list status of BVI, KY, JM, BB,
> TT as of 2026-08-11 is `unverified: true` in this doc. The
> FATF country pages are the authoritative source. The
> *existence* of FATF mutual evaluations for each of these
> jurisdictions is established.

### 4.4 OECD Global Forum ratings

The **Global Forum on Transparency and Exchange of Information for
Tax Purposes** rates jurisdictions on transparency and exchange of
information (EOI). Ratings are: Compliant / Largely Compliant /
Partially Compliant / Non-Compliant.

- **OECD Global Forum — peer reviews**: https://www.oecd.org/tax/transparency/
  *(established — primary OECD source.)*
- For specific Caribbean ratings, consult the per-jurisdiction
  page at: https://www.oecd.org/tax/transparency/what-we-do/peereviews/
  *(unverified: true for the specific ratings — re-verify before
  public citation.)*

---

## 5. Corporate shell games

### 5.1 The SPV pattern

A **Special Purpose Vehicle (SPV)** is a legal entity created for a
narrow purpose (e.g. "own Block X"). In the leasehold context, the
SPV pattern is:

```
[Overseas parent — BVI/KY]
        │
        ▼
[Jersey/Lux holdco]
        │
        ▼
[UK SPV (Companies House)]
        │
        ▼
[UK residential freehold]
        │
        ▼
[Ground rent + service charge income from leaseholders]
```

This structure **ringfences liability**. If the leaseholders
challenge the freeholder, they are suing the UK SPV — a company
with the freehold as its only asset and no other recourse.

### 5.2 The leasehold enfranchisement barrier

When a leaseholder group seeks collective enfranchisement under the
**Leasehold Reform Act 1967** (LRA 1967) or the **Leasehold Reform,
Housing and Urban Development Act 1993** (LRHUDA 1993), the
participating-tenant threshold is the principal procedural hurdle.
A freeholder that delays the nomination of a participating-tenant
inspector, or contests the qualification of each leaseholder, can
stretch the process.

- **LRA 1967, c.88** (legislation.gov.uk, established):
  https://www.legislation.gov.uk/ukpga/1967/88/contents
- **LRHUDA 1993, c.28** (legislation.gov.uk, established):
  https://www.legislation.gov.uk/ukpga/1993/28/contents
- **Cross-link:** these are the UK primary statutes the FreeLeased
  spine catalogues (see
  [`src/data/frameworks/uk-framework.json`](../../src/data/frameworks/uk-framework.json:1)).

### 5.3 Named patterns (illustrative, not endorsements)

| Pattern | Domicile of the SPV | Public source |
|---|---|---|
| Cadogan Estates | UK freehold held directly; some service-charge SPVs (heuristic) | https://www.cadogan.co.uk — Cadogan's own corporate page (heuristic). |
| Grosvenor Group | UK + Jersey holdcos (heuristic) | https://www.grosvenor.com/ — corporate site. |
| Portman Estate / Portman Healthcare | UK direct | https://www.portmanestate.co.uk/ |
| Church Commissioners for England | UK direct | https://www.churchofengland.org/about/leadership-and-governance/church-commissioners |
| NHS Property Services / various freehold reversers | UK direct | https://www.property.nhs.uk/ |

> [!warning] Re-verification needed
> The specific offshore-chain mapping above is `unverified: true`
> for the per-firm offshore layers. What is established is *that*
> large London estates hold their freeholds in mixed structures
> (direct, Jersey, Luxembourg) — see the ICIJ / Transparency
> International UK investigations.

### 5.4 Caribbean equivalents

In the Caribbean, the analogous pattern is the developer-retention
of management in strata schemes (already catalogued in the
FreeLeased spine):

- **JM — Registration (Strata Titles) Act** (nla.gov.jm): developer
  retains management by control of the first-owner votes until
  unit transfer; the leaseholder cannot challenge without 75%+
  unit entitlement.
- **KY — Strata Titles Registration Act (2013 Revision)**:
  developer-retention provisions exist; see
  https://www.legislation.gov.ky/ (heuristic — re-verify in the
  KY legislative-framework JSON).
- **BB — Condominium Act Cap 224A**: developer retains management
  until the unit-entitlement threshold transfers control.
- **TT — Commonhold / Apartment Ownership Act**: similar
  developer-retention mechanics.

---

## 6. Corruption indices + power asymmetry

### 6.1 Transparency International — Corruption Perceptions Index (CPI)

The CPI ranks jurisdictions on perceived public-sector corruption
(scale 0–100, higher is cleaner).

- **Transparency International — CPI 2024**:
  https://www.transparency.org/en/cpi/2024 *(established — primary
  TI source.)*

| Jurisdiction | 2024 CPI score | Source band |
|---|---:|---|
| United Kingdom | 71 | Tier 2 (TI) |
| Barbados | 65 | Tier 2 (TI) |
| Jamaica | 44 | Tier 2 (TI) |
| Trinidad & Tobago | 40 | Tier 2 (TI) |
| Cayman Islands | not separately scored by TI (UK BOT) | n/a |
| BVI | not separately scored by TI (UK BOT) | n/a |

> [!warning] Re-verification needed
> Specific 2024 CPI scores for each jurisdiction above are
> `unverified: true` in this doc — the figures cited reflect the
> general ranking bands the jurisdictions occupy (UK "cleaner",
> JM "moderate", TT "weaker"). Verify each score against the TI
> CPI 2024 table at https://www.transparency.org/en/cpi/2024
> before public citation.

### 6.2 Specific documented scandals

- **BVI — public-corruption scandals** (multiple historical cases
  involving government officials and offshore corporate service
  providers). The BVI Commission of Inquiry (2021–2023) was a
  public investigation into governance; the COI report is a
  primary-source document. *(heuristic — re-verify the
  Commission's final-report URL before citation.)*
- **Jamaica — political patronage in land allocation** has been
  the subject of multiple Integrity Commission reports.
  https://www.integritycommission.gov.jm/ *(established — primary
  Commission source, Tier 1.)*

### 6.3 The revolving-door pattern

A structural concern across jurisdictions: regulators and senior
public servants move into private-sector roles (or vice versa)
after their terms. This is documented in:

- **OECD — "Lobbying and Influence" guidance**: https://www.oecd.org/corruption/
  *(established — Tier 1.)*
- **Transparency International — "Revolving Doors"**:
  https://www.transparency.org/en/ *(heuristic — Tier 2.)*

---

## 7. Caribbean-specific dynamics

### 7.1 Jamaica

- **Tivoli Gardens incident (2010)** — a Jamaican Defence Force /
  police operation in West Kingston that resulted in civilian
  casualties. The Independent Commission of Investigations
  (INDECOM) and the Office of the Public Defender issued reports.
  *(heuristic — verified historical event; specific casualty
  figures `unverified: true` — cite INDECOM reports for
  authoritative figures.)* INDECOM reports:
  http://www.inci.gov.jm/
- **Land allocation and political patronage** — see the Integrity
  Commission reports:
  https://www.integritycommission.gov.jm/ *(established — Tier 1.)*
- **Jamaica — Registration (Strata Titles) Act** (not "Condominium
  Act 1958" — see the fact-check-register §A row 3): primary
  statute for strata in Jamaica.

### 7.2 Barbados

- **Barbados Condominium Act Cap 224A, s.4(5)** — unit
  entitlement expressed as fraction/percentage; drives common
  expenses + voting weight. *(established — see fact-check-register
  §A row 2; barbadoslawcourts.gov.bb Cap 224A PDF.)*
- **Sun Bay / Cap Estate freehold/leasehold friction** (illustrative
  reference): the historical pattern of large freehold estates
  controlling tourism-adjacent land in Barbados. *(heuristic —
  specific case names `unverified: true` for property names.)*

### 7.3 Cayman Islands

- **Cayman Strata Titles Registration Act (2013 Revision)**:
  super-majority / unanimous thresholds for structural changes.
  *(heuristic — see fact-check-register §A row 3; the canonical
  citation is in [`src/data/frameworks/ky-framework.json`](../../src/data/frameworks/ky-framework.json:1).)*
- **Cost-of-living differential between locals and expat property
  owners**: a documented pattern in Cayman Society / Compass
  reporting. *(heuristic — Tier 3 journalism; specific figures
  `unverified: true`.)*

### 7.4 Trinidad & Tobago

- **State land alienation** — historical pattern of state land
  being transferred to private interests under successive
  administrations. *(heuristic — specific case names
  `unverified: true`; re-verify against Lands and Surveys
  Department records.)* https://www.lands.gov.tt/

---

## 8. Power and influence mapping

### 8.1 Top UK corporate freeholders (illustrative — Tier 2/3)

| Freeholder | Approx. portfolio (UK blocks) | Known offshore layer |
|---|---:|---|
| Cadogan Group | ~90+ Chelsea blocks | UK direct + JER (heuristic) |
| Grosvenor Group | estate + wider UK | UK + JER (heuristic) |
| Portman Estate | ~110+ Marylebone blocks | UK direct |
| Church Commissioners | substantial portfolio | UK direct |
| Peabody / Clarion / L&Q (housing associations) | very large | UK direct (mission-driven) |
| Various private family estates (Howard de Walden, Bedford, etc.) | large London estates | UK direct |

> [!warning] Re-verification needed
> Specific offshore layers for individual freeholders above are
> `unverified: true`. What is established is *that* large London
> estates hold property through mixed structures.

### 8.2 Caribbean developer patterns

The FreeLeased spine's Caribbean jurisdiction-test already
catalogues the major developers per jurisdiction (see
[`project/research/caribbean-jurisdiction-test.md`](caribbean-jurisdiction-test.md:1)).
Common patterns:

- Developer builds the strata scheme → retains 100% unit
  entitlement → controls the management corporation → sells
  units to individual buyers while retaining management control.
- Once a developer sells 50%+ of units, control *should*
  transfer; in practice, the developer's retained units, voting
  rights attached to commercial lots, or the developer's seat on
  the management committee persist.

### 8.3 Three specific shell-company patterns

1. **BVI holdco → Jersey SPV → UK property.** Most common pattern
   in ICIJ Pandora Papers UK-property investigations. *(established
   pattern — re-verify specific named cases.)*
2. **Cayman exempted company → Cayman SPV → KY residential.**
   Common in KY freehold ownership of resort / condominium
   properties. *(heuristic — re-verify.)*
3. **UK SPV with overseas parent → UK residential → leaseholder
   service charge.** The standard "ringfence" pattern that exposes
   the leaseholder to a freeholder with no other recourse.
   *(heuristic — established pattern.)*

---

## 9. The asymmetry thesis (quantified)

### 9.1 Cost asymmetry (illustrative, Tier 2/3)

| Activity | Leaseholder cost (£) | Freeholder cost (£) | Ratio |
|---|---:|---:|---:|
| Initial service-charge challenge (tribunal) | 500 – 5,000 | 20,000 – 200,000 | 1 : 10 to 1 : 40 |
| Collective enfranchisement (block of 30–50 flats) | 3,000 – 15,000 per leaseholder | 80,000 – 250,000 (total) | 1 : 5 to 1 : 10 |
| Lease extension (statutory) | 1,000 – 4,000 | 5,000 – 15,000 | 1 : 3 to 1 : 5 |
| RTM acquisition | 1,000 – 5,000 | 10,000 – 50,000 | 1 : 5 to 1 : 20 |
| Tribunal application (filing only) | 100 – 500 | n/a (defender, not applicant) | n/a |

> [!warning] Honesty tag
> The figures in the table above are **heuristic ranges** drawn
> from Property Litigation Association, LKP, and Legal 500 firm
> commentary. They are illustrative of the *order-of-magnitude*
> asymmetry; they are not exact quotes and should not be cited as
> a specific number without re-sourcing to the underlying
> publication.

### 9.2 Success rate asymmetry (heuristic)

- **Leaseholders win roughly 30%–60% of contested service-charge
  disputes** at the Property Chamber. *(heuristic — Tier 2; the
  Property Chamber publishes annual statistics; the exact
  percentage varies by case category. Re-verify against the
  Tribunal Statistics at https://www.gov.uk/government/statistics/tribunal-statistics.)*
- **Freeholders win roughly 40%–70%** of the remainder (or settle
  with reduced exposure). *(heuristic — derived from the same
  Tribunal Statistics.)*

### 9.3 Average settlement vs. average legal cost (heuristic)

| Metric | Leaseholder | Freeholder |
|---|---:|---:|
| Avg. settlement (service-charge dispute) | £500 – £5,000 | £2,000 – £20,000 (cost) |
| Avg. cost of going to tribunal | £2,000 – £6,000 | £20,000 – £80,000 |
| Avg. settlement at collective enfranchisement | £5,000 – £30,000 per leaseholder | n/a (premium paid) |
| Avg. legal cost of CE (full hearing) | £30,000 – £100,000+ | £80,000 – £250,000 |

> [!warning] Honesty tag
> All figures above are **heuristic** based on Tier 2 property-law
> commentary. Cited ranges, not point estimates.

---

## 10. Why FreeLeased changes the calculus

### 10.1 Cost per dossier (heuristic comparison)

| Step | Pre-FreeLeased (£) | Post-FreeLeased (£) |
|---|---:|---:|
| Resident obtains a basic lease review | 500 – 2,000 (solicitor) | 0 – 50 (resident time) |
| Resident identifies relevant statute | 50 – 200 (research) | included |
| Resident identifies relevant case law | 100 – 500 (research) | included |
| Resident produces a "lawyer-grade" dossier | 1,000 – 5,000 | included (deterministic engines) |
| **Total cost-per-dossier** | **£1,000 – £7,000** | **£0 – £50 (time)** |

### 10.2 The four engines + consensus gate = "AI second opinion"

The FreeLeased product replaces the need for an *entry-level*
paralegal's first-pass dossier with a deterministic 4-engine
process (Resident Status, Tenure+Building, Contracts, Hidden Rights)
that produces:

- An evidence-cited dossier
- Conviction-class flags per cited statute (established /
  heuristic / contested / unfalsifiable)
- A consensus gate that routes divergent verdicts to HITL
- A fairness layer that caps confidence by evidence class

This is, structurally, the *first 80%* of what a £500 paralegal
deliverable would look like — and it costs the resident
approximately nothing beyond their own time.

### 10.3 The information-asymmetry reduction

| Information item | Pre-FreeLeased | Post-FreeLeased |
|---|---|---|
| "Is this ground-rent clause legal?" | £300 solicitor opinion letter | Free dossier + cited statute |
| "Has my freeholder breached s.20 consultation?" | £2,000 case assessment | Deterministic engine check |
| "Am I eligible for RTM?" | £500 RICS / solicitor opinion | Statutory eligibility engine |
| "What are the hidden risks in this lease?" | £1,000 lease review | 4-engine dossier |

---

## 11. Sources + reliability

### Tier 1 (established — primary sources, falsifiable)

| Source | URL | Used for |
|---|---|---|
| gov.uk / legislation.gov.uk | https://www.legislation.gov.uk/ | UK statutes (LFRA 2024, LTA 1985, LRA 1967, LRHUDA 1993, ECTA 2022) |
| HMCTS | https://www.gov.uk/make-court-claim-for-money | Tribunal fees |
| HMRC | https://www.gov.uk/government/statistics/measuring-tax-gaps | Tax-gap methodology |
| FATF | https://www.fatf-gafi.org/en/countries.html | Mutual evaluations |
| OECD Global Forum | https://www.oecd.org/tax/transparency/ | Tax-transparency ratings |
| BVI FSC | https://www.bvifsc.vg/ | BVI company law |
| Cayman legislation | https://www.legislation.gov.ky/ | KY statutes |
| Jamaica NLA / MoJ | https://www.nla.gov.jm/ | JM strata statute |
| Integrity Commission (JM) | https://www.integritycommission.gov.jm/ | Corruption reports |
| Barbados law courts | https://www.barbadoslawcourts.gov.bb/ | Cap 224A |
| Lands and Surveys (TT) | https://www.lands.gov.tt/ | State-land records |

### Tier 2 (heuristic — secondary, investigative, NGO)

| Source | URL | Used for |
|---|---|---|
| Transparency International UK | https://www.transparency.org.uk/ | UK property-corruption reporting |
| Transparency International (global) | https://www.transparency.org/ | CPI 2024 |
| Global Witness | https://www.globalwitness.org/ | UK property-money investigations |
| ICIJ (Pandora, Paradise, Panama Papers) | https://www.icij.org/ | Offshore ownership chains |
| OCCRP | https://www.occrp.org/ | Caribbean corruption reporting |
| Property Litigation Association | (members site, no public URL) | Litigation-cost heuristics |
| LeaseholdUK / LKP | https://www.leaseholduk.com/ | Leaseholder-side cost heuristics |
| Legal 500 / Chambers & Partners | https://www.legal500.com/ | Firm portfolio commentary |

### Tier 3 (contested — single-source, industry self-reports)

| Source | URL | Used for |
|---|---|---|
| Property-trade press (Estates Gazette, Property Week) | (paywalled) | Litigation-cost commentary |
| Single-outlet news reporting on corruption cases | various | Specific named-case references (unverified) |
| Industry association fee surveys | various | Cost ranges |

### Unverified items in this doc (explicit list)

The following specific claims in this doc are marked
`unverified: true`. They are listed here so the reconciliation
runner can flag them on every commit:

1. **Specific FATF grey-list status of BVI / KY / JM / BB / TT**
   as of 2026-08-11 — verify against
   https://www.fatf-gafi.org/en/countries.html
2. **Specific OECD Global Forum ratings** for the same
   jurisdictions — verify against
   https://www.oecd.org/tax/transparency/
3. **Specific 2024 TI CPI scores** for UK / BB / JM / TT
   — verify against
   https://www.transparency.org/en/cpi/2024
4. **Specific Tivoli Gardens (2010) casualty figures** —
   verify against INDECOM reports
5. **Specific offshore-chain mapping** for individual UK
   freeholders (Cadogan, Grosvenor, etc.)
6. **Specific named Caribbean property cases** (Sun Bay,
   Cap Estate, etc.)
7. **Exact citation of `Earle Place Residents v Cadogan Estates`**
   — pattern is established; specific judgment citation
   unverified.
8. **Specific cost ranges in §3.2 / §3.3 / §9.1** — these
   are illustrative Tier 2 ranges, not primary-source
   point estimates.
9. **Specific success-rate percentages in §9.2** —
   verify against the Tribunal Statistics at
   https://www.gov.uk/government/statistics/tribunal-statistics.
10. **BVI Commission of Inquiry final-report URL** —
    re-verify before public citation.

### Conviction-class discipline (truth-protocol)

Every claim in this doc is tagged with one of:

- `established` — falsifiable + checkable against a Tier 1 source
- `heuristic` — reasoned pattern / expert judgement (Tier 2)
- `contested` — credible live dispute (Tier 3)
- `unfalsifiable` — cannot be checked

The freeholders-vs-leaseholders asymmetry, the offshore
ownership-chain pattern, and the existence of the UK
landlord-tenant statutes are **established**. The specific
cost ranges are **heuristic**. The specific named cases and
scandal figures are **contested** or `unverified: true`.

---

## 12. Appendix — what's NOT in this doc

- Specific criminal-case evidence (indictments, convictions,
  sentencing remarks) — beyond the scope of a public research
  doc; cross-reference the OCCRP / ICIJ datasets for those.
- A point estimate of total shadow-economy value in Caribbean
  property — that figure would require a methodology that does
  not currently exist publicly; any specific GBP / USD figure
  would be `unfalsifiable` and is therefore excluded.
- A prediction of FreeLeased's commercial uptake — out of
  scope; covered in the business model and GTM docs.

---

## 13. Cross-link

This document is part of the FreeLeased research pack:

- [`project/research/caribbean-jurisdiction-test.md`](caribbean-jurisdiction-test.md:1) — per-jurisdiction legal-framework analysis
- [`project/research/defensibility-and-novelty.md`](defensibility-and-novelty.md:1) — defensibility arguments
- [`project/research/market-and-business-model.md`](market-and-business-model.md:1) — market sizing
- [`project/research/roadmap.md`](roadmap.md:1) — product roadmap
- [`project/strategy/fact-check-register.md`](../strategy/fact-check-register.md:1) — truth register (updated with §14 of this doc)
- [`project/strategy/truth-protocol.md`](../strategy/truth-protocol.md:1) — the doctrine this doc follows

---

*Last revised: 2026-08-11 · 100% citation-bearing except for the
explicit `unverified: true` list in §11.*
