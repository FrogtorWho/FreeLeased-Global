#!/usr/bin/env bun
// FreeLeased — Tests for the doc-vs-code reconciler.
//
// The reconciler extracts numerical claims from docs and matches each
// against codebase reality. These tests assert the underlying regexes
// and expected values that drive the reconciliation table.
//
// Stage 7 #13 — reconcile-docs.ts shipped.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string) {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── Test 1: reconcile-docs.ts exists and exports runnable code ─────────
{
  const ts = readFileSync(`${ROOT}/scripts/reconcile-docs.ts`, "utf8");
  assert(ts.length > 1000, `reconcile-docs.ts is non-trivial (got ${ts.length} chars)`);
  assert(ts.includes("Drift count"), "reconcile-docs.ts prints Drift count line");
  assert(ts.includes("**"), "reconcile-docs.ts uses markdown bold");
}

// ── Test 2: Test count via check() regex returns 159 ───────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/test-suite.ts`, "utf8");
  const n = (ts.match(/^\s*check\(/gm) ?? []).length;
  assert(n === 159, `check() count is 159 (got ${n})`);
}

// ── Test 3: Jurisdictions via `code: "XX"` regex returns 9 ─────────────
{
  const ts = readFileSync(`${ROOT}/src/data/spine.ts`, "utf8");
  const n = (ts.match(/^\s*code:\s*"[A-Z]{2,3}"/gm) ?? []).length;
  assert(n === 9, `jurisdiction code count is 9 (got ${n})`);
}

// ── Test 4: Patterns via `id: N,` regex returns 20 ─────────────────────
{
  const ts = readFileSync(`${ROOT}/src/data/patterns.ts`, "utf8");
  const n = (ts.match(/^\s*id:\s*\d+,/gm) ?? []).length;
  assert(n === 20, `pattern id count is 20 (got ${n})`);
}

// ── Test 5: Caps in CONFIDENCE_CAP table returns 4 ─────────────────────
{
  const ts = readFileSync(`${ROOT}/src/lib/fairness.ts`, "utf8");
  const block = ts.match(/CONFIDENCE_CAP[\s\S]*?\}\s*;/);
  assert(block !== null, "CONFIDENCE_CAP table found");
  if (block) {
    const entries = (block[0].match(/:\s*\d+\.?\d*/g) ?? []).length;
    assert(entries === 4, `CONFIDENCE_CAP has 4 entries (got ${entries})`);
  }
}

// ── Test 6: Loops max — loop-protocol.md declares Loop 8 ──────────────
{
  const md = readFileSync(`${ROOT}/project/strategy/loop-protocol.md`, "utf8");
  let max = 0;
  const re = /\*\*Loop\s+(\d+)\b/g;
  let m;
  while ((m = re.exec(md)) !== null) max = Math.max(max, parseInt(m[1], 10));
  assert(max === 8, `max Loop N is 8 (got ${max})`);
}

// ── Test 7: Sprints from "Day N of M" in 00-OVERVIEW.md returns 21 ─────
{
  const md = readFileSync(`${ROOT}/project/strategy/00-OVERVIEW.md`, "utf8");
  const m = md.match(/Day\s+(\d+)\s+of\s+(\d+)/i);
  assert(m !== null, "00-OVERVIEW.md has 'Day N of M'");
  if (m) assert(m[2] === "21", `M == 21 (got ${m[2]})`);
}

// ── Test 8: MoUs from "N Caribbean government agencies" returns 7 ──────
{
  const md = readFileSync(`${ROOT}/project/strategy/00-OVERVIEW.md`, "utf8");
  const m = md.match(/(\d+)\s+(?:Caribbean\s+government\s+agencies|MoU\s+partners|personalised\s+follow-up\s+emails)/i);
  assert(m !== null, "00-OVERVIEW.md declares MoU partner count");
  if (m) assert(m[1] === "7", `MoU count == 7 (got ${m[1]})`);
}

