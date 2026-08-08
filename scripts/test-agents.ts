#!/usr/bin/env bun
// Agent System test suite
// Tests agent definitions, task creation, execution, and cost tracking

import { AgentOrchestrator, AGENTS, type AgentRole } from "../src/lib/agents";

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

console.log("\n=== Agent System Tests ===\n");

// ── Test 1: Agent definitions ─────────────────────────────────────
console.log("Test 1: Agent definitions");
{
  const roles: AgentRole[] = ["planner", "researcher", "analyzer", "drafter", "critic", "auditor"];

  assert(roles.length === 6, "6 agent roles defined");
  assert(roles.every(r => AGENTS[r] !== undefined), "All roles have definitions");
  assert(roles.every(r => AGENTS[r].role === r), "Roles match keys");
  assert(roles.every(r => AGENTS[r].model.length > 0), "All agents have models");
  assert(roles.every(r => AGENTS[r].costPerQuery >= 0), "All agents have non-negative cost");
  assert(roles.every(r => AGENTS[r].tools.length > 0), "All agents have tools");
  assert(roles.every(r => AGENTS[r].constraints.length > 0), "All agents have constraints");
}

// ── Test 2: Auditor is deterministic ──────────────────────────────
console.log("\nTest 2: Auditor is deterministic");
{
  const auditor = AGENTS.auditor;
  assert(auditor.model === "deterministic", "Auditor uses deterministic model");
  assert(auditor.costPerQuery === 0, "Auditor has zero cost");
}

// ── Test 3: Cost hierarchy ────────────────────────────────────────
console.log("\nTest 3: Cost hierarchy");
{
  const costs = Object.values(AGENTS).map(a => a.costPerQuery);
  const sorted = [...costs].sort((a, b) => a - b);
  assert(
    costs.every(c => c >= 0),
    "All costs are non-negative"
  );
  assert(
    AGENTS.auditor.costPerQuery === 0,
    "Auditor has zero cost"
  );
  assert(
    AGENTS.planner.costPerQuery < AGENTS.analyzer.costPerQuery,
    "Planner cheaper than analyzer"
  );
}

// ── Test 4: Task creation ─────────────────────────────────────────
console.log("\nTest 4: Task creation");
{
  const orchestrator = new AgentOrchestrator();
  const task = await orchestrator.createTask(
    "Test task",
    "Analyze lease for UK jurisdiction",
    ["planner"],
  );

  assert(task.id.startsWith("task_"), "Task ID has correct prefix");
  assert(task.title === "Test task", "Task title correct");
  assert(task.status === "pending", "Task starts as pending");
  assert(task.assignedTo.includes("planner"), "Task assigned to planner");
  assert(task.cost === 0, "Task starts with zero cost");
  assert(task.messages.length > 0, "Task has initial message");
}

// ── Test 5: Task execution ────────────────────────────────────────
console.log("\nTest 5: Task execution");
{
  const orchestrator = new AgentOrchestrator();
  const task = await orchestrator.createTask(
    "Analyze lease",
    "UK lease analysis with s.20 consultation check",
    ["planner"],
  );

  const completed = await orchestrator.executeTask(task.id);

  assert(completed.status === "completed", "Task completed");
  assert(completed.result !== undefined, "Task has result");
  assert(completed.cost > 0, "Task has positive cost");
  assert(completed.completedAt !== undefined, "Task has completion time");
  assert(completed.messages.length >= 6, "At least 6 messages (one per agent)");
}

// ── Test 6: Cost tracking ─────────────────────────────────────────
console.log("\nTest 6: Cost tracking");
{
  const orchestrator = new AgentOrchestrator();

  const t1 = await orchestrator.createTask("Task 1", "Description 1", ["planner"]);
  await orchestrator.executeTask(t1.id);

  const t2 = await orchestrator.createTask("Task 2", "Description 2", ["planner"]);
  await orchestrator.executeTask(t2.id);

  const summary = orchestrator.getCostSummary();
  assert(summary.totalCost > 0, "Total cost is positive");
  assert(summary.tasksCompleted === 2, "Two tasks completed");
  assert(summary.averageCostPerTask > 0, "Average cost is positive");
}

// ── Test 7: Message log ───────────────────────────────────────────
console.log("\nTest 7: Message log");
{
  const orchestrator = new AgentOrchestrator();
  const t = await orchestrator.createTask("Task", "Description", ["planner"]);
  await orchestrator.executeTask(t.id);

  const log = orchestrator.getMessageLog();
  assert(log.length >= 6, "At least 6 messages logged");
  assert(log.every(m => m.id.length > 0), "All messages have IDs");
  assert(log.every(m => m.timestamp instanceof Date), "All messages have timestamps");
}

// ── Test 8: Task not found error ──────────────────────────────────
console.log("\nTest 8: Task not found error");
{
  const orchestrator = new AgentOrchestrator();
  let errorThrown = false;

  try {
    await orchestrator.executeTask("nonexistent");
  } catch {
    errorThrown = true;
  }

  assert(errorThrown, "Error thrown for nonexistent task");
}

// ── Test 9: Message content ───────────────────────────────────────
console.log("\nTest 9: Message content");
{
  const orchestrator = new AgentOrchestrator();
  const t = await orchestrator.createTask("Task", "Description", ["planner"]);
  const task = await orchestrator.executeTask(t.id);

  const messages = task.messages;
  assert(messages.every(m => m.from.length > 0), "All messages have 'from'");
  assert(messages.every(m => m.to.length > 0), "All messages have 'to'");
  assert(messages.every(m => m.taskId === task.id), "All messages reference correct task");
}

// ── Test 10: Deterministic audit ──────────────────────────────────
console.log("\nTest 10: Deterministic audit");
{
  const orchestrator = new AgentOrchestrator();
  const t = await orchestrator.createTask("Task", "Description", ["planner"]);
  const task = await orchestrator.executeTask(t.id);

  const auditMsg = task.messages.find(m => m.from === "auditor");
  assert(auditMsg !== undefined, "Auditor message exists");
  assert(auditMsg!.confidence === 1, "Auditor confidence is 1");
  assert(auditMsg!.evidenceClass === "established", "Auditor evidence class is established");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All agent system tests passed!\n");
}
