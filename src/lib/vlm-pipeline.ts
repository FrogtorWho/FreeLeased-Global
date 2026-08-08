// VLM Pipeline; document ingestion and structured extraction.
//
// Converts unstructured documents (PDFs, scans, images) into structured
// data using Vision-Language Models. The VLM is the bridge between
// "messy real world" and "clean deterministic analysis."
//
// In production, this calls OpenRouter with Llama-3.2-11B-Vision or GPT-4V.
// For now, it provides the schema and deterministic validation.

// ── Document Types ────────────────────────────────────────────────

export type DocumentType =
  | "lease"
  | "service_charge"
  | "building_safety"
  | "planning"
  | "correspondence"
  | "tribunal_decision"
  | "other";

export interface ExtractedDocument {
  id: string;
  type: DocumentType;
  originalFilename: string;
  extractedAt: Date;
  pageCount: number;
  confidence: number;
  extractionMethod: "vlm" | "ocr" | "manual";

  // Structured fields
  parties: Party[];
  clauses: Clause[];
  dates: DateField[];
  amounts: AmountField[];
  references: Reference[];

  // Raw text (for search and audit)
  rawText: string;

  // Metadata
  metadata: Record<string, unknown>;
}

export interface Party {
  name: string;
  role: "landlord" | "tenant" | "freeholder" | "management_company" | "other";
  address?: string;
}

export interface Clause {
  id: string;
  text: string;
  section?: string;
  topic: string;
  riskLevel: "high" | "medium" | "low";
  statuteReferences: string[];
}

export interface DateField {
  label: string;
  value: Date;
  confidence: number;
}

export interface AmountField {
  label: string;
  value: number;
  currency: string;
  confidence: number;
}

export interface Reference {
  type: "statute" | "case_law" | "regulation" | "other";
  text: string;
  confidence: number;
}

// ── Extraction Schema ─────────────────────────────────────────────

export const EXTRACTION_SCHEMA = {
  lease: {
    required: ["parties", "clauses", "dates"],
    optional: ["amounts", "references"],
    fields: {
      parties: { min: 2, max: 10 },
      clauses: { min: 1, max: 100 },
      dates: { min: 1, max: 20 },
    },
  },
  service_charge: {
    required: ["amounts", "dates"],
    optional: ["parties", "clauses"],
    fields: {
      amounts: { min: 1, max: 50 },
      dates: { min: 1, max: 10 },
    },
  },
  building_safety: {
    required: ["clauses", "references"],
    optional: ["parties", "dates", "amounts"],
    fields: {
      clauses: { min: 1, max: 30 },
      references: { min: 0, max: 20 },
    },
  },
  planning: {
    required: ["references", "dates"],
    optional: ["parties", "clauses", "amounts"],
    fields: {
      references: { min: 1, max: 30 },
      dates: { min: 1, max: 10 },
    },
  },
  correspondence: {
    required: ["parties", "dates"],
    optional: ["clauses", "amounts", "references"],
    fields: {
      parties: { min: 2, max: 5 },
      dates: { min: 1, max: 5 },
    },
  },
  tribunal_decision: {
    required: ["references", "clauses"],
    optional: ["parties", "dates", "amounts"],
    fields: {
      references: { min: 1, max: 20 },
      clauses: { min: 1, max: 30 },
    },
  },
  other: {
    required: [],
    optional: ["parties", "clauses", "dates", "amounts", "references"],
    fields: {},
  },
};

// ── Validation Functions ──────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0..1
}

/**
 * Validate extracted document against schema.
 * Deterministic; no LLM involved.
 */
