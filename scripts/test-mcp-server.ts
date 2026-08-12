// SPDX-License-Identifier: Apache-2.0
// Smoke test for the FreeLeased MCP server.

import { spawn } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname || process.cwd(), "..");
const SERVER = resolve(ROOT, "src/mcp/server.ts");

let checks = { ok: 0, fail: 0 };
function check(name: string, cond: boolean, extra?: any) {
  if (cond) {
    checks.ok++;
    console.log(`  PASS  ${name}`);
  } else {
    checks.fail++;
    console.error(`  FAIL  ${name}`, extra ?? "");
  }
}

function runCases(): Promise<void> {
  return new Promise((resolveP, rejectP) => {
    const child = spawn(process.execPath, ["--experimental-strip-types", SERVER], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d.toString()));
    let buf = "";
    const responses: any[] = [];
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        child.kill();
      } catch {}
      // Assertions
      const init = responses.find((r) => r.id === 1);
      const list = responses.find((r) => r.id === 2);
      const lj = responses.find((r) => r.id === 3);
      const al = responses.find((r) => r.id === 4);
      check(
        "initialize returns serverInfo + capabilities.tools",
        !!init &&
          init.result?.serverInfo?.name === "freeleased-mcp" &&
          init.result?.capabilities?.tools !== undefined,
        init,
      );
      check(
        "tools/list returns 5 tools in expected order",
        Array.isArray(list?.result?.tools) &&
          list.result.tools.length === 5 &&
          list.result.tools.map((t: any) => t.name).join(",") ===
            "read_dossier,list_jurisdictions,get_legal_rights,analyse_lease,search_statutes",
        list?.result?.tools,
      );
      const ljJson = lj?.result?.content?.[0]?.json;
      check(
        "list_jurisdictions returns 9 jurisdictions + provenance",
        Array.isArray(ljJson?.jurisdictions) &&
          ljJson.jurisdictions.length === 9 &&
          !!ljJson?.provenance?.fetch_date,
        ljJson,
      );
      const alJson = al?.result?.content?.[0]?.json;
      check(
        "analyse_lease returns findings array + provenance (UK)",
        Array.isArray(alJson?.findings) &&
          alJson.findings.length >= 2 &&
          alJson.findings.some((f: any) => f.check === "uk-lta-s20-consultation-threshold") &&
          alJson.findings.some((f: any) => f.check === "uk-lfra-s49-rtm-non-residential-limit") &&
          !!alJson?.provenance?.fetch_date,
        alJson,
      );
      check("reproducibility: no errors in stderr", !/error/i.test(stderr), stderr);
      console.log(`\n[test-mcp-server] ${checks.ok} PASS, ${checks.fail} FAIL`);
      if (checks.fail === 0) resolveP();
      else rejectP(new Error(`${checks.fail} failures`));
    };
    child.stdout.on("data", (d) => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (!line) continue;
        try {
          responses.push(JSON.parse(line));
        } catch (e: any) {
          // ignore parse noise
        }
      }
      if (responses.length >= 4) finish();
    });
    child.on("error", (e) => {
      console.error("spawn error:", e);
      rejectP(e);
    });
    child.on("exit", () => finish());
    // Send the 4 requests
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize" }) + "\n");
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }) + "\n");
    child.stdin.write(
      JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "list_jurisdictions", arguments: {} } }) + "\n",
    );
    child.stdin.write(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
          name: "analyse_lease",
          arguments: {
            jurisdiction: "UK",
            serviceChargeAnnualGBP: 12000,
            leaseholderCount: 30,
            nonResidentialSharePct: 40,
            goldenThreadCompliant: false,
          },
        },
      }) + "\n",
    );
    child.stdin.end();
    // Hard deadline
    setTimeout(() => finish(), 5000);
  });
}

runCases().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});