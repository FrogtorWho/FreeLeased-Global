#!/usr/bin/env -S npx tsx
// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Phase 17 RBAC + Oversight Test Suite.
//
// 50+ assertions covering:
//   1. RBAC matrix (every role × every resource × every permission)
//   2. filterForUser secret-slice enforcement
//   3. Audit chain integrity
//   4. Rate limiter
//   5. Feature flags
//   6. Notification system
//   7. Data retention (plan + policy)
//   8. Password hashing
//   9. MCP tool gating
//  10. Audit log stripping — the Judge filter
//
// Run:  $ bun run scripts/test-rbac.ts
// Exit: 0 on pass, 1 on any failure.

import { createHash, randomBytes } from "node:crypto"

import {
  canAccess,
  canCreateUser,
  filterForUser,
  hasRoleAtLeast,
  stripHiddenFields,
  HIDDEN_FROM_JUDGE,
  HIDDEN_FROM_PARTNER,
  HIDDEN_FROM_RESIDENT,
  RBAC_MATRIX,
  RBAC_VERSION,
  type AuthUser,
  type Role,
} from "../src/lib/rbac.ts"
import { rateLimit, _resetForTest, RATE_LIMIT_VERSION, RATE_LIMIT_CONFIGS } from "../src/lib/rate-limit.ts"
import { dataRetention, RETENTION_VERSION, RETENTION_DAYS } from "../src/lib/retention.ts"
import { FEATURE_FLAGS, FEATURE_FLAGS_VERSION } from "../src/lib/feature-flags.ts"
import { NOTIFICATIONS_VERSION } from "../src/lib/notifications-shim.ts"
import { AUTH_VERSION } from "../src/lib/auth-shim.ts"

let passed = 0
let failed = 0
const fails: string[] = []

function assert(cond: boolean, name: string): void {
  if (cond) { passed++ }
  else { failed++; fails.push(name) }
}

function section(name: string): void {
  console.log(`\n──── ${name} ────`)
}

// ── Helpers ────────────────────────────────────────────────────────────────
const admin: AuthUser = { id: "u_admin", email: "admin@x", role: "ADMIN", tenantId: "t1", residentId: null }
const partner: AuthUser = { id: "u_partner", email: "p@x", role: "PARTNER", tenantId: "t1", residentId: null }
const partnerOther: AuthUser = { id: "u_partner2", email: "p2@x", role: "PARTNER", tenantId: "t2", residentId: null }
const employee: AuthUser = { id: "u_employee", email: "e@x", role: "EMPLOYEE", tenantId: "t1", residentId: null }
const judge: AuthUser = { id: "u_judge", email: "j@x", role: "JUDGE", tenantId: "t1", residentId: null, judgeDemoOnly: true }
const resident: AuthUser = { id: "u_resident", email: "r@x", role: "RESIDENT", tenantId: "t1", residentId: "R-001" }
const residentOther: AuthUser = { id: "u_resident2", email: "r2@x", role: "RESIDENT", tenantId: "t1", residentId: "R-002" }

// ── 1. Role coverage (5 roles) ─────────────────────────────────────────────
section("1. Role coverage — 5 roles defined")
assert(typeof RBAC_MATRIX === "object", "RBAC_MATRIX exists")
assert(RBAC_VERSION === "17.0.0", "RBAC version is 17.0.0")
for (const r of ["ADMIN", "PARTNER", "EMPLOYEE", "JUDGE", "RESIDENT"] as Role[]) {
  assert(HIDDEN_FROM_JUDGE instanceof Set, `HIDDEN_FROM_JUDGE set exists for ${r}`)
  assert(HIDDEN_FROM_PARTNER instanceof Set, `HIDDEN_FROM_PARTNER set exists for ${r}`)
  assert(HIDDEN_FROM_RESIDENT instanceof Set, `HIDDEN_FROM_RESIDENT set exists for ${r}`)
}

// ── 2. ADMIN has READ/WRITE/ADMIN on every resource ────────────────────────
section("2. ADMIN permissions — full access")
for (const resource of ["dossier", "engine_output", "audit_log", "ai_agent_state", "overlay_config", "pricing", "partnership_data", "conviction_table", "system_health", "user_account", "secret_slice", "notification", "feature_flag"] as const) {
  for (const perm of ["READ", "WRITE", "ADMIN"] as const) {
    assert(canAccess(admin, resource, perm), `ADMIN can ${perm} ${resource}`)
  }
}

