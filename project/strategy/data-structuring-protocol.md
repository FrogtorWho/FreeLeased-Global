# Data Structuring Protocol (DSP)

**Status:** binding · **Version:** 1.0 · **Owner:** FreeLeased core
**Rule:** every automated workflow references its inputs and outputs by DSP ID.
No workflow invents an ad-hoc shape. If a shape is missing, add a DSP entry
here first, then reference it.

This is the single source of truth for the *shape and provenance discipline* of
every record that moves through the system. It is deliberately small, stable,
and codified in TypeScript so the protocol and the running code cannot drift.

---

## Cross-cutting law: the honesty spine

Two enumerations govern every record. They are defined once in code
(`src/lib/fairness.ts`) and imported everywhere — never re-declared.

### DSP-0a · `EvidenceClass` + `CONFIDENCE_CAP`
Source of truth: `src/lib/fairness.ts`.

| Class | Meaning | Confidence ceiling |
|---|---|---|
| `established` | broadly settled / directly verifiable | **0.95** |
| `heuristic` | pattern-based, jurisdiction wording varies | **0.60** |
| `contested` | disputed or method-dependent | **0.40** |
| `unfalsifiable` | cannot be checked against a source | **0.20** |

**Enforcement:** any displayed confidence is `min(raw, CONFIDENCE_CAP[class])`.
A record can never present more certainty than its evidentiary basis allows.

### DSP-0b · `Conviction` (provenance of a datum)
Source of truth: `src/data/spine.ts`.

`confirmed` 🔥 · `verified` ✅ · `primary` ⭐ · `quantitative` 📊 ·
`inference` 💭 · `pending` ⏳

Every stored datum carries a `conviction`. `inference`/`pending` datums are
visibly marked and cannot be laundered into `verified`.

---

## Codified record shapes

### DSP-1 · Jurisdiction
`src/data/spine.ts → interface Jurisdiction`
`code, name, capital, tenureSystem, registry{name,url,conviction}, statisticalOffice{name,url}, centralBank?, climate, inPilot, pilotResidents`
Rule: `registry.conviction` drives downstream data-sufficiency scoring; a
non-`verified` registry caps a jurisdiction's land-intelligence band.

### DSP-2 · Statute
`src/data/spine.ts → interface Statute`
`id, jurisdiction, shortTitle, citation, url, covers, conviction, note?`
Rule: citations are recorded **at Act level**; an exact section is only
`verified` when the URL resolves to the text. Otherwise `inference`.

### DSP-3 · DataSource (provenance feed)
`src/data/spine.ts → interface DataSource`
`id, tier(0|1|1.5|2|3|4), name, gives, url, license, cadence, conviction, jurisdiction?`
Tier ladder: **0** regional open data · **1** national registry · **1.5** semi-open ·
**2** derived/statistical · **3** partner/MoU · **4** inferred. License and cadence
are mandatory so refresh and reuse rights are always known.

### DSP-4 · FairnessFlag / FairnessResult
`src/lib/fairness.ts → interface FairnessFlag, FairnessResult`
`ruleId, topic, clauseExcerpt, citation, severity, evidenceClass, confidence, explanation`
+ result-level `disclaimer`.
Rule: document-only. Describes a **clause**, never a person. Confidence obeys
DSP-0a. Always carries the not-legal-advice disclaimer.

### DSP-5 · TelemetrySpan
`src/lib/telemetry.ts → interface Span`
Rule: every agentic workflow step opens a span (OTel-friendly) so the loop is
observable end-to-end — the evidence for the "efficiency / orchestration"
judging axis.

### DSP-6b · MaturityAssessment (derived, not stored)
`src/lib/jurisdiction.ts → interface MaturityAssessment`
`jurisdiction, statuteCount, strongCount, verifiedRatio, maturity('established'|'developing'|'nascent')`
Rule: computed live from DSP-2 statute convictions — never hand-set. It is the
dynamic input that makes the consensus gate (DSP-6) jurisdiction-aware: less
mature spines demand more corroboration and cap harder. Served at
`GET /api/jurisdictions/maturity`.

### DSP-6 · ConsensusEstimate / ConsensusResult
`src/lib/consensus.ts → interface Estimate, ConsensusResult`
`Estimate: source('codified'|'rag-agentic'), claim, value, confidence, evidenceClass, citations[]`
`ConsensusResult: claim, verdict('surface'|'review'|'abstain'), agreement, value, confidence, evidenceClass, citations[], rationale, tier`
Rule: this is the contract the codified engine and the RAG-agentic workflow
BOTH emit for a shared `claim`, so the Tier-3 gate can cross-check them.
`citations` is mandatory for any `rag-agentic` estimate.

---

## Referencing rule (how workflows cite this file)

In code and in workflow docs, name the protocol inline, e.g.
`// emits DSP-4` or “Step 3 produces a DSP-6 estimate.” A reviewer can then
trace any datum from UI → route → engine → DSP entry → source URL without
guessing. The automation doctrine (`automation-doctrine.md`) maps every
workflow to the DSP records it consumes and produces.

---

## DSP-10 · `LegislativeFramework` (canonical record type)

> Added 2026-08-11 — see [`jurisdiction-onboarding-workflow.md`](jurisdiction-onboarding-workflow.md:1)
> for the end-to-end onboarding playbook.

A **`LegislativeFramework`** is the canonical record type for *one jurisdiction's
complete legal hierarchy*. It is the input contract for the v2 spine
([`src/data/spine-v2.ts`](../../src/data/spine-v2.ts:1)) and for the
jurisdiction knowledge graph.

| Tier of record | Field | Cardinality | Example |
|---|---|---|---|
| Jurisdiction header | `jurisdiction` | 1 | `{ code: "UK", legalSystem: "common-law", officialGazette: "https://www.legislation.gov.uk/" }` |
| Primary acts | `primaryActs[]` | N | LTA 1985, CLRA 2002, BSA 2022, LFRA 2024 |
| Regulations | `regulations[]` | M | s.20 Consultation Regulations 2003 |
| Statutory instruments | `statutoryInstruments[]` | K | SI 2025/131 (LFRA Commencement No. 3) |
| Reform amendments | `reformAmendments[]` | R | HFHHA 2018 → LTA 1985 s.9A |
| Leading cases | `leadingCases[]` | C | s.20 LTA 1985 service-charge reasonableness |
| Procedural rules | `proceduralRules[]` | P | FTT (Property Chamber) Rules 2013 |
| Enforcement bodies | `enforcementBodies[]` | E | FTT (Property Chamber), BSR/HSE, LEASE |
| Remedies | `remedies[]` | Y | Service-charge determination, RTM acquisition |

**Shape and discipline:** every record carries `conviction` (canonical
4-class set: `established | heuristic | contested | unfalsifiable` — same
as DSP-0a), a validated `sourceUrl`, and a `[PERSON_NAME]`-safe
contributor pseudonym. The schema is defined in
[`src/data/legislative-framework-schema.ts`](../../src/data/legislative-framework-schema.ts:1)
and is enforced by [`scripts/test-legislative-schema.ts`](../../scripts/test-legislative-schema.ts:1)
at every CI pass.
