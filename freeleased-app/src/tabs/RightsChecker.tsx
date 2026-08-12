import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, ExternalLink, Filter } from 'lucide-react';
import { HIDDEN_RIGHTS, STATUTES, JURISDICTIONS } from '../lib/data';
import { cn } from '../lib/cn';

const AXIS_LABEL: Record<string, string> = {
  resident: 'Resident',
  tenure_building: 'Tenure & building',
  contracts: 'Contracts',
  hidden_rights: 'Hidden rights',
};

const AXIS_COLOR: Record<string, string> = {
  resident: 'bg-sky-50 text-sky-800 border-sky-200',
  tenure_building: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  contracts: 'bg-amber-50 text-amber-800 border-amber-200',
  hidden_rights: 'bg-purple-50 text-purple-800 border-purple-200',
};

const CONV_STYLE: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  primary: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  quantitative: 'bg-sky-100 text-sky-800 border-sky-300',
  inference: 'bg-amber-100 text-amber-800 border-amber-300',
  pending: 'bg-slate-100 text-slate-700 border-slate-300',
};
const CONV_EMOJI: Record<string, string> = {
  verified: '✓', confirmed: '🔥', primary: '⭐', quantitative: '📊', inference: '💭', pending: '⏳',
};

export default function RightsChecker() {
  const [query, setQuery] = useState('');
  const [axis, setAxis] = useState<string>('all');
  const [jur, setJur] = useState<string>('all');

  const filtered = useMemo(() => {
    return HIDDEN_RIGHTS.filter((r) => {
      if (axis !== 'all' && r.axis !== axis) return false;
      if (jur !== 'all' && !r.jurisdictions.includes(jur as any)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.plain.toLowerCase().includes(q) && !r.remedy.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, axis, jur]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-1">
              FreeLeased · Rights Checker
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {HIDDEN_RIGHTS.length} hidden-rights patterns.
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              Each pattern is anchored to one or more statutes in <code className="text-xs bg-slate-100 px-1 rounded">spine.ts</code>.
              Filter by jurisdiction, axis, or search the plain-English text.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Search className="w-3 h-3" /> search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="title, plain, remedy…"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> axis
            </span>
            <select
              value={axis}
              onChange={(e) => setAxis(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="all">All axes</option>
              <option value="resident">Resident</option>
              <option value="tenure_building">Tenure & building</option>
              <option value="contracts">Contracts</option>
              <option value="hidden_rights">Hidden rights</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> jurisdiction
            </span>
            <select
              value={jur}
              onChange={(e) => setJur(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="all">All jurisdictions</option>
              {JURISDICTIONS.map((j) => (
                <option key={j.code} value={j.code}>
                  {j.code} · {j.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Showing <strong>{filtered.length}</strong> of {HIDDEN_RIGHTS.length} patterns
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <motion.li
            key={r.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                #{r.id}
              </span>
              <span className={cn('text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border', AXIS_COLOR[r.axis])}>
                {AXIS_LABEL[r.axis]}
              </span>
              <span className={cn('text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border', CONV_STYLE[r.conviction])}>
                {CONV_EMOJI[r.conviction]} {r.conviction}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mt-1 leading-snug">{r.title}</h3>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">{r.plain}</p>
            <p className="text-xs text-slate-500 mt-2">
              <strong className="text-slate-700">Remedy:</strong> {r.remedy}
            </p>
            {r.limitationPeriod && (
              <p className="text-xs text-amber-700 mt-1">
                <strong>Limitation:</strong> {r.limitationPeriod}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {r.jurisdictions.map((j) => (
                <span key={j} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {j}
                </span>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-600">
              <span className="font-semibold">Statutes: </span>
              {r.statuteIds.map((sid, i) => {
                const s = STATUTES.find((st) => st.id === sid);
                if (!s) return <span key={i}>{sid}</span>;
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 text-emerald-700 hover:text-emerald-900 mx-1"
                  >
                    {s.shortTitle} {s.citation}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                );
              })}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}