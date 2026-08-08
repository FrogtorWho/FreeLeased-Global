// A.U.R.I agentic research & maintenance framework.
// Turns "add a new jurisdiction / statute / contract" into a structured, provenance-
// tracked, regularly-maintained pipeline that a research agent (or a human) works.
//
// DISCIPLINE: this framework NEVER fabricates law. It produces research PLANS
// (which official sources to check, what to look for) and DRAFTS marked `pending`.
// A draft only becomes citable/`verified` after the database-vs-originals gate is
// cleared by a reviewer. That gate is the whole point.

import type { Conviction, JurisdictionCode } from "../data/spine";

export type ResearchKind = "jurisdiction" | "statute" | "contract";
export type RecordStatus = "draft" | "in-review" | "verified" | "stale" | "rejected";

// Maintenance SLA — how often each kind must be re-verified against the original.
export const SLA_DAYS: Record<ResearchKind, number> = {
  jurisdiction: 365,
  statute: 180, // law changes; re-check twice a year
  contract: 120,
};

export interface OfficialSource {
  name: string;
  url: string;
}

export interface ResearchTaskSpec {
  kind: ResearchKind;
  target: string; // e.g. "Antigua and Barbuda", "Registered Land Act"
  jurisdictionCode?: string;
  officialSources: OfficialSource[];
  checklist: string[];
  rationale: string;
}

export interface StructuredDraft {
  kind: ResearchKind;
  jurisdictionCode: string;
  title: string;
  citation?: string;
  url: string;
  covers: string;
  status: RecordStatus;
  conviction: Conviction;
  provenance: OfficialSource[];
  missingFields: string[];
  confidence: number; // 0..1 completeness score
}

// Real official land/registry portals for expansion jurisdictions (verifiable).
// These are the SEEDS a research task points at — not asserted statute content.
export const KNOWN_REGISTRIES: Record<string, { name: string; registry: string; url: string }> = {
  TT: { name: "Trinidad and Tobago", registry: "Registrar General", url: "https://www.registrargeneral.gov.tt/" },
  BS: { name: "The Bahamas", registry: "Department of Lands and Surveys", url: "https://www.bahamas.gov.bs/" },
  GY: { name: "Guyana", registry: "Guyana Lands and Surveys Commission", url: "https://glsc.gov.gy/" },
  BZ: { name: "Belize", registry: "Lands Department, Ministry of Natural Resources", url: "https://www.mnr.gov.bz/" },
  AG: { name: "Antigua and Barbuda", registry: "Land Registry / ABLR", url: "https://ablr.gov.ag/" },
  LC: { name: "Saint Lucia", registry: "Land Registry, Ministry of Physical Development", url: "https://www.govt.lc/" },
  GD: { name: "Grenada", registry: "Land Registry Division", url: "https://www.gov.gd/" },
  DM: { name: "Dominica", registry: "Lands and Surveys Division", url: "https://dominica.gov.dm/" },
  VC: { name: "Saint Vincent and the Grenadines", registry: "Registry Department", url: "https://www.gov.vc/" },
  KN: { name: "Saint Kitts and Nevis", registry: "Registrar of Lands", url: "https://www.gov.kn/" },
};

// The standard land/planning legal skeleton every jurisdiction is researched against.
const JURISDICTION_CHECKLIST = [
  "Land tenure system (Torrens title-by-registration vs deeds registration)",
  "Principal land registration statute (title/registration act)",
  "Strata / condominium / apartment ownership statute + voting thresholds",
  "Landlord & tenant / service-charge statute (reasonableness, consultation, limitation)",
  "Building code / fire-safety regime (higher-risk buildings, safety-case duties)",
  "Beneficial-ownership / company registry (who controls the freeholder)",
  "Data-protection basis for registry disclosure (written-request requirement)",
  "Enfranchisement / right-to-manage / lease-extension provisions",
];

const CONTRACT_CHECKLIST = [
  "Contract type (individual lease, share-of-freehold, strata by-laws, management agreement)",
  "Party structure (freeholder, RMC, managing agent, resident) and fiduciary duties",
  "Service-charge and reserve-fund clauses + apportionment basis",
  "Consultation / major-works clauses vs the statutory floor",
  "Termination, forfeiture and arrears clauses vs statutory protection",
  "Connected-party / procurement disclosure clauses",
];

// Build a research plan for a jurisdiction. Points the agent at the REAL official
// registry (where known) plus a legislation portal, with a standard checklist.
export function planJurisdiction(code: string, name?: string): ResearchTaskSpec {
  const known = KNOWN_REGISTRIES[code.toUpperCase()];
  const jName = name ?? known?.name ?? code;
  const sources: OfficialSource[] = [];
  if (known) sources.push({ name: `${known.registry} (official registry)`, url: known.url });
  sources.push(
    { name: "National legislation portal / Attorney General's chambers", url: "https://www.commonlii.org/" },
    { name: "CARICOM legal & statistical resources", url: "https://statistics.caricom.org/" },
  );
  return {
    kind: "jurisdiction", target: jName, jurisdictionCode: code.toUpperCase(),
    officialSources: sources, checklist: JURISDICTION_CHECKLIST,
    rationale: `Structure ${jName}'s land, tenure and building-safety framework against the standard 8-point skeleton so residents there gain the same dossier coverage as the pilot jurisdictions.`,
  };
}

