# FreeLeased TRL Levels — Project-Specific Definitions

**Adapted from the generic TRL template. Each level shows what "done" looks like for FreeLeased specifically, with evidence pointers to the Data Room.**

| Level | Name | What reaching it looks like for FreeLeased | Evidence (must be in Data Room) |
|-------|------|---------------------------------------------|-------------------------------|
| **1** | Idea / concept sketched | Problem stated in one paragraph; 3 UK leaseholder frustrations identified; FreeLeased Ltd registered (Companies House); at least 1 synthetic example lease drafted. | Companies House confirmation; `project/demo/sample-lease.txt`; problem paragraph in `00-OVERVIEW.md` |
| **2** | Problem validated with 3+ interviews | 3+ structured interviews with UK leaseholders or RTM activists logged in `MEMORY.md` (or interview log); each interview dated with name + contact (or pseudonymous ID under `[PERSON_NAME]` schema). | `memory/` interview entries; Loom/notes transcripts |
| **3** | Paper prototype / wireframe | Figma (or hand-drawn) wireframes for: Rights Checker, Lease Scanner, Service Charge Checker, RTM Wizard, Action Plan Generator. Screenshots in Data Room. | Figma link + PNG export |
| **4** | Working prototype in the lab | Deterministic engines run end-to-end on the synthetic lease fixture. 159/159 `check()` assertions in `bun scripts/test-suite.ts`. 9 jurisdictions, 30+ statutes, 20 hidden-rights patterns, 50 pseudonymous residents in [`src/data/spine.ts`](src/data/spine.ts:1). | `bun scripts/test-suite.ts` output; `custom-routes.ts` smoke test 200 OK |
| **5** | Prototype tested with 1 real user | One real leaseholder pack (any UK lease + 1 tribunal decision) processed end-to-end. User interview recorded. Verdict reviewed and signed off by Sam. | Lease PDF (redacted); transcript; verdict PDF in `project/pilot-audit/` |
| **6** | Field pilot with a design partner | One signed MoU/LOI with an RTM company, residents' association, or housing charity. ≥10 leaseholders onboarded. At least 1 multi-resident coordination event run. | Signed MoU PDF; onboarding screenshots |
| **7** | Reliable in a real environment | Uptime ≥99% over 30 days; P95 dossier build <10s; 0 P0 incidents; consensus gate fires correctly on 100% of contested claims; HITL sign-off queue drains within 24h. | Uptime dashboard; incident log; [`src/lib/consensus.ts`](src/lib/consensus.ts:1) test run |
| **8** | Full feature set, small user base | All 5 product surfaces (Rights Checker, Lease Scanner, Service Charge Checker, RTM Wizard, Action Plan Generator) live. Templates for 4 jurisdictions ([`src/lib/templates.ts`](src/lib/templates.ts:1)). Multi-resident coordination. 50–500 active users. | Feature inventory; user count screenshot |
| **9** | Paying users / launched | At least 1 paying customer (insurer, lender, or institution) OR ≥1,000 active residents. Pricing model published. Revenue ledger non-zero. | Invoice; pricing page; revenue screenshot |
| **10** | Default infrastructure | Default tool for leaseholder self-audit in ≥3 jurisdictions. Cited in UK government guidance OR by a major housing body. Network effects visible (communes sharing patterns). | Citation; press; growth metrics |

### Current Standing (as of 2026-08-10)
- **Self-assessed level: 4** (Working prototype in the lab) — verified by today's audit:
  - 159/159 test assertions ([`scripts/test-suite.ts`](scripts/test-suite.ts:78))
  - Ruff + black clean
  - Mobile route repaired ([`src/App.tsx`](src/App.tsx:59))
  - All engines real and deterministic
  - 9 jurisdictions in spine, 30+ statutes, 20 patterns
- **Reaching into 5**: needs one real leaseholder pack processed end-to-end (Stage 7 idea #1 — wire `extractWithVLM` to Nebius on [`project/demo/sample-lease.txt`](project/demo/sample-lease.txt))
- **Distance to 6**: 1 signed MoU + ≥10 leaseholders

### Exit Criteria Reminder
Per [`project/strategy/maturity-ladder.md`](project/strategy/maturity-ladder.md:1), the next-level-up requirements are:
- L4→L5: Run one real leaseholder's pack end-to-end to a signed report
- L5→L6: Convert one MoU/advocate contact into an active design partner
- L6→L7: 30-day production uptime target hit
