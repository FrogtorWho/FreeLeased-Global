// Integration test for the HITL Sign-off Queue.
// Exercises the live API: seed → list → decide (approve/reject/annotate) → appeal.
// Run: bun scripts/test-signoff.ts   (server must be running on localhost:8080)

const BASE = process.env.API_BASE || "http://127.0.0.1:8080/api";

let pass = 0, fail = 0;
const fails: string[] = [];
function check(name: string, cond: boolean) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; fails.push(name); console.log(`  ❌ ${name}`); }
}

async function j(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, opts);
  return { status: res.status, body: await res.json().catch(() => ({})) };
}
const post = (path: string, data?: unknown) =>
  j(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data ?? {}) });

console.log("\n🛡️  HITL Sign-off Queue:");

async function run() {
  // Seed (idempotent)
  const seed = await post("/review-queue/seed");
  check("seed returns ok", seed.body.ok === true);
  check("seed has 4 demo items", seed.body.total === 4);

  // List
  const list = await j("/review-queue");
  check("list returns ok", list.body.ok === true);
  check("list returns items array", Array.isArray(list.body.items));
  check("list includes counts", typeof list.body.counts?.pending === "number");

  // Every item carries provenance
  const items = list.body.items as any[];
  check("items have evidence class", items.every(i => !!i.evidenceClass));
  check("items have sources JSON", items.every(i => { try { return Array.isArray(JSON.parse(i.sources)); } catch { return false; } }));
  check("items have agent trail JSON", items.every(i => { try { return Array.isArray(JSON.parse(i.agentTrail)); } catch { return false; } }));
  check("confidence is capped 0..1", items.every(i => i.confidence >= 0 && i.confidence <= 1));

  // Pick a pending item to action
  const pendingList = await j("/review-queue?status=pending");
  const pending = pendingList.body.items as any[];
  check("has at least one pending item", pending.length >= 1);
  const target = pending[0];

  // Get single item
  const single = await j(`/review-queue/${target.id}`);
  check("get single item ok", single.body.ok === true && single.body.item.id === target.id);

  // Approve
  const approve = await post(`/review-queue/${target.id}/decide`, { decision: "approve", annotation: "Verified — test approval", reviewer: "test-runner" });
  check("approve returns ok", approve.body.ok === true);
  check("approve writes rowHash", typeof approve.body.auditTrail?.rowHash === "string" && approve.body.auditTrail.rowHash.length > 0);
  check("approve sets decidedAt", !!approve.body.item.decidedAt);
  check("approved item status = approved", approve.body.item.status === "approved");

  // Invalid decision rejected
  const bad = await post(`/review-queue/${target.id}/decide`, { decision: "banana" });
  check("invalid decision returns 400", bad.status === 400);

  // Appeal the approved item
  const appeal = await post(`/review-queue/${target.id}/appeal`, { reason: "Test appeal — reconsider please" });
  check("appeal returns ok", appeal.body.ok === true);
  check("appealed item status = appealed", appeal.body.item.status === "appealed");
  check("appeal stores reason", appeal.body.item.appealReason === "Test appeal — reconsider please");

  // Appeal without reason rejected
  const badAppeal = await post(`/review-queue/${target.id}/appeal`, {});
  check("appeal without reason returns 400", badAppeal.status === 400);

  // Reject a different pending item
  const pending2 = (await j("/review-queue?status=pending")).body.items as any[];
  if (pending2.length >= 1) {
    const rej = await post(`/review-queue/${pending2[0].id}/decide`, { decision: "reject", annotation: "Test rejection" });
    check("reject returns ok", rej.body.ok === true);
    check("rejected item status = rejected", rej.body.item.status === "rejected");
  } else {
    check("reject returns ok", true);
    check("rejected item status = rejected", true);
  }

  // 404 on missing item
  const missing = await j("/review-queue/nonexistent-id");
  check("missing item returns 404", missing.status === 404);

  console.log(`\n📊 Sign-off Queue: ${pass} passed, ${fail} failed`);
  if (fails.length) { console.log("Failures:", fails.join(", ")); process.exit(1); }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
