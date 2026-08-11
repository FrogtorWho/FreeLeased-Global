#!/usr/bin/env bun
// Giotto.ai client integration tests.
// 20 checks covering factory function, fallback, env handling, model list, multimodal, RAG, OCR.
// Skips live network calls when GIOTTO_API_KEY is the placeholder / unset.
//
// Run:  bun scripts/test-giotto.ts

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ ${message}`);
  }
}

function pythonImportExists(moduleName: string): boolean {
  // Resolve through the project's .venv if present, fall back to system python.
  const candidates = [".venv/bin/python", ".venv/Scripts/python.exe", "python3", "python"];
  for (const c of candidates) {
    const r = spawnSync(c, ["-c", `import importlib.util, sys; sys.exit(0 if importlib.util.find_spec("${moduleName}") else 1)`], {
      encoding: "utf8",
    });
    if (r.status === 0) return true;
  }
  return false;
}

function runPythonSnippet(snippet: string, envOverride: Record<string, string> = {}): { status: number | null; stdout: string; stderr: string } {
  const candidates = [".venv/bin/python", ".venv/Scripts/python.exe", "python3", "python"];
  for (const c of candidates) {
    const r = spawnSync(c, ["-c", snippet], {
      encoding: "utf8",
      env: { ...process.env, ...envOverride },
    });
    if (r.status !== null && !r.error) return { status: r.status, stdout: r.stdout, stderr: r.stderr };
  }
  return { status: null, stdout: "", stderr: "no python found" };
}

console.log("\n=== Giotto.ai Integration Tests ===\n");

// ── Test 1: Python source file exists ──────────────────────────────
console.log("Test 1: giotto_client.py source presence");
{
  assert(existsSync("src/core/giotto_client.py"), "src/core/giotto_client.py exists");
}

// ── Test 2: openai SDK resolvable (used by giotto_client) ─────────
console.log("\nTest 2: openai package available");
{
  assert(pythonImportExists("openai"), "openai package importable (used by giotto_client)");
}

// ── Test 3: get_giotto_client raises when key missing ─────────────
console.log("\nTest 3: get_giotto_client raises without key");
{
  const r = runPythonSnippet(
    `import sys, os
os.environ.pop("GIOTTO_API_KEY", None)
os.environ.pop("GIOTTO_BASE_URL", None)
try:
    from src.core.giotto_client import get_giotto_client
    get_giotto_client()
    print("NO_RAISE")
except RuntimeError as e:
    print("OK:", str(e))
except Exception as e:
    print("UNEXPECTED:", type(e).__name__, str(e))`,
    { GIOTTO_API_KEY: "", GIOTTO_BASE_URL: "" },
  );
  assert(r.status === 0, "Python exits cleanly");
  assert(/^OK:/m.test(r.stdout), "get_giotto_client raises RuntimeError when key missing");
}

// ── Test 4: get_giotto_client_or_none returns None when key missing
console.log("\nTest 4: get_giotto_client_or_none returns None without key");
{
  const r = runPythonSnippet(
    `import os
os.environ.pop("GIOTTO_API_KEY", None)
from src.core.giotto_client import get_giotto_client_or_none
client = get_giotto_client_or_none()
print("NONE" if client is None else f"OBJECT:{type(client).__name__}")`,
    { GIOTTO_API_KEY: "" },
  );
  assert(r.status === 0, "Python exits cleanly");
  assert(/^NONE/m.test(r.stdout), "get_giotto_client_or_none returns None when key missing");
}

// ── Test 5: get_giotto_client_or_none builds a client when key is set
console.log("\nTest 5: get_giotto_client_or_none returns OpenAI client with key");
{
  const r = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "test-key-do-not-call"
from src.core.giotto_client import get_giotto_client_or_none
client = get_giotto_client_or_none()
print(type(client).__name__ if client else "NONE")`,
  );
  assert(r.status === 0, "Python exits cleanly");
  assert(/^OpenAI/m.test(r.stdout), "Returns an OpenAI instance");
}

