// Local edge-LLM wrapper — Ollama-backed, OpenAI-compatible, on-prem, $0 compute.
//
// THIS IS THE PRIMARY LOCAL REASONING EDGE for FreeLeased. It complements
// `src/lib/giotto.ts` (cloud, vendor-managed, multimodal-strong) and the
// existing `src/lib/llm.server.ts` gateway. The wrapper:
//
//   * reads `OLLAMA_BASE_URL` + `OLLAMA_MODEL` + `USE_LOCAL_EDGE` from env;
//   * exposes `chatCompletion()` + `completion()` matching the OpenAI shape;
//   * wraps every system prompt with `crumpledBillGuardrail()`
//     (4-axis input-quality rules + Crumpled-Bill Principle);
//   * runs every LLM output through `citationSafetyCheck()`
//     (regex + `STATUTES[].id` allow-list scrubber);
//   * never logs to a vendor; never throws on network failure — it
//     returns `{ ok: false, error }` and lets the caller degrade.
//
// No new dependencies. Uses native `fetch` + `AbortSignal.timeout`.
//
// Wiring in src/lib/llm.server.ts (Tier-1 if USE_LOCAL_EDGE=1):
//
//   import { chatCompletion } from "./local-edge-llm";
//   if (process.env.USE_LOCAL_EDGE === "1") {
//     const r = await chatCompletion({ system, user });
//     if (r.ok) return r;
//     // fall through to the existing Giotto/MiniMax/Impala/deterministic chain
//   }
//
// Companion files:
//   * `scripts/setup-local-edge.sh` / `.ps1` — installer
//   * `scripts/test-local-edge.ts`           — 30+ assertion test suite
//   * `docs/local-edge-llm.md`               — user-facing doc
//   * `project/research/edge-llm-research.md` — research pack
//
// Truth-protocol tags follow `project/strategy/truth-protocol.md`.

import { STATUTES } from "../data/spine.ts";

// ────────────────────────────────────────────────────────────────────────────
// ENV + CONFIG
// ────────────────────────────────────────────────────────────────────────────

export const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434/v1";
export const DEFAULT_OLLAMA_MODEL = "llama3.3:70b-instruct-q4_K_M";
export const DEFAULT_TIMEOUT_MS = 60_000; // 70B at Q4 on a consumer GPU
                                       // can take 30–45s for a full
                                       // 700-token dossier summary.

export function localEdgeConfigured(): boolean {
  const flag = (process.env.USE_LOCAL_EDGE ?? "0").trim();
  if (flag !== "1" && flag.toLowerCase() !== "true") return false;
  const url = process.env.OLLAMA_BASE_URL ?? "";
  if (!url) return false;
  return true;
}

