# FreeLeased — Top-Down vs Bottom-Up Reconciliation
# Comprehensive Scoring Analysis & Capability Buildout

**Date:** 6 August 2026 · **Status:** Strategic pivot document
**Companions:** `judge-panel-analysis.md`, `pre-mortem-and-gaps.md`, `top-down-vs-bottom-up.md`

---

## PART 1: Top-Down vs Bottom-Up Reconciliation

### What the competition ACTUALLY scores (derived from official docs + hidden emphasis)

The FC Buildathon uses a **shared rubric across tracks** with these visible pillars:

| Pillar | Official Weight | Our Self-Score | Reality Check |
|--------|----------------|---------------|---------------|
| Business Strength | 50% | 8.4 | Inflated — solo founder, no signed MoUs, no real users |
| Team Quality | ~17% | 9.0 | Agentic swarm is novel but untested as "team" |
| Product Innovation | ~17% | 9.5 | Genuinely novel — no direct competitor |
| Product-Market Fit | ~17% | 9.5 | TAM/SOM are projections, not revenues |
| Agentic AI Excellence | 50% | 9.0 | Architecture is sound but multi-agent coordination not demonstrated live |
| Architecture Quality | ~8% | 9.5 | Verified — 4 engines, clean separation |
| Multi-Agent/Orchestration | ~8% | 9.5 | 5 named agents, but agent-to-agent handoff is planned, not live |
| Human-in-the-Loop | ~8% | 10 | Core thesis, verified in code |
| Efficiency | ~8% | 10 | $0 compute, verified |
| Real Impact | ~8% | 9.5 | No real users yet — only synthetic |
| Scale | ~8% | 10 | Jurisdiction-agnostic, proven architecture |

### Hidden emphasis detected from docs (NOT in the rubric)

Analysis of the Founding 100 roster, Code of Conduct, and submission requirements reveals emphasis the rubric doesn't name but judges implicitly score:

| Hidden Signal | Source Doc | Weight (estimated) | Our Status |
|--------------|-----------|-------------------|-----------|
| **Responsible AI compliance** | CoC §2-§5 | DQ if missing | ✅ Retired adversary layer, compliance statement written |
| **Open-source license** | Submission requirements | Mandatory | ✅ Apache 2.0 planned |
| **Live demo (cold-start safe)** | FAQ, judging process | Critical | ⚠️ Preview URL can die; need published URL |
| **Demo video (3-5 min)** | Submission requirements | ~15% implicit | ⚠️ Script written, not recorded |
| **GitHub repo with setup** | Submission requirements | Mandatory | ⚠️ README drafted, repo not public |
| **Synthetic data marked** | CoC §5 | DQ if missing | ⚠️ Some fixtures say "synthetic", demo doesn't |
| **Overclaiming risk** | Integrity (Fong, Romanow) | DQ-adjacent | 🔴 MoUs are drafts, pilot is synthetic |
| **Build-in-public narrative** | Portal encouragement | Bonus | ✅ 11 days of journal + social |
| **Data attribution (ODbL)** | OSM/Overture license | Legal | ⚠️ Attribution surface not yet built |

### Reconciliation verdict

Our self-scores are **0.5-1.0 points too high** across the board. Adjusted scores:

| Dimension | Self-Score | Adjusted | Reason |
|-----------|-----------|---------|--------|
| Team Quality | 9.0 | 7.5 | Solo founder is real; agent swarm is a narrative, not a team |
| Product Innovation | 9.5 | 9.0 | Genuinely novel, but unproven at scale |
| Product-Market Fit | 9.5 | 7.5 | No real users, no signed MoUs, no revenue |
| Architecture | 9.5 | 9.5 | Verified in code |
| Multi-Agent | 9.5 | 7.0 | Agent-to-agent handoff not demonstrated live |
| HITL | 10 | 9.0 | Built in code, not demonstrated with real resident |
| Efficiency | 10 | 10 | Verified — $0 compute |
| Real Impact | 9.5 | 6.5 | Only synthetic data, no real-world impact yet |
| Scale | 10 | 8.0 | Architecture supports it; no evidence of scaling |
| **Average** | **9.5** | **8.1** | |

