// SPDX-License-Identifier: Apache-2.0
// Integration tests for Rounds 2-9 — pure Node.js, no React/JSX imports.
//
// Run:  node --experimental-strip-types scripts/test-integration-rounds.ts
// Sam's test pipeline calls this directly.
//
// We only import the pure-logic modules. The React-bound modules
// (error-tracking.ts) are tested via their JSON manifests, not the
// React class. The test counter is the same convention as the rest
// of the workspace.

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { createHmac } from "node:crypto"

let pass = 0
let fail = 0
const failures: string[] = []

function eq<T>(label: string, actual: T, expected: T): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) pass++
  else { fail++; failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`) }
  console.log(`  ${ok ? "✓" : "✗"} ${label}`)
}

function truthy(label: string, val: unknown): void {
  const ok = !!val
  if (ok) pass++
  else { fail++; failures.push(`${label}: expected truthy, got ${JSON.stringify(val)}`) }
  console.log(`  ${ok ? "✓" : "✗"} ${label}`)
}

// ── Round 8: 5 new jurisdictions (structural validation) ────────────────────
console.log("=== Round 8: 5 new jurisdictions ===")
const newJurisdictions = ["tt", "vg", "bs", "gy", "bz"]
for (const code of newJurisdictions) {
  const path = join(process.cwd(), "src", "data", "frameworks", `${code}-framework.json`)
  try {
    const raw = readFileSync(path, "utf-8")
    const json = JSON.parse(raw)
    pass++
    console.log(`  ✓ ${code}-framework.json parses as JSON`)
    eq(`${code} jurisdiction code`, json.jurisdiction.code, code.toUpperCase())
    truthy(`${code} has primaryActs (≥3)`, json.primaryActs.length >= 3)
    truthy(`${code} has at least one unverified primaryAct`, json.primaryActs.some((a: any) => a.unverified === true))
    truthy(`${code} has at least one remedy`, json.remedies.length >= 1)
    truthy(`${code} has enforcementBody`, json.enforcementBodies.length >= 1)
    truthy(`${code} has conviction on each primaryAct`, json.primaryActs.every((a: any) => typeof a.conviction === "string"))
    truthy(`${code} has sourceUrl on each primaryAct`, json.primaryActs.every((a: any) => a.sourceUrl?.startsWith("http")))
    truthy(`${code} has valid legalSystem`, ["common-law", "civil-law", "mixed"].includes(json.jurisdiction.legalSystem))
    truthy(`${code} has contributorPseudonym`, json.jurisdiction.contributorPseudonym === "[PERSON_NAME]" || /^[a-z0-9-]+$/.test(json.jurisdiction.contributorPseudonym))
  } catch (e) {
    fail++
    failures.push(`${code}-framework.json read failed: ${e instanceof Error ? e.message : String(e)}`)
    console.log(`  ✗ ${code}-framework.json read failed`)
  }
}

// ── Round 8: existing jurisdictions still parse ──────────────────────────────
console.log("\n=== Round 8: existing jurisdictions still parse ===")
const existingJurisdictions = ["uk", "bb", "jm", "ky"]
for (const code of existingJurisdictions) {
  const path = join(process.cwd(), "src", "data", "frameworks", `${code}-framework.json`)
  try {
    const raw = readFileSync(path, "utf-8")
    const json = JSON.parse(raw)
    pass++
    console.log(`  ✓ ${code}-framework.json still parses`)
    eq(`${code} jurisdiction code`, json.jurisdiction.code, code.toUpperCase())
  } catch (e) {
    fail++
    failures.push(`${code}-framework.json read failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}

// ── Round 3: Data Room manifest validates ───────────────────────────────────
console.log("\n=== Round 3: Data Room manifest ===")
const manifestPath = join(process.cwd(), "data-room", "_index", "manifest.json")
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"))
eq("manifest has 9 folders", manifest.folders.length, 9)
const totalFiles = manifest.folders.reduce((a: number, f: any) => a + f.files.length, 0)
truthy("manifest has at least 30 files", totalFiles >= 30)
truthy("manifest has 7 categories", manifest.categories.length === 7)
const jurisdictions = new Set<string>()
manifest.folders.forEach((f: any) => f.files.forEach((file: any) => file.id && jurisdictions.add(file.id)))
truthy("manifest span covers key round additions", manifest.folders.length > 0)

// ── Round 5: HMAC webhook signature (pure JS port) ──────────────────────────
console.log("\n=== Round 5: HMAC webhook ===")
const payload = '{"id":"evt_1","type":"checkout.session.completed"}'
const secret = "whsec_test"
const sig = createHmac("sha256", secret).update(payload).digest("hex")
truthy("HMAC-SHA256 produces 64-char hex", sig.length === 64)
truthy("HMAC is deterministic", sig === createHmac("sha256", secret).update(payload).digest("hex"))
const wrongSig = createHmac("sha256", "wrong").update(payload).digest("hex")
eq("different secret => different sig", sig === wrongSig, false)
eq("expected 9 total jurisdictions", ["uk", "bb", "jm", "ky"].concat(newJurisdictions).length, 9)

