// Server-only LLM gateway helper. In a Shogo pod the runtime token authenticates
// the OpenAI-compatible gateway at $0 cost. Called directly with fetch to avoid
// AI-SDK provider spec-version coupling. Used ONLY by the research-assist path to
// propose what to verify and structure notes — never to assert law.

// Provider resolution order (all OpenAI-compatible /chat/completions):
//   1. Local edge (Ollama)         — USE_LOCAL_EDGE=1 + OLLAMA_BASE_URL  (NEW 2026-08-11)
//   2. Impala gateway              — IMPALA_API_KEY
//   3. MiniMax                     — USE_MINIMAX=1 + MINIMAX_API_KEY
//   4. Shogo pod gateway (default) — RUNTIME_AUTH_SECRET, $0 in-pod
// Keys are read from env only; never hardcode a secret here.
//
// The local edge tier is reached first ONLY when USE_LOCAL_EDGE=1 AND the
// Ollama daemon is running (probe is cheap; failure → next tier). It is
// documented in `src/lib/local-edge-llm.ts` + `project/research/edge-llm-research.md`.
import {
  chatCompletion as localEdgeChatCompletion,
  localEdgeConfigured as localEdgeConfiguredFn,
} from "./local-edge-llm.ts";

interface Provider {
  name: string;
  url: string;
  token: string;
  model: string;
}

function resolveProvider(): Provider | null {
  if (process.env.IMPALA_API_KEY) {
    const base = (process.env.IMPALA_BASE_URL ?? "https://ht.getimpala.ai/v1").replace(/\/$/, "");
    return {
      name: "impala",
      url: `${base}/chat/completions`,
      token: process.env.IMPALA_API_KEY,
      model: process.env.IMPALA_MODEL ?? "qwen3.6-27b",
    };
  }
  if (process.env.MINIMAX_API_KEY) {
    const base = (process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/v1").replace(/\/$/, "");
    return {
      name: "minimax",
      url: `${base}/chat/completions`,
      token: process.env.MINIMAX_API_KEY,
      model: process.env.MINIMAX_MODEL ?? "MiniMax-Text-01",
    };
  }
  if (process.env.RUNTIME_AUTH_SECRET) {
    const base = (process.env.SHOGO_CLOUD_URL ?? "https://studio.shogo.ai").replace(/\/$/, "");
    return {
      name: "shogo",
      url: `${base}/api/ai/v1/chat/completions`,
      token: process.env.RUNTIME_AUTH_SECRET,
      model: process.env.SHOGO_MODEL ?? "claude-haiku-4-5-20251001",
    };
  }
  return null;
}

export function llmAvailable(): boolean {
  if (localEdgeConfiguredFn()) return true;
  return resolveProvider() !== null;
}

export function activeProvider(): string {
  if (localEdgeConfiguredFn()) return "local-edge";
  return resolveProvider()?.name ?? "none";
}

export interface AssistResult {
  ok: boolean;
  model: string;
  candidate?: unknown;
  raw?: string;
  error?: string;
}

export async function assistJurisdictionResearch(code: string, name: string): Promise<AssistResult> {
  // Tier-1 — Local edge (Ollama). Crumpled-Bill guardrail is applied by the
  // wrapper. Failure here → fall through to the existing chain.
  if (localEdgeConfiguredFn()) {
    const le = await localEdgeChatCompletion({
      system: `You draft JSON research plans for a Caribbean resident-advocacy platform (jurisdiction ${code}). Stay within the citation allow-list.`,
      user: `For the jurisdiction "${name}" (code ${code}), produce a JSON research plan. Do NOT invent statute names, citations, or URLs. Only propose WHAT to look for and WHICH TYPE of official source to check. Everything you return is an unverified candidate a human must confirm against the original. Return ONLY minified JSON of shape: {"tenureSystemHypothesis":string,"itemsToSource":[{"category":string,"whatToFind":string,"officialSourceType":string,"riskIfMissing":string}],"maintenanceNote":string}. Categories must cover: land registration statute, strata/condominium statute, landlord-tenant/service-charge statute, building/fire-safety code, beneficial-ownership registry, data-protection basis.`,
      maxTokens: 900,
      temperature: 0.2,
    });
    if (le.ok && le.text) {
      const jsonStart = le.text.indexOf("{");
      const jsonEnd = le.text.lastIndexOf("}");
      const slice = jsonStart >= 0 && jsonEnd > jsonStart ? le.text.slice(jsonStart, jsonEnd + 1) : le.text;
      let candidate: unknown = null;
      try { candidate = JSON.parse(slice); } catch { candidate = null; }
      return { ok: true, model: `local-edge:${le.model ?? "?"}`, candidate, raw: candidate ? undefined : le.text };
    }
    // else fall through.
  }
  const provider = resolveProvider();
  if (!provider) return { ok: false, model: "none", error: "no LLM provider configured (set IMPALA_API_KEY, MINIMAX_API_KEY, or run in a Shogo pod)" };
  const { token, model } = provider;
  const prompt = `You are a legal-research planner for a Caribbean resident-advocacy platform.
For the jurisdiction "${name}" (code ${code}), produce a JSON research plan. Do NOT invent statute names, citations, or URLs. Only propose WHAT to look for and WHICH TYPE of official source to check. Everything you return is an unverified candidate a human must confirm against the original.
Return ONLY minified JSON of shape:
{"tenureSystemHypothesis":string,"itemsToSource":[{"category":string,"whatToFind":string,"officialSourceType":string,"riskIfMissing":string}],"maintenanceNote":string}
Categories must cover: land registration statute, strata/condominium statute, landlord-tenant/service-charge statute, building/fire-safety code, beneficial-ownership registry, data-protection basis.`;
  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ model, temperature: 0.2, max_tokens: 900, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, model, error: `${provider.name} gateway HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}` };
    }
    const data = await res.json().catch(() => ({}));
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const slice = jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : text;
    let candidate: unknown = null;
    try { candidate = JSON.parse(slice); } catch { candidate = null; }
    return { ok: true, model, candidate, raw: candidate ? undefined : text };
  } catch (e) {
    return { ok: false, model, error: (e as Error).message };
  }
}

