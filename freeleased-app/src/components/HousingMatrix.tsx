// HousingMatrix — FreeLeased reskin of the RHD extraction.
//
// Jurisdiction-by-jurisdiction dashboard of housing data sufficiency.
// Self-contained — does not import from the RHD extraction.

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Building, Scale, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { JURISDICTIONS, STATUTES, HIDDEN_RIGHTS } from '../lib/data'

type Severity = 'CRITICAL' | 'HIGH RISK' | 'ELEVATED' | 'STABLE'

interface JurisdictionTile {
  id: string
  name: string
  regions: string[]
  authority: string
  tribunal: string
  severity: Severity
  scoreNum: number
}

const TILES: JurisdictionTile[] = JURISDICTIONS.map((j, i) => {
  const statutes = STATUTES.filter((s) => s.jurisdiction === j.code)
  const verified = statutes.filter((s) => s.conviction === 'verified').length
  const scoreNum = Math.min(100, verified * 12 + 40)
  const severity: Severity = scoreNum >= 80 ? 'CRITICAL' : scoreNum >= 65 ? 'HIGH RISK' : scoreNum >= 50 ? 'ELEVATED' : 'STABLE'
  const tribunalByCode: Record<string, string> = {
    UK: 'First-Tier Tribunal (Property Chamber)',
    BB: 'High Court of Barbados',
    JM: 'Supreme Court of Judicature of Jamaica',
    KY: 'Grand Court of the Cayman Islands',
    TT: 'Industrial Court of Trinidad & Tobago',
    BS: 'Supreme Court of the Bahamas',
    GY: 'Supreme Court of Judicature of Guyana',
    BZ: 'Supreme Court of Belize',
    VG: 'Eastern Caribbean Supreme Court (BVI)',
  }
  return {
    id: j.code,
    name: j.name,
    regions: [j.capital],
    authority: j.tenureSystem,
    tribunal: tribunalByCode[j.code] ?? 'Local courts',
    severity,
    scoreNum,
  }
})

const SEVERITY_STYLE: Record<Severity, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  'HIGH RISK': 'bg-amber-100 text-amber-800 border-amber-300',
  ELEVATED: 'bg-sky-100 text-sky-800 border-sky-300',
  STABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
}

export const HousingMatrix: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(TILES[0]?.id ?? 'UK')
  const selected = useMemo(() => TILES.find((t) => t.id === selectedId) ?? TILES[0], [selectedId])

  const stats = useMemo(() => {
    const total = TILES.length
    const critical = TILES.filter((t) => t.severity === 'CRITICAL').length
    const elevated = TILES.filter((t) => t.severity === 'ELEVATED' || t.severity === 'HIGH RISK').length
    const stable = TILES.filter((t) => t.severity === 'STABLE').length
    return { total, critical, elevated, stable }
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">FreeLeased · Housing Matrix</p>
        <h2 className="text-2xl font-bold text-slate-900">Jurisdiction data sufficiency</h2>
        <p className="text-sm text-slate-600 mt-1">Picking a jurisdiction surfaces the relevant statutes, tribunal, and the patterns in the 20-pattern spine.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Jurisdictions</p>
            <p className="text-2xl font-bold text-emerald-700 tabular-nums">{stats.total}</p>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-red-700">Critical</p>
            <p className="text-2xl font-bold text-red-700 tabular-nums">{stats.critical}</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700">Elevated</p>
            <p className="text-2xl font-bold text-amber-700 tabular-nums">{stats.elevated}</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700">Stable</p>
            <p className="text-2xl font-bold text-emerald-700 tabular-nums">{stats.stable}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Jurisdictions</p>
          </div>
          <ul className="p-1.5 space-y-1 max-h-[28rem] overflow-y-auto">
            {TILES.map((t) => {
              const active = selectedId === t.id
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition border ${
                      active ? 'bg-emerald-50 border-emerald-200' : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-semibold text-slate-900">{t.id} · {t.name}</span>
                      <span className="block text-[10px] text-slate-500">{t.authority}</span>
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${SEVERITY_STYLE[t.severity]}`}>
                      {t.severity}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-5"
          >
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-bold text-slate-900">{selected.id} · {selected.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Capital: {selected.regions.join(', ')}</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Authority</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{selected.authority}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
                  <Scale className="w-3 h-3" /> Tribunal
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{selected.tribunal}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Patterns anchored to this jurisdiction</p>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {HIDDEN_RIGHTS.filter((p) => p.jurisdictions.includes(selected.id as any)).slice(0, 8).map((p) => (
                  <li key={p.id} className="text-xs text-slate-700 flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-emerald-600 shrink-0" />
                    <span>#{p.id} {p.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${SEVERITY_STYLE[selected.severity]}`}>
                {selected.severity}
              </span>
              <span className="text-xs text-slate-500">sufficiency {selected.scoreNum}/100</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HousingMatrix
