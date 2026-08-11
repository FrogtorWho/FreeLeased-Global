# FreeLeased Pilot Consent Form — v1.0

> **One-page consent form for real-leaseholder pilot sessions.**
> This is the canonical template — print two copies, hand one to
> the leaseholder, keep one for the operator's records.
> Version: 1.0 · 2026-08-11 · CoC §2 + §4 compliant.

---

## PAGE 1 — THE CONSENT

**Pseudonym:** `[PERSON_NAME-________]` *(operator fills in)*

**Date:** __________________ **Time:** __________________

**Operator:** Sam Peacock (or designated delegate)

### I understand and agree:

- [ ] FreeLeased is **document-only**. It is **not legal advice**. It does
      not create a solicitor-client relationship.
- [ ] I may **withdraw consent at any time** and request that everything
      FreeLeased holds under my pseudonym be **deleted within 7 days**.
- [ ] I may **export my data** (audit ledger, dossier, sign-off decisions)
      at any time, in JSON form, by emailing `export@freeleased.com`.
- [ ] FreeLeased **does not store my real name, address, phone, or email**.
      Everything is keyed by my pseudonym, `[PERSON_NAME-________]`.
- [ ] FreeLeased **does not share my data** with insurers, lenders, or
      marketers. There is no analytics SDK, no marketing pixel, no
      crash reporter.
- [ ] FreeLeased **does not profile me** or infer my emotion.
- [ ] All dossier outputs carry a **conviction class**
      (`established` | `heuristic` | `contested` | `unfalsifiable`).
      Anything `contested` requires a **human sign-off** before I act on it.

### I consent to the following data flow:

- [ ] (a) The clause I paste is processed **on-device** by the
      deterministic engines (regex spine + rule catalogue) before any
      network call.
- [ ] (b) When I click **"Analyse"**, the typed clause is sent to the
      dossier-builder endpoint. The audit ledger records the engine
      (`local-edge` | `cloud-<provider>` | `fallback`).
- [ ] (c) With `USE_LOCAL_EDGE=1` (the default), **no text leaves my
      device** after the dossier builder runs. With cloud LLMs enabled,
      text is sent to the named provider; I can disable this at any time.
- [ ] (d) Every dossier build, every sign-off decision, every appeal is
      appended to the **audit ledger** keyed by my pseudonym.

**Signature (leaseholder):** ______________________________

**Signature (operator):** ______________________________

---

## PAGE 2 — DATA FLOW, WITHDRAWAL, RESIDENCY

### Data flow (visual)

```
[You + your browser]
       │  (paste / upload — local engines run)
       ▼
[FreeLeased dossier builder]    ←  USE_LOCAL_EDGE=1 means this is
       │                            also local
       ▼
[Audit ledger]                  ←  pseudonym + engine + rowHash
       │
       ▼
[Sign-off tab]                  ←  you approve / reject / appeal
```

### Withdrawal & deletion

| Action | How | When effective |
|---|---|---|
| **Stop the session** | Tell the operator "stop" | Immediately |
| **Withdraw consent** | Email `withdraw@freeleased.com` (subject: pseudonym) | Within 24 hours |
| **Request deletion** | Email `deletion@freeleased.com` (subject: pseudonym) | Within 7 days |
| **Export your data** | Email `export@freeleased.com` (subject: pseudonym) | Within 7 days |
| **Appeal a sign-off** | Click "Appeal" in the Signoff tab | Immediately |

FreeLeased confirms each request with a certificate (PDF + email).
Certificates are logged in `memory/data-room-copies.md` under
discretion IDs `DECISION-DEL-NNN`, `DECISION-EXP-NNN`, `DECISION-APP-NNN`.

### Data residency

- **Default:** `USE_LOCAL_EDGE=1` — everything runs on your device
  except the dossier builder, which runs on the same machine.
- **Cloud LLMs (opt-in):** if enabled, typed clauses are sent to the
  named provider (see the engine field in the audit row). The
  provider is listed in the consent form's third-party disclosure.
- **No cross-border transfer** by default. FreeLeased does not
  operate servers outside the user's jurisdiction unless explicitly
  configured.

### What FreeLeased does NOT do

- Does not profile you.
- Does not infer your emotion.
- Does not store your real name, address, phone, or email.
- Does not sell your data.
- Does not share your data with insurers, lenders, or marketers.
- Does not record audio or video.

### Third-party disclosure (only if cloud LLMs are enabled)

If `USE_LOCAL_EDGE=0` and a cloud provider is configured, the
audit row records the provider. The current default cloud LLM
chain (in priority order) is:

1. **Local edge (Ollama)** — preferred, default off
2. **Impala gateway** — `https://ht.getimpala.ai/v1`
3. **MiniMax** — `https://api.minimax.io/v1`
4. **Shogo pod gateway** — `https://studio.shogo.ai` (in-pod, $0)

None of these providers receive PII (no name, no address, no email)
unless the typed clause itself contains them — which the operator
will redact before the leaseholder pastes.

---

## PAGE 3 — THIRD-PARTY PROVIDERS (operator-only)

Tick all that apply for this session:

- [ ] **Ollama local-edge** (`USE_LOCAL_EDGE=1`) — no third party
- [ ] **Impala gateway** — text sent to `ht.getimpala.ai`
- [ ] **MiniMax** — text sent to `api.minimax.io`
- [ ] **Shogo pod gateway** — text sent to `studio.shogo.ai` (in-pod)
- [ ] **None of the above** — no cloud LLM used this session

**Reaffirmed by leaseholder (initial):** _______________

---

## Notes (operator-only, not part of consent)

Use this space for session-specific notes. Do **not** record PII here.

```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## Cross-references

- [`real-pilot-onboarding.md`](real-pilot-onboarding.md:1) — the 30-minute procedure.
- [`mock-pilot-session-2026-08-11.md`](mock-pilot-session-2026-08-11.md:1) — worked example.
- [`src/lib/pseudonym.ts`](../../src/lib/pseudonym.ts:1) — pseudonym generator.
- [`memory/data-room-copies.md`](../../memory/data-room-copies.md) — certificate log.

---

**Version:** 1.0 · **Date:** 2026-08-11 · **Owner:** Sam Peacock

CoC §2 (consent before data collection) — PASS
CoC §4 (data residency + withdrawal + deletion path) — PASS