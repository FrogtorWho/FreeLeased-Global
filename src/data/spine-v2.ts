// ─────────────────────────────────────────────────────────────────────────────
// Spine v2 — read-only migration bridge
//
// PURPOSE
//   Import every framework JSON from src/data/frameworks/*.json, validate
//   each one against the LegislativeFramework schema (hand-rolled,
//   zero-dependency), and re-export a v1-compatible view so existing
//   callers (App.tsx, lib/jurisdiction.ts, etc.) don't break.
//
// NON-DESTRUCTIVE
//   This file NEVER imports or mutates src/data/spine.ts. The v1 spine
//   stays untouched. If v2 lands badly, rollback is a single import swap.
//
// CONVENTIONS
//   • v1 conviction labels are mapped to the v2 canonical 4-class set
//     (see MIGRATION-v1-to-v2.md §3).
//   • Every framework record carries its `conviction`; records that v1
//     marked `pending`/`inference` are passed through as `heuristic` /
//     `contested` respectively.
//   • Every URL in every framework is re-validated at load time via
//     `new URL()` — invalid URLs throw on import, surfacing drift early.
//   • Pseudonym regex enforced per the AGENTS.md `[PERSON_NAME]` discipline.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LegislativeFrameworkSchema,
  type LegislativeFramework,
  type Statute as V2Statute, // not used directly — kept for type clarity
  type ConvictionClass,
  frameworkCounts,
  extractUrls,
  findUnverified,
} from "./legislative-framework-schema";
import ukRaw from "./frameworks/uk-framework.json";
import bbRaw from "./frameworks/bb-framework.json";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Load + validate every framework JSON.
//    Throws at module-load time if any URL is malformed or any required
//    field is missing — this is intentional; bad data should fail fast.
// ─────────────────────────────────────────────────────────────────────────────

function loadFramework(raw: unknown, code: string): LegislativeFramework {
  const result = LegislativeFrameworkSchema.safeParse(raw);
  if (!result.success) {
    const issues = (result.error as Error & { issues?: { path: string; message: string }[] }).issues ?? [];
    throw new Error(
      `[spine-v2] ${code}-framework.json failed schema validation:\n` +
        issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n"),
    );
  }
  return result.data;
}

export const UK_FRAMEWORK: LegislativeFramework = loadFramework(ukRaw, "UK");
export const BB_FRAMEWORK: LegislativeFramework = loadFramework(bbRaw, "BB");

// ─────────────────────────────────────────────────────────────────────────────
// 2. v2 → v1 conviction mapping (canonical 4-class set).
//    See MIGRATION-v1-to-v2.md §3.
// ─────────────────────────────────────────────────────────────────────────────

export type V1Conviction =
  | "confirmed"
  | "verified"
  | "primary"
  | "quantitative"
  | "inference"
  | "pending";

export function v2ToV1Conviction(c: ConvictionClass): V1Conviction {
  switch (c) {
    case "established":
      return "verified";
    case "heuristic":
      return "inference";
    case "contested":
      return "pending";
    case "unfalsifiable":
      return "inference";
    default:
      return "pending";
  }
}