**Key insight:** We're strong on architecture and efficiency, weak on proof and team narrative. The next 10 days must close those gaps, not build more features.

---

## PART 2: Expanded Scoring Criteria (60 dimensions)

### Category A: Business Strength (50% of total)

| # | Dimension | Weight | Current | Target | Gap | Fix By |
|---|----------|--------|---------|--------|-----|--------|
| A1 | Revenue model clarity | 5% | 7 | 9 | Pricing page live, unit economics defended | Day 12 |
| A2 | Unit economics (CAC/LTV) | 5% | 8 | 9 | Need willingness-to-pay evidence | Day 14 |
| A3 | Market sizing (TAM/SAM/SOM) | 4% | 8 | 8 | Methodology documented | Done |
| A4 | Competitive landscape | 3% | 9 | 9 | White space confirmed | Done |
| A5 | Moat / defensibility | 4% | 9 | 9 | Data spine + provenance chain | Done |
| A6 | Go-to-market strategy | 3% | 7 | 8 | GTM doc exists but unvalidated | Day 13 |
| A7 | Revenue path (Year 1-3) | 3% | 7 | 8 | Projections documented | Day 13 |
| A8 | Policy tailwind | 2% | 9 | 9 | LFRA 2024 cited | Done |
| A9 | Caribbean market data | 2% | 8 | 9 | 8 jurisdictions mapped, data per unit | Done |
| A10 | Monetisation fairness | 2% | 9 | 9 | Free tier for residents | Done |
| A11 | Partnership pipeline | 3% | 6 | 8 | MoUs drafted but not signed | Day 13 |
| A12 | Investor readiness | 2% | 6 | 8 | Deck not investor-grade yet | Day 15 |
| A13 | Financial projections | 3% | 5 | 7 | P&L not modelled | Day 14 |
| A14 | Risk register | 2% | 8 | 8 | Pre-mortem comprehensive | Done |
| A15 | Exit / scale strategy | 2% | 7 | 8 | 4 corridors identified | Done |

### Category B: Team Quality (17% of total)

| # | Dimension | Weight | Current | Target | Gap | Fix By |
|---|----------|--------|---------|--------|-----|--------|
| B1 | Founder credibility | 5% | 8 | 8 | 10+ yrs finance, domain expertise | Done |
| B2 | Domain expertise | 4% | 9 | 9 | Leasehold law, Caribbean policy | Done |
| B3 | Technical capability | 3% | 9 | 9 | Live product, 65/67 tests | Done |
| B4 | Team breadth (named) | 3% | 5 | 7 | Solo founder; need advisory quotes | Day 14 |
| B5 | Execution evidence | 2% | 8 | 9 | 11-day sprint, daily deliverables | Done |

### Category C: Product Innovation (17% of total)

| # | Dimension | Weight | Current | Target | Gap | Fix By |
|---|----------|--------|---------|--------|-----|--------|
| C1 | Technical novelty | 4% | 9 | 9 | Deterministic-first architecture | Done |
| C2 | Deterministic vs LLM approach | 3% | 10 | 10 | $0 compute, proven in tests | Done |
| C3 | Data spine design | 3% | 9 | 9 | 9 jurisdictions, provenance tracked | Done |
| C4 | Consensus gate innovation | 3% | 9 | 9 | Live demo, API verified | Day 12 |
| C5 | Evidence-class system | 2% | 9 | 9 | Admiralty/NATO grading, tested | Done |
| C6 | Redaction protocol | 2% | 8 | 8 | Built, tested in synthetic pilot | Done |

### Category D: Product-Market Fit (17% of total)

