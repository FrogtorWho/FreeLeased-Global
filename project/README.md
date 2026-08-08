# FreeLeased — Project Index

Working set for the Future Caribbean Buildathon submission.

## What it does

Open-source, local-first, resident-led **leasehold governance** platform.
Automates UK RTM + enfranchisement + service-charge audit + building-safety compliance.
Adapts to Caribbean condo law (Cayman/Barbados/Jamaica).

## Quick links

| Area | File | What |
|---|---|---|
| **Principles** | `FREELEASED-PRINCIPLES.md` | 8 locked build rulings |
| **Memory** | `MEMORY.md` | Active state + competition facts |
| **Plan** | `project/project-plan.md` | Timeline, deliverables, checklist |
| **Story** | `project/story/hackathon-story-journal.md` | Public narrative |
| **Truth** | `project/strategy/truth-protocol.md` | Epistemics engine |
| **Legal** | `project/strategy/multi-jurisdiction-legal-spine.md` | UK + Caribbean coverage |
| **Judges** | `project/strategy/judge-panel-analysis.md` | Panel, rubric, strategy |

## Engine code (`src/lib/`)

| Module | Purpose | Tests |
|---|---|---|
| `consensus.ts` | Alignment gate (deterministic) | 18/18 |
| `fairness.ts` | Lease & Contract fairness check | 13/13 |
| `veracity.ts` | Truth Protocol (Admiralty grading) | 22/22 |
| `reconciliation.ts` | Parallel analysis + investigation | 14/14 |
| `knowledge-graph.ts` | Cross-jurisdiction relationships | 12/12 |
| `agents.ts` | Multi-agent orchestrator (HITL) | 10/10 |
| `enrichment.ts` | Similar-case + bridging framework | 8/8 |
| `federation.ts` | Multi-source fusion | 8/8 |
| `vlm-pipeline.ts` | Document classification + extraction | 10/10 |
| `offline.ts` | Offline queue + local store + sync | 12/12 |
| `learning.ts` | Adaptive improvement | 8/8 |
| `telemetry.ts` | Audit trace spans | 9/9 |
| `loop.ts` | 10/10 scoring loop | core |
| `engines.ts` | Dossier + redaction + commune | core |
| `research.ts` | Verification pipeline | 2/2 |
| `gates.ts` | PII + UK-English + AI-tell gates | 3/3 |

**Total: 142/142 tests passing.**

## UI components (`src/components/auri/`)

| Component | Purpose |
|---|---|
| `Overview.tsx` | Dashboard with key metrics |
| `RightsCatalogue.tsx` | Browse statutory rights by jurisdiction |
| `RightsChecker.tsx` | Check a specific right against facts |
| `ServiceChargeChecker.tsx` | Analyse service charge documents |
| `RTMWizard.tsx` | Step-by-step RTM eligibility guide |
| `LeaseScanner.tsx` | Scan lease for fairness issues |
| `CommunityHub.tsx` | Collective action (tasks, votes, messages, docs, milestones) |
| `Competition.tsx` | Sprint operations (task queue, approvals, integrations, rubric, judges) |
| `CommandPost.tsx` | Live countdown + sprint metrics |
| `ResearchDesk.tsx` | Research task management |
| `GatesTool.tsx` | Run PII/UK-English/AI-tell gates |
| `ScalabilityPanel.tsx` | Multi-jurisdiction expansion roadmap |

## API (`custom-routes.ts`)

Live endpoints: `/api/summary`, `/api/consensus`, `/api/fairness/check`, `/api/reconciliation/run`, `/api/research-tasks`, `/api/competition/seed`, `/api/resident-groups`.

## Tests

Run: `bun scripts/test-suite.ts`

Individual modules: `bun scripts/test-*.ts` (consensus, fairness, veracity, reconciliation, knowledge-graph, agents, enrichment, federation, vlm-pipeline, offline, learning, telemetry).

## Competition

- **Deadline:** 16 Aug 2026 (LIVE DEMOS + judging)
- **Internal:** 14 Aug (T-2 buffer)
- **Judges:** Pseudonymized (Judge Venture/Brand/Operations/Legal/Impact)
- **Prizes:** 1st $25k, 2nd $15k, 3rd $10k + OWC systems + NYSE pitch

## Archive

Historical files moved to `_archive/`:
- `_sentinel_drop/` — retired adversary/ThreatLab data (CoC compliance)
- `_handoff/` — old docs with real judge names, v2 submission pack
- `PROJECT-JOURNAL.md` — historical build journal (superseded by `memory/` daily logs)
- `.shogo/screenshots/` — agent session screenshots
- `.shogo/plans/` — completed sprint plans
