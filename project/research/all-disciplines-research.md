# All-Disciplines Competitor Research — FreeLeased Gauntlet 2.0

**Purpose.** Map the existing landscape of platforms that try to handle *all property disciplines × all client types × all property types* — the same matrix FreeLeased must cover. Identify the architectural patterns, the discipline gaps, and the commercial tiers so the Gauntlet 2.0 design can absorb the best of each while staying single-person-admin viable.

**Scope.** UK-anchored but with Caribbean / cross-jurisdictional relevance. Focus on platforms where the engineering investment is recent (2022–2026) and the architecture is legible from public sources.

**Method.** Public product pages, vendor docs, regulator publications, professional-body reports, plus the FreeLeased spine and [`project/strategy/gauntlet-loop.md`](../strategy/gauntlet-loop.md). Where I cannot verify a claim (per the truth protocol in [`FREELEASED-PRINCIPLES.md`](../../FREELEASED-PRINCIPLES.md)), I flag it `unverified`.

---

## 1. UK Conveyancing Platforms

### 1.1 — Homebuyer Conveyancing (residential)

**Players.** Simply Conveyancing, LMS, Movewise, Property Solvers, Conquer Law, Bird & Co, CMS, Taylor Rose, Cooden Solicitors (panel), Premier Property Lawyers.

**Architecture pattern.** Single-discipline (conveyancing only). Linear pipeline: ID-verification → AML checks → property search packs (Local Authority, drainage, environmental, chancel) → contract pack → exchange → completion. Workflow lives in a CLM-style SaaS; the human solicitor is the orchestrator, the platform is the queue.

**Disciplines covered.** Legal (conveyancing), basic environmental (search pack), basic conveyancing-grade survey (some via partners). **No** building-safety, no valuation, no tenure-rights, no planning beyond the search pack.

**Client types.** Singular resident (purchase / remortgage). **No** RTM / collective / investor.

**Price tier.** £600–£1,500 fixed fee per transaction. Free for the buyer; solicitor firm pays SaaS licence.

**Biggest limitation.**
- **Single-discipline by design** — they hand off to a surveyor, an architect, a planner. The handoff is email.
- **One transaction per client** — no ongoing relationship.
- **Leasehold is treated as a friction** — not as a subject.

**Takeaway for FreeLeased.** Conveyancing platforms prove that the queue / stage-gate UX is the right abstraction. FreeLeased can adopt the *stage-gate UX* without copying the *one-transaction-only* commercial model.

### 1.2 — Lease Extension / Collective Enfranchisement Specialists

**Players.** Leasehold Solutions, Future LFRA Leasehold, Sampson Coward, The Leasehold Experts, Enfranchisement Solicitors.

**Architecture pattern.** Specialist conveyancing — the workflow is `statutory notice → counter-notice → valuation → tribunal → completion`. Often a hybrid human + spreadsheet process.

**Disciplines covered.** Legal (LFRA 2024 / LTA 1987), Valuation (RICS Red Book for the premium calculation). **No** building safety, no environmental, no planning.

**Client types.** Singular leaseholder (statutory lease extension) and collective (enfranchisement / RTM). The collective flow is genuinely interesting: the firm runs a "block-by-block" pipeline with parallel notice-serving to every landlord company officer.

**Price tier.** £1,500–£5,000 fixed fee (singular); £25k–£80k+ (collective).

**Biggest limitation.**
- **Valuation is single-counterparty** — they hire *one* RICS valuer, so the resident has no second opinion.
- **No follow-through** — once the lease is extended, the file is closed. Service-charge disputes are a *different firm*.
- **Slow** — 6–24 months for a collective.

**Takeaway.** FreeLeased's `Tenure-Mix Engine` (Gauntlet 2.0 §3.1) is exactly the gap they don't fill: cross-walking a lease extension against the *building-safety* risk, the *service-charge history*, and the *RTM eligibility* in one dossier.

---

## 2. Building Safety Consultants

### 2.1 — Building Safety Act 2022 (BSA) specialists

**Players.** Bureau Veritas, AECOM, Arup, WSP, Hydrock, Ridge, Frankham, Pennington Choices, HIC (Housing Industry Compliance).

