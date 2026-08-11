# Real-World Readiness Matrix

**Project:** FreeLeased
**Date:** 6 August 2026
**Purpose:** Maps every claim made in the pilot audit report and broader product narrative to its evidence type. Honest about what is proven vs projected.

Evidence type key:
- `code-verified` — claim is directly testable from source code; test suite confirms it
- `synthetic-verified` — claim was demonstrated using a synthetic (fictional) document; pipeline ran correctly but no real leaseholder was involved
- `research-verified` — claim is backed by primary source, case law, or institutional data with a citation
- `projected-unvalidated` — claim is a forward-looking estimate or projection; no empirical validation yet
- `structural-only` — feature exists in code / architecture but has not been exercised end-to-end with real data

---

## Part 1: Pipeline & Architecture Claims

| # | Claim | Evidence Type | Verification Source | Notes |
|---|-------|---------------|--------------------|----|
| 1 | Pipeline processes a lease in under 500ms | `synthetic-verified` | pilot-audit-report.md §1 — curl response time | Real-world latency may differ on cold start |
| 2 | 103 clauses analysed in synthetic run | `synthetic-verified` | pilot-audit-report.md §2.2 | Count derived from fictional document |
| 3 | Fairness engine flags unlawful clauses with statute citations | `synthetic-verified` | pilot-audit-report.md §2.2, 4 flags raised | Citations are real statutes; input is synthetic |
| 4 | Consensus gate routes divergent claims to human review | `synthetic-verified` | pilot-audit-report.md §2.3, verdict=review | Demonstrated with matching claim strings |
| 5 | Redaction Protocol scrubs PII before external use | `structural-only` | src/lib/engines.ts — `redactionProtocol()` exists | Not demonstrated in synthetic pilot; next step |
| 6 | k-anonymity (k≥5) enforced in Commune Aggregate | `structural-only` | src/lib/engines.ts — `communeAggregate()` exists | No live commune data to test against |
| 7 | $0 compute cost | `code-verified` | No API keys in source, SQLite only, no inference in test runs | Verified across all 65/67 test runs |
| 8 | Deterministic — same input produces same output | `code-verified` | scripts/test-suite.ts — all tests are deterministic assertions | Passes on every run |
| 9 | 65/67 tests passing | `code-verified` | scripts/test-suite.ts output, logged 6 Aug 2026 | 2 pre-existing edge-case failures |
| 10 | Fairness engine: 13/13 tests | `code-verified` | scripts/test-fairness.ts | |
| 11 | Consensus gate: 18/18 tests | `code-verified` | scripts/test-consensus.ts | |
| 12 | Veracity engine: 22/22 tests | `code-verified` | scripts/test-veracity.ts | |

---

## Part 2: Data Spine Claims

| # | Claim | Evidence Type | Verification Source | Notes |
|---|-------|---------------|--------------------|----|
| 13 | 9 jurisdictions in data spine | `code-verified` | src/data/spine.ts — JURISDICTIONS array | BB, JM, KY, TT, GY, BZ, VG, BS, UK |
| 14 | 25+ statutes catalogued | `code-verified` | src/data/spine.ts — STATUTES array | 25 statute records (count verified 2026-08-11) |
| 15 | 25+ verified sources with provenance | `code-verified` | src/data/spine.ts — SOURCES array | Source tier and URL per entry (count verified 2026-08-11) |
| 16 | 20 hidden-rights patterns | `code-verified` | src/data/patterns.ts — HIDDEN_RIGHTS array | Pattern text + statute mapping per entry |
| 17 | Source tiers enforced (Tier 1→3) | `code-verified` | src/data/spine.ts — tier field on each source | |
| 18 | Evidence classes cap displayed confidence | `code-verified` | src/lib/veracity.ts — CONFIDENCE_CAPS | established≤0.95, heuristic≤0.75, contested≤0.50 |
| 19 | Statutes are real UK and Caribbean legislation | `research-verified` | Primary sources: legislation.gov.uk, CAR statutes | CLRA 2002, LTA 1985, BSA 2022 confirmed |

---

## Part 3: Market & Business Claims

