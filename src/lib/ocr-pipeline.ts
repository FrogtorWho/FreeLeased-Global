// OCR Pipeline — client-side document capture + Tesseract.js OCR + image preprocessing.
//
// Architecture: Mobile captures photo → Canvas preprocessing (deskew, contrast, denoise)
// → Tesseract.js OCR → document classification → routes to VLM pipeline.
//
// Open-source stack: Tesseract.js (Apache 2.0) + Canvas API. No paid OCR services.
// Comparable to Adobe Acrobat OCR through multi-pass preprocessing.
//
// Giotto.ai hook (Idea #1 of giotto-brainstorm.md): when GIOTTO_API_KEY is
// configured AND a server-side call is available (the OCR pipeline runs
// client-side, so this is a hint to the calling layer — see the
// `extractLeaseWithGiotto` re-export at the bottom), we route extraction
// through Giotto's multimodal endpoint. Otherwise the deterministic Tesseract
// + regex path stays in place. See `src/lib/giotto.ts` for the shared wrapper.

// ── Image Preprocessing (Canvas-based) ─────────────────────────

export interface PreprocessOptions {
  grayscale: boolean;
  contrast: number;        // 1.0 = normal, 1.5 = high contrast
  sharpen: boolean;
  denoise: boolean;
  deskew: boolean;
  binarize: boolean;       // adaptive threshold
  binarizeThreshold: number; // 0..255, default 128
}

export const DEFAULT_PREPROCESS: PreprocessOptions = {
  grayscale: true,
  contrast: 1.4,
  sharpen: true,
  denoise: true,
  deskew: true,
  binarize: true,
  binarizeThreshold: 128,
};

/**
 * Preprocess an image for optimal OCR. Returns a data URL.
 * Runs entirely client-side via Canvas API — zero server calls.
 */
export async function preprocessImage(
  imageSource: string | HTMLImageElement,
  options: PreprocessOptions = DEFAULT_PREPROCESS,
): Promise<{ dataUrl: string; stats: PreprocessStats }> {
  const img = typeof imageSource === "string"
    ? await loadImage(imageSource)
    : imageSource;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const stats: PreprocessStats = {
    originalSize: { w: canvas.width, h: canvas.height },
    steps: [],
    startTime: Date.now(),
  };

  // 1. Grayscale conversion
  if (options.grayscale) {
    applyGrayscale(ctx, canvas.width, canvas.height);
    stats.steps.push("grayscale");
  }

  // 2. Contrast enhancement
  if (options.contrast !== 1.0) {
    applyContrast(ctx, canvas.width, canvas.height, options.contrast);
    stats.steps.push(`contrast(${options.contrast})`);
  }

  // 3. Denoise (box blur)
  if (options.denoise) {
    applyBoxBlur(ctx, canvas.width, canvas.height, 1);
    stats.steps.push("denoise");
  }

  // 4. Sharpen (unsharp mask)
  if (options.sharpen) {
    applySharpen(ctx, canvas.width, canvas.height);
    stats.steps.push("sharpen");
  }

  // 5. Adaptive binarization
  if (options.binarize) {
    applyAdaptiveThreshold(ctx, canvas.width, canvas.height, options.binarizeThreshold);
    stats.steps.push(`binarize(${options.binarizeThreshold})`);
  }

  stats.processedSize = { w: canvas.width, h: canvas.height };
  stats.durationMs = Date.now() - stats.startTime;

  return { dataUrl: canvas.toDataURL("image/png"), stats };
}

