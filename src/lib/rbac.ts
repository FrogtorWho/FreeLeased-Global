// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Role-Based Access Control (RBAC) permission engine.
//
// The single source of truth for "who can see what". Every endpoint
// that touches user data ultimately calls into this module. The
// JUDGE secret-slice enforcer (`filterForUser` + `stripHiddenFields`)
// lives here.
//
// Design references:
//   - project/strategy/rbac-design.md        — full role + permission matrix
//   - project/strategy/judge-secret-slice.md — what the JUDGE sees / doesn't
//   - docs/ALGORITHMIC-TRANSPARENCY.md       — public-facing transparency
//
// This module is pure (no I/O). It is safe to import from the client
// bundle for UI-side gating of nav items, but the *enforcement* always
// happens server-side in custom-routes.ts.

export type Role = "ADMIN" | "PARTNER" | "EMPLOYEE" | "JUDGE" | "RESIDENT"
export const ROLES: readonly Role[] = ["ADMIN", "PARTNER", "EMPLOYEE", "JUDGE", "RESIDENT"] as const
export type Permission = "READ" | "WRITE" | "ADMIN"
export const PERMISSIONS: readonly Permission[] = ["READ", "WRITE", "ADMIN"] as const

export type Resource =
  | "dossier"
  | "engine_output"
  | "audit_log"
  | "ai_agent_state"
  | "overlay_config"
  | "pricing"
  | "partnership_data"
  | "conviction_table"
  | "system_health"
  | "user_account"
  | "secret_slice"
  | "notification"
  | "feature_flag"

export const RESOURCES: readonly Resource[] = [
  "dossier",
  "engine_output",
  "audit_log",
  "ai_agent_state",
  "overlay_config",
  "pricing",
  "partnership_data",
  "conviction_table",
  "system_health",
  "user_account",
  "secret_slice",
  "notification",
  "feature_flag",
] as const

// Fields that the JUDGE must NEVER see. The filter is the secret-slice
// enforcer. Adding a field here is a one-line change to expose more
// internals to a Judge — it is intentionally a friction point.
export const HIDDEN_FROM_JUDGE: ReadonlySet<string> = new Set([
  "conviction",
  "agentTrail",
  "cost",
  "perAgentCostAttribution",
  "hitlOverrideHistory",
  "unverifiedClaims",
  "pricingMechanics",
  "architectureInternals",
  "roadmapPost2026",
  "mouPricing",
  "internalFailureModes",
  "researchCandidates",
  "rowHash",
  "auditHash",
  "prevHash",
])

// Fields that PARTNER cannot see (internal conviction metadata).
// PARTNER sees the verdict and the cited statute, but not the
// confidence / agent trail / cost.
export const HIDDEN_FROM_PARTNER: ReadonlySet<string> = new Set([
  "conviction",
  "agentTrail",
  "cost",
  "perAgentCostAttribution",
  "hitlOverrideHistory",
  "rowHash",
  "auditHash",
  "prevHash",
])

// Fields that RESIDENT can never see (other residents, agent details).
export const HIDDEN_FROM_RESIDENT: ReadonlySet<string> = new Set([
  ...HIDDEN_FROM_PARTNER,
  "otherResidents",
  "tenantWideMetrics",
  "agentCost",
])

// ── Default RBAC matrix ─────────────────────────────────────────────────────
// Resource × Role → set of Permission allowed. "ADMIN" denotes the
// administrative permission (full control). "—" means no access.
// The user-facing permission matrix is documented in rbac-design.md.
//
// Matrix source of truth (per rbac-design.md §3):
//   ADMIN     → all permissions on all resources
//   PARTNER   → dossier (R/W org), engine_output (R no conviction), pricing (R),
//               partnership_data (R own), system_health (R own), user_account (R/W own tenant),
//               notification (R/W)
//   EMPLOYEE  → dossier (none), engine_output (R), audit_log (R), ai_agent_state (R/W/A),
//               conviction_table (R), system_health (R), notification (R/W)
//   JUDGE     → dossier (R curated), engine_output (R verdict only), pricing (R labels),
//               partnership_data (R list only), secret_slice (R filtered)
//   RESIDENT  → dossier (R/W own), engine_output (R own), audit_log (R own),
//               pricing (R), user_account (R own), notification (R/W own)