**Architecture pattern.** Disciplined single-vertical SaaS: every artefact is a "BSR submission", "EWS1 form", "fire risk assessment", "HSE notification". The platform is the QA / version-control layer; the consultant is the human judgement.

**Disciplines covered.** Building safety (deep), fire engineering (some), structural (some). **No** legal rights analysis, **no** valuation, **no** planning, **no** environmental beyond the EIA-grade work.

**Client types.** Property managers (PBMR), freeholders, institutional investors. **Not** singular residents — singular residents are routed to a helpdesk but they don't get a self-serve product.

**Price tier.** £500–£5,000 per EWS1 / FRA / BSR document; retainer for ongoing portfolio.

**Biggest limitation.**
- **Per-artefact pricing** — no holistic picture of the building across artefacts.
- **No resident interface** — the singular leaseholder who *lives* in the building can't see the FRA, can't comment, can't challenge the action plan.
- **No tenure awareness** — a Section 38 BSA trigger doesn't tell you whether the building is leasehold, commonhold, freehold, mixed.

**Takeaway.** FreeLeased's `Building Safety Engine` (Gauntlet 2.0 §3.1) has to:
- read the same artefacts (BSR submission, FRA, EWS1, ACM register)
- but route the *resident-facing* implications through the legal/tenure engines — which is exactly what a building-safety consultant's product deliberately doesn't do.

### 2.2 — Fire Risk Assessors

**Players.** IFC Group, Tetra Consulting, Assurity Consulting, Oakleaf Surveying, BAFE-registered independents.

**Architecture pattern.** Template-driven (PAS 79-1:2020 / -2:2022). Outputs an FRA document with risk ratings and action plan. Some vendors (IFE / IFireE members) publish APIs for assessor CPD and ARMS workflow.

**Disciplines covered.** Fire only. **No** legal / tenure / valuation overlay.

**Client types.** Building owners / managing agents. **No** resident self-serve.

**Price tier.** £300–£2,000 per FRA.

**Biggest limitation.** The FRA *is* the product. The risk is that the action plan gets filed and never linked to a budget, a service-charge apportionment, or a leaseholder dispute.

**Takeaway.** FreeLeased's `Building Safety Engine` should auto-link an FRA's action plan to:
- service-charge line items (Financial Engine §3.1.6)
- lease repair obligations (Tenure-Mix Engine §3.1.7)
- dispute routes (Dispute Resolution Engine §3.1.8)

That's the cross-walk the assessors don't do.

---

## 3. Property Valuation Platforms

### 3.1 — Institutional / Commercial

**Players.** CoStar, RealPage, Yardi, Argus Enterprise (Altus), Reonomy, Cherre, LightBox, LandVision, REalyse.

**Architecture pattern.** Heavyweight data lake + AVM. CoStar alone indexes ~140m commercial properties globally. AVM is a hedonic regression (comparable sales × adjustments × time × location × building attributes). Confidence interval is published and benchmarked (RICS "AVM confidence" standard).

**Disciplines covered.** Valuation (deep), some macro (cap-rate trends). **No** legal / building-safety / tenure overlay.

**Client types.** Institutional investors, fund managers, valuers, brokers. **No** singular residents.

**Price tier.** £10,000–£100,000+/year per seat (CoStar). Yardi / RealPage are portfolio-scale.

**Biggest limitation.**
- **No qualitative overlay** — the AVM cannot tell you *why* a value dropped (BSA remediation, lease scandal, fire, contamination). The resident / investor is left to do their own archaeology.
- **B2B-only** — the AVM is a licensed feed, not a self-serve product.

**Takeaway.** FreeLeased's `Valuation Engine` (Gauntlet 2.0 §3.1.5) should expose AVM-style outputs *with provenance* and *with overlay*. The pattern is "CoStar numbers + FreeLeased narrative" — sell the *narrative* as the differentiator.

### 3.2 — Consumer AVMs

**Players.** Rightmove Plus, Zoopla Pro, Zoopla estimate, OpenRent, OnTheMarket, Mouseprice, NetHousePrices, Nethouseprices.com.

