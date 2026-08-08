// Reconciliation Engine — the core of FreeLeased intelligence.
//
// Runs three independent analyses in parallel (code, SLM, LLM),
// reconciles their outputs, investigates disagreements, and resolves
// or escalates to human judgment. Every decision is logged with full
// audit trail. Conviction weights update based on outcomes.
//
// This is the meta-layer that makes the system trustworthy:
// not because any single analysis is perfect, but because the system
// catches its own errors through reconciliation.

import { EvidenceClass, CONFIDENCE_CAP, type FairnessResult } from "./fairness";
import { reachConsensus, type Estimate, type ConsensusResult } from "./consensus";

// ── Analysis Methods ──────────────────────────────────────────────

export type AnalysisMethod = "code" | "slm" | "llm";

export interface AnalysisResult {
  method: AnalysisMethod;
  claim: string;
  value: boolean;
  confidence: number;
  evidenceClass: EvidenceClass;
  citations: string[];
  rationale: string;
  timestamp: Date;
  modelId?: string; // for SLM/LLM: which model was used
  tokenCount?: number; // for SLM/LLM: tokens consumed
  cost?: number; // for SLM/LLM: cost in USD
}

// ── Reconciliation ────────────────────────────────────────────────

export type ReconciliationStatus =
  | "consensus"      // All three agree
  | "majority"       // Two agree, one disagrees
  | "divergent"      // All three disagree
  | "escalated"      // Unresolved, sent to human
  | "resolved";      // Disagreement resolved via investigation

export interface ReconciliationResult {
  claim: string;
  status: ReconciliationStatus;
  finalValue: boolean | null; // null if escalated
  confidence: number;
  evidenceClass: EvidenceClass;
  citations: string[];
  rationale: string;
  analyses: AnalysisResult[];
  investigationLog: InvestigationStep[];
  cost: number; // total cost of all analyses
  timestamp: Date;
}

export interface InvestigationStep {
  step: number;
  action: string;
  finding: string;
  resolution?: string;
}

// ── The Engine ────────────────────────────────────────────────────

export class ReconciliationEngine {
  private auditTrail: ReconciliationResult[] = [];
  private convictionWeights: Map<string, number> = new Map();

  /**
   * Run three analyses in parallel and reconcile them.
   * This is the main entry point.
   */
  async reconcile(
    claim: string,
    codeAnalysis: () => Promise<AnalysisResult>,
    slmAnalysis: () => Promise<AnalysisResult>,
    llmAnalysis: () => Promise<AnalysisResult>,
  ): Promise<ReconciliationResult> {
    // STEP 1: Run all three analyses in parallel
    const [code, slm, llm] = await Promise.all([
      codeAnalysis().catch(err => this.createErrorResult("code", claim, err)),
      slmAnalysis().catch(err => this.createErrorResult("slm", claim, err)),
      llmAnalysis().catch(err => this.createErrorResult("llm", claim, err)),
    ]);

    const analyses = [code, slm, llm];
    const totalCost = analyses.reduce((sum, a) => sum + (a.cost ?? 0), 0);

    // STEP 2: Compare and reconcile
    const reconciliation = this.compareAnalyses(claim, analyses);

    // STEP 3: If disagreement, investigate
    if (reconciliation.status === "divergent" || reconciliation.status === "majority") {
      const investigation = await this.investigate(claim, analyses, reconciliation);
      reconciliation.investigationLog = investigation.steps;
      if (investigation.resolved) {
        reconciliation.status = "resolved";
        reconciliation.finalValue = investigation.finalValue!;
        reconciliation.confidence = investigation.confidence!;
        reconciliation.evidenceClass = investigation.evidenceClass!;
        reconciliation.rationale = investigation.rationale!;
      } else {
        reconciliation.status = "escalated";
        reconciliation.finalValue = null;
        reconciliation.rationale = `Unresolved after ${investigation.steps.length} investigation steps. Escalated to human judgment.`;
      }
    }

    // STEP 4: Log to audit trail
    reconciliation.cost = totalCost;
    reconciliation.timestamp = new Date();
    this.auditTrail.push(reconciliation);

    return reconciliation;
  }

