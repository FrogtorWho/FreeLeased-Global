import { useState } from "react";
import {
  Calendar, CheckCircle2, Circle, Clock, FileText, Upload,
  Target, AlertTriangle, ChevronDown, ExternalLink, Flag, Flame, ListChecks,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  SectionHeader, CARD, MethodologyNote,
} from "./primitives";

// ── Competition timeline (sourced from futurecaribbean.com/legal/terms + /about)
  // UPDATED 6 Aug 2026; timeline extended to 21-day sprint (Jul 27 → Aug 16)
const TIMELINE = [
  { date: "2026-05-29", label: "Applications opened", status: "done" as const },
  { date: "2026-07-24", label: "Applications closed", status: "done" as const },
  { date: "2026-07-25", label: "Official notices sent", status: "done" as const },
  { date: "2026-07-27", label: "21-day build sprint began", status: "done" as const },
  { date: "2026-08-16", label: "Build sprint ends; submission deadline", status: "critical" as const },
  { date: "2026-08-TBC", label: "Scoring period (dates TBC)", status: "upcoming" as const },
  { date: "2026-08-TBC", label: "Semi-finalist interviews & live demos", status: "upcoming" as const },
  { date: "2026-08-TBC", label: "Final judging", status: "upcoming" as const },
  { date: "2026-09-TBC", label: "Winners notified", status: "upcoming" as const },
  { date: "2026-09-TBC", label: "Public announcement", status: "upcoming" as const },
  { date: "2026-09", label: "Caribbean Showcase", status: "upcoming" as const },
  { date: "2026-09", label: "NYSE Investor Showcase", status: "upcoming" as const },
];

// ── Logbook deliverables (from the Logbook PDFs; Journal, Data Room, TRL Roadmap)
interface Deliverable {
  id: string;
  section: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "not-started" | "blocked";
  notes?: string;
}

const DELIVERABLES: Deliverable[] = [
  // Logbook; Journal
  { id: "j1", section: "Journal", title: "Build log entries",
    description: "Daily journal documenting what was built, decisions made, and progress against the sprint plan.",
    status: "in-progress", notes: "PROJECT-JOURNAL.md maintained throughout; needs formatting for Logbook submission." },
  { id: "j2", section: "Journal", title: "Technical narrative",
    description: "Coherent write-up of the architecture, methodology, and key technical decisions.",
    status: "in-progress", notes: "Strategy docs exist (truth-protocol, automation-doctrine, DSP); need to condense into a single narrative." },
  // Logbook; Data Room
  { id: "d1", section: "Data Room", title: "Architecture diagram",
    description: "System architecture showing components, data flow, and decision points.",
    status: "done", notes: "architecture-v3.md exists in submission pack." },
  { id: "d2", section: "Data Room", title: "GitHub repository",
    description: "Public repository with OSS licence, setup instructions, and clean README.",
    status: "in-progress", notes: "Codebase is OSS-ready; needs a clean public push with setup docs." },
  { id: "d3", section: "Data Room", title: "Test evidence",
    description: "Demonstrable proof that the system works; test results, endpoint responses, build logs.",
    status: "done", notes: "67/67 tests, tsc clean, live API endpoints verified." },
  { id: "d4", section: "Data Room", title: "Compliance statement",
    description: "Responsible AI statement covering privacy, bias, safety, and licence (300–500 words).",
    status: "in-progress", notes: "compliance-statement-v2.md drafted; needs final review." },
  { id: "d5", section: "Data Room", title: "Pilot evidence or synthetic data label",
    description: "If using synthetic data, it must be clearly labelled. If real data, source and consent documented.",
    status: "done", notes: "Synthetic pilot fixtures are labelled throughout (see Honesty tab)." },
  // Logbook; TRL Roadmap
  { id: "t1", section: "TRL Roadmap", title: "Level definitions (Part 1)",
    description: "Adapted 1–10 maturity ladder with project-specific exit criteria.",
    status: "done", notes: "maturity-ladder.md; 10 levels with concrete exit criteria." },
  { id: "t2", section: "TRL Roadmap", title: "Self-assessment (Part 2)",
    description: "Honest current-level assessment with judge note.",
    status: "in-progress", notes: "Level 4→5 assessed; logbook-submission.md prepared. Needs pasting into Logbook UI." },
  // Submission pack (required by competition)
  { id: "s1", section: "Submission", title: "Project overview",
    description: "Problem, solution, business model, Caribbean/global relevance.",
    status: "done", notes: "project-overview-v3.md ready." },
  { id: "s2", section: "Submission", title: "Demo video or live link",
    description: "3–5 minute demo video or live working link.",
    status: "in-progress", notes: "Live app at preview URL; need to record or confirm live demo path." },
  { id: "s3", section: "Submission", title: "Technical documentation",
    description: "Architecture, agentic workflow diagram, GitHub link, data/models/tools list.",
    status: "done", notes: "architecture-v3.md + github-repo-structure-v2.md ready." },
  { id: "s4", section: "Submission", title: "Compliance & responsible AI",
    description: "300–500 word statement on privacy, GDPR/CCPA/EU AI Act, bias, safety, licence.",
    status: "in-progress", notes: "See d4 above." },
  // MoU & outreach
  { id: "o1", section: "Outreach", title: "MoU letters",
    description: "Letters to Caribbean government agencies expressing partnership intent.",
    status: "done", notes: "7 letters sent (Barbados, Cayman, Guyana, Belize, Jamaica, Trinidad, BIDC)." },
  { id: "o2", section: "Outreach", title: "Sponsor outreach",
    description: "Contact list, email templates, follow-up cadence.",
    status: "in-progress", notes: "Contact list + templates in sponsor-outreach/; follow-ups pending." },
];

