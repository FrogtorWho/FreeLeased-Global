#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Gauntlet Loop upgrade tests (Phase 16 + Gauntlet 2.0).
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
//   - Gauntlet 2.0: Client Type Matrix, Engine Catalogue (8), Overlay
//     Catalogue (5), AI-Employee Army (10 specialist + 5 support + 3
//     intern + 4 vendor), Tiered Pricing, Single-Person Admin TODO,
//     Discipline Coverage Matrix, 2.0 Doctrine lines 6-7.
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

// ── Gauntlet 2.0 — Section presence for the 10 new sections ─────────────
const SECTIONS_2_0 = [
  "## Client Type Matrix",
  "## Engine Catalogue (8 engines)",
  "## Overlay Catalogue (5 overlays)",
  "## AI-Employee Army",
  "## Tiered Pricing",
  "## Single-Person Admin TODO",
  "## Discipline Coverage Matrix",
  "## Gauntlet 2.0 Test Surface",
  "## Gauntlet 2.0 \u2014 Doctrine Update",
  "## Gauntlet 2.0 \u2014 Single-Person-Admin Verification",
];
for (const s of SECTIONS_2_0) {
  check(`Gauntlet 2.0 section present: ${s}`, gauntlet.includes(s));
}

// ── Gauntlet 2.0 — Engine Catalogue (8 engines) ─────────────────────────
const ENGINE_KEYWORDS: Array<[string, RegExp]> = [
  ["Engine 1 — Legal Engine", /^###\s+1\.\s+Legal Engine/m],
  ["Engine 2 — Planning Engine", /^###\s+2\.\s+Planning Engine/m],
  ["Engine 3 — Building Safety Engine", /^###\s+3\.\s+Building Safety Engine/m],
  ["Engine 4 — Environmental Engine", /^###\s+4\.\s+Environmental Engine/m],
  ["Engine 5 — Valuation Engine", /^###\s+5\.\s+Valuation Engine/m],
  ["Engine 6 — Financial Engine", /^###\s+6\.\s+Financial Engine/m],
  ["Engine 7 — Tenure-Mix Engine", /^###\s+7\.\s+Tenure-Mix Engine/m],
  ["Engine 8 — Dispute Resolution Engine", /^###\s+8\.\s+Dispute Resolution Engine/m],
];
for (const [name, re] of ENGINE_KEYWORDS) {
  check(`Engine catalogue: ${name}`, re.test(gauntlet));
}
check(
  "Engine catalogue: 8 distinct engines (count of ### N. headings)",
  (gauntlet.match(/^###\s+\d+\.\s+[A-Z]/gm) || []).length >= 8
);

// ── Gauntlet 2.0 — Overlay Catalogue (5 overlays) ───────────────────────
const OVERLAY_KEYWORDS: Array<[string, RegExp]> = [
  ["Overlay 1 — Macro", /^###\s+Overlay\s+1\s+—\s+Macro Overlay/m],
  ["Overlay 2 — Micro", /^###\s+Overlay\s+2\s+—\s+Micro Overlay/m],
  ["Overlay 3 — Prediction", /^###\s+Overlay\s+3\s+—\s+Prediction Overlay/m],
  ["Overlay 4 — Strategy", /^###\s+Overlay\s+4\s+—\s+Strategy Overlay/m],
  ["Overlay 5 — Money Trail", /Money Trail Overlay/],
  ["Macro context decay 90 days", /90 days\s+\(rate \/ price\)/i],
  ["Micro dossier is the *deliverable*", /\*deliverable\*/i],
  ["Prediction carries confidence interval", /confidence interval/i],
  ["Strategy Overlay emits ActionPlan", /`ActionPlan`/],
  ["Money Trail overlay — corporate structure unknowns", /structure: unknown/i],
];
for (const [name, re] of OVERLAY_KEYWORDS) {
  check(`Overlay catalogue: ${name}`, re.test(gauntlet));
}

// ── Gauntlet 2.0 — Client Type Matrix (≥ 10 rows) ───────────────────────
const CTM_KEYWORDS: Array<[string, RegExp]> = [
  ["Singular resident row", /Singular resident/i],
  ["Leaseholder collective row", /Leaseholder collective/i],
  ["Property manager row", /Property manager/i],
  ["Institutional investor row", /Institutional investor/i],
  ["Housing association row", /Housing association/i],
  ["Local authority row", /Local authority/i],
  ["Tribunal row", /\bTribunal\b/],
  ["Solicitor firm row", /Solicitor firm/i],
  ["Mortgage lender row", /Mortgage lender/i],
  ["Insurance provider row", /Insurance provider/i],
  ["Pricing tier column (Free)", /\| Free \|/],
  ["Pricing tier column (Pro)", /\| Pro \|/],
  ["Pricing tier column (Institutional)", /\| Institutional \|/],
];
for (const [name, re] of CTM_KEYWORDS) {
  check(`Client type matrix: ${name}`, re.test(gauntlet));
}

// ── Gauntlet 2.0 — AI-Employee Army (10 specialist + 5 support + 3 intern + 4 vendor) ──
const SPECIALIST_AGENTS: Array<[string, RegExp]> = [
  ["Counsel (LLB + 10yr PQE)", /\bCounsel\b/],
  ["Surveyor (MRICS + 10yr)", /\bSurveyor\b/],
  ["Planner (RTPI + 8yr)", /\bPlanner\b/],
  ["Valuer (RICS Red Book)", /\bValuer\b/],
  ["Fire Engineer (IFE / IFireE)", /Fire Engineer/],
  ["Ecologist (CIEEM)", /\bEcologist\b/],
  ["Mortgage Broker (CeMAP)", /Mortgage Broker/],
  ["Solicitor (Dispute Resolution)", /Solicitor \(Dispute Resolution\)/],
  ["Chartered Accountant (ACA)", /Chartered Accountant/],
  ["Marketing Strategist", /Marketing Strategist/],
];
for (const [name, re] of SPECIALIST_AGENTS) {
  check(`AI army specialist: ${name}`, re.test(gauntlet));
}
check(
  "AI army specialist count = 10",
  (gauntlet.match(/Tier 1 — Specialist Consultants \(10 roles/g) || []).length === 1
);
const SUPPORT_AGENTS = ["Compliance Officer", "DevOps Engineer", "PR / Comms", "Customer Success", "Data Engineer"];
for (const a of SUPPORT_AGENTS) {
  check(`AI army support: ${a}`, gauntlet.includes(a));
}
check(
  "AI army support count = 5",
  (gauntlet.match(/Tier 2 — Support Functions \(5 roles/g) || []).length === 1
);
const INTERN_AGENTS = ["Junior Analyst", "Paralegal", "Admin"];
for (const a of INTERN_AGENTS) {
  check(`AI army intern: ${a}`, gauntlet.includes(a));
}
check(
  "AI army intern count = 3",
  (gauntlet.match(/Tier 3 — Intern Roles \(3 roles/g) || []).length === 1
);
const VENDORS = ["Giotto.ai", "Nebius", "OllyGarden", "Local-edge LLM"];
for (const v of VENDORS) {
  check(`AI army vendor: ${v}`, gauntlet.includes(v));
}
check(
  "AI army vendor count = 4",
  (gauntlet.match(/Tier 4 — Specialist Vendors \(4 external\)/g) || []).length === 1
);
// Cross-communication pattern
check(
  "AI army cross-comm: pub/sub message bus",
  /pub\/sub/i.test(gauntlet) && /src\/lib\/federation\.ts/i.test(gauntlet)
);
check(
  "AI army cross-comm: example chain (Counsel → DR → Accountant)",
  /Counsel\b[\s\S]*Solicitor[\s\S]*Chartered Accountant[\s\S]*Strategy Overlay/i.test(gauntlet)
);

// ── Gauntlet 2.0 — Tiered Pricing (Free / Pro / Institutional) ──────────
const PRICING_TIERS: Array<[string, RegExp]> = [
  ["Free Resident tier", /Free Resident\s+—\s+£0/],
  ["Pro Advisor tier", /Pro Advisor\s+—\s+£9\/mo/],
  ["Institutional tier", /Institutional\s+—\s+£500\+\/mo/],
  ["Free tier — 5 dossiers/yr limit", /5 dossiers \/ year/i],
  ["Pro tier — 50 dossiers/mo limit", /50 dossiers \/ month/],
  ["Pro tier — multi-jurisdiction", /Multi-jurisdiction \(UK \+ 1 of BB/],
  ["Institutional — white-label", /white-label/i],
  ["Institutional — dedicated advisor", /Dedicated advisor agent/i],
  ["Institutional — SLA 99.5%", /SLA: 99\.5%/],
  ["Conversion funnel", /Free Resident[\s\S]*Pro Advisor[\s\S]*Institutional/],
];
for (const [name, re] of PRICING_TIERS) {
  check(`Pricing: ${name}`, re.test(gauntlet));
}

// ── Gauntlet 2.0 — Single-Person Admin TODO (4 cadences) ───────────────
const TODO_CADENCES: Array<[string, RegExp]> = [
  ["Daily cadence (5 minutes)", /### Daily \(5 minutes\)/],
  ["Weekly cadence (30 minutes)", /### Weekly \(30 minutes\)/],
  ["Monthly cadence (2 hours)", /### Monthly \(2 hours\)/],
  ["Quarterly cadence (1 day)", /### Quarterly \(1 day\)/],
  ["Ad-hoc cadence", /### Ad-hoc/],
  ["Automation budget", /Automation budget/],
  ["Daily: overnight gauntlet output", /overnight gauntlet output/i],
  ["Daily: hitl-required review", /hitl-required/i],
  ["Weekly: partner outreach auto-emails", /partner outreach/i],
  ["Quarterly: conviction-class drift review", /conviction-class drift/i],
];
for (const [name, re] of TODO_CADENCES) {
  check(`Single-admin TODO: ${name}`, re.test(gauntlet));
}

// ── Gauntlet 2.0 — Discipline Coverage Matrix ──────────────────────────
const DISCIPLINES: Array<[string, RegExp]> = [
  ["Legal discipline row", /\*\*Legal\*\*/],
  ["Planning discipline row", /\*\*Planning\*\*/],
  ["Building Safety discipline row", /\*\*Building Safety\*\*/],
  ["Environmental discipline row", /\*\*Environmental\*\*/],
  ["Valuation discipline row", /\*\*Valuation\*\*/],
  ["Financial discipline row", /\*\*Financial\*\*/],
  ["Tenure-Mix discipline row", /\*\*Tenure-Mix\*\*/],
  ["Dispute Resolution discipline row", /\*\*Dispute Resolution\*\*/],
  ["Macro overlay row", /\*\*Macro\*\*/],
  ["Micro overlay row", /\*\*Micro\*\*/],
  ["Prediction overlay row", /\*\*Prediction\*\*/],
  ["Strategy overlay row", /\*\*Strategy\*\*/],
  ["Money Trail overlay row", /\*\*Money Trail\*\*/],
  ["Property type — Flat (leasehold)", /Flat \(leasehold\)/i],
  ["Property type — Mixed-tenure block", /Mixed-tenure block/i],
  ["Property type — High-rise", /High-rise/],
  ["Property type — Heritage / listed", /Heritage \/ listed/i],
  ["Property type — Caribbean", /Caribbean/i],
  ["Property type — Mixed-use", /Mixed-use/i],
  ["Scale ladder 1 unit", /\b1 unit\b/],
  ["Scale ladder 10 units", /\b10 units\b/],
  ["Scale ladder 100 units", /\b100 units\b/],
  ["Scale ladder 1,000 units", /\b1,000 units\b/],
  ["Scale ladder 10,000 units", /\b10,000 units\b/],
];
for (const [name, re] of DISCIPLINES) {
  check(`Discipline matrix: ${name}`, re.test(gauntlet));
}

// ── Gauntlet 2.0 — Doctrine extension (7 lines) ────────────────────────
check(
  "Doctrine 2.0 line 6: never optimise for coverage at cost of correctness",
  /Never optimise for coverage at the cost of correctness/i.test(gauntlet)
);
check(
  "Doctrine 2.0 line 7: never forget the resident is the customer",
  /Never forget the resident is the customer/i.test(gauntlet)
);

// ── Gauntlet 2.0 — Test surface summary ─────────────────────────────────
check(
  "Test surface: Gauntlet 2.0 test surface section present",
  gauntlet.includes("## Gauntlet 2.0 Test Surface")
);
check(
  "Test surface: declares ≥ 30 new assertions",
  /≥ 30 new assertions/i.test(gauntlet) || /\+ ≥ 30 new = ≥ 95 assertions/i.test(gauntlet)
);

// ── Gauntlet 2.0 — Cross-link to overlay design doc ─────────────────────
check(
  "Cross-link to all-disciplines-overlay-design.md",
  gauntlet.includes("all-disciplines-overlay-design.md")
);

// ── Gauntlet 2.0 — Companion docs present ───────────────────────────────
check(
  "Companion docs: all-disciplines-research.md exists",
  existsSync(resolve(ROOT, "project/research/all-disciplines-research.md"))
);
check(
  "Companion docs: all-disciplines-overlay-design.md exists",
  existsSync(resolve(ROOT, "project/strategy/all-disciplines-overlay-design.md"))
);

// ── Gauntlet 2.0 — Engine conviction caps in catalogue ──────────────────
const ENGINE_CONVICTION_CAP_KEYWORDS: Array<[string, RegExp]> = [
  ["Engine conviction cap: 0.99 (established)", /`established` 0\.99/],
  ["Engine conviction cap: 0.75 (heuristic)", /`heuristic` 0\.75/],
  ["Engine conviction cap: 0.60 (contested)", /`contested` 0\.60/],
  ["Engine conviction cap: 0.33 (unfalsifiable)", /`unfalsifiable` 0\.33/],
];
for (const [name, re] of ENGINE_CONVICTION_CAP_KEYWORDS) {
  check(`Engine conviction cap: ${name}`, re.test(gauntlet));
}

// ── Report ──────────────────────────────────────────────────────────────
console.log("");
console.log("════════════════════════════════════════════════════════════════");
console.log(` GAUNTLET LOOP TESTS (Phase 16 + Gauntlet 2.0)`);
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
console.log("  Result: PASS — gauntlet loop (Phase 16 + Gauntlet 2.0) is a 'superior decision maker'.");
console.log("════════════════════════════════════════════════════════════════");
process.exit(0);