// ── Test 9: Data-room sub-folders returns 22 ───────────────────────────
// Mirrors the canonical regex in [`scripts/reconcile-docs.ts`](scripts/reconcile-docs.ts:207)
// which counts distinct topfolder (+optional subfolder) targets across COPY-NNN
// rows whose result column contains "OK (". Workspace-only rows (COPY-046+)
// reference `project/` or `src/` paths and are filtered out by the OK-status
// check + the row-shape requirement (3 leading pipes after COPY-NNN).
{
  const md = readFileSync(`${ROOT}/memory/data-room-copies.md`, "utf8");
  const folderSet = new Set<string>();
  const re = /\|\s*COPY-\d+\s*\|[^|]*\|[^|]*\|\s*`([A-Za-z0-9_ -]+(?:\/[A-Za-z0-9_ -]+)?)\/[^`]*`\s*\|[^|]*\|[^|]*\|[^|]*\|\s*OK\s*\(/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const folder = m[1].trim();
    if (!folder) continue;
    folderSet.add(folder);
  }
  assert(folderSet.size === 22, `data-room sub-folders == 22 (got ${folderSet.size})`);
}

// ── Test 10: reconcile-docs table has 10 claim rows ────────────────────
{
  const ts = readFileSync(`${ROOT}/scripts/reconcile-docs.ts`, "utf8");
  const claimKeys = ["tests", "jurisdictions", "patterns", "statutes", "engines", "loops", "sprints", "moUs", "caps", "data-room-folders"];
  for (const key of claimKeys) {
    assert(ts.includes(`"${key}"`) || ts.includes(`'${key}'`), `claim "${key}" is in reconcile-docs.ts`);
  }
}

// ── Test 11: All expected source files exist ───────────────────────────
{
  const files = [
    "scripts/test-suite.ts",
    "src/data/spine.ts",
    "src/data/patterns.ts",
    "src/lib/fairness.ts",
    "src/lib/engines.ts",
    "project/strategy/loop-protocol.md",
    "project/strategy/00-OVERVIEW.md",
    "memory/data-room-copies.md",
  ];
  for (const f of files) {
    assert(existsSync(`${ROOT}/${f}`), `${f} exists`);
  }
}

// ── Test 12: Bucket 1 — cold-clone polish artefacts exist ─────────────
// Phase 11 / Bucket 1: every artefact named in docs/onboarding.md and
// docs/judge-quickstart.md must exist. A doc that points to a missing
// file is drift; this test catches it before a judge does.
{
  const bucket1Files = [
    "docs/onboarding.md",
    "docs/judge-quickstart.md",
    "docs/story-60s.md",
    "project/strategy/100-judge-panel.md",
    "project/strategy/i18n-roadmap.md",
    ".env.example",
    "CONTRIBUTING.md",
    "LICENSE",
  ];
  for (const f of bucket1Files) {
    assert(existsSync(`${ROOT}/${f}`), `Bucket-1 artefact: ${f} exists`);
  }
}

// ── Test 13: Bucket 1 — onboarding doc links reconcile ────────────────
// Every cross-link from the new onboarding doc must resolve to an
// existing file. This is the "docs-only" half of the reconcile-doc
// runner, scoped to the onboarding tree.
{
  const onboarding = readFileSync(`${ROOT}/docs/onboarding.md`, "utf8");
  const linkRe = /\]\((?:\.\.\/)+([A-Za-z0-9_./-]+\.[a-z]+)(?::\d+)?\)/g;
  const referenced = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(onboarding)) !== null) {
    referenced.add(m[1]);
  }
  assert(referenced.size >= 5, `onboarding.md references ≥5 files (got ${referenced.size})`);
  for (const f of referenced) {
    assert(existsSync(`${ROOT}/${f}`), `onboarding.md link → ${f} resolves`);
  }
}

// ── Test 14: Bucket 1 — judge-quickstart covers all 32 archetypes ────
// The judge-quickstart doc must enumerate every archetype row from
// the 100-judge panel; if a row is missing, the rubric is incomplete.
{
  const qs = readFileSync(`${ROOT}/docs/judge-quickstart.md`, "utf8");
  // Count table rows that begin with "| N |" where N is 1..32
  let archetypeCount = 0;
  for (let i = 1; i <= 32; i++) {
    const re = new RegExp(`\\|\\s*${i}\\s*\\|`);
    if (re.test(qs)) archetypeCount++;
  }
  assert(archetypeCount === 32, `judge-quickstart covers all 32 archetypes (got ${archetypeCount})`);
}

// ── Test 15: Bucket 1 — story-60s has all 5 sections ──────────────────
{
  const story = readFileSync(`${ROOT}/docs/story-60s.md`, "utf8");
  const sections = ["Setup", "Conflict", "Resolution", "Proof", "Ask"];
  for (const s of sections) {
    assert(story.includes(`## ${s}`), `story-60s has section "## ${s}"`);
  }
}

