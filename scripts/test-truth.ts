#!/usr/bin/env node --experimental-strip-types
// FreeLeased — Tests for src/lib/truth.ts (Phase 11 / Bucket 4).
//
// Coverage targets:
//   - HonestyDecision: surface / review / abstain rules.
//   - Provenance chain validation (no broken sourceIds).
//   - SHIPPED + NOT_SHIPPED lists are non-empty and category-coherent.
//   - Tier-1 anchor requirement is enforced.
//   - fact-check-register.md resolves to real files.
//
// Targets lift on Axes 1.5 (sourcing transparency), 21.4 (journalist
// sourcing), 22.3 (accountability), 13.3 (transparency).

import {
  decide,
  isValidChain,
  honestyTabContent,
  NOT_SHIPPED,
  SHIPPED,
  type SourceRecord,
  type ProvenanceChain,
  type HonestyDecision,
} from "../src/lib/truth.ts";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let passed = 0;
let failed = 0;
const fails: string[] = [];

function assert(cond: boolean, name: string): void {
  if (cond) { passed++; }
  else { failed++; fails.push(name); }
}

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");

// ── Test 1: SHIPPED list is non-trivial ────────────────────────────────
assert(SHIPPED.length >= 5, `SHIPPED has ≥5 entries (got ${SHIPPED.length})`);
for (const s of SHIPPED) {
  assert(s.name.length > 0, `SHIPPED "${s.name.slice(0, 20)}" has name`);
  assert(s.detail.length > 5, `SHIPPED "${s.name.slice(0, 20)}" has detail`);
}

// ── Test 2: NOT_SHIPPED list is non-trivial ────────────────────────────
assert(NOT_SHIPPED.length >= 5, `NOT_SHIPPED has ≥5 entries (got ${NOT_SHIPPED.length})`);
for (const n of NOT_SHIPPED) {
  assert(n.name.length > 0, `NOT_SHIPPED "${n.name.slice(0, 20)}" has name`);
  assert(n.detail.length > 5, `NOT_SHIPPED "${n.name.slice(0, 20)}" has detail`);
  assert(n.targetDate.length > 0, `NOT_SHIPPED "${n.name.slice(0, 20)}" has targetDate`);
}

// ── Test 3: honestyTabContent returns both lists ───────────────────────
const tab = honestyTabContent();
assert(tab.shipped.length === SHIPPED.length, "tab.shipped equals SHIPPED");
assert(tab.notShipped.length === NOT_SHIPPED.length, "tab.notShipped equals NOT_SHIPPED");

// ── Test 4: SHIPPED + NOT_SHIPPED are non-overlapping ──────────────────
const shippedNames = new Set(SHIPPED.map((s) => s.name.toLowerCase()));
const notShippedNames = new Set(NOT_SHIPPED.map((s) => s.name.toLowerCase()));
let overlap = 0;
for (const n of shippedNames) if (notShippedNames.has(n)) overlap++;
assert(overlap === 0, `SHIPPED and NOT_SHIPPED don't overlap (got ${overlap} overlaps)`);

// ── Test 5: decide() — tier-1 + high confidence → surface ─────────────
{
  const sources: SourceRecord[] = [
    { id: "s1", label: "UK LFRA", tier: 1, url: "https://legislation.gov.uk/ukpga/2002/15", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "node", sourceId: "s1", extractedAt: "2026-08-11", confidence: { belief: 0.9, plausibility: 0.1 } }],
    terminus: { sourceId: "s1", tier: 1 },
  };
  const d = decide("test", chain);
  assert(d.kind === "surface", `tier-1 + 0.9 confidence → surface (got ${d.kind})`);
}

// ── Test 6: decide() — tier-3 → abstain ───────────────────────────────
{
  const sources: SourceRecord[] = [
    { id: "blog", label: "Some blog", tier: 3, url: "https://example.org/post", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "node", sourceId: "blog", extractedAt: "2026-08-11", confidence: { belief: 0.95, plausibility: 0.05 } }],
    terminus: { sourceId: "blog", tier: 3 },
  };
  const d = decide("test", chain);
  assert(d.kind === "abstain", `tier-3 → abstain (got ${d.kind})`);
}

