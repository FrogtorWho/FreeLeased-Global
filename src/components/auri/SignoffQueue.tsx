import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck, Check, X, MessageSquarePlus, AlertTriangle, Scale,
  FileWarning, Eye, GitBranch, Gavel, RefreshCw, ChevronDown, Clock, Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CARD, SectionHeader, MethodologyNote, MetricTile } from "./primitives";

interface ReviewItem {
  id: string;
  kind: string;
  title: string;
  claim: string;
  jurisdiction: string;
  residentId: string;
  evidenceClass: string;
  confidence: number;
  sources: string;
  agentTrail: string;
  routing: string;
  status: string;
  reviewer?: string | null;
  annotation?: string | null;
  decidedAt?: string | null;
  rowHash: string;
  appealReason?: string | null;
  appealedAt?: string | null;
  createdAt: string;
}

interface Counts { pending: number; approved: number; rejected: number; appealed: number; }

const KIND_META: Record<string, { label: string; icon: any; tone: string }> = {
  consensus_divergence: { label: "Consensus Divergence", icon: GitBranch, tone: "text-amber-300 bg-amber-500/10 ring-amber-500/20" },
  fairness_flag: { label: "Fairness Flag", icon: Scale, tone: "text-rose-300 bg-rose-500/10 ring-rose-500/20" },
  rights_assertion: { label: "Rights Assertion", icon: Gavel, tone: "text-blue-300 bg-blue-500/10 ring-blue-500/20" },
  redaction: { label: "Redaction (PII)", icon: FileWarning, tone: "text-purple-300 bg-purple-500/10 ring-purple-500/20" },
  legal_claim: { label: "Legal Claim", icon: Scale, tone: "text-teal-300 bg-teal-500/10 ring-teal-500/20" },
};

const EVIDENCE_HEX: Record<string, string> = {
  established: "#34d399",
  heuristic: "#f59e0b",
  contested: "#f43f5e",
  unfalsifiable: "#6b8a8a",
};

