// Learning Loop — outcome tracking, conviction weight updates, and self-improvement.
//
// Every recommendation the system makes is tracked. When outcomes are recorded,
// conviction weights update: patterns that lead to positive outcomes strengthen,
// patterns that lead to negative outcomes weaken. The system gets smarter with
// every use.
//
// This is the self-improvement layer that makes FreeLeased a living system,
// not a static tool.

// ── Outcome Types ─────────────────────────────────────────────────

export type OutcomeType = "favorable" | "unfavorable" | "neutral" | "pending";

export interface Outcome {
  id: string;
  recommendationId: string;
  patternId: string;
  jurisdiction: string;
  outcome: OutcomeType;
  confidence: number; // 0..1
  evidence: string;
  recordedAt: Date;
  source: "user_feedback" | "tribunal_result" | "system_update";
}

export interface Recommendation {
  id: string;
  patternId: string;
  jurisdiction: string;
  claim: string;
  confidence: number;
  evidenceClass: "established" | "heuristic" | "contested" | "unfalsifiable";
  madeAt: Date;
  madeBy: "code" | "slm" | "llm" | "reconciliation";
}

// ── Conviction Weights ────────────────────────────────────────────

export interface ConvictionWeight {
  patternId: string;
  jurisdiction: string;
  weight: number; // 0..1
  outcomes: number;
  positive: number;
  negative: number;
  neutral: number;
  lastUpdated: Date;
}

// ── The Learning Engine ───────────────────────────────────────────

export class LearningEngine {
  private outcomes: Map<string, Outcome> = new Map();
  private convictions: Map<string, ConvictionWeight> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();

