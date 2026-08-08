import { useState, useEffect } from "react";
import { Globe, CheckCircle2, Clock, Wrench, Database, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, Pill, MetricTile, SectionHeader, MethodologyNote, Formula } from "@/components/auri/primitives";

type Maturity = "production" | "pilot" | "development" | "planned";

interface JurisdictionStat {
  code: string;
  name: string;
  capital: string;
  inPilot: boolean;
  pilotResidents: number;
  statutes: { total: number; verified: number };
  sources: { jurisdictionSpecific: number; global: number };
  registryConviction: string;
  registryName: string;
  dataSufficiency: number;
  maturity: Maturity;
}

interface StatsResponse {
  generatedAt: string;
  summary: {
    total: number; ready: number; dev: number; planned: number;
    totalStatutes: number; totalSources: number;
  };
  jurisdictions: JurisdictionStat[];
}

const MATURITY_META: Record<Maturity, { label: string; tone: "green" | "teal" | "amber" | "slate"; icon: typeof CheckCircle2; bg: string }> = {
  production: { label: "Production Ready", tone: "green",  icon: CheckCircle2, bg: "border-emerald-500/20 bg-emerald-500/5" },
  pilot:      { label: "Pilot",            tone: "teal",   icon: Globe,         bg: "border-teal-500/20 bg-teal-500/5"    },
  development:{ label: "In Development",   tone: "amber",  icon: Wrench,        bg: "border-amber-500/20 bg-amber-500/5"  },
  planned:    { label: "Planned",          tone: "slate",  icon: Clock,         bg: "border-slate-700/40 bg-slate-800/20" },
};

// Deterministic health colour from dataSufficiency
function healthColor(score: number) {
  if (score >= 70) return "bg-emerald-400";
  if (score >= 45) return "bg-amber-400";
  return "bg-slate-600";
}

