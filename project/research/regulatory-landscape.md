# Regulatory Landscape — UK + Caribbean

**Version:** 1.0 · **Date:** 2026-08-11
**Method:** Public regulator pages only; **no fabrications**;
**n/d** where published guidance is silent.

> **Why.** If we sell FreeLeased as a B2B service to a
> housing association, RTM company, condo-management
> agency, or government department, the institutional
> customer wants to know: which regulators care about us,
> which don't, and what's the cost of compliance? This doc
> records our best understanding and flags every open
> question.

---

## 1. UK regulators

### 1.1 Information Commissioner's Office (ICO)

- **Cares about FreeLeased?** Yes — we process personal
  data.
- **Why.** UK GDPR + DPA 2018.
- **What they require.**
  - Lawful basis per Art. 6 (we use consent + contract + legitimate interest; see [`PRIVACY.md` §3](../../docs/PRIVACY.md#3-lawful-basis-uk-gdpr-article-6))
  - DPIA for high-risk processing (we have one for
    multi-tenant + LLM tier-2 — see Data Room)
  - DSR endpoints (in place; see [`PRIVACY.md` §7](../../docs/PRIVACY.md#7-your-rights))
  - Breach reporting within 72 hours (runbook RB-08 in
    [`RUNBOOK.md`](../../docs/RUNBOOK.md))
  - Registration with the ICO (£40/yr for sole proprietor)
- **Cost.** £40/yr registration + ~0.2 FTE per year for
  compliance.
- **Status.** Registered (data room: ICO registration card).

### 1.2 Property Ombudsman (TPO) / Property Redress Scheme

- **Cares about FreeLeased?** Indirectly. We do not perform
  a regulated activity; we provide software. But the
  *customer* (an agent) is regulated.
- **Why.** Scheme membership is required for property
  agents in England.
- **What they require.** Nothing direct, but our customer
  must have an established complaint-handling procedure.
- **Cost.** None to us.
- **Open question.** Do we want to be listed in TPO's
  "approved software vendors" list? (Q4 2026.)

### 1.3 HM Courts & Tribunals Service — Property Chamber

- **Cares about FreeLeased?** Indirectly. A dossier we
  generate may be used as evidence.
- **Why.** First-tier Tribunal (Property) hears leasehold
  disputes.
- **What they require.** Nothing on us; but documents we
  produce should be admissible (signed, dated, complete).
- **Status.** Documented in [`src/lib/signing.ts`](../../src/lib/signing.ts:1).

### 1.4 Financial Conduct Authority (FCA)

- **Cares about FreeLeased?** Probably not — but *only*
  if we don't handle client money.
- **Why.** Anything touching money transmission requires
  authorisation.
- **What we do.** We do not handle money. We do not
  invoice tenants. We do not transmit funds.
- **Open question.** If we later add "service-charge escrow",
  FCA authorisation may be needed.

### 1.5 Solicitors Regulation Authority (SRA)

- **Cares about FreeLeased?** Mostly not — we are not a
  law firm.
- **Why.** Anything that looks like "preparing legal
  documents" can trigger SRA reserved-activity scrutiny.
- **Mitigation.** We provide information, not advice.
  We non-removably nudge the user to "Engage a local
  attorney" at high severity.
- **Reference.** [`TERMS.md` §5](../../docs/TERMS.md#5-not-legal-advice).

### 1.6 Centre for Data Ethics and Innovation (CDEI) / AI Safety Institute

- **Cares about FreeLeased?** Indirectly.
- **Why.** They advise government on AI.
- **What they expect.** Transparency, bias-audited
  inference, human oversight.
- **Status.** Our compliance statement
  ([`project/submission-pack/compliance-statement-v3.md`](../submission-pack/compliance-statement-v3.md))
  documents HITL, conviction caps, and demographic audit.

### 1.7 Equality and Human Rights Commission (EHRC)

- **Cares about FreeLeased?** Indirectly.
- **Why.** The Equality Act 2010 obliges *landlords and
  agents* to not discriminate; we enable their
  compliance.
- **What we do.** Fairness engine ([`src/lib/fairness.ts`](../../src/lib/fairness.ts:1))
  monitors for suspect disparities across protected
  characteristics.

### 1.8 Building Safety Regulator (HSE) — post-Grenfell

- **Cares about FreeLeased?** Aware of us via
  building-safety work.
- **Why.** BSA 2022 creates a regulator for higher-risk
  buildings; service charge transparency is in scope.
- **Status.** EWS1 + BSA cases are in our spine
  ([`src/data/legislative-framework-schema.ts`](../../src/data/legislative-framework-schema.ts:1)).

---

## 2. Caribbean regulators

### 2.1 Barbados Data Protection Office

- **Cares about FreeLeased?** Yes, if we offer hosted
  services to Barbadian residents.
- **Why.** Data Protection Act 2019 (Barbados).
- **What they require.** Registration + DPO appointment
  (or, for small processors, named accountability).
- **Status.** Registration pending (we cannot self-register
  without a Caribbean entity; partner via local DPO-as-a-service).

### 2.2 Jamaica Office of the Information Commissioner (OIC)

- **Cares about FreeLeased?** Yes, for hosted services to
  Jamaican residents.
- **Why.** Data Protection Act 2020 (Jamaica).
- **What they require.** Registration; lawful basis; DSR.
- **Status.** Same as Barbados.

### 2.3 Trinidad & Tobago — Office of the Information Commissioner

- **Cares about FreeLeased?** Yes, on hosted services.
- **Why.** Data Protection Act 2020 (T&T) — passed, in
  phase-in.
- **What they require.** Registration; DSR; data-localisation
  is *not* mandatory but strongly encouraged.
- **Status.** Phase-in ongoing; **n/d** on full text.

### 2.4 Cayman Islands — Office of the Ombudsman

- **Cares about FreeLeased?** Indirectly.
- **Why.** The Privacy Law (Data Protection) 2017 covers
  Cayman.
- **What they require.** Registration; DPO appointment for
  >2000 records.
- **Status.** Registration pending.

### 2.5 Belize — no DPA yet

- **Cares about FreeLeased?** Not currently.
- **Why.** Belize does not have a general data-protection
  statute as of 2026-08-11.
- **What this means.** We still commit to our published
  privacy posture in jurisdictions without a DPA, because
  institutional customers may have cross-border DPA
  obligations.

### 2.6 Guyana — no DPA yet

- **Cares about FreeLeased?** Not currently.
- **Why.** Guyana has announced a draft DPA but no enacted
  statute at 2026-08-11.
- **Status.** Watch for the Act.

### 2.7 BVI — Office of the Information Commissioner

- **Cares about FreeLeased?** Yes, if hosted for BVI
  residents.
- **Why.** Data Protection Act 2020 (BVI) in force.
- **What they require.** Registration; DSR.
- **Status.** Pending.

---

## 3. Cross-cutting

### 3.1 Open-source licensing

- **Apache-2.0** is recognised everywhere we sell.
- **Patent grant** (Apache-2.0 §3) addresses US Section 101
  risks for institutional customers.

### 3.2 Anti-money-laundering (AML)

- None of our institutional personas currently trigger
  AML obligations for us. If we add "service-charge escrow"
  (§1.4), a different analysis applies.

### 3.3 Sanctions / OFAC / UK OFSI

- Both Russian OFSI compliance and US OFAC compliance are
  required for any cross-border remittance. We do not
  transmit cross-border funds today; keep the position.

---

## 4. Cost-of-compliance estimate (12-month)

| Item | Annual cost |
|---|--:|
| ICO registration (UK) | £40 |
| Privacy tooling (DPA-implementation, vendor dashboards) | £600 |
| DPO-as-a-service (Caribbean) | £3,000–£6,000 |
| SOC-2 Type-1 readiness pack (Q4 2026 forward) | £3,000–£12,000 |
| Threat-model external review (Q4 2026) | £3,000–£8,000 |
| Bias-audit (semi-annual) | £2,000–£5,000 |
| **Total (lowest band)** | **£11,640** |
| **Total (highest band)** | **£31,640** |

These are line-items in the IC memo §5 (`project/strategy/IC-MEMO-Q3-2026.md`).

---

## 5. Open questions (the things we will NOT pretend we know)

| # | Question | Unblocker |
|---|---|---|
| Q1 | Does the FCA authorise us to handle service-charge escrow? | Seek FCA informal-view meeting post-pre-seed close. |
| Q2 | Barbados/Cayman/Jamaica/Trinidad registration paperwork | Engage local DPO-as-a-service; partner via MoU. |
| Q3 | Will CDEI publish AI-advice guidance? | Watch CDEI consultation responses. |
| Q4 | Will UK gov regulate "AI in legal decision-making"? | Watch DLUHC + AI Bill 2024–25. |

— Sam Peacock
2026-08-11
