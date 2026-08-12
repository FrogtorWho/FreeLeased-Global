// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Partner View (Phase 17).
//
// Partners see only their org's dossiers. Conviction metadata is stripped
// server-side so the partner UI never renders internals. The view is
// scoped to the partner's tenantId from the session.

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PartnerResident {
  id: string
  email: string
  name: string | null
  residentId: string | null
}

export function PartnerView() {
  const [residents, setResidents] = useState<PartnerResident[]>([])
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    try {
      const r = await fetch("/api/partner/dossiers").then((r) => r.json())
      setResidents(r.residents ?? [])
      setTenantId(r.tenantId ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load partner data")
    }
  }

  async function submit() {
    if (!newEmail) return
    setSubmitting(true)
    try {
      const r = await fetch("/api/partner/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentEmail: newEmail, name: newName || null }),
      })
      if (!r.ok) {
        const body = await r.json().catch(() => ({}))
        throw new Error(body.error ?? `HTTP ${r.status}`)
      }
      setNewEmail("")
      setNewName("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "submit failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partner Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tenant-scoped view — your partner organisation only.
          </p>
        </div>
        <Badge variant="outline">Tenant: {tenantId ?? "…"}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a New Resident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="resident@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button onClick={submit} disabled={submitting || !newEmail}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Residents ({residents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Conviction metadata, agent trail, and cost attribution are
            not shown — these are administrator-only fields.
          </p>
          <div className="space-y-2">
            {residents.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No residents yet.</p>
            )}
            {residents.map((r) => (
              <div key={r.id} className="rounded border p-3 flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm">{r.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.name ?? "Unnamed"} · residentId={r.residentId ?? "—"}
                  </div>
                </div>
                <Badge>RESIDENT</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PartnerView
