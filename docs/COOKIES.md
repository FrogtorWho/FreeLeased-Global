# Cookie Policy

**FreeLeased — Open-source Leasehold Governance Platform**
**Effective:** 2026-08-11 · **Version:** 1.0

> **TL;DR** — FreeLeased uses **zero** tracking cookies. We
> use strictly-necessary localStorage for sign-in only. This
> policy explains what little we use, why, and how to clear it.

FreeLeased ("we", "the Service") operates under a
**cookie-minimal** posture. We do not use cookies for
advertising, cross-site tracking, analytics, or behavioural
profiling. This is by design and aligns with the
[`FREELEASED-PRINCIPLES.md`](../FREELEASED-PRINCIPLES.md:1)
commitment to a resident-first, dignity-first platform.

The European Union ePrivacy Directive (2002/58/EC, as
amended) and the UK PECR (Privacy and Electronic
Communications Regulations 2003) require us to inform you
about cookies and similar technologies. This page does so.

---

## 1. What we use (the entire list)

| Key | Type | Purpose | Lifetime | Strictly necessary? |
|---|---|---|---|---|
| `freeleased.session` | localStorage | Holds your authentication session, encrypted at rest in your browser | 30 days, sliding on activity | **Yes** — without it you would sign in on every page |
| `freeleased.locale` | localStorage | Remembers your chosen UI language (en, ht, es, fr-patois, fy) | 1 year | **No** — falls back to `navigator.language` |
| `freeleased.consent` | localStorage | Records your consent choice for telemetry (§3) | 1 year | **Yes** — required for compliance with PECR |
| Service-worker cache | Cache Storage API | Caches static assets so the PWA works offline | Until manual eviction | **Yes** — required for offline mode |

That's it. We use **zero cookies** in the `Cookie` HTTP
header. We use **no sessionStorage**-based trackers, no
IndexedDB-based analytics, and no third-party pixels
(Google Analytics, Meta Pixel, Hotjar, Segment, PostHog,
or Plausible are **all disabled by default**).

---

## 2. What we don't do

- **No fingerprinting.** We do not combine User-Agent,
  Canvas, WebGL, or AudioContext into a profile.
- **No cookies from third parties.** No FontAwesome, no
  Google Fonts, no Stripe.js — no external scripts that
  might set their own cookies. (If you self-host, your
  deployment choices apply.)
- **No cross-site tracking.** We don't share your
  `freeleased.session` with any other site.
- **No advertising.** We have no ad slots. We have no
  remarketing tags.
- **No email tracking pixels.** Outgoing transactional
  emails (sign-up, password reset, sign-off notification)
  use plain text with no embedded tracking image.

---

## 3. Telemetry opt-out

We collect *anonymous* telemetry via OllyGarden OTLP, with
these fields only:

- Trace ID (random UUID)
- Span name (e.g., `POST /api/fairness/check`)
- Jurisdiction (e.g., `GB-ENG`, `KY`)
- Severity (`low` / `medium` / `high`)
- Latency (ms)

**No file content. No pseudonym. No claim text. No IP address**
(scrubbed at the boundary — see
[`src/lib/ollygarden.ts`](../src/lib/ollygarden.ts:1)).

You can opt out from `Settings → Privacy → Telemetry`. The
choice is recorded in `freeleased.consent` and enforced
client-side.

---

## 4. How to clear localStorage

Most browsers:

- **Chrome / Edge**: DevTools → Application → Storage → Clear site data
- **Firefox**: DevTools → Storage → Clear All
- **Safari**: Develop → Empty Caches; or Safari → Preferences → Privacy → Manage Website Data → Remove all

When you clear localStorage, you will be signed out and your
locale + consent choices reset. This is the only side-effect.

---

## 5. PWA — service-worker cache

The PWA install is optional. If you install it, the
service-worker caches the static assets needed for offline
mode. The cache is *not* a cookie and contains no PII.

To remove the PWA entirely:

- **Chrome / Edge**: `chrome://apps` → right-click → Remove from Chrome
- **iOS Safari**: long-press the app icon → Remove App
- **Android**: long-press → Uninstall

---

## 6. Changes

If we add any feature that requires cookies (e.g., a future
A/B test or an analytics backend), we will:

1. Update this page first
2. Surface a non-dismissible consent banner
3. Wait for opt-in before writing the cookie

We will *never* switch from "zero cookies" to "any
cookies" silently.

---

## 7. Contact

Sam Peacock · `sam.peacock1@gmail.com`

For the underlying data-processing rights, see
[`docs/PRIVACY.md` §7](PRIVACY.md#7-your-rights).

— Sam Peacock, Founder, FreeLeased
2026-08-11
