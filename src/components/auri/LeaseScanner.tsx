import { useState, useCallback } from "react";
import { Search, AlertTriangle, CheckCircle2, ExternalLink, Scale, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, SectionHeader, MethodologyNote, Formula } from "./primitives";
import type { FairnessFlag, FairnessResult } from "../../lib/fairness";

const SAMPLE_LEASE = `CLAUSE 4.1 - SERVICE CHARGES
The Lessee shall pay quarterly service charges as determined by the Lessors managing agents. The Lessors reserve the right to increase service charges at any time without prior consultation. All major works shall be carried out at the Lessors discretion and the full cost recovered through the service charge.

CLAUSE 7.2 - ENTRY
The Lessor or their agents may enter the demised premises at any time for the purpose of inspection, repair, or any other reason whatsoever, without giving notice to the Lessee.

CLAUSE 11.1 - DEPOSIT
The Lessee shall pay a deposit equal to three months rent, which shall be held by the Lessor and returned at the end of the tenancy less any deductions at the Lessors sole discretion.

CLAUSE 14 - FORFEITURE
In the event of non-payment of service charges, the Lessor may forfeit this lease and re-enter the premises immediately without notice.

CLAUSE 16 - REPAIRS
The Lessee waives all rights regarding structural repair and maintenance. The Lessee is solely responsible for all repairs to the property including the roof, foundations, and common parts.

ADMIN FEE: A charge of £150 is payable upon renewal of this lease for administration costs.
CHECK-OUT FEE: £75 payable at the end of the tenancy for inventory check-out.
REFERENCE FEE: £50 per tenant for providing references.`;

export function LeaseScanner() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FairnessResult | null>(null);
  const [busy, setBusy] = useState(false);

  const analyze = useCallback(async (input: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/fairness/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, jurisdiction: "UK" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.flags) {
        setResult(data as FairnessResult);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setBusy(false);
    }
  }, []);

  const sevColors = {
    high: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    medium: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    low: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  };

  const classColors = {
    established: "text-emerald-400",
    heuristic: "text-cyan-400",
    contested: "text-amber-400",
    unfalsifiable: "text-slate-400",
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Search className="h-5 w-5" />}
        title="Lease Scanner"
        description="Paste your lease or tenancy agreement. We'll flag potentially unlawful clauses with links to the legislation that protects you."
      />

      <div className={cn(CARD, "p-5 space-y-4")}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your lease text here..."
          rows={10}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 resize-y font-mono"
        />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => analyze(text)} disabled={busy || !text.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-sm font-medium flex items-center gap-2 transition-colors">
            <Search className="h-4 w-4" /> {busy ? "Scanning..." : "Scan lease"}
          </button>
          <button onClick={() => { setText(SAMPLE_LEASE); analyze(SAMPLE_LEASE); }}
            className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 hover:text-slate-300 transition-colors">
            Load example lease
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={cn(CARD, "p-4 text-center")}>
              <div className="text-2xl font-bold text-slate-100">{result.clauseCount}</div>
              <div className="text-[11px] text-slate-400">Clauses analysed</div>
            </div>
            <div className={cn(CARD, "p-4 text-center")}>
              <div className="text-2xl font-bold text-rose-400">{result.flags.filter(f => f.severity === "high").length}</div>
              <div className="text-[11px] text-slate-400">High severity</div>
            </div>
            <div className={cn(CARD, "p-4 text-center")}>
              <div className="text-2xl font-bold text-amber-400">{result.flags.filter(f => f.severity === "medium").length}</div>
              <div className="text-[11px] text-slate-400">Medium severity</div>
            </div>
            <div className={cn(CARD, "p-4 text-center")}>
              <div className="text-2xl font-bold text-emerald-400">{result.flags.length > 0 ? Math.round((result.flags.filter(f => f.evidenceClass === "established").length / result.flags.length) * 100) : 0}%</div>
              <div className="text-[11px] text-slate-400">Established law</div>
            </div>
          </div>

          {result.flags.length > 0 ? (
            <div className="space-y-3">
              {result.flags.map((flag, i) => (
                <FlagCard key={`${flag.ruleId}-${i}`} flag={flag} sevColors={sevColors} classColors={classColors} />
              ))}
            </div>
          ) : (
            <div className={cn(CARD, "p-8 text-center")}>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-400 opacity-50" />
              <p className="text-slate-300 font-medium">No issues found</p>
              <p className="text-xs text-slate-500 mt-1">This doesn't mean the lease is perfect. Consider getting professional advice for a thorough review.</p>
            </div>
          )}

          <MethodologyNote title={result.disclaimer}>
            <p>Every flag carries an <Formula>evidence class</Formula> that caps displayed confidence: <Formula>established</Formula> (0.95), <Formula>heuristic</Formula> (0.6), <Formula>contested</Formula> (0.4). This means we never claim more certainty than the law supports. Check each citation against the current statute for your jurisdiction.</p>
          </MethodologyNote>
        </>
      )}
    </div>
  );
}

function FlagCard({ flag, sevColors, classColors }: {
  flag: FairnessFlag;
  sevColors: Record<string, string>;
  classColors: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(CARD, "p-4 hover:bg-white/[0.06] transition-all")}>
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <h4 className="font-semibold text-sm text-slate-100">{flag.topic}</h4>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", sevColors[flag.severity])}>
              {flag.severity}
            </span>
            <span className={cn("text-[10px]", classColors[flag.evidenceClass])}>
              {flag.evidenceClass} ({Math.round(flag.confidence * 100)}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 italic border-l-2 border-rose-500/30 pl-3 mt-1">"{flag.clauseExcerpt}"</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 shrink-0 transition-transform", expanded && "rotate-180")} />
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
          <p className="text-sm text-slate-300">{flag.explanation}</p>
          <a href={`https://www.legislation.gov.uk/`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-xs text-teal-300/80 hover:text-teal-200 transition-colors">
            <Scale className="h-3 w-3" />
            <span className="font-medium">{flag.citation}</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </div>
      )}
    </div>
  );
}
