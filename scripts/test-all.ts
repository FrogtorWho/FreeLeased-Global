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
  bunOnly?: boolean; // true if suite cannot run under node (uses bare-module TS imports)
}

// Detect runtime: prefer `bun` (faster), fall back to `node --experimental-strip-types`.
import { execSync } from "node:child_process";

function hasCmd(cmd: string): boolean {
  try { execSync(`${cmd} --version`, { stdio: "ignore" }); return true; }
  catch { return false; }
}
const USE_BUN = hasCmd("bun");
const RUNTIME = USE_BUN ? "bun" : "node";
const RUNTIME_ARGS = USE_BUN ? [] : ["--experimental-strip-types"];

const suites: Suite[] = [
  { name: "test-suite (core 159)",        cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-suite.ts"],        required: true,  bunOnly: true  },
  { name: "test-signoff-queue (Batch 3)", cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-signoff-queue.ts"], required: true,  bunOnly: true  },
  { name: "test-truth-diff",              cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-truth-diff.ts"],     required: false, bunOnly: false },
  { name: "test-health-check",            cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-health-check.ts"],   required: false, bunOnly: false },
  { name: "test-reconcile-docs",          cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-reconcile-docs.ts"], required: false, bunOnly: false },
  { name: "test-onboarding (Phase 11 B1)", cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-onboarding.ts"],   required: false, bunOnly: false },
  { name: "test-citation (Phase 11 B2)",   cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-citation.ts"],     required: false, bunOnly: false },
  { name: "test-copy (Phase 11 B2)",       cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-copy.ts"],         required: false, bunOnly: false },
  { name: "test-rubric-coverage (B2)",     cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-rubric-coverage.ts"], required: false, bunOnly: false },
  { name: "test-a11y (Phase 11 B3)",       cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-a11y.ts"],         required: false, bunOnly: false },
  { name: "test-typescript-discipline (B3)", cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-typescript-discipline.ts"], required: false, bunOnly: false },
  { name: "test-truth (Phase 11 B4)",      cmd: [RUNTIME, ...RUNTIME_ARGS, "scripts/test-truth.ts"],         required: false, bunOnly: false },
];

console.log("\n🧪 FreeLeased — full test aggregator\n");
console.log(`Running ${suites.length} suites in sequence.\n`);

let totalPass = 0;
let totalFail = 0;
const failures: string[] = [];

for (const s of suites) {
  console.log(`\n── ${s.name} ──`);
  if (s.bunOnly && RUNTIME !== "bun") {
    console.log(`�️  ${s.name} SKIPPED — requires Bun (not on PATH). Suite uses bare-module TS imports.`);
    failures.push(s.name);
    totalFail++;
    continue;
  }
  const r = spawnSync(s.cmd[0], s.cmd.slice(1), {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
    cwd: process.cwd(),
  });
  const code = r.status ?? 1;
  if (code === 0) {
    console.log(`✅ ${s.name} exited 0`);
    totalPass++;
  } else if (r.error) {
    console.log(`❌ ${s.name} — spawn error: ${r.error.message}`);
    failures.push(s.name);
    totalFail++;
  } else {
    console.log(`❌ ${s.name} exited ${code}`);
    failures.push(s.name);
    totalFail++;
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
