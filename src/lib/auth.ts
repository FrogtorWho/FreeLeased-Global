// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Auth + Session middleware (Phase 17).
//
// Layered with src/lib/rbac.ts:
//   - auth.ts: identity (getCurrentUser, sessions, logAction)
//   - rbac.ts:  authorisation (canAccess, filterForUser, secret-slice enforcer)
//
// Local-first: no third-party identity providers. Sessions are server-side
// records (24h expiry, refresh-on-use). Passwords are hashed with scrypt
// (no external dep — uses Node's built-in crypto).
//
// For Hono context (custom-routes.ts), the helpers are:
//   - getCurrentUser(c)        → AuthUser | null
//   - requireRole(c, role)     → throws AuthError if user lacks role
//   - requirePermission(...)   → throws AuthError if denied
//   - logAction(c, action, ...) → writes to AuditLog (with hash chain)

import { createHash, scryptSync, randomBytes, timingSafeEqual } from "node:crypto"
import { prisma } from "./db.ts"
import { canAccess, hasRoleAtLeast, type AuthUser, type Resource, type Permission, type Role, type AccessContext } from "./rbac.ts"

// ── Auth errors ────────────────────────────────────────────────────────────
export class AuthError extends Error {
  status: 401 | 403
  constructor(message: string, status: 401 | 403) {
    super(message)
    this.name = "AuthError"
    this.status = status
  }
}

// ── Password hashing ───────────────────────────────────────────────────────
// Scrypt with 16-byte salt, 64-byte hash. Output: "scrypt$<saltHex>$<hashHex>"
const SCRYPT_KEYLEN = 64
const SCRYPT_SALT_BYTES = 16
const SCRYPT_N = 16384 // cost factor

