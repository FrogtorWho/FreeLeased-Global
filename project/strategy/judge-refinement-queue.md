# Judge Refinement Queue — Phase 2A

> **Purpose.** Map every judge archetype to the *one* implementable refinement per
> axis that would lift their score. Sequence the top 10 by impact × ease and ship
> them. Stop when no axis can be lifted by ≥ 0.1.
>
> **Source.** [`judge-panel-analysis.md`](judge-panel-analysis.md:1),
> [`comprehensive-scoring-reconciliation.md`](comprehensive-scoring-reconciliation.md:1),
> [`moonshot-roadmap-10-10.md`](moonshot-roadmap-10-10.md:1),
> [`WIN-DAY-100.md`](WIN-DAY-100.md:1).
>
> **Implementation cost key.** **S** = < 1h · **M** = 1–4h · **L** = 4h+

---

## 1. Judge VC-Global (Investor / product-market fit)

> **Archetype.** Bill Tai, Michele Romanow, Todd Speece, Lisa Yu, David Bender —
> investors who want **named buyers, unit economics, defensible moat, willingness
> to pay.**
>
> **Stated priorities (from judge-panel-analysis.md §2, §5):**
> - TAM/SAM/SOM with credible methodology (DONE)
> - Unit economics with CAC/LTV (DONE, but unvalidated)
> - Named buyers with letters of intent (NEEDED)
> - Moats and defensibility (DONE)
> - Investor-grade pitch deck (NEEDED)
> - Willingness-to-pay evidence (NEEDED)

| Axis | Current | Specific refinement | Cost | Estimated lift |
|------|---------|----------------------|------|----------------|
| A5 · Efficiency | 7.5 | **Surface "$0 compute" as an Efficiency Panel widget** with cache hit rate, % Tier-1 codified. Romanow's axis. | S | +0.25 |
| A6 · Real-world impact | 7.5 | **Generate a dossier JSON for `project/demo/sample-lease.txt`** + publish the aggregate metrics. This is the "I ran the demo on a real lease" proof. | M | +0.25 |
| A7 · Scalability | 8 | **Add-a-jurisdiction cost curve** published as a markdown chart showing the near-zero cost as jurisdictions scale. | S | +0.25 |
| B1 · Team Quality | 7 | **Lock 1 Boardy / advisory validation quote** — even a "warm intro requested" trail counts as evidence the loop ran. | M | +0.5 |
| B3 · Product-Market Fit | 7.5 | **3 personalised pilot outreach emails** to named orgs (UK leaseholder charity, JM housing NGO, BB RTM advocate). Investors see Sam *can* sell. | M | +0.5 |

**Total projected VC-Global lift: +1.75** → projected score 8.75 → 9.0.

---

## 2. Judge Cloud-Compute (Sponsor fit / architecture rigour)

> **Archetype.** Mark Castleman (Intel AI Cloud), Vince Fong (Highrise AI),
> Nikhil Tayal (NoInfra), Juraci Kröhling (OllyGarden). Wants **the stack visibly
> doing work, the observability exported, the inference routed through their
> gateway, the agent team demonstrably running.**
>
> **Stated priorities (from judge-panel-analysis.md §2):**
> - Agentic architecture with clear separation of concerns
> - Live observability (DSP-5 spans, telemetry)
> - Stack-name-check (H200, NoInfra, Impala, OllyGarden)
> - Deterministic-first efficiency with model-tier router
> - Self-improving loop surfaced

| Axis | Current | Specific refinement | Cost | Estimated lift |
|------|---------|----------------------|------|----------------|
| A1 · Architecture | 8 | **Cite 4 CONFIDENCE_CAP entries + tier ladder** as a live architecture view in the UI; or document in a static "Architecture View" MD. | S | +0.25 |
| A2 · Multi-agent design | 8 | **Animated brand-pack showcase HTML** that displays all 5 agents + 5 brands side-by-side. Reusable as a hero image. | M | +0.5 |
| A3 · Orchestration | 8 | **Surface consensus routing** as a decision trace in the demo script (already in code, needs to be in the narration). | S | +0.25 |
| A5 · Efficiency | 7.5 | **Bundle the social-campaign as a CSV/JSON exporter** (`scripts/social-export.ts`) — proves we run automated pipelines at scale. | S | +0.25 |

**Total projected Cloud-Compute lift: +1.25** → projected score 8.25 → 8.5.

---

## 3. Judge Founder-Builder (Ship / velocity / execution)

> **Archetype.** Boardy (superconnector), ACTAI/Bill Tai (execution bias). Wants
> **daily deliverables, working software, the loop visibly running, the velocity
> evidence.**
>
> **Stated priorities (from judge-panel-analysis.md §3, §4):**
> - 10/10 reconcile-docs (DONE)
> - Live demo that cold-starts safely
> - Sub-1-second bootstrap path (clone → install → dev)
> - Build-in-public narrative
> - Mobile-first capture path for residents

| Axis | Current | Specific refinement | Cost | Estimated lift |
|------|---------|----------------------|------|----------------|
| A1 · Architecture | 8 | **README "Sub-1-second cold-clone bootstrap"** with every prerequisite, time-boxed to under 60s mental path. | S | +0.25 |
| A4 · HITL | 7.5 | **MobileCapture.tsx CTA + aria-live region** for status — the resident path now announces what it's doing. | S | +0.5 |
| A6 · Real-world impact | 7.5 | **Self-rubric-score.md** — Sam self-assigns each axis 1-10 with one-paragraph justification. The act of writing it surfaces the gaps. | S | +0.25 |
| B1 · Team Quality | 7 | **Public service announcement blog post** — 1,500 words in Sam's voice explaining why FreeLeased exists. The narrative arc judges remember. | M | +0.5 |

