import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShieldCheck, ShieldAlert, User2, Building2, Globe2, FileText, ListChecks,
  AlertTriangle, CheckCircle2, Fingerprint, ExternalLink, Scale,
} from "lucide-react";
import { RESIDENTS } from "../../data/fixtures";
import { HIDDEN_RIGHTS, STATUTES, JURISDICTIONS } from "../../data/spine";
import { buildDossier, type AgentVerdict } from "../../lib/engines";
import { BAND_COLOR, SIGNOFF_COLOR, JURISDICTION_NAME } from "./ui-helpers";
import { MethodologyNote, Formula } from "./primitives";

function VerdictHeader({ v }: { v: AgentVerdict }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-100">{v.agent}</span>
        <Badge variant="outline" className={BAND_COLOR[v.band]}>
          {v.abstain ? "ABSTAIN" : `DS ${v.ds}`}
        </Badge>
      </div>
      <div className="text-xs text-slate-400 font-mono">
        Bel {v.belief.toFixed(2)} · Pl {v.plausibility.toFixed(2)}
      </div>
    </div>
  );
}

function ProvenanceRow({ v }: { v: AgentVerdict }) {
  return (
    <div className="mt-3 space-y-1">
      <div className="text-[11px] uppercase tracking-wider text-slate-400">5-tuple provenance</div>
      {v.provenance.map((p, i) => (
        <div key={i} className="text-xs text-slate-400 font-mono flex flex-wrap gap-x-2">
          <span className="text-slate-300">{p.sourceId}</span>
          <span>· {p.method}</span>
          <span>· {p.fetchedAt.slice(0, 10)}</span>
          <span>· conf {p.confidence.toFixed(2)}</span>
          <a href={p.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-0.5">
            source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ))}
    </div>
  );
}

function BeliefBand({ v }: { v: AgentVerdict }) {
  const bel = Math.round(v.belief * 100);
  const pl = Math.round(v.plausibility * 100);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
        <span>Dempster–Shafer belief interval</span>
        <span className="font-mono tabular-nums">[{v.belief.toFixed(2)} , {v.plausibility.toFixed(2)}]</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-slate-800 overflow-hidden">
        {/* belief = supported lower bound */}
        <div className="absolute inset-y-0 left-0 bg-teal-500/80" style={{ width: `${bel}%` }} />
        {/* belief..plausibility = uncertainty mass */}
        <div className="absolute inset-y-0 bg-teal-500/25" style={{ left: `${bel}%`, width: `${Math.max(0, pl - bel)}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>belief {bel}%</span><span>uncertainty → plausibility {pl}%</span></div>
    </div>
  );
}

function VerdictCard({ v }: { v: AgentVerdict }) {
  return (
    <Card className="p-4 bg-slate-900/60 border-teal-900/40">
      <VerdictHeader v={v} />
      {v.abstain && (
        <div className="mt-2 flex items-center gap-2 text-amber-300 text-sm">
          <AlertTriangle className="h-4 w-4" /> Honest abstention; preserved, not fabricated.
        </div>
      )}
      <BeliefBand v={v} />
      <p className="mt-2 text-sm text-slate-300">{v.summary}</p>
      <ul className="mt-2 space-y-0.5">
        {v.findings.map((f, i) => (
          <li key={i} className="text-xs text-slate-400 flex gap-1.5">
            <span className="text-slate-600">·</span> {f}
          </li>
        ))}
      </ul>
      <ProvenanceRow v={v} />
    </Card>
  );
}

export function DossierExplorer() {
  const [selected, setSelected] = useState("BB-R01");
  const [filter, setFilter] = useState("");
  const [jFilter, setJFilter] = useState<string>("all");
  const [signoffMsg, setSignoffMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () => RESIDENTS.filter(
      (r) => (jFilter === "all" || r.jurisdiction === jFilter) && r.id.toLowerCase().includes(filter.toLowerCase())
    ),
    [filter, jFilter]
  );

  const resident = RESIDENTS.find((r) => r.id === selected)!;
  const dossier = useMemo(() => buildDossier(resident), [resident]);
  const hidden = dossier.verdicts.find((v) => v.axis === "hidden_rights")!;
  const juris = JURISDICTIONS.find((j) => j.code === resident.jurisdiction)!;

  async function signOff(decision: string) {
    setBusy(true); setSignoffMsg(null);
    try {
      const res = await fetch(`/api/dossier/${selected}/signoff`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reviewer: "resident", note: `Dossier ${dossier.rowHash} reviewed via SPA` }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setSignoffMsg(body.error ?? `Request failed (${res.status})`); return; }
      await fetch(`/api/dossier/${selected}/log`, { method: "POST" }).catch(() => {});
      setSignoffMsg(`Recorded: ${decision} · row ${body.signoff?.rowHash ?? dossier.rowHash} written to the sign-off ledger.`);
    } catch (e) {
      setSignoffMsg(`Network error: ${(e as Error).message}`);
    } finally { setBusy(false); }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
      {/* Resident picker */}
      <Card className="p-3 bg-[#071b21]/70 border-teal-900/40 h-fit">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-200">
          <User2 className="h-4 w-4 text-teal-400" /> 50-resident pilot cohort
        </div>
        <Input placeholder="Filter by id…" value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-2 bg-slate-950 border-teal-900/40" />
        <div className="flex gap-1 mb-2 flex-wrap">
          {["all", "BB", "JM", "KY"].map((j) => (
            <button key={j} onClick={() => setJFilter(j)}
              className={`text-xs px-2 py-1 rounded border ${jFilter === j ? "bg-teal-500/20 border-teal-500/40 text-teal-200" : "border-teal-900/40 text-slate-400 hover:text-slate-200"}`}>
              {j === "all" ? "All" : j}
            </button>
          ))}
        </div>
        <ScrollArea className="h-[440px] pr-2">
          <div className="space-y-1">
            {filtered.map((r) => {
              const d = buildDossier(r);
              return (
                <button key={r.id} onClick={() => { setSelected(r.id); setSignoffMsg(null); }}
                  className={`w-full text-left px-2.5 py-2 rounded-md border text-sm flex items-center justify-between gap-2 ${selected === r.id ? "bg-slate-800 border-slate-600" : "border-transparent hover:bg-slate-900"}`}>
                  <span className="font-mono text-slate-200">{r.id}</span>
                  <span className={`h-2 w-2 rounded-full ${d.signOff === "all-green" ? "bg-emerald-400" : d.signOff === "hitl-required" ? "bg-amber-400" : "bg-rose-400"}`} />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Dossier */}
      <div className="space-y-4">
        <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-mono">{dossier.residentId}</h2>
                <Badge variant="outline" className="border-slate-700 text-slate-300">{JURISDICTION_NAME[dossier.jurisdiction]}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {resident.axes.resident.holderType} · pseudonymous pilot fixture · row hash{" "}
                <span className="font-mono text-slate-400">{dossier.rowHash}</span>
              </p>
            </div>
            <Badge variant="outline" className={`${SIGNOFF_COLOR[dossier.signOff]} text-sm px-3 py-1`}>
              {dossier.signOff === "all-green" ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <ShieldAlert className="h-4 w-4 mr-1" />}
              {dossier.signOff}
            </Badge>
          </div>

          {/* Redaction Protocol */}
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {dossier.redaction.ruleResults.map((r) => (
              <div key={r.rule} className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded border border-teal-900/40 bg-slate-950/50">
                {r.pass ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />}
                <span className="text-slate-300">{r.rule}</span>
              </div>
            ))}
          </div>

          {dossier.abstained.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-2">
              <AlertTriangle className="h-4 w-4" />
              {dossier.abstained.length} agent(s) abstained ({dossier.abstained.join(", ")}). A human reviewer must sign off before publish.
            </div>
          )}
        </Card>

        <Tabs defaultValue="resident">
          <TabsList className="bg-slate-900 border border-teal-900/40 flex-wrap h-auto">
            <TabsTrigger value="resident"><User2 className="h-4 w-4 mr-1" />Resident</TabsTrigger>
            <TabsTrigger value="building"><Building2 className="h-4 w-4 mr-1" />Building</TabsTrigger>
            <TabsTrigger value="country"><Globe2 className="h-4 w-4 mr-1" />Country</TabsTrigger>
            <TabsTrigger value="contracts"><FileText className="h-4 w-4 mr-1" />Contracts</TabsTrigger>
            <TabsTrigger value="action"><ListChecks className="h-4 w-4 mr-1" />Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="resident" className="mt-3">
            <VerdictCard v={dossier.verdicts[0]} />
          </TabsContent>
          <TabsContent value="building" className="mt-3">
            <VerdictCard v={dossier.verdicts[1]} />
          </TabsContent>

          <TabsContent value="country" className="mt-3">
            <Card className="p-4 bg-slate-900/60 border-teal-900/40 space-y-2">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2"><Globe2 className="h-4 w-4 text-teal-400" />{juris.name}</h3>
              <p className="text-sm text-slate-300">Tenure system: {juris.tenureSystem}</p>
              <p className="text-sm text-slate-400">Climate exposure: {juris.climate}</p>
              <div className="text-sm">
                <span className="text-slate-400">Operating registry: </span>
                <a href={juris.registry.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">{juris.registry.name}</a>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Statistical office: </span>
                <a href={juris.statisticalOffice.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">{juris.statisticalOffice.name}</a>
              </div>
              <div className="pt-2 border-t border-teal-900/40">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Applicable statutes</div>
                {STATUTES.filter((s) => s.jurisdiction === juris.code).map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block text-sm text-slate-300 hover:text-teal-300">
                    <Scale className="h-3.5 w-3.5 inline mr-1 text-slate-400" />{s.shortTitle} <span className="text-slate-400">({s.citation})</span>
                  </a>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="mt-3">
            <VerdictCard v={dossier.verdicts[2]} />
          </TabsContent>

          <TabsContent value="action" className="mt-3 space-y-3">
            {hidden.abstain ? (
              <Card className="p-4 bg-amber-500/10 border-amber-500/30 text-amber-200 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> No action plan generated; the Hidden Rights agent abstained. Preserved honestly.
              </Card>
            ) : (
              <>
                <div className="text-sm text-slate-400">
                  {hidden.matchedRightIds.length} of 20 hidden-rights patterns engaged for this resident.
                </div>
                {hidden.matchedRightIds.map((id) => {
                  const p = HIDDEN_RIGHTS.find((x) => x.id === id)!;
                  return (
                    <Card key={id} className="p-4 bg-slate-900/60 border-teal-900/40">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="border-teal-500/40 text-teal-300 shrink-0">#{p.id}</Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-100">{p.title}</h4>
                          <p className="text-sm text-slate-300 mt-1">{p.plain}</p>
                          <div className="mt-2 text-sm">
                            <span className="text-emerald-400 font-medium">Remedy: </span>
                            <span className="text-slate-300">{p.remedy}</span>
                          </div>
                          {p.limitationPeriod && (
                            <div className="text-xs text-amber-300 mt-1">⏳ Limitation: {p.limitationPeriod}</div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {p.statuteIds.map((sid) => {
                              const s = STATUTES.find((x) => x.id === sid);
                              return s ? (
                                <a key={sid} href={s.url} target="_blank" rel="noreferrer"
                                  className="text-[11px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 hover:text-teal-300 inline-flex items-center gap-0.5">
                                  {s.shortTitle} <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
          </TabsContent>
        </Tabs>

        <MethodologyNote title="Model: Data-Sufficiency gauge + honest abstention">
          <p>Each agent scores a Data-Sufficiency value <Formula>DS ∈ [0,100]</Formula> from field completeness, registry match and source coverage. Below the threshold <Formula>DS &lt; 60</Formula> the agent returns <span className="text-amber-300">ABSTAIN</span> rather than guessing. The bar above each verdict is the Dempster–Shafer interval: the solid part is <span className="text-slate-300">belief</span> (evidence that positively supports the verdict), the faded part is the remaining <span className="text-slate-300">uncertainty mass</span> up to <span className="text-slate-300">plausibility</span>. Consensus publishes a dossier only when no agent abstains; otherwise it routes to human review.</p>
        </MethodologyNote>

        {/* Sign-off */}
        <Card className="p-4 bg-[#071b21]/70 border-teal-900/40">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-200">
            <Fingerprint className="h-4 w-4 text-teal-400" /> Redaction Protocol sign-off
          </div>
          <p className="text-xs text-slate-400 mb-3">
            The resident (or a human reviewer where an agent abstained) accepts the dossier. The decision is written to the
            persistent sign-off ledger with the row hash; a real database write.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" disabled={busy} onClick={() => signOff("accepted")} className="bg-emerald-600 hover:bg-emerald-500">Accept dossier</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => signOff("hitl-reviewed")} className="border-slate-700">Human-reviewed</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => signOff("rejected")} className="border-rose-700 text-rose-300">Reject</Button>
          </div>
          {signoffMsg && <p className="text-xs mt-3 text-slate-300 bg-slate-950/60 border border-teal-900/40 rounded px-3 py-2">{signoffMsg}</p>}
        </Card>
      </div>
    </div>
  );
}
