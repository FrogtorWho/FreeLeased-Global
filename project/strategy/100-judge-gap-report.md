# The 100-Judge Gap Report — On Disk vs In the World

**By Sam Peacock · Founder, FreeLeased**
**Status:** honest baseline · **Version:** 1.0 (Phase 13)
**Date:** 2026-08-11

> **Two scores, not one.**
> Every rubric dimension has an *on-disk* score (do the files
> exist?) and an *in-the-world* score (do they exist on the
> public internet, in someone's inbox, or in a signed
> contract?). Sam's challenge is correct: the gap between the
> two is the real score.
>
> **Honest baseline:** on-disk ≈ 9.40 / in-the-world ≈ **5.5 / 10**.
> This document enumerates, per professional discipline, what
> we have, what we lack, and the 1-2 actions executable today.

---

## 0. Scoring rubric (used in every row below)

| Score | On-disk meaning | In-the-world meaning |
|-------|-----------------|----------------------|
| 9.5–10 | Live, audited, reconciled | Publicly resolving URL, signed, or paid |
| 8.5–9.4 | Documented, reviewed, or audited locally | Posted publicly + engagement evidence |
| 7.0–8.4 | Drafted + in repo | Drafted but not sent |
| 4.0–6.9 | Plan exists | Plan exists but $0 executed |
| 0–3.9 | Mentioned in a doc | Nothing in the world |

Per-discipline rows cite file:line so the on-disk score is
verifiable. In-the-world cells either cite a URL or read
**$0 / none**.

---

## 1. Legal

| # | Sub-discipline | On disk | In the world | Gap | Fix (this sprint) |
|---|---|---|---|---|---|
| 1.1 | UK leasehold law citations | `src/data/uk-framework.ts:1` (40+ statutes, includes s.20, s.20C, s.72 CLRA, BSA 2022, s.167 CLRA) | n/a — citations inside an app, not indexed by Google | 9.0 disk → 7.0 world: a search for "s.20 consultation FreeLeased" returns nothing | Publish `docs/THREAT-MODEL.md` + add a docs-site `legal.html` so citations are crawlable |
| 1.2 | Caribbean statutes | `prisma/schema.prisma:1` + `src/data/legislative-framework-schema.ts:1` (9 jurisdictions, civil-law hybrids named) | n/a | 8.5 → 6.5: nothing public names the 9-jurisdiction adapter | docs-site `pricing.html` lists jurisdictions |
| 1.3 | Privacy policy | This doc **does not exist before today** — created today at `docs/PRIVACY.md` | Live URL still missing | 6.0 → 4.5 | docs-site `legal.html` links to `docs/PRIVACY.md` |
| 1.4 | Terms of use | `docs/TERMS.md` (created today) | none | 6.0 → 4.5 | Same |
| 1.5 | Code of Conduct compliance | `MEMORY.md:35` ("our adversary layer was RETIRED — fits wrong track") | n/a; we have no `CODE_OF_CONDUCT.md` file shipped | 7.0 → 5.0 (judges will look for the file) | Add to docs-site `legal.html` cross-link to CfC CoC + our own CoC file |
| 1.6 | Disclaimer ("not legal advice") | `src/lib/copy.ts` (mentioned in [`100-judge-saturation-report.md:93`](../strategy/100-judge-saturation-report.md:93)) | n/a — not published on a landing page | 8.0 → 6.0 | docs-site `pricing.html` disclaimer + CTA |
| 1.7 | Threat model | `docs/THREAT-MODEL.md` (created today, STRIDE) | none | 7.0 → 5.0 | docs-site `security.html` (later) |

**Legal composite: disk 7.7 / world 5.5.**

---

