// Gauntlet PROCESS sub-loop — Idea #36 of giotto-brainstorm.md.
//
// Replaces the regex-only classification path (lives in ocr-pipeline.ts as
// `classifyDocument`) with a Giotto-first path. Falls back to the regex
// path when GIOTTO_API_KEY is unset, and emits a typed result regardless
// of which path produced it.
//
// Always returns the same `IntakeClassification` shape — see giotto.ts.
//
// Wiring in the gauntlet loop:
//   import { classifyIntake, intakeToResidentIntake } from './gauntlet-process'
//   const cls = await classifyIntake({ text, imageBase64 })
//   const residentIntake = intakeToResidentIntake(cls, rawText)

import {
  classifyIntake,
  giottoConfigured,
  type IntakeClassification,
  type IntakeType,
} from "./giotto";
import { classifyDocument, type DocClassification } from "./ocr-pipeline";

// Map Giotto's coarser IntakeType to the OCR pipeline's DocClassification
// so downstream dossier engines receive a consistent label set.
const TYPE_MAP: Record<IntakeType, DocClassification> = {
  lease: "lease",
  service_charge: "service_charge",
  correspondence_landlord: "correspondence_landlord",
  tribunal_notice: "tribunal_notice",
  building_safety: "building_safety",
  schedule: "other",
  other: "other",
};

// Convenience: also export the regex fallback as a labelled comparator so
// tests can pin both paths to the same output.
export function regexClassify(text: string): IntakeClassification {
  const ranked = classifyDocument(text);
  const top = ranked[0];
  const mapped: IntakeType = top ? (TYPE_MAP_REVERSE[top.type] ?? "other") : "other";
  return {
    type: mapped,
    confidence: top?.confidence ?? 0,
    suggestedRules: ["contracts"],
    suggestedFocus: mapped === "lease" ? ["hidden_rights"] : ["contracts"],
    engine: "fallback",
    generatedAt: new Date().toISOString(),
  };
}

const TYPE_MAP_REVERSE: Partial<Record<DocClassification, IntakeType>> = {
  lease: "lease",
  service_charge: "service_charge",
  correspondence_landlord: "correspondence_landlord",
  correspondence_solicitor: "correspondence_landlord",
  correspondence_council: "correspondence_landlord",
  tribunal_notice: "tribunal_notice",
  building_safety: "building_safety",
  notice_s20: "service_charge",
  notice_rtm: "lease",
  enfranchisement: "lease",
  other: "other",
};

// Single entry point — Giotto if configured, regex otherwise. Identical
// shape returned by both.
export async function classifyGauntletIntake(args: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<IntakeClassification> {
  return classifyIntake(args);
}

// Convert a classification result into the dossier's ResidentIntake shape
// (documented in project/strategy/gauntlet-loop.md). Pure data mapping.
export interface ResidentIntakeLite {
  id: string;
  jurisdiction: string;
  inputQuality: {
    completeness: number;
    legibility: number;
    coherence: number;
    jurisdictionalMatch: number;
  };
  rawFields: Record<string, unknown>;
  gaps: string[];
  recommendedNextEvidence: string[];
  classification: IntakeClassification;
  processedAt: string;
}

export function intakeToResidentIntake(
  cls: IntakeClassification,
  rawText: string,
  jurisdictionHint = "UK",
): ResidentIntakeLite {
  const text = rawText ?? "";
  const completeness = Math.min(1, text.length / 800);
  const jurisdictionalMatch = /landlord|tenant|tribunal|section\s*\d+|act\s*\d{4}/i.test(text)
    ? 0.9
    : 0.4;
  const gaps: string[] = [];
  if (text.length < 200) gaps.push("input_short");
  if (cls.confidence < 0.6) gaps.push("classification_low_confidence");
  if (!/section|act\s*\d{4}|tribunal/i.test(text)) gaps.push("no_statutory_anchor");
  return {
    id: `intake_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    jurisdiction: jurisdictionHint,
    inputQuality: {
      completeness,
      legibility: 0.9, // best-effort; real OCR confidence flows in separately
      coherence: 0.85,
      jurisdictionalMatch,
    },
    rawFields: { classificationType: cls.type, classificationConfidence: cls.confidence },
    gaps,
    recommendedNextEvidence: gaps.includes("no_statutory_anchor")
      ? ["Photo of lease / bill / notice with statutory reference visible"]
      : [],
    classification: cls,
    processedAt: new Date().toISOString(),
  };
}

export { giottoConfigured, type IntakeClassification };