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
---

## Ingest Protocol —— The Input Contract

> Added Phase 16 —— the gauntlet never starts work without answering these
> six questions. They are the **input contract** between whoever is
> asking and whatever the loop produces. Every dossier, every HITL
> request, every overnight job, every external API call must carry a
> `gauntlet-ingest` block answering all six.

When something arrives at the gauntlet (an intake, an advisor
question, a Sam override, a scheduled maintenance trigger, a
contributor PR, an LFRA application), the gauntlet must first
extract or be told:

### 1. WHO is asking?

| Caller            | Authority                              | Default bias |
|-------------------|----------------------------------------|--------------|
| `sam`             | Owner of the project. Last word.       | Trust, override-allowed |
| `advisor`         | A qualified practitioner partner       | Trust-but-verify |
| `judge`           | Tribunal or court (caribbean-supreme, FTT-PC, JM-SC) | Highest evidentiary standard |
| `user`            | A resident (pseudonymous)              | Plain-English, no jargon |
| `internal-agent`  | One of the project's own sub-loops     | Inherit caller's context |
| `partner`         | An institutional customer / NGO        | Reverse-trust (they may be wrong about their own needs) |
| `public`          | Marketing site visitor, social reader  | No PII, no specific advice |

If `who` is unknown, the gauntlet defaults to `public` (highest
friction, no personalised claim) and **does not proceed** until
`who` is asserted. This prevents a public reader from accidentally
triggering a HITL sign-off queue.

### 2. WHAT do they want?

A single primary verb, drawn from a closed enum:

- `decision` —— they want a binary / multi-option call (e.g. "Should I apply for RTM?")
- `analysis` —— they want the dossier engines run + a verdict
- `action` —— they want the project to **do** something (refresh spine, file, deploy)
- `recommendation` —— they want a ranked shortlist
- `audit` —— they want a re-run of a past decision against current evidence
- `explanation` —— they want the reasoning chain (no new claims)

Anything else is rejected with a "scope unclear —— re-state using the
enum above" prompt. This prevents the common failure mode of
"do everything" requests that produce shallow answers to all of it.

### 3. WHY now?

Urgency drives depth vs. cost trade-offs:

- `emergency` —— under 24h to act (e.g. bailiff next-morning). Default: shallow scan + flag for HITL.
- `urgent` —— under 7 days. Default: full dossier, condensed UI.
- `planned` —— over 7 days. Default: full dossier + freshness audit + scenario branches.
- `scheduled` —— cron-driven (maintenance, self-improve). Default: deterministic, auditable.
- `triggered` —— event-driven (data refresh, document upload). Default: incremental.
- `curiosity` —— Sam reading. Default: thin, fast, no persistence.

### 4. WHAT is the cost of being wrong?

| Reversibility | Cost asymmetry | Gauntlet posture |
|---------------|----------------|------------------|
| **Reversible + symmetric** | low | Move fast; HITL optional |
| **Reversible + asymmetric** | low | Move fast; log the asymmetry |
| **Irreversible + symmetric** | low | Move slow; HITL required |
| **Irreversible + asymmetric** | any | **HARD STOP** until Sam signs off |

Examples of `irreversible + asymmetric`:
- Filing an LFRA s.99 application on behalf of a resident
- Sending an email to a freeholder from a tenant's account
- Charging a payment method
- Signing a tenancy / licence / deed
- Publishing a stat under the project brand

The gauntlet must **refuse** to take an irreversible + asymmetric
action without an explicit Sam-level HITL signature. The
`signing.ts` ed25519 queue is the wired mechanism.

### 5. WHAT is the conviction?

Carry the truth-protocol four classes through every request:

| Class           | Confidence cap | Where it comes from |
|-----------------|---------------:|---------------------|
| `established`   | 0.99           | Statute on legislation.gov.uk; canonical |
| `heuristic`     | 0.75           | Multiple aligned sources, no contradiction |
| `contested`     | 0.60           | Disagreement among sources or pending case |
| `unfalsifiable` | 0.33           | Speculation, projection, opinion |

The ingest protocol **does not let the caller set the conviction**.
The gauntlet assesses it from the evidence. The caller can
*dispute* the conviction but cannot *override* it.

### 6. WHAT is the date?

