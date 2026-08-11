# Tenki Activation Procedure

**Date:** 2026-08-11
**Status:** Pending — awaiting repo-invite step (no CLI action possible)
**Live partner:** Tenki (GitHub PR code-review bot sitting on top of Nebius)

---

## What Tenki is

Tenki is a Future Caribbean Buildathon GitHub PR review bot. It runs a
Nebius-backed code reviewer that comments on pull requests in this
repository once invited.

> Activation happens when Tenki's bot account is **invited to the
> repository**. There is no direct API call we can make from CLI to
> "use" Tenki credits — Tenki runs as a GitHub App inside the repo.

---

## Activation steps for Sam

1. **Open the Tenki dashboard.**
   URL provided in the FC Buildathon partner page (search for "Tenki"
   in the partner benefits spreadsheet).
2. **Generate / paste the Tenki API key.**
   The key we received on 2026-08-11 (stored as `TENKI_API_KEY` in
   `.env`, masked as `tk_***`) belongs to the *FC organisation* and is
   used to authenticate Tenki's own backend — it does NOT grant repo
   access on its own.
3. **Install the Tenki GitHub App** on `FreeLeased-Global/workspace`
   (Settings → GitHub Apps → "Tenki Code Reviewer" → Install).
4. **Invite the Tenki bot account to this repo.**
   Use the GitHub App's invite flow (Settings → Integrations →
   Tenki → "Add repository"). The bot handle is `@tenki-reviewer`
   (verify on the Tenki dashboard; the handle may differ).
5. **Open the activation PR** (see below) so the bot has a real PR to
   review. Once Tenki posts its first comment, credits begin to draw.

> Until steps 1–5 are completed, `TENKI_API_KEY` has no effect on the
> repo. It only matters once the GitHub App is installed.

---

## Post-activation checks

After the bot is installed, verify:

- [ ] The `FreeLeased-Global/workspace` repo lists "Tenki Code Reviewer"
      in Settings → Integrations.
- [ ] Opening a trivial PR triggers a Tenki review comment within
      ~60 seconds.
- [ ] The Tenki dashboard shows a non-zero remaining-credit balance for
      `FreeLeased-Global` (consumed: 0 until the first review lands).

---

## Current activation state (2026-08-11)

| Item                             | Status                              |
|----------------------------------|-------------------------------------|
| `TENKI_API_KEY` in `.env`        | Present (masked: `tk_***`)          |
| Tenki GitHub App installed       | **NOT YET** — manual step for Sam  |
| `@tenki-reviewer` invited        | **NOT YET** — manual step for Sam  |
| Activation PR opened             | **NOT YET** — see [PR description below](#pr-description-ready-for-tenki-review) |
| First Tenki review received      | Awaiting PR-open trigger            |

---

## Idempotency

Re-running any of these scripts is a no-op when the keys are unchanged:

- `scripts/extract-sample.ts` (deterministic fallback for lease extraction)
- `scripts/test-giotto.ts`
- `scripts/test-giotto-integration.ts`
- `scripts/test-all-partners.ts`

These are safe to re-run in any order without rate-limit concerns.

---

## PR description (ready for Tenki review)

Copy-paste-ready body for the activation PR. Sam can create a PR with
this body via:

```powershell
git checkout -b feat/activate-partners
git push origin feat/activate-partners
# then open the PR via gh CLI or github.com
```

```markdown
## feat(activate): live partner integration — 6 keys wired, sample outputs captured

### What this PR does
Live activation of the 6 partner integrations for Future Caribbean Buildathon.

### Live outputs (commit-attached artefacts)
- `project/demo/nebius-extraction.giotto.json` — Giotto.ai live extraction test
- `project/demo/nebius-extraction.live.json` — Nebius DeepSeek-R1 title audit (live)
- `memory/2026-08-11-ollygarden-sample.json` — OllyGarden OTLP span sample
- `memory/2026-08-11-minimax-test.json` — MiniMax "hello from FreeLeased" transcript
- `memory/2026-08-11-nebius-promo.md` — promo-code log for manual redemption
- `docs/tenki-activation.md` — Tenki invite / activation procedure
- `docs/tenki-workflow.md` — updated to mark Tenki as ACTIVE-PROCEDURE

### New / changed files
- `scripts/activate-giotto-live.ts` — live Giotto extraction script
- `scripts/activate-nebius-live.py` — live Nebius title-audit script
- `scripts/activate-ollygarden-live.py` — live OTLP span emitter
- `scripts/activate-minimax-live.ts` — live MiniMax test probe

### Health status before this PR
```
health:  green
reconcile-docs: 10/10
test count:    (see commits)
```

### Health status after this PR
```
health:  green (all live keys wired)
reconcile-docs: 10/10 (unchanged)
test count:    unchanged — see AI_JOURNAL.md for delta
```

### @tenki-reviewer
This is the activation PR for your first review run. Please:
1. Confirm the new `scripts/activate-*.{ts,py}` scripts follow the
   single-source-of-truth pattern (no raw fetch outside the wrappers).
2. Confirm the OTLP envelope is correct (see OTLP/HTTP JSON spec).
3. Flag any rate-limit / retry concerns on the Nebius DeepSeek-R1 path.
4. Confirm the masked-secret pattern (first 4 + `***`) is consistent
   across all scripts.

Thanks Tenki! We're ready for the first review. ⚡
```

---

## Related docs

- [`docs/tenki-workflow.md`](tenki-workflow.md) — Tenki day-to-day workflow (updated 2026-08-11 to mark activation procedure status)
- [`docs/ollygarden-integration.md`](ollygarden-integration.md) — OllyGarden wire-in (canonical)
- [`src/core/title_agent.py`](../src/core/title_agent.py) — Nebius DeepSeek-R1 wrapper
- [`src/lib/giotto.ts`](../src/lib/giotto.ts) — Giotto.ai wrapper
- [`src/lib/minimax.ts`](../src/lib/minimax.ts) — MiniMax wrapper
- [`src/core/ollygarden_observability.py`](../src/core/ollygarden_observability.py) — OllyGarden OTLP wire-in
