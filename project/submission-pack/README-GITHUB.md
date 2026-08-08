# FreeLeased 🏠

> Open-source, local-first, resident-led AI platform for leasehold governance.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#testing)
[![Tests](https://img.shields.io/badge/tests-65%2F67%20passing-brightgreen)](#testing)
[![TRL](https://img.shields.io/badge/TRL-4%20%E2%86%92%205-orange)](#technology-readiness)

---

## What It Does

FreeLeased automates statutory diagnostics for leasehold governance. It analyses lease and contract documents against a multi-jurisdiction legal spine, discovers hidden statutory rights most residents don't know exist, and produces advisory dossiers with full provenance tracking.

**Starting point:** UK Right-to-Manage (RTM) and enfranchisement.
**Adapting to:** Caribbean condominium law (Barbados, Jamaica, Cayman Islands, Trinidad & Tobago, Guyana, Belize, BVI, Bahamas).

### The Problem

- 4.6 million UK leaseholders struggle to exercise statutory rights
- Caribbean jurisdictions have zero digital leasehold governance tools
- Existing RTM firms charge £500–£5,000 per case
- No open-source alternative exists

### The Solution

A deterministic audit engine that runs on a laptop. No API keys. No GPU cluster. No inference bill.

## Key Features

- **Multi-Jurisdiction Data Spine** — 9 jurisdictions, 40+ statutes, 40+ verified sources with provenance tracking
- **Hidden Rights Discovery** — 20 statutory protections mapped to trigger patterns
- **Consensus Gate** — Deterministic cross-checks with 2/3 human validation
- **Veracity Engine** — Admiralty/NATO evidence grading on every claim (established / heuristic / contested / unfalsifiable)
- **Fairness Layer** — Clause-by-clause scoring against statutory floors
- **Redaction Protocol** — PII scrubbing before any dossier reaches the consensus gate
- **Cryptographic Communes** — k-anonymity (k≥5) community-level data aggregation
- **$0 Compute Cost** — All deterministic, local SQLite, zero cloud fees

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Lease Text  │───▶│  Research     │───▶│  Fairness      │
│  (input)     │    │  Desk         │    │  Engine        │
└─────────────┘    │  (spine       │    │  (clause       │
                    │   lookup)     │    │   scoring)     │
                    └──────────────┘    └───────┬────────┘
                                                 │
                    ┌──────────────┐    ┌────────▼────────┐
                    │  Veracity    │◀───│  Consensus      │
                    │  Engine      │    │  Gate           │
                    │  (evidence   │    │  (2/3 human     │
                    │   grading)   │    │   validation)   │
                    └──────┬───────┘    └────────────────┘
                           │
                    ┌──────▼───────┐    ┌────────────────┐
                    │  Dossier     │───▶│  Redaction     │
                    │  (advisory   │    │  Protocol      │
                    │   output)    │    │  (PII scrub)   │
                    └──────────────┘    └───────┬────────┘
                                                 │
                                          ┌──────▼────────┐
                                          │  Communes     │
                                          │  (k≥5         │
                                          │   aggregate)  │
                                          └───────────────┘
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sampeacock/freeleased.git
cd freeleased

# Install dependencies
bun install

# Run the development server
bun dev

# Open in browser
open http://localhost:5173
```

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- No external API keys required — everything runs locally

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Hono (server.tsx) + Prisma 7 + SQLite |
| Charts | Recharts |
| Icons | Lucide React |
| Build | Vite |

## Data Model

The data spine is defined in `src/data/spine.ts` and includes:

- **9 Jurisdictions** — BB, JM, KY, TT, GY, BZ, VG, BS, UK
- **40+ Statutes** — CLRA 2002, Landlord and Tenant Act 1985, BSA 2022, and jurisdiction-specific equivalents
- **40+ Sources** — Primary (legislation.gov.uk), Tier 1.5 (OpenStreetMap), Tier 3 (World Bank, UN Habitat)
- **20 Hidden Rights Patterns** — Regex patterns that trigger statutory right discovery

## Testing

```bash
# Run the full test suite
bun scripts/test-suite.ts

# Run individual engines
bun scripts/test-fairness.ts      # 13/13 passing
bun scripts/test-consensus.ts     # 18/18 passing
bun scripts/test-veracity.ts      # 22/22 passing
```

**Current status:** 65/67 tests passing (2 pre-existing false positives in edge cases)

## Project Structure

```
├── src/
│   ├── components/auri/     # UI components (Competition, CommandPost, etc.)
│   ├── data/                # Data spine, patterns, fixtures
│   ├── lib/                 # Core engines (fairness, consensus, veracity, etc.)
│   └── App.tsx              # Main application
├── prisma/                  # Database schema
├── scripts/                 # Test suites
├── project/                 # Strategy, submission pack, research
├── server.tsx               # Hono API server (auto-generated)
├── custom-routes.ts         # Custom API endpoints
└── package.json
```

## Competition

Built for the [Future Caribbean Global AI Buildathon](https://futurecaribbean.ai) — Track 9: AI for Real Estate & Development.

- **Founder:** Sam Peacock — Investment Product Analyst at Schroders (10+ years)
- **Agent team:** 5 AI agents (fl-craft-review, fl-dataviz, fl-schema, fl-verify, fl-integrations)
- **MoU partners:** 7 Caribbean government agencies

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Built with [Shogo](https://shogo.ai) — the AI agent platform for building real products.
