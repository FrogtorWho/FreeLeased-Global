// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Notifications (Phase 17).
//
// Out-of-band alerts for events that require human attention.
// In-app row in the Notification table. The "live" delivery (email/push)
// is a deployment concern — the table is the canonical record.
//
// DB is lazy-imported so this module's VERSION constant can be imported
// by tests without pulling in @prisma/client.

export type NotificationKind =
  | 'hitl_pending'
  | 'verdict_ready'
  | 'queue_overflow'
  | 'system_health'
  | 'dossier_signoff'
  | 'audit_summary'
  | 'rbac_denial'
  | 'flag_change'

export interface NotifyOpts {
  tenantId?: string
  userId?: string
  role?: string
  kind: NotificationKind
  title: string
  body: string
  metadata?: Record<string, unknown>
}

export async function notify(opts: NotifyOpts): Promise<{ id: string }> {
  const { prisma } = await import('./db.ts')
  const row = await prisma.notification.create({
    data: {
      tenantId: opts.tenantId ?? 'tenant_default',
      userId: opts.userId ?? null,
      role: opts.role ?? null,
      kind: opts.kind,
      title: opts.title,
      body: opts.body,
      metadata: JSON.stringify(opts.metadata ?? {}),
    },
  })
  return { id: row.id }
}

export async function notifyHITLPending(tenantId: string, reviewItemId: string, title: string): Promise<{ id: string }> {
  return notify({
    tenantId, role: 'ADMIN', kind: 'hitl_pending',
    title: 'HITL review pending',
    body: title,
    metadata: { reviewItemId },
  })
}

export async function notifyVerdictReady(tenantId: string, userId: string, dossierId: string): Promise<{ id: string }> {
  return notify({
    tenantId, userId, kind: 'verdict_ready',
    title: 'Your dossier is ready',
    body: 'Your lease audit has been built. View the verdict.',
    metadata: { dossierId },
  })
}

export async function notifyAuditSummary(tenantId: string, summary: { totalEntries: number; last24h: number }): Promise<{ id: string }> {
  return notify({
    tenantId, role: 'ADMIN', kind: 'audit_summary',
    title: 'Daily audit summary',
    body: `${summary.last24h} entries in the last 24h (${summary.totalEntries} total).`,
    metadata: summary,
  })
}

export async function notifyFlagChange(tenantId: string, flag: string, enabled: boolean, by: string): Promise<{ id: string }> {
  return notify({
    tenantId, role: 'ADMIN', kind: 'flag_change',
    title: `Feature flag ${enabled ? 'enabled' : 'disabled'}: ${flag}`,
    body: `By ${by}`,
    metadata: { flag, enabled },
  })
}

export async function listForUser(userId: string, role: string, opts: { unreadOnly?: boolean; limit?: number } = {}) {
  const { prisma } = await import('./db.ts')
  const where: Record<string, unknown> = {
    OR: [
      { userId },
      { role: role, userId: null },
    ],
  }
  if (opts.unreadOnly) where.readAt = null
  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: opts.limit ?? 50,
  })
}

export async function markRead(id: string, userId: string): Promise<void> {
  const { prisma } = await import('./db.ts')
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  })
}

// Re-export from the shim so existing callers keep working.
export { NOTIFICATIONS_VERSION } from './notifications-shim.ts'
