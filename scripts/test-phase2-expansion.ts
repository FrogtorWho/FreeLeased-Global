// scripts/test-phase2-expansion.ts
// Phase 2D Refinement 5 of 5: Test-suite expansion.
// Adds 15 new assertions that exercise the eval-harness labels and
// the dossier pipeline from the sample lease.
//
// Run:  node --experimental-strip-types scripts/test-phase2-expansion.ts
//   or: bun scripts/test-phase2-expansion.ts
//
// Self-contained: imports the inlined fairness ruleset (verbatim from
// src/lib/fairness.ts) so it doesn't depend on cross-module .ts
// resolution in Node.

import * as fs from "node:fs";
import * as path from "node:path";

// ── Verbatim copy of src/lib/fairness.ts ────────────────────────────────
type EvidenceClass = "established" | "heuristic" | "contested" | "unfalsifiable";
type Severity = "high" | "medium" | "low";

const CONFIDENCE_CAP: Record<EvidenceClass, number> = {
  established: 0.99, heuristic: 0.75, contested: 0.6, unfalsifiable: 0.33,
};

interface StatuteRule {
  id: string; topic: string; pattern: RegExp; citation: string;
  jurisdictions: string[] | "all"; severity: Severity; evidenceClass: EvidenceClass;
  explanation: string; rawConfidence: number;
}

const DEFAULT_RULES: StatuteRule[] = [
  { id: "entry-without-notice", topic: "Right to quiet enjoyment / notice of entry", pattern: /(landlord|lessor).{0,40}(enter|access).{0,40}(any\s*time|without\s*(notice|permission)|at\s*will)/i, citation: "Quiet enjoyment covenant", jurisdictions: "all", severity: "high", evidenceClass: "established", explanation: "Entry without notice violates quiet enjoyment.", rawConfidence: 0.9 },
  { id: "excessive-deposit", topic: "Security deposit limits", pattern: /(deposit|security).{0,30}(equal to|of)\s*(three|four|five|six|3|4|5|6)\s*months?/i, citation: "Deposit provisions", jurisdictions: "all", severity: "medium", evidenceClass: "heuristic", explanation: "Deposit of several months' rent may exceed the statutory cap.", rawConfidence: 0.7 },
  { id: "waive-repairs", topic: "Non-waivable repair duty", pattern: /(tenant|lessee).{0,40}(waives?|gives?\s*up|responsible for all).{0,40}(repair|habitab|structural)/i, citation: "Implied covenant to repair", jurisdictions: "all", severity: "high", evidenceClass: "established", explanation: "Landlord's duty to keep premises habitable is not waivable.", rawConfidence: 0.85 },
  { id: "penalty-late-fee", topic: "Unenforceable penalty", pattern: /(late\s*fee|penalty).{0,30}(\d{2,}%|per\s*day|compound)/i, citation: "Rule against penalties", jurisdictions: "all", severity: "medium", evidenceClass: "contested", explanation: "A late fee that functions as a penalty may be unenforceable.", rawConfidence: 0.6 },
  { id: "retaliatory-eviction", topic: "Retaliatory eviction", pattern: /(evict|terminate).{0,40}(complaint|report|authorit|repair request)/i, citation: "Security of tenure", jurisdictions: "all", severity: "high", evidenceClass: "heuristic", explanation: "Eviction in response to a complaint may be unlawful.", rawConfidence: 0.7 },
  { id: "uk-deposit-cap", topic: "Tenancy deposit cap (UK)", pattern: /(deposit|security)\b.{0,30}((six|seven|eight|nine|ten|[6-9]|1[0-2])\s*weeks?|(two|2|three|3)\s*months?)/i, citation: "Tenant Fees Act 2019, s.1 & Sch.1", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "Deposit capped at 5 weeks' rent for most ASTs.", rawConfidence: 0.9 },
  { id: "uk-banned-fees", topic: "Prohibited letting fees (UK)", pattern: /(admin(istration)?|renewal|inventory|check[-\s]?out|reference|tenancy\s*set[-\s]?up|credit\s*check)\s*fees?/i, citation: "Tenant Fees Act 2019, s.1", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "Admin/renewal/inventory fees generally prohibited.", rawConfidence: 0.9 },
  { id: "uk-fitness-waiver", topic: "Fitness for human habitation (UK)", pattern: /(let|rented|provided|taken)\s*(as[-\s]is|as\s*seen)|(tenant|lessee).{0,30}(waives?|accepts?).{0,25}(fitness|habitab|repair)/i, citation: "Homes (Fitness for Human Habitation) Act 2018", jurisdictions: ["UK"], severity: "medium", evidenceClass: "heuristic", explanation: "Fitness covenant cannot be contracted out of.", rawConfidence: 0.6 },
  { id: "uk-s20-consultation", topic: "Major-works consultation (s.20)", pattern: /((major|qualifying)\s+works?|works? of (improvement|repair)).{0,70}(without|no\b|not\b|regardless of).{0,25}(consult|notice|section\s*20|s\.?\s*20)/i, citation: "LTA 1985, s.20", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "s.20 consultation required for qualifying works > £250/leaseholder.", rawConfidence: 0.9 },
  { id: "uk-s167-forfeiture", topic: "Forfeiture for small/short arrears (s.167)", pattern: /(forfeit|re-?ent(er|ry)|terminat\w+\s+(the\s+)?lease|peaceable\s+re-?entry).{0,50}(arrears|non-?payment|unpaid|outstanding|service\s*charge)/i, citation: "CLRA 2002, s.167", jurisdictions: ["UK"], severity: "medium", evidenceClass: "heuristic", explanation: "Forfeiture restricted for small/short arrears.", rawConfidence: 0.6 },
  { id: "uk-bsa-remediation", topic: "Building-safety remediation charged to leaseholder", pattern: /(leaseholder|lessee|tenant|resident).{0,50}(liable|responsible|pay|charged|bear).{0,40}(cladding|remediation|building\s*safety|fire\s*safety|relevant\s*defect)/i, citation: "BSA 2022, Sch.8", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "BSA 2022 protects qualifying leaseholders from remediation costs.", rawConfidence: 0.85 },
];

