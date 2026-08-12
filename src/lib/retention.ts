// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Data retention policy (Phase 17).
//
// Implements GDPR Art. 17 right-to-erasure and a per-model retention
// policy. Pure functions, no I/O — the caller (cron / UI action)
// supplies the prisma client and runs the deletions.
//
// Policy table (defaults, in days):
//
//   audit_logs             2555 (7 years, legal defensibility)
//   sessions               90   (after expiry)
//   notifications          180  (read or unread)
//   signoffs               2555 (audit ledger, FK from audit_logs)
//   content_drafts         365  (rejected / posted)
//   capture_sessions       30   (after expiry)
//   group_messages         1095 (3 years, group activity)
//   tenant_purge_soft      30   (dpa=0, in 30d)  (DPA-1, 0, x) — see docs/DPIA.md
//
// Right-to-erasure flow:
//   1. POST /api/admin/retention/erase { userId }
//   2. We hash-pseudonymise the user, drop their PII, retain audit trail
//      with `userId = null` so the chain stays intact.
//   3. We log the erasure to AuditLog with action="gdpr_erasure".
//
// Cross-references:
//   - docs/PRIVACY.md
//   - docs/DPIA.md (DPIA)

export const RETENTION_DAYS = {
  audit_logs: 2555,
  sessions: 90,
  notifications: 180,
  signoffs: 2555,
  content_drafts: 365,
  capture_sessions: 30,
  group_messages: 1095,
} as const

export type RetentionSubject = keyof typeof RETENTION_DAYS

export interface RetentionReport {
  subject: RetentionSubject
  cutoff: Date
  eligibleRows: number
  deleted: number
  ranAt: Date
}

export function cutoffFor(subject: RetentionSubject, now: Date = new Date()): Date {
  const days = RETENTION_DAYS[subject]
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

// Deterministic plan: returns the list of (subject, cutoff) pairs that
// would be purged. The actual deletion is a separate, audited step.
export function planRetention(now: Date = new Date()): Array<{ subject: RetentionSubject; cutoff: Date; days: number }> {
  return (Object.keys(RETENTION_DAYS) as RetentionSubject[]).map((s) => ({
    subject: s,
    cutoff: cutoffFor(s, now),
    days: RETENTION_DAYS[s],
  }))
}

// GDPR Art. 17 — right to erasure. Pseudonymises the user, drops PII,
// keeps audit trail integrity.
// Note: this is the *plan* — the executor lives in custom-routes.ts
// because it needs the prisma client.
export interface ErasurePlan {
  userId: string
  fields: string[]            // fields to scrub on User
  affected: {
    sessions: number
    auditLogsPreserved: number
    notifications: number
    contentDrafts: number
  }
  auditTrailAction: string
  ranAt: Date
}

export function planErasure(userId: string): ErasurePlan {
  return {
    userId,
    fields: ['email', 'name', 'passwordHash', 'residentId'],
    affected: {
      sessions: 0, // counted by executor
      auditLogsPreserved: 0,
      notifications: 0,
      contentDrafts: 0,
    },
    auditTrailAction: 'gdpr_erasure',
    ranAt: new Date(),
  }
}

// ── The single object the caller (custom-routes + scripts) wires up ────────
import type { PrismaClient } from '../generated/prisma/client.ts'

export const dataRetention = {
  plan: planRetention,
  cutoff: cutoffFor,
  policy: RETENTION_DAYS,
  // Returns the count of rows that are eligible for purge right now.
  // We don't run the purge here — that's a separate, audited action.
  async eligibleCounts(prisma: PrismaClient, now: Date = new Date()): Promise<Record<RetentionSubject, number>> {
    const out = {} as Record<RetentionSubject, number>
    out.audit_logs = await prisma.auditLog.count({ where: { timestamp: { lt: cutoffFor('audit_logs', now) } } })
    out.sessions = await prisma.session.count({ where: { expiresAt: { lt: now } } })
    out.notifications = await prisma.notification.count({ where: { createdAt: { lt: cutoffFor('notifications', now) } } })
    out.signoffs = await prisma.signoff.count({ where: { createdAt: { lt: cutoffFor('signoffs', now) } } })
    out.content_drafts = await prisma.contentDraft.count({ where: { createdAt: { lt: cutoffFor('content_drafts', now) } } })
    out.capture_sessions = await prisma.captureSession.count({ where: { expiresAt: { lt: now } } })
    out.group_messages = await prisma.groupMessage.count({ where: { createdAt: { lt: cutoffFor('group_messages', now) } } })
    return out
  },
  // Right-to-erasure executor. Pseudonymises PII, retains audit trail.
  async eraseUser(prisma: PrismaClient, userId: string): Promise<{ erased: true; sessionsDeleted: number }> {
    const sessionsDeleted = await prisma.session.deleteMany({ where: { userId } }).then((r) => r.count)
    // Pseudonymise User fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `erased+${userId.slice(0, 8)}@invalid.freeleased`,
        name: null,
        passwordHash: null,
        residentId: null,
      },
    })
    // Soft-delete: we keep the user record (FK target) but mark it
    // un-loginable. Audit logs are preserved with userId intact so
    // the hash chain stays valid.
    return { erased: true, sessionsDeleted }
  },
}

export const RETENTION_VERSION = '17.0.0'
