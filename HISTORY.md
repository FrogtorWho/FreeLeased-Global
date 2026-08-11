# FreeLeased — Narrative History

> A timeline of the project's life in phases, from kernel to 2026-08-11. Use this
> to onboard a new contributor in under five minutes; cross-reference
> [`CHANGELOG.md`](CHANGELOG.md) for the per-release notes.

---

## Phase 0 — Kernel (2026-07-27 → 2026-08-02)

The six-day solo sprint that proved the spine idea.

- **Spine compiles.** The 9-jurisdiction legal spine drops into
  [`src/data/spine.ts`](src/data/spine.ts:1); 40+ verified statutes written,
  cross-linked through the knowledge graph.
- **First dossier engine.** [`src/lib/engines.ts`](src/lib/engines.ts:1)
  lands the 4-agent DS-gauge pattern; [`consensus.ts`](src/lib/consensus.ts:1)
  introduces `SURFACE_THRESHOLD = 0.5` and the surface / review / abstain
  routing.
- **Truth Protocol.** [`project/strategy/truth-protocol.md`](project/strategy/truth-protocol.md:1)
  codifies the conviction caps `0.99 / 0.75 / 0.60 / 0.33`. Honest output is
  the *product thesis*, not a side concern.
- **Honesty principle.** [`FREELEASED-PRINCIPLES.md`](FREELEASED-PRINCIPLES.md:1)
  fossilises the rules: pseudonymous residents, document-only fairness,
  refusal to introduce prohibited practices.

## Phase 1 — Brand & Surface (2026-08-03 → 2026-08-04)

- **5-variant brand pack.** [`project/brand/`](project/brand/README.md:1)
  ships Veridian / Quill / Monolith / Canopy / Coral, each with logo mark,
  palette, type specimen, motion spec, voice-and-tone doc, and wireframes.
- **Deterministic asset renderer.** [`scripts/render-brand-assets.ts`](scripts/render-brand-assets.ts:1)
  SVG→PNG for every brand.
- **30-day social campaign.** [`project/marketing/social-campaign-100.md`](project/marketing/social-campaign-100.md:1)
  primes the public surface.
- **WIN-DAY-100 bridge.** [`project/strategy/WIN-DAY-100.md`](project/strategy/WIN-DAY-100.md:1)
  scores every sub-axis against the Buildathon rubric.

## Phase 2 — Real-World Evidence + Judge Polish (2026-08-05 → 2026-08-09)

- **TRL-4 sample-lease dossier.** [`e9c3702`](https://github.com/FrogtorWho/FreeLeased-Global/commit/e9c3702)
  produces a reproducible dossier from a real synthetic lease.
- **HITL Sign-off Queue.** [`038f2e6`](https://github.com/FrogtorWho/FreeLeased-Global/commit/038f2e6)
  with full provenance, immutable audit row, and resident appeal.
- **OllyGarden observability.** [`d55ac17`](https://github.com/FrogtorWho/FreeLeased-Global/commit/d55ac17)
  wires DSP-5 spans.
- **Data-room population.** 45 files into the Buildathon data-room with the
  reversible-copy journal in [`memory/data-room-copies.md`](memory/data-room-copies.md:1).
- **Win-batch 1–4 synthesis.** [`a1ff163`](https://github.com/FrogtorWho/FreeLeased-Global/commit/a1ff163),
  [`c101068`](https://github.com/FrogtorWho/FreeLeased-Global/commit/c101068),
  [`038f2e6`](https://github.com/FrogtorWho/FreeLeased-Global/commit/038f2e6),
  [`356d9c2`](https://github.com/FrogtorWho/FreeLeased-Global/commit/356d9c2)
  — reconcile, pitch, sign-off, snapshot.

## Phase 3 — WIN MODE 100/100 (2026-08-10 → 2026-08-11)

- **10 judge-driven refinements.** [`0b9a505`](https://github.com/FrogtorWho/FreeLeased-Global/commit/0b9a505)
  covers: swimlane architecture, jurisdiction cost curve, eval harness,
  judge Q&A kill-list, 33-test expansion, rubric self-score, social exporter
  (750 rows), PSA blog post, MobileCapture a11y, brand-pack showcase HTML,
  cold-clone bootstrap, Boardy warm intros (3 one-pagers), pilot outreach
  emails (UK LKP / JM Habitat / BB BAOA), demo video shot-by-shot script.
- **Phase-3 push complete.** [`9bb3111`](https://github.com/FrogtorWho/FreeLeased-Global/commit/9bb3111)
  — 14 commits pushed via filter-branch workaround (PAT workflow scope blocker
  resolved). Origin hash `0b9a505ad10654772e698361f1ef013737f2dfe2`.

## Phase 4 — Sponsor Stack & Repo Hygiene (2026-08-11, this batch)

- **Giotto.ai integration.** 7th sponsor — OpenAI-compatible compact reasoning
  model wired into the gauntlet PROCESS sub-loop
  ([`src/core/giotto_client.py`](src/core/giotto_client.py:1),
  [`scripts/test-giotto.ts`](scripts/test-giotto.ts:1),
  [`project/strategy/giotto-integration-research.md`](project/strategy/giotto-integration-research.md:1)).
- **Repo professionalization.** Conventional-commit template
  ([`.gitmessage`](.gitmessage:1)), PR template
  (`.github/pull_request_template.md`), `.gitattributes` (linguist-generated
  on `src/generated/**`), `.editorconfig` (LF / 2-space / 4-space Python).
- **HISTORY.md + CHANGELOG.md** land for the first time.
- **Working-folder README** at the parent directory
  ([`G:\My Drive\Development\Future Caribbean\Shogo\FreeLeased-Global\README.md`](G:\My Drive\Development\Future Caribbean\Shogo\FreeLeased-Global\README.md:1)).

## What's next

- 16 Aug 2026 — Buildathon demo (3 minutes).
- Giotto.ai key claim — first live multimodal lease extraction.
- Pilot outreach follow-ups (UK LKP / JM Habitat / BB BAOA).
- Bonus: Boardy LOI / MoU LOI from one of the 7 partner agencies.
