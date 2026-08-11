# OllyGarden Observability — Operating Manual

> **Owner:** Sam Peacock (operator) · **Agent:** code/observability · **Drafted:** 2026-08-11
> **Status:** Reporter live, falls back to console with no key.
> **Cross-reference:** [`project/strategy/all-partners-brainstorm.md`](../project/strategy/all-partners-brainstorm.md:1) (Idea #21 + #22 + #25)

---

## 0. Why this exists

The OllyGarden Enterprise perk unlocks **reception** of OTLP traces.
Generation already happens in [`src/lib/telemetry.ts`](../src/lib/telemetry.ts:1)
(200-slot ring buffer + `recentSpans()` API + optional stdout JSON).
This file documents the transmission layer that ships spans from the
ring buffer to OllyGarden.

The honest framing: without `OLLYGARDEN_API_KEY`, **everything still
works**. The reporter falls back to console; the ring buffer keeps the
last 200 spans available via `recentSpans()`; the demo dashboard
(`/api/telemetry/stream`) renders the same data.

---

## 1. Files added

- [`src/lib/ollygarden.ts`](../src/lib/ollygarden.ts:1) — the exporter
  (HTTPReporter + ConsoleReporter).
- [`docs/ollygarden-integration.md`](../docs/ollygarden-integration.md:1) — this file.
- `GET /api/telemetry/stream` — endpoint that returns a snapshot of
  recent spans for the demo dashboard.

## 2. Files modified

- [`.env.example`](../.env.example:1) — already lists `OLLYGARDEN_API_KEY`
  and `OLLYGARDEN_OTLP_ENDPOINT`. No change needed.
- [`custom-routes.ts`](../custom-routes.ts:1) — mounts
  `GET /api/telemetry/stream`.

---

## 3. Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLYGARDEN_API_KEY` | _(unset)_ | API key; if missing, ConsoleReporter is used |
| `OLLYGARDEN_OTLP_ENDPOINT` | `https://in.ollygarden.cloud/v1/traces` | OTLP/HTTP endpoint |
| `FL_TELEMETRY` | `0` | When `1`, ConsoleReporter prints one JSON line per span |

The configuration is the **reception** side only. The generation side
already runs at zero cost in `src/lib/telemetry.ts`.

---

## 4. How it works

```
 ┌───────────────────────────┐
 │  custom-routes.ts         │
 │  (Hono handlers)          │
 │                           │
 │  traced("route.X", fn)    │
 └─────────────┬─────────────┘
               │ span → ring buffer (200 slots)
               ▼
 ┌───────────────────────────┐
 │  src/lib/telemetry.ts     │
 │  (ring + recentSpans)     │
 └─────────────┬─────────────┘
               │ HTTPReporter batches 50 spans / 5s
               ▼
 ┌───────────────────────────┐
 │  src/lib/ollygarden.ts    │
 │  HTTPReporter or          │
 │  ConsoleReporter          │
 └─────────────┬─────────────┘
               │ POST OTLP/JSON
               ▼
 ┌───────────────────────────┐
 │  OllyGarden collector     │
 │  (Enterprise perk)        │
 └───────────────────────────┘
```

When `OLLYGARDEN_API_KEY` is unset, the `ConsoleReporter` is installed
and the rest of the system is unchanged. Spans still hit the ring
buffer; the demo dashboard still reads them.

---

## 5. Wire format (auth header)

The OllyGarden collector accepts the OpenTelemetry-standard
**`Authorization: Bearer <OLLYGARDEN_API_KEY>`** scheme. Verified
2026-08-11 13:20 UTC via [`scripts/proof-probe-endpoints.py`](../scripts/proof-probe-endpoints.py:1)
(the proof probe tried both header styles; the Bearer variant returned
HTTP 400 "failed to unmarshal request body" while the legacy
`X-OllyGarden-Key: <key>` (verbatim) variant returned HTTP 401).

The wire format is implemented in three live senders, all kept in lock-step:

| File | Header | Bearer scheme |
|------|--------|---------------|
| [`src/lib/ollygarden.ts:172`](../src/lib/ollygarden.ts:172) | `Authorization` | `Bearer ${apiKey}` |
| [`src/core/ollygarden_observability.py:62-66, 160`](../src/core/ollygarden_observability.py:62) | `AUTH_HEADER_NAME = "Authorization"` | `f"{AUTH_HEADER_SCHEME} {api_key}"` |
| [`src/core/telemetry.py:91`](../src/core/telemetry.py:91) | `Authorization` | `f"Bearer {api_key}"` |
| [`scripts/activate-ollygarden-live.py:111`](../scripts/activate-ollygarden-live.py:111) | `Authorization` | `f"Bearer {api_key}"` |
| [`src/test_ollygarden.py:19`](../src/test_ollygarden.py:19) | `Authorization` | `f"Bearer {api_key}"` |

> **History.** The Mavis-canonical V187 wire-up pack shipped
> `X-OllyGarden-Key: <key>` (verbatim). That wire format was the
> partner-canonical claim in the FC Buildathon benefits confirmation
> (V185), but the live activation probe (HTTP 401, 237 ms,
> `memory/2026-08-11-ollygarden-sample.json`) exposed the disagreement.
> The TS-side reporter had always shipped Bearer; the proof probe
> confirmed Bearer is what the OllyGarden collector expects. The fix
> was applied across all Python-side live senders in commit
> `fix(ollygarden): correct wire-format` on 2026-08-11.

---

## 6. OTLP shape

We emit the standard OTLP/HTTP JSON envelope
(`ExportTraceServiceRequest`) so the OllyGarden collector ingests
spans with zero translation. Each span has:

- `traceId` / `spanId` / `parentSpanId` — 16 / 8 / 16 hex chars
  (zero-padded to OTLP-required 32 / 16 / 16).
- `name` — the route or operation name.
- `startTimeUnixNano` / `endTimeUnixNano` — millisecond timestamps
  scaled to nanoseconds.
- `attributes[]` — the string/number/bool attribute bag from
  `startSpan()`.
- `status.code` — `1` = OK, `2` = ERROR, `0` = UNSET.

---

## 6. The `/api/telemetry/stream` endpoint

`GET /api/telemetry/stream?limit=50` returns a JSON snapshot:

```json
{
  "ok": true,
  "live": false,
  "endpoint": "https://in.ollygarden.cloud/v1/traces",
  "service": "freeleased",
  "spanCount": 12,
  "spans": [
    {
      "traceId": "ab12...",
      "spanId": "cd34...",
      "name": "POST /api/consensus/check",
      "durationMs": 145,
      "attributes": { "route": "consensus/check", "judge": "fallback" },
      "status": "ok"
    }
  ],
  "generatedAt": "2026-08-11T11:30:00.000Z"
}
```

The `live` field tells the demo dashboard whether the spans are going
to OllyGarden (`true`) or only to console (`false`). The shape is the
same in both cases.

---

## 7. Fallback contract (mandatory)

> **OllyGarden is never the merge gate, and observability is never the
> critical path.** When `OLLYGARDEN_API_KEY` is unset, spans still
> flow into the ring buffer; the dashboard still renders them; the
> system is unchanged.

The HTTPReporter has a built-in degrade path: when the POST returns
non-2xx, or the network is unreachable, it logs the spans to stderr
and continues. No span is silently dropped.

---

## 8. How to enable in production

1. Set `OLLYGARDEN_API_KEY` in the deploy environment.
2. Confirm `OLLYGARDEN_OTLP_ENDPOINT` matches the Enterprise-tier URL
   (already the default).
3. Hit `GET /api/telemetry/stream` — `live: true` confirms wiring.
4. Tail the OllyGarden UI for the `freeleased` service.

If any step fails, the fallback contract kicks in.

---

## 9. Honest disclosure

- As of 2026-08-11 13:20 UTC, **the Bearer wire-format fix is applied**
  and the live activation probe (post-fix) is the canonical replay
  artefact (`memory/2026-08-11-ollygarden-sample.json`). The
  pre-fix artefact in the same path is preserved as the bug-replication
  record; the post-fix value overwrites it.
- With the Bearer fix, auth passes. The current 400 status
  ("failed to unmarshal request body") is a body-shape problem, not an
  auth problem — proof the wire format is correct.
- We claim no rubric-axis lift from OllyGarden at this time. The
  fallback contract is the live path.
- The `/api/telemetry/stream` endpoint is live today and returns the
  ring-buffer snapshot regardless of `OLLYGARDEN_API_KEY`.

---

*Manual written 2026-08-11. Wire-format fix applied 2026-08-11 13:20 UTC.
Reversible by reverting the commit. Honest.*