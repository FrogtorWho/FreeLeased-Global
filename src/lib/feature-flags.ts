// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Feature flags / kill switches (Phase 17).
//
// Each engine / pipeline has a kill switch. Toggle off to disable
// without redeploying. The flag store is in-memory (default) but
// persisted to the DB so it survives restarts.

export const FEATURE_FLAGS = [
  'consensus_gate',
  'fairness_engine',
  'vlm_pipeline',
  'reconciliation',
  'federation',
  'learning_loop',
  'giotto_integration',
  'kauntlet_process',
  'ollygarden_telemetry',
  'demo_scan_lease',
  'mcp_server',
  'rbac_enforcement',
  'audit_hash_chain',
  'rate_limiting',
  'notifications',
  'retention_purge',
] as const

export type FeatureFlag = typeof FEATURE_FLAGS[number]

const DEFAULTS: Record<FeatureFlag, boolean> = {
  consensus_gate: true,
  fairness_engine: true,
  vlm_pipeline: true,
  reconciliation: true,
  federation: true,
  learning_loop: true,
  giotto_integration: true,
  kauntlet_process: true,
  ollygarden_telemetry: true,
  demo_scan_lease: true,
  mcp_server: true,
  rbac_enforcement: true,    // flipping this off disables requireRole entirely
  audit_hash_chain: true,
  rate_limiting: true,
  notifications: true,
  retention_purge: true,
}

// In-memory cache. The DB is the source of truth; the cache is hydrated on
// first read and updated on write.
const cache = new Map<FeatureFlag, boolean>(Object.entries(DEFAULTS) as [FeatureFlag, boolean][])
let hydrated = false

export interface FeatureFlagState {
  key: FeatureFlag
  enabled: boolean
  reason?: string | null
  updatedAt?: Date
  updatedBy?: string | null
}

export async function featureFlag(key: FeatureFlag): Promise<boolean> {
  if (!hydrated) await hydrate()
  return cache.get(key) ?? true
}

export async function setFeatureFlag(key: FeatureFlag, enabled: boolean, opts?: { reason?: string; updatedBy?: string }): Promise<void> {
  if (!hydrated) await hydrate()
  cache.set(key, enabled)
  const { prisma } = await import('./db')
  await prisma.featureFlag.upsert({
    where: { key },
    update: { enabled, reason: opts?.reason ?? null, updatedBy: opts?.updatedBy ?? null, updatedAt: new Date() },
    create: { key, enabled, reason: opts?.reason ?? null, updatedBy: opts?.updatedBy ?? null },
  })
}

export async function listFeatureFlags(): Promise<FeatureFlagState[]> {
  if (!hydrated) await hydrate()
  const { prisma } = await import('./db')
  const rows = await prisma.featureFlag.findMany()
  const map = new Map(rows.map((r) => [r.key as FeatureFlag, r]))
  return FEATURE_FLAGS.map((key) => {
    const row = map.get(key)
    return {
      key,
      enabled: row?.enabled ?? cache.get(key) ?? true,
      reason: row?.reason ?? null,
      updatedAt: row?.updatedAt,
      updatedBy: row?.updatedBy ?? null,
    }
  })
}

async function hydrate(): Promise<void> {
  try {
    const { prisma } = await import('./db')
    const rows = await prisma.featureFlag.findMany()
    for (const r of rows) {
      if (FEATURE_FLAGS.includes(r.key as FeatureFlag)) {
        cache.set(r.key as FeatureFlag, r.enabled)
      }
    }
    hydrated = true
  } catch {
    // DB not ready (e.g. during build) — fall back to defaults.
    hydrated = true
  }
}

// Reset to defaults (used by tests).
export function _resetForTest(): void {
  for (const k of FEATURE_FLAGS) cache.set(k, DEFAULTS[k])
  hydrated = false
}

export const FEATURE_FLAGS_VERSION = '17.0.0'
