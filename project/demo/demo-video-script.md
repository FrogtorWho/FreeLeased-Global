# Demo Video Script — FreeLeased (Shot-by-Shot)

**Duration:** 4:00 hard cap (target 3:45 to leave 15s buffer)
**Format:** 1080p screen recording + voiceover (USB mic, quiet room)
**Owner:** Sam records · Agent scripts + times
**Due:** Day 16 (Day 15 internal)
**Honest disclosure:** Every flag shown in this demo is from the real Fairness Check engine. The lease text is the synthetic fixture at [`project/demo/sample-lease.txt`](sample-lease.txt) — the *processing* is real, the *lease* is not.

---

## How to read this doc

Each shot has:
- **T** — timestamp (when the visual starts).
- **Δt** — shot duration.
- **Visual** — exact frame composition.
- **Sam VO** — verbatim narration.
- **Caption** — on-screen text (closed-caption friendly).
- **Beat** — why this shot matters for the rubric.

---

## Shot 0 · Title card (0:00–0:08)

| Field | Value |
|---|---|
| T | 0:00 |
| Δt | 8s |
| Visual | Black frame → fade in: "FreeLeased · The intelligence layer for Caribbean property governance · FreeLeased.app · Apache 2.0" in Veridian (peacock dark, serif H / sans body). Quiet 808 hi-hat on the downbeat. |
| Sam VO | (silent — the title does the work) |
| Caption | n/a |
| Beat | Brand pack ships 5 identities; the default is Veridian. Judges see craft instantly. |

---

## Shot 1 · The Problem (0:08–0:32)

| Field | Value |
|---|---|
| T | 0:08 |
| Δt | 24s |
| Visual | Browser tab opens. Google search: `right to manage leaseholder`. Scroll through 8 results — law firms, government PDFs, forums. Cut to a second browser tab: `condominium law Barbados`. Cut to a third: `Caribbean land registry API`. Each returns nothing useful. |
| Sam VO | "Four point six million UK leaseholders have statutory rights to take over the management of their building — Right to Manage, lease extension, enfranchisement. Most never claim them, because the information is scattered across law-firm sites, government PDFs, and forums. In the Caribbean, there are zero digital tools for leasehold governance — three hundred and eight thousand units across eight jurisdictions, no API, no spine. We built FreeLeased to fix that." |
| Caption | Lower-third: "4.6M UK leaseholders · 308K Caribbean units · 8 jurisdictions · 0 APIs" |
| Beat | Opens with market size, not architecture. Investor judge hears TAM immediately. |

---

## Shot 2 · Live Audit — Sweep (0:32–1:02)

| Field | Value |
|---|---|
| T | 0:32 |
| Δt | 30s |
| Visual | FreeLeased.app → "Live Demo" tab. The text box pre-populated with [`project/demo/sample-lease.txt`](sample-lease.txt). Cursor clicks **Hidden Rights Sweep**. Numbers tick: 8 clauses → 3 rights found → 0 inference calls → $0.00 spend. |
| Sam VO | "Watch this. I paste in a lease clause — a standard UK Assured Shorthold Tenancy with eight deliberately unfair clauses. One click. The hidden-rights sweep checks the text against twenty statutory patterns, deterministic and free. Three rights discovered. Zero inference calls. Zero compute cost." |
| Caption | "Deterministic · 0 LLM calls · $0.00 · 8 clauses → 3 rights" |
| Beat | First proof of $0 compute. Romanow's axis lights up here. |

---

## Shot 3 · Live Audit — Fairness (1:02–1:30)

| Field | Value |
|---|---|
| T | 1:02 |
| Δt | 28s |
| Visual | Same screen → click **Fairness Check**. A list of flags appears. Each row has: rule, severity colour, evidence class, confidence, statute citation. Highlight the top three: "Entry without notice — high — established — 0.90 — Quiet enjoyment covenant"; "Waive repairs — high — established — 0.85 — Implied covenant"; "Retaliatory eviction — high — heuristic — 0.70 — Security of tenure". |
| Sam VO | "Now the fairness engine — and this is where it gets sharp. Five flags on this lease. Three are high-severity: an entry-without-notice clause that violates quiet enjoyment, a repair waiver that the statute says is non-waivable, and a clause permitting eviction in response to a complaint — that's retaliatory eviction, unlawful in most jurisdictions. Each flag carries an evidence class — established, heuristic, contested — that caps how confident the system claims to be. Honesty is a feature, not a bug." |
| Caption | Sidebar: "Evidence classes: established 0.99 · heuristic 0.75 · contested 0.60 · unfalsifiable 0.33" |
| Beat | Hits A4 (HITL) and A2 (multi-agent) at once — every flag is a candidate for review, not a verdict. |