| # | Dimension | Weight | Current | Target | Gap | Fix By |
|---|----------|--------|---------|--------|-----|--------|
| D1 | Problem clarity | 4% | 9 | 9 | 4.6M UK + 308K Caribbean | Done |
| D2 | User evidence | 4% | 5 | 7 | Only synthetic pilot | Day 14 |
| D3 | Willingness-to-pay | 3% | 6 | 7 | No pricing validation | Day 14 |
| D4 | Regulatory fit | 3% | 9 | 9 | CoC compliant, responsible AI | Done |
| D5 | Accessibility (WCAG) | 3% | 6 | 7 | Basic accessibility, not audited | Day 15 |

### Category E: Agentic AI Excellence (50% of total)

| # | Dimension | Weight | Current | Target | Gap | Fix By |
|---|----------|--------|---------|--------|-----|--------|
| E1 | Agent architecture | 8% | 9 | 9 | 5 agents, clear roles | Done |
| E2 | Agent-to-agent coordination | 8% | 6 | 8 | Not demonstrated live | Day 14 |
| E3 | HITL design | 8% | 10 | 10 | Core thesis, verified | Done |
| E4 | Efficiency ($0 compute) | 8% | 10 | 10 | Deterministic, local SQLite | Done |
| E5 | Real impact | 8% | 6 | 7 | No real-world deployment | Day 14 |
| E6 | Scale architecture | 5% | 9 | 9 | Jurisdiction-agnostic spine | Done |
| E7 | Orchestration quality | 5% | 8 | 9 | Agent team live in app | Day 14 |

---

## PART 3: Weak Area Analysis & Capability Buildout

### Critical weak areas (🔴 must fix)

**W1. No real users** — Every judge will ask: "Has anyone actually used this?"
- **Fix:** Run the synthetic audit with a real volunteer (even 1 person). Document the session. Record it.
- **Owner:** Sam + Agent
- **Due:** Day 14

**W2. Agent-to-agent coordination not demonstrated** — We claim 5 agents but only show them as static cards
- **Fix:** Build a live agent coordination view showing real message passing between agents
- **Owner:** Agent
- **Due:** Day 14

**W3. MoUs are drafts, not signed** — Risk of overclaiming (pre-mortem G3)
- **Fix:** State "MoU letters drafted, pending government review" everywhere. Never imply signed.
- **Owner:** Sam
- **Due:** Now

### Major weak areas (🟠 should fix)

**W4. No willingness-to-pay evidence** — PMF caps at 7 without it
- **Fix:** Run 3 quick interviews (10 min each) with UK leaseholders. Ask: "Would you pay £10/mo for this?"
- **Owner:** Sam
- **Due:** Day 14

**W5. Demo video not recorded** — Judges watch this more than the app
- **Fix:** Record Day 15 after dry run. Caption it. Host on YouTube (unlisted).
- **Owner:** Sam
- **Due:** Day 15-16

**W6. No published URL** — Preview URL can die on cold start
- **Fix:** Publish to *.shogo.one. Warm it 24h before judging.
- **Owner:** Agent
- **Due:** Day 14

### Polish areas (🟡 nice to have)

**W7. i18n design** — Caribbean = multilingual
- **Fix:** Add language selector placeholder in UI. Note: "English-first, i18n designed".
- **Due:** Day 15

**W8. WCAG-AA audit** — Credibility signal for housing product
- **Fix:** Run axe accessibility audit. Fix critical issues.
- **Due:** Day 15

**W9. Q&A kill-list** — 10 hardest questions rehearsed
- **Fix:** Write the 10 questions + crisp answers.
- **Due:** Day 14

---

## PART 4: Trajectory Deviation Log

### What changed from original proposal → why

