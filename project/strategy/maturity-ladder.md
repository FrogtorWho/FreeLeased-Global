---
title: Maturity Ladder — FreeLeased / RTM Sovereign (levels 1–10)
type: living-document
status: active
updated: 2026-08-05
tags: [maturity, trl, roadmap, honesty, loop-framework]
aliases: [Level Definitions, TRL, 10-10 Ladder]
---

> [!abstract] What this is
> A project-specific 1–10 maturity ladder (TRL-style) for **FreeLeased** — the
> open-source, local-first, resident-led **leasehold governance** platform
> (UK Right-to-Manage + service-charge audit + building-safety compliance, adapting
> to Caribbean condominium law). Each level has a **concrete exit criterion**: a
> thing that must be *true and demonstrable* to claim it. No level is claimed on
> intent — only on evidence. This is the honesty discipline (see
> [[truth-protocol]]) applied to our own maturity.

> [!warning] Honest current standing (2026-08-05)
> **We are at Level 4, reaching into Level 5.** The deterministic engine, statutory
> spine, and app are real and verified in-lab (67/67 tests, live endpoints); the
> pilot dataset is **synthetic and labelled as such**. We are **not** at 6+: no
> external design-partner field pilot, no paying users. The one candidate real-world
> case (Hudson House RTM) is **unverified pending the applicant's evidence** and
> cannot lift our level until corroborated. Overclaiming here is the pre-mortem G3
> risk — we grade ourselves the way we grade any other claim.

---

## The ladder

### 1 — Idea / concept sketched
**Generic:** Idea written down.
**FreeLeased:** The thesis is articulated — "leaseholders are structurally
out-gunned on service charges, RTM, and building-safety liability; codify the
statutes into a per-resident audit that works offline and is resident-owned."
**Exit criterion:** A one-paragraph problem+solution statement exists and names
the specific legal domain (leasehold, not general tenancy).
**Status:** ✅ done — see [[application-reconciliation]], project overview.

### 2 — Problem validated with 3+ conversations
**Generic:** 3+ interviews confirm the problem.
**FreeLeased:** ≥3 independent signals that leaseholders/RTM directors actually
hit this pain — from the founder's own live RTM experience, resident-advocacy
sources, and statutory-body/advocate input.
**Exit criterion:** ≥3 documented problem statements from distinct real people
(not us), each tied to a specific right (unlawful charge, missed s.20, BSA cost).
**Status:** 🟡 partial — founder's lived RTM case + advisory letters exist;
formal 3rd-party interview notes not yet logged. **Action:** capture 3 short
structured interviews and file them.

### 3 — Paper prototype / wireframe
**Generic:** Wireframe of the flow.
**FreeLeased:** The audit flow is designed — ingest a lease/service-charge pack →
run statutory diagnostics → per-resident hidden-rights report → action plan →
resident sign-off, with provenance on every cell.
**Exit criterion:** A clickable/annotated wireframe or component skeleton of the
end-to-end audit journey exists.
**Status:** ✅ done — the 9-view app IS the realised wireframe (Overview, Rights
Catalogue, Data Spine, Assurance, Research Desk, Communes, Gates, Dossier, About).

### 4 — Working prototype in the lab
**Generic:** It runs on the bench.
**FreeLeased:** The core engine works deterministically on curated inputs:
statutory spine (9 jurisdictions, 20+ codified rights), consensus/alignment gate,
fairness scoring, veracity engine, and the live API — all reproducible.
**Exit criterion:** A green verification run (tests + typecheck + live endpoints
returning correct shapes) on representative synthetic data, re-runnable on demand.
**Status:** ✅ done — 67/67 tests, our-source tsc clean, `/api/summary` +
`/api/research-tasks` 200. This is the floor we can *prove* today.

### 5 — Prototype tested with 1 real user
**Generic:** One real user completed the flow.
**FreeLeased:** One genuine leaseholder/RTM director (not the team) runs their
*own* real documents through the audit end-to-end and reaches a signed-off report.
**Exit criterion:** One recorded session with a real user + their real (redacted)
docs producing a report they confirm is meaningful; feedback logged.
**Status:** 🟡 in reach — the founder's Hudson House RTM pack is the natural
first case; counts for L5 **only once run through the tool and evidenced**, and
even then a fully-independent user is stronger. **Action:** run one real pack.

### 6 — Field pilot with a design partner
**Generic:** A partner uses it in their setting.
**FreeLeased:** One RTM company, leaseholder association, or advocacy org adopts
the tool for a real building over a defined period, feeding real service-charge/
lease data and acting on outputs.
**Exit criterion:** A signed (even informal) design-partner arrangement + ≥1 real
building's data processed + at least one action taken on the tool's findings.
**Status:** ⬜ not yet. MoU letters exist as *intent*, not active pilots.

### 7 — Reliable in a real environment
**Generic:** Works dependably outside the lab.
**FreeLeased:** Handles messy real-world inputs (scanned leases, inconsistent
service-charge accounts, multiple buildings) without hand-holding; PII redaction,
provenance, and abstention behave correctly on real data at small scale.
**Exit criterion:** N real buildings processed with a low, measured error/abstention
rate and no data-safety incidents; failures degrade gracefully.
**Status:** ⬜ not yet.

### 8 — Full feature set, small user base
**Generic:** Feature-complete for a niche cohort.
**FreeLeased:** The promised scope is live for a real cohort — service-charge
audit + RTM eligibility + BSA compliance across UK, with ≥1 Caribbean jurisdiction
(Cayman/Barbados/Jamaica) operating on real data for a handful of buildings.
**Exit criterion:** All core modules used by a small but real recurring user base
across ≥2 jurisdictions.
**Status:** ⬜ roadmap. (Caribbean + valuation/climate agents are roadmap, not built.)

### 9 — Paying users / launched
**Generic:** Launched; someone pays.
**FreeLeased:** Public launch of the OSS platform + a sustaining revenue path
(e.g. hosted/assisted audits, or a funded advocacy/soft-landing arrangement).
Given the local-first OSS ethos, "paying" may be orgs/associations, not individuals.
**Exit criterion:** ≥1 paying/again-committing customer OR a funded deployment,
with the OSS core freely available.
**Status:** ⬜ roadmap.

### 10 — Scaling with proven traction
**Generic:** Growing with proven traction.
**FreeLeased:** Multi-jurisdiction adoption with retention and outcome evidence —
buildings taken into RTM, charges recovered/avoided, safety issues escalated —
and a repeatable path to add jurisdictions from the statutory spine.
**Exit criterion:** Sustained growth curve + documented resident outcomes across
multiple jurisdictions; onboarding a new jurisdiction is a bounded, repeatable task.
**Status:** ⬜ vision.

---

## How we move the needle (loop hook)
Each level's **exit criterion is the only thing that promotes us** — mirroring the
verified/inference/pending discipline in [[truth-protocol]]. Nearest promotions:
1. **L2 → confirmed:** log 3 structured problem interviews.
2. **L4 → L5:** run one real leaseholder's pack end-to-end to a signed report.
3. **L5 → L6:** convert one MoU/advocate contact into an active design partner.

> [!note] Demo honesty
> In the pitch we state **"Level 4→5, verified in-lab on synthetic-labelled data,
> first real case in progress"** — a credible, checkable claim beats an inflated one.
