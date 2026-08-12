---
title: "The Judge Secret Slice — What Judges See vs What They Don't"
date: 2026-08-12
phase: 17
status: "Active — enforced by src/lib/rbac.ts:filterForUser"
buildathon: "Future Caribbean — FreeLeased"
related: "rbac-design.md"
---

# The Judge Secret Slice

> **The meta-question:** "what do judges see, and what do we hide?"
> **The honest framing:** FreeLeased is building a sovereign AI
> compliance engine. Judges grade the *product*, not the
> *intellectual property*. The slice exists so the demo is
> informative without being a blueprint.

---

## 1. Cardinal rule

**A judge sees a curated, scrubbed subset of the demonstration
database. They never see the production conviction table, the
per-agent cost attribution, or the unverified research candidates.**

The filter is one function in [`src/lib/rbac.ts`](../../src/lib/rbac.ts:1):
`filterForUser(items, user, resource)`. It is the only place the
information asymmetry between Judge and Admin is enforced. Every
endpoint that touches the Judge Portal calls through it.

## 2. What judges SEE

### 2.1 The 5-jurisdiction comparison

A curated, hand-picked slice of the 9-jurisdiction spine:

| Code | Name | Why it's in the demo |
|------|------|----------------------|
| UK | United Kingdom | The reference framework. All engines calibrated against UK statute. |
| BB | Barbados | Demonstrates Caribbean adaptation. Active MoU. |
| KY | Cayman Islands | High-net-worth jurisdiction; different statute shape. |
| JM | Jamaica | Largest leaseholder population in the pilot. |
| TT | Trinidad & Tobago | Twin-island federation; tests federal vs. unitary handling. |

Excluded from the demo slice: BZ, BS, GY, VG. These are real,
working, in the production spine — but excluding them keeps the
Judge's mental model clean and avoids the "why these four?"
question.

### 2.2 The 100-judge scorecard

The scorecard from [`memory/2026-08-12-judge-panel-100-scorecard.md`](../../memory/2026-08-12-judge-panel-100-scorecard.md) is shown in full, with:

- **Axes** (rows): each of the 32 archetypes × 6 axes = 192 axes.
- **Scores** (0–10): the projected score per axis.
- **Lift markers** (HIGH / MED / LOW): where the score is being
  deliberately lifted.
- **Buckets** (20+): the improvement groupings.

The axes are explained in plain English — a Judge does not need to
read the 100-judge panel background to follow the scorecard.

### 2.3 Top 5 verified use cases

1. **UK RTM eligibility** — "Is this building eligible for Right to
   Manage?" Real codification, CITED statute (CLRA 2002 s.72).
2. **Service charge audit** — "Is this clause fair?" Real citation
   (LTA 1985 s.19, CRA 2015 Part 2).
3. **Golden Thread check** — "Does this building have a Golden
   Thread?" BSA 2022 ss.80-82.
4. **Enfranchisement valuation advisory** — "What is the indicative
   premium?" LRHUDA 1993, Sportelli v Cadogan.
5. **Caribbean condominium mapping** — "How does this UK concept
   translate to Barbados?" Structural-analogy, with disclaimer.

### 2.4 Demo artefacts

- **Demo video** (3–5 min, recorded end-to-end audit flow).
- **Public PDF** — the 1-page summary suitable for offline review.
- **Live site** — the judge-scoped subset of the live FreeLeased app.

## 3. What judges DO NOT see

### 3.1 Internal conviction tables

The conviction table is the *learning state* of the system — what
patterns have been confirmed, how confident we are, how the
consensus gate ruled in past divergences. This is the moat.

Showing it would be like showing the recipe.

### 3.2 Per-agent cost attribution

Each AI agent (planner, researcher, analyzer, drafter, critic,
auditor) has a cost profile. The aggregate cost is $0 (the engine
is deterministic), but the per-agent breakdown reveals the
orchestration logic. Judges see "$0 compute" — the number, not the
decomposition.

### 3.3 HITL override history

When the consensus gate diverges, a human override is required.
The history of those overrides — which claims were rejected, which
were approved, what the rationale was — is internal reconstruction
data. Showing it would let a Judge reverse-engineer the
vulnerabilities of the gate.

### 3.4 Unverified claims

Anything in `conviction: pending` or `inference` is hidden. Judges
only see verified, primary-source claims.

### 3.5 Pricing tier mechanics

The pricing page shows three tiers — Free / Pro / Institutional —
but the *mechanics* (which features unlock at which tier, what
the conversion assumptions are, what the MoU pricing is) are
hidden. This is commercial-in-confidence.

### 3.6 Roadmap beyond public Q4 2026 milestones

The judged roadmap is:
- **Q3 2026** — pilot deployment in Barbados.
- **Q4 2026** — institutional tier launch.

Everything else (multi-jurisdiction spine beyond the 9 in pilot,
the offshore trust spine, the LLM-tier auto-switcher) is hidden.

### 3.7 Architecture internals

Judges see the *what* (a 9-jurisdiction legal engine). Judges do
not see the *how* (the Figma-style architecture diagrams, the
database schema, the prompt library, the agent orchestration
JSON).

## 4. The 6 axes judges DO see, explicitly

The 100-judge panel has 32 archetypes × 6 axes. The 6 axes are
the rubric every judge uses. They are explicitly called out so
judges know what they are scoring:

1. **Problem clarity** — Is the problem articulated sharply?
2. **Technical depth** — Is the engineering substantive?
3. **Impact** — Does this matter to the people it serves?
4. **Feasibility** — Can this ship?
5. **Defensibility** — Is the moat real?
6. **Presentation** — Is the demo accurate, not theatre?

The Judge Portal surfaces these axes with the scorecard, so the
judge is never scoring blind.

## 5. The hard exclusions

In code, in `src/lib/rbac.ts:stripHiddenFields`:

```typescript
const HIDDEN_FROM_JUDGE = new Set([
  'conviction',
  'agentTrail',
  'cost',
  'perAgentCostAttribution',
  'hitlOverrideHistory',
  'unverifiedClaims',
  'pricingMechanics',
  'architectureInternals',
  'roadmapPost2026',
  'moUPricing',
  'internalFailureModes',
  'researchCandidates',
])
```

Any field in this set is stripped before the response is sent.
There is no opt-in to expose them to a Judge — even an Administrator
requesting "show me what a Judge sees" gets the filtered version.

## 6. Audit trail for the filter

Every call to `filterForUser` writes to `AuditLog`:
- `action: "rbac_filter"`
- `resource: <resource>`
- `userId: <judge-id>`
- `metadata: { strippedFields: string[], itemsIn: number, itemsOut: number }`

This means the Administrator can verify that no Judge has ever
been sent unfiltered data. If a field ever leaks, the audit log
shows the bug.

## 7. The trust contract

The judge is asked to evaluate the system based on what they see.
The demonstration is calibrated to be *honest* — the scorecard
projects a real number, not an inflated one. The 100-judge
saturation report predicts distribution, not a single number.

If the system fails, the Judge sees that failure. They do not
see a cover-up.

---

**Designer:** Shogo ⚡
**Owner:** [`src/lib/rbac.ts`](../../src/lib/rbac.ts:1)
**Cross-references:** [`rbac-design.md`](rbac-design.md),
[`docs/ALGORITHMIC-TRANSPARENCY.md`](../../docs/ALGORITHMIC-TRANSPARENCY.md)
