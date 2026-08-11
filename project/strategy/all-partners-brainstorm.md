# All-Partners Brainstorm — Future Caribbean Buildathon

> **Owner:** Sam Peacock · **Agent:** code/strategist · **Drafted:** 2026-08-11
> **Scope:** Six perks (Nebius Extra, Tenki, OllyGarden, MiniMax, Boardy,
> Nebius Promo). 57 ideas total, ranked top-10, top-5 implemented.
> **Honest disclosure:** This is a brainstorm + implementation plan. Every
> integration has a deterministic no-key / no-credit / no-network fallback.
> We never claim credits, infra, or warm intros we don't have.

---

## 0. Why this document exists

The Buildathon grants more than GPU and tokens — it grants *optionality*.
The job here is to enumerate every serious way the six perks could move the
needle on the four rubric axes (Team Quality B1, Innovation B2, PMF B3,
Tech Depth B4) and the two AI axes (AI Capability C1, Responsible AI C2),
then ship the top five inside the same push window.

Three rules across every category:

1. **No credit = no claim.** Every idea that needs credits/key/network has
   a written fallback path.
2. **No new dependencies.** We use native `fetch` + `AbortSignal` and the
   existing TS / Hono surface.
3. **No edits to `src/generated/*`, `server.tsx`, `bun.lock`.** The auto-
   generated surface stays put.

---

## A. Nebius — Extra Credits (H200 GPU compute)

8-10 ideas for leveraging the GPU credits. All ideas are tagged with
`[live]` (run during the demo) or `[offline]` (batch / precompute).

| # | Idea | Notes |
|---|------|-------|
| 1 | Run **live Nebius DeepSeek-R1 extraction** on `sample-lease.txt` at demo time | `[live]` — proves we can hit a real LLM at $0 internal cost |
| 2 | Pre-compute **1000 synthetic leases** for the next pilot cohort | `[offline]` — generated once, reused across 9 jurisdictions |
| 3 | Generate **50 high-fidelity tribunal-decision embeddings** for similarity search | `[offline]` — improves `/api/enrichment/similar-cases` |
| 4 | Train a **custom conviction-weight prior** on a UK lease corpus | `[offline]` — feeds the learning loop's cold-start |
| 5 | **Nightly statute-embedding regeneration** — replaces the regex fallback in `gauntlet-process.ts` | `[offline]` — schedule a daily cron via GitHub Actions |
| 6 | Generate **jurisdiction-specific synthetic pilots** (BB, JM, KY, TT, VG) | `[offline]` — 5×100 dossiers for pilot readiness |
| 7 | Spin up a **Postgres + pgvector instance** for the spine (replaces SQLite) | `[infra]` — opt-in only; SQLite stays as default |
| 8 | **Batch OCR on historical UK tribunal decisions** (publicly available PDFs) | `[offline]` — improves tribunal-decision store |
| 9 | Run **legal-embedding model inference** to power cross-jurisdiction pattern transfer | `[offline]` — populates the knowledge graph edges |
| 10 | **Evidence-class calibration curves** at scale (1M+ synthetic dossiers) | `[offline]` — proves the confidence caps are well-tuned |

**Fallback for A:** When `NEBIUS_API_KEY` is unset, the
`/api/demo/scan-lease` and `extractLease()` paths return the deterministic
extraction (same shape, `engine: "fallback"`). No-op for ideas 2-10 if
credits unavailable — we keep the static fixtures already in `src/data/`.

---

## B. Tenki — Tenki Credits (AI code reviewer)

8-10 ideas for the PR-reviewer bot. All gated on a single workflow file
in `.github/`.

| # | Idea | Notes |
|---|------|-------|
| 11 | **Enable Tenki on every PR** — auto-review every change | `.github/tenki.yml` documents the workflow |
| 12 | Tenki reviews **`project/strategy/gauntlet-loop.md`** changes — keeps the methodology honest | Catches methodology drift early |
| 13 | Tenki reviews the **demo script** for clarity / impact | `project/demo/demo-video-script.md` |
| 14 | Tenki reviews **`custom-routes.ts`** for security — catches accidental PII leaks | High-value: this is the only file the user can edit |
| 15 | Tenki enforces **conventional-commit compliance** on PR titles | `feat:`, `fix:`, `docs:`, etc. |
| 16 | Tenki as the **pre-mortem reviewer** — every PR gets a "what could go wrong" pass | Flags breaking changes, missing tests |
| 17 | Tenki generates the **per-PR judge-impact preview** ("this changes B2 by +0.1") | Direct rubric tracking |
| 18 | Tenki **gates test-suite expansion** — no PR merged unless coverage > X% | Optional: we ship the gate as opt-in |
| 19 | Tenki as the **demo-video script reviewer** — catches jargon, simplifies | UK-English-only, no AI tells |
| 20 | Tenki **weekly digest** — top 10 PRs that moved the project forward | Surfaces velocity to Sam |

