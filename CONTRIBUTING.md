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

## Adding a new jurisdiction (5 steps)

Per [`project/strategy/multi-jurisdiction-legal-spine.md`](project/strategy/multi-jurisdiction-legal-spine.md), the jurisdiction expansion protocol is:

1. **Add to the spine.** Append a `Jurisdiction` entry to [`src/data/spine.ts`](src/data/spine.ts) with code, name, capital, tenure system, registry URL, and `inPilot` flag.
2. **Seed statutes.** Add 3–5 verified statutes to `STATUTES` in [`src/data/spine.ts`](src/data/spine.ts). Each must carry: `id`, `jurisdiction`, `shortTitle`, `citation`, `url`, `covers`, and `conviction: "verified"`.
3. **Seed sources.** Add 2–4 tier-2 or tier-3 sources to `SOURCES` in [`src/data/spine.ts`](src/data/spine.ts). Tier-0 (supra-national) and tier-1.5 (OSM/Overture) are inherited automatically.
4. **Wire the bridge.** If the new jurisdiction's legal tradition differs from `common_law`, add a `JurisdictionFramework` to [`src/data/uk-framework.ts`](src/data/uk-framework.ts) (or a new `*-framework.ts` file) and register it in [`custom-routes.ts`](custom-routes.ts:903) via the `jurisdictionFrameworks` array.
5. **Run `npm run verify`.** If the reconciler flags drift (e.g. jurisdiction count changed), update the affected doc claims. The 10/10 must hold.

After these 5 steps, the new jurisdiction appears in:
- `/api/spine/jurisdictions`
- `/api/land/<code>`
- `/api/jurisdictions/stats`
- The Knowledge Graph
- The Sign-off Queue (if you add residents)

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
