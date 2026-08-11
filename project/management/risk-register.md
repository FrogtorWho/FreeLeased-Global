# Risk Register — FreeLeased

**Version:** 1.0 · **Date:** 2026-08-11 · **Review cadence:** monthly

> Each risk is rated **L (Likelihood)** × **I (Impact)** on a
> 1-3 scale. Score = L × I (max 9). Trigger = the early-warning
> signal we'd see before the risk materialised.

---

## 1. Risk table (full)

| ID | Risk | L | I | Score | Owner | Trigger | Mitigation |
|---|---|--:|--:|--:|---|---|---|
| **R-PR-001** | **Founder-single-point-of-failure** | 3 | 3 | 9 | F | Burnout signals (sleep, replies) | Engineer #1 hire; documented runbooks; dual-sign on finance |
| **R-PR-002** | **Pre-seed does not close** | 2 | 3 | 6 | F | No warm intro in 30 days from any VC | Founder salary burn down to £60k floor (single living wage); defer employee hire |
| **R-PR-003** | **First Caribbean MoU does not reply** | 2 | 2 | 4 | F | All 7 emails un-responded by 2026-09-15 | Pivot to UK beachhead; use embassy cold outreach |
| **R-PR-004** | **First paying user does not land in 6 months** | 2 | 3 | 6 | F | Zero Stripe revenue by 2027-02-11 | Drop Pro tier to £6/mo; bundle with Property Ombudsman referrals |
| **R-PR-005** | **Live demo URL inaccessible** | 2 | 3 | 6 | F | `curl` to `*.freeleased.org` returns 5xx | Pre-deploy static mirror on Netlify fallback |
| **R-PR-006** | **CfC Code-of-Conduct challenge** | 1 | 3 | 3 | F | CfC organisers flag a feature | Retire feature; remove in next PR. Already retired adversary layer. |
| **R-LE-001** | **LTA / DLUHC AI regulations tightens** | 2 | 3 | 6 | F | UK Gov publishes "AI for legal-advice" consultation response | HITL gate and counsel-nudge already present; document disclosure |
| **R-LE-002** | **Statutory citation error in production** | 2 | 3 | 6 | F | Conviction-cap test failure | Already ship with conviction caps (0.99/0.75/0.60/0.33); HITL on high severity |
| **R-LE-003** | **Caribbean jurisdiction disclaimer** | 1 | 2 | 2 | F | "engage a local attorney" nudge not shown | Force-render nudge on every verdict ≥severity-3 |
| **R-OP-001** | **LLM tier-2 outage** | 2 | 2 | 4 | F | Alert `llm-error-rate > 50%` | `USE_LOCAL_EDGE=1` default; Ollama fallback (Ollama is local on `localhost:11434`) |
| **R-OP-002** | **OllyGarden telemetry outage** | 2 | 1 | 2 | F | Alert `ollygarden-export-failures > 10 in 5min` | Runbook RB-OLLYGARDEN-OUTAGE; `OTLP_SINK=local` fallback |
| **R-OP-003** | **Postgres data loss** | 1 | 3 | 3 | F | Backup-failed alert | Daily encrypted snapshot; 30-day retention |
| **R-OP-004** | **Bundle size regression** | 2 | 1 | 2 | F | CI bundle > 200KB gzipped | Runbook RB-BUNDLE-SIZE-REGRESSION; reject PR |
| **R-OP-005** | **i18n locale regression** | 1 | 1 | 1 | F | CI tests for `src/locales/*.json` schema fail | Roll back to last green; pin in `package.json` |
| **R-OP-006** | **Cold-clone success < 50%** | 2 | 3 | 6 | F | 5 fresh clones over 5 days fail | `setup-local-edge` script; one-command install |
| **R-OP-007** | **Cold-clone install needs Ollama / DB** | 3 | 1 | 3 | F | First-run "edge-llm unreachable" error | Document degradation in `docs/local-edge-llm.md` |
| **R-OP-008** | **`git push origin main` PAT scopes broken** | 3 | 2 | 6 | F | push rejected for permission | Already known; we commit locally only (MEMORY hard rule) |
| **R-SE-001** | **Leak of PII via OTLP span** | 2 | 3 | 6 | F | Boundary redactor test fails | Per-span redaction; quarterly red-team; vendor review |
| **R-SE-002** | **Cross-tenant data leak** | 1 | 3 | 3 | F | Tenant-A sees Tenant-B row | RLS + per-tenant resolver; integration tests |
| **R-SE-003** | **Self-host operator lapse** | 2 | 2 | 4 | F (out of our control) | Reported in OSS issue | Documented in `SECURITY.md`; community support |
| **R-SE-004** | **Supply-chain attack (npm)** | 2 | 3 | 6 | F | Dependabot / `bun audit` flags CVE | Pin major versions; weekly `npm audit`; Semgrep |
| **R-SE-005** | **OWASP top-10 vulnerability in production** | 2 | 3 | 6 | F | External pentester report | Quarterly self-audit (`SECURITY-AUDIT.md`); DAST ZAP weekly |
| **R-SE-006** | **LLM jailbreak against the counsel-nudge** | 2 | 2 | 4 | F | Red-team finds a prompt that bypasses | Crumpled-Bill guardrail; conviction caps; HITL |
| **R-PR-007** | **Damaging press coverage** | 1 | 3 | 3 | F | Inquirer / TechCrunch inquiry | First-response protocol; legal advisor on standby |
| **R-PR-008** | **Misattribution to CfC** | 1 | 2 | 2 | F | CfC mentions us in a way that overstates | Brand-1 brand book on `docs-site/team.html` |
| **R-BU-001** | **Bank account frozen (KYC)** | 1 | 3 | 3 | F | Bank email | Keep multi-currency Wise; per-jurisdiction IBAN |
| **R-BU-002** | **Stripe frozen** | 1 | 3 | 3 | F | Stripe email | Backup processor (Wise) for UK + Caribbean |
| **R-BU-003** | **Cap-table discrepancies** | 1 | 3 | 3 | F | Audit disagreement | Use a SAFE template; 1-page cap table updated monthly |
| **R-RE-001** | **Engineer #1 hire fails** | 2 | 3 | 6 | F | 3 months of no-yes offers | Founder continues alone; reduce scope |
| **R-RE-002** | **GTM-1 hire fails** | 1 | 2 | 2 | F | No qualified candidates by 2027-06 | Founder 0.5 GTM; reduce G2M ambition |
| **R-RE-003** | **Advisory board never forms** | 1 | 1 | 1 | F | Zero confirmations after 3 months | Don't gate work on advisory forming |
| **R-CO-001** | **PR for code from a contributor without CoC sign** | 1 | 2 | 2 | F | PR opened without CoC | Block-merge script; docs/CONTRIBUTING.md |
| **R-CO-002** | **Data residency bug** | 1 | 3 | 3 | F | User complains of a region mismatch | Tenant-config UI; per-jurisdiction defaults |
| **R-CO-003** | **Unauthorised rebrand by sponsor** | 1 | 2 | 2 | F | Sponsor press release uses our logo | Trademark guidance; brand book on docs-site |

