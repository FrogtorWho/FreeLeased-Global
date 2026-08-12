---
title: "RBAC + Access Governance Design"
date: 2026-08-12
author: "Shogo ⚡"
phase: 17
status: "Active — implemented in src/lib/auth.ts + src/lib/rbac.ts"
buildathon: "Future Caribbean — FreeLeased"
---

# RBAC + Access Governance Design

> **The question Sam asked:** "have you built in the permissions based access?"
> **Honest answer (before this phase):** No. Roles were implicit (any visitor
> could read any demo dossier; any partner could see any tenant's data; the
> internal audit trail was world-readable). This document is the design and
> the implementation that fixes it.

---

## 1. Why this matters

FreeLeased handles three classes of information that must NOT be co-mingled:

1. **Resident PII** — lease text, flat numbers, service charges.
   Covered by the Redaction Protocol, but layered protection requires
   role-based access at the application level.
2. **Internal conviction state** — how confident the system is in each
   pattern, how the consensus gate ruled, what the per-agent cost
   attribution says. This is the *learning* of the system. Leaking it
   would let competitors clone the engine and let judges reverse-engineer
   the "secret sauce" that justifies the moat.
3. **Demo / judge-facing slice** — a curated, scrubbed subset designed to
   let a 100-judge panel evaluate the product without exposing the
   internals.

Without RBAC, all three are visible to all visitors. That is not a
demonstration of "sovereign AI" — it is a data-protection incident
waiting to happen.

## 2. Roles (5)

| # | Role | Who | Scope | Power |
|---|------|-----|-------|-------|
| 1 | **Administrator** | Sam | Global | Full access: user mgmt, billing, all dossiers, override verdicts, audit logs, AI-agent army control, overlay config |
| 2 | **Partner** | Org-scoped (e.g. Export Barbados, BIDC) | Own tenant only | See only their org's dossiers; submit new dossiers for their clients; receive notifications; engine output **without** internal conviction metadata |
| 3 | **Employee** | The AI-army monitor (system role, not human) | Engine internals | See AI-employee activity, costs, accuracy; can pause/resume agents; no dossier content access unless scoped |
| 4 | **Judge** | Read-only, scoped to "demonstration slice" | Curated | Sees 5-jurisdiction demo, 100-judge scorecard, public PDF; cannot see internals, audit trails, conviction tables, roadmap |
| 5 | **Resident** | Free tier | Own dossier only | Sees only their own dossier; can run Lease Reader; cannot see other residents' data |

**Why "Employee" is a system role:** the AI-agent army has cumulative
cost, accuracy, and override trajectories that matter for *operating*
the system. They are not human employees, but they need a role to
attach audit logs and permission checks to. We use the same RBAC
machinery for them so the audit trail is consistent.

## 3. Permission Matrix

Legend: `R` = READ, `W` = WRITE, `A` = ADMIN, `—` = HIDDEN

| Resource | ADMIN | PARTNER | EMPLOYEE | JUDGE | RESIDENT |
|----------|:-----:|:-------:|:--------:|:-----:|:--------:|
| **dossier** (own) | R/W/A | R/W (org) | — | R (curated only) | R/W (own) |
| **dossier** (others) | R/W/A | R (org only) | — | — | — |
| **engine_output** (verdict + conviction + reasoning) | R | R (no conviction) | R | R (verdict only) | R (own only) |
| **audit_log** | R | R (own actions) | R | — | R (own actions) |
| **ai_agent_state** | R/W/A | — | R/W/A | — | — |
| **overlay_config** | R/W/A | R (own tenant) | — | — | — |
| **pricing** | R/W/A | R | — | R (public tier labels only) | R |
| **partnership_data** (MoUs, pilots) | R/W/A | R (own) | — | R (public list only) | — |
| **conviction_table** | R | — | R | — | — |
| **system_health** | R | R (own tenant) | R | — | — |
| **user_account** | R/W/A (except admin creation) | R/W (own tenant) | — | — | R (own) |
| **secret_slice** (judge filter) | R | — | — | R (filtered) | — |

