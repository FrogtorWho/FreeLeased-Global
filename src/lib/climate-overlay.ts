// src/lib/climate-overlay.ts — Sea-level-rise risk overlay for leasehold dossiers.
//
// Why this exists:
//   Phase 12 G7. Caribbean leasehold value is climate-sensitive. A
//   dossier that surfaces "your service charge is £X" without telling
//   the leaseholder "your building is in a Severe sea-level-rise zone
//   by 2100" misses the largest single long-term risk to the asset.
//
//   This module loads the climate-risk JSON and exposes a single
//   function `getCoastalRisk(jurisdiction)` that the dossier builder
//   can call to attach a risk score + label to every Caribbean dossier.
//
// Cross-references:
//   - src/data/climate/sealevel-rise-gis.json — the source data.
//   - src/components/auri/ClimateOverlay.tsx — the UI that renders it.
//   - NOAA Tides & Currents + Climate Central — sources.

import rawData from "../data/climate/sealevel-rise-gis.json";

/** All jurisdictions with risk scores (mirrors the JSON keys). */
export const COASTAL_JURISDICTIONS = ["BS", "BB", "JM", "KY", "TT", "VG"] as const;
export type CoastalJurisdictionCode = (typeof COASTAL_JURISDICTIONS)[number];

/** Risk score (0–4) → human-readable label. */
export const RISK_LABELS: Record<number, string> = {
  0: "Negligible",
  1: "Low",
  2: "Moderate",
  3: "High",
  4: "Severe",
};

export interface SeaLevelProjection {
  /** Year of the projection (e.g. 2030). */
  2030: number;
  2050: number;
  2100: number;
}

export interface CoastalRisk {
  jurisdictionName: string;
  iso2: string;
  regionalContext: string;
  /** 0–4 (Negligible / Low / Moderate / High / Severe). */
  riskScore: number;
  riskLabel: string;
  exposedPopulationPct: number;
  exposedCoastlinePct: number;
  primaryHazard: string;
  horizonYears: number[];
  projectedSLRMetres: SeaLevelProjection;
  sourceDataset: string;
  url?: string;
  unverified: boolean;
  leaseholderImplication: string;
}

/** Strip the `$meta` key and assert the shape. */
function loadData(): Record<CoastalJurisdictionCode, CoastalRisk> {
  const data = rawData as unknown as {
    $meta: Record<string, unknown>;
  } & Record<CoastalJurisdictionCode, CoastalRisk>;
  return data;
}

const DATA = loadData();

/**
 * Get the coastal risk profile for a jurisdiction code (ISO-2: BS, BB, JM, KY, TT, VG).
 * Returns `null` if the jurisdiction is not in the dataset (e.g. UK).
 */
export function getCoastalRisk(jurisdiction: string): CoastalRisk | null {
  const code = jurisdiction.toUpperCase() as CoastalJurisdictionCode;
  if (!COASTAL_JURISDICTIONS.includes(code)) return null;
  return DATA[code] ?? null;
}

/** True if the jurisdiction code is in the dataset. */
export function isCoastalJurisdiction(jurisdiction: string): boolean {
  return COASTAL_JURISDICTIONS.includes(jurisdiction.toUpperCase() as CoastalJurisdictionCode);
}

/** Convenience: just the score. */
export function getCoastalRiskScore(jurisdiction: string): number | null {
  return getCoastalRisk(jurisdiction)?.riskScore ?? null;
}

/** Convenience: just the human-readable label. */
export function getCoastalRiskLabel(jurisdiction: string): string {
  const r = getCoastalRisk(jurisdiction);
  return r ? r.riskLabel : "Not in dataset";
}

/** All jurisdictions + scores (sorted by score descending). */
export function allCoastalRisks(): CoastalRisk[] {
  return COASTAL_JURISDICTIONS
    .map((code) => DATA[code])
    .filter((r): r is CoastalRisk => Boolean(r))
    .sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Build a dossier-friendly summary suitable for the `Dossier Notes` column.
 * Returns empty string for non-coastal jurisdictions (so callers can
 * blindly concatenate it).
 */
export function coastalRiskSummary(jurisdiction: string): string {
  const r = getCoastalRisk(jurisdiction);
  if (!r) return "";
  return `[Climate Overlay] ${r.jurisdictionName}: ${r.riskLabel} risk (score ${r.riskScore}/4). ${r.exposedCoastlinePct}% of coastline exposed to 1m SLR by 2100. ${r.leaseholderImplication}`;
}

/** Returns the meta-citations block, for surfacing in the UI footer. */
export function citations(): string[] {
  const meta = (rawData as unknown as { $meta: { sources: string[]; caveats: string[] } }).$meta;
  return [...meta.sources, ...meta.caveats];
}

/** Version tag for the climate overlay. Bump on data refresh. */
export const CLIMATE_OVERLAY_VERSION = "1.0.0-phase12";