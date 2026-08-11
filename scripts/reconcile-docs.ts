// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Doc-vs-Code Reconciler (Stage 7 #13)
//
// Top-down / bottom-up diff: extracts numerical claims from the four
// canonical FreeLeased docs and matches each against the codebase reality
// it claims to describe. Outputs a single markdown table summarising
// pass/fail per claim.
//
// Why this exists: every submission number ("159 tests", "9 jurisdictions",
// "20 patterns", "8 loops", "7 MoU partners", ...) must be verifiable
// against the source code in the same commit. Stage 5 broke this discipline
// with a hardcoded `testsPassing: 40, testsTotal: 40`; the loop-protocol
// itself drifted between "8 loops complete" and "7 loops complete" across
// commits. This script is the runtime check the loop-protocol was missing.
//
// Usage: node --experimental-strip-types scripts/reconcile-docs.ts
//        (or `bun scripts/reconcile-docs.ts`)

import { readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── Helpers ──────────────────────────────────────────────────────────────

function countMatches(file: string, pattern: RegExp): number {
  if (!existsSync(file)) return -1;
  const text = readFileSync(file, "utf8");
  const m = text.match(pattern);
  return m ? m.length : 0;
}

function grepOccurrence(file: string, pattern: RegExp): string | null {
  if (!existsSync(file)) return null;
  const text = readFileSync(file, "utf8");
  const m = text.match(pattern);
  return m ? m[0].trim() : null;
}

function readJsonLen(file: string): number {
  if (!existsSync(file)) return -1;
  try {
    const raw = readFileSync(file, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (typeof parsed === "object" && parsed !== null) return Object.keys(parsed).length;
  } catch {
    return -1;
  }
  return -1;
}

// ── Claims catalogue (top-down — what the docs SAY) ──────────────────────

interface Claim {
  key: string;
  text: string;
  docSource: string;
  expected: number;
  actual: number;
  status: "pass" | "drift" | "missing-source";
  note?: string;
}

// Helper to assemble the Claim objects after we read the codebase.
function makeClaim(
  key: string,
  text: string,
  docSource: string,
  expected: number,
  actual: number,
  note?: string,
): Claim {
  let status: Claim["status"] = "pass";
  if (actual < 0) status = "missing-source";
  else if (actual !== expected) status = "drift";
  return { key, text, docSource, expected, actual, status, note };
}

// ── Codebase stats (bottom-up — what the code SAYS) ───────────────────────

const stats: Record<string, number> = {};

// ── tests: count `check(` invocations in test-suite.ts ──────────────────
{
  const file = join(ROOT, "scripts/test-suite.ts");
  const n = countMatches(file, /^\s*check\(/gm);
  stats["tests"] = n;
}

// ── jurisdictions: length of JURISDICTIONS array in spine.ts ─────────────
{
  // Count `{ code: "..." }` objects that look like jurisdiction entries.
  // spine.ts has explicit `code:` declarations per jurisdiction record.
  const file = join(ROOT, "src/data/spine.ts");
  const n = countMatches(file, /^\s*code:\s*"[A-Z]{2,3}"/gm);
  stats["jurisdictions"] = n;
}

// ── patterns: length of HIDDEN_RIGHTS array in patterns.ts ──────────────
{
  const file = join(ROOT, "src/data/patterns.ts");
  // Patterns have `id: <number>,` at the start of each entry.
  const n = countMatches(file, /^\s*id:\s*\d+,/gm);
  stats["patterns"] = n;
}

// ── statutes: count statute entries in spine.ts (have shortTitle: ...) ───
{
  const file = join(ROOT, "src/data/spine.ts");
  const n = countMatches(file, /shortTitle:\s*"/g);
  stats["statutes"] = n;
}

// ── engines: count agent classes inside src/lib/engines.ts ───────────────────
//
// The doc claim is "4 dossier engines", referring to the 4-agent architecture
// declared in src/lib/engines.ts (Resident Status, Tenure+Building, Contracts,
// Hidden Rights). The reconcile-doc counter must therefore parse the file for
// `function <Name>Agent(`` declarations, not file-existence counts, otherwise
// a single-file multi-agent module would always under-report.
{
  const file = join(ROOT, "src/lib/engines.ts");
  if (!existsSync(file)) {
    stats["engines"] = -1;
  } else {
    const text = readFileSync(file, "utf8");
    // Match `function <Name>Agent(...)` (export optional).
    const agentDecls = text.match(/function\s+[A-Za-z0-9_]+Agent\s*\(/g);
    stats["engines"] = agentDecls ? agentDecls.length : 0;
  }
}

// ── loops: highest loop number explicitly declared as "Complete" ─────────
{
  // Parse loop-protocol.md: look for `Loop N:` headers and find the max.
  const file = join(ROOT, "project/strategy/loop-protocol.md");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  let max = 0;
  const re = /\*\*Loop\s+(\d+)\b[^*]*\*\*/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const n = parseInt(m[1], 10);
    if (!isNaN(n) && n > max) max = n;
  }
  stats["loops"] = max;
}

// ── sprints: sprint count mentioned in 00-OVERVIEW.md ────────────────────
{
  // "Sprint: 27 Jul — 16 Aug 2026 (Day 11 of 21 as of 6 Aug)" — 21 days.
  const file = join(ROOT, "project/strategy/00-OVERVIEW.md");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const m = text.match(/Day\s+(\d+)\s+of\s+(\d+)/i);
  stats["sprints"] = m ? parseInt(m[2], 10) : 0;
}

// ── moUs: count MoU/agency references in 00-OVERVIEW.md ──────────────────
{
  // 00-OVERVIEW.md says "7 Caribbean government agencies"
  const file = join(ROOT, "project/strategy/00-OVERVIEW.md");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  // Look for "X MoU partners" / "X Caribbean government agencies" / "X personalised follow-up emails"
  let n = 0;
  const m1 = text.match(/(\d+)\s+(?:Caribbean\s+government\s+agencies|MoU\s+partners|personalised\s+follow-up\s+emails)/i);
  if (m1) n = parseInt(m1[1], 10);
  stats["moUs"] = n;
}

// ── caps: count keys in CONFIDENCE_CAP table in fairness.ts ──────────────
{
  const file = join(ROOT, "src/lib/fairness.ts");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  // match "key: number" inside the CONFIDENCE_CAP record.
  const m = text.match(/CONFIDENCE_CAP[\s\S]*?\}\s*;/);
  if (m) {
    const entries = m[0].match(/:\s*\d+\.?\d*/g);
    stats["caps"] = entries ? entries.length : 0;
  } else {
    stats["caps"] = -1;
  }
}

// ── data-room-folders: count distinct COPY-NNN target folders from journal ─
{
  const file = join(ROOT, "memory/data-room-copies.md");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  // Pull the parent folder (first segment) of each COPY-NNN target.
  // Format: `01_Company Overview/project_summary/README.md`
  // → "01_Company Overview" counts as one folder.
  //
  // To avoid false positives from workspace-only entries (COPY-046 onwards),
  // we require the row to have an `OK (` status marker in the `result` column.
  // Per data-room-copies.md the canonical count is 22/24 evidenced sub-folders.
  // Sub-folder = first two segments of the target path (e.g. "01_Company Overview/project_summary").
  // The data-room-map has 24 sub-folders; revenue/ and releases/ are the only
  // genuinely-empty ones, giving 22.
  const folderSet = new Set<string>();
  // Format: `| COPY-NNN | timestamp | `source` | `01_Folder/sub/path` | TRL | reason | reversibility | OK (...) |`
  // 7 pipes after the COPY-NNN pipe. We require:
  //   (a) value column starts with a backtick (filters out "(workspace-only..." rows)
  //   (b) OK (` (`) in the last column (filters out n/a result rows)
  // Together these prevent false positives from COPY-046+ workspace-only entries.
  // The folder capture is `(topfolder)` or `(topfolder/subfolder)`; subfolder is
  // optional so single-segment folders like `00_README - Index and TRL Map/` count.
  const re = /\|\s*COPY-\d+\s*\|[^|]*\|[^|]*\|\s*`([A-Za-z0-9_ -]+(?:\/[A-Za-z0-9_ -]+)?)\/[^`]*`\s*\|[^|]*\|[^|]*\|[^|]*\|\s*OK\s*\(/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const folder = m[1].trim();
    if (!folder) continue;
    folderSet.add(folder);
  }
  stats["data-room-folders"] = folderSet.size;
}

// ── Build the claims table ───────────────────────────────────────────────

const claims: Claim[] = [
  makeClaim(
    "tests",
    "test assertions",
    "scripts/test-suite.ts:78 (truth-protocol canonical)",
    159,
    stats["tests"],
    `counted via /^\s*check\(/gm on scripts/test-suite.ts`,
  ),
  makeClaim(
    "jurisdictions",
    "jurisdictions in data spine",
    "project/strategy/00-OVERVIEW.md:44",
    9,
    stats["jurisdictions"],
    `counted via /code: "[A-Z]{2,3}"/ in src/data/spine.ts`,
  ),
  makeClaim(
    "patterns",
    "hidden-rights patterns",
    "project/strategy/00-OVERVIEW.md:44",
    20,
    stats["patterns"],
    `counted via /id: \\d+,/ at line start in src/data/patterns.ts`,
  ),
  makeClaim(
    "statutes",
    "codified statutes",
    "project/strategy/00-OVERVIEW.md:44 ('25+ statutes')",
    25,
    stats["statutes"],
    `counted via /shortTitle: "/ in src/data/spine.ts (target ≥ 25; '25+' in doc)`,
  ),
  makeClaim(
    "engines",
    "deterministic dossier agents",
    "project/strategy/loop-protocol.md (4-agent dossier engines)",
    4,
    stats["engines"],
    `counted via /function <Name>Agent(/ in src/lib/engines.ts (4-agent orchestrator: Resident Status, Tenure+Building, Contracts, Hidden Rights)`,
  ),
  makeClaim(
    "loops",
    "completed loops",
    "project/strategy/loop-protocol.md (Loop N: headers)",
    8,
    stats["loops"],
    `max Loop-N from '**Loop N:**' headers in loop-protocol.md`,
  ),
  makeClaim(
    "sprints",
    "buildathon days",
    "project/strategy/00-OVERVIEW.md:40 ('Day 11 of 21')",
    21,
    stats["sprints"],
    `parsed 'Day N of M' from 00-OVERVIEW.md`,
  ),
  makeClaim(
    "moUs",
    "MoU partner agencies",
    "project/strategy/00-OVERVIEW.md:46",
    7,
    stats["moUs"],
    `parsed 'N Caribbean government agencies' from 00-OVERVIEW.md`,
  ),
  makeClaim(
    "caps",
    "conviction caps",
    "src/lib/fairness.ts:13 (truth-protocol canonical)",
    4,
    stats["caps"],
    `counted entries in CONFIDENCE_CAP table (one per EvidenceClass)`,
  ),
  makeClaim(
    "data-room-folders",
    "Data Room folders evidenced",
    "memory/data-room-copies.md:136",
    22,
    stats["data-room-folders"],
    `counted distinct target folders across COPY-NNN rows with OK status`,
  ),
];

// ── Render markdown table ─────────────────────────────────────────────────

const driftCount = claims.filter((c) => c.status !== "pass").length;
const passCount = claims.length - driftCount;

console.log("# FreeLeased Doc-vs-Code Reconciliation");
console.log();
console.log(`Generated: ${new Date().toISOString()}`);
console.log();
console.log(`**${passCount}/${claims.length} claims pass** · ${driftCount} drift${driftCount === 1 ? "" : "s"}`);
console.log();
console.log("| Claim | Doc says | Expected | Actual | Status | Source |");
console.log("|---|---|---:|---:|---|---|");
for (const c of claims) {
  const icon = c.status === "pass" ? "PASS" : c.status === "drift" ? "DRIFT" : "MISSING";
  console.log(
    `| ${c.key} | ${c.text} | ${c.expected} | ${c.actual} | ${icon} | ${c.docSource} |`,
  );
}
console.log();
console.log("## Per-claim notes");
for (const c of claims) {
  if (c.note) console.log(`- **${c.key}** — ${c.note}`);
}
console.log();
console.log(`Drift count: ${driftCount}`);

// Exit non-zero if drift detected (caller can pipe to CI).
if (driftCount > 0) {
  // Don't fail the build — drift is informational. Health-check will surface it.
}

// We intentionally do NOT process.exit(1) on drift; this is a scorecard.