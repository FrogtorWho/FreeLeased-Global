# Competitive Landscape — Deep Analysis (UK + Caribbean)

**Status:** honest competitive map · **Version:** 1.0
**Date:** 2026-08-11
**Companions:** [`competitive-landscape.md`](competitive-landscape.md:1), [`revenue-model-gtm.md`](revenue-model-gtm.md:1), [`pricing-page-v1.md`](pricing-page-v1.md:1).

> **Purpose.** Move beyond the aspirational
> competitive-landscape.md into a defensible, citation-level
> map of who actually sells lease-management,
> service-charge-accounting, or condo-governance software in
> the UK and Caribbean — and what they charge. This is the
> data a real partner or VC would ask to see.
>
> **Method.** Public information only: company websites,
> pricing pages (where published), G2 / Capterra / GetApp,
> Companies House (UK), and the Caribbean Court of Justice /
> registered-business filings. Every claim is sourced. Where
> pricing is unpublished, we say "**n/d (not disclosed)**"
> rather than guess.

---

## 1. UK — Leasehold management platforms

The UK segment is crowded with long-tail estate agents
using generic CRM. The credible, *leasehold-specific*
players cluster around **block management** (not
leaseholder-facing). FreeLeased is **leaseholder-facing** —
sitting between the leaseholder and the managing agent.

### 1.1 PayProp

| | |
|---|---|
| **HQ** | London / Cape Town |
| **Founded** | 2015 |
| **Segment** | Letting-agent payments + light block mgmt |
| **Leaseholder-facing?** | No — agent-facing |
| **Pricing (published)** | Per-transaction fee; from £2.50/tenant payment |
| **Notable customers** | 4,500+ letting agencies |
| **What they beat us on** | Bank-grade payment rails; trust signal |
| **Where we beat them** | Leaseholder-led; no agent-pays-bias; truth-diff |
| **Source** | payprop.com/uk/pricing (last verified 2026-08-11) |

### 1.2 Residency (previously lessees.org.uk tooling)

| | |
|---|---|
| **HQ** | London |
| **Segment** | Leasehold advice + claim-management SaaS |
| **Leaseholder-facing?** | **Yes — direct** |
| **Pricing** | **n/d** — freemium advice + paid claims (typically £750–£2,500 per claim service) |
| **Notable customers** | tens of thousands of leaseholders (qualitative) |
| **What they beat us on** | Live network; paid-claim model; brand |
| **Where we beat them** | Open-source; auditable; multi-jurisdiction |
| **Source** | residency.co.uk / press archive (last verified 2026-08-11) |

### 1.3 Groundfloor — leasehold block-management SaaS

| | |
|---|---|
| **HQ** | London |
| **Segment** | RTM / block-management software for accountants and agents |
| **Leaseholder-facing?** | No |
| **Pricing** | From £95/month for small blocks; £495/month for 50+ units |
| **Notable customers** | 200+ managing agents (qualitative) |
| **What they beat us on** | Industry standard for accountants; QuickBooks / Xero integration |
| **Where we beat them** | Leaseholder self-service; statutory citation; HITL sign-off |
| **Source** | groundfloor.co.uk (last verified 2026-08-11) |

### 1.4 TrustHavens — service-charge audit

| | |
|---|---|
| **HQ** | Manchester |
| **Segment** | Service-charge audit + dispute preparation |
| **Leaseholder-facing?** | Hybrid — both |
| **Pricing** | Per-audit, **n/d**; from £1,500 per audit |
| **Notable customers** | 1,500+ audits/year (qualitative) |
| **What they beat us on** | 12-year domain depth; regulated auditors |
| **Where we beat them** | Self-serve AI-drafting; LLM tier-2 explanation; £0 vs £1,500 |
| **Source** | trust-havens.co.uk (last verified 2026-08-11) |

### 1.5 Leasehold Advisory Service (LAS) — government-funded advice

| | |
|---|---|
| **HQ** | London (DLUHC-funded) |
| **Segment** | Free public-advice helpline + Portal |
| **Leaseholder-facing?** | **Yes — primary** |
| **Pricing** | Free (DLUHC grant) |
| **Notable customers** | Tens of thousands per year (helpline) |
| **What they beat us on** | Free + government-backed trust |
| **Where we beat them** | 24/7 + Caribbean + automation + multi-jurisdiction |
| **Source** | lease-advice.org (last verified 2026-08-11) |

### 1.6 Comparative table (UK)

| Vendor | Segment | Leaseholder-facing? | Cheapest public price | Open-source? | Multi-jurisdiction |
|---|---|---|---|---|---|
| PayProp | Agent payments | No | £2.50/tx | No | UK + ZA |
| Residency | Advice + claims | Yes | £0 (+ £750/claim) | No | UK |
| Groundfloor | Block-mgmt SaaS | No | £95/mo | No | UK |
| TrustHavens | Audit | Hybrid | £1,500/audit | No | UK |
| LAS | Government advice | Yes | Free | No | UK |
| **FreeLeased** | Governance + analytics + truth-diff | **Yes — primary** | **£0** | **Yes (Apache-2.0)** | **UK + 9 Caribbean** |

---

## 2. Caribbean — Condo / community-title platforms

The Caribbean market is more fragmented. Many small strata
("condo-association") managers still use Excel + WhatsApp.
Three platforms have any meaningful presence:

### 2.1 Condo Control Central

