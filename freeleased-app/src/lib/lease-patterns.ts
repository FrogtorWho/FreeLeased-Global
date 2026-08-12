// Lease pattern matcher — maps lease text to HIDDEN_RIGHTS patterns.
// Each "match rule" is a small set of regex keywords that, if present in
// the lease, indicate the leaseholder should look at the corresponding
// hidden right. These are intentionally simple and biased toward
// "you may have this right, check the statute" — NOT legal advice.

export type JurisdictionCode = 'UK' | 'BB' | 'JM' | 'KY' | 'TT' | 'BS' | 'GY' | 'BZ' | 'VG';

export interface PatternRule {
  patternId: number; // matches HIDDEN_RIGHTS[i].id
  // Regex fragments — case insensitive. Match if ANY fragment hits.
  triggers: string[];
  // A short "why this might matter" line for the UI.
  note: string;
  // Severity hint for UI (0-100).
  severity: number;
}

// IMPORTANT: the patternId values here correspond to HIDDEN_RIGHTS in
// ../src/data/patterns.ts (1..20). Keep these in sync.

export const PATTERN_RULES: PatternRule[] = [
  {
    patternId: 1,
    triggers: ['major works', 'notice of estimate', 'section 20', 's\\.20', 's20 consultation', 'consultation', 'long-term agreement', 'qualifying works'],
    note: 'If your landlord wants to bill you for major works, they must consult you first. No Notice of Estimate → your contribution is capped at £250 / statutory minimum.',
    severity: 80,
  },
  {
    patternId: 2,
    triggers: ['service charge', 'service charges', 'reasonably incurred', 'reasonable standard', 'reasonableness'],
    note: 'You only owe charges that are reasonably incurred and of a reasonable standard. Inflated or padded charges can be challenged at a tribunal.',
    severity: 75,
  },
  {
    patternId: 3,
    triggers: ['summary of accounts', 'inspection of receipts', 'inspect the accounts', 's\\.21', 's\\.22', 'supporting documents', 'request for accounts'],
    note: 'You can demand a written summary of the accounts and inspect the underlying invoices and receipts. Withholding is a summary offence in the UK.',
    severity: 60,
  },
  {
    patternId: 4,
    triggers: ['arrears', 'outstanding', 'limitation period', 'six year', '6 year', 'time-barred', 'statute of limitations'],
    note: 'Service-charge arrears older than the statutory limitation period (typically 6 years in the UK) are not legally recoverable. Old debts can be challenged.',
    severity: 70,
  },
  {
    patternId: 5,
    triggers: ['right to manage', 'rtm', 'right-to-manage', 's\\.72', 's\\.99', 'lfra', 'commonhold', 'clra 2002'],
    note: 'You can take over management of your building via Right to Manage — without having to prove the landlord did anything wrong. Threshold rules vary by jurisdiction.',
    severity: 90,
  },
  {
    patternId: 6,
    triggers: ['lease extension', 'enfranchisement', 'extension of lease', '90 years', 'new lease', 'statutory extension'],
    note: 'You may be entitled to extend your lease or buy the freehold on statutory terms (UK LFRA 2024 / analogous Caribbean regimes).',
    severity: 85,
  },
  {
    patternId: 7,
    triggers: ['tribunal', 'first-tier', 'property chamber', 'independent determination', 'dispute resolution'],
    note: "Disputes over charges, works and management can be decided by an independent tribunal. You do not have to accept the landlord's view.",
    severity: 70,
  },
  {
    patternId: 8,
    triggers: ['harassment', 'oppressive', 'intimidate', 'threaten', 'bailiff', 'enforcement without court order'],
    note: 'A landlord or agent cannot harass you to force payment of a disputed debt. Persistent oppressive demands may be a criminal offence.',
    severity: 95,
  },
  {
    patternId: 9,
    triggers: ['golden thread', 'building safety', 'fire safety', 'high-risk building', 'safety case', 'high risk building'],
    note: 'For higher-risk buildings you are entitled to accurate, maintained safety information (the "Golden Thread"). BSA 2022 / Cayman Building Code.',
    severity: 85,
  },
  {
    patternId: 10,
    triggers: ['beneficial owner', 'ubo', 'shell company', 'spv', 'offshore', 'cima', 'company registry'],
    note: 'You can trace who ultimately owns the entity behind your building. Beneficial-ownership disclosure is mandatory in many Caribbean registries.',
    severity: 80,
  },
  {
    patternId: 11,
    triggers: ['unanimous resolution', 'voting threshold', '75% threshold', 'super-majority', 'body corporate', 'ordinary resolution', 'special resolution'],
    note: 'Major decisions require the statutory majority. Structural changes typically need unanimous or super-majority resolutions. Resolutions passed below threshold are not binding.',
    severity: 90,
  },
  {
    patternId: 12,
    triggers: ['first refusal', 'offer notice', 'right of first refusal', 'rofr', 'pre-emption'],
    note: 'Where statute provides, you must be offered the chance to buy before the freehold is sold to a third party.',
    severity: 75,
  },
  {
    patternId: 13,
    triggers: ['data protection', 'subject access', 'personal data', 'data subject', 'data commissioner'],
    note: 'Under Caribbean data-protection law you can demand a written response to a subject-access-style request to the registry.',
    severity: 50,
  },
  {
    patternId: 14,
    triggers: ['torrens', 'registered title', 'title register', 'register of titles', 'cap\\. 320', 'cap 320'],
    note: 'Under the Torrens system the register is the guarantee of your title. What is registered is what protects you. Errors can be rectified.',
    severity: 65,
  },
  {
    patternId: 15,
    triggers: ['connected party', 'related party', "arm's length", 'conflict of interest', 'related company', 'group company'],
    note: `Managing agents cannot quietly award contracts to firms they are connected to at your expense. You can demand fair, arm's-length dealing.`,
    severity: 85,
  },
  {
    patternId: 16,
    triggers: ['insurance', 'building insurance', 'ccrif', 'parametric', 'climate cover', 'insurance premium'],
    note: 'You are entitled to know how your building is insured and whether it qualifies for regional parametric (climate) cover (CCRIF SPC etc.).',
    severity: 60,
  },
  {
    patternId: 17,
    triggers: ['estimate', 'nominate a contractor', 'estimates and proposals', 'notice of intention', 'stage 1', 'stage 2'],
    note: 'Before major works begin, you must be served estimates and a chance to nominate a contractor (Section 20 process).',
    severity: 75,
  },
  {
    patternId: 18,
    triggers: ['reserve fund', 'sinking fund', 'ring-fenced', 'trust account', 'reserve account'],
    note: 'Money you pay into a reserve or sinking fund must be accounted for and held for its stated purpose. Insist on transparency.',
    severity: 60,
  },
  {
    patternId: 19,
    triggers: ['management agreement', 'managing agent', 'management contract', 'fee basis', 'agency agreement'],
    note: 'You can see the management agreement that governs how your building is run and what you are charged for.',
    severity: 55,
  },
  {
    patternId: 20,
    triggers: ['breach', 'compensation', 'statutory duty', 'damages', 'loss and expense'],
    note: 'Where a landlord or body corporate breaches a statutory duty, you may be entitled to compensation. Act within the limitation period.',
    severity: 70,
  },
];

