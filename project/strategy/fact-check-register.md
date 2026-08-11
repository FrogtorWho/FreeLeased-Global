# Fact-Check Register — external evaluation report (files/Pasted_text.txt)

**Status:** verification · **Date:** 2026-08-05
**Purpose:** the user supplied a third-party "viability assessment." It mixes
**verifiable statutory anchors we encode** with **grandiose, unverifiable claims
we must NOT repeat**. Tagged below. Rule (honesty brand + pre-mortem G3):
state everything at its true maturity; never repeat a claim we can't defend.

Legend: ✅ verified (primary source) · 🟡 partial · ❌ error · ⛔ unverifiable /
do-not-repeat · ℹ️ context.

---

## A. Statutory anchors (these we cite — accuracy matters most)

| Claim | Tag | Finding / source |
|---|---|---|
| LFRA 2024, **SI 2025/131 (Commencement No. 3)** in force **3 Mar 2025**, **s.49 raises RTM non-residential limit 25%→50%** (+ s.50–52) | ✅ | Confirmed on legislation.gov.uk/uksi/2025/131/made + multiple firms (Charles Russell, Norton Rose). **Spine `uk-lfra` upgraded** with this exact citation. Strong, current anchor for the rigor judges. |
| **Barbados Condominium Act Cap 224A, s.4(5)** — unit entitlement expressed as fraction/percentage; drives common expenses + voting weight | ✅ | Confirmed on official barbadoslawcourts.gov.bb Cap 224A PDF. Matches spine `bb-condo`. |
| **Cayman Strata Titles Registration Act** — super-majority / unanimous thresholds | 🟡 | Name/threshold structure confirmed (legislation.gov.ky, Legal500). **Report says "2014 Revision"; correct is 2013 Revision** — our spine already has "2013 Revision" + "100% unanimous for Schedule 1 structural, super-majority otherwise". Exact "75%" figure not confirmed in sources; keep our wording. |
| **Jamaica "Condominium Act 1958"** | ❌ | **Report is wrong.** Jamaica's law is the **Registration (Strata Titles) Act** (nla.gov.jm, moj.gov.jm). Our spine already dropped the 1958 ref and cites the correct Act (`jm-strata`). No action needed — guard held. |
| **NOAA HURDAT2** — Atlantic cyclones since 1851, 6-hourly, wind-radii metrics post-2004 (34/50/64-kt, 4 quadrants) | ✅ | Consistent with NOAA/AOML HURDAT2 documentation. Accurate *if* we build the climate layer — which is roadmap (see D). |
| Anguilla **Paragon Holdings v Turtle's Nest** (developer retained management, no meetings/budgets) | 🟡 | Plausible regional authority; not independently reconfirmed here. Cite only if re-sourced to a judgment. |

## B. Competition facts

| Claim | Tag | Finding |
|---|---|---|
| Track = "AI for Real Estate & Development" | ✅ | Matches Sam's application. |
| Deadline **Aug 16, 2026**; 21-day sprint 27 Jul–16 Aug; two-person verification; 48h freeze | ✅ | Matches official site + our judge-panel-analysis. (Report also says NYSE "September 2026" vs our "Fall 2026" — immaterial.) |
| Prize $70k+ ($50k cash 25/15/10 + $20k OWC hardware) | ✅ | Matches official prize page. |
| 184+ applications, 32 countries, ~800 builders, 40 teams | ℹ️ | Plausible (siliconcaribe / Jamaica Observer); not load-bearing for us. |

## C. Infrastructure claims

| Claim | Tag | Finding |
|---|---|---|
| Shogo split licence: **AGPL-3.0 core + MIT SDKs/UI kits** | ✅ | Consistent with shogo-ai/docs/LICENSING.md. Good for our OSS story (client SDK MIT). |
| Impala AI = VPC/in-environment LLM inference (SPI never leaves env) | ℹ️ | Consistent with getimpala.ai positioning. Supports our data-sovereignty framing — but present as *architecture intent*, not a deployed fact. |

## D. Product-framing tensions (reconcile with our HONEST CUT)

| Report says | Our position |
|---|---|
| Four-agent orchestrator **Lease / Title / Climate / Valuation**; "Real Estate & Climate" cross-track for IDB | Our locked thesis is **leasehold/RTM/service-charge/BSA core**. Keep **Lease + Title** as the live spine; treat **Climate + Valuation** as **roadmap agents** and the "Real Estate & Climate" angle as a *pitch* hook for IDB/Racquel Moses — **not implied as built**. Consistent with `application-reconciliation.md`. |
| "200-parcel Caribbean pilot" | Synthetic/curated — must be **labelled synthetic** on screen + in demo (CoC §5, pre-mortem G2). |

