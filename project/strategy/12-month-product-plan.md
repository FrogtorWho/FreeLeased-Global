# 12-Month Product Plan — FreeLeased

**Status:** living plan · **Created:** 6 Aug 2026 · **Owner:** Sam
**Truth:** We built 14 admin panels and 0 product surfaces. This plan fixes that.

---

## The Honest Gap Analysis

### What exists today (11 tabs, all admin-facing)
| Tab | What it does | Who uses it |
|---|---|---|
| Overview | Dossier metrics, sign-off pie chart | Sam |
| Command Post | Competition countdown, deliverables | Sam |
| Competition | Task queue, approvals, rubric scores | Sam |
| Dossier Explorer | Browse synthetic resident dossiers | Demo only |
| Research Desk | Research briefs display | Sam |
| Communes | Cryptographic commune display | Experimental |
| Rights Catalogue | Static table of 20 rights patterns | No one (reference) |
| Data Spine | Architecture + data model viewer | No one (reference) |
| Assurance | Verification metrics | Sam |
| Gates Tool | Content quality sweep (PII, AI tells) | Sam |
| About | Team/product description | No one |

### What does NOT exist (the actual product)
**Zero resident-facing tools. Zero.** No resident can:
- Check what rights they have
- Analyze a service charge demand
- Calculate RTM eligibility
- Scan a lease for unfair clauses
- Generate a challenge letter
- Benchmark their charges against peers
- Track their case progress
- Coordinate with neighbours

**Zero jurisdiction admin tools.** No administrator can:
- Monitor compliance across their portfolio
- See building safety status at a glance
- Track resident cases
- Generate regulatory reports

**Zero advisor tools.** No professional can:
- Research case outcomes
- Run bulk lease analysis
- Generate tribunal applications

---

## What We're Actually Building

### The Three Personas

**1. The Resident (primary)**
- "I got a service charge demand for £4,200. Is this legal?"
- "Can we take over management of our building?"
- "My lease says the landlord can enter anytime. Is that allowed?"
- "What do I actually DO about this?"

**2. The Jurisdiction Administrator (secondary)**
- "Which buildings in my area have unresolved safety issues?"
- "How many RTM applications are in progress?"
- "What are the common complaints and outcomes?"

**3. The Legal Advisor (tertiary)**
- "What happened in similar s.20 tribunal cases?"
- "Run this portfolio of 50 leases and flag the riskiest"

---

## Month-by-Month

### Months 1-2: Resident Core (MVP)

**The product must start with what a leaseholder sits down and DOES.**

| Feature | What it does | Engine used | Priority |
|---|---|---|---|
| **Rights Checker** | Resident enters situation (tenure type, building type, location, issue category) -> personalized rights list with plain-English explanations and statute links | `HIDDEN_RIGHTS` + `STATUTES` from spine | CRITICAL |
| **Lease Scanner** | Paste or upload lease text -> underlined clauses with inline citations, capped confidence, plain-English explanation of each flag | `fairness.ts` `analyzeLease()` | CRITICAL |
| **Service Charge Checker** | Enter charge amount + description -> flag if above threshold, check s.20 consultation was followed, flag prohibited charges | `fairness.ts` rules + `s20` rules | CRITICAL |
| **RTM Eligibility Wizard** | Step-by-step: building type -> tenure count -> qualifying tenants -> "Are you eligible? Here's the process." | Spine data + eligibility rules | CRITICAL |
| **Action Plan Generator** | Based on identified issues -> numbered steps with deadlines, template letters, who to contact, tribunal time limits | Combination of all engines | HIGH |

**New components:**
- `src/components/auri/RightsChecker.tsx` — interactive wizard, not static table
- `src/components/auri/LeaseScanner.tsx` — paste/upload -> annotated results
- `src/components/auri/ServiceChargeChecker.tsx` — quick-check tool
- `src/components/auri/RTMWizard.tsx` — step-by-step eligibility + process
- `src/components/auri/ActionPlan.tsx` — generated next steps + templates

**New API routes in `custom-routes.ts`:**
- `POST /api/rights-check` — personalized rights lookup
- `POST /api/lease-scan` — run fairness analysis, return annotated results
- `POST /api/service-charge-check` — validate a specific charge
- `GET /api/rtm-eligibility/:jurisdiction` — eligibility rules for jurisdiction
- `POST /api/action-plan` — generate step-by-step plan from identified issues