// ── Test 7: decide() — low confidence → review ────────────────────────
{
  const sources: SourceRecord[] = [
    { id: "s1", label: "UK LFRA", tier: 1, url: "https://legislation.gov.uk/ukpga/2002/15", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "node", sourceId: "s1", extractedAt: "2026-08-11", confidence: { belief: 0.5, plausibility: 0.5 } }],
    terminus: { sourceId: "s1", tier: 1 },
  };
  const d = decide("test", chain);
  assert(d.kind === "review", `0.5 confidence → review (got ${d.kind})`);
}

// ── Test 8: decide() — empty nodes → abstain ──────────────────────────
{
  const sources: SourceRecord[] = [
    { id: "s1", label: "X", tier: 1, url: "https://example.org/x", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [],
    terminus: { sourceId: "s1", tier: 1 },
  };
  const d = decide("test", chain);
  assert(d.kind === "abstain", `empty nodes → abstain (got ${d.kind})`);
}

// ── Test 9: isValidChain — happy path ─────────────────────────────────
{
  const sources: SourceRecord[] = [
    { id: "s1", label: "X", tier: 1, url: "https://example.org/x", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "n", sourceId: "s1", extractedAt: "2026-08-11" }],
    terminus: { sourceId: "s1", tier: 1 },
  };
  const r = isValidChain(chain, sources);
  assert(r.ok === true, `valid chain returns ok=true (got ${r.ok})`);
}

// ── Test 10: isValidChain — unknown sourceId → invalid ────────────────
{
  const sources: SourceRecord[] = [];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "n", sourceId: "missing", extractedAt: "2026-08-11" }],
    terminus: { sourceId: "missing", tier: 1 },
  };
  const r = isValidChain(chain, sources);
  assert(r.ok === false, `unknown sourceId returns ok=false`);
  if (!r.ok) assert(r.reason.includes("missing"), "reason names the missing source");
}

// ── Test 11: fact-check-register.md exists and is non-trivial ─────────
{
  const fcr = readFileSync(`${ROOT}/project/strategy/fact-check-register.md`, "utf8");
  assert(fcr.length > 5000, `fact-check-register.md is >5000 chars (got ${fcr.length})`);
  assert(fcr.includes("Tier") || fcr.includes("tier-"),
    "fact-check-register mentions Tier (any case)");
  assert(fcr.includes("## The register"), "fact-check-register has '## The register'");
}

