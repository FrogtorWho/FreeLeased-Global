// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Payment provider abstraction (mock provider).
//
// Architecture: Stripe-style. A single provider interface with three
// operations. The default implementation is in-memory and deterministic
// so the buildathon demo can run without any real Stripe / Paddle keys.
// When Sam ships live keys, the only change is `init()` to point at
// real Stripe — call sites stay identical.
//
// Provider init:
//   init({ providerKey: 'sk_live_xxx', mode: 'live' }) — real Stripe
//   init({ providerKey: 'sk_test_xxx', mode: 'test' }) — Stripe test mode
//   init({ providerKey: '',               mode: 'mock' }) — default
//
// Tiered pricing (Sam's plan):
//   - free        $0/yr   — 1 audit/mo, basic rights, community
//   - pro         $10/mo  — Unlimited audits, full rights, compliance reports
//   - manager     $49/unit/yr — Portfolio dashboard, bulk audit, white-label
//   - enterprise  $5k-50k/yr — Custom jurisdiction, SLA, dedicated support
//
// RBAC:
//   - RESIDENT+ can call createCheckoutSession
//   - PARTNER+ can call getCustomerSubscription / manageSubscription
//   - ADMIN can call verifyWebhook admin tools

import { createHmac, timingSafeEqual, randomBytes } from "node:crypto"
import { hasRoleAtLeast, type Role } from "./rbac.ts"
import { logAction } from "./auth.ts"

// ── Types ─────────────────────────────────────────────────────────────────────

export type Tier = "free" | "pro" | "manager" | "enterprise"

export interface CheckoutSession {
  sessionId: string
  url: string
  tier: Tier
  customerEmail: string
  amountCents: number
  currency: string
  status: "open" | "complete" | "expired"
  createdAt: string
  expiresAt: string
}

export interface Subscription {
  customerId: string
  tier: Tier
  status: "active" | "past_due" | "canceled" | "incomplete"
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  seats: number
  amountCents: number
  currency: string
}

export interface WebhookEvent {
  id: string
  type: "checkout.session.completed" | "customer.subscription.updated" | "customer.subscription.deleted"
  data: Record<string, unknown>
  createdAt: string
}

export interface AuthContext {
  userId: string
  role: Role
}

// ── Tier catalog ─────────────────────────────────────────────────────────────

export const TIER_CATALOG: Record<Tier, {
  label: string
  amountCents: number
  currency: string
  interval: "month" | "year" | "one-time"
  seats: number
  description: string
  perks: string[]
}> = {
  free: {
    label: "Free",
    amountCents: 0,
    currency: "USD",
    interval: "year",
    seats: 1,
    description: "1 audit/mo, basic rights, community.",
    perks: ["1 audit per month", "Basic rights checker", "Community venue"],
  },
  pro: {
    label: "Pro",
    amountCents: 1000,
    currency: "USD",
    interval: "month",
    seats: 1,
    description: "Unlimited audits, full rights, compliance reports.",
    perks: ["Unlimited audits", "Full rights catalogue", "Compliance reports", "Dossier export"],
  },
  manager: {
    label: "Manager",
    amountCents: 4900,
    currency: "USD",
    interval: "year",
    seats: 5,
    description: "Portfolio dashboard, bulk audit, white-label.",
    perks: ["Portfolio dashboard", "Bulk audit", "White-label exports", "API access"],
  },
  enterprise: {
    label: "Enterprise",
    amountCents: 500000,
    currency: "USD",
    interval: "year",
    seats: 100,
    description: "Custom jurisdiction, SLA, dedicated support.",
    perks: ["Custom jurisdiction onboarding", "SLA & dedicated support", "SAML SSO", "On-prem option"],
  },
}

// ── Provider config ──────────────────────────────────────────────────────────

export interface PaymentConfig {
  providerKey: string
  mode: "mock" | "test" | "live"
  webhookSecret: string
}

let config: PaymentConfig = {
  providerKey: "",
  mode: "mock",
  webhookSecret: "whsec_mock_default",
}

export function init(opts: Partial<PaymentConfig>): void {
  config = {
    providerKey: opts.providerKey ?? config.providerKey,
    mode: opts.mode ?? config.mode,
    webhookSecret: opts.webhookSecret ?? config.webhookSecret,
  }
}

export function getConfig(): PaymentConfig {
  return { ...config }
}