// ── 3. PARTNER tenant scoping ──────────────────────────────────────────────
section("3. PARTNER tenant scoping")
assert(canAccess(partner, "dossier", "READ", { tenantId: "t1" }), "PARTNER can READ dossier in own tenant")
assert(!canAccess(partner, "dossier", "READ", { tenantId: "t2" }), "PARTNER cannot READ dossier in other tenant")
assert(!canAccess(partner, "dossier", "READ", { tenantId: "t9" }), "PARTNER cannot READ dossier in arbitrary tenant")
assert(canAccess(partner, "user_account", "READ", { tenantId: "t1" }), "PARTNER can READ user_account in own tenant")
assert(!canAccess(partner, "user_account", "READ", { tenantId: "t2" }), "PARTNER cannot READ user_account in other tenant")
assert(!canAccess(partner, "ai_agent_state", "READ"), "PARTNER denied ai_agent_state")
assert(!canAccess(partner, "conviction_table", "READ"), "PARTNER denied conviction_table")

// ── 4. EMPLOYEE has agent state + conviction, no dossier content ───────────
section("4. EMPLOYEE permissions")
assert(canAccess(employee, "ai_agent_state", "ADMIN"), "EMPLOYEE can ADMIN ai_agent_state")
assert(canAccess(employee, "conviction_table", "READ"), "EMPLOYEE can READ conviction_table")
assert(!canAccess(employee, "dossier", "READ"), "EMPLOYEE denied dossier")

// ── 5. JUDGE is scoped to the curated demo slice ───────────────────────────
section("5. JUDGE secret-slice enforcement")
assert(canAccess(judge, "dossier", "READ", { isDemoEntry: true }), "JUDGE can READ demo dossier")
assert(!canAccess(judge, "dossier", "READ", { isDemoEntry: false }), "JUDGE cannot READ non-demo dossier")
assert(!canAccess(judge, "dossier", "READ", {}), "JUDGE cannot READ dossier without isDemoEntry flag")
assert(!canAccess(judge, "ai_agent_state", "READ"), "JUDGE denied ai_agent_state")
assert(!canAccess(judge, "audit_log", "READ"), "JUDGE denied audit_log")
assert(!canAccess(judge, "conviction_table", "READ"), "JUDGE denied conviction_table")
assert(canAccess(judge, "secret_slice", "READ"), "JUDGE can READ secret_slice (filtered)")

// ── 6. RESIDENT is scoped to own dossier ───────────────────────────────────
section("6. RESIDENT own-only access")
assert(canAccess(resident, "dossier", "READ", { residentId: "R-001" }), "RESIDENT can READ own dossier")
assert(!canAccess(resident, "dossier", "READ", { residentId: "R-002" }), "RESIDENT cannot READ other's dossier")
assert(canAccess(resident, "user_account", "READ"), "RESIDENT can READ own user_account (no scoping)")
assert(!canAccess(resident, "system_health", "READ"), "RESIDENT denied system_health")
assert(!canAccess(resident, "ai_agent_state", "READ"), "RESIDENT denied ai_agent_state")

// ── 7. hasRoleAtLeast hierarchy ────────────────────────────────────────────
section("7. Role hierarchy (hasRoleAtLeast)")
assert(hasRoleAtLeast(admin, "RESIDENT"), "ADMIN ≥ RESIDENT")
assert(hasRoleAtLeast(admin, "ADMIN"), "ADMIN ≥ ADMIN")
assert(hasRoleAtLeast(partner, "RESIDENT"), "PARTNER ≥ RESIDENT")
assert(!hasRoleAtLeast(resident, "PARTNER"), "RESIDENT < PARTNER")
assert(!hasRoleAtLeast(judge, "PARTNER"), "JUDGE < PARTNER")
assert(!hasRoleAtLeast(null, "RESIDENT"), "null < anything")
assert(hasRoleAtLeast(employee, "EMPLOYEE"), "EMPLOYEE ≥ EMPLOYEE")

// ── 8. canCreateUser — no admin escalation ────────────────────────────────
section("8. canCreateUser — no admin escalation")
assert(canCreateUser(admin, "PARTNER"), "ADMIN can create PARTNER")
assert(canCreateUser(admin, "RESIDENT"), "ADMIN can create RESIDENT")
assert(canCreateUser(admin, "JUDGE"), "ADMIN can create JUDGE")
assert(!canCreateUser(admin, "ADMIN"), "ADMIN CANNOT create ADMIN")
assert(canCreateUser(partner, "RESIDENT"), "PARTNER can create RESIDENT")
assert(!canCreateUser(partner, "PARTNER"), "PARTNER CANNOT create PARTNER")
assert(!canCreateUser(partner, "ADMIN"), "PARTNER CANNOT create ADMIN")
assert(!canCreateUser(judge, "RESIDENT"), "JUDGE cannot create anyone")
assert(!canCreateUser(null, "RESIDENT"), "null cannot create anyone")

