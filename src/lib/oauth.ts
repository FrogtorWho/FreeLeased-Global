// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — OAuth abstraction (mock providers).
//
// Three providers, all in mock mode with deterministic test tokens.
// When Sam ships real OAuth apps, the only change is `init({ ... })`.

import { createHash, randomBytes } from "node:crypto"

export type OAuthProvider = "google" | "github" | "microsoft"

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: Record<OAuthProvider, string[]>
}

export interface OAuthLogin {
  authUrl: string
  state: string
}

export interface OAuthCallback {
  userId: string
  email: string
  name: string
  provider: OAuthProvider
  oauthId: string
}

export interface LinkedAccount {
  userId: string
  provider: OAuthProvider
  oauthId: string
  linkedAt: string
}

// ── Config ────────────────────────────────────────────────────────────────────

let config: OAuthConfig = {
  clientId: "",
  clientSecret: "",
  redirectUri: "http://localhost:5173/auth/callback",
  scopes: {
    google: ["openid", "email", "profile"],
    github: ["read:user", "user:email"],
    microsoft: ["openid", "email", "profile"],
  },
}

export function init(opts: Partial<OAuthConfig>): void {
  config = { ...config, ...opts, scopes: { ...config.scopes, ...(opts.scopes ?? {}) } }
}

export function getConfig(): OAuthConfig {
  return { ...config, scopes: { ...config.scopes } }
}

// ── Deterministic mock tokens ─────────────────────────────────────────────────

// Each mock provider returns the same user when given the same code suffix.
// This means tests can assert on a known canned identity.
const MOCK_USERS: Record<OAuthProvider, Array<{ oauthId: string; email: string; name: string }>> = {
  google: [
    { oauthId: "google_1", email: "test.user@gmail.com", name: "Test Google User" },
    { oauthId: "google_2", email: "demo.user@gmail.com", name: "Demo Google User" },
  ],
  github: [
    { oauthId: "github_1", email: "octocat@github.com", name: "Octocat" },
    { oauthId: "github_2", email: "torvalds@github.com", name: "Linus Torvalds" },
  ],
  microsoft: [
    { oauthId: "ms_1", email: "test.user@outlook.com", name: "Test Microsoft User" },
    { oauthId: "ms_2", email: "demo.user@outlook.com", name: "Demo Microsoft User" },
  ],
}

const stateNonceStore = new Map<string, { provider: OAuthProvider; redirectUri: string; createdAt: number }>()
const linkedAccounts: LinkedAccount[] = []

// ── Login ─────────────────────────────────────────────────────────────────────

export function oauthLogin(opts: { provider: OAuthProvider; redirectUri?: string }): OAuthLogin {
  const state = randomBytes(16).toString("hex")
  const redirectUri = opts.redirectUri ?? config.redirectUri
  stateNonceStore.set(state, {
    provider: opts.provider,
    redirectUri,
    createdAt: Date.now(),
  })
  // The mock authUrl is a relative URL that the dev server can intercept.
  const authUrl = `/auth/mock/${opts.provider}?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${config.clientId || "mock_client"}`
  return { authUrl, state }
}

// ── Callback ──────────────────────────────────────────────────────────────────

export function oauthCallback(opts: {
  provider: OAuthProvider
  code: string
  state: string
}): OAuthCallback | { error: string } {
  const stored = stateNonceStore.get(opts.state)
  if (!stored) return { error: `unknown state token ${opts.state}` }
  if (stored.provider !== opts.provider) return { error: `provider mismatch: stored ${stored.provider}, got ${opts.provider}` }
  if (Date.now() - stored.createdAt > 10 * 60 * 1000) {
    stateNonceStore.delete(opts.state)
    return { error: "state token expired" }
  }
  stateNonceStore.delete(opts.state)
  // Deterministic user selection: hash code to pick the canonical mock user.
  const hash = createHash("sha256").update(opts.code).digest()
  const pool = MOCK_USERS[opts.provider]
  const idx = hash[0] % pool.length
  const u = pool[idx]
  return {
    userId: `usr_${opts.provider}_${u.oauthId}`,
    email: u.email,
    name: u.name,
    provider: opts.provider,
    oauthId: u.oauthId,
  }
}

// ── Link account ─────────────────────────────────────────────────────────────

export function linkOAuthAccount(opts: {
  userId: string
  provider: OAuthProvider
  oauthId: string
}): LinkedAccount {
  const existing = linkedAccounts.find(
    (l) => l.userId === opts.userId && l.provider === opts.provider,
  )
  if (existing) return existing
  const link: LinkedAccount = {
    userId: opts.userId,
    provider: opts.provider,
    oauthId: opts.oauthId,
    linkedAt: new Date().toISOString(),
  }
  linkedAccounts.push(link)
  return link
}

export function listLinkedAccounts(userId: string): LinkedAccount[] {
  return linkedAccounts.filter((l) => l.userId === userId)
}

export const OAUTH_VERSION = "1.0.0"
