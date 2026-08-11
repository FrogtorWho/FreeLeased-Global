# BRIEF 5: Pilot Audit Setup & Execution

> **Agent type:** Technical/research agent with data pipeline experience
> **Priority:** HIGH — Must be ready by Day 14 (9 Aug 2026)
> **Owner action:** Sam runs the audit against a real lease; agent sets up the pipeline
> **Output:** A synthetic lease document → processed through the full audit pipeline → producing a complete resident dossier

---

## 1. Context

FreeLeased is at TRL Level 4→5 (working prototype, first real-user test in progress). To close the Product-Market Fit and Impact scores to 9.5, we need to demonstrate that the audit pipeline works end-to-end against a realistic input — not just synthetic test fixtures.

**What needs to happen:** A realistic lease document (UK AST — Assured Shorthold Tenancy) needs to be processed through the full FreeLeased audit pipeline, producing a complete resident dossier with:
- Clause-by-clause fairness scoring
- Evidence-class tagging (established/heuristic/contested/unfalsifiable)
- Consensus gate validation (2/3 human)
- Rights discovery (which statutory rights apply)
- Compliance assessment (which thresholds are met)
- Redaction protocol (PII scrubbing)

**This is NOT a real leaseholder's data.** We use a synthetic lease document that is realistic enough to demonstrate the pipeline. The lease text should be based on real UK AST patterns but with fictional names, addresses, and financial details.

## 2. Deliverables

| # | Deliverable | Format | Purpose |
|---|---|---|---|
| 1 | Synthetic UK AST lease document | Markdown/text | Input to the pipeline |
| 2 | Clause extraction & mapping | Structured data | Each clause mapped to statute |
| 3 | Fairness scoring | Scored output | Each clause scored against statutory floor |
| 4 | Evidence-class tagging | Classification | Each claim tagged with evidence class |
| 5 | Rights discovery | List | Which statutory rights the leaseholder has |
| 6 | Consensus gate result | Pass/fail | Which claims pass 2/3 validation |
| 7 | Redacted dossier | Document | Final output with PII scrubbed |
| 8 | Pipeline documentation | Markdown | How the pipeline works, what it proves |

## 3. The Existing Pipeline

The FreeLeased audit pipeline is already built and tested. Here are the key files:

| File | What it does |
|---|---|
| `src/lib/fairness.ts` | Scores lease clauses against statutory floors. Returns fairness scores with evidence classes. 13/13 tests passing. |
| `src/lib/consensus.ts` | Cross-checks codified vs RAG-agentic estimates. Requires 2/3 human validation. 18/18 tests passing. |
| `src/lib/veracity.ts` | Admiralty/NATO source grading. Tags every claim with evidence class (established/heuristic/contested/unfalsifiable). 22/22 tests passing. |
| `src/lib/engines.ts` | Core engines: `buildDossier()`, `redactionProtocol()`, `communeAggregate()`, `rowHash()`, `DS_THRESHOLD`. |
| `src/lib/gates.ts` | `sweep()` function — runs all hidden-rights patterns against input text, returns pass/fail. |
| `src/lib/research.ts` | Research desk — spine lookup, source verification. |
| `src/data/spine.ts` | 9 jurisdictions, 25+ statutes, 25+ sources, 20 hidden-rights patterns. |
| `src/data/fixtures.ts` | 50 synthetic pilot residents (20 BB + 15 JM + 15 KY). |
| `scripts/test-suite.ts` | Master test runner — 65/67 passing. |

**The pipeline already works.** The task is to run it against a realistic UK AST lease and document the output as proof of TRL Level 4→5.

## 4. Synthetic Lease Document Requirements

Create a synthetic UK AST lease that includes:

### Minimum required clauses:
1. **Term & rent** — Fixed term 12 months, monthly rent within London average range
2. **Service charge** — Uncapped or vaguely defined (this is a hidden rights trigger)
3. **Consultation threshold** — Section 20 notice requirement (s.20 CLRA 2002)
4. **Repair obligations** — Implied covenant vs explicit clause (this tests fairness scoring)
5. **Forfeiture clause** — Re-entry provisions (tests risk scoring)
6. **Deposit protection** — Must reference TDS or DPS (tests compliance)
7. **Subletting restrictions** — May be unreasonable (tests fairness)
8. **Notice to quit** — Standard 2 months (tests statutory compliance)
9. **Service charge audit rights** — s.20C CLRA 2002 (tests rights discovery)
10. **RTM eligibility** — s.72 CLRA 2002 (tests the core pipeline)

### Fictional data:
- **Property:** Flat 4, 27 Chestnut Grove, London SW19 8BH
- **Tenant name:** Alex Morgan (fictional)
- **Landlord:** Pinnacle Management Ltd (fictional)
- **Agent:** Sterling Property Services (fictional)
- **Start date:** 1 March 2025
- **Monthly rent:** £1,850
- **Deposit:** £5,550 (3 months — above the 5-week cap, which is a fairness trigger)
- **Lease type:** Assured Shorthold Tenancy

