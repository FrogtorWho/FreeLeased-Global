#!/usr/bin/env bun
// Federation test suite
// Tests instance registration, pattern sharing, validation, and topology

import { FederationEngine } from "../src/lib/federation";

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

console.log("\n=== Federation Tests ===\n");

// ── Test 1: Instance registration ─────────────────────────────────
console.log("Test 1: Instance registration");
{
  const engine = new FederationEngine();

  engine.registerInstance({
    code: "UK",
    name: "United Kingdom",
    status: "active",
    dataSufficiency: 85,
    lastSync: new Date(),
    patternCount: 20,
    statuteCount: 25,
    sourceCount: 40,
    version: "1.0.0",
  });

  engine.registerInstance({
    code: "BB",
    name: "Barbados",
    status: "active",
    dataSufficiency: 60,
    lastSync: new Date(),
    patternCount: 15,
    statuteCount: 10,
    sourceCount: 15,
    version: "1.0.0",
  });

  const instances = engine.getInstances();
  assert(instances.length === 2, "2 instances registered");
  assert(instances[0].code === "UK", "First instance is UK");
  assert(instances[1].code === "BB", "Second instance is BB");
}

// ── Test 2: Get instance by code ──────────────────────────────────
console.log("\nTest 2: Get instance by code");
{
  const engine = new FederationEngine();

  engine.registerInstance({
    code: "UK",
    name: "United Kingdom",
    status: "active",
    dataSufficiency: 85,
    lastSync: new Date(),
    patternCount: 20,
    statuteCount: 25,
    sourceCount: 40,
    version: "1.0.0",
  });

  const uk = engine.getInstance("UK");
  assert(uk !== null, "UK instance found");
  assert(uk!.name === "United Kingdom", "UK name correct");
  assert(uk!.status === "active", "UK status is active");

  const bb = engine.getInstance("BB");
  assert(bb === null, "BB instance not found");
}

// ── Test 3: Share pattern ─────────────────────────────────────────
console.log("\nTest 3: Share pattern");
{
  const engine = new FederationEngine();

  engine.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Service charge consultation",
      description: "Right to consultation before major works",
      statuteIds: ["s.20"],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK"],
    propagationCount: 0,
  });

  const patterns = engine.getSharedPatterns("UK");
  assert(patterns.length === 1, "1 pattern shared");
  assert(patterns[0].sourceJurisdiction === "UK", "Pattern from UK");
  assert(patterns[0].confidence === 0.9, "Confidence is 0.9");
}

// ── Test 4: Validate pattern ──────────────────────────────────────
console.log("\nTest 4: Validate pattern");
{
  const engine = new FederationEngine();

  engine.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Service charge consultation",
      description: "Right to consultation before major works",
      statuteIds: ["s.20"],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK"],
    propagationCount: 0,
  });

  engine.validatePattern("pattern_1", "BB");

  const patterns = engine.getSharedPatterns("UK");
  assert(patterns[0].validatedBy.length === 2, "Validated by 2 jurisdictions");
  assert(patterns[0].validatedBy.includes("BB"), "BB validated");
  assert(patterns[0].confidence === 1, "Confidence increased to 1");
}

// ── Test 5: Federated updates ─────────────────────────────────────
console.log("\nTest 5: Federated updates");
{
  const engine = new FederationEngine();

  engine.recordUpdate({
    id: "update_1",
    type: "pattern",
    sourceJurisdiction: "UK",
    data: { title: "New pattern" },
    timestamp: new Date(),
    signature: "abc123",
  });

  engine.recordUpdate({
    id: "update_2",
    type: "statute",
    sourceJurisdiction: "BB",
    data: { title: "New statute" },
    timestamp: new Date(),
    signature: "def456",
  });

  const ukUpdates = engine.getUpdatesForJurisdiction("UK");
  const bbUpdates = engine.getUpdatesForJurisdiction("BB");

  assert(ukUpdates.length === 1, "1 UK update");
  assert(bbUpdates.length === 1, "1 BB update");
}