function ruleApplies(rule: StatuteRule, jurisdiction: string): boolean {
  return rule.jurisdictions === "all" || rule.jurisdictions.includes(jurisdiction);
}

function segmentClauses(text: string): string[] {
  return text.split(/\n+|(?<=[.;])\s+/).map((c) => c.trim()).filter((c) => c.length > 0);
}

function analyzeLease(text: string, jurisdiction = "all") {
  const clauses = segmentClauses(text ?? "");
  const flags: Array<{ ruleId: string; topic: string; clauseExcerpt: string; citation: string; severity: Severity; evidenceClass: EvidenceClass; confidence: number; explanation: string }> = [];
  for (const clause of clauses) {
    for (const rule of DEFAULT_RULES) {
      if (!ruleApplies(rule, jurisdiction)) continue;
      if (!rule.pattern.test(clause)) continue;
      const confidence = Math.min(rule.rawConfidence, CONFIDENCE_CAP[rule.evidenceClass]);
      const excerpt = clause.length <= 240 ? clause : clause.slice(0, 239).trimEnd() + "…";
      flags.push({
        ruleId: rule.id, topic: rule.topic, clauseExcerpt: excerpt,
        citation: rule.citation, severity: rule.severity,
        evidenceClass: rule.evidenceClass, confidence: Number(confidence.toFixed(2)),
        explanation: rule.explanation,
      });
    }
  }
  return { clauseCount: clauses.length, flags };
}

// ── Test runner ─────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const fails: string[] = [];

function check(name: string, cond: boolean) {
  if (cond) { pass++; }
  else { fail++; fails.push(name); console.log(`  ❌ ${name}`); }
}

function test(name: string, fn: () => void) {
  console.log(`\n▶ ${name}`);
  fn();
}

function flagsForRule(result: { flags: { ruleId: string }[] }, ruleId: string): number {
  return result.flags.filter((f) => f.ruleId === ruleId).length;
}

function expectRuleFires(name: string, text: string, ruleId: string, jurisdiction = "UK") {
  const result = analyzeLease(text, jurisdiction);
  check(`${name} (fires ${ruleId})`, flagsForRule(result, ruleId) >= 1);
}

function expectRuleSilent(name: string, text: string, ruleId: string, jurisdiction = "UK") {
  const result = analyzeLease(text, jurisdiction);
  check(`${name} (silent on ${ruleId})`, flagsForRule(result, ruleId) === 0);
}

function expectFlagCount(name: string, text: string, expected: number, jurisdiction = "UK") {
  const result = analyzeLease(text, jurisdiction);
  check(`${name} (flag count = ${expected})`, result.flags.length === expected);
}

// ── Eval-harness labels as tests (from eval-harness-precision-recall.md) ─
test("Eval-harness labels (TP cases)", () => {
  expectRuleFires("F1 entry-without-notice", "landlord may enter at any time without notice", "entry-without-notice");
  expectRuleFires("F3 waive-repairs", "tenant waives all rights to structural repair", "waive-repairs");
  expectRuleFires("F6 penalty-late-fee", "late fee of 50% per day applies to overdue rent", "penalty-late-fee");
  expectRuleFires("F7 excessive-deposit", "deposit equal to six months rent", "excessive-deposit");
  expectRuleFires("F7b uk-deposit-cap", "deposit equal to 8 weeks rent", "uk-deposit-cap");
  expectRuleFires("F9 retaliatory-eviction", "landlord may terminate if tenant makes a complaint to the council", "retaliatory-eviction");
  expectRuleFires("F12 uk-banned-fees", "tenant must pay a non-refundable admin fee of £300", "uk-banned-fees");
  expectRuleFires("F17 uk-s167-forfeiture", "landlord may forfeit for any breach including small arrears", "uk-s167-forfeiture");
  expectRuleFires("F18 uk-bsa-remediation", "leaseholder is liable for cladding remediation costs", "uk-bsa-remediation");
  expectRuleFires("F19 uk-fitness-waiver", "let as-is, tenant accepts property condition", "uk-fitness-waiver");
});