| Change | Original Plan | Current Approach | Reason |
|--------|--------------|-----------------|--------|
| **Adversary layer removed** | ThreatLab/IntelProtocols for manipulation detection | Retired per CoC compliance | CoC §2 bans systems "developed for" manipulation profiling. Pre-mortem G1 = DQ risk. |
| **Focus pivoted to leasehold** | Residential tenancy (deposit caps, banned fees) | Leasehold governance (RTM, enfranchisement, s.20) | UK tenancy rules were wrong sub-domain for Caribbean. Leasehold fits Track 9. |
| **Deterministic-first, not LLM-first** | Use Impala inference for all analysis | $0 deterministic engine + RAG-agentic fallback | Impala key arrived late (Day 10). But the design turned out better: deterministic = $0 = reproducible. |
| **Solo + agent swarm, not team** | Build a traditional startup team | 5 AI agents as "team members" | Solo founder reality + agent swarm is itself the demonstration of agentic AI. |
| **Jurisdiction scope expanded** | UK only | 9 jurisdictions (UK + 8 Caribbean) | Caribbean is the competition focus. UK is the provenance anchor. |
| **Data spine, not data API** | Build APIs to registries | Assemble spine from public sources | No Caribbean land-data APIs exist. Provenance-tracked spine became the moat. |
| **Consensus gate added** | Not in original plan | Codified + agentic + human validation | Prevents hallucination. CoC compliance. Judges value HITL. |
| **Evidence classes added** | Not in original plan | Admiralty/NATO grading on every claim | Honest confidence capping. Differentiator for trust. |
| **Pilot switched to synthetic** | Real leaseholder pilot | Synthetic UK AST | No real leaseholder available in sprint. Synthetic is honest and documented. |

### How to explain these to judges

"We started with an LLM-first approach and a narrower domain. Three things forced us to adapt:

1. **The CoC forced honesty.** Our original intelligence layer sat too close to prohibited practices. We retired it and reframed as purely defensive + transparent.

2. **The Caribbean forced scope.** UK tenancy rules don't map to Caribbean condominium law. We pivoted to leasehold governance — the right domain for the right track.

3. **The data forced architecture.** When we discovered no Caribbean land-data APIs exist, we built a provenance-first spine instead. The workaround became the moat.

Every change improved the product. The constraints were the design."

---

## PART 5: SCRUM/Prince2 Project Management Framework

### Sprint structure (Aug 7–16)

```
═══════════════════════════════════════════════════════════════════
SPRINT 2 (Aug 7-9)  │  SPRINT 3 (Aug 10-12)  │  SPRINT 4 (Aug 13-15)
═══════════════════════════════════════════════════════════════════
MoU follow-ups       │  Social cadence         │  Code freeze (T-2)
Advisory outreach    │  Agent coordination     │  Dry run #1
Compliance pass      │  Content generation     │  Final QA
Real user pilot      │  Demo video record      │  Publish URL
QA test pass         │  GitHub public          │  Dry run #2
Risk mitigation      │  Accessibility audit    │  Last fixes
                     │  i18n placeholder       │
═══════════════════════════════════════════════════════════════════
DAILY: standup (9:00) → build → review (18:00) → retrospective
```

### Prince2 tailoring for a solo founder + agent team

| Prince2 Element | How We Tailor |
|----------------|---------------|
| **Business Case** | Pre-mortem + scoring analysis (this document) |
| **Organisation** | Sam (executive), Agent (build + QA), Sub-agents (specialist tasks) |
| **Plans** | Sprint backlogs in Competition tab → Task List |
| **Quality** | 65/67 tests, tsc clean, craft review, accessibility audit |
| **Risk** | Pre-mortem register (G1-G18), updated daily |
| **Change** | Trajectory deviation log (this document) |
| **Progress** | Daily memory log (memory/YYYY-MM-DD.md), competition tab metrics |
| **Stage gates** | Code freeze (Day 14), Dry run #1 (Day 15), Dry run #2 (Day 15), Submit (Day 16) |

### Daily standup format (in memory/)

