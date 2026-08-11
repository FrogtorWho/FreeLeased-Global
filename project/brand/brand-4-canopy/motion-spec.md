# Motion Spec — Canopy

## Principles

1. **Movement is breath.** Canopy uses continuous, slow easings
   that mimic wind through leaves. Nothing is instantaneous;
   nothing is fast.
2. **Curves, not lines.** Linear motion is forbidden. Every
   transition is eased. Every curve has a long tail.
3. **Reduce, never eliminate.** If a motion is decorative, we
   hide it behind `prefers-reduced-motion`. We never remove it
   entirely — the page should still feel alive, just gentler.

## Timing curves

| Curve | When | Why |
|---|---|---|
| `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) | Page entrances | Long, gentle deceleration |
| `cubic-bezier(0.7, 0, 0.3, 1)` (ease-in-out-cubic) | State changes, modal opens | Symmetric, breath-like |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` (ease-back) | Card expansions (rare) | Subtle overshoot, like a leaf settling |

## Durations

| Action | Duration | Property |
|---|---|---|
| Button hover | 320ms | background-color |
| Card hover | 380ms | border-color, box-shadow |
| Modal open | 480ms | opacity, transform: translateY(16px → 0) |
| Page transition | 600ms | opacity, transform: translateY(12px → 0) |
| Skeleton shimmer | 2400ms loop | background-position |
| Toast slide-in | 360ms | transform: translateX(100% → 0) |
| Hero headline reveal | 800ms | opacity, transform: translateY(8px → 0) |

## What moves vs what doesn't

| Moves | Doesn't move |
|---|---|
| Hero headlines (slow reveal) | Statute citations |
| Card hover (border + shadow) | Logo |
| Modal entrances | Statute section dividers |
| Toasts | Footer text |
| Continuous skeleton shimmer (2.4s) | Typography tracking |

## Reduced motion

`prefers-reduced-motion: reduce` reduces all durations to 200ms
max, removes all transforms, and disables the skeleton shimmer.
The product remains fully usable; it just feels less like wind.

## Easing cheatsheet

```css
:root {
  --canopy-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --canopy-cubic: cubic-bezier(0.7, 0, 0.3, 1);
  --canopy-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## What this gets us

Canopy's motion budget is the largest of the five brands, but
its amplitude is the smallest. The page breathes; nothing
shouts. Judges who value place read this as "this team took
their time."