function sufficiencyBar(score: number) {
  const pct = Math.min(100, score);
  const color = score >= 70 ? "#34d399" : score >= 45 ? "#f59e0b" : "#475569";
  return (
    <div className="mt-1.5 h-1 w-full rounded-full bg-slate-800">
      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function ScalabilityPanel() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jurisdictions/stats")
      .then((r) => r.json())
      .then((d: StatsResponse) => { setData(d); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
      Loading jurisdiction data…
    </div>
  );
  if (error || !data) return (
    <div className="flex items-center gap-2 text-rose-400 text-sm">
      <AlertTriangle className="h-4 w-4" /> {error ?? "Failed to load"}
    </div>
  );

  const { summary, jurisdictions } = data;
  const selectedJur = selected ? jurisdictions.find((j) => j.code === selected) : null;

  // Group by maturity for ordering
  const ordered: Maturity[] = ["production", "pilot", "development", "planned"];
  const grouped = ordered.flatMap((m) => jurisdictions.filter((j) => j.maturity === m));

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={<Globe className="h-5 w-5" />}
        title="Multi-Jurisdiction Scale"
        description="Architecture covers 9 jurisdictions from day one; not a future add-on. Each jurisdiction has its own statute spine, source tier, and maturity rating derived deterministically from verified data."
      />

      {/* ── Summary metrics ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile label="Jurisdictions" value={summary.total} sub="UK + 8 Caribbean" tone="default" icon={<Globe className="h-3.5 w-3.5" />} />
        <MetricTile label="Ready / Pilot" value={summary.ready} sub={`${summary.dev} in development`} tone="good" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
        <MetricTile label="Statutes Loaded" value={summary.totalStatutes} sub="Primary source citations" tone="default" icon={<FileText className="h-3.5 w-3.5" />} />
        <MetricTile label="Sources Verified" value={summary.totalSources} sub="Tier 0 → Tier 3" tone="default" icon={<Database className="h-3.5 w-3.5" />} />
      </div>

      {/* ── Summary bar ─────────────────────────────────────────── */}
      <div className={cn(CARD, "p-4")}>
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-3">
          Jurisdiction readiness; {summary.ready} ready, {summary.dev} in development, {summary.planned} planned
        </div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          <div className="bg-emerald-500/70 transition-all" style={{ width: `${(summary.ready / summary.total) * 100}%` }} title={`${summary.ready} ready/pilot`} />
          <div className="bg-amber-500/50 transition-all" style={{ width: `${(summary.dev / summary.total) * 100}%` }} title={`${summary.dev} in development`} />
          <div className="bg-slate-700 transition-all" style={{ width: `${(summary.planned / summary.total) * 100}%` }} title={`${summary.planned} planned`} />
        </div>
        <div className="flex gap-4 mt-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500/70 inline-block" /> Ready / Pilot</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-500/50 inline-block" /> In Development</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-slate-700 inline-block" /> Planned</span>
        </div>
      </div>

      {/* ── Jurisdiction grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((j) => {
          const meta = MATURITY_META[j.maturity];
          const Icon = meta.icon;
          const isSelected = selected === j.code;
          return (
            <button
              key={j.code}
              onClick={() => setSelected(isSelected ? null : j.code)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all hover:scale-[1.01]",
                meta.bg,
                isSelected ? "ring-2 ring-teal-400/40" : "hover:border-teal-700/40"
              )}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-widest text-slate-400">{j.code}</span>
                    <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", healthColor(j.dataSufficiency))} title={`Data sufficiency: ${j.dataSufficiency}%`} />
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-0.5 leading-tight">{j.name}</div>
                  <div className="text-[10px] text-slate-500">{j.capital}</div>
                </div>
                <Pill tone={meta.tone}>{meta.label}</Pill>
              </div>

              {/* Stats row */}
              <div className="flex gap-3 text-[11px] text-slate-400 mt-2">
                <span><span className="text-slate-200 font-semibold">{j.statutes.total}</span> statutes</span>
                <span><span className="text-slate-200 font-semibold">{j.sources.jurisdictionSpecific}</span> sources</span>
                {j.pilotResidents > 0 && (
                  <span><span className="text-teal-300 font-semibold">{j.pilotResidents}</span> residents</span>
                )}
              </div>

              {/* Sufficiency bar */}
              {sufficiencyBar(j.dataSufficiency)}
              <div className="text-[10px] text-slate-600 mt-1">Data sufficiency: {j.dataSufficiency}%</div>

              {/* Registry conviction */}
              <div className="mt-2">
                <Pill tone={j.registryConviction === "verified" ? "green" : j.registryConviction === "inference" ? "amber" : "slate"}>
                  registry: {j.registryConviction}
                </Pill>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Expanded detail panel ────────────────────────────────── */}
      {selectedJur && (
        <div className={cn(CARD, "p-5 space-y-3")}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              {selectedJur.name}; Detail
            </h3>
            <button onClick={() => setSelected(null)} className="text-[10px] text-slate-500 hover:text-slate-300">✕ close</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className={cn(CARD, "p-3")}>
              <div className="text-slate-400">Statutes total</div>
              <div className="text-xl font-bold text-slate-100 mt-1">{selectedJur.statutes.total}</div>
              <div className="text-[10px] text-slate-500">{selectedJur.statutes.verified} verified</div>
            </div>
            <div className={cn(CARD, "p-3")}>
              <div className="text-slate-400">Sources</div>
              <div className="text-xl font-bold text-slate-100 mt-1">{selectedJur.sources.jurisdictionSpecific}</div>
              <div className="text-[10px] text-slate-500">+ {selectedJur.sources.global} global</div>
            </div>
            <div className={cn(CARD, "p-3")}>
              <div className="text-slate-400">Data sufficiency</div>
              <div className={cn("text-xl font-bold mt-1", selectedJur.dataSufficiency >= 70 ? "text-emerald-300" : selectedJur.dataSufficiency >= 45 ? "text-amber-300" : "text-slate-400")}>
                {selectedJur.dataSufficiency}%
              </div>
              <div className="text-[10px] text-slate-500">deterministic score</div>
            </div>
            <div className={cn(CARD, "p-3")}>
              <div className="text-slate-400">Pilot residents</div>
              <div className="text-xl font-bold text-teal-300 mt-1">{selectedJur.pilotResidents}</div>
              <div className="text-[10px] text-slate-500">{selectedJur.inPilot ? "active pilot" : "roadmap"}</div>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Registry:</span> {selectedJur.registryName}
            <span className="ml-2"><Pill tone={selectedJur.registryConviction === "verified" ? "green" : "amber"}>{selectedJur.registryConviction}</Pill></span>
          </div>
        </div>
      )}

      {/* ── Methodology note ─────────────────────────────────────── */}
      <MethodologyNote title="How data sufficiency is scored">
        <p>Each jurisdiction is scored deterministically across three dimensions:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><Formula>Registry conviction</Formula>; verified = 40 pts, inference = 15 pts, pending = 5 pts</li>
          <li><Formula>Source feed score</Formula>; (verified feeds / total feeds) × 30 pts</li>
          <li><Formula>Statute coverage</Formula>; min(30, statute count × 5) pts</li>
          <li><Formula>Total</Formula> = sum, capped at 100</li>
        </ul>
        <p className="mt-1">Maturity: <span className="text-emerald-300">production</span> = inPilot + ≥3 statutes + verified registry. <span className="text-teal-300">Pilot</span> = inPilot. <span className="text-amber-300">Development</span> = ≥2 statutes. <span className="text-slate-400">Planned</span> = 0–1 statutes.</p>
      </MethodologyNote>
    </div>
  );
}
