// ─────────────────────────────────────────────────────────────────────────────
// Legislative Framework Schema — global top-down jurisdiction onboarding
//
// PURPOSE
//   Canonical, defensible, Zod-validatable shape for a jurisdiction's entire
//   legislative framework. This is the spine-of-record for every statute we
//   reference in FreeLeased. Every record carries:
//     • a conviction class (established / heuristic / contested / unfalsifiable)
//       — the same 4-class discipline as src/lib/veracity.ts and src/lib/fairness.ts
//     • a primary source URL (validated as a URL string, ideally 200-resolvable)
//     • a `[PERSON_NAME]`-safe contributor pseudonym
//
// COMPATIBILITY
//   This file is a STANDARD SCHEMA written in pure TypeScript. It does NOT
//   introduce a runtime dependency on zod. It exposes:
//     • `LegislativeFramework` — the inferred type
//     • `LegislativeFrameworkSchema` — a hand-rolled validator that mirrors
//       the Zod surface (`.parse`, `.safeParse`, `.shape`) so callers can
//       swap in a real Zod schema later without rewriting call sites.
//     • `LegislativeFrameworkZod` — optional, loaded lazily at runtime if
//       `zod` is importable; kept behind a dynamic import so the bundle
//       stays clean when zod is absent.
//
// CONVENTIONS
//   • Every field is optional UNLESS the spec marks it as required.
//   • Every URL must parse as a URL (validated at parse() time).
//   • Every conviction must be in the canonical 4-class set.
//   • Every contributor pseudonym is `[PERSON_NAME]`-safe (regex below).
//   • Every unverified URL is flagged with `unverified: true` so the
//     truth-protocol's "do not cite unverified" discipline propagates.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. Enumerations (the canonical 4-class set, single source of truth)
// ─────────────────────────────────────────────────────────────────────────────

export const CONVICTION_CLASSES = [
  "established",
  "heuristic",
  "contested",
  "unfalsifiable",
] as const;
export type ConvictionClass = (typeof CONVICTION_CLASSES)[number];

export const LEGAL_SYSTEMS = ["common-law", "civil-law", "mixed"] as const;
export type LegalSystem = (typeof LEGAL_SYSTEMS)[number];

export const SIGNIFICANCE_LEVELS = [
  "landmark",
  "leading",
  "persuasive",
  "minor",
] as const;
export type SignificanceLevel = (typeof SIGNIFICANCE_LEVELS)[number];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Pseudonym regex — conservative, matches the AGENTS.md `[PERSON_NAME]`
//    discipline. Every journal/contribution field must conform.
// ─────────────────────────────────────────────────────────────────────────────

const PSEUDONYM_RE = /^\[PERSON_NAME\]$|^[a-z0-9-]+$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Primitive validators (URL, datetime, conviction class)
// ─────────────────────────────────────────────────────────────────────────────

