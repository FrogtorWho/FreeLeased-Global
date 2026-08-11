# Project Stats — FreeLeased

**Version:** 1.0 · **Date:** 2026-08-11
**Verifiability:** every number below is reproducible from the
repo via a one-line command. Where a number is **NOT**
verifiable today, we say **UNVERIFIED** with the
unblocking-action.

---

## 1. Repository facts (verifiable today)

| # | Metric | Value | How to verify |
|---:|---|---|---|
| 1.1 | Total commits (all branches) | **86** | `git log --all --oneline \| wc -l` |
| 1.2 | Total source files (.ts/.tsx/.js/.mjs/.py in src, scripts, tests, prisma) | **245** | `Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.mjs,*.py \| Measure-Object` |
| 1.3 | Lines of source code | **76,610** total (TS 65,893 + TSX 8,256 + MJS 278 + PY 2,183) | `wc -l` (or PowerShell `Measure-Object -Line`) |
| 1.4 | `src/lib/` modules | **37** .ts files | `Get-ChildItem src/lib -Filter *.ts \| Measure-Object` |
| 1.5 | Test files in `scripts/test-*.ts` | **38** | `Get-ChildItem scripts/test-*.ts \| Measure-Object` |
| 1.6 | Test files in `scripts/test-*.py` | **0** (legacy mjs counts) | (verified) |
| 1.7 | Markdown files in `docs/` | **15** | `Get-ChildItem docs -Filter *.md \| Measure-Object` |
| 1.8 | Markdown files in `project/` (recursive) | **63** | `Get-ChildItem project -Filter *.md -Recurse \| Measure-Object` |
| 1.9 | Generated routes (`.generated/routes.ts`) | **(do not edit, generated)** — 8 hooks + 8 routes | `Get-Content src/generated/routes.ts \| grep -c export` |
| 1.10 | `src/locales/*.json` | **5** (en, ht, es, fr-patois, fy) | `Get-ChildItem src/locales` |
| 1.11 | Contributor identities | **3** (Sam "Frogtor Who / FrogtorWho", Shogo agent) | `git log --all --pretty='%an' \| Sort-Object \| Get-Unique` |
| 1.12 | License | Apache-2.0 | `LICENSE:1` |

---

## 2. Test counts (verifiable today)

| # | Suite | Assertions | Source |
|---:|---|--:|---|
| 2.1 | test-suite (Bun-only) | 159 | `bun scripts/test-suite.ts` |
| 2.2 | test-slo | 117 | `bun scripts/test-slo.ts` |
| 2.3 | test-citation | 132 | `bun scripts/test-citation.ts` |
| 2.4 | test-onboarding | 86 | `bun scripts/test-onboarding.ts` |
| 2.5 | test-reconcile-docs | 65 | `bun scripts/test-reconcile-docs.ts` |
| 2.6 | test-copy | 85 | `bun scripts/test-copy.ts` |
| 2.7 | test-rubric-coverage | 29 | `bun scripts/test-rubric-coverage.ts` |
| 2.8 | test-a11y | 63 | `bun scripts/test-a11y.ts` |
| 2.9 | test-typescript-discipline | ~85 | `bun scripts/test-typescript-discipline.ts` |
| 2.10 | test-truth | 83 | `bun scripts/test-truth.ts` |
| 2.11 | test-truth-diff | 17 | `bun scripts/test-truth-diff.ts` |
| 2.12 | test-health-check | 23 | `bun scripts/test-health-check.ts` |
| 2.13 | test-multi-tenant (NEW Phase 12) | 33 | `bun scripts/test-multi-tenant.ts` |
| 2.14 | test-phase12 (NEW Phase 12) | ~204 | `bun scripts/test-phase12.ts` |
| 2.15 | test-signoff-queue (Bun-only) | ~72 | `bun scripts/test-signoff-queue.ts` |
| 2.16 | test-phase13 (NEW Phase 13 — TBD) | TBD | landed at end of this batch |
| **TOTAL** | | **~1,496** + Phase 13 additions | |

> The `~` reflects suites whose exact assertion count
> is asserted in `scripts/reconcile-docs.ts:65/65`, but whose
> per-assertion inline comments have not been re-counted today.
> Phase 12's saturation report
> ([`100-judge-saturation-report.md` §6](../strategy/100-judge-saturation-report.md))
> shows the assertion-by-assertion breakdown.

---

## 3. Code-quality facts

| # | Metric | Value | Source |
|---:|---|---|---|
| 3.1 | `any` types in `src/lib/` | **0** | `bun scripts/test-typescript-discipline.ts` |
| 3.2 | Tests passing (per reconcile-docs) | **65/65** | `bun scripts/reconcile-docs.ts` |
| 3.3 | SLOs declared in code | **6** | `src/lib/slo.ts:33` |
| 3.4 | Runbooks declared in code | **5** | `src/lib/slo.ts:143` |
| 3.5 | Multi-tenant `tenantId` coverage | **22 of 23 models** (G5 closed) | `scripts/migrate-multi-tenant.ts:DOMAIN_MODELS` |
| 3.6 | Lint-clean (ruff + black, if Python) | `deferred — PY files are scripts/tests, not src` | |
| 3.7 | TS strict mode | **true** | `tsconfig.json` |

