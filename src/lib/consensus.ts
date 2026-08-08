// Consensus / alignment gate — the codified verification layer.
//
// Automation doctrine (see project/strategy/automation-doctrine.md):
//   Tier 1 CODIFIED    — deterministic rules are the spine of truth.
//   Tier 2 RAG-AGENTIC — grounded retrieval + LLM, used only where a claim
//                        cannot be codified. Citations are mandatory.
//   Tier 3 CONSENSUS   — this module. It cross-checks a codified estimate
//                        against a RAG-agentic estimate for the SAME claim and
//                        decides whether to surface, send to human review, or
//                        abstain. Honesty is enforced by construction: nothing
//                        is surfaced with more certainty than its weaker basis,
//                        divergence is never surfaced as fact, and an
//                        uncited agentic claim can never stand alone.
//
// Deterministic and dependency-free. No ML in the gate itself.

import { EvidenceClass, CONFIDENCE_CAP } from "./fairness";
import type { Maturity } from "./jurisdiction";

export type EstimateSource = "codified" | "rag-agentic";
export type Verdict = "surface" | "review" | "abstain";
export type Agreement = "aligned" | "divergent" | "single-source";
export type Tier = "codified" | "rag-agentic" | "consensus";

// A single estimator's answer to a canonical yes/no claim. Both the codified
// engine and the RAG-agentic workflow produce this shape (protocol DSP-6).
export interface Estimate {
  source: EstimateSource;
  claim: string; // canonical claim key both estimators answer
  value: boolean; // does the claim hold?
  confidence: number; // raw signal strength, 0..1 (pre-cap)
  evidenceClass: EvidenceClass;
  citations: string[]; // provenance URLs / statute ids; required for rag-agentic
}

export interface ConsensusResult {
  claim: string;
  verdict: Verdict;
  agreement: Agreement;
  value: boolean | null; // null when abstaining or under review with no safe call
  confidence: number; // always <= CONFIDENCE_CAP[evidenceClass]
  evidenceClass: EvidenceClass;
  citations: string[];
  rationale: string;
  tier: Tier;
}

const RANK: Record<EvidenceClass, number> = {
  established: 3,
  heuristic: 2,
  contested: 1,
  unfalsifiable: 0,
};

const BY_RANK: EvidenceClass[] = ["unfalsifiable", "contested", "heuristic", "established"];

// A claim must clear this capped-confidence bar to be surfaced without review.
const SURFACE_THRESHOLD = 0.5;

function cap(confidence: number, ec: EvidenceClass): number {
  return Math.min(confidence, CONFIDENCE_CAP[ec]);
}

function stronger(a: EvidenceClass, b: EvidenceClass): EvidenceClass {
  return RANK[a] >= RANK[b] ? a : b;
}

function weaker(a: EvidenceClass, b: EvidenceClass): EvidenceClass {
  return RANK[a] <= RANK[b] ? a : b;
}

function downgrade(ec: EvidenceClass): EvidenceClass {
  const i = BY_RANK.indexOf(ec);
  return BY_RANK[Math.max(0, i - 1)];
}

export interface ConsensusOptions {
  // Legal-framework maturity for the claim's jurisdiction. Drives how much
  // corroboration a claim needs before it can surface. Defaults to "established"
  // so the gate's base behaviour is unchanged when maturity is not supplied.
  maturity?: Maturity;
}

// Evaluate one claim from up to two independent estimators, then apply the
// jurisdiction-maturity layer. Pass the codified and/or rag-agentic estimate for
// the SAME claim.
export function reachConsensus(
  codified: Estimate | null,
  agentic: Estimate | null,
  opts: ConsensusOptions = {},
): ConsensusResult {
  const base = computeConsensus(codified, agentic);
  return applyMaturity(base, opts.maturity ?? "established");
}

// The maturity layer: where a legal framework's codified spine is less mature,
// demand cross-method corroboration before surfacing a claim. As the spine's
// statutes get promoted to verified, jurisdictions climb to "established" and
// this layer relaxes automatically — robust and dynamic to each framework.
function applyMaturity(r: ConsensusResult, maturity: Maturity): ConsensusResult {
  if (maturity === "established") return r;

  const corroborated = r.agreement === "aligned";
  // Only single-source "surface" verdicts are at risk; corroborated or already
  // cautious (review/abstain) results pass through with a maturity note.
  if (r.verdict !== "surface" || corroborated) {
    return { ...r, rationale: `${r.rationale} [maturity:${maturity}]` };
  }

  if (maturity === "developing") {
    if (r.evidenceClass === "established") {
      return { ...r, rationale: `${r.rationale} [maturity:developing]` };
    }
    return {
      ...r,
      verdict: "review",
      rationale:
        `${r.rationale} Downgraded to review: developing jurisdiction requires corroboration for a non-established single-source claim.`,
    };
  }

  // nascent: nothing surfaces single-source; downgrade a class and cap harder.
  const lowered = downgrade(r.evidenceClass);
  return {
    ...r,
    verdict: "review",
    evidenceClass: lowered,
    confidence: Math.min(r.confidence, CONFIDENCE_CAP[lowered]),
    rationale:
      `${r.rationale} Downgraded to review: nascent jurisdiction requires consensus corroboration before surfacing.`,
  };
}

