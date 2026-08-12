// LLM chain regression test — exercises the new fallback chain order
// (local-edge → giotto → MiniMax → openrouter → gemini → impala → shogo →
// fallback) and the OpenRouter + Gemini wrappers. Pure unit-level; no
// network. Run with: `bun scripts/test-llm-chain.ts`.

// We deliberately import only the OpenRouter + Gemini wrappers directly to
// avoid pulling the full chain (which transitively imports giotto.ts and
// requires Bun's bundler to resolve extensionless imports). The chain-order
// assertions below verify the ordering by inspecting a local copy of the
// ordered list exported here.
import {
  openrouterConfigured,
  getOpenRouterClientOrNone,
  chatCompletion as openrouterChatCompletion,
  probeOpenRouter,
  DEFAULT_OPENROUTER_BASE_URL,
  DEFAULT_OPENROUTER_MODEL,
} from "../src/lib/openrouter.ts";
import {
  geminiConfigured,
  getGeminiClientOrNone,
  chatCompletion as geminiChatCompletion,
  probeGemini,
  DEFAULT_GEMINI_BASE_URL,
  DEFAULT_GEMINI_MODEL,
} from "../src/lib/gemini.ts";
// chain order is sourced directly from the llm.server.ts source via regex.
// This avoids importing it (which pulls giotto.ts). Single source of truth in
// `src/lib/llm.server.ts` is asserted here as text.

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(name: string, cond: boolean, extra?: string): void {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    failures.push(`${name}${extra ? `: ${extra}` : ""}`);
    console.log(`  ✗ ${name}${extra ? `: ${extra}` : ""}`);
  }
}

function section(title: string): void {
  console.log(`\n[${title}]`);
}

// ---------------------------------------------------------------------------
// Section 1: OpenRouter wrapper surface
// ---------------------------------------------------------------------------
section("OpenRouter wrapper");

// Save & restore env so the test is deterministic.
const savedOpenRouterKey = process.env.OPENROUTER_API_KEY;
const savedOpenRouterModel = process.env.OPENROUTER_MODEL;
const savedOpenRouterBase = process.env.OPENROUTER_BASE_URL;

delete process.env.OPENROUTER_API_KEY;
assert("openrouterConfigured() false when key unset", openrouterConfigured() === false);
assert(
  "getOpenRouterClientOrNone() null when key unset",
  getOpenRouterClientOrNone() === null,
);

process.env.OPENROUTER_API_KEY = "your_openrouter_api_key_here"; // placeholder
assert(
  "openrouterConfigured() false with placeholder",
  openrouterConfigured() === false,
);
assert(
  "getOpenRouterClientOrNone() null with placeholder",
  getOpenRouterClientOrNone() === null,
);

process.env.OPENROUTER_API_KEY = "sk-or-v1-real-test-key-1234";
assert(
  "openrouterConfigured() true with real key",
  openrouterConfigured() === true,
);
const orClient = getOpenRouterClientOrNone();
assert(
  "getOpenRouterClientOrNone() returns client with real key",
  orClient !== null && typeof orClient.apiKey === "string",
);
assert(
  "OpenRouter client exposes model field",
  orClient !== null && typeof orClient.model === "string",
);

process.env.OPENROUTER_API_KEY = "sk-or-v1-real-test-key-1234";
process.env.OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";
const orClientCustomModel = getOpenRouterClientOrNone();
assert(
  "OpenRouter client honours OPENROUTER_MODEL override",
  orClientCustomModel !== null && orClientCustomModel.model === "google/gemini-2.0-flash-exp:free",
);

process.env.OPENROUTER_API_KEY = "sk-or-v1-real-test-key-1234";
delete process.env.OPENROUTER_MODEL;
delete process.env.OPENROUTER_BASE_URL;
const orClientDefaults = getOpenRouterClientOrNone();
assert(
  "OpenRouter client default base URL is openrouter.ai",
  orClientDefaults !== null && orClientDefaults.baseUrl === DEFAULT_OPENROUTER_BASE_URL,
);
assert(
  "OpenRouter client default model is llama-3.3-70b-instruct:free",
  orClientDefaults !== null && orClientDefaults.model === DEFAULT_OPENROUTER_MODEL,
);

