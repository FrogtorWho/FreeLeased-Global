# Judge Quickstart — Find Your Archetype in 30 Seconds

> **A map from the 100-judge panel to the right tab, doc, and
> code file for your archetype.** If you only have 5 minutes,
> this is the doc for you.

**Companion:** [`project/strategy/100-judge-panel.md`](../project/strategy/100-judge-panel.md:1) (the full rubric).

---

## The 33 archetypes × their first click

| # | Archetype (count) | First click (UI) | First read (doc) | First inspect (code) |
|---|-------------------|-------------------|-------------------|----------------------|
| 1 | Legal academics (8) | **Honesty** tab · fact-check register | [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | [`src/lib/citation.ts`](../src/lib/citation.ts:1) |
| 2 | Practising solicitors (8) | **Lease Scanner** + **Sign-off Queue** | [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | [`src/lib/signing.ts`](../src/lib/signing.ts:1) |
| 3 | Caribbean barristers (6) | **Dossier Explorer** · select BB / TT / JM | [`project/strategy/multi-jurisdiction-legal-spine.md`](../project/strategy/multi-jurisdiction-legal-spine.md) | [`src/lib/jurisdiction.ts`](../src/lib/jurisdiction.ts:1) |
| 4 | Tribunal judges (4) | **Sign-off Queue** + **Dossier Explorer** | [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | [`src/lib/consensus.ts`](../src/lib/consensus.ts:1) |
| 5 | Housing policy wonks (6) | **Lease Scanner** + **Service Charges** | [`project/strategy/multi-jurisdiction-legal-spine.md`](../project/strategy/multi-jurisdiction-legal-spine.md) | [`src/data/patterns.ts`](../src/data/patterns.ts:1) |
| 6 | VCs (10) | **Dashboard** (TAM, moats, traction) | [`docs/story-60s.md`](story-60s.md) · [`project/strategy/WIN-DAY-100.md`](../project/strategy/WIN-DAY-100.md) | [`package.json`](../package.json:1) (the moat matrix) |
| 7 | AI/ML researchers (8) | **Dashboard** · **Honesty** | [`project/strategy/eval-harness-precision-recall.md`](../project/strategy/eval-harness-precision-recall.md) | [`src/lib/agents.ts`](../src/lib/agents.ts:1) |
| 8 | Product designers (8) | **My Rights** (first impression) | [`project/brand/`](../project/brand/README.md:1) | [`src/components/auri/`](../src/components/auri/) |
| 9 | Frontend engineers (8) | Run `npm run verify` | [`README.md`](../README.md:1) | [`src/App.tsx`](../src/App.tsx:1) |
| 10 | Backend engineers (8) | **Data Spine** tab | [`prisma/schema.prisma`](../prisma/schema.prisma) | [`src/lib/engines.ts`](../src/lib/engines.ts:1) |
| 11 | DevOps / SRE (6) | `npm run verify` · **Assurance** tab | [`docs/ollygarden-integration.md`](ollygarden-integration.md) | [`src/lib/telemetry.ts`](../src/lib/telemetry.ts:1) |
| 12 | Security researchers (6) | `.env.example` · **Assurance** | [`docs/ollygarden-integration.md`](ollygarden-integration.md) | [`src/lib/offline.ts`](../src/lib/offline.ts:1) |
| 13 | AI ethicists (6) | **Honesty** tab | [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | [`src/lib/fairness.ts`](../src/lib/fairness.ts:1) |
| 14 | Privacy / GDPR (6) | **Honesty** · data-residency card | [`docs/local-edge-llm.md`](local-edge-llm.md) | [`src/lib/offline.ts`](../src/lib/offline.ts:1) |
| 15 | Open-source maintainers (6) | `LICENSE` · [`CONTRIBUTING.md`](../CONTRIBUTING.md) · [`CREDITS.md`](../CREDITS.md) | [`CONTRIBUTING.md`](../CONTRIBUTING.md) | [`package.json`](../package.json:1) |
| 16 | Accessibility (6) | Tab through every UI surface | [`docs/onboarding.md`](onboarding.md) | [`src/App.tsx`](../src/App.tsx:1) (skip-to-content) |
| 17 | Caribbean diaspora (6) | **My Rights** (resident framing) | [`docs/story-60s.md`](story-60s.md) | [`src/data/fixtures.ts`](../src/data/fixtures.ts:1) |
| 18 | Climate / disaster (4) | **Dossier Explorer** · climate layer | [`project/strategy/live-activation-proof.md`](../project/strategy/live-activation-proof.md) | [`src/data/spine.ts`](../src/data/spine.ts:1) |
| 19 | Property economists (5) | **Dashboard** (cost curve) | [`project/strategy/add-a-jurisdiction-cost-curve.md`](../project/strategy/add-a-jurisdiction-cost-curve.md) | [`src/lib/reconciliation.ts`](../src/lib/reconciliation.ts:1) |
| 20 | Behavioural scientists (4) | **My Rights** · onboarding | [`docs/onboarding.md`](onboarding.md) | [`src/lib/templates.ts`](../src/lib/templates.ts:1) |
| 21 | Journalists (4) | **Honesty** · fact-check register | [`docs/story-60s.md`](story-60s.md) | [`src/lib/citation.ts`](../src/lib/citation.ts:1) |
| 22 | Democracy / civic-tech (4) | **Honesty** + **Sign-off Queue** | [`compliance-statement-v3.md`](../project/submission-pack/compliance-statement-v3.md) | [`src/lib/signing.ts`](../src/lib/signing.ts:1) |
| 23 | Local-government / municipal (4) | **Data Spine** · sovereign edge | [`docs/local-edge-llm.md`](local-edge-llm.md) | [`custom-routes.ts`](../custom-routes.ts:1) |
| 24 | Translators / i18n (4) | **My Rights** (English copy) | [`docs/i18n-roadmap.md`](../project/strategy/i18n-roadmap.md) (planned) | [`src/data/fixtures.ts`](../src/data/fixtures.ts:1) |
| 25 | Insurtech / lenders (5) | **Dossier Explorer** · risk layer | [`project/strategy/live-activation-proof.md`](../project/strategy/live-activation-proof.md) | [`src/data/spine.ts`](../src/data/spine.ts:1) |
| 26 | Public health (4) | **Lease Scanner** · hazard flags | [`docs/onboarding.md`](onboarding.md) | [`src/data/patterns.ts`](../src/data/patterns.ts:1) |
| 27 | Education (3) | **My Rights** (first-run UX) | [`docs/onboarding.md`](onboarding.md) | [`src/lib/templates.ts`](../src/lib/templates.ts:1) |
| 28 | Mathematicians / statisticians (3) | **Honesty** · DSP-5 trace | [`project/strategy/eval-harness-precision-recall.md`](../project/strategy/eval-harness-precision-recall.md) | [`src/lib/consensus.ts`](../src/lib/consensus.ts:1) |
| 29 | TypeScript specialists (3) | `tsc --noEmit` clean | [`README.md`](../README.md:1) | any `.ts` |
| 30 | Buildathon organisers (4) | `npm run verify` · **Honesty** | [`project/strategy/WIN-DAY-CHECKLIST.md`](../project/strategy/WIN-DAY-CHECKLIST.md) | [`scripts/health-check.ts`](../scripts/health-check.ts:1) |
| 31 | CfC alumni (4) | **Honesty** · category statement | [`project/strategy/competitive-landscape.md`](../project/strategy/competitive-landscape.md) | [`src/lib/agents.ts`](../src/lib/agents.ts:1) |
| 32 | Press / comms (4) | **Honesty** · voice panel | [`docs/story-60s.md`](story-60s.md) | [`src/lib/copy.ts`](../src/lib/copy.ts:1) |

---

## The 60-second run (any archetype)

```bash
git clone https://github.com/<org>/freeleased.git
cd freeleased
bun install
bunx prisma db push
bun dev
# open http://localhost:5173
# click Honesty → Lease Scanner → Sign-off Queue
```

If any of these clicks surprises you, the rubric-immune
artefact is the **Honesty** tab. The thing we *don't* ship is
listed there, and the thing we *do* ship is provable from the
demo.

---

## What's still honest gaps

See [`project/strategy/100-judge-panel.md`](../project/strategy/100-judge-panel.md:1) §"Honest gaps (the things we cannot fix in 5 days)" for the list of what is *not* shipped — zero real pilots, $0 revenue, English only, single-tenant, etc. We surface them; we don't hide them.

— Sam Peacock
2026-08-11
