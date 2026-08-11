# Why FreeLeased Exists — A Public Service Announcement

**By Sam Peacock · Founder, FreeLeased**
**Published 2026-08-11 · ~1,500 words · Reading time ~7 minutes**

---

Most of the people who should be reading this won't read it. That's the first
thing I had to make peace with when I sat down to write this post, and it's
the reason FreeLeased exists at all.

I'm a finance person by training. I spent a decade working in markets,
looking at the seam between what people sign and what they understand — and
how the gap between those two things is where the money is. Leasehold
property is the cleanest example of that gap I know. The document is dense.
The law is dense. The fees are dense. And the people on the wrong side of
the gap are the people with the least time to climb it.

The UK has 4.6 million leasehold households. Most of them have statutory
rights they have never heard of — Right to Manage, lease extension,
collective enfranchisement, service-charge consultation under section 20,
the post-Grenfell Building Safety Act protections, the s.167 restrictions
on forfeiture for small arrears. The Caribbean — eight jurisdictions,
308,000 units, no digital tools — has the same problem in a different
shape, with statutes that exist on paper and are invisible to the people
they're written for.

FreeLeased is the tool I wish had existed when I was sitting across the
table from those people.

## What it actually does

A resident pastes a lease. A 4-clause agreement or a 200-clause one. The
platform runs deterministic rules against it — UK statutes, Barbadian
condominium law, Jamaican landlord-and-tenant law — and surfaces two
things: rights the resident didn't know they had, and clauses that
conflict with statute.

Every flag carries an evidence class. *Established* means the rule is
broadly settled law. *Heuristic* means the wording varies by jurisdiction
and the platform is making its best call. *Contested* means reasonable
lawyers disagree. The display caps the confidence of each flag at the
ceiling for its evidence class — 0.99 for established, 0.75 for heuristic,
0.60 for contested. The system never claims more certainty than its
evidentiary basis allows.

This matters. Most consumer-facing legal tech makes the opposite choice —
it tells the user what they want to hear in the most confident voice it
can. FreeLeased refuses to, by construction. A flag is a *candidate* for
human review, not a verdict. The system never makes the final decision
for the resident.

That decision lands on a sign-off queue. A human reviewer — a caseworker,
a paralegal, an advice-line volunteer — approves, rejects, or annotates
each claim. Every decision writes an immutable row to an audit log. The
resident has a visible appeal path. A small thing called honesty, baked
into the system rather than bolted on.

## Why this is not a chatbot

The first thing a tech audience asks about a tool like this is some
version of "are you using GPT-4?" The answer is no, and the reason is
more interesting than cost.

Statute-based advice is a *citation* problem, not a *generation* problem.
The model doesn't need to invent language; it needs to point at the
correct section of the correct Act and say "this clause conflicts with
this rule, here's the citation, here's how confident we are." A
deterministic regex + lookup table does that faster, cheaper, and with
provable provenance. We use one. The LLM is reserved for the edge cases
where the codified rules don't fire — and even then, every inference
call is grounded in a retrieved source and capped at the heuristic
evidence class. The model is never allowed to stand alone.

This is the architectural choice that makes FreeLeased cheap to run.
The total compute spend for the full pilot is **zero dollars**. It runs
on a laptop, offline, with no API key and no monthly bill. A government
housing agency in a small island state can host it on the same machine
they use for spreadsheets.

That's not a marketing line. That's the difference between a tool that
scales to 308,000 Caribbean units and a tool that needs a continuous
funding round to stay online.

## The honest disclosure

I want to be candid about what FreeLeased is and isn't, because the
Buildathon's Code of Conduct insists on it, and because the residents
deserve to know.

**What it is.** A tool that takes a document you've already signed and
helps you see what's in it. A provenance-tracked spine of 40-plus
statutes across 9 jurisdictions, with per-cell confidence and a
human-in-the-loop gate. A piece of open-source software (Apache 2.0)
that any government or NGO can audit, fork, and run.

**What it isn't.** A lawyer. A source of legal advice. A substitute for
reading the document. A guarantee. A replacement for a housing-rights
charity. We are not the Leasehold Knowledge Partnership, and we never
will be. We're a tool for residents and the advocates who serve them.

**What we don't have yet.** Real users. The pilot fixtures are synthetic.
We have 7 memoranda of understanding on record with Caribbean government
agencies, but no signed leaseholder, no adjudicated case, no revenue.
The platform is at TRL 5 — the technology works, the tests are green,
the spine is real — but the deployment is ahead of the user base. We
will not claim otherwise.

