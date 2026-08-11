# Motion Spec — Coral

## Principles

1. **Movement is friendly.** Every transition has a small bounce
   on landing. Nothing is sharp; nothing is harsh.
2. **Curves, not lines.** Linear motion is forbidden. Every
   transition is eased. Every curve has a back-out.
3. **Reduce, never eliminate.** If a motion is decorative, we
   hide it behind `prefers-reduced-motion`. We never remove it
   entirely — the page should still feel like a friendly desk.

## Timing curves

| Curve | When | Why |
|---|---|---|
| `cubic-bezier(0.34, 1.56, 0.64, 1)` (ease-back-out) | Card hovers, button hovers, page transitions | Small overshoot — friendly |
| `cubic-bezier(0.7, 0, 0.3, 1)` (ease-in-out-cubic) | State changes, modal opens | Symmetric, calm |
| `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) | Hero headline reveal | Long gentle deceleration |

## Durations

| Action | Duration | Property |
|---|---|---|
| Button hover | 280ms | background-color, transform: scale(1.06) |
| Card hover | 320ms | border-color, box-shadow, transform: scale(1.02) |
| Modal open | 360ms | opacity, transform: scale(0.92 → 1) |
| Page transition | 480ms | opacity, transform: translateY(12px → 0) |
| Skeleton shimmer | 2000ms loop | background-position |
| Toast slide-in | 320ms | transform: translateY(-100% → 0) with bounce |
| Hero headline reveal | 720ms | opacity, transform: translateY(8px → 0) |

## What moves vs what doesn't

| Moves | Doesn't move |
|---|---|
| Cards on hover (scale + shadow + border) | Statute citations |
| Modal entrances (scale bounce) | Logo |
| Hero headlines (slow reveal) | Footer text |
| Toasts (bounce slide-in) | Skeleton shapes |
| Clownfish illustration (idle float, 4s loop) | Typography tracking |

## Reduced motion

`prefers-reduced-motion: reduce` reduces all durations to 200ms
max, removes all transforms, and disables the clownfish idle
float. The product remains fully usable; it just feels less
playful.

## Easing cheatsheet

```css
:root {
  --coral-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --coral-cubic: cubic-bezier(0.7, 0, 0.3, 1);
  --coral-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## What this gets us

Coral's motion budget is the largest after Canopy, but its
amplitude is the friendliest. The page bounces; nothing
shocks. Judges who value adoption read this as "this team
designed for a human."
