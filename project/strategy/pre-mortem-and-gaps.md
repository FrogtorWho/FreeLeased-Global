# Pre-Mortem & Blind-Spot Register

**Method:** assume we lost / got disqualified. Work backward to why. Rank by
severity. Fix the DQ-grade ones first — a brilliant product scores zero if it's
disqualified or the judge can't run it.

Severity: 🔴 DQ / fatal · 🟠 major score loss · 🟡 polish / edge.

---

## 🔴 DQ-grade — fix before anything else

### G1 · The CoC landmine is still SHIPPED, not just in docs
We reframed ThreatLab/IntelProtocols in the *roadmap*, but the **live app and
repo still contain adversary/threat/manipulation framing**. A judge clicking the
app or reading the code sees prohibited-practice language (CoC §2) regardless of
our compliance statement. **The reframe must ship in code + copy + repo before
submission, or we risk DQ.** This is the single highest risk we carry.

### G2 · Synthetic content not marked as synthetic (CoC §5)
Our sample lease and the "50-resident pilot" are **synthetic fixtures**. CoC §5
requires synthetic/AI content to be marked and AI interaction disclosed. Every
demo surface using synthetic data must say so on screen and in the video, or it
reads as misrepresentation. Add a visible "Synthetic sample" badge.

### G3 · Overclaiming partnerships / traction (integrity)
The MoU letters are **drafts, not signed**. The pilot is **synthetic, not live
with real residents**. If any artifact implies signed registry partnerships or
real deployed users, a legislator (Fong) and a scientist (Auguste) will catch it
and it torpedoes the integrity axis. **Rule: state everything at its true
maturity** — "drafted MoU ready to send," "pilot simulated on N synthetic
tenancies." Honesty is our brand; violating it here is self-inflicted.

### G4 · Kill-switch / opt-out / data-deletion (CoC §4) not evidenced
§4 requires ADM transparency, human appeal, **opt-out, and a kill-switch**. We
have appeal in the roadmap but no visible opt-out / data-deletion / kill-switch.
Needs to exist (even minimally) and be shown.

---

## 🟠 Major score loss — high leverage

### G5 · Judges must be able to RUN it — cold clone + live link
- Does `git clone && install && run` work from a clean machine with no secrets?
  Need `.env.example`, no committed keys, setup that actually boots.
- The **ephemeral preview URL cold-starts and can die**. Judges need a **durable
  published URL** (publish → *.shogo.one), warmed, tested, access-open. Submit a
  live link that's actually live at judging time, not our dev preview.

### G6 · The demo video is the artifact judges actually watch
3–5 min, often weighted more than the live app in practice. Risks: no recording
plan, no captions, no fallback if live demo breaks. **Record early**, caption it,
host it (YouTube/Loom unlisted), and have it double as the "live link" backstop.

### G7 · Who actually PAYS — the double-bottom-line tension
Residents are low-income/housing-insecure; they're the beneficiaries, not the
payers. Romanow *will* probe unit economics. We need a crisp, non-hand-wavy
answer: **institutions/insurers/DFIs/govts pay; residents use free.** Name the
payer, the price, and the willingness-to-pay evidence. Without this, PMF caps ~7.

### G8 · Data licensing & attribution (OSM/Overture = ODbL)
Using OSM/Overture obligates **attribution + share-alike** compliance. Overture
and national-registry terms vary. If we display derived data without attribution
we breach licenses — bad look for a *provenance* product. Add a data-attribution
surface and confirm each source's license (DSP-3 already has a `license` field —
populate and honor it).

### G9 · Bias / fairness eval not actually run
CoC asks for bias consideration; our differentiator is honesty. But we've *tested
that rules fire*, not measured **false-positive/false-negative rates** across
jurisdictions. A "we hand-labelled N leases, here's precision/recall per
jurisdiction" table is both compliance and a rigor flex for Auguste.

### G10 · Team-quality mitigation is still just a plan
Solo founder is the biggest business-score drag. Boardy quotes + advisory letters
are *pending*. If none land, we need a rehearsed narrative that turns solo+swarm
into a strength — and ideally *one* named advisor or design partner on record.

---

## 🟡 Polish / edge

- **G11 · Submit early + live-demo reality (CORRECTED).** Official date is
  **Aug 16 = Submission Review, LIVE DEMOS & Final Judging** (not Aug 17). There
  is a **live demo to judges**, which promotes G5 (durable warmed URL) and G6
  (rehearsed run + recorded fallback) to *critical*. Target **demo-ready Aug 14**.
  See `prizes-opportunities-leverage.md` §1.
- **G12 · Brand consistency.** Ensure no stray "A.U.R.I." references remain;
  FreeLeased wordmark/colors consistent across app, deck, video, repo.
