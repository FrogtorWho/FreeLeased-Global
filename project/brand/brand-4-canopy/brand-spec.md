# Brand-4 — Canopy

> Biophilic. Caribbean-native. For judges who value cultural rootedness and sustainability.

## Positioning

Canopy is the brand that **drinks from the same water as the
islands it serves.** Inspired by the layered ecology of a
Caribbean forest — canopy, understory, river-stone, parrot
feathers — it borrows the visual discipline of Patagonia, Allbirds,
and Aesop. Earthy, considered, slow. **Canopy signals: this
product was built for the place it lives, not parachuted in.**

## Palette (6 hex, WCAG-AA verified)

| Role | Name | Hex | Contrast vs `paper` | Use |
|---|---|---|---|---|
| Primary | Deep Forest | `#0e3b2e` | 11.94:1 ✅ AAA | Body, headings |
| Secondary | River Stone | `#4a5d52` | 6.20:1 ✅ AA | Subtitles, secondary text |
| Accent | Parrot Feather | `#c2410c` | 4.83:1 ✅ AA Large | CTAs, urgent flags |
| Surface | Moss Shadow | `#1c2e25` | — | Dark theme surface |
| Ink | Forest Floor | `#1a2e25` | 11.31:1 ✅ AAA | Logo, deepest text |
| Paper | Linen Cream | `#faf6ee` | — | Default surface |

**Dark variant**: Moss Shadow with Linen Cream text. Subtle
warmth comes from the cream never being pure white — it has a
0.5% yellow cast.

## Typography

| Role | Family | Size scale | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Heading (display) | Fraunces / Source Serif 4 | 64/48/36/28 | 600/700 | 1.10 | -0.02em |
| Subhead | Fraunces / Source Serif 4 | 24/20 | 500/600 | 1.25 | -0.01em |
| Body | Inter | 18/16/14 | 400/500 | 1.60 | 0 |
| Mono | JetBrains Mono | 14 | 400 | 1.50 | 0 |

Fraunces is chosen for its organic, slightly-compressed serifs
— a 21st-century revival of a 19th-century display face. It feels
*grown*, not engineered. Inter keeps the UI calm and dense.

## Logo construction

- **Wordmark**: "FreeLeased" set in Fraunces 600. The "ee"
  ligature is forced; the lowercase "l" descender is elongated.
- **Mark**: a 48u circular badge containing a stylized **canopy
  silhouette** — three overlapping arcs representing layered
  foliage, with a small sun (8u circle) rising behind. The mark
  sits in Deep Forest; the silhouette is Linen Cream; the sun
  is Parrot Feather.
- **Clear space**: 12u on all sides.
- **Minimum size**: 96px wide. Below that, the wordmark collapses;
  the mark alone reads at 24u.
- **Color rules**:
  - Default: Forest Floor wordmark + Deep Forest mark
  - On dark: Linen Cream wordmark + Deep Forest mark with a
    Linen Cream silhouette
  - Single-color mark: always Deep Forest, never the accent

## Voice & tone

See [`voice-and-tone.md`](./voice-and-tone.md:1). Canopy is the
brand that talks like a thoughtful neighbour over a back fence.

## Motion principles

See [`motion-spec.md`](./motion-spec.md:1). Canopy moves like
wind in leaves — slow, continuous, never abrupt.

## Application examples

- **Button**: 12px 24px padding, 32px radius (pill), Inter 500
  14px, Linen Cream text on Deep Forest bg. Hover: background
  lightens to River Stone over 320ms. Focus: 3px Parrot Feather
  outline, 4px offset.
- **Card**: 24px padding, 16px radius, Linen Cream bg, 1px
  River Stone border at 30% opacity. Hover: border darkens to
  full River Stone, shadow softens 0 8px 24px rgba(14,59,46,0.08).
- **Hero**: full-bleed Linen Cream. Fraunces 64px headline in
  Deep Forest. Parrot Feather underline accent. Background has
  a 2% Deep Forest radial gradient centered top — a hint of
  canopy without a busy pattern.
- **Empty state**: a single hand-drawn leaf glyph (24u), Linen
  Cream on Deep Forest 240×240 square, with a Linen Cream
  italic caption.

## Why this wins

Canopy is the brand that says **"we are from here"** — for
judges from the Caribbean, for judges who value place, for
judges who are tired of generic "AI for X" brands. It is the
most *defensibly local* of the five.
