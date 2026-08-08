// Jurisdiction Enrichment Layer
//
// Structured schemas for tribunal decisions, advisory guidance, and
// cross-jurisdiction bridging. This is the interpretive layer that turns
// "what the law says" into "what actually happens in practice."
//
// The onboarding process is repeatable: same schemas, same extraction
// pipeline, same cross-referencing logic for every jurisdiction.

// ── Tribunal Decision ─────────────────────────────────────────────

export type PartyType =
  | "leaseholder"
  | "freeholder"
  | "management_company"
  | "right_to_manage_company"
  | "local_authority"
  | "other";

export type CaseOutcome =
  | "favorable_applicant"
  | "favorable_respondent"
  | "mixed"
  | "settled"
  | "dismissed";

export type PrecedentStrength =
  | "binding"      // Must be followed by same/superior tribunal
  | "persuasive"   // Should be considered, not binding
  | "illustrative"; // Example only

export interface TribunalDecision {
  id: string;
  citation: string;              // "UKFTT 2024/0123"
  jurisdiction: string;          // "UK", "BB", "JM"
  tribunal: string;              // "First-tier Tribunal (Property Chamber)"
  date: Date;

  // Parties
  applicantType: PartyType;
  respondentType: PartyType;
  applicantDescription?: string; // "Leaseholder of Flat 4, 12 High Street"
  respondentDescription?: string;

  // Structured facts (the key info/points from the case)
  keyFacts: string[];
  legalIssues: string[];         // ["s.20 consultation", "reasonableness of costs"]
  statutesCited: string[];       // ["s.20 LTA 1985", "s.20C LTA 1985"]

  // Advisory cross-references
  advisoryGuidanceIds: string[];  // Links to AdvisoryGuidance nodes

  // Outcome
  decision: string;              // Plain-English summary
  reasoning: string;             // Why the tribunal decided this way
  remedy: string;                // What relief was granted
  outcome: CaseOutcome;

  // Precedent value
  precedentStrength: PrecedentStrength;
  principleExtracted: string;    // "Service charge consultation requires itemised budget"

  // Metadata
  sourceUrl?: string;
  sourceTier: "primary" | "secondary" | "tertiary";
  conviction: "verified" | "confirmed" | "inferred";
  lastVerified: Date;
}

// ── Advisory Guidance ─────────────────────────────────────────────

export type AdvisorySource =
  | "LEASE"               // lease-advice.org (UK)
  | "CitizensAdvice"      // citizensadvice.org.uk (UK)
  | "Shelter"             // shelter.org.uk (UK)
  | "ARMA"                // arma.org.uk (UK, managing agents)
  | "RICS"                // rics.org (UK, surveyors)
  | "LawCommission"       // lawcom.gov.uk (UK, reform)
  | "HousingOmbudsman"    // housing-ombudsman.org.uk (UK)
  | "GLA"                 // Greater London Authority (UK)
  | "CaribbeanBar"        // Caribbean bar associations
  | "GovernmentGuide"     // Official government guidance
  | "Other";

export type GuidanceReliability = "official" | "advisory" | "community";

export interface AdvisoryGuidance {
  id: string;
  source: AdvisorySource;
  sourceName: string;          // "Leasehold Advisory Service"
  url: string;
  title: string;
  topic: string;
  jurisdiction: string;

  // Content
  plainEnglish: string;        // Simplified explanation
  keyPoints: string[];         // Bullet-point takeaways
  practicalAdvice: string[];   // What to do in practice

  // Cross-references
  relatedStatuteIds: string[]; // Links to statute nodes
  relatedDecisionIds: string[];// Links to TribunalDecision nodes
  relatedPatternIds: string[]; // Links to knowledge graph patterns

  // Metadata
  lastUpdated: Date;
  reliability: GuidanceReliability;
  conviction: "verified" | "confirmed" | "inferred";
}

// ── Jurisdiction Framework Profile ────────────────────────────────

export type LegalTradition = "common_law" | "civil_law" | "mixed" | "customary";

export interface JurisdictionFramework {
  code: string;
  name: string;
  legalTradition: LegalTradition;

  // Property governance structure
  primaryLegislation: string[];     // Main property acts
  tribunalSystem: string[];         // Courts/tribunals that hear property cases
  regulatoryBodies: string[];       // Regulators and ombudsmen
  advisoryOrganizations: string[];  // Free advisory resources

  // Data availability
  tribunalDecisionsOnline: boolean;
  advisoryGuidanceOnline: boolean;
  legislationOnline: boolean;
  dataSufficiency: number;          // 0..100

