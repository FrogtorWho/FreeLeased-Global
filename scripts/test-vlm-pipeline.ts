#!/usr/bin/env bun
// VLM Pipeline test suite
// Tests document classification, extraction, validation, and helpers

import {
  classifyDocument,
  validateExtraction,
  extractWithVLM,
  type ExtractedDocument,
} from "../src/lib/vlm-pipeline";

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

console.log("\n=== VLM Pipeline Tests ===\n");

// ── Test 1: Document classification ───────────────────────────────
console.log("Test 1: Document classification");
{
  assert(classifyDocument("This lease agreement is between...") === "lease", "Classifies lease");
  assert(classifyDocument("Service charge budget for 2026") === "service_charge", "Classifies service charge");
  assert(classifyDocument("Building safety remediation notice") === "building_safety", "Classifies building safety");
  assert(classifyDocument("Planning permission application") === "planning", "Classifies planning");
  assert(classifyDocument("First-tier Tribunal decision") === "tribunal_decision", "Classifies tribunal decision");
  assert(classifyDocument("Dear Sir/Madam, I write to...") === "correspondence", "Classifies correspondence");
  assert(classifyDocument("Random text about weather") === "other", "Classifies other");
}

// ── Test 2: Extraction validation ─────────────────────────────────
console.log("\nTest 2: Extraction validation");
{
  const validDoc: ExtractedDocument = {
    id: "doc_1",
    type: "lease",
    originalFilename: "lease.pdf",
    extractedAt: new Date(),
    pageCount: 1,
    confidence: 0.9,
    extractionMethod: "vlm",
    parties: [{ name: "Landlord Ltd", role: "landlord" }, { name: "John Smith", role: "tenant" }],
    clauses: [{ id: "c1", text: "The tenant shall pay rent monthly", topic: "Rent & Payment", riskLevel: "low", statuteReferences: [] }],
    dates: [{ label: "commencement", value: new Date(), confidence: 0.9 }],
    amounts: [],
    references: [],
    rawText: "Lease agreement between Landlord Ltd and John Smith for the premises at 123 Main Street.",
    metadata: {},
  };

  const result = validateExtraction(validDoc);
  assert(result.valid === true, "Valid document passes validation");
  assert(result.score > 0.8, "Valid document has high score");
  assert(result.errors.length === 0, "Valid document has no errors");
}

// ── Test 3: Invalid extraction ────────────────────────────────────
console.log("\nTest 3: Invalid extraction");
{
  const invalidDoc: ExtractedDocument = {
    id: "doc_2",
    type: "lease",
    originalFilename: "incomplete.pdf",
    extractedAt: new Date(),
    pageCount: 1,
    confidence: 0.3,
    extractionMethod: "vlm",
    parties: [],
    clauses: [],
    dates: [],
    amounts: [],
    references: [],
    rawText: "Short text",
    metadata: {},
  };

  const result = validateExtraction(invalidDoc);
  assert(result.valid === false, "Invalid document fails validation");
  assert(result.errors.length > 0, "Invalid document has errors");
  assert(result.warnings.some(w => w.includes("Low extraction confidence")), "Low confidence warning");
}

// ── Test 4: VLM extraction ────────────────────────────────────────
console.log("\nTest 4: VLM extraction");
{
  const doc = await extractWithVLM(
    "doc_3",
    "lease.pdf",
    "This lease agreement is between Landlord Ltd (landlord) and John Smith (tenant). The rent is £1,200 per month. Section 20 of the Landlord and Tenant Act 1985 applies.",
    "lease",
  );

  assert(doc.id === "doc_3", "Document ID correct");
  assert(doc.type === "lease", "Document type correct");
  assert(doc.parties.length >= 1, "Parties extracted");
  assert(doc.rawText.length > 0, "Raw text present");
  assert(doc.confidence > 0, "Confidence positive");
  assert(doc.metadata.extractedBy === "vlm-pipeline", "Extraction method recorded");
}

// ── Test 5: Deterministic helpers ─────────────────────────────────
console.log("\nTest 5: Deterministic helpers");
{
  const doc1 = await extractWithVLM("d1", "test.txt", "This is a lease agreement", "lease");
  const doc2 = await extractWithVLM("d1", "test.txt", "This is a lease agreement", "lease");

  assert(
    JSON.stringify(doc1.clauses) === JSON.stringify(doc2.clauses),
    "Extraction is deterministic"
  );
}

// ── Test 6: Document type handling ────────────────────────────────
console.log("\nTest 6: Document type handling");
{
  const types = ["lease", "service_charge", "building_safety", "planning", "correspondence", "tribunal_decision", "other"];

  for (const type of types) {
    const doc = await extractWithVLM(`doc_${type}`, `${type}.txt`, `Sample ${type} content`, type as any);
    assert(doc.type === type, `Handles ${type} type`);
  }
}

// ── Test 7: Confidence levels ─────────────────────────────────────
console.log("\nTest 7: Confidence levels");
{
  const doc = await extractWithVLM("doc_7", "test.txt", "Lease agreement content", "lease");
  assert(doc.confidence >= 0 && doc.confidence <= 1, "Confidence in [0, 1]");
  assert(doc.extractionMethod === "vlm", "Extraction method is vlm");
}

// ── Test 8: Raw text truncation ───────────────────────────────────
console.log("\nTest 8: Raw text truncation");
{
  const longText = "x".repeat(20000);
  const doc = await extractWithVLM("doc_8", "test.txt", longText, "other");
  assert(doc.rawText.length <= 10000, "Raw text truncated to 10000 chars");
}

// ── Test 9: Clause risk levels ────────────────────────────────────
console.log("\nTest 9: Clause risk levels");
{
  const doc = await extractWithVLM(
    "doc_9",
    "lease.pdf",
    "The tenant waives all repair obligations. The landlord may enter at any time without notice. Rent is £1000 per month.",
    "lease",
  );

  const highRisk = doc.clauses.filter(c => c.riskLevel === "high");
  const mediumRisk = doc.clauses.filter(c => c.riskLevel === "medium");
  const lowRisk = doc.clauses.filter(c => c.riskLevel === "low");

  assert(highRisk.length > 0, "High-risk clauses detected");
  assert(lowRisk.length > 0, "Low-risk clauses detected");
}

// ── Test 10: Topic inference ──────────────────────────────────────
console.log("\nTest 10: Topic inference");
{
  const doc = await extractWithVLM(
    "doc_10",
    "lease.pdf",
    "The tenant shall pay rent of £1000 per month. The landlord is responsible for structural repairs.",
    "lease",
  );

  assert(doc.clauses.some(c => c.topic === "Rent & Payment"), "Rent topic detected");
  assert(doc.clauses.some(c => c.topic === "Repairs & Maintenance"), "Repairs topic detected");
}

// ── Summary ────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\n✓ All VLM pipeline tests passed!\n");
}
