import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExternalLink, Database, Scale, Globe2, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { SOURCES, STATUTES, JURISDICTIONS } from "../../data/spine";
import { CONVICTION_LABEL } from "./ui-helpers";
import { SectionHeader, ChartCard, MethodologyNote, Formula, MetricTile, CHART, TABS_LIST } from "./primitives";

const TIER_LABEL: Record<string, string> = {
  "0": "Tier 0 · cross-jurisdictional",
  "1": "Tier 1 · registries & statistical offices",
  "1.5": "Tier 1.5 · OSM + Overture workaround",
  "3": "Tier 3 · climate & macro",
};

const CONV_ORDER = ["confirmed", "verified", "primary", "quantitative", "inference", "pending"] as const;
const CONV_HEX: Record<string, string> = {
  confirmed: "#34d399", verified: "#14b8a6", primary: "#22d3ee",
  quantitative: "#3b82f6", inference: "#f59e0b", pending: "#f43f5e",
};
const TIER_HEX = ["#14b8a6", "#22d3ee", "#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b"];

function ConvictionBadge({ c }: { c: keyof typeof CONVICTION_LABEL }) {
  const cfg = CONVICTION_LABEL[c];
  return <Badge variant="outline" className={cfg.className}>{cfg.icon} {cfg.label}</Badge>;
}

export function DataSpine() {
  const tiers = [...new Set(SOURCES.map((s) => String(s.tier)))].sort();

  const byTier = tiers.map((t) => ({ tier: `Tier ${t}`, count: SOURCES.filter((s) => String(s.tier) === t).length }));
  const spineItems = [...SOURCES, ...STATUTES];
  const byConviction = CONV_ORDER
    .map((c) => ({ conviction: c, count: spineItems.filter((x) => x.conviction === c).length }))
    .filter((r) => r.count > 0);
  const pilot = JURISDICTIONS.filter((j) => j.inPilot).length;
  const strongPct = Math.round(
    (spineItems.filter((x) => ["confirmed", "verified", "primary"].includes(x.conviction)).length / spineItems.length) * 100,
  );

  return (
    <div className="space-y-4">
      <SectionHeader icon={<Layers className="h-5 w-5" />} title="Data Spine; provenance-ranked evidence base"
        description="Every source, statute and jurisdiction the platform stands on. Each is public, $0, open-licensed, and tagged on a 6-rung conviction ladder so weak evidence is never silently treated as strong." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile label="Public sources" value={SOURCES.length} sub="Tiers 0–3 · all $0" />
        <MetricTile label="Statutes" value={STATUTES.length} sub="exact citations + URLs" />
        <MetricTile label="Jurisdictions" value={`${pilot} / ${JURISDICTIONS.length}`} sub="pilot / roadmap" />
        <MetricTile label="Strong-conviction" value={`${strongPct}%`} tone="good" sub="confirmed · verified · primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Sources by tier" chartType="bar · count" height={240}
          hint="How many public feeds sit at each provenance tier (0 = cross-jurisdictional canon → 3 = climate/macro).">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byTier} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="tier" stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} />
              <YAxis allowDecimals={false} stroke={CHART.axis} fontSize={CHART.axisFont} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: "#14b8a610" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byTier.map((_, i) => <Cell key={i} fill={TIER_HEX[i % TIER_HEX.length]} />)}
                <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Provenance conviction ladder" chartType="ranked bar · count" height={240}
          hint="Distribution of all sources + statutes across the conviction ladder, strongest at top. Colour encodes rung.">
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

      <MethodologyNote title="How provenance & conviction are modelled">
        <p>Every datum carries a <strong>5-tuple</strong>: <Formula>⟨value, source, url, retrieved_at, conviction⟩</Formula>. Nothing renders as a claim without all five.</p>
        <p>The <strong>conviction ladder</strong> is an ordinal scale, strongest → weakest: <Formula>confirmed ≻ verified ≻ primary ≻ quantitative ≻ inference ≻ pending</Formula>. Downstream engines gate on it; e.g. a <em>pending</em> statute can seed a research task but can never back a citable dossier cell.</p>
        <p>Tiers classify <em>source type</em> (0 cross-jurisdictional canon, 1 registries/statistical offices, 1.5 the OSM+Overture geospatial workaround, 3 climate/macro), independent of conviction.</p>
      </MethodologyNote>

    <Tabs defaultValue="sources">
      <TabsList className={TABS_LIST}>
        <TabsTrigger value="sources"><Database className="h-4 w-4 mr-1" />Sources</TabsTrigger>
        <TabsTrigger value="statutes"><Scale className="h-4 w-4 mr-1" />Statutes</TabsTrigger>
        <TabsTrigger value="jurisdictions"><Globe2 className="h-4 w-4 mr-1" />Jurisdictions</TabsTrigger>
      </TabsList>

      <TabsContent value="sources" className="mt-3 space-y-4">
        <p className="text-xs text-slate-400">
          Every source is real, public, and $0. All URLs are live published endpoints. Licences are open (public / CC-BY / ODbL).
        </p>
        {tiers.map((t) => (
          <Card key={t} className="p-4 bg-[#071b21]/70 border-teal-900/40">
            <div className="text-sm font-semibold text-slate-200 mb-2">{TIER_LABEL[t] ?? `Tier ${t}`}</div>
            <div className="space-y-1.5">
              {SOURCES.filter((s) => String(s.tier) === t).map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-3 border-b border-teal-900/40/60 pb-1.5 last:border-0">
                  <div className="min-w-0">
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-slate-200 hover:text-teal-300 inline-flex items-center gap-1">
                      {s.name} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    <div className="text-xs text-slate-400">{s.gives} · {s.license} · {s.cadence}</div>
                  </div>
                  <ConvictionBadge c={s.conviction} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="statutes" className="mt-3">
        <Card className="p-4 bg-[#071b21]/70 border-teal-900/40 space-y-2">
          {STATUTES.map((s) => (
            <div key={s.id} className="border-b border-teal-900/40/60 pb-2 last:border-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-100 hover:text-teal-300 inline-flex items-center gap-1">
                  {s.shortTitle} <ExternalLink className="h-3 w-3" />
                </a>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[11px]">{s.jurisdiction}</Badge>
                  <ConvictionBadge c={s.conviction} />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono">{s.citation}</div>
              <div className="text-xs text-slate-400">{s.covers}</div>
              {s.note && <div className="text-[11px] text-amber-300/80 mt-0.5">⚠ {s.note}</div>}
            </div>
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="jurisdictions" className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {JURISDICTIONS.map((j) => (
          <Card key={j.code} className="p-4 bg-[#071b21]/70 border-teal-900/40">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">{j.name} <span className="text-slate-400 font-mono text-xs">{j.code}</span></h3>
              <Badge variant="outline" className={j.inPilot ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-slate-700/30 text-slate-400 border-slate-700"}>
                {j.inPilot ? `pilot · ${j.pilotResidents}` : "roadmap"}
              </Badge>
            </div>
            <div className="text-xs text-slate-400 mt-1">{j.capital} · {j.climate}</div>
            <div className="text-xs text-slate-400 mt-1">{j.tenureSystem}</div>
            <a href={j.registry.url} target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:underline inline-flex items-center gap-1 mt-1">
              {j.registry.name} <ExternalLink className="h-3 w-3" />
            </a>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
    </div>
  );
}
