// Server-only LLM gateway helper. In a Shogo pod the runtime token authenticates
// the OpenAI-compatible gateway at $0 cost. Called directly with fetch to avoid
// AI-SDK provider spec-version coupling. Used ONLY by the research-assist path to
// propose what to verify and structure notes — never to assert law.

// Provider resolution order (all OpenAI-compatible /chat/completions):
//   1. Local edge (Ollama)         — USE_LOCAL_EDGE=1 + OLLAMA_BASE_URL
//   2. Giotto                      — GIOTTO_API_KEY set AND not placeholder
//   3. MiniMax primary             — USE_MINIMAX=1 + MINIMAX_API_KEY set
//   4. OpenRouter (free models)    — OPENROUTER_API_KEY set AND not placeholder
//   5. Gemini (free tier)          — GEMINI_API_KEY set AND not placeholder
//   6. Impala gateway              — IMPALA_API_KEY set
//   7. Shogo pod gateway (default) — RUNTIME_AUTH_SECRET, $0 in-pod
//   8. Deterministic fallback      — always available (text assembled locally)
//
// The local edge tier is reached first ONLY when USE_LOCAL_EDGE=1 AND the
// Ollama daemon is running (probe is cheap; failure → next tier). It is
// documented in `src/lib/local-edge-llm.ts` + `project/research/edge-llm-research.md`.
import {
  chatCompletion as localEdgeChatCompletion,
  localEdgeConfigured as localEdgeConfiguredFn,
} from "./local-edge-llm.ts";
import { giottoConfigured, callGiotto } from "./giotto.ts";
import { minimaxConfigured, callMiniMax } from "./minimax.ts";
import {
  openrouterConfigured,
  chatCompletion as openrouterChatCompletion,
  probeOpenRouter,
} from "./openrouter.ts";
import {
  geminiConfigured,
  chatCompletion as geminiChatCompletion,
  probeGemini,
} from "./gemini.ts";

interface Provider {
  name: string;
  url: string;
  token: string;
  model: string;
}

const PROVIDER_ORDER: string[] = [
  "local-edge",
  "giotto",
  "minimax",
  "openrouter",
  "gemini",
  "impala",
  "shogo",
];

interface ChainCandidate {
  name: string;
  configured: boolean;
  reason?: string;
}

// Pure resolution of which providers are eligible (no network probes). Used
// by `availableProviderChains()` and tests.
function eligibilityChain(): ChainCandidate[] {
  return [
    {
      name: "local-edge",
      configured: !!localEdgeConfiguredFn() && process.env.USE_LOCAL_EDGE === "1",
      reason: process.env.USE_LOCAL_EDGE === "1" ? undefined : "USE_LOCAL_EDGE!=1",
    },
    {
      name: "giotto",
      configured: giottoConfigured(),
      reason: giottoConfigured() ? undefined : "GIOTTO_API_KEY placeholder/missing",
    },
    {
      name: "minimax",
      configured:
        !!process.env.USE_MINIMAX &&
        process.env.USE_MINIMAX !== "0" &&
        minimaxConfigured(),
      reason:
        process.env.USE_MINIMAX === "1" && minimaxConfigured()
          ? undefined
          : "USE_MINIMAX!=1 or MINIMAX_API_KEY placeholder",
    },
    {
      name: "openrouter",
      configured: openrouterConfigured(),
      reason: openrouterConfigured() ? undefined : "OPENROUTER_API_KEY placeholder/missing",
    },
    {
      name: "gemini",
      configured: geminiConfigured(),
      reason: geminiConfigured() ? undefined : "GEMINI_API_KEY placeholder/missing",
    },
    {
      name: "impala",
      configured: !!process.env.IMPALA_API_KEY && process.env.IMPALA_API_KEY.trim() !== "",
      reason: process.env.IMPALA_API_KEY ? undefined : "IMPALA_API_KEY missing",
    },
    {
      name: "shogo",
      configured: !!process.env.RUNTIME_AUTH_SECRET && process.env.RUNTIME_AUTH_SECRET.trim() !== "",
      reason: process.env.RUNTIME_AUTH_SECRET ? undefined : "RUNTIME_AUTH_SECRET missing",
    },
  ];
}

