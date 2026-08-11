# Changelog

All notable changes to FreeLeased are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Truth Protocol note: every count cited below reconciles against
> [`scripts/reconcile-docs.ts`](scripts/reconcile-docs.ts:1) output. If you
> edit a number here, edit the code that proves it (or vice versa) so the two
> stay in sync.

## [Unreleased] — Phase 4 (Giotto + repo hygiene)

### Added
- `src/core/giotto_client.py` — OpenAI-compatible Giotto.ai client
  (with `get_giotto_client_or_none()` graceful fallback).
- `scripts/test-giotto.ts` — 20-check integration test harness.
- `project/strategy/giotto-integration-research.md` — research,
  strategic fit, risk register, integration plan.
- `project/strategy/06-giotto-claim-email.md` — ready-to-send
  email template for Daniel Alvarez.
- `.gitmessage`, `.gitattributes`, `.editorconfig`,
  `.github/pull_request_template.md`, `HISTORY.md`, `CHANGELOG.md`.
- `.env.example` — `GIOTTO_API_KEY` + `GIOTTO_BASE_URL`.

### Changed
- `project/strategy/gauntlet-loop.md` — PROCESS sub-loop now names
  Giotto as the multimodal classification engine.
- `project/strategy/moonshot-roadmap-10-10.md` — sponsor list now 7
  strong (added Giotto.ai).
- `AGENT_BRIEF.md`, `README.md` — cross-link to Giotto integration.
- `.gitignore` — expanded to exclude `*.log`, `*.pyc`, `__pycache__/`,
  `.pytest_cache/`, `.ruff_cache/`, `$null`, build artefacts, IDE state.
- `CONTRIBUTING.md` — added Git workflow section.
- `project/strategy/06-giotto-claim-email.md` links to research doc
  and gauntlet loop.

## [1.0.0] — 2026-08-11 (PHASE 3 — WIN MODE 100/100)

### Added
- Sample-lease dossier end-to-end reproducible pipeline.
- HITL Sign-off Queue with approve / reject / annotate + immutable audit.
- OllyGarden OTLP trace export (DSP-5 spans live).
- 10 judge-driven refinements (rubric self-score, social exporter,
  PSA blog, MobileCapture a11y, brand showcase, cold-clone bootstrap,
  Boardy warm intros, pilot outreach emails, demo video script).
- Data-room copies for 22 of 24 Buildathon folders.
- Self-improving gauntlet (Bayesian conviction update + veracity eval).

### Changed
- Pitch/deck v7 tighten; projected score documentation.
- 159-test core suite → 231/231 tests + 10/10 reconcile + health-check all green.

## [0.9.0] — 2026-08-08 (PHASE 2 — Real-World Evidence)

### Added
- TRL-4 dossier from `sample-lease.txt`.
- 50-resident pilot fixtures end-to-end.
- Synthetic lease for repeatability.

## [0.5.0] — 2026-08-04 (PHASE 1 — Brand & Surface)

### Added
- 5-variant brand pack (Veridian / Quill / Monolith / Canopy / Coral).
- Deterministic SVG→PNG renderer.
- 30-day social campaign.

## [0.1.0] — 2026-08-02 (PHASE 0 — Kernel)

### Added
- 9-jurisdiction legal spine in `src/data/spine.ts`.
- 4 deterministic dossier engines (`src/lib/engines.ts`).
- Consensus gate (`src/lib/consensus.ts`) + `SURFACE_THRESHOLD = 0.5`.
- Truth Protocol with conviction caps `0.99 / 0.75 / 0.60 / 0.33`.
- `FREELEASED-PRINCIPLES.md` — pseudonymous, document-only, CoC-safe.
