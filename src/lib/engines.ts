// A.U.R.I engine layer; deterministic 4-agent orchestrator.
// Diagnostics (DS gauge + agents), Consensus (conflict routing + sign-off),
// Mass Ingest (schema-preserving add), Cryptographic Communes (aggregate).
import { HIDDEN_RIGHTS, STATUTES, SOURCES, JURISDICTIONS } from "../data/spine";
import type { JurisdictionCode } from "../data/spine";
import type { Resident } from "../data/fixtures";

export const DS_THRESHOLD = 60;

export type AxisKey = "resident" | "tenure_building" | "contracts" | "hidden_rights";

export interface Provenance {
  sourceId: string;
  url: string;
  fetchedAt: string;
  method: "registry" | "osm+overture" | "macro-sample" | "statute-bind" | "detector";
  confidence: number; // 0..1
}

export interface AgentVerdict {
  agent: string;
  axis: AxisKey;
  ds: number; // 0..100
  band: "ABSTAIN" | "low" | "medium" | "high";
  abstain: boolean;
  belief: number; // Dempster-Shafer lower bound 0..1
  plausibility: number; // upper bound 0..1
  summary: string;
  findings: string[];
  matchedRightIds: number[];
  provenance: Provenance[];
}

export interface RedactionResult {
  pass: boolean;
  ruleResults: { rule: string; pass: boolean; detail: string }[];
  scrubbedId: string;
}

export interface Dossier {
  residentId: string;
  jurisdiction: JurisdictionCode;
  redaction: RedactionResult;
  verdicts: AgentVerdict[];
  abstained: string[]; // agent names that abstained
  signOff: "all-green" | "hitl-required" | "rejected";
  rowHash: string;
  generatedAt: string;
}

// ── Redaction Protocol: 4-rule scrub filter ─────────────────────────────────
const REAL_NAME = /\b(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+/;
const POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/; // UK-style
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

export function redactionProtocol(resident: Resident): RedactionResult {
  const id = resident.id;
  const ruleResults = [
    { rule: "R1 pseudonym-only", pass: /^[A-Z]{2}-R\d{2}$/.test(id) && !REAL_NAME.test(id), detail: "resident id is a structured pseudonym, no real name" },
    { rule: "R2 no PII leakage", pass: !POSTCODE.test(id) && !EMAIL.test(id), detail: "no postcode/email in the payload" },
    { rule: "R3 jurisdiction in scope", pass: JURISDICTIONS.some((j) => j.code === resident.jurisdiction), detail: `jurisdiction ${resident.jurisdiction} is registered in the spine` },
    { rule: "R4 data-protection basis", pass: true, detail: "written-request basis assumed for pilot fixture; real deployment gates on subject request" },
  ];
  const pass = ruleResults.every((r) => r.pass);
  return { pass, ruleResults, scrubbedId: id };
}

// ── DS gauge ────────────────────────────────────────────────────────────────
function bandFor(ds: number): AgentVerdict["band"] {
  if (ds < DS_THRESHOLD) return "ABSTAIN";
  if (ds < 75) return "low";
  if (ds < 88) return "medium";
  return "high";
}

// deterministic string hash (FNV-1a) for the per-row audit hash
export function rowHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return "0x" + (h >>> 0).toString(16).padStart(8, "0");
}

function sourcesFor(code: JurisdictionCode): typeof SOURCES {
  return SOURCES.filter((s) => !s.jurisdiction || s.jurisdiction === code || s.tier === 0 || s.tier === 1.5 || s.tier === 3);
}

const FETCHED_AT = "2026-08-05T14:02:00Z"; // pilot snapshot timestamp

function prov(sourceId: string, method: Provenance["method"], confidence: number): Provenance {
  const s = SOURCES.find((x) => x.id === sourceId);
  return { sourceId, url: s?.url ?? "n/a", fetchedAt: FETCHED_AT, method, confidence };
}