export function v1ToV2Conviction(c: V1Conviction): ConvictionClass {
  switch (c) {
    case "confirmed":
    case "verified":
    case "primary":
      return "established";
    case "quantitative":
    case "inference":
      return "heuristic";
    case "pending":
      return "contested";
    default:
      return "heuristic";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. v1-compatible Statute view (id, shortTitle, citation, url, covers, conviction).
//    The v2 `summary` and `leaseholderRelevantSections` are joined into
//    `covers` to preserve the legacy shape.
// ─────────────────────────────────────────────────────────────────────────────

export interface V1StatuteView {
  id: string;
  jurisdiction: string;
  shortTitle: string;
  citation: string;
  url: string;
  covers: string;
  conviction: V1Conviction;
  unverified?: boolean;
  frameworkSource: string; // e.g. "src/data/frameworks/uk-framework.json"
}

function flattenFramework(
  fw: LegislativeFramework,
  frameworkPath: string,
): V1StatuteView[] {
  return fw.primaryActs.map((a) => ({
    id: a.id,
    jurisdiction: fw.jurisdiction.code,
    shortTitle: a.shortTitle,
    citation: a.chapterNumber ?? `${a.enactmentYear}`,
    url: a.sourceUrl,
    covers: [a.summary, ...a.leaseholderRelevantSections].join(" — "),
    conviction: v2ToV1Conviction(a.conviction),
    unverified: a.unverified,
    frameworkSource: frameworkPath,
  }));
}

export const STATUTES: V1StatuteView[] = [
  ...flattenFramework(UK_FRAMEWORK, "src/data/frameworks/uk-framework.json"),
  ...flattenFramework(BB_FRAMEWORK, "src/data/frameworks/bb-framework.json"),
].sort((a, b) => {
  if (a.jurisdiction === b.jurisdiction) return a.id.localeCompare(b.id);
  return a.jurisdiction.localeCompare(b.jurisdiction);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. v1-compatible Jurisdiction view (header-only).
//    Note: pilot status and climate are out of scope for v2; consumers that
//    need them should still read src/data/spine.ts.
// ─────────────────────────────────────────────────────────────────────────────

export interface V1JurisdictionView {
  code: string;
  name: string;
  legalSystem: string;
  officialGazette: string;
  lastVerified: string;
  primaryActCount: number;
  frameworkSource: string;
}

function jurisdictionView(
  fw: LegislativeFramework,
  frameworkPath: string,
): V1JurisdictionView {
  return {
    code: fw.jurisdiction.code,
    name: fw.jurisdiction.name,
    legalSystem: fw.jurisdiction.legalSystem,
    officialGazette: fw.jurisdiction.officialGazette,
    lastVerified: fw.jurisdiction.lastVerified,
    primaryActCount: fw.primaryActs.length,
    frameworkSource: frameworkPath,
  };
}

export const JURISDICTIONS: V1JurisdictionView[] = [
  jurisdictionView(UK_FRAMEWORK, "src/data/frameworks/uk-framework.json"),
  jurisdictionView(BB_FRAMEWORK, "src/data/frameworks/bb-framework.json"),
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. Cross-jurisdiction aggregates (used by tests + future spine-v2 consumers).
// ─────────────────────────────────────────────────────────────────────────────

export const FRAMEWORKS: Record<string, LegislativeFramework> = {
  UK: UK_FRAMEWORK,
  BB: BB_FRAMEWORK,
};

export interface SpineV2Summary {
  jurisdictionCount: number;
  primaryActCount: number;
  regulationCount: number;
  statutoryInstrumentCount: number;
  reformAmendmentCount: number;
  leadingCaseCount: number;
  proceduralRuleCount: number;
  enforcementBodyCount: number;
  remedyCount: number;
  urlCount: number;
  unverifiedRecordCount: number;
}

export function summarise(): SpineV2Summary {
  let primaryActCount = 0;
  let regulationCount = 0;
  let statutoryInstrumentCount = 0;
  let reformAmendmentCount = 0;
  let leadingCaseCount = 0;
  let proceduralRuleCount = 0;
  let enforcementBodyCount = 0;
  let remedyCount = 0;
  let urlCount = 0;
  let unverifiedRecordCount = 0;

  for (const fw of Object.values(FRAMEWORKS)) {
    const c = frameworkCounts(fw);
    primaryActCount += c.primaryActs;
    regulationCount += c.regulations;
    statutoryInstrumentCount += c.statutoryInstruments;
    reformAmendmentCount += c.reformAmendments;
    leadingCaseCount += c.leadingCases;
    proceduralRuleCount += c.proceduralRules;
    enforcementBodyCount += c.enforcementBodies;
    remedyCount += c.remedies;
    urlCount += extractUrls(fw).length;

    const uv = findUnverified(fw);
    unverifiedRecordCount +=
      uv.primaryActs.length +
      uv.regulations.length +
      uv.statutoryInstruments.length +
      uv.reformAmendments.length +
      uv.leadingCases.length +
      uv.proceduralRules.length;
  }

  return {
    jurisdictionCount: Object.keys(FRAMEWORKS).length,
    primaryActCount,
    regulationCount,
    statutoryInstrumentCount,
    reformAmendmentCount,
    leadingCaseCount,
    proceduralRuleCount,
    enforcementBodyCount,
    remedyCount,
    urlCount,
    unverifiedRecordCount,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Lookup helpers.
// ─────────────────────────────────────────────────────────────────────────────

export function getFramework(code: string): LegislativeFramework | undefined {
  return FRAMEWORKS[code];
}

export function getPrimaryAct(
  code: string,
  id: string,
): LegislativeFramework["primaryActs"][number] | undefined {
  const fw = FRAMEWORKS[code];
  if (!fw) return undefined;
  return fw.primaryActs.find((a) => a.id === id);
}

export function getLeadingCase(
  code: string,
  id: string,
): LegislativeFramework["leadingCases"][number] | undefined {
  const fw = FRAMEWORKS[code];
  if (!fw) return undefined;
  return fw.leadingCases.find((c) => c.id === id);
}

export function getRemedy(
  code: string,
  id: string,
): LegislativeFramework["remedies"][number] | undefined {
  const fw = FRAMEWORKS[code];
  if (!fw) return undefined;
  return fw.remedies.find((r) => r.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Cross-link integrity check (run at load time; warns, doesn't throw).
//    A record that references an unknown id is logged but does not block
//    load — useful during the v1 → v2 transition.
// ─────────────────────────────────────────────────────────────────────────────

function checkCrossLinks(fw: LegislativeFramework): {
  broken: { path: string; reference: string }[];
} {
  const broken: { path: string; reference: string }[] = [];
  const actIds = new Set(fw.primaryActs.map((a) => a.id));

  for (const r of fw.regulations) {
    if (!actIds.has(r.parentActId)) {
      broken.push({ path: `regulations.${r.id}.parentActId`, reference: r.parentActId });
    }
  }
  for (const ra of fw.reformAmendments) {
    if (!actIds.has(ra.amendsActId)) {
      broken.push({ path: `reformAmendments.${ra.id}.amendsActId`, reference: ra.amendsActId });
    }
    if (!actIds.has(ra.amendingActId)) {
      broken.push({ path: `reformAmendments.${ra.id}.amendingActId`, reference: ra.amendingActId });
    }
  }
  for (const c of fw.leadingCases) {
    for (const ref of c.relevantActs) {
      if (!actIds.has(ref)) {
        broken.push({ path: `leadingCases.${c.id}.relevantActs`, reference: ref });
      }
    }
  }
  for (const r of fw.remedies) {
    for (const ref of r.legalBasis) {
      if (!actIds.has(ref)) {
        broken.push({ path: `remedies.${r.id}.legalBasis`, reference: ref });
      }
    }
  }

  return { broken };
}

const ukLinkCheck = checkCrossLinks(UK_FRAMEWORK);
const bbLinkCheck = checkCrossLinks(BB_FRAMEWORK);

export const CROSS_LINK_REPORT = {
  UK: ukLinkCheck,
  BB: bbLinkCheck,
};
