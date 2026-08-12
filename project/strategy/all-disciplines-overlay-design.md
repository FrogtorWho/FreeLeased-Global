# All-Disciplines Overlay + Engine Design — FreeLeased Gauntlet 2.0

**Purpose.** Specify the 8 engines, the 5 overlays, the client-type matrix, the AI-employee army, the tiered pricing model, and the single-person-admin TODO. This is the design contract that [`project/strategy/gauntlet-loop.md`](gauntlet-loop.md) absorbs.

**Companion docs.**
- [`../research/all-disciplines-research.md`](../research/all-disciplines-research.md) — competitor landscape + discipline gaps.
- [`../../FREELEASED-PRINCIPLES.md`](../../FREELEASED-PRINCIPLES.md) — truth protocol, honest-failure doctrine.
- [`../../src/lib/agents.ts`](../../src/lib/agents.ts) — existing agent stub registry (will be expanded in a follow-up code batch; this doc is doc + test only).

**Honesty rule.** Per the truth protocol, every conviction class + confidence cap is per the existing [`gauntlet-loop.md` Dated Conviction](gauntlet-loop.md) contract. No claim is asserted above the inputs' support.

---

## 3.1 — The 8 Engines

The Gauntlet 1.x had 4 dossier engines (Resident Status, Tenure+Building, Contracts, Hidden Rights). Gauntlet 2.0 expands to 8. The expansion is *additive*, not *replacing*: every existing engine remains; the 4 new ones fill the gaps the competitor research (`../research/all-disciplines-research.md`) identified.

The conviction-class caps below match the Dated Conviction contract in `gauntlet-loop.md`: `established → 0.99`, `heuristic → 0.75`, `contested → 0.60`, `unfalsifiable → 0.33`. Personal-advice output decays at 30 days; statute context at 365.

### Engine 1 — Legal Engine

**Discipline.** UK / Caribbean property law, statutory rights, RTM, enfranchisement, lease extensions, service-charge disputes.

**Inputs.**
- Lease document (text + OCR); LFRA 2024, LTA 1987, CLRA 1985, RTM regs
- Service-charge accounts; tribunal orders; section 20 notices
- Jurisdiction marker (`UK` | `BB` | `JM` | ...)
- Giotto / Nebius / local-edge LLM call (where licence allows)

**Outputs.**
- `LegalVerdict { rightsIdentified[], breaches[], remedy[], appealRoutes[], conviction }`
- Citations to LFRA s.20 / s.99; LTA s.19; RTM regs 2010; CLRA s.21
- Statutory-notice draft (s.20 / s.21 / s.22 / RTM notice)
- Plain-English summary (counsel-tone, indicative)

**Evidence requirements.**
- Full lease text (not just a photo of one clause)
- Service-charge accounts ≥ 1 year (preferably 3)
- Any prior correspondence with the landlord / agent
- Jurisdiction marker

**Conviction class cap.** `established` (statute in spine, fresh) → 0.99; `heuristic` (analogy from similar statute) → 0.75; `contested` (case-law split) → 0.60; `unfalsifiable` (no clear precedent) → 0.33.

**Edge cases.**
- **Mixed-tenure buildings** — the verdict must split by tenure (freehold unit vs leasehold unit vs commonhold). Single verdict over the whole building is dishonest.
- **Pre-LFRA 2024 leases** — older marriage-value rules apply; engine must check the lease date.
- **Caribbean jurisdictions** — no equivalent of LFRA / LTA; engine falls back to jurisdiction-specific statutes (e.g. Barbados Condominium Act; Jamaica Strata Titles Act). Cap drops to `heuristic` (0.75) until conviction is upgraded.
- **Commonhold** — RTM / enfranchisement do not apply. Engine must return `rightsIdentified: []` with `conviction: 'unfalsifiable'` and route to commonhold-specific advice (RICS Commonhold Code, Commonhold and Leasehold Reform Act 2002).

### Engine 2 — Planning Engine

**Discipline.** Town planning, permitted development, conservation, listed-building consent, Article 4, Section 106, local plan.

**Inputs.**
- Address (for planning constraints lookup)
- Property description (existing + proposed works)
- Local authority data feeds (planning.data.gov.uk; council local-plan)
- Conservation area / listed-building register
- Article 4 direction map