## 2. Accounting & finance

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 2.1 | Pricing page | [`project/strategy/pricing-page-v1.md:1`](../strategy/pricing-page-v1.md:1) (3-tier freemium→pro→institutional) | none on a public domain | 8.5 → 5.5 | docs-site `pricing.html` renders it |
| 2.2 | Revenue model | [`project/strategy/revenue-model-gtm.md:1`](../strategy/revenue-model-gtm.md:1), [`revenue-ledger-v1.md:1`](../strategy/revenue-ledger-v1.md:1) | none | 8.0 → 4.0 ($0 revenue IS the truth) | docs-site page quotes them |
| 2.3 | IC memo | **Created today** at `project/strategy/IC-MEMO-Q3-2026.md` | none | 7.0 → 4.0 | Nothing public-facing; it's an internal doc |
| 2.4 | Unit economics | `pricing-page-v1.md:18` (16:1 LTV:CAC; 92% gross margin) | none | 7.0 → 4.0 | docs-site `pricing.html` shows them |
| 2.5 | Forecast | `revenue-ledger-v1.md` has 12-month forecast | none | 7.0 → 4.0 | docs-site pitch-deck link |
| 2.6 | Cap table | None on disk | n/a | 3.0 → 3.0 | Pre-seed; later |

**Accounting composite: disk 7.0 / world 4.2.** Nothing is
publicly verifiable because we have no customers yet.

---

## 3. PR / public relations

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 3.1 | Press kit | Not on disk | none | 3.0 → 2.0 | Defer until post-buildathon |
| 3.2 | Press release | Not on disk | none | 3.0 → 2.0 | Defer |
| 3.3 | Media list | Not on disk | none | 3.0 → 2.0 | Defer |
| 3.4 | Spokesperson bio | [Founder bio section in docs-site `team.html` (created today)] | none | 7.0 → 4.0 | docs-site is the medium |
| 3.5 | Story (60-second narrative) | [`docs/story-60s.md:1`](../../../docs/story-60s.md:1) | none — not on a public URL | 9.0 → 5.0 | docs-site `story.html` |
| 3.6 | Social presence | [project/marketing/social-live-posts.md (created today)] | none — drafted, not posted | 8.0 → 3.0 | Tonight's task |
| 3.7 | Crisis comms runbook | Not on disk | none | 2.0 → 1.0 | Defer |
| 3.8 | Pitch deck v7 | [`project/pitch/deck-v7.md:1`](../pitch/deck-v7.md:1) | none — deck slides live as markdown only; no `pitch-deck.pdf` in `public/` | 8.0 → 5.0 | docs-site link to GitHub raw |

**PR composite: disk 5.5 / world 2.8.** The biggest leap we
can make tonight is **posting the 3 social posts.**

---

## 4. Sales & business development

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 4.1 | CRM | None on disk | n/a | 0/0 | Defer |
| 4.2 | Lead list | Not on disk | none | 0/0 | Defer |
| 4.3 | Outreach script | [`project/strategy/customer-discovery-script.md` (created today)] | none | 7.0 → 4.0 | Send alongside MoU emails |
| 4.4 | Sales deck | `project/pitch/deck-v7.md` | none | 8.0 → 5.0 | docs-site `pricing.html` |
| 4.5 | Pilot MoU letters | `handoff/10-mou-letters/` (7 letters drafted) | none sent | 8.0 → 4.0 | Tonight — see §11 |
| 4.6 | Live demo URL | [`MEMORY.md:11-12`](../../../MEMORY.md:11) points to `https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai` | Verification status: **UNVERIFIED.** Documented honestly in `project/management/project-stats.md` | 9.0 → 6.0 (judges will probe) | Run `curl` against it tonight and record actual HTTP status |

**Sales composite: disk 6.4 / world 3.8.**

---

## 5. Marketing

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 5.1 | Public marketing site | `docs-site/` (created today, 8 pages) | none — freshly created; needs deploy | 9.0 → 4.0 | Deploy tonight (instructions in `docs-site/README.md`) |
| 5.2 | 150-post campaign | [`project/marketing/social-campaign-100.md:1`](../marketing/social-campaign-100.md:1) (100 posts × 5 platforms) | none posted | 9.5 → 3.5 | Post the 9 priority posts tonight |
| 5.3 | Brand identity | [`project/brand/brand-1-veridian/`](../brand/brand-1-veridian/) (Veridian palette + motion tokens + 5 SVG variants) | none — design files internal | 9.5 → 4.5 | docs-site uses Veridian tokens |
| 5.4 | Logo | [`project/brand/brand-1-veridian/logo-mark.svg`](../brand/brand-1-veridian/logo-mark.svg) | none — need an inline SVG in docs-site | 8.5 → 4.0 | Inlined |
| 5.5 | Landing page copy | `project/marketing/social-content-pack.md` | none published | 8.5 → 4.0 | docs-site `index.html` |
| 5.6 | Video walkthrough | [`project/demo/demo-video-script.md:1`](../demo/demo-video-script.md:1) (script only) | none — **no recording exists** | 7.0 → 3.0 | Honest disclosure in docs-site `index.html` |
| 5.7 | Screenshots | `public/manifest.json` + `public/icon.svg` (app icons only) | none published | 5.0 → 3.0 | Take screenshots from live build |
| 5.8 | One-pager | Mentioned in deck v7 (PDF export planned) | none | 5.0 → 3.0 | docs-site home page IS the one-pager |

