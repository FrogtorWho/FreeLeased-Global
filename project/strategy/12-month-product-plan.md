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
