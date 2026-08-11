#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Tests for src/lib/slo.ts (Phase 11 / Bucket 5).
//
// Coverage targets:
//   - SLO targets are realistic (0.9 - 0.9999).
//   - Every SLO has a non-empty surface.
//   - Error budgets are computed correctly.
//   - Perf budgets bundle/TTFI/LCP are reasonable.
//   - Runbooks cover ≥5 known failure modes.
//   - Status snapshot is consistent.
//
// Targets lift on Axes 11.1-11.6 (DevOps), 9.3 (perf),
// 12.5 (PII observability), 14.4 (retention).

import {
  SLOS,
  PERF_BUDGETS,
  RUNBOOKS,
  statusSnapshot,
  isValidSlo,
  isValidPerfBudget,
  type SLO,
  type PerfBudget,
} from "../src/lib/slo.ts";
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

// ── Test 1: SLOS is non-empty ─────────────────────────────────────────
assert(SLOS.length >= 5, `SLOS has ≥5 entries (got ${SLOS.length})`);

// ── Test 2: every SLO has a valid target ──────────────────────────────
for (const s of SLOS) {
  assert(s.target > 0.9 && s.target <= 0.9999,
    `SLO ${s.id} target ∈ (0.9, 0.9999] (got ${s.target})`);
  // Use approximate equality for floating-point comparison.
  assert(Math.abs(s.errorBudget - (1 - s.target)) < 1e-9,
    `SLO ${s.id} errorBudget = 1 - target`);
  assert(s.windowDays >= 1 && s.windowDays <= 90,
    `SLO ${s.id} windowDays ∈ [1, 90] (got ${s.windowDays})`);
  assert(s.burnRateThreshold >= 1.0 && s.burnRateThreshold <= 10.0,
    `SLO ${s.id} burnRateThreshold ∈ [1.0, 10.0] (got ${s.burnRateThreshold})`);
}

// ── Test 3: every SLO has a non-empty surface ─────────────────────────
for (const s of SLOS) {
  assert(s.surface.length > 0, `SLO ${s.id} has surface`);
  assert(s.description.length > 0, `SLO ${s.id} has description`);
  assert(isValidSlo(s), `SLO ${s.id} passes isValidSlo`);
}

// ── Test 4: PERF_BUDGETS is non-empty ─────────────────────────────────
assert(PERF_BUDGETS.length >= 3, `PERF_BUDGETS has ≥3 entries (got ${PERF_BUDGETS.length})`);
for (const p of PERF_BUDGETS) {
  assert(p.bundleKb > 0 && p.bundleKb <= 500,
    `perf ${p.surface} bundle ∈ (0, 500] KB (got ${p.bundleKb})`);
  assert(p.ttfiMs > 0 && p.ttfiMs <= 5000,
    `perf ${p.surface} ttfi ∈ (0, 5000] ms (got ${p.ttfiMs})`);
  assert(p.lcpMs >= p.ttfiMs,
    `perf ${p.surface} LCP ≥ TTFI (got ${p.lcpMs} vs ${p.ttfiMs})`);
  assert(isValidPerfBudget(p), `perf ${p.surface} passes isValidPerfBudget`);
}

// ── Test 5: RUNBOOKS covers ≥5 failure modes ──────────────────────────
assert(RUNBOOKS.length >= 5, `RUNBOOKS has ≥5 entries (got ${RUNBOOKS.length})`);
for (const r of RUNBOOKS) {
  assert(r.failure.length > 0, `runbook ${r.id} has failure`);
  assert(r.detection.length > 0, `runbook ${r.id} has detection`);
  assert(r.triage.length > 0, `runbook ${r.id} has triage`);
  assert(r.mitigation.length > 0, `runbook ${r.id} has mitigation`);
  assert(r.owner.length > 0, `runbook ${r.id} has owner`);
}

// ── Test 6: runbooks cover the canonical failure modes ───────────────
const CANONICAL_FAILURES = [
  "OllyGarden",
  "LLM",
  "Prisma",
  "bundle",
  "CI",
];
for (const f of CANONICAL_FAILURES) {
  const found = RUNBOOKS.some((r) => r.failure.includes(f) || r.id.includes(f.toLowerCase()));
  assert(found, `runbook covers failure: ${f}`);
}

