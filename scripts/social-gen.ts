// Social-post generator for build-in-public. Turns a milestone line into
// ready-to-post copy for X, LinkedIn, and Discord using whichever LLM provider
// is configured (Impala / MiniMax / Shogo pod). Runs the moment a key lands.
//
// Usage:
//   bun scripts/social-gen.ts "Day 4: wired the agentic loop with HITL sign-off"
//   bun scripts/social-gen.ts            (uses a default milestone)
//
// If no provider key is present it prints guidance instead of failing.
import { chatComplete, activeProvider } from "../src/lib/llm.server";

const milestone =
  process.argv.slice(2).join(" ").trim() ||
  "Day 4: wired the agentic verification loop (research, verify, gate, human sign-off) for FreeLeased";

const SYSTEM =
  "You write build-in-public social copy for a solo founder in the Future Caribbean Buildathon (Real Estate track). Product: FreeLeased, a provenance-tracked land and lease intelligence platform for the Caribbean. Voice: concrete, humble, technical. No hype words. No em-dashes. Every claim must be something actually shipped. Keep it honest.";

const prompt = `Milestone: "${milestone}".
Write three posts about this milestone. Return them clearly labelled:

X: a single post under 280 characters with hashtags #BuildInPublic #FutureCaribbean.
LINKEDIN: 4 to 6 sentences. Problem context, what shipped today, one lesson, one ask.
DISCORD: one short build-log line for the buildathon server.

Do not invent metrics or partnerships that were not stated in the milestone.`;

async function main() {
  console.log(`provider: ${activeProvider()}`);
  const res = await chatComplete(prompt, { system: SYSTEM, temperature: 0.7, maxTokens: 600 });
  if (!res.ok) {
    console.error(`\nCould not generate (${res.error}).`);
    console.error("Set IMPALA_API_KEY (or MINIMAX_API_KEY), or run inside a Shogo pod, then retry.");
    process.exit(1);
  }
  console.log(`model: ${res.model}\n`);
  console.log(res.text);
}

main();
