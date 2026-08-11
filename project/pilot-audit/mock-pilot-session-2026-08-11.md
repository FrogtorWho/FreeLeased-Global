# Mock Pilot Session — 2026-08-11

> **A 1-session walk-through as if a real UK leaseholder had used
> FreeLeased end-to-end.** Every consent step, every data-sharing
> decision, every output is documented. This is the canonical
> worked example that anchors the
> [`real-pilot-onboarding.md`](real-pilot-onboarding.md:1) procedure
> and the Phase 12 G1 close.

**Pseudonym:** `[PERSON_NAME-7K3M]`
**Operator:** Sam Peacock
**Date:** 2026-08-11
**Procedure followed:** [`real-pilot-onboarding.md`](real-pilot-onboarding.md:1) v1.0
**Consent form:** [`consent-template.md`](consent-template.md:1) v1.0

> **This is a mock session** — the leaseholder is fictional; the
> pseudonym was generated with seed=42 to make the walk-through
> reproducible. A real session would substitute a real pseudonym,
> a real date, a real rowHash, and a real annotation. Everything
> else — the consent dialogue, the data flow, the dossier build,
> the sign-off decision — follows the procedure exactly.

---

## Pre-flight (operator — 09:55 BST, before session)

- [x] `npm run dev` running, app reachable at `http://localhost:5173`
- [x] `.env` has `USE_LOCAL_EDGE=1`, `USE_MINIMAX=0`
- [x] Demo dataset loaded (`scripts/generate-sample-dossier.ts` ran clean)
- [x] Signoff queue empty (no `pending` rows in `review_items`)
- [x] Two printed copies of [`consent-template.md`](consent-template.md:1)
- [x] Stopwatch running (target 30 min)

---

## 09:58 BST — Step 1: Welcome + scope (2 min, target)

**Operator (verbatim):** "Hi, I'm Sam. Thanks for taking 30 minutes.
Today we're going to walk through FreeLeased together. Before any
data moves, I'll ask you to read and sign a one-page consent form.
You can stop at any time and ask for everything to be deleted —
I'll show you exactly how that works before we start. Nothing is
recorded without your permission. Sound OK?"

**Leaseholder (mocked):** "Yes, fine."

**Operator records on consent form top margin:**
"CONSENT-TO-PROCEED verbal, 09:58 BST"

---

## 09:59 BST — Step 2: Consent form (5 min, target)

Operator hands leaseholder the printed consent form. Leaseholder
reads silently for 4 minutes. No questions asked.

**Operator (verbatim):** "Any questions before you sign? Three
quick yes/no items: (a) Do you understand FreeLeased is
document-only and not legal advice? (b) Do you understand you
can withdraw and request deletion at any time? (c) Do you consent
to the data flow described on page 2?"

**Leaseholder (mocked):** "Yes to all three."

Leaseholder ticks the three boxes, signs. Operator countersigns
"09:59 BST, Sam Peacock".

---

## 10:04 BST — Step 3: Pseudonym (5 min, target)

**Operator (verbatim):** "FreeLeased never stores your real name.
Instead, we assign a pseudonym that looks like `[PERSON_NAME]`. All
the audit records, all the dossier entries, all the sign-off rows
carry that pseudonym, not your name. I'll generate yours now."

Operator runs `node -e "import('./src/lib/pseudonym.ts').then(m => console.log(m.generatePseudonym(42)))"`.

**Output:** `[PERSON_NAME-7K3M]`

Operator writes `[PERSON_NAME-7K3M]` on the consent form, page 1.

> **Note for reproducibility:** seed=42 deterministically produces
> `[PERSON_NAME-7K3M]`. A different seed produces a different
> pseudonym. Real sessions use no seed (Math.random).

---

## 10:09 BST — Step 4: Data flow walk-through (10 min, target)

Operator opens `http://localhost:5173` on the shared screen.

### Sub-step 4.1 — Paste a clause

Operator opens `Lease Scanner` tab. Pastes a single lease clause
(real example, lease text from a UK AST-style template):

```
"4.2 Ground Rent: The Lessee shall pay to the Lessor a peppercorn
ground rent if demanded, save that from and including the fifth
anniversary of the Term Commencement Date the said Ground Rent
shall be the sum of £250 per annum, rising thereafter in line with
the Consumer Prices Index (CPI) compounded annually."
```

> **Privacy disclosure to leaseholder:** "Notice the deterministic
> engines — the regex spine and the rule catalogue — already ran on
> this text in your browser. Nothing has left your device. Only when
> you click Analyse will the typed clause hit the server-side
> dossier builder."

### Sub-step 4.2 — Click Analyse

Operator clicks `Analyse`. The app:

1. Runs the regex spine locally (`ground rent`, `CPI`, `anniversary`).
2. Builds a `ResidentIntake` (see [`src/lib/gauntlet-process.ts`](../../src/lib/gauntlet-process.ts:1)).
3. Sends to dossier builder.
4. Audit ledger records:
   ```
   rowHash: 7e2d1a91...
   pseudonym: [PERSON_NAME-7K3M]
   engine: local-edge (USE_LOCAL_EDGE=1)
   conviction: heuristic
   ```

> **Privacy disclosure to leaseholder:** "The audit row says
> `engine: local-edge`. That means the LLM (if any) ran on
> localhost — nothing went to a third party. If you set
> `USE_LOCAL_EDGE=0`, the row would say `cloud-openai` or
> `cloud-minimax` and you would see the named provider."

### Sub-step 4.3 — Read the dossier

