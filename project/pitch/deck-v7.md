# FreeLeased — Pitch Deck (v7)

Twelve slides, tuned to the five-judge panel and the two weakest simulated
sub-criteria (compute efficiency, human-in-the-loop). One idea per slide.

---

### 1. Title
**FreeLeased** — The intelligence layer for a single Caribbean property market.
Solo founder. Built in public on the Buildathon stack.

### 2. The problem (for Vince Fong, Sherika Herbert)
Caribbean property is opaque and fragmented across ~13 jurisdictions. Paper
records, registries that do not talk, mispriced climate risk, and residents who
cannot tell if a lease is even legal. Capital stalls; households are exposed.

### 3. The insight
There is no land-data API in the Caribbean. So the constraint became the design:
assemble a provenance-tracked spine from public data, and earn the rest through
registry partnerships.

### 4. The product (three layers)
Data spine → agentic verification loop → Lease & Contract Fairness Check. One
engine that values land and protects tenants.

### 5. Honest by design (for Dr. Auguste)
Every output carries an evidence class that caps its confidence. The system
abstains rather than fabricates. Honesty is enforced in code, not prompt wording.

### 6. Agentic architecture + HITL (weak sub-criterion: HITL)
Research, verify, gate, human sign-off. The sign-off is a visible, required step.
Opt-out, appeal, and a one-call kill-switch. Traced end to end with OllyGarden.

### 7. Efficient use of infra (weak sub-criterion: compute efficiency)
Small open model via Impala, MiniMax for redundancy, Nebius/H200 for batch jobs.
Provider-aware routing keeps inference cheap. Built entirely on the event's own
stack.

### 8. Defensibility (for Bill Tai)
Provenance-tracked, multi-jurisdiction data spine + registry relationships +
verification IP. A data network effect: each jurisdiction makes the whole worth
more. Not reproducible by prompting a model.

### 9. Business model & unit economics (for Michele Romanow)
Pro seats (agencies, developers, lenders) + data-spine API + self-hosted
government tier (data sovereignty) + free consumer tier. Marginal cost is cheap
inference; the expensive registry integration amortises across every seat.

### 10. Go-to-market (for Bill Tai, Michele Romanow)
Beachhead in one jurisdiction (Barbados or Trinidad and Tobago). Land-intelligence
wedge pays the bills; the free Fairness Check builds trust and policy goodwill.
Expand registry by registry.

### 11. Traction & roadmap
Live Fairness Check API. MoU letters drafted to seven national registries.
Validation quotes from proptech and Caribbean real-estate contacts. Portable to
the Pacific, West Africa, and Southeast Asia.

### 12. Ask & close
A category-defining company for a region ready to move as one market. Built solo,
in public, responsibly, on Caribbean-provided infrastructure. Live link + repo.

---

## Per-judge one-liners (for Q&A)
- **Bill Tai:** "The moat is a data network effect across sovereign registries; it compounds."
- **Vince Fong:** "It lowers regulatory burden and is appealable and human-gated by design."
- **Michele Romanow:** "Cheap open-model inference, high-value government licences; margin grows per jurisdiction."
- **Dr. Auguste:** "It refuses to guess. Confidence is capped by evidence class."
- **Sherika Herbert:** "Data stays in-country, and an ordinary resident gets a lawyer-grade lease check for free."
