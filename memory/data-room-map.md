# Data Room Map — FreeLeased Buildathon Validation Layer

**Root:** `G:\My Drive\Development\Future Caribbean\Data Room\`
**Type:** Google Drive (synced locally), READ-ONLY for this agent
**Purpose:** Validation layer — every TRL claim points back to an evidence file here
**Mapped:** 2026-08-10
**Status:** Folders scaffolded, contents pending

---

## Task A — Folder Inventory

The Data Room contains **8 top-level directories, 24 sub-directories, and 0 files**. It is structured scaffolding — the folder hierarchy was pre-created to match TRL evidence categories, but no evidence files have been placed inside yet.

### Top-Level Contents

| # | Folder | Type | Contents | Size |
|---|--------|------|----------|------|
| 1 | `Shogo/` | Directory | empty | 0 B |
| 2 | `00_README - Index and TRL Map/` | Directory | empty | 0 B |
| 3 | `01_Company Overview/` | Directory | 3 sub-dirs | 0 B |
| 4 | `02_Problem Validation/` | Directory | 3 sub-dirs | 0 B |
| 5 | `03_Product Evidence/` | Directory | 4 sub-dirs | 0 B |
| 6 | `04_Technical Proof/` | Directory | 4 sub-dirs | 0 B |
| 7 | `05_User Testing and Pilot/` | Directory | 3 sub-dirs | 0 B |
| 8 | `06_Business and Traction/` | Directory | 4 sub-dirs | 0 B |
| 9 | `07_Legal and Permissions/` | Directory | 3 sub-dirs | 0 B |

**File count by extension:** (none — all folders are empty)

### 2-Level Deep Tree

```
G:\My Drive\Development\Future Caribbean\Data Room\
├── Shogo\                                            [empty]
├── 00_README - Index and TRL Map\                    [empty — meta/index folder]
├── 01_Company Overview\
│   ├── project_summary\                              [empty]
│   ├── team\                                         [empty]
│   └── pitch_deck\                                   [empty]
├── 02_Problem Validation\
│   ├── interview_notes\                              [empty]
│   ├── survey_results\                               [empty]
│   └── emails_feedback\                              [empty]
├── 03_Product Evidence\
│   ├── wireframes\                                   [empty]
│   ├── mockups\                                      [empty]
│   ├── screenshots\                                  [empty]
│   └── demo_video\                                   [empty]
├── 04_Technical Proof\
│   ├── architecture\                                 [empty]
│   ├── code_samples\                                 [empty]
│   ├── test_results\                                 [empty]
│   └── prototype_builds\                             [empty]
├── 05_User Testing and Pilot\
│   ├── test_notes\                                   [empty]
│   ├── pilot_feedback\                               [empty]
│   └── metrics\                                      [empty]
├── 06_Business and Traction\
│   ├── pricing\                                      [empty]
│   ├── partnerships\                                 [empty]
│   ├── customers\                                    [empty]
│   └── revenue\                                      [empty]
└── 07_Legal and Permissions\
    ├── approvals\                                    [empty]
    ├── releases\                                     [empty]
    └── licenses\                                     [empty]
