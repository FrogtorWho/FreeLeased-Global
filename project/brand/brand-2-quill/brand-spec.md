# Brand-2 — Quill

> Editorial. Print-feel. For judges who value craftsmanship and gravitas.

## Positioning

Quill is the brand for the **reading class** — judges from FT, NYT,
The Atlantic, or any publication where the byline carries weight.
It borrows the typographic discipline of long-form journalism: tight
tracking, serif everywhere, generous leading, and an ivory paper
background that feels like the page of a serious newspaper. **Quill
signals: we read the law so you don't have to, and we'll write it
better than your solicitor did.**

## Palette (6 hex, WCAG-AA verified)

| Role | Name | Hex | Contrast vs `paper` | Use |
|---|---|---|---|---|
| Primary | Sumi Ink | `#0a0a0a` | 20.31:1 ✅ AAA | Body, headings |
| Secondary | Soft Black | `#1f1f1f` | 17.51:1 ✅ AAA | Subtitles, captions |
| Accent | Editorial Red | `#a8201a` | 7.51:1 ✅ AAA | Pull-quotes, urgent flags |
| Surface | Newsprint Cream | `#f4ede0` | — | Page bg, hero |
| Ink | Press Black | `#000000` | 20.31:1 ✅ AAA | Logo, deepest text |
| Paper | Ivory | `#fbf8f1` | — | Default surface |

**Dark variant**: not needed. Quill is intentionally paper-only.
Dark mode is an inversion of accents, never the page itself.

## Typography

| Role | Family | Size scale | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Heading (display) | GT Sectra / Tiempos / Source Serif 4 | 64/48/36/28 | 700 | 1.05 | -0.02em |
| Subhead | GT Sectra / Tiempos | 24/20 | 600 | 1.20 | -0.01em |
| Body (running) | Source Serif 4 / Charter | 18/16 | 400 | 1.65 | 0 |
| Body (UI) | Inter | 14/13 | 500 | 1.45 | 0 |
| Mono | JetBrains Mono | 14 | 400 | 1.50 | 0 |
| Drop-cap | GT Sectra Display | 96 | 700 | 0.85 | -0.04em |

Quill is **all serif** for content. Sans is reserved for UI chrome
and statute IDs — a deliberate echo of newspaper style sections.

## Logo construction

- **Wordmark**: "FreeLeased" set in GT Sectra Bold, 56u cap-height.
- **Serif terminals**: GT Sectra's clipped serifs are visible at
  small sizes — they read as "this is set in metal, not pixels."
- **Quill mark**: a 32u quill pen, drawn at 30° to the wordmark's
  baseline. The nib points down and to the right; the feather curls
  up and to the left. The quill is set in Editorial Red.
- **Clear space**: 12u on all sides (more than Veridian; the serif
  terminals need breathing room).
- **Minimum size**: 120px wide. Below that, the wordmark collapses;
  use the quill mark alone.
- **Color rules**:
  - Default: Press Black wordmark + Editorial Red quill
  - On dark surfaces (rare): Ivory wordmark + Editorial Red quill
  - Never monochrome. The red is the brand.

## Voice & tone

See [`voice-and-tone.md`](./voice-and-tone.md:1). Quill is the brand
that says "the FT would write about this."

## Motion principles

See [`motion-spec.md`](./motion-spec.md:1). Quill barely moves. A
hover fades 200ms; a page transition is a 320ms cross-fade. No
springs, no overshoots. Print discipline.

## Application examples

- **Button**: underlined text-link (no fill). 14px Inter Medium.
  Hover: Editorial Red + 2px underline that grows from left to right
  in 240ms. No rounded corners; a small editorial nod.
- **Card**: 1px Sumi Ink border, no shadow, 24px padding, generous
  20px between elements. Looks like a pulled-out article.
- **Hero**: full-bleed Newsprint Cream, drop-cap "T" starting a
  64px headline that reads like a feature opener. Subhead in
  italic 18px Source Serif. CTA is a text-link, not a button.
- **Empty state**: editorial illustration slot — a pen-and-ink
  quill drawing a single line — with an italic caption "Nothing
  to read today."

## Why this wins

Quill is the brand for judges who scan by *what it looks like in
the first 3 seconds*. A serif headline on cream paper reads as
"this team knows what they're doing" before any code is touched.
