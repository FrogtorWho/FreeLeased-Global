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

## F.2 Shadow-economy + lawfare narrative (truth-shadow-economy.md, 2026-08-11)

> Source: [`project/research/truth-shadow-economy.md`](../research/truth-shadow-economy.md:1).
> This block registers the *narrative research* claims used in the
> pitch and deck to ground the "follow the money" thesis. Tagged with
> the truth-protocol conviction classes.

| Claim | Tag | Finding / source |
|---|---|---|
| **LFRA 2024, c.22** in force via SI 2025/131 (3 Mar 2025); s.49 RTM non-residential limit 25%→50% | ✅ established | legislation.gov.uk/ukpga/2024/22/contents — same spine anchor as §A row 1. |
| **Leasehold Reform (Ground Rent) Act 2022, c.17** — caps ground rent on new long residential leases at peppercorn from 30 Jun 2022 | ✅ established | legislation.gov.uk/ukpga/2022/17/contents — Tier 1 primary. |
| **ECTA 2022, c.10 — Register of Overseas Entities** requires overseas entities owning UK property to disclose beneficial owners to Companies House | ✅ established | legislation.gov.uk/ukpga/2022/10/contents — Tier 1 primary. |
| **Landlord and Tenant Act 1985, ss.18–30** — service-charge consultation + cost-cap regime | ✅ established | legislation.gov.uk/ukpga/1985/70 — Tier 1 primary; LFRA 2024 amends. |
| **Leasehold Reform Act 1967, c.88** — collective enfranchisement | ✅ established | legislation.gov.uk/ukpga/1967/88/contents — Tier 1 primary. |
| **LRHUDA 1993, c.28** — RTM + individual lease extension | ✅ established | legislation.gov.uk/ukpga/1993/28/contents — Tier 1 primary. |
| **HMCTS Property Chamber fees** — typically £100–£500 filing | ✅ established | gov.uk/government/publications/fees-in-the-property-chamber-of-the-first-tier-tribunal — Tier 1 primary. |
| **HMRC Measuring Tax Gaps** — SDLT included in indirect tax-gap reporting | ✅ established | gov.uk/government/statistics/measuring-tax-gaps — Tier 1 primary. |
| **FATF mutual evaluations** exist for BVI, KY, JM, BB, TT | ✅ established | fatf-gafi.org/en/countries.html — Tier 1 primary; specific current grey-list status `unverified` per §F.3 below. |
| **OECD Global Forum peer reviews** exist for the same jurisdictions | ✅ established | oecd.org/tax/transparency/ — Tier 1 primary; specific ratings `unverified`. |
| **Transparency International UK** + **Global Witness** have published UK-property-corruption reports since 2015 | ✅ established | transparency.org.uk + globalwitness.org — Tier 2 NGO primary archives. |
| **ICIJ Pandora Papers (2021)** — exposed offshore ownership chains involving 330+ politicians across 90+ countries | ✅ established | icij.org/investigations/pandora-papers/ — Tier 1 primary (ICIJ). |
| **ICIJ Paradise Papers (2017) + Panama Papers (2016)** | ✅ established | icij.org/investigations/paradise-papers/, icij.org/investigations/panama-papers/ — Tier 1 primary. |
| **OCCRP** investigative reporting on Caribbean corruption | ✅ established | occrp.org — Tier 1 primary investigative-journalism consortium. |
| **Barbados Condominium Act Cap 224A, s.4(5)** — unit-entitlement fraction drives common expenses + voting weight | ✅ established | barbadoslawcourts.gov.bb Cap 224A — Tier 1 primary; matches §A row 2. |
| **Jamaica Registration (Strata Titles) Act** (not "Condominium Act 1958") | ✅ established | nla.gov.jm — Tier 1 primary; matches §A row 3. |
| **Cayman Strata Titles Registration Act (2013 Revision)** | ✅ established | legislation.gov.ky — Tier 1 primary; matches §A row 3. |
| **Leaseholder vs. freeholder cost asymmetry of ~10×–40× at contested hearing** | 🟡 heuristic | Property Litigation Association, LKP, Legal 500 commentary — illustrative ranges, not point estimates. See §F.3 for the `unverified` list. |
| **"Army of lawyers" pattern — portfolio retainer + discovery cost + LTA 1985 s.20 cost-cap invocation gap** | 🟡 heuristic | Synthesised from PLA, LKP, LFRA 2024 amendments. Pattern is established; specific firm-level retainers are confidential. |
| **BVI holdco → JER SPV → UK property** is the canonical ownership chain in ICIJ UK-property cases | 🟡 heuristic | icij.org investigations — pattern is established; specific named chains require case-by-case verification. |

## F.3 ⛔ Unverified — explicit "we did NOT verify" list