**Fallback for B:** All Tenki reviews are advisory — a failed or absent
reviewer never blocks a merge. The workflows file is a document, not a
gate. The team can operate without the bot indefinitely.

---

## C. OllyGarden — Enterprise Plan (instrumentation + GitHub)

8-10 ideas for the observability stack. All wired through the existing
`src/lib/telemetry.ts` surface.

| # | Idea | Notes |
|---|------|-------|
| 21 | **Wire every API route to emit an OTLP span** to OllyGarden | `custom-routes.ts` already has 80+ routes; we add spans to top 10 |
| 22 | **Per-dossier traces** — the 4 engines + consensus gate | Already partially in place via `telemetry.traced()` |
| 23 | **Per-render traces** — the React component tree | Optional; we ship the hook only |
| 24 | **Internal "judge demo dashboard"** showing live OllyGarden traces | Read-only OTLP consumer; document, don't ship |
| 25 | **Alert when any engine's P95 latency exceeds 10s** (demo SLA) | Alerter via console + optional webhook |
| 26 | **Alert when any jurisdiction's spine staleness** crosses threshold | `/api/research/maintenance` polled nightly |
| 27 | **Alert when HITL queue depth exceeds 5** | `/api/signoff/queue` polled |
| 28 | **Daily digest of spans** to `memory/<date>-telemetry.md` | Generator script; deterministic when no key |
| 29 | **Span-level cost attribution** — which engine costs most per call | Tracks `computeStats.engineCalls` per span |
| 30 | **Conviction-weight drift visualisation** — Bayesian updates over time | Renders the learning loop over `prisma.learningRecommendation` |

**Fallback for C:** `src/lib/telemetry.ts` is a pure ring buffer that
already works without OllyGarden. The Enterprise plan unlocks
**reception**, not generation. We add a thin `OllyGardenReporter` class
that no-ops when `OLLYGARDEN_API_KEY` is missing. No route stops working.

---

## D. MiniMax — Token Plan (LLM inference)

8-10 ideas for the LLM token grant. All routed through the existing
`src/lib/giotto.ts`-style shared wrapper pattern.

| # | Idea | Notes |
|---|------|-------|
| 31 | **Replace `simulateLLMCall` in `src/lib/agents.ts:302`** with MiniMax (alternative to Giotto) | Mirrors `src/lib/giotto.ts` shape |
| 32 | MiniMax as the **citation-verification model** — cross-checks every cited statute | Cheap, small-context call per citation |
| 33 | MiniMax as the **redline generator** for lease clauses | Complements the fairness engine |
| 34 | MiniMax as the **multilingual translator** — EN ↔ HT, ES, FY, FR-patois | High demo impact (Caribbean audience) |
| 35 | MiniMax powers the **citizen-facing chatbot** (resident Q&A) | Demo-day instant value |
| 36 | MiniMax as the **demo Q&A answerer** — live, not pre-scripted | Mirrors `draftJudgeAnswer()` |
| 37 | MiniMax as the **persona generator** — 5 different advisor voices | A/B flavour for advisors |
| 38 | MiniMax as the **"explain this verdict" layer** for non-lawyers | Plain-English rewrite |
| 39 | MiniMax as the **public FAQ generator** | Drops into `README.md` + landing page |
| 40 | MiniMax generates the **per-jurisdiction onboarding document** when a new country joins | Long-tail value; replaces hand-written MoU annexes |

**Fallback for D:** `src/lib/minimax.ts` mirrors `src/lib/giotto.ts:giottoConfigured()`
exactly. Every helper returns `engine: "fallback"` when `MINIMAX_API_KEY`
is unset, with deterministic stub output that is identical in shape.
Agents.ts:302 (`simulateLLMCall`) already has a code-only path; we add
the MiniMax branch alongside it as a toggle.

---

## E. Boardy — Superconnector

8-10 ideas for the warm-intro network. All gated on Sam sending actual
messages; this section documents the asks.

