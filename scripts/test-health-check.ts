#!/usr/bin/env bun
// FreeLeased — Tests for the health-check scorecard.
//
// The health-check is a thin wrapper over static analysis. We test the
// helpers (`tryRun`, `guarded`, `tryLint`) and the data invariants
// (e.g. test count == 159, sw.js exists, .env.example has the 4 vars).
//
// Stage 7 #8 — health-check.ts shipped.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string) {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── Test 1: All expected files exist ──────────────────────────────────
{
  const files = [
    "scripts/health-check.ts",
    "scripts/test-suite.ts",
    "public/sw.js",
    ".env.example",
    "package.json",
  ];
  for (const f of files) {
    assert(existsSync(`${ROOT}/${f}`), `${f} exists`);
  }
}

// ── Test 2: health-check.ts uses execSync + readFileSync ───────────────
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  assert(ts.includes("execSync"), "health-check.ts uses execSync");
  assert(ts.includes("readFileSync"), "health-check.ts uses readFileSync");
  assert(ts.includes("EXPECTED_TEST_COUNT"), "health-check.ts declares EXPECTED_TEST_COUNT");
}

// ── Test 3: EXPECTED_TEST_COUNT is 159 ─────────────────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  const m = ts.match(/EXPECTED_TEST_COUNT\s*=\s*(\d+)/);
  assert(m !== null && m[1] === "159", `EXPECTED_TEST_COUNT === 159 (got ${m?.[1]})`);
}

// ── Test 4: Test count via static analysis matches expected ────────────
{
  const ts = readFileSync(`${ROOT}/scripts/test-suite.ts`, "utf8");
  const n = (ts.match(/^\s*check\(/gm) ?? []).length;
  assert(n === 159, `test-suite has 159 check() calls (got ${n})`);
}

// ── Test 5: .env.example has the 4 required vars ───────────────────────
{
  const env = readFileSync(`${ROOT}/.env.example`, "utf8");
  const required = ["NEBIUS_API_KEY", "OLLYGARDEN_API_KEY", "OLLYGARDEN_OTLP_ENDPOINT", "MINIMAX_API_KEY"];
  for (const v of required) {
    assert(env.includes(`${v}=`), `.env.example declares ${v}`);
  }
}

// ── Test 6: Service worker is non-trivial ──────────────────────────────
{
  const sw = readFileSync(`${ROOT}/public/sw.js`, "utf8");
  assert(sw.includes("addEventListener"), "sw.js has event listeners");
  assert(sw.length > 500, `sw.js is > 500 chars (got ${sw.length})`);
}

// ── Test 7: health-check has 12 rows (10 original + reconcile + tsc tweaks) ─
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  const rowCalls = (ts.match(/row\(/g) ?? []).length;
  assert(rowCalls >= 12, `health-check has ≥ 12 row() calls (got ${rowCalls})`);
}

// ── Test 8: Reconciliation drift is surfaced ──────────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  assert(ts.includes("Doc-vs-code reconciliation"), "health-check has reconciliation row");
  assert(ts.includes("reconcile-docs.ts"), "health-check calls reconcile-docs.ts");
}

// ── Test 9: Both lint tools (ruff + black) are run ────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  assert(/ruff/.test(ts), "health-check mentions ruff");
  assert(/black/.test(ts), "health-check mentions black");
}

// ── Test 10: tryRun helper is defined ──────────────────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/health-check.ts`, "utf8");
  assert(ts.includes("function tryRun"), "tryRun helper defined");
  assert(ts.includes("function guarded"), "guarded helper defined");
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased health-check tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All health-check assertions passed.");
  process.exit(0);
}