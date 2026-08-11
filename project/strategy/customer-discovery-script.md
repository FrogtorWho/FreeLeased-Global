# Customer Discovery Script — 5 interviews (UK + Caribbean)

**Version:** 1.0 · **Date:** 2026-08-11
**Owner:** Sam Peacock, Founder
**Companion:** [`100-judge-gap-report.md`](100-judge-gap-report.md:1) §18 (X1, X2)

> **Why.** The L4→L5 exit criterion requires 5 named
> customer interviews — UK + Caribbean — within the next 14
> days. Below is the script, the recruitment matrix, the
> consent flow, and the analysis template.

---

## 1. Recruitment matrix (5 named conversations)

| # | Country | Role | Channel | Why this person |
|---:|---|---|---|---|
| 1 | UK (London) | Leaseholder, contested service charge | UK Reddit r/HousingUK warm DM | First published UK user case |
| 2 | UK (Manchester) | RTM-company director | LinkedIn DM via Sam | Active RTM practitioner |
| 3 | Barbados | Property manager (long-tenured) | Diaspora referral | Caribbean strata-experience |
| 4 | Trinidad & Tobago | Condo board secretary | Diaspora network | TT-specific question |
| 5 | Cayman Islands | Conveyancing solicitor | Cold DM + LinkedIn | Cayman-spec legal accuracy |

If any of these 5 declines, we have 3 backups:

| Backup | Country | Role |
|---:|---|---|
| 6 | UK (Birmingham) | Leasehold Advisory Service referral officer |
| 7 | Jamaica | Diaspora attorney + landlord |
| 8 | BVI | BVI Lands & Survey staff member |

---

## 2. Consent flow (before the interview)

Email at least 24 hours before, attaching:

1. **This script** (`customer-discovery-script.md`) so they
   know what to expect.
2. **Consent form** (`pilot-audit/consent-template.md`) with:
   - Right to refuse any question
   - Right to stop at any time
   - Right to delete transcripts within 7 days
   - Whether attribution will be: named / role only / anonymous
3. **Recording choice** — audio recorded for transcription
   only (and deleted after 30 days unless they say otherwise)

If they decline the recording, we take hand notes and offer
to share a clean transcript for approval before quoting.

---

## 3. The script (60 min, structure: 10 / 40 / 10)

### 3.1 Pre-amble (10 min)

> "Thanks for taking the time. The purpose of this call is
> research — for me to understand your lived experience. I
> will not pitch you. The best outcome is that I learn
> something that changes what we build."

- Confirm consent choice (recording yes/no)
- Confirm attribution choice (named / role only / anonymous)
- Confirm 60-min cap and stop-whenever-right

### 3.2 Discovery (40 min — open-ended first)

Six questions. Listen for **stories** (specific episodes),
**numbers** (quantities, prices, dates), and
**incidents** (turning-point moments).

| # | Question | What we want to learn |
|---:|---|---|
| Q1 | Tell me about the most recent service-charge / strata / RTM / HOA issue you lived through. Walk me through it. | Real-time narrative; who; what; how long |
| Q2 | When you say "[contested / unclear / expensive]", can you put a number on it? | £, days, meetings, solicitors involved |
| Q3 | What did you try first? What did you wish you had? | Existing-tools landscape |
| Q4 | What's the ugliest part of the process? | Pain points ranked |
| Q5 | If a product existed that did X, Y, Z, which of those would you use next week? | Depth-of-need + willingness-to-pay signals |
| Q6 | Who else has this same problem? | Network; virality coefficient |

### 3.3 Closing (10 min)

- Confirm any follow-up asset
- Confirm what we'll send: cleaned transcript, summary, or
  thank-you note
- Confirm any warm intro they could make

---

## 4. Question variant for the **Caribbean strata** interviewee (3, 4, 5)

Replace Q1-Q6 with:

| Q | Caribbean variant |
|---|---|
| Q1 | Tell me about the most recent condo-board / strata / management issue. Walk me through it from the resident's side. |
| Q2 | What would "good faith" look like from the manager's side? |
| Q3 | What data do you wish was public, that isn't? |
| Q4 | Post-hurricane (Irma / Maria / Dorian / Beryl), what broke first in your building's records? |
| Q5 | If a free tool could auto-audit your strata's annual accounts against the strata rules, what's the first thing it would surface? |
| Q6 | If we wanted to pilot in your jurisdiction, who would we need to bring to the table? |

---

## 5. Question variant for the **UK solicitor / RTM director** (1, 2, 6)

| Q | Variant |
|---|---|
| Q1 | Walk me through the last leasehold claim you supported end-to-end. |
| Q2 | Where did the leaseholder lose information? |
| Q3 | What would shave 2 weeks off your process? |
| Q4 | What's the irreducible minimum you'd want a tool to do to be useful? |
| Q5 | Would you ever recommend an open-source tool to a client? Under what condition? |
| Q6 | If we wanted a written referral, what would you need from us? |

---

## 6. Output & analysis

After the call, same-day:

1. **Transcript** (with `[name]` redacted unless attribution
   agreed) — `memory/interviews/<name>-<date>.md`
2. **Scorecard** — fill in the table below
3. **Decision** — add to `project/pilot-audit/user-evidence-tracker.md`
   with verdict: `proceed / park / reject / unclear`

### 6.1 Scorecard (per interview)

| Axis | 0–10 | Notes |
|---|---|---|
| **P**roblem frequency | | |
| **P**ain severity | | |
| **W**illingness to pay | | |
| **W**illingness to refer | | |
| **W**illingness to advise | | |
| **Fit with our wedge** (leaseholder-facing, jurisdiction-aware) | | |

Total ≥ 40/60 → proceed.

---

## 7. Sample non-pitch language

The script avoids selling. Stock phrases:

- "I'm trying to understand..."
- "When you say X, what does that look like day-to-day?"
- "If I had a magic wand..."
- "What's your best guess for..."
- "What would you wish a tool couldn't do?"
- "If this never got built, would you still be OK?"
- "Who's the one person I should talk to next?"

Forbidden phrases (do not say):

- "Our tool..."
- "We use AI..."
- "You should sign up..."
- "Let me show you a demo..."
- "We can do X for Y price..."

---

## 8. Calendar slots

Sam's calendar (Europe/London):

| Date | Slot 1: UTC 09:00-10:00 | Slot 2: UTC 17:00-18:00 |
|---|---|---|
| 2026-08-12 (Wed) | #5 Cayman solicitor | #1 UK leaseholder |
| 2026-08-13 (Thu) | #3 Barbados manager | backup |
| 2026-08-14 (Fri) | #4 TT board sec | #2 UK RTM director |

(Code-freeze is 2026-08-14 23:59 UTC — interviews may
continue past freeze but no code changes.)

---

## 9. After-action checklist

- [ ] Transcript stored with `[name]` redacted
- [ ] Scorecard filled
- [ ] User-evidence-tracker updated
- [ ] Public summary post (`/blog/<handle>-interview`) —
  *only if attribution agreed*
- [ ] Sponsor / partner intro offered (only one place)

— Sam Peacock
2026-08-11
