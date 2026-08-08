import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlaskConical, Bot, ClipboardList, GitBranch, ExternalLink, RefreshCw, AlertTriangle, Clock, Microscope } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { SectionHeader, MethodologyNote, Formula, MetricTile, ChartCard, CHART, TABS_LIST } from "./primitives";

interface Registry { name: string; registry: string; url: string }
interface Plan { kind: string; target: string; jurisdictionCode: string; officialSources: { name: string; url: string }[]; checklist: string[]; rationale: string }
interface Task { id: string; kind: string; target: string; jurisdictionCode: string; status: string; rationale?: string; plan?: Plan }
interface MaintItem { kind: string; title: string; jurisdictionCode: string; lastReviewed: string; staleness: { ageDays: number; slaDays: number; stale: boolean; nextReview: string; pctToStale: number } }

function Expansion() {
  const [registries, setRegistries] = useState<Record<string, Registry>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sel, setSel] = useState("");
  const [active, setActive] = useState<Task | null>(null);
  const [assist, setAssist] = useState<{ loading: boolean; result?: unknown; error?: string } | null>(null);

  const loadTasks = () => fetch("/api/research-tasks").then((r) => r.json()).then((d) => setTasks(d.items ?? [])).catch(() => {});
  useEffect(() => {
    fetch("/api/research/registries").then((r) => r.json()).then((d) => {
      setRegistries(d.registries ?? {});
      const first = Object.keys(d.registries ?? {})[0] ?? "";
      setSel(first);
    }).catch(() => {});
    loadTasks();
  }, []);

  async function createTask() {
    if (!sel) return;
    const res = await fetch("/api/research/task", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: sel }),
    });
    const b = await res.json().catch(() => ({}));
    if (res.ok) { setActive(b.task); setAssist(null); loadTasks(); }
  }

  async function runAssist(id: string) {
    setAssist({ loading: true });
    const res = await fetch(`/api/research/task/${id}/assist`, { method: "POST" });
    const b = await res.json().catch(() => ({}));
    if (!b.ok) setAssist({ loading: false, error: b.error ?? "assist unavailable" });
    else setAssist({ loading: false, result: b.candidate ?? b.raw });
    loadTasks();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
      <div className="space-y-4">
        <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
            <GitBranch className="h-4 w-4 text-teal-400" /> Expand to a new jurisdiction
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Pick a jurisdiction to open a research task. The task points the agent at the real official registry and a
            standard 8-point legal skeleton. Nothing becomes citable until it clears the database-vs-originals gate.
          </p>
          <div className="flex gap-2 flex-wrap items-center">
            <select value={sel} onChange={(e) => setSel(e.target.value)} className="bg-slate-950 border border-teal-900/40 rounded px-2 py-1.5 text-sm text-slate-200">
              {Object.entries(registries).map(([code, r]) => <option key={code} value={code}>{code}; {r.name}</option>)}
            </select>
            <Button size="sm" onClick={createTask} className="bg-teal-600 hover:bg-teal-500">Open research task</Button>
          </div>
        </Card>

        {active?.plan && (
          <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
            <div className="text-sm font-semibold text-slate-200">{active.plan.target}; research plan</div>
            <p className="text-xs text-slate-400 mt-1">{active.plan.rationale}</p>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-3 mb-1">Official sources</div>
            {active.plan.officialSources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="block text-sm text-teal-400 hover:underline inline-flex items-center gap-1">
                {s.name} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-3 mb-1">Checklist</div>
            <ul className="space-y-0.5">
              {active.plan.checklist.map((c, i) => <li key={i} className="text-xs text-slate-400 flex gap-1.5"><span className="text-slate-600">{i + 1}.</span> {c}</li>)}
            </ul>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="border-slate-700" onClick={() => runAssist(active.id)}>
                <Bot className="h-4 w-4 mr-1" /> Run AI research-assist (zero-cost)
              </Button>
            </div>
            {assist?.loading && <p className="text-xs text-slate-400 mt-2">Drafting research plan via the in-pod LLM gateway…</p>}
            {assist?.error && <p className="text-xs text-amber-300 mt-2">Assist unavailable: {assist.error}; the deterministic plan above still stands.</p>}
            {assist?.result != null && (
              <div className="mt-2">
                <Badge variant="outline" className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] mb-1">AI candidate; UNVERIFIED, must clear the originals gate</Badge>
                <pre className="text-[11px] text-slate-300 bg-slate-950/60 border border-teal-900/40 rounded p-2 overflow-auto max-h-64 whitespace-pre-wrap">{JSON.stringify(assist.result, null, 2)}</pre>
              </div>
            )}
          </Card>
        )}
      </div>

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40 h-fit">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200"><ClipboardList className="h-4 w-4 text-teal-400" /> Research queue</div>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400" onClick={loadTasks}><RefreshCw className="h-3.5 w-3.5" /></Button>
        </div>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-teal-900/40 bg-[#061116]/40 py-8 text-center">
            <ClipboardList className="h-6 w-6 text-slate-600" />
            <p className="text-sm text-slate-400">No research tasks yet</p>
            <p className="text-xs text-slate-500">Open a claim on the left to start a verification run.</p>
          </div>
        )}
        <ScrollArea className="max-h-[420px]">
          <div className="space-y-1.5">
            {tasks.map((t) => (
              <div key={t.id} className="border border-teal-900/40 rounded-md p-2.5 bg-[#061116]/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-200">{t.target} <span className="text-[10px] text-slate-400 font-mono">{t.jurisdictionCode}</span></span>
                  <Badge variant="outline" className={t.status === "verified" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : t.status === "drafted" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-slate-700/30 text-slate-400 border-slate-700"}>{t.status}</Badge>
                </div>
                <div className="text-[11px] text-slate-400">{t.kind}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

function ChartCardStatus({ statusData }: { statusData: { status: string; count: number; hex: string }[] }) {
  return (
    <ChartCard title="Freshness status mix" chartType="bar · count" height={180}
      hint="How the tracked records split across fresh / due-soon / stale right now.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={statusData} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 4 }}>
          <CartesianGrid stroke={CHART.grid} horizontal={false} />
          <XAxis type="number" allowDecimals={false} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="status" width={70} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: "#14b8a610" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {statusData.map((d, i) => <Cell key={i} fill={d.hex} />)}
            <LabelList dataKey="count" position="right" fill="#94a3b8" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function Maintenance() {
  const [data, setData] = useState<{ items: MaintItem[]; staleCount: number; dueSoon: number } | null>(null);
  useEffect(() => { fetch("/api/research/maintenance").then((r) => r.json()).then(setData).catch(() => {}); }, []);
  if (!data) return <Card className="p-4 bg-[#071b21]/70 border-teal-900/40 text-slate-400 text-sm">Loading maintenance report…</Card>;
  const fresh = data.items.length - data.dueSoon - data.staleCount;
  const statusData = [
    { status: "Fresh", count: Math.max(0, fresh), hex: "#34d399" },
    { status: "Due soon", count: data.dueSoon, hex: "#f59e0b" },
    { status: "Stale", count: data.staleCount, hex: "#f43f5e" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricTile label="Records tracked" value={data.items.length} sub="jurisdictions · statutes · contracts" />
        <MetricTile label="Due soon (≥80%)" value={data.dueSoon} tone="warn" icon={<Clock className="h-3.5 w-3.5" />} sub="approaching SLA" />
        <MetricTile label="Stale (past SLA)" value={data.staleCount} tone="bad" icon={<AlertTriangle className="h-3.5 w-3.5" />} sub="needs re-verification" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-3">
        <ChartCardStatus statusData={statusData} />
        <MethodologyNote title="How freshness & staleness are computed" defaultOpen>
          <p>Each citable record has a re-verification SLA by kind: <Formula>jurisdiction = 365d</Formula>, <Formula>statute = 180d</Formula>, <Formula>contract = 120d</Formula>.</p>
          <p>Progress to stale is <Formula>pctToStale = min(100, ⌊ageDays / slaDays × 100⌋)</Formula>; a record is <em>due soon</em> at ≥ 80% and <strong>stale</strong> once <Formula>ageDays &gt; slaDays</Formula>.</p>
          <p><Formula>nextReview = lastReviewed + slaDays</Formula>. Stale records can seed a research task but are demoted below citable conviction until re-checked against originals.</p>
        </MethodologyNote>
      </div>

      <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
        <div className="text-sm font-semibold text-slate-200 mb-1">Freshness against re-verification SLA</div>
        <p className="text-[11px] text-slate-400 mb-3">Per-record progress bars fill as each nears its next mandatory cross-check.</p>
        <ScrollArea className="max-h-[420px]">
          <div className="space-y-2 pr-2">
            {data.items.map((it, i) => (
              <div key={i} className="border border-teal-900/40 rounded-md p-2.5 bg-[#061116]/60">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm text-slate-200 truncate">{it.title} <span className="text-[10px] text-slate-400 font-mono">{it.jurisdictionCode} · {it.kind}</span></span>
                  <span className={`text-xs ${it.staleness.stale ? "text-rose-300" : it.staleness.pctToStale >= 80 ? "text-amber-300" : "text-slate-400"}`}>
                    {it.staleness.stale ? "STALE" : `${it.staleness.pctToStale}%`}
                  </span>
                </div>
                <Progress value={it.staleness.pctToStale} className="h-1.5" />
                <div className="text-[11px] text-slate-400 mt-1">next review {it.staleness.nextReview}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

export function ResearchDesk() {
  return (
    <div className="space-y-4">
      <SectionHeader icon={<Microscope className="h-5 w-5" />} title="Research Desk; expansion & maintenance"
        description="Open a deterministic research task to onboard a new jurisdiction, or track how fresh every citable record is against its re-verification SLA. Nothing is citable until it clears the database-vs-originals gate." />
      <Tabs defaultValue="expansion">
        <TabsList className={TABS_LIST}>
          <TabsTrigger value="expansion"><FlaskConical className="h-4 w-4 mr-1" />Expansion pipeline</TabsTrigger>
          <TabsTrigger value="maintenance"><RefreshCw className="h-4 w-4 mr-1" />Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="expansion" className="mt-3"><Expansion /></TabsContent>
        <TabsContent value="maintenance" className="mt-3"><Maintenance /></TabsContent>
      </Tabs>
    </div>
  );
}
