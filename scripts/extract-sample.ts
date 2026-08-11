// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Extract sample lease deterministically (no API key).
//
// Runs the local [`src/lib/vlm-pipeline.ts`](src/lib/vlm-pipeline.ts:251)
// `extractWithVLM` over `project/demo/sample-lease.txt`, then writes the
// structured JSON to `project/demo/nebius-extraction.json` and prints a
// one-line summary.
//
// This is the deterministic fallback path described in the Stage 7 #1
// brief ("wire extractWithVLM to local extraction when no API key is
// configured"). It runs anywhere Node 22+ runs because the vlm-pipeline
// helpers (`extractParties`, `extractClauses`, `extractDates`,
// `extractAmounts`, `extractReferences`) are pure regex/keyword logic —
// no LLM call.
//
// Usage: node --experimental-strip-types scripts/extract-sample.ts
//        (or `bun scripts/extract-sample.ts`).

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { extractWithVLM, validateExtraction } from "../src/lib/vlm-pipeline.ts";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const INPUT = join(ROOT, "project", "demo", "sample-lease.txt");
const OUTPUT = join(ROOT, "project", "demo", "nebius-extraction.json");

async function main() {
  const text = readFileSync(INPUT, "utf8");
  const filename = "sample-lease.txt";
  const id = `local_extract_${Date.now()}`;

  // `extractWithVLM` falls back to deterministic regex extraction when
  // no Nebius API key is present (see [`vlm-pipeline.ts:251`](src/lib/vlm-pipeline.ts:251)).
  // The classifyDocument() helper picks "lease" from the keyword "tenancy agreement"
  // + "landlord may enter" — confirmed by hand on the sample.
  const extraction = await extractWithVLM(id, filename, text);
  const validation = validateExtraction(extraction);

  const out = {
    documentId: extraction.id,
    filename: extraction.originalFilename,
    type: extraction.type,
    extractedAt: extraction.extractedAt.toISOString(),
    confidence: extraction.confidence,
    extractionMethod: extraction.extractionMethod,
    validation: {
      valid: validation.valid,
      score: validation.score,
      errors: validation.errors,
      warnings: validation.warnings,
    },
    counts: {
      parties: extraction.parties.length,
      clauses: extraction.clauses.length,
      dates: extraction.dates.length,
      amounts: extraction.amounts.length,
      references: extraction.references.length,
    },
    parties: extraction.parties,
    clauses: extraction.clauses,
    dates: extraction.dates,
    amounts: extraction.amounts,
    references: extraction.references,
    rawTextLength: extraction.rawText.length,
    metadata: {
      ...extraction.metadata,
      extractedBy: "vlm-pipeline (deterministic fallback — no API key)",
      sourceFile: "project/demo/sample-lease.txt",
      scriptSource: "scripts/extract-sample.ts",
    },
  };

  writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  // 1-line summary
  console.log(
    [
      `[extract-sample] type=${out.type}`,
      `valid=${out.validation.valid}`,
      `score=${out.validation.score.toFixed(2)}`,
      `parties=${out.counts.parties}`,
      `clauses=${out.counts.clauses}`,
      `dates=${out.counts.dates}`,
      `amounts=${out.counts.amounts}`,
      `refs=${out.counts.references}`,
      `→ ${OUTPUT.replace(ROOT + "\\", "")}`,
    ].join(" "),
  );
}

main().catch((err) => {
  console.error("[extract-sample] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});