function isString(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

function isOptionalString(x: unknown): x is string | undefined {
  return x === undefined || typeof x === "string";
}

function isUrl(x: unknown): x is string {
  if (typeof x !== "string") return false;
  try {
    const u = new URL(x);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isOptionalUrl(x: unknown): x is string | undefined {
  return x === undefined || isUrl(x);
}

function isIsoDatetime(x: unknown): x is string {
  if (typeof x !== "string") return false;
  // ISO 8601 with required Z or ±HH:MM offset
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  return iso.test(x) && !Number.isNaN(Date.parse(x));
}

function isOptionalIsoDatetime(x: unknown): x is string | undefined {
  return x === undefined || isIsoDatetime(x);
}

function isInt(x: unknown): x is number {
  return typeof x === "number" && Number.isInteger(x);
}

function isInEnum<T extends readonly string[]>(
  values: T,
  x: unknown,
): x is T[number] {
  return typeof x === "string" && (values as readonly string[]).includes(x);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Record shapes (interfaces) — these are the canonical Zod-equivalent types
// ─────────────────────────────────────────────────────────────────────────────

export interface Jurisdiction {
  code: string;
  name: string;
  legalSystem: LegalSystem;
  constitutionalFoundation: string;
  officialGazette: string;
  lastVerified: string;
  contributorPseudonym: string;
  /**
   * Caribbean-jurisdiction-test v1.1: official language of the statute book.
   * Defaults to "en" if absent. Used by the i18n roadmap.
   */
  language?: string;
  /**
   * Caribbean-jurisdiction-test v1.1: appellate court hierarchy. The string
   * is human-readable (e.g. "CCJ", "Privy Council", "UK Supreme Court").
   * Used by the knowledge graph to model precedent propagation.
   */
  finalAppellateCourt?: string;
  /**
   * Caribbean-jurisdiction-test v1.1: whether the gazette portal is
   *   static       — curl-friendly, no JS rendering needed
   *   search-only  — search box but no index page
   *   js-rendered — requires a headless browser
   *   unknown      — default; flagged for follow-up
   * Drives the scrape-readiness classifier.
   */
  gazettePortability?: "static" | "search-only" | "js-rendered" | "unknown";
}

export interface PrimaryAct {
  id: string;
  shortTitle: string;
  longTitle: string;
  chapterNumber?: string;
  enactmentYear: number;
  enactmentDate: string;
  commencementDate?: string;
  consolidatingAct: boolean;
  sourceUrl: string;
  officialPdfUrl?: string;
  summary: string;
  leaseholderRelevantSections: string[];
  conviction: ConvictionClass;
  lastAmended?: string;
  unverified?: boolean;
}

export interface Regulation {
  id: string;
  parentActId: string;
  title: string;
  year: number;
  sourceUrl: string;
  summary: string;
  unverified?: boolean;
}

export interface StatutoryInstrument {
  id: string;
  number: string;
  title: string;
  year: number;
  inForceDate: string;
  sourceUrl: string;
  summary: string;
  unverified?: boolean;
}

export interface ReformAmendment {
  id: string;
  amendingActId: string;
  amendsActId: string;
  sectionsAffected: string[];
  enactedYear: number;
  effectiveDate: string;
  sourceUrl: string;
  summary: string;
  conviction: ConvictionClass;
  unverified?: boolean;
}

export interface LeadingCase {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  decidedDate: string;
  judges: string[];
  headnote: string;
  relevantActs: string[];
  significance: SignificanceLevel;
  sourceUrl: string;
  unverified?: boolean;
}

export interface ProceduralRule {
  id: string;
  tribunalOrCourt: string;
  title: string;
  sourceUrl: string;
  summary: string;
  unverified?: boolean;
}

export interface EnforcementBody {
  id: string;
  name: string;
  jurisdiction: string;
  powers: string[];
  contactUrl: string;
}

export interface Remedy {
  id: string;
  label: string;
  description: string;
  legalBasis: string[];
  applicableWhere: string;
  formTemplateId?: string;
  /**
   * Caribbean-jurisdiction-test v1.1: kind of remedy, used to distinguish
   * RTM-equivalent / strata-corporation-action / tribunal-petition / court-petition.
   *   rtm-equivalent          — UK Right to Manage (CLRA 2002 §72)
   *   strata-corporation-action — body-corporate / strata-corporation enforcement
   *   tribunal-petition       — specialist tribunal (FTT, Stars Tribunal, etc.)
   *   court-petition          — Superior Court / High Court / Grand Court
   *   agency-complaint        — regulatory body / ombudsman
   *   registration-action     — caveat / registry action
   *   other                   — anything else
   */
  remedyKind?:
    | "rtm-equivalent"
    | "strata-corporation-action"
    | "tribunal-petition"
    | "court-petition"
    | "agency-complaint"
    | "registration-action"
    | "other";
  /**
   * Caribbean-jurisdiction-test v1.1: governance path used to obtain the remedy.
   *   rtm-claim-notice         — UK RTM claim notice
   *   unanimous-resolution    — body-corporate / strata-corporation unanimous vote
   *   unit-entitlement-vote   — strata-corporation proportional vote
   *   tribunal-application    — first-tier tribunal
   *   court-application       — court petition
   *   agency-letter           — written agency complaint
   *   registry-registration   — caveat / registry action
   *   other                   — anything else
   */
  governancePath?:
    | "rtm-claim-notice"
    | "unanimous-resolution"
    | "unit-entitlement-vote"
    | "tribunal-application"
    | "court-application"
    | "agency-letter"
    | "registry-registration"
    | "other";
}

export interface LegislativeFramework {
  jurisdiction: Jurisdiction;
  primaryActs: PrimaryAct[];
  regulations: Regulation[];
  statutoryInstruments: StatutoryInstrument[];
  reformAmendments: ReformAmendment[];
  leadingCases: LeadingCase[];
  proceduralRules: ProceduralRule[];
  enforcementBodies: EnforcementBody[];
  remedies: Remedy[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Hand-rolled Zod-compatible validator
//
// Exposes the same surface as `z.object({...})`:
//   • `.parse(x)` — strict, throws on failure
//   • `.safeParse(x)` — returns `{ success, data } | { success: false, error }`
//   • `.shape` — accessor for nested schemas
//
// This is forward-compatible: if a future env has zod installed, replace the
// internals with `z.object(...)` and the call sites stay identical.
// ─────────────────────────────────────────────────────────────────────────────

export class SchemaError extends Error {
  issues: { path: string; message: string }[];
  constructor(issues: { path: string; message: string }[]) {
    super(`Schema validation failed: ${issues.length} issue(s)`);
    this.name = "SchemaError";
    this.issues = issues;
  }
}

type Issues = { path: string; message: string }[];

interface FieldSchema<T> {
  _type?: T;
  optional?: boolean;
  validate: (x: unknown, path: string, issues: Issues) => boolean;
}

function str(opts: { optional?: boolean } = {}): FieldSchema<string> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!isString(x)) {
        issues.push({ path, message: "expected non-empty string" });
        return false;
      }
      return true;
    },
  };
}

function url(opts: { optional?: boolean } = {}): FieldSchema<string> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!isUrl(x)) {
        issues.push({ path, message: "expected http(s) URL" });
        return false;
      }
      return true;
    },
  };
}