```
## Standup — [date]

### Done yesterday
- [list]

### Doing today
- [list]

### Blockers
- [list]

### Velocity
- Tests: N/67 passing
- Tasks: N completed / N total
- Days remaining: N
```

---

## PART 6: OAuth + Permissions + Analytics/CRM Infrastructure Plan

### OAuth-based access control

| Layer | What | How | Priority |
|-------|------|-----|----------|
| **App auth** | User sign-up/in | Shogo SDK auth (email+password) | Day 12 |
| **Role-based access** | Resident / Auditor / Admin | Prisma `UserRole` model + middleware | Day 13 |
| **API permissions** | Who can call what endpoint | Hono middleware checking session role | Day 13 |
| **Data isolation** | Per-user audit records | `userId` foreign key on all models | Day 13 |
| **Admin panel** | View all audits, manage users | New tab in Competition or separate route | Day 15 |

### Analytics / CRM integration plan

| System | Purpose | Integration | Priority |
|--------|---------|-------------|----------|
| **Audit trail** | Track all lease analyses | Prisma `AuditEntry` model (already exists) | Day 12 |
| **Usage metrics** | How many audits, by jurisdiction | Custom dashboard in Competition tab | Day 14 |
| **MoU tracker** | Partnership pipeline status | Competition → Content subtab | Day 12 |
| **Sponsor engagement** | Track Impala/Highrise/NoInfra usage | Manual + API call logs | Day 14 |
| **Judge sentiment** | Track which dimensions resonate | Post-demo feedback form | Day 16 |

### Prisma models to add

```prisma
model UserRole {
  id        String   @id @default(cuid())
  userId    String
  role      String   // "resident" | "auditor" | "admin"
  createdAt DateTime @default(now())
}

model AuditSession {
  id          String   @id @default(cuid())
  userId      String
  jurisdiction String
  inputText   String
  result      Json     // full dossier output
  status      String   @default("pending") // pending | reviewed | approved | rejected
  createdAt   DateTime @default(now())
}

model MoUPipeline {
  id          String   @id @default(cuid())
  agency      String
  country     String
  status      String   @default("drafted") // drafted | sent | acknowledged | signed
  sentAt      DateTime?
  signedAt    DateTime?
  createdAt   DateTime @default(now())
}
```

---

## PART 7: Implementation Roadmap (Visual)

### Phase Overview

```
Jul 27 ──────── Aug 6 ──────── Aug 9 ──────── Aug 12 ──────── Aug 14 ──────── Aug 16
│  FOUNDATION   │  PRODUCT     │  PROOF        │  POLISH       │  FREEZE  │ SUBMIT
│               │              │               │               │          │
│ Spine v1      │ Engines live │ Real pilot    │ Demo video    │ No new   │ LIVE
│ 25+ statutes  │ 65/67 tests  │ MoU sent      │ GitHub public │ features │ DEMO
│ Consensus     │ Live demo    │ Advisory out  │ i18n + a11y   │ QA pass  │
│ Veracity      │ Fairness     │ Compliance    │ Dry run #1    │ Published│
│ Fairness      │ GitHub prep  │ Agent coord   │ Pitch deck    │ URL warm │
```

### Detailed task matrix (Gantt-style)