// ── Test 7: statusSnapshot is consistent ─────────────────────────────
{
  const snap = statusSnapshot();
  assert(snap.slos.length === SLOS.length, "snapshot SLOS count matches");
  assert(snap.perfBudgets.length === PERF_BUDGETS.length,
    "snapshot PERF_BUDGETS count matches");
  assert(snap.runbooks.length === RUNBOOKS.length,
    "snapshot RUNBOOKS count matches");
  assert(typeof snap.generatedAt === "string", "snapshot has generatedAt");
  assert(snap.generatedAt.includes("T"), "generatedAt is ISO timestamp");
}

// ── Test 8: SLO ids are unique ────────────────────────────────────────
{
  const ids = SLOS.map((s) => s.id);
  const uniq = new Set(ids);
  assert(uniq.size === ids.length, `SLO ids are unique (got ${uniq.size}/${ids.length})`);
}

// ── Test 9: runbook ids are unique ────────────────────────────────────
{
  const ids = RUNBOOKS.map((r) => r.id);
  const uniq = new Set(ids);
  assert(uniq.size === ids.length, `runbook ids unique (got ${uniq.size}/${ids.length})`);
}

// ── Test 10: perf budgets include mobile and desktop ─────────────────
{
  const mobile = PERF_BUDGETS.filter((p) => p.surface.toLowerCase().includes("mobile"));
  const desktop = PERF_BUDGETS.filter((p) => p.surface.toLowerCase().includes("desktop"));
  assert(mobile.length >= 1, `≥1 mobile perf budget (got ${mobile.length})`);
  assert(desktop.length >= 1, `≥1 desktop perf budget (got ${desktop.length})`);
}

// ── Test 11: OllyGarden integration doc still exists ─────────────────
{
  const doc = `${ROOT}/docs/ollygarden-integration.md`;
  assert(existsSync(doc), "ollygarden-integration.md exists");
  const content = readFileSync(doc, "utf8");
  assert(content.includes("OTLP") || content.includes("otlp"),
    "ollygarden-integration.md mentions OTLP");
}

// ── Test 12: SLO surfaces align with documented endpoints ────────────
{
  // Verify that POST /api/fairness/check is in SLOS.
  const fairnessSlo = SLOS.find((s) => s.surface.includes("fairness"));
  assert(fairnessSlo !== undefined, "SLO exists for /api/fairness/check");
  const queueSlo = SLOS.find((s) => s.surface.includes("review-queue") || s.surface.includes("consensus"));
  assert(queueSlo !== undefined, "SLO exists for review-queue or consensus");
}

// ── Test 13: bundle-size budget is realistic ─────────────────────────
{
  const smallest = PERF_BUDGETS.reduce((min, p) => p.bundleKb < min ? p.bundleKb : min, Infinity);
  assert(smallest <= 250, `smallest bundle budget ≤ 250 KB (got ${smallest})`);
}

// ── Test 14: every SLO has a known tier-1 anchor ─────────────────────
// (We're checking the surface string maps to a real endpoint.)
{
  for (const s of SLOS) {
    const startsWithKnown = s.surface.startsWith("POST /api/")
      || s.surface.startsWith("GET /api/")
      || s.surface.includes("tab")
      || s.surface.includes("OLTP")
      || s.surface.includes("OTLP");
    assert(startsWithKnown, `SLO ${s.id} surface is a known category`);
  }
}

// ── Test 15: at least one SLO covers observability ───────────────────
{
  const obsSlo = SLOS.find((s) =>
    s.surface.includes("OTLP") || s.id.includes("ollygarden") || s.id.includes("trace"),
  );
  assert(obsSlo !== undefined, "≥1 SLO covers observability");
}

// ── Test 16: runbook mitigation is actionable ─────────────────────────
{
  for (const r of RUNBOOKS) {
    // Mitigation should mention a specific command, env var, or action.
    const actionable = /\b(set|run|use|restart|reset|rollback)\b/i.test(r.mitigation);
    assert(actionable, `runbook ${r.id} mitigation is actionable`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased SLO tests: ${passed}/${passed + failed} passing`);
console.log(`(SLOs: ${SLOS.length}, perf budgets: ${PERF_BUDGETS.length}, runbooks: ${RUNBOOKS.length})`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All SLO assertions passed.");
  process.exit(0);
}
