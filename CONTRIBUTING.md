# Contributing to FreeLeased

FreeLeased is the intelligence layer for Caribbean + UK leasehold governance. It is built open-source, deterministically, with a human-in-the-loop control plane. Contributions of every size are welcome — from a one-line typo to a new jurisdiction.

## Code of conduct

This project follows the [Future Caribbean Buildathon Code of Conduct](https://futurecaribbean.dev/code-of-conduct) and the [Buildathon CoC](https://buildathon.dev/code-of-conduct). Be kind. Be specific. Assume good faith.

## Quick start

Prerequisites: [Bun](https://bun.sh) 1.1+, Node 20+.

```bash
bun install            # install deps
bunx prisma db push    # create ./prisma/dev.db
bun dev                # start the dev server (Vite + Hono)
```

The app boots at `http://localhost:5173`. The API runs at `http://localhost:8080/api`.

## Tests

The single command that proves everything is honest:

```bash
npm run verify
```

This runs:
- `npm run reconcile` — doc-vs-code reconciliation (10/10 expected)
- `npm run health` — health-check scorecard (all green expected)
- `npm run test:truth-diff` — TruthDiff component regex parity
- `npm run test:health-check` — health-check helpers
- `npm run test:reconcile-docs` — reconciler invariants
- `bun scripts/test-signoff-queue.ts` — Sign-off Queue component + API
- `bun scripts/test-all.ts` — aggregator: runs all five above

Target: **231/231 tests, 10/10 reconcile, 0 drift**. Anything else = bug, not feature.

To run only the core engine suite (159 assertions, deterministic, no server required):

```bash
bun scripts/test-suite.ts
```

## Truth Protocol (TRL honesty)

FreeLeased commits to the **Truth Protocol** documented in [`project/strategy/truth-protocol.md`](project/strategy/truth-protocol.md). Every claim in documentation, code comments, README, or pitch must match the actual state of the codebase. The reconciler enforces this automatically — if you change a number in docs, change it in code (or vice versa) so they reconcile.

In particular:
- **No synthetic pass inflation.** Test counts come from real `check()` invocations, not hand-asserted.
- **No fake provenance.** Every citation must resolve to a real URL, fetched and recorded.
- **No hidden LLM costs.** The `computeStats` counter is real. If you add an LLM call, you must justify the spend and surface it.
- **No scope creep on CoC §5.** Do not reintroduce prohibited practices (social scoring, emotion inference, etc.). The CoC compliance statement at [`project/submission-pack/compliance-statement-v3.md`](project/submission-pack/compliance-statement-v3.md) is the source of truth.

## Adding a new jurisdiction (canonical workflow)

> The 5-step v1 protocol below remains for **legacy contributions**.
> The **canonical pattern is now the top-down onboarding workflow** —
> follow [`project/strategy/jurisdiction-onboarding-workflow.md`](project/strategy/jurisdiction-onboarding-workflow.md:1).
> It produces a single `src/data/frameworks/{code}-framework.json` per
> jurisdiction, validated against the
> [`LegislativeFramework`](src/data/legislative-framework-schema.ts:1)
> schema. The v1 spine ([`src/data/spine.ts`](src/data/spine.ts)) stays
> intact for legacy data (sources, pilot-status, climate) until a
> parallel `DataSourceFramework` and `PilotStatusFramework` land.
> See [`src/data/MIGRATION-v1-to-v2.md`](src/data/MIGRATION-v1-to-v2.md:1)
> for the bridge.

Per [`project/strategy/multi-jurisdiction-legal-spine.md`](project/strategy/multi-jurisdiction-legal-spine.md), the legacy v1 jurisdiction-expansion protocol remains:

1. **Add to the spine.** Append a `Jurisdiction` entry to [`src/data/spine.ts`](src/data/spine.ts) with code, name, capital, tenure system, registry URL, and `inPilot` flag.
2. **Seed statutes.** Add 3–5 verified statutes to `STATUTES` in [`src/data/spine.ts`](src/data/spine.ts). Each must carry: `id`, `jurisdiction`, `shortTitle`, `citation`, `url`, `covers`, and `conviction: "verified"`.
3. **Seed sources.** Add 2–4 tier-2 or tier-3 sources to `SOURCES` in [`src/data/spine.ts`](src/data/spine.ts). Tier-0 (supra-national) and tier-1.5 (OSM/Overture) are inherited automatically.
4. **Wire the bridge.** If the new jurisdiction's legal tradition differs from `common_law`, add a `JurisdictionFramework` to [`src/data/uk-framework.ts`](src/data/uk-framework.ts) (or a new `*-framework.ts` file) and register it in [`custom-routes.ts`](custom-routes.ts:903) via the `jurisdictionFrameworks` array.
5. **Run `npm run verify`.** If the reconciler flags drift (e.g. jurisdiction count changed), update the affected doc claims. The 10/10 must hold.

For **new contributions**, prefer the v2 workflow — it is more
disciplined (top-down, scrape-driven, schema-validated) and the test
harness ([`scripts/test-legislative-schema.ts`](scripts/test-legislative-schema.ts:1))
catches cross-link and URL regressions automatically. The scrape
scaffold ([`scripts/scrape-jurisdiction.ts`](scripts/scrape-jurisdiction.ts:1))
probes every URL and writes a `*-scrape-report.json` next to the
framework.

After these 5 steps, the new jurisdiction appears in:
- `/api/spine/jurisdictions`
- `/api/land/<code>`
- `/api/jurisdictions/stats`
- The Knowledge Graph
- The Sign-off Queue (if you add residents)

## Git workflow

### Branching
- `main` — protected. Only fast-forward or filter-branch merges from release branches.
- `feat/<scope>-<one-word-summary>` — for new features.
- `fix/<scope>-<one-word-summary>` — for bugfixes.
- `docs/<scope>-<one-word-summary>` — for docs-only.
- `chore/<scope>-<one-word-summary>` — for tooling / config.

### Commit messages (conventional)
We use [Conventional Commits](https://www.conventionalcommits.org/) via the template at [`.gitmessage`](.gitmessage):

```
<type>(<scope>): <short imperative summary>

<body — what and why, not how>

<footer — breaking changes, issue refs, co-authors>
```

Types: `feat | fix | docs | style | refactor | test | chore | perf | build | ci`

Example scope values: `giotto | gauntlet | spine | engines | consensus | docs | tests | deploy`.

### Pull requests
- Use the template at [`.github/pull_request_template.md`](.github/pull_request_template.md).
- Every PR must show `npm run verify` green.
- Aim for one logical change per PR.

### Line endings + binary markers
Handled automatically by [`.gitattributes`](.gitattributes). Don't fight it.

### Editor whitespace
Handled by [`.editorconfig`](.editorconfig). LF everywhere except Windows shell scripts.

## Pull request checklist

- [ ] `npm run verify` exits 0
- [ ] No new dependencies (or justified in the PR description)
- [ ] No edits to `src/generated/*` or `server.tsx`
- [ ] New jurisdictions follow the 5-step protocol above
- [ ] CoC compliance: no prohibited practices introduced
- [ ] If you added a UI component, it carries `aria-label` and `aria-expanded` on interactive elements

## Reporting issues

Use GitHub Issues. Include:
- Steps to reproduce
- Expected vs actual
- `npm run verify` output (paste, don't summarise)

## Licence

By contributing, you agree your contributions are licensed under the Apache-2.0 runtime licence (see [`LICENSE`](LICENSE)). Data contributions to the spine are released under CC-BY 4.0.


## Per-PR controls (added 2026-08-12 after the fire-and-forget failures)

Every PR must:
- Pass 
ode scripts/reconcile-docs.ts (10/10 PASS · 0 drift)
- Pass 
ode scripts/test-llm-chain.ts (59/59)
- Pass 
ode scripts/test-rbac.ts (259/259)
- Pass 
ode scripts/test-gauntlet.ts (211/211)
- Pass 
ode scripts/health-check.ts
- Have at least one Rose AI review comment (once OllyGarden Rose is activated)
- Have a [PERSON_NAME] token if a real name is referenced

Forbidden in any PR:
- Untracked files in src-rhd-extracted/
- console.log() with full objects (PII risk — Rose will flag)
- Missing service.name resource attribute on OTLP exporters
- Untracked *.log files or __pycache__/
- New dependencies without explicit Sam approval