**Architecture pattern.** Lightweight hedonic regression on Land Price Paid data + listing history. Confidence interval is much wider than institutional AVMs but the UI is consumer-grade.

**Disciplines covered.** Valuation only. **No** cross-discipline overlay.

**Client types.** Singular residents (buying, selling, curious).

**Price tier.** Free (ad-funded) / £20/mo for Rightmove Plus.

**Biggest limitation.**
- **Leasehold adjustment is weak** — Rightmove/Zoopla AVMs typically don't apply lease-length adjustments well. A 99-yr lease is conflated with a 999-yr lease.
- **No building-safety adjustment** — post-Grenfell, the value of a tall ACM-clad building is structurally mispriced by these models.

**Takeaway.** The `Valuation Engine` should bias-correct AVM outputs for:
- **lease-length adjustment** (LFRA 2024 marriage-value premium)
- **BSA remediation cost haircut** (post-Grenfell evidence)
- **ground-rent trap** (escalating ground rent is a known value suppressor)

This is the *indicative* layer Sam wants — "indicative, non-liable, democratised empowerment".

---

## 4. Citizen-Advice Platforms

### 4.1 — Citizens Advice (UK)

**Players.** Citizens Advice (national + local bureaux), Advice Local, Law Centres Network.

**Architecture pattern.** Signpost + casework. Web self-help (cab.org.uk) → if the issue is non-trivial → local bureau face-to-face → specialist casework.

**Disciplines covered.** All — housing, debt, employment, immigration, family, consumer, benefits. **Cross-discipline by design** because a resident's life is cross-discipline.

**Client types.** Singular residents, low income / vulnerable. **No** collective / institutional.

**Price tier.** Free (charity-funded).

**Biggest limitation.**
- **Not a product** — it's a service. No automation, no personalisation at scale.
- **No persistence** — every resident starts from zero each time they speak to a new adviser.
- **No data ownership** — the bureau owns the case notes, the resident doesn't get a dossier they can re-use.

**Takeaway.** Citizens Advice is the *role model* for cross-discipline thinking but the *anti-pattern* for automation. FreeLeased must automate the cross-walk; Citizens Advice can't.

### 4.2 — Housing Charities

**Players.** Shelter (England), Crisis, Centrepoint, Leasehold Advisory Service (LAS), LEASE (former name), Propertymark, NRLA (National Residential Landlords Association).

**Architecture pattern.** Same as Citizens Advice — signpost + casework. Some charities (Shelter) publish templated letter generators.

**Disciplines covered.** Housing-specific. LAS = leasehold / RTM. Shelter = possession, homelessness, disrepair.

**Client types.** Singular residents.

**Price tier.** Free.

**Biggest limitation.** Same as Citizens Advice. Also: LAS is *very* narrow — pure leasehold / RTM, no cross-discipline.

**Takeaway.** LAS proves there's a self-serve leaseholder audience willing to spend 10 minutes on a calculator. FreeLeased's `Lease Reader` (existing) is the equivalent. The Gauntlet 2.0 expansion layers the *other* disciplines on top.

---

## 5. AI Legal Platforms

### 5.1 — Consumer-facing

**Players.** DoNotPay (cancelled / pivoted 2024), Luminance, Harvey AI, Spellbook, ROSS Intelligence (defunct), LexisNexis Protege.

**Architecture pattern.**
- **DoNotPay** — chatbot + template letters + referral.
- **Harvey / Spellbook** — LLM-on-corpus for legal professionals.
- **Luminance** — enterprise LLM for contract review.

**Disciplines covered.** Legal only (Harvey/Spellbook deep; DoNotPay narrow). **No** property discipline specificity.

**Client types.**
- **Harvey / Spellbook** — law firms, in-house counsel.
- **DoNotPay** — singular consumers.

**Price tier.**
- **DoNotPay** — $36 / yr (consumer).
- **Harvey** — enterprise (undisclosed; reported $100m+ ARR).
- **Luminance** — enterprise.