function buildHttpProvider(): Provider | null {
  if (process.env.IMPALA_API_KEY) {
    const base = (process.env.IMPALA_BASE_URL ?? "https://ht.getimpala.ai/v1").replace(/\/$/, "");
    return {
      name: "impala",
      url: `${base}/chat/completions`,
      token: process.env.IMPALA_API_KEY,
      model: process.env.IMPALA_MODEL ?? "qwen3.6-27b",
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
  const chain = eligibilityChain();
  if (chain.some((c) => c.configured)) return true;
  return buildHttpProvider() !== null;
}

/** Active LLM tier — useful for the audit ledger. Returns the configured
 *  chain in priority order (without network probes); the first one wins. */
export function activeProvider(): string {
  const chain = eligibilityChain();
  const winner = chain.find((c) => c.configured);
  if (winner) return winner.name;
  return buildHttpProvider()?.name ?? "fallback";
}

/** Full ordered chain of candidates (configured or not). Useful for tests
 *  + ops dashboards. */
export function availableProviderChains(): ChainCandidate[] {
  return eligibilityChain();
}

/** List of provider names in the canonical priority order. */
export function providerOrder(): string[] {
  return [...PROVIDER_ORDER];
}

/**
 * Phase 12 G8 — log the active LLM tier on every call.
 * This is the runtime proof (in the audit log) that the privacy-by-default
 * path is engaged. Judges can read it; operators can verify it; the
 * `FL_TELEMETRY=1` ring buffer preserves it.
 *
 * Format: `[llm-tier] tier=<name> use_local_edge=<bool>`
 */
function logActiveTier(context: string): void {
  const tier = activeProvider();
  const useLocalEdge = process.env.USE_LOCAL_EDGE === "1";
  const line = `[llm-tier] context=${context} tier=${tier} use_local_edge=${useLocalEdge} time=${new Date().toISOString()}`;
  if (process.env.FL_TELEMETRY === "1") {
    console.log(JSON.stringify({ llm_tier_log: line }));
  } else {
    console.log(line);
  }
}

export interface AssistResult {
  ok: boolean;
  model: string;
  candidate?: unknown;
  raw?: string;
  error?: string;
}

interface TierAttempt {
  name: string;
  ok: boolean;
  latencyMs?: number;
  error?: string;
  text?: string;
}

// Run a callback (returns {ok,text}|{ok:false,error}) through the new chain
// in priority order. Probes are honoured for tiers that require them.
async function runChain(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number,
): Promise<{ ok: boolean; model: string; text?: string; raw?: string; error?: string; attemptLog: TierAttempt[] }> {
  const attemptLog: TierAttempt[] = [];
  const messages = systemPrompt
    ? [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
      ]
    : [{ role: "user" as const, content: userPrompt }];

  // Tier 1 — Local edge.
  if (localEdgeConfiguredFn() && process.env.USE_LOCAL_EDGE === "1") {
    const t0 = Date.now();
    try {
      const le = await localEdgeChatCompletion({
        system: systemPrompt || undefined,
        user: userPrompt,
        maxTokens,
        temperature,
      });
      const latencyMs = Date.now() - t0;
      if (le.ok && typeof le.text === "string" && le.text.length > 0) {
        attemptLog.push({ name: "local-edge", ok: true, latencyMs });
        return { ok: true, model: `local-edge:${le.model ?? "?"}`, text: le.text, attemptLog };
      }
      attemptLog.push({ name: "local-edge", ok: false, latencyMs, error: le.error ?? "empty response" });
    } catch (e) {
      attemptLog.push({ name: "local-edge", ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  } else if (process.env.USE_LOCAL_EDGE === "1") {
    attemptLog.push({ name: "local-edge", ok: false, error: "Ollama daemon not reachable" });
  }

  // Tier 2 — Giotto.
  if (giottoConfigured()) {
    const t0 = Date.now();
    try {
      const r = await callGiotto({ system: systemPrompt, user: userPrompt, maxTokens, temperature });
      const latencyMs = Date.now() - t0;
      if (r.ok && r.text) {
        attemptLog.push({ name: "giotto", ok: true, latencyMs });
        return { ok: true, model: "giotto", text: r.text, attemptLog };
      }
      attemptLog.push({ name: "giotto", ok: false, latencyMs, error: r.error });
    } catch (e) {
      attemptLog.push({ name: "giotto", ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Tier 3 — MiniMax primary.
  if (process.env.USE_MINIMAX === "1" && minimaxConfigured()) {
    const t0 = Date.now();
    try {
      const r = await callMiniMax({ system: systemPrompt, user: userPrompt, maxTokens, temperature });
      const latencyMs = Date.now() - t0;
      if (r.ok && r.text) {
        attemptLog.push({ name: "minimax", ok: true, latencyMs });
        return { ok: true, model: "minimax", text: r.text, attemptLog };
      }
      attemptLog.push({ name: "minimax", ok: false, latencyMs, error: r.error });
    } catch (e) {
      attemptLog.push({ name: "minimax", ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Tier 4 — OpenRouter (free).
  if (openrouterConfigured()) {
    const t0 = Date.now();
    try {
      const probe = await probeOpenRouter();
      if (probe.available) {
        const r = await openrouterChatCompletion(messages, { maxTokens, temperature, timeoutMs: 20_000 });
        const latencyMs = Date.now() - t0;
        if (!r.error && r.choices?.[0]?.message?.content) {
          attemptLog.push({ name: "openrouter", ok: true, latencyMs, text: r.choices[0].message.content });
          return { ok: true, model: `openrouter:${r.model ?? probe.model ?? "?"}`, text: r.choices[0].message.content, raw: JSON.stringify(r), attemptLog };
        }
        attemptLog.push({ name: "openrouter", ok: false, latencyMs, error: r.error?.message ?? "empty response" });
      } else {
        attemptLog.push({ name: "openrouter", ok: false, latencyMs: Date.now() - t0, error: probe.error });
      }
    } catch (e) {
      attemptLog.push({ name: "openrouter", ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Tier 5 — Gemini (free tier).
  if (geminiConfigured()) {
    const t0 = Date.now();
    try {
      const probe = await probeGemini();
      if (probe.available) {
        const r = await geminiChatCompletion(messages, { maxTokens, temperature, timeoutMs: 20_000 });
        const latencyMs = Date.now() - t0;
        if (!r.error && r.choices?.[0]?.message?.content) {
          attemptLog.push({ name: "gemini", ok: true, latencyMs, text: r.choices[0].message.content });
          return { ok: true, model: `gemini:${r.model ?? probe.model ?? "?"}`, text: r.choices[0].message.content, raw: JSON.stringify(r), attemptLog };
        }
        attemptLog.push({ name: "gemini", ok: false, latencyMs, error: r.error?.message ?? "empty response" });
      } else {
        attemptLog.push({ name: "gemini", ok: false, latencyMs: Date.now() - t0, error: probe.error });
      }
    } catch (e) {
      attemptLog.push({ name: "gemini", ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Tier 6/7 — legacy HTTP providers (Impala / Shogo pod) for backward compat.
  const http = buildHttpProvider();
  if (http) {
    const t0 = Date.now();
    try {
      const res = await fetch(http.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${http.token}` },
        body: JSON.stringify({ model: http.model, temperature, max_tokens: maxTokens, messages }),
      });
      const latencyMs = Date.now() - t0;
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { choices?: Array<{ message?: { content?: string } }> };
        const text = data.choices?.[0]?.message?.content ?? "";
        if (text) {
          attemptLog.push({ name: http.name, ok: true, latencyMs, text });
          return { ok: true, model: http.model, text, attemptLog };
        }
        attemptLog.push({ name: http.name, ok: false, latencyMs, error: "empty response" });
      } else {
        const body = await res.text().catch(() => "");
        attemptLog.push({ name: http.name, ok: false, latencyMs, error: `HTTP ${res.status}: ${body.slice(0, 200)}` });
      }
    } catch (e) {
      attemptLog.push({ name: http.name, ok: false, latencyMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Tier 8 — Deterministic fallback (always available). Returns a clearly
  // labelled stub so callers can detect the path.
  const stub = DETERMINISTIC_FALLBACK_PREFIX + JSON.stringify({ systemPrompt, userPrompt }).slice(0, 500);
  attemptLog.push({ name: "fallback", ok: true });
  return { ok: false, model: "fallback", text: stub, error: "no LLM provider available; deterministic fallback engaged", attemptLog };
}

const DETERMINISTIC_FALLBACK_PREFIX =
  "[fallback] No LLM provider available. Deterministic stub. Set USE_LOCAL_EDGE=1, GIOTTO_API_KEY, USE_MINIMAX=1+MINIMAX_API_KEY, OPENROUTER_API_KEY, GEMINI_API_KEY, IMPALA_API_KEY, or run in a Shogo pod (RUNTIME_AUTH_SECRET). ";

export async function assistJurisdictionResearch(code: string, name: string): Promise<AssistResult> {
  logActiveTier("assistJurisdictionResearch");
  const system = `You draft JSON research plans for a Caribbean resident-advocacy platform (jurisdiction ${code}). Stay within the citation allow-list.`;
  const user = `For the jurisdiction "${name}" (code ${code}), produce a JSON research plan. Do NOT invent statute names, citations, or URLs. Only propose WHAT to look for and WHICH TYPE of official source to check. Everything you return is an unverified candidate a human must confirm against the original. Return ONLY minified JSON of shape: {"tenureSystemHypothesis":string,"itemsToSource":[{"category":string,"whatToFind":string,"officialSourceType":string,"riskIfMissing":string}],"maintenanceNote":string}. Categories must cover: land registration statute, strata/condominium statute, landlord-tenant/service-charge statute, building/fire-safety code, beneficial-ownership registry, data-protection basis.`;
  const r = await runChain(system, user, 900, 0.2);
  if (!r.ok || !r.text) {
    return { ok: r.ok, model: r.model, error: r.error, raw: r.text };
  }
  const jsonStart = r.text.indexOf("{");
  const jsonEnd = r.text.lastIndexOf("}");
  const slice = jsonStart >= 0 && jsonEnd > jsonStart ? r.text.slice(jsonStart, jsonEnd + 1) : r.text;
  let candidate: unknown = null;
  try {
    candidate = JSON.parse(slice);
  } catch {
    candidate = null;
  }
  return { ok: r.ok, model: r.model, candidate, raw: candidate ? undefined : r.text };
}

export interface ChatResult {
  ok: boolean;
  model: string;
  text?: string;
  error?: string;
}

// Generic OpenAI-compatible completion over the chain. Never used to assert
// law or property facts.
export async function chatComplete(
  prompt: string,
  opts: { system?: string; temperature?: number; maxTokens?: number } = {},
): Promise<ChatResult> {
  logActiveTier("chatComplete");
  const r = await runChain(opts.system ?? "", prompt, opts.maxTokens ?? 700, opts.temperature ?? 0.7);
  return { ok: r.ok, model: r.model, text: r.text, error: r.error };
}
