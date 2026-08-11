# Agent Brief — FreeLeased (60-second cold-start)

**You are an overnight agent. Sam is asleep. The gauntlet loop will run you.** This is what to read first.

## What FreeLeased is
Open-source, local-first, resident-led leasehold governance platform for the Future Caribbean Global AI Buildathon (Track 9 — AI for Real Estate). Code freeze 2026-08-14, demo 2026-08-16, TRL claim: Level 4.

## What you do overnight
Three blocks, per [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1):

| UTC | Block | What |
|---|---|---|
| **02:00** | MAINTENANCE | Refresh spine, retry `inference`/`pending` fetches, ping OllyGarden telemetry, write report to `memory/<tomorrow>.md` |
| **03:00** | SELF-IMPROVE | Bayesian-update conviction weights from Sam's last 24h HITL, re-run 159+22 tests, file any failures as `SelfImprovementIssue` |
| **03:30** | MORNING DIGEST | Compile overnight summary into `memory/<tomorrow>.md`, append 1-line to `AI_JOURNAL.md`, update `HEARTBEAT.md` |

## Hard rules (NEVER break)
1. **Never** cite a statute with conviction it doesn't have
2. **Never** fabricate a missing field — request evidence instead
3. **Never** silently rebalance conviction weights — every delta is logged with the triggering dossier ID
4. **Never** push to `git push origin main` — PAT workflow scope is broken; local commits only
5. **Never** edit `src/generated/*`, `server.tsx`, `bun.lock`

## Doc map (read in this order if you're lost)
1. [`MEMORY.md`](MEMORY.md:1) — long-lived facts, workspace rules
2. [`FREELEASED-PRINCIPLES.md`](FREELEASED-PRINCIPLES.md:1) — immutable business facts (pseudonymised with `[PERSON_NAME]`)
3. [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1) — your operating manual
4. [`project/strategy/architecture-diagram.md`](project/strategy/architecture-diagram.md:1) — visual reference
5. [`HEARTBEAT.md`](HEARTBEAT.md:1) — cadence rules + today's progress log
6. [`AI_JOURNAL.md`](AI_JOURNAL.md:1) — append-only loop history

## Test signals (the truth)
- **Test count**: 159/159 assertions in `bun scripts/test-suite.ts`
- **Lint**: `ruff check src/core/` + `black --check src/core/` must both exit 0
- **TS check**: `bun x tsc --noEmit` must exit 0
- **Conviction caps**: 0.99 / 0.75 / 0.60 / 0.33 (truth-protocol canonical)

## When in doubt
- Append, never overwrite (except for the explicit reversible-copy journal)
- If a value is unknown, write `UNKNOWN — request evidence`
- If Sam is needed, write the escalation in the morning digest — don't wake him
- If a test fails, log it as `SelfImprovementIssue` and continue; don't roll back

## Reversibility
Every action you take must be reversible:
- File copies → tracked in `memory/data-room-copies.md` with one-line bulk-reversal command
- Doc edits → append-only (or documented "previous: X, new: Y" inline)
- Conviction updates → persisted to `data/learning_state.json` with dossier ID; can be rolled back
- Conviction deltas can be reverted by removing the dossier entry from the table

## Cadence
- Daily heartbeat: 09:00 + 17:00 UTC
- Overnight gauntlet: 02:00 + 03:00 + 03:30 UTC
- Weekly audit: Sunday 18:00 UTC (full Stage 1-3 rerun)

---

**When you finish**, update [`HEARTBEAT.md`](HEARTBEAT.md:1) Daily Progress Log with your last action, append to [`AI_JOURNAL.md`](AI_JOURNAL.md:1), commit locally with `git commit -m "overnight: <one-line summary>"`. Don't push.