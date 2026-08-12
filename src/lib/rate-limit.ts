// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — In-memory rate limiter (Phase 17).
//
// Zero-dep, deterministic, in-memory. Suitable for a single-pod demo /
// local-first deployment. For multi-pod production, swap the backing
// store for Redis (the interface is small enough to drop in).
//
// Strategy: sliding-window counter per (key, route). Defaults are
// route-aware (writes are tighter than reads).

import type { AuthUser } from './rbac'

export interface RateLimitConfig {
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterMs?: number
}

interface Bucket {
  hits: number[]
  resetAt: number
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'auth:login': { limit: 10, windowMs: 60_000 },
  'auth:register': { limit: 5, windowMs: 60_000 },
  'write': { limit: 60, windowMs: 60_000 },
  'read': { limit: 300, windowMs: 60_000 },
  'expensive': { limit: 20, windowMs: 60_000 },
}

const buckets = new Map<string, Bucket>()

const CLEANUP_INTERVAL_MS = 60_000
let cleanupHandle: ReturnType<typeof setInterval> | null = null
function ensureCleanup() {
  if (cleanupHandle) return
  cleanupHandle = setInterval(() => {
    const now = Date.now()
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k)
    }
  }, CLEANUP_INTERVAL_MS)
  if (cleanupHandle && typeof cleanupHandle.unref === 'function') cleanupHandle.unref()
}

export function rateLimit(
  key: string,
  bucket: string = 'read',
  override?: RateLimitConfig,
): RateLimitResult {
  ensureCleanup()
  const cfg = override ?? DEFAULT_CONFIGS[bucket] ?? DEFAULT_CONFIGS.read
  const mapKey = `${bucket}:${key}`
  const now = Date.now()
  let b = buckets.get(mapKey)
  if (!b || b.resetAt < now) {
    b = { hits: [], resetAt: now + cfg.windowMs }
    buckets.set(mapKey, b)
  }
  b.hits = b.hits.filter((t) => t > now - cfg.windowMs)
  if (b.hits.length >= cfg.limit) {
    const oldest = b.hits[0]
    return {
      allowed: false,
      remaining: 0,
      resetAt: b.resetAt,
      retryAfterMs: Math.max(0, oldest + cfg.windowMs - now),
    }
  }
  b.hits.push(now)
  return {
    allowed: true,
    remaining: cfg.limit - b.hits.length,
    resetAt: b.resetAt,
  }
}

export function defaultRateLimitKey(c: { req: { header: (k: string) => string | undefined } }, user: AuthUser | null): string {
  if (user) return `u:${user.id}`
  const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    ?? c.req.header('x-real-ip')
    ?? 'anonymous'
  return `ip:${ip}`
}

// Mount as Hono middleware. Usage: app.use('/api/*', rateLimitMiddleware('read'))
// Auth is imported lazily to avoid a circular dependency (auth → rbac is fine,
// but auth does not need to import rate-limit).
export function rateLimitMiddleware(bucket: string = 'read') {
  return async (c: any, next: any) => {
    const { getCurrentUserAsync } = await import('./auth')
    const user = await getCurrentUserAsync(c).catch(() => null)
    const key = defaultRateLimitKey(c, user)
    const result = rateLimit(key, bucket)
    c.header('X-RateLimit-Limit', String(DEFAULT_CONFIGS[bucket]?.limit ?? 0))
    c.header('X-RateLimit-Remaining', String(result.remaining))
    c.header('X-RateLimit-Reset', String(Math.floor(result.resetAt / 1000)))
    if (!result.allowed) {
      c.header('Retry-After', String(Math.ceil((result.retryAfterMs ?? 1000) / 1000)))
      return c.json({ error: 'rate_limit_exceeded', retryAfterMs: result.retryAfterMs }, 429)
    }
    return next()
  }
}

// Reset for tests.
export function _resetForTest(): void {
  buckets.clear()
  if (cleanupHandle) {
    clearInterval(cleanupHandle)
    cleanupHandle = null
  }
}

export const RATE_LIMIT_VERSION = '17.0.0'
export const RATE_LIMIT_CONFIGS = DEFAULT_CONFIGS
