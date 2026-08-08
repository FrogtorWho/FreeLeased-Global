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

## Sequencing (what lifts the most, soonest)
1. **UX next-gen** (see companion doc) — perception multiplier on *everything*.
2. **HITL Sign-off Queue + appeal** — fixes the lowest sub-score, satisfies §4.
3. **Efficiency + observability panels** — wins Romanow + OllyGarden + Impala.
4. **Reframe ThreatLab→land-risk** — removes the DQ landmine, fixes track fit.
5. **Boardy validation** (user) — fixes Team + PMF.
6. **Self-improving loop surfaced** — the category-defining flourish.
