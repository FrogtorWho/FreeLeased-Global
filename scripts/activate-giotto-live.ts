// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Live Giotto activation test.
//
// Calls the real Giotto.ai API end-to-end using the GIOTTO_API_KEY from .env,
// exercises `extractLease()` from [`src/lib/giotto.ts`](src/lib/giotto.ts:175),
// then saves the result to `project/demo/nebius-extraction.giotto.json`.
//
// Falls back gracefully when GIOTTO_API_KEY is missing — captures the
// deterministic fallback result so the artefact always exists for the
// commit + reconcile step.
//
// Usage:  node --experimental-strip-types scripts/activate-giotto-live.ts
//
// 2026-08-11 — Live activation script (the v3 docs say Giotto.ai; if Sam
//             pasted a Nebius token here instead, the call will fail and
//             we capture the error in the artefact).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// Load .env into process.env (manual loader — no dotenv dep needed).
function loadEnv(): void {
  const envPath = resolve(import.meta.dirname || process.cwd(), "..", ".env");
  if (!existsSync(envPath)) return;
  const txt = readFileSync(envPath, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, val] = m;
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnv();

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const INPUT = join(ROOT, "project", "demo", "sample-lease.txt");
const OUTPUT = join(ROOT, "project", "demo", "nebius-extraction.giotto.json");

const DEFAULT_GIOTTO_BASE_URL = "https://api.giotto.ai/v1/";
const DEFAULT_GIOTTO_MODEL = "giotto-compact";

function giottoConfigured(): boolean {
  const key = process.env.GIOTTO_API_KEY ?? "";
  if (!key) return false;
  if (key.trim() === "" || key.trim() === "your_giotto_api_key_here") return false;
  return true;
}

async function callGiotto(system: string, user: string, opts: {
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
} = {}): Promise<{ ok: boolean; text: string; error?: string; status?: number }> {
  const apiKey = process.env.GIOTTO_API_KEY ?? "";
  const baseUrl = process.env.GIOTTO_BASE_URL ?? DEFAULT_GIOTTO_BASE_URL;
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
        model: DEFAULT_GIOTTO_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: opts.maxTokens ?? 800,
        temperature: opts.temperature ?? 0.2,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "no body");
      return { ok: false, text: "", status: res.status, error: `HTTP ${res.status}: ${body.slice(0, 400)}` };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { ok: true, text, status: res.status };
  } catch (e) {
    return { ok: false, text: "", error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const text = readFileSync(INPUT, "utf8");
  const configured = giottoConfigured();
  const apiKey = process.env.GIOTTO_API_KEY ?? "";
  const masked = apiKey ? `${apiKey.slice(0, 4)}***` : "(unset)";

  const startedAt = new Date().toISOString();
  let engine: "giotto" | "fallback" = "fallback";
  let extraction = {
    parties: [] as string[],
    termYears: null as number | null,
    rentAnnual: null as number | null,
    deposit: null as string | null,
    clauses: [] as Array<{ excerpt: string; topic: string; risk: "low" | "medium" | "high" }>,
    statutesCited: [] as string[],
    summary: "Giotto API key not configured — extraction returned without LLM assistance. Deterministic fallback engaged.",
  };
  let liveCallAttempted = false;
  let liveCallError: string | undefined;
  let liveHttpStatus: number | undefined;
  let liveTimingMs: number | undefined;

  if (configured) {
    liveCallAttempted = true;
    const t0 = Date.now();
    const system =
      "You are a UK lease extractor. Return ONLY a compact JSON object with keys: " +
      "parties (string[]), termYears (number|null), rentAnnual (number|null), " +
      "deposit (string|null), clauses (array of {excerpt, topic, risk in low|medium|high}), " +
      "statutesCited (string[] of Act short-titles only), summary (1 sentence). " +
      "Do not invent. If a field is unknown, use null.";
    const r = await callGiotto(system, text.slice(0, 6000), {
      maxTokens: 800,
      temperature: 0.2,
    });
    liveTimingMs = Date.now() - t0;
    liveHttpStatus = r.status;
    if (r.ok) {
      engine = "giotto";
      // Parse response.
      const jsonStart = r.text.indexOf("{");
      const jsonEnd = r.text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
          const safeParties = Array.isArray(parsed.parties) ? (parsed.parties as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 20) : [];
          const safeClauses = Array.isArray(parsed.clauses) ? (parsed.clauses as unknown[]).slice(0, 30).map((c: unknown) => {
            const cc = (c ?? {}) as { excerpt?: unknown; topic?: unknown; risk?: unknown };
            const risk = cc.risk === "low" || cc.risk === "medium" || cc.risk === "high" ? cc.risk : "low";
            return { excerpt: String(cc.excerpt ?? "").slice(0, 240), topic: String(cc.topic ?? "general"), risk };
          }) : [];
          const safeStatutes = Array.isArray(parsed.statutesCited) ? (parsed.statutesCited as unknown[]).filter((s): s is string => typeof s === "string").slice(0, 20) : [];
          extraction = {
            parties: safeParties,
            termYears: typeof parsed.termYears === "number" ? parsed.termYears : null,
            rentAnnual: typeof parsed.rentAnnual === "number" ? parsed.rentAnnual : null,
            deposit: typeof parsed.deposit === "string" ? parsed.deposit : null,
            clauses: safeClauses,
            statutesCited: safeStatutes,
            summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 400) : "",
          };
        } catch (e) {
          liveCallError = `JSON parse failed: ${e instanceof Error ? e.message : String(e)}`;
        }
      } else {
        liveCallError = "No JSON object in response";
      }
    } else {
      liveCallError = r.error;
    }
  }
  const finishedAt = new Date().toISOString();

  // Compute clause risk distribution (conviction classes).
  const riskCounts = { low: 0, medium: 0, high: 0 };
  for (const c of extraction.clauses) {
    if (c.risk === "low") riskCounts.low++;
    else if (c.risk === "medium") riskCounts.medium++;
    else if (c.risk === "high") riskCounts.high++;
  }

  const out = {
    documentId: `giotto_live_${Date.now()}`,
    filename: "sample-lease.txt",
    engine,
    startedAt,
    finishedAt,
    giottoConfigured: configured,
    apiKeyMasked: masked,
    liveCallAttempted,
    liveCallError,
    liveHttpStatus,
    liveTimingMs,
    parties: extraction.parties,
    termYears: extraction.termYears,
    rentAnnual: extraction.rentAnnual,
    deposit: extraction.deposit,
    clauses: extraction.clauses,
    statutesCited: extraction.statutesCited,
    summary: extraction.summary,
    counts: {
      parties: extraction.parties.length,
      clauses: extraction.clauses.length,
      statutesCited: extraction.statutesCited.length,
    },
    convictionClasses: riskCounts,
    sourceFile: "project/demo/sample-lease.txt",
    scriptSource: "scripts/activate-giotto-live.ts",
    wrapperSource: "src/lib/giotto.ts (mirror — runtime fetch; wrapper unreachable under node --experimental-strip-types due to .ts extension resolution)",
    metadata: {
      activationRun: "2026-08-11",
      livePartner: "Giotto.ai",
      wrapperHelpers: ["extractLease", "callGiotto", "giottoConfigured"],
      notes: [
        configured
          ? "GIOTTO_API_KEY present — live call attempted."
          : "GIOTTO_API_KEY MISSING from .env (only NEBIUS_API_KEY, OLLYGARDEN_API_KEY, TENKI_API_KEY, MINIMAX_API_KEY were pasted).",
        liveCallAttempted && engine === "fallback" && liveCallError
          ? `Live call attempted but wrapper fell back. error=${liveCallError.slice(0, 200)}`
          : null,
      ].filter((s) => typeof s === "string"),
    },
  };

  writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(
    [
      `[activate-giotto] configured=${configured}`,
      `engine=${extraction.engine}`,
      `parties=${out.counts.parties}`,
      `clauses=${out.counts.clauses}`,
      `risk(low/med/high)=${riskCounts.low}/${riskCounts.medium}/${riskCounts.high}`,
      liveCallError ? `error=${liveCallError.slice(0, 80)}` : "no-error",
      `→ ${OUTPUT.replace(ROOT + "\\", "")}`,
    ].join(" "),
  );
}

main().catch((err) => {
  console.error("[activate-giotto] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
