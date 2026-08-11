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

### 2.5. Why this matters — the asymmetry (the "why" slide)
The shadow-economy research ([`project/research/truth-shadow-economy.md`](../research/truth-shadow-economy.md:1))
quantifies the cost and information asymmetry the leaseholder faces:

- **Cost asymmetry.** A leaseholder's contested service-charge challenge costs
  £500–£5,000; the freeholder's defence costs £20,000–£200,000 — a **10×–40×
  ratio**. Sources: Property Litigation Association, LKP, Legal 500 (heuristic
  ranges, Tier 2).
- **Information asymmetry.** UK residential property held via shell companies
  was an open policy concern since 2016; ECTA 2022 created the Register of
  Overseas Entities. ICIJ Pandora Papers (2021) exposed offshore ownership
  chains involving 330+ politicians across 90+ countries. Caribbean centres
  (BVI, KY) appear repeatedly as the entity-of-record layer.
- **Corpus of statutes.** LFRA 2024 (in force via SI 2025/131 from 3 Mar
  2025), Leasehold Reform (Ground Rent) Act 2022, ECTA 2022, LRA 1967,
  LRHUDA 1993, LTA 1985 ss.18–30 — the primary-source citation chain that
  FreeLeased encodes (Tier 1, established).
- **The FreeLeased collapse.** A £1,000–£7,000 paralegal dossier collapses to
  £0–£50 of resident time. The 4 deterministic engines + consensus gate
  produce the same first-pass deliverable — primary-source-cited, conviction-
  capped, fairness-flagged.
- **Honest gaps.** The 10 `unverified: true` items in the research doc
  ([`fact-check-register.md` §F.3](../strategy/fact-check-register.md:1))
  are the negative side of the ledger — we did not commit to specific
  CPI scores, FATF grey-list status, or named case citations we couldn't
  source. The pitch rests on the *established* claims, not the gaps.

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
