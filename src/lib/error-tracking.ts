// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Error tracking abstraction (mock provider).
//
// Sentry-style API. Three operations:
//   - captureError(error, context) — push to ring buffer + log
//   - withErrorBoundary(component) — React error boundary
//   - getRecentErrors() — admin retrieval
//
// The mock provider is in-memory (ring buffer, capped). When Sam ships
// a real Sentry DSN, the only change is init({ dsn: 'https://...@sentry.io/...' }).

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CapturedError {
  id: string
  timestamp: string
  message: string
  stack?: string
  context: Record<string, unknown>
  fingerprint: string
  level: "error" | "warning" | "info"
  source: "react" | "promise" | "window" | "manual"
}

export interface TrackingConfig {
  dsn: string
  environment: "development" | "production" | "mock"
  release: string
  sampleRate: number
}

let config: TrackingConfig = {
  dsn: "",
  environment: "mock",
  release: "freeleased-1.0.0",
  sampleRate: 1.0,
}

export function init(opts: Partial<TrackingConfig>): void {
  config = {
    dsn: opts.dsn ?? config.dsn,
    environment: opts.environment ?? config.environment,
    release: opts.release ?? config.release,
    sampleRate: opts.sampleRate ?? config.sampleRate,
  }
}

export function getConfig(): TrackingConfig {
  return { ...config }
}

// ── Ring buffer ──────────────────────────────────────────────────────────────

const RING_MAX = 500
const ring: CapturedError[] = []

let counter = 0
function nextId(): string {
  counter += 1
  return `err_${Date.now().toString(36)}_${counter.toString(36)}`
}

function fingerprint(err: Error, context: Record<string, unknown>): string {
  const base = `${err.name}::${err.message}::${(context.component as string) ?? "unknown"}`
  // Cheap deterministic hash (FNV-1a 32-bit)
  let h = 0x811c9dc5
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, "0")
}

export function captureError(err: Error | string, context: Record<string, unknown> = {}, level: CapturedError["level"] = "error", source: CapturedError["source"] = "manual"): CapturedError {
  // Sample rate
  if (Math.random() > config.sampleRate) {
    return {
      id: "sampled_out",
      timestamp: new Date().toISOString(),
      message: "(sampled out)",
      context: {},
      fingerprint: "00000000",
      level,
      source,
    }
  }
  const e = err instanceof Error ? err : new Error(String(err))
  const evt: CapturedError = {
    id: nextId(),
    timestamp: new Date().toISOString(),
    message: e.message,
    stack: e.stack,
    context: { ...context, release: config.release, environment: config.environment },
    fingerprint: fingerprint(e, context),
    level,
    source,
  }
  ring.push(evt)
  if (ring.length > RING_MAX) ring.shift()
  // Console sink — keeps the loop observable in dev.
  // eslint-disable-next-line no-console
  console[level === "info" ? "info" : level === "warning" ? "warn" : "error"](
    `[error-tracking] ${e.name}: ${e.message}`,
    context,
  )
  return evt
}

export function getRecentErrors(opts: { limit?: number; level?: CapturedError["level"] } = {}): CapturedError[] {
  const limit = Math.min(opts.limit ?? 100, RING_MAX)
  const pool = opts.level ? ring.filter((e) => e.level === opts.level) : ring
  // Most-recent first
  return pool.slice(-limit).reverse()
}

export function clearErrors(): void {
  ring.length = 0
}

// ── React error boundary ─────────────────────────────────────────────────────

import React from "react"

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  component?: string
  onError?: (err: Error, info: React.ErrorInfo) => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    captureError(error, { component: this.props.component ?? "unknown", componentStack: info.componentStack }, "error", "react")
    this.props.onError?.(error, info)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="p-4 border border-red-300 bg-red-50 rounded-md text-sm">
          <strong>Something went wrong.</strong>
          <p className="text-xs text-red-700 mt-1">{this.state.error?.message ?? "Unknown error"}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function withErrorBoundary<P extends object>(
  component: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, "children"> = {},
): React.ComponentType<P> {
  const Wrapped: React.FC<P> = (props) => (
    <ErrorBoundary {...options}>
      {React.createElement(component, props)}
    </ErrorBoundary>
  )
  Wrapped.displayName = `withErrorBoundary(${component.displayName ?? component.name ?? "Component"})`
  return Wrapped
}

// ── Global hook ──────────────────────────────────────────────────────────────

export function installGlobalHandlers(): void {
  if (typeof window === "undefined") return
  window.addEventListener("error", (event) => {
    captureError(event.error ?? event.message, { url: event.filename, line: event.lineno, column: event.colno }, "error", "window")
  })
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    captureError(reason, { kind: "unhandledrejection" }, "error", "promise")
  })
}

export const TRACKING_VERSION = "1.0.0"