// ── The 4 agents ──────────────────────────────────────────────────────────
function residentStatusAgent(r: Resident): AgentVerdict {
  const populated = r.populated.resident;
  const ds = Math.round((populated / 3) * 60 + (r.axes.tenure.titleRegistered ? 25 : 5) + (r.axes.resident.registryMatched ? 15 : 0));
  const abstain = ds < DS_THRESHOLD;
  const belief = Math.min(1, (populated / 3) * (r.axes.resident.registryMatched ? 0.85 : 0.55));
  return {
    agent: "Resident Status", axis: "resident", ds: Math.min(ds, 100), band: bandFor(ds), abstain,
    belief: +belief.toFixed(2), plausibility: +Math.min(1, belief + 0.2).toFixed(2),
    summary: abstain
      ? "Registry match too thin to resolve the resident with confidence; preserved as ABSTAIN."
      : `${r.axes.resident.holderType} resolved in the ${r.jurisdiction} register; household of ${r.axes.resident.householdSize}.`,
    findings: [
      `Holder type: ${r.axes.resident.holderType}`,
      `Registry match: ${r.axes.resident.registryMatched ? "resolved" : "unresolved"}`,
      `Title registered: ${r.axes.tenure.titleRegistered ? "yes" : "not confirmed"}`,
    ],
    matchedRightIds: [13, 14],
    provenance: [prov("nla-eland", "registry", r.axes.resident.registryMatched ? 0.9 : 0.4), prov("osm", "osm+overture", 0.7)],
  };
}

function tenureBuildingAgent(r: Resident): AgentVerdict {
  const populated = r.populated.building;
  const ds = Math.round((populated / 7) * 70 + (r.axes.building.fireComplianceBand !== "unknown" ? 18 : 0) + (r.axes.building.structuralComplianceBand !== "unknown" ? 12 : 0));
  const abstain = ds < DS_THRESHOLD;
  const belief = Math.min(1, (populated / 7) * 0.9);
  const matched = [11, 14];
  if (r.jurisdiction === "KY") matched.push(9, 10);
  if (r.axes.building.hazardBand >= 4) matched.push(16);
  return {
    agent: "Tenure + Building", axis: "tenure_building", ds: Math.min(ds, 100), band: bandFor(ds), abstain,
    belief: +belief.toFixed(2), plausibility: +Math.min(1, belief + 0.18).toFixed(2),
    summary: abstain
      ? "Building compliance data incomplete; preserved as ABSTAIN pending fire/structural bands."
      : `${r.axes.tenure.tenureType} in a ${r.axes.building.storeys}-storey ${r.axes.building.buildingType} (built ${r.axes.building.yearBuilt}); hazard band ${r.axes.building.hazardBand}/5.`,
    findings: [
      `Tenure: ${r.axes.tenure.tenureType}, held ${r.axes.tenure.yearsHeld}y`,
      `Fire compliance band: ${r.axes.building.fireComplianceBand}`,
      `Structural compliance band: ${r.axes.building.structuralComplianceBand}`,
      `Hurricane/flood hazard band: ${r.axes.building.hazardBand}/5`,
    ],
    matchedRightIds: matched,
    provenance: [prov("overture", "osm+overture", 0.75), prov("ccrif", "macro-sample", 0.7), prov(r.jurisdiction === "KY" ? "cima" : "bss", "registry", 0.65)],
  };
}

function contractsAgent(r: Resident): AgentVerdict {
  const c = r.axes.contracts;
  const populated = r.populated.contracts;
  const ds = Math.round((populated / 10) * 100);
  const abstain = ds < DS_THRESHOLD;
  const belief = Math.min(1, (populated / 10) * 0.9);
  const matched: number[] = [];
  if (!c.consultationServed) matched.push(1);
  if (!c.noticeOfEstimateServed) matched.push(17);
  if (c.serviceChargeAnnual && c.serviceChargeAnnual > 5000) matched.push(2);
  if (c.connectedPartyProcurement) matched.push(3, 15);
  if (c.arrearsClaimed) matched.push(4, 8);
  if (!c.insuranceDisclosed) matched.push(16);
  if (!c.reserveFundDisclosed) matched.push(18);
  if (!c.managementAgreementDisclosed) matched.push(19);
  return {
    agent: "Contracts", axis: "contracts", ds, band: bandFor(ds), abstain,
    belief: +belief.toFixed(2), plausibility: +Math.min(1, belief + 0.15).toFixed(2),
    summary: abstain
      ? "Contract position too thin to assess; preserved as ABSTAIN pending the lease and service-charge schedule."
      : `Service charge ${c.serviceChargeAnnual ? c.serviceChargeAnnual.toLocaleString() : "n/a"}/yr; consultation ${c.consultationServed ? "served" : "NOT served"}; ${matched.length} contract-side rights engaged.`,
    findings: [
      `Consultation served: ${c.consultationServed ? "yes" : "no"}`,
      `Notice of Estimate served: ${c.noticeOfEstimateServed ? "yes" : "no"}`,
      `Insurance disclosed: ${c.insuranceDisclosed ? "yes" : "no"}`,
      `Reserve fund disclosed: ${c.reserveFundDisclosed ? "yes" : "no"}`,
      `Connected-party procurement flag: ${c.connectedPartyProcurement ? "RAISED" : "clear"}`,
      `Arrears claimed: ${c.arrearsClaimed ? "yes" : "no"}`,
    ],
    matchedRightIds: matched,
    provenance: [prov("nla-jamprop", "registry", 0.7), prov("wb-ppi", "macro-sample", 0.65)],
  };
}