| # | Idea | Notes |
|---|------|-------|
| 41 | **Warm intros to the 3 named advisory targets** (Lyew-Ayee, Reckord, Dukharan) | Already drafted in `project/strategy/05-advisory-ask-boardy.md` |
| 42 | Find **1 UK housing-association CEO** willing to do a 15-min pilot call | Proves post-pilot demand |
| 43 | Get a **warm intro to 1 Caribbean government official** (any of the 7 MoU targets) | Closes the credibility loop |
| 44 | Find **1 venture capitalist** focused on proptech / housing | Opens the funding track |
| 45 | Find **1 grant-program officer** (OpenAI Demo Day, YC, etc.) | Pre-seed funding |
| 46 | Find **1 journalist** covering housing / Caribbean tech | Earned media |
| 47 | **Post-demo follow-up engine** — intros to any judge who wants to learn more | Convert judge interest → pilots |
| 48 | Recruit **1 volunteer React/Tailwind dev** for the open-source community | Closes the "solo founder" risk |
| 49 | **"Ask the builders" feedback loop** — chat with other Future Caribbean teams | Cross-team learning |
| 50 | **Source a real leaseholder pack** — via a connected leaseholder willing to process their lease | Real-world pilot data |

**Fallback for E:** No asks are sent until Sam explicitly approves them.
The templates already exist in `05-advisory-ask-boardy.md`. We ship the
**activation checklist** (`scripts/boardy-outreach-status.ts`) that
checks each ask against a `pending → sent → replied → closed` state
machine. With no Boardy interaction, the project is unchanged.

---

## F. Nebius — Promo Codes (additional credits)

6-8 ideas (similar to A but more targeted).

| # | Idea | Notes |
|---|------|-------|
| 51 | **Spin up a GPU notebook** for live data exploration during the demo | Judges see Nebius running real compute |
| 52 | **Run a one-off embedding computation** to upgrade `src/data/uk-framework.ts` similarity search | Replaces hand-rolled similarity with Nebius embeddings |
| 53 | Generate the **demo video's voiceover** using Nebius TTS (free credits) | Demo polish, low cost |
| 54 | **Per-tenant personalised cover letters** — Nebius LLM over a template base | High-volume resident comms |
| 55 | **Per-judge tailored pitch** — one variant per judge | Direct rubric axis lift |
| 56 | **Batch legal-embedding inference** for the knowledge graph (10k+ triples) | Improves `/api/knowledge-graph/path` |
| 57 | Use promo credits for **any of the above ideas at greater scale** | Catch-all bucket |

**Fallback for F:** Same as Section A — all paths fall through to
`engine: "fallback"`. The embedding for uk-framework.ts uses a
deterministic tag-overlap scorer when no credits are available.

---

## Top-10 ranking

Ranking criterion: `impact × feasibility × rubric-axis lift`. Each row
scores 1-5 on each axis (5 = best). The total is the geometric mean.

| Rank | # | Idea | Sponsor | Impact | Feasibility | Rubric lift | Score | Why |
|------|---|------|---------|--------|-------------|-------------|-------|-----|
| 1 | **11** | Tenki on every PR | Tenki | 5 | 5 | 5 (B1 + B4) | **5.00** | Direct engineering-quality signal. Reviewer runs against `custom-routes.ts` catches PII leaks before merge. Costs nothing to enable. |
| 2 | **21-25** | OllyGarden observability | OllyGarden | 5 | 5 | 5 (B4 + C2) | **5.00** | Responsible-AI axis lives or dies on observability. We already have the trace surface — wiring OTLP ships the rubric-axis claim. |
| 3 | **31** | MiniMax mirror of `giotto.ts` | MiniMax | 5 | 5 | 5 (C1 + B4) | **5.00** | Dual-LLM redundancy (Giotto + MiniMax) is the strongest tech-depth move in the whole stack. Same shape, no UI branching. |
| 4 | **41** | Boardy advisory outreach | Boardy | 5 | 4 | 5 (B1) | **4.93** | Closes the team-quality gap if any of the 3 names reply. Templates are already drafted. |
| 5 | **52** | Embedding upgrade for uk-framework.ts | Nebius Promo | 4 | 5 | 4 (B2 + C1) | **4.31** | Improves tribunal-decision similarity search; uses unused credits; demo-visible improvement. |
| 6 | 1 | Live Nebius DeepSeek-R1 extraction | Nebius | 5 | 4 | 4 (C1) | **4.31** | Strong demo moment but depends on credit timing |
| 7 | 34 | MiniMax multilingual translator | MiniMax | 5 | 4 | 4 (B3 + C1) | **4.31** | Caribbean audience; high demo impact |
| 8 | 16 | Tenki pre-mortem reviewer | Tenki | 4 | 5 | 4 (B4) | **4.31** | Engineering-quality safeguard |
| 9 | 14 | Tenki security review of `custom-routes.ts` | Tenki | 5 | 4 | 4 (C2) | **4.31** | Direct responsible-AI alignment |
| 10 | 51 | GPU notebook for live demo | Nebius Promo | 4 | 4 | 3 (B2) | **3.65** | Nice-to-have demo polish; risky to depend on |

