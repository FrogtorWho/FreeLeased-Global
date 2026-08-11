# The Gauntlet Loop — FreeLeased Overnight Agent

**Purpose.** A fully autonomous, self-improving loop the overnight agent runs while Sam sleeps. It personalises the leaseholder macro to each individual regardless of jurisdiction or input quality, and it cannot make an unverified claim.

**Design principle.** The loop never claims more than the inputs support. When inputs are weak (a "crumpled up bill"), it returns a confidence-scoped dossier with explicit gaps and a request for more evidence — not a fabricated answer.

---

## Architecture — Five Sub-Loops

The gauntlet is five sub-loops, each with its own inputs, outputs, and exit criteria. They run sequentially each pass, then feed each other.

```
   ┌─────────────────────────────────────────────────────────┐
   │                GAUNTLET LOOP — 1 PASS                    │
   │                                                          │
   │  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐  │
   │  │ 1 PROCESS    │───►│ 2 RESEARCH   │───►│ 3 UPDATE    │  │
   │  │  (intake)    │    │  (spine)     │    │  (spine/    │  │
   │  │              │    │              │    │   dossiers) │  │
   │  └──────────────┘    └──────────────┘    └─────────────┘  │
   │           │                                    │          │
   │           ▼                                    ▼          │
   │  ┌──────────────┐                    ┌──────────────┐    │
   │  │ 5 SELF-IMPROVE│◄───────────────────│ 4 MAINTENANCE│    │
   │  │  (audit +     │                    │  (stale,     │    │
   │  │   retrain)    │                    │   SLA, decay)│    │
   │  └──────────────┘                    └──────────────┘    │
   │           │                                             │
   │           └──────────────► repeat                       │
   └─────────────────────────────────────────────────────────┘
```

Each sub-loop is owned by a specific code module; each emits a structured log row to `memory/<date>.md`.

---

## Sub-Loop 1 — PROCESS (intake + normalise)

**Owner:** `src/core/document_processor.py` + `src/lib/ocr-pipeline.ts` + `src/lib/offline.ts` + **Giotto.ai multimodal client** ([`src/core/giotto_client.py`](../../src/core/giotto_client.py))

**Input:** Any of:
- Photo of a lease / bill / letter / tribunal decision (via mobile capture)
- Typed form input (web UI)
- Pseudonymous intake (50-fixture pilot)
- Voice note (future)

**Behaviour:**
1. Classify the document (`vlm-pipeline.ts: classifyDocument` — 7 types: lease, bill, letter, decision, correspondence, schedule, other). The **Giotto.ai** multimodal endpoint is the preferred VLM: compact reasoning model + image inputs in one call — see [`giotto-integration-research.md`](giotto-integration-research.md). When `GIOTTO_API_KEY` is the placeholder, the loop falls back deterministically (regex + `simulateLLMCall`).
2. OCR if needed (`ocr-pipeline.ts` — Tesseract.js with Canvas preprocessing); Giotto also exposes OCR — kept as optional second pass for low-confidence scans.
3. Extract structured fields (`title_agent.py` via Nebius DeepSeek-R1 *or* the Giotto client via [`get_giotto_client_or_none()`](../../src/core/giotto_client.py); deterministic regex fallback remains the final safety net).
4. Score input quality on 4 axes:
   - **Completeness** (0–1): are required fields present?
   - **Legibility** (0–1): OCR confidence
   - **Coherence** (0–1): do fields contradict?
   - **Jurisdictional match** (0–1): does the doc cite a known statute?

**Output:** A `ResidentIntake` object:
```typescript
interface ResidentIntake {
  id: string;                    // pseudonymous
  jurisdiction: string;          // 'UK' | 'BB' | 'JM' | ...
  inputQuality: { completeness: number; legibility: number; coherence: number; jurisdictionalMatch: number };
  rawFields: Record<string, unknown>;
  gaps: string[];                // e.g. ['missing:unit_entitlement', 'unclear:service_charge_2024']
  recommendedNextEvidence: string[];  // "Photo of last 3 years' service charge bills"
  processedAt: string;           // ISO timestamp
}
```