function isoDatetime(opts: { optional?: boolean } = {}): FieldSchema<string> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!isIsoDatetime(x)) {
        issues.push({
          path,
          message: "expected ISO 8601 datetime (e.g. 2026-08-11T13:00:00Z)",
        });
        return false;
      }
      return true;
    },
  };
}

function int(opts: { optional?: boolean } = {}): FieldSchema<number> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!isInt(x)) {
        issues.push({ path, message: "expected integer" });
        return false;
      }
      return true;
    },
  };
}

function enumeration<T extends readonly string[]>(
  values: T,
  opts: { optional?: boolean } = {},
): FieldSchema<T[number]> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!isInEnum(values, x)) {
        issues.push({
          path,
          message: `expected one of ${values.join(" | ")}`,
        });
        return false;
      }
      return true;
    },
  };
}

function pseudonym(): FieldSchema<string> {
  return {
    optional: false,
    validate: (x, path, issues) => {
      if (!isString(x)) {
        issues.push({ path, message: "expected non-empty pseudonym" });
        return false;
      }
      if (!PSEUDONYM_RE.test(x)) {
        issues.push({
          path,
          message: `pseudonym must match ${PSEUDONYM_RE}; use "[PERSON_NAME]" if real-name is unknown`,
        });
        return false;
      }
      return true;
    },
  };
}

function arrayOf<T>(
  itemValidator: (x: unknown, path: string, issues: Issues) => boolean,
  opts: { optional?: boolean } = {},
): FieldSchema<T[]> {
  return {
    optional: opts.optional,
    validate: (x, path, issues) => {
      if (x === undefined) return !!opts.optional;
      if (!Array.isArray(x)) {
        issues.push({ path, message: "expected array" });
        return false;
      }
      let ok = true;
      x.forEach((item, i) => {
        if (!itemValidator(item, `${path}[${i}]`, issues)) ok = false;
      });
      return ok;
    },
  };
}