Tie-breakers: feasibility wins ties. Tenki + OllyGarden + MiniMax mirror
all score 5.00 — they ship first. Boardy activates on Day 14. The
Nebius embedding is opportunistic.

---

## Top-5 implementations

The top-5 ships in this commit window. Each implementation has:
1. A file or source modification
2. An extension to `scripts/test-all-partners.ts` with assertions
3. Documentation in `project/strategy/` or `docs/`
4. A no-credit / no-key fallback path

### 1. **Tenki PR-reviewer workflow** (Idea #11 + #14 + #16)

**Files added:**
- `.github/tenki.yml` — workflow manifest (read-only / advisory)
- `docs/tenki-workflow.md` — operating manual

**Files modified:**
- `.github/pull_request_template.md` — adds a "Tenki review status"
  checkbox (advisory only)
- `project/strategy/gauntlet-loop.md` — documents Tenki as the per-PR
  pre-mortem reviewer

**Fallback path:** If Tenki is not configured, the workflow file is a
no-op. PRs merge on the existing rules (`required_checks` + Sam's
approval). We never block on Tenki being absent.

**Test:** `scripts/test-all-partners.ts` asserts `.github/tenki.yml`
exists, is valid YAML, contains a `pull_request` trigger, and references
`custom-routes.ts` and `project/strategy/gauntlet-loop.md`.

### 2. **OllyGarden OTLP observability across top-10 routes** (Idea #21 + #22 + #25)

**Files added:**
- `src/lib/ollygarden.ts` — `OllyGardenReporter` class with `report()`,
  `no-op when OLLYGARDEN_API_KEY is missing`
- `docs/ollygarden-integration.md` — operating manual

**Files modified:**
- `custom-routes.ts` — wraps top-10 high-traffic routes in
  `telemetry.traced()` (idempotent with existing telemetry)
- `src/lib/telemetry.ts` — adds an `addReporter()` hook so the ring
  buffer can flush to OllyGarden in batches

**Routes wrapped (top-10 by traffic / risk):**
1. `POST /api/gates/sweep`
2. `POST /api/consensus/check`
3. `POST /api/consensus/decide`
4. `POST /api/dossier/:id`
5. `POST /api/dossier/:id/log`
6. `POST /api/fairness/check`
7. `POST /api/research/promote`
8. `POST /api/signoff`
9. `POST /api/demo/scan-lease`
10. `POST /api/qa/prep`

**Fallback path:** When `OLLYGARDEN_API_KEY` is unset, `OllyGardenReporter`
is a `ConsoleReporter` that prints one structured JSON line per span.
The 50/50 ring buffer + `recentSpans()` API still works as before.

**Test:** `scripts/test-all-partners.ts` asserts `src/lib/ollygarden.ts`
exists, exports a `report()` function, no-ops without a key, and that
all 10 routes are wrapped in `custom-routes.ts`.

### 3. **MiniMax mirror of `giotto.ts`** (Idea #31)

**Files added:**
- `src/lib/minimax.ts` — `minimaxConfigured()`, `callMiniMax()`, mirror
  of `src/lib/giotto.ts` with OpenAI-compatible fetch + AbortSignal
- `src/lib/agents-minimax.ts` — `simulateLLMCallWithMiniMax()` alternative
  to the `simulateLLMCall()` in `src/lib/agents.ts`

**Files modified:**
- `src/lib/agents.ts` — adds an env-guard: if `USE_MINIMAX=1` and
  `MINIMAX_API_KEY` is set, route the LLM call through MiniMax; else
  keep the current code path

**Fallback path:** `minimaxConfigured()` mirrors `giottoConfigured()` —
no key, no call. The `agents-minimax.ts` module falls back to the
existing deterministic `simulateLLMCall()` if anything throws.

**Test:** `scripts/test-all-partners.ts` asserts `src/lib/minimax.ts`
exists, exports the same surface as `giotto.ts`, the env-guard works,
and the agents.ts path is opt-in (not default).

### 4. **Boardy outreach activation** (Idea #41)

**Files added:**
- `scripts/boardy-outreach-status.ts` — state-machine tracker:
  `pending → drafted → sent → replied → closed`. Initial state: all 3
  asks are `drafted`. Surfaces CSV / JSON for the data room.
- `project/strategy/boardy-activation-log.md` — running log of sends,
  replies, and outcomes (zero entries until Sam sends).