**Exit criteria:** inputQuality.completeness ≥ 0.4 OR user explicitly opts in to proceed with acknowledged gaps.

**Honesty rule:** Never fabricate missing fields. If `unit_entitlement` is missing, the dossier says "unit entitlement: UNKNOWN — request evidence" rather than guessing.

---

### Cross-link — Giotto.ai Integration

The PROCESS sub-loop is the primary wiring point for **Giotto.ai** — the 7th sponsor added 2026-08-11. Giotto's compact reasoning model + multimodal inputs (text + image + OCR) replace the long-running `simulateLLMCall` for lease-intake classification. With the API key in place, [`src/core/giotto_client.py`](../../src/core/giotto_client.py) provides an OpenAI-compatible client that the dossier engines call directly; until the key is provisioned (claim email at [`06-giotto-claim-email.md`](06-giotto-claim-email.md)), the loop degrades to deterministic record/playback. Risk register and decision log live in [`giotto-integration-research.md`](giotto-integration-research.md).

---

## Sub-Loop 2 — RESEARCH (spine lookup + citation)

**Owner:** `src/data/spine.ts` + `src/lib/research.ts` + `src/lib/knowledge-graph.ts`

**Input:** `ResidentIntake`

**Behaviour:**
1. Find every statute in [`spine.ts`](src/data/spine.ts:1) that matches the jurisdiction + topic
2. For each statute, walk the knowledge graph to find related patterns, precedents, and cross-jurisdiction transfers
3. Check freshness: statutes older than SLA (jurisdiction 365d, statute 180d, contract 120d) get a `staleness` flag
4. For statutes marked `inference` or `pending`, attach a "verification needed" disclaimer
5. Generate the citation chain: statute → source URL → conviction class → confidence cap

**Output:** A `StatuteMatch[]` object, each with:
```typescript
interface StatuteMatch {
  statuteId: string;
  conviction: 'established' | 'heuristic' | 'contested' | 'unfalsifiable';
  confidence: number;             // capped per truth-protocol (0.99/0.75/0.60/0.33)
  sourceUrl: string;              // canonical citation
  sourceType: 'legislation.gov.uk' | 'ojn' | 'gazette' | 'caselaw' | 'tribunal';
  fetchedAt: string;             // ISO timestamp
  staleness: 'fresh' | 'stale' | 'transitional';
  verificationNote: string | null;  // e.g. "MoJ portal JS-rendered; re-source before citing"
}
```

**Exit criteria:** at least 1 statute match found, OR a clear "no statutory framework in spine for this situation" verdict with a request to onboard a new jurisdiction.

**Honesty rule:** Never cite a statute with conviction `inference` as if it were `established`. The UI shows the conviction class icon, the dossier footer names every cited statute's conviction class.

---

## Sub-Loop 3 — UPDATE (dossier build + verdict)

**Owner:** `src/lib/engines.ts` (4-agent DS gauge) + `src/lib/consensus.ts` + `src/lib/fairness.ts`

**Input:** `ResidentIntake` + `StatuteMatch[]`

**Behaviour:**
1. Run the 4 dossier engines in parallel (Resident Status, Tenure+Building, Contracts, Hidden Rights) — see [`engines.ts:208-216`](src/lib/engines.ts:208)
2. Each engine returns a DS-graded verdict (belief, plausibility, disbelief, commitment, coverage)
3. Consensus gate ([`consensus.ts:58 SURFACE_THRESHOLD = 0.5`](src/lib/consensus.ts:58)) decides: surface (aligned) / review (divergent) / cap (single-source)
4. Fairness flags applied ([`fairness.ts`](src/lib/fairness.ts:1))
5. HITL (Sam) required for any verdict touching resident-facing advice OR conviction `unfalsifiable`/cap < 0.5