**What changes in the nav:**
- NEW primary nav item: **"My Rights"** (resident entry point)
- Move "Rights Catalogue" into "My Rights" as a subtab (reference for power users)
- Move "Competition" and "Command Post" into a secondary **"Admin"** section

### Month 3: Resident Dashboard + Community

| Feature | What it does |
|---|---|
| **My Case Dashboard** | "I have 3 issues. 1 needs action by Friday." Status tracking with deadlines. |
| **Letter Templates** | Pre-written, jurisdiction-specific letters: challenge service charge, request s.20 consultation, RTM notice, deposit dispute. One-click customise. |
| **Community Benchmarking** | "Buildings like yours typically pay £X/m². You pay £Y." Anonymous aggregate comparison. |
| **Building Safety Checker** | Enter building details -> BSA compliance status, remediation obligations, who's responsible. |

**New components:**
- `src/components/auri/CaseDashboard.tsx` — personal case tracker
- `src/components/auri/LetterWriter.tsx` — template -> customise -> download
- `src/components/auri/Benchmarking.tsx` — charge comparison charts
- `src/components/auri/BuildingSafety.tsx` — BSA compliance checker

### Month 4: Jurisdiction Admin

| Feature | What it does |
|---|---|
| **Compliance Monitor** | Portfolio view: which buildings are compliant, which aren't, colour-coded |
| **Case Volume Dashboard** | Trends: how many RTM applications, service charge disputes, safety issues per month |
| **Resident Activity Feed** | What residents are doing on the platform (anonymised) |
| **Regulatory Report Generator** | Auto-draft compliance reports from aggregated data |

**New components:**
- `src/components/auri/ComplianceMonitor.tsx` — portfolio dashboard
- `src/components/auri/JurisdictionDashboard.tsx` — admin overview
- `src/components/auri/ReportGenerator.tsx` — auto-draft reports

### Month 5: Advisor Professional Tools

| Feature | What it does |
|---|---|
| **Case Outcomes Database** | Search tribunal decisions by issue type, outcome, jurisdiction |
| **Bulk Lease Analysis** | Upload 10-50 leases -> ranked risk report per lease |
| **Statute Full-Text Search** | Search across all legislation by keyword, section, topic |
| **Research Engine** | In-app research desk that produces structured briefs on demand |

**New components:**
- `src/components/auri/CaseDatabase.tsx` — searchable case outcomes
- `src/components/auri/BulkAnalysis.tsx` — multi-lease batch processing
- `src/components/auri/StatuteSearch.tsx` — full-text legislation search

### Month 6: Document Generation

| Feature | What it does |
|---|---|
| **Tribunal Application Drafter** | Based on case facts -> generates First-tier Tribunal application draft |
| **RTM Company Pack** | Company formation docs, member register, articles of association |
| **Service Charge Schedule** | Itemised schedule of chargeable vs non-chargeable items |
| **Correspondence Trail** | Auto-log all letters sent/received, link to case timeline |

### Month 7: Multi-Resident Coordination

| Feature | What it does |
|---|---|
| **Collective Action Hub** | "12 of 24 flat holders have signed up for RTM. Here's the progress." |
| **Resident Voting** | Secure voting on management decisions (building on commune primitives) |
| **Shared Document Vault** | Upload/share lease documents with neighbours, all anonymised |
| **Milestone Tracker** | Collective deadlines: RTM notice period, s.20 response deadline, etc. |

### Month 8: Intelligence Layer

| Feature | What it does |
|---|---|
| **Legislative Change Monitor** | "The Renters' Reform Bill just passed. Here's what changes for you." |
| **Anomaly Detection** | "Your building's charges went up 40% while similar buildings went up 5%." |
| **Precedent Alerting** | "A tribunal just ruled on a case similar to yours. Here's the outcome." |
| **Market Intelligence** | Insurance, valuation, climate risk data for buildings (land-focused, CoC-safe) |

### Month 9: Mobile + Accessibility

| Feature | What it does |
|---|---|
| **Mobile-First Resident View** | Simplified, calm, high-contrast interface for phone use |
| **Multi-Language** | Caribbean language support: Bajan Creole, Jamaican Patois, etc. |
| **Screen Reader + WCAG-AA** | Full accessibility audit and remediation |
| **Offline Mode** | Save key documents locally for areas with poor connectivity |

### Month 10: Integration + Scale

| Feature | What it does |
|---|---|
| **Land Registry API Bridge** | Where available, pull title register data automatically |
| **Council Integration** | Submit complaints/alerts to local housing authorities |
| **Insurance Integration** | Flag building insurance gaps, suggest providers |
| **Payment Gateway** | Powertranz integration for service charge payments (per prize) |

