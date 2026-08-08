// Test suite for the Veracity Engine (src/lib/veracity.ts).
// Run: bun scripts/test-veracity.ts

import { scoreClaim, likelihoodLanguage, type Source } from "../src/lib/veracity";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`); }
}

const primaryLeg: Source = { label: "legislation.gov.uk", tier: "primary", reliability: "A", credibility: "1", stance: "supports" };
const lawFirmBlog: Source = { label: "law-firm summary", tier: "secondary", reliability: "C", credibility: "2", stance: "supports", independence: 0.8 };

console.log("Veracity Engine tests\n");

// 1. Primary + established → verified + citeable (the LFRA s.49 case).
{
  const r = scoreClaim("LFRA s.49 raises RTM non-residential limit 25%→50%", [primaryLeg, lawFirmBlog], "established");
  check("primary+established → verified", r.conviction === "verified", r.conviction);
  check("primary+established → citeable", r.citeable === true);
  check("primary+established → confirmed (primary)", r.reportTag === "confirmed (primary)", r.reportTag);
  check("displayed high", r.displayed >= 0.9, String(r.displayed));
}

// 2. Unfalsifiable claim is HARD-CAPPED and never citeable, even with strong sources.
{
  const strong: Source = { label: "self-assertion", tier: "primary", reliability: "A", credibility: "1", stance: "supports" };
  const r = scoreClaim("'court-readiness 100/100'", [strong, strong], "unfalsifiable");
  check("unfalsifiable capped ≤ 0.33", r.displayed <= 0.33, String(r.displayed));
  check("unfalsifiable → pending", r.conviction === "pending", r.conviction);
  check("unfalsifiable → not citeable", r.citeable === false);
  check("unfalsifiable cap flagged", r.capped === true);
}

// 3. Contradiction by a primary source → contradicted / partly, lowers confidence.
{
  const contra: Source = { label: "primary statute says otherwise", tier: "primary", reliability: "A", credibility: "1", stance: "contradicts" };
  const r = scoreClaim("Jamaica 'Condominium Act 1958' governs strata", [lawFirmBlog], "established");
  const r2 = scoreClaim("Jamaica 'Condominium Act 1958' governs strata", [lawFirmBlog, contra], "established");
  check("contradiction lowers displayed", r2.displayed < r.displayed, `${r2.displayed} < ${r.displayed}`);
  check("primary contradiction → contradicted", r2.reportTag === "contradicted", r2.reportTag);
}

// 4. Corroboration increases confidence (two independent secondaries > one).
{
  const s2: Source = { ...lawFirmBlog, label: "second independent firm", independence: 1 };
  const one = scoreClaim("x", [lawFirmBlog], "established");
  const two = scoreClaim("x", [lawFirmBlog, s2], "established");
  check("corroboration raises confidence", two.displayed > one.displayed, `${two.displayed} > ${one.displayed}`);
}

// 5. No sources → not found / pending.
{
  const r = scoreClaim("unsourced assertion", [], "established");
  check("no sources → not found", r.reportTag === "not found", r.reportTag);
  check("no sources → pending", r.conviction === "pending", r.conviction);
  check("no sources → not citeable", r.citeable === false);
}

// 6. Secondary-only support → confirmed (secondary only), not citeable as fact.
{
  const r = scoreClaim("secondary only claim", [lawFirmBlog, { ...lawFirmBlog, independence: 1 }], "established");
  check("secondary-only → confirmed (secondary only)", r.reportTag === "confirmed (secondary only)", r.reportTag);
  check("secondary-only → not citeable (no primary)", r.citeable === false);
}

// 7. Heuristic class caps at 0.75 even with a perfect primary source.
{
  const r = scoreClaim("reasoned pattern", [primaryLeg], "heuristic");
  check("heuristic capped ≤ 0.75", r.displayed <= 0.75, String(r.displayed));
}

// 8. Unknown reliability/credibility (F/6) is neutral, not zero.
{
  const unknown: Source = { label: "unattributed", tier: "secondary", reliability: "F", credibility: "6", stance: "supports" };
  const r = scoreClaim("unattributed claim", [unknown], "established");
  check("unknown source is neutral (0<disp<0.5)", r.displayed > 0 && r.displayed < 0.5, String(r.displayed));
}

// 9. Calibrated language mapping.
{
  check("0.95 → almost certain", likelihoodLanguage(0.95) === "almost certain");
  check("0.5 → roughly even chance", likelihoodLanguage(0.5) === "roughly even chance");
  check("0.05 → remote", likelihoodLanguage(0.05) === "remote");
}

// 10. Determinism: same inputs → identical output.
{
  const a = scoreClaim("x", [primaryLeg, lawFirmBlog], "established");
  const b = scoreClaim("x", [primaryLeg, lawFirmBlog], "established");
  check("deterministic", JSON.stringify(a) === JSON.stringify(b));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