**Output:** A `Dossier`:
```typescript
interface Dossier {
  id: string;
  residentId: string;
  builtAt: string;
  engines: {
    residentStatus: Verdict;
    tenureBuilding: Verdict;
    contracts: Verdict;
    hiddenRights: Verdict;
  };
  consensus: 'aligned' | 'divergent' | 'single-source';
  fairnessFlags: string[];
  hitlRequired: boolean;
  citedStatutes: StatuteMatch[];   // from sub-loop 2
  inputGaps: string[];             // from sub-loop 1
  recommendedActions: Action[];
}
```

**Exit criteria:** consensus == 'aligned' AND hitlRequired == false → surface; otherwise queue for HITL.

**Personalisation rule:** The macro's recommended actions are **filtered** by what the individual actually submitted. If they only submitted a service charge bill, the dossier leads with service-charge findings, not RTM eligibility. The 4 engine verdicts are always shown so the resident sees the full picture, but the action plan is prioritised by relevance to their submission.

---

## Sub-Loop 4 — MAINTENANCE (staleness + SLA + decay)

**Owner:** `src/lib/research.ts` + `src/lib/learning.ts` + `scripts/test-telemetry.ts`

**Input:** Every `Dossier` ever built, every `StatuteMatch` ever fetched

**Behaviour:**
1. Scan all spine entries with `lastFetched > SLA` days ago (jurisdiction 365, statute 180, contract 120)
2. Mark stale entries with `staleness: 'stale'`
3. For entries marked `inference` or `pending`, retry fetch against canonical source URL; if the fetch returns a 200 with matching content, upgrade conviction; if not, downgrade
4. Run telemetry health: are OTLP spans reaching `https://in.ollygarden.cloud/v1/traces`? (sample 1% of spans, ping the endpoint)
5. Update the `decay` table in `learning.ts`: every dossier that triggered HITL review leaves a fingerprint

**Output:** A `MaintenanceReport` written to `memory/<date>.md`:
```
# MAINTENANCE REPORT — 2026-08-10
- Statutes refreshed: 7
- Statutes marked stale: 2 (uk-clra-s72, jm-strata)
- Conviction upgrades: 1 (vg-rla inference → heuristic)
- Conviction downgrades: 0
- Telemetry health: 99.2% of spans reached OllyGarden
- Dossiers queued for HITL: 3
```

**Exit criteria:** report written; no P0 staleness events (a P0 staleness = a statute relied on by an active verdict has expired).

**Honesty rule:** Never hide a stale statute from a verdict — surface it in the dossier footer with the fetch date.

---

## Sub-Loop 5 — SELF-IMPROVE (audit + retrain conviction weights)

**Owner:** `src/lib/learning.ts` (Bayesian conviction update) + `src/lib/veracity.ts` (STANAG-2511 grading) + `scripts/test-veracity.ts`