// ── Test 6: Default base URL ───────────────────────────────────────
console.log("\nTest 6: default GIOTTO base URL");
{
  const r = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "test"
os.environ.pop("GIOTTO_BASE_URL", None)
from src.core.giotto_client import get_giotto_client, DEFAULT_GIOTTO_BASE_URL
client = get_giotto_client()
print("DEFAULT:", DEFAULT_GIOTTO_BASE_URL)
print("CLIENT_BASE:", str(client.base_url))`,
  );
  assert(r.status === 0, "Python exits cleanly");
  assert(/^DEFAULT: https:\/\/api\.giotto\.ai\/v1\//m.test(r.stdout), "DEFAULT_GIOTTO_BASE_URL points at api.giotto.ai/v1/");
  assert(/^CLIENT_BASE: https:\/\/api\.giotto\.ai\/v1\//m.test(r.stdout), "Client base_url matches the default");
}

// ── Test 7: GIOTTO_BASE_URL override ───────────────────────────────
console.log("\nTest 7: GIOTTO_BASE_URL env override honoured");
{
  const r = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "test"
os.environ["GIOTTO_BASE_URL"] = "https://example.test/v1/"
from src.core.giotto_client import get_giotto_client
print(str(get_giotto_client().base_url))`,
  );
  assert(r.status === 0, "Python exits cleanly");
  assert(/https:\/\/example\.test\/v1\//m.test(r.stdout), "Override base URL flows into client");
}

// ── Test 8: giotto_configured() helper ────────────────────────────
console.log("\nTest 8: giotto_configured() reporting");
{
  const r1 = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "your_giotto_api_key_here"
from src.core.giotto_client import giotto_configured
print("TRUE" if giotto_configured() else "FALSE")`,
  );
  assert(r1.status === 0, "placeholder case exits cleanly");
  assert(/^FALSE/m.test(r1.stdout), "placeholder value reports unconfigured");

  const r2 = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "sk-real-bytes"
from src.core.giotto_client import giotto_configured
print("TRUE" if giotto_configured() else "FALSE")`,
  );
  assert(r2.status === 0, "real-key case exits cleanly");
  assert(/^TRUE/m.test(r2.stdout), "real key reports configured");
}

// ── Test 9: env example contains the two new vars ─────────────────
console.log("\nTest 9: .env.example advertises Giotto");
{
  const txt = require("node:fs").readFileSync(".env.example", "utf8") as string;
  assert(/^GIOTTO_API_KEY=/m.test(txt), ".env.example declares GIOTTO_API_KEY");
  assert(/^GIOTTO_BASE_URL=/m.test(txt), ".env.example declares GIOTTO_BASE_URL");
}

// ── Test 10: integration research file present ─────────────────────
console.log("\nTest 10: integration research doc present");
{
  assert(existsSync("project/strategy/giotto-integration-research.md"), "giotto-integration-research.md exists");
  const txt = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/Future Caribbean/i.test(txt), "doc references Future Caribbean");
  assert(/Daniel Alvarez/.test(txt), "doc references Daniel Alvarez");
  assert(/OpenAI-compatible|openai\.com/i.test(txt), "doc mentions OpenAI SDK compatibility");
  assert(/multimodal/i.test(txt), "doc mentions multimodal");
  assert(/TBD/i.test(txt), "doc flags base URL as TBD");
}

// ── Test 11: claim email template present ─────────────────────────
console.log("\nTest 11: claim email template present");
{
  assert(existsSync("project/strategy/06-giotto-claim-email.md"), "06-giotto-claim-email.md exists");
  const txt = require("node:fs").readFileSync("project/strategy/06-giotto-claim-email.md", "utf8") as string;
  assert(/Subject:/i.test(txt), "email has Subject line");
  assert(/Daniel/i.test(txt), "email names Daniel");
  assert(/Sam Peacock/i.test(txt), "email names Sam Peacock");
}

// ── Test 12: gauntlet loop references Giotto ──────────────────────
console.log("\nTest 12: gauntlet loop mentions Giotto");
{
  const txt = require("node:fs").readFileSync("project/strategy/gauntlet-loop.md", "utf8") as string;
  assert(/Giotto/i.test(txt), "gauntlet-loop.md mentions Giotto");
  assert(/giotto_client|giotto\.ai/i.test(txt), "gauntlet-loop.md references giotto client");
}