| Task | Owner | Start | End | Dependencies | Status |
|------|-------|-------|-----|-------------|--------|
| MoU follow-up emails | Sam | Aug 7 | Aug 8 | MoU letters drafted | 🔴 Do now |
| Advisory outreach (3 targets) | Agent | Aug 7 | Aug 8 | Brief 03 | 🔴 Do now |
| App auth (OAuth) | Agent | Aug 7 | Aug 9 | None | 🔴 Do now |
| Role-based access | Agent | Aug 8 | Aug 9 | Auth | ⏳ Next |
| Real user pilot (1 leaseholder) | Sam | Aug 9 | Aug 11 | Synthetic pilot proven | 📋 Plan |
| Compliance final pass | Agent | Aug 9 | Aug 10 | Draft exists | 📋 Plan |
| Agent coordination demo | Agent | Aug 9 | Aug 11 | Agent models exist | 📋 Plan |
| Social cadence (daily) | Sam | Aug 7 | Aug 16 | Posts drafted | 📋 Plan |
| Content generation automation | Agent | Aug 10 | Aug 11 | None | 📋 Plan |
| GitHub repo public | Sam | Aug 11 | Aug 12 | README, LICENSE | ⏳ Next |
| Demo video recording | Sam | Aug 12 | Aug 13 | Dry run, script | 📋 Plan |
| i18n placeholder | Agent | Aug 12 | Aug 13 | None | 📋 Plan |
| WCAG audit + fixes | Agent | Aug 13 | Aug 14 | None | 📋 Plan |
| Accessibility fixes | Agent | Aug 13 | Aug 14 | Audit | 📋 Plan |
| Publish to *.shogo.one | Agent | Aug 13 | Aug 14 | Build clean | 📋 Plan |
| Code freeze | Sam | Aug 14 | Aug 14 | All features done | 📋 Plan |
| Dry run #1 | Sam | Aug 14 | Aug 14 | Video, pitch | 📋 Plan |
| Dry run #2 | Sam | Aug 15 | Aug 15 | Dry run #1 fixes | 📋 Plan |
| Final QA | Agent | Aug 14 | Aug 15 | Code freeze | 📋 Plan |
| Submit | Sam | Aug 16 | Aug 16 | Everything | 📋 Plan |

### Risk heat map

```
HIGH IMPACT ┃ G5 Published URL ┃ G6 Demo video  ┃ G10 Team quality ┃
            ┃ G4 Kill switch   ┃ G9 Bias eval   ┃ G7 Unit econ     ┃
────────────╋──────────────────╋────────────────╋──────────────────╋──────
MED IMPACT  ┃ G2 Synthetic mark┃ G8 Data license┃ G13 i18n         ┃
            ┃ G12 Brand        ┃ G17 Disclaimer ┃ G15 WCAG         ┃
────────────╋──────────────────╋────────────────╋──────────────────╋──────
LOW IMPACT  ┃ G11 Early submit ┃ G14 Q&A list   ┃ G16 Min viable   ┃
            ┃                  ┃                ┃                   ┃
────────────┴──────────────────┴────────────────┴──────────────────┴──────
            ┃  NOW (Aug 7-9)   ┃  SOON (10-12) ┃  LAST (13-15)    ┃
```

---

## PART 8: Five New Frontend Concepts

### Concept 1: "Resident Portal" — Mobile-First Lease Reader

**View:** Mobile portrait (9:16). The core resident experience.

```
┌─────────────────────────────┐
│ ☰  FreeLeased          👤   │
├─────────────────────────────┤
│                             │
│  📄 Your Lease Audit        │
│  ─────────────────          │
│                             │
│  Upload or paste your       │
│  lease agreement:           │
│                             │
│  ┌───────────────────────┐  │
│  │  📸 Scan  📎 Upload   │  │
│  │  ✏️ Paste             │  │
│  └───────────────────────┘  │
│                             │
│  ──── Your Rights ────      │
│                             │
│  🔴 3 urgent issues found   │
│  🟡 2 advisories            │
│  🟢 8 compliant clauses     │
│                             │
│  [View Full Report →]       │
│                             │
│  ──── Quick Check ────      │
│                             │
│  "Can my landlord enter     │
│   without notice?"          │
│                             │
│  ✓ Yes, but only in        │
│    emergencies (s.11 LTA)   │
│                             │
│  [Ask Another Question]     │
│                             │
├─────────────────────────────┤
│ 🏠  📊  ⚙️  ℹ️              │
└─────────────────────────────┘
```

**Features:** Camera scan (OCR), paste text, AI-powered Q&A, rights summary with severity colour coding. Responsive: 320px → 8K 16:9.