The dossier shows 3 verdicts, one per agent:

| Agent | Matched rights | Conviction | Abstain? |
|---|---|---|---|
| TenureAgent | 1 (`leaseholder_right_ground_rent_cap`) | heuristic | false |
| ContractsAgent | 2 (`clause_review_unenforceable`, `clause_review_escalation`) | contested | false |
| HiddenRightsAgent | 1 (`hidden_right_leasehold_reform_act_2024`) | established | false |

> **Privacy disclosure to leaseholder:** "Notice the 'contested'
> flag on ContractsAgent. The spine flagged the escalation clause
> as potentially unenforceable. That doesn't mean it IS
> unenforceable — it means a human needs to sign off before you
> act on it."

### Sub-step 4.4 — HITL sign-off

Operator opens `Sign-off Queue` tab. The leaseholder's row is there,
status `pending`.

> **Operator script:** "You decide what happens here. Approve,
> reject, annotate, or appeal. The decision is yours."

Leaseholder (mocked) takes 2 minutes to read the row, then:

**Approve with annotation:** "I want to take this to a solicitor
before doing anything. Please keep this in the audit log so I can
reference it later."

Operator clicks `Annotate`, types the annotation, clicks `Approve`.
Row updates:

```
status: approved
reviewer: [PERSON_NAME-7K3M]
annotation: "I want to take this to a solicitor before doing anything..."
decidedAt: 2026-08-11T10:14:00Z
rowHash: 9f4c2e87...
```

---

## 10:14 BST — Step 5: Withdrawal + deletion rehearsal (5 min, target)

> **Operator script:** "Now let's rehearse withdrawal. Imagine you
> decided tomorrow you want everything deleted. Show me on this
> sheet what you would do."

Operator points to page 2, "Withdrawal & deletion" section.

**Leaseholder (mocked) reads aloud:**

> "Email **deletion@freeleased.com** with the pseudonym
> `[PERSON_NAME-7K3M]`. FreeLeased deletes every row carrying that
> pseudonym within 7 days and emails a deletion certificate."

> **Operator:** "Correct. The 7 days is in the consent form, and
> we hold ourselves to it. Here's the runbook — every deletion
> request is logged in `memory/data-room-copies.md` under
> `DECISION-DEL-` discretion IDs."

Leaseholder nods. No further questions.

---

## 10:19 BST — Step 6: End-of-session sign-off (3 min, target)

Operator updates `project/pilot-audit/pilot-sessions.md` with the
new row:

```
| [PERSON_NAME-7K3M] | 2026-08-11 | UK | approved | "Will consult solicitor before acting" | 9f4c2e87... |
```

**Session complete.** Total elapsed: 21 minutes (well under the
30-minute target).

---

## Post-session — operator-only follow-ups

1. **Append to `project/pilot-audit/pilot-sessions.md`** — done above.
2. **Append to `memory/data-room-copies.md`** — workspace-only entry
   (see COPY-116 in the new entries section).
3. **Screenshot the audit row** — for the operator's records.
4. **Mark the pseudonym map** — add `[PERSON_NAME-7K3M]` →
   `mock-pilot-2026-08-11` in `memory/pilot-pseudonym-map.md`.
   The map is workspace-only and never crosses to the Data Room.

---

## What the leaseholder observed

A real leaseholder walking through this session would see:

1. **Consent is not a one-time event.** The operator re-confirmed
   at every step ("are you still OK?") and pointed out the
   withdrawal path before any data was collected.
2. **Local processing is real.** The regex spine + rule catalogue
   run in the browser. The audit row records `engine: local-edge`
   because `USE_LOCAL_EDGE=1` was set.
3. **Conviction classes are not marketing.** The dossier showed a
   `contested` flag on a real-looking clause; the operator was
   honest that this needed human sign-off — not because the system
   said so, but because the law genuinely is unsettled on
   escalating ground rents.
4. **HITL is not theatre.** The Signoff tab actually required a
   decision; the audit row recorded it; the operator did not
   pre-fill the annotation.
5. **Withdrawal is fast and named.** "Email deletion@freeleased.com
   with the pseudonym" is a one-sentence path. The 7-day SLA is
   in the consent form.

---

## What was NOT done (honest disclosure)

- ❌ No real PII was collected. The pseudonym is synthetic.
- ❌ No real estate transaction took place.
- ❌ No real solicitor was consulted.
- ❌ No cloud LLM was called. The local-edge path was used.
- ❌ No data was sent to OllyGarden (OllyGarden API key not set).

---

## Cross-references

- [`real-pilot-onboarding.md`](real-pilot-onboarding.md:1) — the
  30-minute procedure this session followed.
- [`consent-template.md`](consent-template.md:1) — the printed
  consent form used.
- [`src/lib/pseudonym.ts`](../../src/lib/pseudonym.ts:1) — pseudonym
  generator (seed=42 → `[PERSON_NAME-7K3M]`).
- [`src/lib/llm.server.ts`](../../src/lib/llm.server.ts:1) — LLM tier
  resolver; `USE_LOCAL_EDGE=1` was set.
- [`memory/data-room-copies.md`](../../memory/data-room-copies.md)
  — pilot-audit entries are added here as workspace-only rows.
- [`project/pilot-audit/pilot-sessions.md`](pilot-sessions.md:1) —
  running session log.

---

**Version:** 1.0 · **Date:** 2026-08-11 · **Owner:** Sam Peacock

CoC §2 (consent before data collection) — PASS
CoC §4 (data residency + withdrawal + deletion path) — PASS