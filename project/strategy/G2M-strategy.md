# Go-to-Market Strategy — FreeLeased

**Version:** 1.0 · **Date:** 2026-08-11
**Companions:** [`revenue-model-gtm.md`](revenue-model-gtm.md:1), [`pricing-page-v1.md`](pricing-page-v1.md:1), [`competitive-landscape-deep.md`](competitive-landscape-deep.md:1), [`customer-discovery-script.md`](customer-discovery-script.md:1).

> **Goal.** First **100 paying Pro users** by month 6
> post-pre-seed; first **5 Institutional** deployments by
> month 12. Caribbean: **3 institutional MoUs** signed by
> month 18.

---

## 1. Channels, ranked

Channel ranking is based on the lever they pull
(cost-to-CAC, time-to-first-user, social proof) and the
evidence we can verify (existing Reddit audience,
existing partner names, existing diaspora networks).

| # | Channel | Cost (12-mo, £) | CAC target | Conversion target | First user ETA |
|---:|---|--:|--:|--:|---|
| 1 | Reddit + Forums (r/HousingUK, MSE, Citizens Advice) | 5,000 | £5 | 5,000 signups → 100 Pro = 2% | Week 2 |
| 2 | Property-Ombudsman referral pipeline | 2,000 | £0 (referral) | 50 referrals → 25 Pro = 50% | Week 4 |
| 3 | Leasehold Advisory Service (LAS) partnership | 0 (outreach) | £0 (referral) | 50 referrals → 25 Pro = 50% | Week 6 (post-MOU) |
| 4 | Caribbean institutional (MoU partners) | 30,000 | High first-deal; LTV £25k+ per Institutional | 1–3 MoUs signed → 1–3 Institutional | Months 4–12 |
| 5 | DFI grants (CDB, IDB, EU-CCI) | 12,000 (writer) | £0 cash; grant in kind | 1 grant approved = marketing + access | Months 6–18 |
| 6 | Diaspora remittance platform partnerships | 8,000 (travel) | £0 (B2B2C) | 100k impressions → 500 signups → 25 Pro | Months 4–12 |
| 7 | Direct Instagram / TikTok creator partnerships | 12,000 (creator fees) | £20 | 100k impressions → 250 signups → 5 Pro | Months 6–9 |
| 8 | Cold outbound to Caribbean property ministries | 5,000 (commission to local consultant) | High first-deal | 1 signed MoU | Months 4–9 |
| 9 | SEO / organic content | 4,000 (writer fees) | £10 | 30k visitors/yr → 1,000 signups → 30 Pro | Months 12–18 |
| **TOTAL** | | **78,000** | | **~210 Pro + ~3 Institutional by Month 12** | |

We assume one full-stack engineer + founder (Sam) on GTM
+30 hr/week Sam-direct. After Month 6, hire GTM-1.

---

## 2. Conversion-funnel math

```
                 Visits / day  Sign-ups/day  Free→Pro  Pay
Reddit (UK)         300          5           2%        0.1
Property-Ombudsman    0          1–2 referrals/ wk          1/wk
LAS referral          0          1/wk (post-MOU)
Caribbean diaspora  200          3          1%        0.03
SEO                 100          2          1%        0.02
TikTok / Reels      500          5          0.5%      0.025
─
Daily Pro events                  ~0.2 to 0.3 Pro users / day
Annualised                          ~75–110 Pro users / yr
```

If we hit the upper band (0.3/day), we cross the 100-Pro
milestone around day 365. If we hit the lower band (0.2/day),
it slips to day 540. We assume lower band is the honest forecast.

---

## 3. Institutional lane

The big upside sits in **B2B institutional** deals:

| Tier | Average ARR | Sales cycle | Land-and-expand |
|---|--:|--:|---|
| 100-unit block | £2,400 | 6 weeks | Add service-charge-audit module +£6k |
| 500-unit HOA | £8,400 | 12 weeks | Add Caribbean module +£15k |
| 5k-unit DFI deployment | Custom (£25k+) | 6 months | Multiple modules + services |

Sales-cycle dropper is **compliance + sign-off** — every
institutional deal needs a DPA, an SLA, and a procurement
review. We have DPA (`docs/PRIVACY.md` + [`DPA template`
forthcoming]) and SLA (`docs/SLA.md`); procurement-fit
review is the next artefact (Q4 2026).

---

## 4. First-touch proof points (the social proof play)

For the first 12 months, every Pro user is a **net promoter**
because they came from social pain. Tactics:

- **The "What we found" series** — publish anonymised
  truth-diff results from consenting users (NDAs in place).
  Goal: 1/month.
- **"How I read my service charge" video** — 60-second
  videos of leaseholders using the product. Goal: 2/month.
- **"Local partner spotlight"** — spotlight a Caribbean
  institutional partner on launch. Goal: 1 in months 6 and
  12.
- **Quarterly Trust Report** — total audits, conviction
  caps, sign-off rate, anonymised. Public. (Mirrors
  Stripe/Atlassian's trust cadence.)

---

## 5. Pricing discipline (defended in §4 of revenue-model)

- Free tier is the **largest funnel**, but it is constrained
  to 100 dossiers/month to prevent abuse.
- Pro tier (£12/mo) is below any published competitor and
  intentionally accessible to a single leaseholder who has
  a £400 service-charge dispute.
- Institutional tier scales with units; pricing pages only
  show "Custom" until a discovery call.
- The "Engage a local attorney" nudge is **never** behind a
  paywall (the legal-advice boundary is sacred).

---

## 6. Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LTA-style regulation clamps free-AI-advice | M | H | HITL gate + counsel-nudge already exist |
| Caribbean MoU partners uncontactable | M | H | Use sample-dossier-based cold outreach as fallback |
| LLM tier-2 pricing increases | L | M | Local-edge defaults; rate-limit cloud tier |
| Solo founder unavailable for GTM | M | H | Founder #0.5 hires: junior GTM in Month 6 |

---

## 7. What we will NOT do

- We will not advertise on Facebook or Google (no CAC
  budget).
- We will not cold-sell to consumers (consumer CAC is
  prohibitively high).
- We will not chase press until we have 1 story-worthy
  customer outcome (Caribbean post-hurricane audit, or
  first UK service-charge audit that returned £).

---

## 8. Cadence

- **Weekly**: standup (Sam + engineer #1) on GTM funnel
- **Monthly**: channel CAC review
- **Quarterly**: G2M strategy refresh (this doc)

— Sam Peacock
2026-08-11
