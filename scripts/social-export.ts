// scripts/social-export.ts
// Generate a downloadable CSV + JSON of the 30-day social campaign.
// 30 days × 5 platforms × 5 brands = 750 post-pieces, ready to paste
// into Buffer, Hootsuite, or any other scheduler.
//
// HONEST DISCLOSURE: this script generates the *schedule* (day, brand,
// platform, slot, template) but the *post copy* is template-based, not
// LLM-generated. LLM-generated copy is what `scripts/social-gen.ts` does
// (one milestone at a time). This script is the "give me the whole grid"
// counterpart — it produces the rows; Sam fills the copy in each tool.
//
// Usage:
//   node --experimental-strip-types scripts/social-export.ts
// Outputs:
//   project/marketing/social-campaign-100.export.csv
//   project/marketing/social-campaign-100.export.json
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname || process.cwd(), "..");
const OUT_CSV = path.join(ROOT, "project/marketing/social-campaign-100.export.csv");
const OUT_JSON = path.join(ROOT, "project/marketing/social-campaign-100.export.json");
const OUT_SUMMARY = path.join(ROOT, "project/marketing/social-campaign-100.export.summary.md");

// ── Configuration ───────────────────────────────────────────────────────
const BRANDS = [
  { id: 1, name: "Veridian", code: "veridian", voice: "trust, restraint, regional rootedness", color: "peacock dark" },
  { id: 2, name: "Quill", code: "quill", voice: "gravitas, editorial craft, serious publication", color: "ivory/ink-red" },
  { id: 3, name: "Monolith", code: "monolith", voice: "clarity, terminal aesthetics, no-nonsense shipping", color: "black/signal-yellow" },
  { id: 4, name: "Canopy", code: "canopy", voice: "cultural rootedness, sustainability, climate-resilience", color: "forest/parrot" },
  { id: 5, name: "Coral", code: "coral", voice: "approachability, resident-led design, plain-language UX", color: "coral/sand/lagoon" },
] as const;

const PLATFORMS = [
  { name: "X", slot: "08:00 UTC", charLimit: 280, contentType: "short text + 2 hashtags" },
  { name: "LinkedIn", slot: "14:00 UTC", charLimit: 3000, contentType: "4-6 sentence long-form" },
  { name: "Mastodon", slot: "09:00 UTC", charLimit: 500, contentType: "short text + open tag" },
  { name: "Bluesky", slot: "10:00 UTC", charLimit: 300, contentType: "short text + custom feed tag" },
  { name: "Threads", slot: "16:00 UTC", charLimit: 500, contentType: "conversational, question-led" },
] as const;

const DAYS = 30;

// 6 post templates × 5 brands. Each template is a structural skeleton;
// Sam fills the `{placeholders}` with real content.
const TEMPLATES = [
  { id: "T1", name: "Problem-stat", slot: "POV" },
  { id: "T2", name: "Build-in-public", slot: "Daily ship" },
  { id: "T3", name: "Stat-callout", slot: "Numbers" },
  { id: "T4", name: "Caribbean-context", slot: "Region" },
  { id: "T5", name: "Honest-disclosure", slot: "Discipline" },
  { id: "T6", name: "Call-to-action", slot: "Pilot/CTA" },
] as const;

