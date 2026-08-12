import React from 'react';
import { GLOSSARY_TERMS } from '../data';
import { BookOpen } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {GLOSSARY_TERMS.map((term, idx) => (
        <div key={idx} className="p-5 border border-border bg-void/50 rounded-lg hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">{term.term}</h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed mb-4">
            {term.definition}
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] font-mono text-slate-600">
            <span className="text-accent uppercase font-bold">Implication:</span> {term.implication}
          </div>
        </div>
      ))}
      
      <div className="col-span-1 md:col-span-2 p-6 mt-6 border-t border-dashed border-slate-200">
        <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Methodology & Sources Appendix</h4>
        <ul className="list-disc list-inside space-y-2 text-xs text-slate-500 font-sans">
          <li>"Performance Tracker 2025: Local government" – Institute for Government</li>
          <li>"Water company performance report 2024-25" – Ofwat</li>
          <li>"UK Construction Labour Market Report 2026" – Phoenix Gray Recruitment</li>
          <li>"Government's use of external consultants" – National Audit Office & PAC</li>
          <li>"Long-term international migration, provisional" – ONS (2025)</li>
          <li>"Leasehold and Freehold Reform Act 2024" – Legislation.gov.uk</li>
          <li>"The Big Con: How the Consulting Industry Weakens our Businesses" – Mazzucato & Collington</li>
        </ul>
      </div>
    </div>
  );
};