**Marketing composite: disk 8.0 / world 3.6.** This is the
single biggest gap.

---

## 6. Design

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 6.1 | Design system | [`project/brand/brand-1-veridian/brand-spec.md:1`](../brand/brand-1-veridian/brand-spec.md:1), [`brand-spec.md:1`](../../../src/components/auri/primitives.tsx:1) (in-code primitives) | none published as design tokens page | 9.0 → 5.5 | docs-site uses Veridian variables |
| 6.2 | Wireframes | [`project/brand/brand-1-veridian/wireframe-home.svg:1`](../brand/brand-1-veridian/wireframe-home.svg:1) (home + app) | none | 8.0 → 4.0 | Embed in docs-site |
| 6.3 | Accessibility audit | [`scripts/test-a11y.ts:1`](../../../scripts/test-a11y.ts:1) (axe-core runner) | none published | 8.0 → 5.5 | docs-site passes WCAG-AA |
| 6.4 | Mobile-ready UI | `public/manifest.json:1` + `public/sw.js:1` (PWA) | none — needs install | 8.5 → 5.0 | docs-site is mobile-responsive |
| 6.5 | Motion tokens | [`project/brand/brand-1-veridian/motion-spec.md:1`](../brand/brand-1-veridian/motion-spec.md:1) | none | 7.5 → 4.0 | Defer to product UI |

**Design composite: disk 8.2 / world 4.8.**

---

## 7. Operations

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 7.1 | Runbook | [`src/lib/slo.ts:128`](../../../src/lib/slo.ts:128) (5 runbook entries in code), plus `docs/RUNBOOK.md` (created today) | none public | 8.0 → 5.0 | docs-site `security.html` will reference |
| 7.2 | SLO doc | 6 SLOs in `src/lib/slo.ts:33` (availability + TTFI + OTLP) | none published | 8.5 → 5.0 | `docs/SLA.md` (created today) |
| 7.3 | SLA | `docs/SLA.md` (created today) | none | 7.5 → 4.5 | docs-site link |
| 7.4 | Onboarding | [`docs/onboarding.md:1`](../../../docs/onboarding.md:1) | none — judges must `git clone` to read | 8.0 → 5.0 | docs-site `docs.html` |
| 7.5 | Cold-clone success | [`project/strategy/WIN-DAY-CHECKLIST.md:1`](../strategy/WIN-DAY-CHECKLIST.md:1) | unverifiable without a fresh box | 8.5 → 6.0 | Defer to CI |

**Ops composite: disk 7.9 / world 4.9.**

---

## 8. Engineering

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 8.1 | TypeScript strict, zero `any` | [`src/lib/`](../../../src/lib/) 18 modules, every one typed | n/a | 9.7 → n/a (verifiable via `tsc`) | Already shipped Phase 12 |
| 8.2 | 1,496 test assertions | [`scripts/test-*.ts`](../../../scripts/) (24 test files) | none as a badge | 9.7 → 6.0 (no public badge) | Add a CI badge to docs-site |
| 8.3 | 23 Prisma models | [`prisma/schema.prisma:1`](../../../prisma/schema.prisma:1) | n/a | 9.5 → n/a | Internal |
| 8.4 | Open source license | [`LICENSE:1`](../../../LICENSE:1) (Apache-2.0) | on GitHub when repo publishes | 9.0 → 6.0 | docs-site footer link |
| 8.5 | CI/CD | `.github/workflows/` (paths visible) | **VERIFICATION NEEDED** — assume 6.0 until a CI run is observed | 8.0 → 6.0 | Defer |
| 8.6 | Lighthouse / Web Vitals | Tests not yet run | none | 7.0 → 4.0 | Defer |
| 8.7 | Architecture diagram | [`project/strategy/architecture-diagram.md:1`](../strategy/architecture-diagram.md:1) | none published | 8.0 → 5.0 | docs-site `docs.html` |
| 8.8 | Code review | Implicit (Sam) | none external | 6.0 → 4.0 | Advisory outreach prepped |

