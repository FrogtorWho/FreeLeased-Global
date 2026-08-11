# Motion Spec — Veridian

## Principles

1. **Motion confirms causality.** Every transition has a *reason*.
   Hovering a card lifts it because you're about to click it. A new
   dossier row enters because it was just created.
2. **Motion never blocks the user.** Durations cap at 280ms. There
   is no animation that requires you to wait before continuing.
3. **Motion is honest.** No skeletons that pretend data is loading.
   If we don't have it, we say so immediately; the slot is filled
   the moment it arrives.

## Timing curves

| Curve | When | Why |
|---|---|---|
| `cubic-bezier(0.2, 0.0, 0.0, 1.0)` (ease-out-quint) | Element entrances, page transitions | Decelerates into rest — feels decisive |
| `cubic-bezier(0.4, 0.0, 0.6, 1.0)` (ease-in-out-quad) | State changes (toggle, accordion) | Symmetric — no implied direction |
| `cubic-bezier(0.2, 0.8, 0.2, 1.0)` (spring-ish) | Hover lifts, card expansions | Small overshoot — feels alive |

## Durations

| Action | Duration | Property |
|---|---|---|
| Button hover | 120ms | background-color, border-color |
| Card hover lift | 200ms | transform: translateY(-2px) |
| Modal open | 240ms | opacity, transform: scale(0.96 → 1) |
| Page transition | 280ms | opacity, transform: translateY(8px → 0) |
| Skeleton shimmer | 1400ms loop | background-position |
| Toast slide-in | 200ms | transform: translateX(100% → 0) |
| Sign-off verdict flash | 320ms | background-color (Veridian Green → transparent) |

## What moves vs what doesn't

| Moves | Doesn't move |
|---|---|
| New dossier rows (slide-down 8px + fade) | Statute citation text (must be re-readable) |
| Cards on hover (2px lift) | Logo (always at rest) |
| Active verdict flash | Modals on the dashboard (instant) |
| Sign-off queue urgency sort indicator | Cursor / focus ring |
| Toasts | The page background |

## Reduced motion

`@media (prefers-reduced-motion: reduce)` collapses every duration
to 1ms and removes all transforms. The product remains fully usable.

## Easing cheatsheet

```css
:root {
  --ease-out-quint: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --ease-in-out-quad: cubic-bezier(0.4, 0.0, 0.6, 1.0);
  --ease-spring: cubic-bezier(0.2, 0.8, 0.2, 1.0);
}
```

## What this gets us

Veridian's motion is **invisible when it's working.** Users feel
"this is fast and I trust it" without ever thinking about the
animation. That's the goal — present, polite, not performative.