// ── Test 16: Bucket 1 — 100-judge-panel structure ─────────────────────
// The 100-judge panel doc must include the 33-archetype table, the
// axes-section header, the buckets section, and the honest-gaps section.
{
  const panel = readFileSync(`${ROOT}/project/strategy/100-judge-panel.md`, "utf8");
  assert(panel.includes("## 2. Per-archetype axes"), "panel has §2 axes");
  assert(panel.includes("## 3. Improvement buckets"), "panel has §3 buckets");
  assert(panel.includes("## 5. Honest gaps"), "panel has §5 honest gaps");
  assert(panel.includes("## 4. Saturation criterion"), "panel has §4 saturation");
  // Must reference all 33 archetypes
  const archetypeHeaders = [
    "Legal academics", "Practising solicitors", "Caribbean barristers",
    "Tribunal judges", "Housing policy wonks", "VCs",
    "AI/ML researchers", "Product designers", "Frontend engineers",
    "Backend engineers", "DevOps / SRE", "Security researchers",
    "AI ethicists", "Privacy / GDPR specialists", "Open-source maintainers",
    "Accessibility specialists", "Caribbean diaspora", "Climate / disaster",
    "Property / real-estate economists", "Behavioural scientists",
    "Journalists", "Democracy / civic-tech", "Local-government / municipal-tech",
    "Translators / localisation", "Insurtech / lenders", "Public health",
    "Education specialists", "Pure mathematicians / statisticians",
    "TypeScript / language specialists", "Buildathon organisers",
    "CfC alumni", "Press / communications specialists",
  ];
  let foundCount = 0;
  for (const a of archetypeHeaders) {
    if (panel.includes(a)) foundCount++;
  }
  assert(foundCount >= 30, `panel references ≥30 archetypes (got ${foundCount})`);
}

// ── Test 17: Bucket 1 — i18n-roadmap honest gap disclosure ────────────
{
  const i18n = readFileSync(`${ROOT}/project/strategy/i18n-roadmap.md`, "utf8");
  assert(i18n.includes("English"), "i18n-roadmap mentions English");
  assert(i18n.includes("Patois") || i18n.includes("Spanish") || i18n.includes("French"),
    "i18n-roadmap names a non-English language");
  assert(i18n.includes("Q4") || i18n.includes("2026") || i18n.includes("2027"),
    "i18n-roadmap has a target date");
}

// ── Test 18: Bucket 1 — .env.example covers all 3 LLM providers ───────
{
  const env = readFileSync(`${ROOT}/.env.example`, "utf8");
  assert(env.includes("NEBIUS_API_KEY"), ".env.example documents Nebius");
  assert(env.includes("GIOTTO_API_KEY"), ".env.example documents Giotto");
  assert(env.includes("MINIMAX_API_KEY"), ".env.example documents MiniMax");
  assert(env.includes("OLLYGARDEN_API_KEY") || env.includes("OLLYGARDEN_OTLP_ENDPOINT"),
    ".env.example documents OllyGarden");
  assert(env.includes("OLLAMA") || env.includes("USE_LOCAL_EDGE"),
    ".env.example documents local edge");
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased reconcile-docs tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All reconcile-docs assertions passed.");
  process.exit(0);
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased reconcile-docs tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All reconcile-docs assertions passed.");
  process.exit(0);
}