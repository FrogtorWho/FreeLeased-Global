# Service Level Agreement — FreeLeased

**Status:** published · **Version:** 1.0 · **Effective:** 2026-08-11
**Companion:** [`src/lib/slo.ts`](../src/lib/slo.ts:1) (canonical machine-readable SLOs)
**Companion:** [`docs/RUNBOOK.md`](RUNBOOK.md:1) (operational playbook)

> **TL;DR.** Every API endpoint has a 99.9% availability
> target over 30 days. Our Tier-1 customers get a 99.95%
> target and a 2-business-day complaint turnaround. The
> truth-sources below reconcile against
> `scripts/test-slo.ts` (currently 117/117 assertions passing).

---

## 1. Definitions

| Term | Meaning |
|---|---|
| **Service** | The hosted FreeLeased app + API (`api.freeleased.org`) and the marketing site (`freeleased.org`) |
| **SLO** | Service Level Objective — the target reliability/performance measure |
| **SLI** | Service Level Indicator — the measured reliability/performance value |
| **Error budget** | `1 - target` over the rolling 30-day window |
| **Burn-rate alert** | Fires when the budget is consumed at > N× the expected rate |
| **Incident** | Any event that reduces the SLI below the SLO |
| **P0** | All users affected, full outage |
| **P1** | A single feature or single tenant affected |
| **P2** | Minor degradation; < 5% of users affected |

---

## 2. SLOs (mirrored from `src/lib/slo.ts:33`)

| ID | Surface | SLO Target | Window | Error budget | Burn-rate alert | Runbook |
|----|---------|---:|---|---:|---|---|
| `api-fairness-check-availability` | `POST /api/fairness/check` | 99.9% | 30d | 0.1% | 2.0× | RB-02 |
| `api-review-queue-availability` | `GET /api/review-queue` | 99.9% | 30d | 0.1% | 2.0× | RB-09 |
| `api-consensus-decide-latency` | `POST /api/consensus/decide` | 99% in <500ms p99 | 30d | 1.0% | 1.5× | RB-02 |
| `ui-ttfi-mobile` | My Rights tab (mobile) | 95% < 3s on 4G | 30d | 5.0% | 1.5× | RB-04 |
| `ui-ttfi-desktop` | My Rights tab (desktop) | 99% < 1.5s on broadband | 30d | 1.0% | 2.0× | RB-04 |
| `ollygarden-trace-completeness` | OTLP export to OllyGarden | 99.9% | 30d | 0.1% | 2.0× | RB-01 |

### 2.1 Tiered customer commitments

| Tier | Availability | Support response | Resolution target |
|---|---|---|---|
| Free | 99.0% (best-effort) | 7 business days | N/A |
| Pro (£12/mo) | 99.5% | 3 business days | 14 business days |
| Institutional (Custom) | **99.95%** with credits | **1 business day** | **2 business days** for P1; 7 days for P2 |

### 2.2 Performance budgets (mirrored from `src/lib/slo.ts:101`)

| Surface | Bundle (gz) | TTFI | LCP |
|---|--:|--:|--:|
| My Rights (mobile, 4G) | 200 KB | 3.0s | 4.0s |
| Lease Scanner (desktop) | 350 KB | 1.5s | 2.0s |
| Sign-off Queue (desktop) | 250 KB | 1.5s | 2.0s |
| Honesty (desktop) | 150 KB | 1.0s | 1.5s |

If any surface exceeds its budget, the contributor must
revert the change or re-architect until it does.

---

## 3. Service credits (Institutional tier)

If we miss an Institutional-tier SLO:

| Missed SLO | Credit on next month's invoice |
|---|---|
| 99.95% → 99.0% | 10% of monthly fee |
| 99.0% → 95.0% | 25% of monthly fee |
| < 95.0% | 50% of monthly fee |

Credits are computed monthly from OllyGarden SLI. Pro-rated
against monthly subscription. Void if the missed SLO was
caused by the customer (e.g., their own DDoS, their own
unpaid invoices).

---

## 4. Scheduled maintenance

- **Cadence.** Quarterly, Sunday 18:00-22:00 UTC.
- **Notice.** At least **14 days** advance via in-product
  banner + email to Institutional tier.
- **Maximum windows.** < 4 hours per quarter, with degradation
  capped at 50% of error budget.

Emergency maintenance (e.g., zero-day patch) bypasses the
14-day notice; we notify in-product and email within 2 hours.

---

## 5. Geographic commitments

| Region | Default data residency | Sovereign-edge? |
|---|---|---|
| UK + EEA | `eu-west-2` (London) | Available |
| BVI + Cayman + Barbados | `eu-west-2` default; sovereign-edge on request | **Required for institutional** |
| Trinidad + Jamaica + Guyana + Belize | Sovereign-edge on request (operator supplies infra) | Per agreement |

Customers can override via the in-product `Settings →
Tenant → Data Residency` panel.

---

## 6. What this SLA does NOT cover

- LLM provider outage covered by RB-02 fallback to local-edge.
- Self-host deployments (operators set their own).
- Customer's own network connectivity.
- Customer's own misuse (rate-limit violations).
- Force majeure (natural disaster, war, regulator-mandated
  takedown).

---

## 7. How to claim

Institutional customers can claim a credit by emailing
`sam.peacock1@gmail.com` with subject "SLA Credit — <month>"
within **30 days** of the SLO breach.

---

## 8. Reconciliation

The numbers above reconcile with:

- `src/lib/slo.ts` SLOS array
- `src/lib/slo.ts` PERF_BUDGETS array
- `src/lib/slo.ts` RUNBOOKS array (5 entries)
- `scripts/test-slo.ts` (117 assertions)

If a number drifts, fix the code, then this doc.

— Sam Peacock
2026-08-11
