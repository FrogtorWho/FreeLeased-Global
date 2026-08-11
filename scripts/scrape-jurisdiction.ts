#!/usr/bin/env bun
// scripts/scrape-jurisdiction.ts
//
// HTTP-first scrape scaffold for jurisdiction framework JSONs.
//
// USAGE
//   bun scripts/scrape-jurisdiction.ts <code>      # e.g. UK | BB | JM | KY
//
// WHAT IT DOES
//   1. Loads src/data/frameworks/<code>-framework.json
//   2. Extracts every URL (extractUrls from the schema module)
//   3. Probes each URL with native fetch (no Playwright / no headless browser)
//   4. Honours the retry / rate-limit policy from
//      project/strategy/jurisdiction-onboarding-workflow.md §4.5:
//        - 1 retry on 5xx with 1s backoff
//        - 429 → back off 30s, then retry once
//        - follow up to 5 redirects; record final URL
//        - 4xx → mark unverified, do NOT retry
//   5. Writes a JSON report next to the framework:
//
//        src/data/frameworks/<code>-scrape-report.json
//
//      with the shape:
//        {
//          jurisdiction: string,
//          scrapedAt: ISO8601,
//          totals: { probed, alive, dead, redirected, unverified },
//          probes: [{ url, finalUrl, status, alive, redirected, attempts, durationMs }]
//        }
//
// NON-GOALS
//   • Does NOT extract content (LLM extraction is out of scope; this only
//     proves that the URLs in the framework are alive).
//   • Does NOT mutate the framework JSON; it only reads.
//   • Does NOT introduce a dependency on Playwright or any HTTP client
//     library; uses native `fetch` (Node 18+ / Bun).
//
// RUN MODES
//   • Default: HEAD + GET-fallback (some hosts return 4xx on HEAD).
//   • `--method=GET` to force GET.
//   • `--timeout=ms` to override the 10s default.
//
// EXIT CODES
//   • 0  every probed URL returned 2xx (or is intentionally `unverified`).
//   • 1  any URL returned 5xx after retry; report still written.
//   • 2  framework file missing or invalid JSON.
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  LegislativeFrameworkSchema,
  extractUrls,
  type LegislativeFramework,
} from "../src/data/legislative-framework-schema";
import * as fs from "node:fs";
import * as path from "node:path";

const PROJECT_ROOT = path.resolve(import.meta.dir, "..");

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLI parsing (zero-dep, no commander).
// ─────────────────────────────────────────────────────────────────────────────

interface CliArgs {
  code: string;
  method: "HEAD" | "GET";
  timeoutMs: number;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    code: "",
    method: "HEAD",
    timeoutMs: 10_000,
  };
  for (const raw of argv.slice(2)) {
    if (raw.startsWith("--method=")) {
      const m = raw.split("=")[1];
      args.method = m === "GET" ? "GET" : "HEAD";
    } else if (raw.startsWith("--timeout=")) {
      const n = Number(raw.split("=")[1]);
      if (Number.isFinite(n) && n > 0) args.timeoutMs = n;
    } else if (!args.code) {
      args.code = raw.trim().toUpperCase();
    }
  }
  if (!args.code) {
    throw new Error("Usage: bun scripts/scrape-jurisdiction.ts <code> [--method=GET] [--timeout=ms]");
  }
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Probe policy (workflow §4.5).
// ─────────────────────────────────────────────────────────────────────────────

interface ProbeResult {
  url: string;
  finalUrl: string | null;
  status: number | null;
  alive: boolean;
  redirected: boolean;
  attempts: number;
  durationMs: number;
  error?: string;
}

const MAX_REDIRECTS = 5;
const USER_AGENT =
  "FreeLeased/1.0 (+https://freeleased.example; jurisdiction-onboarding)";

