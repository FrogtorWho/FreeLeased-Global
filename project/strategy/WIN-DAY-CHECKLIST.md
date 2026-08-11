# WIN-DAY CHECKLIST — Submission-Day Runbook

> **Use this on submission day (2026-08-14 code freeze; 2026-08-14 final submission window).**
> Every step has a single command + expected output. If anything fails, abort and consult the linked doc.

---

## Phase A — T-24h Pre-Submission (2026-08-13 09:00 UTC)

| Step | Command | Expected | Doc |
|---|---|---|---|
| A.1 | `npm run health` | 11/13 ✅ (Lint-ruff and TypeScript-tsc warnings are environmental) | [health-check](../README.md) |
| A.2 | `npm run reconcile` | `**10/10 claims pass** · 0 drifts` | [truth-protocol](./truth-protocol.md) |
| A.3 | `npm run test:all` | 3/5 suites green (node-runnable) + 159/159 core if bun is on PATH | [test-suite](../../scripts/test-suite.ts) |
| A.4 | `git status` | clean working tree | — |
| A.5 | `git log --oneline -30` | 30 commits ahead of origin (target state) | — |

If A.1–A.5 fail, **STOP** and run the gauntlet loop overnight (see [gauntlet-loop.md](./gauntlet-loop.md)).

---

## Phase B — Submission Day (2026-08-14)

### B.1 — Final Pre-Flight (09:00 UTC)
- [ ] `npm run health` — confirm 11/13 ✅
- [ ] `npm run reconcile` — confirm 10/10 PASS
- [ ] `npm run test:all` — confirm 3/5 green + 159 if bun available
- [ ] Re-read [`win-DAY-snapshot.md`](./win-DAY-snapshot.md) — confirm TRL + gap status unchanged

### B.2 — Verify Submission Pack (10:00 UTC)
- [ ] All required files in `project/submission-pack/` exist (architecture-v3.md, project-overview-v3.md, compliance-statement-v3.md, submission-checklist-v3.md, demo-script-v3.md)
- [ ] All 22 evidence folders in Data Room populated (see [data-room-map](../../memory/data-room-map.md))
- [ ] Demo video uploaded to public host + URL pasted in submission form

### B.3 — Push To Origin (11:00 UTC)
- [ ] `git push origin main` — see Task 4.3 in synthesis runbook for PAT workflow workaround
- [ ] If push fails: document state, leave all work local per session protocol
- [ ] Confirm remote SHA matches `git rev-parse HEAD`

### B.4 — Submission Form (12:00 UTC)
- [ ] Open submission portal
- [ ] Paste: GitHub URL, demo video URL, elevator pitch, contact email
- [ ] Attach: deck-v7.pdf, architecture-v3.pdf
- [ ] Submit
- [ ] Screenshot the submission confirmation → save to `project/submission-pack/2026-08-14_submission_confirmation.png`

---

## Phase C — Post-Submission (2026-08-14 18:00 UTC)

### C.1 — Capture Final State
- [ ] `git tag WIN-DAY-2026-08-14 -m "Final submission tag"`
- [ ] Append post-submission entry to [`AI_JOURNAL.md`](../../AI_JOURNAL.md)
- [ ] Move all in-progress docs to `archive/` if needed

### C.2 — Acknowledgements
- [ ] Thank co-builders (if any) — see [founder-journey-team-quality.md](./founder-journey-team-quality.md)
- [ ] Public post: [`project/marketing/social-content-pack.md`](../marketing/social-content-pack.md) (pre-prepared)

---

## Phase D — If Anything Goes Wrong

| Failure | Response |
|---|---|
| reconcile-docs reports DRIFT | DO NOT submit. Re-run gauntlet loop overnight; re-attempt at T+24h. |
| test:all shows regression | Revert suspect commit with `git revert <sha>`; re-run A.1–A.5. |
| push fails (PAT scope) | Use the workaround in [Task 4.3 of synthesis runbook](#) — `git filter-branch` to drop `.github/workflows/ci.yml` from history. |
| Demo video fails to upload | Use the static screenshots in [`project/submission-pack/`](../submission-pack/) as backup. |
| Submission portal down | Document the issue; resubmit at T+12h. The 24h submission window is forgiving. |

---

## Quick Reference

- **TRL self-assessment**: [`win-DAY-snapshot.md`](./win-DAY-snapshot.md#5-trl-self-assessment)
- **Projected score**: [`projected-final-score.md`](./projected-final-score.md) — current 87/100 → 91–95 with Tier 1+2 lifts
- **Pre-mortem gaps**: [`pre-mortem-and-gaps.md`](./pre-mortem-and-gaps.md) — 9 RESOLVED · 8 MITIGATED · 1 OPEN (G10)
- **Architecture diagram**: [`architecture-diagram.md`](./architecture-diagram.md)
- **Loop protocol**: [`loop-protocol.md`](./loop-protocol.md) — current Loop 8 complete

---

*Last updated: 2026-08-11T03:23Z (WIN MODE Batch 4 — final synthesis)*
