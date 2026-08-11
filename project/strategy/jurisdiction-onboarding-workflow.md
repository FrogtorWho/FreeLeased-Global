---
title: Jurisdiction Onboarding Workflow — top-down, scrape-driven
type: playbook
status: active
version: 1.0
updated: 2026-08-11
tags: [workflow, jurisdictions, scrape, schema, spine, repeatable]
aliases: [Jurisdiction Onboarding, Onboarding Playbook, Legislative Onboarding]
---

> [!abstract] What this is
> The **single, repeatable workflow** for adding a new jurisdiction's complete
> legislative framework to FreeLeased's spine. It is deliberately **top-down**
> (gazette → primary acts → subordinate legislation → cases → tribunals →
> remedies) and **scrape-driven** (HTTP-first, LLM-second). It hardens the
> discipline in [`truth-protocol.md`](project/strategy/truth-protocol.md:1) and
> [`data-structuring-protocol.md`](project/strategy/data-structuring-protocol.md:1)
> into a step-by-step playbook any agent can follow.

> [!info] Where this fits
> Output schema: [`src/data/legislative-framework-schema.ts`](src/data/legislative-framework-schema.ts:1)
> Output artefacts: `src/data/frameworks/{code}-framework.json` (one per jurisdiction)
> Scraping tool: [`scripts/scrape-jurisdiction.ts`](scripts/scrape-jurisdiction.ts:1)
> Test harness: [`scripts/test-jurisdiction-scrape.ts`](scripts/test-jurisdiction-scrape.ts:1)
> Live proofs: [`src/data/frameworks/uk-framework.json`](src/data/frameworks/uk-framework.json:1),
> [`src/data/frameworks/bb-framework.json`](src/data/frameworks/bb-framework.json:1)
> Migration: [`src/data/MIGRATION-v1-to-v2.md`](src/data/MIGRATION-v1-to-v2.md:1)

---

## 1. Overview — what the workflow produces

For any jurisdiction **J** (code + name), the workflow produces ONE canonical
file:

```
src/data/frameworks/{J.code}-framework.json
```

that conforms to the [`LegislativeFramework`](src/data/legislative-framework-schema.ts:1)
shape and contains:

- **1** jurisdiction header (code, name, legal system, constitutional foundation, gazette URL, last-verified timestamp, contributor pseudonym)
- **N** primary acts (the statutes people cite most often)
- **M** regulations (subordinate legislation under a primary act)
- **K** statutory instruments (commencement orders, SIs, statutory rules)
- **R** reform amendments (later acts that amend an earlier primary act)
- **C** leading cases (judgments that interpret the statutes)
- **P** procedural rules (tribunal/court rules of procedure)
- **E** enforcement bodies (who enforces the rights)
- **Y** remedies (what a resident can ask for)

Every record carries a conviction class, a source URL, and a `[PERSON_NAME]`-safe
contributor pseudonym. The file is the **input contract** for the spine
migration (`src/data/spine-v2.ts`) and for the knowledge graph.

---

## 2. Pre-flight checklist (5 questions before starting)

Before opening a scraper tab, answer these. If any answer is "no," the
workflow should not start.

1. **Is the jurisdiction in scope?** — Is it on the FreeLeased roadmap
   (BB, JM, KY, TT, BS, GY, BZ, VG, UK)? If not, file an issue with justification
   (resident demand, MoU partner, demo priority) before proceeding.
2. **Is there a primary source online?** — Confirm the official gazette / law
   revision portal is reachable without JS rendering (curl works). If the
   portal requires JS or login, the scrape must be classified as Tier 3
   (deferred — see [`data-structuring-protocol.md`](project/strategy/data-structuring-protocol.md:1) §DSP-3).
3. **Is there a person willing to sign off?** — Every onion of the framework
   (acts → SIs → cases → remedies) requires a human reviewer (Sam or
   designated domain reviewer). If no reviewer is available, the workflow
   caps at `conviction: pending` and refuses to publish as `verified`.
4. **Is the contributor pseudonym `[PERSON_NAME]`-safe?** — Decide who
   is the researcher. Use `[PERSON_NAME]` for any agent-sourced record;
   use a real-pseudonym (lowercase, alphanumeric) only for human contributors
   who have consented. The consent convention is in [`AGENTS.md`](AGENTS.md:1).
