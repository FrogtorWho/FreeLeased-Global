import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  FileSearch,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { analyzeLease, DEMO_LEASE, type LeaseAnalysis, type JurisdictionCode } from '../lib/lease-patterns';
import { HIDDEN_RIGHTS, JURISDICTIONS, STATUTES } from '../lib/data';
import { cn } from '../lib/cn';

const CONVICTION_STYLE: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  primary: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  quantitative: 'bg-sky-100 text-sky-800 border-sky-300',
  inference: 'bg-amber-100 text-amber-800 border-amber-300',
  pending: 'bg-slate-100 text-slate-700 border-slate-300',
};

const CONVICTION_EMOJI: Record<string, string> = {
  verified: '✓',
  confirmed: '🔥',
  primary: '⭐',
  quantitative: '📊',
  inference: '💭',
  pending: '⏳',
};

const ENGINE_COLORS = ['#047857', '#0ea5e9', '#f59e0b', '#a855f7'];

export default function LeaseReader() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<LeaseAnalysis | null>(null);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>('BB');
  const [running, setRunning] = useState(false);

  const stats = useMemo(() => {
    return {
      patterns: HIDDEN_RIGHTS.length,
      statutes: STATUTES.length,
      jurisdictions: JURISDICTIONS.length,
    };
  }, []);

  function run() {
    setRunning(true);
    setTimeout(() => {
      setAnalysis(analyzeLease(text || DEMO_LEASE, jurisdiction));
      setRunning(false);
    }, 350);
  }

  function loadDemo() {
    setText(DEMO_LEASE);
    setRunning(true);
    setTimeout(() => {
      setAnalysis(analyzeLease(DEMO_LEASE, jurisdiction));
      setRunning(false);
    }, 350);
  }

  function clearAll() {
    setText('');
    setAnalysis(null);
  }

  const radarData = analysis
    ? analysis.engines.map((e) => ({ subject: e.label, A: e.score, fullMark: 100 }))
    : [];

  const matchedPatterns = analysis
    ? analysis.matches.map((m) => {
        const pattern = HIDDEN_RIGHTS.find((p) => p.id === m.patternId);
        return { ...m, pattern };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-1">
              FreeLeased · Lease Reader
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Paste a lease. Get the 20-pattern verdict.
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              We scan the text for phrases that suggest one or more of the{' '}
              <strong>{stats.patterns}</strong> hidden-rights patterns defined in the V229 v3 dataset.
              Each match cites a real statute from the {stats.statutes}-statute spine across{' '}
              <strong>{stats.jurisdictions}</strong> Caribbean + UK jurisdictions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as JurisdictionCode)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {JURISDICTIONS.filter((j) => j.inPilot).map((j) => (
                <option key={j.code} value={j.code}>
                  {j.code} · {j.name}
                </option>
              ))}
            </select>
            <button
              onClick={loadDemo}
              className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load sample lease
            </button>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-3">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Lease text</span>
          <span className="text-xs text-slate-500 ml-2">
            Paste any clause set, an extract, or a full lease. Nothing is uploaded — analysis runs in your browser.
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lease clauses here, or click Load sample lease above…"
            rows={8}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={run}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm disabled:opacity-60"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            {analysis ? 'Re-run analysis' : 'Run analysis'}
          </button>
          {analysis && (
            <button
              onClick={clearAll}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-slate-500">
            {text ? `${text.trim().split(/\s+/).filter(Boolean).length} words · ${text.length} chars` : 'No text yet'}
          </span>
        </div>
      </div>

      {/* Verdict */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Verdict banner */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  analysis.overallConviction === 'verified' && 'bg-emerald-100 text-emerald-700',
                  analysis.overallConviction === 'partial' && 'bg-amber-100 text-amber-700',
                  analysis.overallConviction === 'open' && 'bg-slate-100 text-slate-600',
                )}>
                  {analysis.overallConviction === 'verified' && <CheckCircle2 className="w-6 h-6" />}
                  {analysis.overallConviction === 'partial' && <AlertCircle className="w-6 h-6" />}
                  {analysis.overallConviction === 'open' && <HelpCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Verdict</p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {analysis.overallConviction === 'verified' && 'Multiple statute breaches detected'}
                    {analysis.overallConviction === 'partial' && 'Some clauses warrant a closer look'}
                    {analysis.overallConviction === 'open' && 'Insufficient evidence'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {analysis.matches.length} pattern{analysis.matches.length !== 1 ? 's' : ''} matched · Jurisdiction:{' '}
                    <strong>{analysis.jurisdiction}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {analysis.engines.map((e, i) => (
                  <div key={e.id} className="text-center px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{e.label}</p>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: ENGINE_COLORS[i] }}>
                      {e.score}
                    </p>
                    <p className="text-[10px] text-slate-500">{e.verdict}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar + bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                4-Engine DS-Gauge
              </p>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      dataKey="A"
                      stroke="#047857"
                      fill="#10b981"
                      fillOpacity={0.45}
                      isAnimationActive
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Pattern severity (top {Math.min(8, matchedPatterns.length)})
              </p>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={matchedPatterns.slice(0, 8).map((m) => ({
                    name: `#${m.patternId}`,
                    severity: m.severity,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip wrapperClassName="!text-xs" />
                    <Bar dataKey="severity" radius={[4, 4, 0, 0]}>
                      {matchedPatterns.slice(0, 8).map((_, i) => (
                        <Cell key={i} fill={ENGINE_COLORS[i % ENGINE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pattern list */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Matched hidden-rights patterns ({matchedPatterns.length})
            </p>
            {matchedPatterns.length === 0 ? (
              <p className="text-sm text-slate-500">
                No patterns matched. The lease text does not contain phrases our rules expect — try the sample lease.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {matchedPatterns.map((m) => (
                  <li key={m.patternId} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            #{m.patternId}
                          </span>
                          <h4 className="font-semibold text-slate-900">
                            {m.pattern?.title || `Pattern ${m.patternId}`}
                          </h4>
                          {m.pattern && (
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-widest', CONVICTION_STYLE[m.pattern.conviction])}>
                              {CONVICTION_EMOJI[m.pattern.conviction]} {m.pattern.conviction}
                            </span>
                          )}
                          {m.pattern?.jurisdictions && (
                            <span className="text-[10px] font-mono text-slate-500">
                              [{m.pattern.jurisdictions.join(' · ')}]
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{m.note}</p>
                        {m.snippet && (
                          <p className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 leading-relaxed">
                            {m.snippet}
                          </p>
                        )}
                        {m.triggers.length > 0 && (
                          <p className="mt-2 text-[10px] font-mono text-slate-500">
                            matched phrases:{' '}
                            {m.triggers.slice(0, 6).map((t, i) => (
                              <span key={i} className="inline-block px-1 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 mr-1">
                                {t}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 w-24">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Severity</p>
                        <p className="text-2xl font-bold text-emerald-700 tabular-nums">{m.severity}</p>
                      </div>
                    </div>
                    {m.pattern?.statuteIds && m.pattern.statuteIds.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-600">
                        <span className="font-semibold">Statutes: </span>
                        {m.pattern.statuteIds.map((sid, i) => {
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
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileSearch className="w-4 h-4 text-slate-500" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                First 500 chars of lease
              </p>
            </div>
            <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
              {analysis.preview}
              {analysis.charCount > 500 && '…'}
            </pre>
          </div>
        </motion.div>
      )}

      {!analysis && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center text-sm text-emerald-900">
          Click <strong>Load sample lease</strong> or paste your own and hit <strong>Run analysis</strong>.
        </div>
      )}
    </div>
  );
}