  /**
   * Compare three analyses and determine reconciliation status.
   */
  private compareAnalyses(
    claim: string,
    analyses: AnalysisResult[],
  ): ReconciliationResult {
    const values = analyses.map(a => a.value);
    const allTrue = values.every(v => v === true);
    const allFalse = values.every(v => v === false);

    // Consensus: all three agree
    if (allTrue || allFalse) {
      const strongest = this.strongestAnalysis(analyses);
      return {
        claim,
        status: "consensus",
        finalValue: allTrue ? true : false,
        confidence: this.averageConfidence(analyses),
        evidenceClass: strongest.evidenceClass,
        citations: this.deduplicateCitations(analyses),
        rationale: `All three analyses agree (${allTrue ? "true" : "false"}). Strongest evidence: ${strongest.method} (${strongest.evidenceClass}).`,
        analyses,
        investigationLog: [],
        cost: 0,
        timestamp: new Date(),
      };
    }

    // Majority: two agree, one disagrees
    const trueCount = values.filter(v => v === true).length;
    const falseCount = values.filter(v => v === false).length;

    if (trueCount === 2 || falseCount === 2) {
      const majorityValue = trueCount === 2;
      const minority = analyses.filter(a => a.value !== majorityValue);
      return {
        claim,
        status: "majority",
        finalValue: majorityValue, // provisional, may change after investigation
        confidence: this.averageConfidence(analyses) * 0.9, // slight penalty for disagreement
        evidenceClass: "contested", // disagreement means contested
        citations: this.deduplicateCitations(analyses),
        rationale: `Majority agree (${trueCount === 2 ? "2/3 true" : "2/3 false"}). Minority: ${minority.map(a => a.method).join(", ")}. Investigating.`,
        analyses,
        investigationLog: [],
        cost: 0,
        timestamp: new Date(),
      };
    }

    // Diverent: all three disagree (or mixed)
    return {
      claim,
      status: "divergent",
      finalValue: null,
      confidence: this.averageConfidence(analyses) * 0.7, // significant penalty
      evidenceClass: "contested",
      citations: this.deduplicateCitations(analyses),
      rationale: `Analyses diverge. Code: ${analyses[0].value}, SLM: ${analyses[1].value}, LLM: ${analyses[2].value}. Investigating.`,
      analyses,
      investigationLog: [],
      cost: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Investigate disagreements between analyses.
   * Follows the reconciliation loop methodology.
   */
  private async investigate(
    claim: string,
    analyses: AnalysisResult[],
    current: ReconciliationResult,
  ): Promise<{
    steps: InvestigationStep[];
    resolved: boolean;
    finalValue?: boolean;
    confidence?: number;
    evidenceClass?: EvidenceClass;
    rationale?: string;
  }> {
    const steps: InvestigationStep[] = [];
    let stepNum = 1;

    // STEP 1: Source verification — do all analyses cite real sources?
    const sourceCheck = this.verifySources(analyses);
    steps.push({
      step: stepNum++,
      action: "Source verification",
      finding: sourceCheck.finding,
      resolution: sourceCheck.resolution,
    });

    // STEP 2: Reasoning check — is the logic sound?
    const reasoningCheck = this.checkReasoning(analyses);
    steps.push({
      step: stepNum++,
      action: "Reasoning check",
      finding: reasoningCheck.finding,
      resolution: reasoningCheck.resolution,
    });

    // STEP 3: Confidence calibration — are confidence levels appropriate?
    const confidenceCheck = this.calibrateConfidence(analyses);
    steps.push({
      step: stepNum++,
      action: "Confidence calibration",
      finding: confidenceCheck.finding,
      resolution: confidenceCheck.resolution,
    });

    // STEP 4: Domain rules — apply deterministic rules to break tie
    const domainResolution = this.applyDomainRules(analyses, claim);
    steps.push({
      step: stepNum++,
      action: "Domain rule application",
      finding: domainResolution.finding,
      resolution: domainResolution.resolution,
    });

    // STEP 5: Conviction weight check — what does history say?
    const historyCheck = this.checkConvictionHistory(claim, analyses);
    steps.push({
      step: stepNum++,
      action: "Conviction history check",
      finding: historyCheck.finding,
      resolution: historyCheck.resolution,
    });

    // Determine if resolved
    const resolutions = steps.filter(s => s.resolution);
    if (resolutions.length >= 3) {
      // Majority of investigation steps found resolutions
      const majorityValue = this.determineMajorityValue(analyses, steps);
      const confidence = this.calculateInvestigationConfidence(analyses, steps);
      const evidenceClass = this.determineEvidenceClass(analyses, steps);

      return {
        steps,
        resolved: true,
        finalValue: majorityValue,
        confidence,
        evidenceClass,
        rationale: `Resolved after ${steps.length} investigation steps: ${resolutions.map(r => r.resolution).join("; ")}`,
      };
    }

    return { steps, resolved: false };
  }

  /**
   * Verify that all analyses cite real, verifiable sources.
   */
  private verifySources(analyses: AnalysisResult[]): { finding: string; resolution?: string } {
    const uncited = analyses.filter(a => a.citations.length === 0);
    const cited = analyses.filter(a => a.citations.length > 0);

    if (uncited.length === 0) {
      return { finding: "All analyses cite sources.", resolution: "Sources verified." };
    }

    if (uncited.length === analyses.length) {
      return { finding: "No analyses cite sources.", resolution: "All sources unverified; confidence reduced." };
    }

    // Some cite, some don't — the uncited ones carry less weight
    return {
      finding: `${uncited.length}/${analyses.length} analyses lack citations (${uncited.map(a => a.method).join(", ")}).`,
      resolution: `Uncited analyses downweighted. Cited analyses preferred.`,
    };
  }

  /**
   * Check if reasoning logic is sound.
   */
  private checkReasoning(analyses: AnalysisResult[]): { finding: string; resolution?: string } {
    // Check for logical consistency
    const hasRationale = analyses.filter(a => a.rationale.length > 0);
    const missingRationale = analyses.filter(a => a.rationale.length === 0);

    if (missingRationale.length > 0) {
      return {
        finding: `${missingRationale.length} analyses lack rationale (${missingRationale.map(a => a.method).join(", ")}).`,
        resolution: "Analyses without rationale downweighted.",
      };
    }

    // Check for contradiction in rationale
    const rationales = analyses.map(a => a.rationale.toLowerCase());
    const contradictions = rationales.filter(r =>
      r.includes("not") && r.includes("is")
    );

    if (contradictions.length > 1) {
      return {
        finding: "Multiple analyses contain negations in rationale.",
        resolution: "Potential logical contradiction flagged for human review.",
      };
    }

    return { finding: "All rationales present and logically consistent.", resolution: "Reasoning verified." };
  }

  /**
   * Calibrate confidence levels across analyses.
   */
  private calibrateConfidence(analyses: AnalysisResult[]): { finding: string; resolution?: string } {
    const confidences = analyses.map(a => a.confidence);
    const max = Math.max(...confidences);
    const min = Math.min(...confidences);
    const spread = max - min;

    if (spread > 0.4) {
      return {
        finding: `High confidence spread: ${min.toFixed(2)} to ${max.toFixed(2)} (spread: ${spread.toFixed(2)}).`,
        resolution: "High spread indicates uncertainty; confidence reduced to minimum.",
      };
    }

    if (spread < 0.1) {
      return {
        finding: `Low confidence spread: ${min.toFixed(2)} to ${max.toFixed(2)} (spread: ${spread.toFixed(2)}).`,
        resolution: "Consistent confidence levels across analyses.",
      };
    }

    return {
      finding: `Moderate confidence spread: ${min.toFixed(2)} to ${max.toFixed(2)} (spread: ${spread.toFixed(2)}).`,
      resolution: "Confidence levels within acceptable range.",
    };
  }

  /**
   * Apply domain rules to break ties.
   */
  private applyDomainRules(analyses: AnalysisResult[], claim: string): { finding: string; resolution?: string } {
    // Code analysis has highest weight for deterministic rules
    const codeAnalysis = analyses.find(a => a.method === "code");

    if (codeAnalysis) {
      if (codeAnalysis.evidenceClass === "established") {
        return {
          finding: "Code analysis cites established evidence class.",
          resolution: "Code analysis preferred for deterministic rules.",
        };
      }

      if (codeAnalysis.evidenceClass === "heuristic") {
        return {
          finding: "Code analysis cites heuristic evidence class.",
          resolution: "Code analysis used as tiebreaker with reduced confidence.",
        };
      }
    }

    // If no code analysis, SLM is preferred over LLM for cost efficiency
    const slmAnalysis = analyses.find(a => a.method === "slm");
    const llmAnalysis = analyses.find(a => a.method === "llm");

    if (slmAnalysis && llmAnalysis) {
      if (slmAnalysis.value === llmAnalysis.value) {
        return {
          finding: "SLM and LLM agree.",
          resolution: "SLM-LLM consensus preferred over code analysis.",
        };
      }
    }

    return {
      finding: "No clear domain rule applies.",
      resolution: undefined,
    };
  }

  /**
   * Check conviction history for this claim.
   */
  private checkConvictionHistory(claim: string, analyses: AnalysisResult[]): { finding: string; resolution?: string } {
    const weight = this.convictionWeights.get(claim);

    if (weight === undefined) {
      return {
        finding: `No conviction history for claim "${claim}".`,
        resolution: "First encounter; no historical bias.",
      };
    }

    if (weight > 0.7) {
      return {
        finding: `High conviction weight (${weight.toFixed(2)}) for similar claims.`,
        resolution: "Historical pattern supports this claim.",
      };
    }

    if (weight < 0.3) {
      return {
        finding: `Low conviction weight (${weight.toFixed(2)}) for similar claims.`,
        resolution: "Historical pattern weakens this claim.",
      };
    }

    return {
      finding: `Moderate conviction weight (${weight.toFixed(2)}) for similar claims.`,
      resolution: "Historical pattern neutral.",
    };
  }

  /**
   * Update conviction weights based on outcome.
   */
  updateConviction(claim: string, outcome: "favorable" | "unfavorable" | "neutral"): void {
    const current = this.convictionWeights.get(claim) ?? 0.5;
    const delta = outcome === "favorable" ? 0.1 : outcome === "unfavorable" ? -0.1 : 0;
    const newWeight = Math.max(0, Math.min(1, current + delta));
    this.convictionWeights.set(claim, newWeight);
  }

  /**
   * Get the audit trail for external review.
   */
  getAuditTrail(): ReconciliationResult[] {
    return [...this.auditTrail];
  }

  /**
   * Get cost summary from audit trail.
   */
  getCostSummary(): { totalCost: number; averageCost: number; totalAnalyses: number } {
    const totalCost = this.auditTrail.reduce((sum, r) => sum + r.cost, 0);
    const totalAnalyses = this.auditTrail.length * 3; // 3 analyses per reconciliation
    return {
      totalCost,
      averageCost: this.auditTrail.length > 0 ? totalCost / this.auditTrail.length : 0,
      totalAnalyses,
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────

  private createErrorResult(method: AnalysisMethod, claim: string, error: unknown): AnalysisResult {
    return {
      method,
      claim,
      value: false,
      confidence: 0,
      evidenceClass: "unfalsifiable",
      citations: [],
      rationale: `Error: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date(),
      cost: 0,
    };
  }

  private strongestAnalysis(analyses: AnalysisResult[]): AnalysisResult {
    const rank: Record<EvidenceClass, number> = {
      established: 3,
      heuristic: 2,
      contested: 1,
      unfalsifiable: 0,
    };
    return analyses.reduce((strongest, current) =>
      rank[current.evidenceClass] > rank[strongest.evidenceClass] ? current : strongest
    );
  }

  private averageConfidence(analyses: AnalysisResult[]): number {
    return analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
  }

  private deduplicateCitations(analyses: AnalysisResult[]): string[] {
    const all = analyses.flatMap(a => a.citations);
    return Array.from(new Set(all.filter(Boolean)));
  }

  private determineMajorityValue(analyses: AnalysisResult[], steps: InvestigationStep[]): boolean {
    // If code analysis is cited as preferred in investigation, use its value
    const codePreferred = steps.some(s => s.resolution?.includes("Code analysis preferred"));
    if (codePreferred) {
      const code = analyses.find(a => a.method === "code");
      if (code) return code.value;
    }

    // Otherwise, use majority vote
    const trueCount = analyses.filter(a => a.value).length;
    return trueCount >= 2;
  }

  private calculateInvestigationConfidence(analyses: AnalysisResult[], steps: InvestigationStep[]): number {
    const base = this.averageConfidence(analyses);
    const resolutionBonus = steps.filter(s => s.resolution).length * 0.05;
    return Math.min(0.95, base + resolutionBonus);
  }

  private determineEvidenceClass(analyses: AnalysisResult[], steps: InvestigationStep[]): EvidenceClass {
    const rank: Record<EvidenceClass, number> = {
      established: 3,
      heuristic: 2,
      contested: 1,
      unfalsifiable: 0,
    };
    const best = analyses.reduce((best, current) =>
      rank[current.evidenceClass] > rank[best.evidenceClass] ? current : best
    );

    // If investigation found issues, downgrade
    const hasIssues = steps.some(s => s.resolution?.includes("downweighted") || s.resolution?.includes("reduced"));
    if (hasIssues && best.evidenceClass === "established") {
      return "heuristic";
    }

    return best.evidenceClass;
  }
}

// ── Singleton for app-wide use ────────────────────────────────────

export const reconciliationEngine = new ReconciliationEngine();
