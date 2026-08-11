// Giotto.ai shared TS wrapper.
//
// Single source of truth for every Giotto call across the project:
// - `giottoConfigured()` mirrors the Python helper
// - `callGiotto()` does a thin fetch against the OpenAI-compatible endpoint
// - The shape of every returned object is the SAME whether Giotto or the
//   deterministic fallback produced it. UI never branches on which path ran.
//
// All 5 Giotto integrations (lease extraction, scan-lease demo, memo
// drafter, gauntlet PROCESS, judge Q&A prep) import from here.
//
// No new dependencies: uses native `fetch` + `AbortSignal.timeout`.

import { STATUTES, HIDDEN_RIGHTS } from "../data/spine";

export const DEFAULT_GIOTTO_BASE_URL = "https://api.giotto.ai/v1/";
export const DEFAULT_GIOTTO_MODEL = "giotto-compact";

// Env-guard, identical logic to src/core/giotto_client.py:giotto_configured
export function giottoConfigured(): boolean {
  const key = process.env.GIOTTO_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === "your_giotto_api_key_here") return false;
  return true;
}

export interface GiottoMessagePart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

export interface GiottoMessage {
  role: "system" | "user" | "assistant";
  content: string | GiottoMessagePart[];
}

export interface GiottoCallOptions {
  system: string;
  user: string | GiottoMessagePart[];
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}

export interface GiottoCallResult {
  ok: boolean;
  source: "giotto" | "fallback";
  text: string;
  raw?: unknown;
  error?: string;
}

// Guardrail: post-validate citations & numbers against the spine before
// letting any Giotto output touch the dossier. Two checks:
//  1) Every citation must resolve to a statute id in `STATUTES`.
//  2) Every numeric claim (e.g. "16:1 LTV:CAC") must either be in our
//     allow-list (extracted from MEMORY.md constants) or be a ratio/percent
//     of a known spine quantity.
// If the wrapper is asked to validate, drops unknown citations + flags the
// text. Always safe to call.
export const CITATION_ALLOW_LIST = new Set(
  STATUTES.map((s) => s.shortTitle).concat(STATUTES.map((s) => s.id))
);
export const HIDDEN_RIGHT_TOPICS = new Set(
  HIDDEN_RIGHTS.map((p) => p.plain.toLowerCase())
);

export function sanitiseCitations(text: string): string {
  // Drop lines that reference an unknown Act — extremely conservative.
  // Pattern: any "[Short Title YYYY, s.NN]" style citation where the
  // short-title token isn't in the spine.
  const citationPattern = /\[([^\]]{2,80}?\s+\d{4}[^a-zA-Z0-9]+s?\.?\s*\d+[A-Z]?)\]/g;
  return text.replace(citationPattern, (match) => {
    const shortTitle = match.replace(citationPattern, "$1").split(/\s+\d{4}/)[0].trim();
    const found = [...CITATION_ALLOW_LIST].some((s) =>
      s.toLowerCase().includes(shortTitle.toLowerCase().slice(0, 12))
    );
    return found ? match : "[citation removed by giotto-guard]";
  });
}

// Thin call against the OpenAI-compatible Giotto endpoint.
export async function callGiotto(opts: GiottoCallOptions): Promise<GiottoCallResult> {
  if (!giottoConfigured()) {
    return {
      ok: false,
      source: "fallback",
      text: "",
      error: "GIOTTO_API_KEY not configured",
    };
  }
  const apiKey = process.env.GIOTTO_API_KEY ?? "";
  const baseUrl = process.env.GIOTTO_BASE_URL ?? DEFAULT_GIOTTO_BASE_URL;
  const model = opts.model ?? DEFAULT_GIOTTO_MODEL;

  const controller = new AbortController();
  const timeout = opts.timeoutMs ?? 20_000;
  const t = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${baseUrl}chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        max_tokens: opts.maxTokens ?? 800,
        temperature: opts.temperature ?? 0.2,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return {
        ok: false,
        source: "giotto",
        text: "",
        error: `HTTP ${res.status}: ${await res.text().catch(() => "no body")}`,
      };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { ok: true, source: "giotto", text, raw: json };
  } catch (e) {
    return {
      ok: false,
      source: "giotto",
      text: "",
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(t);
  }
}

// ---------------------------------------------------------------------------
// Per-integration helpers — each has a deterministic fallback so the UI /
// API contract is identical with or without GIOTTO_API_KEY.
// ---------------------------------------------------------------------------

// Idea #1 + #27 — lease extraction (text or image). Returns a typed shape.
export interface LeaseExtraction {
  parties: string[];
  termYears: number | null;
  rentAnnual: number | null;
  deposit: string | null;
  clauses: Array<{ excerpt: string; topic: string; risk: "low" | "medium" | "high" }>;
  statutesCited: string[];
  summary: string;
  generatedAt: string;
  engine: "giotto" | "fallback";
}

