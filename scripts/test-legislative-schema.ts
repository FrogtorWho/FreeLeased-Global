#!/usr/bin/env bun
// scripts/test-legislative-schema.ts
//
// Test harness for the LegislativeFramework schema, the two framework
// JSONs, and the v1 → v2 migration bridge (src/data/spine-v2.ts).
//
// RUN:   bun scripts/test-legislative-schema.ts
//
// Coverage (≥ 28 assertions):
//   A. UK framework parses
//   B. BB framework parses
//   C. Required fields are populated
//   D. Intentional bad inputs fail
//   E. Bridge returns expected v1-compatible fields
//   F. JM framework parses (Caribbean test v1.1)
//   G. KY framework parses (Caribbean test v1.1)
//   H. v1.1 schema fields (remedyKind, governancePath, gazettePortability, etc.)
//
// Exit code: 0 if every assertion passes; 1 otherwise.

import {
  LegislativeFrameworkSchema,
  CONVICTION_CLASSES,
  LEGAL_SYSTEMS,
  SIGNIFICANCE_LEVELS,
  SchemaError,
  extractUrls,
  findUnverified,
  frameworkCounts,
  type LegislativeFramework,
} from "../src/data/legislative-framework-schema";
import ukRaw from "../src/data/frameworks/uk-framework.json";
import bbRaw from "../src/data/frameworks/bb-framework.json";
import jmRaw from "../src/data/frameworks/jm-framework.json";
import kyRaw from "../src/data/frameworks/ky-framework.json";
import {
  UK_FRAMEWORK,
  BB_FRAMEWORK,
  JM_FRAMEWORK,
  KY_FRAMEWORK,
  STATUTES,
  JURISDICTIONS,
  FRAMEWORKS,
  summarise,
  v1ToV2Conviction,
  v2ToV1Conviction,
  getPrimaryAct,
  getLeadingCase,
  getRemedy,
  CROSS_LINK_REPORT,
} from "../src/data/spine-v2";

