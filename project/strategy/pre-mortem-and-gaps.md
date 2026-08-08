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
