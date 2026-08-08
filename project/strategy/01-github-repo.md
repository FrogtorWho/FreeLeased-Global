# BRIEF 1: GitHub Repository Preparation

> **Agent type:** Coding agent with git/GitHub CLI access
> **Priority:** CRITICAL — Submission Day 19 (14 Aug 2026)
> **Owner action:** Sam must review + push to GitHub; agent does ALL prep work
> **Output:** Public-ready repo with README, LICENSE, setup docs, clean structure

---

## 1. Context

**FreeLeased** is an open-source, local-first, resident-led platform for Caribbean property governance. Built for the Future Caribbean AI Buildathon (Track 9: AI for Real Estate & Development, deadline 16 Aug 2026).

The platform automates statutory diagnostics for leasehold governance — starting with UK Right-to-Manage (RTM), adapting to Caribbean condominium law across 9 jurisdictions. It is a Vite + React + TypeScript + Tailwind CSS SPA with a Hono + Prisma 7 + SQLite backend.

**Key stats:**
- 14 functional UI tabs
- 4 engine modules (consensus, veracity, fairness, research)
- 9 jurisdictions in data spine, 40+ statutes, 40+ verified sources
- 20 hidden-rights patterns
- 50 synthetic pilot residents (20 Barbados + 15 Jamaica + 15 Cayman Islands)
- 65/67 tests passing (consensus 18/18, veracity 22/22, fairness 13/13, telemetry 9/9)
- $0 compute spend — local SQLite, deterministic code, no cloud database

**The Buildathon requires:** Public GitHub repository with OSS license for Data Room submission.

## 2. Deliverables

| # | Deliverable | Format | Notes |
|---|---|---|---|
| 1 | `README.md` | Markdown | Project overview + architecture + setup + API + testing |
| 2 | `LICENSE` | Plain text | MIT license (permissive, as recommended by FC) |
| 3 | `CONTRIBUTING.md` | Markdown | Brief contributor guide |
| 4 | `.gitignore` | Plain text | Node/Bun/Prisma/SQLite ignores |
| 5 | Codebase cleanup | Verification | Remove internal refs, personal paths, dev artifacts |
| 6 | Structure validation | Check | Verify directory layout is logical and navigable |

## 3. Source Files to Read

| File | Purpose |
|---|---|
| `project/strategy/revenue-model-gtm.md` | Business model, TAM/SAM/SOM, pricing tiers |
| `project/strategy/competitive-landscape.md` | Competitor mapping, moat analysis, 5 defensibility layers |
| `project/strategy/founder-journey-team-quality.md` | Agent team narrative, founder story |
| `project/submission-pack/architecture-v3.md` | Architecture description |
| `prisma/schema.prisma` | Database schema (163 lines, Prisma 7) |
| `src/data/spine.ts` | Data spine: jurisdictions, statutes, sources |
| `src/lib/consensus.ts` | Core engine: consensus gate |
| `src/lib/veracity.ts` | Core engine: Admiralty/NATO evidence-class scoring |
| `src/lib/fairness.ts` | Core engine: document-only fairness analysis |
| `src/lib/gates.ts` | Deterministic gates |
| `src/lib/engines.ts` | Core: dossier builder, redaction protocol, commune aggregate |
| `scripts/test-suite.ts` | Master test runner |
| `package.json` | Dependencies, scripts, engine config |
| `custom-routes.ts` | Custom API routes |
| `handoff/10-mou-letters/` | 7 MoU letter drafts (for acknowledgements) |
| `handoff/07-judges/` | Judge profiles (for context only) |

## 4. README Structure (Required)

