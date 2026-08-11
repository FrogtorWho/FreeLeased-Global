# docs-site — FreeLeased public marketing site

**8 static HTML pages. No React build. Brand-1 Veridian palette.**
**Mobile-responsive. WCAG-AA contrast.** **Deploy in <5 min.**

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — one-liner + asymmetry thesis + "Try the demo" CTA |
| `story.html` | 60-second judge story (renders `docs/story-60s.md`) |
| `truth.html` | Truth-Diff component as a static HTML page |
| `pricing.html` | 3-tier pricing (mirrors `project/strategy/pricing-page-v1.md`) |
| `pilot.html` | Real-pilot onboarding procedure (mirrors `project/pilot-audit/real-pilot-onboarding.md`) |
| `docs.html` | Index of README, AGENT_BRIEF, CONTRIBUTING, public trust bundle |
| `legal.html` | Privacy / Terms / Cookies / Security / Threat-model / SLA in one place |
| `team.html` | Founder bio + advisory-board forming |
| `assets/style.css` | Veridian tokens + WCAG-AA contrast rules |
| `assets/nav.js` | Tiny progressive enhancement (active-page marker, copy-button on `<pre>`) |
| `assets/brand-mark.svg` | Brand-1 Veridian logomark |

---

## Tech

- **Pure HTML + CSS + minimal JS.** No React, no Vite, no Webpack.
- **9–12 KB** total CSS. ~1 KB JS. Each page ≤ 25 KB.
- Mobile-first responsive via `clamp()`, CSS Grid, `auto-fit`.
- WCAG-AA tested (`--v-ink` on `--v-bg` = 11.7:1; `--v-accent` = 4.85:1).
- `prefers-reduced-motion` + `prefers-contrast: more` honoured.

---

## Deploy — the 3-minute path

### Option A · Vercel (recommended)

```bash
cd docs-site
npx vercel                        # interactive first-time setup
# answer "static site?" → yes
# answer "output directory?"  → .
# vercel assigns a *.vercel.app URL
npx vercel --prod                 # promote to production
```

A `vercel.json` is intentionally **not** required for static
HTML; Vercel handles it.

### Option B · Netlify

```bash
cd docs-site
npx netlify-cli deploy --dir=. --prod
# answer "create netlify site?" → yes
# netlify assigns a *.netlify.app URL
```

Or drag-and-drop the `docs-site/` folder to
https://app.netlify.com/drop.

### Option C · GitHub Pages

1. Push the repo to GitHub
2. Settings → Pages → Source = "Deploy from a branch"
3. Branch = `main`, Folder = `/docs-site`
4. Save. Public URL = `https://<org>.github.io/<repo>/docs-site/`
5. (Alternative: keep the site at repo root; move the 8 HTML files up one level.)

---

## Custom domain

After deploy, buy a domain (`freeleased.org`, `freeleased.uk`,
etc.) and point it to the host:

```text
Vercel:    cname your.domain.vercel-dns.com
Netlify:   A 75.2.60.1 (Netlify load-balancer)
GH Pages:  cname <org>.github.io.
```

SSL is automatic on all three.

---

## Local preview

```bash
# Python 3
python -m http.server --directory docs-site 8000

# Node
npx http-server docs-site -p 8000
# or
bunx --bun serve docs-site
```

Open http://localhost:8000.

---

## What lives here vs. in the main app

- **docs-site/** is for humans. Marketing copy, story, legal,
  pricing, pilot onboarding.
- **app.freeleased.org** (when deployed) is the React app. The
  React app is the real product.
- **docs/** (in the main repo) is the developer documentation,
  used by `bun scripts/reconcile-docs.ts` to keep claims and
  code in sync.

The `legal.html` page on this site **mirrors** the canonical
`docs/PRIVACY.md` / `TERMS.md` etc. If they drift, the canonical
docs win. Fix the doc.

---

## Accessibility checklist

- [x] WCAG-AA contrast on every text/background pair
- [x] `prefers-reduced-motion` honoured
- [x] `prefers-contrast: more` honoured (CSS plan in `style.css`)
- [x] Skip-link in `body > a:first-of-type`
- [x] `<header role="banner">`, `<main id="main" tabindex="-1">`, `<footer role="contentinfo">`
- [x] ARIA `aria-current="page"` on active nav (via `nav.js`)
- [x] All icons have `alt=""` or `aria-label`
- [x] Forms have `<label for>` pairs
- [x] Keyboard-only navigation works (`Tab` order is DOM order)

---

## Verifying deployment

After deploy:

```bash
# 1. The site resolves
curl -I https://freeleased.org           # expect 200 or 301
curl -I https://freeleased.org/index.html  # expect 200

# 2. The pages load
for p in index story truth pricing pilot docs legal team; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "https://freeleased.org/${p}.html"
done

# 3. The brand mark resolves
curl -I https://freeleased.org/assets/brand-mark.svg   # expect 200
curl -I https://freeleased.org/assets/style.css        # expect 200
curl -I https://freeleased.org/assets/nav.js           # expect 200

# 4. Lighthouse (manual, post-deploy)
# https://freeleased.org should score 100/100/100/100.
```

---

## Reconciliation

| Claim on this site | Truth-source |
|---|---|
| 86 commits | `git log --all --oneline \| wc -l` |
| 76,610 LOC | `find src scripts tests prisma -name '*.ts' -o -name '*.tsx' -o -name '*.mjs' -o -name '*.py' \| xargs wc -l \| tail -1` |
| 1,496 test assertions | `bun scripts/test-suite.ts` (+ per-suite assertions in suite files) |
| 37 src/lib modules | `ls src/lib/*.ts \| wc -l` |
| 6 SLOs | `src/lib/slo.ts` SLOS array |
| 5 runbooks | `src/lib/slo.ts` RUNBOOKS array |
| 9 jurisdictions | `src/data/legislative-framework-schema.ts` + `src/data/uk-framework.ts` |
| 5 locales | `src/locales/{en,ht,es,fr-patois,fy}.json` |

Every number on this site reconciles against the repo. If
you see drift, fix the site to match the repo (the repo is
the truth).

— Sam Peacock, 2026-08-11