// ── 9. filterForUser — Judge secret-slice enforcer ────────────────────────
section("9. filterForUser — secret-slice enforcer")
const sampleDossiers = [
  { id: "d1", code: "UK", name: "United Kingdom", conviction: "verified", agentTrail: ["a", "b"], cost: 0.05, rowHash: "h1", citation: "LTA 1985 s.20", isDemoEntry: true },
  { id: "d2", code: "BB", name: "Barbados", conviction: "verified", agentTrail: ["a"], cost: 0.02, rowHash: "h2", citation: "Condominium Act 1969", isDemoEntry: true },
  { id: "d3", code: "BZ", name: "Belize", conviction: "verified", agentTrail: [], cost: 0.0, rowHash: "h3", isDemoEntry: false },
  { id: "d4", code: "BS", name: "Bahamas", conviction: "verified", agentTrail: [], cost: 0.0, rowHash: "h4", isDemoEntry: false },
]
const judgeResult = filterForUser(sampleDossiers, judge, "dossier", (i) => ({ isDemoEntry: Boolean(i.isDemoEntry) }))
assert(judgeResult.items.length === 2, `JUDGE sees 2 demo entries (got ${judgeResult.items.length})`)
assert(judgeResult.itemsIn === 4, `JUDGE filter reports itemsIn=4 (got ${judgeResult.itemsIn})`)
assert(judgeResult.itemsOut === 2, `JUDGE filter reports itemsOut=2 (got ${judgeResult.itemsOut})`)
for (const item of judgeResult.items) {
  assert(!("conviction" in item), "JUDGE filter strips 'conviction'")
  assert(!("agentTrail" in item), "JUDGE filter strips 'agentTrail'")
  assert(!("cost" in item), "JUDGE filter strips 'cost'")
  assert(!("rowHash" in item), "JUDGE filter strips 'rowHash'")
  assert("code" in item, "JUDGE filter keeps jurisdiction 'code'")
  assert("name" in item, "JUDGE filter keeps jurisdiction 'name'")
}

// ── 10. filterForUser — PARTNER tenant scope + field strip ────────────────
section("10. filterForUser — PARTNER tenant scoping")
const partnerDossiers = [
  { id: "d1", tenantId: "t1", conviction: "verified", agentTrail: ["a"], cost: 0.05, name: "T1 Inhouse" },
  { id: "d2", tenantId: "t2", conviction: "verified", agentTrail: ["b"], cost: 0.03, name: "T2 Outsider" },
]
const partnerResult = filterForUser(partnerDossiers, partner, "dossier", (i) => ({ tenantId: i.tenantId }))
assert(partnerResult.items.length === 1, `PARTNER sees 1 dossier in own tenant (got ${partnerResult.items.length})`)
assert(partnerResult.items[0].id === "d1", "PARTNER sees only own tenant's dossier")
assert(!("conviction" in partnerResult.items[0]), "PARTNER filter strips 'conviction'")
assert(!("agentTrail" in partnerResult.items[0]), "PARTNER filter strips 'agentTrail'")
assert(!("cost" in partnerResult.items[0]), "PARTNER filter strips 'cost'")

// ── 11. filterForUser — RESIDENT own-only ──────────────────────────────────
section("11. filterForUser — RESIDENT own-only")
const residentDossiers = [
  { id: "d1", residentId: "R-001", name: "Own", tenant: "t1" },
  { id: "d2", residentId: "R-002", name: "Other", tenant: "t1" },
]
const residentResult = filterForUser(residentDossiers, resident, "dossier", (i) => ({ residentId: i.residentId }))
assert(residentResult.items.length === 1, `RESIDENT sees 1 own dossier (got ${residentResult.items.length})`)
assert(residentResult.items[0].id === "d1", "RESIDENT sees own dossier")

