// MiniMax shared TS wrapper — mirrors src/lib/giotto.ts shape exactly.
//
// MiniMax is the Buildathon token-grant perk (LLM inference, OpenAI-
// compatible endpoint). This wrapper is the single source of truth for
// every MiniMax call across the project.
//
// Surface (identical to giotto.ts):
//   - `minimaxConfigured()` — env-guard, mirrors `giottoConfigured()`
//   - `callMiniMax()` — thin fetch against the OpenAI-compatible endpoint
//   - Every helper returns a typed shape with `engine: "minimax" | "fallback"`
//
// **Fallback contract:** When `MINIMAX_API_KEY` is unset, every helper
// returns `engine: "fallback"` with a deterministic stub. The shape of
// the returned object is identical with or without the key, so the UI
// never branches on which path ran.
//
// No new dependencies. Uses native `fetch` + `AbortSignal.timeout`.
// No edits to `src/generated/*`, `server.tsx`, `bun.lock`.

export const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.chat/v1/";
export const DEFAULT_MINIMAX_MODEL = "minimax-default";

// Env-guard, identical logic to src/lib/giotto.ts:giottoConfigured()
export function minimaxConfigured(): boolean {
  const key = process.env.MINIMAX_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === "your_minimax_api_key_here") return false;
  return true;
}

export interface MiniMaxMessagePart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

export interface MiniMaxMessage {
  role: "system" | "user" | "assistant";
  content: string | MiniMaxMessagePart[];
}

export interface MiniMaxCallOptions {
  system: string;
  user: string | MiniMaxMessagePart[];
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}

export interface MiniMaxCallResult {
  ok: boolean;
  source: "minimax" | "fallback";
  text: string;
  raw?: unknown;
  error?: string;
}

// Thin call against the OpenAI-compatible MiniMax endpoint.
export async function callMiniMax(opts: MiniMaxCallOptions): Promise<MiniMaxCallResult> {
  if (!minimaxConfigured()) {
    return {
      ok: false,
      source: "fallback",
      text: "",
      error: "MINIMAX_API_KEY not configured",
    };
  }
  const apiKey = process.env.MINIMAX_API_KEY ?? "";
  const baseUrl = process.env.MINIMAX_BASE_URL ?? DEFAULT_MINIMAX_BASE_URL;
  const model = opts.model ?? DEFAULT_MINIMAX_MODEL;

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
        source: "minimax",
        text: "",
        error: `HTTP ${res.status}: ${await res.text().catch(() => "no body")}`,
      };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { ok: true, source: "minimax", text, raw: json };
  } catch (e) {
    return {
      ok: false,
      source: "minimax",
      text: "",
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(t);
  }
}

// ---------------------------------------------------------------------------
// Per-integration helpers — each has a deterministic fallback so the UI /
// API contract is identical with or without MINIMAX_API_KEY.
//
// We mirror giotto.ts's `extractLease` shape so MiniMax can serve as a
// drop-in alternative LLM for the same task. Future helpers can be
// added here following the same pattern.
// ---------------------------------------------------------------------------

export interface MiniMaxLeaseExtraction {
  parties: string[];
  termYears: number | null;
  rentAnnual: number | null;
  deposit: string | null;
  summary: string;
  generatedAt: string;
  engine: "minimax" | "fallback";
}

const FALLBACK_MINIMAX_EXTRACTION: Omit<MiniMaxLeaseExtraction, "generatedAt" | "engine"> = {
  parties: [],
  termYears: null,
  rentAnnual: null,
  deposit: null,
  summary:
    "MiniMax API key not configured — extraction returned without LLM assistance. " +
    "Deterministic fallback engaged. Set MINIMAX_API_KEY to enable structured extraction.",
};

// Alt-LLM lease extraction. Useful as a fallback when GIOTTO_API_KEY is
// unset or giotto times out. Same output shape as
// src/lib/giotto.ts:extractLease so the UI never branches.
export async function extractLeaseMiniMax(args: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<MiniMaxLeaseExtraction> {
  const generatedAt = new Date().toISOString();
  if (!minimaxConfigured()) {
    return { ...FALLBACK_MINIMAX_EXTRACTION, generatedAt, engine: "fallback" };
  }
  const system =
    "You are a UK lease extractor. Return ONLY a compact JSON object with keys: " +
    "parties (string[]), termYears (number|null), rentAnnual (number|null), " +
    "deposit (string|null), summary (1 sentence). Do not invent.";
  const user: MiniMaxMessagePart[] = [];
  if (args.imageBase64) {
    user.push({
      type: "image_url",
      image_url: { url: `data:${args.mimeType ?? "image/png"};base64,${args.imageBase64}` },
    });
  }
  if (args.text) user.push({ type: "text", text: args.text });

  const r = await callMiniMax({ system, user, maxTokens: 600 });
  if (!r.ok) {
    return { ...FALLBACK_MINIMAX_EXTRACTION, generatedAt, engine: "fallback" };
  }
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { ...FALLBACK_MINIMAX_EXTRACTION, generatedAt, engine: "fallback" };
  }
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<MiniMaxLeaseExtraction>;
    return {
      parties: Array.isArray(parsed.parties) ? parsed.parties.slice(0, 20) : [],
      termYears: typeof parsed.termYears === "number" ? parsed.termYears : null,
      rentAnnual: typeof parsed.rentAnnual === "number" ? parsed.rentAnnual : null,
      deposit: typeof parsed.deposit === "string" ? parsed.deposit : null,
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 400) : "",
      generatedAt,
      engine: "minimax",
    };
  } catch {
    return { ...FALLBACK_MINIMAX_EXTRACTION, generatedAt, engine: "fallback" };
  }
}

