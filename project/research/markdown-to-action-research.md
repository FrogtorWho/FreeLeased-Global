# Markdown-to-Action Conversion Research — FreeLeased

> **By Sam Peacock · Founder, FreeLeased**
> **Date:** 2026-08-12 · **Status:** primary-source audit + prioritised conversion plan
> **Method:** Live filesystem audit (`Get-ChildItem -Recurse -Filter '*.md'` → 180 active files; 326 including archived) → actionability classification → effort estimate per file
> **Inventory log:** `.shogo/runtime/md-inventory.txt`
> **Companion:** [`project/strategy/gauntlet-loop.md`](../strategy/gauntlet-loop.md:1), [`project/strategy/100-judge-gap-report.md`](../strategy/100-judge-gap-report.md:1)

Sam's challenge: **"We have 326 markdown files describing things that
aren't real."** This research catalogues the ones that are
**convertible into real artefacts in 1-2 hours each**, ranks them by
**judge-impact**, and gives an executable order. The goal is a single
list of **"10 markdown files → 10 real artefacts, in priority order."**

---

## 1. The conversion patterns that work

Across the 180 active markdown files (and the 146 in `_archive/` /
`_handoff/`), the same five **patterns of conversion** repeat. The
patterns are drawn from real-world precedents (Trello from blog posts,
no-code from specs, GitHub Actions from cron, GitHub Pages from dist/,
email from `.eml` templates).

| # | Pattern | Markdown artefact → Real artefact | Examples in our repo |
|---|---|---|---|
| P1 | **MD → HTML** | One markdown file becomes one static page | `docs-site/*.html`, `docs/PRIVACY.md` → published URL |
| P2 | **MD → CI script** | Spec becomes a `.github/workflows/*.yml` file | `docs/RUNBOOK.md` → on-call alert |
| P3 | **MD → CLI tool** | Spec becomes a `scripts/*.ts` (or `.py`, `.sh`) | `scripts/reconcile-docs.ts` (already real) |
| P4 | **MD → Email / MoU** | Draft becomes ready-to-send | `project/strategy/mou-followup/01-followup-*.md` → outbound email |
| P5 | **MD → Form / Config** | Spec becomes a JSON/YAML/TOML | `project/strategy/revenue-model-gtm.md` → `pricing.json` |
| P6 | **MD → Dashboard panel** | KPIs become a UI view | `project/strategy/project-stats.md` → live stats card |
| P7 | **MD → Test fixture** | Synthetic data becomes a `*.test.ts` file | `project/pilot-audit/synthetic-lease.md` → already in `project/demo/sample-lease.txt` |
| P8 | **MD → External post** | Draft becomes a real tweet / LinkedIn / blog post | `project/marketing/social-content-pack.md` → actual posts |
| P9 | **MD → .env.example line** | Key list becomes one new env var | `docs/local-edge-llm.md` → `USE_LOCAL_EDGE=1` (already shipped) |
| P10 | **MD → Schema migration** | Description becomes a `prisma/schema.prisma` addendum | `project/strategy/multi-jurisdiction-legal-spine.md` → `model StatuteRef` (already shipped) |

**The pattern that is most underrated in our repo is P3 (MD → CLI
tool)** — every script in `scripts/` started as a markdown plan in
`project/strategy/`. The next 1-2 hours are best spent on **scripts
that don't exist yet but should**.

---

## 2. Audit — 180 active markdown files, classified

### 2.1 Distribution by purpose (eyeballed from inventory)

| Purpose | Count (est.) | Already-converted? | Convertible in 1-2h? |
|---|---:|---|---|
| Brand specs (5 brands × 3 specs each) | 15 | Partial (Veridian → docs-site CSS) | Yes (Quill/Monolith/Canopy/Coral CSS) |
| Submission-pack | 8 | Partial (markdown is the submission) | 1-2h to render as `pitch.pdf` |
| Strategy / planning | 60+ | Many are referenced by code; few are actionable | ~10 candidates |
| Research | 11 | This batch (4 new research docs) | Mostly done |
| Pilot / user-evidence | 7 | Synthetic pilot → `project/pilot-audit/mock-pilot-session-2026-08-11.md` | ~2 candidate conversions |
| Marketing / social | 5 | Drafts in `social-content-pack.md` | Yes (post 3 social) |
| Pitch / demo | 4 | Demo script written; video not recorded | Demo script → 4-min video is 2-4h |
| Memory / logbook | 5 | Already running | None — these ARE the artefact |
| MoU follow-up emails | 7 | Drafted; **0 sent** | Yes — 30 min to email each |
| Operational / docs | 14 | Mostly live (privacy, terms, threat-model) | 1-2 to render |

