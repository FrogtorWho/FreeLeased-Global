---
title: "Incident Response Plan"
date: 2026-08-12
phase: 17
status: "Active"
owner: "Sam (Administrator)"
related: "rbac-design.md, DISASTER-RECOVERY.md"
---

# Incident Response Plan

> **The question:** "what do we do when something goes wrong?"
> **The answer:** this document. A playbook that lets a single
> operator (Sam, founder) respond in minutes, not hours.

## 1. Severity levels

| Level | Description | Response time | Owner |
|-------|-------------|---------------|-------|
| **SEV-1** | Data breach, RBAC failure, audit chain broken | 15 min | Sam |
| **SEV-2** | Engine outage, build failure, rate-limit storm | 1 hour | Sam |
| **SEV-3** | Degraded performance, false positive in fairness | 4 hours | On-call |
| **SEV-4** | Cosmetic bug, copy issue | 24 hours | Next sprint |

## 2. SEV-1 playbook — Data breach / RBAC failure

### 2.1 Detection
- **Audit log shows** `rbac_denial` with `userId` of a user we don't recognise.
- **Audit chain broken** (`GET /api/admin/audit-verify` returns `ok: false`).
- **External report** (security disclosure, judge complaint, partner flag).

### 2.2 Immediate (first 5 minutes)
1. **Lock the account.** `POST /api/admin/users` to disable (or directly via DB):
   ```sql
   UPDATE users SET password_hash = NULL, email = 'locked+<id>' WHERE id = '<id>';
   ```
2. **Revoke all sessions.** `DELETE FROM sessions WHERE user_id = '<id>';`
3. **Disable the affected feature flag.** `POST /api/admin/feature-flags/<flag>` with `enabled: false`.
4. **Notify the Administrator.** Push notification + email.

### 2.3 Investigation (next 30 minutes)
1. Query the audit log for the user's full session:
   ```sql
   SELECT * FROM audit_logs WHERE user_id = '<id>' ORDER BY timestamp DESC;
   ```
2. Check which `resource` rows were accessed. Walk the `before` / `after` JSON.
3. Verify the `audit_hash` chain backwards to the first compromised row.
4. If the chain is broken, document the break point in `SECURITY-AUDIT.md`.

### 2.4 Communication
- **If a judge's data was exposed:** notify the judge panel within 24 hours.
- **If a partner's data was exposed:** notify the partner within 4 hours.
- **If a resident's data was exposed:** notify within 72 hours (GDPR Art. 33).
- **Template:** see `docs/COMMUNICATION-TEMPLATES.md` (TBD — flagged as future work).

### 2.5 Post-incident
- Write a post-mortem. Save to `docs/POSTMORTEMS/YYYY-MM-DD-<slug>.md`.
- Update this playbook with the lessons learned.
- Update RBAC matrix if the gap was policy-level.

## 3. SEV-2 playbook — Engine outage

### 3.1 Detection
- `GET /api/admin/system-health` returns degraded counts.
- `/competition/build-status` returns `engines.consensus.status !== "operational"`.
- SLO breach (`docs/SLA.md` SLOs violated).

### 3.2 Immediate
1. Check feature flags — are any engines disabled that shouldn't be?
2. Check rate-limit status — is a single IP hammering a route?
   ```sql
   SELECT user_id, COUNT(*) FROM audit_logs WHERE timestamp > now() - INTERVAL '5 minutes' GROUP BY user_id ORDER BY 2 DESC LIMIT 10;
   ```
3. Kill the offending engine flag: `POST /api/admin/feature-flags/consensus_gate` with `enabled: false`.
4. Restart the server: `bun run start`.

### 3.3 Recovery
- Engines are deterministic. A restart recovers state.
- The audit log is the source of truth — never edit it.
- If the conviction table is corrupted, restore from snapshot (see DISASTER-RECOVERY.md).

## 4. SEV-3 playbook — False positive

1. Pull the offending claim from `audit_logs` (filter `action = 'review_decide'`).
2. Note the `metadata` (engine, model, claim).
3. Add to the `fact-check-register.md` (Phase 17 catch-up).
4. If the pattern is systemic, lower the conviction weight:
   - `POST /api/reconciliation/conviction { claim, outcome: 'unfavorable' }`.

## 5. SEV-4 playbook — Cosmetic

- File an issue, batch into next sprint.

## 6. On-call rotation

- Solo founder: Sam is the single on-call.
- Out-of-hours: SEV-1 only.
- Burnout mitigation: SEV-3 and SEV-4 batch to weekly maintenance window.

## 7. Communication channels

- **Push notifications** → in-app (Notification table).
- **Email** → currently out-of-band (no email service in the demo).
- **Status page** → `/api/public/health` (always-on).

## 8. Tabletop exercises

Run the playbook quarterly. Scenarios:
- Judge's session token leaks.
- Partner creates a RESIDENT in their tenant who is actually a competitor.
- The conviction table is corrupted by a botched migration.
- The audit chain is broken by a half-completed restore.

## 9. Cross-references

- [`docs/DISASTER-RECOVERY.md`](DISASTER-RECOVERY.md) — backup + restore.
- [`docs/SLA.md`](SLA.md) — service-level objectives.
- [`docs/SECURITY-AUDIT.md`](SECURITY-AUDIT.md) — threat model.
- [`project/strategy/rbac-design.md`](../project/strategy/rbac-design.md) — RBAC matrix.