**Total projected Founder-Builder lift: +1.5** → projected score 8.0 → 8.5.

---

## 4. Judge Academic-Rigor (Honesty / evidence / methodology)

> **Archetype.** Peter Chami (UWI Head of CS), Fidelis St. Hill (AI-legal),
> Caroline Kerswell (Global Head of Legal). Wants **evidence-class discipline,
> provenance chains, honest uncertainty, no overclaiming, reproducible test
> results.**
>
> **Stated priorities (from judge-panel-analysis.md §2):**
> - Architecture + tests + honesty engine
> - Statute citations with confidence caps
> - Audit trails and immutable logs
> - "Not legal advice" discipline
> - Synthetic data clearly marked

| Axis | Current | Specific refinement | Cost | Estimated lift |
|------|---------|----------------------|------|----------------|
| A4 · HITL | 7.5 | **Sample-lease dossier JSON** with evidence-class per clause + audit trail row — the audit-trail-in-action proof. | M | +0.5 |
| B2 · Innovation / Defensibility | 8 | **Self-rubric-score.md** — honest self-assessment, with each gap acknowledged. Rigor reads as trust. | S | +0.5 |

**Total projected Academic-Rigor lift: +1.0** → projected score 8.75 → 9.0.

---

## 5. Judge Caribbean-Sovereignty (Real-world impact / equity / adoption)

> **Archetype.** Racquel Moses (Caribbean Climate-Smart Accelerator), Brian Bogart
> (WFP Caribbean), George Oliver R Thomas (Sagicor Bank Barbados), Mark Hill
> (Export Barbados), Charlie Kirkconnell (Cayman Enterprise City). Wants
> **Caribbean-resident outcomes, named institutional buyers, equity framing,
> climate-resilience use case, sovereignty-respecting deployment.**
>
> **Stated priorities (from judge-panel-analysis.md §2):**
> - Lead with land + climate-risk provenance
> - 8 jurisdictions mapped + 7 MoU partners on record
> - Resident-impact + sovereignty framing
> - Pilot engagement proof
> - Build-in-public Caribbean narrative

| Axis | Current | Specific refinement | Cost | Estimated lift |
|------|---------|----------------------|------|----------------|
| A6 · Real-world impact | 7.5 | **Public service announcement blog post** — explicit Caribbean-sovereignty framing. | M | +0.5 |
| B1 · Team Quality | 7 | **3 pilot outreach emails** to real Caribbean orgs — Sagicor-aligned, Export Barbados-aligned, JM housing NGO. The outreach *is* the team evidence. | M | +0.5 |
| B3 · Product-Market Fit | 7.5 | **Advisory ask via Boardy** — Marla Dukharan (Caribbean economist), Christopher Reckord (JM AI Task Force Chair), Parris Lyew-Ayee (UWI geospatial). | M | +0.5 |

**Total projected Caribbean-Sovereignty lift: +1.5** → projected score 7.5 → 8.25.

---

## 6. Top-10 Refinement Queue (sequenced by impact × ease)

| # | Refinement | Lifts axes | Judges impacted | Cost | Score lift |
|---|------------|-----------|------------------|------|-----------|
| 1 | **Process `project/demo/sample-lease.txt` end-to-end → dossier JSON + commit** | A6, A4 | VC-Global, Academic-Rigor, Caribbean-Sovereignty | M | +0.5 |
| 2 | **Expand demo-video-script.md → shot-by-shot with timestamps** | A1, A3, A4 | All 5 judges | M | +0.4 |
| 3 | **3 personalised pilot outreach emails** (UK leaseholder charity, JM housing NGO, BB RTM advocate) | B1, B3 | VC-Global, Caribbean-Sovereignty | M | +0.6 |
| 4 | **Advisory ask via Boardy** — Lyew-Ayee / Reckord / Dukharan (or warm-intro template) | B1, B3 | VC-Global, Caribbean-Sovereignty | M | +0.5 |
| 5 | **README "Sub-1-second cold-clone bootstrap"** — every prerequisite, time-boxed | A1 | Founder-Builder, Cloud-Compute | S | +0.25 |
| 6 | **Animated brand-pack showcase HTML** — 5 brands side-by-side | A2, B2 | Cloud-Compute, Academic-Rigor | M | +0.5 |
| 7 | **MobileCapture.tsx a11y** — obvious CTA + aria-live region | A4 | Founder-Builder, VC-Global | S | +0.5 |
| 8 | **Public service announcement blog post** (1,500 words, Sam's voice) | A6, B1 | Caribbean-Sovereignty, Founder-Builder | M | +0.5 |
| 9 | **`scripts/social-export.ts` — CSV/JSON exporter** (30 rows × 5 platforms × 5 brands) | A5 | Cloud-Compute, VC-Global | S | +0.25 |
| 10 | **Self-rubric-score.md** — Sam's 1-10 self-score with one-paragraph justification per axis | A6, B2 | All 5 judges | S | +0.5 |

**Total projected lift across all judges: +4.5 points of median.**
**Projected new score: 87 → 91.5 / 100 (Path B → C trajectory confirmed).**

---

## 7. Saturation heuristic (Phase 2D starting point)

After Phase 2B ships, we re-examine each axis's delta. An axis is **saturated** when:
- The implementation cost of the next refinement > L (4h+), AND
- The estimated lift < 0.1, AND
- The refinement would require invented evidence, fake pilot data, or unsent outreach.

We stop the refinement loop when **every unsaturated axis has Δ < 0.1** and
**reconcile-docs still reports 10/10 PASS**.

---

*Generated 2026-08-11. Numbers reconcile to
[`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1) (10/10 PASS).
Re-run before any external score projection.*
