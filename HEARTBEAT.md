# HEARTBEAT.md

Daily operational cadence for the FreeLeased buildathon loop.
Owner: Sam (founder). Run by the agent on schedule.

## Cadence (UTC)

- **09:00 UTC** — Morning health check: data spine integrity, test-suite
  pass count, lint status, env-var presence, dependency freshness.
- **17:00 UTC** — Loop verification: re-run `runLoop()` over the latest
  metrics, confirm 10/10 judges still pass, log the score to `memory/`.

## Escalation

If **2 consecutive failures** at any cadence → escalate to Sam
(channel: in-app CommandPost → Competition → flags tab).

## Out of hours

Telemetry (`src/core/telemetry.py`) keeps shipping to OllyGarden
24/7; no agent action required for observability alone.