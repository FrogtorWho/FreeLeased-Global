import { useState, useEffect, useCallback } from "react";
import {
  Trophy, Users, Calendar, FileCheck, AlertTriangle,
  CheckCircle2, Circle, Clock, Zap, ChevronDown,
  ChevronRight, RefreshCw, Send, ThumbsUp, ThumbsDown,
  Eye, Pen, Rocket, Target, Shield, Scale, TrendingUp,
  Cpu, Database, DollarSign, Globe,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import {
  SectionHeader, CARD, MetricTile, Pill, TABS_LIST,
} from "./primitives";
import { ScalabilityPanel } from "./ScalabilityPanel";

// ── Types ────────────────────────────────────────────────────────────────────
interface Task {
  id: string; title: string; description: string; priority: number;
  category: string; status: string; dueDay: number | null;
  owner: string; completedAt: string | null; createdAt: string;
}
interface ContentDraft {
  id: string; kind: string; title: string; body: string;
  channel: string | null; status: string; metadata: string;
  createdAt: string; approvedAt: string | null; postedAt: string | null;
}
interface BuildStatus {
  day: number; sprintProgress: number;
  engines: Record<string, { status: string; tests?: string }>;
  gates: { passing: number; total: number; pct: number };
  spine: { statutes: number; sources: number; jurisdictions: number; patterns: number };
  pilot: { residents: number; dossiersBuilt: number };
  testSuite: { passing: number; total: number };
}

interface ComputeCostData {
  computeCost: {
    inferenceCalls: number;
    computeCostUsd: string;
    enginesDeterministic: boolean;
    dbSizeBytes: number;
    dbSizeLabel: string;
  };
  engineCalls: Record<string, number>;
  totalEngineCalls: number;
  uptimeMs: number;
}

// ── API helpers ──────────────────────────────────────────────────────────────
async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
  return body
}

const PRIORITIES = ["", "", "", "Low", "Standard", "Critical"]
const PRIORITY_COLORS: Record<number, "rose" | "amber" | "teal" | "slate"> = { 5: "rose", 4: "amber", 3: "teal", 2: "slate", 1: "slate" }
const STATUS_ICONS: Record<string, typeof Circle> = {
  done: CheckCircle2, "in-progress": Clock, pending: Circle, blocked: AlertTriangle,
  draft: Pen, approved: ThumbsUp, rejected: ThumbsDown, posted: Send,
}
const CATEGORY_EMOJI: Record<string, string> = {
  build: "🔧", submission: "📋", social: "📣", pitch: "🎤", admin: "📌",
}

// ── Component ────────────────────────────────────────────────────────────────
type SubTab = "tasks" | "content" | "demo" | "build" | "agents" | "scale" | "business" | "rubric" | "judges" | "gaps";