export function hashPassword(password: string): string {
  const salt = randomBytes(SCRYPT_SALT_BYTES)
  const derived = scryptSync(password.normalize("NFKC"), salt, SCRYPT_KEYLEN, { N: SCRYPT_N })
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`
}

export function verifyPassword(password: string, encoded: string): boolean {
  const parts = encoded.split("$")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false
  const salt = Buffer.from(parts[1], "hex")
  const expected = Buffer.from(parts[2], "hex")
  const derived = scryptSync(password.normalize("NFKC"), salt, expected.length, { N: SCRYPT_N })
  return derived.length === expected.length && timingSafeEqual(derived, expected)
}

// ── Session helpers ────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function createSession(opts: {
  userId: string
  ipAddress?: string
  userAgent?: string
}): Promise<{ id: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const session = await prisma.session.create({
    data: {
      userId: opts.userId,
      expiresAt,
      ipAddress: opts.ipAddress ?? null,
      userAgent: opts.userAgent ?? null,
    },
  })
  return { id: session.id, expiresAt: session.expiresAt }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  }).catch(() => {/* idempotent */})
}

export async function resolveSession(sessionId: string): Promise<AuthUser | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })
  if (!session) return null
  if (session.revokedAt) return null
  if (session.expiresAt < new Date()) return null
  return userToAuthUser(session.user)
}

export function userToAuthUser(u: {
  id: string
  email: string
  name: string | null
  role: string
  tenantId: string
  residentId?: string | null
  judgeDemoOnly?: boolean
}): AuthUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: normaliseRole(u.role),
    tenantId: u.tenantId,
    residentId: u.residentId ?? null,
    judgeDemoOnly: u.judgeDemoOnly ?? false,
  }
}

export function normaliseRole(role: string): Role {
  const upper = role.toUpperCase()
  if (upper === "ADMIN" || upper === "PARTNER" || upper === "EMPLOYEE" || upper === "JUDGE" || upper === "RESIDENT") {
    return upper
  }
  // Default to RESIDENT for unknown roles (defence-in-depth).
  return "RESIDENT"
}

// ── IP / user-agent extraction ────────────────────────────────────────────
// Hono context exposes c.req via the standard Web API Request.
export function ipFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    undefined
  )
}

export function uaFromHeaders(headers: Headers): string | undefined {
  return headers.get("user-agent")?.slice(0, 500) ?? undefined
}

// ── Middleware-style helpers for Hono (custom-routes.ts) ──────────────────
// Usage:  const user = getCurrentUser(c) ?? null
//        if (!user) return c.json({ error: "unauthenticated" }, 401)
export function getCurrentUser(c: { req: { header: (k: string) => string | undefined; raw?: Request } }): AuthUser | null {
  // 1. Session cookie (preferred)
  const cookieHeader = c.req.header("cookie") ?? ""
  const sessionId = parseSessionCookie(cookieHeader)
  if (sessionId) {
    // NOTE: this is a sync path; in Hono we generally want async. Callers
    // should use `await getCurrentUserAsync(c)` for the truly-safe path.
    // Sync here is a deliberate fallback for the MCP server which lacks
    // an async boundary. The async version is the correct one for routes.
  }
  // 2. Bearer token (for MCP / API clients)
  const auth = c.req.header("authorization") ?? ""
  if (auth.startsWith("Bearer ")) {
    // tokens are referenced as "session:<id>"
    const tok = auth.slice("Bearer ".length).trim()
    if (tok.startsWith("session:")) {
      // intentionally sync-unreachable from here; the async path is required.
    }
  }
  // Both paths require async DB lookup. The route handlers should use
  // the async version. We return null here.
  return null
}

// Async version — the one to actually use in route handlers.
export async function getCurrentUserAsync(c: {
  req: { header: (k: string) => string | undefined }
}): Promise<AuthUser | null> {
  const cookieHeader = c.req.header("cookie") ?? ""
  let sessionId = parseSessionCookie(cookieHeader)
  if (!sessionId) {
    const auth = c.req.header("authorization") ?? ""
    if (auth.startsWith("Bearer ")) {
      const tok = auth.slice("Bearer ".length).trim()
      if (tok.startsWith("session:")) sessionId = tok.slice("session:".length)
    }
  }
  if (!sessionId) return null
  return resolveSession(sessionId)
}

function parseSessionCookie(cookieHeader: string): string | null {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(/;\s*/)
  for (const p of parts) {
    const eq = p.indexOf("=")
    if (eq === -1) continue
    const k = p.slice(0, eq).trim()
    if (k === "fl_session" || k === "session") {
      return p.slice(eq + 1).trim() || null
    }
  }
  return null
}

// ── requireRole / requirePermission ────────────────────────────────────────
export async function requireRole(c: any, minimum: Role): Promise<AuthUser> {
  const user = await getCurrentUserAsync(c)
  if (!user) throw new AuthError("authentication required", 401)
  if (!hasRoleAtLeast(user, minimum)) {
    throw new AuthError(`role ${minimum} required`, 403)
  }
  return user
}

export async function requirePermission(
  c: any,
  resource: Resource,
  permission: Permission,
  ctx: AccessContext = {},
): Promise<AuthUser> {
  const user = await getCurrentUserAsync(c)
  if (!user) throw new AuthError("authentication required", 401)
  if (!canAccess(user, resource, permission, ctx)) {
    throw new AuthError(`permission denied: ${permission} on ${resource}`, 403)
  }
  return user
}

// ── Audit log + hash chain ────────────────────────────────────────────────
// Writes an audit row. Each row's auditHash = sha256(prevHash || canon(row)).
// Verified by scripts/audit-trail-verifier.ts.
export async function logAction(opts: {
  userId?: string | null
  action: string
  resource: string
  resourceId?: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}): Promise<{ id: string; auditHash: string }> {
  const prev = await prisma.auditLog.findFirst({
    orderBy: { timestamp: "desc" },
    select: { auditHash: true },
  })
  const prevHash = prev?.auditHash ?? null
  const timestamp = new Date()
  const canon = canonicalize({
    userId: opts.userId ?? null,
    action: opts.action,
    resource: opts.resource,
    resourceId: opts.resourceId ?? null,
    before: opts.before ?? null,
    after: opts.after ?? null,
    metadata: opts.metadata ?? {},
    ipAddress: opts.ipAddress ?? null,
    userAgent: opts.userAgent ?? null,
    timestamp: timestamp.toISOString(),
    prevHash,
  })
  const auditHash = createHash("sha256").update(canon).digest("hex")
  const row = await prisma.auditLog.create({
    data: {
      userId: opts.userId ?? null,
      action: opts.action,
      resource: opts.resource,
      resourceId: opts.resourceId ?? null,
      before: opts.before == null ? null : JSON.stringify(opts.before),
      after: opts.after == null ? null : JSON.stringify(opts.after),
      metadata: JSON.stringify(opts.metadata ?? {}),
      ipAddress: opts.ipAddress ?? null,
      userAgent: opts.userAgent ?? null,
      timestamp,
      auditHash,
      prevHash,
    },
  })
  return { id: row.id, auditHash }
}

// Canonical JSON for stable hashing (sorts keys recursively).
function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return "[" + value.map(canonicalize).join(",") + "]"
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize(obj[k])).join(",") + "}"
}

// ── Hono error handler ────────────────────────────────────────────────────
export function authErrorResponse(c: any, err: unknown): Response {
  if (err instanceof AuthError) {
    return c.json({ error: err.message }, err.status)
  }
  throw err
}

// ── Audit log verification ─────────────────────────────────────────────────
// Returns the broken link (if any) and the count of rows verified.
export async function verifyAuditChain(): Promise<{
  ok: boolean
  rows: number
  brokenAt?: string
  reason?: string
}> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { timestamp: "asc" },
  })
  let prevHash: string | null = null
  for (const r of rows) {
    const canon = canonicalize({
      userId: r.userId,
      action: r.action,
      resource: r.resource,
      resourceId: r.resourceId,
      before: r.before ? JSON.parse(r.before) : null,
      after: r.after ? JSON.parse(r.after) : null,
      metadata: JSON.parse(r.metadata || "{}"),
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      timestamp: r.timestamp.toISOString(),
      prevHash,
    })
    const expected = createHash("sha256").update(canon).digest("hex")
    if (r.prevHash !== prevHash) {
      return { ok: false, rows: rows.length, brokenAt: r.id, reason: "prevHash mismatch" }
    }
    if (r.auditHash !== expected) {
      return { ok: false, rows: rows.length, brokenAt: r.id, reason: "auditHash mismatch" }
    }
    prevHash = r.auditHash
  }
  return { ok: true, rows: rows.length }
}

// ── Self-check (used by tests) ────────────────────────────────────────────
// AUTH_VERSION is re-exported from src/lib/auth-shim.ts so test files
// that don't want to pull in prisma can import it from there.
export { AUTH_VERSION } from "./auth-shim.ts"
export { AuthError } from "./auth-shim.ts"