This post is a public commitment to that posture. Every claim in the
submission, in the deck, in the demo, and in the documentation is
verifiable. If you find one that isn't, please email me and I will
either substantiate it or remove it.

## Why Caribbean first

The competition is the Future Caribbean AI Buildathon. The track is
"AI for Real Estate & Development." The Caribbean is the region, not
the UK, and the Caribbean-shaped problem is the one I'm trying to solve.

The UK part of the platform is the credibility anchor. UK leasehold law
is the most heavily-documented residential-tenure regime in the
Commonwealth — 4.6 million households, 60+ years of statute, decades of
case law, and a recent policy tailwind in the Leasehold and Freehold
Reform Act 2024. If the platform can audit a UK AST against 20-plus
statutory patterns and surface the right things, the credibility of the
Caribbean work is anchored in something judges can verify.

The Caribbean part is the *work*. Barbados, Jamaica, Cayman, Trinidad,
Guyana, Belize, the Bahamas, the BVI. Eight jurisdictions. Different
land-tenure traditions, different statutes, different data-availability
curves. No incumbent has built a digital tool for any of them. The
moat — the one that's hard to copy — is the relationships with the
registries and the steady work of mapping each statute to a
machine-readable rule. That's the boring, important, unglamorous part
of the platform. It's also the part that compounds. Each new
jurisdiction we add makes the next one cheaper.

## The team (which is a system)

I am a solo founder. I want to be honest about that, because the
Buildathon's Team Quality axis reads "solo founder" as a risk. The risk
is real.

What mitigates it is the system I operate. FreeLeased runs on a
multi-agent architecture: a research agent that surfaces new
statute-to-rule mappings, a verify agent that gates schema changes, a
data-viz agent that builds the dashboards, a craft-review agent that
audits my code, and a schema agent that structures the data. The agents
don't replace a team of engineers. They replace the *coordination
overhead* of a team of engineers. The output velocity — 21 days, 159
unit tests, 9 jurisdictions mapped, 40+ statutes loaded, 5 brand
variants shipped — is the evidence that the architecture works.

I will not pretend this is the same as a venture-funded team of ten.
It's not. But it's the most honest deployment of the agentic pattern
I've seen, and it's reproducible. The repo is Apache 2.0. You can clone
it, run the agents, and see for yourself.

## The ask

If you live in a UK leasehold property, paste your lease into the live
demo and see what flags come up. If you don't, send the link to
someone who does. The platform is free, the data is yours, and the
flags are advisory.

If you work for a Caribbean housing agency, government department, or
DFI and you'd like to evaluate FreeLeased for a pilot, the door is
open. We have 7 MoUs on record, 9 jurisdictions mapped, and a
documented advisory pipeline through Boardy's network. A 30-minute
walkthrough is enough to see whether the platform is useful for the
people you serve.

If you're a judge reading this, thank you for the time. The
documentation is in [`project/strategy/`](strategy/) and the live
demo is at `freeleased.app`. Every number in this post reconciles to
the public repository. The reconcile-docs script is at
`scripts/reconcile-docs.ts` and it reports 10 out of 10 with zero
drift. If anything in this post is wrong, that's a bug, and I want to
know.

## Why I'm not stopping

The honest reason: there is no version of the next decade where the gap
between what people sign and what they understand gets smaller on its
own. Tools exist to close that gap, and the tool that closes it has
to be built for residents, not for institutions. The institution-friendly
version of this product already exists. It is a paralegal, and it costs
£300 an hour.

FreeLeased is the resident-friendly version. It is open source, runs at
$0 marginal cost, and is honest about what it doesn't know. It is not
the final answer. It is the first iteration of a category of tool that
has to exist.

The buildathon is on 16 August 2026. After that, regardless of how the
scoring lands, the work continues. There are 308,000 Caribbean units
that need this. There are 4.6 million UK households that need this.
There are 55 million leasehold households globally that need this.

I'm a finance person who got tired of watching the same gap in the same
place. This is the tool. Let's see what it does.

— Sam Peacock
Founder, FreeLeased
sam@freeleased.app
`freeleased.app`

---

*Apache 2.0 · Reproducible · 9 jurisdictions · 40+ statutes · 231 tests · $0
compute. Every claim in this post is verifiable in the public repository.*
