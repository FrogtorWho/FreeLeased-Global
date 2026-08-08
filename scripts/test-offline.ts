#!/usr/bin/env bun
// Offline-First Architecture test suite
// Tests queue management, data store, and conflict resolution

import { OfflineQueue, LocalDataStore, resolveConflict } from "../src/lib/offline";

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

console.log("\n=== Offline-First Architecture Tests ===\n");

// ── Test 1: Queue creation ────────────────────────────────────────
console.log("Test 1: Queue creation");
{
  const queue = new OfflineQueue();
  const status = queue.getStatus();

  assert(status.pending === 0, "Queue starts empty");
  assert(status.total === 0, "Total is 0");
}

// ── Test 2: Enqueue operations ────────────────────────────────────
console.log("\nTest 2: Enqueue operations");
{
  const queue = new OfflineQueue();

  const item1 = queue.enqueue("create", "/api/data", "POST", { name: "test1" });
  const item2 = queue.enqueue("update", "/api/data/1", "PATCH", { name: "test2" });

  assert(item1.id.startsWith("q_"), "Item 1 has correct ID prefix");
  assert(item1.status === "pending", "Item 1 is pending");
  assert(item2.status === "pending", "Item 2 is pending");

  const status = queue.getStatus();
  assert(status.pending === 2, "Two pending items");
  assert(status.total === 2, "Total is 2");
}

// ── Test 3: Queue status ──────────────────────────────────────────
console.log("\nTest 3: Queue status");
{
  const queue = new OfflineQueue();

  queue.enqueue("create", "/api/data", "POST", { name: "test1" });
  queue.enqueue("update", "/api/data/1", "PATCH", { name: "test2" });
  queue.enqueue("delete", "/api/data/2", "DELETE", {});

  const status = queue.getStatus();
  assert(status.pending === 3, "Three pending items");
  assert(status.processing === 0, "Zero processing");
  assert(status.failed === 0, "Zero failed");
  assert(status.total === 3, "Total is 3");
}

// ── Test 4: Local data store ──────────────────────────────────────
console.log("\nTest 4: Local data store");
{
  const store = new LocalDataStore();

  store.set("item1", "statute", { title: "Test Statute", jurisdiction: "UK" });
  store.set("item2", "pattern", { title: "Test Pattern", jurisdictions: ["UK", "BB"] });

  const item1 = store.get("item1");
  assert(item1 !== null, "Item 1 exists");
  assert(item1!.type === "statute", "Item 1 type correct");
  assert(item1!.data.title === "Test Statute", "Item 1 data correct");
  assert(item1!.version === 1, "Item 1 version is 1");
  assert(item1!.synced === false, "Item 1 not synced");
}

// ── Test 5: Data versioning ───────────────────────────────────────
console.log("\nTest 5: Data versioning");
{
  const store = new LocalDataStore();

  store.set("item1", "statute", { title: "V1" });
  const v1 = store.get("item1");
  assert(v1!.version === 1, "Version starts at 1");

  store.set("item1", "statute", { title: "V2" });
  const v2 = store.get("item1");
  assert(v2!.version === 2, "Version increments to 2");
}

// ── Test 6: Get by type ───────────────────────────────────────────
console.log("\nTest 6: Get by type");
{
  const store = new LocalDataStore();

  store.set("s1", "statute", { title: "Statute 1" });
  store.set("s2", "statute", { title: "Statute 2" });
  store.set("p1", "pattern", { title: "Pattern 1" });

  const statutes = store.getByType("statute");
  const patterns = store.getByType("pattern");

  assert(statutes.length === 2, "2 statutes");
  assert(patterns.length === 1, "1 pattern");
}

// ── Test 7: Unsynced data ─────────────────────────────────────────
console.log("\nTest 7: Unsynced data");
{
  const store = new LocalDataStore();

  store.set("item1", "statute", { title: "Test" });
  store.set("item2", "pattern", { title: "Test" });

  const unsynced = store.getUnsynced();
  assert(unsynced.length === 2, "2 unsynced items");

  store.markSynced("item1");
  const unsyncedAfter = store.getUnsynced();
  assert(unsyncedAfter.length === 1, "1 unsynced after marking");
}

// ── Test 8: Storage stats ─────────────────────────────────────────
console.log("\nTest 8: Storage stats");
{
  const store = new LocalDataStore();

  store.set("s1", "statute", { title: "Test" });
  store.set("s2", "statute", { title: "Test" });
  store.set("p1", "pattern", { title: "Test" });

  const stats = store.getStats();
  assert(stats.totalItems === 3, "3 total items");
  assert(stats.unsyncedItems === 3, "3 unsynced");
  assert(stats.byType.statute === 2, "2 statutes");
  assert(stats.byType.pattern === 1, "1 pattern");
}

// ── Test 9: Conflict resolution ───────────────────────────────────
console.log("\nTest 9: Conflict resolution");
{
  const local = {
    id: "item1",
    type: "statute",
    data: { title: "Local Version", version: 1 },
    version: 1,
    lastModified: new Date(),
    synced: false,
  };

  const remote = { title: "Remote Version", version: 2 };

  // Remote wins (default)
  const remoteWins = resolveConflict(local, remote, "remote");
  assert(remoteWins.title === "Remote Version", "Remote wins by default");

  // Local wins
  const localWins = resolveConflict(local, remote, "local");
  assert(localWins.title === "Local Version", "Local wins when specified");

  // Merge
  const merged = resolveConflict(local, remote, "merge");
  assert(merged.title === "Remote Version", "Merge: remote wins for conflicting fields");
}

// ── Test 10: Queue retry logic ────────────────────────────────────
console.log("\nTest 10: Queue retry logic");
{
  const queue = new OfflineQueue();
  const item = queue.enqueue("create", "/api/data", "POST", { name: "test" });

  assert(item.retries === 0, "Starts with 0 retries");
  assert(item.maxRetries === 3, "Max retries is 3");
  assert(item.status === "pending", "Starts as pending");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All offline-first architecture tests passed!\n");
}
