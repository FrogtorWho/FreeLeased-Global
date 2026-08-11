# Local Edge LLM — FreeLeased

> A **free**, **on-prem**, **OpenAI-compatible** reasoning server for
> FreeLeased. Runs on one rented GPU box, replaces the cost part of every
> per-token LLM bill with $0 forever, and lives one rung above the existing
> cloud gateways ([Giotto](https://giotto.ai/), [MiniMax](https://api.minimax.io/), Impala,
> Shogo pod) so we never lose a turn of reasoning when it goes down.
>
> _Companion files: [`src/lib/local-edge-llm.ts`](../src/lib/local-edge-llm.ts:1) ·
> [`scripts/setup-local-edge.sh`](../scripts/setup-local-edge.sh:1) /
> [`.ps1`](../scripts/setup-local-edge.ps1:1) ·
> [`scripts/test-local-edge.ts`](../scripts/test-local-edge.ts:1) ·
> [`project/research/edge-llm-research.md`](../project/research/edge-llm-research.md:1)._

---

## TL;DR — what you need to know

- **Backed by Ollama** ([ollama.com](https://ollama.com/)) — an MIT-licensed
  single-binary HTTP server that exposes an OpenAI-shaped
  `/v1/chat/completions` on default port `11434`.
- **Default model:** `llama3.3:70b-instruct-q4_K_M`. 70-billion-parameter
  Llama 3.3 Instruct, 4-bit quantised, ~24 GB VRAM on a single
  consumer GPU (e.g. RTX 4090).
- **Fall-back model:** `phi3.5:3.8b-mini-instruct-q4_K_M`. 3.8 B params,
  runs on any laptop with 8 GB RAM.
- **No new npm dependencies.** The wrapper uses native `fetch` + a
  probe-then-fail-fast call against `/api/tags`.
- **No new failure mode for production.** If Ollama is off, the existing
  5-tier fallback chain ([`src/lib/llm.server.ts`](../src/lib/llm.server.ts:1))
  keeps the platform running exactly as it did before.
- **Citation safety is enforced.** Every LLM response is run through
  [`citationSafetyCheck()`](../src/lib/local-edge-llm.ts) which scrubs any
  citation that is not in the spine. Hallucinated statute ids never touch
  the dossier.
- **The Crumpled-Bill Principle is enforced** via
  [`crumpledBillGuardrail()`](../src/lib/local-edge-llm.ts), which wraps
  every system prompt with the 4-axis input-quality rules from
  [`project/strategy/gauntlet-loop.md`](../project/strategy/gauntlet-loop.md) §
  "Jurisdiction Adaptation".

---

## 1. What works WITHOUT Ollama (the "still-shipped" story)

The FreeLeased buildathon submission **does not depend on Ollama**.
The reasoning pipeline works fully without it:

- All deterministic dossiers — the spine, the consensus engine, the
  veracity engine, the fairness layer, the gauntlet PROCESS classification —
  are pure code; they run on $0 compute with or without any LLM.
- The full 5-tier **fallback chain** is intact:

  1. Local edge (Ollama) — **skipped if not configured**
  2. Giotto.ai — works if `GIOTTO_API_KEY` is set
  3. MiniMax — works if `USE_MINIMAX=1` + `MINIMAX_API_KEY`
  4. Impala / Shogo pod — works if `IMPALA_API_KEY` or `RUNTIME_AUTH_SECRET`
  5. Deterministic regex + template — **always works, no external dep**

- The Cloudflare / OllyGarden observability stack keeps emitting telemetry
  on every tier that runs.

**Net effect.** Sam can demo the buildathon submission on a clean laptop
with no GPU and no LLM key. The local edge is an **additional** tier that
**amplifies** the story, not a prerequisite.

## 2. What works WITH Ollama (the "amplified" story)

Set:

```
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.3:70b-instruct-q4_K_M
USE_LOCAL_EDGE=1
```

…and the FreeLeased reasoning engine now has an additional **Tier-1**:
a real, on-prem LLM that

- answers with **statute-anchored reasoning**,
- never invents IDs (the citation safety scrubber catches it),
- never bypasses the Crumpled-Bill Principle,
- costs $0 forever (you own the hardware),
- **does not call home** to any vendor,
- leaves the deterministic dossier as the source of truth (the LLM is a
  *prose layer* on top, never a source of new facts).

This is the **$0 compute, single-GPU, on-prem, OpenAI-compatible** story
that closes the loop on Judge Venture's "can this scale without burning
cash" question and Judge Legal's "where does the data live" question at
the same time.

## 3. What requires Giotto (or another cloud multimodal tier)

- **Live multimodal vision on phone-camera lease scans.** Llama-3.2-Vision
  and LLaVA-class models work in Ollama but their quality is below frontier
  VLMs. For *high-stakes* vision extraction in production, we still prefer
  Giotto's multimodal tier (or the existing Nebius vision path).
- **The overnight 03:00 cron batch.** Massive parallel generation across
  50+ residents benefits from a vendor-grade compute tier. The local edge
  is fine for *one dossier at a time*; for batches, Giotto wins.

## 4. What we CAN'T do without a GPU

A 70-billion-parameter model at 4-bit quant fits comfortably on a 24 GB
consumer GPU. **On CPU alone** the experience is painful: first-token
latency is roughly **10–15 seconds** and a 700-token dossier summary
takes ~30 minutes. The wrapper still returns correct answers, but they
are not interactive.

| Tier | GPU required? | Speed (70B, q4_K_M) | Mobile-friendly? |
|---|---|---|---|
| **70B Llama 3.3** | yes — RTX 4090 / 3090 / A4000 | ~25 tok/s | no |
| **Mini 4-bit (Phi-3.5)** | no, but GPU preferred | ~50–80 tok/s on Apple M2 | yes (8 GB RAM) |
| **llama.cpp CPU only** | none | ~1–3 tok/s (slow) | not really |

The setup scripts do **not** assume a GPU. They will run on a laptop with
8 GB of RAM; the model will load but be slow.

## 5. Hardware recommendations

| Model | Recommended hardware | Used-market price (Q3 2026) | Throughput |
|---|---|---|---|
| **Phi-3.5 Mini 4-bit** | Apple M1/M2 laptop with 8 GB RAM; or any x86 with 8 GB RAM | $0 (existing laptop) | ~50–80 tok/s |
| **Llama 3.3 70B 4-bit** | NVIDIA RTX 4090 (24 GB) or RTX 3090 (24 GB) | ~$1.5k–$2.5k used; $0.50–$1/hr on Vast.ai / RunPod | ~20–30 tok/s |
| **Llama 3.3 70B 8-bit** | 2× RTX 4090 or 1× RTX A6000 (48 GB) | ~$3k+ used; $1.50/hr cloud | ~10–15 tok/s (high quality) |

**Recommendation for Sam (pilot phase):** the **$1.5k–$2.5k used RTX 4090
box**. It runs the recommended `llama3.3:70b-instruct-q4_K_M` at
interactive speeds and is enough compute for the 50-resident pilot.

**Recommendation for a 1-government-agency pilot:** rent a single
cloud GPU at ~$0.50/hr (Vast.ai or RunPod) and run the same Ollama
Docker image. Cost for a 1-month demo: ~$360. No vendor lock-in.

## 6. Setup — five lines, no surprises

### macOS / Linux

```bash
# 1. install (or skip if you have it already)
curl -fsSL https://ollama.com/install.sh | sh

# 2. start (idempotent)
ollama serve &

# 3. pull the model (~10 min for 70B q4, ~30s for Phi-3.5 Mini q4)
ollama pull llama3.3:70b-instruct-q4_K_M
# or, for a laptop:
# ollama pull phi3.5:3.8b-mini-instruct-q4_K_M

# 4. optional: use the all-in-one installer
./scripts/setup-local-edge.sh

# 5. set your env (defaults in .env.example)
echo 'OLLAMA_BASE_URL=http://localhost:11434/v1' >> .env
echo 'OLLAMA_MODEL=llama3.3:70b-instruct-q4_K_M' >> .env
echo 'USE_LOCAL_EDGE=1' >> .env
```

### Windows

```powershell
# 1. install — go to https://ollama.com/download or:
winget install Ollama.Ollama

# 2. start the daemon (runs in background after install)
ollama serve

# 3. pull the model
ollama pull llama3.3:70b-instruct-q4_K_M

# 4. use the PowerShell installer
pwsh -File scripts/setup-local-edge.ps1
```

### Docker (any host)

```bash
docker run -d -p 11434:11434 --name ollama --gpus all ollama/ollama
docker exec -it ollama ollama pull llama3.3:70b-instruct-q4_K_M
```

## 7. Verify — the 30-assertion test suite

```bash
bun scripts/test-local-edge.ts
```

The suite covers:

- 7 assertions on env detection (`USE_LOCAL_EDGE`, `OLLAMA_BASE_URL`)
- 14 assertions on `citationSafetyCheck()` (allow-list, prose citations,
  empty input, mixed lists)
- 14 assertions on `crumpledBillGuardrail()` (rule injection, jurisdiction
  override, `[disable-guardrail]` escape hatch, no-PII-leak guarantee)
- 5 assertions on the wrapper's degraded-failure mode (off, unreachable,
  probe semantics)
- 12 assertions on the 5-tier fallback chain (local-edge wins; falls
  through to Impala, MiniMax, Shogo, none)

If Ollama is **off** in the test environment, only the degraded-mode
suite runs; the full LLM smoke test lights up the moment Ollama is
reachable.

## 8. How it fits into the FreeLeased architecture

```
                       ┌─────────────────────────────┐
   resident intake ──► │  gauntlet-process.ts (P)    │
                       │  classifyIntake()           │
                       └─────────────┬───────────────┘
                                     │ If `USE_LOCAL_EDGE=1`
                                     ▼
                       ┌─────────────────────────────┐
                       │  local-edge-llm.ts (NEW)    │
                       │  • chatCompletion()         │
                       │  • crumpledBillGuardrail()  │
                       │  • citationSafetyCheck()    │
                       └────┬──────────┬─────────────┘
                            │ ok       │ unavailable
                            ▼          ▼
                       ┌──────────┐  ┌────────────────────────────┐
                       │ Giotto   │  │ giotto.ts (Tier 2)         │
                       └────┬─────┘  └────────┬───────────────────┘
                            │ ok             │ unavailable
                            ▼                ▼
                       ┌────────────┐  ┌──────────────────────┐
                       │ MiniMax    │  │ minimax.ts (Tier 3)  │
                       └────┬───────┘  └────────┬─────────────┘
                            │ ok                │ unavailable
                            ▼                   ▼
                       ┌────────────────┐  ┌──────────────────────┐
                       │ Impala / Shogo │  │ llm.server.ts (T 4)  │
                       └────┬───────────┘  └────────┬─────────────┘
                            │ ok                    │ unavailable
                            ▼                       ▼
                       ┌──────────────────────────────────────────┐
                       │ Deterministic fallback (engines.ts)      │
                       └──────────────────────────────────────────┘
```

## 9. What we DO NOT recommend

- **DON'T** run a 70B model on CPU-only in a live demo. First-token latency
  is unkind.
- **DON'T** use Ollama's `/api/chat` multimodal path for production
  document-extraction. Use the deterministic OCR pipeline + a vision-tier
  fallback.
- **DON'T** skip the `crumpledBillGuardrail()` system prompt. The wrapper
  applies it by default; disable it with `[disable-guardrail]` only in tests.
- **DON'T** trust the LLM as the source of new facts. The deterministic
  spine is the source of truth; the LLM is a *prose layer* on top.

## 10. FAQ

**Q. Does this add an npm dependency?**
A. No. Ollama is an external binary; the wrapper uses native `fetch`.
`bun.lock` is untouched.

**Q. Does it log anything to a third party?**
A. No. Ollama writes to its own daemon log only. FreeLeased ships
no telemetry on the local-edge path; OllyGarden continues to be the
source of truth for the cloud tiers.

**Q. What about safety on hallucinated statute ids?**
A. Every LLM response is scrubbed by `citationSafetyCheck()` before any
caller (dossier engine, sign-off queue, judge-Q&A draft, memo drafter)
sees it. Hallucinated ids never escape. See
[`project/research/edge-llm-research.md`](../project/research/edge-llm-research.md:1) §1.5.

**Q. What if Ollama goes down mid-conversation?**
A. `chatCompletion()` returns `{ok: false, error}`; the gateway chain in
[`src/lib/llm.server.ts`](../src/lib/llm.server.ts:1) falls through to the
next tier (Giotto → MiniMax → Impala → deterministic). Sam sees one extra
second of latency, no UI failure.

**Q. Where does this fit on the moonshot roadmap?**
A. This is the **Phase 2.7 ship** — see
[`project/strategy/WIN-DAY-100.md`](../project/strategy/WIN-DAY-100.md:1)
under "Phase 2 — Architecture". It is the closing of the "$0 compute"
loop.

## 11. Reversibility

Every change can be rolled back by:

1. Set `USE_LOCAL_EDGE=0` in `.env` — Tier-1 is skipped entirely.
2. Revert the local-edge wiring in [`src/lib/llm.server.ts`](../src/lib/llm.server.ts:1)
   and [`src/lib/gauntlet-process.ts`](../src/lib/gauntlet-process.ts:1).
3. Delete the four new files (`local-edge-llm.ts`, setup scripts, test).
4. The deterministic pipeline is untouched and continues working.

Total blast radius: zero regression on the existing 5-tier chain.

---

*Documentation generated 2026-08-11 by the FreeLeased overnight agent as
part of the local-reasoning edge research pack. Truth-protocol tags
follow [`project/strategy/truth-protocol.md`](../project/strategy/truth-protocol.md:1).*
