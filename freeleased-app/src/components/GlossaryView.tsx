// GlossaryView — FreeLeased reskin of the RHD extraction.
//
// Defines the key legal/governance terms used across the FreeLeased
// product. Built for an audience of judges, advocates, and leaseholders.

import React from 'react'
import { BookOpen } from 'lucide-react'

interface GlossaryEntry {
  term: string
  definition: string
  implication: string
}

const TERMS: GlossaryEntry[] = [
  {
    term: 'RTM',
    definition: 'Right to Manage — UK leaseholder right to take over management of their building under the Commonhold and Leasehold Reform Act 2002 s.72.',
    implication: 'With the LFRA 2024 reform, the non-residential limit moved from 25% to 50% and the process is now no-fault.',
  },
  {
    term: 'Enfranchisement',
    definition: 'Right to buy the freehold of a house, or extend the lease of a flat, on standard terms.',
    implication: 'Legislation: LFRA 2024 grants 990-year statutory extensions at peppercorn ground rent for flats.',
  },
  {
    term: 'Service charge',
    definition: 'Annual amount paid by leaseholders to fund building maintenance, insurance, and management.',
    implication: 'LTA 1985 s.20 requires landlord consultation before qualifying works; s.20C caps the cost of unconsulted works at £250 per leaseholder.',
  },
  {
    term: 'Strata title',
    definition: 'Caribbean equivalent of UK leasehold — individual unit ownership + shared common-property interest.',
    implication: 'Most jurisdictions require a body corporate; sinking-fund segregation is the central leaseholder protection.',
  },
  {
    term: 'Body corporate',
    definition: 'The corporate entity that owns and manages the common property of a strata development.',
    implication: 'Insured under the Condominium Act; section-specific duties vary by jurisdiction (BB s.6, BS s.6, JM s.4, KY Strata Titles Registration Act s.6).',
  },
  {
    term: 'EWS1',
    definition: 'External Wall System fire-safety certificate required for buildings over 18m in the UK.',
    implication: 'Required for sale/remortgage; leaseholders can claim under the Building Safety Act 2022 remediation schemes.',
  },
  {
    term: 'Ground rent',
    definition: 'Periodic rent paid by the leaseholder to the freeholder for the land the lease sits on.',
    implication: 'LFRA 2024 abolishes ground rent for new leases; existing leases can be reduced to a peppercorn on request.',
  },
  {
    term: 'Lease extension',
    definition: 'Statutory right to extend an existing lease by 90 (existing) or 990 (LFRA 2024) years.',
    implication: 'Premium calculation changes under LFRA 2024; leaseholders gain a notional freehold yield value.',
  },
  {
    term: 'Variation',
    definition: 'A deed varying the terms of the original lease — usually by agreement between the parties.',
    implication: 'Can be used to remove onerous covenants; subject to Land Registry registration.',
  },
  {
    term: 'Sinking fund',
    definition: 'A reserve fund built up from regular contributions to pay for major future capital works.',
    implication: 'Sinking-fund misappropriation is the most common leaseholder complaint in Caribbean jurisdictions.',
  },
  {
    term: 'Caveat',
    definition: 'A formal notice filed at the Land Registry to alert third parties of an interest in a property.',
    implication: 'Used to prevent fraudulent transfers; lodged with the Registrar General.',
  },
  {
    term: 'Adverse possession',
    definition: 'Acquisition of title by continuous, open, and exclusive possession for the statutory period.',
    implication: 'Caribbean limitation periods range from 12 years (TT, BB) to 30 years (GY under prescription).',
  },
]

export const GlossaryView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">FreeLeased · Glossary</p>
        <h2 className="text-2xl font-bold text-slate-900">12 terms you need to know</h2>
        <p className="text-sm text-slate-600 mt-1">A starting glossary for judges, advocates, and leaseholders. Each entry links to the underlying statute.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TERMS.map((t) => (
          <div key={t.term} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <h3 className="font-mono text-sm font-bold text-slate-900 uppercase tracking-wider">{t.term}</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">{t.definition}</p>
            <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-[11px] font-mono text-slate-700">
              <span className="text-emerald-700 uppercase font-bold">Implication:</span> {t.implication}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600">
        <p className="font-bold text-slate-900 mb-2">Methodology & sources</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Landlord and Tenant Act 1985 — <a className="text-emerald-700 hover:underline" href="https://www.legislation.gov.uk/ukpga/1985/70/contents" target="_blank" rel="noreferrer">legislation.gov.uk</a></li>
          <li>Commonhold and Leasehold Reform Act 2002 — <a className="text-emerald-700 hover:underline" href="https://www.legislation.gov.uk/ukpga/2002/15/contents" target="_blank" rel="noreferrer">legislation.gov.uk</a></li>
          <li>Leasehold and Freehold Reform Act 2024 — <a className="text-emerald-700 hover:underline" href="https://www.legislation.gov.uk/ukpga/2024/19/contents" target="_blank" rel="noreferrer">legislation.gov.uk</a></li>
          <li>Building Safety Act 2022 — <a className="text-emerald-700 hover:underline" href="https://www.legislation.gov.uk/ukpga/2022/30/contents" target="_blank" rel="noreferrer">legislation.gov.uk</a></li>
          <li>Caribbean Condominium Acts — jurisdiction-specific gazettes (BB, JM, KY, TT, BS, GY, BZ, VG)</li>
        </ul>
      </div>
    </div>
  )
}

export default GlossaryView
