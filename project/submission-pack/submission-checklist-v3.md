# FreeLeased — Submission Checklist and Rubric Coverage (v3)

Deadline: 17 August 2026, midnight AST. Build sprint ends 16 August.

## Required submission items (from guidelines)
- [ ] **Project Overview** — problem, Caribbean and global relevance, solution, business model, GTM. Draft: `project/submission-pack/project-overview-v3.md`.
- [ ] **Technical documentation** — architecture + agentic-workflow diagram, tools/data/models list. Draft: `project/submission-pack/architecture-v3.md`.
- [ ] **GitHub repository** — permissive OSS license (MIT), setup instructions, list of data/models/tools. Structure: pending (`repo-structure-v3` to write).
- [ ] **Demo** — 3 to 5 minute video or live link. Script: `project/submission-pack/demo-script-v3.md`.
- [ ] **Compliance and Responsible AI statement** — 300 to 500 words. Done: `project/submission-pack/compliance-statement-v3.md` (458 words, 0 em-dashes).
- [ ] **Build-in-public narrative** — story the organisers can market. Draft: `project/story/build-in-public-arc.md` and `project/marketing/social-content-pack.md`.

## Rubric coverage matrix (50 business / 50 agentic AI)

| Rubric dimension | Where we address it | Status |
|---|---|---|
| Team Quality | Solo founder + advisor/registry-MoU network + validation quotes (Boardy) | Needs validation quotes |
| Product Innovation / Uniqueness | First cross-border Caribbean property intelligence layer; provenance-first spine | Documented (`defensibility-and-novelty.md`) |
| Defensibility | Data network effect, registry relationships, provenance, verification IP | Documented |
| Product-Market Fit | Paying buyers (agencies, lenders, governments) + free consumer wedge | Documented (`market-and-business-model.md`); needs a live signal |
| Agentic architecture | Multi-agent loop: research, verify, gate, sign-off | Built; diagram in `architecture-v3.md` |
| Multi-agent orchestration | Orchestrator over specialised agents | Built |
| Human-in-the-loop | Human sign-off gates every published verdict | Built |
| Efficiency / infra use | Provider-aware inference (Impala/MiniMax/Shogo), Nebius compute | Built (`src/lib/llm.server.ts`) |
| Real impact | Fairness Check protects residents; land intel unblocks capital | Built (`src/lib/fairness.ts`, 9/9 tests) |
| Scale | Jurisdiction-by-jurisdiction expansion; portable to other regions | Documented |
| Responsible AI | Disclaims every prohibited practice; labelling, opt-out, appeal, kill-switch | Done (`compliance-statement-v3.md`) |

## Pre-submission verification gate (run after preview restart)
- [ ] `bun x tsc --noEmit` clean on our source (ignore `src/generated/` until cleaned).
- [ ] `bun scripts/test-suite.ts` and `bun scripts/test-fairness.ts` all pass.
- [ ] Force `POST /preview/rebuild`, confirm served bundle hash changed (guard the stale-bundle trap).
- [ ] Curl key `/api` endpoints for 2xx and correct shape.
- [ ] Load the public preview URL; confirm the UI renders and the Fairness Check works end to end.

## Outstanding before submit
- [ ] Restart preview (Sam) to unfreeze the build.
- [ ] Collect Impala/MiniMax/Nebius keys (Sam); set env.
- [ ] 1 to 2 validation quotes via Boardy (Sam).
- [ ] Wire Fairness Check into the UI and clean the ~24 `src/generated` type errors (post-reset).
- [ ] Write `repo-structure-v3` + add MIT LICENSE + README.
- [ ] Record demo or ship live link.
