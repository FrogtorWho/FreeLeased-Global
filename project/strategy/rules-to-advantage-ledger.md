# Rules, Recommendations, Competition & Optics — Advantage Ledger

Purpose: map every binding rule, recommendation, judging criterion, and optic to
what it says, when and why we acted on it, and how we turned it to our advantage.
This is the internal strategy spine. The public narrative lives in
`project/story/hackathon-story-journal.md`.

Legend for status: DONE (shipped and verified), IN PROGRESS, PLANNED, SAM (needs Sam).

---

## A. Rules (compliance is non-negotiable; we make it a selling point)

| # | Rule (source) | What it requires | When / why we used it | How we turned it to advantage | Status |
|---|---|---|---|---|---|
| A1 | Code of Conduct section 2, Prohibited AI Practices | No subliminal manipulation, exploitation, social scoring, emotion inference, biometric categorisation, predictive policing/profiling | 5 Aug, on reading the CoC we found our old "adversary intelligence / predict manipulation" layer sat on top of several prohibited practices | Reframed it into a document-only Lease & Contract Fairness Check that scores clauses against statute, never people. We now lead with responsible AI as a differentiator most teams will fail | DONE (`src/lib/fairness.ts`) |
| A2 | Code of Conduct section 4, ADM protections | Transparency, human appeal, opt-out, kill-switch for automated decisions | Baked into the agentic loop design | Human sign-off gates every verdict; opt-out and appeal are product features, not footnotes. Directly answers Vince Fong (regulator) and Dr. Auguste (academic) | DONE (design) / IN PROGRESS (UI) |
| A3 | Code of Conduct section 5, synthetic content | Mark AI-generated content; disclose AI interaction | Applied to every output | Outputs are labelled and evidence-classed; honesty is visible in the UI | IN PROGRESS |
| A4 | Submission Guidelines, General | Solo-4 team, 18+, English, no fee, OSS license (permissive recommended) | Confirmed eligibility 5 Aug | Chose MIT + CC-BY 4.0 + CC0 split; openness signals confidence and aids adoption | PLANNED (repo) |
| A5 | Code of Conduct, integrity | No false claims; no improperly influencing judges | Continuous | Every substantive claim carries provenance and an evidence class; we never overstate. Honesty is the brand | DONE (principle) |

## B. Recommendations (we follow them visibly)

| # | Recommendation (source) | When / why | Advantage | Status |
|---|---|---|---|---|
| B1 | Build in public (Guidelines section 2.1) | From day 1 | The story journal + social pack turn our journey into the organisers' marketing asset. Goodwill and visibility | DONE (`project/story/`, `project/marketing/`) |
| B2 | Deployable or near-deployable system | Throughout | Live API (`/api/fairness/check`) proves it runs, not just slides | DONE (endpoint verified) |
| B3 | Use provided infrastructure | 5 Aug | Provider-aware inference (Impala/MiniMax) + Nebius compute = "we validated your stack", a scoring and relationship win | DONE (`llm.server.ts`) / SAM (keys) |
| B4 | Permissive open-source license | Repo phase | Adoption + trust; aligns with the ecosystem's openness | PLANNED |

## C. Competition (13 sub-criteria; push hardest where the simulated loop is weakest)

Simulated-judge loop (handoff) median 8.3/10. Weakest sub-criteria, in order:
compute efficiency (7.5 low), HITL (7.5 low), real-world impact, scalability,
team quality, PMF. Our plan targets each.

| # | Sub-criterion | Current read | Our move to raise it | Status |
|---|---|---|---|---|
| C1 | Compute efficiency (weakest) | Open model + sponsor compute underused in narrative | Show efficient inference (small open model, provider-aware routing), Nebius batch jobs, and a token/compute budget note in the demo | PLANNED |
| C2 | Human-in-the-loop (weakest) | Present but under-shown | Make the sign-off gate a visible, demoed step; opt-out + appeal + kill-switch on screen | IN PROGRESS |
| C3 | Real-world impact | Needs a concrete pilot | 50-resident pilot framing + a resident running a real lease through the Fairness Check live | PLANNED / SAM |
| C4 | Scalability | Strong on paper | Jurisdiction-by-jurisdiction expansion + portability to other regions, stated in overview and demo | DONE (docs) |
| C5 | Team Quality (solo) | Solo is a risk | Advisor + registry-MoU network + 1-2 Boardy validation quotes | SAM (Boardy) |
| C6 | Product-Market Fit | Needs a live signal | Boardy quotes + diaspora demand evidence | SAM |
| C7 | Product Innovation / Defensibility (strong 9.0) | Already strong | Keep leaning on provenance-first spine + data network effect | DONE (docs) |
| C8 | Distinctiveness (strong 9.0-9.5) | Already strong | Honesty engine + one engine two faces | DONE |

## D. Optics (tune the message per judge)

| Judge (bucket) | What they reward | Our tailored emphasis |
|---|---|---|
| Bill Tai (VC; first investor in Zoom) | Category-defining, global scale, PMF | Lead with global portability and the data network-effect moat |
| Vince Fong (US housing-policy regulator) | Housing supply, affordability, regulatory burden, responsible AI | Lead with affordability impact + the CoC-clean, HITL, appealable design (he scored HITL lowest) |
| Michele Romanow (Dragons' Den, Clearco) | Unit economics, GTM, revenue | Lead with the four-tier model, unit economics, and beachhead GTM (she scored compute efficiency lowest, so pair with an efficiency note) |
| Rigour/academic archetype — **now Dr. Parris Lyew-Ayee (Geospatial & Disaster Risk, JUDGE)** and Peter Chami (UWI CS, JUDGE) | Rigour, methodology, honesty, geospatial provenance | Lead with evidence classes, honest abstention, provenance 5-tuple, data-sufficiency bands. NOTE: Dr. Auguste is a **Member (McGill), not a judge** — keep the archetype, don't optimise for her as a scorer (see judge-panel-analysis.md) |
| Sovereignty/resident archetype — **now Racquel Moses (Climate-Smart, JUDGE)** + IDB/World Bank cluster | Local relevance, sovereignty, resident benefit | Lead with data sovereignty (OWC edge/self-hosted tier) + the resident Fairness Check. NOTE: Sherika Herbert is a **Volunteer (Gov. Barbados), not a judge** — reframe onto actual judges |
| Boardy (AI superconnector; partner AND judge) | Ecosystem engagement | Using Boardy for validation intros is itself the optic: we engaged the sponsor network |

## E. Principle: use the rules, do not bend them
We win the compliance dimension outright by designing to be the most responsible
entry in the field, and we convert every rule (build-in-public, OSS, provided
infra, ADM protections) into a visible advantage rather than a box we tick.
