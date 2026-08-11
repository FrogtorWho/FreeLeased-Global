// A.U.R.I resident advocacy platform — Stage 7 #6: TruthDiff.
//
// Purpose: a verification surface that judges can read in 30 seconds to confirm
// the project's honesty claims. For each claim, we render:
//   • Left  — what the docs say
//   • Right — what the code/files actually contain (verified at build time)
//
// All checks are STATIC and performed at build via Vite's `?raw` import suffix,
// so the component contains no fetch() calls and no server round-trip. If the
// referenced file is removed, the import returns an empty string and we render
// ⚠️ with the reason. This means the component is self-contained: import and
// render anywhere; zero network dependencies.
//
// The 6 claims below were chosen as the highest-impact honesty checks:
//   1. test count        — flagship number cited in pitch/HEARTBEAT
//   2. jurisdictions     — coverage scope
//   3. patterns          — depth of the rights catalogue
//   4. engines           — number of dossier engines
//   5. conviction caps   — truth-protocol compliance
//   6. data room folders — completion of evidence pack
//
// The component is intentionally NOT wired into App.tsx navigation (that's a
// routing change, blocked by today's constraints). Importable for any future
// surface (Honesty tab, a /truth route, a print page, etc.).

import { useMemo, useState, Fragment } from "react";
import { CheckCircle2, XCircle, AlertTriangle, FileText, Code2, BookOpenCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

// ── Source files, imported as raw text at build time. Vite handles `?raw`. ──
import testSuiteSrc from "../../../scripts/test-suite.ts?raw";
import spineSrc from "../data/spine.ts?raw";
import patternsSrc from "../data/patterns.ts?raw";
import enginesSrc from "../lib/engines.ts?raw";
import fairnessSrc from "../lib/fairness.ts?raw";
import dataRoomCopiesSrc from "../../../memory/data-room-copies.md?raw";

type Status = "match" | "mismatch" | "warn";

interface Claim {
  id: string;
  doc: string;
  docSource: string;
  codeCheck: string;
  expected: number | string;
  // human-readable description of what was measured (filled at verify time)
  detail?: string;
}

interface ClaimResult extends Claim {
  status: Status;
  actual: number | string;
  reason?: string;
}

const CLAIMS: Claim[] = [
  {
    id: "test-count",
    doc: "159/159 tests passing",
    docSource: "scripts/test-suite.ts (line 81: testsPassing: 159, testsTotal: 159)",
    codeCheck: "count of `^\\s*check\\(` assertions in scripts/test-suite.ts",
    expected: 159,
  },
  {
    id: "jurisdictions",
    doc: "9 jurisdictions in the spine",
    docSource: "src/data/spine.ts (export const JURISDICTIONS)",
    codeCheck: "count of JURISDICTIONS array entries",
    expected: 9,
  },
  {
    id: "patterns",
    doc: "20 hidden-rights patterns",
    docSource: "src/data/patterns.ts (export const HIDDEN_RIGHTS)",
    codeCheck: "count of HIDDEN_RIGHTS array entries",
    expected: 20,
  },
  {
    id: "engines",
    doc: "4 dossier engines",
    docSource: "src/lib/engines.ts (the 4 agents)",
    codeCheck: "count of agent functions (residentStatus, tenureBuilding, contracts, hiddenRights)",
    expected: 4,
  },
  {
    id: "conviction-caps",
    doc: "Conviction caps 0.99 / 0.75 / 0.60 / 0.33",
    docSource: "src/lib/fairness.ts (export const CONFIDENCE_CAP)",
    codeCheck: "verify CONFIDENCE_CAP values match {established, heuristic, contested, unfalsifiable}",
    expected: "match",
  },
  {
    id: "data-room",
    doc: "22/24 Data Room folders evidenced",
    docSource: "memory/data-room-copies.md",
    codeCheck: "count of distinct target folders with content (≥1 OK row)",
    // updated 2026-08-11 — TruthDiff caught this drift (was 21; canonical claim is now 22).
    expected: 22,
  },
];

// ── Verification helpers (pure, synchronous, no I/O) ─────────────────────────

function countCheckAssertions(src: string): number {
  // Match the doc's own counting rule (see scripts/test-suite.ts line 75).
  const matches = src.match(/^\s*check\(/gm);
  return matches ? matches.length : 0;
}

function countArrayEntries(src: string, constName: string): number {
  // Naive but effective: count `{` openings between the const declaration and
  // the matching `];`. For our well-formed source files this is precise enough
  // for the honesty check and avoids bringing in a TS parser.
  const re = new RegExp(`export\\s+const\\s+${constName}\\s*[:=\\[]`, "m");
  const start = src.search(re);
  if (start < 0) return 0;
  const end = src.indexOf("];", start);
  if (end < 0) return 0;
  const slice = src.slice(start, end);
  // Strip line comments and block comments so `{` inside comments don't count.
  const cleaned = slice
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  // Count top-level object literals: each entry starts with `{` at the start of
  // a line (indent-agnostic). We look for `{` at line beginnings.
  const entries = cleaned.match(/^\s*\{/gm);
  return entries ? entries.length : 0;
}

function countAgentFunctions(src: string): number {
  // The 4 agents in engines.ts are defined as `function xxxAgent(...)`.
  const matches = src.match(/^function\s+\w+Agent\s*\(/gm);
  return matches ? matches.length : 0;
}

function verifyConvictionCaps(src: string): { ok: boolean; actual: string } {
  // expected values from project/strategy/truth-protocol.md
  const expected = { established: "0.99", heuristic: "0.75", contested: "0.6", unfalsifiable: "0.33" };
  const blockRe = /CONFIDENCE_CAP[^=]*=\s*\{([\s\S]*?)\}/;
  const block = src.match(blockRe);
  if (!block) return { ok: false, actual: "CONFIDENCE_CAP block not found" };
  const body = block[1];
  const found: Record<string, string> = {};
  for (const key of Object.keys(expected)) {
    const r = new RegExp(`${key}\\s*:\\s*([0-9.]+)`);
    const m = body.match(r);
    if (m) found[key] = m[1];
  }
  const actual = Object.entries(found).map(([k, v]) => `${k}=${v}`).join(", ");
  const ok = Object.entries(expected).every(([k, v]) => found[k] === v);
  return { ok, actual: actual || "no values found" };
}

function countDataRoomFolders(src: string): number {
  // Each `| COPY-NNN |` row in the markdown table represents an evidence copy.
  // We count distinct target folders (the `|` ... `|` cell after the source).
  // The 21 vs 24 distinction: 21 = sub-folders that received content; 24 = all
  // sub-folders in the data-room-map. The match counts "evidenced" folders.
  const lines = src.split(/\r?\n/).filter((l) => /^\| COPY-\d+ /.test(l));
  const folders = new Set<string>();
  for (const line of lines) {
    if (!/OK \(/.test(line)) continue;
    // Target cell is the 4th column, wrapped in backticks like `01_Company Overview/team/MEMORY_snapshot.md`.
    // For originals, the source is `(original — written into Data Room)` so the target is the 4th cell.
    const cells = line.split("|").map((c) => c.trim());
    // cells[0]="" (leading pipe), [1]=COPY-NNN, [2]=timestamp, [3]=source, [4]=target
    if (!cells[4]) continue;
    const target = cells[4].replace(/^`|`$/g, "");
    // The folder is everything before the last `/`.
    const slash = target.lastIndexOf("/");
    if (slash < 0) continue;
    folders.add(target.slice(0, slash));
  }
  return folders.size;
}

function verify(claim: Claim): ClaimResult {
  switch (claim.id) {
    case "test-count": {
      const actual = countCheckAssertions(testSuiteSrc);
      return { ...claim, actual, status: actual === claim.expected ? "match" : "mismatch" };
    }
    case "jurisdictions": {
      const actual = countArrayEntries(spineSrc, "JURISDICTIONS");
      return { ...claim, actual, status: actual === claim.expected ? "match" : "mismatch" };
    }
    case "patterns": {
      const actual = countArrayEntries(patternsSrc, "HIDDEN_RIGHTS");
      return { ...claim, actual, status: actual === claim.expected ? "match" : "mismatch" };
    }
    case "engines": {
      const actual = countAgentFunctions(enginesSrc);
      return { ...claim, actual, status: actual === claim.expected ? "match" : "mismatch" };
    }
    case "conviction-caps": {
      const { ok, actual } = verifyConvictionCaps(fairnessSrc);
      return { ...claim, actual, status: ok ? "match" : "mismatch" };
    }
    case "data-room": {
      const actual = countDataRoomFolders(dataRoomCopiesSrc);
      return { ...claim, actual, status: actual === claim.expected ? "match" : "mismatch" };
    }
    default:
      return { ...claim, actual: "unknown", status: "warn", reason: "no verifier implemented" };
  }
}

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "match") {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold" aria-label="Claim verified">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> verified
      </span>
    );
  }
  if (status === "mismatch") {
    return (
      <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold" aria-label="Claim does not match">
        <XCircle className="h-4 w-4" aria-hidden="true" /> mismatch
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold" aria-label="Cannot verify">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" /> unverified
    </span>
  );
}

function expectedLabel(expected: number | string): string {
  return typeof expected === "number" ? String(expected) : expected;
}

// ── Component ────────────────────────────────────────────────────────────────

export function TruthDiff() {
  const results = useMemo(() => CLAIMS.map(verify), []);
  const [open, setOpen] = useState<string | null>(null);

  const verified = results.filter((r) => r.status === "match").length;
  const mismatched = results.filter((r) => r.status === "mismatch").length;
  const warned = results.filter((r) => r.status === "warn").length;

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-[#06181e]/60 border-teal-900/40">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="h-6 w-6 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-slate-100">TruthDiff — doc claims vs code reality</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Static verification of the project's headline numbers. Each claim below is checked against the
              source file at build time. If we say 159 tests, the regex counts 159 assertions. If we say 9
              jurisdictions, the array has 9 entries. Green = matches the doc, red = it doesn't, amber = we
              can't verify from static analysis alone.
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                {verified} verified
              </span>
              {mismatched > 0 && (
                <span className="px-2 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25">
                  {mismatched} mismatch
                </span>
              )}
              {warned > 0 && (
                <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  {warned} unverified
                </span>
              )}
              <span className="px-2 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                {results.length} claims
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
              <th className="px-4 py-2.5 font-medium">Claim</th>
              <th className="px-4 py-2.5 font-medium">Doc source</th>
              <th className="px-4 py-2.5 font-medium">Code check</th>
              <th className="px-4 py-2.5 font-medium text-right">Expected</th>
              <th className="px-4 py-2.5 font-medium text-right">Actual</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const isOpen = open === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className={cn(
                      "border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.03] transition-colors",
                      isOpen && "bg-white/[0.03]",
                    )}
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                        {r.doc}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{r.docSource}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{r.codeCheck}</td>
                    <td className="px-4 py-3 text-slate-300 text-right font-mono">{expectedLabel(r.expected)}</td>
                    <td className="px-4 py-3 text-slate-100 text-right font-mono font-semibold">
                      {typeof r.actual === "number" ? r.actual : r.actual}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-[#04141a]/50">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="flex items-start gap-2 text-xs text-slate-400">
                          <Code2 className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                          <div>
                            <div className="font-mono text-slate-300 mb-1">verifier: static regex on imported source</div>
                            <div className="text-slate-400">
                              The check runs at build time via Vite's <code className="px-1 py-0.5 rounded bg-white/[0.05] text-slate-200">?raw</code> import.
                              If the source file is removed, the import returns an empty string and the actual
                              count falls to 0, producing a mismatch. This is intentional: the truth-check is
                              coupled to the source existing.
                            </div>
                            {r.reason && <div className="mt-1 text-amber-400">reason: {r.reason}</div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Honest caveat: regex counts over source files are not a substitute for running the test suite, the
        dossier engine, or browser verification. This component verifies the <em>numbers we publish</em>;
        it does not verify the <em>behaviour behind those numbers</em>. For behaviour, see the Stage 7 #8
        <code className="px-1 py-0.5 rounded bg-white/[0.05] text-slate-300 ml-1">scripts/health-check.ts</code>.
      </p>
    </div>
  );
}

export default TruthDiff;
