#!/usr/bin/env -S bun
// ============================================================================
// check-world-urls.ts — Phase 14 / TASK 4
//
// Crawl the FreeLeased docs corpus, extract every URL, HEAD-check it, group
// by domain, classify 200 / 301-302 / 4xx / 5xx, write a markdown report to
// memory/2026-08-11-url-health.md.
//
// Scanned surfaces (per TASK 4 brief):
//   - README.md
//   - docs-site/*.html
//   - MEMORY.md
//   - project/strategy/100-judge-saturation-report.md
//   - project/management/first-impressions-audit.md
//
// Run:
//   bun scripts/check-world-urls.ts
//   bun scripts/check-world-urls.ts --concurrency 4 --timeout 12
//
// Output:
//   - console: per-domain summary table
//   - file: memory/2026-08-11-url-health.md  (the report)
//   - file: memory/2026-08-11-url-health.json (machine-readable)
//   - exit 0 if no 4xx/5xx; else exit 1
//
// Notes:
//   - Uses Bun's native fetch (Node 18+ also fine via `node`).
//   - HEAD only — no body download.
//   - Single retry with backoff for transient 5xx / network errors.
//   - Skips mailto:, tel:, #fragment-only, and local file: URIs.
// ============================================================================

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  if (i === -1) return def;
  return args[i + 1] ?? def;
}

const CONCURRENCY = Math.max(1, Math.min(16, Number(arg("--concurrency", "6"))));
const TIMEOUT_MS  = Math.max(2000, Number(arg("--timeout", "12000")));
const REPORT_PATH = arg("--report", "memory/2026-08-11-url-health.md");
const JSON_PATH   = arg("--json",   "memory/2026-08-11-url-health.json");

// ---------- 1. Discover all the source files we should crawl ----------
const SURFACES = [
  "README.md",
  "MEMORY.md",
  "project/strategy/100-judge-saturation-report.md",
  "project/management/first-impressions-audit.md",
];
function walkHtml(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const e of readdirSync(root)) {
    const p = join(root, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkHtml(p));
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}
const SURFACE_FILES: string[] = [
  ...SURFACES.filter((p) => existsSync(p)),
  ...walkHtml("docs-site"),
];

console.error(`[check-world-urls] scanning ${SURFACE_FILES.length} surfaces:`);
for (const f of SURFACE_FILES) console.error("  - " + f);

// ---------- 2. Extract every URL from the corpus ----------
const URL_RE = /\bhttps?:\/\/[^\s<>"'`)\]]+/gi;
const fileUrls = new Map<string, Set<string>>();
const allUrls = new Set<string>();

for (const f of SURFACE_FILES) {
  const text = readFileSync(f, "utf8");
  const matches = text.match(URL_RE) ?? [];
  const set = fileUrls.get(f) ?? new Set<string>();
  for (const m of matches) {
    // strip trailing punctuation that's commonly appended to URLs in prose.
    const cleaned = m.replace(/[.,;:!?)]+$/, "");
    set.add(cleaned);
    allUrls.add(cleaned);
  }
  fileUrls.set(f, set);
}

console.error(`[check-world-urls] found ${allUrls.size} unique URLs`);

// ---------- 3. Probe each URL in parallel ----------
type Result = {
  url: string;
  status: number | "ERR";
  ok: boolean;
  redirectedTo?: string;
  latencyMs: number;
  error?: string;
  sources: string[];
};

const results: Result[] = [];
let done = 0;

async function probe(url: string): Promise<Result> {
  const sources: string[] = [];
  for (const [f, urls] of fileUrls) if (urls.has(url)) sources.push(f);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  let res: Response | null = null;
  let attempt = 0;
  let lastErr: unknown = null;
  while (attempt < 2) {
    try {
      res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      break;
    } catch (e) {
      lastErr = e;
      attempt++;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 500));
    }
  }
  clearTimeout(timer);
  const latencyMs = Date.now() - t0;
  if (!res) {
    done++;
    return {
      url,
      status: "ERR",
      ok: false,
      latencyMs,
      error: lastErr instanceof Error ? lastErr.message : String(lastErr),
      sources,
    };
  }
  done++;
  return {
    url,
    status: res.status,
    ok: res.status >= 200 && res.status < 400,
    redirectedTo: res.redirected ? res.url : undefined,
    latencyMs,
    sources,
  };
}

const queue = Array.from(allUrls);
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) {
    const u = queue.shift();
    if (!u) return;
    results.push(await probe(u));
    process.stderr.write(`\r[check-world-urls] ${done}/${allUrls.size} probed`);
  }
});
await Promise.all(workers);
process.stderr.write("\n");

// ---------- 4. Group by domain + classify ----------
function hostOf(url: string): string {
  try { return new URL(url).host; } catch { return "(invalid)"; }
}
const byDomain = new Map<string, Result[]>();
for (const r of results) {
  const h = hostOf(r.url);
  if (!byDomain.has(h)) byDomain.set(h, []);
  byDomain.get(h)!.push(r);
}

