# FreeLeased — Social Posts Backfill (Jul 27 – Aug 6)

> Ready-to-post content for every day of the sprint so far.
> Channels: X (short hooks), LinkedIn (longer posts).
> Tone: first person, solo founder. Honest, concrete, no hype.
> Hashtags: #FutureCaribbean #BuildInPublic #PropTech #AgenticAI #AI #RealEstate
> UK English throughout.

---

## Day 1 — Jul 27 (Sprint Opens)

### X
Day 1. Accepted into @FutureCaribbean Buildathon Track 9: AI for Real Estate.

The problem: Caribbean property records are on paper, registries don't talk to each other, and a tenant can't tell if their lease is legal. No digital governance tools exist.

Building: FreeLeased. Let's go. 🧵

#BuildInPublic #FutureCaribbean

### LinkedIn
**Day 1: Starting FreeLeased at the Future Caribbean Buildathon.**

I've been accepted into Track 9 (AI for Real Estate & Development) as a solo founder. The project: FreeLeased — an open-source platform for leasehold governance in the Caribbean.

The problem is structural:
- 8 Caribbean jurisdictions with fragmented land records
- Zero digital tools for leasehold governance
- Leaseholders can't tell if their agreements are lawful
- Service charges go unchecked, s.20 consultation thresholds are ignored, building safety compliance is a black box

The thesis: codify 40+ statutes into a deterministic audit engine that runs on a laptop. No API keys. No GPU cluster. No inference bill.

Day 1. Framing the problem. Scoping the spine. Let's build in public.

#FutureCaribbean #BuildInPublic #PropTech #RealEstate

---

## Day 2 — Jul 28

### X
Day 2. Confirmed what every serious proptech builder discovers: there is no land-data API to call in the Caribbean.

So the constraint becomes the design. Assemble the spine from public sources. Tag every cell with where it came from. Provenance first, always.

### LinkedIn
**Day 2: The constraint that shaped everything.**

Yesterday I went looking for Caribbean land-data APIs. There are none. The organisers provide inference (Impala gateway) and compute (Nebius H200), but no parcel data, no registry records, no lease databases.

Most teams would shrink the idea. I let the constraint design the product instead.

If the data doesn't exist as an API, build the spine from what's public and auditable:
- OpenStreetMap Overpass (parcels, boundaries, infrastructure)
- Overture Maps (buildings, points of interest)
- National statistics offices (demographics, economic indicators)
- Central banks (exchange rates, property price indices)
- CCRIF (catastrophe risk data)

And earn the rest through partnerships with the registries themselves.

This is now the defensible asset: a provenance-tracked, multi-jurisdiction dataset that no one else has. The workaround became the moat.

#BuildInPublic #FutureCaribbean

---

## Day 3 — Jul 29

### X
Day 3. Data spine v1 locked: 9 jurisdictions, 40+ statutes, 40+ verified sources. Every cell tagged with source URL + fetch timestamp.

No shortcuts. If we can't prove where a number came from, it doesn't go in.

### LinkedIn
**Day 3: Building the data spine.**

Today the core data spine came together — 9 Caribbean and UK jurisdictions, 40+ statutes, 40+ verified sources with provenance tracking on every cell.

The rule I made non-negotiable: every value carries its source and the moment it was fetched. If we can't prove where a number came from, it doesn't go in.

This is not a database. It's a chain of custody.

Jurisdictions mapped: Barbados, Jamaica, Cayman Islands, Trinidad & Tobago, Guyana, Belize, BVI, Bahamas, UK.

Source tiers:
- Tier 1: Primary legislation (legislation.gov.uk, Hansard)
- Tier 1.5: Open data (OpenStreetMap, Overture, census)
- Tier 2: Institutional (World Bank, UN-Habitat, CCRIF)
- Tier 3: Secondary (academic, journalistic)

Every source earns its tier through a veracity check. Nothing is trusted by default.

#DataSovereignty #FutureCaribbean #BuildInPublic

---

## Day 4 — Jul 30

### X
Day 4. The hardest part isn't fetching data — it's trust.

Built an agentic loop: research → verify → gate → human sign-off. Every output carries an evidence class that caps its confidence.

When there's not enough data, the system says so. It doesn't guess.

### LinkedIn
**Day 4: Teaching the agents to be honest.**

The hardest engineering problem in this build isn't data access. It's trust.

I built an agentic loop with four stages:
1. **Research** — gather data from the spine
2. **Verify** — cross-check against the veracity engine
3. **Gate** — consensus check (codified vs RAG-agentic)
4. **Human sign-off** — nothing publishes without approval