  /**
   * Record a recommendation made by the system.
   */
  recordRecommendation(rec: Omit<Recommendation, "id" | "madeAt">): Recommendation {
    const id = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const recommendation: Recommendation = {
      ...rec,
      id,
      madeAt: new Date(),
    };

    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  /**
   * Record an outcome for a recommendation.
   */
  recordOutcome(
    recommendationId: string,
    outcome: OutcomeType,
    evidence: string,
    source: Outcome["source"] = "user_feedback",
  ): Outcome | null {
    const rec = this.recommendations.get(recommendationId);
    if (!rec) return null;

    const id = `outcome_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const outcomeRecord: Outcome = {
      id,
      recommendationId,
      patternId: rec.patternId,
      jurisdiction: rec.jurisdiction,
      outcome,
      confidence: rec.confidence,
      evidence,
      recordedAt: new Date(),
      source,
    };

    this.outcomes.set(id, outcomeRecord);

    // Update conviction weight
    this.updateConviction(rec.patternId, rec.jurisdiction, outcome);

    return outcomeRecord;
  }

  /**
   * Update conviction weight based on outcome.
   */
  private updateConviction(
    patternId: string,
    jurisdiction: string,
    outcome: OutcomeType,
  ): void {
    const key = `${patternId}:${jurisdiction}`;
    const current = this.convictions.get(key) ?? {
      patternId,
      jurisdiction,
      weight: 0.5,
      outcomes: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      lastUpdated: new Date(),
    };

    // Update counts
    current.outcomes++;
    if (outcome === "favorable") current.positive++;
    if (outcome === "unfavorable") current.negative++;
    if (outcome === "neutral") current.neutral++;

    // Update weight using Bayesian-like update
    const alpha = 1; // prior strength
    const beta = 1;
    const posteriorAlpha = alpha + current.positive;
    const posteriorBeta = beta + current.negative;
    current.weight = posteriorAlpha / (posteriorAlpha + posteriorBeta);

    // Apply confidence decay for unfavorable outcomes
    if (outcome === "unfavorable") {
      current.weight *= 0.9; // 10% penalty
    }

    // Clamp weight
    current.weight = Math.max(0, Math.min(1, current.weight));
    current.lastUpdated = new Date();

    this.convictions.set(key, current);
  }

  /**
   * Get conviction weight for a pattern in a jurisdiction.
   */
  getConviction(patternId: string, jurisdiction: string): ConvictionWeight | null {
    return this.convictions.get(`${patternId}:${jurisdiction}`) ?? null;
  }

  /**
   * Get all conviction weights.
   */
  getAllConvictions(): ConvictionWeight[] {
    return Array.from(this.convictions.values());
  }

  /**
   * Get outcomes for a pattern.
   */
  getOutcomesForPattern(patternId: string): Outcome[] {
    return Array.from(this.outcomes.values()).filter(o => o.patternId === patternId);
  }

  /**
   * Get outcomes for a jurisdiction.
   */
  getOutcomesForJurisdiction(jurisdiction: string): Outcome[] {
    return Array.from(this.outcomes.values()).filter(o => o.jurisdiction === jurisdiction);
  }

  /**
   * Get learning statistics.
   */
  getStats(): {
    totalRecommendations: number;
    totalOutcomes: number;
    outcomeBreakdown: Record<OutcomeType, number>;
    averageConfidence: number;
    convictionsUpdated: number;
    strongestPatterns: Array<{ patternId: string; jurisdiction: string; weight: number }>;
    weakestPatterns: Array<{ patternId: string; jurisdiction: string; weight: number }>;
  } {
    const recs = Array.from(this.recommendations.values());
    const outcomes = Array.from(this.outcomes.values());
    const convictions = Array.from(this.convictions.values());

    const outcomeBreakdown: Record<OutcomeType, number> = {
      favorable: 0,
      unfavorable: 0,
      neutral: 0,
      pending: 0,
    };

    for (const o of outcomes) {
      outcomeBreakdown[o.outcome]++;
    }

    const avgConfidence = recs.length > 0
      ? recs.reduce((sum, r) => sum + r.confidence, 0) / recs.length
      : 0;

    const sorted = [...convictions].sort((a, b) => b.weight - a.weight);

    return {
      totalRecommendations: recs.length,
      totalOutcomes: outcomes.length,
      outcomeBreakdown,
      averageConfidence: avgConfidence,
      convictionsUpdated: convictions.length,
      strongestPatterns: sorted.slice(0, 5),
      weakestPatterns: sorted.slice(-5),
    };
  }

  /**
   * Get improvement trajectory.
   * Shows how conviction weights have changed over time.
   */
  getImprovementTrajectory(): Array<{
    date: string;
    averageWeight: number;
    outcomesRecorded: number;
  }> {
    // Group outcomes by date
    const byDate = new Map<string, Outcome[]>();
    for (const o of this.outcomes.values()) {
      const date = o.recordedAt.toISOString().split("T")[0];
      const list = byDate.get(date) ?? [];
      list.push(o);
      byDate.set(date, list);
    }

    const trajectory: Array<{
      date: string;
      averageWeight: number;
      outcomesRecorded: number;
    }> = [];

    let runningWeight = 0.5;
    for (const [date, dayOutcomes] of Array.from(byDate.entries()).sort()) {
      // Update running weight with day's outcomes
      for (const o of dayOutcomes) {
        if (o.outcome === "favorable") runningWeight = Math.min(1, runningWeight + 0.05);
        if (o.outcome === "unfavorable") runningWeight = Math.max(0, runningWeight - 0.05);
      }

      trajectory.push({
        date,
        averageWeight: runningWeight,
        outcomesRecorded: dayOutcomes.length,
      });
    }

    return trajectory;
  }

  /**
   * Export learning data for persistence.
   */
  exportData(): {
    outcomes: Outcome[];
    convictions: ConvictionWeight[];
    recommendations: Recommendation[];
  } {
    return {
      outcomes: Array.from(this.outcomes.values()),
      convictions: Array.from(this.convictions.values()),
      recommendations: Array.from(this.recommendations.values()),
    };
  }

  /**
   * Import learning data from persistence.
   */
  importData(data: {
    outcomes?: Outcome[];
    convictions?: ConvictionWeight[];
    recommendations?: Recommendation[];
  }): void {
    if (data.outcomes) {
      for (const o of data.outcomes) {
        this.outcomes.set(o.id, o);
      }
    }
    if (data.convictions) {
      for (const c of data.convictions) {
        this.convictions.set(`${c.patternId}:${c.jurisdiction}`, c);
      }
    }
    if (data.recommendations) {
      for (const r of data.recommendations) {
        this.recommendations.set(r.id, r);
      }
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────

export const learningEngine = new LearningEngine();