function objectSchema<T>(
  shape: Record<string, FieldSchema<unknown>>,
): {
  parse: (x: unknown) => T;
  safeParse: (
    x: unknown,
  ) => { success: true; data: T } | { success: false; error: SchemaError };
  shape: typeof shape;
  _validate: (x: unknown, path: string, issues: Issues) => boolean;
} {
  return {
    shape,
    parse(x: unknown): T {
      const issues: Issues = [];
      this._validate(x, "", issues);
      if (issues.length > 0) throw new SchemaError(issues);
      return x as T;
    },
    safeParse(x: unknown) {
      const issues: Issues = [];
      this._validate(x, "", issues);
      if (issues.length > 0)
        return { success: false, error: new SchemaError(issues) };
      return { success: true, data: x as T };
    },
    _validate(x: unknown, path: string, issues: Issues): boolean {
      if (typeof x !== "object" || x === null) {
        issues.push({ path: path || "<root>", message: "expected object" });
        return false;
      }
      const obj = x as Record<string, unknown>;
      let ok = true;
      for (const [key, field] of Object.entries(shape)) {
        if (!field.validate(obj[key], `${path}.${key}`.replace(/^\./, ""), issues))
          ok = false;
      }
      return ok;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Schema instance (Zod-compatible)
// ─────────────────────────────────────────────────────────────────────────────

const JurisdictionSchema = objectSchema<Jurisdiction>({
  code: str(),
  name: str(),
  legalSystem: enumeration(LEGAL_SYSTEMS),
  constitutionalFoundation: str(),
  officialGazette: url(),
  lastVerified: isoDatetime(),
  contributorPseudonym: pseudonym(),
  language: str({ optional: true }),
  finalAppellateCourt: str({ optional: true }),
  gazettePortability: enumeration(["static", "search-only", "js-rendered", "unknown"], {
    optional: true,
  }),
});

const PrimaryActSchema = objectSchema<PrimaryAct>({
  id: str(),
  shortTitle: str(),
  longTitle: str(),
  chapterNumber: str({ optional: true }),
  enactmentYear: int(),
  enactmentDate: str(),
  commencementDate: str({ optional: true }),
  consolidatingAct: {
    validate: (x, path, issues) => {
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
  sourceUrl: url(),
  officialPdfUrl: url({ optional: true }),
  summary: str(),
  leaseholderRelevantSections: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected section string (e.g. 's.20')" });
      return false;
    }
    return true;
  }),
  conviction: enumeration(CONVICTION_CLASSES),
  lastAmended: str({ optional: true }),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const RegulationSchema = objectSchema<Regulation>({
  id: str(),
  parentActId: str(),
  title: str(),
  year: int(),
  sourceUrl: url(),
  summary: str(),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const StatutoryInstrumentSchema = objectSchema<StatutoryInstrument>({
  id: str(),
  number: str(),
  title: str(),
  year: int(),
  inForceDate: str(),
  sourceUrl: url(),
  summary: str(),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const ReformAmendmentSchema = objectSchema<ReformAmendment>({
  id: str(),
  amendingActId: str(),
  amendsActId: str(),
  sectionsAffected: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected section string" });
      return false;
    }
    return true;
  }),
  enactedYear: int(),
  effectiveDate: str(),
  sourceUrl: url(),
  summary: str(),
  conviction: enumeration(["established", "heuristic", "contested"] as const),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const LeadingCaseSchema = objectSchema<LeadingCase>({
  id: str(),
  caseName: str(),
  citation: str(),
  court: str(),
  year: int(),
  decidedDate: str(),
  judges: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected judge name string" });
      return false;
    }
    return true;
  }),
  headnote: str(),
  relevantActs: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected act id string" });
      return false;
    }
    return true;
  }),
  significance: enumeration(SIGNIFICANCE_LEVELS),
  sourceUrl: url(),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const ProceduralRuleSchema = objectSchema<ProceduralRule>({
  id: str(),
  tribunalOrCourt: str(),
  title: str(),
  sourceUrl: url(),
  summary: str(),
  unverified: {
    optional: true,
    validate: (x, path, issues) => {
      if (x === undefined) return true;
      if (typeof x !== "boolean") {
        issues.push({ path, message: "expected boolean" });
        return false;
      }
      return true;
    },
  },
});

const EnforcementBodySchema = objectSchema<EnforcementBody>({
  id: str(),
  name: str(),
  jurisdiction: str(),
  powers: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected power string" });
      return false;
    }
    return true;
  }),
  contactUrl: url(),
});

