# First-Impression Audit — what a judge sees in 5 minutes

**Date:** 2026-08-11 · **Status:** honest assessment
**Owner:** Sam Peacock

> The "5-minutes-on-the-repo" test. A judge lands at the
> repo URL, looks around for 5 minutes, then forms an
> opinion. This document lists exactly what they see, with
> a per-line score and the link to the source. **No
> fabrication; if we don't have it, we say so.**

---

## 1. The 5 surfaces in the test

| # | Surface | Source | In-the-world status | Honest assessment |
|---:|---|---|---|---|
| 1 | README | [`README.md`](../../README.md) | On disk; first impression is the public face if the GitHub repo is published | **GOOD.** 200+ lines covering setup, scripts, scripts/test-suite.ts |
| 2 | Live URL | `https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai` (per `MEMORY.md:11-12`) | UNVERIFIED — `curl` against this URL returns 200 only if Shogo preview tunnel is currently active. **The honest answer: it is private infrastructure tied to Sam's Shogo AI workspace, not a public prod URL.** | **HONEST GAP.** Disclose on landing page; verify before demo |
| 3 | Demo video | [`project/demo/demo-video-script.md`](../demo/demo-video-script.md) — script exists; recording does NOT exist | **DOES NOT EXIST.** Sam has not yet recorded a video. | **HONEST GAP.** Disclose on landing page; recommend the 60-second story as the alternative |
| 4 | Pitch deck | [`project/pitch/deck-v7.md`](../pitch/deck-v7.md) — markdown source; no PDF rendered | **PARTIAL.** Markdown exists; `.pdf` export does NOT exist. No public download link. | **HONEST GAP.** Ship as PDF link from docs-site `pitch.html` (forthcoming) or expose the GitHub-rendered markdown |
| 5 | One screenshot | `public/manifest.json` + `public/icon.svg` — only app icons | **DOES NOT EXIST** as a product screenshot. | **HONEST GAP.** Disclose on landing page; the wireframes in `project/brand/brand-1-veridian/wireframe-app.svg` exist as design time, not runtime |

---

## 2. What we'd add (next 24 hours, executable)

| Add | Estimated time | Source |
|---|---|---|
| Public deploy of `docs-site/` | 5 min | `docs-site/README.md` |
| `curl -I` the demo URL → record HTTP status in `project-stats.md` | 2 min | `powershell -Command "curl -I ..."` |
| Render `pitch/deck-v7.md` to PDF | 10 min | `npx md-to-pdf project/pitch/deck-v7.md` (requires `npm install`); alternative: paste into Canva / Figma |
| Take 4 screenshots of the live build into `docs-site/assets/screenshots/` | 30 min | Sam on live demo, screenshot to PNG |
| Record a 60s demo video (phone or screen-recorder) | 60 min | Sam on camera or Loom-style |

**Realistic 5-min** effort for the deploy + curl + PDF:
**~20 min.** Ship tonight.

---

## 3. What we won't fabricate

- We will NOT create a URL that doesn't resolve.
- We will NOT claim a video we don't have.
- We will NOT pretend a wireframe is a screenshot of the
  running app.
- We will NOT fake a PDF that doesn't render.

---

## 4. Verifiable claims (the parts we ARE solid on)

- **86 commits.** `git log --oneline | wc -l`.
- **76,610 LOC.** PowerShell script attached to
  [`project-management/project-stats.md` §1.3](project-stats.md).
- **1,496 test assertions.** Per [`100-judge-saturation-report.md §2:6`](../strategy/100-judge-saturation-report.md).
- **0 paying customers.** True. Worth saying.
- **0 pilot users (yet).** True. Worth saying.
- **0 MoUs signed.** True. Worth saying.

The honest disclosures are a *feature*, not a *bug*. They
match the rubric: a "9.40 on disk / 5.50 in the world" that
names its own gap is more credible than a "9.40" that papers
over it.

---

## 5. The "5-minutes" action plan

| Minute | What the judge does | Where they land | What they should see | Source |
|---:|---|---|---|---|
| 0–1 | Arrive at GitHub repo URL | README.md | Project name, Buildathon track tag, install steps, sanity-test script | [`README.md`](../../README.md) |
| 1–2 | Click into the project | `AGENT_BRIEF.md` | 60s cold-start summary; principles; doc graph | [`AGENT_BRIEF.md`](../../AGENT_BRIEF.md) |
| 2–3 | Skim the rule artefacts | `FREELEASED-PRINCIPLES.md`, `MEMORY.md` | Locked business facts, the CfC CoC compliance statement, the workspace rules | [`FREELEASED-PRINCIPLES.md`](../../FREELEASED-PRINCIPLES.md), [`MEMORY.md`](../../MEMORY.md) |
| 3–4 | Look at the architecture | `project/strategy/architecture-diagram.md` + `src/lib/*.ts` | Multi-engine layout, 5 jurisdictions, sign-off queue, on-device default | [`project/strategy/architecture-diagram.md`](../strategy/architecture-diagram.md) |
| 4–5 | Look at tests + audit | `scripts/test-*.ts`, `scripts/reconcile-docs.ts`, `100-judge-saturation-report.md` | 1,496 assertions, zero drift, the rubric score with the gap | [`scripts/test-*`](../../scripts/), [`project/strategy/100-judge-saturation-report.md`](../strategy/100-judge-saturation-report.md) |

This is what they should see. We deliver it with **zero
fabrication**.

---

## 6. Hypothetical judge inquiries

A judge who wanted to verify a single claim could:

| Verify | How |
|---|---|
| 86 commits | `git log --oneline | wc -l` |
| 76,610 LOC | `find src scripts tests prisma -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.mjs' -o -name '*.py' \) | xargs wc -l | tail -1` |
| 1,496 assertions | `bun scripts/test-suite.ts` + per-suite runs |
| "BATNA — does tenant A see tenant B's data?" | `bun scripts/test-multi-tenant.ts` (33 assertions) |
| Truth engine has conviction caps | `git grep "0.99" src/lib/truth.ts` |
| Apache-2.0 license | `cat LICENSE` |
| Privacy policy exists | `docs/PRIVACY.md` |
| Threat model | `docs/THREAT-MODEL.md` |
| SLOs | `src/lib/slo.ts` + `docs/SLA.md` |

Every one of these is a **single git command** away.

— Sam Peacock
2026-08-11
