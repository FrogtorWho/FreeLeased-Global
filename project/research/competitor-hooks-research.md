# Competitor Hooks Research — FreeLeased

> **By Sam Peacock · Founder, FreeLeased**
> **Date:** 2026-08-12 · **Status:** primary-source research
> **Method:** GitHub REST API + raw-content probes + cross-check with past DrivenData / CfC buildathon winners where available
> **Probe logs:** `.shogo/runtime/competitor-probe-results.txt`, `.shogo/runtime/readme-probe-results.txt`, `.shogo/runtime/github-probe-results.txt`
> **Companion:** [`project/strategy/competitive-landscape-deep.md`](../strategy/competitive-landscape-deep.md:1), [`project/research/competitor-pricing-table.md`](competitor-pricing-table.md:1)

This is a **hook analysis**, not a feature comparison. A "hook" is the one
thing a judge remembers about a project 30 seconds after they've left
the booth. We look at 5 publicly-known buildathon-ish entries (CfC and
adjacent) and identify **what makes them memorable**, whether FreeLeased
can adopt the hook, and the cost.

---

## 1. The five competitors

All five were found via GitHub search. Each one is the **top result**
in its respective search. Cited URLs were probed at 2026-08-12T01:17Z.

| # | Project | URL | What it is | CfC entry? |
|---|---|---|---|---|
| C1 | **`jechaviz/future_caribbean_ai_buildathon`** | [`github.com/jechaviz/future_caribbean_ai_buildathon`](https://github.com/jechaviz/future_caribbean_ai_buildathon) | V-lang CLI for "Caribbean Coordination Desk" submission automation | ✅ Yes — **only other public CfC repo** |
| C2 | **`svtgrig-truest/Leasehold-buddy`** | [`github.com/svtgrig-truest/Leasehold-buddy`](https://github.com/svtgrig-truest/Leasehold-buddy) | "AI copilot for leaseholders dealing with management companies" | ❌ No — direct-domain competitor only |
| C3 | **`brightdata/real-estate-ai-agent`** | [`github.com/brightdata/real-estate-ai-agent`](https://github.com/brightdata/real-estate-ai-agent) | "Real estate property data extraction with AI agents + Nebius Qwen LLM + Bright Data MCP" | ❌ No — general proptech |
| C4 | **`drivendataorg/open-ai-caribbean`** | [`github.com/drivendataorg/open-ai-caribbean`](https://github.com/drivendataorg/open-ai-caribbean) | DrivenData 2018-19 "Caribbean disaster-risk mapping from aerial imagery" | ❌ No — past competition |
| C5 | **`hummingbot/condor`** | [`github.com/hummingbot/condor`](https://github.com/hummingbot/condor) | "Open-source harness for creating and managing AI trading agents" | ❌ No — agent-harness pattern reference |

(Plus ourselves: [`FrogtorWho/FreeLeased-Global`](https://github.com/FrogtorWho/FreeLeased-Global).)

---

## 2. Hooks — one per competitor

### C1 — `jechaviz/future_caribbean_ai_buildathon`

**Hook: "Submits itself."** The README documents a `cmd/fcbuild` CLI with
four subcommands — `generate`, `qa`, `form`, `serve` — and gates real
external submission behind `APPLICATION_CONSENT_TO_SUBMIT=yes`. The hook
is **"an AI that applies for the AI buildathon."**

A judge sees:
- V-lang source (rare; stands out)
- A CLI that does submission, QA, form-fill, and serving
- A safety gate (consent env var) on real submission

| Hook attribute | Score (1-5) |
|---|---:|
| Memorability (judge remembers) | 4 |
| Demo-ability (can show in 60 sec) | 5 |
| Defensibility (can't be replicated easily) | 3 |
| Track-fit (Track 9 = AI for Real Estate) | 1 (no real-estate content) |

**Could FreeLeased adopt it?** Partially. We could build
`bun scripts/submit-freeleased.ts` that fills the CfC form from
`project/submission-pack/` markdown files. Effort: ~2 hours.

**Effort to adopt:** ~2 h dev (build a CLI that reads submission-pack and emits form-ready JSON). Already partially in place via `scripts/reconcile-docs.ts`.

---

### C2 — `svtgrig-truest/Leasehold-buddy`

**Hook: "Your leaseholder copilot — text it a question."** This is a
direct-domain competitor. The repo lists
`IMPLEMENTATION_PLAN.md` (33 KB) and `MARKETING_PLAN.md` (8.7 KB) — a
single dev who published the plan first, code second.

A judge sees:
- **Plain-English hook** ("AI copilot for leaseholders")
- Plan-then-build (marketing-first)
- Generic, not Caribbean-specific

| Hook attribute | Score (1-5) |
|---|---:|
| Memorability | 4 |
| Demo-ability | 4 (Q&A interface is easy to demo) |
| Defensibility | 2 (any LLM-with-RAG can do this) |
| Track-fit | 2 (UK-only, no Caribbean) |

**Could FreeLeased adopt it?** Yes — the **chat-with-your-lease** UI is a
strong demo surface. We already have provenance-tracked dossier output;
an LLM-on-top-of-dossier Q&A box would be a 30-min add. Effort: ~30 min
for a chat-with-dossier MVP (the harder part is the LLM key, which is
gated).

**Effort to adopt:** ~30 min to build `QABot.tsx`; ~1 day to wire it to a real LLM.

---

### C3 — `brightdata/real-estate-ai-agent`

**Hook: "Real-estate data, structured, with provenance."** This is the
closest functional analog to our dossier pipeline. They use **CrewAI +
Nebius Qwen LLM + Bright Data MCP** for property-data extraction with
strict JSON schema.

A judge sees:
- **Sponsor names in the stack** (Bright Data, Nebius) — judge recalls the brands
- "AI agents" labelled (matches our terminology)
- Schema-validated JSON output (matches our provenance spine)
- Real-estate extraction (matches our dossier output)

| Hook attribute | Score (1-5) |
|---|---:|
| Memorability | 3 (looks like an ad for Bright Data) |
| Demo-ability | 4 |
| Defensibility | 2 (vendor-dependent: Bright Data + Nebius) |
| Track-fit | 3 |

**Could FreeLeased adopt it?** Partially. Their **schema-validated
JSON** discipline is what we already do; their **sponsor stack** is
their moat but also their fragility. We have a similar stack in
`src/lib/llm.server.ts` (Nebius → Giotto → MiniMax → local) per
[`100-judge-gap-report.md:189`](../strategy/100-judge-gap-report.md:189).

**Effort to adopt:** Already adopted (multi-model fallback chain lives in `src/lib/llm.server.ts`). What we'd add: explicit **"data source" provenance per claim** in the dossier UI.

---

### C4 — `drivendataorg/open-ai-caribbean`

**Hook: "Satellite imagery of Caribbean rooftops → disaster-risk map."**
This is a **prior** Caribbean-AI competition (2018-19), run by DrivenData
+ World Bank Global Program for Resilient Housing + WeRobotics. They
trained CNNs to classify roof materials from drone imagery across St.
Lucia, Guatemala, and Colombia.

A judge sees:
- **Past track record** of Caribbean-AI being solvable with imagery
- **World Bank + WeRobotics partnership** (credibility halo)
- **Roof-material classification** as a clear, single-task ML benchmark
- Public winning code in MIT-licensed repo

| Hook attribute | Score (1-5) |
|---|---:|
| Memorability | 5 (visceral: "I can see the rooftops") |
| Demo-ability | 5 (image classification demos beautifully) |
| Defensibility | 4 (real-world deployment data) |
| Track-fit (CfC) | 4 (Caribbean-AI alignment) |

**Could FreeLeased adopt it?** Selectively. The **roof-imagery**
approach is for housing-safety (climate-resilience), not leasehold
rights. But the **partnership halo** (World Bank, WeRobotics) is
replicable through our MoU network. The **"winning code is open"**
discipline is already ours (Apache-2.0 in [`LICENSE`](../../LICENSE:1)).

**Effort to adopt:** The partnership halo is already in flight (7 MoU partners drafted). The "see it work" demo moment is what we lack — see BATCH 4 §3.

---

### C5 — `hummingbot/condor`

**Hook: "Telegram bot that trades for you, controlled by an AI agent
over MCP."** Condor is the most architecturally similar project to us —
an open-source **agent harness** that lets humans and AI agents
co-control real-money trading bots via Hummingbot API.

A judge sees:
- **Telegram-as-UI** (mobile-first, ubiquitous)
- **MCP (Model Context Protocol) integration** for AI tools
- **OpenClaw-style multi-agent** orchestration (matches our agent swarm)
- **Real money at stake** (instant credibility)
- **Tailscale** for production security (we use a similar "sovereign" framing)

| Hook attribute | Score (1-5) |
|---|---:|
| Memorability | 5 ("AI agent trades real money on Telegram") |
| Demo-ability | 5 (Telegram bot demos in 30 sec) |
| Defensibility | 5 (real money = real validation) |
| Track-fit (CfC) | 1 (trading, not real-estate) |

**Could FreeLeased adopt it?** Selectively. The patterns are adoptable:
- **MCP integration** for our LLM calls — yes, ~1 day to wrap our `src/lib/llm.server.ts` in MCP
- **Telegram/WhatsApp/SMS interface** — yes, this is how Caribbean leaseholders would actually access the tool (mobile-first), but adding it requires a Twilio/Telegram bot token
- **"Real consequences" framing** — yes; we could position as "audits that produce tribunal-grade PDF exports"

**Effort to adopt:** MCP integration ~1 day; Telegram bot ~2 days; the "real consequences" framing is a copy change.

---

## 3. Synthesis — the hook patterns

Across C1-C5, the **hook patterns that score high** (≥4 on memorability):

| Pattern | Example | Adoptable? | Effort |
|---|---|---|---|
| **Real consequences** (real money / real estate / real court) | C5 (trading), C4 (disaster-risk) | Yes — for us, "tribunal-grade PDF" or "RTM-eligibility verdict" | 1 day |
| **Mobile-first / ubiquitous interface** | C5 (Telegram) | Yes — Caribbean = mobile | 2 days |
| **See-it-work moment** | C4 (aerial imagery) | Yes — we need 1 visualised output | 4 h |
| **Self-applying / self-building AI** | C1 (submits itself) | Yes — submission CLI | 2 h |
| **Sponsor halo** (named partners in stack) | C3 (Bright Data, Nebius) | Yes — we have Nebius, Giotto, OllyGarden, MiniMax, Impala | copy change |
| **Plan-then-build, code-public** | C2 (IMPLEMENTATION_PLAN.md + MARKETING_PLAN.md) | Already ours | done |
| **Open-source everything, MIT/Apache** | C4 | Already ours (Apache-2.0) | done |

---

## 4. FreeLeased's current hooks vs. theirs

### 4.1 What we already hook on (verified)

From [`project/strategy/competitive-landscape-deep.md`](../strategy/competitive-landscape-deep.md:1) and our submission docs:

| Hook | Evidence |
|---|---|
| **Provenance-native** | Every claim has 5-tuple provenance + evidence class |
| **$0 compute** | Deterministic-first, LLM fallback |
| **HITL sign-off queue** | `src/lib/signing.ts`, surfaced in `Competition` tab |
| **9-jurisdiction Caribbean spine** | Cayman/Barbados/Jamaica + UK |
| **Honesty engine** | TruthDiff + Veracity + Fact-check-register |
| **No overclaiming** | Compliance-statement-v3 + threat model + privacy/terms published |

### 4.2 What hooks we *could* add in 1-2 hours

| Adoptable hook | Effort | Impact |
|---|---|---|
| **Self-submitting CLI** (`bun scripts/submit-freeleased.ts` reads submission-pack/*.md → emits form JSON) | ~2 h | Closes the "AI that applies" pattern; very memorable |
| **Demo visual moment** (one screenshot of a dossier with 9 jurisdictions visible) | ~30 min | Closes the "see it work" pattern |
| **Sponsor-stack mention** (Nebius, Giotto, MiniMax, Impala, OllyGarden, Boardy — all named partners) | ~15 min (copy) | Closes the "sponsor halo" pattern |
| **"Chat with your dossier" Q&A box** | ~30 min UI shell, ~1 day to wire to LLM | Closes the "Q&A interface" pattern (C2's hook) |
| **MCP wrap of `src/lib/llm.server.ts`** | ~1 day | Closes the "MCP integration" pattern (C5's hook) |

### 4.3 The 1-click wins (best ROI)

1. **Sponsor-stack callout** — 15 min, copy change. Already in our docs.
2. **Demo visual moment** — 30 min, screenshot or rendered SVG from existing pipeline output.
3. **Self-submitting CLI skeleton** — 2 h, shows the "AI that applies" hook in 30 sec.

---

## 5. The 3 anti-hooks (what we must avoid)

| Anti-hook | Why it hurts | Avoidance |
|---|---|---|
| **"Just ChatGPT with a lease"** | Judges score 5-7 | Show 40+ statute citations + provenance per claim |
| **"Looks like a SaaS dashboard"** | Judges score 5-7 | Leasehold-governance framing + HITL queue + sign-off audit trail |
| **"It's a wrapper around X"** | Judges score 5-7 | Deterministic-first, $0 compute, evidence-class system |

---

## 6. Action — adopt one hook today

**Decision:** Adopt **C1's "submits itself" hook** in 2 hours, because:

- Highest memorability-to-effort ratio
- Aligns with our **honesty engine** (consent-gated, dry-run default)
- Reuses existing `scripts/reconcile-docs.ts` + submission-pack markdown
- Directly demonstrable in the 3-5 min demo (judge watches the CLI fill the form)

**Plan:** Add `scripts/submit-freeleased.ts` that:
1. Reads `project/submission-pack/*.md`
2. Emits form-ready JSON to stdout (default)
3. Optionally POSTs to the CfC portal (gated by `APPLICATION_CONSENT_TO_SUBMIT=yes` + non-placeholder applicant fields — same pattern as C1)

This action is taken in §7 of BATCH 4 / POST-RESEARCH below.

---

## 7. Probe-log citations

- GitHub search: `?q=freeleased` → 1 result (us) + 8 CfC-buildathon-tagged repos
- GitHub search: `?q=leasehold+ai` → 2 results (C2 + another)
- GitHub search: `?q=condo+ai` → 104 results (top: hummingbot/condor = C5)
- GitHub search: `?q=ai+real+estate+agentic` → 1104 results (top: brightdata = C3)
- GitHub search: `?q=caribbean+ai` → 88 results (top: drivendata = C4)
- GitHub search: `?q=leasehold+RTM` → 0 results (we own this term)
- GitHub search: `?q=freeholder+ai` → 0 results

**Method note.** All URLs cited were probed on 2026-08-12T01:17Z. Where
the URL returned 404 (e.g., `surge.sh`, `docs.fly.io`) or DNS-failed
(e.g., `futurecaribbean.dev`), this is recorded in the probe logs.

---

*Generated 2026-08-12. Reconciles to [`scripts/reconcile-docs.ts`](../../scripts/reconcile-docs.ts:1) (last run: 10/10 PASS).*