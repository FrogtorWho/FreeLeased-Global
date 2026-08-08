# FreeLeased — Project Plan & Submission Tracker

**Competition:** Future Caribbean Global AI Buildathon 2026
**Track:** AI for Real Estate & Development
**Applicant:** Sam Peacock (solo)
**Portal:** futurecaribbean.com · sam.peacock1@gmail.com

---

## Key dates (UPDATED 6 Aug 2026 — official timeline change)

| Date | What happens |
|---|---|
| 29 May 2026 | Applications opened (rolling review) |
| 24 Jul 2026 | **Applications close** |
| 25–26 Jul 2026 | Official notices sent to selected teams |
| 27 Jul 2026 | 21-day build sprint begins |
| **16 Aug 2026** | **Build sprint ends — everything must be submitted** |
| TBC | Scoring period opens (was 8 Aug under old timeline) |
| TBC | Semi-finalist interviews & live demos |
| TBC | Final judging |
| TBC | Winners notified |
| TBC | Public announcement |
| Sep 2026 | Caribbean Showcase + NYSE Investor Showcase |

**Previous timeline (superseded):** Sprint ended 7 Aug, scoring 8–15 Aug,
semi-finals 16–22 Aug, finals 23–27 Aug, winners 29 Aug. The new announcement
extends the sprint to 21 days and shifts everything after. Scoring/dates TBC.

**Scoring process (unchanged):** Uses a published rubric, two-person verification,
and a 48-hour freeze before announcement. Conflicts of interest must be declared;
conflicted judges recuse.

**Key implication:** We have until 16 Aug, not 7 Aug. This changes priorities
significantly — the "before 8 Aug" rush items below now have breathing room.

**Judges (live site, Aug 2026):** Todd Speece (Citi VC), Darlington Akogo
(Mino Health), Spencer Powers (DRW), Olumide Durotoluwa (M-KOPA). These
differ from the _handoff panel — those may be advisors, not final-round judges.

---

## Internal deadlines (buffer against public dates)

All internal deadlines sit **T-1 or T-2 days before public deadlines** to
absorb slippage. Treat these as hard deadlines internally.

| Internal deadline | Public equivalent | What must be done |
|---|---|---|
| **Sat 14 Aug** | Sun 16 Aug (public) | **CODE FREEZE.** No new features. Everything builds,
  deploys, and runs. GitHub repo public with clean README. |
| **Sun 15 Aug** | Sun 16 Aug (public) | **SUBMISSIONS DONE.** Logbook filled. Data Room uploaded.
  Compliance statement finalised. Demo recorded or live URL confirmed.
  TRL self-assessment pasted in. Demo rehearsed twice. |
| **Mon 16 Aug** | Sun 16 Aug (public) | **DEMO DAY.** No changes. Just present. |
| **Sat 9 Aug** | — | **MID-SPRINT CHECK.** All core engine features working.
  Consensus gate, veracity engine, fairness layer all passing. |
| **Sat 2 Aug** | — | **WEEK 1 COMPLETE.** Data spine locked. Audit flow
  end-to-end in at least one jurisdiction. First test results. |

**Rule:** if an internal deadline slips, escalate immediately. Do not let it
cascade into the next window.

---

## Judges (live site — use these, not the _handoff panel)

| Name | Role | Why they matter |
|---|---|---|
| Todd Speece | Head of VC Coverage, Citigroup | Finance/deals — will evaluate business model and market |
| Darlington Akogo | Founder & CEO, Mino Health | Product founder — will evaluate execution and innovation |
| Spencer Powers | Head of Special Investments, DRW | Alternative investments — will evaluate defensibility and scale |
| Olumide Durotoluwa | Senior Product Manager, M-KOPA | Product/impact — will evaluate real-world utility |

**Pitch implication:** these are product people and finance people, not
legal/regtech specialists. Lead with the problem and the market, not the
statute citations. Show them a working product, not a research paper.

---

## What the Logbook expects

The submission portal (Logbook) has three sections. Each needs specific content.

### 1. Journal (build log)

A running record of what was built, why, and what was decided along the way. The
judges want to see the thinking, not just the outcome — what trade-offs were made,
what was tried and discarded, how the team responded to setbacks.

**What we have:** `PROJECT-JOURNAL.md` has entries from day one. Needs formatting
into a clean narrative for the Logbook — not a raw dump, but a coherent thread.

**What's missing:** A condensed "story of the build" that reads as a single arc,
not a list of commits.

### 2. Data Room (evidence uploads)

This is where judges look for proof. Every claim in the submission needs a
corroborating file or link here.

| Item | Status | Notes |
|---|---|---|
| Architecture diagram | ✅ Done | architecture-v3.md |
| GitHub repository (OSS, public) | 🔧 Ready to push | Codebase is clean; needs a public repo with setup docs |
| Test evidence | ✅ Done | 67/67 passing, tsc clean, live endpoints |
| Compliance statement | 🔧 Draft exists | compliance-statement-v2.md — needs final pass |
| Synthetic data label | ✅ Done | Clearly marked throughout the app and docs |
| Demo video / live link | 🔧 Live app works | Need to record a walkthrough or confirm the live URL for judges |

**Important:** The Terms say judges may request "a short video introduction" or
"live screening call." Have a 3-minute demo path ready.

