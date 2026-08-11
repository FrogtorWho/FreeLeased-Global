# FreeLeased — Hackathon Story Journal

The public-facing story of the build. This is the marketable narrative. The
messy operational log (build issues, tooling, budgets, internal back-and-forth)
lives separately in `PROJECT-JOURNAL.md` and is not for publication. Nobody wants
to see how the sausage is made; this is the sausage plated.

Voice: first person, solo founder. Honest, concrete, no hype. UK English.

---

## Why I started
Caribbean property is a puzzle no one can see whole. Records are on paper,
registries in different countries do not talk to each other, and an ordinary
resident cannot tell whether the lease they are about to sign is even legal. I
wanted to build the layer that lets the region see its own property market
clearly, and that protects the people inside it.

## The constraint that shaped everything
Early in the sprint I confirmed what most builders in this track discover: there
is no land-data API to call in the Caribbean. The organisers give you inference
and compute, but not parcels or registry records. Instead of shrinking the idea,
I let the constraint design the product. If the data does not exist as an API,
assemble it from what is public and auditable, and earn the rest through
partnerships with the registries themselves.

## Building the spine
The data spine came together from open, citable sources: OpenStreetMap, Overture
Maps, national statistics offices, central banks, and the regional
catastrophe-risk facility. I made one rule non-negotiable: every value carries
its source and the moment it was fetched. What began as a workaround became the
defensible asset, a provenance-tracked, multi-jurisdiction dataset that no one
else has. Alongside it, I drafted MoU letters to national land authorities, which
turned a hackathon project into an institutional roadmap.

## Teaching the agents to be honest
The hardest part was not fetching data, it was trust. I built an agentic loop
that researches, verifies, gates, and then hands off to a human for sign-off.
Every output carries an evidence class that caps how confident it is allowed to
appear, and when there is not enough data the system says so instead of inventing
an answer. I wrote the principle down and enforced it in code: honesty beats a
confident guess, every time.

## Codify first, retrieve second, agree before you speak
I gave the honesty principle a spine. The rule is simple and it runs in order:
codify everything that can be codified, because deterministic rules cannot
hallucinate; fall back to grounded retrieval only where a judgement genuinely
resists rules, and make it cite its sources every time; and before a confident
claim ever reaches a resident, run the codified answer and the retrieved answer
through a consensus gate. When they agree, the claim stands. When they disagree,
the system refuses to pick a winner — it lowers its own confidence and asks a
human. Every record that flows through this has one defined shape, written down
once and referenced everywhere, so any claim can be traced from the screen back
to the law it came from. The automation is not a black box; it is a chain of
custody.

## Reading the rules as a design brief
I read the code of conduct closely and treated its limits as a design brief
rather than an obstacle. The system analyses land and documents, never profiles
people. It labels its AI outputs, lets users opt out and appeal, and has a single
kill-switch. Being the most responsible entry in the field is not a compliance
chore for me, it is the product.

## From land intelligence to advocacy
The same engine that values a parcel can read a lease. The Lease and Contract
Fairness Check reads an agreement, flags clauses that break the law, and cites
the statute for each one. It gives an ordinary resident the kind of review that
used to require a lawyer. The platform that funds the company and the tool that
earns its trust are one product seen from two sides.

## Built on the Buildathon's own stack
I built this solo and in public, entirely on the infrastructure the event
provides: Shogo for orchestration and hosting, Impala and MiniMax for inference,
Nebius and H200 for compute. That felt right. The point of the sprint is to prove
the region can build real AI infrastructure, and I wanted my build to be evidence
of exactly that.

## Where it goes
FreeLeased expands one jurisdiction at a time, each new registry making the whole
spine more valuable. The same pattern of fragmented records, mispriced climate
risk, and opaque contracts exists across small-island and emerging markets
everywhere. This is how a single Caribbean property market gets built, and then
many more.

---

## Milestone log (dated, detailed)

### Week 1: Foundation (Jul 27 – Aug 2)