---

## Shot 4 · Live Audit — Consensus gate (1:30–1:52)

| Field | Value |
|---|---|
| T | 1:30 |
| Δt | 22s |
| Visual | Click **Consensus Gate**. The screen splits into "codified" and "agentic" columns; a third column lights up red on one row with "DIVERGENT — routed to human review". A panel on the right: "Sign-off queue: 1 HITL-required · 4 surface · 0 abstain". |
| Sam VO | "Here's where the agent team earns its keep. The codified engine checks each claim against statute. A RAG-agentic estimator cross-checks it. They disagree on the entry clause — the gate routes that one to human review. The other four surface with their capped confidence. The system never makes a final decision for the resident. The consensus gate routes; humans rule." |
| Caption | "HITL first-class · Sign-off queue · Resident appeal path" |
| Beat | Vince Fong's A4 axis is closed here. The HITL path is *visible*, not buried in a toast. |

---

## Shot 5 · Architecture swim-lane (1:52–2:18)

| Field | Value |
|---|---|
| T | 1:52 |
| Δt | 26s |
| Visual | Cut to the Build tab. The architecture view shows four dossier agents (Resident Status, Tenure + Building, Contracts, Hidden Rights) as four lit-up cards. Each card shows its DS gauge (data-sufficiency), its belief/plausibility pair, and its matched-right count. A horizontal animation shows data flowing left-to-right. |
| Sam VO | "Four engines, all deterministic. Resident status resolves the holder in the land registry. Tenure and building checks fire compliance and hurricane hazard. Contracts checks service-charge consultation under section twenty. Hidden rights aggregates everything against the pattern library. Each agent emits a Dempster-Shafer belief interval — not a yes/no — and the consensus gate takes the weakest of two. Forty plus statutes, forty plus sources, all with provenance. Twenty-five test files, two hundred and thirty-one tests, all green." |
| Caption | "4 agents · DS gauge · 40+ statutes · 40+ sources · 231 tests green" |
| Beat | Castleman / Chami cluster: architecture + rigour in one shot. |

---

## Shot 6 · Multi-agent + the swarm (2:18–2:42)

| Field | Value |
|---|---|
| T | 2:18 |
| Δt | 24s |
| Visual | Cut to the Agents tab. Five cards: fl-craft-review, fl-verify, fl-dataviz, fl-schema, fl-integrations. Each shows recent activity (last 24h). fl-craft-review has just reviewed a PR; fl-verify has just gated a schema change. A small live counter in the corner: "Agents active in last 60s: 5/5". |
| Sam VO | "I'm a solo founder — but I'm not working alone. Five AI agents: craft-review audits my code, verify gates my schema, dataviz builds the dashboards, schema structures the data. The agent team pattern IS the multi-agent demonstration. We don't have a team of fifty engineers. We have one advocate operating a system that does the work of a firm, with five specialised agents who never sleep and never forget." |
| Caption | "Solo founder · 5 AI agents · 'one advocate operating a system'" |
| Beat | Reshapes B1 (Team Quality) — turns the solo-founder risk into a thesis. |

---

## Shot 7 · Business — TAM + Unit econ (2:42–3:08)

| Field | Value |
|---|---|
| T | 2:42 |
| Δt | 26s |
| Visual | Cut to the Business tab. A bar chart of TAM/SAM/SOM (55M households global / $6.6B annual / $26M SOM / $600K Y1 target). Below it: a one-pager with the unit-economics table — 92% gross margin, 16:1 LTV:CAC, $0 marginal cost. |
| Sam VO | "The market: fifty-five million leasehold households globally. Six point six billion dollars annual TAM. Our year-one serviceable obtainable market: twenty-six million. Conservative projection: six hundred thousand in year one, scaling to four point five million by year three. Unit economics: sixteen-to-one LTV-to-CAC. Ninety-two percent gross margin. Free tier costs us nothing — Tier-one codified, deterministic, zero inference. We're not selling AI; we're selling peace of mind at scale." |
| Caption | "55M HH · $6.6B TAM · $26M SOM · 16:1 LTV:CAC · 92% gross margin · $0 marginal" |
| Beat | Bill Tai + Speece cluster — TAM/SOM/LTV in a single shot. |

