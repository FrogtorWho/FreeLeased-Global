import { useState, useMemo } from "react";
import { ShieldCheck, ChevronRight, Scale, ExternalLink, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { HIDDEN_RIGHTS, STATUTES, JURISDICTIONS, type HiddenRight, type JurisdictionCode } from "../../data/spine";
import { SectionHeader, MethodologyNote, Formula } from "./primitives";
import { CARD } from "./primitives";

const ISSUE_CATEGORIES = [
  { id: "service-charge", label: "Service charges", icon: "£" },
  { id: "repairs", label: "Repairs & maintenance", icon: "🔧" },
  { id: "entry", label: "Landlord entry / access", icon: "🚪" },
  { id: "eviction", label: "Eviction / termination", icon: "⚠" },
  { id: "deposit", label: "Deposit disputes", icon: "💰" },
  { id: "building-safety", label: "Building safety", icon: "🏗" },
  { id: "management", label: "Right to Manage", icon: "🏛" },
  { id: "general", label: "General / not sure", icon: "?" },
] as const;

const TENURE_TYPES = [
  { id: "leasehold", label: "Leasehold (owning with a lease)" },
  { id: "renting", label: "Renting (assured shorthold tenancy)" },
  { id: "condo", label: "Condominium / strata" },
  { id: "other", label: "Not sure" },
] as const;

function matchesIssue(right: HiddenRight, issue: string): boolean {
  if (issue === "general") return true;
  const t = right.title.toLowerCase() + " " + right.plain.toLowerCase();
  switch (issue) {
    case "service-charge": return t.includes("service charge") || t.includes("major works") || t.includes("s.20") || t.includes("costs") || t.includes("s.20c");
    case "repairs": return t.includes("repair") || t.includes("habitab") || t.includes("fitness");
    case "entry": return t.includes("entry") || t.includes("access") || t.includes("quiet enjoyment");
    case "eviction": return t.includes("evict") || t.includes("forfeit") || t.includes("terminat");
    case "deposit": return t.includes("deposit");
    case "building-safety": return t.includes("building safety") || t.includes("bsa") || t.includes("cladding");
    case "management": return t.includes("rtm") || t.includes("right to manage") || t.includes("enfranchis");
    default: return true;
  }
}

function jurisdictionLabel(codes: JurisdictionCode[]): string {
  return codes.map(c => JURISDICTIONS.find(j => j.code === c)?.name ?? c).join(", ");
}

export function RightsChecker() {
  const [step, setStep] = useState<"situation" | "results">("situation");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode | "all">("UK");
  const [tenure, setTenure] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const results = useMemo(() => {
    if (step !== "results") return [];
    let filtered = HIDDEN_RIGHTS;
    if (jurisdiction !== "all") {
      filtered = filtered.filter(r => r.jurisdictions.includes(jurisdiction as JurisdictionCode));
    }
    if (issue) {
      filtered = filtered.filter(r => matchesIssue(r, issue));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.plain.toLowerCase().includes(q) ||
        r.remedy.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [step, jurisdiction, issue, searchQuery]);

  const highPriority = results.filter(r => r.exploitationCounterpart);
  const standard = results.filter(r => !r.exploitationCounterpart);

  if (step === "situation") {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<ShieldCheck className="h-5 w-5" />}
          title="What are my rights?"
          description="Tell us about your situation and we'll find the laws that protect you. Everything we show is backed by real legislation with links to the original text."
        />

        <div className={cn(CARD, "p-6 space-y-5")}>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Where is your property?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {JURISDICTIONS.filter(j => j.inPilot).map(j => (
                <button key={j.code} onClick={() => setJurisdiction(j.code)}
                  className={cn("p-3 rounded-lg border text-left text-sm transition-all",
                    jurisdiction === j.code
                      ? "border-teal-400 bg-teal-500/10 text-teal-200"
                      : "border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:text-slate-300"
                  )}>
                  <div className="font-medium">{j.name}</div>
                  <div className="text-[11px] opacity-60 mt-0.5">{j.code}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">What type of tenure?</label>
            <div className="grid grid-cols-2 gap-2">
              {TENURE_TYPES.map(t => (
                <button key={t.id} onClick={() => setTenure(t.id)}
                  className={cn("p-3 rounded-lg border text-left text-sm transition-all",
                    tenure === t.id
                      ? "border-teal-400 bg-teal-500/10 text-teal-200"
                      : "border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12]"
                  )}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">What's the issue?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ISSUE_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setIssue(c.id)}
                  className={cn("p-3 rounded-lg border text-left text-sm transition-all",
                    issue === c.id
                      ? "border-teal-400 bg-teal-500/10 text-teal-200"
                      : "border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12]"
                  )}>
                  <span className="mr-1.5">{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setStep("results")}
            disabled={!jurisdiction}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors">
            Check my rights <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <MethodologyNote title="How this works">
          <p>We match your situation against a catalogue of <Formula>19+ statute-anchored rights</Formula>, each the resident-facing flip of a researched exploitation pattern.</p>
          <p>Every right carries a conviction level (how strongly the law supports it) and a link to the original legislation. We never give legal advice, only citations you can verify yourself.</p>
        </MethodologyNote>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Your rights"
        description={`Found ${results.length} right${results.length !== 1 ? "s" : ""} matching your situation in ${jurisdiction === "all" ? "all jurisdictions" : JURISDICTIONS.find(j => j.code === jurisdiction)?.name}.`}
      />

      <div className={cn(CARD, "p-4 flex flex-col sm:flex-row gap-3")}>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search rights..." className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
        <button onClick={() => { setStep("situation"); setJurisdiction("UK"); setTenure(""); setIssue(""); setSearchQuery(""); }}
          className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 hover:text-slate-300 transition-colors">
          Start over
        </button>
      </div>

      {highPriority.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> High-priority rights ({highPriority.length})
          </h3>
          <p className="text-xs text-slate-400">These defend against specific exploitation patterns found in leases. If any of these apply to you, action may be time-sensitive.</p>
          {highPriority.map(r => <RightCard key={r.id} right={r} />)}
        </div>
      )}

      {standard.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Standard rights ({standard.length})
          </h3>
          {standard.map(r => <RightCard key={r.id} right={r} />)}
        </div>
      )}

      {results.length === 0 && (
        <div className={cn(CARD, "p-8 text-center")}>
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-20 text-teal-400" />
          <p className="text-slate-400">No matching rights found. Try broadening your search or selecting a different issue.</p>
        </div>
      )}

      <MethodologyNote title="About conviction levels">
        <p>Each right's strength is capped by its evidence class: <Formula>established</Formula> (settled law, 0.95 cap), <Formula>heuristic</Formula> (pattern-based, 0.6), <Formula>contested</Formula> (varies by jurisdiction, 0.4), <Formula>unfalsifiable</Formula> (cannot be verified, 0.2). We never overstate certainty.</p>
      </MethodologyNote>
    </div>
  );
}

function RightCard({ right }: { right: HiddenRight }) {
  const [expanded, setExpanded] = useState(false);
  const statutes = right.statuteIds.map(id => STATUTES.find(s => s.id === id)).filter(Boolean);
  const convColors: Record<string, string> = {
    confirmed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    verified: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    primary: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    quantitative: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    inference: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    pending: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  };

  return (
    <div className={cn(CARD, "p-4 hover:bg-white/[0.06] transition-all")}>
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-sm text-slate-100">{right.title}</h4>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", convColors[right.conviction] || convColors.pending)}>
              {right.conviction}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{right.plain}</p>
        </div>
        <ChevronRight className={cn("h-4 w-4 text-slate-500 shrink-0 transition-transform", expanded && "rotate-90")} />
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-3">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div><span className="font-medium text-slate-200">What you can do: </span><span className="text-slate-400">{right.remedy}</span></div>
          </div>
          {right.limitationPeriod && (
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div><span className="font-medium text-slate-200">Time limit: </span><span className="text-amber-300">{right.limitationPeriod}</span></div>
            </div>
          )}
          {right.exploitationCounterpart && (
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div><span className="font-medium text-slate-200">Defends against: </span><span className="text-rose-300">{right.exploitationCounterpart}</span></div>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[11px] text-slate-500 mt-0.5">JURISDICTIONS</span>
            <span className="text-slate-400 text-xs">{jurisdictionLabel(right.jurisdictions)}</span>
          </div>
          {statutes.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Backed by legislation</span>
              {statutes.map(s => s && (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-teal-300/80 hover:text-teal-200 transition-colors">
                  <Scale className="h-3 w-3 shrink-0" />
                  <span className="font-medium">{s.shortTitle}</span>
                  <span className="text-slate-500">{s.citation}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
