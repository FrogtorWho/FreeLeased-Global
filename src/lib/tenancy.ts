// src/lib/tenancy.ts — Multi-tenant resolver middleware.
//
// Why this exists:
//   Phase 12 G5. Every domain model carries `tenantId`. This module
//   resolves which tenant a request belongs to (via header, slug,
//   or default) and provides the helpers that every Prisma query
//   MUST use to avoid cross-tenant data leaks.
//
// How it's used:
//   import { resolveTenantId, withTenant, requireTenant } from "@/lib/tenancy";
//   const tid = resolveTenantId(req); // → "tenant_xxx"
//   const rows = await prisma.signoff.findMany(withTenant(prisma, tid));
//
// Cross-references:
//   - prisma/schema.prisma — Tenant model + tenantId columns.
//   - scripts/migrate-multi-tenant.ts — backfill + default tenant.
//   - scripts/test-multi-tenant.ts — 20+ assertions.

/** Default tenant id used for single-tenant installs + backwards compat. */
export const DEFAULT_TENANT_ID = "tenant_default";
export const DEFAULT_TENANT_SLUG = "default";
export const DEFAULT_TENANT_NAME = "FreeLeased (default)";

/** Slug regex: lowercase letters, digits, hyphens. */
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/;

/** Plan enum (mirrors Tenant.plan in prisma/schema.prisma). */
export type TenantPlan = "free" | "pro" | "institution";
export const TENANT_PLANS: readonly TenantPlan[] = ["free", "pro", "institution"];

/** Tenant status enum. */
export type TenantStatus = "active" | "suspended" | "deleted";
export const TENANT_STATUSES: readonly TenantStatus[] = ["active", "suspended", "deleted"];

/** In-memory tenant registry (slugs → tenantIds). Populated by the
 *  migration script; refreshed on each request via the lightweight
 *  `tenants` table when the DB is available. */
export interface TenantRecord {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  contactEmail?: string;
  dpaSignedAt?: string;
  createdAt: string;
}

/** Validate a slug. */
export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** Generate a slug from a name (idempotent + URL-safe). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "tenant";
}

/** Resolve the tenant for an incoming request, with a defensive default.
 *
 *  Resolution order:
 *    1. `x-freeleased-tenant-id` header → tenantId directly
 *    2. `x-freeleased-slug` header → slug, then look up
 *    3. Subdomain (`<slug>.freeleased.app`) → slug, then look up
 *    4. Query string `?tenant=<slug>` → slug, then look up
 *    5. Default → `DEFAULT_TENANT_ID`
 *
 *  Returns `{ tenantId, slug, source }` so callers can log the path.
 */
export interface TenantResolution {
  tenantId: string;
  slug: string;
  source: "header-id" | "header-slug" | "subdomain" | "query" | "default";
}

export function resolveTenantId(input: {
  headers?: Record<string, string | undefined>;
  host?: string;
  url?: string;
  registry?: Map<string, TenantRecord>; // slug → record
}): TenantResolution {
  const headers = input.headers ?? {};
  const registry = input.registry ?? new Map();

  // 1. Explicit header wins
  const headerId = headers["x-freeleased-tenant-id"];
  if (headerId) {
    return { tenantId: headerId, slug: registry.get(headerId)?.slug ?? DEFAULT_TENANT_SLUG, source: "header-id" };
  }

  // 2. Slug header
  const headerSlug = headers["x-freeleased-slug"];
  if (headerSlug) {
    const rec = registry.get(headerSlug);
    if (rec) return { tenantId: rec.id, slug: headerSlug, source: "header-slug" };
  }

  // 3. Subdomain
  const host = input.host ?? "";
  const subMatch = host.match(/^([a-z0-9][a-z0-9-]{0,62})\.freeleased\.app$/);
  if (subMatch) {
    const subSlug = subMatch[1];
    const rec = registry.get(subSlug);
    if (rec) return { tenantId: rec.id, slug: subSlug, source: "subdomain" };
  }

  // 4. Query string
  const url = input.url ?? "";
  const qMatch = url.match(/[?&]tenant=([a-z0-9][a-z0-9-]{0,62})/);
  if (qMatch) {
    const qSlug = qMatch[1];
    const rec = registry.get(qSlug);
    if (rec) return { tenantId: rec.id, slug: qSlug, source: "query" };
  }

  // 5. Default
  return { tenantId: DEFAULT_TENANT_ID, slug: DEFAULT_TENANT_SLUG, source: "default" };
}

/** Helper: wrap a `where` clause with `tenantId`. Use on every Prisma
 *  query to ensure tenant isolation. */
export function withTenant<T extends Record<string, unknown>>(
  baseWhere: T,
  tenantId: string,
): T & { tenantId: string } {
  return { ...baseWhere, tenantId };
}

/** Helper: throw if no tenant context is provided. */
export function requireTenant(tenantId: string | undefined | null): string {
  if (!tenantId || tenantId === "") {
    throw new Error("TENANT_REQUIRED: every query must be scoped to a tenantId");
  }
  return tenantId;
}

/** Build a slug-based middleware that attaches `req.tenantId`. */
export function tenancyMiddleware(
  registry: Map<string, TenantRecord>,
) {
  return function attachTenant(req: {
    headers: Record<string, string | undefined>;
    host?: string;
    url?: string;
  }): TenantResolution {
    return resolveTenantId({
      headers: req.headers,
      host: req.host,
      url: req.url,
      registry,
    });
  };
}

/** Plan-based capability check. The Institution tier unlocks multi-tenant
 *  dashboards; Pro unlocks bulk audit; Free gets the single-lease flow. */
export function planAllows(plan: TenantPlan, capability: PlanCapability): boolean {
  const order: Record<TenantPlan, number> = { free: 0, pro: 1, institution: 2 };
  const required: Record<PlanCapability, TenantPlan> = {
    "single-lease-audit": "free",
    "unlimited-audits": "pro",
    "bulk-csv-upload": "pro",
    "api-access": "pro",
    "white-label-reports": "institution",
    "multi-tenant-isolation": "institution",
    "sla": "institution",
  };
  return order[plan] >= order[required[capability]];
}

export type PlanCapability =
  | "single-lease-audit"
  | "unlimited-audits"
  | "bulk-csv-upload"
  | "api-access"
  | "white-label-reports"
  | "multi-tenant-isolation"
  | "sla";

/** Lightweight audit log entry — every tenant-scoped query SHOULD emit one
 *  for the institution tier. The default tier aggregates at request-end. */
export interface TenantAuditEvent {
  tenantId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export function auditEvent(
  tenantId: string,
  action: string,
  resource: string,
  metadata?: Record<string, string | number | boolean>,
): TenantAuditEvent {
  return {
    tenantId,
    action,
    resource,
    timestamp: new Date().toISOString(),
    metadata,
  };
}

/** Tenancy module version. Bumped on every breaking schema change. */
export const TENANCY_VERSION = "1.0.0-phase12";