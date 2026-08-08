import { useState, type ReactNode } from "react";
import { ChevronDown, Sigma } from "lucide-react";
import { cn } from "@/lib/cn";

// ── Peacock brand palette ─────────────────────────────────────────────────────
// Iridescent teal → blue with emerald + gold jewel accents. `green`/`blue` are
// the FreeLeased wordmark hues; `teal` is the primary UI accent.
export const BRAND = {
  green: "#10b981", // "Leased"
  blue: "#2563eb",  // "Free"
  teal: "#14b8a6",  // primary accent
  cyan: "#06b6d4",
  gold: "#f59e0b",
};

// ── Shared surface token — one card system across the whole app ──────────────
// Glassmorphism on peacock: frosted glass with luminous edge, layered depth.
// backdrop-blur-xl creates the frosted-glass translucency over the peacock bg.
// ring-1 ring-white/[0.06] gives the subtle luminous border characteristic of glass UI.
export const CARD = "rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)]";

// ── Shared chart theme ────────────────────────────────────────────────────────
export const CHART = {
  grid: "#0e2b2b",
  axis: "#8fb4b4",
  axisFont: 12,
  tooltip: {
    background: "#031316",
    border: "1px solid #164e4a",
    borderRadius: 10,
    fontSize: 12,
    color: "#d7f0ec",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    padding: "8px 12px",
  } as React.CSSProperties,
};

// Sequential (single-hue) ramp for magnitude, categorical for identity, and a
// semantic set for good/warn/bad. Peacock jewel tones, colour-blind-safe spread.
export const SEQ_BLUE = ["#0891b2", "#0ea5b7", "#14b8a6", "#34d399", "#6ee7b7"];
export const CAT = ["#14b8a6", "#2563eb", "#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#8b5cf6", "#f43f5e"];
export const SEMANTIC = { good: "#34d399", warn: "#f59e0b", bad: "#f43f5e", info: "#22d3ee", muted: "#6b8a8a" };

export function seqRamp(n: number, hueStart = 172, hueEnd = 250): string[] {
  if (n <= 1) return [`hsl(${hueStart} 76% 52%)`];
  return Array.from({ length: n }, (_, i) => `hsl(${Math.round(hueStart + ((hueEnd - hueStart) * i) / (n - 1))} 74% 54%)`);
}

// ── FreeLeased wordmark: "Free" (blue) + "Leased" (green) ─────────────────────
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      <span className="text-blue-500">Free</span>
      <span className="text-emerald-400">Leased</span>
    </span>
  );
}

// ── Brand logo mark: iridescent peacock monogram tile ─────────────────────────
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="relative rounded-lg flex items-center justify-center font-black text-slate-950 shadow-lg shadow-teal-500/20"
      style={{
        width: size, height: size,
        fontSize: size * 0.5,
        background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 55%,#34d399 100%)",
      }}
    >
      <span className="drop-shadow-sm">F</span>
    </div>
  );
}

// ── Section header: title + one-line description + optional right slot ────────
export function SectionHeader({
  icon, title, description, right,
}: { icon?: ReactNode; title: string; description?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-slate-50 leading-tight tracking-tight">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">{description}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

// ── Methodology note: collapsible "how this model works" with the actual method ─
export function MethodologyNote({
  title = "How this is computed", children, defaultOpen = false,
}: { title?: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-lg overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Sigma className="h-3.5 w-3.5 text-teal-400" /> {title}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-3.5 pt-1 text-xs text-slate-400 space-y-1.5 leading-relaxed">{children}</div>}
    </div>
  );
}

// Inline formula chip — glass-styled code snippet.
export function Formula({ children }: { children: ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm text-[11px] text-teal-300 font-mono">{children}</code>;
}

// Shared peacock sub-tab list styling — glass panel for inner tabs.
export const TABS_LIST = "bg-white/[0.03] border border-white/[0.06] backdrop-blur-lg";

// Small inline pill/count chip in the brand palette.
export function Pill({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "blue" | "green" | "amber" | "rose" | "slate" }) {
  const map = {
    teal: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    slate: "bg-slate-700/30 text-slate-400 border-slate-700",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", map)}>{children}</span>;
}

// Honesty marker: flags a value as modelled/illustrative, never a real-world fact.
export function Modelled({ className }: { className?: string }) {
  return (
    <span title="Modelled or illustrative value, not a real-world fact"
      className={cn("inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-300 align-middle", className)}>
      modelled
    </span>
  );
}

// Evidence-class chip: colour + label carry the honesty class of a protocol/finding.
export function EvidenceTag({ label, hex, title }: { label: string; hex: string; title?: string }) {
  return (
    <span title={title}
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
      style={{ color: hex, background: `${hex}22`, border: `1px solid ${hex}55` }}>
      {label}
    </span>
  );
}

// ── Metric tile ───────────────────────────────────────────────────────────────
export function MetricTile({
  label, value, sub, tone = "default", icon,
}: { label: string; value: ReactNode; sub?: ReactNode; tone?: "default" | "good" | "warn" | "bad"; icon?: ReactNode }) {
  const toneClass = {
    default: "text-slate-100", good: "text-emerald-300", warn: "text-amber-300", bad: "text-rose-300",
  }[tone];
  return (
    <div className={cn(CARD, "p-4 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:ring-white/[0.1]")}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 flex items-center gap-1.5">{icon}{label}</div>
      <div className={cn("text-2xl font-bold mt-1 tabular-nums tracking-tight", toneClass)}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── Chart frame: consistent titled container for every visual ─────────────────
export function ChartCard({
  title, hint, chartType, children, height = 320,
}: { title: string; hint?: string; chartType?: string; children: ReactNode; height?: number }) {
  return (
    <div className={cn(CARD, "p-5")}>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <div className="text-[15px] font-semibold text-slate-100 tracking-tight">{title}</div>
          {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
        </div>
        {chartType && <span className="text-[10px] uppercase tracking-wider text-teal-600/80 shrink-0 font-medium">{chartType}</span>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}
