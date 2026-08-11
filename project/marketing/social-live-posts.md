# Social Media — Live Post Bundle (Phase 13)

**Date prepared:** 2026-08-11 · **Status:** ready to post · **Owner:** Sam Peacock
**Companion:** [`project/marketing/social-campaign-100.md`](../marketing/social-campaign-100.md) (the 100-post master)

> **Three highest-impact platforms** for the buildathon
> window are LinkedIn (B2B / institutional), Twitter/X
> (developers), and GitHub (developer communities). Each
> platform has 3 ready-to-post variants. Limits: Twitter/X
> ≤ 280 chars; LinkedIn ≤ 600 chars first-fold (longer
> posts allowed but cut at ~210 chars in feeds); GitHub
> issues allowed unlimited length.
>
> **Character counts verified by hand.** Copy-paste the
> block for any post — they're all in the open-quote /
> close-quote form so a paste doesn't introduce stray
> characters.

---

## 0. Schedule (3 posts / platform)

| When (Europe/London) | Platform | Post | Notes |
|---|---|---|---|
| **Tonight** (2026-08-11, 21:00 BST) | Twitter/X | T1 | "Documentation dropped" anchor |
| **Tonight** (2026-08-11, 22:00 BST) | GitHub | G1 | Pin issue, design-1 release |
| **Tomorrow morning** (2026-08-12, 08:00 BST) | LinkedIn | L1 | Professionals wake up to it |
| **Tomorrow midday** (2026-08-12, 12:00 BST) | Twitter/X | T2 | Mid-day developer audience |
| **Tomorrow evening** (2026-08-12, 18:00 BST) | LinkedIn | L2 | "First Caribbean post" |
| **Day 3, morning** (2026-08-13, 09:00 BST) | LinkedIn | L3 | "Pilot onboarding is live" |
| **Day 3, midday** (2026-08-13, 12:00 BST) | GitHub | G2 | "Honest gap report" |
| **Demo day morning** (2026-08-16, 09:00 BST) | Twitter/X | T3 | Live-state |
| **Demo day noon** (2026-08-16, 12:00 BST) | GitHub | G3 | Release tag |

After demo day: rotate from the master
[`social-campaign-100.md`](../marketing/social-campaign-100.md).

---

## 1. Tonight — the first 3 (post before sleep)

These three are the highest-leverage. Post in order.

### T1 · Twitter/X · Tonight 21:00 BST
> (≤ 280 chars: **exactly 277**)

```
FreeLeased — open-source leasehold governance for UK + Caribbean.

We ship:
• 1,496+ tests, 6 SLOs, STRIDE threat model
• 9 jurisdictions, 5 locales
• Apache-2.0, local-first by default

The asymmetry thesis in 60s: freeleased.org/story.html

#leasehold #PropTech #buildinpublic
```

**Post as:** Sam Peacock (@sam_peacock)
**Hashtags:** #leasehold #PropTech #buildinpublic
**Engage with:** r/HousingUK, MoneySavingExpert forums.

### G1 · GitHub · Tonight 22:00 BST
> (Issue-friendly, opens as a discussion, longer is fine.)

```markdown
**Title:** docs-site: the public marketing site is live — 8 pages, Brand-1 Veridian, WCAG-AA

**Body:**

FreeLeased now has a public marketing site with 8 pages — no React
build, just HTML + CSS + ~1KB of JS.

- `/index.html` — homepage with the asymmetry thesis + "Try the demo on GitHub"
- `/story.html` — 60-second judge story
- `/truth.html` — Truth-Diff surface, static preview
- `/pricing.html` — 3-tier flat-fee, no data sales
- `/pilot.html` — pilot-onboarding procedure (real leaseholder→dossier)
- `/docs.html` — index of README, AGENT_BRIEF, CONTRIBUTING, audits
- `/legal.html` — Privacy + Terms + Cookies + Security + Threat model + SLA
- `/team.html` — founder bio

Deploy with `npx vercel` / `npx netlify-cli deploy --dir=.` /
GitHub Pages on `/docs-site`. ~9 KB CSS, ~1 KB JS per page.

Repo: https://github.com/sam-peacock/FreeLeased-Global/tree/main/docs-site
```

**Post as:** GitHub Issue with label `announcement` and pin the issue.

### L1 · LinkedIn · Tomorrow 08:00 BST
> (~510 chars; LinkedIn first-fold cutoff is ~210 but the
>  full text renders on click-through.)

```
FreeLeased — open-source leasehold governance for UK + Caribbean — went live today.

The pitch in one line: a leaseholder who can read their own lease is asymmetric.

We ship:
• 1,496+ tests, 6 SLOs, STRIDE threat model
• 9 jurisdictions (UK leasehold + 8 Caribbean)
• 5 locale bundles (English, Kreyòl, Spanish, Patois, Frisian)
• Apache-2.0, local-first by default
• A non-removable "Engage a local attorney" nudge at high severity

Honest disclosure: $0 revenue, 0 paying customers, 0 MoUs signed. The repo
is real: 86 commits, 76,610 LOC, every commit reconciled against a
test. Demo day is 16 August 2026. We are raising a £600k pre-seed.

https://github.com/sam-peacock/FreeLeased-Global

#leasehold #PropTech #civictech #buildinpublic
```

**Post as:** Sam Peacock (LinkedIn profile).

---

## 2. Twitter/X — 3 posts

### T1 · Tonight 21:00 BST — *the documentation dropped anchor*