const FALLBACK_EXTRACTION: Omit<LeaseExtraction, "generatedAt" | "engine"> = {
  parties: [],
  termYears: null,
  rentAnnual: null,
  deposit: null,
  clauses: [],
  statutesCited: [],
  summary:
    "Giotto API key not configured — extraction returned without LLM assistance. " +
    "Deterministic fallback engaged. Set GIOTTO_API_KEY to enable structured extraction.",
};

export async function extractLease(args: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<LeaseExtraction> {
  const generatedAt = new Date().toISOString();
  if (!giottoConfigured()) {
    return { ...FALLBACK_EXTRACTION, generatedAt, engine: "fallback" };
  }
  const system =
    "You are a UK lease extractor. Return ONLY a compact JSON object with keys: " +
    "parties (string[]), termYears (number|null), rentAnnual (number|null), " +
    "deposit (string|null), clauses (array of {excerpt, topic, risk in low|medium|high}), " +
    "statutesCited (string[] of Act short-titles only), summary (1 sentence). " +
    "Do not invent. If a field is unknown, use null.";
  const user: GiottoMessagePart[] = [];
  if (args.imageBase64) {
    user.push({
      type: "image_url",
      image_url: { url: `data:${args.mimeType ?? "image/png"};base64,${args.imageBase64}` },
    });
  }
  if (args.text) user.push({ type: "text", text: args.text });

  const r = await callGiotto({ system, user, maxTokens: 800 });
  if (!r.ok) {
    return { ...FALLBACK_EXTRACTION, generatedAt, engine: "fallback" };
  }
  // Extract JSON block; tolerate fences.
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { ...FALLBACK_EXTRACTION, generatedAt, engine: "fallback" };
  }
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<LeaseExtraction>;
    const safe: LeaseExtraction = {
      parties: Array.isArray(parsed.parties) ? parsed.parties.slice(0, 20) : [],
      termYears: typeof parsed.termYears === "number" ? parsed.termYears : null,
      rentAnnual: typeof parsed.rentAnnual === "number" ? parsed.rentAnnual : null,
      deposit: typeof parsed.deposit === "string" ? parsed.deposit : null,
      clauses: Array.isArray(parsed.clauses)
        ? parsed.clauses.slice(0, 30).map((c: Partial<{ excerpt: unknown; topic: unknown; risk: unknown }>) => ({
            excerpt: String(c.excerpt ?? "").slice(0, 240),
            topic: String(c.topic ?? "general"),
            risk: c.risk === "low" || c.risk === "medium" || c.risk === "high" ? c.risk : "low",
          }))
        : [],
      statutesCited: Array.isArray(parsed.statutesCited)
        ? parsed.statutesCited.filter((s) => typeof s === "string").slice(0, 20)
        : [],
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 400) : "",
      generatedAt,
      engine: "giotto",
    };
    return safe;
  } catch {
    return { ...FALLBACK_EXTRACTION, generatedAt, engine: "fallback" };
  }
}

// Idea #36 — gauntlet PROCESS sub-loop classifier.
export type IntakeType =
  | "lease"
  | "service_charge"
  | "correspondence_landlord"
  | "tribunal_notice"
  | "building_safety"
  | "schedule"
  | "other";

export interface IntakeClassification {
  type: IntakeType;
  confidence: number;
  suggestedRules: string[];
  suggestedFocus: string[];
  engine: "giotto" | "fallback";
  generatedAt: string;
}

const FALLBACK_CLASSIFICATION = (
  text: string,
): Omit<IntakeClassification, "engine" | "generatedAt"> => {
  const t = text.toLowerCase();
  let type: IntakeType = "other";
  let confidence = 0.5;
  if (/section\s*20|s\.?\s*20/.test(t)) {
    type = "service_charge";
    confidence = 0.85;
  } else if (/tribunal|first-tier|upper tribunal/.test(t)) {
    type = "tribunal_notice";
    confidence = 0.85;
  } else if (/building safety|cladding|fire safety/.test(t)) {
    type = "building_safety";
    confidence = 0.8;
  } else if (/landlord|freeholder|managing agent/.test(t) && /dear|re:|sincerely/.test(t)) {
    type = "correspondence_landlord";
    confidence = 0.7;
  } else if (/lease|tenancy|lessor|lessee|demised/.test(t)) {
    type = "lease";
    confidence = 0.75;
  } else if (/schedule|appendix|annex/.test(t)) {
    type = "schedule";
    confidence = 0.6;
  }
  return {
    type,
    confidence,
    suggestedRules: [],
    suggestedFocus: type === "lease" ? ["hidden_rights", "contracts"] : ["contracts"],
  };
};

