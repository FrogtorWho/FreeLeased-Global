# Giotto.ai Brainstorm + Top-5 Implementation

> **Future Caribbean Buildathon — Giotto.ai leverage doc.**
> Sam Peacock, 2026-08-11. Generated the day we got Giotto's grant of tools.
>
> 57 ideas across 6 categories. Every idea: 1-line description, feasibility
> (S/M/L), impact (H/M/L), and the rubric axis it lifts (from
> [`judge-panel-analysis.md`](judge-panel-analysis.md) / [`self-rubric-score.md`](self-rubric-score.md)).
>
> **Top-10 ranking** + **top-5 implementations** below.

---

## A. Resident-facing (the user)

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 1 | **Lease OCR + extraction from phone photos** — Giotto's multimodal OCR replaces `ocr-pipeline.ts` regex when key set; falls back to Tesseract otherwise. | S | H | Reasoning, Sophistication |
| 2 | **Bill/screenshot OCR → service-charge gap detection** — feed a service-charge bill to Giotto, return the gap vs the dossier baseline. | S | H | Reasoning, Impact |
| 3 | **Voice → text → structured intake for accessibility** — Giotto accepts voice, returns typed resident intake; critical for low-literacy users. | M | M | Impact, Distinctiveness |
| 4 | **Multilingual intake: EN→HT, EN→ES, EN→FY, EN→FR-patois** — translate intake responses into 4 Caribbean languages; "first multilingual Caribbean legal tool." | M | H | Impact, Distinctiveness |
| 5 | **Real-time Q&A over the resident's own dossier** — chat sidebar that ONLY answers from `buildDossier()` output; never invents. | M | H | HITL, Reasoning |
| 6 | **Document completeness check ("you forgot page 4")** — Giotto reads the photo set, lists missing pages before the dossier build starts. | S | M | Reasoning, Implementation |
| 7 | **Translation of tribunal decisions into plain English** — upload a 30-page LVT decision, get a 1-page summary. | S | H | Impact, Reasoning |
| 8 | **Tone adjustment ("explain this to my landlord")** — rewrite legal prose as a firm-but-polite email body. | S | M | Impact, Distinctiveness |
| 9 | **Citation explanation ("what does s.20 actually mean?")** — paste any citation, get plain-English explanation + practical example. | S | M | Reasoning, HITL |
| 10 | **Template-aware letter drafting** — combines [`src/lib/templates.ts`](../../src/lib/templates.ts:1) + Giotto to fill the variable slots from the dossier. | M | H | Sophistication, Impact |
| 11 | **Calendar items ("remind me to file Q4 service-charge challenge by 30 Sep")** — pull statutory deadlines from the spine + dossier, export to .ics. | M | M | Impact, HITL |
| 12 | **Chatbot persona ("I'm a UK leaseholder, ask me anything")** — opinionated UK-leases persona prompt; can be swapped per jurisdiction. | S | M | Distinctiveness, Reasoning |
| 13 | **Lease clause red-flag detector ("this clause is unusual — 3% above cap")** — feeds each clause to Giotto with the spine's caps as ground truth. | S | H | Reasoning, Sophistication |
| 14 | **Settlement calculator ("if landlord offers £X, is that fair?")** — combines Giotto + arithmetic on statutory formulas. | M | H | Impact, Sophistication |

## B. Advisor / institutional

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 15 | **Comparative analysis ("how does UK s.20 compare with JM Condo Act?")** — cross-jurisdiction table generated from the spine + Giotto commentary. | M | H | Distinctiveness, Impact |
| 16 | **Legal memo auto-generation (HITL-required, draft only)** — `/api/dossier/[id]/memo` endpoint: Giotto drafts from the dossier, never publishes; HITL signs off. | M | H | HITL, Sophistication |
| 17 | **Cross-jurisdiction pattern detection** — Giotto reads the knowledge graph + proposes new edges; human approves. | M | M | Reasoning, Multi-agent |
| 18 | **Multi-resident briefing generation** — "generate the EGM briefing for 12 leaseholders in Building X" → 12 personalised letters. | M | H | Impact, Distinctiveness |
| 19 | **Court-readiness packet** — timeline + exhibits + citations in the order the tribunal expects. | M | H | HITL, Reasoning |
| 20 | **Settlement negotiation role-play** — chat with Giotto acting as "landlord's solicitor" so the resident rehearses. | S | M | HITL, Distinctiveness |
| 21 | **Plain-language version of statute** — read a 90-page Act, return a 2-page resident summary. | S | H | Impact, Reasoning |
| 22 | **Precedent search** — find similar tribunal cases given a fact pattern. | M | H | Reasoning, Sophistication |
| 23 | **Lawyer-grade redline of contract clauses** — paste a draft lease, get a tracked-changes version with statutory citations. | M | H | Reasoning, Distinctiveness |
| 24 | **Compliance gap audit for housing associations** — scan a portfolio's leases against the spine, return a heat-map. | L | H | Impact, Distinctiveness |

