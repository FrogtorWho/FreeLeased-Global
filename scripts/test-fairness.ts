// Standalone tests for the Lease & Contract Fairness Check.
// Run: bun scripts/test-fairness.ts
import {
  analyzeLease,
  segmentClauses,
  CONFIDENCE_CAP,
  DEFAULT_RULES,
} from "../src/lib/fairness";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}`);
  }
}

// 1. Flags an unlawful entry-without-notice clause.
const r1 = analyzeLease(
  "The landlord may enter the premises at any time without notice.",
  "all",
);
check("flags entry without notice", r1.flags.some((f) => f.ruleId === "entry-without-notice"));

// 2. A benign clause produces no flags.
const r2 = analyzeLease("Rent is due on the first day of each month.", "all");
check("clean clause yields no flags", r2.flags.length === 0);

// 3. Confidence never exceeds the evidence-class cap (honesty invariant).
const r3 = analyzeLease(
  "The tenant waives all rights to structural repair. The landlord may access at will without notice. Late fee of 50% per day applies.",
  "all",
);
check(
  "confidence respects evidence-class cap",
  r3.flags.every((f) => f.confidence <= CONFIDENCE_CAP[f.evidenceClass] + 1e-9),
);

// 4. Every flag carries a citation and an explanation.
check(
  "every flag cites law and explains",
  r3.flags.length > 0 && r3.flags.every((f) => f.citation.length > 0 && f.explanation.length > 0),
);

// 5. Empty / null input does not throw and returns zero flags.
check("empty input is safe", analyzeLease("", "all").flags.length === 0);
// deno-lint-ignore no-explicit-any
check("null input is safe", analyzeLease(undefined as any, "all").flags.length === 0);

// 6. Clause segmentation splits on newlines and sentence terminators.
check(
  "segmentation splits clauses",
  segmentClauses("One clause.\nTwo clause; three clause.").length === 3,
);

// 7. Result always includes the not-legal-advice disclaimer.
check("result carries disclaimer", r1.disclaimer.toLowerCase().includes("not legal advice"));

// 8. Ruleset is non-empty and every rule has a valid evidence class.
check(
  "ruleset well-formed",
  DEFAULT_RULES.length > 0 &&
    DEFAULT_RULES.every((r) => r.citation.length > 0 && r.pattern instanceof RegExp),
);

// 9. Barbados-specific rule fires only when jurisdiction is BB.
const bbText = "The landlord may terminate this tenancy on 24 hours notice.";
check("BB rule fires under BB", analyzeLease(bbText, "BB").flags.some((f) => f.ruleId === "bb-short-notice-termination"));
check("BB rule silent under all", !analyzeLease(bbText, "all").flags.some((f) => f.ruleId === "bb-short-notice-termination"));

// 10. Trinidad and Tobago rule fires only when jurisdiction is TT.
const ttText = "The rent may be increased at any time at the landlord's sole discretion.";
check("TT rule fires under TT", analyzeLease(ttText, "TT").flags.some((f) => f.ruleId === "tt-rent-increase-no-notice"));
check("TT rule silent under all", !analyzeLease(ttText, "all").flags.some((f) => f.ruleId === "tt-rent-increase-no-notice"));

// 11. UK deposit cap fires under UK, silent elsewhere.
const ukDeposit = "The tenant shall pay a security deposit equal to eight weeks' rent.";
check("UK deposit-cap fires under UK", analyzeLease(ukDeposit, "UK").flags.some((f) => f.ruleId === "uk-deposit-cap"));
check("UK deposit-cap silent under BB", !analyzeLease(ukDeposit, "BB").flags.some((f) => f.ruleId === "uk-deposit-cap"));

// 12. UK prohibited letting fees.
const ukFees = "An administration fee and a renewal fee are payable by the tenant on each renewal.";
check("UK banned-fees fires under UK", analyzeLease(ukFees, "UK").flags.some((f) => f.ruleId === "uk-banned-fees"));

// 13. UK deposit-not-protected clause.
const ukProt = "The deposit will not be protected in any tenancy deposit scheme.";
check("UK deposit-not-protected fires", analyzeLease(ukProt, "UK").flags.some((f) => f.ruleId === "uk-deposit-not-protected"));

// 14. UK established rules carry established evidence class (high confidence).
check(
  "UK banned-fees is established class",
  analyzeLease(ukFees, "UK").flags.some((f) => f.ruleId === "uk-banned-fees" && f.evidenceClass === "established"),
);

// 15. A lawful UK rent clause is not flagged.
check("UK lawful rent clause clean", analyzeLease("Rent of £1,200 is payable monthly in advance.", "UK").flags.length === 0);

// 16. BVI storm-repair rule fires under VG and is honestly capped (contested).
const vgText = "The tenant is responsible for all hurricane and storm damage repair to the building.";
const vgFlags = analyzeLease(vgText, "VG").flags;
check("BVI storm-repair fires under VG", vgFlags.some((f) => f.ruleId === "vg-hurricane-repairs"));
check(
  "BVI storm-repair capped at contested (<=0.4)",
  vgFlags.filter((f) => f.ruleId === "vg-hurricane-repairs").every((f) => f.confidence <= 0.4 + 1e-9),
);

// ── UK leasehold diagnostics (RTM Sovereign core) ──
// 17. s.20 major-works consultation breach.
check(
  "leasehold s.20 consultation fires",
  analyzeLease("The landlord may carry out major works without consultation and recover the full cost.", "UK")
    .flags.some((f) => f.ruleId === "uk-s20-consultation"),
);
// 18. s.20C litigation costs via service charge.
check(
  "leasehold s.20C costs fires",
  analyzeLease("All legal costs incurred by the landlord shall be recoverable through the service charge.", "UK")
    .flags.some((f) => f.ruleId === "uk-s20c-costs"),
);
// 19. BSA remediation charged to leaseholder.
check(
  "leasehold BSA remediation fires",
  analyzeLease("The leaseholder shall be liable for all cladding remediation costs.", "UK")
    .flags.some((f) => f.ruleId === "uk-bsa-remediation"),
);
// 20. s.167 forfeiture for arrears (heuristic, capped).
{
  const f = analyzeLease("The landlord may forfeit the lease and re-enter for any unpaid service charge arrears.", "UK")
    .flags.filter((x) => x.ruleId === "uk-s167-forfeiture");
  check("leasehold s.167 forfeiture fires", f.length > 0);
  check("leasehold s.167 capped at heuristic (<=0.6)", f.every((x) => x.confidence <= 0.6 + 1e-9));
}
// 21. Leasehold rules are UK-scoped (silent under BB).
check(
  "leasehold s.20 silent under BB",
  !analyzeLease("major works without consultation", "BB").flags.some((f) => f.ruleId === "uk-s20-consultation"),
);
// 22. A fair leasehold clause is clean.
check(
  "fair leasehold clause clean",
  analyzeLease("The landlord will consult leaseholders under section 20 before undertaking qualifying works.", "UK")
    .flags.length === 0,
);

console.log(`\nfairness: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
