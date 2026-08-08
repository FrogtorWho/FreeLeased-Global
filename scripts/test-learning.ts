#!/usr/bin/env bun
// Learning Loop test suite
// Tests outcome tracking, conviction updates, and self-improvement

import { LearningEngine } from "../src/lib/learning";

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

console.log("\n=== Learning Loop Tests ===\n");

// ── Test 1: Record recommendation ─────────────────────────────────
console.log("Test 1: Record recommendation");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Service charge consultation required",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  assert(rec.id.startsWith("rec_"), "Recommendation has correct ID prefix");
  assert(rec.patternId === "pattern:1", "Pattern ID correct");
  assert(rec.jurisdiction === "UK", "Jurisdiction correct");
  assert(rec.confidence === 0.9, "Confidence correct");
  assert(rec.madeBy === "code", "Made by correct");
  assert(rec.madeAt instanceof Date, "Made at is Date");
}

// ── Test 2: Record outcome ────────────────────────────────────────
console.log("\nTest 2: Record outcome");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Service charge consultation required",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  const outcome = engine.recordOutcome(rec.id, "favorable", "Tribunal confirmed", "tribunal_result");

  assert(outcome !== null, "Outcome recorded");
  assert(outcome!.outcome === "favorable", "Outcome is favorable");
  assert(outcome!.source === "tribunal_result", "Source correct");
  assert(outcome!.evidence === "Tribunal confirmed", "Evidence correct");
}

// ── Test 3: Conviction weight update ──────────────────────────────
console.log("\nTest 3: Conviction weight update");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Test claim",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  // Record favorable outcome
  engine.recordOutcome(rec.id, "favorable", "Good result", "user_feedback");
  const conviction1 = engine.getConviction("pattern:1", "UK");
  assert(conviction1 !== null, "Conviction exists after favorable");
  assert(conviction1!.weight > 0.5, "Weight increased after favorable");

  // Record unfavorable outcome
  engine.recordOutcome(rec.id, "unfavorable", "Bad result", "user_feedback");
  const conviction2 = engine.getConviction("pattern:1", "UK");
  assert(conviction2!.weight < 0.5, "Weight decreased below 0.5 after unfavorable");
}

// ── Test 4: Multiple outcomes ──────────────────────────────────────
console.log("\nTest 4: Multiple outcomes");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Test claim",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  // Record 3 favorable, 1 unfavorable
  engine.recordOutcome(rec.id, "favorable", "Result 1", "user_feedback");
  engine.recordOutcome(rec.id, "favorable", "Result 2", "user_feedback");
  engine.recordOutcome(rec.id, "favorable", "Result 3", "user_feedback");
  engine.recordOutcome(rec.id, "unfavorable", "Result 4", "user_feedback");

  const conviction = engine.getConviction("pattern:1", "UK");
  assert(conviction!.outcomes === 4, "4 outcomes recorded");
  assert(conviction!.positive === 3, "3 positive outcomes");
  assert(conviction!.negative === 1, "1 negative outcome");
  assert(conviction!.weight > 0.5, "Weight still > 0.5 (majority positive)");
}

// ── Test 5: Learning statistics ────────────────────────────────────
console.log("\nTest 5: Learning statistics");
{
  const engine = new LearningEngine();

  const rec1 = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Claim 1",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  const rec2 = engine.recordRecommendation({
    patternId: "pattern:2",
    jurisdiction: "BB",
    claim: "Claim 2",
    confidence: 0.7,
    evidenceClass: "heuristic",
    madeBy: "slm",
  });

  engine.recordOutcome(rec1.id, "favorable", "Good", "user_feedback");
  engine.recordOutcome(rec2.id, "unfavorable", "Bad", "tribunal_result");

  const stats = engine.getStats();
  assert(stats.totalRecommendations === 2, "2 recommendations");
  assert(stats.totalOutcomes === 2, "2 outcomes");
  assert(stats.outcomeBreakdown.favorable === 1, "1 favorable");
  assert(stats.outcomeBreakdown.unfavorable === 1, "1 unfavorable");
  assert(stats.convictionsUpdated === 2, "2 convictions updated");
}

