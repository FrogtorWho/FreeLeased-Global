// Lease & Contract Fairness Check — document-only analysis.
// Scores CLAUSES against statute, never profiles people. No social scoring,
// emotion inference, biometric categorisation, or behavioural prediction.
// Every flag is advisory, cites the governing law, and carries an evidence
// class that caps its displayed confidence. Output is a candidate for human
// review, not legal advice. Deterministic and transparent (no ML).

export type EvidenceClass = "established" | "heuristic" | "contested" | "unfalsifiable";

// Confidence ceiling per evidence class. Honesty is enforced here: a flag can
// never display more certainty than its evidentiary basis allows.
// Canonical caps per truth-protocol.md (see project/strategy/truth-protocol.md).
export const CONFIDENCE_CAP: Record<EvidenceClass, number> = {
  established: 0.99,
  heuristic: 0.75,
  contested: 0.6,
  unfalsifiable: 0.33,
};

export type Severity = "high" | "medium" | "low";

export interface StatuteRule {
  id: string;
  topic: string;
  // Case-insensitive pattern that identifies a candidate clause.
  pattern: RegExp;
  // Statute referenced at Act level. Exact sections are marked heuristic until
  // verified against the jurisdiction's text, per the honesty principle.
  citation: string;
  jurisdictions: string[] | "all";
  severity: Severity;
  evidenceClass: EvidenceClass;
  explanation: string;
  rawConfidence: number; // pre-cap signal strength, 0..1
}

export interface FairnessFlag {
  ruleId: string;
  topic: string;
  clauseExcerpt: string;
  citation: string;
  severity: Severity;
  evidenceClass: EvidenceClass;
  confidence: number; // always <= CONFIDENCE_CAP[evidenceClass]
  explanation: string;
}

export interface FairnessResult {
  jurisdiction: string;
  clauseCount: number;
  flags: FairnessFlag[];
  disclaimer: string;
}

const DISCLAIMER =
  "These flags are candidates for human review, not legal advice. Each cites the governing law and is capped by an evidence class. Verify against the current statute for the jurisdiction.";