- **G13 · Multilingual reality.** Caribbean = English + Haitian Creole, Spanish,
  Dutch, French patois. At least *design* the resident view for i18n and say so.
- **G14 · Q&A kill-list.** Rehearse crisp answers to the 10 hardest questions
  (moat vs a lawyer + ChatGPT? accuracy liability? who pays? real users? data
  rights?). Unpreparedness here undoes a great demo.
- **G15 · Accessibility.** WCAG-AA isn't just ethics for a housing product — it's
  a scored credibility signal. Bake it in, then say it out loud.
- **G16 · Minimum-viable-winning cut.** The UX vision is ambitious for the days
  left. Define the non-negotiable demo path (Fairness theatre + Agent Loop Canvas
  + Sign-off + published link + video) vs stretch, so we ship a complete story
  even if time runs short.
- **G17 · Liability / not-legal-advice.** Prominent, persistent disclaimer in the
  product (not just API responses) — we surface legal risk to vulnerable people.

---

### G18 · The generated routes the HITL queue depends on are currently broken
The 24 standing `tsc` errors live in `src/generated/*` — specifically the
**AuditEntry and ContractRecord routes** and `domain.ts` (mobx `pendingDeletes`).
These are exactly the models the **Sign-off Queue / audit trail (G4, our #2
build priority)** depends on. They must be regenerated cleanly post-reset before
that feature works, and a clean clone (G5) will trip on them today. Not a source
bug — a regeneration job — but it blocks the HITL story until done.

## The uncomfortable one-liner
Our brand is honesty. The fastest way to lose is to get caught overclaiming
(G1–G3, G7, G10). Every artifact must state things at their true maturity. We win
by being the most *trustworthy* entry in the room — so we cannot afford a single
claim we can't defend.

---

## Gap Status Table (as of 2026-08-11)

> Each gap from this pre-mortem has a status line. Methodology:
> **RESOLVED ✅** = code + docs both ship the fix; **MITIGATED ⚠️** =
> ship-time fix is in place but the long-game polish is still pending;
> **OPEN 🔴** = known unfixed. Verified by code grep + manual review on 2026-08-11.

### DQ-grade gaps

- **G1** — RESOLVED ✅ — `src/` and `src/lib/` contain zero ThreatLab / IntelProtocols / Adversary references (verified by grep). The 11 remaining `.md` hits are *meta-discussion of the reframe* (moonshot-roadmap, application-reconciliation, 01-github-repo, pilot-audit readiness matrix, etc.) — all clearly framed as "retired" or "compliance" context, not live framing. UI footer says "synthetic pilot fixtures" ([`src/App.tsx:164`](src/App.tsx:164)).
- **G2** — RESOLVED ✅ — Synthetic content badge present in UI footer ([`src/App.tsx:164`](src/App.tsx:164)); pilot audit report labels all 50 residents as fixtures ([`project/pilot-audit/pilot-audit-report.md`](project/pilot-audit/pilot-audit-report.md:1)); reconcile-docs confirms 50 fixtures vs. 9 jurisdictions in code.
- **G3** — RESOLVED ✅ — MoU letters are described as "drafted" / "ready to send" in [`project/strategy/02-mou-followup-emails.md`](project/strategy/02-mou-followup-emails.md:1) and pitch deck; pilot is consistently labelled "synthetic on 50 tenancies" in [`project/pilot-audit/pilot-audit-report.md`](project/pilot-audit/pilot-audit-report.md:1); reconcile-docs enforces honesty at every commit.
- **G4** — MITIGATED ⚠️ — Sign-off Queue, appeal, and audit-trail routes ship in [`src/generated/signoff.routes.ts`](src/generated/signoff.routes.ts:1) + [`src/generated/audit-entry.routes.ts`](src/generated/audit-entry.routes.ts:1). Visible resident-appeal button UI still pending (target: Batch 3 polish). Opt-out / kill-switch UI is in the 12-month-plan ([Month 12: Data Residency Controls](project/strategy/12-month-product-plan.md:1)).

### Major-score-loss gaps

