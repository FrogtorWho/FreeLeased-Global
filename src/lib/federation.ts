// Federation — multi-jurisdiction instances with federated learning.
//
// Multiple instances share learnings without sharing data. Patterns
// (not personal data) propagate across the network. Community-validated
// patterns strengthen across jurisdictions. Data stays in-jurisdiction
// for compliance with local data protection laws.
//
// This is the global scaling layer that makes FreeLeased a protocol,
// not just a product.

// ── Instance Configuration ────────────────────────────────────────

export interface JurisdictionInstance {
  code: string;
  name: string;
  status: "active" | "standby" | "offline";
  dataSufficiency: number; // 0..100
  lastSync: Date | null;
  patternCount: number;
  statuteCount: number;
  sourceCount: number;
  version: string;
}

// ── Pattern Sharing ───────────────────────────────────────────────

export interface SharedPattern {
  id: string;
  sourceJurisdiction: string;
  pattern: {
    title: string;
    description: string;
    statuteIds: string[];
    jurisdictions: string[];
  };
  confidence: number;
  evidenceClass: "established" | "heuristic" | "contested";
  sharedAt: Date;
  validatedBy: string[]; // jurisdictions that validated
  propagationCount: number;
}

// ── Federated Learning ────────────────────────────────────────────

export interface FederatedUpdate {
  id: string;
  type: "pattern" | "conviction" | "statute" | "source";
  sourceJurisdiction: string;
  data: Record<string, unknown>;
  timestamp: Date;
  signature: string; // cryptographic signature for integrity
}

// ── The Federation Engine ─────────────────────────────────────────

export class FederationEngine {
  private instances: Map<string, JurisdictionInstance> = new Map();
  private sharedPatterns: Map<string, SharedPattern> = new Map();
  private federatedUpdates: FederatedUpdate[] = [];

  /**
   * Register a jurisdiction instance.
   */
  registerInstance(instance: JurisdictionInstance): void {
    this.instances.set(instance.code, instance);
  }

  /**
   * Get all registered instances.
   */
  getInstances(): JurisdictionInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Get instance by code.
   */
  getInstance(code: string): JurisdictionInstance | null {
    return this.instances.get(code) ?? null;
  }

  /**
   * Share a pattern across the federation.
   * Patterns are shared, not personal data.
   */
  sharePattern(pattern: SharedPattern): void {
    this.sharedPatterns.set(pattern.id, pattern);

    // Increment propagation count for existing patterns
    for (const existing of this.sharedPatterns.values()) {
      if (existing.id !== pattern.id && existing.pattern.title === pattern.pattern.title) {
        existing.propagationCount++;
      }
    }
  }

  /**
   * Get shared patterns for a jurisdiction.
   */
  getSharedPatterns(jurisdiction: string): SharedPattern[] {
    return Array.from(this.sharedPatterns.values()).filter(
      p => p.sourceJurisdiction === jurisdiction || p.validatedBy.includes(jurisdiction)
    );
  }

  /**
   * Validate a shared pattern from another jurisdiction.
   * Community validation strengthens the pattern.
   */
  validatePattern(patternId: string, validatingJurisdiction: string): void {
    const pattern = this.sharedPatterns.get(patternId);
    if (pattern && !pattern.validatedBy.includes(validatingJurisdiction)) {
      pattern.validatedBy.push(validatingJurisdiction);
      pattern.confidence = Math.min(1, pattern.confidence + 0.1);
    }
  }

  /**
   * Record a federated update.
   */
  recordUpdate(update: FederatedUpdate): void {
    this.federatedUpdates.push(update);
  }

  /**
   * Get federated updates for a jurisdiction.
   */
  getUpdatesForJurisdiction(jurisdiction: string): FederatedUpdate[] {
    return this.federatedUpdates.filter(u => u.sourceJurisdiction === jurisdiction);
  }

  /**
   * Get federation statistics.
   */
  getStats(): {
    totalInstances: number;
    activeInstances: number;
    totalSharedPatterns: number;
    totalFederatedUpdates: number;
    averageConfidence: number;
    crossJurisdictionTransfers: number;
  } {
    const instances = Array.from(this.instances.values());
    const patterns = Array.from(this.sharedPatterns.values());

    const avgConfidence = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
      : 0;

    const crossJurisdiction = patterns.filter(p => p.validatedBy.length > 1).length;

    return {
      totalInstances: instances.length,
      activeInstances: instances.filter(i => i.status === "active").length,
      totalSharedPatterns: patterns.length,
      totalFederatedUpdates: this.federatedUpdates.length,
      averageConfidence: avgConfidence,
      crossJurisdictionTransfers: crossJurisdiction,
    };
  }

  /**
   * Get network topology (which instances are connected).
   */
  getTopology(): Array<{
    source: string;
    target: string;
    strength: number;
    sharedPatterns: number;
  }> {
    const topology: Array<{
      source: string;
      target: string;
      strength: number;
      sharedPatterns: number;
    }> = [];

    // Find connections through shared patterns
    for (const pattern of this.sharedPatterns.values()) {
      for (const validator of pattern.validatedBy) {
        if (validator !== pattern.sourceJurisdiction) {
          const existing = topology.find(
            t => (t.source === pattern.sourceJurisdiction && t.target === validator) ||
                 (t.source === validator && t.target === pattern.sourceJurisdiction)
          );

          if (existing) {
            existing.sharedPatterns++;
            existing.strength = Math.min(1, existing.strength + 0.1);
          } else {
            topology.push({
              source: pattern.sourceJurisdiction,
              target: validator,
              strength: 0.5,
              sharedPatterns: 1,
            });
          }
        }
      }
    }

    return topology;
  }

  /**
   * Export federation data for persistence.
   */
  exportData(): {
    instances: JurisdictionInstance[];
    sharedPatterns: SharedPattern[];
    federatedUpdates: FederatedUpdate[];
  } {
    return {
      instances: Array.from(this.instances.values()),
      sharedPatterns: Array.from(this.sharedPatterns.values()),
      federatedUpdates: this.federatedUpdates,
    };
  }

  /**
   * Import federation data from persistence.
   */
  importData(data: {
    instances?: JurisdictionInstance[];
    sharedPatterns?: SharedPattern[];
    federatedUpdates?: FederatedUpdate[];
  }): void {
    if (data.instances) {
      for (const instance of data.instances) {
        this.instances.set(instance.code, instance);
      }
    }
    if (data.sharedPatterns) {
      for (const pattern of data.sharedPatterns) {
        this.sharedPatterns.set(pattern.id, pattern);
      }
    }
    if (data.federatedUpdates) {
      this.federatedUpdates = data.federatedUpdates;
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────

export const federationEngine = new FederationEngine();
