# Memory

Long-lived facts and learnings.

## FreeLeased — Active State

**Product:** FreeLeased — open-source, local-first, resident-led leasehold governance platform.
- Brand: Free[blue #2563eb] + Leased[green #10b981]. Peacock dark theme. Source: `src/components/auri/primitives.tsx`.
- Track: "AI for Real Estate & Development" (FC Buildathon). Solo: Sam Peacock.
- Binding principles: `FREELEASED-PRINCIPLES.md` (8 locked rulings).

**What it does:** Automates UK RTM + enfranchisement + service-charge audit + building-safety compliance. Adapts to Caribbean condo law (Cayman/Barbados/Jamaica).
- UK statutes: s.20 consultation, s.20C costs, s.72 CLRA RTM, BSA remediation, s.167 CLRA forfeiture.
- NOT residential tenancy (deposit caps/banned fees are wrong sub-domain).

**Sam:** Investment Product Analyst @ Schroders, 10+ yrs. Finance + Economics + Data Science + Resident Advocacy. UK/British.

**Workspace:**
- Never edit `src/generated/*` or `server.tsx`. Prisma 7: append models only.
- Design system: `src/components/auri/primitives.tsx`.
- Verification: `bun x tsc --noEmit` (ignore src/generated) + `bun scripts/test-suite.ts` + curl endpoints.
- **Gauntlet Loop** — see [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1) for the 5-sub-loop overnight agent cycle (PROCESS → RESEARCH → UPDATE → MAINTENANCE → SELF-IMPROVE). Runs nightly 02:00 + 03:00 UTC. Cadence file: `HEARTBEAT.md`. Last run: see `memory/<date>.md`.

## Competition — Sprint Window

- **Submission deadline:** 16 Aug 2026 (LIVE DEMOS + judging).
- **Internal deadline:** 14 Aug (T-2 buffer). Code freeze: T-2.
- **Prizes:** 1st $25k+3 OWC systems, 2nd $15k+2, 3rd $10k+1. NYSE pitch for winners.
- **Judging:** 50/50 Business Strength + Agentic AI Excellence. Two-person verification, 48hr freeze.
- **Required:** Project Overview, Technical Docs, 3-5min demo, Compliance statement (300-500w), OSS license.
- **Judges:** Pseudonymized in code (Judge Venture/Brand/Operations/Legal/Impact). Real names in archive only.
- **API:** Impala gateway only. No land/property data APIs — use OSM/Overture + MoU letters.
- **Portal:** sam.peacock1@gmail.com, Discord FrogtorWho.

**Compliance (CRITICAL):** Code of Conduct §2 bans manipulation/profiling/emotion recognition. Our adversary layer was RETIRED — fits wrong track. Strictly DEFENSIVE + transparent + HITL only.

## Completed Loops (11 total)

| Loop | Delivered | Tests |
|---|---|---|
| 1-3 | Reconciliation Engine, Knowledge Graph, Agent Orchestration | 79/79 |
| 4-5 | Enrichment, Federation (multi-source fusion) | 79/79 |
| 6 | VLM Pipeline (lease scanning) | 79/79 |
| 7 | Offline + Learning engines | 79/79 |
| 8 | Competition Tab (5 subtabs, live task queue + approvals) | 142/142 |
| 9 | Veracity Engine (evidence-class truth scoring) | 142/142 |
| 10 | Judge Pseudonymization (all 6 archetypes) | 142/142 |
| 11 | Community Hub (8 models, 15 endpoints, 6 subtabs) | 142/142 |

**Key engines in `src/lib/`:** consensus.ts, fairness.ts, veracity.ts, reconciliation.ts, knowledge-graph.ts, enrichment.ts, federation.ts, agents.ts, offline.ts, learning.ts, vlm-pipeline.ts, telemetry.ts, loop.ts.

## Archived (moved to `_archive/`)

- `_sentinel_drop/` — Adversary/ThreatLab data (retired per CoC compliance).
- `_handoff/` — Old docs with real judge names, v2 submission pack, stale briefs.
- `.shogo/screenshots/` — 15MB agent session screenshots.
- `.shogo/plans/` — Completed sprint plans.
- Duplicate MOU files (nested under `10-mou-letters/10-mou-letters\`).

## External Repositories

- **Data Room** — `G:\My Drive\Development\Future Caribbean\Data Room\` (Google Drive, synced locally). Validation layer for TRL claims. See `memory/data-room-map.md` for the folder → TRL mapping and gap report. READ-ONLY for the agent.

---

## Doc Graph (added 2026-08-11)

The FreeLeased documentation forms a single navigable graph. If you're lost, start here:

1. [`AGENT_BRIEF.md`](AGENT_BRIEF.md:1) — 60-second cold-start one-pager
2. [`MEMORY.md`](MEMORY.md:1) — this file; long-lived facts
3. [`FREELEASED-PRINCIPLES.md`](FREELEASED-PRINCIPLES.md:1) — immutable business facts
4. [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1) — overnight operating manual
5. [`project/strategy/architecture-diagram.md`](project/strategy/architecture-diagram.md:1) — visual reference
6. [`project/strategy/loop-protocol.md`](project/strategy/loop-protocol.md:1) — methodology
7. [`project/strategy/maturity-ladder.md`](project/strategy/maturity-ladder.md:1) — philosophy
8. [`project/strategy/trl-levels-freeleased.md`](project/strategy/trl-levels-freeleased.md:1) — TRL checklist
9. [`memory/data-room-map.md`](memory/data-room-map.md:1) — Data Room → TRL mapping
10. [`memory/data-room-copies.md`](memory/data-room-copies.md:1) — reverse-copy journal
11. [`HEARTBEAT.md`](HEARTBEAT.md:1) — cadence + daily progress log
12. [`AI_JOURNAL.md`](AI_JOURNAL.md:1) — append-only loop history
13. [`project/brand/`](project/brand/README.md:1) — 5-variant brand identity pack (Veridian / Quill / Monolith / Canopy / Coral) with palette, type, logomark, motion, voice, wireframes
14. [`project/marketing/social-campaign-100.md`](project/marketing/social-campaign-100.md:1) — 30-day × 5-brand × 5-platform social campaign
15. [`project/strategy/WIN-DAY-100.md`](project/strategy/WIN-DAY-100.md:1) — bridge doc to 100/100; per-judge breakdown + stopping criterion