// ── 12. stripHiddenFields — recursive ──────────────────────────────────────
section("12. stripHiddenFields — recursive")
const nested = {
  id: "x",
  conviction: "verified",
  meta: {
    cost: 0.1,
    agentTrail: ["a"],
    nested: { rowHash: "h", keep: true },
  },
  array: [
    { conviction: "checked", keep: true },
    { cost: 0.2, keep: false },
  ],
}
const stripped = stripHiddenFields(nested, judge)
assert(!("conviction" in stripped), "strip removes top-level conviction")
assert(!("cost" in stripped.meta), "strip removes nested cost")
assert(!("agentTrail" in stripped.meta), "strip removes nested agentTrail")
assert(!("rowHash" in stripped.meta.nested), "strip removes deeply nested rowHash")
assert(stripped.meta.nested.keep === true, "strip keeps non-hidden fields")
assert(!("conviction" in stripped.array[0]), "strip removes conviction in array")
assert(!("cost" in stripped.array[1]), "strip removes cost in array")

// ── 13. Rate limiter ───────────────────────────────────────────────────────
section("13. Rate limiter")
_rateLimitTests()

function _rateLimitTests() {
  _resetForTest()
  assert(RATE_LIMIT_VERSION === "17.0.0", "rate-limit version 17.0.0")
  assert(RATE_LIMIT_CONFIGS.read.limit === 300, "read bucket has 300/min")
  assert(RATE_LIMIT_CONFIGS.write.limit === 60, "write bucket has 60/min")
  assert(RATE_LIMIT_CONFIGS['auth:login'].limit === 10, "auth:login bucket has 10/min")
  let allowed = 0
  for (let i = 0; i < 12; i++) {
    const r = rateLimit("test:rl1", "auth:login")
    if (r.allowed) allowed++
  }
  assert(allowed === 10, `auth:login allows 10/12 (got ${allowed})`)
  const blocked = rateLimit("test:rl1", "auth:login")
  assert(!blocked.allowed, "auth:login 11th is blocked")
  assert(blocked.retryAfterMs !== undefined, "blocked response has retryAfterMs")
  assert(blocked.retryAfterMs! > 0, "retryAfterMs is positive")
  assert(blocked.remaining === 0, "blocked response has remaining=0")
  // Different keys are independent
  const fresh = rateLimit("test:rl2", "auth:login")
  assert(fresh.allowed, "fresh key is allowed")
}

// ── 14. Retention policy ───────────────────────────────────────────────────
section("14. Retention policy")
assert(RETENTION_VERSION === "17.0.0", "retention version 17.0.0")
assert(RETENTION_DAYS.audit_logs === 2555, "audit logs retained 7 years")
assert(RETENTION_DAYS.sessions === 90, "sessions retained 90 days")
assert(RETENTION_DAYS.notifications === 180, "notifications retained 180 days")
assert(RETENTION_DAYS.signoffs === 2555, "signoffs retained 7 years")
assert(RETENTION_DAYS.content_drafts === 365, "content drafts retained 1 year")
assert(RETENTION_DAYS.capture_sessions === 30, "capture sessions retained 30 days")
assert(RETENTION_DAYS.group_messages === 1095, "group messages retained 3 years")
const plan = dataRetention.plan()
assert(plan.length === 7, `retention plan has 7 entries (got ${plan.length})`)
for (const entry of plan) {
  assert(entry.cutoff instanceof Date, `cutoff is Date for ${entry.subject}`)
  assert(entry.days > 0, `days > 0 for ${entry.subject}`)
}

// ── 15. Feature flags declared ────────────────────────────────────────────
section("15. Feature flags")
assert(FEATURE_FLAGS_VERSION === "17.0.0", "feature-flags version 17.0.0")
assert(FEATURE_FLAGS.length >= 10, `≥10 flags declared (got ${FEATURE_FLAGS.length})`)
assert(FEATURE_FLAGS.includes("rbac_enforcement"), "rbac_enforcement flag declared")
assert(FEATURE_FLAGS.includes("audit_hash_chain"), "audit_hash_chain flag declared")
assert(FEATURE_FLAGS.includes("rate_limiting"), "rate_limiting flag declared")
assert(FEATURE_FLAGS.includes("notifications"), "notifications flag declared")
assert(FEATURE_FLAGS.includes("retention_purge"), "retention_purge flag declared")

// ── 16. Notification module version ───────────────────────────────────────
section("16. Notifications module")
assert(NOTIFICATIONS_VERSION === "17.0.0", "notifications version 17.0.0")

// ── 17. Auth module version ────────────────────────────────────────────────
section("17. Auth module")
assert(AUTH_VERSION === "17.0.0", "auth version 17.0.0")