  // Bridge to other frameworks
  analogousFrameworks: Array<{
    jurisdictionCode: string;
    similarity: number;             // 0..1
    sharedPrinciples: string[];     // ["leasehold", "right to manage", "service charges"]
    keyDifferences: string[];       // ["tribunal structure", "cost recovery"]
  }>;
}

// ── Case Similarity Engine ────────────────────────────────────────

export interface SimilarityResult {
  decision: TribunalDecision;
  similarityScore: number;        // 0..1
  matchingFacts: string[];        // Which facts match
  matchingIssues: string[];       // Which legal issues match
  precedentRelevance: number;     // 0..1, how relevant to current query
}

/**
 * Find tribunal decisions similar to a given situation.
 * Compares facts, legal issues, and party types.
 */
export function findSimilarCases(
  decisions: TribunalDecision[],
  query: {
    keyFacts: string[];
    legalIssues: string[];
    applicantType?: PartyType;
    jurisdiction?: string;
  },
): SimilarityResult[] {
  const results: SimilarityResult[] = [];

  for (const decision of decisions) {
    // Filter by jurisdiction if specified
    if (query.jurisdiction && decision.jurisdiction !== query.jurisdiction) {
      continue;
    }

    // Calculate fact similarity
    const matchingFacts = findMatchingItems(query.keyFacts, decision.keyFacts);
    const factScore = query.keyFacts.length > 0
      ? matchingFacts.length / query.keyFacts.length
      : 0;

    // Calculate legal issue overlap
    const matchingIssues = findMatchingItems(query.legalIssues, decision.legalIssues);
    const issueScore = query.legalIssues.length > 0
      ? matchingIssues.length / query.legalIssues.length
      : 0;

    // Party type match bonus
    const partyBonus = query.applicantType && decision.applicantType === query.applicantType
      ? 0.1
      : 0;

    // Precedent strength bonus
    const precedentBonus = decision.precedentStrength === "binding"
      ? 0.15
      : decision.precedentStrength === "persuasive"
        ? 0.08
        : 0;

    // Combined similarity score
    const similarityScore = Math.min(1,
      (factScore * 0.4) +
      (issueScore * 0.4) +
      partyBonus +
      precedentBonus
    );

    // Only include if there is meaningful similarity
    if (similarityScore > 0.1) {
      results.push({
        decision,
        similarityScore,
        matchingFacts,
        matchingIssues,
        precedentRelevance: similarityScore * (decision.precedentStrength === "binding" ? 1.5 : 1),
      });
    }
  }

  // Sort by similarity descending
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * Find matching items between two string arrays using fuzzy matching.
 */
function findMatchingItems(queryItems: string[], caseItems: string[]): string[] {
  const matches: string[] = [];

  for (const query of queryItems) {
    const queryLower = query.toLowerCase();
    for (const item of caseItems) {
      const itemLower = item.toLowerCase();

      // Exact match
      if (queryLower === itemLower) {
        matches.push(query);
        break;
      }

      // Partial match (one contains the other)
      if (queryLower.includes(itemLower) || itemLower.includes(queryLower)) {
        matches.push(query);
        break;
      }

      // Keyword overlap
      const queryWords = queryLower.split(/\s+/);
      const itemWords = itemLower.split(/\s+/);
      const commonWords = queryWords.filter(w => itemWords.includes(w) && w.length > 3);
      if (commonWords.length >= 2) {
        matches.push(query);
        break;
      }
    }
  }

  return matches;
}

// ── Jurisdiction Bridge ───────────────────────────────────────────

/**
 * Find the best bridging framework for a new jurisdiction.
 * Compares legal tradition, property governance structure, and existing frameworks.
 */
export function findBridgingFramework(
  newJurisdiction: JurisdictionFramework,
  existingJurisdictions: JurisdictionFramework[],
): Array<{
  jurisdictionCode: string;
  bridgeStrength: number;
  sharedElements: string[];
  adaptationNeeded: string[];
}> {
  const bridges: Array<{
    jurisdictionCode: string;
    bridgeStrength: number;
    sharedElements: string[];
    adaptationNeeded: string[];
  }> = [];

  for (const existing of existingJurisdictions) {
    if (existing.code === newJurisdiction.code) continue;

    const sharedElements: string[] = [];
    const adaptationNeeded: string[] = [];

    // Legal tradition match
    if (existing.legalTradition === newJurisdiction.legalTradition) {
      sharedElements.push("legal_tradition");
    } else {
      adaptationNeeded.push("legal_tradition");
    }

    // Primary legislation overlap
    const sharedLegislation = existing.primaryLegislation.filter(
      l => newJurisdiction.primaryLegislation.some(
        nl => l.toLowerCase() === nl.toLowerCase()
      )
    );
    if (sharedLegislation.length > 0) {
      sharedElements.push(`legislation: ${sharedLegislation.join(", ")}`);
    }

    // Tribunal system similarity
    const sharedTribunals = existing.tribunalSystem.filter(
      t => newJurisdiction.tribunalSystem.some(
        nt => t.toLowerCase().includes(nt.toLowerCase()) ||
              nt.toLowerCase().includes(t.toLowerCase())
      )
    );
    if (sharedTribunals.length > 0) {
      sharedElements.push(`tribunals: ${sharedTribunals.join(", ")}`);
    }

    // Advisory organization overlap
    const sharedAdvisory = existing.advisoryOrganizations.filter(
      a => newJurisdiction.advisoryOrganizations.some(
        na => a.toLowerCase() === na.toLowerCase()
      )
    );
    if (sharedAdvisory.length > 0) {
      sharedElements.push(`advisory: ${sharedAdvisory.join(", ")}`);
    }

    // Regulatory body overlap
    const sharedRegulators = existing.regulatoryBodies.filter(
      r => newJurisdiction.regulatoryBodies.some(
        nr => r.toLowerCase() === nr.toLowerCase()
      )
    );
    if (sharedRegulators.length > 0) {
      sharedElements.push(`regulators: ${sharedRegulators.join(", ")}`);
    }

    // Calculate bridge strength
    const bridgeStrength = sharedElements.length / (
      sharedElements.length + adaptationNeeded.length
    );

    if (bridgeStrength > 0) {
      bridges.push({
        jurisdictionCode: existing.code,
        bridgeStrength,
        sharedElements,
        adaptationNeeded,
      });
    }
  }

  return bridges.sort((a, b) => b.bridgeStrength - a.bridgeStrength);
}

// ── Onboarding Checklist ──────────────────────────────────────────

export interface OnboardingStep {
  step: number;
  name: string;
  description: string;
  required: boolean;
  dataCollected: string[];
  verificationMethod: string;
}

export const JURISDICTION_ONBOARDING: OnboardingStep[] = [
  {
    step: 1,
    name: "Legal Framework Mapping",
    description: "Identify primary legislation, legal tradition, and property governance structure",
    required: true,
    dataCollected: ["primaryLegislation", "legalTradition", "tribunalSystem"],
    verificationMethod: "Cross-reference with official government sources",
  },
  {
    step: 2,
    name: "Source Identification",
    description: "Map all free advisory resources, tribunal databases, and guidance documents",
    required: true,
    dataCollected: ["advisoryOrganizations", "regulatoryBodies", "sourceUrls"],
    verificationMethod: "Verify URLs are live and content is current",
  },
  {
    step: 3,
    name: "Statute Ingestion",
    description: "Load all primary legislation into the knowledge graph",
    required: true,
    dataCollected: ["statuteNodes", "statuteCitations", "statuteUrls"],
    verificationMethod: "Validate citations against official legislation database",
  },
  {
    step: 4,
    name: "Tribunal Decision Extraction",
    description: "Structure key tribunal decisions into the database",
    required: false,
    dataCollected: ["tribunalDecisions", "keyFacts", "legalIssues", "outcomes"],
    verificationMethod: "Cross-reference citations with tribunal database",
  },
  {
    step: 5,
    name: "Advisory Guidance Ingestion",
    description: "Ingest and cross-reference advisory guidance with statutes",
    required: false,
    dataCollected: ["advisoryGuidance", "plainEnglish", "keyPoints"],
    verificationMethod: "Verify advisory source is official and current",
  },
  {
    step: 6,
    name: "Pattern Extraction",
    description: "Identify recurring patterns from tribunal decisions and advisory guidance",
    required: false,
    dataCollected: ["patterns", "patternFrequency", "outcomeRates"],
    verificationMethod: "Validate patterns against at least 3 decisions",
  },
  {
    step: 7,
    name: "Cross-Jurisdiction Bridging",
    description: "Map analogous provisions in connected jurisdictions",
    required: false,
    dataCollected: ["bridges", "sharedPrinciples", "keyDifferences"],
    verificationMethod: "Verify shared legal tradition and governance structure",
  },
  {
    step: 8,
    name: "Community Validation",
    description: "Local expert review of mapped data for accuracy",
    required: false,
    dataCollected: ["validationStatus", "corrections", "confidenceAdjustments"],
    verificationMethod: "At least one local expert confirms data accuracy",
  },
];