const MATRIX: Record<Resource, Record<Role, ReadonlySet<Permission>>> = {
  dossier: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    PARTNER: new Set(["READ", "WRITE"]),                  // own tenant
    EMPLOYEE: new Set(),                                  // no access
    JUDGE: new Set(["READ"]),                             // curated slice
    RESIDENT: new Set(["READ", "WRITE"]),                 // own only
  },
  engine_output: {
    ADMIN: new Set(["READ"]),
    PARTNER: new Set(["READ"]),                           // conviction stripped
    EMPLOYEE: new Set(["READ"]),
    JUDGE: new Set(["READ"]),                             // verdict only
    RESIDENT: new Set(["READ"]),                          // own only
  },
  audit_log: {
    ADMIN: new Set(["READ"]),
    PARTNER: new Set(["READ"]),                           // own actions
    EMPLOYEE: new Set(["READ"]),
    JUDGE: new Set(),
    RESIDENT: new Set(["READ"]),                          // own actions
  },
  ai_agent_state: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    EMPLOYEE: new Set(["READ", "WRITE", "ADMIN"]),
    PARTNER: new Set(),
    JUDGE: new Set(),
    RESIDENT: new Set(),
  },
  overlay_config: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    PARTNER: new Set(["READ"]),                           // own tenant
    EMPLOYEE: new Set(),
    JUDGE: new Set(),
    RESIDENT: new Set(),
  },
  pricing: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    PARTNER: new Set(["READ"]),
    EMPLOYEE: new Set(),
    JUDGE: new Set(["READ"]),                             // public labels only
    RESIDENT: new Set(["READ"]),
  },
  partnership_data: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    PARTNER: new Set(["READ"]),                           // own
    EMPLOYEE: new Set(),
    JUDGE: new Set(["READ"]),                             // public list
    RESIDENT: new Set(),
  },
  conviction_table: {
    ADMIN: new Set(["READ"]),
    EMPLOYEE: new Set(["READ"]),
    PARTNER: new Set(),
    JUDGE: new Set(),
    RESIDENT: new Set(),
  },
  system_health: {
    ADMIN: new Set(["READ"]),
    PARTNER: new Set(["READ"]),                           // own tenant
    EMPLOYEE: new Set(["READ"]),
    JUDGE: new Set(),
    RESIDENT: new Set(),
  },
  user_account: {
    ADMIN: new Set(["READ", "WRITE"]),                    // cannot create ADMIN
    PARTNER: new Set(["READ", "WRITE"]),                  // own tenant, cannot create privileged
    EMPLOYEE: new Set(),
    JUDGE: new Set(),
    RESIDENT: new Set(["READ"]),                          // own only
  },
  secret_slice: {
    ADMIN: new Set(["READ"]),                             // reads the full slice for QA
    JUDGE: new Set(["READ"]),                             // filtered slice
    PARTNER: new Set(),
    EMPLOYEE: new Set(),
    RESIDENT: new Set(),
  },
  notification: {
    ADMIN: new Set(["READ", "WRITE"]),
    PARTNER: new Set(["READ", "WRITE"]),                  // own tenant
    EMPLOYEE: new Set(["READ", "WRITE"]),
    JUDGE: new Set(["READ"]),                             // own notifications
    RESIDENT: new Set(["READ", "WRITE"]),                 // own
  },
  feature_flag: {
    ADMIN: new Set(["READ", "WRITE", "ADMIN"]),
    EMPLOYEE: new Set(["READ"]),                          // can read to gate self
    PARTNER: new Set(),
    JUDGE: new Set(),
    RESIDENT: new Set(),
  },
}

// ── User record (shape used by canAccess / filterForUser) ────────────────
// Intentionally small + serializable so the same type works on client + server.
export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: Role
  tenantId: string
  residentId?: string | null
  judgeDemoOnly?: boolean
}

export interface AccessContext {
  // The ownership context for scoped resources (e.g. "is this dossier the user's own?")
  tenantId?: string
  residentId?: string
  // Whether the item is a curated demo entry (JUDGE only sees these)
  isDemoEntry?: boolean
}

// ── Core predicate ─────────────────────────────────────────────────────────
// Note: server-side enforcement always runs this. UI-side gating is a
// convenience but not a security boundary.
export function canAccess(
  user: AuthUser | null | undefined,
  resource: Resource,
  permission: Permission,
  ctx: AccessContext = {},
): boolean {
  // Public endpoints (no user) are gated by route prefix, not by canAccess.
  if (!user) return false

  // ADMIN is the superset — short-circuit. The "cannot create ADMIN"
  // rule is enforced at the route level (no POST /api/admin/users
  // accepts role=ADMIN), not here.
  if (user.role === "ADMIN") return true

  const set = MATRIX[resource]?.[user.role]
  if (!set) return false
  if (!set.has(permission)) return false

  // ── Scope checks ────────────────────────────────────────────────────────
  // PARTNER: tenant-scoped on the data-touching resources.
  if (user.role === "PARTNER") {
    if (
      resource === "dossier" ||
      resource === "engine_output" ||
      resource === "overlay_config" ||
      resource === "system_health" ||
      resource === "partnership_data" ||
      resource === "user_account" ||
      resource === "notification"
    ) {
      if (ctx.tenantId !== user.tenantId) return false
    }
  }
  // RESIDENT: own dossier only.
  if (user.role === "RESIDENT") {
    if (resource === "dossier" || resource === "engine_output") {
      if (ctx.residentId !== user.residentId) return false
    }
    if (resource === "audit_log") {
      // Filter is applied at query time, not via canAccess; this is a coarse check.
    }
  }
  // JUDGE: only curated demo entries.
  if (user.role === "JUDGE") {
    if (resource === "dossier" || resource === "engine_output") {
      if (!ctx.isDemoEntry) return false
    }
  }
  return true
}