```markdown
# FreeLeased

> Open-source, local-first, resident-led platform for Caribbean property governance.
> Built for the [Future Caribbean AI Buildathon](https://buildathon.futurecaribbean.com)
> — Track 9: AI for Real Estate & Development.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-65%2F67-brightgreen)](#testing)

## The Problem

4.6 million UK leaseholders struggle to exercise statutory rights (RTM, enfranchisement,
service-charge audit). Caribbean jurisdictions have no digital leasehold governance tools.
The law is clear — the tooling is absent.

## What FreeLeased Does

[2-3 sentences: automates statutory diagnostics, 9 jurisdictions, evidence-classed claims,
consensus-gated human validation.]

## Architecture

[Mermaid diagram showing the full pipeline]

### Engines
| Engine | Purpose | Status |
|---|---|---|
| Consensus Gate | Cross-checks codified vs RAG-agentic estimates, 2/3 human validation | 18/18 tests |
| Veracity Engine | Admiralty/NATO source grading, evidence-class scoring | 22/22 tests |
| Fairness Layer | Document-only analysis, no social scoring | 13/13 tests |
| Research Desk | Spine lookup + source verification | Operational |

### Agent Team
[Table of 5 agents: fl-craft-review, fl-dataviz, fl-schema, fl-verify, fl-integrations]

## Data Spine

| Metric | Count |
|---|---|
| Jurisdictions | 9 |
| Statutes | 40+ |
| Verified Sources | 40+ |
| Hidden-Rights Patterns | 20 |
| Pilot Residents | 50 (BB: 20, JM: 15, KY: 15) |

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Lucide
- **Backend:** Hono, Prisma 7, SQLite
- **Compute:** $0 (deterministic code, no cloud database)
- **Testing:** Deterministic assertion suite

## Quick Start

[Step-by-step: clone, install, setup DB, run dev, run tests]

## API Endpoints

| Route | Method | Description |
|---|---|---|
| /api/residents | GET | List pilot residents |
| /api/statutes | GET | List statutes |
| /api/consensus | POST | Run consensus gate |
| /api/competition/* | GET/POST | Competition ops endpoints |

## Testing

bun scripts/test-suite.ts

## Project Structure

[Directory tree]

## MoU Partners

[List 7 Caribbean government agencies]

## License

MIT — see [LICENSE](LICENSE)

## Acknowledgements

- Future Caribbean AI Buildathon
- [MoU partners]
- Caribbean Development Bank
```

## 5. .gitignore Contents

```
node_modules/
dist/
prisma/dev.db
prisma/dev.db-journal
.env
.env.*
memory-store/
*.log
.shogo/
```

## 6. MIT License Text

Use standard MIT with "FreeLeased Contributors" as copyright holder and year 2026.

## 7. Codebase Cleanup Rules

- ✅ KEEP: `src/`, `scripts/`, `prisma/schema.prisma`, `custom-routes.ts`, `project/`, `_handoff/`, `_sentinel_drop/`, `files/`
- ❌ REMOVE: `.env`, `.env.*`, `prisma/dev.db`, `prisma/dev.db-journal`
- ❌ SCRUB: any file containing `/app/workspace/` or runtime-specific paths
- ❌ SCRUB: any reference to "Mavis" (agent name) or agent-specific identifiers in source comments
- ✅ KEEP: `_handoff/` and `_sentinel_drop/` — reference material for judges

## 8. Style Rules

- **UK English**: colour, organisation, generalises, programme, licence, defence
- **No AI tells**: no "leveraging", "cutting-edge", "seamless", "game-changing", "revolutionary", "empowering", "robust"
- **Data-backed claims**: every number in README traces to a source file
- **Brevity**: README scannable in 60 seconds; detailed docs in separate files
- **Mermaid diagram**: judges can render it natively in GitHub

## 9. Glossary

| Term | Definition |
|---|---|
| RTM | Right to Manage — statutory right for UK leaseholders to take over building management (CLRA 2002, s.72) |
| Enfranchisement | Right to buy the freehold of a leasehold property |
| CLRA 2002 | Commonhold and Leasehold Reform Act 2002 — UK statute governing RTM |
| LFRA 2024 | Leasehold and Freehold Reform Act 2024 — recent reform creating policy tailwind |
| BSA 2022 | Building Safety Act 2022 — UK building safety compliance framework |
| Evidence class | Confidence level for a claim: established (primary source), heuristic (case law), contested (secondary analysis), unfalsifiable |
| Consensus gate | Deterministic cross-check requiring 2/3 human validation before a claim surfaces as "verified" |
| Data spine | The structured knowledge base of jurisdictions, statutes, sources, and patterns |
| Cryptographic Communes | k-anonymity (≥5) aggregation layer for community-level insights |
| Adversary/ThreatLab | Retired intelligence layer — now scoped to defensive-only, HITL-gated |
| MoU | Memorandum of Understanding — partnership letters to Caribbean government agencies |
| Spine | The structured data layer: 9 jurisdictions × 40+ statutes × 40+ sources with provenance |
| Dossier | Per-resident advisory document built from spine + audit pipeline |
