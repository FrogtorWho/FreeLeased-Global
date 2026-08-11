#!/usr/bin/env node
// scripts/validate-caribbean-frameworks.mjs
//
// Node-based validator for the four framework JSONs (UK, BB, JM, KY).
// Pure JS — no bun/runtime required. Validates that every URL parses,
// every record has the required fields, and the v1.1 caribbean fields
// are populated correctly.
//
// USAGE:   node scripts/validate-caribbean-frameworks.mjs
//
// EXIT:    0 if every assertion passes; 1 otherwise.

import * as fs from "node:fs";
import * as path from "node:path";

const PROJECT_ROOT = process.cwd();

// ─────────────────────────────────────────────────────────────────────────────
// 1. Helpers (mirror of the schema's hand-rolled validator, simplified).
// ─────────────────────────────────────────────────────────────────────────────

function isString(x) { return typeof x === "string" && x.length > 0; }
function isUrl(x) {
  if (typeof x !== "string") return false;
  try {
    const u = new URL(x);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}
function isIsoDatetime(x) {
  if (typeof x !== "string") return false;
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  return iso.test(x) && !Number.isNaN(Date.parse(x));
}
const CONVICTION_CLASSES = new Set(["established", "heuristic", "contested", "unfalsifiable"]);
const LEGAL_SYSTEMS = new Set(["common-law", "civil-law", "mixed"]);
const SIGNIFICANCE_LEVELS = new Set(["landmark", "leading", "persuasive", "minor"]);
const PSEUDONYM_RE = /^\[PERSON_NAME\]$|^[a-z0-9-]+$/;
const GAZETTE_PORTABILITY = new Set(["static", "search-only", "js-rendered", "unknown"]);
const REMEDY_KINDS = new Set(["rtm-equivalent", "strata-corporation-action", "tribunal-petition", "court-petition", "agency-complaint", "registration-action", "other"]);
const GOVERNANCE_PATHS = new Set(["rtm-claim-notice", "unanimous-resolution", "unit-entitlement-vote", "tribunal-application", "court-application", "agency-letter", "registry-registration", "other"]);

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    failures.push(`${name}: ${e.message}`);
    console.log(`  ✗ ${name}\n      ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Framework loaders.
// ─────────────────────────────────────────────────────────────────────────────

function loadFramework(code) {
  const file = path.join(PROJECT_ROOT, "src/data/frameworks", `${code.toLowerCase()}-framework.json`);
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function validateFramework(code, fw) {
  const errors = [];
  if (!isString(fw.jurisdiction?.code)) errors.push("jurisdiction.code");
  if (!isString(fw.jurisdiction?.name)) errors.push("jurisdiction.name");
  if (!LEGAL_SYSTEMS.has(fw.jurisdiction?.legalSystem)) errors.push("jurisdiction.legalSystem");
  if (!isString(fw.jurisdiction?.constitutionalFoundation)) errors.push("jurisdiction.constitutionalFoundation");
  if (!isUrl(fw.jurisdiction?.officialGazette)) errors.push("jurisdiction.officialGazette");
  if (!isIsoDatetime(fw.jurisdiction?.lastVerified)) errors.push("jurisdiction.lastVerified");
  if (!PSEUDONYM_RE.test(fw.jurisdiction?.contributorPseudonym || "")) errors.push("jurisdiction.contributorPseudonym");

  // v1.1 optional fields
  if (fw.jurisdiction?.language !== undefined && !isString(fw.jurisdiction.language)) errors.push("jurisdiction.language");
  if (fw.jurisdiction?.finalAppellateCourt !== undefined && !isString(fw.jurisdiction.finalAppellateCourt)) errors.push("jurisdiction.finalAppellateCourt");
  if (fw.jurisdiction?.gazettePortability !== undefined && !GAZETTE_PORTABILITY.has(fw.jurisdiction.gazettePortability)) errors.push("jurisdiction.gazettePortability");

  for (const a of fw.primaryActs || []) {
    if (!isString(a.id)) errors.push(`primaryActs.${a.id}.id`);
    if (!isString(a.shortTitle)) errors.push(`primaryActs.${a.id}.shortTitle`);
    if (!CONVICTION_CLASSES.has(a.conviction)) errors.push(`primaryActs.${a.id}.conviction`);
    if (!isUrl(a.sourceUrl)) errors.push(`primaryActs.${a.id}.sourceUrl`);
  }
  for (const r of fw.remedies || []) {
    if (!isString(r.id)) errors.push(`remedies.${r.id}.id`);
    if (!isString(r.label)) errors.push(`remedies.${r.id}.label`);
    if (!isString(r.description)) errors.push(`remedies.${r.id}.description`);
    if (!isString(r.applicableWhere)) errors.push(`remedies.${r.id}.applicableWhere`);
    if (!Array.isArray(r.legalBasis)) errors.push(`remedies.${r.id}.legalBasis`);
    if (r.remedyKind !== undefined && !REMEDY_KINDS.has(r.remedyKind)) errors.push(`remedies.${r.id}.remedyKind`);
    if (r.governancePath !== undefined && !GOVERNANCE_PATHS.has(r.governancePath)) errors.push(`remedies.${r.id}.governancePath`);
  }
  return errors;
}

function extractUrls(fw) {
  const urls = [fw.jurisdiction.officialGazette];
  for (const a of fw.primaryActs || []) {
    urls.push(a.sourceUrl);
    if (a.officialPdfUrl) urls.push(a.officialPdfUrl);
  }
  for (const r of fw.regulations || []) urls.push(r.sourceUrl);
  for (const si of fw.statutoryInstruments || []) urls.push(si.sourceUrl);
  for (const ra of fw.reformAmendments || []) urls.push(ra.sourceUrl);
  for (const c of fw.leadingCases || []) urls.push(c.sourceUrl);
  for (const pr of fw.proceduralRules || []) urls.push(pr.sourceUrl);
  for (const eb of fw.enforcementBodies || []) urls.push(eb.contactUrl);
  return urls;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tests.
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n[1] Load all four frameworks");
const uk = loadFramework("UK");
const bb = loadFramework("BB");
const jm = loadFramework("JM");
const ky = loadFramework("KY");

test("UK loads", () => assert(uk.jurisdiction.code === "UK", "UK code"));
test("BB loads", () => assert(bb.jurisdiction.code === "BB", "BB code"));
test("JM loads", () => assert(jm.jurisdiction.code === "JM", "JM code"));
test("KY loads", () => assert(ky.jurisdiction.code === "KY", "KY code"));

console.log("\n[2] Each framework passes structural validation");
test("UK structural", () => {
  const errs = validateFramework("UK", uk);
  assertEqual(errs.length, 0, `UK errors: ${errs.join(", ")}`);
});
test("BB structural", () => {
  const errs = validateFramework("BB", bb);
  assertEqual(errs.length, 0, `BB errors: ${errs.join(", ")}`);
});
test("JM structural", () => {
  const errs = validateFramework("JM", jm);
  assertEqual(errs.length, 0, `JM errors: ${errs.join(", ")}`);
});
test("KY structural", () => {
  const errs = validateFramework("KY", ky);
  assertEqual(errs.length, 0, `KY errors: ${errs.join(", ")}`);
});

console.log("\n[3] Per-jurisdiction counts");
test("UK ≥ 10 primary acts", () => assert(uk.primaryActs.length >= 10, `UK has ${uk.primaryActs.length}`));
test("BB ≥ 6 primary acts", () => assert(bb.primaryActs.length >= 6, `BB has ${bb.primaryActs.length}`));
test("JM ≥ 6 primary acts", () => assert(jm.primaryActs.length >= 6, `JM has ${jm.primaryActs.length}`));
test("KY ≥ 6 primary acts", () => assert(ky.primaryActs.length >= 6, `KY has ${ky.primaryActs.length}`));

console.log("\n[4] All URLs parse");
test("UK URLs parse", () => {
  const urls = extractUrls(uk);
  for (const u of urls) {
    if (!isUrl(u)) throw new Error(`Bad URL: ${u}`);
  }
});
test("BB URLs parse", () => {
  const urls = extractUrls(bb);
  for (const u of urls) {
    if (!isUrl(u)) throw new Error(`Bad URL: ${u}`);
  }
});
test("JM URLs parse", () => {
  const urls = extractUrls(jm);
  for (const u of urls) {
    if (!isUrl(u)) throw new Error(`Bad URL: ${u}`);
  }
});
test("KY URLs parse", () => {
  const urls = extractUrls(ky);
  for (const u of urls) {
    if (!isUrl(u)) throw new Error(`Bad URL: ${u}`);
  }
});

console.log("\n[5] v1.1 caribbean fields populated");
test("JM gazettePortability = search-only", () => assertEqual(jm.jurisdiction.gazettePortability, "search-only", "JM gazettePortability"));
test("KY gazettePortability = js-rendered", () => assertEqual(ky.jurisdiction.gazettePortability, "js-rendered", "KY gazettePortability"));
test("BB gazettePortability = static", () => assertEqual(bb.jurisdiction.gazettePortability, "static", "BB gazettePortability"));
test("UK gazettePortability = static", () => assertEqual(uk.jurisdiction.gazettePortability, "static", "UK gazettePortability"));
test("JM finalAppellateCourt includes CCJ", () => assert(jm.jurisdiction.finalAppellateCourt?.includes("CCJ"), `JM: ${jm.jurisdiction.finalAppellateCourt}`));
test("KY finalAppellateCourt includes Privy Council", () => assert(ky.jurisdiction.finalAppellateCourt?.includes("Privy Council"), `KY: ${ky.jurisdiction.finalAppellateCourt}`));
test("BB finalAppellateCourt = CCJ", () => assertEqual(bb.jurisdiction.finalAppellateCourt, "CCJ", "BB CCJ"));
test("UK finalAppellateCourt = UK Supreme Court", () => assertEqual(uk.jurisdiction.finalAppellateCourt, "UK Supreme Court", "UK Supreme Court"));

console.log("\n[6] Conviction profile matches expectations");
test("UK 100% primary acts established", () => {
  const heuristic = uk.primaryActs.filter((a) => a.conviction === "heuristic").length;
  assertEqual(heuristic, 0, `UK has ${heuristic} heuristic acts`);
});
test("BB 100% primary acts established", () => {
  const heuristic = bb.primaryActs.filter((a) => a.conviction === "heuristic").length;
  assertEqual(heuristic, 0, `BB has ${heuristic} heuristic acts`);
});
test("JM has ≥ 1 heuristic primary act", () => {
  const heuristic = jm.primaryActs.filter((a) => a.conviction === "heuristic").length;
  assert(heuristic >= 1, `JM has ${heuristic} heuristic acts`);
});
test("KY has ≥ 1 heuristic primary act", () => {
  const heuristic = ky.primaryActs.filter((a) => a.conviction === "heuristic").length;
  assert(heuristic >= 1, `KY has ${heuristic} heuristic acts`);
});

console.log("\n[7] v1.1 remedyKind + governancePath populated");
test("Every JM remedy has BOTH remedyKind AND governancePath", () => {
  for (const r of jm.remedies) {
    if (!REMEDY_KINDS.has(r.remedyKind)) throw new Error(`${r.id} missing remedyKind`);
    if (!GOVERNANCE_PATHS.has(r.governancePath)) throw new Error(`${r.id} missing governancePath`);
  }
});
test("Every KY remedy has BOTH remedyKind AND governancePath", () => {
  for (const r of ky.remedies) {
    if (!REMEDY_KINDS.has(r.remedyKind)) throw new Error(`${r.id} missing remedyKind`);
    if (!GOVERNANCE_PATHS.has(r.governancePath)) throw new Error(`${r.id} missing governancePath`);
  }
});
test("UK RTM remedy has remedyKind=rtm-equivalent", () => {
  const rtm = uk.remedies.find((r) => r.id === "uk-remedy-rtm-acquisition");
  assert(rtm, "uk-remedy-rtm-acquisition missing");
  assertEqual(rtm.remedyKind, "rtm-equivalent", "RTM remedyKind");
  assertEqual(rtm.governancePath, "rtm-claim-notice", "RTM governancePath");
});

console.log("\n[8] Cross-link integrity (every legalBasis references an existing primary act)");
test("JM cross-links resolve", () => {
  const ids = new Set(jm.primaryActs.map((a) => a.id));
  for (const r of jm.remedies) {
    for (const ref of r.legalBasis) {
      if (!ids.has(ref)) throw new Error(`JM remedy ${r.id} references unknown act ${ref}`);
    }
  }
  for (const r of jm.reformAmendments || []) {
    if (!ids.has(r.amendsActId)) throw new Error(`JM reform ${r.id} references unknown act ${r.amendsActId}`);
  }
  for (const c of jm.leadingCases || []) {
    for (const ref of c.relevantActs) {
      if (!ids.has(ref)) throw new Error(`JM case ${c.id} references unknown act ${ref}`);
    }
  }
});
test("KY cross-links resolve", () => {
  const ids = new Set(ky.primaryActs.map((a) => a.id));
  for (const r of ky.remedies) {
    for (const ref of r.legalBasis) {
      if (!ids.has(ref)) throw new Error(`KY remedy ${r.id} references unknown act ${ref}`);
    }
  }
  for (const r of ky.reformAmendments || []) {
    if (!ids.has(r.amendsActId)) throw new Error(`KY reform ${r.id} references unknown act ${r.amendsActId}`);
  }
  for (const c of ky.leadingCases || []) {
    for (const ref of c.relevantActs) {
      if (!ids.has(ref)) throw new Error(`KY case ${c.id} references unknown act ${ref}`);
    }
  }
});

console.log("\n[9] Fact-check-register sanity (Jamaica strata act, not the 1958 condo act)");
test("JM strata act id is jm-strata (not 'jm-condo-1958')", () => {
  const ids = jm.primaryActs.map((a) => a.id);
  assert(ids.includes("jm-strata"), "jm-strata missing");
  assert(!ids.some((id) => id.includes("1958")), "1958 condo act reference still present");
});
test("KY strata act is 2013 Revision (not 2014)", () => {
  const stra = ky.primaryActs.find((a) => a.id === "ky-stra");
  assert(stra, "ky-stra missing");
  assert(stra.shortTitle.includes("2013 Revision"), `KY STRA: ${stra.shortTitle}`);
  assert(!stra.shortTitle.includes("2014 Revision"), "KY STRA still says 2014 Revision");
});

console.log("\n[10] Total counts (the headline numbers for the analysis doc)");
test("UK has 27 URLs (schema extractUrls)", () => assertEqual(extractUrls(uk).length, 27, "UK URL count"));
test("BB has 18 URLs (schema extractUrls)", () => assertEqual(extractUrls(bb).length, 18, "BB URL count"));
test("JM has 18 URLs (schema extractUrls)", () => assertEqual(extractUrls(jm).length, 18, "JM URL count"));
test("KY has 17 URLs (schema extractUrls)", () => assertEqual(extractUrls(ky).length, 17, "KY URL count"));
test("UK has 21 unique URLs", () => assertEqual(new Set(extractUrls(uk)).size, 21, "UK unique URLs"));
test("BB has 3 unique URLs (high duplication — barbadoslawcourts.gov.bb fallback)", () => assertEqual(new Set(extractUrls(bb)).size, 3, "BB unique URLs"));
test("JM has 5 unique URLs", () => assertEqual(new Set(extractUrls(jm)).size, 5, "JM unique URLs"));
test("KY has 5 unique URLs", () => assertEqual(new Set(extractUrls(ky)).size, 5, "KY unique URLs"));

console.log("");
console.log(`Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  console.error("");
  console.error("Failures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
process.exit(0);