**Outputs.**
- `PlanningVerdict { constraints[], permittedDevelopmentStatus[], consentsRequired[], expectedFee[], conviction }`
- Link to planning portal application form
- Pre-application advice summary

**Evidence requirements.**
- Valid address
- Description of works (or none — the engine can run read-only)
- Optional: title plan

**Conviction class cap.** `established` (in published local plan) → 0.99; `heuristic` (analogous case in nearby authority) → 0.75; `contested` (planning inspectorate appeal pending) → 0.60; `unfalsifiable` (no published guidance) → 0.33.

**Edge cases.**
- **Mixed-use** — commercial + residential split; engine must apply different consent regimes to different floors.
- **Conservation area + Article 4** — single article 4 direction doesn't tell you what's permitted; engine must check the *direction text*.
- **Caribbean** — building-permit regimes vary; engine falls back to `heuristic`.
- **AONB / SSSI / Wildlife** — engine must hand off to Environmental Engine (no overlap, no double-counting).

### Engine 3 — Building Safety Engine

**Discipline.** Building Safety Act 2022 (BSA), EWS1, fire risk assessments (FRA), ACM (aluminium composite material) cladding, structural, HSE notifications, BSR gateway regime.

**Inputs.**
- Building height + age + materials + use class
- EWS1 form (if exists)
- FRA document
- BSR gateway registration status
- HSE notification register
- ACM register (where published)

**Outputs.**
- `BuildingSafetyVerdict { bsaClassification[], remediationCostEstimate, actionPlan[], mandatoryNotices[], conviction }`
- BSR application scaffolding (gateway 2 / gateway 3)
- Resident-facing explanation ("is my flat safe to live in?") capped at `heuristic` (0.75)

**Evidence requirements.**
- Height (m above ground) or storey count
- Material declaration (cladding / balcony / structure)
- If available: EWS1 form, FRA

**Conviction class cap.** `established` (statute + BSR guidance + EWS1) → 0.99; `heuristic` (analogy from similar building) → 0.75; `contested` (BSR / HSE adjudication pending) → 0.60; `unfalsifiable` (no public data) → 0.33.

**Edge cases.**
- **Pre-BSA buildings** — the engine must still flag known ACM / fire-stop defects from legacy registers (Hackitt review, MHCLG data).
- **Mixed-tenure + mixed-height buildings** — the engine must apply BSA only to the high-rise portion. Single verdict for the whole building is dishonest.
- **Caribbean** — no equivalent; engine falls back to `unfalsifiable` (0.33) and routes to local building-control.
- **ACM remediation funding** — the engine must surface the Building Safety Fund / Waking Watch Relief Fund eligibility (where applicable) via the Financial Engine.

### Engine 4 — Environmental Engine

**Discipline.** Flood risk, contamination, EPC, heat networks, wildlife regs (CIEEM), biodiversity net gain (BNG), Net Zero / Part L / Future Homes Standard.

**Inputs.**
- Address (for flood zone / EPC lookup)
- Property type + age
- EPC certificate (if available)
- Environmental search pack (if available)
- Local wildlife / SSSI / AONB overlay

**Outputs.**
- `EnvironmentalVerdict { floodRisk, contaminationRisk, epcRating, heatNetworkStatus, wildlifeConstraints[], bngRequirement, conviction }`
- Retrofit recommendation (insulation, heat pump, solar)
- EPC improvement estimate
- BNG calculation (for extensions)

**Evidence requirements.**
- Valid address
- Optional: EPC, environmental search

**Conviction class cap.** `established` (EPC register / EA flood map) → 0.99; `heuristic` (modelled from address) → 0.75; `contested` (modelled with conflicting inputs) → 0.60; `unfalsifiable` (no data) → 0.33.

**Edge cases.**
- **Flood zone 3 + insurance** — engine must surface the insurance implications (via Financial Engine), not just the flood classification.
- **Wildlife regs** — bats, great-crested newts, badgers — engine must distinguish *informal* presence from *protected* presence. Cap drops to `heuristic` (0.75) unless the Local Record Centre confirms.
- **BNG** — 10% mandatory for certain developments; engine must apply only to *new* extensions, not retrofits.
- **Caribbean** — no BNG; engine falls back to local env-impact rules.

