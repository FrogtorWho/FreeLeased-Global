# FreeLeased — MCP Integration

**Status:** GAUNTLET 3.0 convergence · **Date:** 2026-08-12
**Owner:** Sam Peacock (principal) · Shogo (agent)
**License:** Apache-2.0

---

## What this is

FreeLeased exposes its **data spine + analytical engines** as a
**[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server** so
that any MCP-compatible client (Claude Desktop, Cursor, Continue, Cline, custom
OpenAI Agents) can call FreeLeased as a tool provider over a standard, open
protocol.

The MCP server is **fully local-first**: it runs as a stdio JSON-RPC 2.0
process next to the rest of the FreeLeased stack. **No data leaves the
device.** Pseudonymous inputs only — PII is scrubbed before the dossier
ever reaches the MCP transport.

---

## Tools exposed

| # | Tool name | Purpose |
|---|---|---|
| 1 | [`read_dossier`](../../src/mcp/server.ts:170) | Pull an advisory dossier for a pseudonymous resident ID. Returns the 5 strongest matched hidden rights + explicit gaps + provenance. |
| 2 | [`list_jurisdictions`](../../src/mcp/server.ts:189) | Enumerate the spine's 9 jurisdictions (UK + 8 Caribbean). |
| 3 | [`get_legal_rights`](../../src/mcp/server.ts:201) | Return the 20 hidden-rights patterns, filterable by jurisdiction or axis. |
| 4 | [`analyse_lease`](../../src/mcp/server.ts:228) | Deterministic lease-clause analysis: UK s.20 (LTA 1985) consultation threshold, LFRA 2024 s.49 non-residential limit, BSA 2022 Golden Thread. |
| 5 | [`search_statutes`](../../src/mcp/server.ts:270) | Full-text search across the statute spine with citation, URL, conviction class, fetch date. |

Every tool returns a `provenance` block: `{ fetch_date, server_version,
source_root, ... }`. The audit-trail verifier
([`scripts/audit-trail-verifier.ts`](../scripts/audit-trail-verifier.ts))
walks this block.

---

## Configuration

The MCP server registration lives at [`.mcp/config.json`](../../.mcp/config.json):

```json
{
  "servers": {
    "freeleased": {
      "type": "stdio",
      "command": "node",
      "args": ["--experimental-strip-types", "src/mcp/server.ts"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

---

## How to activate

### Claude Desktop

Edit `~/.config/claude_desktop_config.json` (macOS/Linux) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "freeleased": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "ABSOLUTE_PATH_TO_WORKSPACE/src/mcp/server.ts"
      ]
    }
  }
}
```

Restart Claude Desktop. The 5 tools will appear in the tools menu.

### Cursor

`Settings → MCP → Add new global MCP server` and paste the same JSON. Restart
the editor.

### Continue / Cline / custom

Both follow the same JSON-RPC 2.0 stdio convention; any MCP client can spawn
`node --experimental-strip-types src/mcp/server.ts` and discover the 5 tools.

---

## Smoke test

```bash
# Start the server (it reads JSON-RPC from stdin, writes to stdout)
node --experimental-strip-types src/mcp/server.ts
{"jsonrpc":"2.0","id":1,"method":"initialize"}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_jurisdictions","arguments":{}}}
```

Or run the bundled smoke test:

```bash
node --experimental-strip-types scripts/test-mcp-server.ts
```

---

## Why this matters for the buildathon

- **Open protocol.** MCP is the de-facto open standard for tool-providing
  between AI agents and external systems — FreeLeased becomes a first-class
  citizen in any MCP host.
- **Local-first.** No third-party endpoint, no API keys, no inference bill —
  the same posture as the rest of FreeLeased.
- **Auditable.** Every response carries provenance (URL + fetch date +
  conviction) — the `audit-trail-verifier` confirms it.
- **Composable.** Any MCP client can chain the 5 tools to do lease
  analysis end-to-end, with deterministic outputs that reproduce.

---

## Cross-links

- [`.mcp/config.json`](../../.mcp/config.json)
- [`src/mcp/server.ts`](../../src/mcp/server.ts)
- [`scripts/test-mcp-server.ts`](../scripts/test-mcp-server.ts)
- [`project/management/convergence-checklist.md`](../project/management/convergence-checklist.md)
- [`docs/PRIVACY.md`](../docs/PRIVACY.md) — redaction posture
- [`docs/SECURITY.md`](../docs/SECURITY.md) — MCP threat model