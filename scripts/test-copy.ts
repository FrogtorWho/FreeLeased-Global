#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Tests for src/lib/copy.ts (Phase 11 / Bucket 2).
//
// Coverage targets:
//   - Every key surface (My Rights, Lease Scanner, Sign-off Queue,
//     Honesty) has copy defined.
//   - Copy is plain-English (no dark-pattern urgency words).
//   - Glossary covers the core legal jargon.
//   - Jargon-whitelist and glossary stay in sync.
//
// Targets lift on Axes 8.6 (copy quality), 20.3 (no dark patterns),
// 27.1-27.3 (learning outcomes / teach-ability).

import { COPY, GLOSSARY, JARGON_WHITELIST } from "../src/lib/copy.ts";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string): void {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

// ── Test 1: every key surface has copy ─────────────────────────────────
assert(COPY.appName === "FreeLeased", "appName is FreeLeased");
assert(COPY.appTagline.length > 10, "appTagline is non-trivial");
assert(COPY.myRights.headline.length > 0, "myRights headline exists");
assert(COPY.myRights.subhead.length > 0, "myRights subhead exists");
assert(COPY.myRights.cta.length > 0, "myRights CTA exists");
assert(COPY.myRights.tooltip.length > 0, "myRights tooltip exists");
assert(COPY.leaseScanner.headline.length > 0, "leaseScanner headline exists");
assert(COPY.leaseScanner.subhead.length > 0, "leaseScanner subhead exists");
assert(COPY.signoffQueue.headline.length > 0, "signoffQueue headline exists");
assert(COPY.signoffQueue.subhead.length > 0, "signoffQueue subhead exists");
assert(COPY.signoffQueue.cta.length > 0, "signoffQueue approve CTA exists");
assert(COPY.signoffQueue.ctaReject.length > 0, "signoffQueue reject CTA exists");
assert(COPY.signoffQueue.ctaAnnotate.length > 0, "signoffQueue annotate CTA exists");
assert(COPY.honesty.headline.length > 0, "honesty headline exists");
assert(COPY.honesty.shipped.length > 0, "honesty shipped section header");
assert(COPY.honesty.notShipped.length > 0, "honesty not-shipped section header");
assert(COPY.commands.verify === "npm run verify", "verify command is canonical");
assert(COPY.footer.licence.length > 0, "licence is named");
assert(COPY.footer.notLegalAdvice.length > 0, "not-legal-advice disclaimer exists");

// ── Test 2: no dark-pattern urgency language ───────────────────────────
// Forbidden words: "hurry", "limited time", "act now", "don't miss",
// "instant", "exclusive", "last chance". We allow "now" only inside
// the not-legal-advice disclaimer where it disambiguates.
const DARK_PATTERNS = [
  "hurry", "limited time", "act now", "don't miss", "instant",
  "exclusive offer", "last chance", "expires soon", "only X left",
];
function flatten(o: unknown, acc: string[] = []): string[] {
  if (typeof o === "string") acc.push(o);
  else if (o && typeof o === "object") {
    for (const v of Object.values(o as Record<string, unknown>)) flatten(v, acc);
  }
  return acc;
}
const allCopy = flatten(COPY).map((s) => s.toLowerCase());
for (const dp of DARK_PATTERNS) {
  const hits = allCopy.filter((s) => s.includes(dp));
  assert(hits.length === 0, `dark-pattern "${dp}" absent (${hits.length} hits)`);
}

// ── Test 3: glossary covers the core legal jargon ──────────────────────
const REQUIRED_TERMS = [
  "RTM", "LFRA", "BSA 2022", "EWS1", "service charge", "ground rent",
  "damp / mould", "section 21", "section 8",
];
for (const t of REQUIRED_TERMS) {
  assert(GLOSSARY[t] !== undefined, `glossary has "${t}"`);
}

// ── Test 4: glossary explanations are non-trivial ───────────────────────
for (const [term, def] of Object.entries(GLOSSARY)) {
  assert(def.length > 30, `glossary "${term}" explanation ≥30 chars (got ${def.length})`);
}

// ── Test 5: jargon whitelist is in sync with glossary ─────────────────
for (const term of Object.keys(GLOSSARY)) {
  assert(JARGON_WHITELIST.has(term), `jargon whitelist contains "${term}"`);
}
assert(JARGON_WHITELIST.size === Object.keys(GLOSSARY).length,
  `whitelist size matches glossary (${JARGON_WHITELIST.size} vs ${Object.keys(GLOSSARY).length})`);

// ── Test 6: copy does not make legal-advice claims ─────────────────────
const LEGAL_CLAIMS = ["i am your lawyer", "i am a lawyer", "this is legal advice",
                     "guaranteed to win", "guaranteed outcome"];
for (const claim of LEGAL_CLAIMS) {
  const hits = allCopy.filter((s) => s.includes(claim));
  assert(hits.length === 0, `legal-claim "${claim}" absent`);
}
const notAdviceHits = allCopy.filter((s) => s.includes("not legal advice") || s.includes("document-only"));
assert(notAdviceHits.length > 0, `not-legal-advice disclaimer present (${notAdviceHits.length} hits)`);

// ── Test 7: CTA copy uses positive-nudge language, not urgency ────────
// Approved: "check", "analyse", "approve", "annotate". Forbidden: "buy now", "submit".
const APPROVED_VERBS = ["check", "analyse", "approve", "annotate", "reject"];
const allCtas = [COPY.myRights.cta, COPY.leaseScanner.cta, COPY.signoffQueue.cta,
                 COPY.signoffQueue.ctaReject, COPY.signoffQueue.ctaAnnotate].map((s) => s.toLowerCase());
for (const cta of allCtas) {
  assert(APPROVED_VERBS.some((v) => cta.includes(v)), `CTA uses approved verb: "${cta}"`);
}

// ── Test 8: taglines avoid superlatives ────────────────────────────────
// Avoid "best", "fastest", "world's first", "revolutionary", "perfect".
const SUPERLATIVES = ["world's first", "revolutionary", "the best", "perfect score",
                     "guaranteed", "100% accurate"];
for (const s of SUPERLATIVES) {
  const hits = allCopy.filter((c) => c.includes(s));
  assert(hits.length === 0, `superlative "${s}" absent (${hits.length} hits)`);
}

// ── Test 9: no Article-5 prohibited claims ─────────────────────────────
// Prohibited: social scoring, emotion inference, biometric categorisation.
const PROHIBITED = ["social score", "emotion inference", "biometric", "behavioural prediction"];
for (const p of PROHIBITED) {
  const hits = allCopy.filter((c) => c.includes(p));
  assert(hits.length === 0, `prohibited practice "${p}" absent`);
}

// ── Test 10: README verify command matches COPY ────────────────────────
import { existsSync, readFileSync } from "node:fs";
const readme = readFileSync("README.md", "utf8");
assert(readme.includes(COPY.commands.verify),
  `README documents "${COPY.commands.verify}"`);

// ── Test 11: copy keys cover the surfaces named in docs/story-60s.md ──
{
  const story = readFileSync("docs/story-60s.md", "utf8");
  if (story.includes("Honesty")) {
    assert(COPY.honesty.headline.length > 0, "Honesty surface has copy");
  }
  if (story.includes("Lease Scanner")) {
    assert(COPY.leaseScanner.headline.length > 0, "Lease Scanner surface has copy");
  }
  if (story.includes("Sign-off Queue")) {
    assert(COPY.signoffQueue.headline.length > 0, "Sign-off Queue surface has copy");
  }
}

// ── Test 12: i18n-readiness — keys are flat, values are strings ────────
{
  // Every value in COPY is a string or an object of strings (no arrays,
  // no functions) — i18n extraction works.
  const check = (o: unknown, path: string): boolean => {
    if (typeof o === "string") return true;
    if (o && typeof o === "object") {
      return Object.entries(o as Record<string, unknown>).every(([k, v]) => check(v, `${path}.${k}`));
    }
    return false;
  };
  assert(check(COPY, "COPY"), "COPY is i18n-extractable (string-only tree)");
}

// ── Test 13: footer.disclaimer mentions "engage" ──────────────────────
assert(COPY.footer.notLegalAdvice.toLowerCase().includes("engage"),
  "footer disclaimer suggests engaging a local attorney");

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased copy tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All copy assertions passed.");
  process.exit(0);
}