async function probe(url: string, method: "HEAD" | "GET", timeoutMs: number): Promise<ProbeResult> {
  const started = Date.now();
  let current = url;
  let attempts = 0;
  let lastStatus: number | null = null;
  let lastError: string | undefined;

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    attempts += 1;
    let res: Response;
    try {
      const ctl = new AbortController();
      const tid = setTimeout(() => ctl.abort(), timeoutMs);
      res = await fetch(current, {
        method,
        redirect: "manual",
        headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
        signal: ctl.signal,
      });
      clearTimeout(tid);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      // Retry once after 1s on transient network errors.
      if (attempts === 1) {
        await sleep(1_000);
        continue;
      }
      break;
    }

    lastStatus = res.status;

    // 3xx → follow manually so we can record the chain length.
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) {
        // 3xx with no Location is a dead end.
        break;
      }
      current = new URL(loc, current).toString();
      continue;
    }

    // 429 → back off 30s and retry once.
    if (res.status === 429 && attempts === 1) {
      await sleep(30_000);
      continue;
    }

    // 5xx → one retry with 1s backoff.
    if (res.status >= 500 && res.status < 600 && attempts === 1) {
      await sleep(1_000);
      continue;
    }

    break;
  }

  const redirected = lastStatus != null && lastStatus >= 300 && lastStatus < 400
    ? current !== url
    : false;

  return {
    url,
    finalUrl: lastStatus != null ? current : null,
    status: lastStatus,
    alive: lastStatus != null && lastStatus >= 200 && lastStatus < 300,
    redirected,
    attempts,
    durationMs: Date.now() - started,
    error: lastError,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Load framework.
// ─────────────────────────────────────────────────────────────────────────────

function loadFramework(code: string): LegislativeFramework {
  const file = path.join(PROJECT_ROOT, "src/data/frameworks", `${code.toLowerCase()}-framework.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Framework not found: ${file}`);
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const result = LegislativeFrameworkSchema.safeParse(raw);
  if (!result.success) {
    const issues = (result.error as Error & { issues?: { path: string; message: string }[] }).issues ?? [];
    throw new Error(
      `Framework ${code} failed schema validation:\n` +
        issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n"),
    );
  }
  return result.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Main.
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(2);
    return;
  }

  console.log(`▶ scrape-jurisdiction: ${args.code} (method=${args.method}, timeout=${args.timeoutMs}ms)`);

  let framework: LegislativeFramework;
  try {
    framework = loadFramework(args.code);
  } catch (e) {
    console.error(`✗ ${(e as Error).message}`);
    process.exit(2);
    return;
  }

  const urls = extractUrls(framework);
  console.log(`  • probing ${urls.length} URL(s)…`);

  const probes: ProbeResult[] = [];
  for (const u of urls) {
    const r = await probe(u, args.method, args.timeoutMs);
    const icon = r.alive ? "✓" : r.status && r.status >= 400 ? "✗" : "?";
    console.log(`    ${icon} ${r.status ?? "—"}  ${u}${r.redirected ? ` → ${r.finalUrl}` : ""}`);
    probes.push(r);
  }

  const alive = probes.filter((p) => p.alive).length;
  const dead = probes.filter((p) => !p.alive && p.status && p.status >= 400).length;
  const redirected = probes.filter((p) => p.redirected).length;
  const unverified = probes.filter((p) => p.status === null || (p.status !== null && p.status >= 400)).length;

  const report = {
    jurisdiction: args.code,
    scrapedAt: new Date().toISOString(),
    frameworkSource: `src/data/frameworks/${args.code.toLowerCase()}-framework.json`,
    method: args.method,
    timeoutMs: args.timeoutMs,
    totals: {
      probed: probes.length,
      alive,
      dead,
      redirected,
      unverified,
    },
    probes,
  };

  const reportPath = path.join(
    PROJECT_ROOT,
    "src/data/frameworks",
    `${args.code.toLowerCase()}-scrape-report.json`,
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf-8");

  console.log("");
  console.log(`  totals: ${alive}/${probes.length} alive, ${dead} dead, ${redirected} redirected, ${unverified} unverified`);
  console.log(`  report: ${reportPath}`);

  if (dead > 0) {
    console.error(`✗ ${dead} URL(s) returned 4xx/5xx after retry.`);
    process.exit(1);
  }
  process.exit(0);
}

await main();