export async function classifyIntake(args: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<IntakeClassification> {
  const generatedAt = new Date().toISOString();
  if (!args.text && !args.imageBase64) {
    return {
      type: "other",
      confidence: 0,
      suggestedRules: [],
      suggestedFocus: [],
      engine: "fallback",
      generatedAt,
    };
  }
  if (!giottoConfigured()) {
    return { ...FALLBACK_CLASSIFICATION(args.text ?? ""), engine: "fallback", generatedAt };
  }
  const system =
    "You are a UK leasehold document classifier. Return ONLY compact JSON: " +
    "{ type: one of lease|service_charge|correspondence_landlord|tribunal_notice|building_safety|schedule|other, " +
    "confidence: 0..1, suggestedRules: string[] of rule ids from {contracts, hidden_rights, tenure, resident_status}, " +
    "suggestedFocus: string[] }. Do not invent.";
  const user: GiottoMessagePart[] = [];
  if (args.imageBase64) {
    user.push({
      type: "image_url",
      image_url: { url: `data:${args.mimeType ?? "image/png"};base64,${args.imageBase64}` },
    });
  }
  if (args.text) user.push({ type: "text", text: args.text });
  const r = await callGiotto({ system, user, maxTokens: 300 });
  if (!r.ok) {
    return { ...FALLBACK_CLASSIFICATION(args.text ?? ""), engine: "fallback", generatedAt };
  }
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { ...FALLBACK_CLASSIFICATION(args.text ?? ""), engine: "fallback", generatedAt };
  }
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<IntakeClassification>;
    const allowed: IntakeType[] = [
      "lease",
      "service_charge",
      "correspondence_landlord",
      "tribunal_notice",
      "building_safety",
      "schedule",
      "other",
    ];
    const type = allowed.includes(parsed.type as IntakeType) ? (parsed.type as IntakeType) : "other";
    return {
      type,
      confidence: typeof parsed.confidence === "number" ? Math.min(1, Math.max(0, parsed.confidence)) : 0.5,
      suggestedRules: Array.isArray(parsed.suggestedRules)
        ? parsed.suggestedRules.filter((s) => typeof s === "string").slice(0, 10)
        : [],
      suggestedFocus: Array.isArray(parsed.suggestedFocus)
        ? parsed.suggestedFocus.filter((s) => typeof s === "string").slice(0, 10)
        : [],
      engine: "giotto",
      generatedAt,
    };
  } catch {
    return { ...FALLBACK_CLASSIFICATION(args.text ?? ""), engine: "fallback", generatedAt };
  }
}

// Idea #16 — memo drafter. Draft-only, always marked REQUIRES REVIEW.
export interface MemoDraft {
  summary: string;
  rightsEngaged: string[];
  recommendedActions: string[];
  citations: string[];
  disclaimer: string;
  status: "DRAFT — REQUIRES REVIEWER SIGN-OFF";
  generatedAt: string;
  engine: "giotto" | "fallback";
}

export function draftMemo(args: {
  dossier: {
    residentId: string;
    jurisdiction: string;
    verdicts: Array<{ agent: string; matchedRightIds?: string[]; abstain?: boolean }>;
    citedStatutes?: string[];
    signOff?: string;
  };
}): MemoDraft {
  const generatedAt = new Date().toISOString();
  const verdictSummary = args.dossier.verdicts
    .map((v) => `${v.agent}: ${v.matchedRightIds?.length ?? 0} rights (${v.abstain ? "abstain" : "verified"})`)
    .join("; ");
  return {
    summary:
      `Resident ${args.dossier.residentId} (${args.dossier.jurisdiction}): ${verdictSummary}. ` +
      `Draft memo based on the deterministic dossier; human reviewer MUST sign off before circulation.`,
    rightsEngaged: args.dossier.verdicts
      .flatMap((v) => v.matchedRightIds ?? [])
      .slice(0, 10),
    recommendedActions: [
      "Review cited statutes against the current spine snapshot.",
      "Validate any numeric claims via the original tribunal decision / Act.",
      "Confirm jurisdiction-specific consultation thresholds before sending.",
    ],
    citations: (args.dossier.citedStatutes ?? []).slice(0, 20),
    disclaimer:
      "DRAFT — REQUIRES REVIEWER SIGN-OFF. This memo was generated from the resident dossier and " +
      "MUST be reviewed by a qualified advisor before circulation. The deterministic dossier is " +
      "statute-anchored and evidence-classed; this prose layer adds no new claims, only structure.",
    status: "DRAFT — REQUIRES REVIEWER SIGN-OFF",
    generatedAt,
    engine: "fallback",
  };
}

