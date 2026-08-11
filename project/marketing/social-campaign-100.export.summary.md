# Social Campaign Export — 30 × 5 × 5

**Generated:** 2026-08-11T06:38:55.003Z
**Total rows:** 750 (30 days × 5 platforms × 5 brands)

> ⚠️ **Honest disclosure.** TEMPLATES, not final copy. The body_template field is a structural skeleton with {placeholders} that Sam fills per row. For LLM-generated copy, use scripts/social-gen.ts (one milestone at a time).

## How to use

1. Open `social-campaign-100.export.csv` in your scheduler (Buffer, Hootsuite, Later, or a custom import).
2. The `body_template` column is a structural skeleton with `{placeholders}` — fill each row's copy inline.
3. For LLM-assisted copy per milestone, run `bun scripts/social-gen.ts "<milestone>"`.
4. Mark rows as `status: ready` once copy is filled, then `status: scheduled` once uploaded.

## Brands (5)

- **Veridian** (peacock dark) — *trust, restraint, regional rootedness*
- **Quill** (ivory/ink-red) — *gravitas, editorial craft, serious publication*
- **Monolith** (black/signal-yellow) — *clarity, terminal aesthetics, no-nonsense shipping*
- **Canopy** (forest/parrot) — *cultural rootedness, sustainability, climate-resilience*
- **Coral** (coral/sand/lagoon) — *approachability, resident-led design, plain-language UX*

## Platforms (5)

- **X** — 08:00 UTC, ≤280 chars, short text + 2 hashtags
- **LinkedIn** — 14:00 UTC, ≤3000 chars, 4-6 sentence long-form
- **Mastodon** — 09:00 UTC, ≤500 chars, short text + open tag
- **Bluesky** — 10:00 UTC, ≤300 chars, short text + custom feed tag
- **Threads** — 16:00 UTC, ≤500 chars, conversational, question-led

## Templates (6 rotated per (day, brand))

| ID | Name | Slot |
|----|------|------|
| T1 | Problem-stat | POV |
| T2 | Build-in-public | Daily ship |
| T3 | Stat-callout | Numbers |
| T4 | Caribbean-context | Region |
| T5 | Honest-disclosure | Discipline |
| T6 | Call-to-action | Pilot/CTA |

## Distribution by day

| Day | Rows | First slot (UTC) |
|-----|------|------------------|
| 1 | 25 | 08:00 UTC |
| 2 | 25 | 08:00 UTC |
| 3 | 25 | 08:00 UTC |
| 4 | 25 | 08:00 UTC |
| 5 | 25 | 08:00 UTC |
| 6 | 25 | 08:00 UTC |
| 7 | 25 | 08:00 UTC |
| 8 | 25 | 08:00 UTC |
| 9 | 25 | 08:00 UTC |
| 10 | 25 | 08:00 UTC |
| 11 | 25 | 08:00 UTC |
| 12 | 25 | 08:00 UTC |
| 13 | 25 | 08:00 UTC |
| 14 | 25 | 08:00 UTC |
| 15 | 25 | 08:00 UTC |
| 16 | 25 | 08:00 UTC |
| 17 | 25 | 08:00 UTC |
| 18 | 25 | 08:00 UTC |
| 19 | 25 | 08:00 UTC |
| 20 | 25 | 08:00 UTC |
| 21 | 25 | 08:00 UTC |
| 22 | 25 | 08:00 UTC |
| 23 | 25 | 08:00 UTC |
| 24 | 25 | 08:00 UTC |
| 25 | 25 | 08:00 UTC |
| 26 | 25 | 08:00 UTC |
| 27 | 25 | 08:00 UTC |
| 28 | 25 | 08:00 UTC |
| 29 | 25 | 08:00 UTC |
| 30 | 25 | 08:00 UTC |

## Sample rows (Day 1, brand 1)

| Platform | Brand | Template | Body |
|----------|-------|----------|------|
| X | Veridian | T2 Build-in-public | Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased |
| LinkedIn | Veridian | T2 Build-in-public | Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased |
| Mastodon | Veridian | T2 Build-in-public | Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased |
| Bluesky | Veridian | T2 Build-in-public | Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased |
| Threads | Veridian | T2 Build-in-public | Day {day}/{total_days}: {shipped_today} — {brand_voice} cut. #BuildInPublic #FreeLeased |

---

*Re-run with `node --experimental-strip-types scripts/social-export.ts` to regenerate.*