```

**Total:** 9 top-level entries, 24 sub-directories, 0 files, 0 B.

---

## Task B — Folder → TRL Mapping

The Data Room's folder numbering (`01_…` through `07_…`) is already structurally aligned with TRL evidence categories. The mapping is direct:

| Folder | Sub-folder | TRL Level | Justification |
|--------|-----------|-----------|---------------|
| `00_README - Index and TRL Map/` | (root index) | META | Index/README for the whole room — pointer to evidence per TRL claim. Not a TRL level itself; documents the mapping. |
| `01_Company Overview/` | `project_summary/` | **TRL 1** | Company description + Companies House confirmation + problem paragraph live here. |
| `01_Company Overview/` | `team/` | **TRL 1** | Founder/team evidence — supports TRL 1 "FreeLeased Ltd registered" plus broader credibility. |
| `01_Company Overview/` | `pitch_deck/` | **TRL 1** | Pitch deck copy/cover slide — synthesises the problem statement (TRL 1 evidence). |
| `02_Problem Validation/` | `interview_notes/` | **TRL 2** | 3+ structured interview logs/transcripts with leaseholders — the literal TRL 2 evidence. |
| `02_Problem Validation/` | `survey_results/` | **TRL 2** | Survey data — supplementary problem validation. |
| `02_Problem Validation/` | `emails_feedback/` | **TRL 2** | Email/feedback correspondence with prospective users — supporting TRL 2. |
| `03_Product Evidence/` | `wireframes/` | **TRL 3** | Figma wireframes for the 5 surfaces — direct TRL 3 evidence. |
| `03_Product Evidence/` | `mockups/` | **TRL 3** | High-fidelity mocks — TRL 3 design prototype. |
| `03_Product Evidence/` | `screenshots/` | **TRL 4** (also TRL 3) | Build screenshots — straddles TRL 3 (paper prototype) and TRL 4 (working prototype). Default = **TRL 4**. |
| `03_Product Evidence/` | `demo_video/` | **TRL 4** (also TRL 5) | Demo video of the prototype — primary TRL 4 deliverable; doubles as TRL 5 evidence once it features a real leaseholder. |
| `04_Technical Proof/` | `architecture/` | **TRL 4** | System architecture diagrams — supports TRL 4 "working prototype in lab". |
| `04_Technical Proof/` | `code_samples/` | **TRL 4** | Code excerpts/screenshots of engines (deterministic, real). |
| `04_Technical Proof/` | `test_results/` | **TRL 4** | `bun scripts/test-suite.ts` output (159/159), smoke tests. Primary TRL 4 evidence. |
| `04_Technical Proof/` | `prototype_builds/` | **TRL 4** | Build artifacts / compiled output / spine inventory screenshots. |
| `05_User Testing and Pilot/` | `test_notes/` | **TRL 5** | Test session notes from the first real leaseholder pack run. |
| `05_User Testing and Pilot/` | `pilot_feedback/` | **TRL 6** | Feedback from the design-partner pilot (RTM company / residents' association). |
| `05_User Testing and Pilot/` | `metrics/` | **TRL 7** (also TRL 8) | Uptime, latency, P95, incident counts — TRL 7 reliability metrics, TRL 8 user counts. Default = **TRL 7**. |
| `06_Business and Traction/` | `pricing/` | **TRL 9** | Published pricing model. |
| `06_Business and Traction/` | `partnerships/` | **TRL 6** | Signed MoUs/LOIs — TRL 6 evidence. |
| `06_Business and Traction/` | `customers/` | **TRL 9** (also TRL 8) | Customer logos / paying-customer evidence. Default = **TRL 9**. |
| `06_Business and Traction/` | `revenue/` | **TRL 9** | Invoices + revenue ledger screenshots. |
| `07_Legal and Permissions/` | `approvals/` | **TRL 6** | Permissions/consent for pilot participants (also relevant to TRL 5/6 user testing). |
| `07_Legal and Permissions/` | `releases/` | **TRL 10** | Public release notes / changelog demonstrating "default infrastructure" trajectory. |
| `07_Legal and Permissions/` | `licenses/` | **TRL 1** (also TRL 10) | Software licenses, data licenses — foundational (TRL 1) and ongoing (TRL 10). Default = **TRL 1**. |

### Folders That Couldn't Be Classified

| Folder | Status |
|--------|--------|
| `Shogo/` | **Unknown — needs human classification.** Name suggests agent-runtime artifacts (vs the buildathon submission data). Could be tool/CI scaffolding rather than validation evidence. Recommend a human decides whether this folder should ever hold TRL evidence or whether it's an operational artefact. |

---

## Task C — Gap Report

### What's There

| Folder | 1-line description |
|--------|--------------------|
| `Shogo/` | Unknown — possibly agent-runtime scaffolding; needs classification |
| `00_README - Index and TRL Map/` | Index/README — empty meta folder |
| `01_Company Overview/project_summary/` | Where the 1-paragraph problem statement and Companies House confirmation belong |
| `01_Company Overview/team/` | Founder bio/team evidence |
| `01_Company Overview/pitch_deck/` | Pitch deck copy |
| `02_Problem Validation/interview_notes/` | Where the 3+ leaseholder interview logs belong |
| `02_Problem Validation/survey_results/` | Survey data |
| `02_Problem Validation/emails_feedback/` | Email correspondence with prospective users |
| `03_Product Evidence/wireframes/` | Figma exports for the 5 surfaces |
| `03_Product Evidence/mockups/` | High-fidelity design mocks |
| `03_Product Evidence/screenshots/` | Build screenshots |
| `03_Product Evidence/demo_video/` | Demo video file |
| `04_Technical Proof/architecture/` | System architecture diagrams |
| `04_Technical Proof/code_samples/` | Code excerpts |
| `04_Technical Proof/test_results/` | Test-suite output (159/159) |
| `04_Technical Proof/prototype_builds/` | Build artifacts |
| `05_User Testing and Pilot/test_notes/` | First-leaseholder test session notes |
| `05_User Testing and Pilot/pilot_feedback/` | Design-partner feedback |
| `05_User Testing and Pilot/metrics/` | Uptime/latency/incident metrics |
| `06_Business and Traction/pricing/` | Pricing model |
| `06_Business and Traction/partnerships/` | Signed MoUs/LOIs |
| `06_Business and Traction/customers/` | Customer evidence |
| `06_Business and Traction/revenue/` | Invoices + revenue ledger |
| `07_Legal and Permissions/approvals/` | Permissions/consent forms |
| `07_Legal and Permissions/releases/` | Release notes |
| `07_Legal and Permissions/licenses/` | Software/data licenses |

### Required Evidence vs. What's Present

| TRL | Required evidence | In Data Room? | Folder path or MISSING |
|-----|-------------------|---------------|------------------------|
| 1 | Companies House confirmation | **NO** | `01_Company Overview/project_summary/` — MISSING |
| 1 | 1-paragraph problem statement | **NO** | `01_Company Overview/project_summary/` — MISSING (problem paragraph exists in `project/strategy/00-OVERVIEW.md` but not in Data Room) |
| 1 | Synthetic example lease | **NO** | `01_Company Overview/` — MISSING (sample exists at `project/demo/sample-lease.txt`) |
| 1 | Software/data licenses | **NO** | `07_Legal and Permissions/licenses/` — MISSING |
| 2 | 3+ interview logs (dated, named/pseudonymous) | **NO** | `02_Problem Validation/interview_notes/` — MISSING |
| 2 | Loom/notes transcripts | **NO** | `02_Problem Validation/interview_notes/` — MISSING |
| 2 | Survey results | **NO** | `02_Problem Validation/survey_results/` — MISSING |
| 2 | Emails/feedback correspondence | **NO** | `02_Problem Validation/emails_feedback/` — MISSING |
| 3 | Figma wireframes (5 surfaces) | **NO** | `03_Product Evidence/wireframes/` — MISSING |
| 3 | Figma PNG exports | **NO** | `03_Product Evidence/wireframes/` — MISSING |
| 3 | High-fidelity mocks | **NO** | `03_Product Evidence/mockups/` — MISSING |
| 4 | `bun scripts/test-suite.ts` output | **NO** | `04_Technical Proof/test_results/` — MISSING (output exists in repo, not copied here) |
| 4 | Smoke-test screenshots | **NO** | `04_Technical Proof/test_results/` — MISSING |
| 4 | Spine inventory screenshot | **NO** | `04_Technical Proof/prototype_builds/` — MISSING |
| 4 | Architecture diagrams | **NO** | `04_Technical Proof/architecture/` — MISSING |
| 4 | Code excerpts | **NO** | `04_Technical Proof/code_samples/` — MISSING |
| 4 | Build artifacts | **NO** | `04_Technical Proof/prototype_builds/` — MISSING |
| 4 | Demo video | **NO** | `03_Product Evidence/demo_video/` — MISSING |
| 5 | Redacted real lease PDF | **NO** | `05_User Testing and Pilot/test_notes/` — MISSING |
| 5 | Tribunal decision PDF | **NO** | `05_User Testing and Pilot/test_notes/` — MISSING |
| 5 | Verdict PDF (signed off) | **NO** | `05_User Testing and Pilot/test_notes/` — MISSING |
| 5 | User interview recording/transcript | **NO** | `05_User Testing and Pilot/test_notes/` — MISSING |
| 6 | Signed MoU/LOI PDF | **NO** | `06_Business and Traction/partnerships/` — MISSING |
| 6 | Onboarding screenshots (≥10 leaseholders) | **NO** | `05_User Testing and Pilot/pilot_feedback/` — MISSING |
| 6 | Pilot consent forms | **NO** | `07_Legal and Permissions/approvals/` — MISSING |
| 7 | Uptime dashboard (≥99% over 30d) | **NO** | `05_User Testing and Pilot/metrics/` — MISSING |
| 7 | Incident log (0 P0) | **NO** | `05_User Testing and Pilot/metrics/` — MISSING |
| 7 | Consensus gate test run | **NO** | `04_Technical Proof/test_results/` — MISSING |
| 8 | Feature inventory | **NO** | `03_Product Evidence/` — MISSING |
| 8 | User-count screenshot (50–500 active) | **NO** | `05_User Testing and Pilot/metrics/` — MISSING |
| 9 | Invoice | **NO** | `06_Business and Traction/revenue/` — MISSING |
| 9 | Pricing page | **NO** | `06_Business and Traction/pricing/` — MISSING |
| 9 | Revenue ledger screenshot | **NO** | `06_Business and Traction/revenue/` — MISSING |
| 10 | Citation / press | **NO** | `07_Legal and Permissions/releases/` — MISSING |
| 10 | Growth metrics | **NO** | `05_User Testing and Pilot/metrics/` — MISSING |

### Top-Priority Gaps for Code Freeze (2026-08-14)

The submission deadline is in 4 days. The Data Room is empty. The agent's current self-assessed TRL is **4**. The submission must visibly demonstrate TRL 1–4 evidence to be credible. Anything TRL 5+ is a stretch goal.

**Priority-ranked gap closure plan:**

1. **TRL 1 — Companies House confirmation + problem paragraph + sample lease** — *Why it matters:* This is the cheapest possible credibility win. Three documents already exist in the repo (`project/strategy/00-OVERVIEW.md`, `project/demo/sample-lease.txt`, plus a Companies House PDF once the ltd is registered). *How to close:* Copy the problem paragraph into `01_Company Overview/project_summary/problem.md`; copy `project/demo/sample-lease.txt` into `01_Company Overview/project_summary/sample-lease.txt`; add Companies House PDF to the same folder. **~10 minutes.**

2. **TRL 4 — Test-suite output + smoke screenshots + architecture diagram** — *Why it matters:* The agent already has 159/159 tests passing and a real prototype. This is the strongest evidence the agent has and it's currently missing from the Data Room. *How to close:* Run `bun scripts/test-suite.ts > 04_Technical Proof/test_results/test-suite-output.txt`; screenshot the custom-routes smoke test; export the [`project/submission-pack/architecture-v3.md`](project/submission-pack/architecture-v3.md:1) as PDF/PNG into `04_Technical Proof/architecture/architecture.pdf`. **~30 minutes.**

3. **TRL 2 — 3+ leaseholder interview logs (real or pseudonymous)** — *Why it matters:* Without TRL 2 evidence, the "problem-validated" claim is hollow. This is the most labor-intensive gap because real interviews take time, but pseudonymous logs from prior memory/contacts may already exist. *How to close:* Audit `MEMORY.md` and `memory/` for any existing interview transcripts; if 3 dated, named/pseudonymous interviews are documented anywhere in the project, copy them into `02_Problem Validation/interview_notes/`. If none exist, draft a "validation plan" file in the same folder committing to 3 interviews by code-freeze +2 weeks. **~1 hour audit + maybe follow-up outreach.**

4. **TRL 3 — Wireframes / Figma exports for 5 surfaces** — *Why it matters:* Even low-fidelity wireframes signal that the design was thought through before the build. *How to close:* Hand-drawn or Figma-free sketches saved as PNG into `03_Product Evidence/wireframes/{rights-checker,lease-scanner,service-charge-checker,rtm-wizard,action-plan-generator}.png`. **~2 hours** if sketching from scratch; **~30 minutes** if using the existing UI descriptions in [`src/App.tsx`](src/App.tsx:1) and [`project/strategy/ux-nextgen-vision.md`](project/strategy/ux-nextgen-vision.md:1) as reference.

5. **TRL 4 — Demo video** — *Why it matters:* A 60-second demo walking through one user journey is the highest-signal submission artefact. *How to close:* Follow [`project/submission-pack/demo-script-v3.md`](project/submission-pack/demo-script-v3.md:1) and [`project/demo/demo-video-script.md`](project/demo/demo-video-script.md:1); record + export MP4 into `03_Product Evidence/demo_video/`. **~3 hours** including recording/editing.

### Honest Assessment

The Data Room folder structure is well-designed (the `01_…` through `07_…` numbering mirrors the TRL 1–7 evidence categories cleanly). But the room is functionally empty — it has zero evidence files. For code freeze on 2026-08-14, **the minimum viable Data Room** is:

- TRL 1: 3 files in `01_Company Overview/project_summary/` (~10 min)
- TRL 2: 3 files in `02_Problem Validation/interview_notes/` (~1 hour if existing, longer if new outreach)
- TRL 3: 5 wireframe PNGs in `03_Product Evidence/wireframes/` (~2 hours)
- TRL 4: test output + architecture + demo video (~4 hours)

That's a **~7-hour focused push** to close the TRL 1–4 evidence gaps. TRL 5+ is post-buildathon scope.

---

## Open Questions / Human Action Required

1. **What is `Shogo/` for?** Decide whether this folder holds agent-runtime artefacts (and therefore should NOT be considered validation evidence) or whether it should be repurposed.
2. **Are there existing interview logs anywhere in the project?** Audit `MEMORY.md`, `memory/*.md`, `project/pilot-audit/` before drafting new TRL 2 evidence from scratch.
3. **Has FreeLeased Ltd been registered yet on Companies House?** If yes, the PDF exists — just needs to be copied in. If no, this blocks TRL 1.