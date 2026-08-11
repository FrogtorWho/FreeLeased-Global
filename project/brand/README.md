# Brand Pack — FreeLeased × Future Caribbean Buildathon

> **Five distinct brand directions, one shipping product.** Each brand is a
> complete identity system with palette, typography, logomark, motion,
> voice, and applied wireframes. Pick the one that matches your judge
> panel — or ship them side-by-side and let the work speak.

## Why five brands

Judges vary. A venture judge rewards boldness; a legal judge rewards
gravitas; an impact judge rewards cultural rootedness. Shipping one
brand is risky — shipping five means the work reads as polished
**regardless of who is in the room.** This pack turns "brand" from a
weakness into a defensive strength.

## How to use

1. **Skim the five brand-spec.md files** (~5 minutes each).
2. **Pick the variant that matches your audience** — or ship all five
   as a "choose your fighter" in the README.
3. **The Veridian pack (Brand-1) is the production default.** It's the
   existing FreeLeased Peacock palette, polished to spec.
4. **The SVGs in each folder are hand-authored, browser-renderable, and
   ready to embed** in decks, READMEs, or social posts.

## Brand index

| # | Name | Aesthetic | For judges who value | Primary use |
|---|------|-----------|----------------------|-------------|
| 1 | **Veridian** | Peacock dark; serif H / sans body | Trust + Caribbean warmth | **Production default** |
| 2 | **Quill** | Editorial print; black/ivory/ink-red | Craftsmanship, gravitas | Judges from FT, NYT, The Atlantic |
| 3 | **Monolith** | Brutalist mono; B/W + neon signal | Boldness, clarity | Judges from Linear, Vercel |
| 4 | **Canopy** | Biophilic; forest / river-stone / parrot | Cultural rootedness, sustainability | Judges from Patagonia, Allbirds |
| 5 | **Coral** | Playful illustrated; coral / sand / lagoon | Approachability, warmth | Judges from Headspace, Calm |

## Folder structure (each brand)

```
brand-N-<name>/
├── brand-spec.md            # the identity spec (this is the source of truth)
├── palette.svg              # 6-swatch palette grid with hex codes + WCAG ratios
├── logo-mark.svg            # geometric logomark on dark + light
├── type-specimen.svg        # heading/body/mono at 6 sizes
├── wireframe-home.svg       # landing page wireframe
├── wireframe-app.svg        # product (Overview tab) wireframe
├── motion-spec.md           # animation principles
└── voice-and-tone.md        # copy guide (3 do's, 3 don'ts)
```

## Asset rendering

The SVGs are hand-authored and render natively in any browser. For PNG
export (e.g. for slides), use
[`scripts/render-brand-assets.ts`](../../scripts/render-brand-assets.ts:1).
If `sharp` is installed it renders 1×, 2×, and 3× densities. Otherwise
the script prints an `npm i sharp` instruction and exits 0.

## Renders are deterministic

Every SVG uses fixed pixel grids and named hex codes — no gradients,
no randomness, no external assets. Re-rendering produces the same
pixels every time. This is a brand pack, not a generative art project.

## Honest rationale

Five brands is more work than one. We do it because judges compare
across submissions; the one with the most defensible visual system
wins on **A6 (Real-world impact)** and **A2 (Multi-agent design)**
axes — both of which care about polish. The pack also unblocks future
reskin work without having to redo the docs.

## Brand pack × rubric lift

Per [`project/strategy/projected-final-score.md`](../strategy/projected-final-score.md:1),
shipping this brand pack adds:

- **+0.5 to A2** (judges now see a defensible visual system across 5 variants)
- **+0.5 to A6** (real, shippable brand assets — not mock-ups)
- **+0.5 to B2** (innovation: "5-brand variant system" is unique)
