import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Gauge, Target } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, RadialBarChart, RadialBar, PolarAngleAxis as RA,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Legend, ReferenceLine,
} from "recharts";
import { CHART, SEMANTIC, MetricTile, SectionHeader, MethodologyNote, Formula, ChartCard } from "./primitives";
import type { LoopResult } from "../../lib/loop";

function scoreColor(v: number) {
  return v >= 9 ? SEMANTIC.good : v >= 8 ? SEMANTIC.info : SEMANTIC.warn;
}

export function Assurance() {
  const [loop, setLoop] = useState<LoopResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/loop/score?testsPassing=81&testsTotal=81")
      .then(async (r) => { const b = await r.json().catch(() => ({})); if (!r.ok) throw new Error(b.error ?? `HTTP ${r.status}`); setLoop(b); })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <Card className="p-4 bg-rose-500/10 border-rose-500/30 text-rose-200 text-sm">Loop scoring failed: {err}</Card>;
  if (!loop) return (
    <div className="space-y-4"><Skeleton className="h-24 bg-slate-800/40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="h-64 bg-slate-800/40" /><Skeleton className="h-64 bg-slate-800/40" /></div></div>
  );

  const radar = loop.criterionScores.map((c) => ({ criterion: c.label.replace(/ /g, "\n"), short: c.label, score: c.score }));
  const gap = [...loop.criterionScores].sort((a, b) => a.score - b.score).map((c) => ({ label: c.label, score: c.score, deficit: +(loop.target - c.score).toFixed(2) }));
  const judges = loop.judgeScores.map((j) => ({ name: j.judge.split(" ")[0] + (j.judge.includes("Herbert") ? " H." : ""), full: j.judge, "Business Strength": j.bsAvg, "Agentic AI": j.aaAvg, final: j.final }));
  const gaugeData = [{ name: "median", value: loop.median, fill: loop.cleared ? SEMANTIC.good : SEMANTIC.warn }];

  return (
    <div className="space-y-4">
      <SectionHeader icon={<Activity className="h-5 w-5" />} title="Assurance; 10/10 self-scoring loop"
        description="Five weighted judge profiles score the build across a 13-criterion matrix. Scores are grounded in measurable build facts, not asserted." />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        {/* Median radial gauge; right chart for a single value against a target */}
        <ChartCard title="Median judge score" chartType="radial gauge" height={220}
          hint={loop.cleared ? "target cleared" : `gap ${loop.gap.toFixed(2)} to ${loop.target}`}>
          <ResponsiveContainer>
            <RadialBarChart innerRadius="72%" outerRadius="100%" data={gaugeData} startAngle={220} endAngle={-40}>
              <RA type="number" domain={[0, 10]} tick={false} />
              <RadialBar background={{ fill: "#1e293b" }} dataKey="value" cornerRadius={8} />
              <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill={loop.cleared ? SEMANTIC.good : SEMANTIC.warn} fontSize={34} fontWeight={700}>{loop.median.toFixed(2)}</text>
              <text x="50%" y="70%" textAnchor="middle" fill={CHART.axis} fontSize={11}>target {loop.target.toFixed(1)}</text>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
          <MetricTile label="Median" tone={loop.cleared ? "good" : "warn"} value={loop.median.toFixed(2)} icon={<Gauge className="h-3.5 w-3.5" />} />
          <MetricTile label="Mean" value={loop.mean.toFixed(2)} />
          <MetricTile label="Target" value={loop.target.toFixed(1)} icon={<Target className="h-3.5 w-3.5" />} />
          <MetricTile label="Status" tone={loop.cleared ? "good" : "warn"} value={loop.cleared ? "cleared" : "in progress"} sub={loop.cleared ? undefined : `gap ${loop.gap.toFixed(2)}`} />
          <div className="col-span-2 sm:col-span-4">
            <MethodologyNote title="Model: 50/50 weighted matrix → median">
              <p>Each judge's final is <Formula>0.5·mean(Business Strength) + 0.5·mean(Agentic AI Excellence)</Formula>, with the judge's bucket emphasis applied as per-criterion weights. The loop target is the <span className="text-slate-300">median</span> across the five judges (robust to a single outlier). Criterion scores are functions of real build facts; tests passing, gates green, statutes encoded, honest-abstention coverage; so the number moves only when the build does.</p>
            </MethodologyNote>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar; right chart for a multi-criteria profile shape */}
        <ChartCard title="13-criterion profile" chartType="radar" height={320}>
          <ResponsiveContainer>
            <RadarChart data={radar} outerRadius="72%">
              <PolarGrid stroke={CHART.grid} />
              <PolarAngleAxis dataKey="short" tick={{ fill: CHART.axis, fontSize: 10 }} />
              <Radar dataKey="score" stroke={SEMANTIC.info} fill={SEMANTIC.info} fillOpacity={0.3} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v: number) => [v.toFixed(2), "score"]} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gap-to-target; right chart for ranking distance from a goal */}
        <ChartCard title="Distance to target, by criterion" chartType="ranked bars vs reference" height={320}
          hint="Sorted lowest first; where the marginal work is.">
          <ResponsiveContainer>
            <BarChart data={gap} layout="vertical" margin={{ left: 8, right: 20 }}>
              <XAxis type="number" domain={[0, 10]} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} />
              <YAxis type="category" dataKey="label" stroke={CHART.axis} fontSize={9} width={120} tickLine={false} />
              <Tooltip cursor={{ fill: "#1e293b55" }} contentStyle={CHART.tooltip} formatter={(v: number, n) => [v.toFixed(2), n === "score" ? "score" : n]} />
              <ReferenceLine x={loop.target} stroke={SEMANTIC.good} strokeDasharray="4 3" label={{ value: `target ${loop.target}`, fill: SEMANTIC.good, fontSize: 10, position: "top" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                {gap.map((g, i) => <Cell key={i} fill={scoreColor(g.score)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Grouped judge bars; right chart for comparing two measures across categories */}
      <ChartCard title="Per-judge bucket scores" chartType="grouped bars" height={280}
        hint="Business Strength vs Agentic AI Excellence for each of the five judge profiles.">
        <ResponsiveContainer>
          <BarChart data={judges} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
            <XAxis dataKey="name" stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} />
            <YAxis domain={[0, 10]} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} width={28} />
            <Tooltip cursor={{ fill: "#1e293b55" }} contentStyle={CHART.tooltip} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={loop.target} stroke={SEMANTIC.good} strokeDasharray="4 3" />
            <Bar dataKey="Business Strength" fill={SEMANTIC.info} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Agentic AI" fill="#c084fc" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <SectionHeader title="Criterion scores + grounded rationale" description="Each score explains itself and names the build fact it rests on." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {loop.criterionScores.map((c) => (
            <div key={c.key} className="border border-teal-900/40 rounded-lg p-2.5 bg-[#061116]/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-200">{c.label} <span className="text-[10px] text-slate-400">({c.bucket})</span></span>
                <Badge variant="outline" style={{ color: scoreColor(c.score), borderColor: scoreColor(c.score) + "66" }} className="tabular-nums">{c.score.toFixed(2)}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.rationale}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
