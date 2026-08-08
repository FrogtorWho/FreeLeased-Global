import type { Conviction } from "../../data/spine";

export const CONVICTION_LABEL: Record<Conviction, { label: string; icon: string; className: string }> = {
  confirmed: { label: "confirmed", icon: "🔥", className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  verified: { label: "verified", icon: "✅", className: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  primary: { label: "primary", icon: "⭐", className: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  quantitative: { label: "quantitative", icon: "📊", className: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  inference: { label: "inference", icon: "💭", className: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  pending: { label: "pending", icon: "⏳", className: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
};

export const BAND_COLOR: Record<string, string> = {
  ABSTAIN: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  medium: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  high: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export const SIGNOFF_COLOR: Record<string, string> = {
  "all-green": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "hitl-required": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export const JURISDICTION_NAME: Record<string, string> = {
  BB: "Barbados", JM: "Jamaica", KY: "Cayman Islands", TT: "Trinidad & Tobago",
  BS: "The Bahamas", GY: "Guyana", BZ: "Belize",
};

export function dsBand(ds: number): string {
  if (ds < 60) return "ABSTAIN";
  if (ds < 75) return "low";
  if (ds < 88) return "medium";
  return "high";
}