## C. Demo / judge-facing

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 25 | **Live 3-minute demo with Giotto narrating each scene** — UI captures the voice output; Giotto IS the narrator. | M | H | Multi-agent, Distinctiveness |
| 26 | **Real-time dossier build narrated by Giotto** — "I see page 4 mentions s.20..." — judge watches the build, not the result. | M | H | Reasoning, HITL |
| 27 | **Multi-modal demo: scan a real lease → verdict in <30s** — `/api/demo/scan-lease` endpoint; 30-second judge demo. | S | H | Reasoning, Sophistication |
| 28 | **Side-by-side: Giotto extraction vs human extraction** — split-screen comparison; judge sees the lift. | M | M | Reasoning, Implementation |
| 29 | **Reasoning-trace visualisation ("here's why the engine flagged this clause")** — Giotto prose + the existing DS gauge side-by-side. | S | H | Reasoning, HITL |
| 30 | **Giotto as on-stage Q&A answerer (live, not pre-scripted)** — feeds from the docs + Q&A kill-list into a chatbot. | M | H | Multi-agent, Reasoning |
| 31 | **Auto-generated 60-second pitch video script** — one-line prompt, structured 60s script in 5s. | S | M | Distinctiveness, Impact |
| 32 | **Auto-generated tailored cover letter per advisor** — feeds MoU + advisor profile → draft email. | S | M | Impact, HITL |
| 33 | **Auto-generated demo Q&A prep** — read `judge-qa-kill-list.md`, draft Giotto answers for each question. | S | H | Reasoning, HITL |
| 34 | **Reasoning card per verdict (judge-facing)** — 1-card-per-verdict PNG; exportable. | M | M | Reasoning, Implementation |
| 35 | **Conviction weight visualised as a sankey diagram** — Giotto drives the layout; sankey shows how conviction flows into verdict. | M | M | Distinctiveness, Reasoning |

## D. Gauntlet loop integration (overnight agent)

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 36 | **PROCESS sub-loop: Giotto classifies the intake document** — replaces regex classifier when key set; else fallback. | S | H | Multi-agent, Reasoning |
| 37 | **RESEARCH sub-loop: Giotto fetches & summarises new statutes** — overnight pull + summary from `KNOWN_REGISTRIES`. | M | H | Multi-agent, Impact |
| 38 | **UPDATE sub-loop: Giotto drafts the verdict summary** — feeds dossier → 1-paragraph plain-English summary. | S | H | Reasoning, HITL |
| 39 | **MAINTENANCE sub-loop: Giotto fetches source URLs in parallel** — fetcher decides what's stale, Giotto summarises the diff. | M | H | Multi-agent, Implementation |
| 40 | **SELF-IMPROVE sub-loop: Giotto analyses the last 100 HITL decisions for patterns** — finds clusters, proposes rule updates. | M | M | Multi-agent, Reasoning |
| 41 | **Conviction weight bootstrap** — Giotto reads case law → assigns initial weights. | L | H | Reasoning, Sophistication |
| 42 | **Jurisdiction onboarding** — Giotto reads a country's primary statute and drafts the spine records. | L | H | Multi-agent, Impact |
| 43 | **Daily news scan** — Giotto summarises leasehold law changes for the daily digest. | M | M | Impact, Distinctiveness |