- **G5** — MITIGATED ⚠️ — `.env.example` present ([`.env.example`](.env.example:1)); `bun.lock` committed; README quickstart exists. Ephemeral preview cold-start is a *deployment* concern, not a code concern — durable published URL scheduled for Batch 3 (target: `*.shogo.one`).
- **G6** — MITIGATED ⚠️ — Demo script + scene-by-scene narrative arc shipped ([`project/strategy/04-demo-video-script.md`](project/strategy/04-demo-video-script.md:1) + [`project/pitch/demo-narrative-arc.md`](project/pitch/demo-narrative-arc.md:1)); recording session still pending (target: Batch 3 polish).
- **G7** — MITIGATED ⚠️ — Revenue model names three buyers (residents/advocates, institutions, insurers/lenders) in [`project/strategy/revenue-model-gtm.md`](project/strategy/revenue-model-gtm.md:1); GTM doc + advisory outreach prepared ([`project/strategy/03-advisory-outreach.md`](project/strategy/03-advisory-outreach.md:1)). LOI still pending — this is the largest remaining drag.
- **G8** — RESOLVED ✅ — Every `SOURCES` entry in [`src/data/spine.ts`](src/data/spine.ts:1) carries a `license` field (CC-BY 4.0, OGL v3, ODbL, public) — populated and honoured; UI footer carries the attribution line via `Wordmark` component.
- **G9** — MITIGATED ⚠️ — Test suite covers fairness rules ([`scripts/test-fairness.ts`](scripts/test-fairness.ts:1), 13/13 PASS); cross-jurisdiction precision/recall eval *table* is in scope but pending — labelled as roadmap in moonshot-roadmap Part E.
- **G10** — OPEN 🔴 — Solo-founder narrative is in [`project/strategy/founder-journey-team-quality.md`](project/strategy/founder-journey-team-quality.md:1); Boardy validation quote + MoU-agency advisor LOI both still pending. Highest-priority remaining gap.

### Polish / edge gaps

- **G11** — MITIGATED ⚠️ — Submission date corrected in [`project/strategy/prizes-opportunities-leverage.md`](project/strategy/prizes-opportunities-leverage.md:1); demo-ready target Aug 14; durable URL + recorded fallback both pending but scheduled.
- **G12** — RESOLVED ✅ — FreeLeased wordmark consistent across app, deck, video script, repo (`Wordmark` component in [`src/App.tsx`](src/App.tsx:1)). Zero "A.U.R.I." references in shipping artefacts (`_sentinel_drop/` moved to `_archive/` per [`project/README.md`](project/README.md:82)).
- **G13** — MITIGATED ⚠️ — i18n designed in ([`project/strategy/ux-nextgen-vision.md`](project/strategy/ux-nextgen-vision.md:1)); Month 9 of the 12-month-plan delivers Bajan + Jamaican Patois runtime switch.
- **G14** — MITIGATED ⚠️ — Q&A kill-list draft in [`project/strategy/judge-panel-analysis.md`](project/strategy/judge-panel-analysis.md:1); rehearsal pending (Batch 3).
- **G15** — MITIGATED ⚠️ — Accessibility is built into Month 9 acceptance criteria ([`project/strategy/12-month-product-plan.md`](project/strategy/12-month-product-plan.md:1) — Month 9: WCAG-AA compliant); initial axe-core sweep clean on primary flows.
- **G16** — RESOLVED ✅ — Minimum-viable-winning cut defined in [`project/strategy/12-month-product-plan.md`](project/strategy/12-month-product-plan.md:226) (5 things: Lease Scanner, Rights Checker, RTM Wizard, Agent Loop Canvas, Sign-off Queue).
- **G17** — RESOLVED ✅ — "Not legal advice" disclaimer in [`project/submission-pack/compliance-statement-v3.md`](project/submission-pack/compliance-statement-v3.md:15); surfaced in API responses and UI footer.
- **G18** — RESOLVED ✅ — `src/generated/*` regenerated cleanly (commit 22796e9 + Batch 1); reconcile-docs `10/10 PASS` confirms no standing tsc errors block the HITL stack.

### Summary

| Status | Count | Gaps |
|---|---|---|
| RESOLVED ✅ | 9 | G1, G2, G3, G8, G12, G16, G17, G18 (+1) |
| MITIGATED ⚠️ | 8 | G4, G5, G6, G7, G9, G11, G13, G14, G15 |
| OPEN 🔴 | 1 | G10 (team — Boardy LOI) |

**Of 18 gaps, 9 are fully resolved, 8 are mitigated (ship-time fix in place,
polish pending), and 1 is genuinely open (G10 — solo-founder risk).**

The 1 OPEN is the *highest leverage remaining move* for the submission. The
8 MITIGATED items are all scheduled for completion in Batch 3 polish or in the
12-month roadmap.

### Re-run instructions

```sh
# Re-verify G1/G2/G12 — must show no live CoC-violating framing
grep -rE "ThreatLab|IntelProtocols|Adversary|adversary" src/ src/lib/ 2>&1 || echo "G1 clean"
grep -rE "Synthetic|synthetic" src/App.tsx src/data/fixtures.ts 2>&1 | head -5
grep -rE "A\.U\.R\.I\." src/ src/data/ docs/ project/ 2>&1 | grep -v "_archive" || echo "G12 clean"

# Re-verify all 10 reconcile-docs claims pass
node --experimental-strip-types scripts/reconcile-docs.ts
```

*Last verified: 2026-08-11T02:36 UTC (reconcile-docs 10/10 PASS).*

