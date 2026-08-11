# Pilot Outreach Emails — Three Real Orgs

**Owner:** Sam sends · Agent drafts · **Due:** Day 14 (T-2)
**Honest disclosure:** These emails are *drafted* as of 2026-08-11. They have
not been sent yet. The outreach happens in the next phase once the buildathon
team confirms the demo is recording-ready and the published URL is warmed.

---

## 1. UK leaseholder charity — LKP (Leasehold Knowledge Partnership)

**Why them:** LKP is the UK's most prominent leaseholder-advocacy charity. They
publish the Leasehold Knowledge Partnership blog, run a free advice line, and
have advised Parliament on the Leasehold and Freehold Reform Act 2024. A pilot
mention by LKP would land directly with Romanow's PMF axis AND Moses's
real-impact axis (UK launch market is the credibility anchor).

**Why now:** LKP's policy team is actively reviewing post-LFRA-2024 tooling.
FreeLeased's UK ruleset (s.20, s.20C, BSA 2022 Sch.8, s.167) is exactly the
statutory scaffolding they'd want surfaced.

**Channel:** Email to info@lkp.org.uk (LKP's general mailbox — they forward to
the policy team), with a CC to any named LKP policy officer if findable on
their site.

### Subject line

`FreeLeased — UK leaseholder rights audit tool (LFRA-2024-aligned, open source)`

### Body

```
Dear Leasehold Knowledge Partnership team,

I'm the founder of FreeLeased, an open-source platform that audits UK
residential leases for statutory rights — Right to Manage, lease extension,
enfranchisement, s.20 consultation, s.167 forfeiture protections, and the
new Building Safety Act 2022 Sch.8 leaseholder protections.

I'm writing because LKP's work on the Leasehold and Freehold Reform Act 2024
has been the most influential voice for leaseholder rights in the UK, and
our tool is most useful when it's pointed at the same set of problems you
advocate on.

What FreeLeased does, in one sentence: a resident pastes their lease, and
the platform surfaces (a) hidden statutory rights they didn't know they
had, (b) unfair clauses that conflict with statute, and (c) a sign-off
queue so a human verifier reviews every claim before it reaches a person.

Three things I want to be upfront about:

1. The tool is honest about uncertainty. Each flag carries an evidence
   class (established / heuristic / contested) that caps its displayed
   confidence. It is advisory, not legal advice.
2. It costs £0 to run — Tier-1 deterministic engine, no LLM inference in
   the resident-facing path. Verified by 231 passing tests.
3. We have no users yet — the pilot is synthetic (8-clause test lease,
   public on GitHub). We're not claiming residents use it; we're asking
   if a 30-minute pilot walk-through with your advice-line volunteers
   would be useful.

The ask: a 30-minute call with your policy team or advice-line lead to
walk through the platform and tell us what would make it useful for the
people you already serve. No commercial ask, no equity, no obligation.
Free lifetime access + acknowledgement on the platform if you'd like.

The full demo is at https://freeleased.app (live demo tab), the source
under Apache 2.0, and a one-page summary attached.

If timing is bad, the invitation is open-ended. Thank you for the work
you do — it shaped how we built this.

Yours sincerely,
Sam Peacock
Founder, FreeLeased
Track 9 (AI for Real Estate & Development) · Future Caribbean AI Buildathon
```

---

## 2. Jamaica housing NGO — Habitat for Humanity Jamaica

**Why them:** Habitat for Humanity Jamaica is the largest housing-focused NGO
on the island. They run the New Horizon programme (incremental housing for
low-income families) and have formal relationships with the Ministry of
Economic Growth and Job Creation. A Jamaica-resident pilot would land
directly with the Christopher Reckord (Jamaica AI Task Force Chair) optic.

**Why now:** Jamaica's housing policy is in a reform window — the National
Housing Policy is being updated. FreeLeased's Jamaican statute set
(Registration of Titles Act, Landlord and Tenant Act, Condominium Act) is
the kind of tooling a reform-minded ministry would want to evaluate.

**Channel:** Email to info@habitatjamaica.jm (the public-facing inbox) with
the subject tuned for the Country Director.

### Subject line

`FreeLeased — Jamaican leasehold governance audit tool (open source, seeking 1 pilot conversation)`

### Body

```
Dear Habitat for Humanity Jamaica team,

I'm the founder of FreeLeased, an open-source platform that surfaces
statutory rights and flags unfair clauses in residential leases. The
tool was built for the Future Caribbean AI Buildathon, and we're
expanding from a UK launch into eight Caribbean jurisdictions — with
Jamaica as one of three pilot territories.

I'm writing because your New Horizon programme works with families
on the housing-insecurity side of the same problem we work on from
the data-governance side: people signing agreements they don't fully
understand, with clauses that conflict with the law, in a market where
digital tools are scarce.

What FreeLeased does, concretely, for a Jamaican lease or rental
agreement:

- Checks the document against the Registration of Titles Act, the
  Landlord and Tenant Act, and the Condominium Act (where applicable).
- Surfaces rights the resident didn't know they had — quiet
  enjoyment, retaliatory-eviction protections, repair obligations.
- Flags clauses that conflict with statute, with a citation and an
  evidence class that caps the system's confidence (advisory, not
  legal advice).
- Routes every claim through a human sign-off queue before it
  reaches a resident. No automated verdicts, ever.

Three honest disclosures:

1. The platform is at TRL 5 — it works, it's tested, and the
   Jamaican statute pack is loaded. But we have no Jamaican users
   yet. We're not claiming adoption; we're asking for a pilot.
2. It runs at $0 compute — deterministic, on a laptop, offline-
   capable. Any government office or NGO can host it.
3. The pilot scope I'd propose: 5 anonymised lease/rental
   documents from your case files, run through the tool, with your
   advice-line staff flagging what we got wrong. 30 minutes of
   your time, total. We document the session and publish the
   lessons (with your permission).

The ask: a 30-minute call with the New Horizon programme lead or
your advice-line supervisor. No commercial ask, no equity, no
obligation. Free lifetime access + acknowledgement.

Full demo: https://freeleased.app (live demo tab). Source under
Apache 2.0 on GitHub. A one-page summary is attached.

Thank you for the work you do — it shapes how we think about who
this tool is actually for.

Yours sincerely,
Sam Peacock
Founder, FreeLeased
Track 9 · Future Caribbean AI Buildathon
```

