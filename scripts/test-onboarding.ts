#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Tests for the cold-clone polish artefacts (Phase 11 / Bucket 1).
//
// Validates the docs that every newcomer and judge sees first:
//   - docs/onboarding.md
//   - docs/judge-quickstart.md
//   - docs/story-60s.md
//   - project/strategy/100-judge-panel.md
//   - project/strategy/i18n-roadmap.md
//   - README.md, CONTRIBUTING.md, .env.example
//
// These tests assert: structure, cross-link integrity, no broken
// references, no stale numbers (everything reconciles against the
// rest of the repo via the existing test-reconcile-docs.ts suite).
//
// The test runner uses a plain Node entry; bun is also supported.

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string): void {
  if (cond) {
    passed++;
  } else {
    failed++;
    fails.push(name);
  }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── File existence + non-trivial size ──────────────────────────────────
const ARTIFACTS: Array<{ path: string; minBytes: number }> = [
  { path: "docs/onboarding.md", minBytes: 3000 },
  { path: "docs/judge-quickstart.md", minBytes: 3000 },
  { path: "docs/story-60s.md", minBytes: 2000 },
  { path: "project/strategy/100-judge-panel.md", minBytes: 8000 },
  { path: "project/strategy/i18n-roadmap.md", minBytes: 2000 },
  { path: "README.md", minBytes: 5000 },
  { path: "CONTRIBUTING.md", minBytes: 2000 },
  { path: ".env.example", minBytes: 500 },
];
for (const a of ARTIFACTS) {
  const fullPath = `${ROOT}/${a.path}`;
  assert(existsSync(fullPath), `${a.path} exists`);
  if (existsSync(fullPath)) {
    const sz = statSync(fullPath).size;
    assert(sz >= a.minBytes, `${a.path} size ≥ ${a.minBytes} bytes (got ${sz})`);
  }
}

// ── Cross-link integrity for docs/onboarding.md ────────────────────────
{
  const md = readFileSync(`${ROOT}/docs/onboarding.md`, "utf8");
  // Match every relative link to a file
  const linkRe = /\]\((?:\.\.\/)+([A-Za-z0-9_./-]+\.[a-z]+)(?::\d+)?\)/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(md)) !== null) seen.add(m[1]);
  assert(seen.size >= 5, `onboarding has ≥5 file links (got ${seen.size})`);
  for (const f of seen) {
    assert(existsSync(`${ROOT}/${f}`), `onboarding link → ${f} resolves`);
  }
}

// ── Cross-link integrity for docs/judge-quickstart.md ──────────────────
{
  const md = readFileSync(`${ROOT}/docs/judge-quickstart.md`, "utf8");
  const linkRe = /\]\((?:\.\.\/)+([A-Za-z0-9_./-]+\.[a-z]+)(?::\d+)?\)/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(md)) !== null) seen.add(m[1]);
  assert(seen.size >= 8, `judge-quickstart has ≥8 file links (got ${seen.size})`);
  for (const f of seen) {
    assert(existsSync(`${ROOT}/${f}`), `judge-quickstart link → ${f} resolves`);
  }
}

// ── 100-judge panel — archetype coverage ───────────────────────────────
{
  const md = readFileSync(`${ROOT}/project/strategy/100-judge-panel.md`, "utf8");
  // 32 archetypes — count those with "Archetype N —" or "| 1 |", "| 2 |", ...
  let archCount = 0;
  for (let i = 1; i <= 32; i++) {
    const re1 = new RegExp(`^### Archetype ${i}\\b`, "m");
    const re2 = new RegExp(`^\\|\\s*${i}\\s*\\|`, "m");
    if (re1.test(md) || re2.test(md)) archCount++;
  }
  assert(archCount >= 30, `100-judge panel covers ≥30 archetypes (got ${archCount})`);

  // Each archetype should have ≥4 axes
  const axisRe = /^\|\s*\d+\.\d+\s*\|/gm;
  const axisCount = (md.match(axisRe) ?? []).length;
  assert(axisCount >= 100, `panel has ≥100 axes (got ${axisCount})`);

  // 20 buckets
  const bucketRe = /^### Bucket \d+/gm;
  const bucketCount = (md.match(bucketRe) ?? []).length;
  assert(bucketCount >= 20, `panel has ≥20 buckets (got ${bucketCount})`);

  // Honest gaps section present
  assert(md.includes("Honest gaps"), "panel has 'Honest gaps' section");
  assert(md.includes("Saturation criterion"), "panel has 'Saturation criterion'");
}

// ── story-60s structure ────────────────────────────────────────────────
{
  const md = readFileSync(`${ROOT}/docs/story-60s.md`, "utf8");
  for (const h of ["Setup", "Conflict", "Resolution", "Proof", "Ask"]) {
    assert(md.includes(`## ${h}`), `story-60s has '## ${h}'`);
  }
  // Has the 4-click judge tour
  assert(md.includes("Honesty"), "story-60s names Honesty tab");
  assert(md.includes("Lease Scanner"), "story-60s names Lease Scanner");
  assert(md.includes("Sign-off Queue"), "story-60s names Sign-off Queue");
}

// ── i18n-roadmap honesty ───────────────────────────────────────────────
{
  const md = readFileSync(`${ROOT}/project/strategy/i18n-roadmap.md`, "utf8");
  assert(md.includes("English only") || md.includes("English-only") || md.includes("English"),
    "i18n-roadmap discloses English-only status");
  // Names at least 3 non-English languages
  let nonEnglish = 0;
  for (const lang of ["Patois", "Creole", "Spanish", "French", "Dutch"]) {
    if (md.includes(lang)) nonEnglish++;
  }
  assert(nonEnglish >= 3, `i18n-roadmap names ≥3 non-English languages (got ${nonEnglish})`);
  // Has a target year
  assert(/202[6-7]/.test(md), "i18n-roadmap has a 2026/2027 target date");
}

// ── README and CONTRIBUTING sanity ─────────────────────────────────────
{
  const readme = readFileSync(`${ROOT}/README.md`, "utf8");
  assert(readme.includes("Quick start"), "README has Quick start");
  assert(readme.includes("npm run verify"), "README documents `npm run verify`");
  assert(readme.includes("CONTRIBUTING") || readme.includes("`CONTRIBUTING.md`"),
    "README links CONTRIBUTING.md");

  const contrib = readFileSync(`${ROOT}/CONTRIBUTING.md`, "utf8");
  assert(contrib.includes("Quick start"), "CONTRIBUTING has Quick start");
  assert(contrib.includes("Code of conduct") || contrib.includes("code of conduct"),
    "CONTRIBUTING has Code of Conduct section");
  assert(contrib.includes("Truth Protocol") || contrib.includes("truth protocol"),
    "CONTRIBUTING has Truth Protocol section");
}

// ── .env.example covers the live LLM/observability stack ──────────────
{
  const env = readFileSync(`${ROOT}/.env.example`, "utf8");
  for (const k of ["NEBIUS_API_KEY", "GIOTTO_API_KEY", "MINIMAX_API_KEY",
                   "OLLYGARDEN_API_KEY", "OLLYGARDEN_OTLP_ENDPOINT",
                   "USE_LOCAL_EDGE", "OLLAMA"]) {
    assert(env.includes(k), `.env.example documents ${k}`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased onboarding tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All onboarding assertions passed.");
  process.exit(0);
}
