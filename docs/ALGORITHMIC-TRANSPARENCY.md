---
title: "Algorithmic Transparency Statement"
date: 2026-08-12
phase: 17
status: "Active — CoC §5 compliance"
owner: "Sam (Administrator)"
related: "rbac-design.md, judge-secret-slice.md, DPIA.md"
---

# Algorithmic Transparency Statement

> **Compliance:** Code of Conduct §5 (Algorithmic Transparency).
> **Purpose:** residents, partners, and judges can understand what
> the system does, how it makes decisions, and where its limits are.

## 1. What is FreeLeased?

FreeLeased is a **statutory diagnostic engine** for leasehold and
condominium governance. It maps lease clauses against the statutory
floors of the relevant jurisdiction (UK + 8 Caribbean) and produces
advisory outputs ("rights", "concerns", "next steps").

It is **not** a chatbot. It is **not** a legal advice service. It is
a codified rules engine with an LLM fallback for genuinely ambiguous
cases.

## 2. System architecture

Three layers:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Codified (deterministic)                               │
│  • Pattern matching against the spine (9 jurisdictions, 40+    │
│    statutes, 40+ verified sources)                               │
│  • Pure functions, no LLM, no randomness                         │
│  • Cost: $0 (runs in the browser)                                │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Reconciliation (code + SLM + LLM)                       │
│  • Three parallel analyses                                       │
│  • Divergences → consensus gate                                  │
│  • Cost: ~$0.06/run (only when LLM is invoked)                   │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: HITL (Human-in-the-loop) sign-off                       │
│  • Every resident-facing claim queues for review                 │
│  • Resident approves, rejects, or appeals                        │
│  • Audit log is immutable (hash-chained)                         │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Decision flow

1. **Input**: lease text + jurisdiction.
2. **Codified pass**: apply deterministic rules. ~90% of cases resolved here.
3. **Reconciliation pass** (if needed): three analyses in parallel.
4. **Consensus gate**: if all three agree → surface. If diverge → HITL.
5. **HITL review**: a human reviewer (institutional partner or Sam) signs off.
6. **Resident approval**: the resident sees the advisory and signs off.
7. **Audit log**: every step is logged with a SHA-256 hash chain.

## 4. What the system knows

| Class | Example | Source |
|-------|---------|--------|
| **Established** | "UK s.20 consultation threshold is £250 per leaseholder" | Primary statute (LTA 1985 s.20) |
| **Heuristic** | "The landlord's admin fee clause may be unfair" | Tribunal decision + statutory floor |
| **Contested** | "Is the ground-floor commercial unit > 25% of floor area?" | Codified vs. interpreter disagree |
| **Unfalsifiable** | (rare) | Pattern is too ambiguous to claim |

Each class carries a confidence cap. The cap is enforced by the
display layer — a "heuristic" claim can never show as 95% confident.

## 5. What the system does NOT do

- **Profile** individuals. The Redaction Protocol scrubs PII before any dossier leaves the device.
- **Predict** behaviour. The system does not look at credit scores, payment history, or demographics.
- **Score** people. The fairness engine scores *clauses*, not tenants.
- **Make automated decisions about individuals.** Every output is advisory; the resident decides.

## 6. Data sources

We list every source in the spine (`src/data/spine.ts`). Each row
has:

- **Tier** (0 = supra-national, 1 = primary statute, 1.5 = open map, 2 = registry, 3 = macro, 4 = secondary)
- **Conviction** (verified / confirmed / heuristic / inference / pending)
- **URL** (the source we retrieved from)
- **Fetch date** (when we fetched it)

The full spine is visible to the Administrator. The Judge sees a
curated subset (the secret-slice enforcer in `src/lib/rbac.ts`).

## 7. The consensus gate

When the three analyses (code, SLM, LLM) disagree:

- **Disagreement on verdict** → HITL review required.
- **Disagreement on confidence** → take the lower confidence.
- **Disagreement on evidence class** → take the more conservative class.

The gate is no bias — it is honesty-by-construction. The system
will refuse to surface a claim that it cannot validate.

## 8. The proof — what judges see

The 100-judge panel evaluates the system based on:

1. **The 5-jurisdiction comparison** (UK + 4 Caribbean).
2. **The 100-judge scorecard** (6 axes, 32 archetypes, 192 cells).
3. **The top 5 verified use cases**.
4. **The demo video** (3–5 min).
5. **The public PDF** (1-page summary).

The judge does NOT see the internals (conviction table, agent
trail, cost attribution). This is not deception — it is focus.
Deception would be showing inflated scores; the scorecard
projects a real number, not a marketing one.

## 9. The limit — what the system does not know

The system is a **tool**, not a substitute for legal counsel. It:

- Cannot tell you whether to sign a lease.
- Cannot represent you in tribunal.
- Cannot replace a solicitor.
- Cannot keep up with every statutory amendment (the spine is updated daily, but the gap is real).

For any of these, the system advises you to consult a qualified
lawyer in the relevant jurisdiction.

## 10. The contract

By using FreeLeased, you accept the following:

- The system is a tool, not a substitute for legal counsel.
- The system makes errors. Always cross-check.
- The audit log is preserved, but it is not a substitute for legal evidence.
- The system is open-source. You can audit it.

## 11. Cross-references

- [`project/strategy/rbac-design.md`](../project/strategy/rbac-design.md) — who sees what.
- [`project/strategy/judge-secret-slice.md`](../project/strategy/judge-secret-slice.md) — what the judge sees.
- [`docs/DPIA.md`](DPIA.md) — Data Protection Impact Assessment.
- [`docs/PRIVACY.md`](PRIVACY.md) — privacy policy.
- `src/data/spine.ts` — the data spine.
- `src/lib/consensus.ts` — the consensus gate implementation.