## E. ⛔ Unverifiable / grandiose — DO NOT REPEAT to judges without hard evidence
These are the integrity landmines. Our brand is honesty; repeating any of these
unbacked would be self-defeating (pre-mortem G3).

| Claim | Why flagged |
|---|---|
| **Cloudsley: £1,983.9 BILLION value-at-risk; "court-readiness 100/100"; 87 anomalies; 19,933 identity centroids** | £1.98 **trillion** is not credible (≈ a large fraction of the entire UK housing stock). "Court-readiness 100/100" is self-assigned. Do not cite. |
| **FreeLeased: "39-phase, 2M+ lines of code, zk-SNARK witness statements, WebRTC PBFT"** | 2M LOC solo is not credible and conflicts with the actual workspace (FreeLeased = our Shogo app). Crypto is roadmap. Do not repeat "2M LOC". |
| **Meridian: "Chase Hughes NCI behavioral framework"** | ⚠️ **CoC red flag** — behavioral-influence framing is the same family as the adversary layer we just retired (CoC §2). **Drop entirely.** (Dempster-Shafer evidential reasoning, mentioned alongside, is legitimate and fine to keep as an uncertainty method.) |
| **Hudson House RTM: 17/19 leases (89.5%), 575-point evidence corpus** | *Plausible and on-thesis* (a real UK RTM case). Usable **only** as "the applicant's own live RTM case" and **only if Sam can evidence it**. Strong if backed; a liability if asserted bare. |
| **A.U.R.I v8 nine-tab SPA / "Citadel Protocol" / OpenRouter agent layer** | Plausible (our workspace descends from A.U.R.I). Usable as "prior UI foundation," stated modestly. |

---

## F. Actions taken
1. **Spine `uk-lfra` upgraded** to the verified s.49 / 25%→50% / SI 2025/131 (3 Mar 2025) citation.
2. Confirmed Jamaica (Registration (Strata Titles) Act) and Cayman (2013 Revision) were **already correct** in the spine — report errors do not propagate.
3. Logged the ⛔ do-not-repeat list so the deck/overview never inherit the
   trillion-pound / 2M-LOC / behavioral-framework claims.
4. Reaffirmed Climate/Valuation as **roadmap**, per the honest cut.

---

## G. ✅ Verified by code (reconcile-docs, 2026-08-11)

The following claims are not just anchored in primary sources — they are
*mechanically reconciled against the codebase* by
[`scripts/reconcile-docs.ts`](scripts/reconcile-docs.ts:1) on every commit.
The 2026-08-11 run reports **10/10 PASS, 0 drifts**.

| Claim | Reconciled value | Counter (file / pattern) |
|---|---|---|
| 159 test assertions | 159 | `scripts/test-suite.ts` — count of `^\s*check\(` invocations |
| 9 jurisdictions in data spine | 9 | `src/data/spine.ts` — count of `code: "[A-Z]{2,3}"` declarations |
| 20 hidden-rights patterns | 20 | `src/data/patterns.ts` — count of `id: \d+,` rows |
| 25+ statutes catalogued | 25 | `src/data/spine.ts` — count of `shortTitle: "` entries |
| 4 deterministic dossier agents | 4 | `src/lib/engines.ts` — count of `function <Name>Agent(` declarations |
| 8 loops complete | 8 | `project/strategy/loop-protocol.md` — max `**Loop N:**` header |
| 21 buildathon days | 21 | `project/strategy/00-OVERVIEW.md` — `Day N of M` parse |
| 7 MoU partner agencies | 7 | `project/strategy/00-OVERVIEW.md` — `N Caribbean government agencies` |
| 4 conviction caps | 4 | `src/lib/fairness.ts` — entries in `CONFIDENCE_CAP` table |
| 22/24 data-room folders evidenced | 22 | `memory/data-room-copies.md` — distinct COPY-NNN target folders |

**Run the reconciler before any submission**:
```sh
node --experimental-strip-types scripts/reconcile-docs.ts
```

**Why this section matters**: every figure in the deck and the pitch must
either be on this list, or be labelled as roadmap / unverified. The do-not-
repeat list in §E is the negative side; this list is the positive side.
Together they define the *honest cut* of what we say about FreeLeased.

**Cross-link**: the reconciler itself is part of the truth-protocol — see
[`project/strategy/truth-protocol.md`](project/strategy/truth-protocol.md:1)
for the broader commitment.

---

*Last reconciled: 2026-08-11T02:36 UTC (10/10 PASS).*
*Register maintained by [`scripts/reconcile-docs.ts`](scripts/reconcile-docs.ts:1).*