### 2.2 The 10 markdown files most worth converting (priority order)

This is the **prioritised list Sam asked for**. Each row shows the
source markdown, the target real artefact, the effort, and the judge-impact
delta (in /10 per the in-the-world scale).

| # | Source markdown | → Real artefact | Effort | Judge-impact (in-the-world Δ) |
|---|---|---|---|---:|
| **1** | [`project/strategy/01-github-repo.md`](../strategy/01-github-repo.md:1) | Add `LICENSE`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`, issue templates to repo | 1 h | **+0.4** (open-source maintainer archetype + accessibility of repo) |
| **2** | [`project/strategy/mou-followup/01-followup-export-barbados.md`](../strategy/mou-followup/01-followup-export-barbados.md:1) (and 6 others) | Send 7 MoU follow-up emails (rename `READY_TO_SEND` + send via `sam.peacock1@gmail.com`) | 1 h | **+0.3** (partnerships composite) |
| **3** | [`project/strategy/04-demo-video-script.md`](../strategy/04-demo-video-script.md:1) | Record 3-5 min demo video (OBS / screen capture) | 2 h | **+0.4** (judges watch this more than the app) |
| **4** | [`project/strategy/customer-discovery-script.md`](../strategy/customer-discovery-script.md:1) | Run 3 x 10-min UK leaseholder interviews; record consent | 2 h | **+0.5** (PMF closes the gap from 7.5 → 8.5) |
| **5** | [`project/marketing/social-content-pack.md`](../marketing/social-content-pack.md:1) | Post 3 social media posts (LinkedIn / X / Bluesky) | 30 min | **+0.3** (PR composite + diaspora reach) |
| **6** | [`project/strategy/05-advisory-ask-boardy.md`](../strategy/05-advisory-ask-boardy.md:1) | Send Boardy the advisory ask; track reply | 30 min | **+0.3** (team-quality composite) |
| **7** | [`project/pilot-audit/real-pilot-onboarding.md`](../pilot-audit/real-pilot-onboarding.md:1) | Onboard 1 real leaseholder (synthetic-lease → real walkthrough) | 2 h | **+0.5** (real-impact composite — biggest lever) |
| **8** | [`project/strategy/pricing-page-v1.md`](../strategy/pricing-page-v1.md:1) | Render pricing page in `docs-site/pricing.html` | 1 h | **+0.2** (accounting/business-model visibility) |
| **9** | [`docs/RUNBOOK.md`](../../docs/RUNBOOK.md:1) | Add 5 runbook entries to on-call alerts / GitHub issue templates | 1 h | **+0.2** (DevOps / SRE axis) |
| **10** | [`project/strategy/architecture-diagram.md`](../strategy/architecture-diagram.md:1) | Render architecture diagram as SVG in `docs-site/docs.html` | 1 h | **+0.2** (frontend + backend axes) |

**Sum of judge-impact: ~+3.3 across the in-the-world composite.**
That would lift the **in-the-world composite from ~5.5/10 to ~8.8/10**
(cf. the baseline of 5.5 from [`100-judge-gap-report.md:294`](../strategy/100-judge-gap-report.md:294)).

### 2.3 The conversion tactics — what to actually do per row

| # | Tactic | Steps |
|---|---|---|
| 1 | **MD → Repo polish** | (a) Verify [`LICENSE`](../../LICENSE:1) is Apache-2.0 ✅ (b) Add `CODE_OF_CONDUCT.md` referencing CfC CoC (c) Add `.github/CODEOWNERS` (d) Add `.github/ISSUE_TEMPLATE/{bug,feature}.md` (already present per inventory) |
| 2 | **MD → Email** | (a) Open each `01-…07-followup-*.md` (b) Verify recipient address (c) Copy subject + body into Gmail (d) Send |
| 3 | **MD → Video** | (a) Open `freeleased-app/` (b) Run `bun run dev` (c) Open OBS / screen recorder (d) Narrate 4-min walkthrough per [`04-demo-video-script.md`](../strategy/04-demo-video-script.md:1) |
| 4 | **MD → Interviews** | (a) Post in `r/ukpersonalfinance` or relevant Slack/Discord (b) Book 3 x 10-min Zoom calls (c) Ask the 5 questions from [`customer-discovery-script.md`](../strategy/customer-discovery-script.md:1) (d) Record with consent |
| 5 | **MD → Posts** | (a) Pick 3 posts from `social-content-pack.md` (b) Log into LinkedIn / X / Bluesky (c) Paste + schedule |
| 6 | **MD → Boardy ask** | (a) Log into Boardy (b) Send the 3-line ask from `05-advisory-ask-boardy.md` (c) Track reply in `decision-log.md` |
| 7 | **MD → Real pilot** | (a) Identify 1 volunteer (b) Run them through `real-pilot-onboarding.md` (c) Record session with consent (d) Add row to `user-evidence-tracker.md` |
| 8 | **MD → Pricing page** | (a) Open `docs-site/pricing.html` (b) Replace placeholder copy with content from `pricing-page-v1.md` (c) Verify tier table |
| 9 | **MD → Runbook** | (a) Open [`docs/RUNBOOK.md`](../../docs/RUNBOOK.md:1) (b) For each entry, create a `.github/ISSUE_TEMPLATE/runbook.md` (c) Add to `on-call.md` |
| 10 | **MD → Diagram** | (a) Open `architecture-diagram.md` (b) Render as inline SVG (c) Embed in `docs-site/docs.html` |

---

## 3. The "AI-related" conversions (judges reward agentic-AI evidence)

These are conversions that directly **surface agentic-AI evidence** to judges.

| # | Source markdown | → Real artefact | Effort | Impact |
|---|---|---|---|---|
| A1 | [`project/strategy/gauntlet-loop.md`](../strategy/gauntlet-loop.md:1) (already a real loop) | Add a **live status badge** to `README.md` showing last loop run + conviction scores | 30 min | Judges see "live agentic system" |
| A2 | [`project/strategy/loop-protocol.md`](../strategy/loop-protocol.md:1) | Render the 5-sub-loop as a **public dashboard** in `docs-site/` | 2 h | Judges see methodology |
| A3 | [`src/lib/` engines (consensus, fairness, veracity, reconciliation, etc.)](../../src/lib/) | Add a **"Live Engines" panel** to the app showing each engine's last invocation | 1 h | Judges see HITL + multi-agent in action |
| A4 | [`scripts/test-*.ts`](../../scripts/) (24 test files) | Add a **CI badge** to `README.md` showing test count + last green | 30 min | Judges see engineering rigour |

---

## 4. The "high-effort, can't-do-today" conversions (deferred)

These are conversions that are **real and important but take >2 h** —
out of sprint scope.

| Source | Real artefact | Effort | Why deferred |
|---|---|---|---|
| `project/strategy/12-month-product-plan.md` | Live product roadmap page | 4 h | Post-sprint |
| `project/strategy/multi-jurisdiction-legal-spine.md` | Add Cayman + Barbados statutes to live `prisma/schema.prisma` | 1 day | Partial already; full migration is 1 week |
| `project/strategy/i18n-roadmap.md` | Patois / Kweyol / Spanish translations | 2-3 weeks | Out of sprint |
| `project/brand/brand-{2,3,4,5}-*/brand-spec.md` | 4 additional brand CSS bundles | 1 day | Not needed for track-9 win |
| `project/research/edge-llm-research.md` | Live local-edge LLM default | 1 day | Plumbed but not default per [`100-judge-gap-report.md:189`](../strategy/100-judge-gap-report.md:189) |

---

## 5. Conversion attempts already shipped (proof the pattern works)

| Already-converted artefact | Source markdown | When |
|---|---|---|
| [`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1) | Spec in [`project/strategy/comprehensive-scoring-reconciliation.md`](../strategy/comprehensive-scoring-reconciliation.md:1) PART 5 | Phase 13 |
| `docs-site/*.html` (8 pages) | [`project/marketing/social-content-pack.md`](../marketing/social-content-pack.md:1) | Phase 13 |
| `docs/PRIVACY.md`, `docs/TERMS.md`, `docs/SECURITY.md`, `docs/THREAT-MODEL.md`, `docs/SLA.md`, `docs/RUNBOOK.md`, `docs/onboarding.md` | Each had a draft in [`100-judge-gap-report.md`](../strategy/100-judge-gap-report.md:1) | Phase 13 |
| [`scripts/extract-sample.ts`](../../scripts/extract-sample.ts:1) | [`project/research/regulatory-landscape.md`](../research/regulatory-landscape.md:1) | Phase 13 |
| [`scripts/social-export.ts`](../../scripts/social-export.ts:1) | [`project/marketing/social-campaign-100.md`](../marketing/social-campaign-100.md:1) | Phase 13 |
| `prisma/schema.prisma` extensions | [`project/strategy/multi-jurisdiction-legal-spine.md`](../strategy/multi-jurisdiction-legal-spine.md:1) | Phase 11+ |