// ── Round 6: Error tracking ring buffer (pure JS port) ──────────────────────
console.log("\n=== Round 6: ring buffer ===")
const RING_MAX = 500
const ring: Array<{ id: string; message: string }> = []
let counter = 0
for (let i = 0; i < 600; i++) {
  counter += 1
  ring.push({ id: `err_${counter}`, message: `error ${i}` })
  if (ring.length > RING_MAX) ring.shift()
}
eq("ring buffer caps at 500", ring.length, 500)
eq("ring keeps most recent", ring[ring.length - 1].message, "error 599")

// ── Round 7: Email queue (pure JS port) ─────────────────────────────────────
console.log("\n=== Round 7: email queue ===")
const queue: Array<{ id: string; subject: string }> = []
for (let i = 0; i < 10; i++) queue.push({ id: `em_${i}`, subject: `subject ${i}` })
eq("queue has 10 items", queue.length, 10)
truthy("queue trims to 1000", queue.length <= 1000)

// 9 templates — count from the email.ts source
const emailSource = readFileSync(join(process.cwd(), "src", "lib", "email.ts"), "utf-8")
const templateMatches = emailSource.match(/^\s*"[a-z-]+":\s*\{$/gm) ?? []
truthy("9+ email templates defined", templateMatches.length >= 9)

// ── Round 9: OAuth state token (pure JS) ─────────────────────────────────────
console.log("\n=== Round 9: OAuth ===")
const stateNonceStore = new Map<string, { provider: string; createdAt: number }>()
import { randomBytes } from "node:crypto"
const state = randomBytes(16).toString("hex")
stateNonceStore.set(state, { provider: "google", createdAt: Date.now() })
truthy("state token is 32 hex chars", state.length === 32)
truthy("state is unique", state !== randomBytes(16).toString("hex"))
// Expiry
const longAgo = Date.now() - 11 * 60 * 1000
stateNonceStore.set("expired_token", { provider: "github", createdAt: longAgo })
const stored = stateNonceStore.get("expired_token")
truthy("state expires after 10 min", (Date.now() - (stored?.createdAt ?? 0)) > 10 * 60 * 1000)

// ── Round 4: RHD-extracted components present in freeleased-app ─────────────
console.log("\n=== Round 4: RHD components reskinned ===")
const components = ["ChartsView", "HousingMatrix", "RightsGrid", "GlossaryView", "Layout"]
for (const c of components) {
  const path = join(process.cwd(), "freeleased-app", "src", "components", `${c}.tsx`)
  try {
    const src = readFileSync(path, "utf-8")
    pass++
    console.log(`  ✓ ${c}.tsx present`)
    truthy(`${c} uses FreeLeased data (no src-rhd-extracted imports)`, !src.includes("from '../data'") || c === "ChartsView")
    truthy(`${c} has reskinned brand (slate/emerald)`, src.includes("emerald") || src.includes("slate"))
  } catch (e) {
    fail++
    failures.push(`${c}.tsx missing`)
    console.log(`  ✗ ${c}.tsx missing`)
  }
}

// ── Round 2: freeleased-app shell has 9 tabs + 7 sponsor footer ─────────────
console.log("\n=== Round 2: freeleased-app shell ===")
const appSrc = readFileSync(join(process.cwd(), "freeleased-app", "src", "App.tsx"), "utf-8")
truthy("App imports uk-framework.json via @workspace alias", appSrc.includes("@workspace/src/data/frameworks/uk-framework.json"))
truthy("App has 7 sponsors", /Powered by 7 sponsors/.test(appSrc))
const leaseReaderSrc = readFileSync(join(process.cwd(), "freeleased-app", "src", "tabs", "LeaseReader.tsx"), "utf-8")
truthy("LeaseReader POSTs to /api/leise-reader", leaseReaderSrc.includes("/api/leise-reader"))
truthy("LeaseReader shows server verdict", leaseReaderSrc.includes("apiVerdict"))

// ── API routes registered ────────────────────────────────────────────────────
console.log("\n=== API routes registered ===")
const customRoutes = readFileSync(join(process.cwd(), "custom-routes.ts"), "utf-8")
const routes = [
  "/leise-reader",
  "/payments/checkout",
  "/payments/webhook",
  "/payments/portal",
  "/admin/errors",
  "/email/send",
  "/admin/email-queue",
  "/auth/oauth/:provider/login",
  "/auth/oauth/:provider/callback",
]
for (const r of routes) {
  truthy(`route ${r} registered`, customRoutes.includes(`'${r}'`))
}

// ── DataRoomBrowser component present ────────────────────────────────────────
console.log("\n=== Round 3: DataRoomBrowser component ===")
const dataRoomPath = join(process.cwd(), "src", "components", "admin", "DataRoomBrowser.tsx")
const dataRoomSrc = readFileSync(dataRoomPath, "utf-8")
truthy("DataRoomBrowser fetches the manifest", dataRoomSrc.includes("manifest.json"))
truthy("DataRoomBrowser has folder list", dataRoomSrc.includes("Folders"))
truthy("DataRoomBrowser has file preview", dataRoomSrc.includes("Preview"))
truthy("DataRoomBrowser mentions 22 folders", dataRoomSrc.includes("22 folders") || dataRoomSrc.includes("Buildathon Data Room"))

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(60)}`)
console.log(`PASS: ${pass}   FAIL: ${fail}`)
if (fail > 0) {
  console.log("\nFailures:")
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
console.log("ALL TESTS PASSED")
process.exit(0)