Every output carries an evidence class:
- **Established**: primary statute or case law (confidence ≤ 0.95)
- **Heuristic**: case law or secondary source (≤ 0.75)
- **Contested**: conflicting sources (≤ 0.50)
- **Unfalsifiable**: can't be verified (≤ 0.20)

When there isn't enough data, the system says "not enough data" instead of inventing an answer.

Honesty is a feature, not a disclaimer.

#AgenticAI #ResponsibleAI #FutureCaribbean

---

## Day 5 — Jul 31

### X
Day 5. Codify first, retrieve second, agree before you speak.

Deterministic rules don't hallucinate. Grounded retrieval only where judgement resists rules. And before a claim reaches a resident, the consensus gate checks: do the codified and retrieved answers agree?

If they disagree, the system asks a human. It never picks a winner.

### LinkedIn
**Day 5: The automation doctrine.**

I wrote down the principle and enforced it in code:

**Codify first.** Everything that can be a deterministic rule, becomes one. Rules don't hallucinate. Rules cost $0. Rules are reproducible.

**Retrieve second.** For questions that genuinely resist rules — "is this service charge reasonable?" — fall back to grounded retrieval. Make it cite its sources every time.

**Agree before you speak.** Run both answers through the consensus gate. When they agree, the claim stands. When they disagree, the system lowers its own confidence and asks a human.

The automation is not a black box. It's a chain of custody.

This is now the competitive moat: a deterministic engine that runs on a laptop, with zero compute cost, that any government agency can audit.

#BuildInPublic #FutureCaribbean #OpenSource

---

## Day 6 — Aug 1

### X
Day 6. Three engines live and tested:

✓ Fairness — clause-by-clause scoring against statutory floors
✓ Consensus — deterministic cross-check + human validation
✓ Veracity — Admiralty/NATO evidence grading on every claim

65/67 tests passing. All deterministic. $0 compute.

### LinkedIn
**Day 6: Core engines verified.**

Three engines are live and passing tests:

1. **Fairness Engine** (13/13 tests) — scores lease clauses against statutory floors. Flags unlawful provisions with citations. No inference needed — it's a lookup table with mathematical bounds.

2. **Consensus Gate** (18/18 tests) — cross-checks codified vs RAG-agentic estimates. Requires 2/3 human validation. When the two methods disagree, it routes to human review. It never makes the decision for you.

3. **Veracity Engine** (22/22 tests) — Admiralty/NATO source grading. Every claim gets an evidence class that caps how confident we display. Primary statute = 0.95 cap. Conflicting sources = 0.50 cap.

Total: 65/67 tests passing (2 pre-existing edge cases). All deterministic. Zero inference calls. Runs on a laptop.

#BuildInPublic #FutureCaribbean #OpenSource

---

## Day 7 — Aug 2

### X
Day 7. MoU letters drafted for 7 Caribbean government agencies: Barbados, Jamaica, Cayman Islands, Trinidad & Tobago, Guyana, Belize, BVI.

A hackathon project just became an institutional roadmap.

### LinkedIn
**Day 7: From hackathon project to institutional roadmap.**

Today I drafted MoU partnership letters to 7 Caribbean government agencies:

- Barbados: Land Tax Department
- Jamaica: National Land Agency
- Cayman Islands: Land & Survey Department
- Trinidad & Tobago: Valuation Division
- Guyana: Central Housing & Planning Authority
- Belize: Ministry of Infrastructure Development
- British Virgin Islands: Registry of Land

Each letter proposes: data sharing, jurisdiction-specific validation, and a pathway from prototype to production.

The letters don't need to be signed tomorrow. They signal intent and regulatory receptivity. They turn a solo build into something a government could adopt on Monday.

#FutureCaribbean #BuildInPublic #PropTech

---

## Day 8 — Aug 3

### X
Day 8. $0 compute.

Most AI products: $950+/mo in inference.
FreeLeased: SQLite on a laptop.

Three decisions:
→ Deterministic scoring (not inference)
→ Local DB (not cloud)
→ Pattern matching (not neural nets)

Built for residents who can't afford GPU clusters.

### LinkedIn
**Day 8: The $0 compute story.**

Most AI products burn through inference budgets. GPT-4o: $0.60–$15 per million tokens. Claude Sonnet: $3–$15/M. At scale, $950/month minimum.

FreeLeased processes lease audits against 40+ statutes across 9 jurisdictions. Clause-by-clause fairness scoring. Evidence-class tagging. Consensus gate with human validation. Immutable audit trail.

Compute cost: $0.

How? Three design decisions:

1. **Deterministic scoring, not inference.** Fairness scores run against codified statutory floors. No LLM needed.

