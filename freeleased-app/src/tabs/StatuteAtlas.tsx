import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  BookOpen,
  ChevronRight,
  MapPin,
  ExternalLink,
  Globe,
  Layers,
} from 'lucide-react';
import { JURISDICTIONS, STATUTES, SOURCES } from '../lib/data';
import { loadFramework } from '../lib/framework-loaders';
import { cn } from '../lib/cn';

type JurisCode = 'BB' | 'JM' | 'KY' | 'UK';

const JURISDICTION_PALETTE: Record<JurisCode, string> = {
  BB: 'from-emerald-700 to-emerald-900',
  JM: 'from-sky-700 to-sky-900',
  KY: 'from-amber-600 to-amber-800',
  UK: 'from-slate-700 to-slate-900',
};

interface FrameworkData {
  jurisdiction?: { code: string; name: string; legalSystem?: string; finalAppellateCourt?: string; lastVerified?: string };
  primaryActs?: Array<{
    id: string; shortTitle: string; chapterNumber?: string; enactmentYear?: number;
    summary: string; leaseholderRelevantSections?: string[]; conviction?: string;
  }>;
  regulatoryBodies?: string[];
  tribunalSystem?: string[];
  advisoryOrganizations?: string[];
  notes?: string;
}

export default function StatuteAtlas() {
  const [selected, setSelected] = useState<JurisCode>('BB');
  const [data, setData] = useState<FrameworkData | null>(null);

  useEffect(() => {
    setData(loadFramework(selected) as FrameworkData);
  }, [selected]);

  const statutesForJuris = STATUTES.filter((s) => s.jurisdiction === selected || (selected === 'UK' && s.jurisdiction === 'UK'));
  const sourcesForJuris = SOURCES.filter((s) => !s.jurisdiction || s.jurisdiction === selected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-7 h-7 text-emerald-700 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-1">
              FreeLeased · Statute Atlas
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              The Caribbean + UK spine, jurisdiction by jurisdiction.
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              {STATUTES.length} primary statutes across {JURISDICTIONS.length} jurisdictions, sourced from the V229 v3 dataset.
              Each jurisdiction pulls its framework profile from <code className="text-xs bg-slate-100 px-1 rounded">src/data/frameworks/&lt;jurisdiction&gt;-framework.json</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Jurisdiction selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['BB', 'JM', 'KY', 'UK'] as JurisCode[]).map((code) => {
          const j = JURISDICTIONS.find((x) => x.code === code);
          if (!j) return null;
          const active = selected === code;
          return (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={cn(
                'text-left rounded-xl border p-4 transition shadow-sm',
                active ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <div className={cn('rounded-md px-2 py-1 mb-2 bg-gradient-to-r text-white text-[10px] font-mono font-bold tracking-widest inline-block', JURISDICTION_PALETTE[code])}>
                {code}
              </div>
              <h3 className="text-base font-bold text-slate-900">{j.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                {j.tenureSystem}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                capital · {j.capital}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {data && (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className={cn('rounded-xl shadow-sm p-5 sm:p-6 bg-gradient-to-r text-white', JURISDICTION_PALETTE[selected])}>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Jurisdiction framework · loaded from disk
              </p>
            </div>
            <h3 className="text-2xl font-bold">{data.jurisdiction?.name}</h3>
            <p className="text-white/85 mt-1 text-sm">
              {data.jurisdiction?.legalSystem && (
                <span className="capitalize mr-2">legal tradition · {data.jurisdiction.legalSystem}</span>
              )}
              {data.jurisdiction?.finalAppellateCourt && (
                <span className="mr-2">· final appellate · {data.jurisdiction.finalAppellateCourt}</span>
              )}
              {data.jurisdiction?.lastVerified && (
                <span>· verified {data.jurisdiction.lastVerified.slice(0, 10)}</span>
              )}
            </p>
            <p className="text-white/85 mt-2 text-sm leading-relaxed">
              <strong>Tenure:</strong>{' '}
              {JURISDICTIONS.find((j) => j.code === selected)?.tenureSystem}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-slate-500" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Primary acts in framework JSON
                </p>
              </div>
              {data.primaryActs && data.primaryActs.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {data.primaryActs.map((act) => (
                    <li key={act.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {act.shortTitle}{' '}
                            {act.chapterNumber && (
                              <span className="font-mono text-xs text-slate-500 ml-1">
                                {act.chapterNumber}
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-slate-700 mt-1 leading-relaxed">{act.summary}</p>
                          {act.leaseholderRelevantSections && act.leaseholderRelevantSections.length > 0 && (
                            <p className="mt-2 text-[11px] font-mono text-slate-500">
                              leaseholder sections:{' '}
                              {act.leaseholderRelevantSections.map((s, i) => (
                                <span key={i} className="inline-block px-1 mr-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                                  {s}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {act.conviction || 'established'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No primary acts in this framework file.</p>
              )}
            </div>

            <div className="space-y-6">
              {data.regulatoryBodies && data.regulatoryBodies.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Regulatory bodies
                    </p>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-1.5">
                    {data.regulatoryBodies.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.tribunalSystem && data.tribunalSystem.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Tribunal system
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1.5">
                    {data.tribunalSystem.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Statutes from spine */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              All statutes from spine.ts that apply to {selected} ({statutesForJuris.length})
            </p>
            <ul className="divide-y divide-slate-100">
              {statutesForJuris.map((s) => (
                <li key={s.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900">{s.shortTitle}</h4>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">{s.citation}</p>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">{s.covers}</p>
                      {s.note && <p className="text-xs text-amber-700 mt-1 italic">{s.note}</p>}
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs flex items-center gap-1 text-emerald-700 hover:text-emerald-900"
                    >
                      source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Data sources (from spine.ts SOURCES)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sourcesForJuris.map((src) => (
                <a
                  key={src.id}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-slate-200 p-3 hover:border-emerald-400 hover:bg-emerald-50/30 transition"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    tier {src.tier} · {src.license}
                  </p>
                  <h4 className="font-semibold text-slate-900 mt-1 text-sm">{src.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{src.gives}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1.5">cadence · {src.cadence}</p>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}