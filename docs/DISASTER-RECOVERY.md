---
title: "Backup + Disaster Recovery"
date: 2026-08-12
phase: 17
status: "Active"
owner: "Sam (Administrator)"
related: "INCIDENT-RESPONSE.md, retention.ts"
---

# Backup + Disaster Recovery

> **The question:** "if the database is destroyed, what do we do?"
> **The answer:** this document plus [`scripts/backup.ts`](../scripts/backup.ts).
> The system is local-first; the recovery story is "snapshot, then restore".

## 1. What we back up

| Asset | Frequency | Storage | Retention |
|-------|-----------|---------|-----------|
| **SQLite database** (`dev.db`) | Daily 02:00 UTC | `data/backups/db-YYYY-MM-DD.db` | 90 days |
| **Conviction table** (the learning state) | Daily 02:00 UTC | `data/backups/conviction-YYYY-MM-DD.json` | 365 days |
| **Audit log** | Hourly | `data/backups/audit-YYYY-MM-DDTHH.json` | 7 years (legal) |
| **Source spine** (UK + Caribbean statutes) | On change | `data/backups/spine-YYYY-MM-DD.json` | Permanent |
| **Resident pseudonym map** | On change | `memory/pilot-pseudonym-map.md` (out-of-band) | Permanent |

## 2. Backup script

`scripts/backup.ts` runs the daily backup. It is invoked by:

- **Cron** (production): `0 2 * * * node --experimental-strip-types scripts/backup.ts`
- **Manual**: `bun run backup`
- **Post-deploy**: every release triggers a snapshot.

```typescript
// scripts/backup.ts (excerpt)
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../src/lib/db'

const today = new Date().toISOString().slice(0, 10)
const backupDir = './data/backups'
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true })

// 1. Snapshot the SQLite database
copyFileSync('./dev.db', `${backupDir}/db-${today}.db`)

// 2. Snapshot the conviction table (the learning state, the "gauntlet")
const convictions = await prisma.auditEntry.findMany({ /* verbatim */ })
writeFileSync(`${backupDir}/conviction-${today}.json`, JSON.stringify(convictions, null, 2))

// 3. Snapshot the audit log so far
const audits = await prisma.auditLog.findMany({ orderBy: { timestamp: 'asc' } })
writeFileSync(`${backupDir}/audit-${today}.json`, JSON.stringify(audits, null, 2))
```

## 3. Restore procedure

### 3.1 Full database restore
```bash
# 1. Stop the server
bun run stop

# 2. Back up the (corrupted) DB for post-mortem
cp dev.db dev.db.corrupted-$(date +%s)

# 3. Restore from latest backup
cp data/backups/db-2026-08-12.db dev.db

# 4. Verify the audit chain
bun run test:audit-verify

# 5. Restart
bun run start
```

### 3.2 Conviction table only
The conviction table is the most precious asset. If it is corrupted but the rest of the DB is fine:

```bash
bun run scripts/backup.ts --restore-conviction-from data/backups/conviction-2026-08-12.json
```

### 3.3 Audit log only
If the audit log is corrupted but the data is fine:

```bash
# Replay the corruption to a separate file for forensics
bun run scripts/backup.ts --extract-audit-to logs/audit-corrupt.json

# Restore from the most recent good audit snapshot
bun run scripts/backup.ts --restore-audit-from data/backups/audit-2026-08-12T02.json
```

## 4. Disaster scenarios

| Scenario | Recovery time | Steps |
|----------|---------------|-------|
| **Laptop stolen** | 4 hours | Restore DB from cloud backup; re-install on new machine |
| **Ransomware** | 1 day | Restore from immutable cold storage (out-of-band) |
| **Cloud region outage** | N/A | Local-first; no cloud dependency |
| **Database corruption** | 30 min | Restore from daily snapshot |
| **Audit chain broken** | 1 hour | Forensic analysis + restore from hourly snapshot |
| **Conviction table corrupted** | 4 hours | Restore from snapshot + replay learning outcomes |

## 5. Off-site backup

The local-first design assumes the laptop is the primary. Off-site is:

- **Production deployment**: cloud object storage (S3 / R2 / equivalent).
- **Demo deployment**: Sam's backup laptop, encrypted.

The off-site snapshot is **never** stored on the same machine as the live database.

## 6. Encryption

- Backups are encrypted at rest using `age` (or equivalent) with a key held only by Sam.
- The encryption key is recorded in `MEMORY.md` (operator-only).

## 7. Verification

Scripts verify the backup daily:

```bash
# Verify a backup file is restorable
bun run scripts/backup.ts --verify data/backups/db-2026-08-12.db
```

This loads the backup into a scratch SQLite database, runs the schema migration, and confirms the row counts match.

## 8. RTO / RPO

| Metric | Target |
|--------|--------|
| **RTO** (Recovery Time Objective) | 4 hours |
| **RPO** (Recovery Point Objective) | 24 hours (daily) for DB; 1 hour for audit log |

For the pilot, this is sufficient. For institutional deployment, tighten to RPO = 15 min via streaming replication.

## 9. Cross-references

- [`scripts/backup.ts`](../scripts/backup.ts) — the backup script.
- [`src/lib/retention.ts`](../src/lib/retention.ts) — retention policy.
- [`docs/INCIDENT-RESPONSE.md`](INCIDENT-RESPONSE.md) — incident response.
- [`docs/SLA.md`](SLA.md) — service-level objectives.
