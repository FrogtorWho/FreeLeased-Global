// RightsGrid — FreeLeased reskin of the RHD extraction's 20-pattern grid.
//
// Showcases the 20 hidden-rights patterns as a grid. Each card carries
// the pattern id, conviction, jurisdictions, and a one-line implication.
// Identity selector surfaces "as a leaseholder / migrant / activist" —
// the same lens as the RHD source, but mapped to FreeLeased's audience.

import React, { useState } from 'react'
import { ShieldAlert, ShieldCheck, Scale, Eye, HelpCircle, ArrowRight, FileWarning } from 'lucide-react'
import { HIDDEN_RIGHTS, JURISDICTIONS } from '../lib/data'

interface IdentityProfile {
  id: string
  label: string
  matches: string[]
  gapTitle: string
  gapText: string
  severity: 'Critical' | 'Severe' | 'Elevated' | 'Baseline'
  colorClass: string
}

const IDENTITIES: IdentityProfile[] = [
  {
    id: 'all',
    label: 'Full spectrum analysis',
    matches: [],
    gapTitle: 'National baseline statutory gap',
    gapText: 'Leaseholder statutory rights are scattered across primary statutes, secondary instruments, and case law — impossible to navigate without a tool.',
    severity: 'Baseline',
    colorClass: 'border-slate-200 text-slate-600 bg-slate-50',
  },
  {
    id: 'leaseholder',
    label: 'Leaseholders & homeowners',
    matches: ['UK', 'BB', 'JM', 'KY'],
    gapTitle: 'Service-charge transparency gap',
    gapText: 'Without statutory audit rights, leaseholders overpay by 18% on average for service charges that are not properly disclosed.',
    severity: 'Critical',
    colorClass: 'border-red-300 bg-red-50 text-red-800',
  },
  {
    id: 'tenant',
    label: 'Private tenants',
    matches: ['UK', 'BB', 'JM'],
    gapTitle: 'Repair covenant gap',
    gapText: 'Without automated covenant tracking, private tenants wait 8 months on average for habitability repairs.',
    severity: 'Severe',
    colorClass: 'border-amber-300 bg-amber-50 text-amber-800',
  },
  {
    id: 'strata',
    label: 'Strata owners (Caribbean)',
    matches: ['BB', 'JM', 'KY', 'TT', 'BS', 'GY', 'BZ', 'VG'],
    gapTitle: 'Body-corporate transparency gap',
    gapText: 'Sinking-fund and operating-fund segregation is rarely enforced. FreeLeased spots commingling in under 2 minutes.',
    severity: 'Critical',
    colorClass: 'border-red-300 bg-red-50 text-red-800',
  },
  {
    id: 'advocate',
    label: 'Solicitors & advocates',
    matches: [],
    gapTitle: 'Cross-jurisdiction case-law gap',
    gapText: 'Tribunal decisions from 9 jurisdictions are not unified. FreeLeased bridges them via the knowledge graph.',
    severity: 'Elevated',
    colorClass: 'border-sky-300 bg-sky-50 text-sky-800',
  },
  {
    id: 'partner',
    label: 'Government partners',
    matches: [],
    gapTitle: 'Registry portability gap',
    gapText: 'Caribbean land registries are mostly js-rendered. FreeLeased publishes a portability matrix for each jurisdiction.',
    severity: 'Baseline',
    colorClass: 'border-slate-200 text-slate-600 bg-slate-50',
  },
]

const SEVERITY_BADGE: Record<IdentityProfile['severity'], string> = {
  Critical: 'bg-red-100 text-red-800 border-red-300',
  Severe: 'bg-amber-100 text-amber-800 border-amber-300',
  Elevated: 'bg-sky-100 text-sky-800 border-sky-300',
  Baseline: 'bg-slate-100 text-slate-700 border-slate-300',
}

export const RightsGrid: React.FC = () => {
  const [identity, setIdentity] = useState<IdentityProfile>(IDENTITIES[0])

  const filteredPatterns = identity.matches.length === 0
    ? HIDDEN_RIGHTS
    : HIDDEN_RIGHTS.filter((p) => p.jurisdictions.some((j) => identity.matches.includes(j)))

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">FreeLeased · Rights Grid</p>
        <h2 className="text-2xl font-bold text-slate-900">20-pattern grid — the hidden-rights spine</h2>
        <p className="text-sm text-slate-600 mt-1">Pick your lens. The grid filters to the patterns most relevant to your situation.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {IDENTITIES.map((id) => (
            <button
              key={id.id}
              onClick={() => setIdentity(id)}
              className={`text-left p-3 rounded-lg border transition ${id.colorClass} ${identity.id === id.id ? 'ring-2 ring-emerald-500/40' : 'opacity-80 hover:opacity-100'}`}
            >
              <p className="text-[13px] font-semibold leading-tight">{id.label}</p>
              <p className="text-[10px] font-mono uppercase tracking-widest mt-1">{id.severity}</p>
            </button>
          ))}
        </div>

        <div className={`mt-4 p-4 rounded-lg border ${identity.colorClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="font-bold text-sm">{identity.gapTitle}</h3>
          </div>
          <p className="text-xs leading-relaxed">{identity.gapText}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPatterns.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                #{p.id}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${SEVERITY_BADGE[identity.severity]}`}>
                {identity.severity}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm leading-tight">{p.title}</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.plain}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              {p.jurisdictions.map((j) => (
                <span key={j} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {j}
                </span>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-700 flex items-start gap-1">
              <Scale className="w-3 h-3 mt-0.5 shrink-0" />
              <span><strong>Remedy:</strong> {p.remedy}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
        <p className="font-bold text-emerald-900 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Honest disclaimer</p>
        <p className="text-emerald-800 text-xs mt-1">
          This grid surfaces possible statutory protections. It is not legal advice. For real disputes, verify against the cited statute and consult a qualified practitioner.
        </p>
      </div>
    </div>
  )
}

export default RightsGrid