// ── Test 6: Federation statistics ─────────────────────────────────
console.log("\nTest 6: Federation statistics");
{
  const engine = new FederationEngine();

  engine.registerInstance({
    code: "UK",
    name: "United Kingdom",
    status: "active",
    dataSufficiency: 85,
    lastSync: new Date(),
    patternCount: 20,
    statuteCount: 25,
    sourceCount: 40,
    version: "1.0.0",
  });

  engine.registerInstance({
    code: "BB",
    name: "Barbados",
    status: "active",
    dataSufficiency: 60,
    lastSync: new Date(),
    patternCount: 15,
    statuteCount: 10,
    sourceCount: 15,
    version: "1.0.0",
  });

  engine.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Test",
      description: "Test",
      statuteIds: [],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK"],
    propagationCount: 0,
  });

  const stats = engine.getStats();
  assert(stats.totalInstances === 2, "2 instances");
  assert(stats.activeInstances === 2, "2 active");
  assert(stats.totalSharedPatterns === 1, "1 shared pattern");
  assert(stats.averageConfidence === 0.9, "Average confidence is 0.9");
}

// ── Test 7: Network topology ──────────────────────────────────────
console.log("\nTest 7: Network topology");
{
  const engine = new FederationEngine();

  engine.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Test",
      description: "Test",
      statuteIds: [],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK", "BB"],
    propagationCount: 1,
  });

  const topology = engine.getTopology();
  assert(topology.length === 1, "1 connection");
  assert(topology[0].source === "UK", "Source is UK");
  assert(topology[0].target === "BB", "Target is BB");
  assert(topology[0].sharedPatterns === 1, "1 shared pattern");
}

// ── Test 8: Export/import ─────────────────────────────────────────
console.log("\nTest 8: Export/import");
{
  const engine1 = new FederationEngine();

  engine1.registerInstance({
    code: "UK",
    name: "United Kingdom",
    status: "active",
    dataSufficiency: 85,
    lastSync: new Date(),
    patternCount: 20,
    statuteCount: 25,
    sourceCount: 40,
    version: "1.0.0",
  });

  engine1.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Test",
      description: "Test",
      statuteIds: [],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK"],
    propagationCount: 0,
  });

  const data = engine1.exportData();
  assert(data.instances.length === 1, "Export has 1 instance");
  assert(data.sharedPatterns.length === 1, "Export has 1 pattern");

  const engine2 = new FederationEngine();
  engine2.importData(data);
  const stats = engine2.getStats();
  assert(stats.totalInstances === 1, "Import restored 1 instance");
  assert(stats.totalSharedPatterns === 1, "Import restored 1 pattern");
}

// ── Test 9: Cross-jurisdiction patterns ───────────────────────────
console.log("\nTest 9: Cross-jurisdiction patterns");
{
  const engine = new FederationEngine();

  engine.sharePattern({
    id: "pattern_1",
    sourceJurisdiction: "UK",
    pattern: {
      title: "Service charge consultation",
      description: "Right to consultation before major works",
      statuteIds: ["s.20"],
      jurisdictions: ["UK"],
    },
    confidence: 0.9,
    evidenceClass: "established",
    sharedAt: new Date(),
    validatedBy: ["UK", "BB", "JM"],
    propagationCount: 2,
  });

  const stats = engine.getStats();
  assert(stats.crossJurisdictionTransfers === 1, "1 cross-jurisdiction transfer");
}

// ── Test 10: Instance status ──────────────────────────────────────
console.log("\nTest 10: Instance status");
{
  const engine = new FederationEngine();

  engine.registerInstance({
    code: "UK",
    name: "United Kingdom",
    status: "active",
    dataSufficiency: 85,
    lastSync: new Date(),
    patternCount: 20,
    statuteCount: 25,
    sourceCount: 40,
    version: "1.0.0",
  });

  engine.registerInstance({
    code: "BB",
    name: "Barbados",
    status: "standby",
    dataSufficiency: 60,
    lastSync: null,
    patternCount: 15,
    statuteCount: 10,
    sourceCount: 15,
    version: "1.0.0",
  });

  const stats = engine.getStats();
  assert(stats.activeInstances === 1, "1 active instance");
  assert(stats.totalInstances === 2, "2 total instances");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All federation tests passed!\n");
}