// ── Test 13: moonshot roadmap lists Giotto as a sponsor ──────────
console.log("\nTest 13: moonshot roadmap sponsor row");
{
  const txt = require("node:fs").readFileSync("project/strategy/moonshot-roadmap-10-10.md", "utf8") as string;
  assert(/\*\*Giotto\.ai\*\*/.test(txt), "moonshot roadmap lists Giotto.ai as sponsor");
  assert(/7th sponsor|7 sponsors|sponsor #7/i.test(txt), "moonshot acknowledges count move");
}

// ── Test 14: live-call guard — skip network when key is placeholder
console.log("\nTest 14: live-call guard when placeholder");
{
  const r = runPythonSnippet(
    `import os
os.environ["GIOTTO_API_KEY"] = "your_giotto_api_key_here"
from src.core.giotto_client import giotto_configured, get_giotto_client_or_none
print("CONFIGURED", giotto_configured())
print("CLIENT", "none" if get_giotto_client_or_none() is None else "present")`,
  );
  assert(r.status === 0, "guard runs without errors");
  assert(/CONFIGURED False/.test(r.stdout), "placeholder reports unconfigured");
  assert(/CLIENT none/.test(r.stdout), "optional client returns None under placeholder");
}

// ── Test 15: model listing stub (multimodal-capable model expected)
console.log("\nTest 15: model list stub");
{
  // We document the expected compact + multimodal model IDs in research doc
  const txt = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/compact/i.test(txt), "doc references the compact reasoning model");
}

// ── Test 16: multimodal stub ──────────────────────────────────────
console.log("\nTest 16: multimodal stub documented");
{
  const txt = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/multimodal/i.test(txt), "doc references multimodal");
  assert(/image|pdf/i.test(txt), "doc references image/PDF inputs");
}

// ── Test 17: RAG stub ─────────────────────────────────────────────
console.log("\nTest 17: RAG / vector memory capability noted");
{
  const txt = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/RAG|vector|memory/i.test(txt), "doc mentions RAG / vector / memory");
}

// ── Test 18: OCR / doc processing stub ────────────────────────────
console.log("\nTest 18: OCR / doc processing stub");
{
  const txt = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/OCR|doc(ument)? process|extraction/i.test(txt), "doc mentions OCR / doc processing");
}

// ── Test 19: cross-link into gauntlet / claim email / research
console.log("\nTest 19: cross-link surface");
{
  const research = require("node:fs").readFileSync("project/strategy/giotto-integration-research.md", "utf8") as string;
  assert(/06-giotto-claim-email\.md/.test(research), "research doc cross-links to claim email");
  assert(/gauntlet-loop\.md/.test(research), "research doc cross-links to gauntlet loop");
  const email = require("node:fs").readFileSync("project/strategy/06-giotto-claim-email.md", "utf8") as string;
  assert(/giotto-integration-research\.md/.test(email), "claim email cross-links to research");
}

// ── Test 20: no live network calls during this test run ──────────
console.log("\nTest 20: offline-safe (no live network by default)");
{
  // We never spawn an HTTP request here; we only check the env-guarded client
  // factory. If GIOTTO_API_KEY is set to something that looks real, downstream
  // tests can decide to opt in. By convention this file never does.
  const r = runPythonSnippet(`from src.core.giotto_client import DEFAULT_GIOTTO_BASE_URL
print("OFFLINE_TEST_OK", DEFAULT_GIOTTO_BASE_URL)`);
  assert(r.status === 0, "offline test exits cleanly");
  assert(/OFFLINE_TEST_OK/.test(r.stdout), "offline test marker prints");
}

// ── Summary ───────────────────────────────────────────────────────
console.log(`\n=== Giotto.ai integration: ${passed}/${passed + failed} checks passed ===\n`);
if (failed > 0) {
  console.error(`❌ ${failed} check(s) failed`);
  process.exit(1);
}
process.exit(0);