The following claims in [`truth-shadow-economy.md`](../research/truth-shadow-economy.md:1)
are explicitly tagged `unverified: true` and **must not** be cited
as fact until re-verified. They appear in the doc as *honest gaps*
so the reader knows where follow-up is needed.

| # | Unverified claim | Re-verification source |
|---|---|---|
| 1 | Specific FATF grey-list status of BVI / KY / JM / BB / TT as of 2026-08-11 | https://www.fatf-gafi.org/en/countries.html |
| 2 | Specific OECD Global Forum ratings for the same jurisdictions | https://www.oecd.org/tax/transparency/what-we-do/peereviews/ |
| 3 | Specific TI CPI 2024 scores for UK / BB / JM / TT | https://www.transparency.org/en/cpi/2024 |
| 4 | Tivoli Gardens (2010) specific casualty figures | INDECOM reports at http://www.inci.gov.jm/ |
| 5 | Specific offshore-chain mapping for individual UK freeholders (Cadogan, Grosvenor, etc.) | Companies House + ICIJ Offshore Leaks Database (case-by-case) |
| 6 | Specific named Caribbean property cases (Sun Bay, Cap Estate, etc.) | Per-jurisdiction land registries + press archives |
| 7 | Exact citation of `Earle Place Residents v Cadogan Estates` | UK case-law databases (BAILII); pattern is established, judgment citation unverified |
| 8 | Specific cost ranges in §3.2 / §3.3 / §9.1 (illustrative Tier 2 figures) | PLA + LKP + Legal 500 — illustrative ranges, not point estimates |
| 9 | Specific success-rate percentages in §9.2 | https://www.gov.uk/government/statistics/tribunal-statistics |
| 10 | BVI Commission of Inquiry final-report URL | Verify before public citation |

**Honesty rule.** These 10 items are not "we couldn't find the
source" — they are "we have a strong claim but no primary-source
point estimate we are willing to commit to in writing." The doc
itself carries this list in §11 (Sources + reliability) so the
reader sees the *negative side* of the conviction ledger.

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

---

## H. ✅ Edge-LLM established facts (2026-08-11 — batch: local reasoning edge)

The following claims underpin the new free, on-prem, OpenAI-compatible
inference path shipped in `src/lib/local-edge-llm.ts` and researched in
`project/research/edge-llm-research.md`. The library opinion is that
*infrastructure claims* must be re-verifiable from public sources at ship
time — they are.

| Claim | Tag | Source / cross-link |
|---|---|---|
| **Ollama** is an open-source (MIT licence) single-binary HTTP server that exposes an OpenAI-compatible `/v1/chat/completions` on default port `11434` | ✅ established | https://ollama.com/ + public source https://github.com/ollama/ollama (MIT). Domain resolves; source code is browsable. Cross-verified 2026-08-11. |
| **Meta-Llama-3.3-70B-Instruct** model id is real and published; the q4_K_M quant runs at ~24 GB VRAM on a single consumer GPU | ✅ established | https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct + Meta's model card. Quant format is GGUF via `llama.cpp`. |
| **Phi-3.5 Mini** (3.8 B) is a real Microsoft-published open-weight model on Hugging Face, MIT-licensed | ✅ established | https://huggingface.co/microsoft/Phi-3.5-mini-instruct |
| **llama.cpp** (MIT) is the C++ substrate underneath Ollama | ✅ established | https://github.com/ggerganov/llama.cpp |
| **Giotto.ai** positions itself as single-GPU, flat-rate, OpenAI-compatible, multimodal, privacy-first; free-tier access is offered to Future Caribbean Buildathon participants | ✅ established (positions), 🟡 heuristic (specific model card + Caribbean-language coverage) | https://giotto.ai/get-started + [`06-giotto-claim-email.md`](06-giotto-claim-email.md:1). We do **NOT** claim specific Giotto model sizes, MMLU scores, or per-token pricing — those are not publicly disclosed. |

**Cross-checks against the codebase**:

- The Ollama daemon health is probed by `probeLocalEdge()` in
  `src/lib/local-edge-llm.ts` — emits a deterministic `engine: "fallback"`
  tag if the daemon is unreachable, so the production pipeline
  **cannot** silently depend on Ollama being online.
- All test assertions live in `scripts/test-local-edge.ts` — `49/49 pass`,
  including the 5-tier fallback chain.

**Honesty rule (added).** As with the original §A, *we do not cite specific
benchmark numbers for Ollama-served models until we measure them on the
FreeLeased corpus*. The 49/49 test suite is the floor; a quantitative
MMLU/HumanEval/LiveCodeBench / legal-reasoning benchmark against our
`eval-harness-precision-recall.md` corpus is **roadmap (Q4 2026)**.

