# Boardy Advisory Activation — Action Plan

> **Owner:** Sam Peacock (sender) · **Agent:** code/strategist · **Drafted:** 2026-08-11
> **Status as of 2026-08-11:** drafted, not sent. This document is the
> **single actionable activation checklist** that consolidates the 3
> advisory-ask templates drafted in
> [`05-advisory-ask-boardy.md`](05-advisory-ask-boardy.md:1).
> **Cross-reference:**
> [`all-partners-brainstorm.md`](all-partners-brainstorm.md:1) (Idea #41)

---

## 0. Why this exists

The Team Quality axis (B1) is the rubric axis most at risk for a solo
founder. The structural lift that closes B1 from 7 → 9 is one of:

1. A named advisory quote from a recognised Caribbean domain expert, OR
2. A documented warm-intro trail via Boardy showing the request was made.

Either is honest. Both are better. This plan is **step 2** — the
documented trail.

We **do not claim** any advisory relationship until each person has
explicitly agreed in writing. Until then, all advisory references in
the submission are explicitly "drafted, not sent".

---

## 1. Three targets — concrete schedule

All times are in **Europe/London (BST, UTC+1)**. Sam is the named sender.

### Target 1 — Dr. Parris Lyew-Ayee (UWI Geospatial & Disaster Risk)

| Field | Value |
|-------|-------|
| Why | Judge AND geospatial credibility anchor — climate-resilience layer |
| Public email | Not publicly listed in 2026 |
| Route | Warm intro via Boardy |
| **Send date** | **Mon 2026-08-11, 18:00 BST** (Day 14 / T-2 to demo) |
| Response expected by | **Wed 2026-08-13, 18:00 BST** (3-day buffer) |
| Reply deadline in template | 2026-08-13 |
| Follow-up cadence | 1 ping after 48h if no response |
| Status (as of draft) | **drafted, not sent** |
| Source template | [`05-advisory-ask-boardy.md` §2a](05-advisory-ask-boardy.md:93) |

### Target 2 — Christopher Reckord (Chair, Jamaica AI Task Force)

| Field | Value |
|-------|-------|
| Why | Jamaica pilot jurisdiction, AI-policy legitimacy |
| Public email | Not publicly listed in 2026 |
| Route | Warm intro via Boardy |
| **Send date** | **Mon 2026-08-11, 18:15 BST** (single batch with #1 + #3) |
| Response expected by | **Wed 2026-08-13, 18:15 BST** |
| Reply deadline in template | 2026-08-13 |
| Follow-up cadence | 1 ping after 48h if no response |
| Status (as of draft) | **drafted, not sent** |
| Source template | [`05-advisory-ask-boardy.md` §2b](05-advisory-ask-boardy.md:131) |

### Target 3 — Marla Dukharan (Caribbean economist)

| Field | Value |
|-------|-------|
| Why | Macro lens; weight with Todd Speece / Citi |
| Public email | Not publicly listed in 2026 |
| Route | Warm intro via Boardy |
| **Send date** | **Mon 2026-08-11, 18:30 BST** (single batch with #1 + #2) |
| Response expected by | **Wed 2026-08-13, 18:30 BST** |
| Reply deadline in template | 2026-08-13 |
| Follow-up cadence | 1 ping after 48h if no response |
| Status (as of draft) | **drafted, not sent** |
| Source template | [`05-advisory-ask-boardy.md` §2c](05-advisory-ask-boardy.md:167) |

---

## 2. The Boardy message — single batch

Sam sends Boardy (via Boardy's official intro channel) **one message**
with three asks. Full text lives in
[`05-advisory-ask-boardy.md` §1](05-advisory-ask-boardy.md:38). Verbatim
key constraints (must hold for every send):

- **UK English** throughout.
- **No AI tells:** no "leveraging", "cutting-edge", "seamless", "game-changing".
- **One ask per one-pager:** a 1-2 sentence statement of support.
- **Three honest disclosures:** TRL-5 not TRL-9, $0 compute real, no
  users yet.
- **Personalised to the recipient** with a one-sentence reason why
  *this* person was contacted.
- **No mention of judges, scoring, or competition mechanics** in the
  one-pagers (Boardy is told — the recipients are not).
- **No commercial ask, no equity, no obligation.**
- **Reply deadline 13 August 2026** — gives a 3-day buffer before T-2.

---

## 3. State machine — every target

Every target moves through a 5-state machine. Initial state for all 3
is **`drafted`**. No target moves to **`sent`** without Sam's explicit
go-ahead recorded in `memory/2026-08-XX.md`.

```
drafted ──Sam sends──> sent
   │                     │
   │                     ├──reply received──> replied
   │                     │                      │
   │                     │                      ├──quote approved──> closed_quote
   │                     │                      │
   │                     │                      ├──declined──> closed_decline
   │                     │
   │                     ├──48h no reply──> pinged
   │                     │                   │
   │                     │                   ├──reply received──> replied
   │                     │                   │
   │                     │                   └──still no reply──> closed_silent
   │                     │
   │                     └──T-2 (2026-08-13 18:00 BST)──> closed_silent
   │
   └──never sent (Sam cancels)──> cancelled
```

The state is tracked in
[`project/strategy/boardy-activation-log.md`](boardy-activation-log.md:1)
(generated by `scripts/boardy-outreach-status.ts`).

---

## 4. Outcomes — what happens after the responses land

### 4.1 If 1+ replies with a usable quote (≤ 2 sentences)

1. Quote logged to [`memory/2026-08-XX.md`](../../memory/2026-08-XX.md).
2. Quote published to [`CREDITS.md`](../../CREDITS.md) with explicit
   permission noted.
3. B1 (Team Quality) updated in [`self-rubric-score.md`](self-rubric-score.md:1)
   and [`projected-final-score.md`](projected-final-score.md:1) — but
   **only if** the quote is published with consent.
4. State moves to `closed_quote`.

### 4.2 If replies decline

1. Decline logged to [`memory/`](../../memory/) with verbatim reason.
2. State moves to `closed_decline`.
3. No public claim, no advisory credit.

### 4.3 If no reply by 2026-08-13 18:00 BST (T-2)

1. State moves to `closed_silent`.
2. `fact-check-register.md` gets a row:
   `"Warm intro requested via Boardy, no response by T-2."`
3. B1 (Team Quality) stays at its current 7 — and the rubric is
   honest about why.
4. No follow-up is sent after T-2 — the Buildathon has 72 hours to go
   and the recipient's silence is the answer.

---

## 5. Cancellation / override

Sam may cancel any individual send at any point before the send date
with a single note in `memory/`. Cancellation is recorded as state
`cancelled` with reason.

The plan **does not run automatically**. This document is the
checklist Sam uses to manually execute the sends.

---

## 6. Honest disclosure (mandatory)

> **As of 2026-08-11:** All 3 advisory asks are **drafted, not sent**.
> No warm intro has been requested via Boardy. The send dates above are
> **planned**, not committed. We will not claim any advisory
> relationship, quote, or role until each person has explicitly
> agreed in writing.

This statement appears in every public reference to the Boardy plan
until the state machine reaches `closed_quote` for at least one target.

---

## 7. Checklist (to run, not pre-claimed)

- [ ] Mon 2026-08-11 — Sam sends Boardy intro message (3 asks).
- [ ] Tue 2026-08-12 — 48h ping if no response.
- [ ] Wed 2026-08-13 — Reply deadline. State advances to `closed_*`.
- [ ] Wed 2026-08-13 — Update `fact-check-register.md` with outcome.
- [ ] Thu 2026-08-14 (T-1) — If any quote received, publish to CREDITS.
- [ ] Thu 2026-08-14 — Update B1 in `self-rubric-score.md` if warranted.
- [ ] Sat 2026-08-16 — Demo day. Boardy plan does not affect demo.

---

*Action plan written 2026-08-11. Reversible by deleting the file. Honest.*