### Month 11: Analytics + Reporting

| Feature | What it does |
|---|---|
| **Resident Impact Report** | "In 6 months, FreeLeased helped residents recover £X in unlawful charges" |
| **Jurisdiction Scorecard** | Compare jurisdictions on compliance, outcomes, speed |
| **Predictive Analytics** | "Based on patterns, buildings with X characteristics are Y% more likely to have unlawful charges" |
| **Export + PDF** | Full case pack export: lease analysis + action plan + letters as PDF |

### Month 12: Platform Hardening

| Feature | What it does |
|---|---|
| **Data Residency Controls** | Per-jurisdiction data sovereignty, deletion on request |
| **Role-Based Access** | Resident / Advisor / Admin / Super-admin permission tiers |
| **Audit Log Viewer** | Full transparency: every system action traceable |
| **API for Third Parties** | Let housing charities and law centres build on our engine |

---

## Acceptance Criteria (per month — measurable, executable)

> Each month has 3–5 acceptance conditions that *prove* the month is complete.
> Every condition is observable in the running system, the test suite, or a
> public artefact. Cross-references resolve to real files.

### Month 1: Resident Core (MVP) — done when…
- **Rights Checker live** — (1) `POST /api/rights-check` returns ≥ 3 personalised rights for any `(jurisdiction, issue)` pair; (2) every response includes ≥ 1 statute citation from [`src/data/spine.ts`](src/data/spine.ts:1); (3) test coverage in [`scripts/test-suite.ts`](scripts/test-suite.ts:1) for at least 5 `(jurisdiction, issue)` cases.
- **Lease Scanner live** — (1) `POST /api/lease-scan` returns ≥ 1 fairness verdict per clause with evidence class; (2) verdict confidence is capped at the corresponding `CONFIDENCE_CAP` value ([`src/lib/fairness.ts`](src/lib/fairness.ts:1)); (3) every verdict cites a real statute in the spine.
- **Service Charge Checker live** — (1) `POST /api/service-charge-check` flags any charge above the LTA 1985 s.19 "reasonableness" band; (2) flags missing s.20 consultation; (3) test suite covers 3 reference demands.
- **RTM Wizard live** — (1) `GET /api/rtm-eligibility/:jurisdiction` returns correct qualifying-tenant rule for UK (LFRA 2024 s.49, 50%); (2) wizard UI guides user through 4 steps; (3) final output includes a downloadable RTM notice template.
- **Action Plan Generator live** — (1) `POST /api/action-plan` produces a numbered step list with deadlines; (2) at least 1 template letter included; (3) test suite asserts the LTA 1985 s.20 30-day deadline appears when relevant.

### Month 2: Resident Core hardening — done when…
- **All Month-1 features have ≥ 1 end-to-end demo path** that a non-technical reviewer can walk in < 5 minutes (script in [`project/strategy/04-demo-video-script.md`](project/strategy/04-demo-video-script.md:1)).
- **Nav restructure shipped** — (1) "My Rights" is the primary nav item; (2) "Admin" is collapsed; (3) every old admin tab is reachable but de-emphasised.
- **Pilot-resident walkthroughs** — (1) all 50 synthetic residents in [`src/data/fixtures.ts`](src/data/fixtures.ts:1) produce ≥ 1 actionable rights-check result; (2) zero resident has an empty action plan; (3) sign-off rate ≥ 95% in the pilot-audit run.

### Month 3: Resident Dashboard + Community — done when…
- **My Case Dashboard live** — (1) shows N open issues per resident; (2) highlights items with deadlines within 7 days; (3) persisted across sessions.
- **Letter Templates live** — (1) ≥ 4 jurisdiction-specific templates (challenge service charge, request s.20 consultation, RTM notice, deposit dispute); (2) every template carries an evidence class; (3) downloadable as PDF.
- **Community Benchmarking live** — (1) shows median charge for similar buildings (k-anonymity ≥ 5 enforced); (2) no individual-resident rows; (3) honest "data sparse" label when cohort < 5.
- **Building Safety Checker live** — (1) BSA 2022 ss.80-82 ("Golden Thread") status surfaced; (2) remediation obligations listed per role; (3) high-risk building flag for ≥ 18m / ≥ 7 storeys.

