# Provided Resources — Usage Ledger (when, why, and to what end)

Every resource the organisers or partners provided, what it is, when and why we
used it, and which scoring dimension or story beat it serves.

| Resource | What it is | When / why we used it | Feeds | Status |
|---|---|---|---|---|
| **Shogo** (sponsor + platform) | Agentic build, orchestration, hosting | Entire build runs inside Shogo | Agentic AI Excellence; the "built end to end on the Buildathon stack" optic | DONE (Pro active) |
| **Impala gateway** | OpenAI-compatible inference, `qwen3.6-27b`, base `https://ht.getimpala.ai/v1`, team key at check-in | Primary inference once the key lands; provider-aware layer already routes to it | Compute efficiency (small open model); "used provided infra" | SAM (key) / code DONE |
| **MiniMax** (partner) | Second LLM API | Fallback/secondary provider for redundancy and harder reasoning | Compute efficiency; multi-provider robustness | SAM (redeem) / code DONE |
| **Nebius** (partner) | GPU compute + promo codes | Batch embedding and geospatial indexing for the data spine | Compute efficiency; scalability | SAM (redeem) / PLANNED |
| **Highrise / NVIDIA H200** | High-end compute | Heavy batch jobs if needed | Compute efficiency (weakest sub-criterion) | SAM (key) / PLANNED |
| **Boardy** (partner AND judge) | AI superconnector | Secure 1-2 validation quotes from proptech / Caribbean real-estate contacts | Team Quality + PMF (weak sub-criteria); ecosystem optic | SAM |
| **OllyGarden** (partner) | Observability, connect GitHub repos | Instrument the agent loop; show traces in the demo | Agentic AI Excellence; implementation quality | PLANNED |
| **Open data (not sponsor, but the workaround)** | OSM Overpass, Overture, stats offices, central banks, CCRIF | Assembled the provenance data spine because no land-data API exists | Defensibility (the moat); real-world impact | IN PROGRESS |
| **Registry MoUs** | Drafted letters to national land authorities | Turn a hackathon into an institutional roadmap | Scalability; PMF; Caribbean relevance | DONE (drafts in `_handoff/10-mou-letters`) |
| **NoInfra** (winner opp) | Agent-native infrastructure (shared $10k compute) | Name as a portable deployment target for the agent swarm | Architecture; scalability | AVAILABLE TO WINNERS |
| **OWC** (winner opp) | Thunderbolt-5 AI deployment systems — local accel / **edge** / **sovereign** compute / fast storage | Anchors our **edge/sovereign deployment mode** (land data stays on-territory) | Real-world impact; scalability; defensibility; **sovereignty (Herbert)** | ARCHITECTURE MOVE (see prizes-opportunities-leverage.md §3) |
| **Powertranz** (winner opp) | Caribbean payment gateway, free 12 mo | In-region billing for institutions + pro tier; **residents free** | PMF; unit economics (**Romanow**); GTM — fixes pre-mortem G7 | MONETISATION MOVE (§4) |
| **DMZ Soft Landing** (winner opp) | 1-wk programme @ Toronto Metropolitan U | North-America GTM / investor-network path in the roadmap | Scalability; team/GTM (**Bill Tai**) | ROADMAP SLIDE |
| **NYSE Investor Showcase** (winner opp) | Live pitch to global investors (Fall 2026) | Forces an **investor-grade** deck (TAM, unit economics, moat, ask) | Business Strength across the board | DECK UPGRADE (§5) |
| **Bookit** (winner opp) | Flights + accommodation for finalists | Plan in-person finale presence | logistics | AVAILABLE TO WINNERS |

## Why this matters to the score
The competition explicitly rewards efficient, novel use of the provided agentic
infrastructure. Concentrating inference on the open model via Impala, adding
MiniMax for redundancy, running batch work on Nebius/H200, and tracing the loop
with OllyGarden lets us tell a clean efficiency-and-orchestration story that
directly lifts the two weakest simulated sub-criteria (compute efficiency, HITL).
Using Boardy for validation lifts the other two (Team Quality, PMF).