// Mirror of giotto.ts:draftJudgeAnswer for Q&A prep. Useful when the
// judge panel asks an unexpected question and giotto is unavailable.
export interface MiniMaxJudgeAnswerDraft {
  question: string;
  draft: string;
  citations: string[];
  caveats: string[];
  engine: "minimax" | "fallback";
}

const JUDGE_FALLBACK_MINIMAX = (
  question: string,
): Omit<MiniMaxJudgeAnswerDraft, "engine"> => ({
  question,
  draft:
    "MiniMax API key not configured. The existing answer in " +
    "`project/strategy/judge-qa-kill-list.md` is the canonical response. " +
    "Set MINIMAX_API_KEY to enable on-the-fly draft generation.",
  citations: [],
  caveats: ["Fallback engaged; deterministic answer recommended for live Q&A."],
});

export async function draftJudgeAnswerMiniMax(args: {
  question: string;
  context?: string;
}): Promise<MiniMaxJudgeAnswerDraft> {
  if (!minimaxConfigured()) {
    return { ...JUDGE_FALLBACK_MINIMAX(args.question), engine: "fallback" };
  }
  const system =
    "You are Sam Peacock's Q&A partner for the Future Caribbean Buildathon judge panel. " +
    "Answer crisply (under 25 seconds spoken), honestly, no bluffing. " +
    "Return ONLY compact JSON: {draft (string, <120 words), citations (string[]), caveats (string[])}.";
  const user = `QUESTION: ${args.question}\n\nCONTEXT: ${args.context ?? "(none)"}`;
  const r = await callMiniMax({ system, user, maxTokens: 350 });
  if (!r.ok) return { ...JUDGE_FALLBACK_MINIMAX(args.question), engine: "fallback" };
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { ...JUDGE_FALLBACK_MINIMAX(args.question), engine: "fallback" };
  }
  try {
    const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Partial<MiniMaxJudgeAnswerDraft>;
    return {
      question: args.question,
      draft: typeof parsed.draft === "string" ? parsed.draft.slice(0, 1200) : JUDGE_FALLBACK_MINIMAX(args.question).draft,
      citations: Array.isArray(parsed.citations)
        ? parsed.citations.filter((s): s is string => typeof s === "string").slice(0, 10)
        : [],
      caveats: Array.isArray(parsed.caveats)
        ? parsed.caveats.filter((s): s is string => typeof s === "string").slice(0, 10)
        : [],
      engine: "minimax",
    };
  } catch {
    return { ...JUDGE_FALLBACK_MINIMAX(args.question), engine: "fallback" };
  }
}

// Dual-LLM fallback chain: try Giotto first, then MiniMax, then the
// deterministic fallback. Returns whichever path produced output, with
// `engine` reflecting the actual source. This is the strongest tech-
// depth move in the partners brainstorm: dual-LLM redundancy.
export async function callWithFallback(args: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<{ ok: boolean; text: string; engine: "giotto" | "minimax" | "fallback"; error?: string }> {
  // Try Giotto first.
  const { callGiotto } = await import("./giotto");
  const giottoResult = await callGiotto({
    system: args.system,
    user: args.user,
    maxTokens: args.maxTokens,
  });
  if (giottoResult.ok) {
    return { ok: true, text: giottoResult.text, engine: "giotto" };
  }
  // Fallback to MiniMax.
  const minimaxResult = await callMiniMax({
    system: args.system,
    user: args.user,
    maxTokens: args.maxTokens,
  });
  if (minimaxResult.ok) {
    return { ok: true, text: minimaxResult.text, engine: "minimax" };
  }
  // Both failed → fallback.
  return {
    ok: false,
    text: "",
    engine: "fallback",
    error: giottoResult.error && minimaxResult.error
      ? `giotto: ${giottoResult.error}; minimax: ${minimaxResult.error}`
      : giottoResult.error ?? minimaxResult.error,
  };
}