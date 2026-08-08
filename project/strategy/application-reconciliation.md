# Application Reconciliation — the locked scope

**Status:** binding · **Version:** 1.0 · **Source:** Sam's accepted application (files/Pasted_text.txt, 2026-08-05)
**Supersedes** any earlier framing that conflicts (esp. the "land-intelligence /
parcel / valuation" drift and "Track 9 Cat F").

The accepted application is the contract with the judges. This document reconciles
it against what is actually in the workspace, names what drifted, and defines the
honest cut we will ship.

---

## 1. Locked facts (do not re-derive)
- **Track:** *AI for Real Estate & Development.*
- **Naming:** **FreeLeased** = platform/brand · **RTM Sovereign** = flagship product
  · **LeaseholdInsight** = underlying engine.
- **Thesis:** open-source, **local-first**, **resident-led leasehold governance** —
  automate UK **Right-to-Manage (RTM)**, **enfranchisement**, **service-charge
  audit**, and **building-safety (BSA)** compliance; then adapt those frameworks to
  Caribbean **condominium** law (Cayman, Barbados, Jamaica).
- **Founder:** Samuel Peacock — Investment Product Analyst @ Schroders, 10+ yrs;
  Finance + Economics + Data Science + Resident Advocacy. UK/British. This is a
  **Team-Quality asset** (credible in a legal-financial proptech domain) — feature it.

## 2. The core problem (in the application's own words)
Leaseholders/condo co-owners are exploited via inflated service charges,
unconsulted major works (breaching **s.20 LTA 1985** thresholds), and neglected
building-safety logs (**BSA 2022** liability). Residents can't afford surveys or
counsel. FreeLeased rebalances this: coalitions **audit accounts, identify
statutory vulnerabilities, and coordinate collective management acquisition (RTM)**.

---

## 3. What ALIGNS (workspace already embodies the thesis)
| Application concept | Already in workspace | 
|---|---|
| "SynergeticAudit" 150-vuln statutory checks | `src/data/patterns.ts` — `HIDDEN_RIGHTS` (19+ items, each anchored to a real statute): s.20 consultation, challenge service charges, RTM without fault, enfranchisement, tribunal, Golden Thread/BSA, body-corporate voting, right of first refusal, connected-party procurement, sinking funds |
| "SovereignDiagnosticsService" runtime statutory checks | `src/lib/fairness.ts` — the codified rule engine (evidence-classed, confidence-capped) |
| "MassIngestEngine … scrubs PII locally" | `src/lib/engines.ts` — `redactionProtocol` |
| "Local-First Cryptographic Communes" (collective decisions) | `src/lib/engines.ts` — `communeAggregate` |
| UK leasehold statutes | `spine.ts` — CLRA 2002, LFRA 2024, LTA 1985 (s.19/20/21), BSA 2022, AJA 1970 |
| Caribbean condo adaptation | `patterns.ts` maps rights to `bb-condo`, `ky-strata`, `tt-aoa`, etc. |

**Conclusion:** the Shogo app *is* RTM Sovereign / LeaseholdInsight under different
internal names. We are not starting over — we sharpen alignment.

## 4. What DRIFTED (fix)
1. **"Land-intelligence / parcel / valuation / climate" framing** — off-track.
   Keep only where it serves leasehold (e.g. *insurance transparency & climate-pool
   eligibility for condos* = HIDDEN_RIGHTS #16). Reframe land-profile routes as
   *building/estate* context, not parcel valuation.
2. **My recent UK *tenancy* rules** (deposit cap, banned fees, Housing Act 1988,
   Tenant Fees Act) — **wrong sub-domain**. The product is *leasehold*, not
   assured-shorthold tenancy. Pivot the codified core to **leasehold diagnostics**
   (s.20 consultation, s.20C costs, s.72 CLRA RTM eligibility, BSA remediation,
   s.167 CLRA forfeiture). Tenancy rules may remain as secondary "rental" coverage
   but are not the headline.
3. **Adversary / ThreatLab / "manipulation intelligence"** — doubly off-thesis
   *and* a CoC §2 risk. **Retire it.** The product audits service charges and
   statutory compliance; it does not profile people.

## 5. The HONEST CUT (avoid overclaiming — pre-mortem G3)
The application describes an ambitious architecture. Some of it is **not in this
workspace** and cannot be credibly built by the Aug 14 demo target:

| Application component | Status | Demo treatment |
|---|---|---|
| Codified statutory diagnostics (RTM/s.20/s.20C/BSA) | **BUILD — core** | live, verified, headline |
| Resident audit + provenance + redaction | **BUILT** | live |
| Collective/commune aggregation | **BUILT (basic)** | live, framed as v1 |
| OpenClaw agents / `hermes_bridge.py` / Companies House scraping | **not in workspace** | **roadmap** — describe, don't fake |
| Paillier homomorphic voting / WebAuthn / CitadelDB AES-GCM | **not in workspace** | **roadmap** — architecture slide, clearly labelled |
| 150-vuln `SynergeticAudit.json` | partial (19+ in `patterns.ts`) | ship the real subset; state the number honestly |

**Rule:** demo only what runs; everything else is labelled roadmap. State the
audit-rule count at its true value. Our brand is honesty — do not imply the crypto
stack is live.

---

## 6. Actions (this reconciliation drives the build)
1. **Add leasehold diagnostic rules** to the codified engine (s.20 consultation
   threshold, s.20C litigation costs, BSA remediation cap, s.167 CLRA forfeiture) —
   done in `fairness.ts`, tested, thesis-aligned.
2. **Retire the adversary/ThreatLab framing** from UI + copy + repo (also pre-mortem G1).
3. **Reframe land routes** as building/estate context; drop parcel-valuation emphasis.
4. **Feature Sam's finance/advocacy credibility** in the deck (Team Quality).
5. **Label crypto-voting + OpenClaw as roadmap** in the architecture doc.
6. Update deck/overview to the RTM-Sovereign leasehold thesis and the correct track.
