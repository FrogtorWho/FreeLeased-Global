# Moonshot Roadmap — 10/10 on every axis

**Status:** strategy · **Version:** 1.0 · **Companion:** `automation-doctrine.md`, `ux-nextgen-vision.md`
**Thesis:** we do not chase a good score. We remove every reason a judge could
score us below 10 — on the rubric, on sponsor fit, on perception — and we add
the one thing that makes a category-defining company: a system that gets
*measurably better on its own*, honestly, with a human at the wire.

The rubric is 50/50 Business Strength × Agentic AI Excellence, 13 sub-criteria,
5 judges. Below: current state → what a literal 10 looks like → the concrete move.

---

## Part A — Agentic AI Excellence to 10/10

### A1 · Architecture (current 8 → 10)
- **10 looks like:** a legible, layered system a judge can trace end-to-end in 30s.
- **Moves:** publish the tier ladder (codified → RAG-agentic → consensus → HITL)
  as a *live* architecture view in the UI, not a static diagram. Each node shows
  its DSP contract and lights up as data flows through it in the demo.

### A2 · Multi-agent design (current 8 → 10)
- **10 looks like:** specialised agents with clear contracts, not one mega-prompt.
- **Moves:** formalise the roster — **Researcher** (source discovery/promotion),
  **Statute-Matcher** (codified), **Interpreter** (RAG-agentic), **Adjudicator**
  (consensus gate), **Advocate** (resident-facing drafting), **Auditor**
  (honesty/eval). Each emits DSP-6 estimates and DSP-5 spans. Show the message
  bus between them.

### A3 · Orchestration (current 8 → 10)
- **10 looks like:** visible control flow with retries, escalation, and fallback.
- **Moves:** the consensus gate already routes surface/review/abstain — surface
  that routing as a live decision trace. Add explicit escalation: low retrieval
  confidence → escalate model tier (Impala small → larger) → still low → human.

### A4 · Human-in-the-loop (current 7.5 → 10) — *Vince Fong's lowest score*
- **10 looks like:** a first-class, auditable sign-off + **appeal** path, not a
  toast. This is a compliance requirement (CoC §4) AND a legislator's hot button.
- **Moves:** a Sign-off Queue UI: every `review`/`inference`/resident-facing
  legal claim lands here with full provenance, an approve/reject/annotate action,
  an immutable audit trail (Signoff + AuditEntry models already in schema), and a
  visible **resident appeal** button. Demo it live.

### A5 · Efficiency (current 7.5 → 10) — *Michele Romanow's axis*
- **10 looks like:** provably cheap. Small open models do the bulk; deterministic
  code does the rest for free.
- **Moves:** an **efficiency panel**: tokens/task, % handled by Tier-1 codified
  (free), cost-per-lease-analysed, cache hit rate. Route small→large only on
  low confidence. Publish "$0 compute in pilot" with the receipts.

### A6 · Real-world impact (current 7.5 → 10) — *Racquel Moses / IDB-World Bank cluster axis (was mis-attributed to Herbert, a volunteer)*
- **10 looks like:** a named resident outcome, not a hypothetical.
- **Moves:** run the 50-resident pilot fixtures end-to-end and show aggregate
  outcomes (unlawful clauses caught, $ of rent overcharge flagged, rights
  surfaced). One deep before/after case study.

### A7 · Scalability (current 8 → 10) — *Bill Tai's axis*
- **10 looks like:** a clear path from 3 pilot jurisdictions to global.
- **Moves:** the jurisdiction-expansion roadmap (phases 0–3) made concrete: a new
  jurisdiction = a data pack + statute rules, no re-architecture. Show the
  "add-a-jurisdiction" cost curve trending to near-zero.

---

## Part B — Business Strength to 10/10