5. **Is the timeframe realistic?** — A minimal viable framework (≥3 primary
   acts, ≥1 reform, ≥1 leading case for the most-cited right) takes 2–4
   hours of focused research. A complete framework (10+ acts, 5+ reforms,
   10+ cases, all procedural rules) takes 1–2 days. Allocate accordingly.

> **Failure mode:** starting the scrape without these answers leads to
> half-finished frameworks that ship as `pending` and drag the spine's
> data-sufficiency score down.

---

## 3. Source ranking — Tier 1, Tier 2, Tier 3

Every URL we cite is graded. The grade determines whether a record can be
`established` or must be capped at `heuristic`/`contested`.

### Tier 1 — Official gazettes / law revision portals
> **Use as primary.** Records sourced here can be `established`.

Examples:
- UK: [legislation.gov.uk](https://www.legislation.gov.uk/)
- BB: [barbadoslawcourts.gov.bb](https://www.barbadoslawcourts.gov.bb/) (acts gazette)
- JM: [moj.gov.jm](https://moj.gov.jm/) (Ministry of Justice portal)
- KY: [legislation.gov.ky](https://legislation.gov.ky/)
- TT: [agla.gov.tt](https://agla.gov.tt/) (Office of the Attorney General & Legal Affairs)
- VG: [bvi.gov.vg](https://www.bvi.gov.vg/) (BVI government portal)

### Tier 2 — International law databases / court reports
> **Use as secondary.** Can corroborate a Tier 1 source but cannot establish
> on its own.

Examples:
- [CommonLII](https://www.commonlii.org/) (Commonwealth Legal Information Institute)
- [CaribbeanLII](https://www.caribbeanlii.org/)
- [Westlaw](https://www.westlaw.com/), [LexisNexis](https://www.lexisnexis.com/) (commercial; not free)
- CCJ: [caribbeancourtofjustice.org](https://www.ccj.org/)

### Tier 3 — NGO / advocacy / law-firm summaries
> **Use only for cross-checking.** Never primary. Can give plain-English
> summaries that we paraphrase (with attribution).

Examples:
- LEASE (UK), CA (UK), Shelter (UK)
- Caribbean Association of Bar Associations
- Law-firm briefings (Charles Russell, Norton Rose, etc.)

### Tier 4 — Wikipedia / blog posts
> **Confirmatory only.** Records from these sources must carry `unverified: true`
> and `conviction: heuristic` at best.

---

## 4. Scrape protocol (per source type)

The scrape phase is **HTTP-first**: native `fetch`, no headless browser. If
a Tier 1 source is JS-rendered, classify it as Tier 3 and document the
limitation.

### 4.1 Official gazette portal
- **Endpoint:** the index page (e.g. `/acts` or `/legislation`).
- **Method:** `GET` with a `User-Agent` header identifying FreeLeased.
- **Output:** list of `primaryAct.id` candidates, each with a `sourceUrl`.
- **Validation:** `LegislativeFrameworkSchema.parse()` per record; every
  `sourceUrl` must round-trip via `new URL()`.

### 4.2 Statute page
- **Endpoint:** the act-specific URL (e.g. `https://www.legislation.gov.uk/ukpga/1985/70/contents`).
- **Method:** `GET`; check for a 200; record `content-type`, `content-length`.
- **Output:** `summary` (1 paragraph plain English), `leaseholderRelevantSections`,
  `commencementDate`, `lastAmended`, `officialPdfUrl` (if embedded).
- **Validation:** the `lastAmended` field must match a known amendment
  record (cross-link with §5 below).

### 4.3 Statutory instrument page
- **Endpoint:** e.g. `/uksi/2025/131/made`.
- **Method:** `GET`; confirm `inForceDate` against the page's "Coming into force" section.
- **Output:** SI record with `number`, `inForceDate`, `summary`.
- **Validation:** if the SI amends a primary act, the `parentActId` must be
  resolvable in the same framework.

### 4.4 Court judgment portal
- **Endpoint:** BAILII / ccj.org / court-specific.
- **Method:** `GET`; use citation as the search key.
- **Output:** `LeadingCase` record with `citation`, `judges`, `headnote`,
  `relevantActs`.
- **Validation:** the `court` field must match the portal's tribunal hierarchy;
  the `significance` field is set by the reviewer, not the scraper.

### 4.5 Retry / rate-limit policy
- 1 retry on 5xx (with 1s backoff).
- 429 → back off 30s, then retry once.
- 3xx → follow up to 5 redirects; record final URL.
- 4xx → mark `unverified: true`; do not retry.
- All probes emit a span via the [`TelemetrySpan`](src/lib/telemetry.ts:1) shape (DSP-5).

---

## 5. Extraction protocol (record order)

The order is **top-down** — broad framework first, narrow detail last. This
mirrors how a lawyer would summarise a jurisdiction.

1. **Jurisdiction header** — `code`, `name`, `legalSystem`, `constitutionalFoundation`
   (e.g. "Constitution of Barbados, 1966 (cap. 1)"), `officialGazette`, `lastVerified`, `contributorPseudonym`.
2. **Primary acts** — only acts that are *cited* in the FreeLeased audit
   flow OR that are foundational to leasehold/strata/condominium tenure.
3. **Regulations** — subordinate legislation under each primary act.
4. **Statutory instruments** — commencement orders, transitional rules, etc.
5. **Reform amendments** — later acts that materially change an earlier primary act.
6. **Leading cases** — judgments that interpret the act's key sections.
7. **Procedural rules** — tribunal/court rules of procedure.
8. **Enforcement bodies** — who enforces the rights; powers + contact URL.
9. **Remedies** — what a resident can ask for; cross-references to legalBasis.

---

## 6. Validation protocol (every record, every time)

A record is publishable as `verified` only if **all** of these hold:

- [ ] **URL resolves** — `sourceUrl` returns HTTP 200 (or 3xx followed to 200).
- [ ] **Conviction is backed** — for `established`, ≥1 **independent** Tier 1 source
      supports the claim (see [`truth-protocol.md`](project/strategy/truth-protocol.md:1) §0.3).
- [ ] **Contributor pseudonym is `[PERSON_NAME]`-safe** — matches
      `/^\[PERSON_NAME\]$|^[a-z0-9-]+$/`.
- [ ] **`unverified` is set** — if any of the above fail, the record is published
      with `unverified: true` and `conviction` capped at `heuristic`.
- [ ] **Cross-links resolve** — `parentActId`, `amendsActId`, `relevantActs[]`
      all match an `id` elsewhere in the framework.
- [ ] **No fabrication** — never invent a URL. If a citation is suspected but
      unverified, set `unverified: true` and leave the source URL as the
      "best known" gazette root.

The validation is enforced by:

- **Compile-time:** `LegislativeFrameworkSchema.parse()` throws on malformed
  records (URL parse, conviction enum, pseudonym regex).
- **Runtime:** `scripts/scrape-jurisdiction.ts` probes every URL and
  reports `alive | dead | redirected` per source.
- **CI:** `scripts/test-jurisdiction-scrape.ts` runs 15+ assertions on parsing,
  retry logic, schema validation.

---

## 7. Schema mapping — how to fill the `LegislativeFramework` shape

Each tier of record maps to a field:

| Workflow extract | Schema field | Notes |
|---|---|---|
| Jurisdiction header | `LegislativeFramework.jurisdiction` | One per file. |
| Primary Act | `LegislativeFramework.primaryActs[]` | `id` = lowercase jurisdiction + dash + slug (e.g. `uk-clra-2002`). |
| Regulation | `LegislativeFramework.regulations[]` | `parentActId` must reference a primary act. |
| Statutory Instrument | `LegislativeFramework.statutoryInstruments[]` | `number` preserves the jurisdiction's citation form (e.g. `SI 2025/131`). |
| Reform Amendment | `LegislativeFramework.reformAmendments[]` | `amendingActId` and `amendsActId` both reference primary acts. |
| Leading Case | `LegislativeFramework.leadingCases[]` | `relevantActs[]` references primary act ids. |
| Procedural Rule | `LegislativeFramework.proceduralRules[]` | `tribunalOrCourt` is human-readable (e.g. "First-tier Tribunal (Property Chamber)"). |
| Enforcement Body | `LegislativeFramework.enforcementBodies[]` | `contactUrl` is the body's homepage or contact page. |
| Remedy | `LegislativeFramework.remedies[]` | `legalBasis` references primary act ids; `formTemplateId` is optional and links to a form template in the resident dossier. |

---

## 8. Spine integration — where it lives, how it cross-links

The framework JSON is the **input contract** for the spine. The migration
(`src/data/MIGRATION-v1-to-v2.md`) describes the bridge:

```
spine-v1.ts  ←  spine.ts (legacy)
spine-v2.ts  ←  src/data/frameworks/{code}-framework.json  (one per jurisdiction)
```

Cross-link targets:

- **Knowledge graph** ([`src/lib/knowledge-graph.ts`](src/lib/knowledge-graph.ts:1))
  — auto-generates `applies_to`, `cites`, `amends` edges from `primaryActs[].id`,
  `leadingCases[].relevantActs[]`, `reformAmendments[].{amendsActId, amendingActId}`.
- **Consensus gate** ([`src/lib/consensus.ts`](src/lib/consensus.ts:1))
  — uses the framework's `conviction` to bound the confidence it can assign.
- **Veracity engine** ([`src/lib/veracity.ts`](src/lib/veracity.ts:1))
  — uses the framework's `sourceUrl` as the primary source for any claim.
- **Research desk** ([`src/lib/research.ts`](src/lib/research.ts:1))
  — uses the framework's `lastVerified` to set the SLA re-check clock.

---

## 9. HITL gate — when does Sam need to sign off

The workflow is **agent-led for extraction**, but **human-gated for publication**.

| Phase | Sign-off needed? | Who |
|---|---|---|
| Pre-flight (#2) | Yes — green-light the jurisdiction | Sam |
| Scrape (#4) | No — automated | (agent) |
| Extract (#5) | No — record by record | (agent) |
| Validate (#6) | **Yes — every `established` claim** | Sam (or domain reviewer) |
| Schema map (#7) | No — automated | (agent) |
| Spine integration (#8) | **Yes — first time per jurisdiction** | Sam |
| Citation refresh (see #10) | **Yes — `contested` upgrade** | Sam |

Default: the agent publishes nothing with `conviction: established` without
a Sam signature in the git log (commit message or PR review). The exception
is `unverified: true` records, which are allowed but visibly capped.

---

## 10. Ongoing maintenance — per-jurisdiction SLA

Each framework decays; the SLA clock is set by `lastVerified` per primary act.

| Resource class | Re-verify cadence | Why |
|---|---|---|
| Primary statute (UK) | every 180 days | LFRA / BSA amendments are frequent |
| Primary statute (BB / JM / KY) | every 365 days | Caribbean law reform is slower |
| Statutory instrument | every 90 days | Commencement orders and revoked SIs change often |
| Leading case | every 365 days | Precedent is stable; new SCOT/UKSC rulings are not |
| Procedural rule | every 365 days | Tribunal rules change every few years |
| Enforcement body | every 365 days | Powers and contact URLs drift |
| Remedy | every 180 days | Form templates and procedure change |

The MAINTENANCE sub-loop of the [`gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1)
runs these checks nightly and emits a `staleness` report:

```
⚠  uk-lfra lastVerified 2026-02-01 — 220 days ago (SLA 180)
✔  bb-condo lastVerified 2026-08-11 — 0 days ago
```

A `*` marking in the nightly report is the trigger for a re-extract
(re-run §4–§6 on the affected record).

---

## 11. Each step: who's responsible, what artefact, what tool, what failure mode

| Step | Owner | Artefact | Tool | Failure mode |
|---|---|---|---|---|
| 1. Pre-flight | Sam | Signed issue / Notion card | GitHub issue | Starts without scoping → half-done framework |
| 2. Source ranking | Agent | `tier` tag per URL | Manual table | Tier 4 sources cited as primary → data drift |
| 3. Scrape | Agent | `src/data/frameworks/{code}-ini.json` | [`scripts/scrape-jurisdiction.ts`](scripts/scrape-jurisdiction.ts:1) | 5xx storm → fraction of acts captured |
| 4. Extract | Agent | `frameworks/{code}-framework.json` | LLM-assisted (offline / on-demand) | Mis-parsed section numbering → wrong citations |
| 5. Validate | Sam + Agent | `frameworks/{code}-framework.json` (signed) | [`scripts/test-jurisdiction-scrape.ts`](scripts/test-jurisdiction-scrape.ts:1) | Unverified URL silently accepted → citeable false |
| 6. Schema map | Agent | import in `spine-v2.ts` | `LegislativeFrameworkSchema.parse()` | Dropped fields on import → silent data loss |
| 7. Spine integration | Sam (review) | `src/data/spine-v2.ts` | `git diff` | v1 not preserved → regressions in `App.tsx` |
| 8. HITL gate | Sam | Commit/PR | `gh pr create` | `established` claims without sign-off → reputation drift |
| 9. Maintenance | Agent (nightly) | `staleness` report | [`gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1) MAINTENANCE sub-loop | Stale citations → "court-readiness 100/100" style drift |

---

## 12. Worked example — applying #1–#11 to a new jurisdiction (Bahamas, hypothetically)

> **Pre-flight.** YES — BS is on roadmap. NO JS rendering needed (bahamas.gov.bs
> serves static HTML). YES — Sam sign-off pending. PSEUDONYM `[PERSON_NAME]`.
> 1 day allocated.
>
> **Source ranking.** Tier 1: bahamas.gov.bs (Department of Lands & Surveys);
> Tier 2: CommonLII; Tier 3: bahamasbarassociation.com.
>
> **Scrape.** `bun scripts/scrape-jurisdiction.ts BS` probes 14 statutes →
> 12 alive, 2 dead. Dead URLs flagged `unverified: true`.
>
> **Extract.** Agent fills 12 primary acts, 4 regulations, 2 SIs, 1 reform,
> 3 leading cases, 2 procedural rules, 4 enforcement bodies, 8 remedies.
>
> **Validate.** Sam reviews the 3 "established" claims (Condominium Act,
> Land Tax Act, Statute of Frauds). 2 pass, 1 downgrades to `heuristic`
> (whitepaper URL died).
>
> **Schema map.** `LegislativeFrameworkSchema.parse()` validates the file.
>
> **Spine integration.** Sam opens PR; reviewer approves; `spine-v2.ts`
> imports `bs-framework.json`.
>
> **HITL gate.** PR merged; commit `feat(jurisdiction): onboard Bahamas`.
>
> **Maintenance.** Nightly, the gauntlet marks `bs-condo` SLA due in 90 days.

---

## 13. Cross-links

- Schema: [`src/data/legislative-framework-schema.ts`](src/data/legislative-framework-schema.ts:1)
- UK proof: [`src/data/frameworks/uk-framework.json`](src/data/frameworks/uk-framework.json:1)
- BB proof: [`src/data/frameworks/bb-framework.json`](src/data/frameworks/bb-framework.json:1)
- Scrape scaffold: [`scripts/scrape-jurisdiction.ts`](scripts/scrape-jurisdiction.ts:1)
- Scrape tests: [`scripts/test-jurisdiction-scrape.ts`](scripts/test-jurisdiction-scrape.ts:1)
- Migration: [`src/data/MIGRATION-v1-to-v2.md`](src/data/MIGRATION-v1-to-v2.md:1)
- Truth protocol: [`project/strategy/truth-protocol.md`](project/strategy/truth-protocol.md:1)
- Data structuring protocol: [`project/strategy/data-structuring-protocol.md`](project/strategy/data-structuring-protocol.md:1)
- Multi-jurisdiction spine: [`project/strategy/multi-jurisdiction-legal-spine.md`](project/strategy/multi-jurisdiction-legal-spine.md:1)
- Gauntlet loop: [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1)
- Day 100 win plan: [`project/strategy/WIN-DAY-100.md`](project/strategy/WIN-DAY-100.md:1)

---

*Last updated: 2026-08-11 — initial playbook written. Owner: FreeLeased core.*