### 3. TRL Roadmap (maturity assessment)

Two parts:

**Part 1 — Level definitions.** Adapted the generic 1–10 template to
FreeLeased with specific exit criteria per level. Saved to
`project/strategy/maturity-ladder.md`.

**Part 2 — Self-assessment.** Honest assessment: **Level 4→5** (working
prototype in the lab, first real-user test in progress). The judge note covers
what the engine is, what we've verified, what we haven't, and why. Saved to
`project/strategy/logbook-submission.md`.

---

## Required submission pack

| Deliverable | Format | Status |
|---|---|---|
| Project overview (problem, solution, business model, GTM) | Written doc | ✅ project-overview-v3.md |
| Technical docs (architecture + workflow diagram) | Written doc | ✅ architecture-v3.md |
| GitHub link (OSS licence, setup instructions) | Repo | 🔧 Needs public push |
| Demo video or live link (3–5 min) | Video/URL | 🔧 Live app; need recording |
| Data/models/tools list | Written doc | ✅ In architecture doc |
| Compliance & responsible AI statement (300–500 words) | Written doc | 🔧 Draft exists, needs review |

---

## Judging criteria (from rubric)

Two halves, each scored 1–10 per dimension:

**Business Strength (50%)**
- Team Quality
- Product Innovation / Uniqueness / Defensibility
- Product-Market Fit

**Agentic AI Excellence (50%)**
- Architecture quality
- Multi-agent / orchestration sophistication
- Human-in-the-loop design
- Efficiency ($0 compute story)
- Real impact potential
- Scale potential

**What the judges want:** Category-defining, globally scalable companies — not
local fixes. Our pitch: the statutory-diagnostics engine is the category; the
RTM Sovereign product is the first deployment; the Caribbean adaptation is the
scale story.

---

## What's left to do (priority order)

### By Sat 2 Aug — WEEK 1 COMPLETE

1. **Lock the data spine** — all jurisdictions, statute references, and
   SPHERE mappings finalised in `src/data/spine.ts`.
2. **End-to-end audit flow** — at least one jurisdiction runs the full
   pipeline: ingest → structure → verify → consensus → present.
3. **First test results** — consensus gate, veracity engine, fairness
   layer all passing. 67/67 maintained or improved.

### By Sat 9 Aug — MID-SPRINT CHECK

4. **All core engine features working** — consensus gate, veracity
   engine, fairness layer, command post, research desk. No stubs.
5. **Format the Journal** — condense project journal into a narrative
   arc for the Logbook. One thread, not a list of commits.
6. **Start the compliance statement** — draft the 300–500 word
   responsible AI statement. Check against CoC §2–5.

### By Sat 14 Aug — CODE FREEZE (T-2)

7. **Push the GitHub repo** — public, OSS licence, clean README with
   setup instructions. This is the #1 "proof it works" artefact.
8. **Record a demo** — 3–5 minute walkthrough of the app. Show the
   audit flow end-to-end. Label synthetic data visibly.
9. **All code builds and runs** — `tsc` clean (excluding generated/),
   `bun scripts/test-suite.ts` passes, endpoints return 2xx.

### By Sun 15 Aug — SUBMISSIONS DONE (T-1)

10. **Finalise the compliance statement** — trim to 500 words, final
    review against CoC.
11. **Upload Data Room evidence** — architecture diagram, test results,
    demo link, compliance statement.
12. **Paste TRL self-assessment** into Logbook (Part 1 + Part 2).
13. **Demo rehearsed twice** — timed, smooth, no dead ends.

### Mon 16 Aug — DEMO DAY

No changes. Just present.

### Stretch (if time permits, lower priority)

14. **Run one real leaseholder pack** — moves us from L4 to L5 on the
    maturity ladder, with a signed-off report in the Data Room.
15. **Community partnerships** — reach out to Caribbean housing orgs
    for validation quotes. The About page lists 3 partners already.
16. **Build the research pipeline** — automate source → veracity →
    SPHERE flow for multiple jurisdictions.
17. **Sponsor outreach** — follow up on the 7 MoU letters.

---

## Prize structure

| Place | Cash | In-kind |
|---|---|---|
| 1st | $25,000+ | 3 OWC AI Systems |
| 2nd | $15,000+ | 2 OWC AI Systems |
| 3rd | $10,000+ | 1 OWC AI System |

**All selected teams** get: $1,250 compute credits (Highrise H200), NoInfra
agent infrastructure, Shogo platform credits.

**Winners additionally get:** DMZ Soft Landing scholarship (Toronto), Powertranz
gateway (12 months free), live NYSE pitch, flights & accommodation (Bookit).

Total prize pool: up to $120,000 ($50k compute + $70k winner pool).

---

## Rules to watch (from Terms)

- **IP stays ours** (§5.1). No assignment, no licence, no equity to the organiser.
- **Two-person verification** on all scores (§6.4).
- **48-hour freeze** before announcement (§6.4).
- **Sanctions screening** before cash disbursement (§8.2).
- **Code of conduct** (§10) — substantive breach = disqualification.
- **No behavioural/psychological profiling** in the product (CoC §2) — our
  adversary layer was retired precisely because of this.
- **Synthetic data must be labelled** (CoC §5) — we do this throughout.

---

*Last updated: 6 August 2026 — internal deadlines added (T-1/T-2 buffer)*