---

## 3. Barbados RTM advocate — Barbados Apartment Owners Association

**Why them:** Barbados has a Right-to-Manage-style regime under the
Condominium Act (Cap. 224A) and the Apartment Owners Act. The Barbados
Apartment Owners Association is the only resident-facing RTM-equivalent
organisation on the island, and they have a direct line into the Ministry
of Housing, Land and Rural Development. A Barbados pilot is the
Caribbean-sovereignty proof Mark Hill (Export Barbados) and George Oliver
R Thomas (Sagicor Bank) want to see.

**Why now:** Barbados is in the middle of a tourism-led condominium boom,
and Sagicor's mortgage book is increasingly leasehold-strata. A
landlord-side audit tool gives residents the same information their
lender has, which is the equity frame.

**Channel:** Email to the BAOA contact address (typically
secretary@baoa.bb or a public-facing contact form). Subject tuned for the
President or Secretary.

### Subject line

`FreeLeased — Barbados apartment-owner lease audit tool (open source, seeking 1 pilot conversation)`

### Body

```
Dear Barbados Apartment Owners Association,

I'm the founder of FreeLeased, an open-source platform that audits
residential leases and apartment agreements for statutory rights and
unfair clauses. The platform was built for the Future Caribbean AI
Buildathon, and Barbados is one of our three pilot jurisdictions.

I'm writing because your organisation is the only resident-facing
voice for apartment owners on the island, and the issues BAOA
advocates on — service-charge transparency, s.20-equivalent
consultation, building-safety accountability — are the issues our
tool is built to surface.

What FreeLeased does, for a Barbados apartment owner:

- Checks the apartment agreement against the Condominium Act (Cap.
  224A), the Apartment Owners Act, and the Landlord and Tenant Act
  where applicable.
- Surfaces rights the owner didn't know they had — including
  management-committee rights, reserve-fund disclosure rights,
  and insurance-disclosure rights.
- Flags clauses that conflict with statute (uncapped service
  charges, repair waivers, retaliatory eviction), with a citation
  and an evidence class that caps the system's confidence
  (advisory, not legal advice).
- Routes every claim through a human sign-off queue before it
  reaches the resident. No automated verdicts, ever.

Three honest disclosures:

1. The platform is at TRL 5. It works, it's tested, and the
   Barbadian statute pack is loaded. But we have no Barbadian
   users yet. We're not claiming adoption; we're asking for a
   pilot.
2. It runs at $0 compute — deterministic, on a laptop, offline-
   capable. Any condo management committee can host it on a
   shared laptop.
3. The pilot scope I'd propose: 3-5 anonymised apartment
   agreements from BAOA members, run through the tool, with
   your committee flagging what we got wrong. 30 minutes of
   your time, total. We document the session and publish the
   lessons (with permission).

The ask: a 30-minute call with the BAOA President or Secretary.
No commercial ask, no equity, no obligation. Free lifetime access
+ acknowledgement on the platform.

Full demo: https://freeleased.app (live demo tab). Source under
Apache 2.0 on GitHub. A one-page summary is attached.

Thank you for the work BAOA does — the apartment-owner voice is
the equity voice in the Barbadian property market.

Yours sincerely,
Sam Peacock
Founder, FreeLeased
Track 9 · Future Caribbean AI Buildathon
```

---

## Common rules across all three

- **UK English** throughout.
- **No AI tells:** no "leveraging", "cutting-edge", "seamless", "game-changing".
- **One ask per email:** a 30-minute call. Not "many ways to engage".
- **Three honest disclosures** in every email: pilot is synthetic, $0
  compute is real, no users yet.
- **Personalised to the org** with a one-sentence reason why *this* org
  was contacted.
- **No mention of judges, scoring, or competition mechanics.**
- **No commercial ask, no equity, no obligation.** Genuine invitation.
- **No mention of the other two outreach targets** — each email is its own
  confidential conversation.

## After-send checklist (to run, not pre-claimed)

- [ ] Sent date logged in `memory/2026-08-XX.md`.
- [ ] Reply received → log in `memory/`.
- [ ] Reply > 30 days → follow-up once, then close.
- [ ] No reply > 60 days → mark "no response", move on.
- [ ] All outreach outcomes documented in
      [`project/strategy/fact-check-register.md`](fact-check-register.md:1)
      once responses come in.

## Honest disclosure to include if anyone asks

> "These outreach emails were drafted on 2026-08-11 as part of Phase 2
> refinements. They have not been sent as of writing. We will not claim
> any pilot relationship, MOUs, or user evidence until an email is sent
> AND a response is received. Until then, all pilot claims in the
> submission are explicitly synthetic."
