# Sample Lease Dossier — Honest Run

**Generated:** 2026-08-11T06:26:54.505Z

> ⚠️ **Honesty disclosure.** SYNTHETIC INPUT. The lease text at project/demo/sample-lease.txt is a demo fixture. The processing — fairness analysis, redaction, consensus gate — is real and reproducible. Ruleset is a verbatim copy of src/lib/fairness.ts to keep the script self-contained.

**Jurisdiction:** UK
**Pipeline:** fairness.analyzeLease (verbatim copy of src/lib/fairness.ts) → engines.redactionProtocol (R1-R3) → consensus.reachConsensus (per-flag codified vs rag-agentic)
**Audit row hash:** `0x58d5d80d`

## Inputs

- [`project/demo/sample-lease.txt`](sample-lease.txt) — 8 clauses, demo fixture.

## Fairness Check

- **Clause count:** 18
- **Flag count:** 5
- **By severity:** 3 high · 2 medium · 0 low.

| # | Rule | Severity | Evidence | Confidence | Citation |
|---|------|----------|----------|------------|----------|
| 1 | Right to quiet enjoyment / notice of entry | high | established | 0.9 | Rent Restriction / Landlord and Tenant Act (quiet enjoyment) |
| 2 | Non-waivable repair duty | high | established | 0.85 | Landlord and Tenant Act (implied covenant to repair) |
| 3 | Unenforceable penalty | medium | contested | 0.6 | Common law rule against penalties |
| 4 | Security deposit limits | medium | heuristic | 0.7 | Rent Restriction Act (deposit provisions) |
| 5 | Retaliatory eviction | high | heuristic | 0.7 | Rent Restriction Act (security of tenure) |

> These flags are candidates for human review, not legal advice. Each cites the governing law and is capped by an evidence class.

## Redaction Protocol

- **Pass:** ✅ yes
- **R1 pseudonym-only:** ✅ structured pseudonym, no real name
- **R2 no PII leakage:** ✅ no postcode/email in payload
- **R3 data-protection basis:** ✅ synthetic fixture; real deployment gates on subject request

## Consensus Gate

- **Surface:** 4
- **Review:** 1
- **Abstain:** 0
- **Aligned:** 4 · **Divergent:** 1 · **Single-source:** 0

| Claim | Verdict | Agreement | Confidence | Evidence | Rationale |
|-------|---------|-----------|------------|----------|-----------|
| entry-without-notice | review | divergent | 0.6 | contested | disagreement; downgraded to contested + human review |
| waive-repairs | surface | aligned | 0.9 | established | codified and rag-agentic agree; surfaced at stronger basis |
| penalty-late-fee | surface | aligned | 0.6 | contested | codified and rag-agentic agree; surfaced at stronger basis |
| excessive-deposit | surface | aligned | 0.75 | heuristic | codified and rag-agentic agree; surfaced at stronger basis |
| retaliatory-eviction | surface | aligned | 0.75 | heuristic | codified and rag-agentic agree; surfaced at stronger basis |

## Sign-off

- **Status:** `hitl-required`
- **Compute:** Tier-1 codified (deterministic, $0) (cost $0.00)

---

*This dossier is reproducible: re-run `bun scripts/generate-sample-dossier.ts`.*
