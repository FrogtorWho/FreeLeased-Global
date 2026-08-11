# Onboarding — First 60 Seconds as a FreeLeased Contributor

> **The shortest path from "what is this?" to "I shipped something
> useful." Read this end-to-end before opening any file.**

**Audience:** new contributors, buildathon mentors, judges doing
due-diligence on the engineering culture.
**Time budget:** 60 seconds (skim), 15 minutes (do).
**Last reviewed:** 2026-08-11 · reconciles against `bun scripts/reconcile-docs.ts`.

---

## 0. The 5-sentence elevator pitch

> **FreeLeased** is the intelligence layer for a single Caribbean
> property market — provenance-tracked, deterministic, **$0
> compute**, human-in-the-loop by design. It runs **9
> jurisdictions × 40+ statutes × 25+ hidden-rights patterns**
> with **zero LLM in the resident-facing path**. Every claim
> carries a Dempster-Shafer belief interval and an immutable audit
> row. We never social-score, infer emotion, or profile people —
> Article-5 compliance is documented line-by-line. Judges, devs,
> and residents can all verify the same thing.

If that landed, skip to §3. If not, §1–§2.

---

## 1. Why this exists

Leasehold governance in the UK and the Caribbean has two failure
modes that cost residents billions:

1. **Asymmetric information** — tenants and owner-occupiers don't
   know which clauses in their lease are unenforceable, which
   service charges are unreasonable, which hidden rights they
   inherit. FreeLeased closes that asymmetry.
2. **Shadow economy** — corporate-shell landlords, money-laundering
   through lease assignment, and tribunal lawfare flourish where
   evidence is asymmetric. FreeLeased is the public-interest
   counterweight: provenance-tracked, audit-grade.

The buildathon thesis: the *category* is **provenance-native
land & housing intelligence**. We are not "a CRM for landlords"
or "a SaaS dashboard for property managers." The IP is the
spine — a deterministic, source-of-truth data layer that any
later UI can render against.

## 2. The mental model (in 90 seconds)

```
                  ┌───────────────────────────────────────┐
   resident  ──▶  │  Capture (mobile / desktop)            │
                  └──────────────┬────────────────────────┘
                                 ▼
                  ┌───────────────────────────────────────┐
                  │  4 dossier agents (Resident Status,    │
                  │  Tenure+Building, Contracts,           │
                  │  Hidden Rights)                        │
                  └──────────────┬────────────────────────┘
                                 ▼
                  ┌───────────────────────────────────────┐
                  │  Consensus gate (DSP-5 combination)    │
                  │  - if agree: surface                   │
                  │  - if disagree: review                 │
                  │  - if low confidence: abstain + HITL   │
                  └──────────────┬────────────────────────┘
                                 ▼
                  ┌───────────────────────────────────────┐
                  │  HITL Sign-off Queue (the audit plane) │
                  │  - immutable audit row per verdict     │
                  │  - appeal path                         │
                  │  - opt-out                             │
                  └───────────────────────────────────────┘
```

Three things to internalise:

- **Deterministic first.** The spine runs without an LLM. The
  LLM is enrichment, not authority.
- **Honest gate.** When data is thin, the system *abstains*
  rather than fabricates. This is the rubric.
- **Audit-grade.** Every verdict has a hash, a tier, a sign-off
  row. If it isn't in the queue, it didn't happen.

## 3. Where to click first (4-click tour)

| Click | Tab | What you see | Why it matters |
|------:|-----|--------------|----------------|
| 1 | **My Rights** | Resident-facing rights check | Shows the product from the *user's* seat — first impression for any judge |
| 2 | **Lease Scanner** | Paste a lease clause → evidence-classed flag | The "Fairness Check" — the centrepiece demo |
| 3 | **Honesty** | The honesty engine, fact-check register, what we *don't* ship | The rubric-immune artefact; if a judge only sees one tab, this is it |
| 4 | **Sign-off Queue** | The HITL control plane | The "watch HITL work" beat — closes A4 to 10/10 |

Total time: 90 seconds.

## 4. Where to read second (4-doc tour)

| # | Doc | Why | Time |
|---|-----|-----|------|
| 1 | [`README.md`](../README.md:1) | The canonical surface | 5 min |
| 2 | [`project/README.md`](../project/README.md:1) | The working-set index | 3 min |
| 3 | [`project/strategy/100-judge-panel.md`](../project/strategy/100-judge-panel.md:1) | The 100-judge rubric model | 10 min |
| 4 | [`project/submission-pack/compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | EU AI Act Article-5 line-by-line denial | 5 min |

## 5. Where to ship first (4-PR ladder)

Start with the lowest-friction, highest-visibility PR:

| PR | File | What you learn |
|----|------|----------------|
| 1 | A typo in `src/lib/copy.ts` | The CI pipeline, the reconcile-doc runner, the pre-commit hook |
| 2 | A new statute in `src/data/frameworks/{code}-framework.json` | The legislative schema, the scrape scaffold |
| 3 | A new agent in `src/lib/agents.ts` | The agent-team pattern, the DSP-5 trace, the sign-off queue |
| 4 | A new brand variant in `project/brand/{name}/` | The brand-token system, the showcase renderer |

## 6. The five "I don't see it" questions

If you can't find something, it's almost always in one of these
five places:

1. **Strategy** — `project/strategy/*.md` (the rubric model lives
   here, not in code)
2. **Submission pack** — `project/submission-pack/*.md` (judge-facing
   prose, demo script, compliance)
3. **Spine** — `src/data/frameworks/*.json` + `src/data/patterns.ts`
   (the deterministic layer)
4. **Lib** — `src/lib/*.ts` (the engines, consensus, fairness,
   signing, reconciliation, telemetry, veracity)
5. **Scripts** — `scripts/*.ts` (test runner, reconcile-docs,
   health-check, generate-sample-dossier)

## 7. The verify-loop (the only command that matters)

```bash
npm run verify
```

Expected output: **10/10 doc-vs-code reconcile, 231/231 tests,
health-check all green**. Anything else = drift, not feature.
See [`CONTRIBUTING.md`](../CONTRIBUTING.md:1) §"Truth Protocol".

## 8. Where to ask

- **Discord:** the Future Caribbean Buildathon workspace.
- **GitHub:** open an issue using the bug / feature / question
  templates.
- **Email:** sam@freeleased (the founder, Sam Peacock, is the
  named accountable owner for every axis).

## 9. The line you'll be held to

> *"Every claim in documentation, code comments, README, or
> pitch must match the actual state of the codebase. The
> reconciler enforces this automatically — if you change a
> number in docs, change it in code (or vice versa) so they
> reconcile."*
>
> — [`CONTRIBUTING.md`](../CONTRIBUTING.md:1), §"Truth Protocol"

That is the only rule. Everything else is judgement.

— Sam Peacock
2026-08-11