**Conversion rate, so far:** ~10 of the 180 active markdown files have
become real artefacts in this sprint. **Rate target:** 10 more in the
next 4 days.

---

## 6. The 10→10 plan (highest-leverage moves, ranked)

If Sam could only do 10 markdown-to-real conversions, this is the order:

| Rank | Conversion | Estimated in-the-world lift |
|---|---|---:|
| 1 | **Pilot 1 real leaseholder** ([#7 in §2.2](#)) | +0.5 |
| 2 | **Record 4-min demo video** ([#3](#)) | +0.4 |
| 3 | **Repo polish: LICENSE, CoC, CODEOWNERS** ([#1](#)) | +0.4 |
| 4 | **3 UK leaseholder interviews** ([#4](#)) | +0.5 |
| 5 | **Send 7 MoU follow-up emails** ([#2](#)) | +0.3 |
| 6 | **Live agentic-loop badge in README** (A1 in §3) | +0.3 |
| 7 | **Post 3 social posts** ([#5](#)) | +0.3 |
| 8 | **Pricing page rendered** ([#8](#)) | +0.2 |
| 9 | **Architecture diagram in docs-site** ([#10](#)) | +0.2 |
| 10 | **Runbook entries as issue templates** ([#9](#)) | +0.2 |

**Predicted in-the-world lift:** from ~5.5/10 → ~8.5/10.

This is the same composite the existing
[`moonshot-roadmap-10-10.md`](../strategy/moonshot-roadmap-10-10.md:1)
targets via Tier-1 + Tier-2 lifts. The conversion pattern **is** the
lift playbook, viewed from the "markdown → real artefact" angle.

---

## 7. Two actions taken from BATCH 4

The post-research section (§7 of this batch's execution) picks 2 of the
10 conversions:

1. **Action A — `scripts/submit-freeleased.ts`** (the "self-applying AI" hook from BATCH 2 §6)
   - Source inspiration: `project/strategy/application-reconciliation.md` + the competitor pattern from C1
   - Effort: ~1.5 h
   - Judge-impact: +0.3 (memorability + track-fit)

2. **Action B — `docs-site/index.html` sponsor-stack callout** (the "sponsor halo" hook from BATCH 2 §3)
   - Source: `docs-site/index.html` (existing placeholder)
   - Effort: ~15 min
   - Judge-impact: +0.2 (visibility + memorability)

---

## 8. Files inventory

The complete 180-file inventory is at
[`.shogo/runtime/md-inventory.txt`](../../../.shogo/runtime/md-inventory.txt:1)
(bytes per file). Archived/handoff dirs (146 more files) were excluded.

**Top 5 by size** (where size ≈ depth of thinking):
1. `AI_JOURNAL.md` — 111 KB
2. `STACK.md` — 27 KB
3. `project/strategy/gauntlet-loop.md` — 50 KB
4. `project/strategy/comprehensive-scoring-reconciliation.md` — 35 KB
5. `project/strategy/100-judge-panel.md` — 30 KB

**Bottom 5 by size** (where size ≈ placeholder):
- `TOOLS.md` — 60 B (probably a stub)
- `project/content/social-posts-backfill-jul27-aug6.md` — 0 B (empty file)
- `src/data/MIGRATION-v1-to-v2.md` — 8.6 KB (one-shot conversion)
- `project/research/roadmap.md` — 3.2 KB (compressed)
- `project/strategy/mou-followup/*.md` — ~2 KB each (7 emails)

---

## 9. Probe-log citations

- `Get-ChildItem -Path . -Recurse -Filter '*.md' -File` → 180 active files
- Excluded dirs: `node_modules`, `.venv`, `.shogo`, `.cursor`, `dist`, `_archive`, `_handoff`, `src-rhd-extracted`, `.git`
- Including excluded → 326 markdown files (matches Sam's count)

---

*Generated 2026-08-12. Reconciles to [`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1) (last run: 10/10 PASS).*