# Giotto.ai — Integration Research

**Date:** 2026-08-11
**Owner:** Sam Peacock (sole founder, FreeLeased)
**Context:** Future Caribbean Buildathon, Track 9 — 16 Aug 2026 demo
**Status:** Research complete; integration plan drafted; awaiting API key claim

---

## 1. What Giotto.ai Offers

Giotto.ai is a compact-reasoning AI platform positioning itself as a fast, OpenAI-compatible alternative for production workloads.

| Capability | Notes |
|---|---|
| **Free unlimited API access** | For Future Caribbean participants (and likely other accelerator cohorts). No rate-limit disclosures yet. |
| **OpenAI-compatible SDK** | Drop-in compatible with `openai.OpenAI` from Python or the official JS SDK. Same `chat.completions.create(...)` interface. |
| **Compact reasoning engine** | Smaller, faster model designed for cost-per-call parity — relevant for high-volume leaseholder flows. |
| **Multimodal inputs** | Text + images in the same call. Supports OCR-ready use cases (lease scans → structured text). |
| **Web search** | Live grounding via search tool calls. |
| **Memory / vector RAG** | Persistent embeddings + retrieval, indexed per-org. |
| **Document processing** | Built-in chunking + extraction for PDFs / scans. |
| **VS Code / Open Claw / Open Code compatible** | Editor + IDE integrations out of the box; matches our development surface. |

## 2. How to Claim Access

**Two channels:**

1. **Email Daniel Alvarez** — state "Future Caribbean participant" + project context + volume estimate. (See [`06-giotto-claim-email.md`](06-giotto-claim-email.md) for the ready-to-send template.)
2. **Self-service via "Get Started" form** at <https://giotto.ai/get-started> — fills in name, email, project, expected volume.

Either path yields an API key consumed via `GIOTTO_API_KEY`. Endpoint discovery is part of the same onboarding email; we default to **`https://api.giotto.ai/v1/`** until confirmed.

## 3. Strategic Fit for FreeLeased

### 3.1 Where we are today

| Surface | Current state | Limitation |
|---|---|---|
| [`src/lib/agents.ts:302`](../../src/lib/agents.ts:302) `simulateLLMCall` | Returns hardcoded JSON per role | No real LLM; demo-only |
| [`src/core/title_agent.py`](../../src/core/title_agent.py) | Wired to **Nebius DeepSeek-R1** via `openai.OpenAI` | Large model, slow, expensive per call |
| `extractWithVLM` (Stage 7 idea #1) | Concept only — no live VLM | Leaseholder scans → structured extraction unimplemented |
| `src/core/nebius_client.py` | Single-model dependency | No fallback path; no multimodal |

### 3.2 Why Giotto is a better fit than Nebius for lease extraction

- **Compact reasoning** = lower latency on per-resident calls (target <2s p95)
- **Multimodal inputs (text + image)** = direct lease-scan ingestion, no separate OCR pipeline
- **OpenAI-compatible SDK** = existing `nebius_client.py` pattern reuses 1:1 → `giotto_client.py`
- **Vector RAG + memory** = persistent memory of jurisdiction-specific clauses (LFRA, RTM, etc.) without rebuilding the index per run
- **Doc processing built-in** = lease PDFs ingest natively; we still own the deterministic dossier layer

### 3.3 Sponsor stack now reads (7 sponsors)

> **Shogo, Impala, MiniMax, Nebius, Boardy, OllyGarden, Giotto.ai**

This increases our "named partners" line in the moonshot roadmap demo script. Update surfaces:

- [`moonshot-roadmap-10-10.md`](moonshot-roadmap-10-10.md) — sponsor list (callout section)
- [`.env.example`](../../.env.example) — new `GIOTTO_*` vars
- [`project/demo/demo-video-script.md`](../demo/demo-video-script.md) — sponsor stack line (already references Shogo/Impala/MiniMax/Nebius/Boardy; add Giotto)
- [`AGENT_BRIEF.md`](../../AGENT_BRIEF.md) — context block

## 4. Integration Plan (shipable today, **even without the key**)

Three steps. Deterministic fallback is the "no key yet" path so the demo doesn't fail.

### Step 1 — `src/core/giotto_client.py`

OpenAI SDK pointed at Giotto's endpoint. Same shape as [`nebius_client.py`](../../src/core/nebius_client.py):

```python
from openai import OpenAI
GIOTTO_BASE_URL = "https://api.giotto.ai/v1/"  # TBD — confirm with Daniel

def get_giotto_client() -> OpenAI: ...
def get_giotto_client_or_none() -> OpenAI | None: ...
```

Both reads `GIOTTO_API_KEY` + `GIOTTO_BASE_URL` from env. Graceful `None` fallback for stages where the key isn't provisioned yet.

### Step 2 — Wire into the gauntlet loop's PROCESS sub-loop

Per [`gauntlet-loop.md`](gauntlet-loop.md) — lease intake + multimodal classification runs through Giotto:

1. Resident uploads lease PDF / scan
2. **PROCESS** sub-loop: Giotto multimodal call → classifies lease type + extracts clauses
3. Downstream dossier engines (4 deterministic) consume the structured output
4. Consensus gate signs off

### Step 3 — `.env.example` + `scripts/test-giotto.ts`

Environment:

```
GIOTTO_API_KEY=your_giotto_api_key_here
GIOTTO_BASE_URL=https://api.giotto.ai/v1/
```

Test script mirrors [`scripts/test-agents.ts`](../../scripts/test-agents.ts): 20 checks covering factory, type, fallback, model list, multimodal stub, RAG stub, OCR stub. Skips live calls when `GIOTTO_API_KEY` is the placeholder — falls back to deterministic record/playback.

## 5. Risks + Assumptions

| Risk | Mitigation |
|---|---|
| **Base URL unknown** (`https://api.giotto.ai/v1/` is a guess) | TBD in claim email; env var overrides; tests skip live calls until confirmed |
| **No key yet on 16 Aug** | Deterministic fallback path ships; demo does not depend on live Giotto |
| **Rate limit undisclosed** | Per-call volume cap (existing `cost += agent.costPerQuery`) unchanged |
| **Latency on multimodal** | Pre-warm index; chunk; cap image size at 1MB |
| **Conflicting advice in OpenAI SDK version** | Pin `openai>=1.40.0` in `requirements.txt` (already there) |

## 6. Decision Log

- **2026-08-11** — Decision: pursue Giotto.ai integration alongside Nebius (parallel / fallback). Adds sponsor #7.
- **2026-08-11** — Decision: keep `simulateLLMCall` as fallback even after live Giotto is wired (offline mode for kiosk devices).

---

**Cross-links:** [`06-giotto-claim-email.md`](06-giotto-claim-email.md) · [`gauntlet-loop.md`](gauntlet-loop.md) · [`moonshot-roadmap-10-10.md`](moonshot-roadmap-10-10.md) · [`../../src/core/giotto_client.py`](../../src/core/giotto_client.py) · [`../../scripts/test-giotto.ts`](../../scripts/test-giotto.ts) · referenced from [`../../AGENT_BRIEF.md`](../../AGENT_BRIEF.md) and [`../../README.md`](../../README.md).