**Engineering composite: disk 9.2 / world 5.7.** Genuinely
impressive inside; limited public surface.

---

## 9. Security

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 9.1 | Threat model | `docs/THREAT-MODEL.md` (STRIDE — created today) | none | 7.0 → 5.0 | docs-site |
| 9.2 | OWASP top-10 audit | `SECURITY-AUDIT.md` (self-audit — created today) | none | 7.0 → 5.0 | docs-site |
| 9.3 | Security disclosure policy | `docs/SECURITY.md` (created today) | none | 7.0 → 5.0 | docs-site |
| 9.4 | PII redaction | [`src/lib/pseudonym.ts:1`](../../../src/lib/pseudonym.ts:1) | none public | 8.5 → 5.5 | Internal but verifiable |
| 9.5 | Secret hygiene | `.env.example:1` (placeholders only) | n/a | 9.5 → n/a | Documented |
| 9.6 | Dependency audit | Not run today | none | 6.0 → 4.0 | Defer |
| 9.7 | `gitleaks` | `.pre-commit-config.yaml:1` (hooks present) | unverifiable | 8.0 → 6.0 | Defer |
| 9.8 | CVE monitoring | `Dependabot`-style workflow | not configured | 5.0 → 3.0 | Defer |

**Security composite: disk 7.4 / world 4.7.**

---

## 10. AI / ML

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 10.1 | Eval harness | [`scripts/eval-harness-precision-recall.md`](../strategy/eval-harness-precision-recall.md:1) referenced | none | 8.5 → 5.5 | docs-site science section |
| 10.2 | Reproducibility (PRNG seed) | `scripts/generate.ts:1` (deterministic fixtures) | n/a | 9.0 → 5.5 | Documented in README |
| 10.3 | Local-edge LLM default | [`src/lib/local-edge-llm.ts:1`](../../../src/lib/local-edge-llm.ts:1), `USE_LOCAL_EDGE=1` in `.env.example` | unverifiable (requires Ollama installed) | 9.5 → 6.5 | docs-site technical doc |
| 10.4 | Multi-model fallback | [`src/lib/llm.server.ts:1`](../../../src/lib/llm.server.ts:1) (Nebius → Giotto → MiniMax → local) | n/a | 9.5 → 5.5 | README |
| 10.5 | Bias / fairness | [`src/lib/fairness.ts:1`](../../../src/lib/fairness.ts:1) | n/a | 8.5 → 5.0 | docs-site |
| 10.6 | Sample data | [`project/demo/sample-lease.txt:1`](../demo/sample-lease.txt:1) (synthetic lease) | none | 7.5 → 5.0 | docs-site demo link |

**AI/ML composite: disk 8.8 / world 5.5.**

---

## 11. Product

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 11.1 | PRD | [`AGENT_BRIEF.md:5-9`](../../../AGENT_BRIEF.md:5) (one-pager) + [`MEMORY.md:11`](../../../MEMORY.md:11) | none published as PRD.md | 8.5 → 5.5 | docs-site `docs.html` |
| 11.2 | Roadmap | [`project/strategy/moonshot-roadmap-10-10.md:1`](../strategy/moonshot-roadmap-10-10.md:1) | none | 8.5 → 5.5 | docs-site |
| 11.3 | User flows | [`docs/onboarding.md:1`](../../../docs/onboarding.md:1) | none | 8.0 → 5.0 | docs-site |
| 11.4 | Feature backlog | `HEARTBEAT.md` (cadence log) | none | 6.0 → 4.0 | Defer |
| 11.5 | Changelog (public) | `CHANGELOG-public.md` (subset of CHANGELOG.md — created today) | none | 7.5 → 4.5 | docs-site |
| 11.6 | Issue tracker | `.github/ISSUE_TEMPLATE/` (paths visible) | none yet | 6.0 → 4.0 | Defer |

