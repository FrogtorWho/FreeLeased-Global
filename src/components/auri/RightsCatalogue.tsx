import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, Scale, ShieldQuestion } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { HIDDEN_RIGHTS, STATUTES } from "../../data/spine";
import { CONVICTION_LABEL } from "./ui-helpers";
import { SectionHeader, ChartCard, MethodologyNote, Formula, MetricTile, CHART } from "./primitives";

const AXIS_LABEL: Record<string, string> = {
  resident: "Resident", tenure_building: "Tenure + Building", contracts: "Contracts", hidden_rights: "Hidden Rights",
};
const AXIS_ORDER = ["resident", "tenure_building", "contracts", "hidden_rights"] as const;
const AXIS_HEX = ["#14b8a6", "#22d3ee", "#3b82f6", "#6366f1"];
const CONV_ORDER = ["confirmed", "verified", "primary", "quantitative", "inference", "pending"] as const;
const CONV_HEX: Record<string, string> = {
  confirmed: "#34d399", verified: "#14b8a6", primary: "#22d3ee",
  quantitative: "#3b82f6", inference: "#f59e0b", pending: "#f43f5e",
};

export function RightsCatalogue() {
  const [q, setQ] = useState("");
  const rights = HIDDEN_RIGHTS.filter(
    (p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.plain.toLowerCase().includes(q.toLowerCase())
  );
  const byAxis = AXIS_ORDER.map((a) => ({ axis: AXIS_LABEL[a], count: HIDDEN_RIGHTS.filter((r) => r.axis === a).length }));
  const byConviction = CONV_ORDER
    .map((c) => ({ conviction: c, count: HIDDEN_RIGHTS.filter((r) => r.conviction === c).length }))
    .filter((r) => r.count > 0);
  const anchored = HIDDEN_RIGHTS.filter((r) => r.statuteIds.length > 0).length;

  return (
    <div className="space-y-4">
      <SectionHeader icon={<ShieldQuestion className="h-5 w-5" />} title="Hidden-rights catalogue"
        description="Each right is the resident-facing flip of an exploitation pattern, anchored to a named statute with a live public URL. Search the 20, or read the shape of the catalogue below." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile label="Rights patterns" value={HIDDEN_RIGHTS.length} sub="resident-facing flips" />
        <MetricTile label="Statute-anchored" value={`${anchored}/${HIDDEN_RIGHTS.length}`} tone="good" sub="every right cites law" />
        <MetricTile label="Axes covered" value={AXIS_ORDER.length} sub="resident → hidden rights" />
        <MetricTile label="Showing" value={rights.length} sub={q ? `filtered by “${q}”` : "no filter"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Rights by axis" chartType="bar · count" height={220}
          hint="Which of the four data axes each right defends; resident, tenure/building, contracts, or hidden-rights.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byAxis} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="axis" stroke={CHART.axis} fontSize={10} tickLine={false} interval={0} />
              <YAxis allowDecimals={false} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: "#14b8a610" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byAxis.map((_, i) => <Cell key={i} fill={AXIS_HEX[i % AXIS_HEX.length]} />)}
                <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rights by evidence conviction" chartType="ranked bar · count" height={220}
          hint="How strongly each right's statutory anchor is evidenced, on the shared conviction ladder.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byConviction} layout="vertical" margin={{ top: 4, right: 28, left: 24, bottom: 4 }}>
              <CartesianGrid stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" allowDecimals={false} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="conviction" width={92} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: "#14b8a610" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {byConviction.map((r, i) => <Cell key={i} fill={CONV_HEX[r.conviction]} />)}
                <LabelList dataKey="count" position="right" fill="#94a3b8" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <MethodologyNote title="How the catalogue is constructed">
        <p>Each exploitation pattern in the audit set has a dual: the <strong>right</strong> a resident can assert to defend against it. The catalogue is that bijection; <Formula>exploitation_pattern ↦ statutory_right</Formula>.</p>
        <p>A right is only listed if it is <strong>statute-anchored</strong>: it carries one or more <Formula>statuteId</Formula>s resolving to a real citation + live URL in the Data Spine, and inherits that statute's conviction rung.</p>
        <p>The <Formula>axis</Formula> tags which data plane the right operates on (resident, tenure/building, contracts, hidden-rights), so coverage gaps are visible at a glance.</p>
      </MethodologyNote>

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <Input placeholder="Search rights…" value={q} onChange={(e) => setQ(e.target.value)} className="bg-slate-950 border-teal-900/40 max-w-sm" />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rights.map((p) => {
          const cfg = CONVICTION_LABEL[p.conviction];
          return (
            <Card key={p.id} className="p-4 bg-[#071b21]/70 border-teal-900/40">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="border-teal-500/40 text-teal-300 shrink-0">#{p.id}</Badge>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-100 text-sm">{p.title}</h4>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">{AXIS_LABEL[p.axis]}</Badge>
                    <Badge variant="outline" className={`${cfg.className} text-[10px]`}>{cfg.icon} {cfg.label}</Badge>
                    {p.jurisdictions.map((j) => (
                      <span key={j} className="text-[10px] font-mono text-slate-400">{j}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2">{p.plain}</p>
              <div className="text-xs text-emerald-400/90 mt-1"><span className="font-medium">Remedy:</span> <span className="text-slate-300">{p.remedy}</span></div>
              {p.exploitationCounterpart && (
                <div className="text-[11px] text-rose-300/80 mt-1">Defends against: {p.exploitationCounterpart}</div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.statuteIds.map((sid) => {
                  const s = STATUTES.find((x) => x.id === sid);
                  return s ? (
                    <a key={sid} href={s.url} target="_blank" rel="noreferrer"
                      className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 hover:text-teal-300 inline-flex items-center gap-0.5">
                      <Scale className="h-2.5 w-2.5" />{s.shortTitle} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : null;
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