### Concept 2: "Auditor Console" — Desktop Dashboard

**View:** Desktop landscape (16:9). For property managers and legal professionals.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ FreeLeased Auditor Console                          [Role: Auditor]  ⚙️ │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─── Active Audits ───┐  ┌─── Pipeline ───┐  ┌─── Compliance ────┐   │
│  │ 🔴 12 pending       │  │ 📤 3 sent      │  │ ✅ 89% compliant  │   │
│  │ 🟡 5 in review      │  │ ✅ 7 signed    │  │ ⚠️ 4 at risk      │   │
│  │ 🟢 89 completed     │  │ 📋 2 drafted   │  │ 🔴 1 non-comply   │   │
│  └─────────────────────┘  └─────────────────┘  └───────────────────┘   │
│                                                                          │
│  ┌─── Audit Queue (sortable) ─────────────────────────────────────────┐ │
│  │ # │ Tenant     │ Jurisdiction │ Score │ Status    │ Actions        │ │
│  │ 1 │ A. Morgan  │ BB           │ 72/100│ 🔴 Review│ [View] [Approve]│ │
│  │ 2 │ K. James   │ JM           │ 85/100│ 🟡 Draft │ [View] [Edit]  │ │
│  │ 3 │ L. Chen    │ KY           │ 91/100│ 🟢 Done  │ [View] [Export]│ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─── Chart: Audits by Jurisdiction ──┐  ┌─── Consensus Gate ────────┐ │
│  │  ████████ BB (34)                  │  │  Codified vs Agentic:     │ │
│  │  ██████   JM (21)                 │  │  ✅ Aligned: 82%          │ │
│  │  ████     KY (15)                 │  │  ⚠️ Divergent: 14%        │ │
│  │  ██       TT (7)                  │  │  🔄 Review: 4%            │ │
│  └────────────────────────────────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

**Features:** Sortable/paginated table, jurisdiction heat map, consensus gate status, bulk actions, role-based filtering.

### Concept 3: "Sovereign Console" — Government Agency View

**View:** Tablet landscape (4:3) or desktop. For MoU partner agencies.

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏛️  FreeLeased Sovereign Console — Barbados Land Tax Department  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─── Jurisdiction Health ─────────────────────────────────────┐ │
│  │                                                             │ │
│  │  📊 Statutes loaded: 47   │ 📊 Sources verified: 52       │ │
│  │  📊 Maturity: TIER 2     │ 📊 Last updated: 2 Aug 2026    │ │
│  │  📊 Confidence: HIGH     │ 📊 Pending review: 3           │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─── Resident Impact ─────┐  ┌─── Compliance Dashboard ─────┐ │
│  │ Audits completed: 34    │  │ s.20 compliance: 87%         │ │
│  │ Rights discovered: 156  │  │ Deposit violations: 12%      │ │
│  │ Hidden rights found: 89 │  │ RTM eligible: 23%            │ │
│  │ Avg fairness score: 72  │  │ Forfeiture risk: 8%          │ │
│  └──────────────────────────┘  └──────────────────────────────┘ │
│                                                                  │
│  ┌─── Data Provenance ─────────────────────────────────────────┐ │
│  │ Source          │ Tier    │ Last Verified │ Status          │ │
│  │ CLRA 2002       │ Tier 1  │ 1 Aug 2026    │ ✅ Current      │ │
│  │ LTA 1985        │ Tier 1  │ 1 Aug 2026    │ ✅ Current      │ │
│  │ BSA 2022        │ Tier 1  │ 3 Aug 2026    │ ✅ Current      │ │
│  │ OSM Overpass    │ Tier 1.5│ 5 Aug 2026    │ ✅ Current      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Features:** Jurisdiction-level analytics, data provenance tracker, compliance dashboard, government-specific KPIs, export for official use.

### Concept 4: "Competition Command Centre" — Optimised for Judging

