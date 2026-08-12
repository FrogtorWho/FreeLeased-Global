---
title: "Data Protection Impact Assessment (DPIA)"
date: 2026-08-12
phase: 17
status: "Active — GDPR Art. 35 compliance"
owner: "Sam (Administrator)"
related: "PRIVACY.md, ALGORITHMIC-TRANSPARENCY.md"
---

# Data Protection Impact Assessment (DPIA)

> **Compliance:** GDPR Art. 35 (DPIA for high-risk processing).
> **Trigger:** FreeLeased processes personal data (lease text, flat
> numbers, contact details) at scale. The processing is automated.
> The outputs affect access to statutory rights. A DPIA is required.

## 1. Description of processing

### 1.1 Nature
- **Lease text** is uploaded by the resident (or their partner).
- **Engine** reads the text, applies deterministic rules + reconciliation.
- **Output** is an advisory dossier: rights, concerns, next steps.
- **Audit log** records every action.

### 1.2 Scope
- **Subjects**: residential leaseholders (UK + 8 Caribbean jurisdictions).
- **Volume**: pilot is ~50 residents. Institutional tier is ~10,000.
- **Duration**: 7 years (audit log); documents until deletion request.

### 1.3 Context
- The data is sensitive (housing, financial obligations).
- The data subjects are vulnerable (leaseholders may not have legal counsel).
- The processing is novel (AI-assisted legal diagnostics).

## 2. Necessity & proportionality

### 2.1 Is the processing necessary?
- **Yes.** Leaseholders cannot exercise their statutory rights (RTM, enfranchisement, service-charge audit) without a tool that maps their lease against the statute.
- The alternative is hiring a solicitor at £500–£5,000 — out of reach for the median leaseholder.

### 2.2 Is it proportionate?
- **Yes, with the following safeguards:**
  - Pseudonymisation (the Redaction Protocol).
  - k-anonymity ≥ 5 for any aggregate (Cryptographic Communes).
  - HITL review before any claim surfaces.
  - Right-to-erasure (GDPR Art. 17) preserves the audit chain while pseudonymising PII.

## 3. Risk assessment

### 3.1 Risks to data subjects

| Risk | Likelihood | Severity | Mitigation |
|------|------------|----------|------------|
| **PII leak** (name, NI, flat #) | Low | High | Redaction Protocol + tenant isolation |
| **Wrong claim** (false positive) | Medium | High | Consensus gate + HITL review |
| **Bias** (systematic discrimination) | Low | High | Evidence-class caps; no profiling |
| **Tracking** (re-identification) | Low | High | Pseudonymisation out-of-band |
| **Lock-in** (vendor dependency) | Low | Medium | Open-source, self-hostable |
| **Retention drift** (data held too long) | Low | Medium | Retention policy (180d notifications, 7y audit) |

### 3.2 Risks to the system

| Risk | Likelihood | Severity | Mitigation |
|------|------------|----------|------------|
| **Audit chain broken** | Low | High | SHA-256 hash chain + verifier |
| **Database corruption** | Low | Critical | Daily snapshot + off-site backup |
| **Source drift** (statutes change) | High | Medium | Daily spine refresh (live registry) |
| **LLM hallucination** | Medium | High | Codified-first; LLM only for ambiguous cases |

## 4. Mitigations

### 4.1 Technical
- **Pseudonymisation**: see [`src/lib/pseudonym.ts`](../src/lib/pseudonym.ts).
- **RBAC**: see [`project/strategy/rbac-design.md`](../project/strategy/rbac-design.md).
- **Audit hash chain**: see [`src/lib/auth.ts:logAction`](../src/lib/auth.ts).
- **Rate limiting**: see [`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts).
- **Retention policy**: see [`src/lib/retention.ts`](../src/lib/retention.ts).
- **Feature flags**: see [`src/lib/feature-flags.ts`](../src/lib/feature-flags.ts).

### 4.2 Organisational
- **Single Administrator** (Sam). No privileged access for third parties.
- **Out-of-band admin creation** (no API path to create ADMIN).
- **Resident opt-out** at any point in the workflow.
- **Annual review** of this DPIA.

### 4.3 Legal
- **DPA** signed with each partner tenant (`Tenant.dpaSignedAt`).
- **Privacy policy** published at `/legal`.
- **Terms of service** published at `/legal`.

## 5. Data subject rights

| Right | Implementation |
|-------|----------------|
| **Art. 13–14** (information) | Privacy policy at `/legal` |
| **Art. 15** (access) | `GET /api/resident/dossier` |
| **Art. 16** (rectification) | `PATCH /api/resident/dossier` |
| **Art. 17** (erasure) | `POST /api/admin/retention/erase` |
| **Art. 18** (restriction) | Feature flag `rbac_enforcement: false` (deny all writes) |
| **Art. 20** (portability) | Spine export endpoint |
| **Art. 21** (objection) | Feature flag `consensus_gate: false` (no automated decisions) |

## 6. Data Protection Officer (DPO)

- **Designated**: Sam (founder). For a solo-founder pilot, this is
  acceptable under Art. 37(1)(c) only if the processing is "not
  core" and "occasional". Since FreeLeased's *core* activity is
  data processing, this requires re-consideration at the
  institutional tier.
- **Contact**: `dpo@freeleased.invalid` (placeholder).

## 7. International transfers

- **Pilot**: data is local to the engine (SQLite on the operator's device). No international transfer.
- **Institutional tier**: data is stored in the partner's jurisdiction. No data leaves without explicit consent.

## 8. Approval

| Role | Status | Date |
|------|--------|------|
| Founder (Sam) | Approved | 2026-08-12 |
| Legal review (out-of-band) | Pending institutional tier | TBD |
| DPO (Sam) | Approved (pilot only) | 2026-08-12 |

## 9. Review cycle

- **Quarterly**: Sam reviews the DPIA.
- **Annually**: full review with external counsel (post-institutional tier).
- **Triggered**: any change to the data spine, RBAC matrix, or
  retention policy.

## 10. Cross-references

- [`docs/PRIVACY.md`](PRIVACY.md) — privacy policy.
- [`docs/ALGORITHMIC-TRANSPARENCY.md`](ALGORITHMIC-TRANSPARENCY.md) — algorithmic transparency.
- [`project/strategy/rbac-design.md`](../project/strategy/rbac-design.md) — RBAC matrix.
- [`docs/INCIDENT-RESPONSE.md`](INCIDENT-RESPONSE.md) — incident response.
- [`docs/DISASTER-RECOVERY.md`](DISASTER-RECOVERY.md) — backup + recovery.