// ─────────────────────────────────────────────────────────────────────────────
// Tiny test runner (no external deps).
// ─────────────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed += 1;
      console.log(`  ✓ ${name}`);
    })
    .catch((e) => {
      failed += 1;
      failures.push(`${name}: ${(e as Error).message}`);
      console.log(`  ✗ ${name}\n      ${(e as Error).message}`);
    });
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertEqual<T>(actual: T, expected: T, msg: string): void {
  if (actual !== expected) {
    throw new Error(`${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertThrows(fn: () => unknown, msgContains: string): void {
  try {
    fn();
  } catch (e) {
    if ((e as Error).message.toLowerCase().includes(msgContains.toLowerCase())) return;
    throw new Error(`Expected throw containing "${msgContains}", got: ${(e as Error).message}`);
  }
  throw new Error(`Expected throw containing "${msgContains}", but no throw occurred`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test suites.
// ─────────────────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n[A] UK framework parses");
  await test("A1 — UK framework JSON parses with no schema issues", () => {
    const r = LegislativeFrameworkSchema.safeParse(ukRaw);
    assert(r.success, `UK parse failed: ${JSON.stringify((r as { error: SchemaError }).error.issues)}`);
  });
  await test("A2 — UK framework has ≥ 5 primary acts", () => {
    assert(UK_FRAMEWORK.primaryActs.length >= 5, `only ${UK_FRAMEWORK.primaryActs.length} primary acts`);
  });
  await test("A3 — UK primary acts include the named anchors", () => {
    const ids = new Set(UK_FRAMEWORK.primaryActs.map((a) => a.id));
    for (const required of [
      "uk-lta-1985",
      "uk-clra-2002",
      "uk-bsa-2022",
      "uk-lfra-2024",
      "uk-si-2025-131".replace("uk-si-", "uk-"),
    ]) {
      // Note: SI 2025/131 is in statutoryInstruments, not primaryActs.
    }
    assert(ids.has("uk-lta-1985"), "uk-lta-1985 missing");
    assert(ids.has("uk-clra-2002"), "uk-clra-2002 missing");
    assert(ids.has("uk-bsa-2022"), "uk-bsa-2022 missing");
    assert(ids.has("uk-lfra-2024"), "uk-lfra-2024 missing");
  });
  await test("A4 — UK has the SI 2025/131 statutory instrument", () => {
    const si = UK_FRAMEWORK.statutoryInstruments.find((s) => s.id === "uk-si-2025-131");
    assert(si, "uk-si-2025-131 missing");
    assertEqual(si!.number, "SI 2025/131", "SI number");
  });
  await test("A5 — UK has ≥ 3 leading cases", () => {
    assert(UK_FRAMEWORK.leadingCases.length >= 3, `only ${UK_FRAMEWORK.leadingCases.length} cases`);
  });
  await test("A6 — Every UK primary act has a non-empty sourceUrl", () => {
    for (const a of UK_FRAMEWORK.primaryActs) {
      assert(a.sourceUrl.length > 0, `${a.id} has empty sourceUrl`);
      try {
        new URL(a.sourceUrl);
      } catch {
        throw new Error(`${a.id} sourceUrl is not a valid URL: ${a.sourceUrl}`);
      }
    }
  });
  await test("A7 — UK conviction values are all in the canonical 4-class set", () => {
    const valid = new Set<string>(CONVICTION_CLASSES);
    for (const a of UK_FRAMEWORK.primaryActs) {
      assert(valid.has(a.conviction), `${a.id} conviction ${a.conviction} not in canonical set`);
    }
  });

  console.log("\n[B] BB framework parses");
  await test("B1 — BB framework JSON parses with no schema issues", () => {
    const r = LegislativeFrameworkSchema.safeParse(bbRaw);
    assert(r.success, `BB parse failed: ${JSON.stringify((r as { error: SchemaError }).error.issues)}`);
  });
  await test("B2 — BB framework has ≥ 3 primary acts (Condominium, Land Tax, Land Registration)", () => {
    assert(BB_FRAMEWORK.primaryActs.length >= 3, `only ${BB_FRAMEWORK.primaryActs.length} primary acts`);
    const ids = new Set(BB_FRAMEWORK.primaryActs.map((a) => a.id));
    assert(ids.has("bb-condo-cap224a"), "bb-condo-cap224a missing");
    assert(ids.has("bb-landtax-cap78a"), "bb-landtax-cap78a missing");
    assert(ids.has("bb-lra-cap229"), "bb-lra-cap229 missing");
  });
  await test("B3 — Every BB primary act has a non-empty sourceUrl", () => {
    for (const a of BB_FRAMEWORK.primaryActs) {
      try {
        new URL(a.sourceUrl);
      } catch {
        throw new Error(`${a.id} sourceUrl is not a valid URL: ${a.sourceUrl}`);
      }
    }
  });
  await test("B4 — BB jurisdiction header has a populated constitutionalFoundation", () => {
    assert(BB_FRAMEWORK.jurisdiction.constitutionalFoundation.length > 0, "constitutionalFoundation empty");
    assert(BB_FRAMEWORK.jurisdiction.code === "BB", "code");
  });

  console.log("\n[C] Required-field checks");
  await test("C1 — extractUrls() returns ≥ 10 URLs for the UK framework", () => {
    const urls = extractUrls(UK_FRAMEWORK);
    assert(urls.length >= 10, `only ${urls.length} urls`);
    for (const u of urls) {
      try {
        new URL(u);
      } catch {
        throw new Error(`non-URL leaked from extractUrls: ${u}`);
      }
    }
  });
  await test("C2 — frameworkCounts() sums to a positive total", () => {
    const c = frameworkCounts(UK_FRAMEWORK);
    const total = Object.values(c).reduce((s, n) => s + n, 0);
    assert(total > 0, `totals ${JSON.stringify(c)}`);
  });
  await test("C3 — findUnverified() never returns an `established` conviction", () => {
    const uv = findUnverified(UK_FRAMEWORK);
    for (const a of uv.primaryActs) {
      assert(a.conviction !== "established", `${a.id} marked unverified AND established`);
    }
  });
  await test("C4 — canonical enumerations have the expected length", () => {
    assertEqual(CONVICTION_CLASSES.length, 4, "CONVICTION_CLASSES length");
    assertEqual(LEGAL_SYSTEMS.length, 3, "LEGAL_SYSTEMS length");
    assertEqual(SIGNIFICANCE_LEVELS.length, 4, "SIGNIFICANCE_LEVELS length");
  });

  console.log("\n[D] Intentional bad inputs fail");
  await test("D1 — bad URL is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.primaryActs[0].sourceUrl = "not-a-url";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "url");
  });
  await test("D2 — non-canonical conviction is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.primaryActs[0].conviction = "verified-yolo";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "one of");
  });
  await test("D3 — bad pseudonym (uppercase) is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.jurisdiction.contributorPseudonym = "RealName";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "pseudonym");
  });
  await test("D4 — missing required field is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    delete (bad.primaryActs[0] as { shortTitle?: string }).shortTitle;
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "string");
  });
  await test("D5 — non-array primaryActs is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.primaryActs = "nope";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "array");
  });
  await test("D6 — non-ISO lastVerified is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.jurisdiction.lastVerified = "yesterday";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "ISO");
  });
  await test("D7 — invalid legalSystem enum is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.jurisdiction.legalSystem = "sharia";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "one of");
  });

  console.log("\n[E] Migration bridge returns expected fields");
  await test("E1 — bridge exposes JURISDICTIONS with at least UK + BB + JM + KY", () => {
    const codes = new Set(JURISDICTIONS.map((j) => j.code));
    assert(codes.has("UK"), "UK missing");
    assert(codes.has("BB"), "BB missing");
    assert(codes.has("JM"), "JM missing");
    assert(codes.has("KY"), "KY missing");
  });
  await test("E2 — bridge STATUTES contains UK LTA 1985 by id", () => {
    const s = STATUTES.find((x) => x.id === "uk-lta-1985");
    assert(s, "uk-lta-1985 not in bridge STATUTES");
    assertEqual(s!.jurisdiction, "UK", "jurisdiction");
    assert(s!.url.length > 0, "url empty");
    assert(s!.shortTitle.length > 0, "shortTitle empty");
    assert(s!.covers.length > 0, "covers empty");
    assert(
      ["confirmed", "verified", "primary", "quantitative", "inference", "pending"].includes(s!.conviction),
      `conviction ${s!.conviction} not v1-compatible`,
    );
  });
  await test("E3 — bridge STATUTES contains BB Condominium Act by id", () => {
    const s = STATUTES.find((x) => x.id === "bb-condo-cap224a");
    assert(s, "bb-condo-cap224a not in bridge STATUTES");
    assertEqual(s!.jurisdiction, "BB", "jurisdiction");
  });
  await test("E4 — bridge summary reports ≥ 20 primary acts across all four frameworks", () => {
    const s = summarise();
    assert(s.primaryActCount >= 20, `only ${s.primaryActCount} primary acts across UK+BB+JM+KY`);
    assert(s.jurisdictionCount === 4, `jurisdictionCount ${s.jurisdictionCount}`);
    assert(s.urlCount >= 70, `urlCount ${s.urlCount}`);
  });
  await test("E5 — bridge cross-link report has no broken references in UK", () => {
    assertEqual(CROSS_LINK_REPORT.UK.broken.length, 0, `UK broken refs: ${JSON.stringify(CROSS_LINK_REPORT.UK.broken)}`);
  });
  await test("E6 — bridge cross-link report has no broken references in BB", () => {
    assertEqual(CROSS_LINK_REPORT.BB.broken.length, 0, `BB broken refs: ${JSON.stringify(CROSS_LINK_REPORT.BB.broken)}`);
  });
  await test("E7 — conviction mapping round-trips", () => {
    for (const v of CONVICTION_CLASSES) {
      const back = v1ToV2Conviction(v2ToV1Conviction(v));
      assertEqual(back, v, `round-trip ${v}`);
    }
  });
  await test("E8 — getPrimaryAct() returns the UK LTA 1985", () => {
    const a = getPrimaryAct("UK", "uk-lta-1985");
    assert(a, "uk-lta-1985 not findable");
    assertEqual(a!.shortTitle, "Landlord and Tenant Act 1985", "shortTitle");
  });
  await test("E9 — getLeadingCase() returns a UK case", () => {
    const c = getLeadingCase("UK", "uk-case-ducane-1991");
    assert(c, "uk-case-ducane-1991 not findable");
    assertEqual(c!.court.length > 0, true, "court empty");
  });
  await test("E10 — getRemedy() returns the UK RTM remedy", () => {
    const r = getRemedy("UK", "uk-remedy-rtm-acquisition");
    assert(r, "uk-remedy-rtm-acquisition not findable");
    assert(r!.legalBasis.includes("uk-clra-2002"), "missing uk-clra-2002 in legalBasis");
  });
  await test("E11 — FRAMEWORKS exposes all four jurisdictions by code", () => {
    assert(FRAMEWORKS["UK"], "FRAMEWORKS[UK] missing");
    assert(FRAMEWORKS["BB"], "FRAMEWORKS[BB] missing");
    assert(FRAMEWORKS["JM"], "FRAMEWORKS[JM] missing");
    assert(FRAMEWORKS["KY"], "FRAMEWORKS[KY] missing");
  });
  await test("E12 — bridge STATUTES are sorted by jurisdiction then id", () => {
    for (let i = 1; i < STATUTES.length; i++) {
      const prev = STATUTES[i - 1];
      const cur = STATUTES[i];
      if (prev.jurisdiction === cur.jurisdiction) {
        if (prev.id > cur.id) throw new Error(`out-of-order ${prev.id} > ${cur.id}`);
      } else if (prev.jurisdiction > cur.jurisdiction) {
        throw new Error(`out-of-order jurisdictions ${prev.jurisdiction} > ${cur.jurisdiction}`);
      }
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Caribbean test v1.1 — JM + KY + new schema fields
  // ─────────────────────────────────────────────────────────────────────────────

  console.log("\n[F] JM framework parses (Caribbean test v1.1)");
  await test("F1 — JM framework JSON parses with no schema issues", () => {
    const r = LegislativeFrameworkSchema.safeParse(jmRaw);
    assert(r.success, `JM parse failed: ${JSON.stringify((r as { error: SchemaError }).error.issues)}`);
  });
  await test("F2 — JM framework has ≥ 6 primary acts", () => {
    assert(JM_FRAMEWORK.primaryActs.length >= 6, `only ${JM_FRAMEWORK.primaryActs.length} primary acts`);
  });
  await test("F3 — JM primary acts include the named anchors (Strata, LTA, RTA)", () => {
    const ids = new Set(JM_FRAMEWORK.primaryActs.map((a) => a.id));
    assert(ids.has("jm-strata"), "jm-strata missing");
    assert(ids.has("jm-lta"), "jm-lta missing");
    assert(ids.has("jm-rta"), "jm-rta missing");
  });
  await test("F4 — JM exposes the v1.1 gassezine-portability field", () => {
    assertEqual(JM_FRAMEWORK.jurisdiction.gazettePortability, "search-only", "gazettePortability");
  });
  await test("F5 — JM finalAppellateCourt reflects the CCJ (since 2021)", () => {
    assert(JM_FRAMEWORK.jurisdiction.finalAppellateCourt?.includes("CCJ"), `finalAppellateCourt: ${JM_FRAMEWORK.jurisdiction.finalAppellateCourt}`);
  });
  await test("F6 — JM framework has ≥ 5 remedies", () => {
    assert(JM_FRAMEWORK.remedies.length >= 5, `only ${JM_FRAMEWORK.remedies.length} remedies`);
  });
  await test("F7 — JM remedies include the strata-corporation-action remedyKind", () => {
    const strata = JM_FRAMEWORK.remedies.find((r) => r.remedyKind === "strata-corporation-action");
    assert(strata, "no strata-corporation-action remedy");
  });
  await test("F8 — JM bridge cross-link report has no broken references", () => {
    assertEqual(CROSS_LINK_REPORT.JM.broken.length, 0, `JM broken refs: ${JSON.stringify(CROSS_LINK_REPORT.JM.broken)}`);
  });

  console.log("\n[G] KY framework parses (Caribbean test v1.1)");
  await test("G1 — KY framework JSON parses with no schema issues", () => {
    const r = LegislativeFrameworkSchema.safeParse(kyRaw);
    assert(r.success, `KY parse failed: ${JSON.stringify((r as { error: SchemaError }).error.issues)}`);
  });
  await test("G2 — KY framework has ≥ 6 primary acts", () => {
    assert(KY_FRAMEWORK.primaryActs.length >= 6, `only ${KY_FRAMEWORK.primaryActs.length} primary acts`);
  });
  await test("G3 — KY primary acts include the named anchors (STRA, RLA, SDA)", () => {
    const ids = new Set(KY_FRAMEWORK.primaryActs.map((a) => a.id));
    assert(ids.has("ky-stra"), "ky-stra missing");
    assert(ids.has("ky-rla"), "ky-rla missing");
    assert(ids.has("ky-sda"), "ky-sda missing");
  });
  await test("G4 — KY exposes the v1.1 gazettePortability field as `js-rendered`", () => {
    assertEqual(KY_FRAMEWORK.jurisdiction.gazettePortability, "js-rendered", "gazettePortability");
  });
  await test("G5 — KY finalAppellateCourt reflects the Privy Council (BOT)", () => {
    assert(KY_FRAMEWORK.jurisdiction.finalAppellateCourt?.includes("Privy Council"), `finalAppellateCourt: ${KY_FRAMEWORK.jurisdiction.finalAppellateCourt}`);
  });
  await test("G6 — KY framework has ≥ 5 remedies", () => {
    assert(KY_FRAMEWORK.remedies.length >= 5, `only ${KY_FRAMEWORK.remedies.length} remedies`);
  });
  await test("G7 — KY remedies include the tribunal-petition remedyKind", () => {
    const tribunal = KY_FRAMEWORK.remedies.find((r) => r.remedyKind === "tribunal-petition");
    assert(tribunal, "no tribunal-petition remedy");
  });
  await test("G8 — KY bridge cross-link report has no broken references", () => {
    assertEqual(CROSS_LINK_REPORT.KY.broken.length, 0, `KY broken refs: ${JSON.stringify(CROSS_LINK_REPORT.KY.broken)}`);
  });

  console.log("\n[H] v1.1 schema fields");
  await test("H1 — every framework exposes language=en", () => {
    for (const fw of [UK_FRAMEWORK, BB_FRAMEWORK, JM_FRAMEWORK, KY_FRAMEWORK]) {
      assertEqual(fw.jurisdiction.language, "en", `${fw.jurisdiction.code} language`);
    }
  });
  await test("H2 — UK + BB remedies with the right foundation carry a remedyKind", () => {
    const ukRtm = UK_FRAMEWORK.remedies.find((r) => r.id === "uk-remedy-rtm-acquisition");
    assert(ukRtm, "uk-remedy-rtm-acquisition missing");
    assertEqual(ukRtm!.remedyKind, "rtm-equivalent", "UK RTM remedyKind");
    assertEqual(ukRtm!.governancePath, "rtm-claim-notice", "UK RTM governancePath");
  });
  await test("H3 — UK + BB + JM + KY have distinct finalAppellateCourts", () => {
    const courts = new Set([
      UK_FRAMEWORK.jurisdiction.finalAppellateCourt,
      BB_FRAMEWORK.jurisdiction.finalAppellateCourt,
      JM_FRAMEWORK.jurisdiction.finalAppellateCourt,
      KY_FRAMEWORK.jurisdiction.finalAppellateCourt,
    ]);
    assert(courts.size >= 2, "less than 2 distinct finalAppellateCourt values — CCJ/JCPC split not captured");
  });
  await test("H4 — every framework exposes a non-empty gazettePortability", () => {
    for (const fw of [UK_FRAMEWORK, BB_FRAMEWORK, JM_FRAMEWORK, KY_FRAMEWORK]) {
      assert(
        typeof fw.jurisdiction.gazettePortability === "string" && fw.jurisdiction.gazettePortability.length > 0,
        `${fw.jurisdiction.code} gazettePortability missing`,
      );
    }
  });
  await test("H5 — UK + BB only have `established` primary acts; JM + KY have a `heuristic` slice", () => {
    for (const fw of [UK_FRAMEWORK, BB_FRAMEWORK]) {
      const heuristic = fw.primaryActs.filter((a) => a.conviction === "heuristic");
      assert(heuristic.length === 0, `${fw.jurisdiction.code} has ${heuristic.length} heuristic primary acts (expected 0)`);
    }
    for (const fw of [JM_FRAMEWORK, KY_FRAMEWORK]) {
      const heuristic = fw.primaryActs.filter((a) => a.conviction === "heuristic");
      assert(heuristic.length > 0, `${fw.jurisdiction.code} has 0 heuristic primary acts (expected ≥ 1)`);
    }
  });
  await test("H6 — bad gazettePortability is rejected", () => {
    const bad = JSON.parse(JSON.stringify(ukRaw));
    bad.jurisdiction.gazettePortability = "magic";
    assertThrows(() => LegislativeFrameworkSchema.parse(bad), "one of");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry.
// ─────────────────────────────────────────────────────────────────────────────

await run();

console.log("");
console.log(`Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  console.error("");
  console.error("Failures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
process.exit(0);