const TEMPLATE_BODIES: Record<string, string> = {
  T1: "{brand_voice} framing: {problem_statement} · #FutureCaribbean #BuildInPublic",
  T2: "Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased",
  T3: "{brand_voice} number drop: {stat} · {stat_context} #FutureCaribbean",
  T4: "Caribbean lens ({jurisdiction}): {regional_observation} — {brand_voice} framing. #CaribbeanAI",
  T5: "{brand_voice} honesty: {disclosure} — no overclaim, no hype. #ResponsibleAI",
  T6: "Pilot slot open: {ask} — {brand_voice} voice. Reply or DM. #FreeLeased",
};

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  // Build the 750-row matrix: 30 days × 5 platforms × 5 brands
  const rows: Array<Record<string, string | number>> = [];
  let rowId = 0;
  for (let day = 1; day <= DAYS; day++) {
    for (const platform of PLATFORMS) {
      for (const brand of BRANDS) {
        // 6 templates × 5 brands × 5 platforms = 6 posts per (day, brand, platform) slot? No — keep it 1:1 for clarity.
        // Use a deterministic template rotation per (day, brand) so the brand voice stays consistent within a brand-day.
        const templateIdx = (day + brand.id - 1) % TEMPLATES.length;
        const template = TEMPLATES[templateIdx];
        const body = TEMPLATE_BODIES[template.id];
        rowId++;
        rows.push({
          id: rowId,
          day,
          brand_id: brand.id,
          brand_code: brand.code,
          brand_name: brand.name,
          brand_voice: brand.voice,
          brand_color: brand.color,
          platform: platform.name,
          slot_utc: platform.slot,
          char_limit: platform.charLimit,
          content_type: platform.contentType,
          template_id: template.id,
          template_name: template.name,
          template_slot: template.slot,
          body_template: body,
          suggested_hashtags: "#BuildInPublic #FutureCaribbean #FreeLeased",
          status: "draft",
          notes: "",
        });
      }
    }
  }

  // CSV header (Buffer-friendly ordering)
  const headers = [
    "id", "day", "brand_id", "brand_code", "brand_name", "brand_voice", "brand_color",
    "platform", "slot_utc", "char_limit", "content_type",
    "template_id", "template_name", "template_slot", "body_template",
    "suggested_hashtags", "status", "notes",
  ] as const;

  const csvLines: string[] = [];
  csvLines.push(headers.join(","));
  for (const row of rows) {
    csvLines.push(headers.map((h) => csvEscape(String(row[h]))).join(","));
  }
  fs.writeFileSync(OUT_CSV, csvLines.join("\n") + "\n");

  // JSON
  const exportPayload = {
    meta: {
      generatedAt: new Date().toISOString(),
      generator: "scripts/social-export.ts",
      totalRows: rows.length,
      totalDays: DAYS,
      brands: BRANDS.length,
      platforms: PLATFORMS.length,
      templates: TEMPLATES.length,
      disclosure:
        "TEMPLATES, not final copy. The body_template field is a structural skeleton with {placeholders} that Sam fills per row. For LLM-generated copy, use scripts/social-gen.ts (one milestone at a time).",
    },
    config: { brands: BRANDS, platforms: PLATFORMS, templates: TEMPLATES, templateBodies: TEMPLATE_BODIES },
    rows,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(exportPayload, null, 2));

  // Human-readable summary
  const md: string[] = [];
  md.push("# Social Campaign Export — 30 × 5 × 5");
  md.push("");
  md.push(`**Generated:** ${exportPayload.meta.generatedAt}`);
  md.push(`**Total rows:** ${rows.length} (${DAYS} days × ${PLATFORMS.length} platforms × ${BRANDS.length} brands)`);
  md.push("");
  md.push(`> ⚠️ **Honest disclosure.** ${exportPayload.meta.disclosure}`);
  md.push("");
  md.push("## How to use");
  md.push("");
  md.push("1. Open `social-campaign-100.export.csv` in your scheduler (Buffer, Hootsuite, Later, or a custom import).");
  md.push("2. The `body_template` column is a structural skeleton with `{placeholders}` — fill each row's copy inline.");
  md.push("3. For LLM-assisted copy per milestone, run `bun scripts/social-gen.ts \"<milestone>\"`.");
  md.push("4. Mark rows as `status: ready` once copy is filled, then `status: scheduled` once uploaded.");
  md.push("");
  md.push("## Brands (5)");
  md.push("");
  for (const b of BRANDS) {
    md.push(`- **${b.name}** (${b.color}) — *${b.voice}*`);
  }
  md.push("");
  md.push("## Platforms (5)");
  md.push("");
  for (const p of PLATFORMS) {
    md.push(`- **${p.name}** — ${p.slot}, ≤${p.charLimit} chars, ${p.contentType}`);
  }
  md.push("");
  md.push("## Templates (6 rotated per (day, brand))");
  md.push("");
  md.push("| ID | Name | Slot |");
  md.push("|----|------|------|");
  for (const t of TEMPLATES) {
    md.push(`| ${t.id} | ${t.name} | ${t.slot} |`);
  }
  md.push("");
  md.push("## Distribution by day");
  md.push("");
  md.push("| Day | Rows | First slot (UTC) |");
  md.push("|-----|------|------------------|");
  for (let day = 1; day <= DAYS; day++) {
    const dayRows = rows.filter((r) => r.day === day);
    const firstSlot = dayRows[0]?.slot_utc ?? "—";
    md.push(`| ${day} | ${dayRows.length} | ${firstSlot} |`);
  }
  md.push("");
  md.push("## Sample rows (Day 1, brand 1)");
  md.push("");
  md.push("| Platform | Brand | Template | Body |");
  md.push("|----------|-------|----------|------|");
  for (const r of rows.filter((r) => r.day === 1 && r.brand_id === 1).slice(0, 5)) {
    md.push(`| ${r.platform} | ${r.brand_name} | ${r.template_id} ${r.template_name} | ${r.body_template} |`);
  }
  md.push("");
  md.push("---");
  md.push("");
  md.push("*Re-run with `node --experimental-strip-types scripts/social-export.ts` to regenerate.*");

  fs.writeFileSync(OUT_SUMMARY, md.join("\n") + "\n");

  console.log(`Wrote ${OUT_CSV} (${rows.length} rows)`);
  console.log(`Wrote ${OUT_JSON} (${rows.length} rows + config)`);
  console.log(`Wrote ${OUT_SUMMARY}`);
  console.log(`Sample distribution: ${DAYS} days × ${PLATFORMS.length} platforms × ${BRANDS.length} brands = ${rows.length} rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