**Input:** Last 24h of `Dossier` objects + every HITL verdict (Sam's actual sign-off or override)

**Behaviour:**
1. For every dossier that went to HITL, record whether Sam signed it off, overrode it, or rejected it
2. Bayesian update on the conviction weight for each statute: if Sam confirmed the verdict, +0.05 (capped); if Sam overrode, -0.10
3. Recompute the consensus threshold: if more than 20% of last 100 dossiers triggered divergent consensus, lower `SURFACE_THRESHOLD` by 0.05 (max 0.3); if fewer than 5%, raise by 0.05 (max 0.7)
4. Veracity test: re-run all 22 veracity tests + 159 test-suite assertions. If any fail, file a `SelfImprovementIssue` and queue it for the next day's 09:00 heartbeat.
5. Update the conviction table in `learning.ts` and persist to `data/learning_state.json`

**Output:** A `SelfImprovementLog`:
```
# SELF-IMPROVE — 2026-08-10
- HITL decisions sampled: 4 (signed 3, overridden 1)
- Conviction weight deltas:
  - uk-lfra-s20: 0.92 → 0.95 (3 confirmations)
  - uk-clra-s72: 0.75 → 0.70 (1 override)
  - jm-strata: 0.60 → 0.60 (no change)
- Consensus threshold: 0.50 → 0.50 (no drift)
- Veracity tests: 22/22 PASS
- Test suite: 159/159 PASS
- Self-improvement issues filed: 0
- Next-loop watchpoints: [uk-clra-s72 dropped below 0.75 — needs re-source]
```

**Exit criteria:** all 159+22 tests pass; conviction table persisted; issues filed for any degradation.

**Honesty rule:** Never silently rebalance convictions. Every delta is logged with the dossier ID and Sam's decision that caused it. The conviction table is auditable from `data/learning_state.json`.

---

## Cadence — How Often Each Sub-Loop Runs

| Sub-loop | Cadence | Owner | Trigger |
|---|---|---|---|
| 1 PROCESS | per intake (event-driven) | orchestrator | new `ResidentIntake` arrives |
| 2 RESEARCH | per dossier (event-driven) | orchestrator | sub-loop 1 emits |
| 3 UPDATE | per dossier (event-driven) | orchestrator | sub-loop 2 emits |
| 4 MAINTENANCE | nightly 02:00 UTC | scheduler | cron |
| 5 SELF-IMPROVE | nightly 03:00 UTC | scheduler | after MAINTENANCE completes |

Sub-loops 1–3 run on every dossier build. Sub-loops 4–5 run overnight while Sam sleeps. The overnight agent owns 4 + 5; the daily agent owns 1–3.

---

## Jurisdiction Adaptation — The Crumpled-Bill Principle

The gauntlet must work for **any** legal framework, including ones not yet in the spine. Rules:

1. **No jurisdiction is special.** Same 5 sub-loops apply. The only thing that changes is the spine data.
2. **Onboard a new jurisdiction = add a Jurisdiction record + add Statute records + add DataSource records + add StatuteRules.** Nothing else. (Per [`multi-jurisdiction-legal-spine.md:96-103`](project/strategy/multi-jurisdiction-legal-spine.md:96).)
3. **Crumpled-bill resilience.** If `inputQuality.completeness < 0.4`, the gauntlet does NOT refuse to proceed. Instead it:
   - Lists what's missing
   - Lists what additional evidence would close the gap
   - Builds a "preliminary dossier" with every verdict marked `confidence = capped * 0.5` (further de-rated)
   - Routes to HITL
   - The dossier is held until the resident submits the missing evidence OR Sam overrides
4. **Multi-jurisdiction dossiers.** If a resident submits docs from multiple jurisdictions (e.g., UK lease + Jamaican tribunal decision), the gauntlet:
   - Runs sub-loop 2 per jurisdiction
   - Cross-links via the knowledge graph
   - Flags any jurisdiction where the verdict is `unfalsifiable`

---

## Self-Improvement Loop — Closing the Circle

The five sub-loops are not five separate processes — they form a **single self-improving loop**:

```
PROCESS ──► dossier built
   │
RESEARCH ──► statutes cited
   │
UPDATE ──► verdict rendered
   │
MAINTENANCE ──► spine refreshed, decayed entries marked
   │
SELF-IMPROVE ──► conviction weights retuned based on Sam's HITL
   │
   └──────► next PROCESS benefits from retuned weights
```

Every dossier makes the next dossier slightly more accurate. After 1,000 dossiers, the conviction table is statistically meaningful. After 10,000, it predicts Sam's HITL decisions with high fidelity.

---

## Overnight Agent Task List (verbatim — copy into a `.todo.md` for the agent)

```markdown
# Overnight Gauntlet — Monday 2026-08-10 → Tuesday 2026-08-11

## 02:00 UTC — MAINTENANCE (sub-loop 4)
- [ ] Run `bun scripts/spine-refresh.ts` (refresh all statutes lastFetched > SLA days)
- [ ] For each `inference`/`pending` statute, fetch canonical source URL
- [ ] Upgrade conviction on successful 200-with-content; downgrade on miss
- [ ] Telemetry health: sample 1% of spans, ping OllyGarden
- [ ] Write `memory/2026-08-11.md` MaintenanceReport section

## 03:00 UTC — SELF-IMPROVE (sub-loop 5)
- [ ] Sample last 24h of HITL decisions (signed/overridden/rejected)
- [ ] Bayesian update conviction weights in `data/learning_state.json`
- [ ] Recompute `SURFACE_THRESHOLD` if drift threshold hit (>20% or <5% divergent)
- [ ] Re-run `bun scripts/test-suite.ts` (expect 159/159) and `scripts/test-veracity.ts` (expect 22/22)
- [ ] File SelfImprovementIssue for any test failure
- [ ] Write `memory/2026-08-11.md` SelfImprovementLog section

## 03:30 UTC — SAM'S MORNING DIGEST
- [ ] Compile overnight summary into `memory/2026-08-11.md`:
  - 1-paragraph headline
  - Sub-loop 4 report
  - Sub-loop 5 log
  - Any SelfImprovementIssues
  - Next-24h picks (use Stage 7 top-15 list)
- [ ] Append to AI_JOURNAL.md a 1-line summary
- [ ] Update HEARTBEAT.md Daily Progress Log
- [ ] Commit: `git add . && git commit -m "overnight: gauntlet loop N — <key deltas>"` (no push)

## 04:00 UTC — IDLE
- [ ] Sleep mode; only wake on `bun scripts/health-check.ts` failure OR Sam override
```

---

## Honesty Guarantees (carried in MEMORY.md)

The gauntlet loop will never:
1. Cite a statute with conviction it doesn't have
2. Fabricate a missing field
3. Hide a stale entry
4. Silently rebalance conviction weights
5. Mark a low-input-quality dossier as high confidence without the explicit "preliminary" label

The gauntlet loop will always:
1. Show the conviction class icon next to every cited statute
2. Surface input gaps in the dossier footer
3. Request additional evidence rather than guessing
4. Route contested or low-confidence verdicts to HITL
5. Persist every conviction delta with the triggering dossier ID

---

## MAINTENANCE sub-loop — uses the new LegislativeFramework schema

> Added 2026-08-11 — see [`jurisdiction-onboarding-workflow.md`](jurisdiction-onboarding-workflow.md:1).

The MAINTENANCE sub-loop (sub-loop 4) now reads from the v2
`LegislativeFramework` schema defined in
[`src/data/legislative-framework-schema.ts`](../../src/data/legislative-framework-schema.ts:1)
and the per-jurisdiction JSONs under
[`src/data/frameworks/`](../../src/data/frameworks/). The
`lastVerified` field on each `primaryActs[]`, `statutoryInstruments[]`,
and `remedies[]` record drives the SLA cadence described in the
workflow §10:

- **Primary statute (UK)** — re-verify every 180 days (LFRA / BSA
  amendments are frequent).
- **Primary statute (BB / JM / KY)** — every 365 days.
- **Statutory instrument** — every 90 days.
- **Leading case** — every 365 days.
- **Procedural rule / enforcement body / remedy** — every 365 / 365 / 180
  days.

A `*` marking in the nightly `staleness` report is the trigger for a
re-extract (workflow §4–§6). The scrape scaffold
[`scripts/scrape-jurisdiction.ts`](../../scripts/scrape-jurisdiction.ts:1)
probes every URL in the framework on demand; the test harness
[`scripts/test-legislative-schema.ts`](../../scripts/test-legislative-schema.ts:1)
validates the schema on every CI pass.