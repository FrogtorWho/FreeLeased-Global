# Brand-1 — Veridian

> The current FreeLeased brand, polished to production quality.

## Positioning

Veridian is the production default — the brand Sam shipped in
[`src/components/auri/primitives.tsx`](../../src/components/auri/primitives.tsx:1),
distilled into a documented system. It speaks to **resident-led trust**:
the peacock palette borrows from Caribbean ocean and jungle, the serif
headings borrow from legal gravitas, the sans body keeps the product
approachable. It is the brand that says "we take your housing rights
seriously, but we will not bore you about it."

## Palette (6 hex, WCAG-AA verified)

| Role | Name | Hex | Contrast vs `paper` | Use |
|---|---|---|---|---|
| Primary | Peacock Blue | `#2563eb` | 5.17:1 ✅ AA | CTAs, links, focus ring |
| Secondary | Veridian Green | `#10b981` | 2.97:1 ⚠ AA Large only | Success, evidence-class "verified" |
| Accent | Amber Reef | `#f59e0b` | 2.69:1 ⚠ AA Large only | Warning, attention signals |
| Surface | Ink Depths | `#0b1220` | — | Dark theme surface, hero bg |
| Ink | Sumi Black | `#0f172a` | 16.10:1 ✅ AAA | Body text on light |
| Paper | Bone | `#f8fafc` | — | Light theme surface |

**Dark theme ratio check**: `#f8fafc` on `#0b1220` = 17.62:1 ✅ AAA.

## Typography

| Role | Family | Size scale | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Heading (display) | Source Serif 4 / Charter / Georgia | 56/40/32/24/20 | 700 | 1.10 | -0.02em |
| Heading (UI) | Inter | 24/20/18 | 600 | 1.25 | -0.01em |
| Body | Inter | 18/16/14 | 400/500 | 1.55 | 0 |
| Mono | JetBrains Mono / ui-monospace | 14/13 | 400 | 1.50 | 0 |

Display serif earns the legal-document feel; Inter keeps UI dense
without feeling academic. JetBrains Mono for statute citations and
evidence IDs.

## Logo construction

- **Grid**: 64×64 unit canvas. Wordmark sits inside a 56×20 inner
  block (margin 4 on top/bottom).
- **Letterforms**: "Free" + "Leased" set in Source Serif 4 Bold,
  kerned so the cap-height is exactly 20u. The "ee" ligature in "Free"
  is forced (no orphan e).
- **Mark**: a 24u square with an inset peacock-feather glyph (an
  elongated leaf made of three nested arcs), positioned top-left of
  the wordmark.
- **Clear space**: 8u on all sides — equal to the wordmark x-height.
- **Minimum size**: 96px wide on screen, 24mm in print. Below this,
  use the mark only.
- **Color rules**:
  - Light bg: Ink Sumi wordmark + Peacock Blue mark
  - Dark bg: Bone wordmark + Veridian Green mark
  - Never use the mark in isolation below 16u square.

## Voice & tone

See [`voice-and-tone.md`](./voice-and-tone.md:1). Short version:
**warm-but-precise.** Use the language of a knowledgeable friend, not
a lawyer.

## Motion principles

See [`motion-spec.md`](./motion-spec.md:1). Veridian uses **subtle
rises + spring overshoots** — never theatrical. The product feels
alive without feeling performative.

## Application examples

- **Button (primary)**: 12px 24px padding, 8px radius, Inter 600 14px
  / 0.08em tracking, Peacock Blue bg, Bone text, Ink Depths border on
  hover, 200ms `ease-out`.
- **Card**: 16px padding, 12px radius, Ink Depths 1px border + 4px
  shadow at 4% opacity, Veridian Green 2px left-rail on hover.
- **Hero**: full-bleed Ink Depths bg, Source Serif 4 56px headline in
  Bone, Inter 18px subhead in Bone/70, primary CTA + secondary
  text-link CTA. Background has a 1% Veridian Green gradient — never
  a busy pattern.
- **Empty state**: centered 240×240 illustration slot (the same
  peacock-feather glyph at 1× scale, monochrome Bone/30), 14px
  Inter caption in Bone/60.

## Why this wins

**It is the brand already shipping** — so the work this pack does is
*legitimize* what reviewers see in the screenshots, not invent
something new. Lowest risk, highest truth-value.