### Engine 5 — Valuation Engine

**Discipline.** RICS Red Book, AVM (hedonic regression), comparable analysis, market trend, lease-length adjustment, BSA haircut.

**Inputs.**
- Property attributes (type, size, age, tenure, lease length, ground rent)
- Land Price Paid data (HM Land Registry)
- Comparable listings (Rightmove / Zoopla public)
- BSA remediation cost (from Engine 3, if applicable)
- Local macro (from Macro Overlay)

**Outputs.**
- `ValuationVerdict { avmEstimate, confidenceInterval, leaseLengthAdjustment, bsaHaircut, macroAdjustment, conviction }`
- Comparable list (top 10 within ±10% size)
- "What moved the value" trace

**Evidence requirements.**
- Property attributes (at minimum: type, size, tenure)
- Optional: lease length, ground rent, recent service-charge history

**Conviction class cap.** `established` (RICS-red-book valuation by qualified valuer) → 0.99; `heuristic` (AVM with full inputs) → 0.75; `contested` (AVM with missing inputs) → 0.60; `unfalsifiable` (no comparable data) → 0.33.

**Edge cases.**
- **Lease < 80 years** — marriage-value premium applies (LFRA 2024); engine must flag and quantify.
- **BSA remediation in progress** — engine must haircut the value by an estimated remediation cost.
- **Ground rent escalation** — engine must apply a known-suppression factor (aversion to escalating ground rent is a published market behaviour).
- **Caribbean** — no Land Price Paid data; engine falls back to local valuation rolls / listed sales. Cap drops to `heuristic` (0.75).

### Engine 6 — Financial Engine

**Discipline.** Service-charge fairness (LTA 1987 §19), ground-rent trap, sinking-fund analysis, RTM premium calculation, lease-extension premium, service-charge apportionment.

**Inputs.**
- Service-charge accounts (≥ 1 year, ideally 3)
- Lease clauses (service-charge definition, apportionment %, reserve fund clause)
- Ground rent + escalation clause
- Sinking-fund schedule (if exists)

**Outputs.**
- `FinancialVerdict { serviceChargeFairness, groundRentTrapRisk, sinkingFundSolvency, rtmPremiumEstimate, leaseExtensionPremium, conviction }`
- Service-charge challenge letter draft
- Sinking-fund shortfall projection

**Evidence requirements.**
- Lease text (service-charge + sinking-fund clauses)
- ≥ 1 year of service-charge accounts

**Conviction class cap.** `established` (with 3 years of accounts + clauses) → 0.99; `heuristic` (with 1 year) → 0.75; `contested` (accounts dispute open) → 0.60; `unfalsifiable` (no accounts) → 0.33.

**Edge cases.**
- **Reserve fund / sinking fund misnamed** — many leases use "reserve fund" and "sinking fund" interchangeably but with different accounting treatments; engine must read the clause, not the label.
- **Mixed-use apportionment** — engine must apply the lease's apportionment %, not a default.
- **Caribbean** — equivalent of "service charge" varies; engine must localise.

### Engine 7 — Tenure-Mix Engine

**Discipline.** Freehold / leasehold / commonhold / RTM mix, collective enfranchisement, RTM eligibility, lease-extension eligibility, commonhold conversion.

**Inputs.**
- Title register (Land Registry)
- Lease (if leasehold)
- Building composition (units, freeholder, management company)
- RTM notice (if exists)
- RMC / RTM company docs

**Outputs.**
- `TenureMixVerdict { unitTenures[], buildingTenureMix, rtmEligibility, enfranchisementEligibility, commonholdConversionRoute, conviction }`
- RTM notice draft
- Enfranchisement claim strategy

**Evidence requirements.**
- Title register
- Lease(s) for leasehold units
- Composition (how many units of each tenure)

**Conviction class cap.** `established` (Land Registry title) → 0.99; `heuristic` (analogy from similar block) → 0.75; `contested` (disputed title) → 0.60; `unfalsifiable` (no title) → 0.33.

