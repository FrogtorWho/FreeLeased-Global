// OpenRouter shared TS wrapper — mirrors src/lib/minimax.ts shape exactly.
//
// OpenRouter (https://openrouter.ai/) is a multi-provider LLM gateway that
// speaks OpenAI-compatible /chat/completions. Free models available
// (e.g. `meta-llama/llama-3.3-70b-instruct:free`). This wrapper is the
// single source of truth for every OpenRouter call across the project.
//
// Surface (identical to minimax.ts):
//   - `openrouterConfigured()` — env-guard
//   - `callOpenRouter()` — thin fetch against the OpenAI-compatible endpoint
//   - `chatCompletion()` — returns an OpenAI-shaped response object
//   - `probeOpenRouter()` — fast health probe (latency / error)
//   - `getOpenRouterClientOrNone()` — null if key is the placeholder
//
// **Fallback contract:** When `OPENROUTER_API_KEY` is unset or the
// placeholder value, every helper returns a deterministic stub. The shape
// of the returned object is identical with or without the key, so the
// runtime never branches on which path ran.
//
// No new dependencies. Uses native `fetch` + `AbortSignal.timeout`.
// No edits to `src/generated/*`, `server.tsx`, `bun.lock`.

export const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export const DEFAULT_OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_PLACEHOLDER = "your_openrouter_api_key_here";

// OpenAI-compatible message shape
export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterCallOptions {
  messages: OpenRouterMessage[];
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}

// OpenAI-shaped response object (subset)
export interface OpenRouterChatResponse {
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

export interface OpenRouterProbeResult {
  available: boolean;
  latencyMs?: number;
  model?: string;
  error?: string;
}

// Env-guard, mirrors src/lib/minimax.ts:minimaxConfigured()
export function openrouterConfigured(): boolean {
  const key = process.env.OPENROUTER_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === OPENROUTER_PLACEHOLDER) return false;
  return true;
}

export function getOpenRouterClientOrNone(): {
  apiKey: string;
  baseUrl: string;
  model: string;
} | null {
  if (!openrouterConfigured()) return null;
  return {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseUrl: (process.env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL).replace(/\/$/, ""),
    model: process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL,
  };
}

// Standard OpenAI-shaped chat completion call.
export async function chatCompletion(
  messages: OpenRouterMessage[],
  opts: Omit<OpenRouterCallOptions, "messages"> = {},
): Promise<OpenRouterChatResponse> {
  const client = getOpenRouterClientOrNone();
  const model = opts.model ?? client?.model ?? DEFAULT_OPENROUTER_MODEL;
  if (!client) {
    return {
      model,
      choices: [],
      error: { message: "OPENROUTER_API_KEY not configured", type: "config" },
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
        "HTTP-Referer": "https://freeleased.local",
        "X-Title": "FreeLeased",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: opts.maxTokens ?? 800,
        temperature: opts.temperature ?? 0.2,
      }),
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => ({}))) as OpenRouterChatResponse;
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
export interface OpenRouterCallResult {
  ok: boolean;
  source: "openrouter" | "fallback";
  text: string;
  raw?: unknown;
  error?: string;
}

export async function callOpenRouter(
  systemMessage: string,
  userMessage: string,
  opts: { model?: string; maxTokens?: number; timeoutMs?: number; temperature?: number } = {},
): Promise<OpenRouterCallResult> {
  if (!openrouterConfigured()) {
    return { ok: false, source: "fallback", text: "", error: "OPENROUTER_API_KEY not configured" };
  }
  const r = await chatCompletion(
    [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    opts,
  );
  if (r.error) {
    return { ok: false, source: "openrouter", text: "", error: r.error.message, raw: r };
  }
  const text = r.choices?.[0]?.message?.content ?? "";
  return { ok: true, source: "openrouter", text, raw: r };
}

// Fast probe — used by the chain for tier selection. Returns availability +
// measured latency without surfacing the full response.
export async function probeOpenRouter(): Promise<OpenRouterProbeResult> {
  const client = getOpenRouterClientOrNone();
  if (!client) {
    return { available: false, error: "OPENROUTER_API_KEY not configured (placeholder or unset)" };
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
