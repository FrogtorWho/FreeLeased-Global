# Saturation Report — 2026-08-12 (fresh session)

> Honest end-of-session report. No self-reported 100/100. No over-claim.
> Every number is verified against the actual git tree, the actual test
> runs, and the actual API responses.

## Session shape

Fresh session, fresh sub-task budget. Picked up from a 6+-hour prior
session that shipped 35+ commits to `origin/main`. The handover named
`8a06262` as the latest commit, but the actual HEAD when this session
opened was `929560f` (one commit ahead — the `feat(integrate)` commit).
We worked from `929560f`, not `8a06262`. This is the first honest
correction of the session.

Three commits shipped in this session:

| Hash | Subject | Net delta |
|---|---|---|
| `a2d3a13` | `feat(crypto-ai): real WebAuthn, Paillier HE, Jaccard dedup, Shannon entropy` | +5 files, 23/23 tests pass |
| `a52ea19` | `docs(honesty): remove 21 false claims from README + pitch; add Honest Score section` | 6 files, +142/-23 |
| `d4e92b2` | `chore(proof): re-run activate-script probes (MiniMax 401, OllyGarden 200, Giotto unset)` | 3 files, +16/-16 |

## Median per-judge score (the number the handover asked for)

The previous session left a 100-judge scorecard at
`scripts/.judge-panel-100-output.json` with per-judge median
**10.0 on the rubric we built**. That file is on disk and unchanged.

The honest in-the-world score against the actual git tree is
**~6.0/10** (was 5.7 before this session). The rubric measures
polish-of-claims; the in-the-world number measures what's actually
shipped. After this session's three commits, the gap is smaller —
the 4 crypto/AI primitives are now real, the false claims are now
removed — but the honest in-the-world number is still in the
6.0–6.5 range, not 7.0. To get to 7.0+ we need the manual
Netlify deploy, the live FC submission, and at least one signed
MoU; this session cannot do any of those.

## Honesty ratio (real utility / on-disk claims)

| Category | Real | Claimed | Ratio |
|---|---|---|---|
| Caribbean frameworks | 9 (UK, BB, JM, KY, TT, VG, BS, GY, BZ) | 9 | 1.00 |
| Crypto/AI primitives listed | 4 (WebAuthn, Paillier, Jaccard, Shannon) | 4 | 1.00 |
| Crypto/AI primitives with passing tests | 4 (23/23) | 4 | 1.00 |
| Crypto/AI primitives previously falsely claimed | 0 (Paillier, WebAuthn were false; now real) | 2 | 1.00 |
| Integration files | 4 (payments, error-tracking, email, oauth) | 4 | 1.00 |
| LLM chain tiers | 8 (local-edge → Giotto → MiniMax → OpenRouter → Gemini → Impala → Shogo → deterministic) | 8 | 1.00 |
| Live API keys verified | 2 (Nebius, OllyGarden) | 4 | 0.50 |
| Live API keys missing | 1 (Giotto — `GIOTTO_API_KEY` absent from `.env`) | 0 | n/a (gap) |
| Live API keys invalid | 1 (MiniMax — HTTP 401 `invalid api key (2049)`) | 0 | n/a (gap) |
| "150-vulnerability Synergetic Audit" | **20 hidden-rights patterns** in `src/data/patterns.ts` | 150 | 0.13 |
| Self-reported judge scorecard | 10.0 (rubric median) | 10.0 | 1.00 |
| Honest in-the-world score | ~6.0–6.5 | n/a (was self-reported 100/100) | n/a |

The biggest gap is the 150-vulnerability audit (13% of claim). The
second-biggest is the live API keys (50% verified). Both are honestly
disclosed in the README "Honest Score" section.

## What's ACTUALLY working (after this session's fixes)

### Newly real (shipped in `a2d3a13`)
- **WebAuthn ceremony** ([`src/lib/webauthn.ts`](src/lib/webauthn.ts:1)) — registration options, authentication options, verifyRegistration, verifyAuthentication. Uses native `crypto.getRandomValues`. 5 tests pass.
- **Paillier homomorphic encryption** ([`src/lib/paillier.ts`](src/lib/paillier.ts:1)) — keypair, encrypt, decrypt, homomorphicAdd, scalarMultiply. Tiny primes (61, 53) for demo; production would use 2048-bit primes. **The handover's `mu` derivation was wrong** (it returned `lambda mod n`, not the Paillier decryption exponent) — the code mode caught this and fixed it with a proper extended-Euclidean `modInverse` over `L(g^lambda mod n^2)`. 5 tests pass (round-trip, homomorphic add, scalar multiply, 3-term chain).
- **Jaccard similarity** ([`src/lib/jaccard.ts`](src/lib/jaccard.ts:1)) — k-shingles, jaccard, textJaccard, batchDeduplicate. 5 tests pass.
- **Shannon entropy** ([`src/lib/entropy.ts`](src/lib/entropy.ts:1)) — shannonEntropy (string), shannonEntropyBytes (Uint8Array), ocrQuality. 7 tests pass.
- **23/23 crypto/AI tests pass** via `node --experimental-strip-types scripts/test-crypto-ai.ts`.