// ── Test 12: fact-check-register has tier-1 anchors ──────────────────
{
  const fcr = readFileSync(`${ROOT}/project/strategy/fact-check-register.md`, "utf8");
  const urlMatches = fcr.match(/https:\/\/[^`\s]+/g) ?? [];
  assert(urlMatches.length >= 10, `fact-check-register has ≥10 URLs (got ${urlMatches.length})`);
  const legislationGouvUk = urlMatches.filter((u) => u.includes("legislation.gov.uk"));
  assert(legislationGouvUk.length >= 3, `≥3 legislation.gov.uk URLs (got ${legislationGouvUk.length})`);
}

// ── Test 13: fact-check-register covers all axes ──────────────────────
{
  const fcr = readFileSync(`${ROOT}/project/strategy/fact-check-register.md`, "utf8");
  // Should reference key axes from the panel.
  for (const axis of ["1.1", "1.4", "3.1", "5.4", "6.1", "9.5", "13.1", "14.2"]) {
    assert(fcr.includes(axis), `fact-check-register references axis ${axis}`);
  }
}

// ── Test 14: NOT_SHIPPED entries map to honest-gaps in panel ─────────
{
  const panel = readFileSync(`${ROOT}/project/strategy/100-judge-panel.md`, "utf8");
  const gapsBlock = panel.match(/## 5\. Honest gaps[\s\S]*?(?=## )/)?.[0] ?? "";
  const gapRows = (gapsBlock.match(/^\| G\d+ \|/gm) ?? []);
  assert(gapRows.length >= 5, `panel honest gaps ≥5 (got ${gapRows.length})`);
  // NOT_SHIPPED count should be at least the honest-gaps count.
  assert(NOT_SHIPPED.length >= gapRows.length,
    `NOT_SHIPPED count ≥ panel honest-gaps count (${NOT_SHIPPED.length} vs ${gapRows.length})`);
}

// ── Test 15: decide() — tier-2 + 0.7 confidence → surface ────────────
{
  const sources: SourceRecord[] = [
    { id: "s2", label: "BAILII headnote", tier: 2, url: "https://bailii.org/case", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "n", sourceId: "s2", extractedAt: "2026-08-11", confidence: { belief: 0.7, plausibility: 0.3 } }],
    terminus: { sourceId: "s2", tier: 2 },
  };
  const d = decide("test", chain);
  assert(d.kind === "surface", `tier-2 + 0.7 confidence → surface (got ${d.kind})`);
}

// ── Test 16: decide() — tier-4 (LLM) → abstain even with high conf ───
{
  const sources: SourceRecord[] = [
    { id: "llm", label: "LLM synthesis", tier: 4, url: "https://example.org/llm", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "n", sourceId: "llm", extractedAt: "2026-08-11", confidence: { belief: 0.99, plausibility: 0.01 } }],
    terminus: { sourceId: "llm", tier: 4 },
  };
  const d = decide("test", chain);
  assert(d.kind === "abstain", `tier-4 → abstain (got ${d.kind})`);
}

// ── Test 17: SHIPPED names are unique ─────────────────────────────────
{
  const names = SHIPPED.map((s) => s.name);
  const uniq = new Set(names);
  assert(uniq.size === names.length, `SHIPPED names are unique (got ${uniq.size}/${names.length})`);
}

// ── Test 18: NOT_SHIPPED names are unique ─────────────────────────────
{
  const names = NOT_SHIPPED.map((n) => n.name);
  const uniq = new Set(names);
  assert(uniq.size === names.length, `NOT_SHIPPED names are unique (got ${uniq.size}/${names.length})`);
}

// ── Test 19: fact-check-register timestamps are recent ────────────────
{
  const fcr = readFileSync(`${ROOT}/project/strategy/fact-check-register.md`, "utf8");
  const dates = fcr.match(/202\d-\d{2}-\d{2}/g) ?? [];
  const recent = dates.filter((d) => d.startsWith("2026-08"));
  assert(recent.length >= 10, `≥10 '2026-08-*' dates in fact-check-register (got ${recent.length})`);
}

// ── Test 20: provenance chain terminus must be in registry ────────────
{
  const sources: SourceRecord[] = [
    { id: "s1", label: "X", tier: 1, url: "https://example.org/x", verifiedAt: "2026-08-11" },
    { id: "s2", label: "Y", tier: 2, url: "https://example.org/y", verifiedAt: "2026-08-11" },
  ];
  const chain: ProvenanceChain = {
    claim: "test",
    nodes: [{ claim: "n", sourceId: "s1", extractedAt: "2026-08-11" }],
    terminus: { sourceId: "missing", tier: 1 },
  };
  const r = isValidChain(chain, sources);
  assert(r.ok === false, "missing terminus sourceId is invalid");
}

// ── Test 21: SHIPPED count ≥ NOT_SHIPPED count — we ship more ────────
assert(SHIPPED.length >= NOT_SHIPPED.length,
  `SHIPPED ≥ NOT_SHIPPED (got ${SHIPPED.length} vs ${NOT_SHIPPED.length})`);

// ── Test 22: fact-check-register resolves in panel ───────────────────
{
  const panel = readFileSync(`${ROOT}/project/strategy/100-judge-panel.md`, "utf8");
  assert(panel.includes("fact-check-register"),
    "panel references fact-check-register");
}

// ── Test 23: story-60s.md has the truthful Setup/Conflict arc ────────
{
  const story = readFileSync(`${ROOT}/docs/story-60s.md`, "utf8");
  // Story should not use absolute superlatives.
  for (const s of ["world's first", "revolutionary", "guaranteed"]) {
    assert(!story.toLowerCase().includes(s), `story-60s avoids superlative "${s}"`);
  }
  // Story must mention rubric-immune artefact.
  assert(story.includes("rubric-immune"), "story-60s mentions rubric-immune artefact");
}

// ── Report ─────────────────────────────────────────────────────────────
console.log(`\nFreeLeased truth tests: ${passed}/${passed + failed} passing`);
if (failed) {
  console.log("FAILURES:");
  fails.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("All truth assertions passed.");
  process.exit(0);
}
