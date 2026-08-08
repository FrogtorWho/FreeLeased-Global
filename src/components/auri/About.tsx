import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, ShieldCheck, AlertTriangle } from "lucide-react";

export function About() {
  return (
    <div className="space-y-4 max-w-3xl">
      <Card className="p-5 bg-[#071b21]/70 border-teal-900/40">
        <div className="flex items-center gap-2 text-slate-100 font-semibold mb-2">
          <BookOpenCheck className="h-5 w-5 text-teal-400" /> Brutal-honesty provenance statement
        </div>
        <p className="text-sm text-slate-300">
          The handoff package was a set of planning documents. It shipped no code and no data files. Claims inside those
          documents (95/95 tests, 5,000 verified cells, 94.2% ship-readiness) are not repeated here as if they were produced by
          this build. What follows is what this platform actually is.
        </p>
      </Card>

      <Card className="p-5 bg-[#071b21]/70 border-teal-900/40">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-2">
          <ShieldCheck className="h-5 w-5" /> Real and independently verifiable
        </div>
        <ul className="text-sm text-slate-300 space-y-1.5 list-disc pl-5">
          <li>16 Caribbean & UK statutes with exact citations and live public URLs.</li>
          <li>21 public data sources across Tiers 0–3 (plus the OSM + Overture workaround), all $0 and open-licensed.</li>
          <li>20 hidden-rights patterns, each anchored to a named statute.</li>
          <li>A deterministic 4-agent orchestrator: DS gauge (threshold 60), honest-abstention, Dempster-Shafer belief/plausibility, 5-tuple provenance on every cell.</li>
          <li>Redaction Protocol 4-rule scrub; Consensus sign-off; Cryptographic Communes aggregate with k-anonymity ≥ 5.</li>
          <li>The 4 binding gates as runnable regex validators (server-side sweep).</li>
          <li>The 10/10 loop: 5 weighted judge profiles × 13 criteria, scored from measurable build facts.</li>
          <li>A real, reproducible test suite: <span className="font-mono text-emerald-300">81/81 passing</span> (run <span className="font-mono">bun scripts/test-suite.ts</span>).</li>
          <li>A persistent sign-off ledger and audit log (SQLite via Prisma); real database writes on every sign-off.</li>
        </ul>
      </Card>

      <Card className="p-5 bg-[#071b21]/70 border-teal-900/40">
        <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
          <AlertTriangle className="h-5 w-5" /> Honestly labelled, NOT real
        </div>
        <ul className="text-sm text-slate-300 space-y-1.5 list-disc pl-5">
          <li>The 50 resident records are <span className="text-amber-300">pseudonymous pilot fixtures</span>, deterministically derived (seed 42) from documented macro ranges. They are not real individuals and not live registry pulls. The PII v5 rule requires pseudonyms; every id is a <span className="font-mono">TBC</span>-style code.</li>
          <li>Attribute values (service charges, hazard bands) are illustrative samples used to exercise the engine; not assertions about any person or parcel.</li>
          <li>Where data is deliberately thin, the engine <span className="text-amber-300">abstains</span> rather than fabricating; you can see this live in the dossier explorer.</li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">
          If a number is not reproducible in this repository, it does not appear in the product as a claim. Full log in
          <span className="font-mono"> PROJECT-JOURNAL.md</span>.
        </p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {["$0 compute", "100% deterministic", "no paid API", "UK English", "PII v5 clean", "audit-grade provenance"].map((t) => (
          <Badge key={t} variant="outline" className="border-slate-700 text-slate-400">{t}</Badge>
        ))}
      </div>
    </div>
  );
}