const RemedySchema = objectSchema<Remedy>({
  id: str(),
  label: str(),
  description: str(),
  legalBasis: arrayOf<string>((x, path, issues) => {
    if (!isString(x)) {
      issues.push({ path, message: "expected act id string" });
      return false;
    }
    return true;
  }),
  applicableWhere: str(),
  formTemplateId: str({ optional: true }),
  remedyKind: enumeration(
    [
      "rtm-equivalent",
      "strata-corporation-action",
      "tribunal-petition",
      "court-petition",
      "agency-complaint",
      "registration-action",
      "other",
    ],
    { optional: true },
  ),
  governancePath: enumeration(
    [
      "rtm-claim-notice",
      "unanimous-resolution",
      "unit-entitlement-vote",
      "tribunal-application",
      "court-application",
      "agency-letter",
      "registry-registration",
      "other",
    ],
    { optional: true },
  ),
});

export const LegislativeFrameworkSchema = objectSchema<LegislativeFramework>({
  jurisdiction: JurisdictionSchema,
  primaryActs: arrayOf<PrimaryAct>((x, path, issues) =>
    PrimaryActSchema._validate(x, path, issues),
  ),
  regulations: arrayOf<Regulation>((x, path, issues) =>
    RegulationSchema._validate(x, path, issues),
  ),
  statutoryInstruments: arrayOf<StatutoryInstrument>((x, path, issues) =>
    StatutoryInstrumentSchema._validate(x, path, issues),
  ),
  reformAmendments: arrayOf<ReformAmendment>((x, path, issues) =>
    ReformAmendmentSchema._validate(x, path, issues),
  ),
  leadingCases: arrayOf<LeadingCase>((x, path, issues) =>
    LeadingCaseSchema._validate(x, path, issues),
  ),
  proceduralRules: arrayOf<ProceduralRule>((x, path, issues) =>
    ProceduralRuleSchema._validate(x, path, issues),
  ),
  enforcementBodies: arrayOf<EnforcementBody>((x, path, issues) =>
    EnforcementBodySchema._validate(x, path, issues),
  ),
  remedies: arrayOf<Remedy>((x, path, issues) =>
    RemedySchema._validate(x, path, issues),
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Optional Zod bridge (dynamic-import; works only if zod is installed)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lazily returns a Zod schema if `zod` is installed in the project,
 * otherwise returns null. The intent is to keep the runtime zero-dep
 * while letting downstream consumers upgrade to true Zod when they have it.
 *
 * Usage:
 *   const z = await LegislativeFrameworkZod?.();
 *   if (z) z.parse(framework);
 */
export async function LegislativeFrameworkZod(): Promise<unknown | null> {
  try {
    // Dynamic import — falls through silently if zod is absent
    const mod = (await import("zod").catch(() => null)) as any;
    if (!mod?.z) return null;
    const z = mod.z;
    return z.object({
      jurisdiction: z.object({
        code: z.string(),
        name: z.string(),
        legalSystem: z.enum(["common-law", "civil-law", "mixed"]),
        constitutionalFoundation: z.string(),
        officialGazette: z.string().url(),
        lastVerified: z.string().datetime(),
        contributorPseudonym: z
          .string()
          .regex(PSEUDONYM_RE),
      }),
      primaryActs: z.array(
        z.object({
          id: z.string(),
          shortTitle: z.string(),
          longTitle: z.string(),
          chapterNumber: z.string().optional(),
          enactmentYear: z.number().int(),
          enactmentDate: z.string(),
          commencementDate: z.string().optional(),
          consolidatingAct: z.boolean(),
          sourceUrl: z.string().url(),
          officialPdfUrl: z.string().url().optional(),
          summary: z.string(),
          leaseholderRelevantSections: z.array(z.string()),
          conviction: z.enum(CONVICTION_CLASSES),
          lastAmended: z.string().optional(),
        }),
      ),
      regulations: z.array(
        z.object({
          id: z.string(),
          parentActId: z.string(),
          title: z.string(),
          year: z.number().int(),
          sourceUrl: z.string().url(),
          summary: z.string(),
        }),
      ),
      statutoryInstruments: z.array(
        z.object({
          id: z.string(),
          number: z.string(),
          title: z.string(),
          year: z.number().int(),
          inForceDate: z.string(),
          sourceUrl: z.string().url(),
          summary: z.string(),
        }),
      ),
      reformAmendments: z.array(
        z.object({
          id: z.string(),
          amendingActId: z.string(),
          amendsActId: z.string(),
          sectionsAffected: z.array(z.string()),
          enactedYear: z.number().int(),
          effectiveDate: z.string(),
          sourceUrl: z.string().url(),
          summary: z.string(),
          conviction: z.enum(["established", "heuristic", "contested"]),
        }),
      ),
      leadingCases: z.array(
        z.object({
          id: z.string(),
          caseName: z.string(),
          citation: z.string(),
          court: z.string(),
          year: z.number().int(),
          decidedDate: z.string(),
          judges: z.array(z.string()),
          headnote: z.string(),
          relevantActs: z.array(z.string()),
          significance: z.enum(SIGNIFICANCE_LEVELS),
          sourceUrl: z.string().url(),
        }),
      ),
      proceduralRules: z.array(
        z.object({
          id: z.string(),
          tribunalOrCourt: z.string(),
          title: z.string(),
          sourceUrl: z.string().url(),
          summary: z.string(),
        }),
      ),
      enforcementBodies: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          jurisdiction: z.string(),
          powers: z.array(z.string()),
          contactUrl: z.string().url(),
        }),
      ),
      remedies: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          description: z.string(),
          legalBasis: z.array(z.string()),
          applicableWhere: z.string(),
          formTemplateId: z.string().optional(),
        }),
      ),
    });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Convenience helpers — used by the scrape scaffold and the migration
