// Sign-off Queue component + API tests — Batch 3.
//
// Two layers:
//   1. Component shape (static): verifies SignoffQueue.tsx exports the React
//      component, includes urgency-sort logic, filter chips, the empty-state
//      copy, ARIA labels, and the inline verdict preview.
//   2. API behaviour (live): seeds the queue, sorts, filters, and exercises
//      the one-click actions (Sign off | Override | Request more evidence).
//
// Run: bun scripts/test-signoff-queue.ts
// (live API tests skip with WARN when the server is not running on :8080)
//
// 25+ assertions across both layers.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const COMPONENT = join(ROOT, "src/components/auri/SignoffQueue.tsx");
const API_BASE = process.env.API_BASE || "http://127.0.0.1:8080/api";

let pass = 0, fail = 0;
const fails: string[] = [];
function check(name: string, cond: boolean) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; fails.push(name); console.log(`  ❌ ${name}`); }
}

async function j(path: string, opts?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    return { status: res.status, body: await res.json().catch(() => ({})), offline: false };
  } catch {
    return { status: 0, body: {}, offline: true };
  }
}
const post = (path: string, data?: unknown) =>
  j(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data ?? {}) });

console.log("\n🛡️  Sign-off Queue (Batch 3) — component + API");

async function run() {
  // ── Layer 1: component shape (static) ────────────────────────────────────
  check("component file exists", existsSync(COMPONENT));

  let src = "";
  try {
    src = readFileSync(COMPONENT, "utf8");
  } catch (e) {
    check("component file readable", false);
  }
  if (src) check("component file readable", true);

  check("exports SignoffQueue React component", /export\s+function\s+SignoffQueue\b/.test(src));
  check("uses React hooks (useState/useEffect/useMemo)", /useMemo\b/.test(src) && /useState\b/.test(src));
  check("includes urgencyScore() helper", /function\s+urgencyScore\b/.test(src));
  check("urgency scores red-flagged items higher", /confidence\s*<\s*0\.5[\s\S]{0,200}score\s*\+=/.test(src));
  check("sorts by urgency descending", /\.sort\(\(a,\s*b\)\s*=>\s*urgencyScore\(b\)\s*-\s*urgencyScore\(a\)\)/.test(src));
  check("renders 4-Agent DS Gauge inline", /4-Agent DS Gauge/.test(src));
  check("renders Cited Statutes + Conviction inline", /Cited Statutes\s*\+\s*Conviction/.test(src));
  check("shows conviction classes (established/heuristic/contested/unfalsifiable)",
    /established/.test(src) && /heuristic/.test(src) && /contested/.test(src) && /unfalsifiable/.test(src));
  check("filter chips group exists", /Filter chips/.test(src));
  check("jurisdiction filter chip exists", /Filter by jurisdiction:/.test(src));
  check("verdict type filter chip exists", /Filter by verdict type:/.test(src));
  check("owner filter chip exists (Sam's queue vs auto-resolved)", /Sam's queue/.test(src) && /Auto-resolved/.test(src));
  check("empty-state copy present", /All caught up[\s\S]+overnight gauntlet drained the queue at 03:30 UTC/.test(src));
  check("uses aria-label", /aria-label=/.test(src));
  check("uses aria-expanded", /aria-expanded=/.test(src));
  check("Sign off button present", /Sign off/.test(src));
  check("Override button present", /Override/.test(src));
  check("Request more evidence button present", /Request more evidence/.test(src));
  check("red-flag badge surfaces red items", /data-urgency=/.test(src) && /aria-label="Red-flagged, urgent"/.test(src));

  // ── Layer 2: API behaviour (live, skips when offline) ────────────────────
  const seedProbe = await post("/review-queue/seed");
  if (seedProbe.offline) {
    console.log("  ⚠️  API offline — skipping live API assertions");
    check("API offline — skipping live tests", true);
  } else {
    check("seed returns ok", seedProbe.body?.ok === true);
    check("seed populates demo queue", typeof seedProbe.body?.total === "number");

    const list = await j("/review-queue");
    check("list returns items", Array.isArray(list.body?.items));
    check("list returns counts", typeof list.body?.counts?.pending === "number");

    const pending = ((await j("/review-queue?status=pending")).body?.items ?? []) as any[];
    check("has pending items to exercise actions on", Array.isArray(pending) && pending.length >= 1);

    // Approve (Sign off)
    if (pending.length >= 1) {
      const approve = await post(`/review-queue/${pending[0].id}/decide`,
        { decision: "approve", annotation: "Batch 3 sign-off test", reviewer: "test-runner" });
      check("Sign off → approve returns ok", approve.body?.ok === true);
      check("Sign off sets status=approved", approve.body?.item?.status === "approved");
    }

    // Reject (Override)
    const pending2 = ((await j("/review-queue?status=pending")).body?.items ?? []) as any[];
    if (pending2.length >= 1) {
      const reject = await post(`/review-queue/${pending2[0].id}/decide`,
        { decision: "reject", annotation: "Batch 3 override test" });
      check("Override → reject returns ok", reject.body?.ok === true);
      check("Override sets status=rejected", reject.body?.item?.status === "rejected");
    }

    // Annotate (Request more evidence) — keeps status pending
    const pending3 = ((await j("/review-queue?status=pending")).body?.items ?? []) as any[];
    if (pending3.length >= 1) {
      const ann = await post(`/review-queue/${pending3[0].id}/decide`,
        { decision: "annotate", annotation: "Need more evidence — please re-run VLM" });
      check("Request more evidence → annotate returns ok", ann.body?.ok === true);
      check("Annotate keeps status pending", ann.body?.item?.status === "pending");
    }

    // Invalid decision rejected
    const bad = await post(`/review-queue/${pending[0]?.id ?? "none"}/decide`, { decision: "banana" });
    check("invalid decision returns 400", bad.status === 400);

    // Missing item returns 404
    const miss = await j("/review-queue/nonexistent-id");
    check("missing item returns 404", miss.status === 404);
  }

  console.log(`\n📊 Sign-off Queue: ${pass} passed, ${fail} failed`);
  if (fails.length) { console.log("Failures:", fails.join(", ")); process.exit(1); }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
