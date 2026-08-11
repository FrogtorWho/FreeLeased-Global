# Operational Runbook — FreeLeased

**Status:** live · **Version:** 1.0 · **Date:** 2026-08-11

> This is the on-call playbook. When something is wrong, this
> is the document you open first. Pair this with
> [`docs/SLA.md`](SLA.md:1) and
> [`src/lib/slo.ts`](../src/lib/slo.ts:1) for the live SLO
> surface.

---

## 0. On-call

| Layer | Primary | Backup | Escalate to |
|---|---|---|---|
| App layer | Sam | (vacant) | Advisory (legal) |
| Data layer | Sam | (vacant) | Advisory (security) |
| LLM tier | Sam | Local Ollama (auto-fallback) | Advisory (AI ethics) |
| Hosting | Sam | (vacant) | Hosting provider support |

---

## 1. Standard interfaces (URLs / commands)

| Need | Command / URL |
|---|---|
| App health | `curl https://api.freeleased.org/health` |
| Marketing | `https://freeleased.org` |
| Docs | `https://freeleased.org/docs/` |
| Demo tunnel (private) | `https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai` |
| OllyGarden status | https://status.ollygarden.cloud |
| Local LLM | `curl http://localhost:11434/api/tags` |
| Cold-clone fresh box | `curl -fsSL https://freeleased.org/install.sh \| bash` |
| Logs | `vercel logs` / `journalctl -u ollygarden` / `tail -f ./logs/spans.jsonl` |

---

## 2. Runbooks

### RB-01 · OllyGarden OTLP unreachable

**Detect.** `alert: ollygarden-export-failures > 10 in 5min`,
or curl test:
```bash
curl -X POST $OLLYGARDEN_OTLP_ENDPOINT \
  -H "Authorization: Bearer $OLLYGARDEN_API_KEY" \
  -d '{}'
```

**Triage.**
1. Check OllyGarden status page.
2. Verify `OLLYGARDEN_OTLP_ENDPOINT` and `OLLYGARDEN_API_KEY`
   in `.env` are not blank and match what's in 1Password.
3. Test with the curl above; if 401 → rotate key.
4. If 5xx → network path issue.

**Mitigate.**
- If OllyGarden is *down*: set `OTLP_SINK=local` in `.env`.
  Spans write to `./logs/spans.jsonl`. Continue serving.
- If 401/403: rotate key in OllyGarden dashboard, update
  `.env`.

**Restore.**
- After provider recovery: unset `OTLP_SINK=local`,
  restart exporter, watch burn-rate return to 0.

**Owner.** Sam.
**SLO tie-in.** `ollygarden-trace-completeness`.

---

### RB-02 · LLM provider outage (Nebius / Giotto / MiniMax)

**Detect.** `alert: llm-error-rate > 50% over 5min`, or
single user reports of "stuck on loading".

**Triage.**
1. Check each provider's status page.
2. Verify `*_API_KEY` in `.env`.
3. Run `bun scripts/probe-ollygarden-body-shape.py` (or
   equivalent) to confirm provider reachability.

**Mitigate.**
- Set `USE_LOCAL_EDGE=1` in `.env`. Default Ollama tier
  serves the same outcomes deterministically; the
  quality floor is `phi3:mini` or `llama3.1:8b`.
- If Ollama also unreachable: degrade to "no AI" mode
  (`USE_LOCAL_EDGE=1` + `DISABLE_REMOTE_LLM=1`). The dossier
  build continues with the deterministic library
  [`src/lib/jurisdiction.ts`](../src/lib/jurisdiction.ts:1)
  + the spine, no LLM tier. Quality drops; we publish
  the limitation in the status banner.

**Restore.**
- After provider recovery: unset `DISABLE_REMOTE_LLM=1`,
  restart, watch error rate return to baseline.

**Owner.** Sam.
**SLO tie-in.** `api-fairness-check-availability`,
`api-consensus-decide-latency`.

---

### RB-03 · Prisma migration fails on cold-clone

**Detect.** `log: prisma migrate error on bunx prisma db push`.

**Triage.**
1. `bunx prisma migrate dev` → inspect drift report.
2. Compare against
   [`memory/data-room-copies.md`](../memory/data-room-copies.md:1).
3. Verify no hand-edits in `src/generated/`.

**Mitigate.**
- **Never** `--force-reset` on a deployed instance.
- If schema is locally valid: `bunx prisma db push` (no
  destructive flag) and run the multi-tenant migration
  script:
  `bun scripts/migrate-multi-tenant.ts`.
- Document any reset in `CHANGELOG.md`.

**Restore.**
- Multi-tenant migration is idempotent. Re-running it on
  a fresh DB ends in the same state.

**Owner.** Sam.
**Rollback.** A failed migration is destructive — keep a
fresh backup before any reset.

---

### RB-04 · Bundle size regression

**Detect.** `CI: bundle-size > 200KB gzipped` (perf budget).

**Triage.**
1. `bun run build`; inspect `dist/`.
2. Compare `git diff` in `src/components/`.
3. Look for accidental `lodash`, `moment`, `date-fns/locale`
   imports.