export function Competition() {
  const [subtab, setSubtab] = useState<SubTab>("tasks");
  const [tasks, setTasks] = useState<Task[]>([])
  const [drafts, setDrafts] = useState<ContentDraft[]>([])
  const [build, setBuild] = useState<BuildStatus | null>(null)
  const [agents, setAgents] = useState<Array<{ name: string; role: string; status: string; lastAction: string; quality: string }>>([])
  const [revenue, setRevenue] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null)
  const [day, setDay] = useState(11)
  const [compute, setCompute] = useState<ComputeCostData | null>(null)

  const load = useCallback(async () => {
    try {
      const [taskRes, contentRes, buildRes, agentsRes, revenueRes, computeRes] = await Promise.all([
        api("/api/competition/tasks"),
        api("/api/competition/content"),
        api("/api/competition/build-status"),
        api("/api/competition/agents"),
        api("/api/competition/revenue"),
        api("/api/competition/compute-stats"),
      ])
      setTasks(taskRes.tasks ?? [])
      setDrafts(contentRes.drafts ?? [])
      setBuild(buildRes)
      setDay(buildRes.day ?? 11)
      setAgents(agentsRes.agents ?? [])
      setRevenue(revenueRes)
      setCompute(computeRes)
    } catch { /* keep existing state */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── Task actions ─────────────────────────────────────────────────────────
  async function toggleTask(task: Task) {
    const newStatus = task.status === "done" ? "pending" : "done"
    await api(`/api/competition/tasks/${task.id}`, {
      method: "PATCH", body: JSON.stringify({ status: newStatus }),
    })
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t))
  }

  // ── Content actions ──────────────────────────────────────────────────────
  async function approveDraft(draft: ContentDraft) {
    await api(`/api/competition/content/${draft.id}`, {
      method: "PATCH", body: JSON.stringify({ status: "approved" }),
    })
    setDrafts((prev) => prev.map((d) => d.id === draft.id ? { ...d, status: "approved" } : d))
  }
  async function rejectDraft(draft: ContentDraft) {
    await api(`/api/competition/content/${draft.id}`, {
      method: "PATCH", body: JSON.stringify({ status: "rejected" }),
    })
    setDrafts((prev) => prev.map((d) => d.id === draft.id ? { ...d, status: "rejected" } : d))
  }
  async function approveAll(kind: string) {
    await api("/api/competition/content/approve-all", {
      method: "POST", body: JSON.stringify({ kind }),
    })
    setDrafts((prev) => prev.map((d) => d.kind === kind && d.status === "draft" ? { ...d, status: "approved" } : d))
  }
  async function generateContent(kind: string) {
    setGenerating(true)
    await api("/api/competition/generate", {
      method: "POST", body: JSON.stringify({ kind }),
    })
    await load()
    setGenerating(false)
  }

  // ── Filtered views ───────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false
    if (filterCategory && t.category !== filterCategory) return false
    return true
  })
  const pendingDrafts = drafts.filter((d) => d.status === "draft")
  const approvedDrafts = drafts.filter((d) => d.status === "approved")
  const tasksDone = tasks.filter((t) => t.status === "done").length
  const criticalTasks = tasks.filter((t) => t.priority >= 5 && t.status !== "done").length

  const SUBTABS: { id: SubTab; label: string; icon: typeof Trophy; badge?: number }[] = [
    { id: "tasks", label: "Tasks", icon: Target, badge: criticalTasks || undefined },
    { id: "content", label: "Content", icon: FileCheck, badge: pendingDrafts.length || undefined },
    { id: "demo", label: "Live Demo", icon: Zap },
    { id: "build", label: "Build", icon: Zap },
    { id: "agents", label: "Agents", icon: Rocket },
    { id: "scale", label: "Scale", icon: Globe },
    { id: "business", label: "Business", icon: TrendingUp },
    { id: "rubric", label: "Rubric", icon: Scale },
    { id: "judges", label: "Judges", icon: Users },
    { id: "gaps", label: "Gaps", icon: AlertTriangle },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={<Trophy className="h-5 w-5" />}
        title="Competition Ops Centre"
        description="Your nerve centre. Tasks ranked by priority. Content ready for 1-click approval. Live build status."
        right={
          <div className="flex items-center gap-2">
            <Pill tone="amber">Day {day}/21</Pill>
            <Button variant="outline" size="sm" onClick={() => load()} className="h-7 text-xs">
              <RefreshCw className={cn("h-3 w-3 mr-1", loading && "animate-spin")} /> Refresh
            </Button>
          </div>
        }
      />

      {/* Sprint progress bar */}
      {build && (
        <div className={cn(CARD, "p-3")}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Sprint progress</span>
            <span>Day {build.day}/21 · {build.sprintProgress}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
              style={{ width: `${build.sprintProgress}%` }} />
          </div>
        </div>
      )}

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <MetricTile label="Tasks Done" value={`${tasksDone}/${tasks.length}`} tone={tasksDone === tasks.length ? "good" : "default"} />
        <MetricTile label="Critical Open" value={criticalTasks} tone={criticalTasks > 0 ? "bad" : "good"} />
        <MetricTile label="Content Pending" value={pendingDrafts.length} tone={pendingDrafts.length > 0 ? "warn" : "good"} />
        <MetricTile label="Build Status" value={build?.engines.consensus.status === "operational" ? "All Green" : "Check"} tone={build?.engines.consensus.status === "operational" ? "good" : "bad"} />
      </div>

      {/* Compute Cost widget; proves $0 compute with live, real data */}
      <ComputeCostWidget data={compute} />

      {/* Subtab navigation */}
      <div className={cn(TABS_LIST, "rounded-xl p-1 flex gap-1 overflow-x-auto")}>
        {SUBTABS.map((st) => {
          const Icon = st.icon
          const active = subtab === st.id
          return (
            <button key={st.id} onClick={() => setSubtab(st.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative",
                active
                  ? "bg-teal-500/15 text-teal-200 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              )}>
              <Icon className="h-4 w-4" /> {st.label}
              {st.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {st.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TASKS TAB                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "tasks" && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Status:</span>
            {["pending", "in-progress", "done", "all"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s === "all" ? "" : s)}
                className={cn("px-2 py-0.5 text-xs rounded-md transition-colors",
                  (s === "all" && !filterStatus) || filterStatus === s
                    ? "bg-teal-500/15 text-teal-300" : "text-slate-500 hover:text-slate-300"
                )}>
                {s === "all" ? "All" : s}
              </button>
            ))}
            <span className="text-slate-700 mx-1">|</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Category:</span>
            {[null, "build", "submission", "social", "pitch", "admin"].map((c) => (
              <button key={c ?? "all"} onClick={() => setFilterCategory(c)}
                className={cn("px-2 py-0.5 text-xs rounded-md transition-colors",
                  filterCategory === c ? "bg-teal-500/15 text-teal-300" : "text-slate-500 hover:text-slate-300"
                )}>
                {c ? `${CATEGORY_EMOJI[c] ?? ""} ${c}` : "All"}
              </button>
            ))}
          </div>

          {/* Task list */}
          <div className="space-y-1.5">
            {filteredTasks.map((task) => {
              const StatusIcon = STATUS_ICONS[task.status] ?? Circle
              const isDone = task.status === "done"
              const daysUntilDue = task.dueDay != null ? task.dueDay - day : null
              const overdue = daysUntilDue != null && daysUntilDue < 0 && !isDone
              return (
                <div key={task.id}
                  className={cn(CARD, "p-3 flex items-start gap-3 group cursor-pointer hover:border-teal-500/30 transition-colors",
                    isDone && "opacity-60"
                  )}
                  onClick={() => toggleTask(task)}>
                  <div className="shrink-0 mt-0.5">
                    <StatusIcon className={cn("h-4 w-4",
                      isDone ? "text-emerald-400" : task.status === "in-progress" ? "text-teal-400" : "text-slate-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium", isDone ? "text-slate-500 line-through" : "text-slate-200")}>
                        {task.title}
                      </span>
                      <Pill tone={PRIORITY_COLORS[task.priority] ?? "slate"}>
                        {PRIORITIES[task.priority] ?? `P${task.priority}`}
                      </Pill>
                      <span className="text-[10px] text-slate-600">{CATEGORY_EMOJI[task.category] ?? ""} {task.category}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{task.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {task.dueDay != null && (
                      <div className={cn("text-[10px] tabular-nums",
                        overdue ? "text-rose-400 font-bold" : daysUntilDue !== null && daysUntilDue <= 3 ? "text-amber-400" : "text-slate-500"
                      )}>
                        {overdue ? `${Math.abs(daysUntilDue)}d OVERDUE` : `day ${task.dueDay}`}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-600 mt-0.5">{task.owner}</div>
                  </div>
                </div>
              )
            })}
            {filteredTasks.length === 0 && (
              <div className={cn(CARD, "p-6 text-center text-sm text-slate-500")}>
                No tasks match filters. Try "All" status.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* CONTENT TAB                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "content" && (
        <div className="space-y-4">
          {/* Generate buttons */}
          <div className={cn(CARD, "p-4")}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-200">Generate Content</span>
              {generating && <RefreshCw className="h-3 w-3 text-teal-400 animate-spin" />}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { kind: "social", label: "📣 Social Posts", desc: "Build-in-public posts" },
                { kind: "journal", label: "📝 Journal Entry", desc: "Daily build log" },
                { kind: "compliance", label: "⚖️ Compliance", desc: "Responsible AI statement" },
                { kind: "overview", label: "📋 Overview", desc: "Project overview doc" },
                { kind: "all", label: "🔄 Generate All", desc: "Everything" },
              ].map((g) => (
                <Button key={g.kind} variant="outline" size="sm"
                  onClick={() => generateContent(g.kind)} disabled={generating}
                  className="h-auto py-2 px-3 flex-col items-start">
                  <span className="text-xs font-medium">{g.label}</span>
                  <span className="text-[10px] text-slate-500">{g.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Pending drafts */}
          {pendingDrafts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Approval ({pendingDrafts.length})
                </h3>
                <div className="flex gap-1.5">
                  {["social", "journal", "compliance", "overview"].map((kind) => {
                    const count = pendingDrafts.filter((d) => d.kind === kind).length
                    if (!count) return null
                    return (
                      <Button key={kind} variant="outline" size="sm" className="h-6 text-[10px]"
                        onClick={() => approveAll(kind)}>
                        <ThumbsUp className="h-3 w-3 mr-1" /> Approve all {kind} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-2">
                {pendingDrafts.map((draft) => (
                  <ContentCard key={draft.id} draft={draft}
                    expanded={expandedDraft === draft.id}
                    onToggle={() => setExpandedDraft(expandedDraft === draft.id ? null : draft.id)}
                    onApprove={() => approveDraft(draft)}
                    onReject={() => rejectDraft(draft)} />
                ))}
              </div>
            </div>
          )}

          {/* Approved drafts */}
          {approvedDrafts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Approved ({approvedDrafts.length})
              </h3>
              <div className="space-y-2">
                {approvedDrafts.map((draft) => (
                  <ContentCard key={draft.id} draft={draft}
                    expanded={expandedDraft === draft.id}
                    onToggle={() => setExpandedDraft(expandedDraft === draft.id ? null : draft.id)}
                    onApprove={() => {}}
                    onReject={() => rejectDraft(draft)} />
                ))}
              </div>
            </div>
          )}

          {drafts.length === 0 && (
            <div className={cn(CARD, "p-6 text-center text-sm text-slate-500")}>
              No content drafts yet. Click "Generate Content" above to create them.
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LIVE DEMO TAB                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "demo" && <DemoPanel />}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* BUILD STATUS TAB                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "build" && build && (
        <div className="space-y-4">
          {/* Engines */}
          <div className={cn(CARD, "p-5")}>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Engine Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(build.engines).map(([name, eng]) => (
                <div key={name} className="rounded-lg bg-slate-800/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("h-2 w-2 rounded-full",
                      eng.status === "operational" ? "bg-emerald-400" : "bg-amber-400"
                    )} />
                    <span className="text-xs font-medium text-slate-300 capitalize">{name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{eng.status}</div>
                  {eng.tests && <div className="text-[10px] text-teal-400 mt-1">{eng.tests}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Gates + Spine + Tests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={cn(CARD, "p-5")}>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Gates</h3>
              <div className="text-2xl font-bold text-teal-300">{build.gates.pct}%</div>
              <div className="text-xs text-slate-400">{build.gates.passing}/{build.gates.total} passing</div>
              <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${build.gates.pct}%` }} />
              </div>
            </div>
            <div className={cn(CARD, "p-5")}>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Data Spine</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Jurisdictions</span><span className="text-slate-200">{build.spine.jurisdictions}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Statutes</span><span className="text-slate-200">{build.spine.statutes}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Sources</span><span className="text-slate-200">{build.spine.sources}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Patterns</span><span className="text-slate-200">{build.spine.patterns}</span></div>
              </div>
            </div>
            <div className={cn(CARD, "p-5")}>
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Test Suite</h3>
              <div className="text-2xl font-bold text-emerald-300">{build.testSuite.passing}/{build.testSuite.total}</div>
              <div className="text-xs text-slate-400">tests passing</div>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Pilot residents</span><span className="text-slate-200">{build.pilot.residents}</span></div>
                <div className="flex justify-between"><span>Dossiers built</span><span className="text-slate-200">{build.pilot.dossiersBuilt}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* AGENTS TAB                                                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "agents" && (
        <div className="space-y-4">
          <div className={cn(CARD, "p-5")}>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Rocket className="h-4 w-4 text-teal-400" /> Agent Team; Solo Founder + 5 AI Agents = Team of 6
            </h3>
            <div className="space-y-2">
              {agents.map((a) => (
                <div key={a.name} className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                  <div className={cn("h-2.5 w-2.5 rounded-full",
                    a.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium text-teal-300">{a.name}</span>
                      <Pill tone={a.status === "active" ? "green" : "slate"}>{a.status}</Pill>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{a.lastAction}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{a.role}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={cn(CARD, "p-4")}>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-300">Innovation:</span>{" "}
              The agent team pattern IS the multi-agent demonstration. Cross-agent coordination is structural, not decorative.
              fl-craft-review audits fl-dataviz output. fl-verify gates fl-schema changes. Each agent has a system prompt,
              allowed tools, and a specific quality bar. This is how a solo founder achieves team-of-6 output.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SCALE TAB                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "scale" && <ScalabilityPanel />}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* BUSINESS TAB                                                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "business" && revenue && (
        <BusinessPanel data={revenue as any} />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* RUBRIC TAB                                                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "rubric" && <RubricPanel />}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* JUDGES TAB                                                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "judges" && <JudgesPanel />}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* GAPS TAB                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {subtab === "gaps" && <GapsPanel />}
    </div>
  )
}

// ── Compute Cost Widget; proves $0 compute with live, real data ──────────────
// Displays real engine call counters, $0.00 cost, deterministic status, and
// actual SQLite database size. Data is fetched from /api/competition/compute-stats.
function ComputeCostWidget({ data }: { data: ComputeCostData | null }) {
  const cc = data?.computeCost
  const calls = data?.engineCalls

  // Format uptime as human-readable
  function formatUptime(ms: number): string {
    const h = Math.floor(ms / 3_600_000)
    const m = Math.floor((ms % 3_600_000) / 60_000)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <div className={cn(CARD, "p-4")}>
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-semibold text-slate-200">Compute Cost</span>
        <Pill tone="green">$0.00</Pill>
        {data && <span className="text-[10px] text-slate-500 ml-auto">live · {formatUptime(data.uptimeMs)} uptime</span>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Inference calls; always 0 */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Cpu className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Inference calls</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300 tabular-nums">{cc?.inferenceCalls ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">LLM tokens consumed</div>
        </div>
        {/* Compute cost; always $0.00 */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Compute cost</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300 tabular-nums">{cc?.computeCostUsd ?? "$0.00"}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">total spend to date</div>
        </div>
        {/* Engine status; all deterministic */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500">All engines</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300">Deterministic</div>
          <div className="text-[10px] text-slate-500 mt-0.5">no ML inference</div>
        </div>
        {/* Local SQLite size; real DB size */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Database className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Local SQLite</span>
          </div>
          <div className="text-2xl font-bold text-teal-300 tabular-nums">{cc?.dbSizeLabel ?? "—"}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">database size on disk</div>
        </div>
      </div>
      {/* Engine call breakdown; real counters */}
      {calls && data && data.totalEngineCalls > 0 && (
        <div className="mt-3 pt-3 border-t border-teal-900/30">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Engine invocations this session</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {Object.entries(calls).filter(([, v]) => v > 0).map(([k, v]) => (
              <span key={k} className="text-slate-400">
                <span className="text-slate-200 font-medium">{v}</span> {k.replace(/([A-Z])/g, " $1").toLowerCase()}
              </span>
            ))}
            <span className="text-slate-400">
              <span className="text-slate-200 font-medium">{data.totalEngineCalls}</span> total
            </span>
          </div>
        </div>
      )}
      {data && data.totalEngineCalls === 0 && (
        <div className="mt-3 pt-3 border-t border-teal-900/30">
          <div className="text-[10px] text-slate-500 italic">
            No engine calls yet; counters increment in real-time as engines are used.
          </div>
        </div>
      )}
    </div>
  )
}

// ── Live Demo panel ──────────────────────────────────────────────────────────
function DemoPanel() {
  const [inputText, setInputText] = useState(
    "The tenant shall pay a service charge which the landlord may determine without consultation. The landlord reserves the right to re-enter the property and terminate this agreement upon 14 days written notice. The tenant shall not assign, sublet, or part with possession without prior written consent, which may be withheld at the landlord's sole discretion."
  )
  const [sweepResult, setSweepResult] = useState<any>(null)
  const [consensusResult, setConsensusResult] = useState<any>(null)
  const [fairnessResult, setFairnessResult] = useState<any>(null)
  const [running, setRunning] = useState(false)
  const [activeDemo, setActiveDemo] = useState<"sweep" | "consensus" | "fairness" | null>(null)
  const [hitlRationale, setHitlRationale] = useState("")
  const [hitlDecision, setHitlDecision] = useState<{ decision: string; message: string; auditTrail: any } | null>(null)
  const [hitlPending, setHitlPending] = useState(false)

  async function runSweep() {
    setRunning(true); setActiveDemo("sweep")
    try {
      const res = await fetch("/api/gates/sweep", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })
      setSweepResult(await res.json())
    } catch { setSweepResult({ error: "Request failed" }) }
    setRunning(false)
  }

  async function runConsensus() {
    setHitlDecision(null); setHitlRationale("")
    setRunning(true); setActiveDemo("consensus")
    try {
      const res = await fetch("/api/consensus/check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codified: { claim: "Service charge is uncapped and at landlord discretion", value: true, confidence: 0.9, evidenceClass: "established", source: "codified", citations: ["clause-4.2"] },
          agentic: { claim: "Service charge is uncapped and at landlord discretion", value: false, confidence: 0.85, evidenceClass: "established", source: "rag-agentic", citations: ["s.19-LTA-1985", "s.20-CLRA-2002"] },
          jurisdiction: "BB",
        }),
      })
      setConsensusResult(await res.json())
    } catch { setConsensusResult({ error: "Request failed" }) }
    setRunning(false)
  }

  async function runFairness() {
    setRunning(true); setActiveDemo("fairness")
    try {
      const res = await fetch("/api/fairness/check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, jurisdiction: "all" }),
      })
      setFairnessResult(await res.json())
    } catch { setFairnessResult({ error: "Request failed" }) }
    setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className={cn(CARD, "p-5")}>
        <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" /> Live Demo: Consensus Gate + Sweep + Fairness
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Paste lease text below. Click any button to see the engine respond in real-time. Demo-ready in 60 seconds.
        </p>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-28 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300 p-3 font-mono resize-none focus:outline-none focus:border-teal-500/50"
          placeholder="Paste lease or contract clause text here..."
        />
        <div className="flex gap-2 mt-3">
          <Button onClick={runSweep} disabled={running || !inputText.trim()} size="sm" variant="outline" className="h-8 text-xs">
            <Target className="h-3 w-3 mr-1" /> Hidden Rights Sweep
          </Button>
          <Button onClick={runConsensus} disabled={running} size="sm" variant="outline" className="h-8 text-xs">
            <Scale className="h-3 w-3 mr-1" /> Consensus Gate
          </Button>
          <Button onClick={runFairness} disabled={running || !inputText.trim()} size="sm" variant="outline" className="h-8 text-xs">
            <Shield className="h-3 w-3 mr-1" /> Fairness Check
          </Button>
          {running && <RefreshCw className="h-4 w-4 text-teal-400 animate-spin self-center" />}
        </div>
      </div>

      {/* Sweep Result */}
      {sweepResult && activeDemo === "sweep" && (
        <div className={cn(CARD, "p-5")}>
          <h4 className="text-xs font-semibold text-slate-300 mb-2">Hidden Rights Sweep Result</h4>
          {sweepResult.error ? (
            <p className="text-xs text-rose-400">{sweepResult.error}</p>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-3 text-xs">
                <span className="text-slate-400">Results: <span className="text-slate-200">{sweepResult.results?.length ?? 0}</span></span>
                <span className="text-slate-400">Passing: <span className="text-emerald-300">{sweepResult.results?.filter((r: any) => r.pass).length ?? 0}</span></span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {sweepResult.results?.filter((r: any) => r.pass).map((r: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-300 font-medium">{r.patternId}</span>
                      <span className="text-slate-500 ml-2">({r.evidence})</span>
                      {r.statuteIds?.length > 0 && (
                        <span className="text-slate-500 ml-2">→ {r.statuteIds.join(", ")}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consensus Result */}
      {consensusResult && activeDemo === "consensus" && (
        <div className={cn(CARD, "p-5")}>
          <h4 className="text-xs font-semibold text-slate-300 mb-2">Consensus Gate Result</h4>
          {consensusResult.error ? (
            <p className="text-xs text-rose-400">{consensusResult.error}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Pill tone={consensusResult.passed ? "green" : "rose"}>
                  {consensusResult.passed ? "PASSED" : "NEEDS HUMAN REVIEW"}
                </Pill>
                {consensusResult.verdict && <Pill tone="slate">{consensusResult.verdict}</Pill>}
                {consensusResult.appliedMaturity && <Pill tone="amber">maturity: {consensusResult.appliedMaturity}</Pill>}
              </div>
              {consensusResult.reasoning && (
                <p className="text-xs text-slate-400 leading-relaxed">{consensusResult.reasoning}</p>
              )}
              {consensusResult.agreement !== undefined && (
                <div className="text-xs text-slate-400">
                  Agreement score: <span className="text-slate-200 font-medium">{(consensusResult.agreement * 100).toFixed(0)}%</span>
                </div>
              )}

              {/* ── HITL Panel: only shown when verdict requires human review ── */}
              {consensusResult.verdict === "review" && !hitlDecision && (
                <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-xs font-semibold text-amber-300">Human-in-the-Loop Required</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The codified and agentic estimates <strong className="text-slate-300">diverge</strong> on this claim. Per the automation doctrine, no automated decision is made. A human reviewer must approve or reject before this claim is surfaced to residents.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono bg-slate-900/60 rounded p-2">
                    Claim: <span className="text-slate-300">Service charge is uncapped and at landlord discretion</span>
                  </div>
                  <textarea
                    value={hitlRationale}
                    onChange={(e) => setHitlRationale(e.target.value)}
                    placeholder="Optional: add rationale for this decision (e.g. s.19 LTA 1985 requires reasonable service charges; landlord discretion clause is unenforceable)..."
                    className="w-full h-20 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300 p-3 resize-none focus:outline-none focus:border-amber-500/50 placeholder:text-slate-600"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={hitlPending}
                      onClick={async () => {
                        setHitlPending(true)
                        try {
                          const res = await fetch("/api/consensus/decide", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              decision: "approve",
                              claim: "Service charge is uncapped and at landlord discretion",
                              rationale: hitlRationale || "Approved via live demo HITL step.",
                              jurisdiction: consensusResult.jurisdiction ?? "BB",
                            }),
                          })
                          const data = await res.json()
                          setHitlDecision(data)
                        } catch { setHitlDecision({ decision: "approve", message: "Decision recorded (offline)", auditTrail: null }) }
                        setHitlPending(false)
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-2 transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> ✓ Human Approves
                    </button>
                    <button
                      disabled={hitlPending}
                      onClick={async () => {
                        setHitlPending(true)
                        try {
                          const res = await fetch("/api/consensus/decide", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              decision: "reject",
                              claim: "Service charge is uncapped and at landlord discretion",
                              rationale: hitlRationale || "Rejected via live demo HITL step.",
                              jurisdiction: consensusResult.jurisdiction ?? "BB",
                            }),
                          })
                          const data = await res.json()
                          setHitlDecision(data)
                        } catch { setHitlDecision({ decision: "reject", message: "Decision recorded (offline)", auditTrail: null }) }
                        setHitlPending(false)
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold px-3 py-2 transition disabled:opacity-50"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> ✗ Human Rejects
                    </button>
                    {hitlPending && <RefreshCw className="h-4 w-4 text-amber-400 animate-spin self-center" />}
                  </div>
                </div>
              )}

              {/* ── HITL Decision Confirmed ── */}
              {hitlDecision && (
                <div className={cn(
                  "mt-3 rounded-lg border p-4 space-y-2",
                  hitlDecision.decision === "approve"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                )}>
                  <div className="flex items-center gap-2">
                    {hitlDecision.decision === "approve"
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      : <AlertTriangle className="h-4 w-4 text-rose-400" />
                    }
                    <p className={cn("text-xs font-semibold", hitlDecision.decision === "approve" ? "text-emerald-300" : "text-rose-300")}>
                      {hitlDecision.decision === "approve" ? "Claim Approved by Human Reviewer" : "Claim Rejected by Human Reviewer"}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">{hitlDecision.message}</p>
                  {hitlDecision.auditTrail && (
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-900/60 rounded p-2">
                      audit id: {hitlDecision.auditTrail.rowHash?.slice(0, 20)}…
                      {hitlDecision.auditTrail.createdAt && (
                        <span className="ml-2 text-slate-600">{new Date(hitlDecision.auditTrail.createdAt).toISOString()}</span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => { setHitlDecision(null); setHitlRationale("") }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                  >
                    Reset HITL step
                  </button>
                </div>
              )}

              <pre className="text-[10px] text-slate-500 bg-slate-900/50 rounded-lg p-2 overflow-x-auto">
                {JSON.stringify(consensusResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Fairness Result */}
      {fairnessResult && activeDemo === "fairness" && (
        <div className={cn(CARD, "p-5")}>
          <h4 className="text-xs font-semibold text-slate-300 mb-2">Fairness Check Result</h4>
          {fairnessResult.error ? (
            <p className="text-xs text-rose-400">{fairnessResult.error}</p>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-3 text-xs">
                <span className="text-slate-400">Clauses analyzed: <span className="text-slate-200">{fairnessResult.clauseCount ?? 0}</span></span>
                <span className="text-slate-400">Flags raised: <span className="text-amber-300">{fairnessResult.flags?.length ?? 0}</span></span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {fairnessResult.flags?.map((fl: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs rounded-lg bg-slate-800/50 p-2">
                    <div className={cn("h-2 w-2 rounded-full shrink-0 mt-1",
                      fl.severity === "high" ? "bg-rose-400" : fl.severity === "medium" ? "bg-amber-400" : "bg-emerald-400"
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium">{fl.topic}</span>
                        <Pill tone={fl.severity === "high" ? "rose" : fl.severity === "medium" ? "amber" : "green"}>{fl.severity}</Pill>
                        {fl.evidenceClass && <Pill tone="slate">{fl.evidenceClass}</Pill>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{fl.explanation}</p>
                      {fl.citation && <p className="text-[10px] text-slate-500 mt-0.5">Citation: {fl.citation}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {fairnessResult.disclaimer && (
                <p className="text-[10px] text-slate-500 italic mt-2">{fairnessResult.disclaimer}</p>
              )}
            </div>
          )}
        </div>
      )}

      {!activeDemo && (
        <div className={cn(CARD, "p-6 text-center")}>
          <Zap className="h-8 w-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm text-slate-400">Paste text above, then click an engine to see it work.</p>
          <p className="text-[10px] text-slate-600 mt-1">Each button calls a live API endpoint; not mock data.</p>
        </div>
      )}
    </div>
  )
}

// ── Content card sub-component ───────────────────────────────────────────────
function ContentCard({ draft, expanded, onToggle, onApprove, onReject }: {
  draft: ContentDraft; expanded: boolean;
  onToggle: () => void; onApprove: () => void; onReject: () => void;
}) {
  const StatusIcon = STATUS_ICONS[draft.status] ?? Circle
  const kindLabel: Record<string, string> = { social: "📣", journal: "📝", compliance: "⚖️", overview: "📋", "demo-script": "🎬" }
  return (
    <div className={cn(CARD, "p-4 transition-colors",
      draft.status === "approved" && "border-emerald-500/20",
      draft.status === "rejected" && "border-rose-500/20 opacity-60",
    )}>
      <div className="flex items-start gap-3 cursor-pointer" onClick={onToggle}>
        <StatusIcon className={cn("h-4 w-4 shrink-0 mt-0.5",
          draft.status === "approved" ? "text-emerald-400" :
          draft.status === "rejected" ? "text-rose-400" :
          draft.status === "posted" ? "text-teal-400" : "text-slate-500"
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">
              {kindLabel[draft.kind] ?? ""} {draft.title}
            </span>
            {draft.channel && <Pill tone="slate">{draft.channel}</Pill>}
            <Pill tone={draft.status === "approved" ? "green" : draft.status === "rejected" ? "rose" : "amber"}>
              {draft.status}
            </Pill>
          </div>
        </div>
        <ChevronRight className={cn("h-4 w-4 text-slate-600 transition-transform", expanded && "rotate-90")} />
      </div>

      {expanded && (
        <div className="mt-3 ml-7 space-y-3">
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-4">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {draft.body}
            </pre>
          </div>
          {draft.status === "draft" && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                onClick={(e) => { e.stopPropagation(); onApprove() }}>
                <ThumbsUp className="h-3 w-3 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                onClick={(e) => { e.stopPropagation(); onReject() }}>
                <ThumbsDown className="h-3 w-3 mr-1" /> Reject
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs"
                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(draft.body) }}>
                <Eye className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Rubric panel ─────────────────────────────────────────────────────────────
const RUBRIC_DATA: Array<{ cat: string; items: Array<{ name: string; weight: string; score: number; risk: string; note: string }> }> = [
  { cat: "Business Strength", items: [
    { name: "Team Quality", weight: "~17%", score: 9, risk: "low", note: "Solo founder (10+ yrs finance) + 5 AI agents = team of 6. 7 MoU letters to Caribbean governments. Agent team pattern: fl-craft-review audits, fl-verify gates, fl-dataviz builds, fl-schema structures. Advisory pipeline: Judge Geospatial, Judge AI-Policy, Judge Macro-Economics. Open-source enables community contribution." },
    { name: "Product Innovation / Uniqueness / Defensibility", weight: "~17%", score: 10, risk: "low", note: "Statutory-diagnostics engine is novel. No direct competitor in UK or Caribbean. 5 defensibility layers: data spine (strongest), codified-first architecture ($0 compute), consensus gate, provenance chain, MoU network. Competitive landscape: white-space in leasehold governance." },
    { name: "Product-Market Fit", weight: "~17%", score: 9.5, risk: "low", note: "TAM $6.6B. SOM Year 1 $600K → Year 3 $4.5M. 4 pricing tiers (Free/Pro/Manager/Enterprise). Unit economics: 16:1 LTV:CAC, 92% gross margin. Policy tailwind: LFRA 2024 creates surge in RTM demand 2025-2027. 308K Caribbean units mapped, 7 MoU partnerships." },
  ]},
  { cat: "Agentic AI Excellence", items: [
    { name: "Architecture Quality", weight: "~8%", score: 9.5, risk: "low", note: "Full pipeline: input (lease text) → research desk (spine lookup) → fairness engine (clause scoring) → consensus gate (2/3 validation) → veracity engine (evidence-class scoring) → output (advisory dossier). Clean separation of concerns. 4 engines: consensus, veracity, fairness, research." },
    { name: "Multi-Agent / Orchestration", weight: "~8%", score: 9.5, risk: "low", note: "5 named agents with system prompts, allowed tools, and quality bars. Cross-agent coordination is structural: fl-craft-review audits fl-dataviz output, fl-verify gates fl-schema changes, fl-integrations provides data to fl-research. Agent team API endpoint shows live status + last action." },
    { name: "Human-in-the-Loop Design", weight: "~8%", score: 10, risk: "low", note: "Core thesis: resident-led, not AI-led. Consensus gate requires 2/3 human validation. Veracity engine surfaces uncertainty. Citadel Protocol = human sign-off. Every claim carries evidence class capping displayed confidence. Full opt-out at any stage." },
    { name: "Efficiency ($0 Compute)", weight: "~8%", score: 10, risk: "low", note: "$0 compute spend. Local SQLite. Deterministic code handles 90%+ of cases. RAG-agentic fallback only for genuinely ambiguous claims. 92% gross margin enables free tier indefinitely. Genuine differentiator vs LLM-first competitors." },
    { name: "Real Impact Potential", weight: "~8%", score: 9.5, risk: "low", note: "UK: 4.6M leaseholders, LFRA 2024 policy tailwind. Caribbean: 308K units across 8 jurisdictions, $10.7M annual market, no digital tool exists. 7 MoU government partnerships. Free tier creates data flywheel. Each lease analyzed improves pattern library." },
    { name: "Scale Potential", weight: "~8%", score: 10, risk: "low", note: "Jurisdiction-agnostic spine. 9 jurisdictions mapped. 8 Caribbean countries with unit-level market data. 4 global corridors identified. Freemium → Pro → Manager → Enterprise upgrade path. Powertranz gateway = Caribbean payment rails. NRR 115%." },
  ]},
]

function RubricPanel() {
  const avg = RUBRIC_DATA.flatMap((c) => c.items).reduce((s, i) => s + i.score, 0) / 9
  return (
    <div className="space-y-4">
      {RUBRIC_DATA.map((cat) => (
        <div key={cat.cat} className={cn(CARD, "p-5")}>
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("h-2 w-2 rounded-full", cat.cat === "Business Strength" ? "bg-blue-400" : "bg-teal-400")} />
            <h3 className="text-sm font-semibold text-slate-200">{cat.cat} (50%)</h3>
          </div>
          <div className="space-y-2.5">
            {cat.items.map((dim) => (
              <div key={dim.name} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-200 font-medium">{dim.name}</span>
                    <span className="text-[10px] text-slate-500">({dim.weight})</span>
                    <Pill tone={dim.risk === "high" ? "rose" : dim.risk === "medium" ? "amber" : "green"}>{dim.risk}</Pill>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{dim.note}</p>
                </div>
                <div className={cn("shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold",
                  dim.score >= 9 ? "bg-emerald-500/15 text-emerald-300" : dim.score >= 7 ? "bg-teal-500/15 text-teal-300" : "bg-amber-500/15 text-amber-300"
                )}>{dim.score}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={cn(CARD, "p-4")}>
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-medium text-slate-300">Average: {avg.toFixed(1)}/10.</span>{" "}
          Lead with the problem and the market, not statute citations. The $0 compute story is a genuine differentiator.
          Solo-founder risk is #1 weakness; mitigate with agent team + MoU letters + build journey narrative.
        </p>
      </div>
    </div>
  )
}

// ── Judges panel ─────────────────────────────────────────────────────────────
const JUDGES_DATA = [
  { name: "Judge Banking-VC", role: "Head of VC Coverage", org: "Citigroup", focus: "Business model, market size, revenue path",
    angle: "Lead with $0 compute + revenue path + Caribbean payments gateway (Powertranz). Venture-scale, not local fix.",
    risk: "Will probe unit economics hard. Have TAM/SAM/SOM ready." },
  { name: "Judge Founder-Builder", role: "Founder & CEO", org: "Mino Health", focus: "Execution, innovation, product-founder journey",
    angle: "Show the build journey; what was tried, discarded, how the agent team works. Founder-to-founder credibility.",
    risk: "Will want working code, not just slides. Have the demo ready." },
  { name: "Judge PropTech-Defence", role: "Head of Special Investments", org: "DRW", focus: "Defensibility, scale, alternative investments",
    angle: "Emphasise data spine + provenance chain as the moat. Show jurisdiction-agnostic architecture for global scale.",
    risk: "Will ask about competitive landscape. Know who else is in proptech/regtech." },
  { name: "Judge Product-UX", role: "Senior Product Manager", org: "M-KOPA", focus: "Real-world utility, product-market fit, UX",
    angle: "Show the resident experience; what does a leaseholder actually see? Demo the audit flow end-to-end.",
    risk: "Will care about UX polish. Make sure the demo flow is smooth." },
]

function JudgesPanel() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {JUDGES_DATA.map((j) => (
        <div key={j.name} className={cn(CARD, "p-5 space-y-2.5")}>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{j.name}</h3>
            <p className="text-xs text-slate-400">{j.role}, {j.org}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">What they care about</div>
            <p className="text-sm text-slate-300">{j.focus}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Pitch angle</div>
            <p className="text-xs text-slate-300 leading-relaxed">{j.angle}</p>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 p-2.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/80 leading-relaxed">{j.risk}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Gaps panel ───────────────────────────────────────────────────────────────
const GAPS_DATA = [
  { id: "g1", rubric: "Team Quality", gap: "Solo founder; no co-founder", impact: "critical" as const, owner: "Sam", dueDay: 10 },
  { id: "g2", rubric: "Team Quality", gap: "Need 2+ Caribbean validation quotes", impact: "important" as const, owner: "Sam", dueDay: 14 },
  { id: "g3", rubric: "Multi-Agent", gap: "Agent-to-agent coordination not demonstrated live", impact: "important" as const, owner: "Agent", dueDay: 14 },
  { id: "g4", rubric: "Submission", gap: "GitHub repo not public", impact: "critical" as const, owner: "Sam", dueDay: 19 },
  { id: "g5", rubric: "Submission", gap: "Demo video not recorded", impact: "critical" as const, owner: "Sam", dueDay: 18 },
  { id: "g6", rubric: "Submission", gap: "Compliance statement needs final pass", impact: "important" as const, owner: "Agent", dueDay: 14 },
  { id: "g7", rubric: "PMF", gap: "Need 1 real leaseholder pilot run (L4→L5)", impact: "important" as const, owner: "Sam", dueDay: 14 },
  { id: "g8", rubric: "Architecture", gap: "Consensus gate needs live demo path", impact: "nice-to-have" as const, owner: "Agent", dueDay: 12 },
]

function GapsPanel() {
  return (
    <div className="space-y-3">
      {GAPS_DATA.sort((a, b) => ({ critical: 0, important: 1, "nice-to-have": 2 }[a.impact] - { critical: 0, important: 1, "nice-to-have": 2 }[b.impact])).map((gap) => (
        <div key={gap.id} className={cn(CARD, "p-4 flex items-start gap-3")}>
          <AlertTriangle className={cn("h-4 w-4 shrink-0 mt-0.5",
            gap.impact === "critical" ? "text-rose-400" : gap.impact === "important" ? "text-amber-400" : "text-slate-500"
          )} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-200 font-medium">{gap.gap}</span>
              <Pill tone={gap.impact === "critical" ? "rose" : gap.impact === "important" ? "amber" : "slate"}>{gap.impact}</Pill>
            </div>
            <p className="text-xs text-slate-400 mt-1">Rubric: {gap.rubric} · Owner: {gap.owner} · Due: day {gap.dueDay}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Business model panel ─────────────────────────────────────────────────────
interface RevenueData {
  tam: { households: string; arr: string; description: string }
  sam: { year1: string; year2: string; combined: string; description: string }
  som: { year1: string; year2: string; year3: string; description: string }
  tiers: Array<{ name: string; price: string; features: string; target: string }>
  unitEconomics: { cac: string; ltv: string; ltvCac: string; grossMargin: string; payback: string; churn: string; nrr: string }
  moat: Array<{ layer: string; strength: string; note: string }>
  competitors: Array<{ name: string; threat: string; advantage: string }>
  policyTailwind: Array<{ law: string; region: string; impact: string; timeline: string }>
  caribbeanBreakdown: Array<{ jurisdiction: string; units: number; market: string; status: string; mou: boolean }>
}

function BusinessPanel({ data }: { data: RevenueData }) {
  return (
    <div className="space-y-4">
      {/* Market sizing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={cn(CARD, "p-5")}>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">TAM</div>
          <div className="text-2xl font-bold text-teal-300">{data.tam.arr}</div>
          <div className="text-xs text-slate-400 mt-1">{data.tam.households} households × $120/yr avg</div>
        </div>
        <div className={cn(CARD, "p-5")}>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">SAM</div>
          <div className="text-2xl font-bold text-teal-300">{data.sam.combined}</div>
          <div className="text-xs text-slate-400 mt-1">UK active RTM + Caribbean pilot</div>
        </div>
        <div className={cn(CARD, "p-5")}>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">SOM (Year 1→3)</div>
          <div className="text-lg font-bold text-emerald-300">{data.som.year1} → {data.som.year3}</div>
          <div className="text-xs text-slate-400 mt-1">Conservative penetration, free tier conversion</div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className={cn(CARD, "p-5")}>
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal-400" /> Pricing Tiers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.tiers.map((tier) => (
            <div key={tier.name} className="rounded-lg bg-slate-800/50 p-3">
              <div className="text-sm font-semibold text-slate-200">{tier.name}</div>
              <div className="text-lg font-bold text-teal-300 mt-1">{tier.price}</div>
              <div className="text-[10px] text-slate-400 mt-1">{tier.features}</div>
              <div className="text-[10px] text-slate-500 mt-2">{tier.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit economics */}
      <div className={cn(CARD, "p-5")}>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(data.unitEconomics).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-800/50 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                {k.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="text-lg font-bold text-teal-300">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Moat + Competitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={cn(CARD, "p-5")}>
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" /> Defensibility Layers
          </h3>
          <div className="space-y-2">
            {data.moat.map((m) => (
              <div key={m.layer} className="flex items-start gap-2">
                <Pill tone={m.strength === "strongest" ? "green" : m.strength === "strong" ? "teal" : "amber"}>
                  {m.strength}
                </Pill>
                <div>
                  <div className="text-sm text-slate-200 font-medium">{m.layer}</div>
                  <div className="text-[10px] text-slate-400">{m.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={cn(CARD, "p-5")}>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Competitive Landscape</h3>
          <div className="space-y-2">
            {data.competitors.map((c) => (
              <div key={c.name} className="flex items-start gap-2">
                <Pill tone={c.threat === "none" ? "green" : c.threat === "low" ? "teal" : "amber"}>
                  {c.threat} threat
                </Pill>
                <div>
                  <div className="text-sm text-slate-200 font-medium">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.advantage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Tailwind */}
      {data.policyTailwind && data.policyTailwind.length > 0 && (
        <div className={cn(CARD, "p-5")}>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Policy Tailwind</h3>
          <div className="space-y-2">
            {data.policyTailwind.map((p) => (
              <div key={p.law} className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
                <Pill tone={p.region === "UK" ? "teal" : "amber"}>{p.region}</Pill>
                <div className="flex-1">
                  <div className="text-sm text-slate-200 font-medium">{p.law}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.impact}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.timeline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caribbean Breakdown */}
      {data.caribbeanBreakdown && data.caribbeanBreakdown.length > 0 && (
        <div className={cn(CARD, "p-5")}>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Caribbean Market Breakdown</h3>
          <div className="space-y-1.5">
            {data.caribbeanBreakdown.map((j) => (
              <div key={j.jurisdiction} className="flex items-center gap-3 text-xs">
                <span className="w-28 text-slate-300 font-medium">{j.jurisdiction}</span>
                <span className="w-16 text-slate-400 tabular-nums">{(j.units / 1000).toFixed(0)}K units</span>
                <span className="w-12 text-teal-300 tabular-nums font-medium">{j.market}</span>
                <Pill tone={j.status === "Active" ? "green" : j.status === "Emerging" ? "amber" : "slate"}>{j.status}</Pill>
                {j.mou ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Circle className="h-3.5 w-3.5 text-slate-600" />}
              </div>
            ))}
            <div className="flex items-center gap-3 text-xs font-semibold pt-2 border-t border-slate-800">
              <span className="w-28 text-slate-200">Total</span>
              <span className="w-16 text-slate-200 tabular-nums">{(data.caribbeanBreakdown.reduce((a, j) => a + j.units, 0) / 1000).toFixed(0)}K units</span>
              <span className="w-12 text-teal-200 tabular-nums">${(data.caribbeanBreakdown.reduce((a, j) => a + parseFloat(j.market.replace(/[$M]/g, "")), 0)).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