function hiddenRightsAgent(r: Resident, upstream: AgentVerdict[]): AgentVerdict {
  // aggregate matched rights from all upstream agents + statutory applicability
  const upstreamMatched = new Set<number>();
  upstream.forEach((v) => v.matchedRightIds.forEach((id) => upstreamMatched.add(id)));
  const applicable = HIDDEN_RIGHTS.filter(
    (p) => p.jurisdictions.includes(r.jurisdiction) && upstreamMatched.has(p.id)
  ).map((p) => p.id);
  // DS is the mean of the upstream non-abstaining agents
  const live = upstream.filter((v) => !v.abstain);
  const ds = live.length ? Math.round(live.reduce((a, v) => a + v.ds, 0) / live.length) : 40;
  const abstain = ds < DS_THRESHOLD || applicable.length === 0;
  const belief = live.length ? +(live.reduce((a, v) => a + v.belief, 0) / live.length).toFixed(2) : 0.3;
  return {
    agent: "Hidden Rights", axis: "hidden_rights", ds, band: bandFor(ds), abstain,
    belief, plausibility: +Math.min(1, belief + 0.2).toFixed(2),
    summary: abstain
      ? "Insufficient upstream signal or no statutory pattern engaged; preserved as ABSTAIN."
      : `${applicable.length} of 20 hidden-rights patterns engaged; action plan generated with statutory anchors.`,
    findings: applicable.slice(0, 6).map((id) => {
      const p = HIDDEN_RIGHTS.find((x) => x.id === id)!;
      return `#${p.id} ${p.title}`;
    }),
    matchedRightIds: applicable,
    provenance: [prov("ccj", "statute-bind", 0.8), prov("unhabitat", "detector", 0.7)],
  };
}

// ── Consensus sign-off + full dossier composition ───────────────────────────
export function buildDossier(r: Resident): Dossier {
  const redaction = redactionProtocol(r);
  const v1 = residentStatusAgent(r);
  const v2 = tenureBuildingAgent(r);
  const v3 = contractsAgent(r);
  const v4 = hiddenRightsAgent(r, [v1, v2, v3]);
  const verdicts = [v1, v2, v3, v4];
  const abstained = verdicts.filter((v) => v.abstain).map((v) => v.agent);
  const signOff: Dossier["signOff"] = !redaction.pass ? "rejected" : abstained.length ? "hitl-required" : "all-green";
  const hashInput = r.id + verdicts.map((v) => `${v.agent}:${v.ds}:${v.matchedRightIds.join(",")}`).join("|");
  return {
    residentId: r.id, jurisdiction: r.jurisdiction, redaction, verdicts, abstained,
    signOff, rowHash: rowHash(hashInput), generatedAt: FETCHED_AT,
  };
}

// ── Cryptographic Communes: privacy-preserving aggregate (k-anonymity ≥ 5) ──
export interface CommuneAggregate {
  jurisdiction: JurisdictionCode;
  cohortSize: number;
  kAnonymitySafe: boolean;
  patternPrevalence: { rightId: number; title: string; count: number; pct: number }[];
}

export function communeAggregate(residents: Resident[], code: JurisdictionCode): CommuneAggregate {
  const cohort = residents.filter((r) => r.jurisdiction === code);
  const counts = new Map<number, number>();
  cohort.forEach((r) => {
    const d = buildDossier(r);
    const hr = d.verdicts.find((v) => v.axis === "hidden_rights");
    if (hr && !hr.abstain) hr.matchedRightIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  });
  const patternPrevalence = [...counts.entries()]
    .map(([rightId, count]) => ({
      rightId, title: HIDDEN_RIGHTS.find((p) => p.id === rightId)?.title ?? `#${rightId}`,
      count, pct: Math.round((count / cohort.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
  return { jurisdiction: code, cohortSize: cohort.length, kAnonymitySafe: cohort.length >= 5, patternPrevalence };
}

export function statuteById(id: string) {
  return STATUTES.find((s) => s.id === id);
}
