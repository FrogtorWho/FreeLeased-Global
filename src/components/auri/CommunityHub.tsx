import { useState, useEffect, useRef } from "react";
import {
  Users, CheckCircle2, Clock, Vote, FileText, MessageSquare, Target,
  ChevronRight, ChevronDown, Plus, Send, Lock, Globe, Calendar,
  AlertTriangle, Circle, ExternalLink, Scale, ArrowRight, UserPlus,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, SectionHeader, MethodologyNote, Formula } from "./primitives";

type HubTab = "dashboard" | "tasks" | "votes" | "messages" | "documents" | "milestones";

const GOAL_ICONS: Record<string, string> = {
  rtm: "🏛",
  "service-charge-challenge": "£",
  "building-safety": "🏗",
  enfranchisement: "🔑",
  general: "👥",
};

interface ResidentGroup {
  id: string;
  name: string;
  buildingName: string | null;
  jurisdictionCode: string;
  goal: string;
  status: string;
  description: string | null;
  isPublic: boolean;
  memberCount: number;
  qualifyingThreshold: number | null;
}

interface GroupTask {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  assignedTo: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  category: string;
}

interface GroupVote {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  threshold: number | null;
  createdBy: string;
  closesAt: string | null;
  result: string | null;
}

interface GroupMessage {
  id: string;
  groupId: string;
  memberId: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

interface GroupDocument {
  id: string;
  groupId: string;
  title: string;
  docType: string;
  content: string | null;
  uploadedBy: string;
  createdAt: string;
}

interface GroupMilestone {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  deadline: string;
  status: string;
}

export function CommunityHub() {
  const [groups, setGroups] = useState<ResidentGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HubTab>("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resident-groups")
      .then(r => r.json())
      .then(data => { setGroups(data.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const currentGroup = groups.find(g => g.id === selectedGroup);

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={<Users className="h-5 w-5" />} title="Community Hub" description="Loading..." />
        <div className={cn(CARD, "p-8 text-center text-slate-500")}>Loading community groups...</div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<Users className="h-5 w-5" />}
          title="Community Hub"
          description="Form a group with your neighbours. Organise RTM, challenge service charges, coordinate building safety. Everything stays private to your group."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <button key={group.id} onClick={() => setSelectedGroup(group.id)}
              className={cn(CARD, "p-5 text-left hover:bg-white/[0.06] transition-all group")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{GOAL_ICONS[group.goal] || "👥"}</span>
                    <h3 className="font-semibold text-slate-100 truncate">{group.name}</h3>
                  </div>
                  {group.buildingName && <p className="text-xs text-slate-500 mb-2">{group.buildingName}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {group.memberCount} members</span>
                    <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> {group.jurisdictionCode}</span>
                    <span className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-full",
                      group.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                      group.status === "forming" ? "bg-amber-500/10 text-amber-400" :
                      "bg-slate-500/10 text-slate-400"
                    )}>
                      {group.status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {group.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-teal-400 transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}

          <button className={cn(CARD, "p-5 border-dashed hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-slate-500 hover:text-slate-400 min-h-[120px]")}>
            <Plus className="h-8 w-8 mb-2 opacity-40" />
            <span className="text-sm font-medium">Form a new group</span>
          </button>
        </div>

        {groups.length === 0 && (
          <div className={cn(CARD, "p-10 text-center")}>
            <Users className="h-16 w-16 mx-auto mb-3 opacity-10" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No groups yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Form a group with your neighbours to organise collective action.
              Whether it's Right to Manage, a service charge challenge, or building safety remediation, you're stronger together.
            </p>
          </div>
        )}
      </div>
    );
  }

  const tabs: Array<{ id: HubTab; label: string; icon: typeof Users }> = [
    { id: "dashboard", label: "Overview", icon: Target },
    { id: "tasks", label: "Tasks", icon: CheckCircle2 },
    { id: "votes", label: "Votes", icon: Vote },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "milestones", label: "Milestones", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setSelectedGroup(null)} className="text-sm text-slate-500 hover:text-teal-300 transition-colors">
          &larr; All groups
        </button>
      </div>

      <SectionHeader
        icon={<span className="text-lg">{GOAL_ICONS[currentGroup?.goal || ""] || "👥"}</span>}
        title={currentGroup?.name || "Group"}
        description={currentGroup?.buildingName ? `${currentGroup.buildingName} · ${currentGroup.jurisdictionCode}` : currentGroup?.jurisdictionCode}
      />

      <div className={cn("flex gap-1 overflow-x-auto", "bg-white/[0.03] border border-white/[0.06] backdrop-blur-lg rounded-xl p-1")}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all",
                activeTab === t.id
                  ? "bg-teal-500/15 text-teal-200 border border-teal-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
              )}>
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && <GroupDashboard groupId={selectedGroup} group={currentGroup} />}
      {activeTab === "tasks" && <GroupTaskBoard groupId={selectedGroup} />}
      {activeTab === "votes" && <GroupVoting groupId={selectedGroup} />}
      {activeTab === "messages" && <GroupMessages groupId={selectedGroup} />}
      {activeTab === "documents" && <GroupDocVault groupId={selectedGroup} />}
      {activeTab === "milestones" && <GroupMilestoneTracker groupId={selectedGroup} />}
    </div>
  );
}