### Month 4: Jurisdiction Admin — done when…
- **Compliance Monitor live** — (1) portfolio view shows compliance status per building; (2) red/amber/green coding matches the underlying evidence class; (3) drill-down shows evidence chain.
- **Case Volume Dashboard live** — (1) trends visible for RTM applications, service-charge disputes, safety issues; (2) date-range filter; (3) exportable as CSV.
- **Resident Activity Feed live** — (1) shows anonymised activity (no resident IDs in plain text); (2) ≥ 5 event types tracked; (3) opt-out honoured.
- **Regulatory Report Generator live** — (1) auto-drafts a compliance report from aggregated data; (2) carries the same evidence classes as the underlying data; (3) reviewable by admin before export.

### Month 5: Advisor Professional Tools — done when…
- **Case Outcomes Database live** — (1) searchable by issue type, outcome, jurisdiction; (2) ≥ 10 real cases indexed (from [`src/lib/enrichment.ts`](src/lib/enrichment.ts:1)); (3) every case carries provenance.
- **Bulk Lease Analysis live** — (1) accepts 10–50 leases in one upload; (2) returns ranked risk per lease; (3) processing < 60 seconds for 50 leases.
- **Statute Full-Text Search live** — (1) keyword search across all spine legislation; (2) ranked by relevance; (3) jump-to-section anchors work.
- **Research Engine live** — (1) produces structured briefs on demand; (2) every claim cited; (3) confidence capped at `heuristic` (per [`src/lib/fairness.ts`](src/lib/fairness.ts:1)).

### Month 6: Document Generation — done when…
- **Tribunal Application Drafter live** — (1) produces First-tier Tribunal application draft from case facts; (2) every cited section is from the spine; (3) draft marked "REVIEW REQUIRED — not legal advice".
- **RTM Company Pack live** — (1) generates company-formation docs; (2) includes a member register template; (3) articles-of-association template included.
- **Service Charge Schedule live** — (1) itemises chargeable vs non-chargeable items per LTA 1985 s.18; (2) flags potentially-prohibited items; (3) exportable as PDF.
- **Correspondence Trail live** — (1) auto-logs letters sent/received; (2) links to case timeline; (3) immutable audit record per [`src/generated/audit-entry.routes.ts`](src/generated/audit-entry.routes.ts:1).

### Month 7: Multi-Resident Coordination — done when…
- **Collective Action Hub live** — (1) shows RTM progress as N of M signed up; (2) k-anonymity ≥ 5 enforced on small buildings; (3) opt-in only.
- **Resident Voting live** — (1) secure voting on management decisions; (2) one-resident-one-vote enforced; (3) audit trail per vote.
- **Shared Document Vault live** — (1) upload/share lease docs with neighbours; (2) all PII scrubbed via [`src/lib/engines.ts`](src/lib/engines.ts:56) redaction protocol; (3) consent recorded per share.
- **Milestone Tracker live** — (1) collective deadlines surfaced (RTM notice period, s.20 response deadline, etc.); (2) email/notification reminder configurable; (3) per-jurisdiction rule sets.

### Month 8: Intelligence Layer — done when…
- **Legislative Change Monitor live** — (1) detects new UK SIs and Caribbean statutes; (2) explains "what changes for you" per jurisdiction; (3) every change carries an evidence class.
- **Anomaly Detection live** — (1) flags buildings whose charges deviate > 2σ from cohort; (2) k-anonymity ≥ 5 enforced; (3) anomaly explanations cite the data points.
- **Precedent Alerting live** — (1) monitors tribunal feeds (UK FTT, CCJ); (2) alerts residents when a similar case is decided; (3) alert carries citation + jurisdiction.
- **Market Intelligence live** — (1) insurance, valuation, climate-risk data surfaced; (2) land-focused (CoC §2-safe); (3) no per-resident profiling.

### Month 9: Mobile + Accessibility — done when…
- **Mobile-First Resident View live** — (1) all primary actions reachable in ≤ 3 taps; (2) readable on a 5" screen without horizontal scroll; (3) Lighthouse mobile score ≥ 90.
- **Multi-Language live** — (1) at least 2 Caribbean creoles supported (Bajan, Jamaican Patois); (2) statutory text remains in English with a translation glossary; (3) user can switch at runtime.
- **WCAG-AA compliant** — (1) full accessibility audit completed; (2) zero axe-core violations on primary flows; (3) screen-reader walkthrough recorded.
- **Offline Mode live** — (1) key documents saveable locally; (2) offline scan still produces a verdict (cached rules); (3) sync on reconnect without data loss.

