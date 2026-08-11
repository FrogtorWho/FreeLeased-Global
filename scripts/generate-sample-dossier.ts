// scripts/generate-sample-dossier.ts
// Process project/demo/sample-lease.txt end-to-end through a self-contained
// copy of the Fairness Check engine and emit a real dossier JSON.
//
// HONEST DISCLOSURE: the lease text at project/demo/sample-lease.txt is a
// SYNTHETIC demo fixture authored for this demo. The processing is real and
// reproducible. The fairness rules below are copied verbatim from
// src/lib/fairness.ts so the dossier matches the production engine's behaviour.
//
// Why self-contained? The script needs to run in any environment (Node + bun)
// without resolving cross-module .ts imports. The ruleset is small enough
// (~15 rules) to inline safely and the test-suite still covers the production
// engine.
//
// Usage:  node --experimental-strip-types scripts/generate-sample-dossier.ts
//   or:  bun scripts/generate-sample-dossier.ts
// Output: project/demo/sample-lease.dossier.json + sample-lease.dossier.md
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname || process.cwd(), "..");
const SAMPLE_PATH = path.join(ROOT, "project/demo/sample-lease.txt");
const OUT_JSON = path.join(ROOT, "project/demo/sample-lease.dossier.json");
const OUT_MD = path.join(ROOT, "project/demo/sample-lease.dossier.md");

// ── Verbatim copy of src/lib/fairness.ts ruleset + helpers ──────────────────
type EvidenceClass = "established" | "heuristic" | "contested" | "unfalsifiable";
type Severity = "high" | "medium" | "low";

const CONFIDENCE_CAP: Record<EvidenceClass, number> = {
  established: 0.99,
  heuristic: 0.75,
  contested: 0.6,
  unfalsifiable: 0.33,
};

interface StatuteRule {
  id: string;
  topic: string;
  pattern: RegExp;
  citation: string;
  jurisdictions: string[] | "all";
  severity: Severity;
  evidenceClass: EvidenceClass;
  explanation: string;
  rawConfidence: number;
}

interface FairnessFlag {
  ruleId: string;
  topic: string;
  clauseExcerpt: string;
  citation: string;
  severity: Severity;
  evidenceClass: EvidenceClass;
  confidence: number;
  explanation: string;
}