// Illustrative ruleset. Citations are at Act level and evidence-classed
// honestly: broadly settled tenant protections are "established"; provisions
// whose exact wording varies by jurisdiction are "heuristic" or "contested".
export const DEFAULT_RULES: StatuteRule[] = [
  {
    id: "entry-without-notice",
    topic: "Right to quiet enjoyment / notice of entry",
    pattern: /(landlord|lessor).{0,40}(enter|access).{0,40}(any\s*time|without\s*(notice|permission)|at\s*will)/i,
    citation: "Rent Restriction / Landlord and Tenant Act (quiet enjoyment)",
    jurisdictions: "all",
    severity: "high",
    evidenceClass: "established",
    explanation:
      "A clause allowing entry at any time without notice conflicts with the tenant's right to quiet enjoyment; reasonable prior notice is generally required.",
    rawConfidence: 0.9,
  },
  {
    id: "excessive-deposit",
    topic: "Security deposit limits",
    pattern: /(deposit|security).{0,30}(equal to|of)\s*(three|four|five|six|3|4|5|6)\s*months?/i,
    citation: "Rent Restriction Act (deposit provisions)",
    jurisdictions: "all",
    severity: "medium",
    evidenceClass: "heuristic",
    explanation:
      "A deposit of several months' rent may exceed the statutory cap in some jurisdictions. Confirm the local limit.",
    rawConfidence: 0.7,
  },
  {
    id: "waive-repairs",
    topic: "Non-waivable repair duty",
    pattern: /(tenant|lessee).{0,40}(waives?|gives?\s*up|responsible for all).{0,40}(repair|habitab|structural)/i,
    citation: "Landlord and Tenant Act (implied covenant to repair)",
    jurisdictions: "all",
    severity: "high",
    evidenceClass: "established",
    explanation:
      "A landlord's duty to keep the premises habitable and structurally sound is typically not waivable by contract.",
    rawConfidence: 0.85,
  },
  {
    id: "penalty-late-fee",
    topic: "Unenforceable penalty",
    pattern: /(late\s*fee|penalty).{0,30}(\d{2,}%|per\s*day|compound|compound)/i,
    citation: "Common law rule against penalties",
    jurisdictions: "all",
    severity: "medium",
    evidenceClass: "contested",
    explanation:
      "A late fee that functions as a penalty rather than a genuine estimate of loss may be unenforceable. Interpretation varies.",
    rawConfidence: 0.6,
  },
  {
    id: "retaliatory-eviction",
    topic: "Retaliatory eviction",
    pattern: /(evict|terminate).{0,40}(complaint|report|authorit|repair request)/i,
    citation: "Rent Restriction Act (security of tenure)",
    jurisdictions: "all",
    severity: "high",
    evidenceClass: "heuristic",
    explanation:
      "A clause permitting eviction in response to a tenant complaint may amount to unlawful retaliatory eviction.",
    rawConfidence: 0.7,
  },
  {
    id: "bb-short-notice-termination",
    topic: "Notice to quit (Barbados)",
    pattern: /(terminate|quit|vacate).{0,30}(24\s*hours?|48\s*hours?|one\s*day|1\s*day|immediately)/i,
    citation: "Barbados Residential Tenancies Act, Cap. 230 (notice to quit)",
    jurisdictions: ["BB"],
    severity: "high",
    evidenceClass: "heuristic",
    explanation:
      "A termination notice far shorter than the statutory minimum is likely unenforceable in Barbados. Confirm the required notice period for the tenancy type.",
    rawConfidence: 0.65,
  },
  {
    id: "tt-rent-increase-no-notice",
    topic: "Rent increase without notice (Trinidad and Tobago)",
    pattern: /(rent).{0,30}(increase|raise).{0,40}(without notice|at any time|any time|sole discretion)/i,
    citation: "Trinidad and Tobago Rent Restriction Act, Chap. 59:50 (permitted increases)",
    jurisdictions: ["TT"],
    severity: "medium",
    evidenceClass: "contested",
    explanation:
      "Rent increases without proper notice or above permitted limits may be restricted for controlled premises. Interpretation depends on whether the premises are controlled.",
    rawConfidence: 0.55,
  },
  // ── United Kingdom (launch market) ──────────────────────────────────────────
  {
    id: "uk-deposit-cap",
    topic: "Tenancy deposit cap (UK)",
    pattern: /(deposit|security)\b.{0,30}((six|seven|eight|nine|ten|[6-9]|1[0-2])\s*weeks?|(two|2|three|3)\s*months?)/i,
    citation: "Tenant Fees Act 2019, s.1 & Sch.1 (deposit capped at 5 weeks' rent)",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "For most assured shorthold tenancies the deposit is capped at 5 weeks' rent (6 weeks if annual rent is £50,000+). A deposit above that cap is a prohibited payment.",
    rawConfidence: 0.9,
  },
  {
    id: "uk-banned-fees",
    topic: "Prohibited letting fees (UK)",
    pattern: /(admin(istration)?|renewal|inventory|check[-\s]?out|reference|tenancy\s*set[-\s]?up|credit\s*check)\s*fees?/i,
    citation: "Tenant Fees Act 2019, s.1 (ban on prohibited payments)",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "Charging a tenant admin, renewal, inventory, referencing or credit-check fees is generally prohibited under the Tenant Fees Act 2019; only limited permitted payments are allowed.",
    rawConfidence: 0.9,
  },
  {
    id: "uk-deposit-not-protected",
    topic: "Deposit protection (UK)",
    pattern: /(deposit).{0,40}(not|won'?t|will\s*not|need\s*not|shall\s*not).{0,25}(protect|scheme|tenancy\s*deposit)/i,
    citation: "Housing Act 2004, Part 6 (tenancy deposit protection)",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "A deposit for an assured shorthold tenancy must be protected in a government-approved scheme within 30 days. A clause stating it will not be protected is unlawful.",
    rawConfidence: 0.85,
  },
  {
    id: "uk-fitness-waiver",
    topic: "Fitness for human habitation (UK)",
    pattern: /(let|rented|provided|taken)\s*(as[-\s]is|as\s*seen)|(tenant|lessee).{0,30}(waives?|accepts?).{0,25}(fitness|habitab|repair)/i,
    citation: "Homes (Fitness for Human Habitation) Act 2018 (LTA 1985 s.9A); LTA 1985 s.11",
    jurisdictions: ["UK"],
    severity: "medium",
    evidenceClass: "heuristic",
    explanation:
      "The landlord's implied covenant that the dwelling is fit for human habitation and the s.11 repairing duty cannot be contracted out of. 'As-is' letting or a fitness waiver is likely void.",
    rawConfidence: 0.6,
  },
  // ── British Virgin Islands (roadmap) ────────────────────────────────────────
  {
    id: "vg-hurricane-repairs",
    topic: "Storm-damage repair burden (BVI)",
    pattern: /(tenant|lessee).{0,40}(responsible|liable|bear|pay).{0,30}(hurricane|storm|windstorm|cyclone|weather).{0,20}(repair|damage|restoration)/i,
    citation: "Registered Land Act (Cap. 229) / common-law repairing covenant (verification pending)",
    jurisdictions: ["VG"],
    severity: "medium",
    evidenceClass: "contested",
    explanation:
      "Shifting the full cost of hurricane/storm structural repair onto the tenant may conflict with the landlord's repairing obligations. BVI-specific statutory basis is pending verification.",
    rawConfidence: 0.5,
  },
  // ── UK LEASEHOLD diagnostics (the RTM Sovereign / LeaseholdInsight core) ─────
  {
    id: "uk-s20-consultation",
    topic: "Major-works consultation (s.20)",
    pattern: /((major|qualifying)\s+works?|works? of (improvement|repair)).{0,70}(without|no\b|not\b|regardless of).{0,25}(consult|notice|section\s*20|s\.?\s*20)/i,
    citation: "Landlord and Tenant Act 1985, s.20 & Service Charges (Consultation Requirements) Regs 2003",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "Where qualifying works cost more than £250 per leaseholder, the landlord must follow the statutory s.20 consultation. A clause permitting major works without consultation is likely unenforceable; unconsulted cost recovery is capped at £250 per leaseholder.",
    rawConfidence: 0.9,
  },
  {
    id: "uk-s20c-costs",
    topic: "Litigation costs via service charge (s.20C)",
    pattern: /(legal|litigation|tribunal|court|solicitor'?s?)\s+(costs|fees|expenses).{0,50}(service\s*charge|recover|payable\s+by\s+(the\s+)?(leaseholder|lessee|tenant))/i,
    citation: "Landlord and Tenant Act 1985, s.20C (costs of proceedings)",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "A clause that automatically passes the landlord's legal/tribunal costs onto leaseholders through the service charge can be challenged; under s.20C a tribunal may order that such costs are not recoverable.",
    rawConfidence: 0.85,
  },
  {
    id: "uk-bsa-remediation",
    topic: "Building-safety remediation charged to leaseholder",
    pattern: /(leaseholder|lessee|tenant|resident).{0,50}(liable|responsible|pay|charged|bear).{0,40}(cladding|remediation|building\s*safety|fire\s*safety|relevant\s*defect)/i,
    citation: "Building Safety Act 2022, Sch.8 (qualifying leaseholder protections)",
    jurisdictions: ["UK"],
    severity: "high",
    evidenceClass: "established",
    explanation:
      "The Building Safety Act 2022 protects qualifying leaseholders from being charged for cladding and certain relevant-defect remediation. A clause imposing these costs on leaseholders may be void to that extent.",
    rawConfidence: 0.85,
  },
  {
    id: "uk-s167-forfeiture",
    topic: "Forfeiture for small/short arrears (s.167)",
    pattern: /(forfeit|re-?ent(er|ry)|terminat\w+\s+(the\s+)?lease|peaceable\s+re-?entry).{0,50}(arrears|non-?payment|unpaid|outstanding|service\s*charge)/i,
    citation: "Commonhold and Leasehold Reform Act 2002, s.167 (restriction on forfeiture)",
    jurisdictions: ["UK"],
    severity: "medium",
    evidenceClass: "heuristic",
    explanation:
      "Forfeiture for unpaid service charges is restricted: it cannot be pursued where the unpaid amount is £350 or less, or has been outstanding for three years or less, unless the sum exceeds that threshold. A broad forfeiture clause may overstate the landlord's rights.",
    rawConfidence: 0.6,
  },
];

function ruleApplies(rule: StatuteRule, jurisdiction: string): boolean {
  return rule.jurisdictions === "all" || rule.jurisdictions.includes(jurisdiction);
}

// Split a document into candidate clauses. Transparent: splits on newlines and
// sentence terminators, trims, and drops empties.
export function segmentClauses(text: string): string[] {
  return text
    .split(/\n+|(?<=[.;])\s+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

function excerpt(clause: string, max = 240): string {
  return clause.length <= max ? clause : clause.slice(0, max - 1).trimEnd() + "\u2026";
}

export function analyzeLease(
  text: string,
  jurisdiction = "all",
  rules: StatuteRule[] = DEFAULT_RULES,
): FairnessResult {
  const clauses = segmentClauses(text ?? "");
  const flags: FairnessFlag[] = [];

  for (const clause of clauses) {
    for (const rule of rules) {
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

  return {
    jurisdiction,
    clauseCount: clauses.length,
    flags,
    disclaimer: DISCLAIMER,
  };
}