export function validateExtraction(doc: ExtractedDocument): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const schema = EXTRACTION_SCHEMA[doc.type] || EXTRACTION_SCHEMA.other;

  // Check required fields
  for (const field of schema.required) {
    const value = doc[field as keyof ExtractedDocument];
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (Array.isArray(value) && value.length === 0) {
      errors.push(`Required field is empty: ${field}`);
    }
  }

  // Check field counts
  for (const [field, limits] of Object.entries(schema.fields)) {
    const value = doc[field as keyof ExtractedDocument];
    if (Array.isArray(value)) {
      if (value.length < limits.min) {
        warnings.push(`Field ${field} has ${value.length} items, minimum is ${limits.min}`);
      }
      if (value.length > limits.max) {
        warnings.push(`Field ${field} has ${value.length} items, maximum is ${limits.max}`);
      }
    }
  }

  // Check confidence
  if (doc.confidence < 0.5) {
    warnings.push(`Low extraction confidence: ${doc.confidence.toFixed(2)}`);
  }

  // Check raw text length
  if (doc.rawText.length < 100) {
    warnings.push(`Very short extracted text: ${doc.rawText.length} characters`);
  }

  // Calculate score
  const maxScore = 1;
  const errorPenalty = errors.length * 0.2;
  const warningPenalty = warnings.length * 0.05;
  const score = Math.max(0, maxScore - errorPenalty - warningPenalty);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score,
  };
}

// ── Document Classification ───────────────────────────────────────

/**
 * Classify document type based on extracted content.
 * Deterministic; keyword matching, no LLM.
 */
export function classifyDocument(text: string): DocumentType {
  const lower = text.toLowerCase();

  // Lease indicators
  if (lower.includes("lease") || lower.includes("tenancy agreement") || lower.includes("ast")) {
    return "lease";
  }

  // Service charge indicators
  if (lower.includes("service charge") || lower.includes("service charges") || lower.includes("maintenance fund")) {
    return "service_charge";
  }

  // Building safety indicators
  if (lower.includes("building safety") || lower.includes("cladding") || lower.includes("remediation") || lower.includes("fire safety")) {
    return "building_safety";
  }

  // Planning indicators
  if (lower.includes("planning permission") || lower.includes("planning application") || lower.includes("development control")) {
    return "planning";
  }

  // Tribunal decision indicators
  if (lower.includes("tribunal") || lower.includes("first-tier") || lower.includes("upper tribunal")) {
    return "tribunal_decision";
  }

  // Correspondence indicators
  if (lower.includes("dear") || lower.includes("yours faithfully") || lower.includes("yours sincerely")) {
    return "correspondence";
  }

  return "other";
}

// ── VLM Extraction (Placeholder) ─────────────────────────────────

/**
 * Extract structured data from document using VLM.
 * In production, this calls OpenRouter with a VLM model.
 * For now, returns simulated extraction based on document type.
 */
export async function extractWithVLM(
  documentId: string,
  filename: string,
  text: string,
  documentType?: DocumentType,
): Promise<ExtractedDocument> {
  const type = documentType || classifyDocument(text);

  // Simulate VLM extraction based on document type
  const extraction: ExtractedDocument = {
    id: documentId,
    type,
    originalFilename: filename,
    extractedAt: new Date(),
    pageCount: 1,
    confidence: 0.85,
    extractionMethod: "vlm",

    parties: extractParties(text, type),
    clauses: extractClauses(text, type),
    dates: extractDates(text),
    amounts: extractAmounts(text),
    references: extractReferences(text),

    rawText: text.slice(0, 10000), // Limit raw text
    metadata: {
      extractedBy: "vlm-pipeline",
      model: "meta-llama/llama-3.2-11b-vision-instruct",
      cost: 0.001,
    },
  };

  return extraction;
}

// ── Extraction Helpers (Deterministic) ────────────────────────────

function extractParties(text: string, type: DocumentType): Party[] {
  const parties: Party[] = [];

  // Simple pattern matching for party names
  const landlordPatterns = [
    /(?:landlord|lessor|freeholder)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/g,
    /(?:managed by|management company)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/g,
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s*\(landlord\)/gi,
  ];

  const tenantPatterns = [
    /(?:tenant|lessee|resident)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/g,
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s*\(tenant\)/gi,
  ];

  for (const pattern of landlordPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      parties.push({ name: match[1], role: "landlord" });
    }
  }

  for (const pattern of tenantPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      parties.push({ name: match[1], role: "tenant" });
    }
  }

  return parties.slice(0, 10); // Limit
}