**Edge cases.**
- **Mixed-tenure** — RTM requires ≥ 50% of qualifying tenants (LFRA 2024); engine must count units, not floor area.
- **Commonhold** — RTM / enfranchisement do not apply; engine must return `[]` with conviction `unfalsifiable` and route to commonhold advice.
- **Caribbean** — no RTM; engine must localise (e.g. Barbados "sectional title scheme" vs Jamaica "strata").
- **Common-parts lease vs flat lease** — engine must distinguish; only flat-lease holders qualify for RTM.

### Engine 8 — Dispute Resolution Engine

**Discipline.** Tribunal procedure (First-tier Tribunal (Property Chamber) — Leasehold), mediation routes, escalation, evidence bundle assembly, witness statement scaffolding.

**Inputs.**
- Triggering dispute (from any of the 7 other engines)
- Tribunal rules (procedural)
- Evidence available
- Mediation route (internal / external)

**Outputs.**
- `DisputeVerdict { tribunalRoute, mediationRoute, evidenceBundleChecklist, witnessStatementOutline, expectedOutcomeRange, conviction }`
- Witness statement draft
- Evidence bundle index
- Tribunal form (LEAS / LRA / RTM)

**Evidence requirements.**
- Triggering dispute
- Available evidence (any of: lease, accounts, correspondence, photos)
- Jurisdiction marker

**Conviction class cap.** `established` (tribunal precedent + clear evidence) → 0.99; `heuristic` (analogous tribunal) → 0.75; `contested` (open appeal) → 0.60; `unfalsifiable` (novel case) → 0.33.

**Edge cases.**
- **Cross-jurisdiction** — Caribbean tribunals exist (Barbados, Jamaica) but operate differently; engine must localise.
- **Multi-claimant** — collective enfranchisement + RTM may run in parallel; engine must sequence.
- **Mediation vs tribunal** — mediation is preferred (cheaper, faster) but not always available; engine must surface the choice.

---

## 3.2 — The 5 Overlays

Above the 8 engines, 5 cross-cutting overlays run *across* the engines. Each overlay is a function `(engineOutputs, dossierContext) → overlayOutput` that adds a layer of analysis no single engine can produce on its own.

### Overlay 1 — Macro Overlay

**Purpose.** Set the macro context for the dossier: property-price trends, interest-rate context, regional economics, building-safety reform velocity.

**Inputs.**
- Region (from dossier)
- Property type
- Macro data feeds (ONS House Price Index, Bank of England rates, RICS Residential Market Survey)
- Reform-velocity tracker (BSA implementation milestones, LFRA phase-ins)

**Outputs.**
- `MacroContext { priceIndex, rateContext, regionalTrend, reformVelocityScore, confidence, fetchedAt }`
- "How this macro affects you" narrative (counsel-tone, indicative)

**Used by.** Valuation Engine (price trend), Financial Engine (interest rate), Building Safety Engine (reform velocity), all engines (regional context).

**Decay.** Macro context decays at 90 days (rate / price moves) or per statute cycle (reform milestones).

### Overlay 2 — Micro Overlay

**Purpose.** Synthesise the 8 engine outputs into a single property-specific dossier narrative.

**Inputs.**
- All 8 engine verdicts
- Resident intake (jurisdiction, property type, client type)
- Existing dossier (if any) for diff

**Outputs.**
- `MicroDossier { executiveSummary, fullDossier, recommendedActions, citations, convictionSummary, fairnessFlags, hitlRequired }`
- This is the *deliverable*. Everything else in the system feeds it.

**Used by.** All clients. The Micro Overlay is what gets rendered to the resident / manager / institutional client.

**Decay.** Micro dossier decays at 30 days for personal advice, 90 days for property context, 365 days for statute context.

### Overlay 3 — Prediction Overlay

**Purpose.** Forward-looking risk forecasts. The current engines are *present-tense* ("here is what the law says"). The Prediction Overlay is *future-tense* ("here is what will likely happen").

**Inputs.**
- All 8 engine verdicts
- Macro context
- Historical dossier trends (Learning Engine — `src/lib/learning.ts`)
- Public risk-forecast data (RICS forecasts, government projections)

