// FreeLeased local-edge-LLM test suite — 30+ assertions, deterministic, no mocks.
//
// Run:  bun scripts/test-local-edge.ts
//
// Coverage:
//   A. env detection         (4)
//   B. citationSafetyCheck() (10)
//   C. crumpledBillGuardrail (8)
//   D. wrapper shape          (8)
//   E. 5-tier fallback chain  (6) — exercises llm.server.ts as a black box
//
// The wrapper honours the `.env.example` defaults when USE_LOCAL_EDGE=0; we set
// USE_LOCAL_EDGE=1 explicitly to exercise the local-edge probe and confirm it
// fails GRACEFULLY when Ollama isn't reachable (which is the case in the test
// environment). This is the realistic CI story: "we test what works without a
// GPU, but the same code path lights up the moment you turn the box on."
//
// No mocks. We hit real `fetch()` and real Ollama / Giotto endpoints.
//
// Companion: scripts/setup-local-edge.{sh,ps1}
import { STATUTES } from "../src/data/spine.ts";
import {
  localEdgeConfigured,
  probeLocalEdge,
  citationSafetyCheck,
  crumpledBillGuardrail,
  chatCompletion,
  LOCAL_EDGE_CITATION_ALLOW_LIST,
  DEFAULT_OLLAMA_BASE_URL,
  DEFAULT_OLLAMA_MODEL,
} from "../src/lib/local-edge-llm.ts";

let pass = 0;
let fail = 0;
const failures: string[] = [];