2. **Local SQLite, not a data warehouse.** 50 pilot residents, 9 jurisdictions, 40+ statutes — all in a 2MB file.

3. **Pattern matching, not neural networks.** Hidden rights discovery uses regex patterns against statute text. 20 patterns, 100% recall on synthetic tests.

Result: a regulatory audit engine that any Caribbean government agency can run on a laptop.

#FutureCaribbean #BuildInPublic #OpenSource #PropTech

---

## Day 9 — Aug 4

### X
Day 9. The same engine that values a parcel can read a lease.

Fairness Check: paste a lease, get every unlawful clause flagged with the statute it breaks.

Land intelligence and tenant advocacy are one product seen from two sides.

### LinkedIn
**Day 9: From land intelligence to tenant advocacy.**

The same engine that values a parcel can read a lease.

The Lease & Contract Fairness Check reads an agreement, flags clauses that break the law, and cites the statute for each one. It gives an ordinary resident the kind of review that used to require a lawyer — and it does it for $0.

This is the advocacy wedge. The platform that funds the company and the tool that earns its trust are one product seen from two sides.

Every finding carries:
- An evidence class (how confident can we be?)
- A statutory citation (which law does this break?)
- A severity rating (how urgent is this?)

And the consensus gate ensures no automated decision is ever final.

#FutureCaribbean #BuildInPublic #TenantRights

---

## Day 10 — Aug 5 (Key Received)

### X
Day 10. Got the Impala gateway key today. Sprint was already building without it.

Now: Impala for inference, Nebius H200 for compute, Shogo for orchestration. Full sponsor stack, end to end.

But the core product doesn't need any of it. The engine runs on SQLite.

### LinkedIn
**Day 10: Sponsor stack activated, but the engine doesn't need it.**

Today I received the Impala gateway key. The full sponsor infrastructure is now live:
- Impala gateway (OpenAI-compatible inference)
- Nebius H200 compute
- Shogo orchestration and hosting

Here's the thing: the core audit engine doesn't use any of it. Fairness scoring is deterministic. The consensus gate is deterministic. The veracity engine is deterministic. They run on SQLite and produce identical results every time.

The inference gateway powers the RAG-agentic fallback — the part that handles genuinely ambiguous questions where rules aren't enough. It's the exception handler, not the core loop.

This is intentional. A government agency in Belize shouldn't need an API key to audit a lease.

#FutureCaribbean #BuildInPublic #SovereignAI

---

## Day 11 — Aug 6 (Today)

### X
Day 11. The build so far:

✓ 9-jurisdiction data spine (40+ statutes, 40+ sources)
✓ 3 core engines (fairness, consensus, veracity) — all tested
✓ Live demo: paste text → rights sweep → fairness check → consensus gate
✓ 7 MoU letters drafted
✓ Synthetic pilot audit completed end-to-end

5 days left. Demo video, GitHub repo, final submission.

### LinkedIn
**Day 11: Sprint status — 16 of 21 days done.**

Halfway through the Future Caribbean Buildathon. Here's where FreeLeased stands:

**Built and tested:**
- 9-jurisdiction data spine with per-cell provenance
- 3 core engines: fairness (13/13), consensus (18/18), veracity (22/22)
- Live demo tab: paste any text, see rights sweep + fairness check + consensus gate in real-time
- Synthetic pilot audit: full pipeline end-to-end on a realistic UK AST

**In progress:**
- Demo video recording (script written)
- GitHub repo public release (README drafted)
- Pitch deck tailored to 4 live judges

**What the judges will see:**
A working product that runs on a laptop, costs $0 to operate, and can be adopted by a government agency on Monday. No mockups. No slides-only. Live code.

5 days to polish and submit.

#FutureCaribbean #BuildInPublic #PropTech #AI

---

## Posting Schedule

| Day | Date | Posted? | Notes |
|-----|------|---------|-------|
| 1 | Jul 27 | ☐ | Sprint open |
| 2 | Jul 28 | ☐ | Constraint → design |
| 3 | Jul 29 | ☐ | Data spine v1 |
| 4 | Jul 30 | ☐ | Honesty as feature |
| 5 | Jul 31 | ☐ | Automation doctrine |
| 6 | Aug 1 | ☐ | Engines verified |
| 7 | Aug 2 | ☐ | MoU letters |
| 8 | Aug 3 | ☐ | $0 compute |
| 9 | Aug 4 | ☐ | Fairness check |
| 10 | Aug 5 | ☐ | Key received |
| 11 | Aug 6 | ☐ | Sprint status |

**Recommended:** Post 1 per day. X first (morning), LinkedIn (lunch), Discord (evening).