**Outputs.**
- `PredictionSet { forecasts[], confidencePerForecast, triggers[], expiry }`
- Examples:
  - "Service charge likely to double in 5 years based on hidden repair clauses + current under-funding"
  - "Building-safety remediation cost likely to be passed to leaseholders within 24 months based on current BSR application pattern"
  - "RTM premium likely to rise in 18 months based on the marriage-value statutory schedule"

**Used by.** Strategy Overlay, Strategy Engine recommendations, Valuation Engine haircut, Financial Engine sinking-fund projection.

**Decay.** Predictions decay at 90 days (anything longer is a forecast, not a prediction).

**Honesty rule.** Every prediction must carry a confidence interval. If the confidence interval is too wide to be useful, the overlay says "no reliable prediction" rather than fabricating one.

### Overlay 4 — Strategy Overlay

**Purpose.** The "what to do next" layer. Takes the dossier (Micro) and the predictions (Prediction) and produces a ranked action plan.

**Inputs.**
- Micro dossier
- Prediction set
- Client type (from intake)
- Pricing tier (from auth)
- Resource constraints (single-person-admin TODO — see §3.6)

**Outputs.**
- `ActionPlan { rankedActions[], timeHorizon, expectedOutcome, costOfAction, conviction }`
- Action types: `automated` (free-tier), `pro-tier` (requires login), `institutional` (requires advisor)
- Each action has: trigger, owner (engine or agent), cost, deadline

**Used by.** All clients. The Strategy Overlay is the *primary user-facing* output.

**Decay.** Action plans decay at 30 days (they depend on the dossier; if the dossier is stale, so is the plan).

### Overlay 5 — Money Trail Overlay (Follow-the-Money)

**Purpose.** Trace the money: who pays whom, who benefits, what flows where. The Money Trail Overlay is the FreeLeased-specific lens: every charge, every clause, every notice has a flow.

**Inputs.**
- All 8 engine verdicts
- Service-charge accounts
- Lease clauses (payment flows)
- Freeholder structure (parent company, ultimate beneficial owner)
- RTM / management company structure

**Outputs.**
- `MoneyTrail { flows[], beneficiaries[], intermediaries[], redFlags[], conviction }`
- Visual map (text / Mermaid)
- Red flags: "agent fee > 15% of service charge" / "freeholder parent in offshore trust" / "sinking fund transfers to non-resident account"

**Used by.** Financial Engine, Strategy Overlay, all clients (the Money Trail is one of the most-cited parts of a FreeLeased dossier in user research — see [`memory/2026-08-11-phase2.md`](../../memory/2026-08-11-phase2.md)).

**Decay.** Money-trail flows decay at 90 days (accounts) or 365 days (lease).

**Honesty rule.** Money-trail claims require explicit evidence. If the corporate structure isn't on Companies House, the overlay says "structure: unknown" rather than guessing.

---

## 3.3 — The Client-Type Matrix

How the system adjusts per client type:

| Client type | Engines prioritised | Overlays applied | Pricing tier | Free tier allowed? |
|---|---|---|---|---|
| **Singular resident** (leaseholder / owner-occupier / tenant) | 1, 2 (if buying), 6, 7 | Micro + Strategy | Free | Yes |
| **Leaseholder collective (RTM / RMC)** | 1, 6, 7, 8 | Macro + Micro + Strategy + Money trail | Pro | Limited (collective view is pro-tier) |
| **Property manager / agent** | 1, 4, 6, 8 | Macro + Micro | Pro | Limited (manager view is pro-tier) |
| **Institutional investor (fund / REIT)** | 2, 4, 5, 6 | Macro + Money trail + Prediction | Institutional | No |
| **Housing association / RSL** | 1, 3, 6, 8 | Macro + Money trail | Institutional | No |
| **Local authority** (planning, building control, housing) | 1, 2, 3, 4, 8 | Macro + Money trail | Custom (per-tender) | No |
| **Tribunal** (FTT Property Chamber) | 1, 8 | Micro + Money trail + Strategy | Custom (per-case) | No |
| **Solicitor firm** (panel / partner) | 1, 6, 7, 8 | Micro + Strategy + Prediction | Pro / Institutional | No |
| **Mortgage lender** | 5, 6, 7 | Macro + Money trail | Institutional | No |
| **Insurance provider** (block policy) | 3, 5, 6 | Macro + Money trail | Institutional | No |

