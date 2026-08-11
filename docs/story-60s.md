# The 60-Second Story — FreeLeased in One Read

> **What to give a judge who has 60 seconds.** Every word is
> load-bearing. The structure is **Setup → Conflict → Resolution
> → Proof → Ask**.

---

## Setup (10s)

Caribbean + UK leasehold governance is a $1.7T asset class where
tenants, owner-occupiers, and small landlords don't know which
clauses in their own lease are unenforceable.

## Conflict (10s)

When they do ask, they get one of three bad answers: an
LLM-hallucinated statute, a $400/hr solicitor they can't afford,
or nothing at all.

## Resolution (20s)

FreeLeased is the **deterministic, provenance-tracked
intelligence layer** for that market. It runs **9 jurisdictions
× 40+ statutes × 25+ hidden-rights patterns** with **zero LLM in
the resident-facing path**. Every output carries a
Dempster-Shafer belief interval and an immutable audit row.
The system **abstains** rather than fabricates when data is thin.

## Proof (10s)

- **231 tests, 10/10 reconcile, $0 compute.** All in [`README.md`](../README.md:1).
- **7 named Caribbean MoU partners** in [`docs/submission-pack/`](../project/submission-pack/) — not marketing, not future-tense.
- **EU AI Act Article-5 compliance**, line-by-line, in [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md).
- **Live observability** to OllyGarden (sponsor), traceable in the demo.

## Ask (10s)

> Open the **Honesty** tab first. That's the rubric-immune
> artefact. Then **Lease Scanner** to see a clause flagged with
> statute citation. Then **Sign-off Queue** to watch HITL
> decide a divergent verdict in real time.

---

## What to do in 60 seconds (judge-first-pass tour)

| s | Action |
|---|--------|
| 0 | Click **Honesty**. Read the "What we don't ship yet" panel — it's the rubric. |
| 20 | Click **Lease Scanner**. Paste: *"The landlord may enter at any time without notice."* Click check. |
| 40 | Click **Sign-off Queue**. See the audit-grade row for that flag. |
| 60 | Decide: does the honesty story match the lease-scanner story? If yes, the rubric holds. |

---

## What it does NOT do (the rubric-immune disclaimers)

- We do not profile people.
- We do not infer emotion.
- We do not social-score.
- We do not fabricate statutes.
- We do not present LLM output as legal advice.

All five are Article-5 prohibited practices; we document each
denial in [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md).

---

## Three sentences a VC will hear

1. **TAM** — $1.7T Caribbean + UK land stock; 9 jurisdictions
   on the spine, 40+ topline by 2027.
2. **Moat** — three: data network effect (every jurisdiction
   compounds), registry / MoU relationships (defensive),
   honesty-engine IP (no incumbent ships honesty as a feature).
3. **Traction** — 7 MoU partners (named), 0 LOIs, 0 revenue
   (honest); pre-seed round in flight.

## Three sentences a legal academic will hear

1. **Citations** — every output cite resolves to a tier-1
   anchor (UK statute / SI / BAILII case); the fact-check
   register asserts provenance.
2. **Procedural** — sign-off queue + audit row + appeal path
   is the procedural discipline; LFRA + RTM + BSA patterns are
   first-class.
3. **Limitation** — document-only, no profiling, never legal
   advice; engage a local attorney for tribunal-grade matters.

## Three sentences a designer will hear

1. **Brand** — five complete identity systems; Veridian is the
   production default.
2. **Accessibility** — WCAG-AA, axe-core 0 violations, full
   keyboard nav, ARIA labels, focus rings.
3. **Motion** — Veridian motion tokens; subtle, never noisy.

## Three sentences an engineer will hear

1. **Architecture** — 4-tier ladder: codified → RAG-agentic →
   consensus → HITL; deterministic first, LLM as enrichment.
2. **Tests** — 231 tests, 10/10 reconcile, every public
   function typed; no `any`, `tsc --noEmit` clean.
3. **DevEx** — single command `npm run verify` proves the
   whole story; cold-clone → running demo in ~70s.

---

## What to do if you have 5 minutes instead of 60 seconds

1. Read [`README.md`](../README.md:1) (top-to-bottom, 5 min).
2. Read [`project/strategy/100-judge-panel.md`](../project/strategy/100-judge-panel.md:1) §"Per-archetype axes" for your archetype.
3. Click the tab named in §"Per-archetype axes → Lift" for your archetype.
4. Decide.

## What to do if you have 30 minutes

- Read [`project/submission-pack/`](../project/submission-pack/) end-to-end.
- Run `npm run verify`.
- Open the relevant [`src/lib/*.ts`](../src/lib/) files for your archetype.
- Email Sam with the question that *wasn't* answered.

---

— Sam Peacock
2026-08-11
