// Gemini shared TS wrapper — mirrors src/lib/minimax.ts shape exactly.
//
// Google Gemini (https://aistudio.google.com/) — free tier available
// (`gemini-2.0-flash-exp`). OpenAI-compatible endpoint at
// https://generativelanguage.googleapis.com/v1beta/openai/. This wrapper is
// the single source of truth for every Gemini call across the project.
//
// Surface (identical to minimax.ts):
//   - `geminiConfigured()` — env-guard
//   - `callGemini()` — thin fetch against the OpenAI-compatible endpoint
//   - `chatCompletion()` — returns an OpenAI-shaped response object
//   - `probeGemini()` — fast health probe (latency / error)
//   - `getGeminiClientOrNone()` — null if key is the placeholder
//
// **Fallback contract:** When `GEMINI_API_KEY` is unset or the placeholder
// value, every helper returns a deterministic stub. The shape of the
// returned object is identical with or without the key, so the runtime
// never branches on which path ran.
//
// No new dependencies. Uses native `fetch` + `AbortSignal.timeout`.
// No edits to `src/generated/*`, `server.tsx`, `bun.lock`.

export const DEFAULT_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash-exp";
const GEMINI_PLACEHOLDER = "your_gemini_api_key_here";

// OpenAI-compatible message shape
export interface GeminiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GeminiCallOptions {
  messages: GeminiMessage[];
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}

// OpenAI-shaped response object (subset)
export interface GeminiChatResponse {
  id?: string;
  model: string;
  choices: Array<{
    index?: number;
    message?: { role?: string; content?: string };
    finish_reason?: string;
  }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  error?: { message?: string; type?: string };
}

export interface GeminiProbeResult {
  available: boolean;
  latencyMs?: number;
  model?: string;
  error?: string;
}

// Env-guard, mirrors src/lib/minimax.ts:minimaxConfigured()
export function geminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === GEMINI_PLACEHOLDER) return false;
  return true;
}

export function getGeminiClientOrNone(): {
  apiKey: string;
  baseUrl: string;
  model: string;
} | null {
  if (!geminiConfigured()) return null;
  return {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    baseUrl: (process.env.GEMINI_BASE_URL ?? DEFAULT_GEMINI_BASE_URL).replace(/\/$/, ""),
    model: process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
  };
}

// Standard OpenAI-shaped chat completion call.
export async function chatCompletion(
  messages: GeminiMessage[],
  opts: Omit<GeminiCallOptions, "messages"> = {},
): Promise<GeminiChatResponse> {
  const client = getGeminiClientOrNone();
  const model = opts.model ?? client?.model ?? DEFAULT_GEMINI_MODEL;
  if (!client) {
    return {
      model,
      choices: [],
      error: { message: "GEMINI_API_KEY not configured", type: "config" },
    };
  }
  const controller = new AbortController();
  const timeout = opts.timeoutMs ?? 20_000;
  const t = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${client.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${client.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: opts.maxTokens ?? 800,
        temperature: opts.temperature ?? 0.2,
      }),
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => ({}))) as GeminiChatResponse;
    if (!res.ok) {
      return {
        model,
        choices: [],
        error: {
          message: `HTTP ${res.status}: ${json?.error?.message ?? "no body"}`,
          type: "http",
        },
      };
    }
    return json;
  } catch (e) {
    return {
      model,
      choices: [],
      error: { message: e instanceof Error ? e.message : String(e), type: "network" },
    };
  } finally {
    clearTimeout(t);
  }
}

// Thin call wrapping chatCompletion into a (text, ok, source) tuple — mirrors
// callMiniMax surface.
export interface GeminiCallResult {
  ok: boolean;
  source: "gemini" | "fallback";
  text: string;
  raw?: unknown;
  error?: string;
}

export async function callGemini(
  systemMessage: string,
  userMessage: string,
  opts: { model?: string; maxTokens?: number; timeoutMs?: number; temperature?: number } = {},
): Promise<GeminiCallResult> {
  if (!geminiConfigured()) {
    return { ok: false, source: "fallback", text: "", error: "GEMINI_API_KEY not configured" };
  }
  const r = await chatCompletion(
    [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    opts,
  );
  if (r.error) {
    return { ok: false, source: "gemini", text: "", error: r.error.message, raw: r };
  }
  const text = r.choices?.[0]?.message?.content ?? "";
  return { ok: true, source: "gemini", text, raw: r };
}

// Fast probe — used by the chain for tier selection. Returns availability +
// measured latency without surfacing the full response.
export async function probeGemini(): Promise<GeminiProbeResult> {
  const client = getGeminiClientOrNone();
  if (!client) {
    return { available: false, error: "GEMINI_API_KEY not configured (placeholder or unset)" };
  }
  const t0 = Date.now();
  try {
    const r = await chatCompletion(
      [{ role: "user", content: "ping" }],
      { maxTokens: 4, timeoutMs: 5_000, temperature: 0 },
    );
    const latencyMs = Date.now() - t0;
    if (r.error) {
      return { available: false, latencyMs, error: r.error.message, model: client.model };
    }
    return { available: true, latencyMs, model: client.model };
  } catch (e) {
    return { available: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e), model: client.model };
  }
}