The matrix is the *default* — clients can override (an institutional client can opt into the singular-resident UX). The Strategy Overlay always surfaces the client-type lens explicitly so the resident sees *which lens* the dossier used.

---

## 3.4 — The AI-Employee Army

Named, specialist agents. Each has a stub entry in `src/lib/agents.ts` (existing); the Gauntlet 2.0 expansion adds the new roles below. Each agent's `execute()` is a deterministic stub by default — replaceable by a real LLM call (Giotto for legal reasoning, Nebius for data analysis, local-edge for privacy-sensitive tasks) without changing the call site.

### Tier 1 — Specialist Consultants (the front-line "PQE" of FreeLeased)

| Agent | Role | Inputs | Outputs | Cross-comm | Cost / call (indicative) | Vendor (call route) |
|---|---|---|---|---|---|---|
| **Counsel** (LLB + 10yr PQE) | Legal advice (lease, RTM, tribunal) | Engine 1 + lease + accounts | Plain-English legal memo | ↔ Surveyor, ↔ Solicitor (DR) | £0.40 | Giotto |
| **Surveyor** (MRICS + 10yr) | Building survey, defects | Engine 3 + building data | Building condition report | ↔ Valuer, ↔ Fire Engineer | £0.30 | Nebius |
| **Planner** (RTPI + 8yr) | Planning applications | Engine 2 + address | Planning memo + pre-app draft | ↔ Environmental, ↔ Counsel | £0.25 | Giotto |
| **Valuer** (RICS Red Book) | Valuations | Engine 5 + comparables | AVM + RICS narrative | ↔ Surveyor, ↔ Financial | £0.35 | Nebius |
| **Fire Engineer** (IFE / IFireE) | Fire risk assessments | Engine 3 + FRA | Resident-facing FRA summary | ↔ Surveyor, ↔ Counsel | £0.30 | Giotto |
| **Ecologist** (CIEEM) | Environmental / wildlife | Engine 4 + wildlife data | BNG calculation + wildlife memo | ↔ Planner | £0.20 | Local-edge |
| **Mortgage Broker** (CeMAP) | Financing | Engine 5 + rate data | Mortgage illustration | ↔ Valuer | £0.15 | Local-edge |
| **Solicitor (Dispute Resolution)** | Tribunals, mediation | Engine 8 + evidence | Witness statement + tribunal form | ↔ Counsel | £0.45 | Giotto |
| **Chartered Accountant** (ACA) | Sinking-fund analysis | Engine 6 + accounts | Sinking-fund projection | ↔ Valuer, ↔ Financial | £0.30 | Nebius |
| **Marketing Strategist** | Community organising | RTM strategy + Money trail | Resident-engagement plan | ↔ PR/Comms | £0.20 | Local-edge |

### Tier 2 — Support Functions (the back office)

| Agent | Role | Inputs | Outputs | Cross-comm | Cost / call | Vendor |
|---|---|---|---|---|---|---|
| **Compliance Officer** (GDPR / CoC) | Privacy + CoC compliance | All engines + user actions | Compliance log entry | ↔ Counsel, ↔ DevOps | £0.10 | Local-edge |
| **DevOps Engineer** | Automation, deployment | CI/CD events | Deployment manifest | ↔ all | £0.05 | Local-edge |
| **PR / Comms** | Community engagement | Strategy Overlay + Money trail | Press release / community update draft | ↔ Marketing Strategist | £0.15 | Giotto |
| **Customer Success** | Onboarding, training | New user events | Onboarding sequence | ↔ Marketing Strategist | £0.10 | Local-edge |
| **Data Engineer** | Spine + spine maintenance | All engines + spine | Spine update log | ↔ all | £0.15 | Local-edge |

### Tier 3 — Intern Roles (the juniors)