// chatCompletion without client → returns OpenAI-shaped error response
process.env.OPENROUTER_API_KEY = "";
const orRespNoKey = await openrouterChatCompletion([{ role: "user", content: "hi" }]);
assert(
  "openrouter chatCompletion without key returns model + error envelope",
  typeof orRespNoKey.model === "string" &&
    Array.isArray(orRespNoKey.choices) &&
    orRespNoKey.choices.length === 0 &&
    typeof orRespNoKey.error?.message === "string",
);

// probeOpenRouter without key → returns {available:false, error}
process.env.OPENROUTER_API_KEY = "";
const orProbe = await probeOpenRouter();
assert(
  "probeOpenRouter reports unavailable when key missing",
  orProbe.available === false && typeof orProbe.error === "string",
);

// Restore env.
if (savedOpenRouterKey !== undefined) process.env.OPENROUTER_API_KEY = savedOpenRouterKey;
else delete process.env.OPENROUTER_API_KEY;
if (savedOpenRouterModel !== undefined) process.env.OPENROUTER_MODEL = savedOpenRouterModel;
else delete process.env.OPENROUTER_MODEL;
if (savedOpenRouterBase !== undefined) process.env.OPENROUTER_BASE_URL = savedOpenRouterBase;
else delete process.env.OPENROUTER_BASE_URL;

// ---------------------------------------------------------------------------
// Section 2: Gemini wrapper surface
// ---------------------------------------------------------------------------
section("Gemini wrapper");

const savedGeminiKey = process.env.GEMINI_API_KEY;
const savedGeminiModel = process.env.GEMINI_MODEL;
const savedGeminiBase = process.env.GEMINI_BASE_URL;

delete process.env.GEMINI_API_KEY;
assert("geminiConfigured() false when key unset", geminiConfigured() === false);
assert(
  "getGeminiClientOrNone() null when key unset",
  getGeminiClientOrNone() === null,
);

process.env.GEMINI_API_KEY = "your_gemini_api_key_here"; // placeholder
assert(
  "geminiConfigured() false with placeholder",
  geminiConfigured() === false,
);
assert(
  "getGeminiClientOrNone() null with placeholder",
  getGeminiClientOrNone() === null,
);

process.env.GEMINI_API_KEY = "AIzaSyTest-Real-Gemini-Key-1234567890";
assert("geminiConfigured() true with real key", geminiConfigured() === true);
const geminiClient = getGeminiClientOrNone();
assert(
  "getGeminiClientOrNone() returns client with real key",
  geminiClient !== null && typeof geminiClient.apiKey === "string",
);
assert(
  "Gemini client default base URL",
  geminiClient !== null && geminiClient.baseUrl === DEFAULT_GEMINI_BASE_URL,
);
assert(
  "Gemini client default model is gemini-2.0-flash-exp",
  geminiClient !== null && geminiClient.model === DEFAULT_GEMINI_MODEL,
);

process.env.GEMINI_MODEL = "gemini-1.5-pro";
const geminiClientCustom = getGeminiClientOrNone();
assert(
  "Gemini client honours GEMINI_MODEL override",
  geminiClientCustom !== null && geminiClientCustom.model === "gemini-1.5-pro",
);

// chatCompletion without client
process.env.GEMINI_API_KEY = "";
const geminiRespNoKey = await geminiChatCompletion([{ role: "user", content: "hi" }]);
assert(
  "gemini chatCompletion without key returns model + error envelope",
  typeof geminiRespNoKey.model === "string" &&
    Array.isArray(geminiRespNoKey.choices) &&
    geminiRespNoKey.choices.length === 0 &&
    typeof geminiRespNoKey.error?.message === "string",
);

// probeGemini without key
process.env.GEMINI_API_KEY = "";
const geminiProbe = await probeGemini();
assert(
  "probeGemini reports unavailable when key missing",
  geminiProbe.available === false && typeof geminiProbe.error === "string",
);