function GroupDashboard({ groupId, group }: { groupId: string; group: ResidentGroup | undefined }) {
  const [tasks, setTasks] = useState<GroupTask[]>([]);
  const [votes, setVotes] = useState<GroupVote[]>([]);
  const [milestones, setMilestones] = useState<GroupMilestone[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/resident-groups/${groupId}/tasks`).then(r => r.json()),
      fetch(`/api/resident-groups/${groupId}/votes`).then(r => r.json()),
      fetch(`/api/resident-groups/${groupId}/milestones`).then(r => r.json()),
    ]).then(([t, v, m]) => {
      setTasks(t.items || []);
      setVotes(v.items || []);
      setMilestones(m.items || []);
    }).catch(() => {});
  }, [groupId]);

  const tasksDone = tasks.filter(t => t.status === "done").length;
  const tasksActive = tasks.filter(t => t.status !== "done" && t.status !== "blocked").length;
  const openVotes = votes.filter(v => v.status === "open").length;
  const nextMilestone = milestones
    .filter(m => m.status === "pending")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  const goalInfo: Record<string, { title: string; desc: string; steps: string[] }> = {
    rtm: {
      title: "Right to Manage",
      desc: "Your group is organising to take over management of your building under the Commonhold and Leasehold Reform Act 2002.",
      steps: ["Form RTM company", "Collect qualifying tenant signatures", "Serve RTM notice", "Manage transition"],
    },
    "service-charge-challenge": {
      title: "Service Charge Challenge",
      desc: "Your group is challenging unlawful or excessive service charges through the First-tier Tribunal.",
      steps: ["Gather evidence", "Request s.21 summary", "File T3/T1 application", "Tribunal hearing"],
    },
    "building-safety": {
      title: "Building Safety Remediation",
      desc: "Your group is coordinating building safety compliance under the Building Safety Act 2022.",
      steps: ["Identify safety issues", "Engage building safety regulator", "Commission remediation", "Verify compliance"],
    },
    enfranchisement: {
      title: "Collective Enfranchisement",
      desc: "Your group is exercising the collective right to purchase the freehold under the Leasehold Reform, Housing and Urban Development Act 1993.",
      steps: ["Verify eligibility", "Form nominee company", "Serve purchase notice", "Valuation + completion"],
    },
  };

  const info = group ? goalInfo[group.goal] : undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={cn(CARD, "p-4 text-center")}>
          <div className="text-2xl font-bold text-teal-300">{tasksDone}/{tasks.length || "0"}</div>
          <div className="text-[11px] text-slate-400">Tasks complete</div>
        </div>
        <div className={cn(CARD, "p-4 text-center")}>
          <div className="text-2xl font-bold text-amber-300">{tasksActive}</div>
          <div className="text-[11px] text-slate-400">Active tasks</div>
        </div>
        <div className={cn(CARD, "p-4 text-center")}>
          <div className="text-2xl font-bold text-purple-300">{openVotes}</div>
          <div className="text-[11px] text-slate-400">Open votes</div>
        </div>
        <div className={cn(CARD, "p-4 text-center")}>
          <div className="text-2xl font-bold text-emerald-300">{group?.memberCount || 0}</div>
          <div className="text-[11px] text-slate-400">Members</div>
        </div>
      </div>

      {nextMilestone && (
        <div className={cn(CARD, "p-4 border-l-4 border-amber-400")}>
          <div className="text-xs text-amber-400 font-medium mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Next milestone
          </div>
          <div className="font-semibold text-slate-100">{nextMilestone.title}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Due: {new Date(nextMilestone.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      )}

      {info && (
        <div className={cn(CARD, "p-5")}>
          <h3 className="font-semibold text-slate-100 mb-1">{info.title}</h3>
          <p className="text-sm text-slate-400 mb-3">{info.desc}</p>
          <div className="space-y-1.5">
            {info.steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  i < tasksDone ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.05] text-slate-500"
                )}>
                  {i < tasksDone ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </div>
                <span className={cn(i < tasksDone ? "text-slate-400 line-through" : "text-slate-300")}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupTaskBoard({ groupId }: { groupId: string }) {
  const [tasks, setTasks] = useState<GroupTask[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("normal");

  const load = () => fetch(`/api/resident-groups/${groupId}/tasks`).then(r => r.json()).then(d => setTasks(d.items || [])).catch(() => {});
  useEffect(() => { load(); }, [groupId]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/resident-groups/${groupId}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const createTask = async () => {
    if (!newTitle.trim()) return;
    await fetch(`/api/resident-groups/${groupId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, priority: newPriority, status: "todo" }),
    });
    setNewTitle("");
    setShowNew(false);
    load();
  };

  const priorityStyle: Record<string, string> = {
    urgent: "bg-red-500/10 text-red-300 border-red-500/30",
    high: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    normal: "bg-white/[0.04] text-slate-400 border-white/[0.06]",
    low: "bg-slate-500/10 text-slate-500 border-slate-500/30",
  };

  const statusStyle: Record<string, string> = {
    todo: "border-l-slate-500",
    "in-progress": "border-l-amber-400",
    done: "border-l-emerald-400",
    blocked: "border-l-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">Group tasks</h3>
        <button onClick={() => setShowNew(!showNew)}
          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add task
        </button>
      </div>

      {showNew && (
        <div className={cn(CARD, "p-4 space-y-3")}>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Task description..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            onKeyDown={e => e.key === "Enter" && createTask()} autoFocus />
          <div className="flex items-center gap-2">
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            <button onClick={createTask} className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium">Save</button>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className={cn(CARD, "p-8 text-center text-slate-500 text-sm")}>
          <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
          No tasks yet. Add the first one.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.sort((a, b) => {
            const p = { urgent: 0, high: 1, normal: 2, low: 3 };
            return (p[a.priority as keyof typeof p] ?? 9) - (p[b.priority as keyof typeof p] ?? 9);
          }).map(task => (
            <div key={task.id} className={cn(CARD, "p-3 border-l-4", statusStyle[task.status] || "border-l-slate-500")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn("text-sm font-medium", task.status === "done" ? "text-slate-500 line-through" : "text-slate-100")}>
                      {task.title}
                    </h4>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", priorityStyle[task.priority])}>
                      {task.priority}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </div>
                  )}
                </div>
                <select value={task.status} onChange={e => updateStatus(task.id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-white/[0.08] bg-white/[0.03] text-slate-400 cursor-pointer">
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupVoting({ groupId }: { groupId: string }) {
  const [votes, setVotes] = useState<GroupVote[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const load = () => fetch(`/api/resident-groups/${groupId}/votes`).then(r => r.json()).then(d => setVotes(d.items || [])).catch(() => {});
  useEffect(() => { load(); }, [groupId]);

  const createVote = async () => {
    if (!newTitle.trim()) return;
    const validOptions = options.filter(o => o.trim());
    await fetch(`/api/resident-groups/${groupId}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDesc || undefined,
        type: "simple",
        status: "open",
      }),
    });
    setNewTitle("");
    setNewDesc("");
    setShowNew(false);
    load();
  };

  const castVote = async (voteId: string, option: string) => {
    await fetch(`/api/resident-groups/${groupId}/votes/${voteId}/ballot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option }),
    });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">Group votes</h3>
        <button onClick={() => setShowNew(!showNew)}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> New vote
        </button>
      </div>

      {showNew && (
        <div className={cn(CARD, "p-4 space-y-3")}>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Vote title..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Details (optional)..." rows={2}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 resize-none" />
          <button onClick={createVote} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium">Create vote</button>
        </div>
      )}

      {votes.length === 0 ? (
        <div className={cn(CARD, "p-8 text-center text-slate-500 text-sm")}>
          <Vote className="h-10 w-10 mx-auto mb-2 opacity-20" />
          No votes yet. Create one to make a group decision.
        </div>
      ) : (
        <div className="space-y-3">
          {votes.map(vote => (
            <div key={vote.id} className={cn(CARD, "p-4")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-100">{vote.title}</h4>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full",
                      vote.status === "open" ? "bg-emerald-500/10 text-emerald-400" :
                      vote.result === "passed" ? "bg-teal-500/10 text-teal-400" :
                      "bg-slate-500/10 text-slate-500"
                    )}>
                      {vote.status === "open" ? "Open" : vote.result || "Closed"}
                    </span>
                  </div>
                  {vote.description && <p className="text-xs text-slate-400 mt-1">{vote.description}</p>}
                  {vote.closesAt && vote.status === "open" && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Closes: {new Date(vote.closesAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
              </div>
              {vote.status === "open" && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button onClick={() => castVote(vote.id, "Yes")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition-colors">
                    Yes
                  </button>
                  <button onClick={() => castVote(vote.id, "No")}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-600/30 transition-colors">
                    No
                  </button>
                  <button onClick={() => castVote(vote.id, "Abstain")}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-xs font-medium hover:bg-white/[0.06] transition-colors">
                    Abstain
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupMessages({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/resident-groups/${groupId}/messages`).then(r => r.json()).then(d => {
      setMessages(d.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!newMsg.trim()) return;
    await fetch(`/api/resident-groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMsg }),
    });
    setNewMsg("");
    const d = await fetch(`/api/resident-groups/${groupId}/messages`).then(r => r.json());
    setMessages(d.items || []);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5" /> Private to group members only
      </div>

      <div className={cn(CARD, "p-4 h-[400px] flex flex-col")}>
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {loading && <div className="text-slate-500 text-sm">Loading messages...</div>}
          {!loading && messages.length === 0 && (
            <div className="text-slate-500 text-sm text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No messages yet. Start the conversation.
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex flex-col", msg.pinned && "bg-amber-500/5 -mx-2 px-2 py-1 rounded-lg border-l-2 border-amber-400")}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-teal-300">{msg.memberId.slice(0, 8)}</span>
                <span className="text-[10px] text-slate-600">{new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                {msg.pinned && <span className="text-[10px] text-amber-400">Pinned</span>}
              </div>
              <p className="text-sm text-slate-300 mt-0.5">{msg.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 border-t border-white/[0.06] pt-3">
          <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={send} disabled={!newMsg.trim()}
            aria-label="Send message"
            className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white transition-colors">
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupDocVault({ groupId }: { groupId: string }) {
  const [docs, setDocs] = useState<GroupDocument[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("lease");
  const [newContent, setNewContent] = useState("");

  const load = () => fetch(`/api/resident-groups/${groupId}/documents`).then(r => r.json()).then(d => setDocs(d.items || [])).catch(() => {});
  useEffect(() => { load(); }, [groupId]);

  const createDoc = async () => {
    if (!newTitle.trim()) return;
    await fetch(`/api/resident-groups/${groupId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, docType: newType, content: newContent || undefined }),
    });
    setNewTitle("");
    setNewContent("");
    setShowNew(false);
    load();
  };

  const typeColors: Record<string, string> = {
    lease: "bg-blue-500/10 text-blue-300",
    correspondence: "bg-purple-500/10 text-purple-300",
    tribunal: "bg-amber-500/10 text-amber-300",
    notice: "bg-rose-500/10 text-rose-300",
    evidence: "bg-emerald-500/10 text-emerald-300",
    other: "bg-slate-500/10 text-slate-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">Shared document vault</h3>
        <button onClick={() => setShowNew(!showNew)}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add document
        </button>
      </div>

      {showNew && (
        <div className={cn(CARD, "p-4 space-y-3")}>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Document title..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
          <select value={newType} onChange={e => setNewType(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <option value="lease">Lease</option>
            <option value="correspondence">Correspondence</option>
            <option value="tribunal">Tribunal document</option>
            <option value="notice">Notice</option>
            <option value="evidence">Evidence</option>
            <option value="other">Other</option>
          </select>
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Notes or text content..." rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 resize-none" />
          <button onClick={createDoc} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">Save document</button>
        </div>
      )}

      {docs.length === 0 ? (
        <div className={cn(CARD, "p-8 text-center text-slate-500 text-sm")}>
          <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
          No documents yet. Upload leases, correspondence, or evidence.
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className={cn(CARD, "p-3 hover:bg-white/[0.06] transition-all")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-100">{doc.title}</h4>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded", typeColors[doc.docType] || typeColors.other)}>
                      {doc.docType}
                    </span>
                  </div>
                  {doc.content && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.content}</p>}
                  <div className="text-[10px] text-slate-600 mt-1">
                    Uploaded {new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupMilestoneTracker({ groupId }: { groupId: string }) {
  const [milestones, setMilestones] = useState<GroupMilestone[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const load = () => fetch(`/api/resident-groups/${groupId}/milestones`).then(r => r.json()).then(d => setMilestones(d.items || [])).catch(() => {});
  useEffect(() => { load(); }, [groupId]);

  const createMilestone = async () => {
    if (!newTitle.trim() || !newDeadline) return;
    await fetch(`/api/resident-groups/${groupId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, deadline: newDeadline }),
    });
    setNewTitle("");
    setNewDeadline("");
    setShowNew(false);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/resident-groups/${groupId}/milestones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const statusStyle: Record<string, string> = {
    pending: "border-l-amber-400 bg-amber-500/5",
    achieved: "border-l-emerald-400 bg-emerald-500/5",
    missed: "border-l-red-400 bg-red-500/5",
    waived: "border-l-slate-400 bg-slate-500/5",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">Milestones & deadlines</h3>
        <button onClick={() => setShowNew(!showNew)}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add milestone
        </button>
      </div>

      {showNew && (
        <div className={cn(CARD, "p-4 space-y-3")}>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Milestone title..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
          <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-300" />
          <button onClick={createMilestone} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium">Save milestone</button>
        </div>
      )}

      {milestones.length === 0 ? (
        <div className={cn(CARD, "p-8 text-center text-slate-500 text-sm")}>
          <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
          No milestones yet. Track key deadlines for your action.
        </div>
      ) : (
        <div className="space-y-2">
          {milestones.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(m => (
            <div key={m.id} className={cn(CARD, "p-3 border-l-4", statusStyle[m.status])}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className={cn("text-sm font-medium", m.status === "achieved" ? "text-slate-500" : "text-slate-100")}>
                    {m.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(m.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <select value={m.status} onChange={e => updateStatus(m.id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-white/[0.08] bg-white/[0.03] text-slate-400 cursor-pointer">
                  <option value="pending">Pending</option>
                  <option value="achieved">Achieved</option>
                  <option value="missed">Missed</option>
                  <option value="waived">Waived</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
