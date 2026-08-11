# Real Pilot Onboarding — 30-Minute Leaseholder Onboarding Procedure

> **The complete, repeatable procedure for turning a real human
> leaseholder into an active FreeLeased pilot user in 30 minutes.**
> CoC §2 (consent) + §4 (data residency + withdrawal) compliant.
> Last revised 2026-08-11 for the Phase 12 close.

---

## 1. Scope and purpose

This procedure exists so a FreeLeased operator (Sam or a designated
delegate) can sit with a real leaseholder, complete a real pilot
session, and have a signed, audit-ready record — **in 30 minutes or
less** — without ever losing the consent discipline the project holds
itself to.

The procedure is written so a non-technical operator can follow it
verbatim. It is also the source-of-truth that the mock pilot session
([`mock-pilot-session-2026-08-11.md`](mock-pilot-session-2026-08-11.md:1))
is anchored against.

---

## 2. The 30-minute timeline

| Minute | Step | Who | Tool | Output |
|---|---|---|---|---|
| 0–2 | Welcome + scope | Operator | Script below | Verbal consent to proceed |
| 2–7 | Consent form | Leaseholder | [`consent-template.md`](consent-template.md:1) (printed) | Signed consent form |
| 7–12 | Pseudonym assignment | Operator | Random pseudonym generator | `[PERSON_NAME]` token |
| 12–22 | Data flow walk-through | Operator | This doc §5 + UI demo | Leaseholder sign-off on data flow |
| 22–27 | Withdrawal + deletion rehearsal | Operator | This doc §6 | Leaseholder confirms the path |
| 27–30 | End-of-session sign-off | Both | Signoff ledger | `ReviewItem` row, no PII persisted |

**Total: 30 min.** A "compressed" 15-min variant exists for warm
leads (see §10).

---

## 3. Pre-flight checklist (operator-only)

Run **before the leaseholder arrives**:

- [ ] `/mobile/capture` route live (`npm run dev` is running)
- [ ] `USE_LOCAL_EDGE=1` in `.env` (G8 — on-device default)
- [ ] `USE_MINIMAX=0` (cloud LLM off; no residency surprise)
- [ ] Demo dataset loaded (`scripts/generate-sample-dossier.ts`)
- [ ] Signoff queue empty (`scripts/health-check.ts` row 11)
- [ ] Two printed copies of the consent form
- [ ] Pseudonym generator ready ([`generatePseudonym()`](../../src/lib/pseudonym.ts:1))
- [ ] Data room URL bookmarked (`memory/data-room-copies.md`)
- [ ] Stopwatch / timer running

---

## 4. Step-by-step (verbatim scripts)

### Step 1 (0–2 min) — Welcome + scope

> **Operator script:** "Hi, I'm Sam. Thanks for taking 30 minutes.
> Today we're going to walk through FreeLeased together. Before any
> data moves, I'll ask you to read and sign a one-page consent form.
> You can stop at any time and ask for everything to be deleted —
> I'll show you exactly how that works before we start. Nothing is
> recorded without your permission. Sound OK?"

Leaseholder answers verbally. Operator writes "CONSENT-TO-PROCEED
verbal, [time]" on the consent form top margin.

### Step 2 (2–7 min) — Consent form

Hand the leaseholder the printed
[`consent-template.md`](consent-template.md:1). Give them 4 minutes
to read. **Do not interpret** — answer questions only when asked.

After 4 minutes:

> **Operator script:** "Any questions before you sign? Three
> quick yes/no items: (a) Do you understand FreeLeased is
> document-only and not legal advice? (b) Do you understand you
> can withdraw and request deletion at any time? (c) Do you consent
> to the data flow described on page 2?"

Leaseholder ticks three boxes, signs the form. Operator countersigns.

### Step 3 (7–12 min) — Pseudonym

> **Operator script:** "FreeLeased never stores your real name.
> Instead, we assign a pseudonym that looks like `[PERSON_NAME]`. All
> the audit records, all the dossier entries, all the sign-off rows
> carry that pseudonym, not your name. I'll generate yours now."

