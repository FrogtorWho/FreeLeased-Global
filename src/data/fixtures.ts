// Pseudonymous resident PILOT FIXTURES — NOT real individuals, NOT live registry
// pulls. Attributes are deterministically derived (seed 42) from the documented
// macro ranges in the FC briefs. Per the PII v5 rule every id is a pseudonym.
// These exist only to exercise the engine. See PROJECT-JOURNAL.md §0.
import type { JurisdictionCode } from "./spine";

export interface ResidentAxes {
  resident: {
    householdSize: number;
    holderType: "leaseholder" | "condo co-owner" | "small freeholder" | "strata lot owner";
    registryMatched: boolean; // did the registry record resolve?
  };
  tenure: {
    tenureType: "leasehold" | "freehold" | "strata" | "condominium";
    yearsHeld: number;
    titleRegistered: boolean;
  };
  building: {
    buildingType: "apartment block" | "condominium" | "townhouse terrace" | "detached" | "mixed-use";
    storeys: number;
    unitsInBuilding: number;
    yearBuilt: number;
    fireComplianceBand: "A" | "B" | "C" | "unknown";
    structuralComplianceBand: "A" | "B" | "C" | "unknown";
    hazardBand: 1 | 2 | 3 | 4 | 5; // 5 = highest hurricane/flood exposure
  };
  contracts: {
    leaseTermYears: number | null;
    serviceChargeAnnual: number | null; // in local currency, illustrative sample
    consultationServed: boolean;
    noticeOfEstimateServed: boolean;
    insuranceDisclosed: boolean;
    reserveFundDisclosed: boolean;
    managementAgreementDisclosed: boolean;
    connectedPartyProcurement: boolean;
    arrearsClaimed: boolean;
    beneficialOwnerKnown: boolean;
  };
}

export interface Resident {
  id: string; // pseudonym, e.g. BB-R01
  jurisdiction: JurisdictionCode;
  axes: ResidentAxes;
  // per-axis field-population map drives the Data Sufficiency (DS) gauge
  populated: { resident: number; tenure: number; building: number; contracts: number };
}

// Deterministic PRNG — mulberry32. Same seed → same 50 residents every run.
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rng() * arr.length)];
const between = (lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const chance = (p: number) => rng() < p;

const holderTypes = ["leaseholder", "condo co-owner", "small freeholder", "strata lot owner"] as const;
const buildingTypes = ["apartment block", "condominium", "townhouse terrace", "detached", "mixed-use"] as const;
const bands = ["A", "B", "C", "unknown"] as const;

function makeResident(code: JurisdictionCode, n: number): Resident {
  const id = `${code}-R${String(n).padStart(2, "0")}`;
  const holder = pick(holderTypes);
  const tenureType =
    holder === "small freeholder" ? "freehold" :
    holder === "strata lot owner" ? "strata" :
    holder === "condo co-owner" ? "condominium" : "leasehold";
  const registryMatched = chance(0.82);
  const thinBuilding = chance(0.16); // deliberately thin data → ABSTAIN path
  const thinContracts = chance(0.14);

  const fireBand = thinBuilding ? "unknown" : pick(bands.slice(0, 3));
  const structBand = thinBuilding ? "unknown" : pick(bands.slice(0, 3));
  const hazardBand = between(2, 5) as 2 | 3 | 4 | 5;

  const leasehold = tenureType === "leasehold" || tenureType === "condominium";
  return {
    id, jurisdiction: code,
    axes: {
      resident: { householdSize: between(1, 6), holderType: holder, registryMatched },
      tenure: { tenureType, yearsHeld: between(1, 35), titleRegistered: chance(0.88) },
      building: {
        buildingType: pick(buildingTypes), storeys: between(1, 14),
        unitsInBuilding: between(1, 60), yearBuilt: between(1968, 2022),
        fireComplianceBand: fireBand, structuralComplianceBand: structBand, hazardBand,
      },
      contracts: {
        leaseTermYears: leasehold ? between(60, 199) : null,
        serviceChargeAnnual: thinContracts ? null : between(800, 9000),
        consultationServed: chance(0.55),
        noticeOfEstimateServed: chance(0.5),
        insuranceDisclosed: chance(0.6),
        reserveFundDisclosed: chance(0.45),
        managementAgreementDisclosed: chance(0.5),
        connectedPartyProcurement: chance(0.22),
        arrearsClaimed: chance(0.18),
        beneficialOwnerKnown: chance(0.5),
      },
    },
    populated: {
      resident: registryMatched ? 3 : 2,
      tenure: 3,
      building: thinBuilding ? 3 : 7,
      contracts: thinContracts ? 4 : 10,
    },
  };
}

function build(): Resident[] {
  const out: Resident[] = [];
  (["BB", "JM", "KY"] as JurisdictionCode[]).forEach((code) => {
    const count = code === "BB" ? 20 : 15;
    for (let i = 1; i <= count; i++) out.push(makeResident(code, i));
  });
  return out;
}

export const RESIDENTS: Resident[] = build();
