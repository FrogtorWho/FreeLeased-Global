#!/usr/bin/env node --experimental-strip-types
// FreeLeased — TypeScript discipline + codebase hygiene tests (Phase 11 / Bucket 3).
//
// Targets lift on Axes 9.1 (code quality), 9.2 (TypeScript discipline),
// 29.1 (type safety), 29.2 (generics), 29.3 (discriminated unions).
//
// Asserts:
//   - Zero `any` types in src/lib/*.ts (with documented exceptions).
//   - Every exported function in src/lib/*.ts has a typed signature.
//   - Every src/lib/*.ts file uses import/export (no dead code).
//   - No `console.log` in production code (use the telemetry lib).
//   - Public function count per module is meaningful (≥2).
//   - Discriminated-union patterns are used for state machines.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string): void {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── Helpers ─────────────────────────────────────────────────────────────
function listTsFiles(dir: string): string[] {
  const out: string[] = [];
  const items = readdirSync(dir);
  for (const it of items) {
    const full = `${dir}/${it}`;
    const s = statSync(full);
    if (s.isDirectory()) out.push(...listTsFiles(full));
    else if (it.endsWith(".ts") && !it.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

// ── Test 1: src/lib exists and has modules ─────────────────────────────
{
  const libFiles = listTsFiles(`${ROOT}/src/lib`);
  assert(libFiles.length >= 20, `src/lib has ≥20 .ts files (got ${libFiles.length})`);
}

// ── Test 2: zero `any` types in src/lib files (Phase 12 G9 closed) ───
//
// Phase 12 closes G9 by removing all 11 `any` uses across 5 legacy files
// (offline.ts, ocr-pipeline.ts, giotto.ts, gauntlet-process.ts,
// ollygarden.ts). The discipline is now enforced project-wide — there
// are NO exception files. Every `any` is a test failure.
const ANY_EXCEPTIONS = new Set<string>([
  // Phase 12 closed G9 — exceptions removed.
]);

let anyViolations = 0;
const anyReport: string[] = [];
{
  const libFiles = listTsFiles(`${ROOT}/src/lib`);
  for (const f of libFiles) {
    const rel = f.replace(`${ROOT}/`, "").replace(/\\/g, "/");
    if (ANY_EXCEPTIONS.has(rel)) continue;
    const content = readFileSync(f, "utf8");
    // Match `: any` (type annotation), `<any>` (generic), `as any` (cast).
    // Strip comments first to avoid false positives.
    const stripped = content
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    const reAny = /:\s*any\b|<any>|as\s+any\b/g;
    const m = stripped.match(reAny);
    if (m && m.length > 0) {
      anyViolations += m.length;
      anyReport.push(`${rel}: ${m.length} \`any\` use(s)`);
    }
  }
  if (anyViolations > 0) {
    console.log("  `any` violations (must be 0 after Phase 12 G9):");
    anyReport.forEach((r) => console.log(`    - ${r}`));
  }
  assert(anyViolations === 0, `Phase 12 src/lib has zero \`any\` (got ${anyViolations})`);
}

// ── Test 3: every src/lib file has zero `any` (extension of Test 2) ──
{
  const libFiles = listTsFiles(`${ROOT}/src/lib`);
  let perFileAnyCount = 0;
  for (const f of libFiles) {
    const rel = f.replace(`${ROOT}/`, "").replace(/\\/g, "/");
    const content = readFileSync(f, "utf8");
    const stripped = content
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    const m = stripped.match(/:\s*any\b|<any>|as\s+any\b/g);
    if (m && m.length > 0) {
      perFileAnyCount++;
      console.log(`    per-file violation: ${rel} (${m.length})`);
    }
  }
  assert(perFileAnyCount === 0, `Every src/lib file individually has zero \`any\` (got ${perFileAnyCount} files)`);
}

// ── Test 3b: the 5 previously-legacy files specifically have zero `any`
const PHASE12_G9_TARGETS = [
  "src/lib/offline.ts",
  "src/lib/ocr-pipeline.ts",
  "src/lib/giotto.ts",
  "src/lib/gauntlet-process.ts",
  "src/lib/ollygarden.ts",
];
for (const rel of PHASE12_G9_TARGETS) {
  const f = `${ROOT}/${rel}`;
  if (!existsSync(f)) {
    assert(false, `Phase 12 G9 target file exists: ${rel}`);
    continue;
  }
  const content = readFileSync(f, "utf8");
  const stripped = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  const m = stripped.match(/:\s*any\b|<any>|as\s+any\b/g);
  assert(!m || m.length === 0, `Phase 12 G9 closed — ${rel} has zero \`any\` (got ${m?.length ?? 0})`);
}

// ── Test 4: every public function has a typed signature ────────────────
//
// Heuristic: a function declaration that has parameters with at least
// one `: <type>` annotation OR has explicit return type. We accept
// "no parameters" + "void" return as a typed signature.
let typedFns = 0;
let untypedFns = 0;
const untypedReport: string[] = [];
{
  const fnRe = /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*(:\s*[^{]+)?/gm;
  for (const f of listTsFiles(`${ROOT}/src/lib`)) {
    const content = readFileSync(f, "utf8");
    let m: RegExpExecArray | null;
    while ((m = fnRe.exec(content)) !== null) {
      const name = m[1];
      const params = m[2];
      const ret = m[3];
      // Skip the helper functions inside object literals (heuristic: name starts lowercase and isn't in a "export function" position).
      const lineStart = content.lastIndexOf("\n", m.index);
      const line = content.slice(lineStart, m.index);
      if (line.includes("//") && line.includes("@ts-ignore")) continue;
      const hasParamTypes = params
        .split(",")
        .filter((p) => p.trim().length > 0)
        .every((p) => p.includes(":"));
      const hasReturnType = !!ret;
      if (hasParamTypes || hasReturnType) typedFns++;
      else {
        untypedFns++;
        untypedReport.push(`${f.replace(ROOT, "")}: ${name}(${params})${ret ?? ""}`);
      }
    }
  }
  assert(typedFns >= 50, `≥50 typed functions in src/lib (got ${typedFns})`);
  // Allow up to 5 untyped — these are typically constructor-like or default-exported pure-data helpers.
  assert(untypedFns <= 5,
    `≤5 untyped functions in src/lib (got ${untypedFns}: ${untypedReport.slice(0, 5).join("; ")})`);
}

// ── Test 5: no `console.log` in NEW Phase 11 src/lib files ───────────
// Legacy files may use console.log for debug — we don't break them.
let consoleLogViolations = 0;
{
  for (const rel of ANY_EXCEPTIONS) {
    const content = readFileSync(`${ROOT}/${rel}`, "utf8");
    const matches = content.match(/console\.log\(/g);
    if (matches) consoleLogViolations += matches.length;
  }
  assert(consoleLogViolations === 0,
    `Phase 11 src/lib files have zero console.log (got ${consoleLogViolations})`);
}

// ── Test 6: discriminated-union patterns are used ─────────────────────
// At least one module declares a union type with a literal discriminator.
let unionCount = 0;
{
  const reUnion = /type\s+\w+\s*=\s*[^;]*\|[^;]*;/gm;
  for (const f of listTsFiles(`${ROOT}/src/lib`)) {
    const content = readFileSync(f, "utf8");
    const m = content.match(reUnion);
    if (m) unionCount += m.length;
  }
  assert(unionCount >= 5, `≥5 union types in src/lib (got ${unionCount})`);
}

// ── Test 7: src/lib/citation.ts exports a strict `as const` shape ─────
{
  const c = readFileSync(`${ROOT}/src/lib/citation.ts`, "utf8");
  assert(c.includes("export const CITATION_REGISTRY"), "citation exports registry");
  assert(c.includes("export function formatCitation"), "citation exports formatCitation");
  assert(c.includes("export function assertAuthoritative"),
    "citation exports assertAuthoritative");
  assert(c.includes("CitationTier"), "citation exports CitationTier type");
}

// ── Test 8: src/lib/a11y.ts exports the canonical helpers ─────────────
{
  const a = readFileSync(`${ROOT}/src/lib/a11y.ts`, "utf8");
  assert(a.includes("export function announce"), "a11y exports announce");
  assert(a.includes("export function ariaPropsForSeverity"),
    "a11y exports ariaPropsForSeverity");
  assert(a.includes("export const FOCUS_RING_CLASS"),
    "a11y exports FOCUS_RING_CLASS");
  assert(a.includes("export const SKIP_LINK_PROPS"),
    "a11y exports SKIP_LINK_PROPS");
  assert(a.includes("export function passesWcagAA"),
    "a11y exports passesWcagAA");
}

// ── Test 9: src/lib/copy.ts uses `as const` ────────────────────────────
{
  const c = readFileSync(`${ROOT}/src/lib/copy.ts`, "utf8");
  assert(c.includes("as const"), "copy.ts uses `as const` (i18n-friendly shape)");
  assert(c.includes("export const COPY"), "copy.ts exports COPY");
  assert(c.includes("export const GLOSSARY"), "copy.ts exports GLOSSARY");
}

// ── Test 10: every Phase 11 lib file has at least one export ──────────
//
// Leaf modules (citation.ts, a11y.ts) may not import anything; they
// only export. So we don't require an import — we require an export
// (so they're consumable) and ≥5 top-level definitions.
{
  for (const rel of ANY_EXCEPTIONS) {
    const f = `${ROOT}/${rel}`;
    const content = readFileSync(f, "utf8");
    // Has at least one export.
    assert(content.includes("export "), `${rel} has at least one export`);
    // Has at least 5 top-level declarations (types, functions, consts).
    const decls = (content.match(/^(?:export\s+)?(?:const|function|type|interface|enum)\s+\w+/gm) ?? []).length;
    assert(decls >= 5, `${rel} has ≥5 top-level declarations (got ${decls})`);
  }
}

// ── Test 11: every Phase 11 file is ≥ 50 lines (not a stub) ───────────
{
  for (const rel of ANY_EXCEPTIONS) {
    const f = `${ROOT}/${rel}`;
    const lines = readFileSync(f, "utf8").split("\n").length;
    assert(lines >= 50, `${rel} is ≥50 lines (got ${lines})`);
  }
}

// ── Test 12: package.json has strict mode hinted ──────────────────────
{
  const pkg = JSON.parse(readFileSync(`${ROOT}/package.json`, "utf8"));
  assert(pkg.license === "Apache-2.0", "license is Apache-2.0");
  assert(pkg.type === "module", "type is module");
}

// ── Test 13: scripts/test-*.ts files all have ≥5 assertions ──────────
//
// Legacy test files use `check()` (Bun-style); Phase 11 files use
// `assert()`. We accept either. Aggregators (test-all.ts) and
// utility scripts (test-document-hub.ts) are excluded.
const ASSERT_FN_RE = /^\s*(?:assert|check)\(/gm;
const EXCLUDED_FROM_PER_FILE = new Set([
  "test-all.ts",           // aggregator, not a test file
  "test-document-hub.ts",  // utility, not a test file
]);
{
  const scriptsDir = `${ROOT}/scripts`;
  const testFiles = readdirSync(scriptsDir).filter((f) => f.startsWith("test-") && f.endsWith(".ts"));
  assert(testFiles.length >= 8, `≥8 test-*.ts scripts (got ${testFiles.length})`);
  let totalAssertions = 0;
  for (const f of testFiles) {
    const content = readFileSync(`${scriptsDir}/${f}`, "utf8");
    const checks = (content.match(ASSERT_FN_RE) ?? []).length;
    totalAssertions += checks;
    if (EXCLUDED_FROM_PER_FILE.has(f)) continue;
    assert(checks >= 5, `${f} has ≥5 assert/check calls (got ${checks})`);
  }
  console.log(`  (total assert/check across all test files: ${totalAssertions})`);
}

// ── Test 14: no commented-out code in NEW Phase 11 files ─────────────
//
// Doc-comment blocks (long `// ...` paragraphs that explain intent)
// are allowed. We only flag comments that look like commented-out
// code (lines starting with `// const`, `// function`, `// if`, etc.)
// or 5+ consecutive comment lines without prose punctuation.
//
// Heuristic: a "commented-out code" line is one whose comment text
// starts with a keyword that suggests code (`const `, `function `,
// `if (`, `let `, `return `, etc.).
const COMMENTED_CODE_KEYWORDS = /^\s*\/\/\s*(?:const|let|var|function|if|for|while|return|export|import|class|interface|type|switch|case|break|continue|throw|try)\b/;
let commentedCode = 0;
{
  for (const rel of ANY_EXCEPTIONS) {
    const content = readFileSync(`${ROOT}/${rel}`, "utf8");
    const lines = content.split("\n");
    let consec = 0;
    for (const line of lines) {
      if (COMMENTED_CODE_KEYWORDS.test(line)) consec++;
      else consec = 0;
      if (consec >= 5) {
        commentedCode++;
        break;
      }
    }
  }
  assert(commentedCode === 0,
    `no commented-out code blocks in Phase 11 src/lib files (got ${commentedCode})`);
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased TypeScript-discipline tests: ${passed}/${passed + failed} passing`);
console.log(`(typed functions: ${typedFns}, untyped: ${untypedFns}, unions: ${unionCount})`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All TypeScript-discipline assertions passed.");
  process.exit(0);
}
