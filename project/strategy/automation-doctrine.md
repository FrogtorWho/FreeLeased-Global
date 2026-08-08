# Automation Doctrine

**Status:** binding · **Version:** 1.0
**Companion:** `data-structuring-protocol.md` (DSP shapes referenced below).

How FreeLeased decides *how* to automate any judgement. The order is not a
preference — it is a hard precedence. You may only descend a tier when the tier
above genuinely cannot express the judgement, and you must record why.

---

## The precedence ladder

### Tier 1 — CODIFIED (default, preferred)
Deterministic rules, lookups, and arithmetic. No model in the path.
- **Use when** the judgement can be expressed as rules over structured data
  (statute matching, data-sufficiency scoring, tenure lookups, band thresholds).
- **Why first** reproducible, auditable, free to run, and impossible to
  hallucinate. This is where the majority of the product lives.
- **Examples**: Fairness Check clause matching (DSP-4), land-intelligence
  data-sufficiency band (DSP-1/DSP-3), spine summary aggregation.

### Tier 2 — RAG-AGENTIC (fallback, only when codification fails)
Grounded retrieval over the spine + an LLM step, used **only** where a
judgement resists codification (open-text interpretation, novel clause phrasing,
summarisation, cross-document reasoning).
- **Hard requirements**: retrieval is scoped to provenance-tracked sources
  (DSP-3); every output cites its sources (DSP-6 `citations` mandatory); output
  is capped at `heuristic` (DSP-0a) because it has no deterministic backing.
- **Never** used to *override* a codified result — only to reach where codified
  rules cannot.
- **Model routing**: small open models first (Impala/MiniMax on sponsor infra);
  escalate only on low retrieval confidence.

### Tier 3 — CONSENSUS / ALIGNMENT (verification gate)
When both a codified and a RAG-agentic estimate exist for the same claim, the
consensus gate (`src/lib/consensus.ts`, DSP-6) cross-checks them and decides:
- **aligned** → surface at the stronger evidence basis, confidence capped;
- **divergent** → downgrade to `contested`, **route to human review**, assert
  no value (honesty: a disputed claim is never shown as fact);
- **single-source** → codified stands; grounded agentic capped at `heuristic`;
  **uncited agentic abstains outright**.
This gate is the codified guarantee that our two automation methods must *agree*
before a confident claim reaches a resident.

**Dynamic to each jurisdiction.** The gate reads a `MaturityAssessment`
(DSP-6b) computed live from the spine: `established` jurisdictions (e.g. UK,
verified ratio 0.92) let codified claims surface alone; `developing` ones require
corroboration for non-established claims; `nascent` ones (e.g. BVI) cannot
surface single-source at all and are capped a class lower. As statutes get
verified, maturity rises and the gate relaxes automatically — robust and dynamic
without any per-jurisdiction constant.

### Human sign-off (HITL) — always terminal for resident-facing advice
Any `review` verdict, any resident-facing legal flag, and any `inference`-grade
datum surfaces to a human with an appeal path (CoC §4). Codified + consensus
decide *what to show and how loudly*; a human decides *whether to act*.

---

## Workflow → tier → DSP map

| Workflow | Tier | Consumes | Produces | Verified |
|---|---|---|---|---|
| Fairness Check (clause vs statute) | 1 codified | DSP-2, DSP-0a | DSP-4 | `test-fairness` 13/13 · `POST /api/fairness/check` |
| Land-intelligence profile + band | 1 codified | DSP-1, DSP-2, DSP-3 | land profile | `GET /api/land/:code` · `/api/spine/summary` |
| Statute/source promotion + maintenance | 1 codified | DSP-2, DSP-3, DSP-0b | updated spine | `GET /api/research/maintenance` |
| Clause interpretation (open text) | 2 rag-agentic | DSP-3 corpus | DSP-6 estimate | routes to Tier 3 |
| Social-milestone copy generation | 2 rag-agentic | build log | draft posts | `scripts/social-gen.ts` (graceful no-key) |
| Consensus/alignment gate | 3 consensus | 2× DSP-6 | DSP-6 result | `test-consensus` 18/18 · `POST /api/consensus/check` |
| Loop observability | cross-cut | — | DSP-5 spans | `test-telemetry` 9/9 |

Every row names the DSP records it touches, so a judge (or auditor) can trace
any surfaced claim back to its shape and its source.

---

## Decision checklist (apply before adding any automation)

1. **Can this be codified?** If yes → Tier 1. Stop.
2. **If not, why not?** Record the reason in the ops journal. Then Tier 2 with
   mandatory citations, capped at `heuristic`.
3. **Does a codified estimate also exist for this claim?** If yes → run both
   through the Tier-3 consensus gate; never surface the agentic one alone.
4. **Is the output resident-facing legal advice, divergent, or `inference`-grade?**
   → human sign-off with an appeal path.
5. **Is every input and output referenced by a DSP ID?** If not, add the DSP
   entry first.

This doctrine is what lets us claim "agentic where it helps, deterministic where
it matters, and honest at every boundary" — and prove it in code.
