import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { SweepResult } from "../../lib/gates";
import { SectionHeader, ChartCard, MethodologyNote, Formula, CHART } from "./primitives";

const SAMPLE = `The organization will leverage a comprehensive, robust ecosystem to empower residents \u2014\u2014 moreover, it is cutting-edge. Contact Dr Smith at test@example.com or SW1A 1AA.`;

export function GatesTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SweepResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(input: string) {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/gates/sweep", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: input }),
      });
      const b = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(b.error ?? `HTTP ${res.status}`); return; }
      setResult(b);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }

  const hitData = result?.results.map((g) => ({ gate: g.gate, hits: g.hits.length, pass: g.pass })) ?? [];

  return (
    <div className="space-y-4">
      <SectionHeader icon={<ShieldCheck className="h-5 w-5" />} title="Binding gates; server-side quality sweep"
        description="Every deliverable must return 0 hits on all four gates before it can ship. This runs the real regex validators server-side (POST /api/gates/sweep); the same code path used to vet dossiers." />

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Paste text to sweep…" className="bg-slate-950 border-teal-900/40 text-sm" />
        <div className="flex gap-2 mt-2">
          <Button size="sm" disabled={busy || !text.trim()} onClick={() => run(text)} className="bg-teal-600 hover:bg-teal-500">Run sweep</Button>
          <Button size="sm" variant="outline" className="border-slate-700" onClick={() => { setText(SAMPLE); run(SAMPLE); }}>Load a dirty sample</Button>
        </div>
        {err && <p className="text-xs text-rose-300 mt-2">Sweep failed: {err}</p>}
      </Card>

      <MethodologyNote title="What each gate actually matches">
        <p><strong>Gate 1 · PII v5</strong>; 5 regex needle-families: honorific + real name <Formula>{"(Mr|Mrs|Dr|…)\\s+[A-Z][a-z]+"}</Formula>, UK postcode, email, UK mobile, generic phone. Enforces pseudonyms only.</p>
        <p><strong>Gate 2 · UK English</strong>; 22 US-spelling patterns (<Formula>organization</Formula>, <Formula>behavior</Formula>, <Formula>defense</Formula>, <Formula>-ize</Formula> forms…). 0 tolerated.</p>
        <p><strong>Gate 3 · AI tell</strong>; 18 give-away phrases (<Formula>leverage</Formula>, <Formula>robust</Formula>, <Formula>ecosystem</Formula>, <Formula>delve</Formula>, <Formula>moreover</Formula>…).</p>
        <p><strong>Gate 4 · Em-dash chain</strong>; two or more consecutive em-dashes <Formula>{"\\u2014{2,}"}</Formula>. Pass ⇔ <Formula>Σ hits = 0</Formula> across all four.</p>
      </MethodologyNote>

      {result && (
        <Card className={`p-4 border ${result.pass ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
          <div className="flex items-center gap-2 mb-3">
            {result.pass ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-rose-400" />}
            <span className={`font-semibold ${result.pass ? "text-emerald-300" : "text-rose-300"}`}>
              {result.pass ? "Clean; 0 hits across all 4 gates" : `${result.totalHits} hit(s); deliverable blocked`}
            </span>
          </div>
          {!result.pass && (
            <div className="mb-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Hits per gate <span className="normal-case text-slate-600">· bar · count</span></div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={hitData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="gate" stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} />
                  <YAxis allowDecimals={false} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: "#f43f5e10" }} />
                  <Bar dataKey="hits" radius={[4, 4, 0, 0]}>
                    {hitData.map((d, i) => <Cell key={i} fill={d.pass ? "#34d399" : "#f43f5e"} />)}
                    <LabelList dataKey="hits" position="top" fill="#94a3b8" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="space-y-2">
            {result.results.map((g) => (
              <div key={g.gate} className="border border-teal-900/40 rounded-md p-2.5 bg-[#061116]/60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200">{g.gate}</span>
                  <Badge variant="outline" className={g.pass ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30"}>
                    {g.pass ? "0 hits" : `${g.hits.length} hit(s)`}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{g.description}</p>
                {g.hits.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {g.hits.slice(0, 6).map((h, i) => (
                      <div key={i} className="text-xs font-mono text-rose-300/90">
                        “{h.match}” <span className="text-slate-400">— {h.context}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