Operator runs `node scripts/generate-pseudonym.ts` (or uses the
generator in [`src/lib/pseudonym.ts`](../../src/lib/pseudonym.ts:1)),
records the 8-char pseudonym on the consent form.

### Step 4 (12–22 min) — Data flow walk-through

The operator opens the app at `http://localhost:5173` (or the
deployment URL) on a shared screen. They walk through:

1. **Paste / upload a clause** — show that the text never leaves
   the device unless the leaseholder explicitly clicks "Analyse".
   *Privacy guarantee: the deterministic engines (regex spine +
   rule catalogue) run locally on the typed/leaked-text path —
   nothing is transmitted.*
2. **Click "Analyse"** — the typed text is now sent to the
   server-side dossier builder. The leaseholder sees the
   `engine:` row in the audit ledger, which records whether
   local-edge or cloud LLM ran. *Privacy guarantee: with
   `USE_LOCAL_EDGE=1`, the LLM call is to localhost only.*
3. **Read the dossier** — show the conviction class column.
   "Established" means the spine has a primary-act citation;
   "heuristic" means the rule came from the pattern catalogue;
   "contested" means a human (Sam or you) must sign off.
4. **HITL sign-off** — open the `Signoff` tab. Show the row the
   leaseholder's dossier just created, with their pseudonym and
   `pending` status. "You decide what happens here. Approve,
   reject, annotate, or appeal. The decision is yours."

The leaseholder is given 5 minutes to ask questions.

### Step 5 (22–27 min) — Withdrawal + deletion rehearsal

> **Operator script:** "Now let's rehearse withdrawal. Imagine you
> decided tomorrow you want everything deleted. Show me on this
> sheet what you would do."

The operator points to the consent form, page 2, section "Withdrawal
& deletion". The leaseholder reads aloud the path:

> "Email **deletion@freeleased.com** with the pseudonym
> `[PERSON_NAME-XXXX]`. FreeLeased deletes every row carrying that
> pseudonym within 7 days and emails a deletion certificate."

The operator confirms: "Correct. The 7 days is in the consent form,
and we hold ourselves to it. Here's the runbook — every deletion
request is logged in `memory/data-room-copies.md` under
`DECISION-DEL-` discretion IDs."

### Step 6 (27–30 min) — End-of-session sign-off

The operator opens the Signoff tab in the UI, finds the leaseholder's
`ReviewItem` row, and either:
- **Approves** — if the leaseholder wants their dossier visible to
  themselves for follow-up, OR
- **Rejects** — if the leaseholder wants everything destroyed now.

Either way, the operator:

