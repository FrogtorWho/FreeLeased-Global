# Next-Gen Presentation — UX/UI Vision

**Status:** design north-star · **Version:** 1.0
**Companion:** `moonshot-roadmap-10-10.md`
**Verdict on current state:** functional but *basic* — 11 tabs of cards and
charts on the peacock theme. It reads as a dashboard. A category-defining entry
must read as an **instrument**: something that visibly *thinks*, shows its chain
of custody, and earns trust through motion and provenance, not decoration.

**Principle:** *next-gen presentation or nothing.* Every pixel either proves
honesty, shows the agent working, or moves the resident toward an outcome.
Beauty is a byproduct of legibility, not a skin.

---

## The five design pillars

### 1. Provenance-first, not chart-first
Every number wears its origin. Hover any datum → a **provenance popover**:
source (DSP-3 tier + license), conviction (DSP-0b), last-refreshed, and the
resolvable URL. The `EvidenceTag` primitive already exists — promote it from a
label to the core interaction. Nothing on screen is unattributed.

### 2. Evidence-class as a visual language
Make the honesty engine *visible*. A consistent legend across the whole app:
`established` (solid/emerald) · `heuristic` (hatched/cyan) · `contested`
(dashed/amber) · `unfalsifiable` (ghosted/slate). Confidence bars render with a
hard **cap line** so a judge literally sees "we stopped ourselves at 0.6." This
is our signature — no competitor visualises their own uncertainty.

### 3. The system thinks on screen — the Agent Loop Canvas
A live, animated view of the tier ladder (codified → RAG-agentic → consensus →
HITL). During an analysis, nodes pulse as data flows, DSP contracts show on the
edges, DSP-5 spans stream in a timeline, and the consensus gate visibly resolves
`surface / review / abstain`. This single view wins Architecture + Orchestration
+ Efficiency at once. It is the money shot of the demo video.

### 4. Cinematic demo mode
A guided, keyboard-driven "story mode" that walks judges through one resident's
lease: upload → codified match → retrieval → consensus → sign-off → resident
outcome — with camera-like transitions, spotlight focus, and narration captions.
One keystroke, three minutes, zero fumbling. Also the spine of the recorded video.

### 5. Two faces, one system
- **Command center** (operator/institution): dense, dark, instrument-grade — the
  spine map, sign-off queue, efficiency + observability panels.
- **Resident view** (mobile-first, calm, high-contrast, plain-language,
  multilingual-ready): "here's what's wrong with your lease, here's the law, here's
  what you can do." Impact + accessibility + Sherika Herbert's axis in one surface.

---

## Signature interactions to build (in priority order)

1. **Agent Loop Canvas** — animated pipeline (React Flow-style nodes + framer-motion
   pulses) driven by real DSP-5 spans and DSP-6 consensus results.
2. **Provenance popover everywhere** — one `<Provenance/>` primitive wrapping any datum.
3. **Confidence-with-cap meter** — bar + cap line + evidence-class glyph; replaces
   bare percentages app-wide.
4. **Sign-off Queue** — the HITL surface: card stack, approve/reject/annotate,
   appeal button, immutable audit trail; satisfies CoC §4 visibly.
5. **Live spine map** — Caribbean map, parcels/jurisdictions, pilot vs roadmap,
   data-sufficiency band as color; click a jurisdiction → its statutes + sources.
6. **Efficiency HUD** — tokens/task, % handled free by Tier-1, cost/lease, model
   routing (Impala small→large), cache hits. Romanow + Impala + OllyGarden bait.
7. **Fairness Check theatre** — paste/upload a lease, watch clauses get underlined
   in place with inline citations and capped confidence, then a plain-language summary.

---

## Visual system (evolve the peacock, don't replace it)
- **Foundation kept:** peacock dark, `BRAND`/`CHART`/`SEMANTIC` tokens,
  `SectionHeader`/`ChartCard`/`MetricTile`/`Formula`/`EvidenceTag` primitives.
- **Add depth:** layered glass surfaces (subtle blur + 1px teal borders), a faint
  grid/topographic texture (land motif), restrained bloom on active nodes.
- **Add motion:** framer-motion for enter/among-tab transitions, number
  count-ups, node pulses, and the demo-mode camera. Motion communicates *state
  change*, never decoration; respects `prefers-reduced-motion`.
- **Typography:** a technical display face for headings (instrument feel),
  keep body highly legible. Tabular numerals for all metrics.
- **Accessibility as credibility:** WCAG-AA contrast, full keyboard nav, ARIA on
  the canvas, reduced-motion fallback. For a housing-rights product, accessibility
  *is* the ethics story — say so in the demo.

---

## Track-fit + CoC correction (do this in the UI too)
Retire/reframe **ThreatLab** and **IntelProtocols** from adversary/threat framing
to **Land-Risk Intelligence** (climate, title integrity, valuation anomaly) — same
analytics, land-not-people, on-track for Category F, clear of CoC §2. This is a UX
+ narrative fix, not just a docs fix.

---

## Build order (fires the moment the preview is restored — Track C)
1. Design-system upgrade pass: glass surfaces, motion, confidence-with-cap meter,
   `<Provenance/>` primitive. (Touches every tab, instant "wow" lift.)
2. Agent Loop Canvas (the money shot).
3. Sign-off Queue + appeal.
4. Live spine map + Efficiency HUD.
5. Fairness Check theatre + Resident mobile view.
6. Cinematic demo mode wrapping it all → record the video.

Each ships behind our verification bar (tsc clean, tests green, forced rebuild +
bundle-hash check, render-QA via the browser subagent) — next-gen *and* proven.