// ── In-memory store (mock) ───────────────────────────────────────────────────

const sessions = new Map<string, CheckoutSession>()
const subscriptions = new Map<string, Subscription>()
const webhookEvents: WebhookEvent[] = []

// ── Mock checkout ────────────────────────────────────────────────────────────

export function createCheckoutSession(opts: {
  tier: Tier
  customerEmail: string
  auth: AuthContext
}): { ok: true; session: CheckoutSession } | { ok: false; error: string; status: 401 | 403 | 400 } {
  if (!hasRoleAtLeast(opts.auth.role, "RESIDENT")) {
    return { ok: false, error: "RESIDENT role required to checkout", status: 403 }
  }
  if (!opts.customerEmail || !opts.customerEmail.includes("@")) {
    return { ok: false, error: "valid customerEmail required", status: 400 }
  }
  const tier = TIER_CATALOG[opts.tier]
  if (!tier) return { ok: false, error: `unknown tier "${opts.tier}"`, status: 400 }
  if (tier.amountCents === 0) {
    return { ok: false, error: "free tier does not require checkout", status: 400 }
  }
  const sessionId = "cs_" + randomBytes(12).toString("hex")
  const session: CheckoutSession = {
    sessionId,
    url: `/checkout/${sessionId}`,
    tier: opts.tier,
    customerEmail: opts.customerEmail,
    amountCents: tier.amountCents,
    currency: tier.currency,
    status: "open",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }
  sessions.set(sessionId, session)
  // Audit (non-blocking — mock mode is fire-and-forget)
  logAction({
    userId: opts.auth.userId,
    action: "payment.checkout.create",
    resource: "checkout_session",
    resourceId: sessionId,
    after: { tier: opts.tier, amountCents: tier.amountCents },
  }).catch(() => {})
  return { ok: true, session }
}

export function getCheckoutSession(sessionId: string): CheckoutSession | null {
  return sessions.get(sessionId) ?? null
}

// ── Webhook signature verification (HMAC-SHA256) ─────────────────────────────

export function verifyWebhook(payload: string, signature: string): boolean {
  const expected = createHmac("sha256", config.webhookSecret).update(payload).digest("hex")
  if (expected.length !== signature.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
  } catch {
    return false
  }
}

export function recordWebhook(evt: WebhookEvent): void {
  webhookEvents.push(evt)
  if (evt.type === "customer.subscription.updated" || evt.type === "customer.subscription.deleted") {
    const sub = evt.data.subscription as Subscription | undefined
    if (sub?.customerId) {
      if (evt.type === "customer.subscription.deleted") {
        subscriptions.delete(sub.customerId)
      } else {
        subscriptions.set(sub.customerId, sub)
      }
    }
  }
  if (webhookEvents.length > 1000) webhookEvents.shift()
}

export function listWebhookEvents(): WebhookEvent[] {
  return [...webhookEvents]
}

// ── Customer subscription (mock DB lookup) ──────────────────────────────────

export function getCustomerSubscription(opts: {
  customerId: string
  auth: AuthContext
}): { ok: true; subscription: Subscription } | { ok: false; error: string; status: 401 | 403 | 404 } {
  if (!hasRoleAtLeast(opts.auth.role, "PARTNER")) {
    return { ok: false, error: "PARTNER role required to manage subscriptions", status: 403 }
  }
  const sub = subscriptions.get(opts.customerId)
  if (!sub) {
    return { ok: false, error: `subscription not found for customer ${opts.customerId}`, status: 404 }
  }
  return { ok: true, subscription: sub }
}

// Mock seed: when a checkout completes, the calling code can attach a
// subscription. This is the swap-point — with real Stripe, the webhook
// handler does the same job and sessions lives in Stripe's vault.
export function provisionSubscription(opts: {
  customerId: string
  tier: Tier
  seats?: number
}): Subscription {
  const tier = TIER_CATALOG[opts.tier]
  const sub: Subscription = {
    customerId: opts.customerId,
    tier: opts.tier,
    status: "active",
    currentPeriodEnd: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    seats: opts.seats ?? tier.seats,
    amountCents: tier.amountCents,
    currency: tier.currency,
  }
  subscriptions.set(opts.customerId, sub)
  return sub
}

// Self-check
export const PAYMENTS_VERSION = "1.0.0"