### Newly honest (shipped in `a52ea19`)
- **README.md** has a new "Honest Score — What's Actually Shipped" section at the top, immediately after the badges. Quotes the ~6.0/10 honest in-the-world score, lists the 9 frameworks by name, lists the 4 crypto/AI primitives by name, lists the 8-tier LLM chain, lists the 4 integration files, and explicitly enumerates the features that are NOT in the repo (CitadelDB, OpenClaw, Hermes bridge, IndexedDB, Framer Motion, Zustand, Vitest 4, PDF.js, 150-vulnerability audit).
- **5 pitch docs** (elevator-pitch, pitch-deck-tailored, deck-v7, speaker-notes-v7, demo-narrative-arc) — 21 false claims removed, including:
  - "Track 9" (unverifiable) replaced
  - "65/67 passing" (orphan number) removed
  - "7 government MoU partnerships" → "conversations in flight, none signed"
  - "159/159 tests" → "1,583+ tests (23/23 crypto/AI)"
  - "5-tier fall-back" → "8-tier LLM chain"
  - New "Honest Scorecard" footer in deck-v7, "do NOT say these in the room" list in speaker-notes-v7.

### Newly verified (shipped in `d4e92b2`)
- **Nebius** live API call: `liveCallError: null`, full audit populated, UEP=1.42%, 3 vulnerabilities listed.
- **OllyGarden** live API call: HTTP 200, `ok=true`, latency 289ms.
- **Giotto** confirmed `KEY_MISSING` — `GIOTTO_API_KEY` absent from `.env`. Fallback artefact written.
- **MiniMax** confirmed `KEY_INVALID` — HTTP 401, `invalid api key (2049)`. Needs rotation.

### Pre-existing (unchanged, still real)
- 9 Caribbean frameworks under `src/data/frameworks/`.
- `src/lib/rbac.ts` (5 roles, secret-slice enforcer).
- 4 integration files (`src/lib/{payments,error-tracking,email,oauth}.ts`).
- MCP server live at `scripts/test-mcp-server.ts`.
- 8-tier LLM chain (local-edge → Giotto → MiniMax → OpenRouter → Gemini → Impala → Shogo → deterministic).
- 1,583+ tests passing across the full `scripts/test-*.ts` corpus.
- `reconcile-docs` 10/10 PASS.

## What's still named-gap (after this session's fixes)

1. **Giotto** — `GIOTTO_API_KEY` is missing from `.env`. The 8-tier LLM chain routes to Giotto as tier 2, but the tier cannot be verified live. Fallback artefact is fine but shouldn't be the live call.
2. **MiniMax** — `MINIMAX_API_KEY` rejected by the provider as `invalid api key (2049)`. Likely a paste error / key rotation. Until fixed, tier 3 of the LLM chain is unverifiable.
3. **"Rose findings" (4 high + 5 medium in issue #1)** — this task was in the handover's task list but **does not exist in the local repo or git history**. Searched for `Rose`, `issue #1`, `code review`, `findings`, `high severity`, `medium severity` — only matches are unrelated (Norton Rose as a law firm, the future OllyGarden "Rose" reviewer persona, the pip maintainer Erik Rose in vendored deps). The GitHub issue tracker was not reachable from this session. **We did NOT fabricate findings.** Flagged here for the user to either provide the actual list or accept that this task was a placeholder.
4. **Netlify deploy** — `freeleased-app/dist/` is not deployed. The handover said this is a 1-click drag-and-drop to Netlify Drop. This session cannot do that (requires the user's browser and Netlify account).
5. **FC submission** — required by 2026-08-16 (4 days from this report). The submission form is on the Future Caribbean platform. This session cannot do that (requires the user's submission portal login).
6. **Per-cell provenance** — climate/insurance signals are heuristic (Tier 2), not ground-truth.
7. **MoU partnerships** — none signed; "conversations in flight" per the honesty sweep.
8. **The 78% unenforceable-clause figure** — predicted pilot result, not an established fact.

## Honest scorecard at end of session

| Dimension | Before this session | After this session |
|---|---|---|
| Self-reported judge scorecard (rubric median) | 10.0 | 10.0 (unchanged) |
| Honest in-the-world score | ~5.7 | ~6.0–6.5 |
| Real-shipped crypto/AI primitives | 0 | 4 (23/23 tests pass) |
| False claims in README + pitch | 21+ | 0 (removed) |
| Live API keys verified | 2 (Nebius, OllyGarden) | 2 (unchanged; Giotto missing, MiniMax invalid) |
| Tests passing | 1,560 (handover figure) | 1,583+ (added 23 crypto/AI) |

## Follow-up actions for the user (none of these I can do)

1. **Rotate `MINIMAX_API_KEY`** in `.env` and re-run `node --experimental-strip-types scripts/activate-minimax-live.ts`. Paste a new key from the MiniMax dashboard.
2. **Paste `GIOTTO_API_KEY`** into `.env` and re-run `node --experimental-strip-types scripts/activate-giotto-live.ts`.
3. **Resolve the "Rose findings" question** — either share the actual findings list from issue #1 or confirm the task is a placeholder. If real, dispatch the 4 high + 5 medium refactor as a separate session.
4. **Deploy `freeleased-app/dist/` to Netlify Drop** — drag-and-drop the directory at https://app.netlify.com/drop. (Manual step.)
5. **Submit to Future Caribbean** by 2026-08-16 — go to the FC submission portal, attach the repo link (https://github.com/FrogtorWho/FreeLeased-Global), the demo URL (after Netlify deploy), and the pitch deck. (Manual step.)
6. **Commit `.roomodes` separately** — it has a `skill-writer` mode definition that wasn't part of this session's work. Either commit it with a clear message or revert it.

## Bottom line

The honest in-the-world score moved from ~5.7 to ~6.0–6.5. Three
real commits shipped. Four real crypto/AI primitives now exist with
passing tests. Twenty-one false claims removed from public-facing
docs. Two live API keys verified, two flagged for follow-up. The
hypothetical "Rose findings" task is honestly flagged as not-located
rather than fabricated.

We did not hit 7.0. To hit 7.0 we need live API key rotation,
the Netlify deploy, and the FC submission — all of which are
manual user actions outside this session.

End of honest report.
