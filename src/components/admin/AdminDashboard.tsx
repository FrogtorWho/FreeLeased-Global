// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Admin Dashboard (Phase 17).
//
// Sam's view: user list, system health, AI-agent army activity, audit log
// search, billing, feature flags. The dashboard is intentionally a
// "command post" — single screen, dense, keyboard-driven.
//
// Visibility: this component is mounted in the navigation ONLY when the
// current user is ADMIN. The RBAC checks at the API level are the
// real security boundary; the UI is a courtesy.

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AuditRow {
  id: string
  userId: string | null
  action: string
  resource: string
  resourceId: string | null
  timestamp: string
  auditHash: string | null
  prevHash: string | null
}

interface SystemHealth {
  counts: { users: number; sessions: number; auditLogs: number; signoffs: number }
  runtime: number
  ts: string
}

interface FeatureFlag {
  key: string
  enabled: boolean
  reason?: string | null
  updatedAt?: string
  updatedBy?: string | null
}

export function AdminDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [audit, setAudit] = useState<AuditRow[]>([])
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [auditFilter, setAuditFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [h, a, f] = await Promise.all([
        fetch("/api/admin/system-health").then((r) => r.json()),
        fetch("/api/admin/audit-log?limit=200").then((r) => r.json()),
        fetch("/api/admin/feature-flags").then((r) => r.json()),
      ])
      setHealth(h)
      setAudit(a.rows ?? [])
      setFlags(f.flags ?? [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  async function toggleFlag(key: string, enabled: boolean) {
    await fetch(`/api/admin/feature-flags/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, reason: enabled ? "toggled by admin" : "killed by admin" }),
    })
    await load()
  }

  const filteredAudit = audit.filter((r) =>
    !auditFilter ||
    r.action.includes(auditFilter) ||
    r.resource.includes(auditFilter) ||
    (r.userId ?? "").includes(auditFilter),
  )

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading admin dashboard...</div>
  if (error) return <div className="p-8 text-sm text-red-500">{error}</div>

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Badge variant="outline">RBAC v17.0.0</Badge>
          <Button size="sm" onClick={() => void load()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{health?.counts.users ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{health?.counts.sessions ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Audit Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{health?.counts.auditLogs ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dossier Signoffs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{health?.counts.signoffs ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="ai">AI-Agent Army</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-2">
          <Input
            placeholder="Filter by action / resource / userId..."
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
          />
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudit.slice(0, 100).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs font-mono">{new Date(r.timestamp).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="secondary">{r.action}</Badge></TableCell>
                    <TableCell className="text-xs">{r.resource}</TableCell>
                    <TableCell className="text-xs font-mono">{r.userId?.slice(0, 8) ?? "system"}</TableCell>
                    <TableCell className="text-xs font-mono">{r.auditHash?.slice(0, 8)}…</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="flags" className="space-y-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flags.map((f) => (
                  <TableRow key={f.key}>
                    <TableCell className="font-mono text-sm">{f.key}</TableCell>
                    <TableCell>
                      <Badge variant={f.enabled ? "default" : "destructive"}>
                        {f.enabled ? "ON" : "OFF"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{f.reason ?? "—"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => toggleFlag(f.key, !f.enabled)}>
                        {f.enabled ? "Kill" : "Enable"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI-Agent Army Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "fl-craft-review", role: "Audit", status: "active", quality: "100%" },
                  { name: "fl-dataviz", role: "Visualisation", status: "active", quality: "100%" },
                  { name: "fl-schema", role: "Spine", status: "active", quality: "100%" },
                  { name: "fl-verify", role: "Build Gatekeeper", status: "active", quality: "100%" },
                  { name: "fl-integrations", role: "Integration", status: "standby", quality: "—" },
                ].map((a) => (
                  <div key={a.name} className="rounded border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{a.name}</span>
                      <Badge variant={a.status === "active" ? "default" : "secondary"}>{a.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{a.role} · quality {a.quality}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Retention Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Retention policy is enforced by <code>src/lib/retention.ts</code>.
                <br />
                Audit logs: 7 years (legal defensibility). Sessions: 90 days.
                Notifications: 180 days. Signoffs: 7 years (mirrors audit).
                <br />
                Right-to-erasure (GDPR Art. 17) preserves the audit chain while
                pseudonymising PII.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard
