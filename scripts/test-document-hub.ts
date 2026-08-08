// Test suite for Document Capture Pipeline, OCR Pipeline, Templates, and Community Signing.

import { strict as assert } from "node:assert";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result.then(() => { passed++; console.log(`  ✅ ${name}`); })
        .catch(e => { failed++; console.log(`  ❌ ${name}: ${e.message}`); });
    } else {
      passed++;
      console.log(`  ✅ ${name}`);
    }
  } catch (e: any) {
    failed++;
    console.log(`  ❌ ${name}: ${e.message}`);
  }
}

// ── OCR Pipeline Tests ────────────────────────────────────────

console.log("\n📸 OCR Pipeline:");

test("classifyDocument identifies lease", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("This tenancy agreement is between the lessee and the lessor for the demised premises at 12 Harbour Road. AST granted under the Housing Act 1988...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "lease");
});

test("classifyDocument identifies service charge", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Service charge demand for the period ending March 2026...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "service_charge");
});

test("classifyDocument identifies section 20 notice", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Notice under Section 20 of the Landlord and Tenant Act 1985 regarding major works consultation...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "notice_s20");
});

test("classifyDocument identifies RTM notice", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Notice of intent to exercise the Right to Manage pursuant to section 72 of the CLRA 2002...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "notice_rtm");
});

test("classifyDocument identifies building safety concern", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Building safety concern regarding cladding and fire safety remediation under the BSA 2022...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "building_safety");
});

test("classifyDocument identifies tribunal notice", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Notice of hearing at the First-tier Tribunal (Property Chamber)...");
  assert.ok(result.length > 0);
  assert.equal(result[0].type, "tribunal_notice");
});

test("classifyDocument returns empty for unrelated text", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("The weather is nice today and I went for a walk...");
  const highConf = result.filter((r: any) => r.confidence > 0.5);
  assert.equal(highConf.length, 0);
});

test("classifyDocument ranks results by confidence", () => {
  const { classifyDocument } = require("../src/lib/ocr-pipeline");
  const result = classifyDocument("Section 20 service charge major works lease tenant freeholder...");
  for (let i = 1; i < result.length; i++) {
    assert.ok(result[i - 1].confidence >= result[i].confidence);
  }
});

// ── Template Engine Tests ─────────────────────────────────────

console.log("\n📝 Template Engine:");

test("TEMPLATES has entries for all 4 jurisdictions", () => {
  const { TEMPLATES } = require("../src/lib/templates");
  const jurisdictions = new Set(TEMPLATES.map((t: any) => t.jurisdictionCode));
  assert.ok(jurisdictions.has("UK"));
  assert.ok(jurisdictions.has("KY"));
  assert.ok(jurisdictions.has("BB"));
  assert.ok(jurisdictions.has("JM"));
});

test("filterTemplates by jurisdiction", () => {
  const { filterTemplates } = require("../src/lib/templates");
  const uk = filterTemplates("UK");
  assert.ok(uk.length > 0);
  assert.ok(uk.every((t: any) => t.jurisdictionCode === "UK"));
});

test("filterTemplates by category", () => {
  const { filterTemplates } = require("../src/lib/templates");
  const rtm = filterTemplates(undefined, "rtm");
  assert.ok(rtm.length > 0);
  assert.ok(rtm.every((t: any) => t.category === "rtm"));
});

test("filterTemplates by tier", () => {
  const { filterTemplates } = require("../src/lib/templates");
  const free = filterTemplates(undefined, undefined, "free");
  assert.ok(free.length > 0);
  assert.ok(free.every((t: any) => t.tier === "free"));
});

test("renderTemplate substitutes variables", () => {
  const { TEMPLATES, renderTemplate } = require("../src/lib/templates");
  const tmpl = TEMPLATES.find((t: any) => t.id === "uk_s20_notice");
  const allVars: Record<string, string> = {};
  for (const v of tmpl.variables) {
    allVars[v.name] = v.defaultValue || `Test ${v.label}`;
  }
  const { text, missingRequired } = renderTemplate(tmpl, allVars);
  assert.ok(text.includes("Test Recipient Name"));
  assert.equal(missingRequired.length, 0);
});

test("renderTemplate flags missing required variables", () => {
  const { TEMPLATES, renderTemplate } = require("../src/lib/templates");
  const tmpl = TEMPLATES.find((t: any) => t.id === "uk_s20_notice");
  const { missingRequired } = renderTemplate(tmpl, {});
  assert.ok(missingRequired.length > 0);
  assert.ok(missingRequired.includes("recipient_name"));
});