---

## 2. Top-10 by score (the ones we worry about tonight)

| # | Risk | Score |
|--:|---|--:|
| 1 | R-PR-001 Founder-SPoF | 9 |
| 2 | R-PR-002 Pre-seed does not close | 6 |
| 3 | R-PR-004 First paying user delay | 6 |
| 4 | R-PR-005 Live demo URL inaccessible | 6 |
| 5 | R-LE-001 UK tightening AI regs | 6 |
| 6 | R-LE-002 Statutory citation error | 6 |
| 7 | R-OP-006 Cold-clone success <50% | 6 |
| 8 | R-OP-008 PAT scopes broken | 6 |
| 9 | R-SE-001 PII leak via OTLP | 6 |
| 10 | R-SE-004 / R-SE-005 Supply chain + OWASP | 6 each |

For each of these, there is at least one mitigation already
on disk; see the table above.

---

## 3. Risk-burndown plan (next 30 days)

| Action | Target risk | Owner | Due |
|---|---|---|---|
| Run `bun audit` + `npm audit` weekly | R-SE-004 | F | ongoing |
| Cold-clone test on a fresh VM | R-OP-006 | F | 2026-08-12 |
| Verify `curl https://*preview.shogo.ai` | R-PR-005 | F | tonight |
| Re-test `git push` after Sam's PAT refresh | R-OP-008 | F | by 2026-08-13 |
| Apply pre-seed intro via Boardy / LinkedIn | R-PR-002 | F | by 2026-08-14 |
| Send all 7 MoU follow-ups | R-PR-003 | F | by 2026-08-13 |
| First Pro-tier paywall trial | R-PR-004 | F | by 2026-08-15 |

---

## 4. Risk-triggers dashboard (where they all live)

- `scripts/health-check.ts` — orchestrator
- `scripts/test-slo.ts` — SLO burn-rates
- OllyGarden dashboards — synthetic rates
- `HEARTBEAT.md` — daily narrative log

— Sam Peacock
2026-08-11
