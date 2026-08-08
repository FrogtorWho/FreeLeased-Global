// Veracity Engine; the codified "how we get to the truth" scorer.
//
// This is the deterministic core of the Truth Protocol (see
// project/strategy/truth-protocol.md). It turns a set of graded, stance-tagged
// SOURCES about a single CLAIM into a calibrated, *capped* confidence, a
// conviction tag consistent with the spine (`verified` | `inference` |
// `pending`), a report tag consistent with our research reports
// (`confirmed (primary)` | ... | `not found`), and a citeability gate.
//
// DISCIPLINE (honesty brand): every score is CAPPED by the claim's evidence
// class. A claim that cannot in principle be falsified can never display as
// "verified" no matter how many sources assert it. Corroboration raises
// confidence; contradiction and low independence lower it. Nothing is ever
// asserted above what its weakest epistemic dimension allows.

import type { Conviction } from "../data/spine";

// ── Admiralty / NATO source-grading (STANAG 2511) ────────────────────────────
// Reliability of the SOURCE (who) × Credibility of the INFORMATION (what).
export type Reliability = "A" | "B" | "C" | "D" | "E" | "F"; // F = cannot be judged
export type Credibility = "1" | "2" | "3" | "4" | "5" | "6"; // 6 = cannot be judged

// Numeric weights. Unknown (F/6) maps to a neutral 0.5; it neither confirms nor denies.
export const RELIABILITY_WEIGHT: Record<Reliability, number> = {
  A: 1.0, B: 0.8, C: 0.6, D: 0.4, E: 0.2, F: 0.5,
};
export const CREDIBILITY_WEIGHT: Record<Credibility, number> = {
  "1": 1.0, "2": 0.8, "3": 0.6, "4": 0.4, "5": 0.2, "6": 0.5,
};

// ── Evidence class → hard confidence CAP (Popperian falsifiability) ───────────
// The single most important rule in the engine: displayed confidence can never
// exceed the ceiling of the claim's evidence class.
export type EvidenceClass = "established" | "heuristic" | "contested" | "unfalsifiable";
export const EVIDENCE_CAP: Record<EvidenceClass, number> = {
  established: 0.99,    // falsifiable AND checkable against a primary source
  heuristic: 0.75,     // reasoned pattern / expert judgement, not directly falsifiable
  contested: 0.6,      // a credible, live dispute exists
  unfalsifiable: 0.33, // cannot in principle be checked; never present as fact
};

export type Stance = "supports" | "contradicts" | "context";
export type Tier = "primary" | "secondary" | "tertiary";

export interface Source {
  label: string;
  url?: string;
  tier: Tier;              // primary source ranks above secondary/tertiary
  reliability: Reliability;
  credibility: Credibility;
  stance: Stance;
  independence?: number;   // 0..1; 1 = fully independent, lower if derivative/shared origin
}

// Mass a single source contributes = reliability × credibility × independence.
function mass(s: Source): number {
  const ind = clamp01(s.independence ?? 1);
  return clamp01(RELIABILITY_WEIGHT[s.reliability] * CREDIBILITY_WEIGHT[s.credibility] * ind);
}

