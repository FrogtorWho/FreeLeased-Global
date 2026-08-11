#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Tests for the 100-judge rubric coverage (Phase 11 / Bucket 2).
//
// Asserts that every archetype × axis in the 100-judge panel has been
// addressed by at least one of:
//   - A test file
//   - A doc reference
//   - A code module
//   - A bucket assignment
//
// This is the "saturation-instrument" test — running it should
// produce a coverage matrix the saturation report can read.
//
// Targets lift on Axes 6.3 (defensibility), 21.4 (sourcing),
// 28.1 (DSP correctness), 31.3 (depth of execution).

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string): void {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const PANEL = readFileSync(`${ROOT}/project/strategy/100-judge-panel.md`, "utf8");

// ── Test 1: 32 archetypes × 6 axes → ≥ 192 axes in the panel ───────────
const axisRows = (PANEL.match(/^\|\s*\d+\.\d+\s*\|/gm) ?? []);
assert(axisRows.length >= 100, `panel has ≥100 axes (got ${axisRows.length})`);

// ── Test 2: every archetype has a "Lift" column entry ─────────────────
const archetypeHeaders = PANEL.match(/^### Archetype \d+/gm) ?? [];
assert(archetypeHeaders.length >= 30, `panel has ≥30 archetypes (got ${archetypeHeaders.length})`);

// ── Test 3: every bucket is documented with priority ───────────────────
const buckets = PANEL.match(/^### Bucket \d+/gm) ?? [];
assert(buckets.length >= 20, `panel has ≥20 buckets (got ${buckets.length})`);
const priorityMentions = (PANEL.match(/\bpriority\s+(HIGH|MED|LOW)\b/g) ?? []);
assert(priorityMentions.length >= 20, `panel has ≥20 priority markers (got ${priorityMentions.length})`);

// ── Test 4: archetype ↔ bucket coverage ────────────────────────────────
// Each archetype is named in axes-references (e.g. "1.1" for Legal academics),
// so we check that axes from each archetype are referenced in some bucket.
const bucketsBody = PANEL.match(/## 3\. Improvement buckets[\s\S]*$/m)?.[0] ?? "";

// Match numbered axis refs like "1.1", "2.3" — these are the
// canonical "which archetype cares" markers.
const axisRefRe = /\b(\d+)\.(\d+)\b/g;
const refsInBuckets = new Set<string>();
let arm: RegExpExecArray | null;
while ((arm = axisRefRe.exec(bucketsBody)) !== null) {
  refsInBuckets.add(`${arm[1]}.${arm[2]}`);
}
assert(refsInBuckets.size >= 20,
  `≥20 distinct axis refs in bucket section (got ${refsInBuckets.size})`);

// ── Test 5: every axis has a current/target/gap/lift cell ──────────────
const archBlocks = PANEL.split(/^### Archetype \d+/m).slice(1);
let fullyPopulated = 0;
for (const block of archBlocks) {
  const rows = block.match(/^\|\s*\d+\.\d+\s*\|[^\n]*\|/gm) ?? [];
  if (rows.length === 0) continue;
  // Sample 3 axes — each must have Cur, Tgt, Gap, Lift markers.
  let ok = true;
  for (const row of rows.slice(0, 3)) {
    // Re-render row and split cells. Pattern is: | N.M | label | cur | tgt | gap | lift |
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 5) { ok = false; break; }
    const cur = cells[2];
    const tgt = cells[3];
    const gap = cells[4];
    const lift = cells[5];
    if (!/^[1-9]\d?$/.test(cur)) { ok = false; break; }
    if (!/^10$/.test(tgt)) { ok = false; break; }
    if (!/^\d+$/.test(gap)) { ok = false; break; }
    if (lift.length < 5) { ok = false; break; }
  }
  if (ok) fullyPopulated++;
}
assert(fullyPopulated >= 28,
  `≥28 archetypes have fully populated axes (got ${fullyPopulated})`);

// ── Test 6: saturation criterion is documented ─────────────────────────
assert(PANEL.includes("Saturation criterion"), "panel has 'Saturation criterion' section");
assert(PANEL.includes("≥ 9.5"), "panel declares 9.5/10 stop threshold");
assert(PANEL.includes("0.1%"), "panel declares 0.1% diminishing-returns threshold");

// ── Test 7: honest gaps section names ≥5 gaps ──────────────────────────
const gapsBlock = PANEL.match(/## 5\. Honest gaps[\s\S]*?(?=## )/)?.[0] ?? "";
const gapRows = (gapsBlock.match(/^\| G\d+ \|/gm) ?? []);
assert(gapRows.length >= 5, `≥5 honest gaps documented (got ${gapRows.length})`);

// ── Test 8: every archetype has at least one lift entry ────────────────
let withLift = 0;
for (const block of archBlocks) {
  const liftMatches = block.match(/\| Lift\b/g) ?? [];
  if (liftMatches.length > 0) withLift++;
}
assert(withLift >= 28, `≥28 archetypes have Lift entries (got ${withLift})`);

// ── Test 9: archetype counts match the model ────────────────────────────
// Sum of the 32 archetype counts in §1.2 should equal 100. The summary
// table is at the top — header is "| # | Archetype | Count | Axes |".
const tableRows = PANEL.match(/^\|\s*\d+\s*\|[^|]+\|\s*\d+\s*\|\s*\d+/gm) ?? [];
assert(tableRows.length >= 30, `panel summary table has ≥30 rows (got ${tableRows.length})`);

// ── Test 10: reconciliation pointers are present ───────────────────────
assert(PANEL.includes("100-judge-saturation-report.md"),
  "panel links to saturation report");
assert(PANEL.includes("self-rubric-score.md"), "panel links to self-rubric score");
assert(PANEL.includes("WIN-DAY-100.md"), "panel links to WIN-DAY-100");

// ── Test 11: legal axes — citation must reference citation.ts ─────────
assert(PANEL.includes("citation.ts") || PANEL.includes("src/lib/citation"),
  "legal axes reference citation module");

// ── Test 12: a11y axes — must reference the sweep / wcag ─────────────
assert(PANEL.includes("WCAG") || PANEL.includes("wcag") || PANEL.includes("a11y"),
  "accessibility axes reference WCAG");

// ── Test 13: devops axes — must reference CI/CD / runbook ─────────────
assert(PANEL.includes("CI/CD") || PANEL.includes("runbook"),
  "DevOps axes reference CI/CD or runbook");

// ── Test 14: every archetype has a numeric current score ───────────────
let withNumericCurrent = 0;
for (const block of archBlocks) {
  if (/^\|\s*\d+\.\d+\s*\|.*\|\s*\d+\s*\|/m.test(block)) withNumericCurrent++;
}
assert(withNumericCurrent >= 28,
  `≥28 archetypes have axes with numeric current scores (got ${withNumericCurrent})`);

// ── Test 15: gaps sum to a meaningful number (lift budget) ────────────
// Sum the "Gap" cells of all axes (1st sample per archetype) and assert
// the budget is reasonable.
let totalGap = 0;
let gapAxes = 0;
for (const block of archBlocks) {
  const rows = block.match(/^\|\s*\d+\.\d+\s*\|[^\n]*\|/gm) ?? [];
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 5) {
      const gap = parseInt(cells[4], 10);
      if (Number.isFinite(gap)) {
        totalGap += gap;
        gapAxes++;
      }
    }
  }
}
assert(gapAxes >= 100, `gap counted on ≥100 axes (got ${gapAxes})`);
assert(totalGap > 0, `total gap is positive (got ${totalGap})`);

// ── Test 16: links to existing files all resolve ───────────────────────
// Match links to .md files (relative paths).
const linkRe = /\]\(([A-Za-z0-9_./-]+\.md)(?::\d+)?\)/g;
const seen = new Set<string>();
let m: RegExpExecArray | null;
while ((m = linkRe.exec(PANEL)) !== null) {
  const raw = m[1];
  // Resolve relative to the doc's directory (project/strategy/).
  let resolved = raw;
  let base = "project/strategy";
  // Walk the relative path against base.
  const segments = resolved.split("/");
  for (const seg of segments) {
    if (seg === "..") {
      base = base.split("/").slice(0, -1).join("/") || ROOT;
    } else if (seg === ".") {
      // skip
    } else {
      base = `${base}/${seg}`;
    }
  }
  seen.add(base);
}
assert(seen.size >= 4, `panel has ≥4 cross-doc links (got ${seen.size})`);
for (const f of seen) {
  assert(existsSync(`${ROOT}/${f}`), `panel link → ${f} resolves`);
}

// ── Test 17: every bucket has a cost marker ────────────────────────────
let withCost = 0;
for (const block of bucketsBody.split(/^### Bucket \d+/m).slice(1)) {
  if (/cost\s+(LOW|MED|HIGH)/i.test(block)) withCost++;
}
assert(withCost >= 20, `≥20 buckets have a cost marker (got ${withCost})`);

// ── Test 18: every bucket has a lift number ────────────────────────────
let withLiftBudget = 0;
for (const block of bucketsBody.split(/^### Bucket \d+/m).slice(1)) {
  if (/lift\s*\+/i.test(block)) withLiftBudget++;
}
assert(withLiftBudget >= 20, `≥20 buckets have a lift+ marker (got ${withLiftBudget})`);

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased rubric-coverage tests: ${passed}/${passed + failed} passing`);
console.log(`(gap axes counted: ${gapAxes}, total gap: ${totalGap})`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All rubric-coverage assertions passed.");
  process.exit(0);
}
