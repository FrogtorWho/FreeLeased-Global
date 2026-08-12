<!--
purpose: 1-click activation runbook for FreeLeased social accounts — Sam executes this end-to-end to flip 0 → 2+ live accounts.
audience: Sam Peacock (principal) · Shogo (agent).
status: v1 (2026-08-12, GAUNTLET 3.0).
last-updated: 2026-08-12
owner: Sam Peacock (principal) · Shogo (agent)
cross-links: social-campaign-100.md, social-content-pack.md, social-campaign-100.export.csv, ../../project/management/convergence-checklist.md
-->

# Social Activation Runbook — 1-Click Where Possible

**Goal:** Flip 0 live social posts → **2+ live accounts with real, attributable URLs** before the buildathon deadline.

This runbook is what Sam runs end-to-end. The agent has done everything that
*can* be done offline (export CSV, draft copy, hash the schedule). The
irreducible human steps are the platform logins.

---

## Pre-flight (agent is done, just verify)

| # | Artefact | Path | Status |
|---|---|---|---|
| 1 | 30-day × 5-platform × 5-brand grid (750 rows) | [`social-campaign-100.export.csv`](social-campaign-100.export.csv) | DONE |
| 2 | JSON equivalent (Buffer/Hootsuite import) | [`social-campaign-100.export.json`](social-campaign-100.export.json) | DONE |
| 3 | Per-day summary | [`social-campaign-100.export.summary.md`](social-campaign-100.export.summary.md) | DONE |
| 4 | Day-1 copy packs (3 posts ready to paste) | [`social-content-pack.md`](social-content-pack.md) | DONE |
| 5 | Drafts for buildathon tie-ins | [`../content/social-post-03-compute.md`](../content/social-post-03-compute.md) | DONE |
| 6 | Live-posts ledger (start here) | [`social-live-posts.md`](social-live-posts.md) | PARTIAL — Sam fills URLs |

---

## 1-Click Activation (Sam, ~30 min)

### Step 1 — Pick 2 platforms (recommended: **LinkedIn + X**)

| Platform | Account handle (suggested) | Why |
|---|---|---|
| **LinkedIn** | `@sam-peacock-freeleased` (or your existing) | Long-form buildathon posts, partner intros |
| **X / Twitter** | `@FreeLeasedApp` (create if needed) | Buildathon hashtag #FutureCaribbean reach |
| **GitHub Discussions** | `github.com/<org>/FreeLeased-Global/discussions` | Tech Q&A + community |
| **Substack** | `freeleased.substack.com` | Long-form essays for institutional readers |
| **Mastodon** | `@freeleased@hachyderm.io` | Open-source audience |

### Step 2 — Activate GitHub Discussions (1 click — agent-side)

Already configured at:
[`project/strategy/01-github-repo.md`](../strategy/01-github-repo.md)

Just enable the **Discussions** tab on the public repo. This satisfies
"GitHub Discussions" automatically with zero ongoing work.

### Step 3 — Post Day-1 content from `social-content-pack.md`

The pack has 3 ready-to-paste posts. Post in this order:

1. **LinkedIn** (long-form buildathon intro) — paste, add 1 image from
   [`docs-site/`](../../docs-site/), publish.
2. **X** (thread: 1/5 → 5/5, buildathon problem statement) — paste each
   tweet, schedule 5-min apart.
3. **LinkedIn** (post #2 — technical deep dive on MCP) — paste, publish.

### Step 4 — Log live URLs

Open [`social-live-posts.md`](social-live-posts.md) and add the live URL
for each post. The convergence-checklist reads this file.

### Step 5 — Schedule the rest

Import [`social-campaign-100.export.csv`](social-campaign-100.export.csv)
into Buffer / Hootsuite / Typefully. Set the schedule to the slot times in
the grid (08:00 UTC / 14:00 UTC / etc.). Review first 7 days manually, then
auto-schedule the rest.

---

## Activation matrix — minimum viable

| Surface | Sam-side | Agent-side | Live URL |
|---|---|---|---|
| LinkedIn | login + paste 3 posts | drafts in social-content-pack | `linkedin.com/posts/<id>` |
| X | login + paste 5-tweet thread | drafts in social-content-pack | `x.com/FreeLeasedApp/status/<id>` |
| GitHub Discussions | enable Discussions tab | configured in repo | `github.com/<org>/FreeLeased-Global/discussions` |
| Substack | login + publish first essay | draft in social-content-pack (long-form) | `freeleased.substack.com/p/<slug>` |
| Mastodon | login + boost first toot | draft in social-content-pack | `@freeleased@hachyderm.io/<id>` |

**Minimum for convergence:** any 2 of the above must have at least 1 live URL each.

---

## What the agent does NOT do

- I don't have your login credentials. I won't ask for them.
- I don't post from your accounts. You do.
- I don't bypass 2FA or post via headless browser. The audit trail must be
  clean.

## What the agent will do after you post

- Add the live URL to `social-live-posts.md` (you paste, I annotate).
- Re-run `scripts/audit-trail-verifier.ts` — it will see the new line and
  check the URL format.
- Re-run `scripts/judge-panel-100.ts` — the social posts add to the
  `impact` axis evidence.
- Commit + push the updated ledger.

---

## Time estimate

- 5 min — enable GitHub Discussions
- 10 min — paste 3 LinkedIn posts
- 5 min — paste X thread
- 5 min — log URLs in `social-live-posts.md`
- **Total: 25 min → 2 live platforms + 1 community surface**

---

**End of runbook.** Once Sam executes the matrix, the convergence-checklist
row "Live social accounts" flips to DONE.