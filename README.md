# FreeLeased

The intelligence layer for a single Caribbean property market. Provenance-tracked
land and lease intelligence, assembled from open data and registry partnerships,
produced by an agentic verification loop that is honest by design.

Built for the Future Caribbean Buildathon (AI for Real Estate & Development).

## What it does
- **Land intelligence** — parcels, zoning, valuation signals, climate and
  insurance risk, assembled from public sources with per-cell provenance.
- **Agentic verification loop** — research, verify, gate, human sign-off. Every
  output carries an evidence class that caps its confidence, and the system
  abstains rather than fabricates below a data-sufficiency threshold.
- **Lease & Contract Fairness Check** — document-only. Flags clauses that are
  one-sided or inconsistent with statute, cites the law, and never profiles
  people.

## Responsible AI
FreeLeased performs none of the practices prohibited by the EU AI Act Article 5
or the Buildathon Code of Conduct: no social scoring, no emotion inference, no
biometric categorisation, no behavioural prediction. Outputs are labelled, a
human sign-off gates every published verdict, and users can opt out and appeal.
See `project/submission-pack/compliance-statement-v3.md`.

## Tech stack
- Front end: Vite + React + TypeScript + Tailwind + shadcn/ui.
- API: Hono. Persistence: Prisma + SQLite.
- Orchestration and hosting: Shogo.
- Inference (provider-aware, OpenAI-compatible): Impala gateway (`qwen3.6-27b`),
  MiniMax, or the Shogo pod gateway. Selected by environment at request time.
- Compute: Nebius / NVIDIA H200 for batch embedding and geospatial indexing.
- Observability: OllyGarden.

## Data sources
OpenStreetMap Overpass, Overture Maps, national statistics offices, central
banks, the Caribbean Catastrophe Risk Insurance Facility, and national land
registry feeds under MoU. Every value carries a source URL and a fetch timestamp.

## Getting started
Prerequisites: [Bun](https://bun.sh) 1.1+.

```bash
bun install
bunx prisma generate
bunx prisma db push     # creates ./prisma/dev.db
```

Configure inference (optional locally; the app also runs on the Shogo pod
gateway). Never commit real keys.

```bash
# .env  (example)
IMPALA_API_KEY=sk-...            # sponsor gateway
IMPALA_BASE_URL=https://ht.getimpala.ai/v1
IMPALA_MODEL=qwen3.6-27b
# or:
MINIMAX_API_KEY=...
```

The Shogo runtime builds and serves the app and mounts the API under `/api/*`.

## API (selected)
- `POST /api/fairness/check` — body `{ "text": "<lease text>", "jurisdiction": "all|BB|TT" }`.
  Returns evidence-classed, statute-cited flags. Advisory, not legal advice.

```bash
curl -s -X POST http://localhost:3001/api/fairness/check \
  -H 'Content-Type: application/json' \
  -d '{"text":"The landlord may enter at any time without notice.","jurisdiction":"all"}'
```

## Tests
```bash
bun scripts/test-fairness.ts     # Fairness Check
bun scripts/test-suite.ts        # core suite
```

## Documentation
Canonical working set lives in `project/`:
- `project/README.md` — index and the public-story vs internal-ops convention.
- `project/submission-pack/` — overview, architecture, demo script, compliance,
  checklist.
- `project/strategy/` — rules-to-advantage and resources ledgers.
- `project/story/` — the public build-in-public narrative.
- `project/research/` — market/business model and defensibility.

## Licence
Runtime under the MIT Licence (see `LICENSE`). The data spine is published under
CC-BY 4.0 and the provenance schema under CC0.
