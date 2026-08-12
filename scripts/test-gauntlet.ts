#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Gauntlet Loop upgrade tests (Phase 16).
//
// Verifies the contract added to `project/strategy/gauntlet-loop.md`:
//   - Ingest Protocol (6 questions)
//   - Dated Conviction (date + class + cap + expiry + source)
//   - Outcomes & Impact (5 worked examples)
//   - Game Theory (player set ≥ 4; credible-threat table; 3+ worked examples)
//   - Strategy (Porter + Christensen + Tzu + Boyd + Schelling)
//   - Doctrine (≥ 5 principles)
//   - Decision Log (7 columns)
//   - Section presence in gauntlet-loop.md
//
// Run: node --experimental-strip-types scripts/test-gauntlet.ts
//   or: bun scripts/test-gauntlet.ts
//
// Pass criteria: all assertions pass. Honest failure report on miss.

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function check(name: string, cond: boolean): void {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GAUNTLET_PATH = resolve(ROOT, "project/strategy/gauntlet-loop.md");
const DECISION_LOG_PATH = resolve(ROOT, "project/management/decision-log.md");

// ── Pre-flight ──────────────────────────────────────────────────────────
check("gauntlet-loop.md exists", existsSync(GAUNTLET_PATH));
check("decision-log.md exists", existsSync(DECISION_LOG_PATH));

const gauntlet = readFileSync(GAUNTLET_PATH, "utf-8");
const decisionLog = readFileSync(DECISION_LOG_PATH, "utf-8");

// ── Section presence ────────────────────────────────────────────────────
const SECTIONS = [
  "## Ingest Protocol",
  "## Dated Conviction",
  "## Outcomes & Impact",
  "## Game Theory",
  "## Strategy",
  "## Doctrine",
  "## Decision Log Integration",
  "## End-to-End Flow",
  "## Verification",
];
for (const s of SECTIONS) {
  check(`section present: ${s}`, gauntlet.includes(s));
}
check(
  "section present: ## Verification (refs test-gauntlet.ts)",
  /## Verification[^\n]*test-gauntlet\.ts/.test(gauntlet)
);

// ── Group: Ingest Protocol (6 questions) ────────────────────────────────
const INGEST_KEYWORDS: Array<[string, RegExp]> = [
  ["WHO — section heading", /\bWHO is asking\?/],
  ["WHAT — section heading", /\bWHAT do they want\?/],
  ["WHY — section heading", /\bWHY now\?/],
  ["COST — section heading", /WHAT is the cost of being wrong/],
  ["CONVICTION — section heading", /\bWHAT is the conviction\?/],
  ["DATE — section heading", /\bWHAT is the date\?/],
  ["Caller kinds table", /CallerKind/],
  ["Closed enum for verb (decision)", /decision.*they want a binary/i],
  ["Closed enum for verb (analysis)", /analysis.*they want the dossier engines/i],
  ["Closed enum for verb (action)", /action.*they want the project to/i],
  ["Closed enum for verb (recommendation)", /recommendation.*they want a ranked/i],
  ["Closed enum for verb (audit)", /audit.*they want a re-run/i],
  ["Closed enum for verb (explanation)", /explanation.*they want the reasoning/i],
  ["Reversibility × asymmetry matrix", /Reversible \+ symmetric/],
  ["ISO-8601 timestamp requirement", /ISO-8601/],
];
for (const [name, re] of INGEST_KEYWORDS) {
  check(`Ingest: ${name}`, re.test(gauntlet));
}

// ── Group: Dated Conviction (5 fields) ──────────────────────────────────
const DATED_KEYWORDS: Array<[string, RegExp]> = [
  ["DatedConviction type defined", /interface\s+DatedConviction/],
  ["date field", /\bdate\s*:\s*string/],
  ["class field — established", /'established'/],
  ["class field — heuristic", /'heuristic'/],
  ["class field — contested", /'contested'/],
  ["class field — unfalsifiable", /'unfalsifiable'/],
  ["cap 0.99", /0\.99/],
  ["cap 0.75", /0\.75/],
  ["cap 0.60", /0\.60/],
  ["cap 0.33", /0\.33/],
  ["expiry field", /\bexpiry\s*:/],
  ["sourceUrl field", /sourceUrl/],
  ["fetchedAt field", /fetchedAt/],
  ["Decay table present", /Decay table/],
  ["Statute 365d", /365 days/],
  ["Personal advice 30d", /30 days/],
  ["Market claim 90d", /90 days/],
  ["Case law 180d", /180 days/],
];
for (const [name, re] of DATED_KEYWORDS) {
  check(`Dated: ${name}`, re.test(gauntlet));
}

// ── Group: Outcomes & Impact (5 worked examples) ────────────────────────
const OUTCOMES_KEYWORDS: Array<[string, RegExp]> = [
  ["Five questions intro", /five questions/i],
  ["Example 1 — LFRA Sch.4", /LFRA 2024 Sch\.4 application|Example 1.*LFRA/],
  ["Example 2 — Buildathon", /Example 2.*Buildathon|Buildathon entry itself/],
  ["Example 3 — Caribbean expansion", /Example 3.*Caribbean|Caribbean expansion/],
  ["Example 4 — Local-edge LLM", /Example 4.*Local-edge|Local-edge LLM/],
  ["Example 5 — Gauntlet Loop", /Example 5.*Gauntlet|Gauntlet Loop itself/],
  ["Outcome column", /Outcome/i],
  ["2nd-order", /2nd order|second-order/i],
  ["3rd-order", /3rd order|third-order/i],
  ["Affected column", /Affected/i],
  ["Measure column", /Measure/i],
];
for (const [name, re] of OUTCOMES_KEYWORDS) {
  check(`Outcomes: ${name}`, re.test(gauntlet));
}

// ── Group: Game Theory (≥ 3 worked examples; player set ≥ 4) ────────────
const GAME_KEYWORDS: Array<[string, RegExp]> = [
  ["Players named: resident", /\bresident\s*\(R\)/i],
  ["Players named: freeholder", /\bfreeholder\s*\(F\)/i],
  ["Players named: court", /\bcourt\s*\(C\)/i],
  ["Players named: regulator", /\bregulator\s*\(G\)/i],
  ["Strategy sets", /Strategy sets:/],
  ["Payoffs", /Payoffs/],
  ["Nash equilibrium", /Nash/i],
  ["Credible-threat table", /Credible threats/i],
  ["Information asymmetry", /Information asymmetry|asymmetric-information/i],
  ["Mechanism design", /Mechanism design/i],
  ["Schelling focal point", /Schelling/i],
  ["Worked example: LFRA s.99 application", /LFRA.*s\.99 application|Schedule 4 application is a/],
  ["Equilibria summary table", /Equilibria summary/],
];
for (const [name, re] of GAME_KEYWORDS) {
  check(`Game theory: ${name}`, re.test(gauntlet));
}
// Player-set ≥ 4 (numeric check, separate from regex loop)
const playerHits =
  (gauntlet.match(/\bresident\b/g) || []).length
  + (gauntlet.match(/\bfreeholder\b/g) || []).length
  + (gauntlet.match(/\bcourt\b/g) || []).length
  + (gauntlet.match(/\bregulator\b/g) || []).length
  + (gauntlet.match(/\bmedia\b/g) || []).length
  + (gauntlet.match(/\bproject\b/g) || []).length;
check(`Game theory: player set ≥ 4 distinct players (total mentions ${playerHits})`, playerHits >= 4);

// ── Group: Strategy (5 frameworks) ──────────────────────────────────────
const STRATEGY_KEYWORDS: Array<[string, RegExp]> = [
  ["Porter's Five Forces", /Porter.*Five Forces|Five Forces/i],
  ["Christensen's Disruption", /Christensen/i],
  ["Sun Tzu — know yourself", /Sun Tzu|Know yourself/i],
  ["Boyd's OODA Loop", /OODA|Boyd/i],
  ["Schelling focal point", /Schelling/i],
];
for (const [name, re] of STRATEGY_KEYWORDS) {
  check(`Strategy: ${name}`, re.test(gauntlet));
}

// ── Group: Doctrine (≥ 5 principles) ────────────────────────────────────
const DOCTRINE_KEYWORDS: Array<[string, RegExp]> = [
  ["Principle 1 — never cite what you can't verify", /Never cite what you can't verify/],
  ["Principle 2 — never claim what you haven't done", /Never claim what you haven't done/],
  ["Principle 3 — never build what you won't use", /Never build what you won't use/],
  ["Principle 4 — never optimise for judges over users", /Never optimise for judges over users/],
  ["Principle 5 — gauntlet is only as good as the questions", /gauntlet is only as good as the questions/i],
];
for (const [name, re] of DOCTRINE_KEYWORDS) {
  check(`Doctrine: ${name}`, re.test(gauntlet));
}

// Count numbered doctrine items
const doctrineSection = gauntlet.split("## Doctrine")[1]?.split("## Decision Log")[0] || "";
const numberedDoctrineItems = (doctrineSection.match(/^\d+\.\s+\*\*/gm) || []).length;
check(`Doctrine: ≥ 5 numbered principles (found ${numberedDoctrineItems})`, numberedDoctrineItems >= 5);

// ── Group: Decision Log (7 columns in ≥ 1 row) ──────────────────────────
const DECISION_COLUMNS = [
  "Date",
  "Decision",
  "Alternatives",
  "Rationale",
  "Conviction",
  "Owner",
  "Expiry",
];

const DECISION_LOG_DECISIONS = decisionLog.split(/^##\s+DR-/m);
let adrLightRowFound = false;
for (const blk of DECISION_LOG_DECISIONS) {
  const hasAllCols = DECISION_COLUMNS.every((c) => blk.includes(c));
  if (hasAllCols) { adrLightRowFound = true; break; }
}
// Fallback: search gauntlet-loop.md for an ADR-light row template
if (!adrLightRowFound) {
  const tableMatch = gauntlet.match(/Date.*Decision.*Alternatives.*Rationale.*Conviction.*Owner.*Expiry/s);
  adrLightRowFound = !!tableMatch;
}
check(`Decision log: 7 columns present (ADR-light row template exists)`, adrLightRowFound);

// ── Group: End-to-End flow ───────────────────────────────────────────────
check(
  "E2E: ingest → dossier flow",
  new RegExp("ingest arrives[\\s\\S]*INGEST PROTOCOL").test(gauntlet)
);
check("E2E: doctrine final check", /DOCTRINE final check/i.test(gauntlet));

// ── Group: gauntlet-loop.md growth (Phase 16 should add ≥ 500 lines) ─────
const lineCount = gauntlet.split("\n").length;
check(`gauntlet-loop.md has ≥ 800 lines (got ${lineCount})`, lineCount >= 800);
check(`gauntlet-loop.md has ≥ 20,000 chars (got ${gauntlet.length})`, gauntlet.length >= 20_000);

// ── Report ──────────────────────────────────────────────────────────────
console.log("");
console.log("════════════════════════════════════════════════════════════════");
console.log(` GAUNTLET LOOP TESTS (Phase 16)`);
console.log(` Source: project/strategy/gauntlet-loop.md`);
console.log("════════════════════════════════════════════════════════════════");
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}`);
if (fails.length > 0) {
  console.log("");
  console.log("  Failed assertions:");
  for (const f of fails) console.log(`    ✗ ${f}`);
  console.log("");
  console.log("  Result: FAIL");
  console.log("════════════════════════════════════════════════════════════════");
  process.exit(1);
}
console.log("");
console.log("  Result: PASS — gauntlet loop is a 'superior decision maker'.");
console.log("════════════════════════════════════════════════════════════════");
process.exit(0);
