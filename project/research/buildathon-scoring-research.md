# Buildathon Scoring Research — FreeLeased / Track 9

> **By Sam Peacock · Founder, FreeLeased**
> **Date:** 2026-08-12 · **Status:** primary-source research · **Confidence:** medium-high
> **Companion docs:** [`project/strategy/comprehensive-scoring-reconciliation.md`](../strategy/comprehensive-scoring-reconciliation.md:1), [`project/strategy/projected-final-score.md`](../strategy/projected-final-score.md:1), [`project/strategy/100-judge-panel.md`](../strategy/100-judge-panel.md:1), [`project/strategy/judge-panel-analysis.md`](../strategy/judge-panel-analysis.md:1)

This research refreshes the rubric understanding that already exists in the
project. New here is **primary-source verification of two key claims** that
previous docs relied on internal memory for: (1) the public surface of the
buildathon (the Future Caribbean org is **empty** — there are zero public
repos at [`github.com/FutureCaribbean`](https://github.com/FutureCaribbean));
(2) the only **public** Track-9 repo that references the buildathon is
**our own**.

---

## 1. The Future Caribbean Buildathon — what is publicly verifiable

### 1.1 The official site is not resolvable from the agent's environment

| Source | Status | Notes |
|---|---|---|
| `https://futurecaribbean.dev/` | DNS NXDOMAIN (this agent's env) | Private/internal portal likely |
| `https://www.futurecaribbean.dev/` | DNS NXDOMAIN (this agent's env) | Same |
| `https://docs.futurecaribbean.dev/` | DNS NXDOMAIN (this agent's env) | Same |
| Probe log: `.shogo/runtime/web-probe-results.txt` | 13/13 URLs failed DNS | Full probe results saved |

**Implication.** The buildathon does *not* publish a public rubric on a
crawlable domain. All rubric detail lives in **the candidate portal**
(`sam.peacock1@gmail.com` per [`MEMORY.md:33`](../../MEMORY.md:33)) and
in **portal-issued guidance**. So the rubric that
[`comprehensive-scoring-reconciliation.md`](../strategy/comprehensive-scoring-reconciliation.md:1)
already documented (Business Strength 50% / Agentic AI Excellence 50%, 10
axes, 5 judges × 50 points = 250 max) is the **operational truth** for this
sprint. Treat anything outside our portal-supplied rubric as **unverified**.

### 1.2 The Future Caribbean GitHub org exists but is empty

| Endpoint | Status | Citation |
|---|---|---|
| `https://api.github.com/orgs/FutureCaribbean` | 200 OK | `login:"FutureCaribbean"`, `public_repos:0`, `created_at:"2026-07-10T15:05:27Z"`, `updated_at:"2026-07-13T15:07:11Z"` |
| `https://api.github.com/orgs/FutureCaribbean/repos` | 200 OK, `[]` | Zero public repos |
| `https://api.github.com/orgs/future-caribbean/repos` | 404 Not Found | (capitalisation matters) |
| `https://github.com/FutureCaribbean` | 200 OK (HTML) | Empty org page |
| Probe log: `.shogo/runtime/github-probe-results.txt` | 4/5 verified | |

**Implication.** The buildathon itself publishes **no rubric, no public
judge list, no public scoring methodology** on GitHub or on its website.
This is *normal* — most buildathons keep rubrics private until submission
close to prevent optimisation-to-the-rubric gaming. Therefore:

1. We cannot cite a public rubric. **All rubric claims are from our
   portal and from buildathon conventions (similar competitions).**
2. We should treat our 6.0/10 in-the-world estimate
   ([`100-judge-gap-report.md`](../strategy/100-judge-gap-report.md:14)) as the
   honest baseline; no public scoreboard exists to refute it.

---

## 2. The standard 5-axis template — and what it would look like if public

### 2.1 Buildathon conventions (the 5-axis template)

Across 2024-26 buildathons of comparable size (CfC-scale ≈ 800 builders,
$25k 1st prize), the *de facto* standard is:

| Axis | Typical Weight | What it asks |
|---|---:|---|
| **Idea / Problem** | 20% | Is the problem real and well-scoped? |
| **Technical Execution** | 25% | Does it work? Is the code real, not vapour? |
| **Innovation / Originality** | 20% | Is it a new idea or a wrapper? |
| **Impact / Market** | 15% | Does it matter? Who pays? |
| **Demo / Presentation** | 20% | Can you tell the story in 3-5 min? |

**Citation caveat.** This template is the **conventional shape**, not
verified as the CfC rubric. Our portal-supplied rubric is **the two-track
50/50 split** (Business Strength 50% + Agentic AI Excellence 50%) per
[`MEMORY.md:29`](../../MEMORY.md:29). The 50/50 is the **truth for this
sprint**.

### 2.2 Track 9 / "AI for Real Estate & Development" — what we can infer

| Signal | Source | Inference |
|---|---|---|
| Our public repo description: `"Future Caribbean Buildathon Track 9 Submission - Agentic AI Right-to-Manage Platform"` | [`github.com/FrogtorWho/FreeLeased-Global`](https://github.com/FrogtorWho/FreeLeased-Global) | Track 9 explicitly pairs "AI" with "Real Estate & Development" |
| The buildathon name is **Future Caribbean** | Portal + our docs | Caribbean-focused, regional lens |
| "Right-to-Manage" is an **English/Welsh leasehold** concept | [`project/submission-pack/project-overview-v3.md:7`](../submission-pack/project-overview-v3.md:7) | Domain is **leasehold governance**, not "real estate" in the listing sense |
| CfC organiser "founders" persona on buildathon platforms | Domain convention | Track 9 likely tests whether AI can solve *Caribbean-specific* real-estate problems, where the Caribbean is the **market**, not just a region |

**Inference (unverified but plausible):** Track 9 judges want to see
**Caribbean-relevance first**, **AI as the lever second**. A general
"UK leasehold" product risks being marked "wrong track" — but our
Caribbean adapter (Cayman/Barbados/Jamaica, per
[`project-overview-v3.md:21-22`](../submission-pack/project-overview-v3.md:21))
is what earns the Track 9 box.

---

## 3. Track 9 emphasis (synthesised from existing internal scoring docs)

From [`comprehensive-scoring-reconciliation.md`](../strategy/comprehensive-scoring-reconciliation.md:1) (already in-repo, not duplicated here):

| Pillar | Official Weight | Adjusted Self-Score |
|---|---:|---:|
| Business Strength | 50% | 8.1 (real) |
| → Team Quality | ~17% | 7.5 |
| → Innovation / Defensibility | ~17% | 9.0 |
| → Product-Market Fit | ~17% | 7.5 |
| Agentic AI Excellence | 50% | 8.5 |
| → Architecture | ~8% | 9.5 |
| → Multi-Agent Orchestration | ~8% | 7.0 |
| → Human-in-the-Loop | ~8% | 9.0 |
| → Efficiency / Infra | ~8% | 10.0 |
| → Real Impact | ~8% | 6.5 |
| → Scale | ~8% | 8.0 |

**Updated assessment.** The biggest *liftable* items are the ones where
"real-world evidence" is required: PMF (no users), Agentic (no live
handoff shown), Real Impact (no users yet). These are the same five
weaknesses the existing 100-judge gap report
([`100-judge-gap-report.md:35`](../strategy/100-judge-gap-report.md:35))
called out.

---

## 4. What "Track 9 — AI for Real Estate & Development" emphasises

**Source for this section:** our own submission-pack draft ([`project/submission-pack/project-overview-v3.md`](../submission-pack/project-overview-v3.md:1)) cross-checked against `competitive-landscape-deep.md`.

Track 9 emphasises (we hypothesise, mark unverified):

| Emphasis | Why we think so | What FreeLeased has / lacks |
|---|---|---|
| **Caribbean-specific problems** | CfC = Caribbean Future Corp; "Track 9" is regional | ✅ We cover Cayman/Barbados/Jamaica; we do NOT cover T&T/Guyana/Belize/BS in depth |
| **AI as the lever** | Track name says "AI for" | ✅ Multi-agent, $0 deterministic, provenance spine |
| **Real-estate / property / development** | Track name | ✅ Leasehold + condo governance |
| **Demonstrable, not theoretical** | Buildathon convention | ⚠️ Live demo URL is unverified (per [`100-judge-gap-report.md:97`](../strategy/100-judge-gap-report.md:97)) |
| **Moat / defensibility** | VC-style judging panel (per `judge-panel-analysis.md`) | ✅ "Provenance-native" thesis |

---

## 5. The 93+ judges — what backgrounds, what they reward

**Source:** [`project/strategy/judge-panel-analysis.md`](../strategy/judge-panel-analysis.md:1) and [`100-judge-panel.md`](../strategy/100-judge-panel.md:1) (already in-repo).

- **93 named judges** is the operating assumption per
  [`100-judge-panel.md:12`](../strategy/100-judge-panel.md:12) and per
  [`project/strategy/100-judge-saturation-report.md`](../strategy/100-judge-saturation-report.md:1).
- We do **NOT** have a public judge list. The 93 figure comes from portal
  release notes (per our memory) and is treated as **operational truth for
  scoring**.
- **Background mix** (modelled as 33 archetypes × ~3 personas each in
  [`100-judge-panel.md:31-66`](../strategy/100-judge-panel.md:31)):

| Archetype class | # judges | What they reward |
|---|---:|---|
| Legal (academics, solicitors, barristers, tribunal) | 26 | Statute citation accuracy, procedural correctness, fairness |
| Engineering (frontend, backend, DevOps, security) | 28 | Code quality, type safety, test coverage, OWASP, observability |
| Product / Design (designers, accessibility, OSS) | 20 | UX, accessibility, design system, open-source hygiene |
| AI / ML (researchers, ethicists, GDPR) | 20 | Eval rigour, reproducibility, $0 compute, HITL |
| Business (VCs, insurtech, economists) | 20 | TAM, business model, defensibility, traction |
| Society / policy / regional | 18 | Sovereignty, cultural fit, language, climate |
| Press / BuildOps / alumni | 12 | Storytelling, repo cleanliness, cold-clone success |

**Total ~144 personas in the 33 archetypes** — the project models more
personas than the 93 named judges because some archetypes have only
partial overlap.

### 5.1 What every archetype rewards (the meta-signal)

Across all 33 archetypes in [`100-judge-panel.md`](../strategy/100-judge-panel.md:1) the **same four signals** dominate:

1. **Reproducibility** — "Does it actually work?" (test coverage, cold-clone, demo-day readiness)
2. **Honesty** — "Is the code honest about its limitations?" (truth-diff, fact-check-register, evidence classes)
3. **Caribbean-relevance** — "Is it for the region?" (sovereignty, climate, language, cultural fit)
4. **Defensibility** — "Why can't this be replicated by prompting?" (provenance spine, deterministic engine, multi-agent orchestration)

---

## 6. The 184+ applications / 32 countries / ~800 builders / 40 teams

**Source.** These specific numbers come from portal release notes (per
memory) and are repeated in our strategic docs. Verification status:
**unverified publicly** — the buildathon does not publish these counts on a
crawlable domain.

### 6.1 Who's the competition?

| Cohort | Our count | What this means for us |
|---|---:|---|
| Total applications | 184+ | Track-9 entrants ≈ 18-25 (assuming uniform distribution across ~9 tracks); competition is **10-20 teams in our track** |
| Countries | 32 | "Caribbean + diaspora" is the geographic centre of gravity; UK/North-America is the secondary cluster |
| Total builders | ~800 | Average team size ≈ 4; many solos and duos |
| Final teams | ~40 | **What judges see on demo day** = ~40 demos × 3-5 min each |

**Implication.** Our competition is **not the whole 800** — it's the
**~40 final teams** that survive to demo day. Of those ~40, ~10-15 are in
Track 9 (assuming balanced tracks). Our unique position:

- **Solo founder with agent swarm** (vs. team-of-4 humans) — *defensible narrative if true*
- **Leasehold / condo governance** (vs. generic "proptech") — *track fit*
- **9-jurisdiction spine** (vs. UK-only or US-only) — *Caribbean depth*
- **$0 compute** (vs. inference-heavy competitors) — *agentic-AI excellence*

### 6.2 The one public competitor we can see

Public search for buildathon-related repos:

| Repo | URL | Hook | Notes |
|---|---|---|---|
| **`jechaviz/future_caribbean_ai_buildathon`** | [`github.com/jechaviz/future_caribbean_ai_buildathon`](https://github.com/jechaviz/future_caribbean_ai_buildathon) | **V-lang CLI** for "Caribbean Coordination Desk"; gated submission via `APPLICATION_CONSENT_TO_SUBMIT=yes` | **Track unspecified.** CLI tool, not leasehold-specific. |
| `svtgrig-truest/Leasehold-buddy` | [`github.com/svtgrig-truest/Leasehold-buddy`](https://github.com/svtgrig-truest/Leasehold-buddy) | "AI copilot for leaseholders" — **our direct domain** | Not for CfC buildathon. Single-user repo. |
| `brightdata/real-estate-ai-agent` | [`github.com/brightdata/real-estate-ai-agent`](https://github.com/brightdata/real-estate-ai-agent) | "Real estate data extraction" with Nebius Qwen + Bright Data MCP | Not a CfC entry. Generic data extraction. |
| `drivendataorg/open-ai-caribbean` | [`github.com/drivendataorg/open-ai-caribbean`](https://github.com/drivendataorg/open-ai-caribbean) | **DrivenData aerial-imagery Caribbean disaster-risk mapping** | Past competition (2018-19 era), not CfC. |
| `hummingbot/condor` | [`github.com/hummingbot/condor`](https://github.com/hummingbot/condor) | "Open-source harness for creating and managing AI trading agents" | Not CfC. Inspiration for agent harness patterns. |
| **`FrogtorWho/FreeLeased-Global`** | [`github.com/FrogtorWho/FreeLeased-Global`](https://github.com/FrogtorWho/FreeLeased-Global) | "Future Caribbean Buildathon Track 9 Submission - Agentic AI Right-to-Manage Platform" | **Us.** |

**Key competitor finding:** Only **one** other CfC buildathon repo is
publicly indexed: `jechaviz/future_caribbean_ai_buildathon`. It is **a CLI
for submission automation**, not a leaseholder-rights platform. So **we
have track-fit moat** at the visible-public level.

---

## 7. Specific scoring tactics — what lifts a 7 → 9, what lifts 9 → 10, common 5-7 patterns

### 7.1 What lifts a 7 → 9

Synthesised from [`100-judge-panel.md`](../strategy/100-judge-panel.md:1) Bucket-1 lifts + [`moonshot-roadmap-10-10.md`](../strategy/moonshot-roadmap-10-10.md:1) Tier 1 + Tier 2.

| Axis | 7 → 9 lift | Effort | Citation |
|---|---|---|---|
| Team Quality | One **named** advisory quote from a Caribbean agency / MoU partner | ~30 min + outreach | [`project-overview-v3.md`](../submission-pack/project-overview-v3.md:1) + [`05-advisory-ask-boardy.md`](../strategy/05-advisory-ask-boardy.md:1) |
| Product-Market Fit | One **live** pilot transcript with a real-feeling resident (recorded session) | ~2 h session + 30 min writeup | [`real-pilot-onboarding.md`](../pilot-audit/real-pilot-onboarding.md:1) |
| Multi-Agent | Live **agent-to-agent handoff** in UI (not static cards) | ~4-6 h dev | [`moonshot-roadmap-10-10.md`](../strategy/moonshot-roadmap-10-10.md:1) |
| HITL | **Sign-off Queue UI** surface + audit trail visualisation | ~3 h dev | [`moonshot-roadmap-10-10.md`](../strategy/moonshot-roadmap-10-10.md:1) — Bucket 9 |
| Real Impact | **50-resident pilot** aggregate result published as a one-pager | ~1 h from existing synthetic pilot | [`mock-pilot-session-2026-08-11.md`](../pilot-audit/mock-pilot-session-2026-08-11.md:1) |
| Cold-clone | README + CONTRIBUTING + .env.example finalised | ~2 h | [`100-judge-panel.md:407`](../strategy/100-judge-panel.md:407) Bucket 1 |
| Test coverage | 500+ assertions (we have ~231) | ~4 h | [`100-judge-panel.md:411`](../strategy/100-judge-panel.md:411) Bucket 2 |
| Truth surface | TruthDiff nav tab + fact-check-register published | ~3 h | [`100-judge-panel.md:419`](../strategy/100-judge-panel.md:419) Bucket 4 |
| Observability | OTLP shipped (already); add error tracking + perf budgets | ~3 h | [`100-judge-panel.md:423`](../strategy/100-judge-panel.md:423) Bucket 5 |
| Demo polish | Live-data demo + cold-open + 4-min script + captioning | ~4 h | [`100-judge-panel.md:427`](../strategy/100-judge-panel.md:427) Bucket 6 |

### 7.2 What lifts 9 → 10 (the upper bound)

This is **deliberately hard** because "10" requires things that take
**weeks, not days**.

| Axis | 9 → 10 lift | Time | Notes |
|---|---|---|---|
| Real Impact | **5+ signed LOIs** from Caribbean agencies | 2-4 weeks | Outside sprint |
| Multi-jurisdiction | Civil-law parity for TT/KY/BZ + Spanish translation | 2-3 weeks | Roadmap |
| i18n | Patois / Kweyol / Spanish support | 3-4 weeks | Per [`100-judge-panel.md:319-322`](../strategy/100-judge-panel.md:319) |
| Real revenue | First paying customer | Indefinite | Pre-seed round |
| Multilingual quality | Human-reviewed translations of every surface | 3-4 weeks | Out of sprint |

**These are the *honest gaps* named in [`100-judge-panel.md:512-527`](../strategy/100-judge-panel.md:512).**
We cannot close them in the sprint. The honest move is to **label them
as "roadmap, not implemented"** in the submission and demo — judges
penalise overclaiming more than they penalise gaps.

### 7.3 Common 5-7 patterns (anti-patterns judges spot)

These come from [`comprehensive-scoring-reconciliation.md:33-44`](../strategy/comprehensive-scoring-reconciliation.md:33) (Hidden emphasis) and our internal judge-panel analysis:

| Anti-pattern | Score cap | Trigger | Avoidance |
|---|---|---|---|
| **Overclaiming** (implying MoUs signed when drafted) | 5-7 max | Judges spot "partnership" claims with no dates | Always state "drafted, pending government review" |
| **Synthetic-data unmarked** | DQ risk | Judges spot "real users" in copy with no receipts | Always mark "synthetic" in fixtures + demo |
| **Cold-start broken** | 5-7 max | Judges `git clone` and get a 503 | Cold-clone script + 10-min boot test |
| **Privacy policy missing** | DQ risk | EU/Caribbean judges look for it first | Already shipped at `docs/PRIVACY.md` + `docs/TERMS.md` |
| **Demo video > 5 min** | -1 score | Submission spec says 3-5 min | Cap demo at 4 min 30 sec |
| **Single demo URL dies on cold start** | -2 score | Judge opens tab, sees nothing | Published URL (Netlify/surge) + warm-24h |
| **Repo with no LICENSE** | DQ risk | Judges won't run unlicensable code | Apache-2.0 in [`LICENSE`](../../LICENSE:1) ✅ |
| **"Just a wrapper"** | 5-7 max | Judges say "this is just ChatGPT" | Verifiable spine: 40+ statutes, 25+ patterns, provenance per claim |
| **"Looks like a CRM"** | 5-7 max | Judges say "this is a SaaS dashboard" | Leasehold-governance framing + provenance spine + HITL |
| **Fake metrics / vanity charts** | 5-7 max | Judges spot "10k users" with no funnel | Reconcile-docs ties every number to a source |

---

## 8. Summary — what this research adds beyond existing docs

| New finding | Where it lives | Why it matters |
|---|---|---|
| FutureCaribbean GitHub org is **empty** (0 public repos) | §1.2 | We can't cite a public rubric; the rubric lives in our portal |
| The only **public** CfC-related repo is ours + one V-lang CLI competitor | §6.2 | We have track-fit visibility at the public-surface level |
| `jechaviz/future_caribbean_ai_buildathon` is the **one named competitor** | §6.2 | CLI-tool hook, not leaseholder — we have category to ourselves in Track 9 |
| `svtgrig-truest/Leasehold-buddy` is the **direct-domain comp** (not CfC) | §6.2 | Confirms we're not alone in the leasehold-AI space; we ARE alone on the Caribbean adaptation |
| Track-9 emphasis: **Caribbean first, AI as lever** | §2.2, §4 | Aligns with our existing 9-jurisdiction adapter work |
| The 93-judge model → **5 universal signals** (Reproducibility, Honesty, Caribbean-relevance, Defensibility + Truth surface) | §5.1 | Every Tier-1 lift must hit one of these four |
| The 9 → 10 boundary is **weeks of work** (LOIs, translations, civil-law parity, revenue) | §7.2 | Honest disclosure in submission > overclaim |

## 9. Action taken from BATCH 1

| Action | Status | Reason |
|---|---|---|
| Re-state the rubric as portal-supplied 50/50 + 5-judge × 50-pt model | ✅ Already in [`comprehensive-scoring-reconciliation.md`](../strategy/comprehensive-scoring-reconciliation.md:1) | No duplication needed |
| Surface the 5 universal judge signals (Reproducibility, Honesty, Caribbean, Defensibility, Truth) | ✅ This doc §5.1 | New signal-extraction |
| Audit the public buildathon surface | ✅ This doc §1.1-§1.2 | Confirms no public rubric exists |
| List the public CfC competitors | ✅ This doc §6.2 | New competitive visibility |

## 10. Citations & probe logs

- Web probe (DNS + HTTP): `.shogo/runtime/web-probe-results.txt` (13 URLs, all NXDOMAIN for the CfC site)
- GitHub probe: `.shogo/runtime/github-probe-results.txt` (5 URLs, 4 OK, 1 404)
- Competitor probe: `.shogo/runtime/competitor-probe-results.txt` (14 URLs, 8 OK, 6 fail/N-A)
- README probe: `.shogo/runtime/readme-probe-results.txt` (9 URLs, 7 OK, 2 404)

All URLs cited in this doc were probed at 2026-08-12T01:17Z. Where a URL
is unverified or returned 404, this is **explicitly marked**.

---

*Generated 2026-08-12. Reconciles to [`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1) (last run: 10/10 PASS).*