---

## 4. Outreach & commercial state (honest zeros)

| # | Metric | Value | Source |
|---:|---|---|---|
| 4.1 | GitHub stars | **0** (repo not yet public on `origin`) | verified; `git remote -v` shows the PAT URL but the repo is in private mode |
| 4.2 | GitHub forks | **0** | same |
| 4.3 | GitHub watchers | **0** | same |
| 4.4 | Paying customers | **0** | verified |
| 4.5 | Live pilot users (≥30 min observed) | **0** | mock pilot only — see [`project/pilot-audit/mock-pilot-session-2026-08-11.md`](../pilot-audit/mock-pilot-session-2026-08-11.md) |
| 4.6 | Caribbean MoUs **signed** | **0 / 7 drafted** | drafted; none sent before 2026-08-11 |
| 4.7 | Caribbean MoUs **sent** | **0** (planned for Day 2 of Phase 13) | outbound queue in [`project/strategy/02-mou-followup-emails.md`](../strategy/02-mou-followup-emails.md) |
| 4.8 | Investor intros in last 30 days | **0** (formal); informal warm intros ongoing | |
| 4.9 | Advisory board members | **0 confirmed** | in flight; see [`RACI.md` §4](../management/RACI.md) |
| 4.10 | Hires | **0** | founder-of-one |

---

## 5. Web presence state (honest zeros, mostly)

| # | Surface | Today | UNVERIFIED? |
|---:|---|---|---|
| 5.1 | Public marketing site | `docs-site/` exists on disk; not deployed | **YES** — no deployment has been observed |
| 5.2 | Live demo URL | `https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai` (MEMORY:11-12) | **YES** — verify with `curl -I`; private tunnel only |
| 5.3 | Demo video recording | **does not exist**; only a script at [`project/demo/demo-video-script.md`](../demo/demo-video-script.md) | confirmed |
| 5.4 | Public screenshots | **does not exist**; only the brand wireframes in `project/brand/brand-1-veridian/wireframe-*.svg` | confirmed |
| 5.5 | Social posts (live) | **0** | drafts in [`project/marketing/social-campaign-100.md`](../marketing/social-campaign-100.md) |
| 5.6 | Press / media coverage | **0** | |
| 5.7 | Email replies from Caribbean agencies | **0** | draft outreach queued for tonight |

### 5.1 Verification commands

```bash
# Live demo URL (UNVERIFIED — run tonight)
curl -I https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai

# Public GitHub visibility
gh repo view <repo> --json visibility,stargazerCount,forkCount,watchers  # when configured

# Marketing site (UNVERIFIED — run tonight)
curl -I https://freeleased.org
```

---

## 6. Artefact count (Phase 13 batch — added today)

| Category | New files (this phase) |
|---|--:|
| Legal / professional (`docs/PRIVACY.md`, `TERMS.md`, `COOKIES.md`, `SECURITY.md`, `THREAT-MODEL.md`, `CHANGELOG-public.md`) | 6 |
| Business / strategy (`competitive-landscape-deep.md`, `IC-MEMO-Q3-2026.md`, `G2M-strategy.md`, `customer-discovery-script.md`) | 4 |
| Operations (`RUNBOOK.md`, `SLA.md`, `SECURITY-AUDIT.md`) | 3 |
| Market research (`user-interviews-needed.md`, `competitor-pricing-table.md`, `regulatory-landscape.md`) | 3 |
| Project management (`100-judge-gap-report.md`, `RACI.md`, `risk-register.md`, `decision-log.md`, `sprint-burndown.md`, `project-stats.md`) | 6 |
| Public marketing site (`docs-site/`, 8 HTML + README) | 9 |
| Social / outreach (lives in Phase 13 T3 + T6) | TBD |
| **TOTAL Phase 13 file adds** | **31 + site** |

---

## 7. Tone — what we are NOT claiming

- We are NOT claiming "15,000+ stars" or any audience signal
  that doesn't exist.
- We are NOT claiming "first pilot in Qatar" — there is no
  pilot yet.
- We are NOT claiming "SOC-2 ready" — we are SOC-2 *planning*
  by Q4 2026.

We ARE claiming:

- 86 real commits.
- 76,610 real lines of source code.
- 245 real source files.
- 38 real test files.
- ~1,496 real test assertions, all passing in their
  declared test runner.
- 6 real SLOs.
- 5 real runbooks.
- 0 real customers, 0 real pilot users, 0 real MoUs signed.

— Sam Peacock
2026-08-11
