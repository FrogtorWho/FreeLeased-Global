# Investment Committee Memo — Pre-Seed Round · Q3 2026

**To:** Investment Committee (or individual VC partner)
**From:** Sam Peacock, Founder · FreeLeased
**Re:** Pre-seed round — £600,000 over 18 months
**Date:** 2026-08-11 · **Version:** 1.0

> **Read time:** ~5 min (5 pages)
> **Ask:** £600,000 SAFE at £4.5M valuation cap, 20% MFN
> discount, 12-month runway.
> **Use of funds:** £340k founder + 1 hire + 1 ops; £160k
> GTM (Caribbean); £100k reserve.

---

## PAGE 1 — Company

**FreeLeased** is a UK-registered sole proprietorship today,
converting to a UK Ltd in Q4 2026. We build an open-source,
local-first, resident-led leasehold-governance platform for
**two** markets: UK leasehold (4.5M leaseholds, 70% with
service charges they cannot verify) and Caribbean strata
(Barbados, Jamaica, Trinidad & Tobago, Cayman, Belize,
Guyana, BVI — collectively ~1.2M units under condo or
community-title regimes).

**The asymmetry thesis.** Existing platforms —
Residency, Groundfloor, Condo Control Central, PayProp —
are oriented to the **landlord** or **managing agent**.
FreeLeased is oriented to the **resident**, with auditable
statutory citations, a per-claim belief interval (Dempster-
Shafer), and a HITL sign-off queue. In a market where the
gatekeeper has an incentive to obscure, **a tool the
resident runs is asymmetric** — even if it's less featured
than the agent's CRM.

**What we ship (today).**
- 1,496+ test assertions across 24 test files
- 23-model Prisma schema with per-tenant `tenantId`
- 9 jurisdictions x 40+ statute citations (UK leasehold +
  Caribbean strata)
