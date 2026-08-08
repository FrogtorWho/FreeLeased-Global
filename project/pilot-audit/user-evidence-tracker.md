# User Evidence Tracker

**Project:** FreeLeased
**Purpose:** Systematic record of every audit session — synthetic and real.
**Standard:** One row per session. Never delete rows. Mark synthetic clearly.

---

## Session Log

### Session 001 — Synthetic Baseline
**Date:** 6 August 2026
**User type:** Synthetic (no real user)
**Jurisdiction:** UK (England & Wales)
**User profile:** N/A — fictional tenant "Alex Morgan"
**Task:** Full lease audit — identify fairness issues and hidden rights
**Input document:** `project/pilot-audit/synthetic-lease.md` (UK AST, 13 clauses, fictional)
**Pipeline steps run:** Sweep → Fairness Check → Consensus Gate
**Results:**
- Sweep: 3/4 gates passing (PII gate triggered on postcodes — expected)
- Fairness: 103 clauses analysed, 4 high-severity flags (waive-repairs × 1, entry-without-notice × 3)
- Consensus: verdict=review, agreement=divergent on service charge claim
**Time to result:** <500ms (local, no cold start)
**User effort required:** Paste text → click button (2 steps)
**Outcome:** Pipeline functioned correctly. All flags mapped to real statutes.
**Evidence quality:** `synthetic-verified`
**Limitations:** Fictional document with deliberately embedded issues. Not representative of a real leaseholder's experience.
**Session file:** `project/pilot-audit/pilot-audit-report.md`

---

### Session 002 — [EMPTY SLOT: First Real User]
**Date:** [TBD — target Day 14, by 9 Aug 2026]
**User type:** [ ] UK leaseholder  [ ] Caribbean resident  [ ] Property professional
**Jurisdiction:** _______________
**User profile:** [anonymised — e.g. "UK leaseholder, 2-bed flat, London, 3-year AST"]
**Task:** _______________
**Input document:** [Real lease or redacted version — confirm consent obtained]
**Consent obtained:** [ ] Yes — written  [ ] Yes — verbal  [ ] N/A (own document)
**Pipeline steps run:** [ ] Sweep  [ ] Fairness  [ ] Consensus  [ ] Full dossier
**Results:**
- Sweep: ___/4 passing, notes: _______________
- Fairness: ___ clauses analysed, ___ flags raised
- Consensus: verdict=___, agreement=___
**Time to result:** ___ms
**User effort required:** _______________
**Outcome:** _______________
**Did user find result useful?** [ ] Yes  [ ] Partially  [ ] No  [ ] Not asked
**Would user pay for this?** [ ] Yes (£___/mo)  [ ] No  [ ] Maybe  [ ] Not asked
**Unexpected issues:** _______________
**Evidence quality:** `real-user-unvalidated` → upgrades to `real-user-validated` once reviewed
**Session file:** [link to notes or recording]

---

### Session 003 — [EMPTY SLOT: Second Real User]
**Date:** [TBD]
**User type:** [ ] UK leaseholder  [ ] Caribbean resident  [ ] Property professional
**Jurisdiction:** _______________
**User profile:** _______________
**Task:** _______________
**Input document:** _______________
**Consent obtained:** [ ] Yes  [ ] N/A
**Results:** [complete after session]
**Did user find result useful?** [ ] Yes  [ ] Partially  [ ] No
**Would user pay?** [ ] Yes (£___/mo)  [ ] No  [ ] Maybe
**Evidence quality:** `real-user-unvalidated`
**Session file:** _______________

---

### Session 004 — [EMPTY SLOT: Caribbean User]
**Date:** [TBD — target Caribbean jurisdiction]
**User type:** [ ] Caribbean resident  [ ] Property professional  [ ] Government
**Jurisdiction:** [ ] BB  [ ] JM  [ ] KY  [ ] TT  [ ] GY  [ ] BZ  [ ] VG  [ ] BS
**User profile:** _______________
**Task:** _______________
**Input document:** _______________
**Consent obtained:** [ ] Yes  [ ] N/A
**Results:** [complete after session]
**Did user find result useful?** [ ] Yes  [ ] Partially  [ ] No
**Would user pay?** [ ] Yes ($___/mo)  [ ] No  [ ] Maybe
**Evidence quality:** `real-user-unvalidated`
**Session file:** _______________

---

### Session 005 — [EMPTY SLOT: Property Professional]
**Date:** [TBD]
**User type:** [ ] Solicitor  [ ] Property manager  [ ] RTM advisor  [ ] Housing association
**Jurisdiction:** _______________
**User profile:** _______________
**Task:** _______________
**Input document:** _______________
**Consent obtained:** [ ] Yes  [ ] N/A
**Results:** [complete after session]
**Did user find result useful?** [ ] Yes  [ ] Partially  [ ] No
**Would user pay for professional tier?** [ ] Yes (£___/unit/yr)  [ ] No  [ ] Maybe
**Evidence quality:** `real-user-unvalidated`
**Session file:** _______________

---

### Session 006 — [EMPTY SLOT: Government / MoU Partner]
**Date:** [TBD — ideally a government contact from MoU pipeline]
**User type:** [ ] Government agency  [ ] Registry  [ ] Housing authority
**Jurisdiction:** _______________
**User profile:** _______________
**Task:** _______________
**Input document:** _______________
**Consent obtained:** [ ] Yes  [ ] N/A
**Results:** [complete after session]
**Did user find result useful?** [ ] Yes  [ ] Partially  [ ] No
**Would agency adopt this?** [ ] Yes  [ ] Pilot  [ ] No  [ ] Not asked
**Evidence quality:** `real-user-unvalidated`
**Session file:** _______________

---

## Evidence Accumulation Tracker

| Session | Date | User Type | Jurisdiction | Useful? | Pay? | Evidence Level |
|---------|------|-----------|-------------|---------|------|---------------|
| 001 | 6 Aug 2026 | Synthetic | UK | N/A | N/A | synthetic-verified |
| 002 | TBD | Real leaseholder | TBD | TBD | TBD | empty |
| 003 | TBD | Real leaseholder | TBD | TBD | TBD | empty |
| 004 | TBD | Caribbean resident | TBD | TBD | TBD | empty |
| 005 | TBD | Property professional | TBD | TBD | TBD | empty |
| 006 | TBD | Government / MoU | TBD | TBD | TBD | empty |

**Current real-user count: 0**
**Target by Day 14 (9 Aug): 1**
**Target by Day 16 (submission): 3**

---

## What completing 3 sessions proves to judges

| Sessions complete | Evidence claim | Score impact |
|------------------|---------------|-------------|
| 0 (current) | "Pipeline validated on synthetic data. Architecture ready." | Real Impact: 6.5/10 |
| 1 | "One real leaseholder completed a full audit session." | Real Impact: ~7.5/10 |
| 3 | "Three real users across two user types." | Real Impact: ~8.5/10 |
| 3 + willingness-to-pay data | "Three users, two confirmed willingness to pay £X/mo." | PMF: +0.5 pts |

---

## Consent and data handling note

All real user sessions require:
1. Verbal or written consent to use the session for competition purposes
2. Anonymisation of personal details before logging here
3. No storage of actual lease text unless user explicitly consents in writing
4. Offer to share the audit result with the user at no cost

This tracker stores metadata only — not the lease document content.