// ── Strip hidden fields ────────────────────────────────────────────────────
// Returns a *new* object with fields the role cannot see removed.
// Custom JSON because the data can be any shape (not a class instance).
export function stripHiddenFields<T extends Record<string, unknown>>(
  item: T,
  user: AuthUser | null | undefined,
): T {
  if (!user) return item
  const hidden = pickHiddenFieldSet(user.role)
  if (hidden.size === 0) return item
  return { ...stripRecursive(item, hidden) } as T
}

function pickHiddenFieldSet(role: Role): ReadonlySet<string> {
  if (role === "JUDGE") return HIDDEN_FROM_JUDGE
  if (role === "PARTNER") return HIDDEN_FROM_PARTNER
  if (role === "RESIDENT") return HIDDEN_FROM_RESIDENT
  return new Set()
}

function stripRecursive(value: unknown, hidden: ReadonlySet<string>): unknown {
  if (Array.isArray(value)) return value.map((v) => stripRecursive(v, hidden))
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (hidden.has(k)) continue
      out[k] = stripRecursive(v, hidden)
    }
    return out
  }
  return value
}

// ── filterForUser ──────────────────────────────────────────────────────────
// The Judge secret-slice enforcer. Two-stage:
//   1. Filter: keep only items where canAccess(... READ) === true.
//   2. Strip: remove hidden fields per role.
// Returns an audit-ready record alongside the filtered items so the
// caller can log it to the AuditLog.
export interface FilterResult<T> {
  items: T[]
  strippedFields: string[]
  itemsIn: number
  itemsOut: number
}

export function filterForUser<T extends Record<string, unknown>>(
  items: T[],
  user: AuthUser | null | undefined,
  resource: Resource,
  ctxFor: (item: T) => AccessContext = () => ({}),
): FilterResult<T> {
  const itemsIn = items.length
  if (!user) return { items: [], strippedFields: [], itemsIn, itemsOut: 0 }

  const filtered = items.filter((item) => canAccess(user, resource, "READ", ctxFor(item)))
  const hidden = pickHiddenFieldSet(user.role)
  const stripped = filtered.map((item) => stripHiddenFields(item, user))
  return {
    items: stripped,
    strippedFields: Array.from(hidden),
    itemsIn,
    itemsOut: stripped.length,
  }
}

// ── Authorization for write actions on user_account ───────────────────────
// Enforces the "no one can create ADMIN except out-of-band" rule.
export function canCreateUser(actor: AuthUser | null, newRole: Role): boolean {
  if (!actor) return false
  if (actor.role === "ADMIN") {
    // ADMIN can create anyone EXCEPT another ADMIN (no privilege escalation).
    return newRole !== "ADMIN"
  }
  if (actor.role === "PARTNER") {
    // PARTNER can create RESIDENT only, in their own tenant.
    return newRole === "RESIDENT"
  }
  return false
}

// ── Resource scoping helpers ───────────────────────────────────────────────
// Helpers that callers can use to build Prisma `where` clauses.
export function dossierWhereForUser(user: AuthUser): Record<string, unknown> {
  if (user.role === "ADMIN") return {}
  if (user.role === "PARTNER") return { tenantId: user.tenantId }
  if (user.role === "RESIDENT") return { residentId: user.residentId ?? "__none__" }
  if (user.role === "JUDGE") return { isDemoEntry: true }
  // EMPLOYEE has no dossier access.
  return { id: "__none__" }
}

export function auditLogWhereForUser(user: AuthUser): Record<string, unknown> {
  if (user.role === "ADMIN" || user.role === "EMPLOYEE") return {}
  if (user.role === "PARTNER") return { user: { tenantId: user.tenantId } }
  if (user.role === "RESIDENT") return { userId: user.id }
  return { id: "__none__" }
}

// ── Convenience: role hierarchy ────────────────────────────────────────────
// ADMIN > PARTNER > EMPLOYEE > JUDGE > RESIDENT
// Higher = more powerful. Used for `requireRole` minimum-role checks.
const RANK: Record<Role, number> = { ADMIN: 100, PARTNER: 80, EMPLOYEE: 60, JUDGE: 40, RESIDENT: 20 }
export function hasRoleAtLeast(user: AuthUser | null, minimum: Role): boolean {
  if (!user) return false
  return RANK[user.role] >= RANK[minimum]
}

// ── Self-check (used by tests) ────────────────────────────────────────────
export const RBAC_MATRIX = MATRIX
export const RBAC_VERSION = "17.0.0"
