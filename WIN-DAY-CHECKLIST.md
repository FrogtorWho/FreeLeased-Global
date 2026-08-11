# Win Day Checklist — 2026-08-16

Single page. Print. Tick. Win.

---

## T-24h (Fri 2026-08-15)

- [ ] Run `npm run verify` — expect **10/10 reconcile, 231/231 tests, health-check all green**
- [ ] Run `bun scripts/test-suite.ts` — expect **159/159** core suite
- [ ] Run `bun scripts/test-signoff-queue.ts` — expect component + API assertions green
- [ ] Run `bun scripts/test-truth-diff.ts` — expect regex parity OK
- [ ] Run `bun scripts/test-health-check.ts` — expect helpers + invariants OK
- [ ] Run `bun scripts/test-reconcile-docs.ts` — expect 159 check()s + 9 jurisdictions regex
- [ ] Run `bun scripts/test-all.ts` (or `npm run test:all`) — single scorecard, all green
- [ ] Re-run `node --experimental-strip-types scripts/extract-sample.ts` — commit any new JSON
- [ ] Cold-clone check: `git clone <url> && cd && bun install && bun dev` works in <5 min
- [ ] Re-record demo video per `project/pitch/demo-narrative-arc.md`
- [ ] Export Data Room files from `G:\My Drive\Development\Future Caribbean\Data Room\` to shareable folder
- [ ] Update Data Room share settings (view access for judges)
- [ ] Confirm the Sign-off Queue demo data is seeded: `POST /api/review-queue/seed`
- [ ] Print this checklist

## T-2h (Sat 2026-08-16 13:00 UTC)

- [ ] Server live and responding — `curl http://localhost:8080/api/land/UK` returns 200
- [ ] 5 demo URLs bookmarked (RightsChecker, LeaseScanner, RTMWizard, SignoffQueue, TruthDiff)
- [ ] Slack/Discord: backup channel ready for live support
- [ ] Water + snacks + phone silenced
- [ ] Browser tabs ready in this order: Overview → RightsChecker → LeaseScanner → RTMWizard → SignoffQueue → TruthDiff
- [ ] Demo script on second screen (3 minutes, no dead air)
- [ ] `project/submission-pack/demo-script-v3.md` open

## Demo (3 min, T-0)

- [ ] Cold open (0:00–0:15) — per `project/pitch/demo-narrative-arc.md`
- [ ] Tension (0:15–1:00) — the 4M-UK-leaseholder problem + Caribbean void
- [ ] Tool demo (1:00–2:00) — RightsChecker on real UK clause → LeaseScanner flag → RTMWizard s.20/72 → SignoffQueue HITL → TruthDiff audit trail
- [ ] Resolution (2:00–2:30) — "$0 compute, 159 tests, 10/10 reconcile, 9 jurisdictions"
- [ ] Impact (2:30–3:00) — "55M households, $6.6B ARR TAM, 92% margin, 16:1 LTV/CAC"

## Post-demo (T+30 min)

- [ ] Capture judge feedback in `memory/2026-08-16.md`
- [ ] Append entry to `AI_JOURNAL.md` (`## 2026-08-16 — Demo Day`)
- [ ] Append line to `HEARTBEAT.md` (`16:30 UTC — Demo delivered. Feedback captured.`)
- [ ] Run gauntlet loop **MAINTENANCE** to lock in learnings
- [ ] Commit + tag the release: `git tag win-day-2026-08-16`
- [ ] Breathe.

---

> **If anything in this checklist blocks, document it in `memory/2026-08-16.md` and continue.** Don't let a missing item stop the demo. The checklist is a guardrail, not a gate.