### B1 · Team Quality (current 7 → 10) — solo-founder risk
- **Moves:** reframe solo + agent-swarm as the *product thesis* ("one advocate
  operating a system that does the work of a firm"). Land **Boardy validation
  quotes** (partner + judge — using Boardy *is* the optic). Advisory letters from
  the MoU registries. Show velocity as evidence of execution capability.

### B2 · Product Innovation / Uniqueness / Defensibility (current 8 → 10)
- **Moves:** name the category — **"provenance-native land & housing
  intelligence."** Moats: the growing verified spine (data network effect), the
  registry/MoU relationships, and the honesty-engine IP (evidence-class caps +
  consensus gate). No incumbent ships honesty as a feature.

### B3 · Product-Market Fit (current 7.5 → 10)
- **Moves:** three named buyers with willingness-to-pay: **residents/advocates**
  (freemium→pro), **institutions** (govt housing agencies, DFIs), **insurers/
  lenders** (climate + title risk). Boardy intros → 2 letters of intent.

---

## Part C — Sponsor perception (each sponsor sees itself in the win)

| Sponsor | What they want to see | Our move |
|---|---|---|
| **Shogo** | Built natively, showcases the agent runtime | Whole system runs on Shogo; multi-agent + HITL as the flagship demo |
| **Impala (qwen)** | Their gateway doing real work | Tier-2 interpreter routes through Impala; show token/cost telemetry |
| **MiniMax** | Model used meaningfully | Long-context clause reasoning / summarisation via MiniMax; A/B in efficiency panel |
| **Nebius / H200** | Serious compute utilised | Batch spine-refresh + embedding index build on H200; publish the job |
| **Boardy** | Network activated | Validation quotes + intros sourced via Boardy (partner *and* judge) |
| **OllyGarden** | Observability adopted | DSP-5 spans exported; live trace view in the demo |

---

## Part D — Enterprise / institutional tier (the "military-grade" ask, CoC-safe)

> **Compliance guardrail (binding):** Track F is intelligence about **land** —
> parcels, tenure, valuation, climate, insurance, title integrity — *not* about
> people. We adopt the *rigour* of defence/enterprise systems (provenance, chain
> of custody, confidence discipline, audit, redteam eval) while staying far from
> CoC §2 prohibited practices (no profiling, social scoring, emotion/biometric
> inference, predictive policing). The `ThreatLab`/`IntelProtocols` framing must
> be **retired or reframed** to land-risk intelligence before submission.

- **Institutional-grade posture:** provenance chain-of-custody on every datum,
  immutable audit log, evidence-class classification, redteam/eval harness,
  role-based sign-off, data-sovereignty controls (per-jurisdiction residency).
- **Dual-use, defensive value:** climate & catastrophe resilience mapping, land-
  title integrity / fraud-pattern detection (document-based, not person-based),
  disaster-response parcel triage, insurance & DFI risk scoring. These are the
  enterprise buyers and the "real impact" story simultaneously.
- **Positioning line:** "the rigour of an intelligence system, pointed at land
  injustice, with a human always at the wire."

---

## Part E — Self-improving / machine-learning (honest, human-gated)

The differentiator that says *category-defining company*, kept inside the
doctrine (never opaque online learning that could hallucinate rights).

1. **Provenance promotion loop (codified self-improvement).** Sources climb the
   conviction ladder (`inference → verified`) as URLs resolve and humans confirm.
   The spine literally gets more trustworthy over time — measurable via DSP-0b.
2. **Sign-off active learning.** Every human approve/reject on the Sign-off Queue
   is a labelled example. Aggregate them into an **eval set** that tunes rule
   thresholds and retrieval prompts — improvement that a human authored.
3. **Consensus feedback.** Divergences (codified vs agentic) are the highest-value
   training signal: each one flags either a missing rule or a bad retrieval. Feed
   the resolution back into Tier-1 rules (preferred) so the codified layer grows.
4. **ML where it earns its place (Tier-2 only, capped):** clause embeddings for
   retrieval, OCR for scanned leases, anomaly detection on valuation outliers —
   each grounded, cited, and confidence-capped at `heuristic`. Never a black box
   in the resident's path.
5. **The eval harness itself** (Auditor agent): a growing suite that measures
   precision/recall of the Fairness Check against human-labelled leases, tracked
   over time. "Our accuracy chart goes up each week, and here's exactly why."

**The claim we earn:** *"a self-improving system whose improvements are all
traceable, human-authored, and honesty-capped."* That is the responsible version
of self-improving AI — and it directly answers the rubric's innovation + impact +
architecture axes at once.

---

## Part F — How to lift every criterion to 9 (the "9 is the new 10" playbook)

> Goal: move from current scores to **9 on every axis** by submission close.
> 9 is the realistic ceiling in 21 days; 10 is the long-game thesis.
> Numbers cited below are reconciled by [`scripts/reconcile-docs.ts`](scripts/reconcile-docs.ts:1) (10/10 PASS, generated 2026-08-11).

### A1 · Architecture (8 → 9)
- **Add a live architecture view** to the dashboard: a horizontal swim-lane of the
  4 dossier agents ([`src/lib/engines.ts`](src/lib/engines.ts:97)) firing in
  sequence, with confidence gauges lit up as data flows through.
- **Cite the 4 CONFIDENCE_CAP entries** ([`src/lib/fairness.ts`](src/lib/fairness.ts:13))
  as the visible honesty contract on each node — already in code.
- **Evidence cross-link**: the tier ladder (codified → RAG → consensus → HITL) is
  the same one judges will see in [`ux-nextgen-vision.md`](project/strategy/ux-nextgen-vision.md:1).

### A2 · Multi-agent design (8 → 9)
- **Rename + document each agent** with its input/output contract. The 4 agents
  (`residentStatusAgent`, `tenureBuildingAgent`, `contractsAgent`,
  `hiddenRightsAgent`) already emit DSP-6 estimates — make that visible in a
  per-agent doc-block in the UI.
- **Add a 5th specialist** (optional): an "Advocate" agent that drafts the
  resident-facing letter, capped at `heuristic` — would push the rubric from 8
  to 9 cleanly because it demonstrates *role specialisation*, not just *agent count*.
- **Evidence cross-link**: [`project/pitch/demo-narrative-arc.md`](project/pitch/demo-narrative-arc.md:1) Scene 4
  walks the judge through all 4 agents in 30 seconds.

### A3 · Orchestration (8 → 9)
- **Surface the consensus routing** as a live decision trace in the UI:
  surface / review / abstain (already coded in [`src/lib/consensus.ts`](src/lib/consensus.ts:1)).
- **Show escalation**: low retrieval confidence → escalate model tier
  → still low → human. This is the orchestration story.
- **Cite the 27/50 hitl-required dossiers** (from the pilot) as the visible
  escalation rate — honesty is the orchestration story.

### A4 · Human-in-the-loop (7.5 → 9) — *Vince Fong's lowest score, biggest lift*
- **Ship the Sign-off Queue UI**: every `review` / `inference` claim lands here
  with provenance + approve/reject/annotate + audit trail (the
  [`signoff.routes.ts`](src/generated/signoff.routes.ts:1) and
  [`audit-entry.routes.ts`](src/generated/audit-entry.routes.ts:1) routes already exist).
- **Add the resident appeal button** — visible, first-class, not a toast.
  Compliance requirement (CoC §4) and a legislator's hot button.
- **Demo it live** in [`demo-narrative-arc.md`](project/pitch/demo-narrative-arc.md:1) Scene 4
  (sign-off queue, 27/50 hitl-required, 0 rejected). The honest numbers win.

### A5 · Efficiency (7.5 → 9) — *Michele Romanow's axis*
- **Add an efficiency panel**: tokens/task, % Tier-1 codified (free), cost per
  lease analysed, cache hit rate. The $0 compute claim is already provable;
  surface the receipt.
- **Wire in a model-tier router**: small → large on low confidence only.
  Currently all inference is deterministic; the router would let Tier-2
  inference actually *show up* in the panel.
- **Evidence cross-link**: [`project/pitch/elevator-pitch.md`](project/pitch/elevator-pitch.md:1)
  names "$0 compute" as a proof line — make sure the panel backs it up.

### A6 · Real-world impact (7.5 → 9) — *Moses / IDB-World Bank axis*
- **Run the 50-resident pilot end-to-end** and publish the aggregate: unlawful
  clauses caught, $ of rent overcharge flagged, rights surfaced. Already in
  [`project/pilot-audit/pilot-audit-report.md`](project/pilot-audit/pilot-audit-report.md:1).
- **Write one deep before/after case study**: pick a Cayman or Barbados
  resident from [`src/data/fixtures.ts`](src/data/fixtures.ts:1) and walk
  the dossier through what changed because of FreeLeased.
- **Land a named letter of support** from one of the 7 MoU partner agencies —
  this lifts the rubric from 7.5 to 9 by anchoring "real-world" in a name.

### A7 · Scalability (8 → 9) — *Bill Tai's axis*
- **Publish the add-a-jurisdiction cost curve**: a new jurisdiction = data pack
  + statute rules, no re-architecture. Already the spine design ([`src/data/spine.ts`](src/data/spine.ts:1)).
- **Show the curve trending to near-zero** with two roadmap jurisdictions
  (BZ, GY) in the data-room-copies; one already at 22 of 24 folders evidenced
  ([`memory/data-room-copies.md`](memory/data-room-copies.md:136)).
- **Tie to the moonshot thesis**: "category-defining" requires a path to
  global. The cost curve *is* that path.

### B1 · Team Quality (7 → 9) — *solo-founder risk*
- **Reframe** solo + agent-swarm as the *product thesis*: "one advocate
  operating a system that does the work of a firm." Already in the deck-v7.
- **Land Boardy validation quotes** (partner + judge — using Boardy *is* the
  optic). Aim for 2 named advisors from the 7 MoU partner agencies.
- **Show velocity**: 21 days, 159 tests, 22/24 data-room folders, 10/10
  reconcile — execution evidence *is* the team-quality answer.

### B2 · Innovation / Uniqueness / Defensibility (8 → 9)
- **Name the category**: "provenance-native land & housing intelligence." This
  is the moat statement — no incumbent ships honesty as a feature.
- **Cite the 3 moats together**: (1) the growing verified spine (data network
  effect), (2) registry / MoU relationships (defensive moat), (3) the
  honesty-engine IP (evidence-class caps + consensus gate — [`src/lib/fairness.ts`](src/lib/fairness.ts:1)
  + [`src/lib/consensus.ts`](src/lib/consensus.ts:1)).
- **Show the eval harness**: precision/recall on labelled leases tracked over
  time ([`scripts/test-truth-diff.ts`](scripts/test-truth-diff.ts:1)).

### B3 · Product-Market Fit (7.5 → 9)
- **Three named buyers with willingness-to-pay**: (1) residents/advocates
  (freemium → pro), (2) institutions (govt housing agencies, DFIs), (3)
  insurers/lenders (climate + title risk). All three named in
  [`project/strategy/revenue-model-gtm.md`](project/strategy/revenue-model-gtm.md:1).
- **Convert one Boardy intro into a letter of intent** before submission
  closes. Even a 1-page LOI from a Caribbean housing agency lifts this to 9.
- **Show pilot engagement**: 50 synthetic residents + 7 MoU partners +
  1 named government pilot = the demand side.

---

### Lift Summary — what ships for each +0.5 / +1.0

| Axis | Current | Target | Biggest lift | Ships in |
|---|---|---|---|---|
| A1 | 8 | 9 | Live architecture view | 1 day |
| A2 | 8 | 9 | Agent contracts documented in UI | 2 days |
| A3 | 8 | 9 | Decision trace surfaced | 1 day |
| A4 | 7.5 | 9 | Sign-off Queue + appeal button | 3 days |
| A5 | 7.5 | 9 | Efficiency panel with $0 receipts | 1 day |
| A6 | 7.5 | 9 | Named pilot outcome + MoU LOI | 4 days |
| A7 | 8 | 9 | Add-a-jurisdiction cost curve | 2 days |
| B1 | 7 | 9 | Boardy quote + MoU LOI | 5 days |
| B2 | 8 | 9 | Category name + 3 moats in deck | 1 day |
| B3 | 7.5 | 9 | LOI + 3 buyer personas | 5 days |

**Total estimate**: ~10 dev-days, ~3 outreach-days. Within 21-day sprint budget
if started now. The two highest-leverage moves are A4 (HITL Sign-off Queue) and
B1 (Boardy quote) — together they account for ~3 points of lift.

---

## Sequencing (what lifts the most, soonest)
1. **UX next-gen** (see companion doc) — perception multiplier on *everything*.
2. **HITL Sign-off Queue + appeal** — fixes the lowest sub-score, satisfies §4.
3. **Efficiency + observability panels** — wins Romanow + OllyGarden + Impala.
4. **Reframe ThreatLab→land-risk** — removes the DQ landmine, fixes track fit.
5. **Boardy validation** (user) — fixes Team + PMF.
6. **Self-improving loop surfaced** — the category-defining flourish.