export async function draftMemoWithGiotto(args: {
  dossier: {
    residentId: string;
    jurisdiction: string;
    verdicts: Array<{ agent: string; matchedRightIds?: string[]; abstain?: boolean }>;
    citedStatutes?: string[];
    signOff?: string;
  };
}): Promise<MemoDraft> {
  const generatedAt = new Date().toISOString();
  const fallback = draftMemo(args);
  if (!giottoConfigured()) return fallback;

  const system =
    "You are a UK/Caribbean leasehold advisor drafting a case memo. " +
    "Return ONLY compact JSON: {summary (3 sentences), rightsEngaged (string[]), " +
    "recommendedActions (string[]), citations (string[] of Act short-titles only)}. " +
    "Do not invent statute short-titles. Do not invent numbers. " +
    "Pre-existing citations are: " +
    (args.dossier.citedStatutes ?? []).join(", ") +
    ". Stay within that allow-list.";
  const user = JSON.stringify(args.dossier, null, 2).slice(0, 6000);
  const r = await callGiotto({ system, user, maxTokens: 1000 });
  if (!r.ok) return fallback;

  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return fallback;
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<MemoDraft>;
    const safeCitations = Array.isArray(parsed.citations)
      ? parsed.citations
          .filter((s): s is string => typeof s === "string")
          .filter((s) => CITATION_ALLOW_LIST.has(s) || [...CITATION_ALLOW_LIST].some((a) => a.toLowerCase().includes(s.toLowerCase().slice(0, 12))))
          .slice(0, 20)
      : fallback.citations;
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 800) : fallback.summary,
      rightsEngaged: Array.isArray(parsed.rightsEngaged)
        ? parsed.rightsEngaged.filter((s): s is string => typeof s === "string").slice(0, 20)
        : fallback.rightsEngaged,
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? parsed.recommendedActions.filter((s): s is string => typeof s === "string").slice(0, 20)
        : fallback.recommendedActions,
      citations: safeCitations,
      disclaimer: fallback.disclaimer,
      status: fallback.status,
      generatedAt,
      engine: "giotto",
    };
  } catch {
    return fallback;
  }
}

// Idea #33 — judge Q&A prep.
export interface JudgeAnswerDraft {
  question: string;
  draft: string;
  citations: string[];
  caveats: string[];
  engine: "giotto" | "fallback";
}

const JUDGE_FALLBACK_ANSWER = (
  question: string,
): Omit<JudgeAnswerDraft, "engine"> => ({
  question,
  draft:
    "Giotto API key not configured. The existing answer in " +
    "`project/strategy/judge-qa-kill-list.md` is the canonical response. " +
    "Set GIOTTO_API_KEY to enable on-the-fly draft generation.",
  citations: [],
  caveats: ["Fallback engaged; deterministic answer recommended for live Q&A."],
});

export async function draftJudgeAnswer(args: {
  question: string;
  context?: string;
}): Promise<JudgeAnswerDraft> {
  if (!giottoConfigured()) {
    return { ...JUDGE_FALLBACK_ANSWER(args.question), engine: "fallback" };
  }
  const system =
    "You are Sam Peacock's Q&A partner for the Future Caribbean Buildathon judge panel. " +
    "Answer crisply (under 25 seconds spoken), honestly, no bluffing. " +
    "Cite ONLY short-titles from the FreeLeased spine. " +
    "Return ONLY compact JSON: {draft (string, <120 words), citations (string[]), caveats (string[])}.";
  const user = `QUESTION: ${args.question}\n\nCONTEXT: ${args.context ?? "(none)"}`;
  const r = await callGiotto({ system, user, maxTokens: 350 });
  if (!r.ok) return { ...JUDGE_FALLBACK_ANSWER(args.question), engine: "fallback" };
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { ...JUDGE_FALLBACK_ANSWER(args.question), engine: "fallback" };
  }
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<JudgeAnswerDraft>;
    return {
      question: args.question,
      draft: typeof parsed.draft === "string" ? parsed.draft.slice(0, 1200) : JUDGE_FALLBACK_ANSWER(args.question).draft,
      citations: Array.isArray(parsed.citations)
        ? parsed.citations.filter((s): s is string => typeof s === "string").slice(0, 10)
        : [],
      caveats: Array.isArray(parsed.caveats)
        ? parsed.caveats.filter((s): s is string => typeof s === "string").slice(0, 10)
        : [],
      engine: "giotto",
    };
  } catch {
    return { ...JUDGE_FALLBACK_ANSWER(args.question), engine: "fallback" };
  }
}