## E. Architecture / defensibility

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 44 | **Giotto as the project's "translator" layer** — any LLM output → FreeLeased's typed Pydantic models. | S | H | Implementation, Reasoning |
| 45 | **Giotto as the project's "safety filter"** — catches hallucinated citations before they hit the dossier. | S | H | Reasoning, HITL |
| 46 | **Giotto as live tutor** — chat sidebar in the UI that teaches residents as they use the app. | M | H | Impact, Distinctiveness |
| 47 | **Giotto as the project's Q&A benchmark** — every UI question has a canonical Giotto answer. | S | M | Implementation, Reasoning |
| 48 | **Giotto + OllyGarden** — every verdict also writes a trace span explaining the reasoning (dual observability). | M | H | Multi-agent, Implementation |
| 49 | **Giotto + Impala** — chain Giotto (reasoning) → Impala (data spine query) → final verdict. | L | H | Reasoning, Multi-agent |
| 50 | **Giotto as a resident-side "second opinion" engine** — separate from the dossier engine; deliberate redundancy. | M | H | Reasoning, HITL |

## F. Distribution / growth

| # | Idea | Feasibility | Impact | Rubric Axis |
|---|------|-------------|--------|-------------|
| 51 | **Telegram bot powered by Giotto** — WhatsApp for Caribbean. | M | H | Impact, Distinctiveness |
| 52 | **Giotto-powered landing page that interviews visitors** — routes them to the right tool. | M | M | Impact, Distinctiveness |
| 53 | **Giotto translates README.md into 4 languages automatically on commit** (GitHub Action). | S | M | Impact, Distinctiveness |
| 54 | **Giotto generates a personalised "your rights cheat sheet" PDF on demand**. | S | H | Impact, HITL |
| 55 | **Giotto powers a public-facing FAQ chatbot on freeleased.org**. | M | M | Impact, Distinctiveness |
| 56 | **Giotto drafts grant applications, MoU letters, and advisory-ask emails on demand**. | S | M | Impact, HITL |
| 57 | **Giotto runs the project's social-media replies** (with HITL approval queue). | M | M | Impact, Distinctiveness |

---

## Top-10 ranking (combined impact × feasibility × rubric-axis lift)

| Rank | # | Idea | Why it wins | Rubric axes lifted |
|------|---|------|-------------|--------------------|
| **1** | **1** | **Lease OCR + extraction** | Lowest-cost, highest-frequency user touch. Demo-beat: "scan a real lease." Rubric lift: Reasoning + Sophistication. Replaces existing Tesseract fallback with structured extraction. | Reasoning, Sophistication, Implementation |
| **2** | **27** | **Multi-modal demo scan-lease** | The 30-second judge moment. Uploads a photo → verdict JSON in <30s. Same code shape as #1, exposed as a route. | Reasoning, Sophistication, Implementation |
| **3** | **16** | **HITL-drafted legal memo** | Advisor-grade output that no competitor has. Draft-only with HITL gate proves the honesty-engine IP. | HITL, Sophistication, Distinctiveness |
| **4** | **36** | **Gauntlet PROCESS sub-loop** | Directly wires Giotto into the loop we already document. Falls back to regex when no key. | Multi-agent, Reasoning, Implementation |
| **5** | **33** | **Auto-generated Q&A prep** | Directly lifts the highest-leverage human artefact (`judge-qa-kill-list.md`). Drafts 10 crisp answers in 5 seconds. | Reasoning, HITL, Distinctiveness |
| 6 | 38 | UPDATE sub-loop: verdict summary | Strong but depends on #36. Build after #36. | Reasoning, HITL |
| 7 | 13 | Lease clause red-flag detector | Higher lift than #2 but requires multi-call pipeline. | Reasoning, Sophistication |
| 8 | 45 | Safety filter for citations | Defensive moat — but only matters once we have LLM output to filter. | Reasoning, HITL |
| 9 | 44 | Translator layer (Pydantic) | Implementation lift; lifts every other Giotto integration. | Implementation, Reasoning |
| 10 | 29 | Reasoning-trace visualisation | Highest "wow" per build-hour; demo-bait. | Reasoning, HITL |

---

## Top-5 implementations (detail)

### Idea #1 — Lease OCR + extraction via Giotto

