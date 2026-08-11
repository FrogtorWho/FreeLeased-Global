# Tenki PR-Reviewer — Operating Manual

> **Owner:** Sam Peacock (PR author) · **Agent:** code/reviewer · **Drafted:** 2026-08-11
> **Status:** Configuration live, no Tenki reviews performed yet. Workflow
> is **advisory only** — never blocks a merge.
>
> **Cross-reference:** [`project/strategy/all-partners-brainstorm.md`](../project/strategy/all-partners-brainstorm.md:1) (Idea #11 + #14 + #16 + #20)

---

## 0. Why this exists

The Buildathon grants more than GPU and tokens — it grants *optionality*.
Tenki is the AI code-review perk. This file documents how Tenki is wired
into the repo so that:

1. Every PR gets a rubric-axis-aware pre-mortem pass.
2. Every PR touching `custom-routes.ts` gets a PII / secret scan.
3. Conventional-Commit titles are enforced as a soft rule.
4. No merge is ever blocked by Tenki being absent, slow, or failing.

---

## 1. Configuration file

The contract lives at [`.github/tenki.yml`](../.github/tenki.yml:1). It
is **not** a GitHub Actions workflow — Tenki is its own AI review
service. The file documents what Tenki should do when the bot account
is connected.

Key sections:

- `triggers` — when Tenki runs (PR opened / synchronize / reopened,
  weekly Monday digest, manual `/tenki review`).
- `review.include` / `review.exclude` — which paths Tenki looks at.
  Auto-generated files (`src/generated/**`, lockfiles) are excluded.
- `pre_mortem` — rubric-axis pre-mortem for every PR.
- `commit_lint` — Conventional-Commit enforcement, advisory only.
- `security.pii_scan` / `security.secret_scan` — extra scrutiny on
  `custom-routes.ts` and any secret-pattern-bearing file.
- `tone` — UK English, no AI tells, ≤ 200 words per comment.
- `fallback` — **never blocks merge** under any condition.

---

## 2. Operating procedure

### 2.1 When you open a PR

Tenki (once connected) will:

1. Comment with a rubric-axis pre-mortem summary (which Buildathon axes
   the PR moves, and by how much).
2. Run a Conventional-Commit title check. If the title uses an
   unrecognised type, the comment says so — but the merge is unaffected.
3. Scan `custom-routes.ts` and other public-surface files for PII /
   secret patterns. If anything matches, the comment points to the
   exact line.
4. Score the PR's contribution to B1/B2/B3/B4/C1/C2 axes (advisory).

### 2.2 When Tenki is absent / failing

Nothing changes. The merge gate is the existing `required_checks` +
Sam's approval. Tenki is **never** the merge gate.

### 2.3 Weekly digest (Monday 09:00 UTC)

The `schedule` trigger fires a weekly digest summarising the top 10
PRs by rubric-axis impact over the past 7 days. Output lives at
`memory/tenki-weekly-digest.md`. With no Tenki connection, the digest
is a no-op.

### 2.4 Manual review

You can ask Tenki to re-review at any time:

```text
/tenki review
```

in any PR comment. Tenki replies within ~30 seconds.

---

## 3. Rubric-axis mapping

Tenki's pre-mortem maps each PR to one of six Buildathon axes:

| Axis | What Tenki looks for |
|------|----------------------|
| **B1 Team Quality** | New contributor docs, CODEOWNERS updates, mentorship artefacts |
| **B2 Innovation** | Novel integration patterns, dual-LLM redundancy, new external APIs |
| **B3 PMF** | Jurisdiction expansion, MoU mentions, pilot-plan artefacts |
| **B4 Tech Depth** | Test coverage, type-safety, observability, no-key fallbacks |
| **C1 AI Capability** | New model integrations, prompt engineering, evaluator work |
| **C2 Responsible AI** | Citation safety, evidence-class discipline, PII/secret scan, HITL |

The mapping is **advisory** — it tells you which axes the PR most
plausibly lifts, but the score itself is a self-rubric claim in
[`project/strategy/self-rubric-score.md`](../project/strategy/self-rubric-score.md:1).

---

## 4. Fallback contract (mandatory)

This is the most important section. Read it twice.

> **Tenki is never the merge gate.** If Tenki is absent, slow,
> returning errors, or not yet connected, every PR merges on the
> existing `required_checks` rules plus Sam's approval. No exception.

This contract is what makes the workflow honest. The team can operate
without Tenki for the entire Buildathon and lose nothing except an
advisory signal.

---

## 5. How to enable Tenki in production

When the Tenki bot account is provisioned:

1. Install the Tenki GitHub App on this repository.
2. Confirm [`.github/tenki.yml`](../.github/tenki.yml:1) is in place
   (already done as of 2026-08-11).
3. Trigger a manual `/tenki review` on a test PR to confirm the bot
   responds.
4. Verify the weekly digest lands in `memory/tenki-weekly-digest.md`.

If any of those steps fails, the fallback contract kicks in and
nothing breaks.

---

## 6. Honest disclosure

- As of 2026-08-11, **no live Tenki review has been performed in this
  repository**. The configuration file is the entire deliverable.
- We claim no rubric-axis lift from Tenki at this time. Future PRs
  will reference Tenki's actual review comments when they exist.
- The "weekly digest" path is documented but not running. Sam will be
  notified when the digest lands.

---

*Manual written 2026-08-11. Reversible by deleting the file. Honest.*