### Month 10: Integration + Scale — done when…
- **Land Registry API Bridge live** — (1) HM Land Registry PPD accessible for UK; (2) at least 1 Caribbean registry reachable; (3) graceful failure when registry down.
- **Council Integration live** — (1) submit complaints/alerts to local housing authorities; (2) every submission logged; (3) delivery confirmation surfaced to resident.
- **Insurance Integration live** — (1) flags building insurance gaps; (2) suggests providers per jurisdiction; (3) no upsell pressure (advisory only).
- **Payment Gateway live** — (1) Powertranz integration functional; (2) service-charge payments supported per the prize brief; (3) PCI-scope limited (no PAN stored).

### Month 11: Analytics + Reporting — done when…
- **Resident Impact Report live** — (1) shows £X in unlawful charges recovered (real or honest pilot estimate); (2) every figure traceable to a dossier; (3) exportable as PDF.
- **Jurisdiction Scorecard live** — (1) compares jurisdictions on compliance, outcomes, speed; (2) methodology published; (3) k-anonymity ≥ 5 enforced.
- **Predictive Analytics live** — (1) flags buildings at higher unlawful-charge risk; (2) confidence capped at `heuristic`; (3) no per-resident prediction.
- **Export + PDF live** — (1) full case pack (lease analysis + action plan + letters) exportable; (2) PDF signed/dated; (3) bundle ≤ 10 MB.

### Month 12: Platform Hardening — done when…
- **Data Residency Controls live** — (1) per-jurisdiction data sovereignty enforced; (2) deletion-on-request honoured within 30 days; (3) residency proof in audit trail.
- **Role-Based Access live** — (1) Resident / Advisor / Admin / Super-admin tiers; (2) permission matrix documented; (3) deny-by-default on unknown roles.
- **Audit Log Viewer live** — (1) every system action traceable; (2) immutable per [`src/generated/audit-entry.routes.ts`](src/generated/audit-entry.routes.ts:1); (3) exportable as JSON.
- **API for Third Parties live** — (1) public API documented; (2) auth via scoped keys; (3) rate-limited per key.

### Cross-month "always-on" acceptance gates (run before any month is signed off)
1. `node --experimental-strip-types scripts/reconcile-docs.ts` → **10/10 PASS** (no new drifts introduced)
2. `node --experimental-strip-types scripts/test-suite.ts` → **159/159 PASS** (no regressions)
3. Pilot audit ([`project/pilot-audit/pilot-audit-report.md`](project/pilot-audit/pilot-audit-report.md:1)) → no `rejected` dossiers

These three are the *non-negotiable* gates. A month is "done" only when all
three pass *plus* the month-specific criteria above.

---

## What Gets Retired or Demoted

| Current tab | Action | Reason |
|---|---|---|
| Command Post | Move to Admin section | Competition meta, not product |
| Competition | Move to Admin section | Competition meta, not product |
| Data Spine | Move to About/Technical | Architecture reference, not user tool |
| Assurance | Merge into Admin | Internal verification metrics |
| Gates Tool | Move to Admin | Content quality sweep, not user tool |
| Communes | Evaluate: keep or retire | Experimental, unclear user value |
| Research Desk | Rebuild as Advisor tool | Current version is static display |
| Dossier Explorer | Rebuild as Lease Scanner | Current version browses synthetics, not user data |

---

## Priority Order for Demo (Aug 16)

If we need to show the product to judges on Aug 16, the **demo MUST show:**

1. **Lease Scanner** — paste a lease, watch it get annotated in real-time with citations and confidence caps (this IS the product thesis made visible)
2. **Rights Checker** — resident enters their situation, gets a personalized action plan
3. **RTM Wizard** — step-by-step eligibility check
4. **Agent Loop Canvas** — the system visibly thinking (from UX vision doc, keep this)
5. **Sign-off Queue** — HITL approval visible (satisfies CoC 4, shows responsible AI)

These 5 things prove the product works for residents AND demonstrates the agentic architecture. Everything else supports the story.

---

## Architecture Note

The engines already exist:
- `fairness.ts` — lease clause analysis (14 rules, UK + Caribbean)
- `consensus.ts` — 3-tier verification gate
- `veracity.ts` — evidence classification
- `enrichment.ts` — tribunal decisions + advisory guidance
- `knowledge-graph.ts` — cross-jurisdiction mapping
- `reconciliation.ts` — multi-source truth resolution
- `agents.ts` — multi-agent orchestration
- `spine.ts` — 19+ statute-anchored rights

**The backend is 80% built.** What's missing is the PRODUCT LAYER that surfaces these engines to actual users. Every new component above is a thin UI over existing logic.
