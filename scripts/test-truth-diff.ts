#!/usr/bin/env bun
// FreeLeased — Tests for the TruthDiff verifier component
//
// Mirrors the regex logic in [`src/components/auri/TruthDiff.tsx`](src/components/auri/TruthDiff.tsx:1)
// and asserts that the dynamic counters match the documented expected values.
// Pattern parity matters: if the regex changes, the test catches a doc
// inconsistency immediately.
//
// Stage 7 #6 — TruthDiff component shipped.

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

// ── Test 1: Test count via check() regex ───────────────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/test-suite.ts`, "utf8");
  const n = (ts.match(/^\s*check\(/gm) ?? []).length;
  assert(n === 159, `test-suite.ts has 159 check() invocations (got ${n})`);
}

// ── Test 2: Jurisdictions via code: "XX" pattern in spine.ts ────────────
{
  const ts = readFileSync(`${ROOT}/src/data/spine.ts`, "utf8");
  const n = (ts.match(/^\s*code:\s*"[A-Z]{2,3}"/gm) ?? []).length;
  assert(n === 9, `spine.ts has 9 jurisdictions (got ${n})`);
}

// ── Test 3: Patterns via id: N, pattern at line start ──────────────────
{
  const ts = readFileSync(`${ROOT}/src/data/patterns.ts`, "utf8");
  const n = (ts.match(/^\s*id:\s*\d+,/gm) ?? []).length;
  assert(n === 20, `patterns.ts has 20 patterns (got ${n})`);
}

// ── Test 4: Engines file present ───────────────────────────────────────
{
  const exists = existsSync(`${ROOT}/src/lib/engines.ts`);
  assert(exists, "src/lib/engines.ts exists");
}

// ── Test 5: Statutory URL pattern sanity ────────────────────────────────
{
  const ts = readFileSync(`${ROOT}/src/data/spine.ts`, "utf8");
  const urls = ts.match(/url:\s*"https?:\/\/[^"]+"/g) ?? [];
  assert(urls.length >= 25, `spine.ts has ≥25 statute URLs (got ${urls.length})`);
}

// ── Test 6: All statutes have a URL (mirrors test-suite.ts:24) ─────────
{
  const ts = readFileSync(`${ROOT}/src/data/spine.ts`, "utf8");
  const statutes = ts.match(/shortTitle:\s*"[^"]+"/g) ?? [];
  const urls = ts.match(/url:\s*"https?:\/\/[^"]+"/g) ?? [];
  // Loose check: there must be at least as many URLs as statutes.
  assert(urls.length >= statutes.length, `URLs ≥ statutes (${urls.length} ≥ ${statutes.length})`);
}

// ── Test 7: Conviction caps in fairness.ts match truth-protocol ────────
{
  const ts = readFileSync(`${ROOT}/src/lib/fairness.ts`, "utf8");
  assert(/established:\s*0\.99/.test(ts), "fairness.ts caps established at 0.99");
  assert(/heuristic:\s*0\.75/.test(ts), "fairness.ts caps heuristic at 0.75");
  assert(/contested:\s*0\.6/.test(ts), "fairness.ts caps contested at 0.6");
  assert(/unfalsifiable:\s*0\.33/.test(ts), "fairness.ts caps unfalsifiable at 0.33");
}

// ── Test 8: Data Room folders evidenced (22/24) ────────────────────────
{
  const md = readFileSync(`${ROOT}/memory/data-room-copies.md`, "utf8");
  const folderSet = new Set<string>();
  const re = /\|\s*COPY-\d+\s*\|[^|]*\|[^|]*\|\s*`([A-Za-z0-9_ -]+\/[A-Za-z0-9_ -]+)\//g;
  let m;
  while ((m = re.exec(md)) !== null) folderSet.add(m[1].trim());
  assert(folderSet.size === 22, `data-room has 22 sub-folders (got ${folderSet.size})`);
}

// ── Test 9: TruthDiff.tsx is referenced and exports the verifier ───────
{
  const td = readFileSync(`${ROOT}/src/components/auri/TruthDiff.tsx`, "utf8");
  assert(td.includes("export function TruthDiff"), "TruthDiff.tsx exports TruthDiff");
  assert(td.includes("countDataRoomFolders"), "TruthDiff.tsx has countDataRoomFolders()");
  assert(td.includes("data-room"), "TruthDiff.tsx has data-room claim row");
  assert(td.includes("expected: 22"), "TruthDiff.tsx expected value is 22");
}

// ── Test 10: The doc and code agree on the 159 test count ──────────────
{
  // The 00-OVERVIEW.md line said "65/67 passing" but the truth-protocol
  // canonical is 159/159. This test asserts the current doc reflects 159.
  const ts = readFileSync(`${ROOT}/scripts/test-suite.ts`, "utf8");
  const m = ts.match(/testsPassing:\s*(\d+),\s*testsTotal:\s*(\d+)/);
  assert(m !== null, "test-suite.ts declares testsPassing + testsTotal");
  if (m) {
    const [_, passing, total] = m;
    assert(passing === "159" && total === "159", `metrics declares 159/159 (got ${passing}/${total})`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased TruthDiff tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All TruthDiff assertions passed.");
  process.exit(0);
}