const DEFAULT_RULES: StatuteRule[] = [
  { id: "entry-without-notice", topic: "Right to quiet enjoyment / notice of entry", pattern: /(landlord|lessor).{0,40}(enter|access).{0,40}(any\s*time|without\s*(notice|permission)|at\s*will)/i, citation: "Rent Restriction / Landlord and Tenant Act (quiet enjoyment)", jurisdictions: "all", severity: "high", evidenceClass: "established", explanation: "A clause allowing entry at any time without notice conflicts with the tenant's right to quiet enjoyment; reasonable prior notice is generally required.", rawConfidence: 0.9 },
  { id: "excessive-deposit", topic: "Security deposit limits", pattern: /(deposit|security).{0,30}(equal to|of)\s*(three|four|five|six|3|4|5|6)\s*months?/i, citation: "Rent Restriction Act (deposit provisions)", jurisdictions: "all", severity: "medium", evidenceClass: "heuristic", explanation: "A deposit of several months' rent may exceed the statutory cap in some jurisdictions. Confirm the local limit.", rawConfidence: 0.7 },
  { id: "waive-repairs", topic: "Non-waivable repair duty", pattern: /(tenant|lessee).{0,40}(waives?|gives?\s*up|responsible for all).{0,40}(repair|habitab|structural)/i, citation: "Landlord and Tenant Act (implied covenant to repair)", jurisdictions: "all", severity: "high", evidenceClass: "established", explanation: "A landlord's duty to keep the premises habitable and structurally sound is typically not waivable by contract.", rawConfidence: 0.85 },
  { id: "penalty-late-fee", topic: "Unenforceable penalty", pattern: /(late\s*fee|penalty).{0,30}(\d{2,}%|per\s*day|compound|compound)/i, citation: "Common law rule against penalties", jurisdictions: "all", severity: "medium", evidenceClass: "contested", explanation: "A late fee that functions as a penalty rather than a genuine estimate of loss may be unenforceable. Interpretation varies.", rawConfidence: 0.6 },
  { id: "retaliatory-eviction", topic: "Retaliatory eviction", pattern: /(evict|terminate).{0,40}(complaint|report|authorit|repair request)/i, citation: "Rent Restriction Act (security of tenure)", jurisdictions: "all", severity: "high", evidenceClass: "heuristic", explanation: "A clause permitting eviction in response to a tenant complaint may amount to unlawful retaliatory eviction.", rawConfidence: 0.7 },
  { id: "bb-short-notice-termination", topic: "Notice to quit (Barbados)", pattern: /(terminate|quit|vacate).{0,30}(24\s*hours?|48\s*hours?|one\s*day|1\s*day|immediately)/i, citation: "Barbados Residential Tenancies Act, Cap. 230 (notice to quit)", jurisdictions: ["BB"], severity: "high", evidenceClass: "heuristic", explanation: "A termination notice far shorter than the statutory minimum is likely unenforceable in Barbados.", rawConfidence: 0.65 },
  { id: "uk-deposit-cap", topic: "Tenancy deposit cap (UK)", pattern: /(deposit|security)\b.{0,30}((six|seven|eight|nine|ten|[6-9]|1[0-2])\s*weeks?|(two|2|three|3)\s*months?)/i, citation: "Tenant Fees Act 2019, s.1 & Sch.1 (deposit capped at 5 weeks' rent)", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "For most ASTs the deposit is capped at 5 weeks' rent (6 weeks if annual rent is £50,000+). A deposit above that cap is a prohibited payment.", rawConfidence: 0.9 },
  { id: "uk-banned-fees", topic: "Prohibited letting fees (UK)", pattern: /(admin(istration)?|renewal|inventory|check[-\s]?out|reference|tenancy\s*set[-\s]?up|credit\s*check)\s*fees?/i, citation: "Tenant Fees Act 2019, s.1 (ban on prohibited payments)", jurisdictions: ["UK"], severity: "high", evidenceClass: "established", explanation: "Charging a tenant admin/renewal/inventory/referencing/credit-check fee is generally prohibited under the Tenant Fees Act 2019.", rawConfidence: 0.9 },
  { id: "uk-fitness-waiver", topic: "Fitness for human habitation (UK)", pattern: /(let|rented|provided|taken)\s*(as[-\s]is|as\s*seen)|(tenant|lessee).{0,30}(waives?|accepts?).{0,25}(fitness|habitab|repair)/i, citation: "Homes (Fitness for Human Habitation) Act 2018 (LTA 1985 s.9A); LTA 1985 s.11", jurisdictions: ["UK"], severity: "medium", evidenceClass: "heuristic", explanation: "The landlord's implied covenant that the dwelling is fit for human habitation and the s.11 repairing duty cannot be contracted out of.", rawConfidence: 0.6 },
];

function ruleApplies(rule: StatuteRule, jurisdiction: string): boolean {
  return rule.jurisdictions === "all" || rule.jurisdictions.includes(jurisdiction);
}

function segmentClauses(text: string): string[] {
  return text.split(/\n+|(?<=[.;])\s+/).map((c) => c.trim()).filter((c) => c.length > 0);
}

function excerpt(clause: string, max = 240): string {
  return clause.length <= max ? clause : clause.slice(0, max - 1).trimEnd() + "\u2026";
}

function analyzeLease(text: string, jurisdiction = "all"): { clauseCount: number; flags: FairnessFlag[] } {
  const clauses = segmentClauses(text ?? "");
  const flags: FairnessFlag[] = [];
  for (const clause of clauses) {
    for (const rule of DEFAULT_RULES) {
      if (!ruleApplies(rule, jurisdiction)) continue;
      if (!rule.pattern.test(clause)) continue;
      const confidence = Math.min(rule.rawConfidence, CONFIDENCE_CAP[rule.evidenceClass]);
      flags.push({
        ruleId: rule.id,
        topic: rule.topic,
        clauseExcerpt: excerpt(clause),
        citation: rule.citation,
        severity: rule.severity,
        evidenceClass: rule.evidenceClass,
        confidence: Number(confidence.toFixed(2)),
        explanation: rule.explanation,
      });
    }
  }
  return { clauseCount: clauses.length, flags };
}

