const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-ndp23PKS.js","./index-Cjq77KN5.js","./index-D5lHmIok.css"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './index-Cjq77KN5.js';

const DEFAULT_PREPROCESS = {
  grayscale: true,
  contrast: 1.4,
  sharpen: true,
  denoise: true,
  deskew: true,
  binarize: true,
  binarizeThreshold: 128
};
async function preprocessImage(imageSource, options = DEFAULT_PREPROCESS) {
  const img = typeof imageSource === "string" ? await loadImage(imageSource) : imageSource;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const stats = {
    originalSize: { w: canvas.width, h: canvas.height },
    steps: [],
    startTime: Date.now()
  };
  if (options.grayscale) {
    applyGrayscale(ctx, canvas.width, canvas.height);
    stats.steps.push("grayscale");
  }
  if (options.contrast !== 1) {
    applyContrast(ctx, canvas.width, canvas.height, options.contrast);
    stats.steps.push(`contrast(${options.contrast})`);
  }
  if (options.denoise) {
    applyBoxBlur(ctx, canvas.width, canvas.height, 1);
    stats.steps.push("denoise");
  }
  if (options.sharpen) {
    applySharpen(ctx, canvas.width, canvas.height);
    stats.steps.push("sharpen");
  }
  if (options.binarize) {
    applyAdaptiveThreshold(ctx, canvas.width, canvas.height, options.binarizeThreshold);
    stats.steps.push(`binarize(${options.binarizeThreshold})`);
  }
  stats.processedSize = { w: canvas.width, h: canvas.height };
  stats.durationMs = Date.now() - stats.startTime;
  return { dataUrl: canvas.toDataURL("image/png"), stats };
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function applyGrayscale(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);
}
function applyContrast(ctx, w, h, factor) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const intercept = 128 * (1 - factor);
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, d[i] * factor + intercept));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * factor + intercept));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * factor + intercept));
  }
  ctx.putImageData(imageData, 0, 0);
}
function applyBoxBlur(ctx, w, h, radius) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const size = 2 * radius + 1;
  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      let r = 0, g = 0, b = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx2 = ((y + dy) * w + (x + dx)) * 4;
          r += copy[idx2];
          g += copy[idx2 + 1];
          b += copy[idx2 + 2];
        }
      }
      const idx = (y * w + x) * 4;
      const n = size * size;
      d[idx] = r / n;
      d[idx + 1] = g / n;
      d[idx + 2] = b / n;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
function applySharpen(ctx, w, h) {
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
function applyAdaptiveThreshold(ctx, w, h, threshold) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const blockSize = 15;
  const half = Math.floor(blockSize / 2);
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
      const sum = integral[(y2 + 1) * (w + 1) + (x2 + 1)] - integral[y1 * (w + 1) + (x2 + 1)] - integral[(y2 + 1) * (w + 1) + x1] + integral[y1 * (w + 1) + x1];
      const mean = sum / count;
      const val = gray[y * w + x] > mean - threshold / 2 ? 255 : 0;
      const idx = (y * w + x) * 4;
      d[idx] = d[idx + 1] = d[idx + 2] = val;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
let tesseractWorker = null;
async function getWorker(lang = "eng") {
  if (tesseractWorker) return tesseractWorker;
  const Tesseract = await __vitePreload(() => import('./index-ndp23PKS.js').then(n => n.i),true              ?__vite__mapDeps([0,1,2]):void 0,import.meta.url);
  tesseractWorker = await Tesseract.createWorker(lang, 1, {
    logger: () => {
    }
    // suppress logs
  });
  return tesseractWorker;
}
async function runOcr(imageSource, options = {}) {
  const { lang = "eng", preprocess = true, preprocessOptions, minConfidence = 0.6 } = options;
  const startTime = Date.now();
  let processedImage = imageSource;
  if (preprocess) {
    const result2 = await preprocessImage(imageSource, preprocessOptions);
    processedImage = result2.dataUrl;
  }
  const worker = await getWorker(lang);
  const { data } = await worker.recognize(processedImage);
  const result = {
    text: data.text,
    confidence: data.confidence / 100,
    // Tesseract returns 0-100, we normalize to 0-1
    words: data.words.map((w) => ({
      text: w.text,
      confidence: w.confidence / 100,
      bbox: w.bbox
    })),
    lines: data.lines.map((l) => ({
      text: l.text,
      confidence: l.confidence / 100
    })),
    engine: "tesseract.js",
    lang,
    durationMs: Date.now() - startTime
  };
  if (result.confidence < minConfidence && preprocess) {
    const retry = await preprocessImage(imageSource, {
      ...DEFAULT_PREPROCESS,
      contrast: 1.8,
      binarizeThreshold: 100
    });
    const retryData = await worker.recognize(retry.dataUrl);
    const retryConfidence = retryData.data.confidence / 100;
    if (retryConfidence > result.confidence) {
      result.text = retryData.data.text;
      result.confidence = retryConfidence;
      result.words = retryData.data.words.map((w) => ({
        text: w.text,
        confidence: w.confidence / 100,
        bbox: w.bbox
      }));
      result.lines = retryData.data.lines.map((l) => ({
        text: l.text,
        confidence: l.confidence / 100
      }));
      result.durationMs = Date.now() - startTime;
    }
  }
  return result;
}
const CLASSIFICATION_RULES = [
  { type: "notice_s20", keywords: ["section 20", "s.20", "s20", "consultation", "major works"], weight: 3 },
  { type: "notice_rtm", keywords: ["right to manage", "rtm", "section 72", "management company"], weight: 3 },
  { type: "enfranchisement", keywords: ["enfranchisement", "collective enfranchisement", "lease extension", "freeholder"], weight: 3 },
  { type: "building_safety", keywords: ["building safety", "cladding", "fire safety", "remediation", "bsa"], weight: 3 },
  { type: "tribunal_notice", keywords: ["tribunal", "first-tier tribunal", "upper tribunal", "f-tt"], weight: 2 },
  { type: "service_charge", keywords: ["service charge", "service charges", "maintenance fund", "sinking fund"], weight: 2 },
  { type: "correspondence_solicitor", keywords: ["solicitor", "barrister", "legal", "law firm", "counsel"], weight: 2 },
  { type: "correspondence_council", keywords: ["council", "local authority", "planning", "building control"], weight: 2 },
  { type: "correspondence_landlord", keywords: ["landlord", "freeholder", "managing agent", "managing agent"], weight: 2 },
  { type: "lease", keywords: ["lease", "tenancy agreement", "demised premises", "lessee", "lessor"], weight: 1 }
];
function classifyDocument(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const rule of CLASSIFICATION_RULES) {
    let matchCount = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) matchCount++;
    }
    if (matchCount > 0) {
      scores[rule.type] = (scores[rule.type] || 0) + matchCount / rule.keywords.length * rule.weight;
    }
  }
  const maxScore = Math.max(...Object.values(scores), 1);
  return Object.entries(scores).map(([type, score]) => ({ type, confidence: Math.min(1, score / maxScore) })).sort((a, b) => b.confidence - a.confidence);
}
async function terminateOcrWorker() {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}

export { DEFAULT_PREPROCESS, classifyDocument, preprocessImage, runOcr, terminateOcrWorker };
