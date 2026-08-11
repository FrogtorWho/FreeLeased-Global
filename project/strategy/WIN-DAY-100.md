# WIN-DAY-100 — The Bridge to a Perfect Score

> **One doc that ties the 100/100 streak to**
> [`projected-final-score.md`](projected-final-score.md:1) **and**
> [`WIN-DAY-CHECKLIST.md`](WIN-DAY-CHECKLIST.md:1).
>
> It answers three questions:
> 1. Per-judge: what would push them from current score to **10/10**?
> 2. Per-category: what's the next refinement to ship?
> 3. **When do we stop?** What's the stopping criterion?

---

## Reading order

If you're lost, read in this order:

1. [`moonshot-roadmap-10-10.md`](moonshot-roadmap-10-10.md:1) — Part A
   (current scores), Part B (projected), Part F (lift playbook).
2. [`projected-final-score.md`](projected-final-score.md:1) — the
   reconciled table.
3. [`judge-panel-analysis.md`](judge-panel-analysis.md:1) — per-judge
   archetype notes.
4. **This doc** — the bridge.

---

## Per-judge breakdown — what pushes each to 10/10

We have five judges, each with a primary archetype. The table below
names the *one* lift per judge that we believe would close the gap
from their current score (in [Batches 1–3](../strategy/WIN-DAY-CHECKLIST.md:1))
to **10/10**. The lifts are sequenced — we stop pushing when the
delta on each judge's score is **< 0.1 over 2 consecutive daily
runs**.

| # | Judge | Archetype | Current (post Batch 3) | Delta to 10 | The one lift | Effort |
|---|-------|-----------|------------------------|-------------|---------------|--------|
| 1 | Judge Venture | VC / product-market fit | 8.0 → 9.0 | +1.0 | **Live LOI from a named buyer + named in deck v8.** Currently we cite 3 named buyers; need 1 LOI scanned into Data Room. | 1 day |
| 2 | Judge Brand | Design / craft / UX | 7.5 → 9.5 | +2.0 | **Ship the [`project/brand/`](../brand/) pack + apply Brand-1 across the demo UI.** Today we have SVGs only; tomorrow we want the SignoffQueue + Overview cards rendered in Veridian tokens. | 2 days |
| 3 | Judge Operations | Build / ship / pipeline | 9.0 → 9.5 | +0.5 | **Add a 5-minute public status page** mirroring the OllyGarden telemetry. Judges want to *see* the loop running. | 1 day |
| 4 | Judge Legal | Compliance / defensibility | 8.5 → 9.5 | +1.0 | **Strengthen [`project/submission-pack/compliance-statement-v3.md`](../submission-pack/compliance-statement-v3.md) with explicit Article-5 line-by-line denials** + link to 3 OS license proofs. | 1 day |
| 5 | Judge Impact | Adoption / equity | 7.5 → 9.0 | +1.5 | **Pilot audit report with 50 synthetic residents + 3 named MOUs** already shipped; what remains is the *user evidence tracker* covering the consent + opt-out flow + a public summary. | 1 day |

**Net potential gain** if all five lifts ship: **+6.0 spread across
5 judges × 10 axes**, but realised as **+1.2 per judge** (judges
max at 10). That moves us from a projected **237.5 / 250 = 95%**
to a projected **243.5 / 250 = 97.4%** — close, but not yet
**100/100**.

### The remaining gap to 100/100

The remaining **+2.5** comes from compounding improvements:

- **+1.0 from the social campaign** ([`project/marketing/social-campaign-100.md`](../marketing/social-campaign-100.md:1)) — Judge Impact values adoption signals; the campaign is exactly that.
- **+0.5 from cross-judge fact-check** — every claim that crosses
  two judges' axes (e.g. "provenance-native" is read by both Judge
  Operations and Judge Legal) gets a one-line citation in
  [`fact-check-register.md`](fact-check-register.md:1) to make it
  un-attackable.
- **+1.0 from a 4-minute polish pass on the demo video** — tighten
  the script, redo the cold open, add on-screen captioning for
  each verdict. This is the single highest-leverage artifact for
  the live demo.

That gets us to **245.0 / 250 = 98.0%**. The remaining **+5.0** to
hit 100/100 is **aspirational** — we'd need every judge to give
10/10 on every axis, which is impossible in practice. **Our real
stopping target is 97.4% / 99%** — a score that puts us in
contention for 1st place without over-claiming.

---

## Per-category refinement queue (the loop)

The loop is: **judges suggest upgrade → implement → reconcile →
re-score.** Each iteration, we pick **one** axis and ship **one**
refinement. We never ship two at once — that confuses the
attribution.

| # | Axis | Current | Next refinement | Owner | Stop when |
|---|------|---------|-------------------|-------|-----------|
| 1 | A4 HITL | 7.5 | UI exports the sign-off queue as an audit-grade PDF | Overnight agent | Every sign-off has a downloadable trail |
| 2 | A6 Real-world impact | 7.5 | Add a public pilot summary citing 3 named MOUs + 50 synthetic residents | Sam + overnight agent | Summary is referenceable from the deck |
| 3 | B1 Team quality | 7.0 | Lock in 1 advisory quote (Boardy / equivalent) into `agent-brief` | Sam | Deck v8 has the quote |
| 4 | B3 Product-market fit | 7.5 | Lock in 1 LOI from a named buyer | Sam | LOI scanned into Data Room |
| 5 | A2 Multi-agent design | 8.0 | Diagram + 4-agent narrative in submission pack | Overnight agent | Diagram is part of the deck |
| 6 | A3 Orchestration | 8.0 | Add the consensus-gate image to the architecture diagram | Overnight agent | Image is in the submission pack |

After each refinement, run:

```bash
bun scripts/reconcile-docs.ts
```

If drift > 0, fix drift before claiming the lift. Then re-score
the relevant axis in [`projected-final-score.md`](projected-final-score.md:1).

---

## Stopping criterion — when do we stop?

We stop the refinement loop when **all three** of the following
hold for **two consecutive daily runs**:

1. [`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1)
   reports **10/10 PASS** with **0 drift**.
2. The daily delta on each judge's score is **< 0.1** in
   [`projected-final-score.md`](projected-final-score.md:1)
   (i.e. no axis moved meaningfully).
3. The demo script in
   [`project/submission-pack/demo-script-v3.md`](../submission-pack/demo-script-v3.md)
   has been rehearsed at least **3 times** end-to-end.

When all three hold, we are at **steady state**. Any further work
is decoration. We freeze the docs at T-2 (2026-08-14) and ship.

**What we never do at steady state:**

- Add new features
- Re-write existing docs for style
- Re-pace the demo
- Push unverified claims

These are all forms of motion-for-motion's-sake, and the rubric
rewards them less than it punishes them for breaking
reconciliation.

---

## What's *not* in this doc

- The demo script itself — see [`demo-script-v3.md`](../submission-pack/demo-script-v3.md).
- The pre-mortem — see [`pre-mortem-and-gaps.md`](pre-mortem-and-gaps.md:1).
- The risk ledger — see [`fact-check-register.md`](fact-check-register.md:1).

---

## Honest rationale

A "100/100 bridge" doc is structurally optimistic. **We don't
believe we can hit a perfect score**, and we don't think the
rubric was designed to allow one. What we *can* do is:
(1) make the work defensible to every judge axis,
(2) ship the highest-leverage artifacts first,
(3) know when to stop. This doc is the second and third of those.

The 100/100 streak is a *streak* — a run of consecutive batches
where every shipment ships clean. We hold it by **not adding
scope once we hit steady state**, not by chasing the last 0.1.