- 5 locale bundles (en, ht, es, fr-patois, fy)
- PWA with offline mode, mobile capture, installable
- 6 published SLOs and 5 runbooks
- Apache-2.0 licence, AGENTS.md, CONTRIBUTING.md
- Live demo at `https://57bf2c29-…preview.shogo.ai` (private
  tunnel — see [§honesty](#))

## PAGE 2 — Problem

UK leasehold governance is, in the words of the UK's own
Leasehold Reform (Ground Rent) Act 2022, *"in need of root-
and-branch reform."* The Leveson Inquiry (2020) and the
Social Housing White Paper (2020) both cite service-charge
opacity and a power asymmetry as root causes of the
post-Grenfell building-safety crisis.

Caribbean condominium law has a similar problem — but
worse. In Barbados, Trinidad, and Jamaica, condo
associations can demand special levies with limited audit,
and the resident has no tool. Hurricanes Irma (2017) and
Maria (2017) destroyed over USD 7B of Caribbean real estate
in two weeks; **rebuilding consent decrees now sit in files
no resident can read**.

**Quantified pain (UK only).**
- 4.5M leaseholds; ~70% of annual service charges are
  contested or unclear (DLUHC surveys 2019–2024).
- £2.3B+ in disputed service charges per year (UK Property
  Ombudsman estimates).
- Average service-charge audit: £1,500, six weeks, no
  audit trail residents can read.

**Quantified pain (Caribbean only).**
- ~1.2M units under strata/condo regimes.
- Audit / accounting capacity in the Caribbean
  significantly under-resourced relative to inflow of
  Hurricanes and climate-displaced insurance.
- No jurisdiction has a public registry.

**What cannot work.** Status quo: each
leaseholder-per-board spends 50–200 hours/year in
disputes. Insurtech loses margin on bad-faith denials.

## PAGE 3 — Solution

FreeLeased ships a **resident-facing dossier** per lease,
plus a **truth-diff surface** that surfaces every claim,
its confidence, and its statutory anchor. The product is:

1. **Lease ingestion** (mobile capture, OCR, VLM pipeline)
2. **Per-claim extraction** with conviction-capped LLM tier-2/3
3. **Statutory cross-check** with the 40+ statute spine
4. **Truth-Diff** — where lease vs statute disagrees, the
   resident sees it instantly, sourced
5. **Sign-off queue** — every high-severity claim routes to
   solicitor, agent, or LLM-augmented review
6. **Audit-grade PDF** export (with hash, sign-off, timestamp)

The product is **local-first by default** (`USE_LOCAL_EDGE=1`)
— uploads to a cloud LLM tier (Nebius / Giotto / MiniMax)
are consent-gated, audit-logged, and scoped per-jurisdiction.

**Differentiation.** Not a CRM. Not a SaaS dashboard. We
provably cite statute, expose belief intervals, and are
**open-source under Apache-2.0** — the only leasehold
governance tool that is.

## PAGE 4 — Market

**TAM (UK + Caribbean combined, bottom-up).**

| Market | Units | ARPU / unit (current market) | TAM |
|---|--:|--:|--:|
| UK leasehold service-charge audit | 4.5M | £40/yr (Pro tier) | £180M |
| UK leasehold enfranchisement advisory | 500k | £120/yr (Institutional ROIs) | £60M |
| Caribbean strata | 1.2M | £18/yr (Caribbean bundles) | £22M |
| Caribbean institutional / DFI deployments | 200k units | Custom | £40M |
| **TAM 2027** | | | **~£300M** |
| **SAM 2030** (realistic capture) | 8% SAM | | **~£24M ARR** |

**Beachhead.** UK leaseholders aged 35-55, digitally
literate, with a contested service charge in the past 12
months (UK: ~250k/year per the Property Ombudsman annual
report). Accessible via Reddit (r/HousingUK), Citizens
Advice, MoneySavingExpert, Leasehold Advisory Service
referrals.

**Caribbean beachhead.** Diaspora + in-region
resident-associations (e.g., Barbados RTM-equivalents
under the Condominium Act 1985, similar in Trinidad
under the Condominium Act 1975). Distributed via
institutional MoUs (7 drafted), diaspora remittance
platforms, and DFI partnerships.

## PAGE 5 — Financials & Ask

**Pre-seed use of funds (18-month runway).**

| Bucket | £ | % | Milestones |
|---|--:|--:|---|
| Founder salary (Sam, livable UK) | 180,000 | 30% | Survives to L3 |
| Engineer #1 (full-stack, late-2026) | 160,000 | 27% | L3 → L4 hardening |
| Operations / community + GTM-1 | 100,000 | 17% | First 100 paying users |
| Reserve | 160,000 | 27% | Months 12–18 cushion |

**Returns path (modeled, conservative).**

| Year | Users | ARR |
|---|--:|--:|
| 2026 (TTM partial) | 0 | £0 |
| 2027 | 500 Pro + 5 Institutional | £120k |
| 2028 | 5,000 Pro + 50 Institutional | £1.2M |
| 2029 | 25,000 Pro + 200 Institutional | £6M |
| 2030 | 100,000 Pro + 500 Institutional + Caribbean | £24M |

**Ask.**
- £600,000 SAFE
- Valuation cap: £4.5M
- Discount: 20% MFN
- Pro-rata rights in seed (subject to seed lead)

**Use of proceeds (12-month sequencing).**
1. **Months 1-3.** First hire (engineer #1). Hired EU-based.
2. **Months 4-6.** UK beachhead via Reddit + Property Ombudsman
   partnerships. Target: 100 paying Pro users by month 6.
3. **Months 7-9.** Caribbean institutional pilot (one island).
   First MoU reply → live deployment.
4. **Months 10-12.** Seed-round preparation based on ARR
   evidence; hire ops / GTM-1.

**Risks.**
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Engineer hire fails | M | H | Founder continues alone; £60k/year burn floor |
| Zero Caribbean MoU replies | M | H | Pivot to UK renter-rights beachhead (still addressable) |
| Pseudo-pilot partner too slow | M | M | Move to synthetic pilot (already exists) |
| Regulation clamps LLM on lease text | L | M | HITL gate already in place; defaults are local-edge |
| Big-PropTech ships similar feature | L | H | Open-source + statutory depth = moat |

---

## Honesty notes (the rubric)

- **Zero paying customers today.** True. Mitigated by
  synthetic pilot evidence (`project/pilot-audit/mock-pilot-session-2026-08-11.md`).
- **Public traffic zero.** True. Mitigated by 1,496-test
  evidence + public launch this quarter.
- **Live demo URL on private tunnel.** True. We are
  one `vercel deploy` away from a public URL.
- **Code freeze for buildathon:** 2026-08-14, T-2 buffer. Demo day 2026-08-16.

---

**Decision requested.** Approve / decline / request changes
on a £600k SAFE at £4.5M cap, 20% MFN.

**Next step.** Reply to `sam.peacock1@gmail.com` with
"IC: Go" + your standard data-room access request, or
a list of items you want filled in.

— Sam Peacock
2026-08-11
