// Lightweight, dependency-free tracing for the agentic loop. Emits
// OpenTelemetry-friendly span records that OllyGarden (or any OTel collector)
// can ingest once the repo is connected. No PII: attributes are scalar metadata
// only. Enable stdout emission with FL_TELEMETRY=1.

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  attributes: Record<string, string | number | boolean>;
  status: "ok" | "error" | "open";
}

const RING_MAX = 200;
const ring: Span[] = [];
const enabled = (): boolean => {
  try {
    return typeof process !== "undefined" && process.env?.FL_TELEMETRY === "1";
  } catch {
    return false;
  }
};

function id(bytes: number): string {
  let s = "";
  for (let i = 0; i < bytes; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
  return s;
}

export interface ActiveSpan {
  span: Span;
  end: (extra?: { status?: "ok" | "error"; attributes?: Record<string, string | number | boolean> }) => Span;
}

export function startSpan(
  name: string,
  attributes: Record<string, string | number | boolean> = {},
  parent?: { traceId: string; spanId: string },
): ActiveSpan {
  const span: Span = {
    traceId: parent?.traceId ?? id(16),
    spanId: id(8),
    parentSpanId: parent?.spanId,
    name,
    startTime: Date.now(),
    attributes,
    status: "open",
  };
  return {
    span,
    end: (extra) => {
      span.endTime = Date.now();
      span.durationMs = span.endTime - span.startTime;
      span.status = extra?.status ?? "ok";
      if (extra?.attributes) Object.assign(span.attributes, extra.attributes);
      ring.push(span);
      if (ring.length > RING_MAX) ring.shift();
      if (enabled()) {
        // Structured line an OTel collector / OllyGarden shim can parse.
        console.log(JSON.stringify({ otel_span: span }));
      }
      return span;
    },
  };
}

// Convenience wrapper: trace a synchronous or async function call.
export async function traced<T>(
  name: string,
  fn: () => T | Promise<T>,
  attributes: Record<string, string | number | boolean> = {},
): Promise<T> {
  const s = startSpan(name, attributes);
  try {
    const result = await fn();
    s.end({ status: "ok" });
    return result;
  } catch (e) {
    s.end({ status: "error", attributes: { error: (e as Error).message } });
    throw e;
  }
}

export function recentSpans(limit = 50): Span[] {
  return ring.slice(-limit);
}

export function clearSpans(): void {
  ring.length = 0;
}