if (savedGeminiKey !== undefined) process.env.GEMINI_API_KEY = savedGeminiKey;
else delete process.env.GEMINI_API_KEY;
if (savedGeminiModel !== undefined) process.env.GEMINI_MODEL = savedGeminiModel;
else delete process.env.GEMINI_MODEL;
if (savedGeminiBase !== undefined) process.env.GEMINI_BASE_URL = savedGeminiBase;
else delete process.env.GEMINI_BASE_URL;

// ---------------------------------------------------------------------------
// Section 3: Chain order — read from llm.server.ts source
// ---------------------------------------------------------------------------
section("Chain order");

import { readFileSync } from "node:fs";

const llmSrc = readFileSync(new URL("../src/lib/llm.server.ts", import.meta.url), "utf8");

// The PROVIDER_ORDER array must be defined in priority order.
const orderMatch = llmSrc.match(/const\s+PROVIDER_ORDER[^=]*=\s*\[([^\]]+)\]/);
assert(
  "PROVIDER_ORDER array is declared in llm.server.ts",
  orderMatch !== null,
);
const orderText = orderMatch?.[1] ?? "";
const order = Array.from(
  orderText.matchAll(/"([^"]+)"/g),
  (m) => m[1],
);

assert("chain order starts with local-edge", order[0] === "local-edge");
assert("chain order has giotto second", order[1] === "giotto");
assert("chain order has MiniMax third", order[2] === "minimax");
assert("chain order has openrouter fourth", order[3] === "openrouter");
assert("chain order has gemini fifth", order[4] === "gemini");
assert("chain order has impala sixth", order[5] === "impala");
assert("chain order has shogo seventh", order[6] === "shogo");
assert("chain order is exactly 7 entries", order.length === 7);