// ── Test 6: Strongest/weakest patterns ────────────────────────────
console.log("\nTest 6: Strongest/weakest patterns");
{
  const engine = new LearningEngine();

  // Create patterns with different outcomes
  const rec1 = engine.recordRecommendation({
    patternId: "strong",
    jurisdiction: "UK",
    claim: "Strong pattern",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  const rec2 = engine.recordRecommendation({
    patternId: "weak",
    jurisdiction: "UK",
    claim: "Weak pattern",
    confidence: 0.5,
    evidenceClass: "contested",
    madeBy: "slm",
  });

  // Strong pattern: all favorable
  for (let i = 0; i < 5; i++) {
    engine.recordOutcome(rec1.id, "favorable", `Good ${i}`, "user_feedback");
  }

  // Weak pattern: all unfavorable
  for (let i = 0; i < 5; i++) {
    engine.recordOutcome(rec2.id, "unfavorable", `Bad ${i}`, "user_feedback");
  }

  const stats = engine.getStats();
  assert(stats.strongestPatterns.length > 0, "Strongest patterns exist");
  assert(stats.weakestPatterns.length > 0, "Weakest patterns exist");
  assert(stats.strongestPatterns[0].patternId === "strong", "Strongest is 'strong'");
  assert(stats.weakestPatterns[stats.weakestPatterns.length - 1].patternId === "weak", "Weakest is 'weak'");
}

// ── Test 7: Improvement trajectory ────────────────────────────────
console.log("\nTest 7: Improvement trajectory");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Test",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  engine.recordOutcome(rec.id, "favorable", "Good", "user_feedback");
  engine.recordOutcome(rec.id, "favorable", "Good", "user_feedback");
  engine.recordOutcome(rec.id, "unfavorable", "Bad", "user_feedback");

  const trajectory = engine.getImprovementTrajectory();
  assert(trajectory.length > 0, "Trajectory has data points");
  assert(trajectory[0].outcomesRecorded > 0, "First point has outcomes");
}

// ── Test 8: Export/import ─────────────────────────────────────────
console.log("\nTest 8: Export/import");
{
  const engine1 = new LearningEngine();
  const rec = engine1.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Test",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });
  engine1.recordOutcome(rec.id, "favorable", "Good", "user_feedback");

  const data = engine1.exportData();
  assert(data.outcomes.length === 1, "Export has 1 outcome");
  assert(data.convictions.length === 1, "Export has 1 conviction");
  assert(data.recommendations.length === 1, "Export has 1 recommendation");

  const engine2 = new LearningEngine();
  engine2.importData(data);
  const stats = engine2.getStats();
  assert(stats.totalOutcomes === 1, "Import restored 1 outcome");
  assert(stats.convictionsUpdated === 1, "Import restored 1 conviction");
}

// ── Test 9: Unknown recommendation outcome ────────────────────────
console.log("\nTest 9: Unknown recommendation outcome");
{
  const engine = new LearningEngine();
  const outcome = engine.recordOutcome("nonexistent", "favorable", "Test", "user_feedback");
  assert(outcome === null, "Returns null for unknown recommendation");
}

// ── Test 10: Conviction weight bounds ──────────────────────────────
console.log("\nTest 10: Conviction weight bounds");
{
  const engine = new LearningEngine();
  const rec = engine.recordRecommendation({
    patternId: "pattern:1",
    jurisdiction: "UK",
    claim: "Test",
    confidence: 0.9,
    evidenceClass: "established",
    madeBy: "code",
  });

  // Record many favorable outcomes
  for (let i = 0; i < 20; i++) {
    engine.recordOutcome(rec.id, "favorable", `Good ${i}`, "user_feedback");
  }

  const conviction = engine.getConviction("pattern:1", "UK");
  assert(conviction!.weight <= 1, "Weight capped at 1");
  assert(conviction!.weight >= 0, "Weight floored at 0");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All learning loop tests passed!\n");
}