| Agent | Role | Inputs | Outputs | Cross-comm | Cost / call | Vendor |
|---|---|---|---|---|---|---|
| **Junior Analyst** | First-pass triage | Intake | Triage verdict | ↔ Counsel | £0.03 | Local-edge |
| **Paralegal** | Evidence bundling | All engines + intake | Evidence index | ↔ Solicitor (DR) | £0.05 | Local-edge |
| **Admin** | Diary / scheduling | HITL events | Diary entries | ↔ Customer Success | £0.02 | Local-edge |

### Tier 4 — Specialist Vendors (external, called via thin wrapper)

| Vendor | Specialty | Called by | API surface |
|---|---|---|---|
| **Giotto.ai** | Legal reasoning + multimodal | Counsel, Planner, Fire Engineer, PR | `POST /v1/chat` |
| **Nebius** | Data analysis + numerical reasoning | Surveyor, Valuer, Accountant | `POST /v1/infer` |
| **OllyGarden** | Telemetry, observability | DevOps, Data Engineer | `OTLP` |
| **Local-edge LLM** (llama-3 / qwen-2.5 / phi-3) | Privacy-sensitive inference | Ecologist, Mortgage, Compliance, Customer Success | `POST /v1/chat` (local) |

### Cross-communication patterns

The agents communicate via a pub/sub message bus (existing pattern in [`src/lib/federation.ts`](../../src/lib/federation.ts)). Example: **Counsel** publishes a legal memo → **Solicitor (DR)** subscribes and cross-references the memo in the tribunal evidence bundle → **Chartered Accountant** subscribes to quantify the financial impact → **Strategy Overlay** subscribes to surface the action in the resident's plan. No agent blocks; all messages carry conviction class + fetchedAt + sourceUrl.

### Cost estimate (per dossier)

Assuming 8 engines × 1 specialist consultant + 5 overlays × 1 support agent + 1 intern triage + 2-3 cross-comm pings:

```
Specialist consultants: 8 × £0.30 (avg) = £2.40
Support functions:       5 × £0.10 (avg) = £0.50
Interns:                 3 × £0.03 (avg) = £0.09
─────────────────────────────────────────────
Subtotal (LLM cost):                          £2.99
+ Giotto multimodal (PROCESS sub-loop):       £0.50
+ Telemetry (OllyGarden OTLP):               £0.05
─────────────────────────────────────────────
Total per dossier (indicative):               ~£3.50
```

**Implication.** At the Pro tier (£9/mo or £90/yr) a heavy user might run 30 dossiers/mo → £105/mo in LLM cost → thin margin. The free tier is limited (5 dossiers/yr) so cost is bounded; the institutional tier (£500+/mo) covers 200+ dossiers/mo comfortably.

---

## 3.5 — Tiered Pricing Model

### Free Resident — £0

- **Who.** Singular resident. Leaseholder, owner-occupier, or tenant.
- **What.**
  - Lease Reader (existing) — single-lease analysis, indicative
  - 1 jurisdiction (default: UK)
  - 5 dossiers / year (rate-limited, anti-abuse)
  - Public overlays only (Macro snapshot)
  - No automation (no scheduled re-fetch, no alerts)
  - Plain-English summaries, no legal-grade memo
  - Citation chain visible (per the truth protocol)
- **Conversion trigger.** Resident hits a question the free tier can't answer (e.g., "what's my RTM eligibility in this mixed-tenure block?") → upsell to Pro.

### Pro Advisor — £9/mo or £90/yr

- **Who.** Singular resident, leaseholder collective, property manager, small firm.
- **What.** Everything in Free Resident, plus:
  - All 8 engines (full output)
  - All 5 overlays (Micro + Strategy + Prediction + Money trail + Macro)
  - Multi-jurisdiction (UK + 1 of BB/JM/TT etc.)
  - 50 dossiers / month
  - Automation: weekly re-fetch + freshness alerts + decay warnings
  - Advanced UI: Money Trail visual map, action-plan kanban, tribunal evidence index
  - 1 free-tier colleague seat (per Pro account)
- **Conversion trigger.** Pro user hits volume limit (50 dossiers/mo) or needs institutional-grade features (API access, multi-jurisdiction > 2) → upsell to Institutional.

### Institutional — £500+/mo (custom-priced)