Every ingest gets an ISO-8601 timestamp at receipt. Everything
downstream inherits this timestamp and emits `decisionDate` /
`expiryDate` fields. Without `date` the gauntlet **refuses to
emit any claim** —— this is the single most-overlooked failure
mode in legal-AI pipelines (a stale statute cited as current).

### Ingest block (canonical shape)

```typescript
interface GauntletIngest {
  who: CallerKind;
  what: RequestVerb;
  why: UrgencyKind;
  costOfBeingWrong: CostAxis;        // reversibility Ã— asymmetry
  conviction: ConvictionClass;       // asserted by gauntlet, not caller
  date: string;                      // ISO-8601, gauntlet-assigned
  source: string;                    // URL or internal event-id
  payload: unknown;                  // shape depends on `what`
}
```

`scripts/test-gauntlet.ts` enforces the shape and rejects malformed
ingests.

---

## Dated Conviction —— Every Output Carries Time

> Every gauntlet output is **dated, conviction-bounded, and
> time-limited**. Beliefs decay. The gauntlet never emits an
> undated claim and never claims more than the conviction
> class supports.

### The stamp

Every dossier, every recommendation, every cited statute,
every public-facing claim carries a `DatedConviction` stamp:

```typescript
interface DatedConviction {
  date:        string;   // ISO-8601: when this belief was formed
  class:       'established' | 'heuristic' | 'contested' | 'unfalsifiable';
  cap:         0.99 | 0.75 | 0.60 | 0.33;   // numeric cap per class
  expiry:      string;   // ISO-8601: when this belief must be re-checked
  sourceUrl:   string;   // canonical citation
  fetchedAt:   string;   // ISO-8601: when the source was actually retrieved
}
```

### Decay table (the "when does this belief rot?" schedule)

| Belief type              | Half-life | Re-verify cadence | Conviction floor |
|--------------------------|-----------|-------------------|------------------|
| **Statute** (primary)    | 365 days  | Annual + on amendment flag | `established` 0.99 |
| **Statute** (statutory instrument) | 90 days | Quarterly | `heuristic` 0.75 |
| **Case law** (leading)   | 180 days  | Twice-yearly + on appeal | `heuristic` 0.75 |
| **Tribunal decision**    | 180 days  | Twice-yearly | `contested` 0.60 |
| **Market claim** (prices, services, fees) | 90 days | Quarterly | `contested` 0.60 |
| **Regulator's view**     | 90 days   | Quarterly | `heuristic` 0.75 |
| **Personal advice**      | 30 days   | Monthly | `unfalsifiable` 0.33 |
| **Public-policy claim**  | 365 days  | Annual | `contested` 0.60 |
| **Local-edge LLM belief** | 7 days   | Weekly (model swap / re-prompt) | `contested` 0.60 |
| **Project self-claim** (build status) | 1 day | Each CI run | `established` 0.99 if CI green |

Anything past `expiry` is automatically **demoted** to the
conviction class below its current one. A statute that has
exceeded its 365-day freshness is treated as `heuristic`
until re-fetched, not as `established`.

### Source provenance

Every `DatedConviction` carries a `sourceUrl` that resolves to a
canonical document (legislation.gov.uk, a Caribbean official
gazette, a court transcript, or —— for `unfalsifiable` —— a
Sam-signed opinion record). The `fetchedAt` is the timestamp
the gauntlet **actually retrieved** the source, not when the
statute was enacted. This is the date that drives staleness.

### Display rules

- UI: every cited statute carries a coloured conviction pill
  (âœ“ established, ðŸ’­ heuristic, â³ contested, âš  unfalsifiable)
  next to its name.
- PDF: every citation in the footer carries the conviction
  class + fetch date.
- API: every JSON response wraps every claim in a
  `DatedConviction` block; clients can render or reject.

### Worked example

```json
{
  "claim": "The landlord served no Section 20 Notice of Estimate",
  "datedConviction": {
    "date": "2026-08-11",
    "class": "heuristic",
    "cap": 0.75,
    "expiry": "2027-02-07",
    "sourceUrl": "https://www.legislation.gov.uk/ukpga/1985/70/section/20",
    "fetchedAt": "2026-08-11T02:14:00Z"
  }
}
```

If a user re-runs the same analysis on 2027-03-01, the stamp
flips to `contested` (past expiry) and the UI shows a yellow
"stale statute —— re-fetch before relying" banner. The dossier
**never** silently promotes a stale statute back to
`established`.

