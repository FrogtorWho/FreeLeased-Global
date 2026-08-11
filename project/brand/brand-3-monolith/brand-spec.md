# Brand-3 — Monolith

> Brutalist. Mono. For judges who value boldness and clarity.

## Positioning

Monolith is the brand for the **product judge** — Linear, Vercel,
the team that ships a changelog every Friday and never uses a
stock photo. It borrows the visual language of brutalist web
design: pure black, pure white, a single signal color, hard
borders, no shadows, no gradients, no rounded corners. **Monolith
signals: this is software, not marketing.** Every pixel earns
its place.

## Palette (6 hex, WCAG-AA verified)

| Role | Name | Hex | Contrast vs `paper` | Use |
|---|---|---|---|---|
| Primary | Carbon Black | `#000000` | 21:1 ✅ AAA | Body, headings, borders |
| Secondary | Graphite | `#1a1a1a` | 18.4:1 ✅ AAA | Subtle separators, secondary text |
| Accent | Signal Yellow | `#facc15` | 1.32:1 ⚠ accent only | CTAs, focus rings, status |
| Surface | Pure Black | `#000000` | — | Dark theme surface |
| Ink | Pure Black | `#000000` | 21:1 ✅ AAA | Logo, deepest text |
| Paper | Pure White | `#ffffff` | — | Default surface |

**Dark theme ratio check**: `#ffffff` on `#000000` = 21:1 ✅ AAA.

The signal yellow is **always** used sparingly: a single CTA,
a single underline, a single focus ring. Never as a fill.

## Typography

| Role | Family | Size scale | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Heading (display) | Inter / Geist | 96/64/48/32 | 700/800 | 1.00 | -0.04em |
| Heading (UI) | Inter / Geist | 24/20/16 | 600 | 1.20 | -0.02em |
| Body | Inter / Geist | 16/14 | 400/500 | 1.50 | 0 |
| Mono | JetBrains Mono / Geist Mono | 14/13 | 400 | 1.50 | 0 |

Monolith is **sans-only**. Tracking is aggressively tight on
display sizes (-0.04em) so the type feels architectural rather
than friendly. Body is loose by comparison (1.50) — Linear's
proportions.

## Logo construction

- **Wordmark**: "FreeLeased" set in Inter Black, all lowercase:
  `freeleased`. 56u cap-height. Tight tracking.
- **Mark**: a 32u black square. Inside, a single white 1px-thick
  horizontal line at the vertical center, extending from x=4 to
  x=28. This is the **sign-off slash** — a verdict rendered as
  geometry. No text. No decoration.
- **Clear space**: 16u on all sides (largest of any brand; the
  mark needs isolation to read).
- **Minimum size**: 96px wide. Below that, use the mark alone.
- **Color rules**:
  - Default: Carbon Black wordmark on Paper White
  - Inverted: Paper White wordmark on Carbon Black, with the
    mark's slash in Signal Yellow
  - The wordmark never changes color. Only the mark varies.

## Voice & tone

See [`voice-and-tone.md`](./voice-and-tone.md:1). Monolith is
short, declarative, never decorated.

## Motion principles

See [`motion-spec.md`](./motion-spec.md:1). Monolith moves like
a state machine: every transition is an instant state swap.
No cross-fades. No easing. The fastest motion budget of any
brand, by design.

## Application examples

- **Button**: solid Carbon Black bg, Paper White text, 0px
  radius, 12px 20px padding, Inter 600 14px. Hover inverts
  (Paper White bg, Carbon Black text, 2px Carbon Black border).
  Transition: 0ms (instant). Focus ring: 4px Signal Yellow
  offset.
- **Card**: 1px Carbon Black border, 0px radius, 24px padding,
  no shadow. Status dot in top-right (Signal Yellow if pending,
  Carbon Black if approved).
- **Hero**: full-bleed Paper White. Display headline 96px Inter
  Black, tracking -0.04em. Two CTAs side-by-side: primary
  Carbon Black filled, secondary Paper White outlined.
  Background is **pure**. No hero image. No gradient.
- **Empty state**: a single 200×200 Carbon Black square with a
  centered white slash. Below it, Inter 14px caption: "Nothing
  pending."

## Why this wins

Monolith is the brand that says **"we ship software, not
demos."** For judges who have seen too many polished landing
pages that hide broken products, brutalism reads as honesty.