- **Who.** Institutional investor, housing association, local authority, tribunal, solicitor firm (panel), mortgage lender, insurance provider.
- **What.** Everything in Pro, plus:
  - Dedicated advisor agent (named, persistent)
  - Bulk operations (CSV / API ingest of 1000+ units)
  - White-label (the institution's brand on the dossier)
  - Custom integrations (Yardi / RealPage / CoStar feed)
  - Unlimited dossiers
  - Multi-jurisdiction (all available)
  - SLA: 99.5% uptime, 24h response on HITL
  - Private spine (institution's own jurisdictional data)
  - Custom reports (PDF + dashboards)

### The conversion funnel

```
Free Resident (5 dossiers/yr, indicative)
      │
      │ needs more / wants automation
      ▼
Pro Advisor (£9/mo or £90/yr)
      │
      │ needs bulk / multi-jurisdiction / white-label
      ▼
Institutional (£500+/mo, custom)
```

The funnel is the *revenue spine*. Free tier is the marketing funnel; institutional tier is the revenue.

---

## 3.6 — Single-Person Admin TODO

For Sam (and any future solo admin), a TODO list that runs the whole org. Everything below is automatable except the items marked `[HITL]`.

### Daily (5 minutes)

- [ ] **Read overnight gauntlet output** (`memory/<date>.md` MAINTENANCE + SELF-IMPROVE sections). Auto-emailed at 07:00.
- [ ] **Review any dossier flagged `hitl-required`** from yesterday. Action: sign-off, override, or escalate.
- [ ] **Check telemetry health** — 99.5%+ of OTLP spans reached OllyGarden (auto-aggregated).
- [ ] **Check the conviction-drift watch list** — any statute that dropped below 0.60?

### Weekly (30 minutes)

- [ ] **Review partner outreach auto-emails** — the gauntlet drafts outreach to RICS / RTPI / Law Society partners; Sam approves any that need human judgement. `[HITL]`
- [ ] **Review pricing-experiment results** — the gauntlet runs A/B on Pro tier copy + institutional pitch. Sam approves any experiments with > £500/mo impact. `[HITL]`
- [ ] **Review the Spine Update Log** (Data Engineer agent) — any new statutes / case-law / tribunal decisions to add?
- [ ] **Review the Money-Trail red-flag queue** — any new corporate-structure red flags to surface?

### Monthly (2 hours)

- [ ] **Review pricing-experiment results** (cumulative) — adjust tiers if a Pro → Institutional conversion has slipped.
- [ ] **Review the Compliance Log** (Compliance Officer agent) — any GDPR / CoC issues?
- [ ] **Review the customer-success sequence** (Customer Success agent) — onboarding conversion rate?
- [ ] **Review the Money-Trail revenue projections** — how much is the Money Trail Overlay driving engagement?

### Quarterly (1 day)

- [ ] **Review conviction-class drift** — for every statute in the spine, what's the 90-day conviction trend? Commit updates to `data/learning_state.json`.
- [ ] **Review the engine catalogue** — are all 8 engines still pulling their weight? Any to retire? Any to add? `[HITL]`
- [ ] **Review the overlay catalogue** — same for the 5 overlays.
- [ ] **Review the AI-employee army** — are the named agents still the right roles? Any new entrants? Any to retire? `[HITL]`
- [ ] **Review the client-type matrix** — are the default engines + overlays still right per client type? `[HITL]`
- [ ] **Review the tiered pricing** — are the conversion funnels still healthy?
- [ ] **Annual security audit** — see [`../../docs/SECURITY.md`](../../docs/SECURITY.md).

### Ad-hoc

- [ ] **Review any item the gauntlet marks `hitl-required`** — these can come at any time.
- [ ] **Review any `[HITL]` flagged in the daily / weekly / monthly / quarterly lists above.**

### Automation budget

The single-person-admin TODO is designed to fit into ~1 hour of focused human time per week (most of it quarterly). The rest is automated. If the list ever exceeds 2 hours/week, the architecture is wrong — and the SELF-IMPROVE sub-loop is the place that catches it (Bayesian conviction update on the *admin workload* itself).

---

**End of design.** Next: [`gauntlet-loop.md`](gauntlet-loop.md) is rewritten to incorporate this design as the Gauntlet 2.0 contract.