### 3.1 Resource × Permission detail

#### `dossier`
- **ADMIN**: full read/write/admin on every tenant's dossiers.
- **PARTNER**: read/write on dossiers belonging to their `tenantId` only.
- **EMPLOYEE**: no dossier access (the agent army does its own work; it
  does not need to read resident content).
- **JUDGE**: read on the curated 5-jurisdiction demo set, which is a
  separate, hand-picked subset of the demonstration database.
- **RESIDENT**: read/write on their own dossier, identified by
  `dossier.residentId === user.residentId`.

#### `engine_output`
- **ADMIN**: full output including `conviction`, `agentTrail`, `cost`.
- **PARTNER**: verdict + plain reasoning. **Conviction metadata is stripped.**
- **EMPLOYEE**: full output (rolls into the conviction table).
- **JUDGE**: verdict + plain English only. Source citations are kept,
  confidence is hidden unless it is the final presentation number.
- **RESIDENT**: own dossier only.

#### `audit_log`
- **ADMIN**: all entries.
- **PARTNER**: entries where the `resource.tenantId` matches their tenant.
- **EMPLOYEE**: all entries (operational observability).
- **JUDGE**: none.
- **RESIDENT**: only entries where `userId === self`.

#### `ai_agent_state`
- **ADMIN**: read/write/admin (can pause/resume/configure).
- **EMPLOYEE**: read/write/admin (self-management).
- Others: hidden.

#### `overlay_config`
- **ADMIN**: full.
- **PARTNER**: read own tenant's overlay config; cannot modify.
- Others: hidden.

#### `pricing`
- **ADMIN**: read/write.
- **PARTNER**: read.
- **JUDGE**: read the public tier labels only (Free / Pro / Institutional).
- **RESIDENT**: read.
- **EMPLOYEE**: hidden.

#### `partnership_data`
- **ADMIN**: full.
- **PARTNER**: read own.
- **JUDGE**: read the public list of jurisdiction names only — no
  MoU content, no contact details, no pilot logs.

#### `conviction_table`
The learning state. Restricted to ADMIN + EMPLOYEE (the system itself).
This is the closest thing to a "trade secret" in the FreeLeased
architecture. It is the substance of the moat.

#### `system_health`
- **ADMIN**: full.
- **PARTNER**: own tenant's slice (errors affecting them).
- **EMPLOYEE**: full.
- **JUDGE/RESIDENT**: hidden.

#### `user_account`
- **ADMIN**: read/write/create on all standard accounts. **Cannot
  create another ADMIN** except out-of-band (the seed script is the
  only path; there is no `POST /api/admin/users?role=ADMIN`).
- **PARTNER**: read/write on users in their tenant. Can create
  RESIDENT accounts under their tenant; cannot create PARTNER or
  ADMIN.
- **RESIDENT**: read own only (can update name/password).

#### `secret_slice`
A meta-resource: "what does the JUDGE see?" Answer: a curated,
filtered subset. The `filterForUser` function (in `src/lib/rbac.ts`)
implements this. It is called from every endpoint that touches
dossier, engine output, or partnership data.

## 4. User provisioning

| Action | Who can do it | How |
|--------|---------------|-----|
| Create ADMIN | Nobody (out-of-band) | `scripts/seed-admin.ts` writes directly to the DB; never via API |
| Create PARTNER | ADMIN only | `POST /api/admin/users` with `role: PARTNER` |
| Create RESIDENT | PARTNER (their org) or ADMIN | `POST /api/partner/users` or `POST /api/admin/users` |
| Create JUDGE | ADMIN only | `POST /api/admin/users` with `role: JUDGE`; the user record is flagged with `judge_demo_only: true` |
| Create EMPLOYEE | System at boot | Background script; never via API |

## 5. Session model

- Sessions are server-side, 24-hour expiry, refresh-on-use.
- `Session` model: `id`, `userId`, `expiresAt`, `ipAddress`, `userAgent`.
- `AuditLog` is a separate, immutable, hash-chained ledger (see ROUND 3
  on audit trail immutability).
