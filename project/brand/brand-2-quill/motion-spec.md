# Motion Spec — Quill

## Principles

1. **Print, not cinema.** Quill's motion budget is small and
   deliberate. We borrow the pacing of a well-edited magazine —
   pages turn, they don't shatter.
2. **Type is sacred.** Type never animates its own properties.
   Letters fade, whole words move, but kerning and leading are
   fixed.
3. **If it isn't load-bearing, don't animate it.** Most surfaces
   appear instantly. Only state changes get motion.

## Timing curves

| Curve | When | Why |
|---|---|---|
| `linear` | Cross-fades, page transitions | Newspapers don't ease |
| `cubic-bezier(0.2, 0.0, 0.0, 1.0)` (ease-out-quint) | Underline grow, tab swaps | Single decisive entrance |
| No spring | — | Spring motion is un-editorial |

## Durations

| Action | Duration | Property |
|---|---|---|
| Underline grow | 240ms | width (0 → 100%) |
| Page cross-fade | 320ms | opacity |
| Tab swap | 200ms | opacity, transform: translateY(4px → 0) |
| Hover fade | 200ms | color |
| Modal open | 280ms | opacity, transform: scale(0.98 → 1) |
| Drop-cap entrance | 400ms | opacity, transform: translateY(8px → 0) |

## What moves vs what doesn't

| Moves | Doesn't move |
|---|---|
| Page transitions | Type kerning |
| Underlines | Borders |
| Modal entrances | Card shadows (we don't use them) |
| Drop-caps | Statute citations |
| Tab swaps | The masthead |

## Reduced motion

`@media (prefers-reduced-motion: reduce)` → all cross-fades
collapse to instant; underline grow collapses to 1ms.

## Easing cheatsheet

```css
:root {
  --quill-fade: linear;
  --quill-entrance: cubic-bezier(0.2, 0.0, 0.0, 1.0);
}
```

## What this gets us

Quill moves like ink on newsprint — slow enough that you notice
it, fast enough that you don't wait. The motion budget is small
on purpose. A brand that doesn't move much doesn't move wrong.