function computeConsensus(
  codified: Estimate | null,
  agentic: Estimate | null,
): ConsensusResult {
  if (!codified && !agentic) {
    throw new Error("reachConsensus requires at least one estimate");
  }

  const claim = (codified ?? agentic)!.claim;
  if (codified && agentic && codified.claim !== agentic.claim) {
    throw new Error(`claim mismatch: "${codified.claim}" vs "${agentic.claim}"`);
  }

  // Rule 0: an uncited agentic claim carries no weight. It cannot stand alone,
  // and it cannot corroborate a codified claim.
  const agenticGrounded = !!agentic && agentic.citations.length > 0;

  // --- Both estimators present ---
  if (codified && agentic) {
    if (!agenticGrounded) {
      // Fall back to codified alone; the agentic claim is discarded as ungrounded.
      return single(codified, "agentic estimate discarded (no citations); codified stands alone");
    }

    if (codified.value === agentic.value) {
      // Aligned: two independent methods agree. Take the stronger basis, keep the
      // higher confidence, but never exceed that basis's cap.
      const ec = stronger(codified.evidenceClass, agentic.evidenceClass);
      const confidence = cap(Math.max(codified.confidence, agentic.confidence), ec);
      return {
        claim,
        verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review",
        agreement: "aligned",
        value: codified.value,
        confidence,
        evidenceClass: ec,
        citations: dedupe([...codified.citations, ...agentic.citations]),
        rationale:
          "Codified and RAG-agentic estimates agree; surfaced at the stronger evidence basis, confidence capped.",
        tier: "consensus",
      };
    }

    // Divergent: the two methods disagree. Never surface a disputed claim as
    // fact. Downgrade to contested, route to human review.
    const ec = weaker(downgrade(codified.evidenceClass), "contested");
    return {
      claim,
      verdict: "review",
      agreement: "divergent",
      value: null,
      confidence: cap(Math.min(codified.confidence, agentic.confidence), ec),
      evidenceClass: ec,
      citations: dedupe([...codified.citations, ...agentic.citations]),
      rationale:
        "Codified and RAG-agentic estimates disagree; downgraded to contested and routed to human review.",
      tier: "consensus",
    };
  }

  // --- Codified only ---
  if (codified) {
    return single(codified, "single codified estimate");
  }

  // --- Agentic only ---
  // Ungrounded agentic claims abstain outright. Grounded ones can never exceed
  // heuristic on their own (no deterministic backing), and go to review unless
  // they clear the bar.
  if (!agenticGrounded) {
    return {
      claim,
      verdict: "abstain",
      agreement: "single-source",
      value: null,
      confidence: 0,
      evidenceClass: "unfalsifiable",
      citations: [],
      rationale: "RAG-agentic estimate with no citations; abstaining per honesty rule.",
      tier: "consensus",
    };
  }
  const ec = weaker(agentic!.evidenceClass, "heuristic");
  const confidence = cap(agentic!.confidence, ec);
  return {
    claim,
    verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review",
    agreement: "single-source",
    value: agentic!.value,
    confidence,
    evidenceClass: ec,
    citations: dedupe(agentic!.citations),
    rationale:
      "Grounded RAG-agentic estimate with no codified counterpart; capped at heuristic (no deterministic backing).",
    tier: "consensus",
  };
}

function single(e: Estimate, why: string): ConsensusResult {
  const confidence = cap(e.confidence, e.evidenceClass);
  return {
    claim: e.claim,
    verdict: confidence >= SURFACE_THRESHOLD ? "surface" : "review",
    agreement: "single-source",
    value: e.value,
    confidence,
    evidenceClass: e.evidenceClass,
    citations: dedupe(e.citations),
    rationale: why,
    tier: e.source === "codified" ? "codified" : "consensus",
  };
}

function dedupe(xs: string[]): string[] {
  return Array.from(new Set(xs.filter(Boolean)));
}