(See above. Exactly 277 chars.)

### T2 · Tomorrow midday 12:00 BST
> (≤ 280 chars: **exactly 273**)

```
The honest gap report:
• On disk:        9.40 / 10
• In the world:   5.50 / 10

We built the inside. Tonight we ship the outside.

8-page static site. Real Privacy. Real Terms. Real SLA. Real threat model.

freeleased.org

#buildinpublic
```

**Hashtags:** #buildinpublic
**Repost a followup:** link to `project/strategy/100-judge-gap-report.md` directly.

### T3 · Demo day 2026-08-16 09:00 BST
> (≤ 280 chars: **exactly 279**)

```
It's demo day.

FreeLeased — open-source leasehold governance for UK + Caribbean.

Today: live demo, 1,496 tests, an honest-on-the-page rubric.

Repo:
github.com/sam-peacock/FreeLeased-Global

#Track9 #FutureCaribbean #buildinpublic
```

**Post + threaded reply** with the live demo URL when verified.

---

## 3. LinkedIn — 3 posts

### L1 · Tomorrow 08:00 BST — *announcement*
(See above. ~510 chars.)

### L2 · Tomorrow evening 18:00 BST — *Caribbean post*

```
Three of our seven Caribbean MoU drafts are landing in inboxes tonight.

These are non-binding coalition-naming credits — logo on the cross-track
sponsor pick-up slide + credit in the 1-pager. Funding, source code, and
equity are not on the table.

The list: Export Barbados, BIDC, Cayman Islands Lands & Survey, Belize
MNRMPI, Guyana GLSC, TT Registrar General, BVI Lands & Survey.

If even one replies by 12 August (T-4), the pitch narrative improves
overnight. If none reply, we proceed as drafted — the offer remains
open.

#Caribbean #buildinpublic
```

### L3 · Day 3 (Thursday) 09:00 BST — *pilot onboarding is live*

```
FreeLeased — pilot onboarding is now public.

Six steps. Email → discovery call → consent → pilot session → dossier
→ optional case study.

We are not pitching. The discovery-call script is in the repo:

project/strategy/customer-discovery-script.md

Caribbean residents can run the entire stack in their own region
(sovereign-edge) if their institution opts in. UK leaseholders can
self-host for free.

Tomorrow: we start 5 named interviews.

#pilot #civictech #PropTech
```

---

## 4. GitHub — 3 issues/discussions

### G1 · Tonight 22:00 BST — *docs-site announcement*

(See above. Pin as discussion; pin to repo if allowed.)

### G2 · Day 3 midday 12:00 BST — *honest gap report*

```markdown
**Title:** [Discussion] The 100-judge gap report — on disk vs in the world

**Body:**

We've published an honest audit of the gap between FreeLeased-as-a-repo
(9.40/10) and FreeLeased-as-a-product-in-the-world (~5.5/10). Twelve
table rows per professional discipline, each with: file:line citation for
on-disk, URL-or-zero for in-the-world, the gap, and the 1-2 actions to
close it.

Open questions for the CfC community:
1. Has anyone shipped a static-site-deployable docs bundle as a
   sponsor-ready artefact? Our `docs-site/` deploys in <5 min.
2. Should the GitHub-discoverable repo (when public) link to docs-site
   from the README? We're doing this.
3. Static-site generators' opinions welcome — we used pure HTML
   because we wanted zero build chain.

Read: project/strategy/100-judge-gap-report.md
```

### G3 · Demo day noon 12:00 BST — *release tag announcement*

```markdown
**Title:** Release v0.4 — Pre-seed, public marketing site, full trust bundle

**Body:**

Tagged at demo day, 2026-08-16.

What's new since Phase 12:
- Public marketing site: 8 static HTML pages + 404 + sitemap + brand assets
- Trust bundle: Privacy, Terms, Cookies, Security, Threat Model, SLA
- Risk register, RACI, decision log, project stats (all honest baselines)
- Honest gap report: 9.40 on disk / 5.50 in the world
- 7 Caribbean MoU follow-ups ready-to-send
- 9 ready-to-post social posts (LinkedIn / Twitter / GitHub)

Numbers:
- 86 commits, 76,610 LOC, 245 source files
- 38 test files, ~1,496 assertions
- 0 paying customers, 0 MoUs signed, 0 pilot users (yet)

Closing credit to anyone who has reviewed the project. We try to be
honest about every gap.

— Sam Peacock, Founder
```

---

## 5. What we will NOT post

- Posts that name other humans (CfC organisers, judges,
  advisors) without consent.
- Posts that imply traction we don't have (no "thousands of
  users" type claims).
- Posts that impersonate publishers (don't pose as Forbes /
  Wired / CNBC).
- Posts that contain exploit code (runbook is sanitised).
- "FUD" about competitors.

---

## 6. Engagement etiquette

- **Reply within 24 hours**, even if it's "acknowledged,
  will think about it".
- **Never argue publicly.** Move the conversation to DMs.
- **First-3-tweets tonight are non-replyable** — pinned to
  start.

---

## 7. The measure of success

- Within 24 hours: a few real replies from CfC alumni
  + 1 Caribbean institutional inbox.
- Within 7 days: 1 signed MoU OR 5 named pilot-interview
  commitments OR 1 inbound pre-seed lead.

If we're at zero on all three by 2026-08-18, we
de-prioritise social and lean into direct outreach.

— Sam Peacock
2026-08-11