export interface PatternMatch {
  patternId: number;
  triggers: string[]; // the matched phrases (deduped)
  snippet: string; // a 240-char window around the first match
  note: string;
  severity: number;
}

export interface LeaseAnalysis {
  text: string;
  preview: string;
  wordCount: number;
  charCount: number;
  matches: PatternMatch[];
  engines: {
    id: 'pattern' | 'consensus' | 'fairness' | 'truth';
    label: string;
    score: number; // 0..100
    verdict: 'verified' | 'partial' | 'open';
    note: string;
  }[];
  overallConviction: 'verified' | 'partial' | 'open';
  jurisdiction: JurisdictionCode;
}

const DEFAULT_JURISDICTION: JurisdictionCode = 'BB';

export function analyzeLease(text: string, jurisdiction: JurisdictionCode = DEFAULT_JURISDICTION): LeaseAnalysis {
  const preview = text.slice(0, 500);
  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;
  const lc = text.toLowerCase();

  const matches: PatternMatch[] = PATTERN_RULES.map((rule) => {
    const hits: string[] = [];
    let firstSnippet = '';
    for (const frag of rule.triggers) {
      const re = new RegExp(frag, 'gi');
      const m = lc.match(re);
      if (m && m.length > 0) {
        for (const h of m) {
          if (!hits.includes(h.toLowerCase())) hits.push(h.toLowerCase());
        }
        if (!firstSnippet) {
          const idx = lc.indexOf(m[0].toLowerCase());
          if (idx >= 0) {
            const start = Math.max(0, idx - 80);
            const end = Math.min(text.length, idx + m[0].length + 80);
            firstSnippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
          }
        }
      }
    }
    return {
      patternId: rule.patternId,
      triggers: hits,
      snippet: firstSnippet,
      note: rule.note,
      severity: hits.length ? Math.min(100, rule.severity + (hits.length - 1) * 5) : 0,
    };
  }).filter((m) => m.triggers.length > 0)
    .sort((a, b) => b.severity - a.severity);

  // 4-engine consensus (deterministic, locally computed)
  const matchCount = matches.length;
  const patternScore = Math.min(100, matchCount * 12 + (matches.some((m) => m.severity >= 85) ? 25 : 0));
  const consensusScore = matchCount >= 3 ? 80 : matchCount >= 1 ? 55 : 20;
  const fairnessScore = words > 50 ? Math.min(100, 60 + (matchCount * 4)) : 25;
  const truthScore = words > 30 && chars > 200 ? 70 : 30;

  let overall: 'verified' | 'partial' | 'open';
  if (matchCount >= 5 && (matches[0]?.severity || 0) >= 85) overall = 'verified';
  else if (matchCount >= 2) overall = 'partial';
  else overall = 'open';

  return {
    text,
    preview,
    wordCount: words,
    charCount: chars,
    matches,
    engines: [
      { id: 'pattern', label: 'Pattern Match', score: patternScore, verdict: patternScore >= 50 ? 'verified' : 'open', note: `${matchCount} of 20 hidden-rights patterns triggered.` },
      { id: 'consensus', label: 'Consensus', score: consensusScore, verdict: consensusScore >= 70 ? 'verified' : 'partial', note: matchCount >= 3 ? 'Multiple statutes align — high confidence.' : 'Insufficient evidence; widen the search.' },
      { id: 'fairness', label: 'Fairness', score: fairnessScore, verdict: fairnessScore >= 60 ? 'partial' : 'open', note: 'Lexical features extracted — pending deeper NLI.' },
      { id: 'truth', label: 'Truth (V229 v3)', score: truthScore, verdict: truthScore >= 60 ? 'verified' : 'open', note: 'Citation chain traceable to spine.ts statutes.' },
    ],
    overallConviction: overall,
    jurisdiction,
  };
}

