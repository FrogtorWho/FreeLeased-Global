// Dynamic jurisdiction maturity — derived from the spine, not hardcoded.
//
// The consensus gate becomes *robust and dynamic* to each legal framework by
// reading how well-established that framework's codified spine actually is.
// Maturity is computed from the conviction of a jurisdiction's statutes, so as
// sources are promoted (inference -> verified) the jurisdiction automatically
// earns more trust in its codified layer and needs less agentic corroboration.
// Nothing here is a per-jurisdiction constant; it is all read from the data.

import { STATUTES, JURISDICTIONS } from "../data/spine";

export type Maturity = "established" | "developing" | "nascent";

const STRONG = new Set(["confirmed", "verified", "primary", "quantitative"]);

export interface MaturityAssessment {
  jurisdiction: string;
  statuteCount: number;
  strongCount: number;
  verifiedRatio: number; // 0..1
  maturity: Maturity;
}

// Compute maturity for one jurisdiction code from its statute convictions.
export function assessJurisdiction(code: string): MaturityAssessment {
  const statutes = STATUTES.filter((s) => s.jurisdiction === code);
  const strongCount = statutes.filter((s) => STRONG.has(s.conviction)).length;
  const verifiedRatio = statutes.length ? strongCount / statutes.length : 0;

  let maturity: Maturity = "nascent";
  if (statutes.length >= 3 && verifiedRatio >= 0.75) maturity = "established";
  else if (statutes.length >= 1 && verifiedRatio >= 0.4) maturity = "developing";

  return {
    jurisdiction: code,
    statuteCount: statutes.length,
    strongCount,
    verifiedRatio: Number(verifiedRatio.toFixed(2)),
    maturity,
  };
}

export function maturityFor(code: string): Maturity {
  return assessJurisdiction(code).maturity;
}

// Full report across every jurisdiction in the spine (for the API + dashboard).
export function maturityReport(): MaturityAssessment[] {
  return JURISDICTIONS.map((j) => assessJurisdiction(j.code)).sort(
    (a, b) => b.verifiedRatio - a.verifiedRatio,
  );
}