**Mitigate.**
- Tree-shake unused imports.
- Replace `date-fns` with `Intl.DateTimeFormat`.
- Use dynamic `import()` for non-critical surfaces.

**Restore.** Revert offending PR.

**Owner.** Sam.
**SLO tie-in.** `ui-ttfi-mobile`, `ui-ttfi-desktop`.

---

### RB-05 · CI pipeline fails on a PR

**Detect.** `github-actions: status-check failed`.

**Triage.**
1. Read the failing job's logs.
2. Run `bun run verify` locally.
3. Inspect `.pre-commit-config.yaml` for drift.

**Mitigate.**
- Fix drift; re-push.
- **Never** `--force` push to `main`.

**Restore.** N/A; this is the *preventive* runbook.

**Owner.** Sam.

---

### RB-06 · Postgres data-loss

**Detect.** `alert: backup-failed` for > 1 day, OR
query returns 0 rows for a known-busy table.

**Triage.**
1. Confirm the alert.
2. Check Postgres logs for write errors.
3. Check the latest snapshot timestamp.

**Mitigate.**
- Read `pg_dumpall` from snapshot into a fresh DB.
- Audit RLS — the bug may be a `tenantId` filter misapplied.

**Restore.**
- Once root cause is found: rebuild affected rows only.
  Never wipe the whole DB.

**Owner.** Sam.
**Rollback.** Last-known-good snapshot is the floor.

---

### RB-07 · Caribbean public-sector API failure

**Detect.** A Caribbean institutional tenant reports "no
data returned" from a government portal.

**Triage.**
1. Confirm the government portal is up (curl it directly).
2. Check the cache TTL.
3. Verify the integration endpoint isn't rate-limited.

**Mitigate.**
- Force-refresh the cache.
- Switch to data-room fallback if MoU-letter data exists.

**Restore.**
- Document the outage in `HEARTBEAT.md`.
- Notify the tenant via the sign-off queue.

**Owner.** Sam.

---

### RB-08 · DSR (right-to-be-forgotten) request

**Detect.** Email at `sam.peacock1@gmail.com` subject
"DSR — Delete".

**Triage.**
1. Verify identity (challenge: their email address on file
   + government ID scanned).
2. List the data subjects (user, sign-off queue entries
   by `actorId`, leases by `uploaderId`, audit entries).
3. Schedule the deletion: ≤ 30 days from request.

**Mitigate / complete.**
- Soft-delete in primary store.
- Hard-delete from backups within 35 days.
- Email confirmation to requester when complete.

**Restore.**
- Hard-deletes are not reversible; this is a good thing.

**Owner.** Sam.
**Reference.** [`docs/PRIVACY.md` §7](PRIVACY.md#7-your-rights).

---

### RB-09 · Carried-over token / session hijack suspected

**Detect.** A user contacts us about "strange sessions", or
our rate-limit alert fires per-token.

**Triage.**
1. Pull the user's session table.
2. Look for `last_ip` and `last_seen_at` anomalies.
3. If confirmed: lock all sessions for that user.

**Mitigate.**
- Force password reset + TOTP enrolment.
- Rotate the user's tenant encryption key.

**Restore.**
- After confirmation: unlock + re-issue credentials.

**Owner.** Sam.

---

### RB-10 · Cold-clone install fails

**Detect.** A fresh clone + `bun install && bun run dev`
fails to boot.

**Triage.**
1. Check Bun version (we require ≥ 1.1).
2. Run `bun install --force` and report.
3. Check that `Ollama` is installed (or set
   `USE_LOCAL_EDGE=0`).

**Mitigate.**
- Pin Bun version with `bunfig.toml`.
- Add `install.sh` with idempotent checks (Q4 2026).

**Owner.** Sam.

---

## 3. Communication templates

### 3.1 User-visible incident banner

```
[FreeLeased Status] We are investigating reports of [issue].
Started at [UTC]. Mitigation in progress. Last update [UTC].
Live: https://status.freeleased.org
```

### 3.2 Internal heartbeat entry

```
[UTC] INCIDENT-### — short name
  Detected: alert / user report
  Severity: P0 / P1 / P2
  Mitigation: take these steps
  Comms sent: links
  Status: ongoing / resolved
  Owner: Sam
  Post-mortem due: 7 days after resolution
```

---

## 4. Post-mortem template

```
Post-mortem — INCIDENT-###

**Date / duration:** UTC ___ to UTC ___
**Severity:** ___
**Detection latency:** ___ (time from incident to alert)
**Mitigation latency:** ___ (time from alert to action)

**Timeline.**
- UTC __: user reports / alert fires
- UTC __: triage complete
- UTC __: mitigation in place
- UTC __: closed

**Root cause.**
___
**Why we missed it.**
___
**Why we caught it.**
___
**What we'll change.**
1. ___
2. ___

**What we'll keep.**
1. ___

**Lessons.**
1. ___
```

— Sam Peacock
2026-08-11