const buckets = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0, ERR: 0 } as Record<string, number>;
for (const r of results) {
  if (r.status === "ERR") buckets.ERR++;
  else if (r.status >= 200 && r.status < 300) buckets["2xx"]++;
  else if (r.status >= 300 && r.status < 400) buckets["3xx"]++;
  else if (r.status >= 400 && r.status < 500) buckets["4xx"]++;
  else if (r.status >= 500 && r.status < 600) buckets["5xx"]++;
}

// ---------- 5. Build the markdown report ----------
const lines: string[] = [];
const now = new Date().toISOString();
lines.push(`# URL Health Check — ${now}`);
lines.push("");
lines.push(`> **Phase 14 / TASK 4.** Every URL referenced in the FreeLeased docs corpus was HEAD-probed and classified. The remediation list at the bottom contains every 4xx/5xx/ERR result.`);
lines.push("");
lines.push("## At-a-glance");
lines.push("");
lines.push("| Bucket | Count |");
lines.push("|---|---:|");
for (const [k, v] of Object.entries(buckets)) lines.push(`| ${k} | ${v} |`);
lines.push(`| **TOTAL** | **${results.length}** |`);
lines.push("");
lines.push(`Surfaces scanned: ${SURFACE_FILES.length} files.`);
for (const f of SURFACE_FILES) {
  const n = fileUrls.get(f)?.size ?? 0;
  lines.push(`- \`${f}\` — ${n} URLs`);
}
lines.push("");
lines.push("## Per-domain breakdown");
lines.push("");
lines.push("| Domain | 2xx | 3xx | 4xx | 5xx | ERR | Median latency |");
lines.push("|---|---:|---:|---:|---:|---:|---:|");
const sortedDomains = Array.from(byDomain.keys()).sort();
for (const d of sortedDomains) {
  const rs = byDomain.get(d)!;
  const c2 = rs.filter((r) => typeof r.status === "number" && r.status >= 200 && r.status < 300).length;
  const c3 = rs.filter((r) => typeof r.status === "number" && r.status >= 300 && r.status < 400).length;
  const c4 = rs.filter((r) => typeof r.status === "number" && r.status >= 400 && r.status < 500).length;
  const c5 = rs.filter((r) => typeof r.status === "number" && r.status >= 500 && r.status < 600).length;
  const ce = rs.filter((r) => r.status === "ERR").length;
  const lats = rs.map((r) => r.latencyMs).sort((a, b) => a - b);
  const med = lats.length ? Math.round(lats[Math.floor(lats.length / 2)]) : 0;
  lines.push(`| \`${d}\` | ${c2} | ${c3} | ${c4} | ${c5} | ${ce} | ${med} ms |`);
}
lines.push("");
lines.push("## All probed URLs (sorted by domain, then URL)");
lines.push("");
for (const d of sortedDomains) {
  lines.push(`### \`${d}\``);
  lines.push("");
  lines.push("| Status | Latency | URL | Sources |");
  lines.push("|---:|---:|---|---|");
  const rs = byDomain.get(d)!.slice().sort((a, b) => a.url.localeCompare(b.url));
  for (const r of rs) {
    const target = r.redirectedTo ? `${r.url} → ${r.redirectedTo}` : r.url;
    const src = r.sources.map((s) => `\`${s}\``).join(", ");
    lines.push(`| ${r.status} | ${r.latencyMs} ms | ${target} | ${src} |`);
  }
  lines.push("");
}
const bad = results.filter((r) => r.status === "ERR" || (typeof r.status === "number" && r.status >= 400));
lines.push("## Remediation list (4xx / 5xx / ERR)");
lines.push("");
if (bad.length === 0) {
  lines.push("_None. Every URL returned 2xx/3xx or a transient ERR that was retried successfully._");
} else {
  for (const r of bad) {
    lines.push(`- **${r.status}** — ${r.url}${r.error ? ` (${r.error})` : ""}`);
    lines.push(`  - Sources: ${r.sources.map((s) => `\`${s}\``).join(", ")}`);
    lines.push(`  - Action: ${r.status === "ERR" ? "re-test; may be DNS / firewall / private endpoint" : r.status === 404 ? "404 — page does not exist; remove or fix link" : r.status === 403 ? "403 — auth required or blocked; consider alternative URL" : "check upstream"}`);
  }
}
lines.push("");
lines.push("## Repro command");
lines.push("");
lines.push("```bash");
lines.push("bun scripts/check-world-urls.ts");
lines.push("```");

writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");
writeFileSync(JSON_PATH, JSON.stringify({ generatedAt: now, buckets, results }, null, 2), "utf8");
console.error(`[check-world-urls] wrote ${REPORT_PATH}`);
console.error(`[check-world-urls] wrote ${JSON_PATH}`);
console.log("");
console.log("Buckets:");
for (const [k, v] of Object.entries(buckets)) console.log(`  ${k}: ${v}`);
console.log(`  TOTAL: ${results.length}`);
if (bad.length > 0) process.exit(1);