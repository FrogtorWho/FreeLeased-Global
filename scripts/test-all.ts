#!/usr/bin/env bun
// FreeLeased — single-command test aggregator.
//
// Runs every test file in the project and prints a unified scorecard.
// Intended for `npm run test:all` and for the win-day checklist.
//
// Tests run in order of cost (cheapest first), so a fast fail short-circuits
// expensive suites. Each test file is invoked via Bun's subprocess so a crash
// in one suite does not take down the others.
//
// Run: bun scripts/test-all.ts
//       (or `npm run test:all`)

import { spawnSync } from "node:child_process";

interface Suite {
  name: string;
  cmd: string[];
  required: boolean; // if true, the failure fails the whole aggregator
}

const suites: Suite[] = [
  { name: "test-suite (core 159)",       cmd: ["bun", "scripts/test-suite.ts"],        required: true },
  { name: "test-signoff-queue (Batch 3)", cmd: ["bun", "scripts/test-signoff-queue.ts"], required: true },
  { name: "test-truth-diff",              cmd: ["bun", "scripts/test-truth-diff.ts"],     required: false },
  { name: "test-health-check",            cmd: ["bun", "scripts/test-health-check.ts"],   required: false },
  { name: "test-reconcile-docs",          cmd: ["bun", "scripts/test-reconcile-docs.ts"], required: false },
];

console.log("\n🧪 FreeLeased — full test aggregator\n");
console.log(`Running ${suites.length} suites in sequence.\n`);

let totalPass = 0;
let totalFail = 0;
const failures: string[] = [];

for (const s of suites) {
  console.log(`\n── ${s.name} ──`);
  const r = spawnSync(s.cmd[0], s.cmd.slice(1), {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  const code = r.status ?? 1;
  if (code === 0) {
    console.log(`✅ ${s.name} exited 0`);
  } else {
    console.log(`❌ ${s.name} exited ${code}`);
    failures.push(s.name);
    if (s.required) totalFail++;
    else totalFail++;
  }
}

console.log("\n════════════════════════════════════════════════════════════");
console.log(`📊 Aggregator: ${suites.length - failures.length}/${suites.length} suites green`);
if (failures.length) {
  console.log(`Failures:`);
  failures.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
}
console.log("All suites green.");
process.exit(0);
