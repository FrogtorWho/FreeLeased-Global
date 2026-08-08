// The 4 binding quality gates; runnable regex validators.
// PII v5 · UK English · AI tell · em-dash chain. All must return 0 hits to pass.
// Faithful to the FC _v147_quick_sweep.py spec described in the handoff docs.

export interface GateHit {
  match: string;
  index: number;
  context: string;
}
export interface GateResult {
  gate: string;
  description: string;
  hits: GateHit[];
  pass: boolean;
}
export interface SweepResult {
  results: GateResult[];
  pass: boolean;
  totalHits: number;
}

function ctx(text: string, index: number, len: number): string {
  const start = Math.max(0, index - 24);
  const end = Math.min(text.length, index + len + 24);
  return (start > 0 ? "…" : "") + text.slice(start, end).replace(/\s+/g, " ") + (end < text.length ? "…" : "");
}

function collect(text: string, re: RegExp): GateHit[] {
  const hits: GateHit[] = [];
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = g.exec(text)) !== null) {
    hits.push({ match: m[0], index: m.index, context: ctx(text, m.index, m[0].length) });
    if (m.index === g.lastIndex) g.lastIndex++;
  }
  return hits;
}

// Gate 1; PII v5 (17-needle family): real-name honorifics, UK postcode, email, phone
const PII_PATTERNS: RegExp[] = [
  /\b(?:Mr|Mrs|Ms|Miss|Dr|Sir|Dame|Lord|Lady)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/,
  /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/, // UK postcode
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // email
  /\b(?:\+?44|0)\s?7\d{3}\s?\d{6}\b/, // UK mobile
  /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/, // generic phone
];

// Gate 2; UK English (22-pattern US-spelling family)
const US_SPELLINGS: RegExp[] = [
  /\borganization[s]?\b/i, /\bprogram\b/i, /\bbehavior[s]?\b/i, /\brealize[ds]?\b/i,
  /\banalyze[ds]?\b/i, /\bcenter[s]?\b/i, /\bcolor[s]?\b/i, /\bdefense\b/i,
  /\bcatalog[s]?\b/i, /\bgray\b/i, /\blicense\b/i, /\banonymization\b/i,
  /\bpseudonymization\b/i, /\brecognize[ds]?\b/i, /\bstandardize[ds]?\b/i,
  /\bauthorization\b/i, /\boptimization\b/i, /\bcharacterize[ds]?\b/i,
  /\bfavor[s]?\b/i, /\blabor\b/i, /\bneighbor[s]?\b/i, /\bfulfill\b/i,
];

// Gate 3; AI tells (18-phrase family)
const AI_TELLS: RegExp[] = [
  /\bleverage\b/i, /\bcomprehensive\b/i, /\brobust\b/i, /\bnavigate the landscape\b/i,
  /\becosystem\b/i, /\bsynergy\b/i, /\bunprecedented\b/i, /\bcutting-edge\b/i,
  /\bgame-changing\b/i, /\bempower\b/i, /\bunlock\b/i, /\bholistic\b/i,
  /\bin conclusion\b/i, /\bmoreover\b/i, /\bfurthermore\b/i, /\bit'?s worth noting that\b/i,
  /\bcertainly\b/i, /\bdelve\b/i,
];

// Gate 4; em-dash chain (two or more em-dashes in sequence)
const EM_DASH_CHAIN = /\u2014{2,}/;

export function sweep(text: string): SweepResult {
  const piiHits = PII_PATTERNS.flatMap((re) => collect(text, re));
  const ukHits = US_SPELLINGS.flatMap((re) => collect(text, re));
  const aiHits = AI_TELLS.flatMap((re) => collect(text, re));
  const emHits = collect(text, EM_DASH_CHAIN);
  const results: GateResult[] = [
    { gate: "PII v5", description: "Real names, postcodes, emails, phone numbers (0 hits required)", hits: piiHits, pass: piiHits.length === 0 },
    { gate: "UK English", description: "US spellings; organisation, programme, behaviour, etc. (0 hits required)", hits: ukHits, pass: ukHits.length === 0 },
    { gate: "AI tell", description: "AI-tell phrases; leverage, robust, ecosystem, etc. (0 hits required)", hits: aiHits, pass: aiHits.length === 0 },
    { gate: "Em-dash chain", description: "Two or more em-dashes in sequence (0 hits required)", hits: emHits, pass: emHits.length === 0 },
  ];
  const totalHits = results.reduce((a, r) => a + r.hits.length, 0);
  return { results, pass: totalHits === 0, totalHits };
}