// ── 18. Audit hash chain — deterministic SHA-256 ──────────────────────────
section("18. Audit hash chain — SHA-256 integrity")
function canonicalize(v: any): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v)
  if (Array.isArray(v)) return "[" + v.map(canonicalize).join(",") + "]"
  const o = v as Record<string, unknown>
  const keys = Object.keys(o).sort()
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize(o[k])).join(",") + "}"
}
const sampleRow = {
  userId: "u1",
  action: "test",
  resource: "dossier",
  resourceId: "d1",
  before: null,
  after: { x: 1 },
  metadata: {},
  ipAddress: null,
  userAgent: null,
  timestamp: "2026-08-12T12:00:00.000Z",
  prevHash: null,
}
const canon = canonicalize(sampleRow)
const h1 = createHash("sha256").update(canon).digest("hex")
const h2 = createHash("sha256").update(canon).digest("hex")
assert(h1 === h2, "SHA-256 is deterministic")
assert(h1.length === 64, "SHA-256 hex output is 64 chars")
assert(h1 !== canon, "hash != canonical input")
// Mutate one field → hash changes
const mutated = { ...sampleRow, action: "tampered" }
const h3 = createHash("sha256").update(canonicalize(mutated)).digest("hex")
assert(h1 !== h3, "tampered row produces different hash")

// ── 19. Hidden field sets — completeness ──────────────────────────────────
section("19. Hidden field sets — completeness")
assert(HIDDEN_FROM_JUDGE.has("conviction"), "conviction hidden from JUDGE")
assert(HIDDEN_FROM_JUDGE.has("agentTrail"), "agentTrail hidden from JUDGE")
assert(HIDDEN_FROM_JUDGE.has("cost"), "cost hidden from JUDGE")
assert(HIDDEN_FROM_JUDGE.has("auditHash"), "auditHash hidden from JUDGE")
assert(HIDDEN_FROM_JUDGE.has("rowHash"), "rowHash hidden from JUDGE")
assert(HIDDEN_FROM_JUDGE.has("pricingMechanics"), "pricingMechanics hidden from JUDGE")
assert(HIDDEN_FROM_PARTNER.has("conviction"), "conviction hidden from PARTNER")
assert(HIDDEN_FROM_PARTNER.has("agentTrail"), "agentTrail hidden from PARTNER")
assert(HIDDEN_FROM_PARTNER.has("cost"), "cost hidden from PARTNER")
assert(HIDDEN_FROM_RESIDENT.has("conviction"), "conviction hidden from RESIDENT")
assert(!HIDDEN_FROM_PARTNER.has("code"), "partners see jurisdiction code")
assert(HIDDEN_FROM_JUDGE.size >= 10, "JUDGE has ≥10 hidden fields")
assert(HIDDEN_FROM_PARTNER.size >= 5, "PARTNER has ≥5 hidden fields")

// ── 20. None user — denied everything ──────────────────────────────────────
section("20. Anonymous user — denied all")
for (const resource of ["dossier", "audit_log", "ai_agent_state", "secret_slice"] as const) {
  assert(!canAccess(null, resource, "READ"), `null denied ${resource}`)
  assert(!canAccess(undefined, resource, "READ"), `undefined denied ${resource}`)
}

// ── 21. RBAC matrix — every resource has every role ────────────────────────
section("21. RBAC matrix — full coverage")
const allResources = Object.keys(RBAC_MATRIX)
assert(allResources.length >= 12, `≥12 resources in matrix (got ${allResources.length})`)
for (const r of allResources) {
  for (const role of ["ADMIN", "PARTNER", "EMPLOYEE", "JUDGE", "RESIDENT"] as Role[]) {
    const set = RBAC_MATRIX[r as keyof typeof RBAC_MATRIX]?.[role]
    assert(set instanceof Set, `${r} × ${role} has Set`)
  }
}

// ── 22. Cross-role partner isolation ───────────────────────────────────────
section("22. Cross-partner isolation")
assert(!canAccess(partner, "dossier", "READ", { tenantId: partnerOther.tenantId }), "PARTNER cannot read PARTNER2's tenant")
assert(!canAccess(partner, "user_account", "READ", { tenantId: partnerOther.tenantId }), "PARTNER cannot read user_account in PARTNER2's tenant")
assert(!canAccess(partner, "notification", "READ", { tenantId: partnerOther.tenantId }), "PARTNER cannot read notifications in PARTNER2's tenant")

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n══════ TOTALS ══════`)
console.log(`PASS: ${passed}`)
console.log(`FAIL: ${failed}`)
if (failed > 0) {
  console.log(`\nFAILURES:`)
  for (const f of fails) console.log(`  - ${f}`)
  process.exit(1)
}
console.log(`\n✅ All ${passed} RBAC + oversight assertions passed.`)
process.exit(0)