1. Adds a one-line annotation (e.g. "Session 1 complete, no further
   contact requested").
2. Records the row hash.
3. Prints / screenshots the row for the operator's records.
4. Updates `project/pilot-audit/pilot-sessions.md` with a new entry
   (pseudonym, date, decision).

**End: 30 minutes.** Leaseholder leaves with the consent form in hand.

---

## 5. Data flow disclosure (page 2 of consent form)

```
You → Device (browser)        FreeLeased client runs 100% locally:
                              regex spine, rule catalogue, dossier
                              builder preview, conviction classifier.

You click "Analyse" → Server  The typed clause (≤ 4 KB) is sent to the
                              FreeLeased dossier-builder endpoint.
                              The server runs the deterministic engines.
                              If `USE_LOCAL_EDGE=1`, the LLM call (if
                              any) is to localhost. With cloud LLMs
                              OFF, no text leaves the device after this
                              single hop.

Server → Audit ledger         Every dossier build logs:
                              • pseudonym `[PERSON_NAME-XXXX]`
                              • engine (local-edge | cloud | fallback)
                              • conviction class (established|heuristic|contested)
                              • rowHash (immutable integrity stamp)

You → Signoff tab             You approve / reject / annotate / appeal.
                              Your decision is the audit-of-record.
```

**No third parties receive your data.** There is no analytics SDK,
no marketing pixel, no crash reporter. OllyGarden (if wired) only
sees spans (no PII; see §11).

---

## 6. Withdrawal & deletion (page 2)

You may at any time:

| Action | How | When effective |
|---|---|---|
| **Stop a session** | Say "stop" to the operator | Immediately |
| **Withdraw consent** | Email `withdraw@freeleased.com` with your pseudonym | 24 hours |
| **Request deletion** | Email `deletion@freeleased.com` with your pseudonym | **7 days** |
| **Export your data** | Email `export@freeleased.com` | 7 days |
| **Appeal a sign-off** | Click "Appeal" in the Signoff tab | Immediately |

FreeLeased confirms each request with a deletion / export / appeal
certificate (PDF + email). The certificate is logged in
[`memory/data-room-copies.md`](../../memory/data-room-copies.md) under
discretion IDs `DECISION-DEL-NNN`, `DECISION-EXP-NNN`,
`DECISION-APP-NNN`.

---

## 7. Data residency (page 2)

By default, FreeLeased runs **on-device** (`USE_LOCAL_EDGE=1`). No
text leaves the browser unless you explicitly click "Analyse", and
even then, the dossier builder runs on the same machine. There is
no cross-border data transfer by default.

When `USE_LOCAL_EDGE=0` and a cloud LLM is configured, the typed
clause is sent to the cloud LLM provider. The provider is named in
the audit row (`engine: openai|grok|minimax|...`) and listed in the
consent form's third-party disclosure. **You can disable cloud LLMs
permanently by setting `USE_LOCAL_EDGE=1`** — the leaseholder is
encouraged to do this.

---

## 8. What we DO NOT do (page 2)

- We do not profile you.
- We do not infer your emotion.
- We do not store your real name, address, phone, or email.
- We do not sell your data.
- We do not share your data with insurers, lenders, or marketers.
- We do not record audio or video.

---

## 9. Pilot session record template

After every session, the operator appends one row to
`project/pilot-audit/pilot-sessions.md`:

```markdown
| pseudonym | date | jurisdiction | decision | annotation | rowHash |
|---|---|---|---|---|---|
| [PERSON_NAME-XXXX] | 2026-08-12 | UK | approved | "Session 1 OK, follow-up via email" | <hash> |
```

The `pilot-sessions.md` file lives in `project/pilot-audit/` and
is **workspace-only** — it never crosses to the Data Room. The
Data Room mirror is `02_Problem Validation/interview_notes/`,
populated only with pseudonymised, redacted excerpts.

---

## 10. Compressed 15-minute variant

For warm leads (e.g. a boardy intro, a returning user) the operator
may run a compressed flow:

| Minute | Step |
|---|---|
| 0–3 | Welcome + scope (verbal consent) |
| 3–6 | Consent form (signed) |
| 6–9 | Pseudonym + data flow walk-through |
| 9–13 | Paste one clause → Analyse → review dossier |
| 13–15 | Sign-off + session record |

The compressed variant skips the withdrawal rehearsal (§5) and is
only used when the leaseholder has already completed a prior
session.

---

## 11. Cross-references

- [`consent-template.md`](consent-template.md:1) — the printed consent form.
- [`mock-pilot-session-2026-08-11.md`](mock-pilot-session-2026-08-11.md:1) — a
  full mock pilot session (canonical worked example).
- [`project/pilot-audit/pilot-sessions.md`](pilot-sessions.md:1) — running session log.
- [`src/lib/pseudonym.ts`](../../src/lib/pseudonym.ts:1) — pseudonym generator.
- [`memory/data-room-copies.md`](../../memory/data-room-copies.md) — every
  deletion / export / appeal is logged here.
- [`src/lib/llm.server.ts`](../../src/lib/llm.server.ts:1) — LLM tier
  resolver (G8 — local-edge default).

---

## 12. Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-11 | Phase 12 — initial procedure. Closes G1 (real-pilot workflow). |

— Sam Peacock, 2026-08-11