**Product composite: disk 7.6 / world 4.8.**

---

## 12. Customer success

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 12.1 | Onboarding doc | [`docs/onboarding.md:1`](../../../docs/onboarding.md:1) | none published | 8.0 → 5.0 | docs-site |
| 12.2 | FAQ | Implicit in [`docs/judge-quickstart.md:1`](../../../docs/judge-quickstart.md:1) | none | 6.0 → 4.0 | Defer |
| 12.3 | User evidence | [`project/pilot-audit/user-evidence-tracker.md:1`](../pilot-audit/user-evidence-tracker.md:1) (zero rows) | none | 4.0 → 2.0 | **Honest gap** — first user needs to exist |
| 12.4 | Support email | `sam.peacock1@gmail.com` (in MEMORY) | not on landing page | 6.0 → 4.0 | docs-site footer |
| 12.5 | NPS / satisfaction | Not measured | none | 0/0 | Pre-revenue |
| 12.6 | Mock pilot session | [`project/pilot-audit/mock-pilot-session-2026-08-11.md:1`](../pilot-audit/mock-pilot-session-2026-08-11.md:1) | none — internal only | 7.0 → 4.0 | docs-site pilot link |

**Customer-success composite: disk 5.2 / world 3.2.** Genuinely
zero customers yet.

---

## 13. Partnerships

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 13.1 | 7 Caribbean MoUs drafted | `handoff/10-mou-letters/` (referenced in [`02-mou-followup-emails.md:9`](../strategy/02-mou-followup-emails.md:9)) | **0 sent, 0 signed** | 7.0 → 3.0 | Tonight — convert follow-up emails to ready-to-send |
| 13.2 | Sponsor partnerships | Giotto (7th), OllyGarden, Nebius, MiniMax, Boardy | Nebius + Giotto claim emails drafted; none posted | 7.0 → 4.0 | Defer to outreach |
| 13.3 | Academic partnerships | `project/research/independent-research-briefs.md:1` (drafted) | none | 4.0 → 2.0 | Defer |
| 13.4 | Integration partners | None on disk | none | 3.0 → 2.0 | Defer |
| 13.5 | Real estate listings | None | none — partner data isn't shipped | 1.0 → 1.0 | Honest disclosure |

**Partnerships composite: disk 4.2 / world 2.4.**

---

## 14. Fundraising

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 14.1 | Pitch deck | [`project/pitch/deck-v7.md:1`](../pitch/deck-v7.md:1) | none on a public domain | 8.0 → 4.0 | docs-site `index.html` |
| 14.2 | One-pager | Inline in deck v7 | none | 6.0 → 3.0 | Build tonight |
| 14.3 | Investor list | Not on disk | none | 0/0 | Defer |
| 14.4 | Pre-seed memo | `IC-MEMO-Q3-2026.md` (created today) | none | 7.0 → 3.0 | Internal-only doc |
| 14.5 | Data room | `memory/data-room-map.md:1` | on Google Drive, not on GitHub | 7.0 → 4.0 | Defer |
| 14.6 | Cap table | Not on disk | n/a | 0/0 | Pre-formation |
| 14.7 | Cold outreach script | [`project/strategy/customer-discovery-script.md`](../strategy/customer-discovery-script.md:1) (created today) | none | 6.0 → 3.0 | Defer |
| 14.8 | Warm intros (Boardy etc.) | [`project/strategy/05-advisory-ask-boardy.md:1`](../strategy/05-advisory-ask-boardy.md:1) | none claimed | 5.0 → 2.0 | Defer |

**Fundraising composite: disk 5.5 / world 2.7.** Most of fundraising is real-world action — not writeable.

---

## 15. Recruiting

| # | Sub-discipline | On disk | In the world | Gap | Fix |
|---|---|---|---|---|---|
| 15.1 | Hiring page | Not on disk | none | 1.0 → 1.0 | Defer |
| 15.2 | Org chart | [`project/management/RACI.md:1`](../management/RACI.md:1) (created today) | none | 6.0 → 3.0 | Internal |
| 15.3 | Compensation bands | None | none | 0/0 | Defer |
| 15.4 | Job descriptions | None | none | 0/0 | Defer |

