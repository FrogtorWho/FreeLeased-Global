// Tests for the telemetry helper. Run: bun scripts/test-telemetry.ts
import { startSpan, traced, recentSpans, clearSpans } from "../src/lib/telemetry";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ok   ${name}`); }
  else { failed++; console.log(`  FAIL ${name}`); }
}

clearSpans();

// 1. A span records duration and ok status.
const s = startSpan("agent.research", { provider: "impala" });
const ended = s.end({ status: "ok", attributes: { flags: 3 } });
check("span has ok status", ended.status === "ok");
check("span has non-negative duration", (ended.durationMs ?? -1) >= 0);
check("span keeps attributes", ended.attributes.provider === "impala" && ended.attributes.flags === 3);

// 2. Child span shares the parent trace id.
const parent = startSpan("loop.run");
const child = startSpan("agent.gate", {}, { traceId: parent.span.traceId, spanId: parent.span.spanId });
check("child shares trace id", child.span.traceId === parent.span.traceId);
check("child references parent span", child.span.parentSpanId === parent.span.spanId);
child.end();
parent.end();

// 3. traced() returns the value and records an error span on throw.
const val = await traced("llm.complete", () => 42, { model: "qwen3.6-27b" });
check("traced returns value", val === 42);
let threw = false;
try { await traced("agent.verify", () => { throw new Error("boom"); }); } catch { threw = true; }
check("traced rethrows", threw);
check("error span recorded", recentSpans().some((sp) => sp.name === "agent.verify" && sp.status === "error"));

// 4. Ring buffer accumulates spans.
check("ring buffer has spans", recentSpans().length >= 5);

console.log(`\ntelemetry: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