- No JWTs. Local-first, no third-party auth dependency.

## 6. The Judge filter — `filterForUser`

The critical function:

```typescript
function filterForUser<T>(items: T[], user: User, resource: Resource): T[] {
  return items
    .filter((item) => canAccess(user, resource, 'READ'))
    .map((item) => stripHiddenFields(item, user, resource))
}
```

Where `stripHiddenFields` for JUDGE on `dossier` removes:
- `conviction`
- `agentTrail`
- `cost`
- `perAgentCostAttribution`
- `hitlOverrideHistory`
- `unverifiedClaims`

And keeps:
- `residentId` (pseudonym)
- `jurisdiction`
- `verdict` (human-readable)
- `evidenceClass`
- `citedSources` (URL list)
- `demoFlag` (boolean — these are the curated entries)

This is the **secret slice enforcer**. It is the single function that
guarantees the Judge does not leak internals.

## 7. Endpoint authorization

Every route in `custom-routes.ts` is now wrapped in `requireRole` /
`requirePermission`. The route tree:

```
/api/public/*        — no auth required (demo endpoints, marketing)
/api/resident/*      — RESIDENT or higher
/api/partner/*       — PARTNER, ADMIN
/api/judge/*         — JUDGE, ADMIN
/api/admin/*         — ADMIN only
/api/internal/*      — EMPLOYEE, ADMIN (agents, observability)
```

## 8. MCP tool authorization

The MCP server (`src/mcp/server.ts`) exposes five tools. Each is now
wrapped in `requireRole`:

| Tool | Required role |
|------|---------------|
| `read_dossier` | RESIDENT (own) / PARTNER (org) / ADMIN |
| `list_jurisdictions` | public — no auth |
| `get_legal_rights` | RESIDENT or higher |
| `analyse_lease` | RESIDENT or higher |
| `search_statutes` | RESIDENT or higher |

Every tool call is logged to `AuditLog` with `action: "mcp_tool_call"`,
`resource: "<tool_name>"`, `userId`, `timestamp`, `ipAddress`.

## 9. Threat model — what RBAC prevents

| Threat | Without RBAC | With RBAC |
|--------|--------------|----------|
| Judge scrapes conviction table | Trivial | Forbidden at API layer, audit log catches it |
| Partner reads another partner's dossiers | Trivial | `tenantId` check at every query |
| Resident sees other residents' data | Trivial | `residentId` filter at every endpoint |
| Employee agent runs amok | Hard to detect | Pause/resume control; audit log |
| Pricing leak via /api/pricing | Trivial | Judge filter strips tier mechanics |
| Insider creates fake ADMIN | Trivial | Seed-only path; no create-ADMIN endpoint |

## 10. Out of scope (deliberately)

- **OAuth / SSO**: not required for pilot; we are local-first. See
  `docs/LOCAL-EDGE.md` for the deployment story.
- **Anonymous read of public marketing data**: lives at `/api/public/*`
  and is intentionally open.
- **Audit log retention controls**: covered separately in
  `docs/RETENTION.md` (GDPR Art. 17).

## 11. Cross-references

- [`judge-secret-slice.md`](judge-secret-slice.md) — the curated slice
  judges see, and what they don't.
- [`docs/INCIDENT-RESPONSE.md`](../../docs/INCIDENT-RESPONSE.md) —
  what to do when an RBAC check fails.
- [`docs/ALGORITHMIC-TRANSPARENCY.md`](../../docs/ALGORITHMIC-TRANSPARENCY.md) —
  the public-facing transparency note (CoC §5).
- [`scripts/test-rbac.ts`](../../scripts/test-rbac.ts) — the 30+ assertion
  test suite that enforces this matrix.

---

**Status:** Designed + Implemented in Phase 17.
**Reversibility:** full — every check is centralised in `src/lib/rbac.ts`;
rollback by clearing the `requireRole` wrappers.
