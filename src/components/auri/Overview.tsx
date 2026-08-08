import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Scale, Database, Globe2, ShieldCheck, AlertTriangle, ListChecks, ScanLine, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CHART, SEMANTIC, MetricTile, Wordmark, LogoMark } from "./primitives";

interface Summary {
  residents: number; statutes: number; sources: number; patterns: number;
  jurisdictions: number; roadmapJurisdictions: number;
  signOffState: Record<string, number>; rightsEngaged: number; abstainInstances: number;
}

export function Overview({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [s, setS] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/summary").then(async (r) => {
      const b = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(b.error ?? `HTTP ${r.status}`);
      setS(b);
    }).catch((e) => setErr(e.message));
  }, []);

  const donut = s ? [
    { name: "all-green", value: s.signOffState["all-green"] ?? 0, fill: SEMANTIC.good },
    { name: "hitl-required", value: s.signOffState["hitl-required"] ?? 0, fill: SEMANTIC.warn },
    { name: "rejected", value: s.signOffState["rejected"] ?? 0, fill: SEMANTIC.bad },
  ].filter((d) => d.value > 0) : [];

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-8 bg-[#06181e]/60 border-teal-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/8 to-blue-600/10 pointer-events-none" />
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3.5 mb-3">
            <LogoMark size={44} />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight leading-none"><Wordmark /></h1>
              <p className="text-sm text-slate-300 font-medium mt-1.5">Leasehold Governance &amp; Right-to-Manage</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-teal-500/80 mt-1">AI for Real Estate &amp; Development · service-charge audit · RTM · building safety</p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-300 max-w-3xl mt-4">
            Turns a leaseholder's own documents and real statutory data into a per-resident audit of hidden rights —
            flagging unlawful service charges, missed s.20 consultation, and building-safety liability, with an action
            plan, honest abstention where data is thin, and resident sign-off. Every cell carries 5-tuple provenance.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            {["statutory diagnostics engine", "20 leasehold rights", "consensus + HITL sign-off", "$0 compute · deterministic"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-200 border border-teal-500/25 font-medium">{t}</span>
            ))}
          </div>
        </div>
      </Card>

      {err && <Card className="p-4 bg-rose-500/10 border-rose-500/30 text-rose-200 text-sm">Summary failed: {err}</Card>}
      {!s && !err && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 bg-slate-800/40" />)}</div>}

      {s && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => onNavigate("dossier")} className="text-left"><MetricTile icon={<Users className="h-3.5 w-3.5" />} label="Pilot residents" value={s.residents} sub="BB 20 · JM 15 · KY 15" /></button>
            <button onClick={() => onNavigate("rights")} className="text-left"><MetricTile icon={<ListChecks className="h-3.5 w-3.5" />} label="Hidden rights" value={s.patterns} sub={`${s.rightsEngaged} engaged across cohort`} /></button>
            <button onClick={() => onNavigate("spine")} className="text-left"><MetricTile icon={<Scale className="h-3.5 w-3.5" />} label="Statutes" value={s.statutes} sub="real citations + URLs" /></button>
            <button onClick={() => onNavigate("spine")} className="text-left"><MetricTile icon={<Database className="h-3.5 w-3.5" />} label="Data sources" value={s.sources} sub="Tiers 0–3, all $0" /></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
            <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
              <div className="text-sm font-semibold text-slate-200 mb-1">Dossier sign-off state</div>
              <div className="text-[11px] text-slate-400 mb-2">Consensus routes any abstaining dossier to human review before publish.</div>
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={donut} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="#0b1120">
                      {donut.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={CHART.tooltip} />
                    <text x="50%" y="47%" textAnchor="middle" fill="#e2e8f0" fontSize={24} fontWeight={700}>{s.residents}</text>
                    <text x="50%" y="58%" textAnchor="middle" fill={CHART.axis} fontSize={10}>dossiers</text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 text-[11px]">
                {donut.map((d) => <span key={d.name} className="flex items-center gap-1 text-slate-400"><span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.name} ({d.value})</span>)}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3 content-start">
              <MetricTile icon={<Globe2 className="h-3.5 w-3.5" />} label="Jurisdictions" value={`${s.jurisdictions} / ${s.roadmapJurisdictions}`} sub="pilot / roadmap" />
              <MetricTile icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />} label="All-green dossiers" tone="good" value={s.signOffState["all-green"] ?? 0} />
              <MetricTile icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-400" />} label="HITL required" tone="warn" value={s.signOffState["hitl-required"] ?? 0} sub={`${s.abstainInstances} abstain instances`} />
              <button onClick={() => onNavigate("gates")} className="text-left">
                <div className="rounded-xl border border-teal-900/40 bg-gradient-to-br from-teal-500/10 to-[#071b21]/60 p-3.5 h-full hover:border-teal-500/40 transition-colors">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5"><ScanLine className="h-3.5 w-3.5 text-teal-400" />Lease Audit</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">Statutory diagnostics</div>
                  <div className="text-[11px] text-teal-300/80 flex items-center gap-1 mt-1">run the clause check <ArrowRight className="h-3 w-3" /></div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
