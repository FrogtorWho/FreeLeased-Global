// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Submission Builder (Stage 14 #A1)
//
// Reads `project/submission-pack/*.md` and emits form-ready JSON for
// the Future Caribbean Buildathon portal. Inspired by competitor
// `jechaviz/future_caribbean_ai_buildathon` (cmd/fcbuild), this is
// the "self-applying AI" hook from
// `project/research/competitor-hooks-research.md` §2 (C1).
//
// HONESTY GATES (mirrors C1):
//   - Real external POST requires `APPLICATION_CONSENT_TO_SUBMIT=yes`
//     and non-placeholder applicant fields.
//   - Default mode is `--dry-run`, which prints the form payload to
//     stdout and exits 0 without touching the network.
//
// Usage:
//   bun scripts/submit-freeleased.ts                 # dry-run → JSON to stdout
//   bun scripts/submit-freeleased.ts --emit-md       # dry-run → markdown summary
//   bun scripts/submit-freeleased.ts --submit       # POST to portal (consent-gated)
//   bun scripts/submit-freeleased.ts --submit --allow-placeholders
//                                                  # POST with placeholder applicant
//                                                  # (still requires APPLICATION_CONSENT_TO_SUBMIT=yes)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const PACK_DIR = join(ROOT, "project", "submission-pack");

// ── Config ────────────────────────────────────────────────────────────────

const PORTAL_URL = process.env.FC_PORTAL_URL ?? "https://futurecaribbean.dev/api/submissions";
const CONSENT_ENV = process.env.APPLICATION_CONSENT_TO_SUBMIT ?? "";
const APPLICANT_EMAIL = process.env.FC_APPLICANT_EMAIL ?? "sam.peacock1@gmail.com";

// ── Helpers ───────────────────────────────────────────────────────────────

