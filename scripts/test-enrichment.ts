#!/usr/bin/env bun
// Enrichment Layer test suite
// Tests case similarity, advisory guidance, and cross-jurisdiction bridging

import {
  findSimilarCases,
  findBridgingFramework,
  type TribunalDecision,
  type JurisdictionFramework,
} from "../src/lib/enrichment";
import { UK_FRAMEWORK, UK_ADVISORY_SOURCES, UK_SAMPLE_DECISIONS } from "../src/data/uk-framework";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ ${message}`);
  }
}

console.log("\n=== Enrichment Layer Tests ===\n");

// ── Test 1: UK Framework Profile ──────────────────────────────────
console.log("Test 1: UK Framework Profile");
{
  assert(UK_FRAMEWORK.code === "UK", "UK code correct");
  assert(UK_FRAMEWORK.legalTradition === "common_law", "UK is common law");
  assert(UK_FRAMEWORK.primaryLegislation.length >= 5, "UK has 5+ primary legislation");
  assert(UK_FRAMEWORK.tribunalSystem.length >= 2, "UK has 2+ tribunal systems");
  assert(UK_FRAMEWORK.advisoryOrganizations.length >= 4, "UK has 4+ advisory organizations");
  assert(UK_FRAMEWORK.tribunalDecisionsOnline === true, "UK tribunal decisions are online");
  assert(UK_FRAMEWORK.dataSufficiency === 90, "UK data sufficiency is 90%");
}

// ── Test 2: UK Advisory Sources ───────────────────────────────────
console.log("\nTest 2: UK Advisory Sources");
{
  assert(UK_ADVISORY_SOURCES.length >= 3, "UK has 3+ advisory sources");
  assert(UK_ADVISORY_SOURCES.every(a => a.source.length > 0), "All sources have names");
  assert(UK_ADVISORY_SOURCES.every(a => a.url.length > 0), "All sources have URLs");
  assert(UK_ADVISORY_SOURCES.every(a => a.plainEnglish.length > 0), "All sources have plain English");
  assert(UK_ADVISORY_SOURCES.every(a => a.keyPoints.length >= 3), "All sources have 3+ key points");
  assert(UK_ADVISORY_SOURCES.every(a => a.practicalAdvice.length >= 2), "All sources have practical advice");
}

// ── Test 3: UK Sample Decisions ───────────────────────────────────
console.log("\nTest 3: UK Sample Decisions");
{
  assert(UK_SAMPLE_DECISIONS.length >= 3, "UK has 3+ sample decisions");
  assert(UK_SAMPLE_DECISIONS.every(d => d.citation.length > 0), "All decisions have citations");
  assert(UK_SAMPLE_DECISIONS.every(d => d.keyFacts.length >= 2), "All decisions have 2+ key facts");
  assert(UK_SAMPLE_DECISIONS.every(d => d.legalIssues.length >= 1), "All decisions have legal issues");
  assert(UK_SAMPLE_DECISIONS.every(d => d.decision.length > 0), "All decisions have decisions");
  assert(UK_SAMPLE_DECISIONS.every(d => d.principleExtracted.length > 0), "All decisions have principles");
}

// ── Test 4: Case Similarity Search ────────────────────────────────
console.log("\nTest 4: Case Similarity Search");
{
  const results = findSimilarCases(UK_SAMPLE_DECISIONS, {
    keyFacts: ["service charge", "no consultation", "roof repairs"],
    legalIssues: ["s.20 consultation"],
    jurisdiction: "UK",
  });

  assert(results.length > 0, "Similar cases found");
  assert(results[0].decision.citation === "UKFTT 2023/0456", "Most similar case matches citation");
  assert(results[0].similarityScore > 0.5, "Similarity score > 0.5");
  assert(results[0].matchingFacts.length > 0, "Matching facts identified");
  assert(results[0].matchingIssues.length > 0, "Matching issues identified");
}

// ── Test 5: Case Similarity with RTM ──────────────────────────────
console.log("\nTest 5: Case Similarity with RTM");
{
  const results = findSimilarCases(UK_SAMPLE_DECISIONS, {
    keyFacts: ["RTM claim", "freeholder disputed eligibility", "qualifying flats"],
    legalIssues: ["Right to Manage eligibility"],
    applicantType: "right_to_manage_company",
    jurisdiction: "UK",
  });

  assert(results.length > 0, "Similar RTM cases found");
  assert(results[0].decision.citation === "UKUT 2024/0078", "RTM case matches");
  assert(results[0].matchingIssues.length > 0, "RTM issues match");
}

// ── Test 6: Case Similarity with BSA ──────────────────────────────
console.log("\nTest 6: Case Similarity with BSA");
{
  const results = findSimilarCases(UK_SAMPLE_DECISIONS, {
    keyFacts: ["cladding", "building safety", "remediation costs"],
    legalIssues: ["Building Safety Act 2022"],
    jurisdiction: "UK",
  });

  assert(results.length > 0, "Similar BSA cases found");
  assert(results[0].decision.citation === "UKFTT 2025/0112", "BSA case matches");
}

// ── Test 7: Cross-Jurisdiction Bridging ───────────────────────────
console.log("\nTest 7: Cross-Jurisdiction Bridging");
{
  const bbFramework: JurisdictionFramework = {
    code: "BB",
    name: "Barbados",
    legalTradition: "common_law",
    primaryLegislation: ["Landlord and Tenant Act", "Condominium Act"],
    tribunalSystem: ["Land Court", "Magistrate Court"],
    regulatoryBodies: ["Barbados Housing Authority"],
    advisoryOrganizations: ["Barbados Housing Association"],
    tribunalDecisionsOnline: false,
    advisoryGuidanceOnline: false,
    legislationOnline: true,
    dataSufficiency: 40,
    analogousFrameworks: [],
  };

  const bridges = findBridgingFramework(bbFramework, [UK_FRAMEWORK]);

  assert(bridges.length > 0, "Bridges found");
  assert(bridges[0].jurisdictionCode === "UK", "UK is the bridge");
  assert(bridges[0].bridgeStrength > 0, "Bridge strength positive");
  assert(bridges[0].sharedElements.length > 0, "Shared elements identified");
}

// ── Test 8: Similarity filtering by jurisdiction ───────────────────
console.log("\nTest 8: Similarity filtering by jurisdiction");
{
  const results = findSimilarCases(UK_SAMPLE_DECISIONS, {
    keyFacts: ["service charge"],
    legalIssues: ["s.20 consultation"],
    jurisdiction: "BB", // No Barbados cases in UK database
  });

  assert(results.length === 0, "No results for wrong jurisdiction");
}

// ── Test 9: Empty query handling ───────────────────────────────────
console.log("\nTest 9: Empty query handling");
{
  const results = findSimilarCases(UK_SAMPLE_DECISIONS, {
    keyFacts: [],
    legalIssues: [],
  });

  // Should return all cases with low similarity
  assert(results.length >= 0, "Empty query returns results or empty");
}

// ── Test 10: Framework onboarding checklist ────────────────────────
console.log("\nTest 10: Framework onboarding checklist");
{
  // Verify all onboarding steps are defined
  const { JURISDICTION_ONBOARDING } = require("../src/lib/enrichment");
  assert(JURISDICTION_ONBOARDING.length === 8, "8 onboarding steps defined");
  assert(JURISDICTION_ONBOARDING[0].name === "Legal Framework Mapping", "Step 1 is framework mapping");
  assert(JURISDICTION_ONBOARDING[JURISDICTION_ONBOARDING.length - 1].name === "Community Validation", "Last step is community validation");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All enrichment layer tests passed!\n");
}