function extractClauses(text: string, type: DocumentType): Clause[] {
  const clauses: Clause[] = [];

  // Split into sentences/paragraphs
  const segments = text.split(/\n\s*\n|\.\s+/).filter(s => s.length > 20);

  for (let i = 0; i < Math.min(segments.length, 50); i++) {
    const segment = segments[i].trim();
    if (segment.length < 20) continue;

    // Determine risk level based on keywords
    let riskLevel: "high" | "medium" | "low" = "low";
    if (/waive|forfeit|penalty|without notice|at any time/i.test(segment)) {
      riskLevel = "high";
    } else if (/may|could|potentially|subject to/i.test(segment)) {
      riskLevel = "medium";
    }

    clauses.push({
      id: `clause_${i}`,
      text: segment.slice(0, 500),
      topic: inferTopic(segment),
      riskLevel,
      statuteReferences: [],
    });
  }

  return clauses;
}

function extractDates(text: string): DateField[] {
  const dates: DateField[] = [];

  // Common date patterns
  const patterns = [
    { label: "commencement", pattern: /commencement\s+date[:\s]+(\d{1,2}[\s\/-]\w+[\s\/-]\d{2,4})/i },
    { label: "expiry", pattern: /expir[ey]\s+date[:\s]+(\d{1,2}[\s\/-]\w+[\s\/-]\d{2,4})/i },
    { label: "notice", pattern: /notice\s+period[:\s]+(\d+)\s+(?:days?|months?|weeks?)/i },
  ];

  for (const { label, pattern } of patterns) {
    const match = text.match(pattern);
    if (match) {
      dates.push({ label, value: new Date(match[1]), confidence: 0.8 });
    }
  }

  return dates;
}

function extractAmounts(text: string): AmountField[] {
  const amounts: AmountField[] = [];

  // Common amount patterns
  const patterns = [
    { label: "rent", pattern: /rent[:\s]+(?:£|\$|€)\s*([\d,]+(?:\.\d{2})?)/i },
    { label: "service_charge", pattern: /service\s+charge[:\s]+(?:£|\$|€)\s*([\d,]+(?:\.\d{2})?)/i },
    { label: "deposit", pattern: /deposit[:\s]+(?:£|\$|€)\s*([\d,]+(?:\.\d{2})?)/i },
  ];

  for (const { label, pattern } of patterns) {
    const match = text.match(pattern);
    if (match) {
      amounts.push({
        label,
        value: parseFloat(match[1].replace(/,/g, "")),
        currency: "GBP",
        confidence: 0.85,
      });
    }
  }

  return amounts;
}

function extractReferences(text: string): Reference[] {
  const references: Reference[] = [];

  // Statute references
  const statutePatterns = [
    /(?:section|s\.)\s*(\d+)\s+(?:of\s+)?([A-Z][a-z]+\s+(?:Act|Act\s+\d{4}))/gi,
    /([A-Z][a-z]+\s+Act\s+\d{4})/gi,
  ];

  for (const pattern of statutePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      references.push({
        type: "statute",
        text: match[0],
        confidence: 0.9,
      });
    }
  }

  return references.slice(0, 20); // Limit
}

function inferTopic(text: string): string {
  const lower = text.toLowerCase();

  if (/rent|payment|arrears/i.test(lower)) return "Rent & Payment";
  if (/repair|maintenance|defect/i.test(lower)) return "Repairs & Maintenance";
  if (/service\s*charge|cost|expense/i.test(lower)) return "Service Charges";
  if (/notice|termination|forfeit/i.test(lower)) return "Notice & Termination";
  if (/deposit|security/i.test(lower)) return "Deposit";
  if (/entry|access|quiet\s*enjoyment/i.test(lower)) return "Access & Entry";
  if (/insurance|indemnity/i.test(lower)) return "Insurance";
  if (/assignment|subletting|transfer/i.test(lower)) return "Assignment & Subletting";

  return "General";
}
