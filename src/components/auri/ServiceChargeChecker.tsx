import { useState } from "react";
import { ClipboardList, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, SectionHeader, MethodologyNote, Formula } from "./primitives";

const COMMON_CHARGES = [
  { item: "Buildings insurance", typical: "£200-800/yr", canChallenge: false },
  { item: "Ground rent", typical: "Varies", canChallenge: true, note: "Check if lease allows increases" },
  { item: "Managing agent fees", typical: "5-15% of spend", canChallenge: true, note: "Must be reasonable" },
  { item: "Major works (s.20)", typical: "Variable", canChallenge: true, note: "Must follow s.20 consultation" },
  { item: "Reserve fund / sinking fund", typical: "£100-500/yr", canChallenge: false },
  { item: "Cleaning / gardening", typical: "£100-400/yr", canChallenge: false },
  { item: "Legal / tribunal costs", typical: "Variable", canChallenge: true, note: "s.20C: tribunal may disallow" },
  { item: "Administration / renewal fee", typical: "£50-200", canChallenge: true, note: "Often prohibited" },
  { item: "Credit check / reference fee", typical: "£25-75", canChallenge: true, note: "Often prohibited" },
];

export function ServiceChargeChecker() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"annual" | "quarterly" | "monthly">("annual");
  const [results, setResults] = useState<Array<{ item: string; flag: boolean; reason: string }> | null>(null);

  const check = () => {
    if (!amount) return;
    const numAmount = parseFloat(amount.replace(/[£,]/g, ""));
    if (isNaN(numAmount)) return;

    const findings: Array<{ item: string; flag: boolean; reason: string }> = [];

    if (numAmount > 5000 && frequency === "annual") {
      findings.push({
        item: "High annual charge",
        flag: true,
        reason: `£${numAmount.toLocaleString()}/yr is above typical service charges. Request a detailed breakdown. Under s.21 LTA 1985 (UK), you have the right to a written summary of costs.`,
      });
    } else {
      findings.push({
        item: "Charge amount",
        flag: false,
        reason: `£${numAmount.toLocaleString()}/${frequency} appears within normal range. Still request an itemised breakdown.`,
      });
    }

    if (description.toLowerCase().includes("major works") || description.toLowerCase().includes("works")) {
      findings.push({
        item: "Major works",
        flag: true,
        reason: "If qualifying works cost more than £250 per leaseholder, the landlord must follow s.20 consultation. Unconsulted recovery is capped at £250 per leaseholder.",
      });
    }

    if (description.toLowerCase().includes("legal") || description.toLowerCase().includes("tribunal") || description.toLowerCase().includes("court")) {
      findings.push({
        item: "Legal costs",
        flag: true,
        reason: "Under s.20C LTA 1985, a tribunal may order that the landlord's legal/tribunal costs are not recoverable through the service charge.",
      });
    }

    if (description.toLowerCase().includes("admin") || description.toLowerCase().includes("renewal") || description.toLowerCase().includes("reference") || description.toLowerCase().includes("check-out")) {
      findings.push({
        item: "Prohibited fees",
        flag: true,
        reason: "Administration, renewal, reference, and check-out fees may be prohibited under the Tenant Fees Act 2019 (for assured shorthold tenancies).",
      });
    }

    if (description.toLowerCase().includes("cladding") || description.toLowerCase().includes("remediation") || description.toLowerCase().includes("fire safety") || description.toLowerCase().includes("building safety")) {
      findings.push({
        item: "Building safety remediation",
        flag: true,
        reason: "The Building Safety Act 2022 (Sch.8) protects qualifying leaseholders from being charged for cladding and certain relevant-defect remediation.",
      });
    }

    if (findings.length === 1 && !findings[0].flag) {
      findings.push({
        item: "General advice",
        flag: false,
        reason: "Request a service charge summary (s.21 LTA 1985). Check if consultation was required (s.20 LTA 1985). Compare with charges for similar buildings.",
      });
    }

    setResults(findings);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<ClipboardList className="h-5 w-5" />}
        title="Service Charge Checker"
        description="Enter a service charge and tell us what it covers. We'll flag potential issues and tell you what the law says."
      />

      <div className={cn(CARD, "p-5 space-y-4")}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">£</span>
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-7 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value as typeof frequency)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50">
              <option value="annual">Annual</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <button onClick={check} disabled={!amount}
              className="w-full px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-sm font-medium transition-colors mt-0.5">
              Check this charge
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">What does the charge cover? (optional)</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="e.g. major works, legal costs, building insurance, cladding remediation..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
        </div>
      </div>

      {results && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className={cn(CARD, "p-4")}>
              <div className="flex items-start gap-3">
                {r.flag ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-100">{r.item}</h4>
                  <p className="text-sm text-slate-400 mt-1">{r.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={cn(CARD, "p-5")}>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Common charges you can challenge</h3>
        <div className="space-y-2">
          {COMMON_CHARGES.filter(c => c.canChallenge).map(c => (
            <div key={c.item} className="flex items-start gap-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-200 font-medium">{c.item}</span>
                <span className="text-slate-500 mx-2">-</span>
                <span className="text-slate-400">{c.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MethodologyNote title="Your rights at a glance">
        <p><Formula>s.20 LTA 1985</Formula> If qualifying works cost more than £250 per leaseholder, the landlord must consult you first. If they don't, recovery is capped at £250.</p>
        <p><Formula>s.21 LTA 1985</Formula> You have the right to a written summary of service charge costs within 6 months of the charge year end.</p>
        <p><Formula>s.20C LTA 1985</Formula> You can apply to the First-tier Tribunal to have the landlord's legal/tribunal costs removed from your service charge.</p>
        <p><Formula>BSA 2022 Sch.8</Formula> Qualifying leaseholders are protected from charges for cladding remediation and certain relevant defects.</p>
      </MethodologyNote>
    </div>
  );
}
