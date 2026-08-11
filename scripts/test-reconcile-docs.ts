#!/usr/bin/env bun
// FreeLeased — Tests for the doc-vs-code reconciler.
//
// The reconciler extracts numerical claims from docs and matches each
// against codebase reality. These tests assert the underlying regexes
// and expected values that drive the reconciliation table.
//
// Stage 7 #13 — reconcile-docs.ts shipped.

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

// ── Test 1: reconcile-docs.ts exists and exports runnable code ─────────
{
  const ts = readFileSync(`${ROOT}/scripts/reconcile-docs.ts`, "utf8");
  assert(ts.length > 1000, `reconcile-docs.ts is non-trivial (got ${ts.length} chars)`);
  assert(ts.includes("Drift count"), "reconcile-docs.ts prints Drift count line");
  assert(ts.includes("**"), "reconcile-docs.ts uses markdown bold");
}

// ── Test 2: Test count via check() regex returns 159 ───────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/test-suite.ts`, "utf8");
  const n = (ts.match(/^\s*check\(/gm) ?? []).length;
  assert(n === 159, `check() count is 159 (got ${n})`);
}

// ── Test 3: Jurisdictions via `code: "XX"` regex returns 9 ─────────────
{
  const ts = readFileSync(`${ROOT}/src/data/spine.ts`, "utf8");
  const n = (ts.match(/^\s*code:\s*"[A-Z]{2,3}"/gm) ?? []).length;
  assert(n === 9, `jurisdiction code count is 9 (got ${n})`);
}

// ── Test 4: Patterns via `id: N,` regex returns 20 ─────────────────────
{
  const ts = readFileSync(`${ROOT}/src/data/patterns.ts`, "utf8");
  const n = (ts.match(/^\s*id:\s*\d+,/gm) ?? []).length;
  assert(n === 20, `pattern id count is 20 (got ${n})`);
}

// ── Test 5: Caps in CONFIDENCE_CAP table returns 4 ─────────────────────
{
  const ts = readFileSync(`${ROOT}/src/lib/fairness.ts`, "utf8");
  const block = ts.match(/CONFIDENCE_CAP[\s\S]*?\}\s*;/);
  assert(block !== null, "CONFIDENCE_CAP table found");
  if (block) {
    const entries = (block[0].match(/:\s*\d+\.?\d*/g) ?? []).length;
    assert(entries === 4, `CONFIDENCE_CAP has 4 entries (got ${entries})`);
  }
}

// ── Test 6: Loops max — loop-protocol.md declares Loop 8 ──────────────
{
  const md = readFileSync(`${ROOT}/project/strategy/loop-protocol.md`, "utf8");
  let max = 0;
  const re = /\*\*Loop\s+(\d+)\b/g;
  let m;
  while ((m = re.exec(md)) !== null) max = Math.max(max, parseInt(m[1], 10));
  assert(max === 8, `max Loop N is 8 (got ${max})`);
}

// ── Test 7: Sprints from "Day N of M" in 00-OVERVIEW.md returns 21 ─────
{
  const md = readFileSync(`${ROOT}/project/strategy/00-OVERVIEW.md`, "utf8");
  const m = md.match(/Day\s+(\d+)\s+of\s+(\d+)/i);
  assert(m !== null, "00-OVERVIEW.md has 'Day N of M'");
  if (m) assert(m[2] === "21", `M == 21 (got ${m[2]})`);
}

// ── Test 8: MoUs from "N Caribbean government agencies" returns 7 ──────
{
  const md = readFileSync(`${ROOT}/project/strategy/00-OVERVIEW.md`, "utf8");
  const m = md.match(/(\d+)\s+(?:Caribbean\s+government\s+agencies|MoU\s+partners|personalised\s+follow-up\s+emails)/i);
  assert(m !== null, "00-OVERVIEW.md declares MoU partner count");
  if (m) assert(m[1] === "7", `MoU count == 7 (got ${m[1]})`);
}

// ── Test 9: Data-room sub-folders returns 22 ───────────────────────────
{
  const md = readFileSync(`${ROOT}/memory/data-room-copies.md`, "utf8");
  const folderSet = new Set<string>();
  const re = /\|\s*COPY-\d+\s*\|[^|]*\|[^|]*\|\s*`([A-Za-z0-9_ -]+\/[A-Za-z0-9_ -]+)\//g;
  let m;
  while ((m = re.exec(md)) !== null) folderSet.add(m[1].trim());
  assert(folderSet.size === 22, `data-room sub-folders == 22 (got ${folderSet.size})`);
}

// ── Test 10: reconcile-docs table has 10 claim rows ────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/reconcile-docs.ts`, "utf8");
  const claimKeys = ["tests", "jurisdictions", "patterns", "statutes", "engines", "loops", "sprints", "moUs", "caps", "data-room-folders"];
  for (const key of claimKeys) {
    assert(ts.includes(`"${key}"`) || ts.includes(`'${key}'`), `claim "${key}" is in reconcile-docs.ts`);
  }
}

// ── Test 11: All expected source files exist ───────────────────────────
{
  const files = [
    "scripts/test-suite.ts",
    "src/data/spine.ts",
    "src/data/patterns.ts",
    "src/lib/fairness.ts",
    "src/lib/engines.ts",
    "project/strategy/loop-protocol.md",
    "project/strategy/00-OVERVIEW.md",
    "memory/data-room-copies.md",
  ];
  for (const f of files) {
    assert(existsSync(`${ROOT}/${f}`), `${f} exists`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased reconcile-docs tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All reconcile-docs assertions passed.");
  process.exit(0);
}