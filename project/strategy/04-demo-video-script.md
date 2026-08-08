# BRIEF 4: Demo Video Script & Production Guide

> **Agent type:** Writing/production agent
> **Priority:** CRITICAL — Must be ready by Day 17 (12 Aug 2026)
> **Owner action:** Sam records the video; agent writes the script and screen flow
> **Output:** Complete 3-5 minute demo video script with screen flow, timing, and narration

---

## 1. Context

The Future Caribbean AI Buildathon requires a **3-5 minute demo video or live link** for the Data Room submission. FreeLeased has a live app at:

**https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai**

The demo must show the product working, not just slides. Judges want to see:
1. The problem being solved
2. The product in action (end-to-end flow)
3. The technical innovation (engines, data spine, consensus gate)
4. The Caribbean adaptation (jurisdiction switching, multi-country data)

**Judges' attention span:** The demo video is watched once, maybe twice. Dead air while loading is a score killer. Every second must earn its place.

## 2. The 4 Judges (What They Want to See)

| Judge | Organisation | Focus | What impresses them |
|---|---|---|---|
| Todd Speece | Citigroup | Business model, market size | Revenue story, $0 compute, unit economics |
| Darlington Akogo | Mino Health | Execution, innovation | Working code, build journey, founder credibility |
| Spencer Powers | DRW | Defensibility, scale | Data spine as moat, jurisdiction-agnostic architecture |
| Olumide Durotoluwa | M-KOPA | UX, real-world utility | Resident experience, end-to-end flow, polish |

**The script must satisfy ALL FOUR in 3-5 minutes.**

## 3. Deliverables

