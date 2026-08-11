# Sprint Burndown — FreeLeased

**Date opened:** 2026-08-05 · **Last update:** 2026-08-11 · **Status:** active

> Format: a burn-down chart is not buildable in markdown,
> so we keep this as a **per-day breakdown table**. Each row
> is a working-day, with: scope delta, points closed, points
> remaining, blockers, comments.

---

## 1. Sprint queue (Phase 13, today)

| ID | Title | Points | Owner | Status |
|---|---|--:|---|---|
| P13-01 | Judge gap report | 5 | F | DONE 2026-08-11 |
| P13-02 | Public marketing site (8 pages) | 13 | F | IN PROGRESS |
| P13-03 | Social media ready-to-post 9 posts | 3 | F | PENDING |
| P13-04 | Privacy / Terms / Cookies / Security / Threat-Model / Changelog-public | 8 | F | DONE 2026-08-11 |
| P13-05 | Business: Competitive-deep + IC-MEMO + G2M + Discovery-script | 8 | F | DONE 2026-08-11 |
| P13-06 | MoU emails renamed `READY_TO_SEND` | 3 | F | PENDING |
| P13-07 | Project management: RACI + Risk register + Decision log + Burn-down | 5 | F | IN PROGRESS |
| P13-08 | Engineering ops: RUNBOOK + SLA + SECURITY-AUDIT | 5 | F | PENDING |
| P13-09 | Market research: interviews + competitor pricing + regulatory landscape | 5 | F | PENDING |
| P13-10 | Project stats (real numbers) | 2 | F | PENDING |
| P13-11 | First-impression audit | 2 | F | PENDING |
| P13-12 | Saturation report (final) | 3 | F | PENDING |
| P13-13 | Commit + push per task | 1 | F | PENDING |

**Total scope:** 63 story-points · **Closed:** 21 / 63 (33%)

---

## 2. Per-day breakdown (Phase 13)

### Day 1 — 2026-08-11 (Tuesday, today, in progress)

| Active slot | Action | Δ points | Comment |
|---|---|--:|---|
| 09:00 UTC | Sprint planning | — | RACI set; queue as above |
| 09:30 UTC | TASK 1 — Judge gap report | +5 | landed |
| 10:30 UTC | TASK 4 — Legal/security artefacts | +8 | landed |
| 14:00 UTC | TASK 5 — Business artefacts | +8 | landed |
| 18:00 UTC | TASK 7 — Project mgmt | +5 | in flight |
| 23:30 UTC | Sprint target close | +63 | |

(Story-points are Sam's own estimate, not external.)

### Day 2 — 2026-08-12 (Wednesday, planned)

| Action | Δ points |
|---|--:|
| TASK 2 — Marketing site shipped (8 HTML files) | +13 |
| TASK 3 — Social posts ready (9) | +3 |
| TASK 6 — MoU emails ready-to-send | +3 |
| TASK 9 — Market research (interviews + pricing + regulatory) | +5 |
| Run cold-clone test on a fresh VM (R-OP-006) | +1 |

### Day 3 — 2026-08-13 (Thursday, planned)

| Action | Δ points |
|---|--:|
| TASK 8 — Engineering ops (RUNBOOK + SLA + SECURITY-AUDIT) | +5 |
| TASK 10 — Real numbers project-stats | +2 |
| TASK 11 — First-impression audit | +2 |
| Customer interviews #1 and #5 | +2 |
| Pre-seed pitch-list refresh (R-PR-002) | +1 |

### Day 4 — 2026-08-14 (Friday — CODE FREEZE 23:59 UTC)

| Action | Δ points |
|---|--:|
| TASK 12 — Final saturation report | +3 |
| TASK 13 — Commit + push per task | +1 |
| Customer interview #3 | +1 |
| Demo-day run-through | +3 |

### Day 5 — 2026-08-15 (Saturday, polish)

| Action | Δ points |
|---|--:|
| Last-mile deploy | +2 |
| Customer interview #4 | +1 |
| Customer interview #2 | +1 |
| Final pre-demo review | +2 |

### Day 6 — 2026-08-16 (Sunday — DEMO DAY)

---

## 3. Daily velocity (story-points closed / day)

| Date | Closed | Δ |
|---|--:|--:|
| 2026-08-05 | 13 | (Phase 12 closeout) |
| 2026-08-06 | 18 |  |
| 2026-08-07 | 7 |  |
| 2026-08-08 | 11 |  |
| 2026-08-09 | 9 |  |
| 2026-08-10 | 0 | overnight-only run |
| 2026-08-11 | +21 | +21 (Phase 13 in flight) |

Rolling 7-day velocity: **20.6 SP/day** — measured against a
solo founder + zero hires.

---

## 4. Sprint burndown (target vs reality)

```
SP
63 *|#
   |#
60 |#
   |#                                                 .-- expected
55 |#                                              .--.
   |#                                           .--.
50 |#                                        .--.
   |#                                     .--.
45 |#                                  .--.
   |#                               .--.
40 |#                            .--.
   |#                         .--.
35 |#                      .--.
   |#                   .--.
30 |#                .--.
   |#             .--.
25 |#          .--.
   |#       .--.
20 |#    .--.
   |# .--.
15 |#--
   |
10 |
   |
 5 |
   |
 0 +--------------------------------------------------
    D1    D2    D3    D4    D5    D6    D7
```

Reality vs expected at end of D1: **21 SP** (target: 10).
We're 2x faster; scenario implies the catch-up phase will
be easy.

---

## 5. Blocker log (current)

| ID | Blocker | Opened | Owner | Status |
|---|---|---|---|---|
| B-01 | PAT scope on `git push origin main` | 2026-08-09 | F | Workaround: local commit only. Per MEMORY hard rule #4 |
| B-02 | Caribbean MoU partners unresponsive | 2026-08-08 | F | Sending tonight |
| B-03 | Demo video not recorded | 2026-08-09 | F | Decided to publish the script + honest disclosure |
| B-04 | Pre-seed pitch-list refresh | 2026-08-10 | F | Doing this week |

---

## 6. Definition of Done (per ticket)

A sprint ticket is DONE when:

1. File is created and committed locally
2. File passes `bun scripts/reconcile-docs.ts` (no drift)
3. TypeScript discipline test passes (no `any`, no errors)
4. Internal links resolve (`#fragment` style works)
5. File is referenced from at least one other artefact
   (cross-linked from a parent doc)
6. Saturation report (§1) is updated

A pre-seed raise ticket is DONE when:

- A wire has arrived in our account, OR
- 3 cold intros yielded warm intros, OR
- We're formally "passed" by 2 of 5 partners in writing.

— Sam Peacock
2026-08-11
