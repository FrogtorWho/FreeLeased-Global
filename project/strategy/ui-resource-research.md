# UI Resource Research — mapped to OUR product & scope

**Status:** research · **Date:** 2026-08-05 · **Companion:** `ux-nextgen-vision.md`
**Product:** RTM Sovereign — a trust-heavy **leasehold-audit / statutory-diagnostics
instrument** with two faces: a dense **command-center** (operator/institution) and a
calm, plain-language **resident** view. Local-first, provenance-first, honesty-capped.

So we are NOT shopping for generic "pretty UI." We need patterns for: reading a
legal document with flagged clauses, showing provenance on every datum, expressing
uncertainty honestly, a human sign-off queue, and a resident-friendly outcome view.

**Licensing (settled):** Uiverse = **MIT** → adoptable, keep the notice (log in
`CREDITS.md`). Dribbble = **inspiration only**, never copy a Shot. Details at bottom.

---

## View-by-view: direction (Dribbble) + adoptable elements (Uiverse, MIT)

### 1. Lease Audit — the core screen
The product's money screen: document on one side, statute-cited findings on the other.
- **Dribbble direction:** the split "document ↔ findings" layout with inline clause
  highlighting and per-clause risk.
  - `dribbble.com/shots/26325626-AI-Contract-Review-Dashboard-UI-Design` (on-point)
  - search: `contract-analysis`, `document-review`, `contract-ai`, `contract-summary`
- **Adopt (Uiverse, retinted + a11y):**
  - **Tooltips** (`uiverse.io/ui/tooltip-ui`, 121+; `uiverse.io/ui/tailwind-tooltips`)
    → the **provenance popover** + inline citation on a flagged clause.
  - **Badges** → severity (high/med) + **evidence-class** glyphs (established/heuristic/
    contested/unfalsifiable).
  - **Cards** → each finding card (clause excerpt, citation, capped confidence, action).

### 2. Overview — command center
- **Dribbble direction:** `compliance-dashboard`, `compliance-ui` (note the "Dark Theme –
  Dashboard UI Charts" results), `dashboard-audit`. Dense, dark, instrument-grade.
- **Adopt:** animated **counters/number count-ups** and **glass cards** for the KPI tiles;
  keep recharts for charts.

### 3. Data Spine — provenance table
- **Dribbble direction:** `compliance-check` ("audit logs clean, dark mode ui dashboard"),
  `dashboard-audit`.
- **Adopt:** shadcn `table` (already MIT) + Uiverse **badges** for tier (0–4) and
  **conviction** (verified/inference/pending), + **tooltips** for source URL/licence.
  (Uiverse is weak on full tables — use it for the cell chrome, not the grid.)

### 4. Gates — consensus + human sign-off (HITL)
- **Dribbble direction:** search `approval-workflow`, `review-queue`, `kanban approval`.
- **Adopt:** Uiverse **toggles/checkboxes**, **buttons** (approve/reject/annotate),
  and a **stepper/progress** for the surface→review→abstain decision trace.

### 5. Communes — collective RTM coordination
- **Dribbble direction:** search `voting-ui`, `collaboration-dashboard`, `poll`.
- **Adopt:** Uiverse **progress bars** (quorum/threshold), **avatars/avatar-group**
  (participants). NOTE: real crypto voting is roadmap — the UI shows a v1 tally, labelled.

### 6. Rights catalogue
- **Dribbble direction:** `legal-compliance`, `legal-dashboard`.
- **Adopt:** Uiverse **accordion/expandable cards** — each right ↦ its statute.

### 7. Resident view (mobile-first, calm, accessible)
- **Dribbble direction:** `resident-app`, `tenant-portal`, `residential-app` — but
  invert the tone: high-contrast, plain-language, one clear action. Take *layout* ideas,
  drop the salesy proptech gloss.
- **Adopt:** Uiverse **buttons** + simple **cards**; prioritise legibility over flourish.

### 8. Signature: evidence-class language + confidence-with-cap meter
Mostly custom (it's our IP), but mine Uiverse **loaders/progress/range** for the
meter's motion and the "cap line" treatment. This is the one visual no competitor has —
build it ourselves, inspired not copied.

---

## Curated Uiverse element shortlist (adopt these categories)
Tooltips · Badges · Cards · Buttons · Toggles/Checkboxes · Loaders/Spinners ·
Progress · Accordion. All MIT. For each adopted element: retint to peacock tokens,
add `focus-visible` + ARIA + `prefers-reduced-motion`, and log it in `CREDITS.md`.

## Guardrails (scope-specific)
- **Trust > flash.** This tool gives vulnerable people legal information. Motion and
  glass serve legibility and provenance, never decoration.
- **Accessibility is credibility** for a housing-rights product — WCAG-AA, keyboard,
  reduced-motion. Uiverse elements usually lack these; we add them.
- **No render-verify while preview is frozen** — this shortlist fires on preview
  restore (Track C), each piece behind our verification bar.

## Licensing recap
- **Uiverse:** MIT — free commercial/modify, preserve the notice → `CREDITS.md`.
- **Dribbble:** Shots are creators' copyright; "freebies" carry mixed licences and are
  mostly Figma files — **direction only, build our own.** For a provenance/honesty
  product, copying a design would be self-defeating.