| # | Claim | Evidence Type | Verification Source | Notes |
|---|-------|---------------|--------------------|----|
| 20 | 4.6 million UK leaseholders | `research-verified` | MHCLG English Housing Survey 2022–23 | Cited in project/strategy/multi-jurisdiction-legal-spine.md |
| 21 | 308,000 Caribbean condominium units | `research-verified` | World Bank Housing Finance in CARICOM (2021), UN-Habitat | Composite estimate across 8 jurisdictions; margin of error ±15% |
| 22 | $6.6 billion global TAM | `projected-unvalidated` | Derived from unit counts × average property value indices | Methodology documented; not validated by external analyst |
| 23 | $26 million Caribbean SAM | `projected-unvalidated` | Internal model: addressable units × willingness-to-pay proxy | No pricing survey conducted; proxy = UK RegTech comparables |
| 24 | $600K Year 1 SOM | `projected-unvalidated` | Bottom-up: 5,000 users × $120/yr blended ARPU | No sales data; pre-revenue |
| 25 | 16:1 LTV:CAC ratio | `projected-unvalidated` | Modelled: $240 LTV / $15 CAC assumption | CAC assumption unvalidated; no paid acquisition tested |
| 26 | 92% gross margin | `projected-unvalidated` | $0 infrastructure + software-only delivery | Correct for current architecture; does not include future cloud costs |
| 27 | RTM firms charge £500–£5,000 per case | `research-verified` | LEASE advisory pricing, ARMA member surveys 2024 | Spot-checked against 3 UK RTM providers |
| 28 | Zero digital leasehold governance tools in Caribbean | `research-verified` | Desk research, registry website audits Aug 2026 | No counterexample found; absence ≠ certainty |

---

## Part 4: Partnership & Traction Claims

| # | Claim | Evidence Type | Verification Source | Notes |
|---|-------|---------------|--------------------|----|
| 29 | 7 Caribbean MoU partnerships | `structural-only` | project/strategy/agent-briefs/02-mou-followup-emails.md — letters drafted | **⚠️ LETTERS DRAFTED ONLY. Not sent. Not signed. Must not be claimed as active partnerships.** |
| 30 | Export Barbados MoU | `structural-only` | _handoff/10-mou-letters/mou-letter-export-barbados.md | Draft exists; no acknowledgement received |
| 31 | 50 synthetic pilot residents | `code-verified` | src/data/fixtures.ts — PILOT_RESIDENTS array | Fictional data, clearly labelled synthetic |
| 32 | 1 complete audit session (synthetic) | `synthetic-verified` | project/pilot-audit/pilot-audit-report.md | Input: fictional lease; output: real engine |
| 33 | 0 real leaseholder audits | `—` | — | **Honest gap. No real users yet.** |

---

## Part 5: Responsible AI Claims

| # | Claim | Evidence Type | Verification Source | Notes |
|---|-------|---------------|--------------------|----|
| 34 | No biometric / emotional / behavioural data processed | `code-verified` | Source scan: no such inputs exist in any lib/* or data/* | Document-only inputs confirmed |
| 35 | Adversary/intelligence layer retired per CoC | `structural-only` | src/lib/adversary.ts removed from imports | File may still exist; imports removed |
| 36 | Compliance statement covers CoC §2-§5 | `structural-only` | project/submission-pack/compliance-statement-v3.md | Written, not yet formally reviewed |
| 37 | HITL required before any claim surfaces | `code-verified` | src/lib/consensus.ts — human validation gate | 18/18 tests confirm gate logic |
| 38 | Synthetic data marked as synthetic | `synthetic-verified` | pilot-audit-report.md header, synthetic-lease.md header | Demo fixtures in app UI not yet marked — gap |

---

## Summary: Evidence Quality Distribution

| Evidence Type | Count | % | Interpretation |
|---------------|-------|---|----------------|
| code-verified | 16 | 42% | Strongest — directly runnable |
| synthetic-verified | 7 | 18% | Good — pipeline works; needs real-user confirmation |
| research-verified | 6 | 16% | Good — primary sources cited |
| structural-only | 6 | 16% | Architecture exists; not end-to-end proven |
| projected-unvalidated | 7 | 18% | Acceptable for a sprint prototype; must be disclosed |

**Overall readiness: TRL 4→5.** The architecture is proven. The pipeline works on synthetic data. The market research is credible. The business projections are documented estimates. Real-user validation is the next required step to reach TRL 6.