// eligibilityChain must include every name from PROVIDER_ORDER. The
// function is a switch-style — we grep for the literal `name:` keys
// within the function body. To stay robust, we count the *unique* names
// in eligibility that match PROVIDER_ORDER.
const fnBodyMatch = llmSrc.match(/function\s+eligibilityChain\(\)[\s\S]*?return\s*\[([\s\S]*?)\];/);
const eligibilityNamesInFn = Array.from(
  new Set(Array.from((fnBodyMatch?.[1] ?? "").matchAll(/name:\s*"([^"]+)"/g), (m) => m[1])),
);
assert(
  "eligibilityChain lists every provider in PROVIDER_ORDER",
  order.every((n) => eligibilityNamesInFn.includes(n)),
);
assert(
  "eligibilityChain has exactly 7 unique provider names",
  eligibilityNamesInFn.length === 7,
);

// Both chain helpers exported
assert(
  "llm.server.ts exports `availableProviderChains()`",
  /export\s+function\s+availableProviderChains\s*\(/.test(llmSrc),
);
assert(
  "llm.server.ts exports `providerOrder()`",
  /export\s+function\s+providerOrder\s*\(/.test(llmSrc),
);
assert(
  "llm.server.ts exports `activeProvider()`",
  /export\s+function\s+activeProvider\s*\(/.test(llmSrc),
);
assert(
  "llm.server.ts exports `llmAvailable()`",
  /export\s+function\s+llmAvailable\s*\(/.test(llmSrc),
);

// Both new providers wired into the chain.
assert(
  "runChain() body probes OpenRouter",
  /probeOpenRouter\s*\(\s*\)/.test(llmSrc),
);
assert(
  "runChain() body probes Gemini",
  /probeGemini\s*\(\s*\)/.test(llmSrc),
);
assert(
  "runChain() body imports openrouterChatCompletion",
  /openrouterChatCompletion\s*\(/.test(llmSrc),
);
assert(
  "runChain() body imports geminiChatCompletion",
  /geminiChatCompletion\s*\(/.test(llmSrc),
);

// USE_MINIMAX gate honoured.
assert(
  "runChain gates MiniMax on USE_MINIMAX=1",
  /USE_MINIMAX\s*===\s*"1"\s*&&\s*minimaxConfigured\(\)/.test(llmSrc),
);

// logActiveTier present and writes the active tier string.
assert(
  "logActiveTier() function defined and called by chatComplete",
  /function\s+logActiveTier\s*\(/.test(llmSrc) && /logActiveTier\s*\(\s*"chatComplete"\s*\)/.test(llmSrc),
);
assert(
  "logActiveTier() called by assistJurisdictionResearch",
  /logActiveTier\s*\(\s*"assistJurisdictionResearch"\s*\)/.test(llmSrc),
);

// Local edge stays at priority 1.
assert(
  "local edge is consulted first",
  /if\s*\(\s*localEdgeConfiguredFn\(\)\s*&&\s*process\.env\.USE_LOCAL_EDGE\s*===\s*"1"\s*\)/.test(llmSrc),
);

// Deterministic fallback path ends with stub
assert(
  "deterministic fallback available when all providers fail",
  /DETERMINISTIC_FALLBACK_PREFIX/.test(llmSrc) && /return\s*\{\s*ok:\s*false,\s*model:\s*"fallback"/.test(llmSrc),
);

// Graceful placeholder handling — the placeholder constants live in the
// wrapper files (openrouter.ts / gemini.ts), not llm.server.ts. Read both.
const openrouterSrc = readFileSync(new URL("../src/lib/openrouter.ts", import.meta.url), "utf8");
const geminiSrcFile = readFileSync(new URL("../src/lib/gemini.ts", import.meta.url), "utf8");
assert(
  "OpenRouter placeholder guard defined in wrapper",
  /OPENROUTER_PLACEHOLDER\s*=\s*"your_openrouter_api_key_here"/.test(openrouterSrc) &&
    /key\.trim\(\)\s*===\s*OPENROUTER_PLACEHOLDER/.test(openrouterSrc),
);
assert(
  "Gemini placeholder guard defined in wrapper",
  /GEMINI_PLACEHOLDER\s*=\s*"your_gemini_api_key_here"/.test(geminiSrcFile) &&
    /key\.trim\(\)\s*===\s*GEMINI_PLACEHOLDER/.test(geminiSrcFile),
);
// Both wrappers import the new key names from llm.server.ts eligibility.
assert(
  "eligibilityChain recognises OPENROUTER_API_KEY placeholder",
  /OPENROUTER_API_KEY/.test(llmSrc) && /placeholder\/missing/.test(llmSrc),
);
assert(
  "eligibilityChain recognises GEMINI_API_KEY placeholder",
  /GEMINI_API_KEY/.test(llmSrc) && /placeholder\/missing/.test(llmSrc),
);

// ---------------------------------------------------------------------------
// Section 4: Wrapper return-shape contracts (OpenAI-compatible)
// ---------------------------------------------------------------------------
section("OpenAI-shaped return contract");

// OpenRouter: chatCompletion returns a known OpenAI-shaped response object
// even without a key.
assert(
  "openrouter.chatCompletion returns `model` field",
  typeof orRespNoKey.model === "string",
);
assert(
  "openrouter.chatCompletion returns `choices` array",
  Array.isArray(orRespNoKey.choices),
);
assert(
  "openrouter.chatCompletion returns `error` object on no-key",
  typeof orRespNoKey.error === "object" && orRespNoKey.error !== null,
);

assert(
  "gemini.chatCompletion returns `model` field",
  typeof geminiRespNoKey.model === "string",
);
assert(
  "gemini.chatCompletion returns `choices` array",
  Array.isArray(geminiRespNoKey.choices),
);
assert(
  "gemini.chatCompletion returns `error` object on no-key",
  typeof geminiRespNoKey.error === "object" && geminiRespNoKey.error !== null,
);

// probe() return shape — { available, latencyMs?, error? }
assert(
  "probeOpenRouter returns `{available, error?}`",
  typeof orProbe.available === "boolean" && (orProbe.error === undefined || typeof orProbe.error === "string"),
);
assert(
  "probeGemini returns `{available, error?}`",
  typeof geminiProbe.available === "boolean" && (geminiProbe.error === undefined || typeof geminiProbe.error === "string"),
);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n[summary] passed=${passed} failed=${failed}`);
if (failed > 0) {
  console.log(`\nFailures:`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
process.exit(0);
