# Observability — OllyGarden Setup

OllyGarden gives us production-grade traces of the agentic loop, which is direct
evidence for the Agentic-AI-Excellence dimension (implementation quality,
efficiency, orchestration).

## Connect (Sam, after the GitHub repo exists)
1. Sign up at ollygarden.app.
2. Go to "Instrumentation".
3. Connect the FreeLeased GitHub repository.

## What we instrument
The tracing helper `src/lib/telemetry.ts` emits OpenTelemetry-friendly span
records with no PII (scalar metadata only). Set `FL_TELEMETRY=1` to emit spans to
stdout for an OTel collector; a debug endpoint can expose `recentSpans()`.

Spans we record around the loop:
- `loop.run` — one full research/verify/gate/sign-off cycle.
- `agent.research`, `agent.verify`, `agent.gate`, `agent.signoff` — per stage.
- `llm.complete` — an inference call, with `provider` and `model` attributes.
- `fairness.check` — a document analysis, with clause count and flag count.
- `land.profile` — a jurisdiction profile build, with data-sufficiency band.

## Why it matters to the score
- **Efficiency (weak sub-criterion):** span durations + the `provider`/`model`
  attributes make inference cost and latency visible, so we can show the small
  open model is doing the work cheaply.
- **Orchestration:** the parent/child span tree is the multi-agent loop made
  legible for judges.
- **Trust:** traceability pairs with the evidence-class and abstention design to
  show the system is auditable end to end.

## Demo use
In the demo, run one dossier and show the span tree (or the emitted JSON),
pointing at the sign-off gate span and the `abstain` status on a low-data agent.