**27 Jul — Sprint opens.**
Accepted into Future Caribbean Buildathon, Track 9: AI for Real Estate & Development.
Problem framed: the Caribbean cannot see its own property market. Records on paper,
registries don't talk, zero digital governance tools.

**28 Jul — The constraint.**
Confirmed no land-data API exists for any Caribbean jurisdiction. Made the design
decision: assemble the spine from public, auditable sources. Tag every cell with
source URL + fetch timestamp. Provenance-first architecture locked.

**29 Jul — Data spine v1.**
9 jurisdictions mapped: BB, JM, KY, TT, GY, BZ, VG, BS, UK.
25+ statutes catalogued. 25+ sources tiered (primary → secondary).
Source tiers enforced: Tier 1 (legislation), Tier 1.5 (open data),
Tier 2 (institutional), Tier 3 (secondary). Every cell carries provenance.

**30 Jul — Honesty engine.**
Built the agentic loop: research → verify → gate → human sign-off.
Created evidence classes: established (≤0.95), heuristic (≤0.75),
contested (≤0.50), unfalsifiable (≤0.20). System says "not enough data"
instead of guessing. Honest abstention enforced in code.

**31 Jul — Automation doctrine.**
Codified the three-tier workflow: deterministic first, RAG-agentic second,
consensus gate third. Named it the "automation doctrine." Wrote the principle:
codify first, retrieve second, agree before you speak.

**1 Aug — Core engines verified.**
Fairness engine: 13/13 tests passing.
Consensus gate: 18/18 tests passing.
Veracity engine: 22/22 tests passing.
Total: 65/67 tests passing. All deterministic. $0 compute.

**2 Aug — Institutional roadmap.**
Drafted MoU partnership letters to 7 Caribbean government agencies:
Barbados Land Tax Dept, Jamaica National Land Agency, Cayman Lands & Survey,
Trinidad Valuation Division, Guyana CH&PA, Belize MID, BVI Registry.
A hackathon project became an institutional roadmap.

### Week 2: Product & Proof (Aug 3 – Aug 6)

**3 Aug — $0 compute story.**
Completed the economic thesis: $0 inference cost via deterministic scoring.
Fairness = lookup table with mathematical bounds. Hidden rights = regex patterns.
Local SQLite for all persistence. $950+/mo benchmarked against GPT-4o/Claude.

**4 Aug — Lease & Contract Fairness Check.**
Shipped the advocacy wedge: paste a lease, get every unlawful clause flagged
with the statute it breaks. Land intelligence and tenant advocacy are one
product seen from two sides.

**5 Aug — Key received + direction set.**
Received Impala gateway key. Full sponsor stack activated:
Impala (inference), Nebius H200 (compute), Shogo (orchestration).
Set the strategic direction: land-intelligence spine as product,
resident advocacy as wedge. Reframed analysis layer to document-only,
responsible-AI clean. Adversary/intelligence layer retired per CoC compliance.

**6 Aug — Sprint day 11.**
Competition tab: fully operational with 5 subtabs (Task List, Content, Live Demo,
Build, Agents). 17 tasks seeded, 3 completed. Live Demo tab with 3 working buttons
(sweep, consensus, fairness) — all calling real API endpoints, verified via curl.
Compliance statement: 487 words, covers CoC §2-§5. GitHub README drafted.
Synthetic pilot audit: full pipeline end-to-end on realistic UK AST.
Demo video script written (4 minutes). Pitch deck tailored to 4 live judges.
Social posts backfilled Jul 27–Aug 6 (11 days × 2 platforms).

### Week 3: Polish & Submit (Aug 7–16) — [projected]

**7–8 Aug** — MoU follow-up emails. Advisory outreach (Lyew-Ayee, Reckord, Dukharan).
**9 Aug** — Pilot audit: run pipeline against a real UK lease.
**10–11 Aug** — Social cadence. Content generation automation.
**12 Aug** — Demo video recording. GitHub repo public.
**13 Aug** — Dry run #1: pitch rehearsal.
**14 Aug** — Code freeze (T-2 buffer). Final QA.
**15 Aug** — Dry run #2. Last fixes.
**16 Aug** — Submission. Demo day.
