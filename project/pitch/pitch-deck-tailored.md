# Pitch Deck Content: FreeLeased

**Tailored to:** Todd Speece (Citi), Darlington Akogo (Mino Health), Spencer Powers (DRW), Olumide Durotoluwa (M-KOPA)
**Duration:** 3–5 minutes (live demo is the centrepiece)
**Format:** Minimal slides + live screen share

---

## Slide 1 — Title Card (10 seconds)

**FreeLeased** 🏠
Open-source leasehold governance for Caribbean residents
Sam Peacock · Future Caribbean Buildathon: AI for Real Estate & Development

---

## Slide 2 — The Problem (30 seconds)

**4.6 million** UK leaseholders have statutory rights to manage their buildings.
**308,000** Caribbean condominium units have **zero** digital governance tools.
Existing RTM firms charge **£500–£5,000** per case.

> **For Todd (Citi):** This is a $6.6B TAM with a policy tailwind — the UK's Leasehold and Freehold Reform Act 2024 creates surge demand through 2028.
> **For Spencer (DRW):** White space. No competitor in leasehold governance. Caribbean is completely greenfield.

---

## Slide 3 — The Product (60 seconds)

**What it does:** Paste a lease → get a full audit in under 500ms.
- Clause-by-clause fairness scoring against statute
- Hidden rights discovery (20 statutory protections most residents don't know)
- Consensus gate requiring human validation before any claim surfaces
- Full provenance chain on every data point

**What it doesn't need:** API keys. GPU clusters. Cloud databases. Inference budget.
**Compute cost: $0.** All deterministic. Local SQLite.

> **For Darlington (Mino):** The build journey — we started with an LLM-first approach, hit the cost wall, pivoted to deterministic-first. The architecture IS the story.
> **For Olumide (M-KOPA):** The UX is paste-a-lease, click-a-button, get-a-result. One screen. One action. Zero friction.

---

## Slide 4 — Live Demo (90 seconds)

**Switch to screen share. Open the Live Demo tab.**

1. Paste the synthetic lease text
2. Click "Hidden Rights Sweep" → 3 rights discovered
3. Click "Fairness Check" → 4 high-severity flags
4. Click "Consensus Gate" → divergent verdict routed to human review

> **Talking point for all judges:** "Each button calls a live API endpoint. No mock data. No pre-recorded responses. This is the actual engine."

---

## Slide 5 — Architecture + Agent Team (30 seconds)

**Solo founder + 5 AI agents = team of 6.**

| Agent | Role | What it does |
|-------|------|-------------|
| fl-craft-review | Audit | Reviews all UI code for quality |
| fl-dataviz | Data Viz | Builds dashboards and charts |
| fl-schema | Schema | Structures the data spine |
| fl-verify | Gatekeeper | Verifies builds before deploy |
| fl-integrations | Integration | Manages external connections |

**4 engines:** Fairness, Consensus, Veracity, Research. All deterministic. Part of the 1,583+ test corpus.

> **For Spencer (DRW):** The multi-agent coordination is structural, not decorative. Each agent has a system prompt, allowed tools, and a quality bar. Cross-agent verification is the defensibility.

---

## Slide 6 — Business Model (30 seconds)

| Tier | Price | Target |
|------|-------|--------|
| Free | $0/yr | Individual leaseholder |
| Pro | $120/yr | Active RTM participant |
| Manager | $49/unit/yr | Property managers |
| Enterprise | $5K–50K/yr | Housing associations |

**Unit economics:** $15 CAC, $240 LTV, 16:1 ratio, 92% gross margin
**SOM:** $600K Year 1 → $4.5M Year 3

> **For Todd (Citi):** Venture-scale margins. Free tier costs us nothing. Powertranz partnership gives Caribbean payment rails from Day 1.

---

## Slide 7 — Caribbean + MoU (20 seconds)

**9 jurisdictions shipped. MoU conversations in flight (none signed).**

UK · Barbados · Jamaica · Cayman Islands · Trinidad & Tobago · BVI (ISO: VG) · Bahamas · Guyana · Belize

**$10.7M annual Caribbean market.** No competitor. First mover.

> **For Olumide (M-KOPA):** This is how M-KOPA scaled — start with one market, prove the model, expand regionally. Same playbook.

---

## Slide 8 — Ask (10 seconds)

**FreeLeased is open-source, Apache 2.0.**
Try it: [URL]
Source code: [GitHub URL]

We're raising to go from TRL 5 to TRL 7 — production pilot with a Caribbean government agency.

> **For Spencer (DRW):** The data spine is the moat. 9 jurisdictions × 40+ statutes × 40+ sources with provenance. Plus 4 crypto / AI primitives (WebAuthn, Paillier homomorphic encryption, Jaccard deduplication, Shannon entropy) that no competitor ships. No one else has this.

---

## Judge-Specific Notes

### Todd Speece (Citigroup — Head of VC Coverage)
- **Cares about:** Business model, revenue path, unit economics
- **Lead with:** $0 compute, TAM/SAM/SOM, Powertranz payments gateway
- **Will probe:** Unit economics hard. Have the numbers ready.
- **Kill if:** Can't articulate the revenue path beyond "freemium"

### Darlington Akogo (Mino Health — Founder & CEO)
- **Cares about:** Execution, innovation, founder credibility
- **Lead with:** The build journey — what you tried, what you discarded, why deterministic-first
- **Will probe:** Working code. Want to see it run live.
- **Kill if:** Demo doesn't work on a cold load

### Spencer Powers (DRW — Head of Special Investments)
- **Cares about:** Defensibility, scale, alternative investments
- **Lead with:** Data spine as moat. Jurisdiction-agnostic architecture. Provenance chain.
- **Will probe:** Competitive landscape. Who else is in proptech/regtech?
- **Kill if:** Can't explain why a well-funded competitor couldn't replicate this in 6 months

### Olumide Durotoluwa (M-KOPA — Senior Product Manager)
- **Cares about:** Real-world utility, product-market fit, UX
- **Lead with:** The resident experience — paste a lease, get a result. One screen.
- **Will probe:** UX polish and real user flows
- **Kill if:** Demo is confusing or requires explanation

---

## Pre-Pitch Checklist

- [ ] Preview URL warmed and responding
- [ ] All 3 demo buttons tested
- [ ] Pitch timed at under 4 minutes
- [ ] Backup screenshots if demo fails
- [ ] Numbers memorised (TAM, SOM, LTV:CAC, margin)
- [ ] GitHub repo public with README
- [ ] Compliance statement finalised
