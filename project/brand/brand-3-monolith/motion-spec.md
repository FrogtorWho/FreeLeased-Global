# Motion Spec — Monolith

## Principles

1. **State machine, not cinema.** Monolith treats UI as a state
   machine. Each state has a single shape. Transitions are
   *swaps*, not interpolations.
2. **Faster than the eye.** Most Monolith transitions are
   0–80ms. The page feels instant because it is.
3. **No easing curves.** State swaps don't ease. Things either
   are or aren't.

## Timing curves

| Curve | When | Why |
|---|---|---|
| `linear` (0–80ms) | State swaps, button hovers | Instant feedback |
| `steps(1, end)` (rare) | Tab toggles, mode switches | Atomic flip |
| No easing | — | We don't tween |

## Durations

| Action | Duration | Property |
|---|---|---|
| Button hover | 0ms | (instant color swap) |
| Tab toggle | 80ms | background-color (stepped) |
| Modal open | 0ms | (instant; opacity 0 → 1 with no fade) |
| Page transition | 120ms | opacity (linear, no easing) |
| Toast slide-in | 80ms | transform: translateY(-100% → 0) |
| Queue row insert | 0ms | (prepended) |
| Status dot pulse | 1400ms loop | opacity 1 → 0.4 → 1 (Signal Yellow only) |

## What moves vs what doesn't

| Moves | Doesn't move |
|---|---|
| Status dots (pulse loop) | Borders |
| Toast slides | Type |
| The page itself (linear cross-fade 120ms) | Logo |
| Queue insertions | Cards |
| The focus ring | Shadows (we don't use them) |

## Reduced motion

`prefers-reduced-motion: reduce` removes the status dot pulse;
everything else is already 0–120ms and stays.

## What this gets us

Monolith's motion budget is **smaller than the brand's
restraint**. The page never animates; it only changes. Judges
who value speed and clarity read this as "this team doesn't
waste cycles on UI flourishes — and neither does their
software."