export function planContract(kind: string, jurisdictionCode: string): ResearchTaskSpec {
  return {
    kind: "contract", target: kind, jurisdictionCode: jurisdictionCode.toUpperCase(),
    officialSources: [{ name: "Instrument as filed at the registry (original)", url: KNOWN_REGISTRIES[jurisdictionCode.toUpperCase()]?.url ?? "" }],
    checklist: CONTRACT_CHECKLIST,
    rationale: `Map the ${kind} clause-by-clause against the statutory floor so any clause that contracts out of a resident's non-excludable right is flagged.`,
  };
}

// Validate + normalise a raw finding into a draft. Nothing here is trusted as law
// until verified — conviction is forced to `pending` and status to `draft`.
export function structureFinding(raw: {
  kind: ResearchKind; jurisdictionCode: string; title: string; citation?: string; url?: string; covers?: string; provenance?: OfficialSource[];
}): StructuredDraft {
  const required: [keyof typeof raw, string][] = [
    ["title", "title"], ["url", "public URL"], ["covers", "coverage summary"],
  ];
  const missingFields = required.filter(([k]) => !raw[k] || String(raw[k]).trim() === "").map(([, label]) => label);
  if (raw.kind === "statute" && !raw.citation) missingFields.push("citation");
  const confidence = +(1 - missingFields.length / (required.length + 1)).toFixed(2);
  return {
    kind: raw.kind, jurisdictionCode: raw.jurisdictionCode.toUpperCase(), title: raw.title,
    citation: raw.citation, url: raw.url ?? "", covers: raw.covers ?? "",
    status: "draft", conviction: "pending",
    provenance: raw.provenance ?? [], missingFields, confidence: Math.max(0, confidence),
  };
}

// The database-vs-originals gate. A draft is only promotable when it is complete
// AND a reviewer has cross-checked it against the original source.
export interface PromotionResult {
  ok: boolean;
  record?: StructuredDraft;
  blockedBy: string[];
}

export function promoteDraft(draft: StructuredDraft, reviewer: string, crossCheckedAgainstOriginal: boolean): PromotionResult {
  const blockedBy: string[] = [];
  if (draft.missingFields.length) blockedBy.push(`incomplete: ${draft.missingFields.join(", ")}`);
  if (!/^https?:\/\//.test(draft.url)) blockedBy.push("no valid public URL");
  if (!crossCheckedAgainstOriginal) blockedBy.push("original not cross-checked (database-vs-originals gate)");
  if (!reviewer) blockedBy.push("no reviewer identity");
  if (blockedBy.length) return { ok: false, blockedBy };
  return { ok: true, blockedBy: [], record: { ...draft, status: "verified", conviction: "verified" } };
}

// Maintenance: compute staleness against the SLA and the next review date.
export interface StalenessResult {
  ageDays: number;
  slaDays: number;
  stale: boolean;
  nextReview: string;
  pctToStale: number;
}

export function computeStaleness(lastReviewedISO: string, kind: ResearchKind, now = new Date()): StalenessResult {
  const last = new Date(lastReviewedISO);
  const ageDays = Math.max(0, Math.floor((now.getTime() - last.getTime()) / 86400000));
  const slaDays = SLA_DAYS[kind];
  const next = new Date(last.getTime() + slaDays * 86400000);
  return {
    ageDays, slaDays, stale: ageDays > slaDays,
    nextReview: next.toISOString().slice(0, 10),
    pctToStale: Math.min(100, Math.round((ageDays / slaDays) * 100)),
  };
}

export interface MaintenanceItem {
  kind: ResearchKind; title: string; jurisdictionCode: string; lastReviewed: string; staleness: StalenessResult;
}

export function maintenanceReport(
  records: { kind: ResearchKind; title: string; jurisdictionCode: string; lastReviewed: string }[],
  now = new Date(),
): { items: MaintenanceItem[]; staleCount: number; dueSoon: number } {
  const items = records
    .map((r) => ({ ...r, staleness: computeStaleness(r.lastReviewed, r.kind, now) }))
    .sort((a, b) => b.staleness.pctToStale - a.staleness.pctToStale);
  return {
    items,
    staleCount: items.filter((i) => i.staleness.stale).length,
    dueSoon: items.filter((i) => !i.staleness.stale && i.staleness.pctToStale >= 80).length,
  };
}