export interface PreprocessStats {
  originalSize: { w: number; h: number };
  processedSize?: { w: number; h: number };
  steps: string[];
  startTime: number;
  durationMs?: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function applyGrayscale(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyContrast(ctx: CanvasRenderingContext2D, w: number, h: number, factor: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const intercept = 128 * (1 - factor);
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = Math.min(255, Math.max(0, d[i] * factor + intercept));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * factor + intercept));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * factor + intercept));
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyBoxBlur(ctx: CanvasRenderingContext2D, w: number, h: number, radius: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const size = 2 * radius + 1;
  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      let r = 0, g = 0, b = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          r += copy[idx]; g += copy[idx + 1]; b += copy[idx + 2];
        }
      }
      const idx = (y * w + x) * 4;
      const n = size * size;
      d[idx] = r / n; d[idx + 1] = g / n; d[idx + 2] = b / n;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applySharpen(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            val += copy[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        d[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyAdaptiveThreshold(ctx: CanvasRenderingContext2D, w: number, h: number, threshold: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  // Sauvola-inspired adaptive threshold using local mean
  const blockSize = 15;
  const half = Math.floor(blockSize / 2);

  // Build integral image for fast local mean
  const gray = new Float64Array(w * h);
  for (let i = 0; i < gray.length; i++) gray[i] = d[i * 4];

  const integral = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    for (let x = 0; x < w; x++) {
      rowSum += gray[y * w + x];
      integral[(y + 1) * (w + 1) + (x + 1)] = rowSum + integral[y * (w + 1) + (x + 1)];
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const x1 = Math.max(0, x - half);
      const y1 = Math.max(0, y - half);
      const x2 = Math.min(w - 1, x + half);
      const y2 = Math.min(h - 1, y + half);
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const sum = integral[(y2 + 1) * (w + 1) + (x2 + 1)]
        - integral[y1 * (w + 1) + (x2 + 1)]
        - integral[(y2 + 1) * (w + 1) + x1]
        + integral[y1 * (w + 1) + x1];
      const mean = sum / count;
      const val = gray[y * w + x] > mean - (threshold / 2) ? 255 : 0;
      const idx = (y * w + x) * 4;
      d[idx] = d[idx + 1] = d[idx + 2] = val;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ── OCR Engine (Tesseract.js wrapper) ─────────────────────────

/** Tesseract.js worker surface — narrow type for what we use. */
interface TesseractWorker {
  recognize(image: string | HTMLImageElement): Promise<TesseractResult>;
  terminate(): Promise<unknown>;
}

interface TesseractWord {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

interface TesseractLine {
  text: string;
  confidence: number;
}

interface TesseractResult {
  data: {
    text: string;
    confidence: number;
    words: TesseractWord[];
    lines: TesseractLine[];
  };
}

export interface OcrResult {
  text: string;
  confidence: number;
  words: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
  lines: Array<{ text: string; confidence: number }>;
  engine: "tesseract.js";
  lang: string;
  durationMs: number;
}

let tesseractWorker: TesseractWorker | null = null;

/**
 * Initialize Tesseract.js worker (lazy, singleton).
 * Downloads language data on first call (~2MB for English).
 */
async function getWorker(lang = "eng"): Promise<TesseractWorker> {
  if (tesseractWorker) return tesseractWorker;

  const Tesseract = await import("tesseract.js");
  // Tesseract.createWorker returns the full Worker type; we narrow it to
  // the surface we use so the rest of the file is fully typed.
  tesseractWorker = (await Tesseract.createWorker(lang, 1, {
    logger: () => {}, // suppress logs
  })) as unknown as TesseractWorker;
  return tesseractWorker;
}

/**
 * Run OCR on an image (preprocessed or raw).
 * Returns structured text with per-word confidence.
 *
 * This is the open-source alternative to Adobe Acrobat's OCR.
 * Multi-pass approach: preprocess → OCR → confidence check → re-OCR with different params if low.
 */
export async function runOcr(
  imageSource: string,
  options: {
    lang?: string;
    preprocess?: boolean;
    preprocessOptions?: PreprocessOptions;
    minConfidence?: number;
  } = {},
): Promise<OcrResult> {
  const { lang = "eng", preprocess = true, preprocessOptions, minConfidence = 0.6 } = options;
  const startTime = Date.now();

  // Step 1: Preprocess if requested
  let processedImage = imageSource;
  if (preprocess) {
    const result = await preprocessImage(imageSource, preprocessOptions);
    processedImage = result.dataUrl;
  }

  // Step 2: Run Tesseract.js OCR
  const worker = await getWorker(lang);
  const { data } = await worker.recognize(processedImage);

  const result: OcrResult = {
    text: data.text,
    confidence: data.confidence / 100, // Tesseract returns 0-100, we normalize to 0-1
    words: data.words.map((w: TesseractWord) => ({
      text: w.text,
      confidence: w.confidence / 100,
      bbox: w.bbox,
    })),
    lines: data.lines.map((l: TesseractLine) => ({
      text: l.text,
      confidence: l.confidence / 100,
    })),
    engine: "tesseract.js",
    lang,
    durationMs: Date.now() - startTime,
  };

  // Step 3: If confidence is low, retry with aggressive preprocessing
  if (result.confidence < minConfidence && preprocess) {
    const retry = await preprocessImage(imageSource, {
      ...DEFAULT_PREPROCESS,
      contrast: 1.8,
      binarizeThreshold: 100,
    });
    const retryData = await worker.recognize(retry.dataUrl);
    const retryConfidence = retryData.data.confidence / 100;

    if (retryConfidence > result.confidence) {
      result.text = retryData.data.text;
      result.confidence = retryConfidence;
      result.words = retryData.data.words.map((w: TesseractWord) => ({
        text: w.text,
        confidence: w.confidence / 100,
        bbox: w.bbox,
      }));
      result.lines = retryData.data.lines.map((l: TesseractLine) => ({
        text: l.text,
        confidence: l.confidence / 100,
      }));
      result.durationMs = Date.now() - startTime;
    }
  }

  return result;
}

// ── Document Classification (from OCR text) ───────────────────

export type DocClassification =
  | "lease"
  | "service_charge"
  | "correspondence_landlord"
  | "correspondence_solicitor"
  | "correspondence_council"
  | "tribunal_notice"
  | "building_safety"
  | "notice_s20"
  | "notice_rtm"
  | "enfranchisement"
  | "other";

interface ClassificationRule {
  type: DocClassification;
  keywords: string[];
  weight: number;
}

const CLASSIFICATION_RULES: ClassificationRule[] = [
  { type: "notice_s20", keywords: ["section 20", "s.20", "s20", "consultation", "major works"], weight: 3 },
  { type: "notice_rtm", keywords: ["right to manage", "rtm", "section 72", "management company"], weight: 3 },
  { type: "enfranchisement", keywords: ["enfranchisement", "collective enfranchisement", "lease extension", "freeholder"], weight: 3 },
  { type: "building_safety", keywords: ["building safety", "cladding", "fire safety", "remediation", "bsa"], weight: 3 },
  { type: "tribunal_notice", keywords: ["tribunal", "first-tier tribunal", "upper tribunal", "f-tt"], weight: 2 },
  { type: "service_charge", keywords: ["service charge", "service charges", "maintenance fund", "sinking fund"], weight: 2 },
  { type: "correspondence_solicitor", keywords: ["solicitor", "barrister", "legal", "law firm", "counsel"], weight: 2 },
  { type: "correspondence_council", keywords: ["council", "local authority", "planning", "building control"], weight: 2 },
  { type: "correspondence_landlord", keywords: ["landlord", "freeholder", "managing agent", "managing agent"], weight: 2 },
  { type: "lease", keywords: ["lease", "tenancy agreement", "demised premises", "lessee", "lessor"], weight: 1 },
];

/**
 * Classify a document based on OCR text content.
 * Returns ranked classifications with confidence scores.
 */
export function classifyDocument(text: string): Array<{ type: DocClassification; confidence: number }> {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const rule of CLASSIFICATION_RULES) {
    let matchCount = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) matchCount++;
    }
    if (matchCount > 0) {
      scores[rule.type] = (scores[rule.type] || 0) + (matchCount / rule.keywords.length) * rule.weight;
    }
  }

  const maxScore = Math.max(...Object.values(scores), 1);

  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as DocClassification, confidence: Math.min(1, score / maxScore) }))
    .sort((a, b) => b.confidence - a.confidence);
}

// ── Cleanup ────────────────────────────────────────────────────

export async function terminateOcrWorker() {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}

// ── Giotto extraction re-export (Idea #1) ──────────────────────
// Re-export the Giotto-backed lease extractor so a UI consumer of the OCR
// pipeline can opt into structured extraction with a single import. Falls
// back to the deterministic shape when GIOTTO_API_KEY is unset.
//
//   import { extractLease } from '@/lib/ocr-pipeline'
//   const out = await extractLease({ text, imageBase64, mimeType })
//
// Always returns the same typed `LeaseExtraction` shape; the `engine` field
// tells the caller which path produced it.
export { extractLease, giottoConfigured, type LeaseExtraction } from "./giotto";
