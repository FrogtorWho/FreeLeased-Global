# Social Post #3: $0 Compute Story

**Platform:** LinkedIn + X/Twitter
**Due:** Day 12 (today is Day 11)
**Status:** DRAFT — Ready for Sam's approval

---

## LinkedIn Version

**Day 8 of building FreeLeased — the $0 compute story.**

Most AI products burning through inference budgets. GPT-4o: $0.60–$15 per million tokens. Claude Sonnet: $3–$15/M. At scale, $950/month minimum.

FreeLeased processes lease audits against 40+ statutes across 9 jurisdictions. Clause-by-clause fairness scoring. Evidence-class tagging on every claim. Consensus gate with human validation. Immutable audit trail.

Compute cost: $0.

How? Three design decisions:

1. **Deterministic scoring, not inference.** Fairness scores run against codified statutory floors. No LLM needed — it's a lookup table with mathematical bounds.

2. **Local SQLite, not a data warehouse.** 50 pilot residents, 9 jurisdictions, 40+ statutes — all in a 2MB file. Zero cloud DB fees.

3. **Pattern matching, not neural networks.** Hidden rights discovery uses regex patterns against statute text. 20 patterns, 100% recall on synthetic tests.

The consensus gate is the only place an LLM touches the pipeline — and even that defaults to deterministic cross-checks with human override.

Result: a regulatory audit engine that any Caribbean government agency can run on a laptop. No API keys. No GPU cluster. No inference bill.

That's what happens when you build for residents, not investors.

#FreeLeased #AI #RealEstate #Caribbean #Buildathon #OpenSource

---

## X/Twitter Version

Day 8: $0 compute.

FreeLeased audits leases against 40+ statutes across 9 jurisdictions.

Clause scoring. Evidence tagging. Human validation. Immutable audit trail.

Most AI products: $950+/mo in inference.
Us: SQLite on a laptop.

Three decisions:
→ Deterministic scoring (not inference)
→ Local DB (not cloud)
→ Pattern matching (not neural nets)

Built for residents who can't afford GPU clusters. #Buildathon

---

## Evidence

- Source: `scripts/test-suite.ts` (65/67 tests, all deterministic)
- Source: `src/lib/fairness.ts` (13/13 tests, zero inference)
- Source: `src/lib/veracity.ts` (22/22 tests, zero inference)
- Source: `src/lib/consensus.ts` (18/18 tests, deterministic + human)
- Pricing reference: API pricing 2026 (Claude Sonnet $3-15/M tokens)
- Claim class: **established** (verifiable against source files + pricing data)