// ─────────────────────────────────────────────────────────────────────────────

/** Return every URL in the framework (recursively). */
export function extractUrls(fw: LegislativeFramework): string[] {
  const urls: string[] = [];
  urls.push(fw.jurisdiction.officialGazette);
  for (const a of fw.primaryActs) {
    urls.push(a.sourceUrl);
    if (a.officialPdfUrl) urls.push(a.officialPdfUrl);
  }
  for (const r of fw.regulations) urls.push(r.sourceUrl);
  for (const si of fw.statutoryInstruments) urls.push(si.sourceUrl);
  for (const ra of fw.reformAmendments) urls.push(ra.sourceUrl);
  for (const c of fw.leadingCases) urls.push(c.sourceUrl);
  for (const pr of fw.proceduralRules) urls.push(pr.sourceUrl);
  for (const eb of fw.enforcementBodies) urls.push(eb.contactUrl);
  return urls;
}

/** Find every record whose `unverified` flag is true. */
export function findUnverified(fw: LegislativeFramework): {
  primaryActs: PrimaryAct[];
  regulations: Regulation[];
  statutoryInstruments: StatutoryInstrument[];
  reformAmendments: ReformAmendment[];
  leadingCases: LeadingCase[];
  proceduralRules: ProceduralRule[];
} {
  return {
    primaryActs: fw.primaryActs.filter((r) => r.unverified),
    regulations: fw.regulations.filter((r) => r.unverified),
    statutoryInstruments: fw.statutoryInstruments.filter((r) => r.unverified),
    reformAmendments: fw.reformAmendments.filter((r) => r.unverified),
    leadingCases: fw.leadingCases.filter((r) => r.unverified),
    proceduralRules: fw.proceduralRules.filter((r) => r.unverified),
  };
}

/** Count records per collection. Useful for the summary report. */
export function frameworkCounts(fw: LegislativeFramework): Record<string, number> {
  return {
    primaryActs: fw.primaryActs.length,
    regulations: fw.regulations.length,
    statutoryInstruments: fw.statutoryInstruments.length,
    reformAmendments: fw.reformAmendments.length,
    leadingCases: fw.leadingCases.length,
    proceduralRules: fw.proceduralRules.length,
    enforcementBodies: fw.enforcementBodies.length,
    remedies: fw.remedies.length,
  };
}
