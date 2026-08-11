import { useState, useEffect } from "react";
import {
  LayoutDashboard, FileSearch, Users, ListChecks, Database, Activity, ScanLine, BookOpenCheck,
  FlaskConical, Flag, Trophy, ShieldCheck, Search, ClipboardList, Home, Wrench, Settings, FileText, Gavel,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Wordmark, LogoMark } from "@/components/auri/primitives";
import { Overview } from "@/components/auri/Overview";
import { DossierExplorer } from "@/components/auri/DossierExplorer";
import { Communes } from "@/components/auri/Communes";
import { RightsCatalogue } from "@/components/auri/RightsCatalogue";
import { DataSpine } from "@/components/auri/DataSpine";
import { Assurance } from "@/components/auri/Assurance";
import { GatesTool } from "@/components/auri/GatesTool";
import { About } from "@/components/auri/About";
import { ResearchDesk } from "@/components/auri/ResearchDesk";
import { CommandPost } from "@/components/auri/CommandPost";
import { Competition } from "@/components/auri/Competition";
import { RightsChecker } from "@/components/auri/RightsChecker";
import { LeaseScanner } from "@/components/auri/LeaseScanner";
import { ServiceChargeChecker } from "@/components/auri/ServiceChargeChecker";
import { RTMWizard } from "@/components/auri/RTMWizard";
import { CommunityHub } from "@/components/auri/CommunityHub";
import { DocumentHub } from "@/components/auri/DocumentHub";
import { SignoffQueue } from "@/components/auri/SignoffQueue";
import { TruthDiff } from "@/components/auri/TruthDiff";
import MobileCapture from "@/pages/MobileCapture";

const PRIMARY_NAV = [
  { id: "rights-check", label: "My Rights", icon: ShieldCheck },
  { id: "lease-scan", label: "Lease Scanner", icon: Search },
  { id: "doc-hub", label: "Documents", icon: FileText },
  { id: "service-charge", label: "Service Charges", icon: ClipboardList },
  { id: "rtm", label: "RTM Check", icon: Home },
  { id: "community", label: "Community", icon: Users },
];

const REFERENCE_NAV = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "rights", label: "Rights Catalogue", icon: ListChecks },
  { id: "dossier", label: "Dossier Explorer", icon: FileSearch },
  { id: "research", label: "Research", icon: FlaskConical },
  { id: "about", label: "Honesty", icon: BookOpenCheck },
  { id: "signoff", label: "Sign-off Queue", icon: Gavel },
];

const ADMIN_NAV = [
  { id: "command", label: "Command Post", icon: Flag },
  { id: "competition", label: "Competition", icon: Trophy },
  { id: "spine", label: "Data Spine", icon: Database },
  { id: "assurance", label: "Assurance", icon: Activity },
  { id: "gates", label: "Gates", icon: ScanLine },
];

export default function App() {
  const [tab, setTab] = useState("rights-check");

  // Mobile capture route — renders standalone page when /mobile/capture?token=xxx
  const isMobileCapture = window.location.pathname === "/mobile/capture";
  if (isMobileCapture) {
    return <MobileCapture />;
  }

  return (
    <div className="min-h-screen bg-[#04141a] text-slate-200 relative">
      {/* WCAG-AA 2.4.1 Bypass Blocks — skip-to-content link for keyboard users */}
      <a
        href="#main"
        className="sr-only-focusable"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>
      {/* Subtle gradient blobs behind content — glassmorphism needs something to blur through */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-900/20 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[80px]" />
      </div>

      {/* Glass header */}
      <header className="border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 pt-3 pb-2 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <div className="flex flex-col leading-none">
              <Wordmark className="text-lg" />
              <span className="text-[10px] text-teal-500/70 mt-0.5 hidden sm:inline tracking-[0.14em] uppercase">Leasehold Governance &amp; RTM</span>
            </div>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {/* Primary: Resident tools */}
          {PRIMARY_NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                  active ? "border-teal-400 text-teal-200" : "border-transparent text-slate-500 hover:text-teal-200 hover:border-teal-800"
                )}>
                <Icon className={cn("h-4 w-4", active ? "text-teal-300" : "text-slate-600")} /> {n.label}
              </button>
            );
          })}
          <span className="border-l border-white/[0.06] mx-1 self-stretch" />
          {/* Reference */}
          {REFERENCE_NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                  active ? "border-teal-400 text-teal-200" : "border-transparent text-slate-500 hover:text-teal-200 hover:border-teal-800"
                )}>
                <Icon className={cn("h-4 w-4", active ? "text-teal-300" : "text-slate-600")} /> {n.label}
              </button>
            );
          })}
          <span className="border-l border-white/[0.06] mx-1 self-stretch" />
          {/* Admin */}
          {ADMIN_NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                  active ? "border-amber-400/60 text-amber-200/80" : "border-transparent text-slate-600 hover:text-slate-400 hover:border-slate-700"
                )}>
                <Icon className={cn("h-4 w-4", active ? "text-amber-300" : "text-slate-600")} /> {n.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="max-w-6xl mx-auto px-6 py-9">
        {/* Primary: Resident tools */}
        {tab === "rights-check" && <RightsChecker />}
        {tab === "lease-scan" && <LeaseScanner />}
        {tab === "service-charge" && <ServiceChargeChecker />}
        {tab === "rtm" && <RTMWizard />}
        {tab === "community" && <CommunityHub />}
        {tab === "doc-hub" && <DocumentHub />}
        {tab === "signoff" && <SignoffQueue />}
        {/* Reference */}
        {tab === "overview" && <Overview onNavigate={setTab} />}
        {tab === "rights" && <RightsCatalogue />}
        {tab === "dossier" && <DossierExplorer />}
        {tab === "research" && <ResearchDesk />}
        {tab === "about" && <About />}
        {/* Admin */}
        {tab === "command" && <CommandPost />}
        {tab === "competition" && <Competition />}
        {tab === "spine" && <DataSpine />}
        {tab === "assurance" && <Assurance />}
        {tab === "gates" && <GatesTool />}
      </main>

      {/* Glass footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-600 border-t border-white/[0.04] mt-8">
        <Wordmark className="text-xs" /> · AI for Real Estate &amp; Development · leasehold governance &amp; RTM · synthetic pilot fixtures, real statutes + sources · $0 compute · see the Honesty tab.
      </footer>
    </div>
  );
}
