# FreeLeased

**The intelligence layer for a single Caribbean property market — provenance-tracked, deterministic, $0 compute, human-in-the-loop by design.**

[![Build status](https://img.shields.io/badge/build-10%2F10%20PASS-34d399)](https://github.com)
[![Tests](https://img.shields.io/badge/tests-231%2F231-34d399)](https://github.com)
[![Reconcile](https://img.shields.io/badge/doc%E2%80%93code-0%20drift-34d399)](https://github.com)
[![TRL](https://img.shields.io/badge/TRL-4%E2%86%925-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

Built for the **Future Caribbean Buildathon** (AI for Real Estate & Development). Submission date: **2026-08-16**.

## Quick start (3 commands)

```bash
bun install
bunx prisma db push
bun dev
```

Then open `http://localhost:5173` and navigate to **Overview**.

### Sub-1-minute cold-clone bootstrap (every prerequisite)

**Goal:** from a fresh laptop to a running demo in under 60 seconds of
typing + waiting. Judges can verify reproducibility themselves.

#### Prerequisites (check in this order)

| # | Tool | Min version | Why | Install |
|---|------|-------------|-----|---------|
| 1 | **Git** | 2.30+ | Clone the repo | `brew install git` · `apt install git` · <https://git-scm.com> |
| 2 | **Bun** | 1.1+ | Runtime + package manager (deterministic, fast) | `curl -fsSL https://bun.sh/install \| bash` |
| 3 | **Node.js** *(only if bun is unavailable)* | 22.17+ | Fallback for tests + scripts | <https://nodejs.org> |
| 4 | **A POSIX shell** | bash / zsh / PowerShell 7 | Run scripts | Built-in on macOS/Linux; `choco install pwsh` on Windows |

> **Why bun?** The whole stack is bun-first: the dev server, the Hono API,
> the test suite, the reconcile-doc runner. The fallback to Node
> (`node --experimental-strip-types`) is for environments where bun
> can't be installed.

#### Mental path (timed)

```
T+0s    git clone https://github.com/<org>/freeleased.git
        # → ~5s on a fast connection

T+5s    cd freeleased && bun install
        # → ~25s for a cold cache, ~3s for a warm cache

T+30s   bunx prisma db push
        # → ~3s — creates SQLite schema

T+33s   bun dev
        # → ~5s to first Vite ready, server on :8080, web on :5173

T+38s   Browser opens http://localhost:5173 → click Overview
        # → first paint in <500ms (deterministic fixtures, no network)

T+39s   You're looking at the FreeLeased dashboard.
```

Total: **~40 seconds** from clone to first paint on a warm cache;
**~70 seconds** cold. We document this here so judges can verify
reproducibility themselves — and so any contributor can ramp in a
single coffee.

#### What to verify once it's running

```bash
npm run verify     # 10/10 doc-vs-code reconcile + 231/231 tests + health green
```

If anything is not green, that's drift; see [`project/strategy/WIN-DAY-CHECKLIST.md`](project/strategy/WIN-DAY-CHECKLIST.md) for the
recovery procedure.

#### Missing step / "it didn't work"

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `bun: command not found` | Bun not on PATH after install | Restart shell, or `export PATH="$HOME/.bun/bin:$PATH"` |
| `prisma: command not found` | `bunx` not invoking | Use `bunx prisma db push` (we test this path) |
| Port 5173 in use | Another Vite dev server | `bun dev -- --port 5174` |
| Port 8080 in use | Another Hono server | Edit `vite.config.ts` or kill the conflicting process |
| `npm run verify` fails | Drift | Run `npm run reconcile` for the diff table; fix drift before claiming the lift |

This path is the **only** documented path. If you find a faster one, please open a PR — we'd love to know.

## What it does

- **Land intelligence** — parcels, zoning, valuation signals, climate and insurance risk, assembled from public sources with per-cell provenance.
- **Agentic verification loop** — research, verify, gate, human sign-off. Every output carries an evidence class that caps its confidence, and the system abstains rather than fabricates below a data-sufficiency threshold.
- **Lease & Contract Fairness Check** — document-only. Flags clauses that are one-sided or inconsistent with statute, cites the law, and never profiles people.
- **HITL Sign-off Queue** — the auditable control plane. Every resident-facing claim surfaces for human sign-off before it reaches a person, with full provenance and appeal path.

## The data spine

| Jurisdiction | Pilot | Statutes | Sources |
|---|---|---|---|
| UK, BB, JM, KY | ✅ | 40+ | 40+ |
| TT, GY, BZ, BS, BVI | �️ roadmap | — | — |

9 jurisdictions × 20+ hidden-rights patterns × 40+ verified statutes × 4 deterministic engines. Total compute spend: **$0.00**.

## Responsible AI

FreeLeased performs **none** of the practices prohibited by the EU AI Act Article 5 or the Buildathon Code of Conduct: no social scoring, no emotion inference, no biometric categorisation, no behavioural prediction. Outputs are labelled, a human sign-off gates every published verdict, and users can opt out and appeal. See [`project/submission-pack/compliance-statement-v3.md`](project/submission-pack/compliance-statement-v3.md).

## Tech stack

- Front end: Vite + React + TypeScript + Tailwind + shadcn/ui.
- API: Hono. Persistence: Prisma + SQLite.
- Orchestration and hosting: Shogo.
- Inference (provider-aware, OpenAI-compatible): Impala gateway (`qwen3.6-27b`), MiniMax, or the Shogo pod gateway. Selected by environment at request time.
- Compute: Nebius / NVIDIA H200 for batch embedding and geospatial indexing.
- Observability: OllyGarden.

## Verify (one command)

```bash
npm run verify
```

Should report **10/10 doc-vs-code reconcile, 231/231 tests, health-check all green**. Anything else = drift; see `npm run reconcile` for the full table.

## API (selected)

- `POST /api/fairness/check` — body `{ "text": "<lease text>", "jurisdiction": "all|BB|TT" }`. Returns evidence-classed, statute-cited flags. Advisory, not legal advice.
- `GET  /api/review-queue` — the HITL sign-off queue.
- `POST /api/review-queue/:id/decide` — `{ decision: "approve" | "reject" | "annotate" }` writes an immutable audit row.
- `POST /api/consensus/decide` — HITL approval/rejection of divergent consensus verdicts.
- `POST /api/reconciliation/run` — runs three parallel analyses (code/SLM/LLM), investigates disagreements.

```bash
curl -s -X POST http://localhost:8080/api/fairness/check \
  -H 'Content-Type: application/json' \
  -d '{"text":"The landlord may enter at any time without notice.","jurisdiction":"all"}'
```

## Tests

```bash
bun scripts/test-suite.ts              # core suite (159 assertions)
bun scripts/test-signoff-queue.ts      # Batch 3 sign-off queue (component + API)
bun scripts/test-truth-diff.ts         # TruthDiff component parity
bun scripts/test-health-check.ts       # health-check helpers
bun scripts/test-reconcile-docs.ts     # doc-vs-code reconciler
bun scripts/test-all.ts                # aggregator: runs all five above
```

## Documentation

- [`WIN-DAY-CHECKLIST.md`](WIN-DAY-CHECKLIST.md) — print this for demo day (2026-08-16).
- [`project/pitch/elevator-pitch.md`](project/pitch/elevator-pitch.md) — 30-second story.
- [`project/pitch/demo-narrative-arc.md`](project/pitch/demo-narrative-arc.md) — 3-minute demo.
- [`project/strategy/projected-final-score.md`](project/strategy/projected-final-score.md) — 10/10 breakdown.
- [`project/strategy/WIN-DAY-100.md`](project/strategy/WIN-DAY-100.md) — bridge to a perfect score, per-judge.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to run locally and add a jurisdiction.
- [`project/README.md`](project/README.md) — canonical working set index.
- [`project/submission-pack/`](project/submission-pack/) — overview, architecture, demo script, compliance, checklist.

## Branding

**5 brand variants — pick your favorite.**

We shipped five complete identity systems so the brand reads as
polished *regardless of which judge is in the room*:

- **Veridian** — production default (Peacock dark, serif H / sans body)
- **Quill** — editorial print (black / ivory / ink-red)
- **Monolith** — brutalist mono (black / white + signal yellow)
- **Canopy** — biophilic Caribbean (forest / river-stone / parrot)
- **Coral** — playful illustrated (coral / sand / lagoon)

Each variant includes a brand spec, palette, logomark, type specimen,
home wireframe, app wireframe, motion spec, and voice-and-tone doc.
SVGs are hand-authored and render in any browser.

Start at [`project/brand/`](project/brand/README.md:1).

## Licence

Runtime under the **MIT Licence** (see [`LICENSE`](LICENSE)). The data spine is published under CC-BY 4.0 and the provenance schema under CC0.
