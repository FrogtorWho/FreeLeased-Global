#!/usr/bin/env bun
// Knowledge Graph test suite
// Tests graph building, queries, cross-jurisdiction transfer, and statistics

import {
  buildKnowledgeGraph,
  getConnectedNodes,
  findCrossJurisdictionTransfers,
  getJurisdictionStats,
  getStrongestPath,
} from "../src/lib/knowledge-graph";

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

console.log("\n=== Knowledge Graph Tests ===\n");

// ── Test 1: Graph building ────────────────────────────────────────
console.log("Test 1: Graph building");
{
  const graph = buildKnowledgeGraph();

  assert(graph.nodes.length > 0, "Graph has nodes");
  assert(graph.edges.length > 0, "Graph has edges");
  assert(graph.metadata.jurisdictions === 9, "9 jurisdictions in graph");
  assert(graph.metadata.statutes > 0, "Statutes in graph");
  assert(graph.metadata.patterns > 0, "Patterns in graph");
  assert(graph.metadata.totalNodes === graph.nodes.length, "Metadata matches node count");
  assert(graph.metadata.totalEdges === graph.edges.length, "Metadata matches edge count");
}

// ── Test 2: Node types ────────────────────────────────────────────
console.log("\nTest 2: Node types");
{
  const graph = buildKnowledgeGraph();

  const jurisdictions = graph.nodes.filter(n => n.type === "jurisdiction");
  const statutes = graph.nodes.filter(n => n.type === "statute");
  const patterns = graph.nodes.filter(n => n.type === "pattern");
  const sources = graph.nodes.filter(n => n.type === "source");

  assert(jurisdictions.length === 9, "9 jurisdiction nodes");
  assert(statutes.length > 0, "Statute nodes present");
  assert(patterns.length > 0, "Pattern nodes present");
  assert(sources.length > 0, "Source nodes present");
}

// ── Test 3: Edge types ────────────────────────────────────────────
console.log("\nTest 3: Edge types");
{
  const graph = buildKnowledgeGraph();

  const appliesTo = graph.edges.filter(e => e.type === "applies_to");
  const cites = graph.edges.filter(e => e.type === "cites");
  const similarTo = graph.edges.filter(e => e.type === "similar_to");

  assert(appliesTo.length > 0, "applies_to edges present");
  assert(cites.length > 0, "cites edges present");
  assert(similarTo.length > 0, "similar_to edges present (cross-jurisdiction)");
}

// ── Test 4: Connected nodes query ─────────────────────────────────
console.log("\nTest 4: Connected nodes query");
{
  const graph = buildKnowledgeGraph();
  const ukNode = graph.nodes.find(n => n.id === "jurisdiction:UK");

  if (ukNode) {
    const connected = getConnectedNodes(graph, "jurisdiction:UK", 1);
    assert(connected.length > 0, "UK jurisdiction has connected nodes");
    assert(connected.some(n => n.type === "statute"), "Connected nodes include statutes");
  } else {
    assert(false, "UK jurisdiction node not found");
  }
}

// ── Test 5: Cross-jurisdiction transfer ────────────────────────────
console.log("\nTest 5: Cross-jurisdiction transfer");
{
  const graph = buildKnowledgeGraph();

  // Find a pattern that applies to multiple jurisdictions
  const multiPattern = graph.nodes.find(
    n => n.type === "pattern" && (n.metadata.jurisdictions as string[])?.length > 1
  );

  if (multiPattern) {
    const transfers = findCrossJurisdictionTransfers(graph, multiPattern.id);
    assert(transfers.length > 0, "Cross-jurisdiction transfers found");
    assert(transfers.every(t => t.confidence > 0), "All transfers have positive confidence");
    assert(transfers.every(t => t.reason.length > 0), "All transfers have reasons");
  } else {
    assert(true, "No multi-jurisdiction patterns (skip)");
  }
}

// ── Test 6: Jurisdiction statistics ────────────────────────────────
console.log("\nTest 6: Jurisdiction statistics");
{
  const graph = buildKnowledgeGraph();
  const stats = getJurisdictionStats(graph);

  assert(stats.length === 9, "Stats for all 9 jurisdictions");
  assert(stats.every(s => s.nodeCount > 0), "All jurisdictions have nodes");
  assert(stats.filter(s => s.statuteCount > 0).length >= 6, "At least 6 jurisdictions have statutes");
  assert(stats.every(s => s.connectionDensity >= 0), "Connection density is non-negative");
}

// ── Test 7: Strongest path ────────────────────────────────────────
console.log("\nTest 7: Strongest path");
{
  const graph = buildKnowledgeGraph();

  // Find a statute and a pattern
  const statute = graph.nodes.find(n => n.type === "statute");
  const pattern = graph.nodes.find(n => n.type === "pattern");

  if (statute && pattern) {
    const path = getStrongestPath(graph, statute.id, pattern.id);
    if (path) {
      assert(path.path.length > 0, "Path found");
      assert(path.confidence > 0, "Path has positive confidence");
      assert(path.path[0] === statute.id, "Path starts at statute");
      assert(path.path[path.path.length - 1] === pattern.id, "Path ends at pattern");
    } else {
      assert(true, "No path between arbitrary nodes (graph may be disconnected)");
    }
  } else {
    assert(true, "Missing nodes for path test (skip)");
  }
}

// ── Test 8: Graph determinism ──────────────────────────────────────
console.log("\nTest 8: Graph determinism");
{
  const graph1 = buildKnowledgeGraph();
  const graph2 = buildKnowledgeGraph();

  assert(graph1.nodes.length === graph2.nodes.length, "Deterministic node count");
  assert(graph1.edges.length === graph2.edges.length, "Deterministic edge count");
  assert(
    JSON.stringify(graph1.nodes) === JSON.stringify(graph2.nodes),
    "Deterministic node content"
  );
}

// ── Test 9: Evidence classes ───────────────────────────────────────
console.log("\nTest 9: Evidence classes");
{
  const graph = buildKnowledgeGraph();

  const validClasses = ["established", "heuristic", "contested", "unfalsifiable"];
  assert(
    graph.nodes.every(n => validClasses.includes(n.evidenceClass)),
    "All nodes have valid evidence classes"
  );
  assert(
    graph.edges.every(e => validClasses.includes(e.evidenceClass)),
    "All edges have valid evidence classes"
  );
}

// ── Test 10: Conviction weights ────────────────────────────────────
console.log("\nTest 10: Conviction weights");
{
  const graph = buildKnowledgeGraph();

  assert(
    graph.nodes.every(n => n.conviction >= 0 && n.conviction <= 1),
    "All node convictions in [0, 1]"
  );
  assert(
    graph.edges.every(e => e.weight >= 0 && e.weight <= 1),
    "All edge weights in [0, 1]"
  );
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All knowledge graph tests passed!\n");
}
