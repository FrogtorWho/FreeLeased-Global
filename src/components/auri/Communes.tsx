import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { RESIDENTS } from "../../data/fixtures";
import { communeAggregate } from "../../lib/engines";
import { JURISDICTION_NAME } from "./ui-helpers";
import { MethodologyNote, Formula, CHART } from "./primitives";

export function Communes() {
  const [code, setCode] = useState<"BB" | "JM" | "KY">("BB");
  const agg = useMemo(() => communeAggregate(RESIDENTS, code), [code]);
  const data = agg.patternPrevalence.slice(0, 10).map((p) => ({ name: `#${p.rightId}`, title: p.title, pct: p.pct, count: p.count }));

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Users className="h-4 w-4 text-teal-400" /> Cryptographic Communes; privacy-preserving aggregate
          </div>
          <div className="flex gap-1">
            {(["BB", "JM", "KY"] as const).map((j) => (
              <button key={j} onClick={() => setCode(j)}
                className={`text-xs px-2.5 py-1 rounded border ${code === j ? "bg-teal-500/20 border-teal-500/40 text-teal-200" : "border-teal-900/40 text-slate-400 hover:text-slate-200"}`}>
                {JURISDICTION_NAME[j]}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Coalitions of residents surface aggregate hidden-rights prevalence without exposing any single dossier. The layer
          enforces k-anonymity ≥ 5 before any figure is released.
        </p>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="border-slate-700 text-slate-300">Cohort {agg.cohortSize}</Badge>
          <Badge variant="outline" className={agg.kAnonymitySafe ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30"}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> k-anonymity {agg.kAnonymitySafe ? "safe" : "UNSAFE"}
          </Badge>
        </div>
      </Card>

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <div className="text-sm font-semibold text-slate-200 mb-3">Hidden-rights prevalence across the {JURISDICTION_NAME[code]} cohort</div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" domain={[0, 100]} stroke={CHART.axis} fontSize={CHART.axisFont} unit="%" />
              <YAxis type="category" dataKey="name" stroke={CHART.axis} fontSize={CHART.axisFont} width={40} />
              <Tooltip
                cursor={{ fill: "#1e293b55" }}
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number, _n, p) => [`${v}% (${p.payload.count} residents)`, p.payload.title]}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => <Cell key={i} fill={`hsl(${200 - i * 8} 80% 55%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <MethodologyNote title="Model: k-anonymity privacy floor">
        <p>A prevalence figure is released only when the cohort has at least <Formula>k = 5</Formula> residents, so no single dossier can be re-identified from an aggregate. A horizontal bar is the right encoding here: it ranks categorical patterns by a single magnitude (percentage of the cohort) and keeps long statutory titles legible.</p>
      </MethodologyNote>
    </div>
  );
}
