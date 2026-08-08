import { useState } from "react";
import { Home, CheckCircle2, XCircle, ChevronRight, ArrowRight, AlertTriangle, Scale, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, SectionHeader, MethodologyNote, Formula } from "./primitives";

type Step = "type" | "tenure" | "qualifying" | "non-residential" | "result";

interface WizardStep {
  stepKey: Step;
  title: string;
  desc?: string;
  answerKey: keyof Answers;
  options: Array<{ id: string; label: string; desc?: string }>;
}

interface Answers {
  propertyType: "" | "flat" | "house" | "commercial" | "other";
  qualifyingTenants: "" | "all" | "some" | "unknown";
  nonResidential: "" | "none" | "some" | "significant";
}

export function RTMWizard() {
  const [step, setStep] = useState<Step>("type");
  const [answers, setAnswers] = useState<Answers>({
    propertyType: "",
    qualifyingTenants: "",
    nonResidential: "",
  });

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const stepOrder: Step[] = ["type", "tenure", "qualifying", "non-residential", "result"];
  const currentIdx = stepOrder.indexOf(step);
  const progress = ((currentIdx + 1) / stepOrder.length) * 100;

  const eligible = answers.propertyType === "flat" &&
    (answers.qualifyingTenants === "all" || answers.qualifyingTenants === "some") &&
    (answers.nonResidential === "none" || answers.nonResidential === "some");

  const partiallyEligible = answers.propertyType === "flat" && !eligible;

  const WIZARD_STEPS: WizardStep[] = [
    {
      stepKey: "type",
      title: "What type of property?",
      answerKey: "propertyType",
      options: [
        { id: "flat", label: "Flat / apartment", desc: "A self-contained unit within a larger building" },
        { id: "house", label: "House", desc: "A standalone property (may still have RTM if leasehold)" },
        { id: "commercial", label: "Commercial / mixed-use", desc: "Shops, offices, or mixed residential/commercial" },
        { id: "other", label: "Not sure", desc: "We'll help you figure it out" },
      ],
    },
    {
      stepKey: "tenure",
      title: "Are all tenants qualifying?",
      desc: "Qualifying tenants are those who hold a long lease (more than 21 years). You need at least half of the flat-holders to be qualifying tenants.",
      answerKey: "qualifyingTenants",
      options: [
        { id: "all", label: "Yes, all tenants have long leases" },
        { id: "some", label: "Some tenants have long leases" },
        { id: "unknown", label: "I don't know" },
      ],
    },
    {
      stepKey: "qualifying",
      title: "Non-residential floor area?",
      desc: "Under the LFRA 2024 (s.49), the non-residential floor area limit for RTM is now 50% (raised from 25%).",
      answerKey: "nonResidential",
      options: [
        { id: "none", label: "No non-residential units (100% residential)" },
        { id: "some", label: "Less than 50% non-residential" },
        { id: "significant", label: "More than 50% non-residential" },
      ],
    },
  ];

  const currentWizardStep = WIZARD_STEPS.find(s => s.stepKey === step);

  if (step === "result") {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<Home className="h-5 w-5" />}
          title={eligible ? "Your building appears eligible" : partiallyEligible ? "You may need to address some issues" : "RTM may not be available"}
          description="Based on your answers, here's where you stand."
        />

        <div className={cn(CARD, "p-6 space-y-5")}>
          <div className={cn("p-4 rounded-xl border", eligible ? "bg-emerald-500/10 border-emerald-500/30" : partiallyEligible ? "bg-amber-500/10 border-amber-500/30" : "bg-rose-500/10 border-rose-500/30")}>
            <div className="flex items-start gap-3">
              {eligible ? <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" /> : partiallyEligible ? <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" /> : <XCircle className="h-6 w-6 text-rose-400 shrink-0" />}
              <div>
                <h3 className={cn("font-semibold text-lg", eligible ? "text-emerald-200" : partiallyEligible ? "text-amber-200" : "text-rose-200")}>
                  {eligible ? "Eligible to proceed" : partiallyEligible ? "Conditional eligibility" : "Not eligible under current conditions"}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {eligible
                    ? "Your building meets the basic eligibility criteria for Right to Manage. The next step is to form an RTM company and serve the notice."
                    : partiallyEligible
                      ? "Your building may qualify, but you need to resolve the outstanding issues first. Read the details below."
                      : "Based on your answers, RTM may not be available for this property. Consider alternative routes such as enfranchisement or contacting LEASE for advice."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200">Your answers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-slate-500 uppercase">Property type</div>
                <div className="text-slate-200 font-medium mt-0.5">{answers.propertyType}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-slate-500 uppercase">Qualifying tenants</div>
                <div className="text-slate-200 font-medium mt-0.5">{answers.qualifyingTenants}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] text-slate-500 uppercase">Non-residential</div>
                <div className="text-slate-200 font-medium mt-0.5">{answers.nonResidential}</div>
              </div>
            </div>
          </div>

          {eligible && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-teal-300">Next steps</h4>
              {[
                { num: 1, text: "Form an RTM company", detail: "All qualifying tenants can become members. Company must be registered at Companies House." },
                { num: 2, text: "Collect qualifying tenant participation", detail: "At least 50% of flats must be held by qualifying tenants (CLRA 2002, s.79(3))." },
                { num: 3, text: "Serve RTM notice on the freeholder", detail: "Section 78 notice must include prescribed information. The freeholder has 2 months to respond." },
                { num: 4, text: "Freeholder may challenge (optional)", detail: "They can apply to the First-tier Tribunal within 2 months on limited grounds." },
                { num: 5, text: "RTM claim date", detail: "If no challenge, or challenge fails, the claim date is the later of: 3 months after notice, or the date the freeholder's response period ends." },
                { num: 6, text: "Management transfers", detail: "On the claim date, the right to manage passes to your RTM company. You become responsible for management." },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-300 shrink-0">{s.num}</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{s.text}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setStep("type"); setAnswers({ propertyType: "", qualifyingTenants: "", nonResidential: "" }); }}
              className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 hover:text-slate-300 transition-colors">
              Start over
            </button>
          </div>
        </div>

        <MethodologyNote title="Legal basis">
          <p><Formula>CLRA 2002, s.78</Formula> Right to Manage: all leaseholders of flats in qualifying buildings have the right to take over management.</p>
          <p><Formula>CLRA 2002, s.79(3)</Formula> Participation threshold: at least half the flats must be held by qualifying tenants (long leases of 21+ years).</p>
          <p><Formula>LFRA 2024, s.49</Formula> Non-residential limit raised from 25% to 50%, allowing more mixed-use buildings to qualify.</p>
        </MethodologyNote>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Home className="h-5 w-5" />}
        title="Right to Manage check"
        description="Find out if your building qualifies for Right to Manage. This takes about 30 seconds."
      />

      <div className={cn(CARD, "p-2")}>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between px-3 py-2 text-[10px] text-slate-500">
          <span>Step {currentIdx + 1} of {stepOrder.length - 1}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {currentWizardStep && (
        <div className={cn(CARD, "p-5 space-y-4")}>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{currentWizardStep.title}</h3>
            {currentWizardStep.desc && <p className="text-sm text-slate-400 mt-1">{currentWizardStep.desc}</p>}
          </div>
          <div className="space-y-2">
            {currentWizardStep.options.map(opt => {
              const isSelected = answers[currentWizardStep.answerKey] === opt.id;
              return (
                <button key={opt.id} onClick={() => {
                  updateAnswer(currentWizardStep.answerKey, opt.id as Answers[keyof Answers]);
                  const currentIdx = WIZARD_STEPS.findIndex(s => s.stepKey === step);
                  if (currentIdx < WIZARD_STEPS.length - 1) {
                    setTimeout(() => setStep(WIZARD_STEPS[currentIdx + 1].stepKey), 200);
                  } else {
                    setTimeout(() => setStep("result"), 200);
                  }
                }}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3",
                    isSelected ? "border-teal-400 bg-teal-500/10" : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]"
                  )}>
                  <div>
                    <div className={cn("font-medium text-sm", isSelected ? "text-teal-200" : "text-slate-300")}>{opt.label}</div>
                    {opt.desc && <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {stepOrder.indexOf(step) > 0 && (
          <button onClick={() => { const prevIdx = stepOrder.indexOf(step) - 1; if (prevIdx >= 0) setStep(stepOrder[prevIdx]); }}
            className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 hover:text-slate-300 transition-colors">
            Back
          </button>
        )}
      </div>
    </div>
  );
}