test("Eval-harness labels (TN cases)", () => {
  expectRuleSilent("F2 lawful entry notice", "landlord may enter with 48 hours written notice", "entry-without-notice");
  expectRuleSilent("F4 ordinary repair covenant", "tenant shall maintain the property in good repair", "waive-repairs");
  expectRuleSilent("F8 compliant deposit", "deposit equal to 5 weeks rent, protected in TDS", "uk-deposit-cap");
  expectRuleSilent("F10 ordinary termination", "tenancy may be terminated by either party with 2 months notice", "retaliatory-eviction");
  expectRuleSilent("F13 ordinary rent due", "rent is due on the first day of each month", "uk-banned-fees");
});

test("Sample lease dossier", () => {
  const samplePath = path.resolve(import.meta.dirname || process.cwd(), "../project/demo/sample-lease.txt");
  if (!fs.existsSync(samplePath)) {
    check("sample-lease.txt exists", false);
    return;
  }
  const text = fs.readFileSync(samplePath, "utf8");
  const result = analyzeLease(text, "UK");
  check("sample lease produces 5 flags (8 numbered clauses, 5 distinct unfair rules)", result.flags.length === 5);
  check("sample lease 3 high-severity flags", result.flags.filter((f) => f.severity === "high").length === 3);
  check("sample lease 2 medium-severity flags", result.flags.filter((f) => f.severity === "medium").length === 2);
  check("sample lease includes entry-without-notice", flagsForRule(result, "entry-without-notice") >= 1);
  check("sample lease includes waive-repairs", flagsForRule(result, "waive-repairs") >= 1);
  check("sample lease includes retaliatory-eviction", flagsForRule(result, "retaliatory-eviction") >= 1);
  // The "lawful" clause #8 must NOT be flagged
  const lawfulClause = "Rent is due on the first day of each month";
  const lawfulResult = analyzeLease(lawfulClause, "UK");
  check("lawful 'rent due on the first' produces 0 flags", lawfulResult.flags.length === 0);
});

test("Evidence class discipline", () => {
  const result = analyzeLease("landlord may enter at any time without notice", "UK");
  const flag = result.flags[0];
  check("entry-without-notice is established", flag?.evidenceClass === "established");
  check("established capped at 0.99", (flag?.confidence ?? 0) <= 0.99);
  check("established at least 0.5", (flag?.confidence ?? 0) >= 0.5);

  const contested = analyzeLease("late fee of 50% per day applies to overdue rent", "UK");
  const cflag = contested.flags.find((f) => f.ruleId === "penalty-late-fee");
  check("penalty-late-fee is contested", cflag?.evidenceClass === "contested");
  check("contested capped at 0.6", (cflag?.confidence ?? 0) <= 0.6);
});

test("Jurisdiction scoping", () => {
  // uk-deposit-cap is UK-only and fires on 6+ weeks OR 2-3 months
  const uk = analyzeLease("deposit equal to 8 weeks rent", "UK");
  check("UK fires uk-deposit-cap on 8 weeks", flagsForRule(uk, "uk-deposit-cap") >= 1);
  const bb = analyzeLease("deposit equal to 8 weeks rent", "BB");
  check("BB does NOT fire uk-deposit-cap", flagsForRule(bb, "uk-deposit-cap") === 0);
});

test("CONFIRMED GAP: service-charge increase without notice (eval-harness #14)", () => {
  // This is a documented miss from the eval harness. The harness confirms
  // the gap is real. When this is fixed (v0.2), this test should flip to
  // expectRuleFires.
  const text = "service charge may be increased without notice at the landlord's sole discretion";
  const result = analyzeLease(text, "UK");
  const misses = !result.flags.some((f) => /s\.?20/i.test(f.citation) || /consultation/i.test(f.topic));
  check("s.20B gap documented (expected miss)", misses);
});

test("Edge cases", () => {
  expectFlagCount("empty input", "", 0);
  expectFlagCount("whitespace only", "   \n\n   ", 0);
  expectFlagCount("single newline", "rent is due on the first", 0);
});

// ── Summary ─────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
console.log(`Phase 2D test expansion: ${pass}/${pass + fail} passing`);
if (fail > 0) {
  console.log("\nFailing tests:");
  for (const f of fails) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("All Phase 2D tests pass.");