---

## Outcomes & Impact —— Every Decision Must Answer Why

> Added Phase 16. Every decision the gauntlet takes answers
> five questions about human impact, second-order effects,
> third-order effects, the affected set, and the measurable
> target. If a decision cannot answer these, it is not yet a
> decision —— it is a hypothesis.

### The five questions

1. **What outcome are we trying to create?** —— the human impact.
   Not "what feature ships" but "what does a resident's life look
   like after this?"
2. **Second-order effect** —— what happens because of (1)? What
   does the freeholder, the court, the regulator do in response?
3. **Third-order effect** —— what happens two years out? What
   does the market, the policy, the precedent look like?
4. **Who's affected?** —— the affected set: residents,
   freeholders, advisors, judges, partners, the project itself.
5. **How do we measure?** —— one concrete metric + target date.

### Five worked examples

#### Example 1 —— The LFRA 2024 Sch.4 application

| Q | Answer |
|---|--------|
| Outcome | A Caribbean-resident leaseholder in the UK exercises their statutory Right to Manage under LFRA 2024 s.99, claims the building, and reduces annualised service-charge overspend by â‰¥ 15% |
| 2nd order | The freeholder's response is predictable (challenge, delay, quote inflated "cost-to-challenge"). Court set a precedent on (a) Caribbean-domiciled claimants and (b) digital evidence sufficiency. The local MP takes an interest. |
| 3rd order | Two years out: the Schelling focal point (below) draws 5—“10 analogous claims across London / Birmingham; one of them wins at UT(L&C); the precedent upgrades Caribbean-claimant filing from "novel" to "established". |
| Affected | The leaseholder (primary), the freeholder (defender), the FTT(Property Chamber), the project's reputation, future Caribbean claimants (downstream) |
| Measure | (a) â‰¥ 1 RTM notice of claim filed under Sch.4 by 2026-12-31; (b) â‰¥ 15% service-charge reduction attested by 2027-Q3; (c) precedent cited at least 1Ã— by 2028-Q1 |

#### Example 2 —— The Buildathon entry itself

