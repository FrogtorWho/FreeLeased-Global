# Agent Briefs — FreeLeased Competition Sprint

> **Created:** 6 Aug 2026 · **Deadline:** 14 Aug 2026 (Code Freeze)
> **Purpose:** Self-contained briefs for an external agent with NO prior knowledge of FreeLeased.
> Each brief is standalone — read only the one you need.

## Brief Index

| # | Title | Priority | Owner | Output |
|---|---|---|---|---|
| 1 | GitHub Repository Preparation | CRITICAL | Agent + Sam review | Public repo with README, LICENSE, setup docs |
| 2 | MoU Follow-Up Email Templates | HIGH | Agent writes, Sam sends | 7 personalised follow-up emails |
| 3 | Advisory Pipeline Outreach | HIGH | Agent writes, Sam sends | 3 cold outreach emails + LinkedIn DMs |
| 4 | Demo Video Script & Production Guide | CRITICAL | Agent writes, Sam records | 3-5 min video script with screen flow |
| 5 | Pilot Audit Setup & Execution | HIGH | Agent sets up, Sam runs | Synthetic lease → full audit → output |

## Quality Standard

These PDFs in `files/` represent the expected output quality:
- `files/Project_Funding_Optimization_Strategy.pdf` — structured, data-driven, cited
- `files/Beneficiaries_of_UK_Socio-Economic_and_Demographic_Trends.pdf` — exhaustive, triangulated, executive summary
- `files/Evaluation_of_UK_Government_Legal_Spend_and_Appointment_Appropriateness.pdf` — multidimensional frameworks, data-led

Every deliverable must have: executive summary, structured sections, data-backed claims with citations, glossary, appendices, and clear direction for execution.

## Style Rules (Apply to ALL Briefs)

- **UK English**: colour, organisation, generalises, programme, licence (noun), defense (defence)
- **No AI tells**: no "leveraging", "cutting-edge", "seamless", "game-changing", "revolutionary", "empowering"
- **Data-backed claims only**: every number traces to a source file in the codebase
- **Evidence classes**: every claim carries a confidence level (established/heuristic/contested/unfalsifiable)
- **Brevity with depth**: scannable structure, exhaustive detail in appendices
- **No fake data**: every statistic is verifiable against a primary source

## Key Project Facts (Quick Reference)

- **Project**: FreeLeased — Caribbean property governance platform
- **Buildathon**: Future Caribbean Global AI Buildathon, Track 9 (AI for Real Estate & Development)
- **Founder**: Sam Peacock — Investment Product Analyst, Schroders (10+ years)
- **Sprint**: 27 Jul — 16 Aug 2026 (Day 11 of 21 as of 6 Aug)
- **Code freeze**: 14 Aug (T-2 from public deadline)
- **Tech stack**: Vite + React + TypeScript + Tailwind + Hono + Prisma 7 + SQLite
- **Test suite**: 65/67 passing (consensus 18/18, veracity 22/22, fairness 13/13, telemetry 9/9)
- **Data spine**: 9 jurisdictions, 25+ statutes, 25+ sources, 20 hidden-rights patterns
- **Compute cost**: $0 (deterministic code, local SQLite)
- **MoU partners**: 7 Caribbean government agencies (letters drafted, signatures pending)
- **App URL**: https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai
- **Internal deadline**: 14 Aug (T-2 buffer); public deadline: 16 Aug

## Research pack

The narrative research pack that grounds the "follow the money"
thesis for judges and the pitch:

- [`project/research/truth-shadow-economy.md`](../research/truth-shadow-economy.md:1) —
  shadow economy, lawfare, money-laundering, corporate shells +
  the leaseholder-vs-freeholder asymmetry thesis (630 lines,
  Tier 1/2/3 sources tagged; 10 explicit `unverified: true`
  items logged in the fact-check-register).
- [`project/research/caribbean-jurisdiction-test.md`](../research/caribbean-jurisdiction-test.md:1) —
  JM + KY vs BB + UK legal-framework stress test.
- [`project/research/defensibility-and-novelty.md`](../research/defensibility-and-novelty.md:1) —
  defensibility arguments.
- [`project/research/market-and-business-model.md`](../research/market-and-business-model.md:1) —
  market sizing + GTM.
- [`project/research/roadmap.md`](../research/roadmap.md:1) —
  product roadmap.

The asymmetry numbers (cost-per-dossier pre/post FreeLeased,
leaseholder-vs-freeholder cost ratio) feed directly into
[`project/pitch/elevator-pitch.md`](../pitch/elevator-pitch.md:1)
and [`project/pitch/deck-v7.md`](../pitch/deck-v7.md:1).

## File Map

```
project/agent-briefs/
  00-OVERVIEW.md            ← You are here
  01-github-repo.md          ← Brief 1
  02-mou-followup-emails.md  ← Brief 2
  03-advisory-outreach.md    ← Brief 3
  04-demo-video-script.md    ← Brief 4
  05-pilot-audit-setup.md    ← Brief 5

src/
  App.tsx                    ← Main SPA (14 tabs)
  components/auri/           ← Feature components
  data/spine.ts              ← Data spine (9 jurisdictions)
  data/patterns.ts           ← 20 hidden-rights patterns
  data/fixtures.ts           ← 50 pilot residents
  lib/consensus.ts           ← Consensus gate (18/18 tests)
  lib/veracity.ts            ← Veracity engine (22/22 tests)
  lib/fairness.ts            ← Fairness layer (13/13 tests)
  lib/research.ts            ← Research desk
  lib/engines.ts             ← Core engines (dossier, redaction, commune)
  lib/gates.ts               ← Deterministic gates

scripts/
  test-suite.ts              ← Master test runner
  test-consensus.ts          ← Consensus tests
  test-veracity.ts           ← Veracity tests
  test-fairness.ts           ← Fairness tests

prisma/schema.prisma         ← Database schema (163 lines)
custom-routes.ts             ← Custom API routes

handoff/10-mou-letters/      ← 7 MoU letter drafts
handoff/07-judges/           ← Judge profiles
handoff/12-submission-pack/  ← Submission documents

project/strategy/            ← Strategy documents
```
