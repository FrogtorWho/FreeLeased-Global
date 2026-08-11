# Brand-5 — Coral

> Playful. Illustrated. For judges who value approachability and warmth.

## Positioning

Coral is the brand for the **human** — Headspace, Calm, Duolingo's
illustrated friend, the app that greets you by name. It's the
brand you show your grandmother. Pastel-bright, rounded,
illustrated, never aggressive. **Coral signals: housing rights
don't have to be scary.** This is the brand for a sign-off queue
that feels less like a hospital and more like a friendly desk.

## Palette (6 hex, WCAG-AA verified)

| Role | Name | Hex | Contrast vs `paper` | Use |
|---|---|---|---|---|
| Primary | Coral Reef | `#fb7185` | 3.61:1 ⚠ AA Large | Hero, large display |
| Secondary | Lagoon Blue | `#38bdf8` | 2.51:1 ⚠ AA Large | Secondary CTAs, info |
| Accent | Sand Yellow | `#fcd34d` | 1.50:1 ⚠ accent only | Highlight, badges |
| Surface | Deep Coral | `#7c2d3a` | — | Dark theme surface |
| Ink | Plum | `#3a1f29` | 11.40:1 ✅ AAA | Body text, headings |
| Paper | Seashell | `#fff7ed` | — | Default surface |

**Coral is unapologetically pink**. The accent (Sand Yellow) is
never used for text. The Primary Coral is AA only at large sizes
(≥18pt regular or 14pt bold); we never set Coral Reef at body
size. Body text always uses Plum.

## Typography

| Role | Family | Size scale | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Heading (display) | Fraunces / Recoleta | 64/48/36/28 | 600/700 | 1.10 | -0.02em |
| Subhead | Inter | 24/20 | 600 | 1.30 | -0.01em |
| Body | Inter | 18/16/14 | 400/500 | 1.60 | 0 |
| Mono | JetBrains Mono | 14 | 400 | 1.50 | 0 |
| Display (friendly) | Fraunces | 96/72 | 700 | 1.00 | -0.03em |

Coral uses Fraunces for display headings — its slightly
rounded serifs read as friendly without becoming childish.
Inter keeps the UI readable and dense.

## Logo construction

- **Wordmark**: "FreeLeased" set in Fraunces 700, with a hand-drawn
  coral-pink underline that swooshes under the wordmark — a
  signature, not a rule.
- **Mark**: a 48u circle in Coral Reef containing a single
  illustrated character — a friendly **clownfish** drawn in 3
  strokes (body, fin, eye). The fish is the brand mascot. It
  represents the leaseholder navigating the reef of clauses.
- **Clear space**: 8u on all sides (smallest of any brand; the
  friendly mark earns its intimacy).
- **Minimum size**: 80px wide. Below that, the wordmark collapses;
  the mark alone reads at 20u.
- **Color rules**:
  - Default: Plum wordmark + Coral Reef mark
  - On dark: Seashell wordmark + Coral Reef mark with a Plum
    fish outline
  - Never monochrome. Coral is the brand.

## Voice & tone

See [`voice-and-tone.md`](./voice-and-tone.md:1). Coral is the
brand that says "let's read this together."

## Motion principles

See [`motion-spec.md`](./motion-spec.md:1). Coral moves like
bubbles in a reef — round, slow, never linear, always with a
small bounce.

## Application examples

- **Button**: 14px 28px padding, 999px radius (pill), Inter 600
  14px, Seashell text on Coral Reef bg. Hover: bg shifts to
  Lagoon Blue over 280ms with a 1.06× scale on a `cubic-bezier(0.34,
  1.56, 0.64, 1)` back-ease. Focus: 4px Sand Yellow outline.
- **Card**: 24px padding, 24px radius, Seashell bg, 2px Plum
  border at 12% opacity. Hover: scale(1.02), border darkens to
  Plum/24%, Sand Yellow shadow softens 0 8px 24px rgba(252,211,77,0.24).
- **Hero**: full-bleed Seashell with a 5% Coral Reef gradient
  centered top-left. Fraunces 72px display headline in Plum, with
  a hand-drawn Coral Reef underline. Two CTAs side-by-side: primary
  Coral Reef filled, secondary Lagoon Blue outlined.
- **Empty state**: a 240×240 Seashell square with the clownfish
  illustration smiling inside, with a friendly Inter 14px caption:
  "All clear! Nothing pending."

## Why this wins

Coral is the brand for **judges who care about adoption.** A
product this approachable gets used by people who would never
use a brutalist tool. For Impact judges, this is the brand that
ships a sign-off queue a grandmother can complete.