test("getJurisdictions returns 4 jurisdictions", () => {
  const { getJurisdictions } = require("../src/lib/templates");
  const j = getJurisdictions();
  assert.equal(j.length, 4);
  assert.ok(j.every((x: any) => x.templateCount > 0));
});

test("Templates have legal references", () => {
  const { TEMPLATES } = require("../src/lib/templates");
  for (const tmpl of TEMPLATES) {
    assert.ok(tmpl.legalRefs.length > 0, `Template ${tmpl.id} has no legal refs`);
  }
});

test("Templates have required variables defined", () => {
  const { TEMPLATES } = require("../src/lib/templates");
  for (const tmpl of TEMPLATES) {
    assert.ok(tmpl.variables.length > 0, `Template ${tmpl.id} has no variables`);
    assert.ok(tmpl.variables.some((v: any) => v.required), `Template ${tmpl.id} has no required variables`);
  }
});

// ── Community Signing Tests ───────────────────────────────────

console.log("\n✍️  Community Signing:");

test("createSigningCeremony creates ceremony with correct members", () => {
  const { createSigningCeremony } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 3, [
    { id: "m1", displayName: "Resident A" },
    { id: "m2", displayName: "Resident B" },
    { id: "m3", displayName: "Resident C" },
  ]);
  assert.equal(ceremony.documentId, "doc-1");
  assert.equal(ceremony.requiredSigs, 3);
  assert.equal(ceremony.collectedSigs, 0);
  assert.equal(ceremony.signatories.length, 3);
  assert.equal(ceremony.status, "collecting_signatures");
});

test("recordSignature adds signature and updates count", () => {
  const { createSigningCeremony, recordSignature } = require("../src/lib/signing");
  let ceremony = createSigningCeremony("doc-1", "RTM Notice", 3, [
    { id: "m1", displayName: "Resident A" },
    { id: "m2", displayName: "Resident B" },
    { id: "m3", displayName: "Resident C" },
  ]);
  const result = recordSignature(ceremony, "m1");
  assert.ok(result.success);
  assert.equal(result.ceremony.collectedSigs, 1);
  assert.ok(result.ceremony.signatories[0].signed);
});

test("recordSignature rejects non-member", () => {
  const { createSigningCeremony, recordSignature } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 2, [
    { id: "m1", displayName: "Resident A" },
  ]);
  const result = recordSignature(ceremony, "m999");
  assert.equal(result.success, false);
  assert.ok(result.error);
});

test("recordSignature rejects duplicate signature", () => {
  const { createSigningCeremony, recordSignature } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 2, [
    { id: "m1", displayName: "Resident A" },
    { id: "m2", displayName: "Resident B" },
  ]);
  recordSignature(ceremony, "m1");
  const result = recordSignature(ceremony, "m1");
  assert.equal(result.success, false);
  assert.ok(result.error?.includes("already signed"));
});

test("ceremony transitions to 'ready' when threshold met", () => {
  const { createSigningCeremony, recordSignature } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 2, [
    { id: "m1", displayName: "Resident A" },
    { id: "m2", displayName: "Resident B" },
  ]);
  recordSignature(ceremony, "m1");
  recordSignature(ceremony, "m2");
  assert.equal(ceremony.status, "ready");
  assert.equal(ceremony.collectedSigs, 2);
});

test("isReadyToSend returns correct state", () => {
  const { createSigningCeremony, recordSignature, isReadyToSend } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 2, [
    { id: "m1", displayName: "Resident A" },
    { id: "m2", displayName: "Resident B" },
  ]);
  assert.equal(isReadyToSend(ceremony), false);
  recordSignature(ceremony, "m1");
  assert.equal(isReadyToSend(ceremony), false);
  recordSignature(ceremony, "m2");
  assert.equal(isReadyToSend(ceremony), true);
});

test("signingSummary computes correct percentages", () => {
  const { createSigningCeremony, recordSignature, signingSummary } = require("../src/lib/signing");
  const ceremony = createSigningCeremony("doc-1", "RTM Notice", 4, [
    { id: "m1", displayName: "A" },
    { id: "m2", displayName: "B" },
    { id: "m3", displayName: "C" },
    { id: "m4", displayName: "D" },
  ]);
  recordSignature(ceremony, "m1");
  recordSignature(ceremony, "m3");
  const summary = signingSummary(ceremony);
  assert.equal(summary.total, 4);
  assert.equal(summary.signed, 2);
  assert.equal(summary.pending, 2);
  assert.equal(summary.percentage, 50);
  assert.equal(summary.ready, false);
});

// Wait for async tests
setTimeout(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}, 5000);