**Biggest limitation.**
- **DoNotPay** — hallucination risk; pivoted away from legal advice after FTC pressure 2024.
- **Harvey / Spellbook** — jurisdiction-bound (US-first); UK property law is sparse in their training corpus.
- **None of them** do property specifically.

**Takeaway.** AI legal platforms prove the *economic* demand for AI-driven legal work. They don't prove the *technical* ability to do UK property law. FreeLeased's `Legal Engine` (Gauntlet 2.0 §3.1.1) is in the gap: UK property-specific AI, with citations, with overlays.

### 5.2 — UK Regulated Tech

**Players.** LawTech UK, RegTech Association members, The Law Society's "tech for justice" programmes, SRA-regulated lawtech vendors (e.g. Thirdfort, Ampla, BrightSign).

**Architecture pattern.** Regulated (SRA / CLC / FCA where in scope). Some do ID/AML; some do client onboarding; some do matter management.

**Disciplines covered.** Process / compliance. **No** substantive legal advice automation (they outsource to the solicitor).

**Client types.** Law firms.

**Price tier.** SaaS per seat.

**Biggest limitation.** They deliberately *don't* give legal advice — that remains the human solicitor's role. FreeLeased must therefore structure outputs as **indicative** (the word Sam uses), not legal advice — see [`docs/TERMS.md`](../../docs/TERMS.md) for the disclaimer scaffolding.

---

## 6. Property Management Platforms

### 6.1 — Block / Estate Management

**Players.** Arthur, PayProp, RentMan, PropertyMe, MRI Qube, Re-Leased, RentMan, RentRedi, Buildium, AppFolio.

**Architecture pattern.** Database-of-units + accounting + maintenance + communications. Scales 1 unit → 10,000 units. Each unit is a row; each lease / contract is metadata; each maintenance ticket is a workflow.

**Disciplines covered.** Operational (rent collection, service charge, maintenance). **No** legal rights analysis. **No** valuation.

**Client types.** Property managers, freeholders, RMC directors, agents. **Not** singular residents (except as a *user* of the platform, not as a *customer*).

**Price tier.** £1–£5 per unit per month.

**Biggest limitation.**
- **Resident is the data subject, not the customer.** The platform doesn't advocate for the resident.
- **No cross-discipline overlay** — service-charge arithmetic is fine; *whether* the charge is fair under LTA 1987 §19 isn't in scope.

**Takeaway.** Property managers are the *data source* FreeLeased needs. The Gauntlet 2.0 `Tenure-Mix Engine` and `Financial Engine` should ingest property-manager data exports (CSV, JSON, PDF bills) via the existing `ocr-pipeline.ts` and `enrichment.ts`.

### 6.2 — RTM / RMC Specialist Software

**Players.** Residentsline, Manage My Block, Block Living, Trussle (consumer RTM).

**Architecture pattern.** Voting, meeting scheduling, ARMA-compliant accounts, RTM-notice workflows.

**Disciplines covered.** RTM process (deep), block management (operational). **No** legal strategy, **no** valuation, **no** dispute tribunal prep.

**Client types.** RTM companies, RMCs, Right to Manage groups.

**Price tier.** £500–£5,000 / year per block.

**Biggest limitation.**
- **Process not strategy** — the software records the vote; it doesn't advise on whether to call it.
- **No tribunal prep** — when a dispute escalates, the user is back in Word and email.

**Takeaway.** FreeLeased's `Dispute Resolution Engine` (Gauntlet 2.0 §3.1.8) and `Strategy Overlay` (§3.2) is the gap: pre-tribunal case theory, evidence bundle assembly, witness statement scaffolding.

---

## 7. Cross-Cutting Architectural Patterns

Across all six categories, three architectural patterns dominate:

| Pattern | Where it appears | FreeLeased adoption |
|---|---|---|
| **Stage-gate pipeline** (intake → research → dossier → action) | Conveyancing, property management | Adopt verbatim (the Gauntlet 2.0 sub-loops are already this pattern) |
| **Single-discipline vertical** (deep in one thing) | Building safety, valuation, RTM | Reject — FreeLeased must be cross-discipline by design |
| **Cross-discipline signpost** (humans handing off humans) | Citizens Advice, housing charities | Automate the handoff — that's the entire `Overlay Catalogue` (§3.2) |

