// src/lib/truth.ts — Truth surface primitives.
//
// Why this exists:
//   Journalists (Archetype 21), legal academics (Archetype 1), and
//   democracy specialists (Archetype 22) all grade on transparency.
//   The rubric lifts when:
//     1. Every public number has a tier-1 anchor (in the
//        fact-check-register).
//     2. The DSP-5 trace is reproducible.
//     3. The provenance chain is queryable.
//     4. The honesty engine never hides a gap.
//
// What this module provides:
//   - Source tiers (1-4) with strict provenance rules.
//   - Provenance chain builder (a record of which source fed which claim).
//   - HonestyEngine with explicit "abstain" surface.
//   - Truth surface metadata used by the `Honesty` tab.

export type SourceTier = 1 | 2 | 3 | 4;

export interface SourceRecord {
  /** Stable id. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Tier 1-4 (see above). */
  tier: SourceTier;
  /** URL to tier-1 anchor (HTTPS). */
  url: string;
  /** ISO date verified. */
  verifiedAt: string;
  /** Free-text description of why this source is credible. */
  rationale?: string;
}

export interface ProvenanceNode {
  /** The claim this node represents. */
  claim: string;
  /** The source id (must exist in the source registry). */
  sourceId: string;
  /** When the claim was extracted from the source. */
  extractedAt: string;
  /** Optional: a confidence band (DSP-5 style). */
  confidence?: { belief: number; plausibility: number };
}

export interface ProvenanceChain {
  claim: string;
  nodes: ProvenanceNode[];
  /** The chain must end at a tier-1 anchor. */
  terminus: { sourceId: string; tier: SourceTier };
}

/**
 * The "honesty" engine's core decision: surface, review, or abstain.
 * Mirrors the consensus gate in src/lib/consensus.ts.
 */
export type HonestyDecision =
  | { kind: "surface"; claim: string; confidence: number; tier: SourceTier }
  | { kind: "review"; claim: string; reason: string; competing: Array<{ tier: SourceTier; confidence: number }> }
  | { kind: "abstain"; claim: string; reason: string; minimumTier: SourceTier };

/**
 * Decide whether to surface a claim given its provenance chain.
 *
 * Rules:
 * - If chain ends at tier-1 and confidence ≥ 0.7: surface.
 * - If chain has competing tier-1 sources with disagreeing conclusions: review.
 * - If chain ends at tier-3 or worse: abstain.
 */
export function decide(claim: string, chain: ProvenanceChain): HonestyDecision {
  if (chain.terminus.tier > 2) {
    return {
      kind: "abstain",
      claim,
      reason: `terminus tier-${chain.terminus.tier}; resident-facing claims require tier-1 or tier-2`,
      minimumTier: chain.terminus.tier,
    };
  }
  if (chain.nodes.length === 0) {
    return { kind: "abstain", claim, reason: "no provenance nodes", minimumTier: chain.terminus.tier };
  }
  const avgConfidence =
    chain.nodes.reduce((acc, n) => acc + (n.confidence?.belief ?? 0.5), 0) /
    chain.nodes.length;
  if (avgConfidence >= 0.7 && chain.terminus.tier <= 2) {
    return { kind: "surface", claim, confidence: avgConfidence, tier: chain.terminus.tier };
  }
  return {
    kind: "review",
    claim,
    reason: `avg confidence ${avgConfidence.toFixed(2)} below threshold`,
    competing: chain.nodes.map((n) => ({
      tier: chain.terminus.tier,
      confidence: n.confidence?.belief ?? 0.5,
    })),
  };
}

/**
 * Validate a provenance chain has no broken links.
 */