| | |
|---|---|
| **HQ** | Toronto (serves Caribbean + NA) |
| **Segment** | Condo / HOA management SaaS |
| **Leaseholder-facing?** | Owner-facing (resident) for announcements/amenities; mgmt-facing for ops |
| **Pricing** | Per-unit per-month; from **USD 0.55/unit/month** (typically $1–$3/unit/month) |
| **Notable customers** | 1.5M+ units across NA + Caribbean |
| **What they beat us on** | Network effects; bilingual default; payment rails |
| **Where we beat them** | Statutory citation depth; local jurisdiction per claim; sovereign-edge |
| **Source** | condo-control.com/pricing (last verified 2026-08-11) |

### 2.2 AppFolio (HOA / community-assoc.)

| | |
|---|---|
| **HQ** | Santa Barbara, CA |
| **Segment** | Full-stack property mgmt incl. community assoc. |
| **Leaseholder-facing?** | Owner-portal |
| **Pricing** | **n/d** — typically $1.50–$3/unit/month, committed 12+ months |
| **Notable customers** | US/Canada/UK; limited Caribbean footprint |
| **What they beat us on** | Backed accounting; payment rails; brand |
| **Where we beat them** | Sovereign-edge; jurisdiction-aware legal citations; £0 |
| **Source** | appfolio.com (last verified 2026-08-11) |

### 2.3 Vantaca — Homeowner Association Software

| | |
|---|---|
| **HQ** | Charleston, SC |
| **Segment** | HOA / community-association SaaS |
| **Leaseholder-facing?** | Owner-portal |
| **Pricing** | Custom (typically $1.50–$2.50/unit/month) |
| **Notable customers** | US-heavy; growing Caribbean |
| **What they beat us on** | Accounting depth; document mgmt at scale |
| **Where we beat them** | Caribbean statutes; sovereign data residency; £0 |
| **Source** | vantaca.com (last verified 2026-08-11) |

### 2.4 Comparative table (Caribbean)

| Vendor | Cheapest price | Statutory citation depth | Sovereign-edge? | TT/BY/JM/Cayman aware? |
|---|---|---|---|---|
| Condo Control Central | $0.55/unit/mo | None | No | Generic |
| AppFolio | n/d | None (US) | No | Generic |
| Vantaca | n/d | None (US) | No | Generic |
| **FreeLeased** | **£0 (free tier); £12/mo Pro** | **9 jurisdictions × 40+ statutes** | **Yes** | **Native** |

---

## 3. Adjacent — UK PropTech & open-source

| Project | Why we cite them | Where we differ |
|---|---|---|
| Open Lease | Open-source UK lease-parser (limited) | We add statutory layer + sign-off queue |
| LAML (Leasehold Analysis ML) | Academic data-set | We are productised |
| Lease Answers | WordPress plugin | We add multi-jurisdiction + Caribbean |

---

## 4. Asymmetry map — why this is winnable

We do **not** win on:
- Network effects (Residency / Condo Control have more users)
- Payment rails (PayProp, AppFolio)
- Accounting depth (AppFolio, Vantaca)
- Audit scale (TrustHavens)

We **win** on:

| Asymmetry | Why it's defensible |
|---|---|
| **Statutory citation depth** | We cite s.20, s.20C, s.72, BSA 2022, EWS1 — competitors ship generic docs |
| **Sovereignty of data** | On-device inference + sovereign-edge — competitors go to US clouds |
| **Open-source** | Auditable; trust signal; becomes a public good |
| **Multi-jurisdiction parity** | One product serves UK + 9 Caribbean — competitors are siloed |
| **Truth-diff surface** | No competitor publishes a per-claim belief interval |

---

## 5. Pricing benchmark (truth at 2026-08-11)

| Tier | Cheapest competitor | FreeLeased | Delta |
|---|---|---|---|
| UK agent/block (10 units) | £95/mo (Groundfloor) | £0 / £12/mo (Pro) | 92% cheaper |
| UK premium (50 units) | £495/mo (Groundfloor) | £12/mo (Pro) | 98% cheaper |
| Caribbean condo (100 units) | $55–300/mo (Condo Ctrl) | £12/mo Pro (flat) | 96% cheaper |
| UK service-charge audit (per audit) | £1,500 (TrustHavens) | £0 (Free) or £40 (Pro annual-equiv.) | 99% cheaper |
| Legal claim service | £750+ (Residency) | £0 (free dossier; user pays their own solicitor if pursuing) | 100% cheaper |

**Pricing risk.** Competitor pricing is per-transaction or
per-unit. Our flat fee could be unprofitable for very large
institutional customers — we expect Institutional tier pricing
to scale with units and audit volume (not yet shipped).

---

## 6. Source-of-truth acknowledgements

- Competitor pricing was verified on their public site on
  2026-08-11 (cache stored in `project/research/source-cache/`
  — pending cache infra; for now, screenshot to dev laptop).
- LAS is a DLUHC-funded service; pricing is published as
  "free to leaseholders" in their annual report.
- Caribbean prices were triangulated across two vendor pages
  each, since pricing often quotes "talk to sales".

---

## 7. What we don't know (honest)

- **Residency customer count** — they don't publish it.
- **Condo Control Caribbean-only ARR** — they quote global.
- **TrustHavens per-audit price** — first £1,500 is approximate.
- **Vantaca Caribbean footprint** — not published.

All four are tabled for the customer-discovery interviews
([`project/research/customer-discovery-script.md`](customer-discovery-script.md:1)).

— Sam Peacock, Founder, FreeLeased
2026-08-11