export function SignoffQueue() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, approved: 0, rejected: 0, appealed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/review-queue${q}`);
      const data = await res.json();
      if (data.ok) {
        setItems(data.items || []);
        setCounts(data.counts || { pending: 0, approved: 0, rejected: 0, appealed: 0 });
      }
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const seedDemo = useCallback(async () => {
    await fetch("/api/review-queue/seed", { method: "POST" });
    load();
  }, [load]);

  const decide = useCallback(async (id: string, decision: string, annotation?: string) => {
    setActing(id);
    try {
      await fetch(`/api/review-queue/${id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, annotation, reviewer: "Sam (reviewer)" }),
      });
      await load();
    } finally {
      setActing(null);
    }
  }, [load]);

  const appeal = useCallback(async (id: string, reason: string) => {
    setActing(id);
    try {
      await fetch(`/api/review-queue/${id}/appeal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      await load();
    } finally {
      setActing(null);
    }
  }, [load]);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<ShieldCheck className="w-5 h-5" />}
        title="Sign-off Queue"
        description="Human-in-the-loop control plane. Every resident-facing legal claim and consensus divergence is signed off by a person before it surfaces — with full provenance and an audit trail."
        right={
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 px-2 py-1 rounded-lg border border-white/10"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile label="Pending" value={String(counts.pending)} sub="awaiting sign-off" tone="warn" />
        <MetricTile label="Approved" value={String(counts.approved)} sub="signed off" tone="good" />
        <MetricTile label="Rejected" value={String(counts.rejected)} sub="suppressed" tone="bad" />
        <MetricTile label="Appealed" value={String(counts.appealed)} sub="resident contested" tone="default" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["pending", "appealed", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition",
              filter === f ? "bg-teal-600 text-white" : "bg-white/5 text-slate-400 hover:text-teal-200"
            )}
          >
            {f}
          </button>
        ))}
        {items.length === 0 && !loading && (
          <button
            onClick={seedDemo}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:text-teal-200 border border-white/10"
          >
            Load demo queue
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm py-8 text-center">Loading queue…</div>
      ) : items.length === 0 ? (
        <div className={cn(CARD, "text-center py-12")}>
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-teal-400/30" />
          <p className="text-slate-400">No items in this view.</p>
          <p className="text-xs text-slate-500 mt-1">
            {filter === "pending" ? "Nothing awaiting sign-off — the queue is clear." : "Try a different filter or load the demo queue."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ReviewCard
              key={item.id}
              item={item}
              expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              onDecide={decide}
              onAppeal={appeal}
              acting={acting === item.id}
            />
          ))}
        </div>
      )}

      <MethodologyNote>
        This is the CoC §4 human-in-the-loop control. Nothing that asserts a legal right, flags a clause, or estimates a
        figure reaches a resident without a human sign-off. Every decision writes an immutable record to the Signoff ledger
        (row-hashed). Residents can lodge an <strong>appeal</strong>, which re-opens the item — the system never has the last word.
      </MethodologyNote>
    </div>
  );
}

function ReviewCard({
  item, expanded, onToggle, onDecide, onAppeal, acting,
}: {
  item: ReviewItem;
  expanded: boolean;
  onToggle: () => void;
  onDecide: (id: string, decision: string, annotation?: string) => void;
  onAppeal: (id: string, reason: string) => void;
  acting: boolean;
}) {
  const [note, setNote] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [showAppeal, setShowAppeal] = useState(false);

  const meta = KIND_META[item.kind] || KIND_META.legal_claim;
  const Icon = meta.icon;
  const sources: string[] = safeParse(item.sources, []);
  const agentTrail: Array<{ agent: string; output: string; confidence: number }> = safeParse(item.agentTrail, []);

  const statusTone: Record<string, string> = {
    pending: "text-amber-300 bg-amber-500/10",
    approved: "text-emerald-300 bg-emerald-500/10",
    rejected: "text-rose-300 bg-rose-500/10",
    appealed: "text-blue-300 bg-blue-500/10",
  };

  return (
    <div className={cn(CARD, "p-4")}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1", meta.tone)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 leading-tight">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] text-slate-500">{meta.label}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-500">{item.jurisdiction}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ring-1"
                  style={{ color: EVIDENCE_HEX[item.evidenceClass], backgroundColor: `${EVIDENCE_HEX[item.evidenceClass]}18` }}
                  title="Evidence class caps the displayed confidence"
                >
                  {item.evidenceClass}
                </span>
                <span className="text-[11px] text-slate-500">conf {Math.round(item.confidence * 100)}%</span>
              </div>
            </div>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize whitespace-nowrap", statusTone[item.status])}>
              {item.status}
            </span>
          </div>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.claim}</p>

          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-300 mt-2"
          >
            <Eye className="w-3.5 h-3.5" /> Provenance
            <ChevronDown className={cn("w-3.5 h-3.5 transition", expanded && "rotate-180")} />
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 border-t border-white/5 pt-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Agent trail</p>
                <div className="space-y-1.5">
                  {agentTrail.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-teal-300 font-medium min-w-[110px]">{a.agent}</span>
                      <span className="text-slate-400 flex-1">{a.output}</span>
                      {a.confidence > 0 && <span className="text-slate-500">{Math.round(a.confidence * 100)}%</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Sources</p>
                <ul className="space-y-1">
                  {sources.map((s, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <Scale className="w-3 h-3 mt-0.5 shrink-0 text-slate-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              {item.rowHash && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Fingerprint className="w-3 h-3" /> row-hash: <code className="text-slate-400">{item.rowHash.slice(0, 24)}…</code>
                </div>
              )}
            </div>
          )}

          {item.annotation && (
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-300 bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <MessageSquarePlus className="w-3.5 h-3.5 mt-0.5 shrink-0 text-teal-300" />
              <span><span className="text-slate-500">{item.reviewer}:</span> {item.annotation}</span>
            </div>
          )}

          {item.status === "appealed" && item.appealReason && (
            <div className="mt-3 flex items-start gap-2 text-xs text-blue-200 bg-blue-500/10 rounded-lg p-2.5 border border-blue-500/20">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span><span className="text-blue-300 font-medium">Resident appeal:</span> {item.appealReason}</span>
            </div>
          )}

          {/* Actions */}
          {(item.status === "pending" || item.status === "appealed") && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onDecide(item.id, "approve", note || undefined)}
                  disabled={acting}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & sign off
                </button>
                <button
                  onClick={() => onDecide(item.id, "reject", note || undefined)}
                  disabled={acting}
                  className="flex items-center gap-1.5 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  onClick={() => note.trim() && onDecide(item.id, "annotate", note)}
                  disabled={acting || !note.trim()}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" /> Annotate
                </button>
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a reviewer note (attached to the audit record)…"
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600"
              />
            </div>
          )}

          {/* Resident appeal path — available once decided */}
          {(item.status === "approved" || item.status === "rejected") && (
            <div className="mt-3">
              {!showAppeal ? (
                <button
                  onClick={() => setShowAppeal(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200"
                >
                  <Gavel className="w-3.5 h-3.5" /> Resident: appeal this decision
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder="Why should this decision be reconsidered?"
                    rows={2}
                    className="w-full bg-slate-900/60 border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-slate-200 resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { if (appealReason.trim()) { onAppeal(item.id, appealReason); setShowAppeal(false); } }}
                      disabled={acting || !appealReason.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      Lodge appeal
                    </button>
                    <button
                      onClick={() => setShowAppeal(false)}
                      className="text-xs text-slate-500 hover:text-slate-300 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {item.decidedAt && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
              <Clock className="w-3 h-3" /> decided {new Date(item.decidedAt).toLocaleString()} by {item.reviewer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function safeParse<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