// Noisy-OR combination of independent masses: 1 - Π(1 - mᵢ).
// Diminishing returns for extra sources; robust to a single weak source.
function combine(masses: number[]): number {
  return 1 - masses.reduce((acc, m) => acc * (1 - clamp01(m)), 1);
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Calibrated likelihood language (ICD-203 analytic-standards style).
export function likelihoodLanguage(p: number): string {
  if (p >= 0.9) return "almost certain";
  if (p >= 0.75) return "highly likely";
  if (p >= 0.55) return "likely";
  if (p >= 0.45) return "roughly even chance";
  if (p >= 0.3) return "unlikely";
  if (p >= 0.1) return "highly unlikely";
  return "remote";
}

export type ReportTag =
  | "confirmed (primary)"
  | "confirmed (secondary only)"
  | "partly confirmed"
  | "contradicted"
  | "not found";

export interface VeracityResult {
  base: number;          // strongest single supporting mass
  support: number;       // combined supporting mass
  contradiction: number; // combined contradicting mass
  net: number;           // support discounted by conflict, before cap
  cap: number;           // evidence-class ceiling applied
  displayed: number;     // FINAL confidence actually shown (min of net, cap)
  capped: boolean;       // true if the cap bit (net exceeded the ceiling)
  conviction: Conviction;
  reportTag: ReportTag;
  language: string;
  citeable: boolean;     // may this be stated as fact in the deck/overview?
  reasons: string[];     // human-readable trace of why
}

export interface ScoreOptions {
  // Minimum displayed confidence to be "citeable as fact" in public artifacts.
  citeThreshold?: number; // default 0.8
  // Whether citeable also REQUIRES a primary source (default true).
  requirePrimaryToCite?: boolean;
}

// The core function. Deterministic: same inputs → same verdict.
export function scoreClaim(
  claim: string,
  sources: Source[],
  evidenceClass: EvidenceClass,
  opts: ScoreOptions = {},
): VeracityResult {
  const citeThreshold = opts.citeThreshold ?? 0.8;
  const requirePrimaryToCite = opts.requirePrimaryToCite ?? true;
  const reasons: string[] = [];

  const supporters = sources.filter((s) => s.stance === "supports");
  const contradictors = sources.filter((s) => s.stance === "contradicts");

  const supportMasses = supporters.map(mass);
  const contraMasses = contradictors.map(mass);

  const base = supportMasses.length ? Math.max(...supportMasses) : 0;
  const support = combine(supportMasses);
  const contradiction = combine(contraMasses);

  // Conflict discount: contradicting mass erodes support (Dempster-Shafer-lite).
  const net = clamp01(support * (1 - contradiction));

  const cap = EVIDENCE_CAP[evidenceClass];
  const displayed = Math.min(net, cap);
  const capped = net > cap;

  const hasPrimarySupport = supporters.some((s) => s.tier === "primary");
  const hasPrimaryContra = contradictors.some((s) => s.tier === "primary");

  // Report tag (mirrors our research-report vocabulary).
  let reportTag: ReportTag;
  if (supporters.length === 0 && contradictors.length === 0) {
    reportTag = "not found";
  } else if (contradiction > support) {
    reportTag = "contradicted";
  } else if (contradiction > 0.2) {
    reportTag = "partly confirmed";
  } else if (hasPrimarySupport && displayed >= 0.6) {
    reportTag = "confirmed (primary)";
  } else if (displayed >= 0.4) {
    reportTag = "confirmed (secondary only)";
  } else {
    reportTag = "not found";
  }

  // Conviction (mirrors spine's Conviction union).
  let conviction: Conviction;
  if (evidenceClass === "unfalsifiable" || displayed < 0.4) {
    conviction = "pending";
  } else if (displayed >= 0.75 && hasPrimarySupport && contradiction <= 0.2) {
    conviction = "verified";
  } else {
    conviction = "inference";
  }

  const citeable =
    conviction === "verified" &&
    displayed >= citeThreshold &&
    (!requirePrimaryToCite || hasPrimarySupport) &&
    evidenceClass === "established";

  // Trace.
  if (supporters.length) reasons.push(`${supporters.length} supporting source(s), strongest mass ${base.toFixed(2)}`);
  if (contradictors.length) reasons.push(`${contradictors.length} contradicting source(s), combined ${contradiction.toFixed(2)}`);
  if (hasPrimaryContra) reasons.push("a PRIMARY source contradicts; investigate before citing");
  if (capped) reasons.push(`evidence class "${evidenceClass}" capped confidence at ${cap} (raw net ${net.toFixed(2)})`);
  if (evidenceClass === "unfalsifiable") reasons.push("unfalsifiable: may never be presented as fact");
  if (!citeable && conviction !== "pending") reasons.push(`not yet citeable as fact (needs established class, primary source, ≥${citeThreshold})`);

  return {
    base: +base.toFixed(3), support: +support.toFixed(3), contradiction: +contradiction.toFixed(3),
    net: +net.toFixed(3), cap, displayed: +displayed.toFixed(3), capped,
    conviction, reportTag, language: likelihoodLanguage(displayed), citeable, reasons,
  };
}