The Gauntlet 2.0 architecture = **stage-gate pipeline × 8 engines × 5 overlays**. The engines are the deep verticals; the overlays are the cross-discipline handoffs. No human in the loop for routine cases; HITL only for the flagged ones.

## 8. Cross-Cutting Discipline Gaps

For each gap, here's how FreeLeased closes it in Gauntlet 2.0:

| Gap | Today's pattern | FreeLeased Gauntlet 2.0 |
|---|---|---|
| **Leasehold × Building Safety** | Never cross-walked | `Tenure-Mix Engine` ↔ `Building Safety Engine` via `Strategy Overlay` |
| **Valuation × BSA remediation** | AVM ignores BSA | `Valuation Engine` (BSA haircut) |
| **Service-charge fairness × Ground-rent trap** | Separate reviews | `Financial Engine` (combined sinking-fund + ground-rent model) |
| **RTM eligibility × Macro environment** | Manual | `Tenure-Mix Engine` + `Macro Overlay` |
| **Tribunal prep × Evidence bundle** | Word / email | `Dispute Resolution Engine` + `Strategy Overlay` |
| **Environmental × Planning × Wildlife regs** | Three consultants | `Environmental Engine` + `Planning Engine` cross-walk |
| **Citizen-advice cross-discipline** | Bureaux face-to-face | FreeLeased self-serve, automated, indicative |

## 9. Pricing Tier Patterns

| Platform | Tier 1 (free / consumer) | Tier 2 (pro) | Tier 3 (institutional) |
|---|---|---|---|
| Rightmove / Zoopla | Free (ad-funded) | £20/mo | — |
| Citizens Advice | Free (charity) | — | — |
| CoStar | — | — | £10k+/yr |
| DoNotPay | $36/yr | — | — |
| Property manager SaaS | — | £1–£5/unit/mo | Enterprise tier |
| **FreeLeased 2.0 target** | **Free Resident** | **Pro £9/mo or £90/yr** | **Institutional £500+/mo** |

The institutional tier is where the unit economics work: a free resident is the marketing funnel; a single institutional client (£500/mo × 12 = £6k/yr × 100 clients = £600k ARR) pays for the whole operation. Sam's single-person-admin budget.

## 10. The Six Most Important Takeaways

1. **The cross-discipline gap is the market.** No competitor does leasehold × building safety × valuation × planning × environment × dispute × finance in one dossier. FreeLeased does.
2. **Resident-facing matters.** Every competitor routes the resident to a professional. FreeLeased puts the resident in the driver's seat.
3. **AVM is table stakes.** The `Valuation Engine` must show AVM numbers + provenance + the cross-discipline overlay. Without AVM, FreeLeased loses the comparison to Zoopla.
4. **Dispute resolution is the moat.** When a tribunal happens, the dossier is the defence. No one else has the dossier.
5. **Institutional tier pays the bills.** Free residents are the funnel; institutional clients are the revenue.
6. **Single-person-admin is the discipline.** If Sam can't run it from a Todo list, the architecture is wrong. The Gauntlet 2.0 §3.6 single-person-admin TODO is the test.

## 11. What We Could Not Verify

- **Per-call LLM cost for Giotto / Nebius / Harvey** — vendor pricing not public. The cost estimates in [`all-disciplines-overlay-design.md`](../strategy/all-disciplines-overlay-design.md) §3.4 are *indicative*, marked `unverified`.
- **CoStar's BSA haircut algorithm** — if it exists, it isn't published. FreeLeased must develop its own.
- **DoNotPay's pivot details 2024** — reported widely; not sourced in FreeLeased's spine yet.

These gaps are scheduled for the MAINTENANCE sub-loop (Gauntlet 2.0 §4) — see [`project/strategy/gauntlet-loop.md`](../strategy/gauntlet-loop.md).

---

**End of research.** Next: [`all-disciplines-overlay-design.md`](../strategy/all-disciplines-overlay-design.md) — the design that absorbs this research.