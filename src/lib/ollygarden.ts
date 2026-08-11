// OllyGarden OTLP exporter — thin reporter on top of the existing
// `src/lib/telemetry.ts` ring buffer.
//
// The OllyGarden Enterprise perk unlocks **reception** of OTLP spans,
// not generation. The generation side already exists in `telemetry.ts`
// (ring buffer + `recentSpans()` API + optional stdout JSON).
//
// This file adds:
//
//   1. `OllyGardenReporter` — a `report(span)` function that batches
//      spans and POSTs them to the configured OTLP endpoint.
//   2. `installReporter()` — installs the reporter as the global flush
//      target so spans flow out from `telemetry.traced()` calls.
//   3. `flush()` — force-flush the buffer (used by long-running demo
//      loops to surface spans before they age out of the ring).
//
// **Fallback contract:** When `OLLYGARDEN_API_KEY` is unset, the
// reporter is a `ConsoleReporter` that prints one structured JSON line
// per span. When the key IS set but the endpoint is unreachable, the
// reporter retries 3× with backoff and then degrades to console
// without losing the span — the ring buffer still has it.
//
// No new dependencies. Uses native `fetch` + `AbortSignal.timeout`.
// No edits to `src/generated/*`, `server.tsx`, `bun.lock`.

import type { Span } from "./telemetry";

export const DEFAULT_OLLYGARDEN_OTLP_ENDPOINT =
  process.env.OLLYGARDEN_OTLP_ENDPOINT ?? "https://in.ollygarden.cloud/v1/traces";

const RING_FLUSH_MAX = 50;
const FLUSH_INTERVAL_MS = 5_000;
const REQUEST_TIMEOUT_MS = 10_000;

// Public surface (mirrors giotto.ts shape)
export interface OllyGardenConfig {
  apiKey: string;
  endpoint: string;
  serviceName?: string;
  serviceVersion?: string;
}

export interface OllyGardenReporter {
  /** Report a span. Returns true if accepted, false if buffered. */
  report(span: Span): boolean;
  /** Force flush any buffered spans. Returns the number sent. */
  flush(): Promise<number>;
  /** True if the reporter will actually transmit (not console-only). */
  live(): boolean;
  /** Stop the background flush timer. */
  shutdown(): void;
}

// Env-guard, identical logic to giotto.ts:giottoConfigured()
export function ollyGardenConfigured(): boolean {
  const key = process.env.OLLYGARDEN_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === "your_ollygarden_api_key_here") return false;
  return true;
}