export interface ChatResult {
  ok: boolean;
  model: string;
  text?: string;
  error?: string;
}

// Generic OpenAI-compatible completion over whichever provider is configured.
// Used by non-legal utilities (for example the social-post generator). Never
// used to assert law or property facts.
export async function chatComplete(
  prompt: string,
  opts: { system?: string; temperature?: number; maxTokens?: number } = {},
): Promise<ChatResult> {
  // Tier-1 — Local edge (Ollama). Crumpled-Bill guardrail is applied by the
  // wrapper. Failure here → fall through to the existing chain.
  if (localEdgeConfiguredFn()) {
    const le = await localEdgeChatCompletion({
      system: opts.system,
      user: prompt,
      maxTokens: opts.maxTokens ?? 700,
      temperature: opts.temperature ?? 0.7,
    });
    if (le.ok && typeof le.text === "string") {
      return { ok: true, model: `local-edge:${le.model ?? "?"}`, text: le.text };
    }
    // else fall through.
  }
  const provider = resolveProvider();
  if (!provider) return { ok: false, model: "none", error: "no LLM provider configured (set IMPALA_API_KEY, MINIMAX_API_KEY, or run in a Shogo pod)" };
  const { token, model } = provider;
  const messages = [
    ...(opts.system ? [{ role: "system", content: opts.system }] : []),
    { role: "user", content: prompt },
  ];
  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ model, temperature: opts.temperature ?? 0.7, max_tokens: opts.maxTokens ?? 700, messages }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, model, error: `${provider.name} gateway HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}` };
    }
    const data = await res.json().catch(() => ({}));
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    return { ok: true, model, text };
  } catch (e) {
    return { ok: false, model, error: (e as Error).message };
  }
}
