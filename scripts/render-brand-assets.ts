#!/usr/bin/env bun
/**
 * scripts/render-brand-assets.ts
 *
 * Deterministic SVG → PNG renderer for the FreeLeased brand pack.
 *
 * Usage:
 *   bun scripts/render-brand-assets.ts              # render all 5 brands
 *   bun scripts/render-brand-assets.ts brand-1-veridian   # render one
 *
 * What it does:
 *   - For each brand, reads the 5 SVG assets
 *     (palette, logo-mark, type-specimen, wireframe-home, wireframe-app)
 *   - If `sharp` is installed, renders PNG @ 1×, 2×, 3× into
 *     `project/brand/<brand>/dist/` (filename-preserving).
 *   - If `sharp` is NOT installed, prints a single-line install
 *     instruction and exits 0. SVG files are already hand-authored
 *     and render natively in any browser, so PNG is optional.
 *
 * Constraints:
 *   - No new runtime dependencies (sharp is optional).
 *   - Deterministic: same input → same PNG bytes (sharp defaults).
 *   - Never throws if sharp is missing.
 *   - Does NOT edit src/generated/*, server.tsx, bun.lock.
 *
 * @author Shogo (overnight agent)
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

// ---------- paths -----------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, "..");
const BRAND_ROOT = join(REPO_ROOT, "project", "brand");

const ALL_BRANDS = [
  "brand-1-veridian",
  "brand-2-quill",
  "brand-3-monolith",
  "brand-4-canopy",
  "brand-5-coral",
];

const SVG_ASSETS = [
  "palette.svg",
  "logo-mark.svg",
  "type-specimen.svg",
  "wireframe-home.svg",
  "wireframe-app.svg",
];

const DENSITIES = [1, 2, 3]; // @1x, @2x, @3x

// ---------- argv -----------------------------------------------------------

const argv = process.argv.slice(2);
const targetBrands = argv.length > 0 ? argv : ALL_BRANDS;

// ---------- sharp loader (lazy, optional) ----------------------------------

type SharpFn = (
  input: Buffer | string,
  options?: { density?: number },
) => {
  png: (options?: object) => { toBuffer: () => Promise<Buffer> };
  metadata: () => Promise<{ width?: number; height?: number }>;
};

let sharp: SharpFn | null = null;
try {
  // dynamic require so missing dep is non-fatal
  // @ts-ignore — sharp is optional
  sharp = (await import("sharp")).default as SharpFn;
} catch {
  sharp = null;
}

// ---------- helpers --------------------------------------------------------

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function readUtf8(p: string): string {
  return require("node:fs").readFileSync(p, "utf8");
}

function log(line: string) {
  process.stdout.write(`[render-brand-assets] ${line}\n`);
}

// ---------- main -----------------------------------------------------------

async function renderBrand(brand: string): Promise<{ ok: number; skipped: number }> {
  const brandDir = join(BRAND_ROOT, brand);
  if (!existsSync(brandDir)) {
    log(`✗ ${brand}: directory not found, skipping`);
    return { ok: 0, skipped: SVG_ASSETS.length };
  }

  const distDir = join(brandDir, "dist");
  ensureDir(distDir);

  let ok = 0;
  let skipped = 0;

  for (const asset of SVG_ASSETS) {
    const svgPath = join(brandDir, asset);
    if (!existsSync(svgPath)) {
      log(`  - ${brand}/${asset}: missing, skipping`);
      skipped++;
      continue;
    }

    const stem = basename(asset, extname(asset));
    const svg = readUtf8(svgPath);

    if (!sharp) {
      // No sharp installed → just copy SVG to dist/ as a fallback artifact
      // (browsers render SVG natively; PNG is optional for slides).
      const out = join(distDir, `${stem}.svg`);
      require("node:fs").writeFileSync(out, svg);
      log(`  ✓ ${brand}/${asset} → dist/${stem}.svg (svg-only, sharp not installed)`);
      ok++;
      continue;
    }

    // sharp path — render @1x, @2x, @3x
    for (const d of DENSITIES) {
      const out = join(distDir, `${stem}@${d}x.png`);
      try {
        const buf = await sharp(svg, { density: 72 * d }).png().toBuffer();
        require("node:fs").writeFileSync(out, buf);
        log(`  ✓ ${brand}/${asset} → dist/${stem}@${d}x.png (${buf.length} bytes)`);
        ok++;
      } catch (e) {
        log(`  ✗ ${brand}/${asset} @${d}x: render failed — ${(e as Error).message}`);
      }
    }
  }

  return { ok, skipped };
}

async function main() {
  log(`brand root: ${BRAND_ROOT}`);
  log(`target brands: ${targetBrands.join(", ")}`);

  if (!sharp) {
    log(
      "sharp not installed — emitting SVG-only dist/. " +
        "To enable PNG: `npm i --no-save sharp` (or `bun add -d sharp`).",
    );
  } else {
    log("sharp detected — emitting PNG @1x, @2x, @3x.");
  }

  let totalOk = 0;
  let totalSkipped = 0;

  for (const brand of targetBrands) {
    log(`→ ${brand}`);
    const { ok, skipped } = await renderBrand(brand);
    totalOk += ok;
    totalSkipped += skipped;
  }

  log(`done. ok=${totalOk} skipped=${totalSkipped} brands=${targetBrands.length}`);
  if (!sharp) {
    log("note: PNG rendering requires `npm i --no-save sharp` to enable.");
  }
}

main().catch((e) => {
  console.error("[render-brand-assets] fatal:", e);
  process.exit(1);
});