**Files modified:**
- `project/strategy/05-advisory-ask-boardy.md` — adds a "Status as of
  2026-08-11: drafted, not sent" header at the top so anyone reading
  it sees the truthful state immediately.
- `CREDITS.md` — placeholder for the 3 names with "not yet replied"
  status.

**Fallback path:** None of these sends happen without Sam's explicit
go-ahead. The activation log starts with zero entries; the tracker
script reports `not_sent` for all 3 targets until Sam reports a send.

**Test:** `scripts/test-all-partners.ts` asserts the tracker script
exists, parses the state machine, and reports `not_sent` for all 3
targets by default.

### 5. **Nebius embedding upgrade for `uk-framework.ts`** (Idea #52)

**Files added:**
- `src/lib/embeddings/nebius.ts` — `nebiusConfigured()`, `embed(text)`,
  fallback to a deterministic tag-overlap scorer

**Files modified:**
- `src/data/uk-framework.ts` — adds an optional `embedding?: number[]`
  field on each `TribunalDecision` and `AdvisoryGuidance`. Pre-computed
  at import time when `NEBIUS_API_KEY` is set; else filled with the
  fallback scorer.
- `src/lib/enrichment.ts` — `findSimilarCases()` prefers embedding
  similarity when present, else falls back to the existing
  Jaccard / tag-overlap path. **Same external contract.**

**Fallback path:** The fallback scorer uses a deterministic
character-trigram overlap (Jaccard) over statute tags. The API contract
of `findSimilarCases()` does not change — `results[]` shape is
identical. Embeddings are an additive optimisation.

**Test:** `scripts/test-all-partners.ts` asserts the embeddings module
exists, no-ops without a key, and the `findSimilarCases()` contract is
unchanged.

---

## Cross-cutting design choices

- **Shared wrapper pattern.** `minimax.ts` and `olledgarden.ts` mirror
  `giotto.ts` exactly: one config flag, one `report()` / `call*()`
  function, one `fallback` branch.
- **No new dependencies.** Native `fetch` + `AbortSignal.timeout` +
  `node:fs`. No SDK pulls.
- **Env flags isolated.** Every integration has a single `*_API_KEY`
  env-guard. No fall-through to other services.
- **No edits to `src/generated/*`, `server.tsx`, `bun.lock`.**

## Test coverage

`scripts/test-all-partners.ts` runs 18 assertion groups covering:
1. Brainstorm doc has 50+ ideas across 6 categories
2. Top-10 ranking section present
3. Top-5 implementations section present
4. All 5 top-5 implementations have file paths + fallback paths
5. Tenki workflow YAML exists and is valid
6. OllyGarden reporter module exists + 10 routes wrapped
7. MiniMax mirror module exists + same export surface as `giotto.ts`
8. Boardy outreach tracker exists + reports `not_sent` by default
9. Nebius embeddings module exists + no-op without key
10. `findSimilarCases()` contract unchanged
11. No new dependencies in `package.json`
12. No edits to `src/generated/*`, `server.tsx`, `bun.lock`
13. Every integration has a documented fallback path
14. `.env.example` lists every new key
15. CI-safe (no live network calls)
16. Honest disclosure paragraph present in brainstorm doc
17. All 5 top-5 ideas cross-link to their sponsor section
18. No remaining TODO / FIXME markers in the diff

## Rubric impact summary

| Axis | Lift | Mechanism |
|---------|-----|-----------|
| B1 Team Quality | +0.3 | Tenki + Boardy advisory outreach |
| B2 Innovation | +0.2 | MiniMax mirror (dual-LLM pattern) |
| B3 PMF | +0.1 | MiniMax multilingual translator |
| B4 Tech Depth | +0.4 | Tenki + OllyGarden + MiniMax mirror |
| C1 AI Capability | +0.3 | MiniMax + Nebius embeddings |
| C2 Responsible AI | +0.3 | OllyGarden observability + Tenki security review |
| **Net** | **+1.6** | vs prior state |

## Honest disclosure

All 5 top-5 implementations ship in this commit window **with the
fallback path live by default**. The MiniMax mirror exists; it does
NOT route through MiniMax unless `USE_MINIMAX=1` is set. The OllyGarden
reporter exists; it does NOT push to OllyGarden unless
`OLLYGARDEN_API_KEY` is set. The Tenki workflow exists; it does NOT
block any PR. The Boardy tracker exists; no sends happen. The Nebius
embeddings exist; the Jaccard fallback is the live path.

Nothing claimed, nothing shipped prematurely, nothing breaking the
fallback contract.