**Why this wins.** The most-frequent user path is "scan lease → get a dossier."
Today that's a multi-step dance between Tesseract OCR (low confidence on
handwriting, no structure) and regex extractors (no semantics). Giotto's
multimodal endpoint does both in one call. With `GIOTTO_API_KEY` set, the
extraction quality jumps. Without the key, the Tesseract path stays.

**Implementation sketch.**
- Add `src/lib/giotto-extract.ts`: thin TS wrapper that calls the
  `/api/demo/scan-lease` endpoint (see #27) OR — if the key is present —
  invokes Giotto directly via fetch to `https://api.giotto.ai/v1/chat/completions`.
  Returns a typed `LeaseExtraction`.
- Hook into `src/lib/ocr-pipeline.ts`: when the key is configured, replace
  the regex-based extractor with the Giotto path; otherwise return the
  Tesseract text + regex extraction.
- Returns: `{ parties, term, rent, deposit, clauses, statutesCited }`.

**Risk + fallback.** Risk: rate limit on Giotto's free tier during a demo
surge. Fallback: per-IP rate limit + degrade to Tesseract after 3 failures.

**Commit message.**
```
feat(giotto): wire multimodal extraction into ocr-pipeline (idea #1)

- src/lib/giotto-extract.ts — typed wrapper around Giotto chat/completions
- src/lib/ocr-pipeline.ts — Giotto path when GIOTTO_API_KEY set, Tesseract fallback otherwise
- scripts/test-giotto-integration.ts — 12 assertions for the wiring
```

### Idea #27 — Multi-modal demo scan-lease

**Why this wins.** 30-second judge demo. Upload a phone photo of a real
lease, get a verdict JSON in <30s. Same code as #1, exposed as
`/api/demo/scan-lease`. Demo-grade artefact: the URL appears in
[`project/pitch/demo-script-v3.md`](../../project/pitch/demo-script-v3.md).

**Implementation sketch.**
- `app.post('/demo/scan-lease', ...)` in [`custom-routes.ts`](../../custom-routes.ts:1):
  accepts `{ imageBase64, mimeType }`. If Giotto key set → call
  Giotto's `chat/completions` with `image_url` content part + system
  prompt "You are a UK lease extractor. Return JSON: { parties, term, rent, deposit, clauses, statutesCited }".
  If no key → return a structured demo JSON from the bundled `project/demo/sample-lease.txt`.
- Returns verdict JSON `{ classification, extraction, fairness, citations, generatedAt }`.

**Risk + fallback.** Risk: Giotto API key not yet provisioned (claim email
sent). Fallback: deterministic demo path using the sample lease — still
returns the same shape; the JSON shape is identical so the UI never branches.

**Commit message.**
```
feat(giotto): /api/demo/scan-lease — 30s multi-modal judge demo (idea #27)

- custom-routes.ts — POST /api/demo/scan-lease
- src/lib/giotto-extract.ts — shared extraction helper
- scripts/test-giotto-integration.ts — assertion: response shape + no-key fallback
```

### Idea #16 — HITL-drafted legal memo

**Why this wins.** Advisor-grade output, not just a resident checklist.
`/api/dossier/[id]/memo` drafts a structured memo from the dossier — always
draft-only. HITL signs off via the existing `/dossier/[id]/signoff` endpoint.
Proves the honesty-engine IP at the advisor tier.

**Implementation sketch.**
- `app.post('/dossier/:id/memo', ...)` in `custom-routes.ts`:
  builds the dossier, then asks Giotto (or a deterministic template if no
  key) to draft a 3-section memo: SUMMARY / RIGHTS ENGAGED / RECOMMENDED
  ACTION. Always marked `DRAFT — REQUIRES REVIEWER SIGN-OFF`.
- Persists to `prisma.contentDraft` so it shows up in the existing
  content-approval UI.

**Risk + fallback.** Risk: Giotto invents a citation. Mitigation: the
Giotto system prompt restricts citations to the `STATUTES` array; the
TS wrapper post-validates every cited ID against the spine and drops
unknown citations before persisting. Fallback: deterministic template
that interpolates dossier fields.

**Commit message.**
```
feat(giotto): /api/dossier/[id]/memo — HITL-drafted legal memo (idea #16)

- custom-routes.ts — POST /dossier/:id/memo + GET /dossier/:id/memo
- src/lib/giotto-memo.ts — typed wrapper with citation-validator guardrail
- prisma.contentDraft reused for approval queue
- scripts/test-giotto-integration.ts — assertion: draft-only, citation guard
```

### Idea #36 — Gauntlet PROCESS sub-loop

**Why this wins.** The loop already documents Giotto as the preferred
VLM at `gauntlet-loop.md:49`. Wiring it as the actual fallback in code
turns the doc into a working artefact. The function exists; we just
need to add the Giotto path.

**Implementation sketch.**
- Add `src/lib/gauntlet-process.ts`: `classifyIntake(text: string, imageBase64?: string)`
  returns `{ type, classification, confidence, suggestedRules }`.
- If `GIOTTO_API_KEY` set → call Giotto with image + text. Else → fall
  back to the existing `classifyDocument` regex (already wired in
  `src/lib/ocr-pipeline.ts`).
- Cross-link in `gauntlet-loop.md` (already done; just confirm).

**Risk + fallback.** Risk: Giotto returns a classification outside the
known set. Mitigation: union-types the result; unknown → maps to
`"other"` which the dossier handles gracefully.

**Commit message.**
```
feat(giotto): gauntlet PROCESS sub-loop — Giotto classifier with regex fallback (idea #36)

- src/lib/gauntlet-process.ts — new module, Giotto path + regex fallback
- scripts/test-giotto-integration.ts — assertion: same shape both paths
- project/strategy/gauntlet-loop.md — cross-link refresh
```

### Idea #33 — Auto-generated Q&A prep

**Why this wins.** [`judge-qa-kill-list.md`](judge-qa-kill-list.md) is the
single highest-leverage human artefact. Drafting Giotto answers for each
of the 10 questions means Sam has a live partner during judge Q&A, not
just a memo. 5-second turnaround per question.

**Implementation sketch.**
- `src/lib/giotto-qa.ts`: `draftAnswer(question: string, context?: string)`
  returns `{ answer, citations, followUps }`. If Giotto key set → real
  LLM call with a system prompt that requires citations to the spine +
  `judge-qa-kill-list.md`. Else → deterministic "no Giotto" message.
- `app.post('/qa/prep', ...)` returns an array of `{ question, draft }` for
  the whole kill-list.

**Risk + fallback.** Risk: Giotto invents a number (e.g. "16:1 LTV:CAC"
without source). Mitigation: the wrapper post-validates numeric claims
against `MEMORY.md` constants. Fallback: deterministic "draft not
generated" with a link to the existing kill-list doc.

**Commit message.**
```
feat(giotto): /api/qa/prep — auto-generated answers from judge-qa-kill-list (idea #33)

- src/lib/giotto-qa.ts — typed wrapper, citation + numeric guardrails
- custom-routes.ts — POST /qa/prep
- scripts/test-giotto-integration.ts — assertion: same shape, no-key fallback
```

---

## Cross-cutting design choices

1. **One shared TS wrapper, per-endpoint Giotto paths.** Each integration
   reuses the same env-guard pattern: `if (giottoConfigured()) callGiotto();
   else returnDeterministicFallback();`.
2. **No new dependencies.** Giotto is OpenAI-compatible — the existing
   `openai` package (used in Python) + `fetch` in TS suffice.
3. **All wrappers expose the same typed shape** regardless of whether
   Giotto or the deterministic path produced the output. The UI never
   branches on which path ran.
4. **Citation safety filter** lives in `src/lib/giotto-guard.ts` (used by
   memo + QA): every cited ID must exist in `STATUTES`; every cited
   number must appear in `MEMORY.md` or be `<10%` of a spine quantity;
   on miss, the citation is dropped before persisting.

---

## What this document does NOT cover

- **Pricing.** All Giotto usage stays inside the free Future Caribbean
  grant. If we hit limits, we re-evaluate post-buildathon.
- **Fine-tuning.** Giotto is used as-is via OpenAI-compatible API; no
  fine-tuning in this sprint.
- **Multimodal beyond image.** Giotto also supports audio; out of scope
  this sprint (could be a stretch — see idea #3).

---

— Sam Peacock, Future Caribbean Buildathon, 2026-08-11