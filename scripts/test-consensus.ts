// Verifies the consensus/alignment gate enforces the honesty rules.
import { reachConsensus, Estimate } from "../src/lib/consensus";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name} ${detail}`);
  }
}

const codified = (over: Partial<Estimate> = {}): Estimate => ({
  source: "codified",
  claim: "rent-increase-clause-unlawful",
  value: true,
  confidence: 0.9,
  evidenceClass: "established",
  citations: ["RRA-1980-s12"],
  ...over,
});
const agentic = (over: Partial<Estimate> = {}): Estimate => ({
  source: "rag-agentic",
  claim: "rent-increase-clause-unlawful",
  value: true,
  confidence: 0.7,
  evidenceClass: "heuristic",
  citations: ["https://stats.gov.bb/"],
  ...over,
});

console.log("Consensus gate:");

// 1. Aligned → surface at the stronger basis, confidence capped.
{
  const r = reachConsensus(codified(), agentic());
  check("aligned estimates surface", r.verdict === "surface" && r.agreement === "aligned");
  check("aligned takes stronger evidence class", r.evidenceClass === "established");
  check("aligned confidence capped at established", r.confidence <= 0.95, `got ${r.confidence}`);
  check("aligned merges citations", r.citations.length === 2);
}

// 2. Divergent → never surfaced as fact; downgraded to contested, human review.
{
  const r = reachConsensus(codified({ value: true }), agentic({ value: false }));
  check("divergent routes to review", r.verdict === "review" && r.agreement === "divergent");
  check("divergent yields no asserted value", r.value === null);
  check("divergent downgraded to contested", r.evidenceClass === "contested");
  check("divergent confidence capped at contested", r.confidence <= 0.4, `got ${r.confidence}`);
}

// 3. Agentic-only WITH citations → capped at heuristic (no deterministic backing).
{
  const r = reachConsensus(null, agentic({ confidence: 0.99, evidenceClass: "established" }));
  check("agentic-only capped at heuristic", r.evidenceClass === "heuristic");
  check("agentic-only confidence capped at 0.6", r.confidence <= 0.6, `got ${r.confidence}`);
  check("agentic-only single-source", r.agreement === "single-source");
}

// 4. Agentic-only WITHOUT citations → abstain outright.
{
  const r = reachConsensus(null, agentic({ citations: [] }));
  check("uncited agentic abstains", r.verdict === "abstain");
  check("uncited agentic asserts nothing", r.value === null && r.confidence === 0);
}

// 5. Uncited agentic cannot corroborate codified → codified stands alone.
{
  const r = reachConsensus(codified(), agentic({ citations: [] }));
  check("uncited agentic discarded, codified stands", r.agreement === "single-source" && r.verdict === "surface");
  check("codified-alone keeps its evidence class", r.evidenceClass === "established");
}

// 6. Weak codified-only → review (below surface threshold).
{
  const r = reachConsensus(codified({ confidence: 0.3, evidenceClass: "contested" }), null);
  check("weak codified routes to review", r.verdict === "review");
}

// 7. Claim-key mismatch is a hard error (protocol violation).
{
  let threw = false;
  try {
    reachConsensus(codified(), agentic({ claim: "different-claim" }));
  } catch {
    threw = true;
  }
  check("claim mismatch throws", threw);
}

// 8. Empty input is a hard error.
{
  let threw = false;
  try {
    reachConsensus(null, null);
  } catch {
    threw = true;
  }
  check("no estimates throws", threw);
}

// 9. Maturity layer — developing jurisdiction downgrades a non-established
//    single-source surface to review.
{
  const base = reachConsensus(null, agentic({ confidence: 0.6, evidenceClass: "heuristic" }));
  check("developing base surfaces heuristic single-source", base.verdict === "surface");
  const dev = reachConsensus(null, agentic({ confidence: 0.6, evidenceClass: "heuristic" }), { maturity: "developing" });
  check("developing downgrades to review", dev.verdict === "review", `got ${dev.verdict}`);
}

// 10. Nascent jurisdiction: codified-only established surface -> review + class down.
{
  const nascent = reachConsensus(codified(), null, { maturity: "nascent" });
  check("nascent downgrades single-source surface to review", nascent.verdict === "review");
  check("nascent lowers evidence class", nascent.evidenceClass === "heuristic", `got ${nascent.evidenceClass}`);
}

// 11. Corroborated (aligned) claims still surface even in a nascent jurisdiction.
{
  const nascentAligned = reachConsensus(codified(), agentic(), { maturity: "nascent" });
  check("nascent still surfaces corroborated/aligned", nascentAligned.verdict === "surface");
}

// 12. Established maturity (default) leaves the base result unchanged.
{
  const a = reachConsensus(codified(), null);
  const b = reachConsensus(codified(), null, { maturity: "established" });
  check("established maturity == default behaviour", a.verdict === b.verdict && a.evidenceClass === b.evidenceClass);
}

console.log(`\nConsensus: ${pass}/${pass + fail} passing`);
if (fail > 0) process.exit(1);