function readPackFile(name: string): string {
  const path = join(PACK_DIR, name);
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

/** Extract the first # heading as the title. */
function extractTitle(md: string, fallback: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return (m?.[1] ?? fallback).trim();
}

/** Count words. */
function wordCount(md: string): number {
  return (md.trim().match(/\S+/g) ?? []).length;
}

/** Extract `Track:` line if present. */
function extractTrack(md: string): string {
  const m = md.match(/\*\*Track:\*\*\s*([^\n]+)/);
  return (m?.[1] ?? "Track 9 — AI for Real Estate & Development").trim();
}

/** Extract deadline if mentioned. */
function extractDeadline(md: string): string {
  const m = md.match(/Deadline:\s*([^\n]+)/i);
  return (m?.[1] ?? "16 August 2026 (LIVE DEMO) / 17 August 2026 (submission close)").trim();
}

/** Compose the 300-500 word compliance statement body from v3. */
function extractComplianceBody(md: string): string {
  // Skip the first heading; everything after is the body.
  const body = md.replace(/^#.*$/m, "").trim();
  return body;
}

/** Determine the applicant is real (not placeholder). */
function applicantIsReal(): boolean {
  const placeholderPatterns = [/test/i, /example/i, /placeholder/i, /xxx/i];
  return !placeholderPatterns.some((p) => p.test(APPLICANT_EMAIL));
}

/** Decide whether the script should attempt a real POST. */
function shouldSubmit(allowPlaceholders: boolean): boolean {
  if (CONSENT_ENV.toLowerCase() !== "yes") {
    return false;
  }
  if (!allowPlaceholders && !applicantIsReal()) {
    return false;
  }
  return true;
}

// ── Build the form payload ───────────────────────────────────────────────

interface FormPayload {
  applicant: { email: string; track: string };
  project: {
    name: string;
    overview: string;
    architecture: string;
    compliance: string;
    demoScript: string;
    storyboard: string;
    observability: string;
    repoUrl: string;
    license: string;
    wordCounts: Record<string, number>;
    deadline: string;
  };
  submittedAt: string;
  sourceMarkdown: Record<string, number>;
}

function buildPayload(): FormPayload {
  const overview = readPackFile("project-overview-v3.md");
  const architecture = readPackFile("architecture-v3.md");
  const compliance = readPackFile("compliance-statement-v3.md");
  const demoScript = readPackFile("demo-script-v3.md");
  const storyboard = readPackFile("demo-storyboard.md");
  const observability = readPackFile("observability-ollygarden.md");

  const projectName = "FreeLeased — Agentic AI Right-to-Manage Platform";

  return {
    applicant: {
      email: APPLICANT_EMAIL,
      track: extractTrack(overview),
    },
    project: {
      name: projectName,
      overview: extractTitle(overview, projectName),
      architecture: extractTitle(architecture, "Architecture"),
      compliance: extractComplianceBody(compliance),
      demoScript: extractTitle(demoScript, "Demo Script"),
      storyboard: extractTitle(storyboard, "Demo Storyboard"),
      observability: extractTitle(observability, "Observability"),
      repoUrl: "https://github.com/FrogtorWho/FreeLeased-Global",
      license: "Apache-2.0",
      wordCounts: {
        compliance: wordCount(compliance),
        overview: wordCount(overview),
        architecture: wordCount(architecture),
        demoScript: wordCount(demoScript),
        storyboard: wordCount(storyboard),
        observability: wordCount(observability),
      },
      deadline: extractDeadline(overview),
    },
    submittedAt: new Date().toISOString(),
    sourceMarkdown: {
      "project-overview-v3.md": wordCount(overview),
      "architecture-v3.md": wordCount(architecture),
      "compliance-statement-v3.md": wordCount(compliance),
      "demo-script-v3.md": wordCount(demoScript),
      "demo-storyboard.md": wordCount(storyboard),
      "observability-ollygarden.md": wordCount(observability),
    },
  };
}

// ── Renderers ─────────────────────────────────────────────────────────────

function renderJson(payload: FormPayload): string {
  return JSON.stringify(payload, null, 2);
}

function renderMarkdown(payload: FormPayload): string {
  const lines: string[] = [];
  lines.push(`# FreeLeased — Buildathon submission payload (dry-run)`);
  lines.push("");
  lines.push(`> Generated by \`bun scripts/submit-freeleased.ts\` on ${payload.submittedAt}.`);
  lines.push("");
  lines.push(`**Applicant:** ${payload.applicant.email}`);
  lines.push(`**Track:** ${payload.applicant.track}`);
  lines.push(`**Project:** ${payload.project.name}`);
  lines.push(`**Deadline:** ${payload.project.deadline}`);
  lines.push(`**License:** ${payload.project.license}`);
  lines.push(`**Repo:** ${payload.project.repoUrl}`);
  lines.push("");
  lines.push(`## Word counts (per submission-pack file)`);
  lines.push("");
  lines.push(`| File | Words |`);
  lines.push(`|------|------:|`);
  for (const [k, v] of Object.entries(payload.project.wordCounts)) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");
  lines.push(`## Compliance statement (${payload.project.wordCounts.compliance} words)`);
  lines.push("");
  lines.push(payload.project.compliance);
  lines.push("");
  lines.push(`## Submission gate status`);
  lines.push("");
  lines.push(`- \`APPLICATION_CONSENT_TO_SUBMIT=${CONSENT_ENV || "(unset)"}\``);
  lines.push(`- Applicant email is real: ${applicantIsReal() ? "yes" : "NO (placeholder detected)"}`);
  lines.push(`- Will submit on \`--submit\`: ${shouldSubmit(false) ? "yes" : "no"}`);
  lines.push("");
  return lines.join("\n");
}

// ── Submit (gated) ───────────────────────────────────────────────────────

async function submit(payload: FormPayload): Promise<{ ok: boolean; status: number; body: string }> {
  if (!shouldSubmit(false)) {
    return {
      ok: false,
      status: 0,
      body:
        "Refused: APPLICATION_CONSENT_TO_SUBMIT must be 'yes' AND applicant email must be non-placeholder.",
    };
  }
  try {
    const res = await fetch(PORTAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: `Network error: ${(e as Error).message}` };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const emitMd = args.includes("--emit-md");
  const doSubmit = args.includes("--submit");
  const allowPlaceholders = args.includes("--allow-placeholders");

  const payload = buildPayload();

  if (doSubmit) {
    const result = await submit(payload);
    if (result.ok) {
      process.stdout.write(`[OK] Submitted. Status ${result.status}.\n${result.body}\n`);
      process.exit(0);
    } else {
      process.stderr.write(`[FAIL] Status ${result.status}.\n${result.body}\n`);
      process.exit(1);
    }
  } else if (emitMd) {
    const md = renderMarkdown(payload);
    const outPath = join(ROOT, ".shogo", "runtime", "submission-dry-run.md");
    writeFileSync(outPath, md, "utf8");
    process.stdout.write(`Wrote ${outPath} (${md.length} bytes)\n`);
    process.stdout.write(`[DRY-RUN] Consent-gated. Rerun with --submit AND APPLICATION_CONSENT_TO_SUBMIT=yes to POST.\n`);
    process.exit(0);
  } else {
    // default: JSON to stdout
    process.stdout.write(renderJson(payload) + "\n");
    process.stdout.write(`\n[DRY-RUN] Consent-gated. Rerun with --submit AND APPLICATION_CONSENT_TO_SUBMIT=yes to POST.\n`);
    process.exit(0);
  }
}

await main();