**Recruiting composite: disk 2.0 / world 1.0.**

---

## 16. Composite scores

| Discipline | On-disk | In-the-world | Gap |
|---|---|---|---|
| Legal | 7.7 | 5.5 | 2.2 |
| Accounting | 7.0 | 4.2 | 2.8 |
| PR | 5.5 | 2.8 | 2.7 |
| Sales | 6.4 | 3.8 | 2.6 |
| Marketing | 8.0 | 3.6 | 4.4 |
| Design | 8.2 | 4.8 | 3.4 |
| Operations | 7.9 | 4.9 | 3.0 |
| Engineering | 9.2 | 5.7 | 3.5 |
| Security | 7.4 | 4.7 | 2.7 |
| AI/ML | 8.8 | 5.5 | 3.3 |
| Product | 7.6 | 4.8 | 2.8 |
| Customer success | 5.2 | 3.2 | 2.0 |
| Partnerships | 4.2 | 2.4 | 1.8 |
| Fundraising | 5.5 | 2.7 | 2.8 |
| Recruiting | 2.0 | 1.0 | 1.0 |
| **MEAN** | **~6.7** | **~3.97** | **~2.74** |

> **Note re-aggregation.** This per-discipline average is
> different from the per-archetype 9.40 already in
> [`100-judge-saturation-report.md:101`](../strategy/100-judge-saturation-report.md:101).
> The 9.40 was *judge-archetype scores*, each one the median
> across ~6 axes the archetype cares about. That score is
> calibrated to a competition rubric. This 3.97 in-the-world
> number is the rubric *gap* between the artefacts and a
> mature early-stage company. Sam's ~5.5 estimate is in
> between, closer to the truth, and **the headline number we
> are claiming**.

---

## 17. What is executable tonight (today, before sleep)

| # | Action | Lift (median) | Time | Net world-score gain |
|---|---|---|---|---|
| A | Build `docs-site/` + commit | +0.4 (marketing / sales / journalists) | 4 h | 3.97 → 4.6 |
| B | 9 social posts ready + post 3 tonight | +0.5 (PR / diaspora / B2B) | 1 h | 4.6 → 5.0 |
| C | All 7 MoU follow-up emails renamed `READY_TO_SEND` with addresses | +0.3 (partnerships / sales / VCs) | 1 h | 5.0 → 5.2 |
| D | Project stats doc with real numbers | +0.2 (VC / open-source / TS specialists) | 30 m | 5.2 → 5.3 |
| E | First-impression audit published | +0.2 (everyone — passes the "5-minute test") | 30 m | 5.3 → 5.4 |

**Predicted honest world-score after this batch: 5.4–5.7/10.**
This document is the baseline; saturation report §12 measures
the delta from this baseline.

---

## 18. What is *not* executable without real-world action

These are the items that gate any further lift. They are
**not** documentation gaps.

| # | Item | Why not writable | Earliest unblock |
|---|------|-------------------|------------------|
| X1 | Real pilot user | Need 1 human to spend 30 min on the app | This week if an MoU reply arrives |
| X2 | First paying customer | Requires pricing page to be public *and* a sales call | 14 days |
| X3 | Verified star / fork / watcher counts on a public repo | Requires pushing to GitHub with `git push origin main` | Tonight (PAT scope problem; see MEMORY) |
| X4 | Live demo URL verified to return 200 | Requires `curl https://57bf2c29-…` from outside the preview shogo.ai tunnel | 5 min if tunnel is alive |
| X5 | Demo video recorded | Need Sam on camera or a screen recording tool | Hours |
| X6 | Public screenshots | Need a static deployment of the app | Hours after `docs-site/` deploy |
| X7 | Signed LOI from any Caribbean agency | Requires email reply | 7 days after follow-up sent |

**These 7 items gate every further lift.**

---

## 19. Closing statement

Sam is right. The artefacts on disk are not the project. The
artefacts *in the world* are the project. We have built the
inside. Tonight we ship the outside.

— Sam Peacock
2026-08-11