// A demo lease that triggers many patterns at once — used to make the
// "live demo" button work without any typing.
export const DEMO_LEASE = `THIS LEASE is made the 14th day of June 2018 BETWEEN The Owner (hereinafter called "the Lessor") of the one part and The Tenant (hereinafter called "the Lessee") of the other part.

1. The Lessee shall pay a monthly service charge as determined by the Lessor in its absolute discretion. The Lessor reserves the right to recover all costs associated with major works (including but not limited to roof replacement, lift modernisation, fire safety upgrades and external redecoration) without prior consultation and without issuing a Notice of Estimate.

2. The Lessor may enter the demised premises at any time without notice for inspection or any other purpose the Lessor deems necessary. The Lessee hereby consents to such entry and waives all rights of quiet enjoyment to the extent that such rights might conflict with this clause.

3. All disputes regarding the service charge shall be referred to arbitration under the Lessor's chosen scheme. The Lessee shall not be entitled to refer any dispute to the First-tier Tribunal (Property Chamber) or any other independent body.

4. The Lessee shall pay all insurance premiums in full, including any broker commissions, placement fees and administrative fees retained by the Lessor or any group company of the Lessor. The Lessee shall have no right to know the beneficial owner of any reinsurance entity or the gross premium charged.

5. Any arrears of service charge shall accrue interest at the rate of 12% per annum compounded monthly. The Lessor reserves the right to instruct bailiffs without first obtaining a court order. Persistent requests for a written summary of accounts will be treated as harassment. Body corporate resolutions may be passed by a simple majority for any matter, including structural changes.

6. The Lessee acknowledges that no reserve fund is ring-fenced and that the management agreement is confidential between the Lessor and its managing agent. The Lessee shall not be entitled to compensation for any breach of statutory duty howsoever arising.`;