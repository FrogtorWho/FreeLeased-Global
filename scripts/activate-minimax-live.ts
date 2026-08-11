// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Live MiniMax activation test.
//
// Calls the real MiniMax API end-to-end using the MINIMAX_API_KEY from .env,
// exercises `callMiniMax()` with a tiny test prompt ("hello from FreeLeased"),
// and writes the transcript to `memory/2026-08-11-minimax-test.json`.
//
// Falls back gracefully when MINIMAX_API_KEY is missing — captures the
// fallback error so the artefact always exists.
//
// Usage:  node --experimental-strip-types scripts/activate-minimax-live.ts

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

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

import {
  callMiniMax,
  minimaxConfigured,
} from "../src/lib/minimax.ts";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const OUTDIR = join(ROOT, "memory");
const OUTPUT = join(OUTDIR, "2026-08-11-minimax-test.json");

async function main() {
  const configured = minimaxConfigured();
  const apiKey = process.env.MINIMAX_API_KEY ?? "";
  const masked = apiKey ? `${apiKey.slice(0, 4)}***` : "(unset)";

  const startedAt = new Date().toISOString();
  const request = {
    prompt: "hello from FreeLeased",
    system:
      "You are a tiny on-call assistant for the FreeLeased buildathon. " +
      "Reply in ONE sentence (under 30 words). Be brief and friendly.",
    maxTokens: 100,
    temperature: 0.3,
  };

  let response;
  let liveCallError: string | undefined;
  let networkTimingMs: number | undefined;

  if (configured) {
    const t0 = Date.now();
    try {
      response = await callMiniMax({
        system: request.system,
        user: request.prompt,
        maxTokens: request.maxTokens,
        temperature: request.temperature,
      });
    } catch (e) {
      liveCallError = e instanceof Error ? e.message : String(e);
    }
    networkTimingMs = Date.now() - t0;
  } else {
    response = {
      ok: false,
      source: "fallback" as const,
      text: "",
      error: "MINIMAX_API_KEY not configured",
    };
  }
  const finishedAt = new Date().toISOString();

  const out = {
    documentId: `minimax_live_${Date.now()}`,
    startedAt,
    finishedAt,
    miniconfigured: configured,
    apiKeyMasked: masked,
    request,
    response: response
      ? {
          ok: response.ok,
          source: response.source,
          text: response.text,
          error: response.error,
        }
      : null,
    liveCallError,
    networkTimingMs,
    sourceFile: "live (calls https://api.minimax.chat/v1/chat/completions)",
    scriptSource: "scripts/activate-minimax-live.ts",
    wrapperSource: "src/lib/minimax.ts",
    metadata: {
      activationRun: "2026-08-11",
      livePartner: "MiniMax",
      notes: [
        configured
          ? "MINIMAX_API_KEY present — live call attempted."
          : "MINIMAX_API_KEY not configured — deterministic fallback engaged.",
        networkTimingMs !== undefined
          ? `End-to-end latency: ${networkTimingMs} ms.`
          : "Latency not captured (call did not execute).",
      ],
    },
  };

  writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(
    [
      `[activate-minimax] configured=${configured}`,
      `ok=${response?.ok ?? false}`,
      `source=${response?.source ?? "n/a"}`,
      networkTimingMs !== undefined ? `latency_ms=${networkTimingMs}` : "no-latency",
      response?.text ? `text=${JSON.stringify(response.text).slice(0, 80)}` : "no-text",
      liveCallError ? `error=${liveCallError.slice(0, 80)}` : "no-error",
      `→ ${OUTPUT.replace(ROOT + "\\", "")}`,
    ].join(" "),
  );
}

main().catch((err) => {
  console.error("[activate-minimax] FAILED:", err instanceof Error ? err.message : err);
  // Don't process.exit(1) — capture and write the error so we have a record.
  try {
    const fallback = {
      documentId: `minimax_live_${Date.now()}_error`,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      miniconfigured: false,
      liveCallError: err instanceof Error ? err.stack || err.message : String(err),
      scriptSource: "scripts/activate-minimax-live.ts",
      metadata: {
        activationRun: "2026-08-11",
        livePartner: "MiniMax",
        notes: ["Top-level script failure captured."],
      },
    };
    const ROOT2 = resolve(import.meta.dirname || process.cwd(), "..");
    writeFileSync(join(ROOT2, "memory", "2026-08-11-minimax-test.json"), JSON.stringify(fallback, null, 2) + "\n", "utf8");
  } catch {
    /* swallow */
  }
  process.exit(1);
});