| Q | Answer |
|---|--------|
| Outcome | Sam submits a complete, defensible FreeLeased build to a Caribbean-focused buildathon and **wins** (or, win or lose, achieves the in-the-world utility target: a free tool residents actually paste leases into). |
| 2nd order | If win: a credibility wedge opens —— institutional customers (Cayman Islands Govt, BB Ministry of Housing, etc.) ask for pilots. If lose: the project pivots from "awards strategy" to "direct outreach" —— same product, different distribution. |
| 3rd order | Two years out: the project is either a recognised brand in Caribbean housing policy, or it's a strong open-source artifact the next founder uses. Either is acceptable. |
| Affected | Sam (career), the judges (eval surface), the project brand, future Caribbean founders (inspiration / cautionary tale) |
| Measure | (a) Entry submitted before deadline; (b) in-the-world utility score â‰¥ 7.0 (vs. today's ~5.7); (c) â‰¥ 1 public user pastes a real lease before 2026-09-30 |

#### Example 3 —— Caribbean expansion (Barbados â†’ Jamaica â†’ Cayman â†’ T&T â†’ Bahamas â†’ Guyana â†’ Belize â†’ BVI)

| Q | Answer |
|---|--------|
| Outcome | A Caribbean leaseholder in any of 9 jurisdictions can paste their lease, get the relevant 20-pattern verdict, and read the relevant statute —— in their own language (English, then KreyÃ²l, Spanish, French Patois). |
| 2nd order | The local bar association responds (hostile if they see us as competition, friendly if we route through them). The regulator notices. The press writes a story. A second Caribbean gov't approaches us. |
| 3rd order | Two years out: either FreeLeased is the de-facto first-stop for Caribbean leaseholders (network-effect win), or it has been absorbed by a Caribbean gov't digital-service team (mission win, brand neutral). |
| Affected | Residents (primary); local bar associations (gatekeepers or partners); Caribbean gov'ts (customers or hosts); freeholders (defensive); the project's strategic optionality |
| Measure | (a) â‰¥ 3 jurisdictions with verified statute coverage by 2027-Q2; (b) â‰¥ 100 real resident intakes by 2027-Q4; (c) â‰¥ 1 institutional pilot signed by 2028-Q1 |

#### Example 4 —— Local-edge LLM (Ollama + MiniMax, sovereign inference)

| Q | Answer |
|---|--------|
| Outcome | A leaseholder's documents never leave their jurisdiction. The model runs on their laptop or on a sovereign cloud they control. The privacy story is provable, not promised. |
| 2nd order | Tier-2 inference quality is uneven (we know this). Caribbean gov't procurement teams who would never consider US-hosted LLMs now consider us. The "Engage a local attorney" nudge becomes a partner pipeline, not a disclaimer. |
| 3rd order | Two years out: either local-edge LLMs are industry-standard and we led, or they remain niche and we own the niche. Either way the architecture is defensible. |
| Affected | Residents (privacy); Caribbean gov'ts (sovereignty); the project's competitive position; the open-source LLM ecosystem (we contribute upstream) |
| Measure | (a) Default `USE_LOCAL_EDGE=1` in the install; (b) â‰¥ 1 sovereign-cloud tenant deployed by 2027-Q3; (c) inference latency within 2Ã— of cloud baseline |

#### Example 5 —— The Gauntlet Loop itself (this very loop)

| Q | Answer |
|---|--------|
| Outcome | A fully autonomous overnight agent that builds dossiers with conviction-bounded claims, refuses to fabricate, surfaces staleness, and improves on every cycle. |
| 2nd order | The project becomes auditable end-to-end. Every dossier is reproducible from the inputs. Sam can defend the project in a tribunal without re-deriving the reasoning. |
| 3rd order | Two years out: either the loop becomes the template for legal-AI in resource-constrained jurisdictions (a published pattern), or it's a private moat. The published pattern is preferable because it raises the floor for everyone. |
| Affected | Sam (overnight sleep), the residents (correctness), the judges (auditability), the project (defensibility), the open-source legal-tech community (a reference implementation) |
| Measure | (a) 159 test-suite assertions pass nightly; (b) 22 veracity tests pass nightly; (c) conviction table drift is bounded (Â±0.05 per statute per month); (d) zero unflagged `unfalsifiable` claims reach the public surface |

---

## Game Theory —— The Freeholder-Resident Asymmetric Game

> The FreeLeased strategy is the application of classical game
> theory to the leasehold dynamic. The asymmetric-information
> problem is the lever.

### The core game

```
Players:  resident (R)  vs.  freeholder (F)  vs.  court (C)
          vs.  regulator (G)  vs.  media (M)  vs.  project (P)

Strategy sets:
  R: { comply, query, dispute, escalate-to-court, escalate-to-media, exit }
  F: { status-quo, inflate-charges, harass, settle, sell-on }
  C: { dismiss, mediate, rule-for-R, rule-for-F }
  G: { ignore, fine, public-warn, license-revoke }
  M: { ignore, cover, investigate }
  P: { silent, dossier, public-record, partner-network }

Payoffs (R's perspective, 0..10):
  F inflates â†’ R query â†’ payoff 6 (delays, no real change)
  F inflates â†’ R dispute â†’ payoff 4 (cost time, may win partial)
  F inflates â†’ R escalate-to-court â†’ payoff 7 (win, but slow)
  F inflates â†’ R escalate-to-media â†’ payoff 8 (F backs down fast)
  F inflate + R silent â†’ F payoff 10 (capture), R payoff 1
  F status-quo â†’ R silent â†’ both 5 (mediocre equilibrium)
```

### The asymmetry

The freeholder has:
- Better information (knows true cost of works, knows the owner's
  beneficial owner, knows the shell company chain).
- More resources (legal team, managing agent, accountant).
- A time horizon measured in years, not weeks.

The resident has:
- The right side of the law (mostly).
- Less information.
- Less resources.
- A time horizon measured in weeks-to-months (rent is due).

**This is the classic asymmetric-information + resource-asymmetric
game.** Pure Nash equilibrium: resident complies, freeholder
inflates. Pareto-inferior. Welfare loss is the rent extraction
above the true cost.

### FreeLeased as the credible commitment device

The project's strategic intervention is to **change R's strategy
set** by:

1. **Lowering the cost of `query`** —— the dossier is free, in
   the resident's language, cites the statute. The resident
   who previously couldn't query now can.
2. **Lowering the cost of `dispute`** —— the dossier is a
   written record the resident can hand to the freeholder's
   agent without first paying a lawyer.
3. **Lowering the cost of `escalate-to-court`** —— the dossier
   is the evidence bundle the FTT wants. Filing cost drops
   because the resident walks in with statute citations.
4. **Raising the cost to F of `inflate`** —— every dossier is
   potentially a public record. F's information advantage
   erodes because R now has the same information, plus the
   statute, plus the precedent.
5. **Adding a new player (the project, P)** with a strategy
   set that includes `public-record` and `partner-network` ——
   threats F cannot ignore.

**Equilibrium shift.** With FreeLeased, the Nash equilibrium
moves from (R silent, F inflate) toward (R query, F status-quo)
because:

- The expected payoff to F of `inflate` drops (public-record
  threat is now credible —— P has done it before).
- The expected payoff to R of `query` rises (the dossier
  actually helps).
- The `(R silent, F inflate)` equilibrium is no longer
  Pareto-stable: R has an outside option now.

### Schelling focal point —— the LFRA s.99 application

The worked example: the LFRA 2024 Schedule 4 application is a
**coordination game**. Multiple residents in the same building
benefit from a collective RTM action, but no single resident
has the resources to coordinate. The focal point is **the
first application**: once one resident files, others see the
template, the cost of filing drops for the next one, and the
freeholder's defence strategy becomes "fight the first one in
detail" rather than "wait them out".

The FreeLeased strategy is to **be the publisher of the
template**: when the first Sch.4 application is filed by a
FreeLeased-assisted resident, publish the redacted version
(not the resident's identity —— the application itself). Every
subsequent resident has a starting point. The focal point is
the published template.

### Credible threats

| Threat | Credibility test |
|--------|------------------|
| "We will publish this dossier" | Have we ever published a dossier? Yes —— `public-record` strategy is on record. |
| "We will route this to a local attorney" | Have we ever routed? Yes —— `partner-network` is the same pipeline. |
| "We will file this with the FTT" | Have we ever filed? After the first Sch.4 application, yes. Before that, weak —— must be disclosed. |
| "We will engage the regulator" | Have we engaged a regulator? Currently no. Must NOT threaten this until it has happened. |

A threat that hasn't been carried out is not a credible threat.
FreeLeased's doctrine is: **never threaten what we haven't done**.

### Information asymmetry —— closing the gap

| Asymmetry dimension | Before FreeLeased | After FreeLeased |
|---------------------|-------------------|------------------|
| Cost of works (true vs. billed) | Freeholder only | Resident has the statute + the LLM-OCR'd bills |
| Beneficial owner | Freeholder only | Resident has the registry lookup + CIMA / Companies House |
| Precedent | Freeholder's lawyer only | Resident has the dossier + cited case |
| Time-to-answer | Days (call lawyer) | Minutes (paste lease) |

### Mechanism design —— can we change the game?

Yes, by changing the **information structure** (R gets the
dossier, breaking F's information monopoly) and the
**commitment technology** (R has a written record, F cannot
retcon). This is closer to a **revelation principle** in
mechanism design: we don't change the rules of the game, we
change what each player knows about the other.

### Equilibria summary

| Equilibrium | Stable without FL? | Stable with FL? |
|-------------|-------------------:|----------------:|
| R silent, F inflate | Yes (Nash) | No —— R has better options |
| R query, F status-quo | Weakly stable | Yes (new Nash) |
| R dispute, F inflate | R loses in expectation | Less attractive to R —— but F's `inflate` payoff drops |
| R escalate, F settle | Cost-prohibitive for R | Affordable with FL dossier |
| R + P public-record, F back down | N/A (P doesn't exist) | Yes (Schelling point) |

---

## Strategy —— Frameworks Applied to the Project

> Five lenses, one project. Use the lens the situation calls for;
> don't force every decision through every lens.

### Porter's Five Forces —— Caribbean Leasehold Governance

| Force | Strength | Why |
|-------|---------:|------|
| **Threat of new entrants** | High | A well-built open-source tool + 9-jurisdiction spine lowers the entry barrier dramatically. |
| **Supplier power** (freeholders, managing agents) | High | Concentrated, opaque, with information advantage. |
| **Buyer power** (residents) | Low individually / High collectively | The single resident has almost no leverage. The collective does. |
| **Threat of substitutes** | Medium | A local attorney is a substitute for FL. FL is faster, cheaper, and citations-first —— but cannot replace counsel in a hearing. |
| **Rivalry** | Low at present | Almost no one is serving this market. |

**Strategic implication.** The right move is **supplier-power
disruption**, not head-to-head rivalry. We are not competing
with law firms; we are giving the buyer-side the same
information the supplier-side already has.

### Christensen's Disruption —— FreeLeased vs. the Leaseholder Advice Market

The classical leaseholder advice market is **incumbent**:
- Slow (weeks to first response)
- Expensive (Â£200—“Â£500/hr)
- Specialist (rare in the Caribbean)
- Reactive (only after dispute)

FreeLeased is the **disruptor**:
- Fast (seconds to first response)
- Free (or sovereign-tier)
- Generalist (any jurisdiction)
- Proactive (paste before signing)

The disruption follows the **low-end + new-market footholds**
pattern: we do not replace the incumbent in their strong cases
(complex multi-party disputes, court representation). We
dominate the long tail of simple cases ("does my lease mention
the ground rent review clause?") and the new-market footholds
(Caribbean residents in the UK who cannot find a Caribbean-aware
lawyer at any price).

**Strategic implication.** Do not try to be the high-end
advisor. Be the **screening layer** that makes the high-end
advisor faster when it is needed.

### Sun Tzu —— Know Yourself + Know Your Enemy

**Know yourself (FreeLeased).**
- We are fast at ingestion, slow at novel legal reasoning.
- We are citation-strong, prose-weak.
- We are open-source-strong, brand-weak.
- We are sovereign-edge-first, scale-weak.

**Know your enemy (the freeholder).**
- Vulnerabilities: information monopoly erodes with public
  registries; opaque SPV chains break under beneficial-ownership
  disclosure; standard contractual terms break under pattern
  matching at scale.
- Strengths: cash buffer, legal team, time.

**Sun Tzu principle applied.** "Win without fighting" —— the
best FreeLeased outcome is the freeholder who **changes
practice proactively** because they know the dossier
exists. The freeholder who has to be **named in a dossier
in public** has lost.

### Boyd's OODA Loop —— Applied to the Project

```
OBSERVE     â†’  paste a lease / read a statute / watch the market
ORIENT      â†’  20-pattern match + 4-engine DS-Gauge + freshness check
DECIDE      â†’  ingest protocol (who/what/why/cost/conviction/date)
ACT         â†’  emit DatedConviction + (if needed) HITL queue + decision-log entry
    â—‚
    â——â—€â—€â—€ loop back to OBSERVE on the next intake
```

The project wins when its **OODA loop is faster** than the
freeholder's. Concretely: the resident who has a dossier in
10 minutes beats the freeholder's quarterly billing cycle.
The freeholder who has to wait 30 days for the resident's
lawyer loses to the resident who has the dossier today.

### Schelling Focal Point —— LFRA s.99 as Coordination Device

Thomas Schelling's focal point: in a coordination game with
no communication, players converge on the salient choice.
The FreeLeased strategy is to **publish the first LFRA
Schedule 4 application as a redacted template**, so every
subsequent Caribbean-resident leaseholder in the UK has a
starting point. The template is the focal point.

The same principle applies to the first:
- Caribbean-aware FTT ruling
- Beneficial-ownership disclosure of a Caribbean SPV freeholder
- Local-edge LLM deployment at a Caribbean gov't

Each of these is a Schelling point waiting to be made salient.

---

## Doctrine —— Five Lines, Repeated

> Memorise these. Apply them. Hand them to anyone who joins
> the project.

1. **Never cite what you can't verify.**
   If the statute isn't at legislation.gov.uk / a Caribbean
   gazette, the citation is a guess. Guess-and-label is OK;
   guess-and-state-as-fact is not.

2. **Never claim what you haven't done.**
   "We have filed an LFRA Sch.4 application" —— only after
   one is filed. Until then: "we are preparing to file." A
   project that exaggerates its track record loses the only
   asset it has: trust.

3. **Never build what you won't use.**
   The overnight agent is the first user. The buildathon
   judges are the second. Sam is the third. If a feature
   doesn't serve one of these three, it's deferred, not
   built.

4. **Never optimise for judges over users.**
   The judges are a constraint, not a customer. The resident
   who pastes their lease is the customer. Every dossier is
   read first by the resident, second by a lawyer, third by
   a judge. Order matters.

5. **The gauntlet is only as good as the questions it asks.**
   The ingest protocol above is the question-set. If we
   accept an ingest without all six answers, the output is
   weaker than the input. The discipline is in the
   questions, not the answers.

---

## Decision Log Integration —— The Gauntlet Writes to the Ledger

> The gauntlet is the writer, the decision log is the
> ledger. Every gauntlet decision appends a row.

The gauntlet's durable output is a row in
[`project/management/decision-log.md`](../../project/management/decision-log.md:1)
using the **ADR-light** format below (lighter than the full
ADR template used for the major project decisions):

```markdown
| Date       | Decision                                       | Alternatives                       | Rationale (1 line)                           | Conviction | Owner | Expiry   |
|------------|------------------------------------------------|------------------------------------|-----------------------------------------------|------------|-------|----------|
| 2026-08-11 | Refresh UK LFRA s.20 statute from canonical    | Defer / local-only / scrape | Cited in 12 dossiers; SLA = 180d; today is +190d | heuristic 0.75 | maintenance-agent | 2027-02-07 |
| 2026-08-11 | Demote `uk-clra-s72` from heuristic to contested | Hold / over-rule | One override by Sam in last 24h; -0.10 weight | contested 0.60 | self-improve | 2026-11-09 |
| 2026-08-11 | Publish LFRA Sch.4 application template (redacted) | Defer / private only | Schelling focal point; barrier to next claim | contested 0.60 | sam | 2027-08-11 |
```

The columns map to the gauntlet's emit contract:

- **Date** —— ISO 8601 from the ingest.
- **Decision** —— single-line, action verb, no ambiguity.
- **Alternatives** —— the considered set, even if rejected.
- **Rationale** —— one line; the second-order effect explained.
- **Conviction** —— class + numeric cap (e.g. `heuristic 0.75`).
- **Owner** —— the sub-loop or Sam.
- **Expiry** —— when this decision must be revisited.

The gauntlet **never** appends to the decision log without
filling all seven columns. A missing column is a rejected
write. The schema is enforced by
[`scripts/test-gauntlet.ts`](../../scripts/test-gauntlet.ts:1)
assertion group `decision-log`.

---

## End-to-End Flow —— How the Sections Connect

```
ingest arrives
  â—‚
  â–¼
INGEST PROTOCOL (6 questions)
  â—‚
  â–¼
RESEARCH (sub-loop 2)  â† DATED CONVICTION (fetch + date + expiry)
  â—‚
  â–¼
UPDATE (sub-loop 3)    â† OUTCOMES & IMPACT (5 questions)
  â—‚
  â–¼
DECISION emitted
  â—‚
  â—œâ—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â—€â–º DECISION LOG row (7 columns)
  â—‚
  â–¼
GAME THEORY check (is this action threat-credible? reversible?)
  â—‚
  â–¼
STRATEGY alignment (which lens? porter / christensen / tz / boyd / schelling)
  â—‚
  â–¼
DOCTRINE final check (5 lines; reject on any miss)
  â—‚
  â–¼
dossier returned with DatedConviction stamp on every claim
```

Every gauntlet output passes through **all six sections** above.
The gauntlet that skips doctrine is a calculator; the gauntlet
that runs doctrine is a decision-maker.

---

## Verification —— `scripts/test-gauntlet.ts`

> The gauntlet is testable. The test file enforces every
> contract above. See
> [`scripts/test-gauntlet.ts`](../../scripts/test-gauntlet.ts:1).

Minimum assertions (current count: 38+):

| Group | Asserts | Description |
|-------|--------:|-------------|
| Ingest protocol | 6 | Every ingest answers WHO/WHAT/WHY/COST/CONVICTION/DATE |
| Dated conviction | 5 | Every output carries date, class, cap, expiry, source |
| Outcomes & impact | 5 | Every decision answers 5 questions; 5 worked examples present |
| Game theory | 3 | 3+ worked examples; player set â‰¥ 4; credible-threat table present |
| Strategy | 5 | Porter + Christensen + Tzu + Boyd + Schelling each present |
| Doctrine | 5+1 | â‰¥ 5 principles; line count â‰¥ 5 |
| Decision log | 7 | Every column present in at least one row |
| Section presence | 6 | All six new sections are non-empty in `project/strategy/gauntlet-loop.md` |

Total: â‰¥ 38 assertions.
