# Pull Request

> Thanks for contributing to FreeLeased. Please tick the relevant boxes below.

## Summary

<!-- One-paragraph description of what this PR changes and why. -->

## Linked issues

<!-- Link to issue(s) this PR closes, e.g. "Closes #123". -->

## Type of change

- [ ] feat (new feature)
- [ ] fix (bugfix)
- [ ] docs (docs only)
- [ ] refactor (no behaviour change)
- [ ] test (test additions / fixes)
- [ ] chore (tooling / config / dependency)
- [ ] perf (performance)
- [ ] ci (CI workflow)

## Scope

<!-- 1–5 word scope tag, e.g. "spine", "engines", "consensus", "telemetry", "git" -->

**Scope:**

## Checklist

- [ ] `npm run verify` exits 0 (10/10 reconcile, 231/231 tests, health green)
- [ ] No new dependencies added to `package.json`/`bun.lock` (or justified below)
- [ ] No edits to `src/generated/*`, `server.tsx`, `bun.lock` (unless explicitly required)
- [ ] **Tenki review status:** advisory only (Tenki never blocks merge). See `docs/tenki-workflow.md`.
- [ ] I followed the jurisdiction-onboarding 5-step protocol (if jurisdiction added)
- [ ] CoC compliance: no prohibited practices introduced
- [ ] If I added a UI component: `aria-label` and `aria-expanded` on interactive elements
- [ ] Truth Protocol: every doc claim still matches code (run `scripts/reconcile-docs.ts`)
- [ ] New env vars are documented in `.env.example`
- [ ] I updated `HEARTBEAT.md` Daily Progress Log
- [ ] I appended to `AI_JOURNAL.md`

## Verification commands run

```bash
npm run verify
bun scripts/test-suite.ts
bun scripts/test-reconcile-docs.ts
```

<!-- Paste outputs (or summarise — but include the numbers). -->

## Screenshots / artefacts

<!-- Add screenshots, gifs, or links to artefacts for UI changes. -->

## Notes for reviewer

<!-- Anything the reviewer should know that doesn't fit above. -->