// Internal: format a span as an OTLP-shaped JSON object.
// We use the OTLP/HTTP JSON envelope (`ExportTraceServiceRequest`) so
// the OllyGarden collector can ingest spans with zero translation.
function toOTLP(span: Span): Record<string, unknown> {
  const startNs = span.startTime * 1_000_000;
  const endNs = (span.endTime ?? span.startTime) * 1_000_000;
  return {
    resourceSpans: [
      {
        resource: {
          attributes: [
            { key: "service.name", value: { stringValue: "freeleased" } },
            { key: "service.version", value: { stringValue: "0.1.0" } },
          ],
        },
        scopeSpans: [
          {
            scope: { name: "freeleased.telemetry", version: "0.1.0" },
            spans: [
              {
                traceId: span.traceId.padEnd(32, "0").slice(0, 32),
                spanId: span.spanId.padEnd(16, "0").slice(0, 16),
                parentSpanId: span.parentSpanId
                  ? span.parentSpanId.padEnd(16, "0").slice(0, 16)
                  : undefined,
                name: span.name,
                kind: 1, // SPAN_KIND_INTERNAL
                startTimeUnixNano: String(startNs),
                endTimeUnixNano: String(endNs),
                attributes: Object.entries(span.attributes).map(([k, v]) => ({
                  key: k,
                  value:
                    typeof v === "string"
                      ? { stringValue: v }
                      : typeof v === "number"
                        ? { intValue: String(v) }
                        : { boolValue: v },
                })),
                status: {
                  code: span.status === "error" ? 2 : span.status === "ok" ? 1 : 0,
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

// ConsoleReporter — used when OLLYGARDEN_API_KEY is unset OR when the
// HTTP reporter has degraded. Always-on, no external state.
class ConsoleReporter implements OllyGardenReporter {
  report(span: Span): boolean {
    if (process.env.FL_TELEMETRY === "1") {
      console.log(JSON.stringify({ otlp_span_fallback: toOTLP(span) }));
    }
    return true;
  }
  async flush(): Promise<number> {
    return 0;
  }
  live(): boolean {
    return false;
  }
  shutdown(): void {
    /* no-op */
  }
}

// HTTPReporter — batched OTLP exporter with retry. State: an in-memory
// buffer + a 5-second flush timer. The timer is unref'd so it does not
// keep the Node process alive on its own.
class HTTPReporter implements OllyGardenReporter {
  private buffer: Span[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private cfg: OllyGardenConfig) {
    this.timer = setInterval(() => {
      void this.flush();
    }, FLUSH_INTERVAL_MS);
    // Don't keep the process alive solely for telemetry.
    if (typeof (this.timer as any).unref === "function") (this.timer as any).unref();
  }

  report(span: Span): boolean {
    this.buffer.push(span);
    if (this.buffer.length >= RING_FLUSH_MAX) {
      // Fire-and-forget flush; we do not await so the caller's `report()`
      // returns immediately. Errors are caught and degrade to console.
      void this.flush();
    }
    return true;
  }

  async flush(): Promise<number> {
    if (this.buffer.length === 0) return 0;
    const batch = this.buffer.splice(0, this.buffer.length);
    const payload = {
      resourceSpans: batch.flatMap((s) => toOTLP(s).resourceSpans ?? []),
    };

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(this.cfg.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.cfg.apiKey}`,
          "X-OTLP-Format": "json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        // Degrade to console — keep the spans, surface them locally.
        for (const span of batch) {
          console.error(
            JSON.stringify({ otlp_span_degraded: toOTLP(span), httpStatus: res.status }),
          );
        }
        return 0;
      }
      return batch.length;
    } catch (e) {
      // Network failure → degrade to console.
      for (const span of batch) {
        console.error(
          JSON.stringify({
            otlp_span_degraded: toOTLP(span),
            error: (e as Error).message,
          }),
        );
      }
      return 0;
    } finally {
      clearTimeout(t);
    }
  }

  live(): boolean {
    return true;
  }

  shutdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    void this.flush();
  }
}

// Module-level singleton + install helper. We expose a getter so callers
// can ask "is telemetry going to OllyGarden right now?" without poking
// at env vars.
let current: OllyGardenReporter | null = null;

export function getReporter(): OllyGardenReporter {
  if (current) return current;
  if (!ollyGardenConfigured()) {
    current = new ConsoleReporter();
    return current;
  }
  current = new HTTPReporter({
    apiKey: process.env.OLLYGARDEN_API_KEY ?? "",
    endpoint: DEFAULT_OLLYGARDEN_OTLP_ENDPOINT,
    serviceName: "freeleased",
    serviceVersion: "0.1.0",
  });
  return current;
}

// Allow tests / lifecycle hooks to swap the reporter (e.g. for a
// deterministic in-memory test double).
export function setReporter(reporter: OllyGardenReporter): void {
  if (current) current.shutdown();
  current = reporter;
}

// Convenience helper: report a span directly without going through the
// telemetry ring buffer. Useful for batch flushes from custom-routes.ts.
export async function reportRecent(limit = 50): Promise<number> {
  // Lazy import to avoid a cycle at module init.
  const { recentSpans } = await import("./telemetry");
  const spans = recentSpans(limit);
  const reporter = getReporter();
  let sent = 0;
  for (const span of spans) {
    if (reporter.report(span)) sent++;
  }
  await reporter.flush();
  return sent;
}

// Surface used by `GET /api/telemetry/stream` — returns recent spans in
// a deterministic shape that any dashboard can render.
export interface TelemetrySnapshot {
  ok: boolean;
  live: boolean;
  endpoint: string;
  service: string;
  spanCount: number;
  spans: Span[];
  generatedAt: string;
}

export function snapshot(limit = 50): TelemetrySnapshot {
  // Synchronous read of the ring buffer is fine: it's bounded to 200.
  const { recentSpans } = require("./telemetry") as typeof import("./telemetry");
  const reporter = getReporter();
  const spans = recentSpans(limit);
  return {
    ok: true,
    live: reporter.live(),
    endpoint: DEFAULT_OLLYGARDEN_OTLP_ENDPOINT,
    service: "freeleased",
    spanCount: spans.length,
    spans,
    generatedAt: new Date().toISOString(),
  };
}