// ── Prize structure (from futurecaribbean.com/about)
const PRIZES = [
  { place: "1st", cash: "$25,000+", extras: "3 OWC AI Systems" },
  { place: "2nd", cash: "$15,000+", extras: "2 OWC AI Systems" },
  { place: "3rd", cash: "$10,000+", extras: "1 OWC AI System" },
];

const OPPORTUNITIES = [
  "Highrise & Impala H200 compute (all selected teams)",
  "NoInfra agent-native infra ($10k shared compute)",
  "Shogo AI platform credits",
  "OWC Thunderbolt 5 AI deployment systems",
  "DMZ Soft Landing scholarship (Toronto Metropolitan University)",
  "Powertranz gateway; free 12 months",
  "Live pitch at the New York Stock Exchange",
  "Flights & accommodation via Bookit",
];

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T23:59:59Z");
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusIcon({ status }: { status: Deliverable["status"] }) {
  if (status === "done") return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
  if (status === "in-progress") return <Clock className="h-4 w-4 text-amber-400 shrink-0" />;
  if (status === "blocked") return <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />;
  return <Circle className="h-4 w-4 text-slate-600 shrink-0" />;
}

export function CommandPost() {
  const [openSection, setOpenSection] = useState<string | null>("Journal");

  const sections = [...new Set(DELIVERABLES.map((d) => d.section))];
  const done = DELIVERABLES.filter((d) => d.status === "done").length;
  const inProgress = DELIVERABLES.filter((d) => d.status === "in-progress").length;
  const notStarted = DELIVERABLES.filter((d) => d.status === "not-started" || d.status === "blocked").length;
  const total = DELIVERABLES.length;
  const pct = Math.round((done / total) * 100);

  const daysLeft = daysUntil("2026-08-16");
  const internalCodeFreeze = daysUntil("2026-08-14");
  const internalSubmissions = daysUntil("2026-08-15");

  return (
    <div className="space-y-6">
      {/* ── Sprint countdown ───────────────────────────────────────────── */}
      <SectionHeader
        icon={<Flame className="h-5 w-5" />}
        title="Command Post"
        description="Competition timeline, deliverables tracker, and submission checklist. Everything in one view."
      />

      <div className={cn(CARD, "p-5 relative overflow-hidden")}>
        {/* Glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] via-transparent to-blue-500/[0.03] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Sprint deadline</div>
            <div className="text-2xl font-bold tracking-tight">
              {daysLeft <= 0
                ? <span className="text-red-400">Sprint closed</span>
                : daysLeft === 1
                  ? <span className="text-amber-400">Tomorrow</span>
                  : <span className="text-teal-300">{daysLeft} days left</span>
              }
            </div>
            <div className="text-xs text-slate-400 mt-1">Build period closes 16 August 2026 · scoring dates TBC</div>
            <div className="flex gap-3 mt-2 text-[11px]">
              <span className={cn(
                "px-2 py-0.5 rounded-full",
                internalCodeFreeze <= 0 ? "bg-red-500/15 text-red-300" : internalCodeFreeze <= 2 ? "bg-amber-500/15 text-amber-300" : "bg-white/[0.05] text-slate-400",
              )}>Code freeze: Sat 14 Aug{internalCodeFreeze > 0 ? ` (${internalCodeFreeze}d)` : ""}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full",
                internalSubmissions <= 0 ? "bg-red-500/15 text-red-300" : internalSubmissions <= 2 ? "bg-amber-500/15 text-amber-300" : "bg-white/[0.05] text-slate-400",
              )}>Submissions: Sun 15 Aug{internalSubmissions > 0 ? ` (${internalSubmissions}d)` : ""}</span>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{done}</div>
              <div className="text-[11px] text-slate-400">Complete</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{inProgress}</div>
              <div className="text-[11px] text-slate-400">In progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-500">{notStarted}</div>
              <div className="text-[11px] text-slate-400">Not started</div>
            </div>
          </div>
        </div>
        {/* progress bar */}
        <div className="mt-4 h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all"
               style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{pct}% of deliverables complete</div>
      </div>

      {/* ── Deliverables by section ─────────────────────────────────────── */}
      <SectionHeader icon={<ListChecks className="h-5 w-5" />} title="Deliverables" />

      {sections.map((section) => {
        const items = DELIVERABLES.filter((d) => d.section === section);
        const isOpen = openSection === section;
        return (
          <div key={section} className={cn(CARD, "overflow-hidden")}>
            <button onClick={() => setOpenSection(isOpen ? null : section)}
              aria-label={isOpen ? `Collapse ${section} deliverables` : `Expand ${section} deliverables`}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-100">{section}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300">
                  {items.filter((d) => d.status === "done").length}/{items.length}
                </span>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {isOpen && (
              <div className="border-t border-teal-900/30 divide-y divide-teal-900/20">
                {items.map((d) => (
                  <div key={d.id} className="px-5 py-3.5 flex gap-3">
                    <div className="mt-0.5"><StatusIcon status={d.status} /></div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200">{d.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{d.description}</div>
                      {d.notes && (
                        <div className="text-[11px] text-slate-500 mt-1.5 italic">{d.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <SectionHeader icon={<Calendar className="h-5 w-5" />} title="Competition Timeline"
        description="Key dates from futurecaribbean.com. Times are AST (UTC-4)." />

      <div className={cn(CARD, "p-5")}>
        <div className="space-y-0">
          {TIMELINE.map((t, i) => {
            const days = daysUntil(t.date);
            const isPast = days < 0;
            const isToday = days === 0 || (days >= -1 && days <= 0 && t.status === "critical");
            return (
              <div key={i} className={cn("flex gap-4 py-2.5", isPast && "opacity-40")}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-3 w-3 rounded-full border-2 shrink-0",
                    t.status === "critical" && "border-amber-400 bg-amber-400/30 animate-pulse",
                    t.status === "done" && "border-emerald-400 bg-emerald-400/30",
                    t.status === "upcoming" && "border-teal-600 bg-teal-600/20",
                  )} />
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-teal-900/40 mt-1" />}
                </div>
                <div className="min-w-0 pb-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={cn(
                      "text-xs font-mono",
                      t.status === "critical" ? "text-amber-300" : "text-slate-500",
                    )}>{t.date}</span>
                    <span className={cn("text-sm", isPast ? "text-slate-500" : "text-slate-200")}>{t.label}</span>
                  </div>
                  {t.status === "critical" && days >= 0 && (
                    <span className="text-[11px] text-amber-400/80">
                      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Prizes & opportunities (condensed) ───────────────────────────── */}
      <SectionHeader icon={<Target className="h-5 w-5" />} title="Prizes & Opportunities" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRIZES.map((p) => (
          <div key={p.place} className={cn(CARD, "p-4 text-center relative overflow-hidden group")}>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.04] to-blue-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative text-xs font-medium uppercase tracking-wide text-teal-500">{p.place} place</div>
            <div className="relative text-xl font-bold text-slate-100 mt-1">{p.cash}</div>
            <div className="relative text-xs text-slate-400 mt-0.5">{p.extras}</div>
          </div>
        ))}
      </div>

      <MethodologyNote title="Additional opportunities for winning teams">
        <ul className="space-y-1">
          {OPPORTUNITIES.map((o) => <li key={o}>• {o}</li>)}
        </ul>
      </MethodologyNote>

      {/* ── Judging process (from Terms §6) ──────────────────────────────── */}
      <MethodologyNote title="Judging process (Terms §6)">
        <p>Rubric-based scoring, applied consistently across all tracks. Judges undergo pre-event calibration.
        Two-person verification of final scores. 48-hour freeze between scoring and announcement; no changes
        except arithmetic errors, both verifiers signing off. Conflicts of interest must be disclosed in writing;
        conflicted judges recuse.</p>
        <p className="mt-2">Prize pool: up to $120,000 total ($50k compute across 40 teams + $70k winner pool).
        Cash disbursed after identity verification and sanctions screening. May take up to 60 days.
        A portion may be held back pending post-event milestones.</p>
      </MethodologyNote>

      {/* ── Links ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 text-xs">
        <a href="https://futurecaribbean.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors">
          <ExternalLink className="h-3 w-3" /> futurecaribbean.com
        </a>
        <a href="https://futurecaribbean.com/legal/terms" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors">
          <FileText className="h-3 w-3" /> Terms &amp; Conditions
        </a>
      </div>
    </div>
  );
}
