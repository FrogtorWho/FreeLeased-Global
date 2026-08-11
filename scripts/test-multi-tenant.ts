#!/usr/bin/env -S npx tsx
// scripts/test-multi-tenant.ts — Phase 12 G5 test suite.
//
// What this does:
//   20+ assertions covering:
//     • Slug validation (slugify, isValidSlug)
//     • Tenant resolution (header, slug, subdomain, query, default)
//     • withTenant + requireTenant helpers
//     • Plan capabilities (planAllows matrix)
//     • Audit event helper
//
// Usage:
//   $ npx tsx scripts/test-multi-tenant.ts

import {
  isValidSlug,
  slugify,
  resolveTenantId,
  withTenant,
  requireTenant,
  planAllows,
  auditEvent,
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_SLUG,
  TENANT_PLANS,
  type TenantRecord,
} from "../src/lib/tenancy.ts";

interface Assertion {
  id: string;
  description: string;
  passed: boolean;
  detail?: string;
}

const assertions: Assertion[] = [];
function assert(id: string, description: string, condition: boolean, detail?: string): void {
  assertions.push({ id, description, passed: condition, detail });
}

// ── 1. Slug validation (4 assertions) ──────────────────────────────────

assert("slug-valid-1", "isValidSlug accepts simple lowercase", isValidSlug("acme"));
assert("slug-valid-2", "isValidSlug accepts hyphenated", isValidSlug("acme-corp"));
assert("slug-valid-3", "isValidSlug rejects uppercase", !isValidSlug("Acme"));
assert("slug-valid-4", "isValidSlug rejects too short", !isValidSlug("a"));

// ── 2. slugify (4 assertions) ──────────────────────────────────────────

assert("slugify-1", "slugify lowercases", slugify("Acme Corp") === "acme-corp");
assert("slugify-2", "slugify strips diacritics", slugify("Café Olé") === "cafe-ole");
assert("slugify-3", "slugify trims leading/trailing hyphens", slugify("---foo---") === "foo");
assert("slugify-4", "slugify falls back to 'tenant' for empty", slugify("") === "tenant");

// ── 3. Tenant resolution (10 assertions across 5 sources) ─────────────

const registry = new Map<string, TenantRecord>([
  ["acme", { id: "tenant_acme", name: "Acme", slug: "acme", plan: "pro", status: "active", createdAt: "2026-08-11T00:00:00Z" }],
  ["london-ha", { id: "tenant_london_ha", name: "London HA", slug: "london-ha", plan: "institution", status: "active", createdAt: "2026-08-11T00:00:00Z" }],
]);

const r1 = resolveTenantId({ headers: { "x-freeleased-tenant-id": "tenant_acme" }, registry });
assert("res-1", "header-id wins", r1.tenantId === "tenant_acme" && r1.source === "header-id");

const r2 = resolveTenantId({ headers: { "x-freeleased-slug": "london-ha" }, registry });
assert("res-2", "header-slug resolves to tenantId", r2.tenantId === "tenant_london_ha" && r2.source === "header-slug");

const r3 = resolveTenantId({ host: "acme.freeleased.app", registry });
assert("res-3", "subdomain resolves", r3.tenantId === "tenant_acme" && r3.source === "subdomain");

const r4 = resolveTenantId({ url: "/api/x?tenant=acme", registry });
assert("res-4", "query string resolves", r4.tenantId === "tenant_acme" && r4.source === "query");

const r5 = resolveTenantId({ registry });
assert("res-5", "default tenant when nothing matches", r5.tenantId === DEFAULT_TENANT_ID && r5.source === "default");

const r6 = resolveTenantId({ headers: { "x-freeleased-tenant-id": "" }, registry });
assert("res-6", "empty header falls through to default", r6.tenantId === DEFAULT_TENANT_ID);

const r7 = resolveTenantId({ headers: { "x-freeleased-slug": "unknown-slug" }, registry });
assert("res-7", "unknown slug falls through to default", r7.tenantId === DEFAULT_TENANT_ID);

const r8 = resolveTenantId({ host: "unknown.freeleased.app", registry });
assert("res-8", "unknown subdomain falls through to default", r8.tenantId === DEFAULT_TENANT_ID);

const r9 = resolveTenantId({ url: "/api/x?tenant=unknown", registry });
assert("res-9", "unknown query tenant falls through to default", r9.tenantId === DEFAULT_TENANT_ID);

const r10 = resolveTenantId({ headers: { "x-freeleased-tenant-id": "tenant_acme" }, host: "acme.freeleased.app", registry });
assert("res-10", "explicit header-id beats subdomain", r10.source === "header-id");

// ── 4. withTenant + requireTenant (4 assertions) ──────────────────────

const w1 = withTenant({ status: "pending" }, "tenant_xxx");
assert("with-1", "withTenant merges tenantId into where clause", w1.tenantId === "tenant_xxx" && w1.status === "pending");

const w2 = withTenant({}, "tenant_yyy");
assert("with-2", "withTenant works on empty object", w2.tenantId === "tenant_yyy");

let threw = false;
try { requireTenant(""); } catch { threw = true; }
assert("req-1", "requireTenant throws on empty string", threw);

assert("req-2", "requireTenant returns id when provided", requireTenant("tenant_zzz") === "tenant_zzz");

// ── 5. Plan capabilities (6 assertions) ───────────────────────────────

assert("plan-1", "free allows single-lease-audit", planAllows("free", "single-lease-audit"));
assert("plan-2", "free denies unlimited-audits", !planAllows("free", "unlimited-audits"));
assert("plan-3", "pro allows unlimited-audits", planAllows("pro", "unlimited-audits"));
assert("plan-4", "pro denies white-label-reports", !planAllows("pro", "white-label-reports"));
assert("plan-5", "institution allows white-label-reports", planAllows("institution", "white-label-reports"));
assert("plan-6", "institution allows sla", planAllows("institution", "sla"));

// ── 6. Audit event helper (3 assertions) ─────────────────────────────

const ev = auditEvent("tenant_a", "create", "signoff", { rowHash: "abc123" });
assert("audit-1", "auditEvent has tenantId", ev.tenantId === "tenant_a");
assert("audit-2", "auditEvent has timestamp", typeof ev.timestamp === "string" && ev.timestamp.includes("T"));
assert("audit-3", "auditEvent preserves metadata", ev.metadata?.rowHash === "abc123");

// ── 7. Constants (2 assertions) ──────────────────────────────────────

assert("const-1", "DEFAULT_TENANT_ID is stable", DEFAULT_TENANT_ID === "tenant_default");
assert("const-2", "TENANT_PLANS has 3 plans", TENANT_PLANS.length === 3);

// ── Output ─────────────────────────────────────────────────────────────

const passed = assertions.filter((a) => a.passed).length;
const failed = assertions.length - passed;

console.log("\n=== Multi-tenant test results ===");
for (const a of assertions) {
  const icon = a.passed ? "✓" : "✗";
  console.log(`${icon} ${a.id}  ${a.description}${a.detail ? `  — ${a.detail}` : ""}`);
}
console.log(`\n${passed} / ${assertions.length} assertions passed`);
if (failed > 0) process.exit(1);