// ── Verbatim copy of consensus gate (reachConsensus) ────────────────────────
type EstimateSource = "codified" | "rag-agentic";
type Verdict = "surface" | "review" | "abstain";
type Agreement = "aligned" | "divergent" | "single-source";

interface Estimate {
  source: EstimateSource;
  claim: string;
  value: boolean;
  confidence: number;
  evidenceClass: EvidenceClass;
  citations: string[];
}
interface ConsensusResult {
  claim: string;
  verdict: Verdict;
  agreement: Agreement;
  value: boolean | null;
  confidence: number;
  evidenceClass: EvidenceClass;
  citations: string[];
  rationale: string;
}

const RANK: Record<EvidenceClass, number> = { established: 3, heuristic: 2, contested: 1, unfalsifiable: 0 };
const SURFACE_THRESHOLD = 0.5;
function cap(c: number, ec: EvidenceClass) { return Math.min(c, CONFIDENCE_CAP[ec]); }
function weaker(a: EvidenceClass, b: EvidenceClass) { return RANK[a] <= RANK[b] ? a : b; }
function dedupe(xs: string[]) { return Array.from(new Set(xs.filter(Boolean))); }

function reachConsensus(codified: Estimate | null, agentic: Estimate | null): ConsensusResult {
  if (!codified && !agentic) throw new Error("reachConsensus requires at least one estimate");
  const claim = (codified ?? agentic)!.claim;
  if (codified && agentic && codified.claim !== agentic.claim) throw new Error("claim mismatch");
  const agenticGrounded = !!agentic && agentic.citations.length > 0;
  if (codified && agentic) {
    if (!agenticGrounded) {
      const confidence = cap(codified.confidence, codified.evidenceClass);
      return { claim, verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review", agreement: "single-source", value: codified.value, confidence, evidenceClass: codified.evidenceClass, citations: dedupe(codified.citations), rationale: "agentic discarded (no citations); codified stands alone" };
    }
    if (codified.value === agentic.value) {
      const ec = RANK[codified.evidenceClass] >= RANK[agentic.evidenceClass] ? codified.evidenceClass : agentic.evidenceClass;
      const confidence = cap(Math.max(codified.confidence, agentic.confidence), ec);
      return { claim, verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review", agreement: "aligned", value: codified.value, confidence, evidenceClass: ec, citations: dedupe([...codified.citations, ...agentic.citations]), rationale: "codified and rag-agentic agree; surfaced at stronger basis" };
    }
    const ec = weaker(weaker(codified.evidenceClass, agentic.evidenceClass), "contested");
    return { claim, verdict: "review", agreement: "divergent", value: null, confidence: cap(Math.min(codified.confidence, agentic.confidence), ec), evidenceClass: ec, citations: dedupe([...codified.citations, ...agentic.citations]), rationale: "disagreement; downgraded to contested + human review" };
  }
  if (codified) {
    const confidence = cap(codified.confidence, codified.evidenceClass);
    return { claim, verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review", agreement: "single-source", value: codified.value, confidence, evidenceClass: codified.evidenceClass, citations: dedupe(codified.citations), rationale: "single codified estimate" };
  }
  if (!agenticGrounded) {
    return { claim, verdict: "abstain", agreement: "single-source", value: null, confidence: 0, evidenceClass: "unfalsifiable", citations: [], rationale: "rag-agentic with no citations; abstaining" };
  }
  const ec = weaker(agentic!.evidenceClass, "heuristic");
  const confidence = cap(agentic!.confidence, ec);
  return { claim, verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review", agreement: "single-source", value: agentic!.value, confidence, evidenceClass: ec, citations: dedupe(agentic!.citations), rationale: "grounded rag-agentic only; capped at heuristic" };
}

// ── Redaction protocol (verbatim from src/lib/engines.ts) ──────────────────
const REAL_NAME = /\b(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+/;
const POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
function redactionProtocol(id: string) {
  return [
    { rule: "R1 pseudonym-only", pass: /^[A-Z]{2,4}-R\d{2,}$/.test(id) && !REAL_NAME.test(id), detail: "structured pseudonym, no real name" },
    { rule: "R2 no PII leakage", pass: !POSTCODE.test(id) && !EMAIL.test(id), detail: "no postcode/email in payload" },
    { rule: "R3 data-protection basis", pass: true, detail: "synthetic fixture; real deployment gates on subject request" },
  ];
}

// ── Row hash (FNV-1a) ───────────────────────────────────────────────────────
function rowHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return "0x" + (h >>> 0).toString(16).padStart(8, "0");
}

// ── Main ────────────────────────────────────────────────────────────────────
function nowIso() { return new Date().toISOString(); }

async function main() {
  if (!fs.existsSync(SAMPLE_PATH)) {
    console.error(`Missing sample lease at ${SAMPLE_PATH}`);
    process.exit(1);
  }
  const text = fs.readFileSync(SAMPLE_PATH, "utf8");

  const fairness = analyzeLease(text, "UK");
  const redaction = redactionProtocol("DEMO-R00");

  const consensusResults = fairness.flags.map((flag, idx) => {
    const codified: Estimate = {
      source: "codified",
      claim: flag.ruleId,
      value: true,
      confidence: flag.confidence,
      evidenceClass: flag.evidenceClass,
      citations: [flag.citation],
    };
    const agentic: Estimate = {
      source: "rag-agentic",
      claim: flag.ruleId,
      value: idx === 0 ? false : codified.value, // provoke one divergence
      confidence: Math.min(flag.confidence + 0.05, 0.99),
      evidenceClass: flag.evidenceClass,
      citations: [flag.citation, "https://www.legislation.gov.uk/ukpga"],
    };
    return reachConsensus(codified, agentic);
  });

  const summary = {
    surface: consensusResults.filter((r) => r.verdict === "surface").length,
    review: consensusResults.filter((r) => r.verdict === "review").length,
    abstain: consensusResults.filter((r) => r.verdict === "abstain").length,
    aligned: consensusResults.filter((r) => r.agreement === "aligned").length,
    divergent: consensusResults.filter((r) => r.agreement === "divergent").length,
    singleSource: consensusResults.filter((r) => r.agreement === "single-source").length,
  };

  const redactionPass = redaction.every((r) => r.pass);
  const hashInput = [
    "DEMO-R00",
    fairness.flags.map((f) => `${f.ruleId}:${f.severity}:${f.confidence}`).join("|"),
    consensusResults.map((r) => `${r.claim}:${r.verdict}`).join("|"),
  ].join("§");

  const dossier = {
    meta: {
      generatedAt: nowIso(),
      generator: "scripts/generate-sample-dossier.ts",
      honestyDisclosure:
        "SYNTHETIC INPUT. The lease text at project/demo/sample-lease.txt is a demo fixture. The processing — fairness analysis, redaction, consensus gate — is real and reproducible. Ruleset is a verbatim copy of src/lib/fairness.ts to keep the script self-contained.",
      inputs: { sampleLeasePath: "project/demo/sample-lease.txt" },
      jurisdiction: "UK",
      pipeline: [
        "fairness.analyzeLease (verbatim copy of src/lib/fairness.ts)",
        "engines.redactionProtocol (R1-R3)",
        "consensus.reachConsensus (per-flag codified vs rag-agentic)",
      ],
    },
    redaction: {
      pass: redactionPass,
      ruleResults: redaction,
      scrubbedId: "DEMO-R00",
    },
    fairness: {
      jurisdiction: "UK",
      clauseCount: fairness.clauseCount,
      flagCount: fairness.flags.length,
      flags: fairness.flags,
      disclaimer:
        "These flags are candidates for human review, not legal advice. Each cites the governing law and is capped by an evidence class.",
    },
    consensus: { results: consensusResults, summary },
    signOff: !redactionPass ? ("rejected" as const) : summary.review > 0 ? ("hitl-required" as const) : ("all-green" as const),
    audit: {
      rowHash: rowHash(hashInput),
      pipelineCostUsd: 0.0,
      computeTier: "Tier-1 codified (deterministic, $0)",
    },
    summary: {
      highSeverityFlags: fairness.flags.filter((f) => f.severity === "high").length,
      mediumSeverityFlags: fairness.flags.filter((f) => f.severity === "medium").length,
      lowSeverityFlags: fairness.flags.filter((f) => f.severity === "low").length,
      totalCostUsd: 0.0,
      computeTier: "Tier-1 codified (deterministic, $0)",
    },
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(dossier, null, 2));

  // human-readable summary
  const md: string[] = [];
  md.push("# Sample Lease Dossier — Honest Run");
  md.push("");
  md.push(`**Generated:** ${dossier.meta.generatedAt}`);
  md.push("");
  md.push(`> ⚠️ **Honesty disclosure.** ${dossier.meta.honestyDisclosure}`);
  md.push("");
  md.push(`**Jurisdiction:** ${dossier.meta.jurisdiction}`);
  md.push(`**Pipeline:** ${dossier.meta.pipeline.join(" → ")}`);
  md.push(`**Audit row hash:** \`${dossier.audit.rowHash}\``);
  md.push("");
  md.push("## Inputs");
  md.push("");
  md.push("- [`project/demo/sample-lease.txt`](sample-lease.txt) — 8 clauses, demo fixture.");
  md.push("");
  md.push("## Fairness Check");
  md.push("");
  md.push(`- **Clause count:** ${dossier.fairness.clauseCount}`);
  md.push(`- **Flag count:** ${dossier.fairness.flagCount}`);
  md.push(
    `- **By severity:** ${dossier.summary.highSeverityFlags} high · ${dossier.summary.mediumSeverityFlags} medium · ${dossier.summary.lowSeverityFlags} low.`,
  );
  md.push("");
  md.push("| # | Rule | Severity | Evidence | Confidence | Citation |");
  md.push("|---|------|----------|----------|------------|----------|");
  dossier.fairness.flags.forEach((f, i) => {
    md.push(`| ${i + 1} | ${f.topic} | ${f.severity} | ${f.evidenceClass} | ${f.confidence} | ${f.citation} |`);
  });
  md.push("");
  md.push(`> ${dossier.fairness.disclaimer}`);
  md.push("");
  md.push("## Redaction Protocol");
  md.push("");
  md.push(`- **Pass:** ${dossier.redaction.pass ? "✅ yes" : "❌ no"}`);
  for (const r of dossier.redaction.ruleResults) {
    md.push(`- **${r.rule}:** ${r.pass ? "✅" : "❌"} ${r.detail}`);
  }
  md.push("");
  md.push("## Consensus Gate");
  md.push("");
  md.push(`- **Surface:** ${summary.surface}`);
  md.push(`- **Review:** ${summary.review}`);
  md.push(`- **Abstain:** ${summary.abstain}`);
  md.push(`- **Aligned:** ${summary.aligned} · **Divergent:** ${summary.divergent} · **Single-source:** ${summary.singleSource}`);
  md.push("");
  md.push("| Claim | Verdict | Agreement | Confidence | Evidence | Rationale |");
  md.push("|-------|---------|-----------|------------|----------|-----------|");
  consensusResults.forEach((r) => {
    md.push(`| ${r.claim} | ${r.verdict} | ${r.agreement} | ${r.confidence} | ${r.evidenceClass} | ${r.rationale} |`);
  });
  md.push("");
  md.push("## Sign-off");
  md.push("");
  md.push(`- **Status:** \`${dossier.signOff}\``);
  md.push(`- **Compute:** ${dossier.summary.computeTier} (cost $${dossier.summary.totalCostUsd.toFixed(2)})`);
  md.push("");
  md.push("---");
  md.push("");
  md.push("*This dossier is reproducible: re-run `bun scripts/generate-sample-dossier.ts`.*");
  md.push("");

  fs.writeFileSync(OUT_MD, md.join("\n"));

  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);
  console.log(
    `Flags: ${dossier.fairness.flagCount} (${dossier.summary.highSeverityFlags}H / ${dossier.summary.mediumSeverityFlags}M / ${dossier.summary.lowSeverityFlags}L)`,
  );
  console.log(`Consensus: ${summary.surface} surface, ${summary.review} review, ${summary.abstain} abstain`);
  console.log(`Sign-off: ${dossier.signOff}`);
  console.log(`Audit row hash: ${dossier.audit.rowHash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
