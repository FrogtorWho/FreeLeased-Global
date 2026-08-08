# Prizes & Opportunities — Strategic Leverage

**Status:** strategy · **Version:** 1.0 · **Source:** official event site (reconciled 2026-08-05)
**Companions:** `resources-ledger.md`, `moonshot-roadmap-10-10.md`, `pre-mortem-and-gaps.md`.

The prize page is not just money — it tells us *what the organisers and their
partners want to fund*: production-grade, deployable, investor-ready companies.
We read every line as a signal and align the build + pitch to it.

---

## 1. Timeline reconciliation (a material correction)

| Milestone | Date | Implication for us |
|---|---|---|
| 21-day build sprint | Jul 27 – Aug 16 | live now |
| **Submission Review, LIVE DEMOS & Final Judging** | **Aug 16, 2026** | there is a **live demo to judges**, not only a recorded video |
| Caribbean Showcase | Fall 2026 | post-event; regional leaders/customers |
| NYSE Investor Showcase | Fall 2026 | post-event; global investors |

**What changed:** we had Aug 17 midnight as the deadline; the official date is
**Aug 16 with live demos + judging**. So:
- **Be demo-ready by ~Aug 14** with a 48h buffer, not Aug 16.
- With the personal weekly-allowance reset ~Aug 10, the **heavy-build window is
  Aug 10–15** — tight. This hardens the case for a *minimum-viable-winning cut*
  (pre-mortem G16) locked before we chase stretch features.
- A **live demo** promotes two pre-mortem items to critical: **G5** (a durable,
  warmed published URL — not the ephemeral preview) and **G6** (a rehearsed,
  scripted run + recorded fallback in case live infra wobbles on stage).

---

## 2. Each opportunity → how we turn it to advantage

| Opportunity | Signal | Our move / where it scores |
|---|---|---|
| **Cash + OWC AI systems (top 3)** | they reward deployable systems | keep the "runs in production" thread front-and-centre |
| **Highrise + Impala H200 compute** | serious compute is expected to be used | batch spine-refresh + embedding-index build on H200; show the job + token/cost telemetry (efficiency axis, Impala optic) |
| **NoInfra agent-native infra** | agent-native deployment matters | position the agent swarm as portable to an agent-native runtime; name it as a deployment target in the architecture |
| **Shogo platform credits** | build natively on Shogo | whole system already runs on Shogo — flagship the multi-agent + HITL demo (Shogo optic) |
| **OWC Thunderbolt-5 AI *deployment* systems** (local accel / **edge** / high-speed storage / **sovereign** compute) | **sovereignty + edge is a first-class theme** | **major product unlock** → see §3 |
| **DMZ Soft Landing @ Toronto Metropolitan U** | North American GTM on offer | GTM slide includes a NA-expansion path via DMZ; strengthens scale story (Bill Tai) |
| **Powertranz gateway (free 12 mo)** | Caribbean-native payments provided | **monetisation unlock** → see §4 |
| **Live pitch at NYSE + investor showcase** | they want fundable companies | the deck must be **investor-grade**, not hackathon-grade → see §5 |
| **Bookit flights/accommodation** | logistics covered for finalists | plan for in-person finale presence |

---

## 3. UNLOCK — OWC sovereign/edge compute → our data-sovereignty product flex
Caribbean data sovereignty is already a compliance theme in our statement, and
governments/registries often **cannot send land-title data to a foreign cloud**.
OWC's edge/sovereign deployment hardware lets us say — truthfully — that
FreeLeased can run **on-territory, on sovereign or edge hardware**, with the
provenance spine and codified rules executing locally and only anonymised
aggregates leaving the island.

- **Product:** document an *edge/sovereign deployment mode* in the architecture
  (the codified Tier-1 engine + local model is small enough to run at the edge;
  RAG/large-model steps are optional and can stay local on OWC hardware).
- **Scores:** real-world impact + scalability + defensibility, and it answers
  Sherika Herbert's sovereignty axis directly.
- **Honesty guardrail:** frame as *"deployable to sovereign/edge hardware"* (a
  demonstrated capability/architecture), not *"already deployed in a ministry."*

## 4. UNLOCK — Powertranz → the "who pays / how" answer (fixes pre-mortem G7)
Powertranz is a Caribbean payment gateway. It gives us a concrete, region-native
answer to Romanow's unit-economics probe:
- **Payers:** institutions/insurers/DFIs/registries (subscriptions) and pro-tier
  advocates — **residents stay free**. Powertranz processes institutional billing
  and any pro-tier payments *within the Caribbean*, no foreign-processor friction.
- **GTM:** "we can take payments in-region on day one" is a credibility point most
  entries can't make. Add a line to the business-model doc + GTM slide.

## 5. Investor-grade pitch (NYSE showcase raises the bar)
The audience is global investors, not just hackathon judges. The deck must carry:
- a crisp **category definition** ("provenance-native land & housing intelligence"),
- **TAM/SAM/SOM** with the Caribbean beachhead → UK/global expansion,
- **unit economics** (Tier-1 codified = ~free; small-model routing; cost/lease),
- **moat** (verified spine network effect + registry/MoU relationships + honesty IP),
- a **12-month milestone plan** (pilot → paid institutions → NA soft-landing via DMZ),
- an **ask** (what the capital unlocks).
Action: fold these into deck v7 and the market/business-model doc.

---

## 6. Net effect on the plan
- Move the internal target to **demo-ready Aug 14**; lock the MVP-winning cut.
- Elevate **published-URL + rehearsed-live-demo + recorded-fallback** to critical.
- Add **sovereign/edge deployment mode** and **Powertranz in-region payments** to
  the architecture + business-model + deck — both are honest, differentiated, and
  directly reward-aligned.
- Make the deck **investor-grade** for the NYSE audience.
All of it stays inside the honesty rules: capabilities stated at true maturity.