---

## Shot 8 · Caribbean + 7 MoU partners (3:08–3:26)

| Field | Value |
|---|---|
| T | 3:08 |
| Δt | 18s |
| Visual | A map of the Caribbean. Nine jurisdiction pins light up in sequence: BB, JM, KY, TT, GY, BZ, BS, BVI, VG. A side panel: "MoU partners on record: 7". Logos: anonymised as "Barbados Land Tax · Jamaica Housing Agency · Cayman Enterprise City · Trinidad Ministry of Housing · Guyana Central Housing · Belize Lands Dept · BVI Development Authority". |
| Sam VO | "Eight Caribbean jurisdictions mapped, with seven government MoU partnerships on record. The Caribbean is white space — no digital leasehold governance tool exists. We're first. The provenance-tracked spine covers UK plus eight Caribbean territories, with the same engine and the same evidence-class discipline." |
| Caption | "9 jurisdictions · 7 MoU partners · White space, not red ocean" |
| Beat | Moses / Hill / Kirkconnell cluster — Caribbean sovereignty + institutional anchor. |

---

## Shot 9 · Closing — the Ask (3:26–3:52)

| Field | Value |
|---|---|
| T | 3:26 |
| Δt | 26s |
| Visual | Back to the main dashboard. The sprint progress bar at 100%. Test results: "231/231 PASS". Engines green. URL overlay bottom-centre: `FreeLeased.app`. Fade to the URL on a clean Veridian background. |
| Sam VO | "FreeLeased is open source, Apache two point zero, built on a stack any government agency can run on a laptop. Zero compute cost. Zero cloud fees. Resident-led, not AI-led. The consensus gate ensures no automated decision is ever final. Try it. Paste your own lease. See what rights you're missing. This is what happens when you build for residents, not investors. Thank you." |
| Caption | URL: **FreeLeased.app** · GitHub: `github.com/freeleased` · Apache 2.0 |
| Beat | The single highest-leverage shot for memorability — judges remember the URL. |

---

## Shot 10 · End card (3:52–4:00)

| Field | Value |
|---|---|
| T | 3:52 |
| Δt | 8s |
| Visual | Veridian end card: "Sam Peacock · Founder · FreeLeased · sam@freeleased.app · 'The intelligence layer for a single Caribbean property market.'" |
| Sam VO | (silent) |
| Caption | n/a |
| Beat | Last impression: name, role, contact. |

---

## Pre-recording checklist (timed)

- [ ] **T-30m** — Warm preview URL (open FreeLeased.app, navigate to Live Demo, leave tab active)
- [ ] **T-15m** — Click each demo button once: Sweep, Fairness, Consensus. Confirm results render in <2s.
- [ ] **T-10m** — Clear browser cache for clean cold-start visual.
- [ ] **T-5m** — Close all other tabs. Plug in USB mic. Test audio levels (peak -12dB).
- [ ] **T-2m** — Run through script once at half-speed.
- [ ] **T-0** — Press record. Run through script at full speed. Hard stop at 4:00.
- [ ] **Post** — Replay in real-time to confirm timing; tighten any beat >30s.

## Common pitfalls (drawn from judge-panel analysis)

1. **Dead air while loading.** Pre-warm all endpoints before recording.
2. **Statute citations.** Judges don't care about CLRA sections. Lead with the problem and the market.
3. **Too much code.** Show OUTPUT, not code editors.
4. **Missing the close.** End with the URL + the ask, not "um, any questions?"
5. **Over 4 minutes.** Cut the Business section if needed. The demo IS the pitch.

## Rehearsal count

Per [`WIN-DAY-100.md`](../strategy/WIN-DAY-100.md:1) stopping criterion: **3 end-to-end
rehearsals** before recording. Each rehearsal is timed; any beat >30s is flagged
for trimming.

| Rehearsal | Date | Time | Beats flagged |
|-----------|------|------|---------------|
| #1 | Day 14 | _ | _ |
| #2 | Day 15 | _ | _ |
| #3 | Day 15 | _ | _ |
| **Record** | Day 15/16 | _ | n/a |