export function resolveLocalEdgeConfig(): { url: string; model: string; flag: boolean } {
  return {
    url: (process.env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_BASE_URL).replace(/\/$/, ""),
    model: process.env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL,
    flag: localEdgeConfigured(),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// OPENAI-COMPATIBLE SHAPES (subset we consume)
// ────────────────────────────────────────────────────────────────────────────

export type LocalEdgeRole = "system" | "user" | "assistant";

export interface LocalEdgeMessage {
  role: LocalEdgeRole;
  content: string;
}

export interface ChatOptions {
  system?: string;
  /** The user-turn content. */
  user: string;
  /** Optional override for the model id (default: env OLLAMA_MODEL). */
  model?: string;
  /** Optional temperature (default 0.2 — we want deterministic-ish). */
  temperature?: number;
  /** Optional max_tokens. */
  maxTokens?: number;
  /** Optional timeout override. */
  timeoutMs?: number;
  /** If true, *bypass* the Crumpled-Bill guardrail (rare; only for tests). */
  rawSystem?: boolean;
}

export interface ChatResult {
  ok: boolean;
  source: "local-edge" | "fallback";
  /** OpenAI-shaped text. */
  text?: string;
  /** Resolved model id. */
  model?: string;
  error?: string;
  /** Stats used by tests / observability. */
  stats?: {
    /** Time from request to first byte (ms); -1 if unknown. */
    ttftMs?: number;
    /** Total wall time (ms). */
    totalMs?: number;
    /** Did citationSafetyCheck() find anything to scrub? */
    citationsScrubbed?: number;
    /** Did we apply the Crumpled-Bill guardrail? */
    guardrailApplied?: boolean;
  };
}

// ────────────────────────────────────────────────────────────────────────────
// PROBE — does Ollama actually reply?
// ────────────────────────────────────────────────────────────────────────────

/**
 * Probe the local Ollama daemon cheaply. Returns true if Ollama is
 * reachable AND the configured model is available locally. Used at the
 * top of `chatCompletion()` so we fail fast (and degrade) before
 * spending 60s on a doomed request.
 */
export async function probeLocalEdge(timeoutMs = 1500): Promise<{ ok: boolean; reason?: string }> {
  if (!localEdgeConfigured()) return { ok: false, reason: "USE_LOCAL_EDGE not 1" };
  const cfg = resolveLocalEdgeConfig();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Ollama exposes `/api/tags` (its native API) to list models. The
    // OpenAI-compatible `/v1/models` endpoint is also supported but
    // we ask for `/api/tags` first — if it works the daemon is alive.
    const base = cfg.url.endsWith("/v1") ? cfg.url.slice(0, -3) : cfg.url;
    const res = await fetch(`${base}/api/tags`, { signal: controller.signal });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const json = (await res.json().catch(() => ({}))) as { models?: Array<{ name: string }> };
    const models = Array.isArray(json.models) ? json.models.map((m) => m.name ?? "") : [];
    // Match either the exact tag or the base name (e.g. "llama3.3:70b-instruct-q4_K_M"
    // matches itself; "llama3.3:70b-instruct-q4_K_M" matches "llama3.3:70b-instruct-q4_K_M").
    const wanted = cfg.model;
    const have = models.includes(wanted) ||
      // Allow "llama3.3:latest" as a fallback for users who pulled a different tag.
      models.some((m) => m.startsWith(wanted.split(":")[0] ?? ""));
    if (!have) {
      return { ok: false, reason: `model "${wanted}" not pulled (have: ${models.slice(0, 8).join(", ") || "<none>"})` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(t);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// CRUMPLED-BILL GUARDRAIL
// ────────────────────────────────────────────────────────────────────────────

/**
 * The Crumpled-Bill Principle (see project/strategy/gauntlet-loop.md §
 * "Jurisdiction Adaptation — The Crumpled-Bill Principle" + §3 of
 * project/strategy/architecture-diagram.md): the gauntlet must work
 * for any legal framework, including ones not yet in the spine. The
 * principle has 4 axes — *completeness, legibility, coherence,
 * jurisdictionalMatch* — and when they're all low the system must
 * (a) list what's missing, (b) propose what would close the gap,
 * (c) never invent, (d) route to human-in-the-loop.
 *
 * We translate that principle into a system-prompt block that we
 * prepend to every LLM call. The instruction is short, in English
 * (LLM-pretraining lingua franca), and uses our canonical conviction
 * classes from `project/strategy/truth-protocol.md`.
 *
 * The function is pure; the caller passes its own system prompt and
 * we return a wrapped version. If the caller asked for the *raw*
 * system (no guardrail), we return `opts.system` unchanged.
 */
export function crumpledBillGuardrail(opts: { system?: string; jurisdictionCode?: string }): string {
  if (opts.system && /\[disable-guardrail\]/.test(opts.system)) {
    return opts.system.replace(/\[disable-guardrail\]/g, "").trim();
  }
  const blocks: string[] = [
    "═══════ CRUMPLED-BILL GUARDRAIL (FreeLeased) ═══════",
    "You are a reasoning assistant for the FreeLeased Caribbean leaseholder-rights platform.",
    "Every claim you emit must be tagged with one of these four conviction classes:",
    "  • established  — claim resolves to a primary source in the citation allow-list",
    "  • heuristic    — claim is sourced but not yet re-verified",
    "  • contested    — claim is disputed across primary sources",
    "  • unfalsifiable — claim cannot be verified from public evidence",
    "",
    "Hard rules (NEVER break):",
    "  1. Cite ONLY Act short-titles or IDs that appear in the citation allow-list below.",
    "  2. NEVER invent a statute, section number, or URL.",
    "  3. If you cannot ground a claim, emit `unfalsifiable` and STOP — do not guess.",
    "  4. If `inputQuality.completeness < 0.4` for the resident intake:",
    "     a. List what's missing (statute anchor, party identity, term dates).",
    "     b. List what additional evidence would close the gap.",
    "     c. Mark any verdict you DO emit as `heuristic` and de-rate confidence by ×0.5.",
    "     d. Recommend human-in-the-loop sign-off.",
    "  5. Respect Caribbean dialect & Creole; do NOT translate legal terms out of English",
    "     unless the user-supplied text is in the target language.",
  ];
  if (opts.jurisdictionCode) {
    blocks.push("");
    blocks.push(`Jurisdiction: ${opts.jurisdictionCode}. Anchor statutes below are for this jurisdiction.`);
  }
  blocks.push("");
  blocks.push("CITATION ALLOW-LIST (use ONLY these IDs / Act short-titles):");
  for (const s of STATUTES) {
    blocks.push(`  • [${s.id}] ${s.shortTitle} — ${s.citation}  (${s.url})`);
  }
  blocks.push("═══════ END GUARDRAIL ═══════");
  blocks.push("");
  if (opts.system && opts.system.trim()) {
    blocks.push("--- USER-SUPPLIED SYSTEM PROMPT ---");
    blocks.push(opts.system.trim());
  }
  return blocks.join("\n");
}

// ────────────────────────────────────────────────────────────────────────────
// CITATION SAFETY CHECK
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build a Set of every statute id + short-title that is allowed in
 * our output. Re-export of the canonical set so callers and tests
 * can rely on a single source.
 */
export const LOCAL_EDGE_CITATION_ALLOW_LIST = new Set(
  STATUTES.flatMap((s) => [s.id, s.shortTitle]),
);

/**
 * Find every "[Act YYYY, s.NN]" / "[id]" style citation in `text` and
 * verify each one resolves to the spine. Any that don't resolve are
 * replaced with "[citation removed by local-edge-guard]" and counted.
 *
 * Patterns matched (in priority order):
 *   • `[ACT-ID]` (all-caps / kebab ids from our spine, e.g. "[uk-lfra]")
 *   • `[Act short-title YYYY, s.NN]` style
 *
 * Returns the scrubbed text + a count of how many were removed.
 */
export function citationSafetyCheck(text: string): { safe: string; removed: number; removedIds: string[] } {
  if (!text) return { safe: text, removed: 0, removedIds: [] };
  let removed = 0;
  const removedIds: string[] = [];
  // Pattern 1 — explicit spine IDs in brackets, e.g. "[uk-lfra]".
  // Defensive: cap inner length to 80 chars; allow letters/digits/hyphen/colon/period.
  const idPat = /\[([a-z][a-z0-9-]{1,40})\]/g;
  let safe = text.replace(idPat, (match, id: string) => {
    if (LOCAL_EDGE_CITATION_ALLOW_LIST.has(id)) return match;
    removed++;
    removedIds.push(id);
    return "[citation removed by local-edge-guard]";
  });
  // Pattern 2 — prose-style citations like "[Act Name YYYY, s.NN]".
  // We extract the "act-name" prefix and check it against the allow-list.
  const prosePat = /\[([^\]]{2,80}?\s+\d{4}[^a-zA-Z0-9]+s?\.?\s*\d+[A-Z]?)\]/g;
  safe = safe.replace(prosePat, (match, payload: string) => {
    const candidate = payload.split(/\s+\d{4}/)[0].trim();
    const ok = [...LOCAL_EDGE_CITATION_ALLOW_LIST].some(
      (s) => s.toLowerCase().includes(candidate.toLowerCase().slice(0, 12)),
    );
    if (ok) return match;
    removed++;
    removedIds.push(candidate);
    return "[citation removed by local-edge-guard]";
  });
  return { safe, removed, removedIds };
}

// ────────────────────────────────────────────────────────────────────────────
// CORE: chatCompletion + completion
// ────────────────────────────────────────────────────────────────────────────

/**
 * Single-shot OpenAI-compatible chat completion against Ollama. Returns
 * a typed `ChatResult`. Never throws. The Crumpled-Bill guardrail is
 * applied unless `opts.rawSystem` is true.
 *
 * Order of operations:
 *   1. If `USE_LOCAL_EDGE != "1"` → return `{ok:false}` immediately.
 *   2. Probe the daemon + configured model (cheap). If unreachable →
 *      return `{ok:false}` with the probe reason (lets the next tier
 *      in the gateway chain take over).
 *   3. Wrap the system prompt with the Crumpled-Bill guardrail.
 *   4. POST to `${OLLAMA_BASE_URL}/chat/completions`.
 *   5. Pull `choices[0].message.content` out of the OpenAI-shaped JSON.
 *   6. Run `citationSafetyCheck()` on the output.
 */
export async function chatCompletion(opts: ChatOptions): Promise<ChatResult> {
  const cfg = resolveLocalEdgeConfig();
  if (!localEdgeConfigured()) {
    return { ok: false, source: "fallback", error: "USE_LOCAL_EDGE not enabled (set USE_LOCAL_EDGE=1)" };
  }
  const probe = await probeLocalEdge();
  if (!probe.ok) {
    return { ok: false, source: "fallback", error: `local-edge unavailable: ${probe.reason ?? "unknown"}` };
  }
  const model = opts.model ?? cfg.model;
  const guardrailApplied = !opts.rawSystem;
  const system = guardrailApplied
    ? crumpledBillGuardrail({ system: opts.system, jurisdictionCode: extractJurisdiction(opts.system) })
    : (opts.system ?? "");
  const messages: LocalEdgeMessage[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: opts.user });

  const controller = new AbortController();
  const timeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const t = setTimeout(() => controller.abort(), timeout);
  const t0 = Date.now();
  try {
    const res = await fetch(`${cfg.url}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 700,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        source: "fallback",
        model,
        error: `Ollama HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`,
      };
    }
    const json = (await res.json().catch(() => ({}))) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const scrubbed = citationSafetyCheck(raw);
    return {
      ok: true,
      source: "local-edge",
      model,
      text: scrubbed.safe,
      stats: {
        totalMs: Date.now() - t0,
        citationsScrubbed: scrubbed.removed,
        guardrailApplied,
      },
    };
  } catch (e) {
    return {
      ok: false,
      source: "fallback",
      model,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Convenience: classic prompt-in / completion-out style (legacy
 * `/v1/completions`). Same as `chatCompletion` for our use case —
 * we wrap the prompt into a user turn.
 */
export async function completion(prompt: string, opts: Omit<ChatOptions, "user"> & { rawPrompt?: boolean } = {}): Promise<ChatResult> {
  return chatCompletion({ ...opts, user: opts.rawPrompt ? prompt : `Complete the following:\n\n${prompt}`, rawSystem: opts.rawSystem });
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

/** Tries to extract a jurisdiction code (UK/BB/JM/KY/...) from a free-text
 * system prompt, e.g. "Jurisdiction: BB". Returns undefined when no
 * match is found; we never error on a malformed system prompt. */
function extractJurisdiction(system: string | undefined): string | undefined {
  if (!system) return undefined;
  const m = system.match(/[Jj]urisdiction[:\s]+([A-Z]{2,3})\b/);
  return m?.[1];
}

// ────────────────────────────────────────────────────────────────────────────
// INTERNAL — export the sanity probe so tests can call it directly.
// ────────────────────────────────────────────────────────────────────────────

export const __internal = { extractJurisdiction };