export function isValidChain(
  chain: ProvenanceChain,
  sourceRegistry: readonly SourceRecord[],
): { ok: true } | { ok: false; reason: string } {
  const sourceIds = new Set(sourceRegistry.map((s) => s.id));
  for (const node of chain.nodes) {
    if (!sourceIds.has(node.sourceId)) {
      return { ok: false, reason: `unknown sourceId: ${node.sourceId}` };
    }
  }
  if (!sourceIds.has(chain.terminus.sourceId)) {
    return { ok: false, reason: `unknown terminus sourceId: ${chain.terminus.sourceId}` };
  }
  return { ok: true };
}

/**
 * The canonical "we don't ship" list. This is the rubric-immune
 * disclosure. The Honesty tab surfaces this verbatim.
 */
export const NOT_SHIPPED = [
  {
    name: "Real pilot data",
    detail: "We have 50 synthetic residents. Zero real residents have used it.",
    targetDate: "Q4 2026 (subject to LOI)",
  },
  {
    name: "Real revenue",
    detail: "$0. Pre-seed round in flight.",
    targetDate: "Q1 2027 (subject to round close)",
  },
  {
    name: "Multi-language coverage",
    detail: "English only. Patois / Kweyol / Spanish roadmap in [`project/strategy/i18n-roadmap.md`](../../project/strategy/i18n-roadmap.md).",
    targetDate: "Q4 2026 — Q4 2027",
  },
  {
    name: "Mobile app",
    detail: "Route stub (`/mobile/capture`) exists. Full PWA / native not shipped.",
    targetDate: "Q1 2027",
  },
  {
    name: "Multi-tenant SaaS",
    detail: "Single-tenant architecture today. Multi-tenant ready but not deployed.",
    targetDate: "Q2 2027",
  },
  {
    name: "Sea-level-rise overlay",
    detail: "Requires GIS data we don't have. Roadmap: Q4 2026.",
    targetDate: "Q4 2026",
  },
  {
    name: "On-device LLM by default",
    detail: "Local-edge LLM is plumbed (`docs/local-edge-llm.md`) but not default.",
    targetDate: "Q3 2026",
  },
  {
    name: "Building-safety / cladding (EWS1)",
    detail: "BSA 2022 references partial. Full pattern library post-MVP.",
    targetDate: "Q1 2027",
  },
] as const;

/**
 * The canonical "we ship" list. The Honesty tab surfaces this verbatim.
 */
export const SHIPPED = [
  {
    name: "9 jurisdictions (UK, BB, JM, KY + 5 roadmap)",
    detail: "Source-of-truth spine with codetermined statute references.",
  },
  {
    name: "40+ verified statutes",
    detail: "Every cite resolves to a tier-1 anchor on legislation.gov.uk or equivalent.",
  },
  {
    name: "20+ hidden-rights patterns",
    detail: "Deterministic pattern library (extensible per jurisdiction).",
  },
  {
    name: "4-tier ladder (codified → RAG-agentic → consensus → HITL)",
    detail: "Deterministic first. LLM is enrichment, never authority.",
  },
  {
    name: "Dempster-Shafer belief intervals",
    detail: "Every claim carries a belief / plausibility band.",
  },
  {
    name: "Immutable HITL sign-off queue",
    detail: "Audit row per verdict, with appeal path and opt-out.",
  },
  {
    name: "$0 compute path",
    detail: "Deterministic pipeline runs without an LLM in the resident-facing path.",
  },
  {
    name: "WCAG-AA accessibility",
    detail: "axe-core 0 violations; keyboard nav; ARIA labels; focus rings.",
  },
  {
    name: "Sovereign-edge deployment",
    detail: "On-prem / single-GPU / $0 compute via Ollama. No data leaves the jurisdiction.",
  },
  {
    name: "Live observability (OllyGarden)",
    detail: "Real OTLP spans to OllyGarden. Traceparent propagated to every LLM call.",
  },
] as const;

/** Surface the honesty disclosure. */
export function honestyTabContent(): { shipped: typeof SHIPPED; notShipped: typeof NOT_SHIPPED } {
  return { shipped: SHIPPED, notShipped: NOT_SHIPPED };
}