| # | Deliverable | Format |
|---|---|---|
| 1 | Full narration script (word-for-word) | Markdown with timestamps |
| 2 | Screen flow (what's on screen at each moment) | Table format |
| 3 | Timing breakdown | Seconds per section |
| 4 | B-roll suggestions | What to show during transitions |
| 5 | Common pitfalls to avoid | Checklist |

## 4. Video Structure (Recommended)

### Opening Hook (0:00 - 0:30) — The Problem
- **Screen:** Static shot of the app's Overview tab (dark theme, peacock palette)
- **Narration:** "4.6 million UK leaseholders have statutory rights to take over management of their buildings. But there's no tool to help them find, understand, or exercise those rights. In the Caribbean, it's worse — there's nothing at all."
- **Beat:** Pause. Let the problem land.

### Live Demo — End-to-End Flow (0:30 - 2:00)
- **Screen:** Click through the actual app. Show the flow:
  1. **Overview** (5 sec): "This is FreeLeased. 9 jurisdictions. 40+ statutes. $0 compute."
  2. **Rights Catalogue** (15 sec): Scroll through the statutory rights. Show the evidence classes (established/heuristic/contested).
  3. **Lease Audit** (30 sec): Run a sample audit. Show input → processing → output. "The fairness engine scores every clause against statute — not people against norms."
  4. **Consensus Gate** (20 sec): Show the 2/3 validation requirement. "No AI claim surfaces as verified without human sign-off."
  5. **Veracity Engine** (15 sec): Show evidence-class tagging. "Every claim carries a confidence level bounded by its evidence class."

### Technical Innovation (2:00 - 3:00)
- **Screen:** Research Desk tab + Data Spine tab
- **Narration:** "The data spine: 9 Caribbean jurisdictions mapped clause-by-clause. 40+ verified sources with provenance tracking. 20 hidden-rights patterns that residents don't know exist."
- **Screen:** Command Post tab (build status)
- **Narration:** "4 engines. 65 tests. The entire platform runs on local SQLite — no cloud database, no API fees. The codebase is deterministic first: it handles 90% of cases without calling an LLM."

### Caribbean Adaptation (3:00 - 3:45)
- **Screen:** Data Spine tab showing jurisdiction switching
- **Narration:** "Here's Barbados. Here's Jamaica. Here's the Cayman Islands. Each jurisdiction maps to its own condominium legislation, its own statutory thresholds, its own source verification chain. The spine is jurisdiction-agnostic — what works for UK RTM adapts to Caribbean property law."
- **Screen:** Communes tab
- **Narration:** "The Cryptographic Communes layer enforces k-anonymity — no individual's data surfaces in aggregate community insights."

### Close (3:45 - 4:00)
- **Screen:** Back to Overview tab
- **Narration:** "FreeLeased. Open-source. Local-first. Resident-led. Built for the Caribbean. Thank you."
- **End card:** Logo + URL + Buildathon branding

## 5. Source Files to Read

| File | Why |
|---|---|
| `src/components/auri/Overview.tsx` | Opening screen — the app's landing page |
| `src/components/auri/RightsCatalogue.tsx` | Show statutory rights discovery |
| `src/components/auri/ResearchDesk.tsx` | Show the research desk / spine lookup |
| `src/components/auri/Communes.tsx` | Show the k-anonymity layer |
| `src/components/auri/CommandPost.tsx` | Show build status / engines |
| `src/components/auri/DataSpine.tsx` | Show jurisdiction switching |
| `src/components/auri/GatesTool.tsx` | Show consensus gate in action |
| `src/components/auri/Assurance.tsx` | Show the assurance / honesty layer |
| `src/data/spine.ts` | Data spine stats for narration |
| `src/lib/consensus.ts` | Consensus gate logic (for technical narration) |
| `src/lib/veracity.ts` | Veracity engine logic (for technical narration) |
| `src/lib/fairness.ts` | Fairness engine logic (for technical narration) |

## 6. Narration Principles

- **Show, don't tell:** "Here's the fairness engine scoring a clause" beats "We have a fairness engine that does advanced analysis"
- **Specific numbers, not vague claims:** "9 jurisdictions, 40+ statutes, 65 tests" beats "comprehensive coverage"
- **No dead air:** Every transition should have narration or a visual. Loading screens should be edited out.
- **Energy, not hype:** Confident, direct, factual. No "revolutionary" or "game-changing".
- **Target: 4 minutes.** Under 4 is fine. Over 5 is not.

## 7. Recording Setup

- **Screen recording:** Use OBS, QuickTime, or any screen recorder. 1920x1080 minimum.
- **Audio:** Use a headset microphone. Quiet room. No background noise.
- **Browser:** Use Chrome. Full-screen the app. Disable notifications.
- **Pre-load all screens** before recording — navigate to each tab once to warm the cache. This eliminates loading dead air.
- **Cursor:** Show the cursor. It helps viewers follow the flow.
- **Resolution:** Record at native resolution, export at 1080p.

## 8. Common Pitfalls to Avoid

| Pitfall | Fix |
|---|---|
| Dead air while loading | Pre-load every tab. Edit out any blank screens. |
| Reading the screen | Narration should EXPLAIN, not DESCRIBE. "This shows..." is lazy. |
| Going over 5 minutes | Cut ruthlessly. Every second must earn its place. |
| Showing the code | This is a product demo, not a code walkthrough. Show the UI. |
| Apologetic language | "This is just a prototype" → NO. Say what it does, not what it isn't. |
| Mentioning "AI" too much | Lead with the PROBLEM and the PRODUCT. AI is the mechanism, not the story. |
| Ignoring Caribbean | Show at least 2 jurisdiction switches. This is the Caribbean Buildathon. |
| Skipping $0 compute | This is the #1 differentiator. Mention it explicitly at least once. |

## 9. Output Format

Save in `project/agent-briefs/demo-video/`:
- `script.md` — Full word-for-word narration with timestamps
- `screen-flow.md` — Table: Timestamp | Screen | Action | Narration
- `timing.md` — Breakdown: section | seconds | words | purpose
- `checklist.md` — Pre-recording checklist + common pitfalls

## 10. Glossary

| Term | Definition |
|---|---|
| RTM | Right to Manage — UK statutory right for leaseholders (CLRA 2002) |
| Consensus gate | Cross-check requiring 2/3 human validation before claim surfaces as verified |
| Veracity engine | Admiralty/NATO evidence-class scoring system |
| Fairness engine | Document-only analysis, no social scoring, no individual profiling |
| Data spine | Structured knowledge base: jurisdictions × statutes × sources with provenance |
| Hidden-rights patterns | 20 statutory protections that leaseholders don't know exist |
| Cryptographic Communes | k-anonymity (≥5) aggregation for community-level insights |
| $0 compute | Entire platform runs on local SQLite + deterministic code — no cloud fees |
| Evidence class | Confidence level: established, heuristic, contested, unfalsifiable |
| Peacock dark theme | The app's visual identity: dark background, teal/emerald accents, blue-to-green gradient |