**View:** Desktop ultrawide (21:9) or split-screen. All competition metrics in one view.

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ FreeLeased Command Centre — Sprint Day 11/21                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────┤
│ ┌─── Sprint Velocity ──────┐ │ ┌─── Live Demo Status ──────────────────────────┐  │
│ │ Tasks: 14/17 done (82%)  │ │ │ Sweep: ✅ Working                             │  │
│ │ Tests: 65/67 passing     │ │ │ Fairness: ✅ Working                          │  │
│ │ Days left: 10            │ │ │ Consensus: ✅ Working                         │  │
│ │ Code freeze: Aug 14      │ │ │ Cold-start: ⚠️ Need published URL             │  │
│ └──────────────────────────┘ │ └───────────────────────────────────────────────┘  │
│                              │                                                     │
│ ┌─── Rubric Self-Score ───┐ │ ┌─── Risk Register ─────────────────────────────┐  │
│ │ Business:   7.5/10 (adj)│ │ │ 🔴 G1: Overclaiming (MoUs = drafts)           │  │
│ │ Team:       7.5/10      │ │ │ 🔴 G5: No published URL                       │  │
│ │ Innovation: 9.0/10      │ │ │ 🟠 G6: Demo not recorded                      │  │
│ │ PMF:        7.5/10      │ │ │ 🟠 G7: Unit economics unvalidated             │  │
│ │ Agentic:    8.5/10      │ │ │ 🟡 G13: i18n not started                      │  │
│ │ Average:    8.0/10      │ │ │ 🟡 G15: WCAG not audited                      │  │
│ └──────────────────────────┘ │ └───────────────────────────────────────────────┘  │
│                              │                                                     │
│ ┌─── Agent Team Status ───┐ │ ┌─── Submission Checklist ──────────────────────┐  │
│ │ 🟢 fl-craft-review: OK  │ │ │ ☐ GitHub public + README                      │  │
│ │ 🟢 fl-verify: OK        │ │ │ ☐ LICENSE (Apache 2.0)                        │  │
│ │ 🟢 fl-dataviz: OK       │ │ │ ☐ Demo video (3-5 min)                        │  │
│ │ 🟢 fl-schema: OK        │ │ │ ☐ Compliance statement                        │  │
│ │ 🟢 fl-integrations: OK  │ │ │ ☐ Published URL (warmed)                       │  │
│ └──────────────────────────┘ │ ☐ Live demo tested cold                        │  │
│                              │ ☐ Q&A kill-list rehearsed                      │  │
│                              │ ☐ Pitch deck final                             │  │
│                              │ └───────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────┘
```

### Concept 5: "Resident Mobile" — Progressive Web App (PWA)

**View:** Mobile portrait (9:16), offline-capable PWA.

**Key design principles:**
- **Thumb-zone navigation** — primary actions in the bottom third
- **Offline-first** — cached lease analysis available without network
- **Push notifications** — "Your audit is ready" / "New right discovered"
- **Camera integration** — scan lease documents directly
- **Share sheet** — share audit results as PDF with solicitor
- **Accessibility** — screen reader optimised, high contrast, large touch targets

**Responsive breakpoints:**

| Breakpoint | Width | Layout | Target |
|-----------|-------|--------|--------|
| XS | 320px | Single column, stacked | Old mobile |
| SM | 375px | Single column, optimised | iPhone SE |
| MD | 768px | Two column | iPad |
| LG | 1024px | Three column | Desktop |
| XL | 1440px | Full dashboard | Large desktop |
| 2K | 2560px | Expanded dashboard | QHD monitor |
| 4K | 3840px | Ultra-wide | 4K display |
| 8K | 7680px | Full canvas | 8K display |

**Aspect ratios:** 9:16 (mobile portrait), 16:9 (desktop landscape), 4:3 (tablet), 21:9 (ultrawide), 1:1 (square/compact).

---

*This document is the single source of truth for strategic alignment. Update it daily.*
