// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Judge Portal (Phase 17).
//
// The curated, scrubbed view of the system for 100-judge evaluation.
// Honors the secret-slice enforcer: only sees what /api/judge/* returns.
// The 5-jurisdiction comparison, the 6-axis scorecard, the top-5 use
// cases. Nothing else.

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface JurisdictionItem {
  code: string
  name: string
  tenureSystem: string
  capital: string
  inPilot: boolean
}

interface ScorecardData {
  axes: string[]
  axesExplained: Record<string, string>
  ref: string
}

export function JudgePortal() {
  const [jurisdictions, setJurisdictions] = useState<JurisdictionItem[]>([])
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null)
  const [meta, setMeta] = useState<{ strippedFields: string[]; itemsIn: number; itemsOut: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [j, s] = await Promise.all([
        fetch("/api/judge/demo").then((r) => r.json()),
        fetch("/api/judge/scorecard").then((r) => r.json()),
      ])
      setJurisdictions(j.items ?? [])
      setMeta(j.meta ?? null)
      setScorecard(s.scorecard ?? null)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load judge portal")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading judge portal...</div>
  if (error) return <div className="p-8 text-sm text-red-500">{error}</div>

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Judge Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated view of the FreeLeased demonstration. This is the
            only surface judges see.
          </p>
        </div>
        <Badge variant="outline">Scope: Secret Slice</Badge>
      </div>

      {meta && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <p className="text-xs text-amber-900">
              <strong>Transparency:</strong> {meta.itemsIn} jurisdictions mapped
              in the production spine; {meta.itemsOut} shown here. The
              filter stripped {meta.strippedFields.length} internal fields
              per item (e.g. conviction, agentTrail, auditHash).
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>5-Jurisdiction Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              A curated subset of the 9-jurisdiction spine. The full spine
              (BZ, BS, GY, VG) is excluded from this view by design.
            </p>
            <Table jurisdictions={jurisdictions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Verified Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li>
                <strong>1. UK RTM eligibility</strong>
                <p className="text-xs text-muted-foreground">
                  Is this building eligible? CLRA 2002 s.72, verified.
                </p>
              </li>
              <li>
                <strong>2. Service charge audit</strong>
                <p className="text-xs text-muted-foreground">
                  Is this clause fair? LTA 1985 s.19, CRA 2015 Part 2.
                </p>
              </li>
              <li>
                <strong>3. Golden Thread check</strong>
                <p className="text-xs text-muted-foreground">
                  Does this building have a Golden Thread? BSA 2022 ss.80-82.
                </p>
              </li>
              <li>
                <strong>4. Enfranchisement valuation</strong>
                <p className="text-xs text-muted-foreground">
                  Indicative premium. LRHUDA 1993, Sportelli v Cadogan.
                </p>
              </li>
              <li>
                <strong>5. Caribbean condominium mapping</strong>
                <p className="text-xs text-muted-foreground">
                  UK ↔ Caribbean statutory analogy. Caveat: requires in-territory review.
                </p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {scorecard && (
        <Card>
          <CardHeader>
            <CardTitle>100-Judge Scorecard — 6 Axes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Each axis is explained in plain English. The full per-archetype
              scores are NOT shown here — that is the Administrator's view.
              Reference: <code>{scorecard.ref}</code>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scorecard.axes.map((axis) => (
                <div key={axis} className="rounded border p-3">
                  <div className="font-mono text-sm font-medium">{axis}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scorecard.axesExplained[axis]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Demo Artefacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>📹 Demo video (3–5 min, end-to-end audit flow)</li>
              <li>📄 Public PDF (1-page summary, offline)</li>
              <li>🌐 Live site (the judge-scoped subset)</li>
              <li>📊 Scorecard (this view)</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What This Portal Does NOT Show</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>⛔ Internal conviction tables</li>
              <li>⛔ Per-agent cost attribution</li>
              <li>⛔ HITL override history</li>
              <li>⛔ Unverified claims</li>
              <li>⛔ Pricing tier mechanics</li>
              <li>⛔ Architecture internals</li>
              <li>⛔ Roadmap beyond public Q4 2026</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Table({ jurisdictions }: { jurisdictions: JurisdictionItem[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Code</th>
          <th className="text-left py-2">Name</th>
          <th className="text-left py-2">Tenure</th>
          <th className="text-left py-2">Capital</th>
        </tr>
      </thead>
      <tbody>
        {jurisdictions.map((j) => (
          <tr key={j.code} className="border-b">
            <td className="py-2 font-mono">{j.code}</td>
            <td className="py-2">{j.name}</td>
            <td className="py-2 text-xs">{j.tenureSystem}</td>
            <td className="py-2 text-xs">{j.capital}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default JudgePortal