### What makes it realistic:
- Use real UK AST clause patterns (not made-up legalese)
- Include at least 3 "hidden rights" triggers (service charge, s.20, RTM eligibility)
- Include at least 2 fairness concerns (uncapped service charge, excessive deposit)
- Include at least 1 compliance gap (missing TDS/DPS reference in deposit clause)

## 5. How to Run the Pipeline

```typescript
// 1. Import the engines
import { buildDossier, redactionProtocol } from '../src/lib/engines'
import { sweep } from '../src/lib/gates'
import { STATUTES, SOURCES, HIDDEN_RIGHTS } from '../src/data/spine'

// 2. Create a synthetic resident record
const resident = {
  id: 'pilot-uk-001',
  jurisdiction: 'UK',
  name: 'Alex Morgan',
  address: 'Flat 4, 27 Chestnut Grove, London SW19 8BH',
  leaseType: 'AST',
  // ... other fields matching the fixtures.ts pattern
}

// 3. Build the dossier
const dossier = buildDossier(resident)

// 4. Sweep for hidden rights
const sweepResult = sweep(leaseText + ' ' + dossier.summary)
// Returns: { results: Array<{ patternId, pass, evidence, statuteIds }> }

// 5. Run redaction
const redacted = redactionProtocol(dossier)
// Returns: dossier with PII scrubbed

// 6. Document the output
console.log('Dossier:', JSON.stringify(dossier, null, 2))
console.log('Sweep results:', sweepResult)
console.log('Redacted:', redacted)
```

## 6. Source Files to Read

| File | Why |
|---|---|
| `src/data/fixtures.ts` | Pattern for resident record structure |
| `src/lib/engines.ts` | `buildDossier()`, `redactionProtocol()`, `communeAggregate()` |
| `src/lib/fairness.ts` | Fairness scoring logic — how clauses are scored |
| `src/lib/consensus.ts` | Consensus gate — how claims are cross-checked |
| `src/lib/veracity.ts` | Veracity engine — how evidence classes are assigned |
| `src/lib/gates.ts` | `sweep()` — how hidden-rights patterns are matched |
| `src/data/spine.ts` | Jurisdictions, statutes, sources, patterns |
| `scripts/test-suite.ts` | How the pipeline is tested (65/67 passing) |
| `scripts/test-fairness.ts` | Fairness-specific tests (for output format reference) |
| `scripts/test-consensus.ts` | Consensus-specific tests (for output format reference) |

## 7. Output Documentation

The agent should produce a `pilot-audit-report.md` that documents:

### Structure:
1. **Executive Summary** (100 words): What was tested, what was found, what it proves
2. **Input**: The synthetic lease document (full text)
3. **Pipeline Execution**: Step-by-step walkthrough of each engine
4. **Output**: The complete dossier (redacted)
5. **Findings**: What the audit found (hidden rights, fairness concerns, compliance gaps)
6. **Evidence Classes**: How each finding was classified
7. **Consensus Gate**: Which findings passed human validation
8. **TRL Assessment**: What this proves about the product maturity level
9. **Limitations**: What this does NOT prove (it's synthetic, not a real leaseholder)

### Quality standard:
Follow the PDF standard in `files/Beneficiaries_of_UK_Socio-Economic_and_Demographic_Trends.pdf` — executive summary, structured sections, data-backed claims, citations to source files.

## 8. Style Rules

- **UK English** throughout
- **No AI tells**: no "leveraging", "cutting-edge", "seamless", "game-changing"
- **No fake data**: every figure traces to a verifiable source
- **Evidence classes on every claim**: established / heuristic / contested / unfalsifiable
- **Honest limitations**: state what this does NOT prove
- **Cite source files**: reference the actual TypeScript files that produce each output

## 9. Output Format

Save in `project/agent-briefs/pilot-audit/`:
- `synthetic-lease.md` — The full synthetic UK AST lease document
- `pilot-audit-report.md` — Complete pipeline execution report
- `pipeline-output.json` — Raw pipeline output (dossier + sweep + redaction)
- `audit-summary.md` — 1-page executive summary for submission pack

## 10. Glossary

| Term | Definition |
|---|---|
| AST | Assured Shorthold Tenancy — the standard UK residential tenancy agreement |
| TRL | Technology Readiness Level — NASA scale 1-9 (we are at 4→5) |
| CLRA 2002 | Commonhold and Leasehold Reform Act 2002 |
| s.20 | Section 20 CLRA 2002 — consultation threshold for major works |
| s.20C | Section 20C CLRA 2002 — costs limit for service charge recovery |
| s.72 | Section 72 CLRA 1993 — RTM eligibility for qualifying buildings |
| Dossier | Per-resident advisory document built from pipeline |
| Redaction Protocol | PII scrubbing: removes names, addresses, emails before consensus gate |
| Commune Aggregate | k-anonymity (≥5) community-level data aggregation |
| Hidden Rights | 20 statutory protections that leaseholders don't know exist |
| Consensus Gate | Cross-check requiring 2/3 human validation |
| Evidence Class | Confidence level: established, heuristic, contested, unfalsifiable |
| Sweep | The function that runs all hidden-rights patterns against input text |
| DS_THRESHOLD | Document similarity threshold for the data spine |