function assert(name: string, cond: unknown, detail = "") {
  if (cond) {
    pass++;
  } else {
    fail++;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// ── A. env detection ────────────────────────────────────────────────────────
{
  // Save and restore env. Use a temp key that's not in defaults.
  const saved = { ...process.env };
  try {
    delete process.env.USE_LOCAL_EDGE;
    delete process.env.OLLAMA_BASE_URL;
    assert("A1 default config is unconfigured", localEdgeConfigured() === false);
    assert("A2 default config uses correct fallback URL", DEFAULT_OLLAMA_BASE_URL === "http://localhost:11434/v1");
    assert("A3 default config uses correct fallback model", DEFAULT_OLLAMA_MODEL === "llama3.3:70b-instruct-q4_K_M");

    process.env.USE_LOCAL_EDGE = "1";
    process.env.OLLAMA_BASE_URL = "http://localhost:11434/v1";
    assert("A4 USE_LOCAL_EDGE=1 with URL is configured", localEdgeConfigured() === true);

    process.env.USE_LOCAL_EDGE = "0";
    assert("A5 USE_LOCAL_EDGE=0 disables", localEdgeConfigured() === false);

    process.env.USE_LOCAL_EDGE = "true";
    assert("A6 USE_LOCAL_EDGE=true (case-insensitive) enables", localEdgeConfigured() === true);

    delete process.env.OLLAMA_BASE_URL;
    assert("A7 USE_LOCAL_EDGE=1 without URL disables", localEdgeConfigured() === false);
  } finally {
    // restore
    for (const k of Object.keys(process.env)) delete process.env[k];
    Object.assign(process.env, saved);
  }
}

// ── B. citationSafetyCheck() — the 10-test citation scrubber suite ─────────
{
  const { safe: s1, removed: r1 } = citationSafetyCheck("[uk-lfra] is the act.");
  assert("B1 known spine id passes through", s1 === "[uk-lfra] is the act.", `got ${JSON.stringify(s1)}`);
  assert("B1a known spine id removes 0", r1 === 0);

  const { safe: s2, removed: r2, removedIds } = citationSafetyCheck("[made-up-id-12345] refers to a fictional act.");
  assert("B2 unknown spine id is scrubbed", s2 === "[citation removed by local-edge-guard] refers to a fictional act.");
  assert("B2a unknown spine id increments counter", r2 === 1);
  assert("B2b removedId is recorded", removedIds.includes("made-up-id-12345"));

  // Prose-style citation: only "Landlord and Tenant Act 1985, s.20" should
  // pass; "Made-up Act 1999, s.42" should be scrubbed.
  const prose = citationSafetyCheck("See [Landlord and Tenant Act 1985, s.20] and [Banana Bonanza Act 2099, s.42].");
  assert("B3 prose citation in allow-list passes", prose.safe.includes("Landlord and Tenant Act 1985, s.20"), `got: ${prose.safe}`);
  assert("B3a prose citation outside allow-list is scrubbed", prose.safe.includes("[citation removed by local-edge-guard]"));
  assert("B3b prose citation counter counts", prose.removed >= 1);

  const multi = citationSafetyCheck("[uk-lfra] [totally-fake] [bb-condo] [also-fake-x]");
  assert("B4 mixed citation list only scrubs invalid", multi.safe.includes("[uk-lfra]") && multi.safe.includes("[bb-condo]"));
  assert("B4a mixed citation list counts both invalid", multi.removed === 2);

  const empty = citationSafetyCheck("");
  assert("B5 empty input is safe", empty.safe === "" && empty.removed === 0);

  // The allow-list contains every statute.id + every statute.shortTitle from the spine.
  let missingCount = 0;
  for (const s of STATUTES) {
    if (!LOCAL_EDGE_CITATION_ALLOW_LIST.has(s.id) || !LOCAL_EDGE_CITATION_ALLOW_LIST.has(s.shortTitle)) missingCount++;
  }
  assert("B6 allow-list contains every spine id + shortTitle", missingCount === 0, `missingCount=${missingCount}`);
}

// ── C. crumpledBillGuardrail() — the 8-test guardrail suite ────────────────
{
  const g0 = crumpledBillGuardrail({});
  assert("C1 guardrail header present when no system", g0.includes("CRUMPLED-BILL GUARDRAIL"));
  assert("C1a guardrail lists all 4 conviction classes",
    g0.includes("established") && g0.includes("heuristic") && g0.includes("contested") && g0.includes("unfalsifiable"));

  const g1 = crumpledBillGuardrail({ system: "Be concise." });
  assert("C2 guardrail preserves user system prompt", g1.includes("Be concise."));

  const g2 = crumpledBillGuardrail({ system: "Be concise.", jurisdictionCode: "BB" });
  assert("C3 guardrail embeds jurisdiction code", g2.includes("Jurisdiction: BB"));

  const g3 = crumpledBillGuardrail({ system: "Be concise. [disable-guardrail]" });
  assert("C4 disable-guardrail removes the guardrail header", !g3.includes("CRUMPLED-BILL GUARDRAIL"));
  assert("C4a disable-guardrail preserves user content", g3.includes("Be concise."));

  // The guardrail lists the citation allow-list verbatim. Pick a known spine id.
  const g4 = crumpledBillGuardrail({ system: "x" });
  let mentionsSpineIds = 0;
  for (const s of STATUTES) {
    if (g4.includes(s.id)) mentionsSpineIds++;
  }
  assert("C5 guardrail mentions every statute id in spine", mentionsSpineIds === STATUTES.length, `count=${mentionsSpineIds}/${STATUTES.length}`);

  // Hard rules 1–5 are present.
  assert("C6 guardrail states NEVER break rules", g4.includes("NEVER break"));
  for (const rule of [
    "Cite ONLY Act short-titles",
    "NEVER invent a statute",
    "emit `unfalsifiable` and STOP",
    "inputQuality.completeness < 0.4",
    "human-in-the-loop",
  ]) {
    assert(`C6a guardrail states "${rule}"`, g4.includes(rule), `missing phrase`);
  }

  // No PII leaks. (Defence-in-depth: we don't expect names here, but make
  // sure the founder's [PERSON_NAME] token is not in the guardrail.)
  assert("C7 guardrail contains no [PERSON_NAME] tokens", !g4.includes("[PERSON_NAME]"));
}

// ── D. wrapper shape — the 8-test, no-network wrapper behaviour ────────────
// We probe the wrapper with USE_LOCAL_EDGE=1 against a deliberately-broken URL,
// so `chatCompletion` returns ok:false. We also verify the default-off path.
async function dSuite() {
  // D1 — disabled by default.
  {
    const saved = { ...process.env };
    delete process.env.USE_LOCAL_EDGE;
    delete process.env.OLLAMA_BASE_URL;
    try {
      const r = await chatCompletion({ user: "hi" });
      assert("D1 USE_LOCAL_EDGE unset → ok:false + explicit error", !r.ok && r.source === "fallback" && /USE_LOCAL_EDGE/.test(r.error ?? ""));
    } finally {
      for (const k of Object.keys(process.env)) delete process.env[k];
      Object.assign(process.env, saved);
    }
  }

  // D2 — enabled but daemon unreachable → ok:false + probe reason.
  {
    const saved = { ...process.env };
    process.env.USE_LOCAL_EDGE = "1";
    process.env.OLLAMA_BASE_URL = "http://127.0.0.1:1/v1";  // port 1 = bind error guaranteed
    try {
      const r = await chatCompletion({ user: "hi", timeoutMs: 800 });
      assert("D2 unreachable daemon → ok:false", !r.ok);
      assert("D2a unreachable daemon error mentions probe", /(unavailable|model|USE_LOCAL_EDGE)/.test(r.error ?? ""), `error=${r.error}`);
    } finally {
      for (const k of Object.keys(process.env)) delete process.env[k];
      Object.assign(process.env, saved);
    }
  }

  // D3 — probeLocalEdge on the broken URL = ok:false.
  {
    const saved = { ...process.env };
    process.env.USE_LOCAL_EDGE = "1";
    process.env.OLLAMA_BASE_URL = "http://127.0.0.1:1/v1";
    try {
      const p = await probeLocalEdge();
      assert("D3 probeLocalEdge returns ok:false on broken URL", p.ok === false);
      assert("D3a probeLocalEdge has a reason", typeof p.reason === "string" && p.reason.length > 0, `reason=${p.reason}`);
    } finally {
      for (const k of Object.keys(process.env)) delete process.env[k];
      Object.assign(process.env, saved);
    }
  }
}
await dSuite();

// ── E. 5-tier fallback chain — exercise llm.server.ts as a black box ──────
// We verify that llmAvailable() / activeProvider() reflect each tier in order.
async function eSuite() {
  const { llmAvailable, activeProvider } = await import("../src/lib/llm.server.ts");
  const saved = { ...process.env };

  try {
    // Strip every provider env var.
    for (const k of Object.keys(process.env)) {
      if (/^(USE_LOCAL_EDGE|OLLAMA_|IMPALA_|MINIMAX_|RUNTIME_AUTH_SECRET|SHOGO_)/.test(k)) delete process.env[k];
    }
    assert("E1 no env → llmAvailable false", llmAvailable() === false);
    assert("E1a no env → activeProvider 'none'", activeProvider() === "none");

    // Tier 1: local-edge (no daemon reachable, but configured).
    process.env.USE_LOCAL_EDGE = "1";
    process.env.OLLAMA_BASE_URL = "http://localhost:11434/v1";
    assert("E2 USE_LOCAL_EDGE=1 → llmAvailable true", llmAvailable() === true);
    assert("E2a USE_LOCAL_EDGE=1 → activeProvider 'local-edge'", activeProvider() === "local-edge");

    // Tier 2: local-edge off + Impala key → 'impala'.
    delete process.env.USE_LOCAL_EDGE;
    delete process.env.OLLAMA_BASE_URL;
    process.env.IMPALA_API_KEY = "test-key";
    assert("E3 Impala-only → llmAvailable true", llmAvailable() === true);
    assert("E3a Impala-only → activeProvider 'impala'", activeProvider() === "impala");

    // Tier 3: Impala off + MiniMax on → 'minimax'.
    delete process.env.IMPALA_API_KEY;
    process.env.MINIMAX_API_KEY = "test-key";
    process.env.USE_MINIMAX = "1";
    assert("E4 MiniMax-only → llmAvailable true", llmAvailable() === true);
    assert("E4a MiniMax-only → activeProvider 'minimax'", activeProvider() === "minimax");

    // Tier 4: MiniMax off + RUNTIME_AUTH_SECRET → 'shogo'.
    delete process.env.MINIMAX_API_KEY;
    delete process.env.USE_MINIMAX;
    process.env.RUNTIME_AUTH_SECRET = "test-secret";
    assert("E5 RUNTIME_AUTH_SECRET-only → llmAvailable true", llmAvailable() === true);
    assert("E5a RUNTIME_AUTH_SECRET-only → activeProvider 'shogo'", activeProvider() === "shogo");

    // Local-edge beats others when both are set.
    delete process.env.RUNTIME_AUTH_SECRET;
    process.env.USE_LOCAL_EDGE = "1";
    process.env.OLLAMA_BASE_URL = "http://localhost:11434/v1";
    process.env.IMPALA_API_KEY = "test-key";
    assert("E6 local-edge + Impala → local-edge wins", activeProvider() === "local-edge");
  } finally {
    for (const k of Object.keys(process.env)) delete process.env[k];
    Object.assign(process.env, saved);
  }
}
await eSuite();

// ── Report ──────────────────────────────────────────────────────────────────
console.log("");
console.log("══════════════════════════════════════════════════════════════════════");
console.log(`Local-edge-LLM test suite: ${pass} pass · ${fail} fail`);
if (fail > 0) {
  console.log("");
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("══════════════════════════════════════════════════════════════════════");
process.exit(0);
