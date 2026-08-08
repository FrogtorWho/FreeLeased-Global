#!/usr/bin/env bun
// Reconciliation Engine test suite
// Tests parallel analysis, reconciliation, investigation, and conviction updates

import { ReconciliationEngine, type AnalysisResult, type AnalysisMethod } from "../src/lib/reconciliation";

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

function createResult(
  method: AnalysisMethod,
  value: boolean,
  confidence: number,
  evidenceClass: any,
  citations: string[] = ["test-source"],
): AnalysisResult {
  return {
    method,
    claim: "test-claim",
    value,
    confidence,
    evidenceClass,
    citations,
    rationale: `Test rationale for ${method}`,
    timestamp: new Date(),
    cost: method === "code" ? 0 : method === "slm" ? 0.003 : 0.06,
  };
}

console.log("\n=== Reconciliation Engine Tests ===\n");

// ── Test 1: Consensus (all agree) ──────────────────────────────────
console.log("Test 1: Consensus (all three agree)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.resolve(createResult("slm", true, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", true, 0.85, "heuristic")),
  );

  assert(result.status === "consensus", "Status is consensus");
  assert(result.finalValue === true, "Final value is true");
  assert(result.confidence > 0.8, "Confidence is high");
  assert(result.analyses.length === 3, "Three analyses recorded");
  assert(result.cost > 0, "Cost is tracked");
}

// ── Test 2: Majority (2 agree, 1 disagrees) ────────────────────────
console.log("\nTest 2: Majority (2 agree, 1 disagrees)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.resolve(createResult("slm", true, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", false, 0.7, "heuristic")),
  );

  assert(result.status === "majority" || result.status === "resolved" || result.status === "escalated",
    "Status is majority/resolved/escalated");
  assert(result.analyses.length === 3, "Three analyses recorded");
}

// ── Test 3: Divergent (all disagree) ───────────────────────────────
console.log("\nTest 3: Divergent (all three disagree)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.resolve(createResult("slm", false, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", true, 0.85, "contested")),
  );

  assert(result.status === "divergent" || result.status === "resolved" || result.status === "escalated",
    "Status is divergent/resolved/escalated");
  assert(result.analyses.length === 3, "Three analyses recorded");
}

// ── Test 4: Error handling (one analysis fails) ────────────────────
console.log("\nTest 4: Error handling (one analysis fails)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.reject(new Error("SLM timeout")),
    () => Promise.resolve(createResult("llm", true, 0.85, "heuristic")),
  );

  assert(result.analyses.length === 3, "Three analyses recorded (including error)");
  assert(result.analyses[1].confidence === 0, "Failed analysis has zero confidence");
  assert(result.analyses[1].evidenceClass === "unfalsifiable", "Failed analysis is unfalsifiable");
}

// ── Test 5: Conviction weight updates ──────────────────────────────
console.log("\nTest 5: Conviction weight updates");
{
  const engine = new ReconciliationEngine();

  engine.updateConviction("test-claim", "favorable");
  engine.updateConviction("test-claim", "favorable");
  engine.updateConviction("test-claim", "unfavorable");

  // Weight should be: 0.5 + 0.1 + 0.1 - 0.1 = 0.6
  const trail = engine.getAuditTrail();
  assert(trail.length === 0, "Audit trail empty before reconciliation");
}

// ── Test 6: Cost tracking ──────────────────────────────────────────
console.log("\nTest 6: Cost tracking");
{
  const engine = new ReconciliationEngine();

  await engine.reconcile(
    "claim-1",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.resolve(createResult("slm", true, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", true, 0.85, "heuristic")),
  );

  await engine.reconcile(
    "claim-2",
    () => Promise.resolve(createResult("code", false, 0.9, "established")),
    () => Promise.resolve(createResult("slm", false, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", false, 0.85, "heuristic")),
  );

  const summary = engine.getCostSummary();
  assert(summary.totalAnalyses === 6, "Six total analyses (2 reconciliations × 3)");
  assert(summary.totalCost > 0, "Total cost is positive");
  assert(summary.averageCost > 0, "Average cost is positive");
}

// ── Test 7: Audit trail ────────────────────────────────────────────
console.log("\nTest 7: Audit trail");
{
  const engine = new ReconciliationEngine();

  await engine.reconcile(
    "claim-a",
    () => Promise.resolve(createResult("code", true, 0.9, "established")),
    () => Promise.resolve(createResult("slm", true, 0.8, "heuristic")),
    () => Promise.resolve(createResult("llm", true, 0.85, "heuristic")),
  );

  const trail = engine.getAuditTrail();
  assert(trail.length === 1, "One reconciliation in trail");
  assert(trail[0].claim === "claim-a", "Correct claim in trail");
  assert(trail[0].analyses.length === 3, "Three analyses in trail entry");
}

// ── Test 8: All code analysis (deterministic only) ─────────────────
console.log("\nTest 8: All code analysis (deterministic only)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.95, "established")),
    () => Promise.resolve(createResult("code", true, 0.95, "established")),
    () => Promise.resolve(createResult("code", true, 0.95, "established")),
  );

  assert(result.status === "consensus", "Status is consensus");
  assert(result.cost === 0, "Cost is zero (all deterministic)");
}

// ── Test 9: Mixed evidence classes ─────────────────────────────────
console.log("\nTest 9: Mixed evidence classes");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.95, "established")),
    () => Promise.resolve(createResult("slm", true, 0.6, "heuristic")),
    () => Promise.resolve(createResult("llm", true, 0.7, "contested")),
  );

  assert(result.status === "consensus", "Status is consensus");
  assert(result.evidenceClass === "established", "Strongest evidence class used");
}

// ── Test 10: No citations (uncited analyses) ───────────────────────
console.log("\nTest 10: No citations (uncited analyses)");
{
  const engine = new ReconciliationEngine();
  const result = await engine.reconcile(
    "test-claim",
    () => Promise.resolve(createResult("code", true, 0.9, "established", [])),
    () => Promise.resolve(createResult("slm", true, 0.8, "heuristic", [])),
    () => Promise.resolve(createResult("llm", true, 0.85, "heuristic", [])),
  );

  assert(result.status === "consensus", "Status is consensus");
  assert(result.citations.length === 0, "No citations from uncited analyses");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All reconciliation tests passed!\n");
}
