# FreeLeased — Demo Storyboard (shot-by-shot)

Pairs with `demo-script-v3.md`. Every claim has an on-screen action. API calls
below are curl-verified and can be shown live (or pre-recorded).

## Shot 1 — Problem (0:00-0:30)
On-screen: Caribbean map. Voiceover: the opacity problem.

## Shot 2 — Data spine (0:30-1:15)
On-screen: Data Spine view. Live API to show provenance and coverage:
```
curl -s http://localhost:3001/api/spine/summary
curl -s http://localhost:3001/api/spine/sources | head
```
Point at: 7 jurisdictions (3 pilot), 21 sources all verified, per-cell provenance.

## Shot 3 — Land intelligence (1:15-1:45)
On-screen: a jurisdiction profile. Live:
```
curl -s http://localhost:3001/api/land/BB
curl -s http://localhost:3001/api/land/KY
```
Point at: statutes with citations and URLs, and the `dataSufficiency` band.
Show KY (registry conviction "inference") scoring lower than BB — honesty in the
land layer too.

## Shot 4 — Agentic loop + honesty (1:45-2:45)
On-screen: the loop with a dossier. Show an ABSTAIN agent (low data). If
`FL_TELEMETRY=1`, show the span tree and the sign-off gate span.

## Shot 5 — Fairness Check (2:45-3:20)
On-screen: paste `project/demo/sample-lease.txt`. Live:
```
curl -s -X POST http://localhost:3001/api/fairness/check \
  -H 'Content-Type: application/json' \
  --data-binary @<(jq -Rs '{text: ., jurisdiction: "BB"}' project/demo/sample-lease.txt)
```
Point at: multiple flags, each with a statute citation, and confidence capped by
evidence class (BB 24-hours clause flagged; the lawful rent-due clause is NOT).

## Shot 6 — Business + roadmap (3:20-3:50)
On-screen: four-tier model + jurisdiction expansion slide.

## Shot 7 — Close (3:50-4:00)
On-screen: live link + repo. "Built solo, in public, on the Buildathon stack."

## Pre-flight checklist
- Preview restarted, bundle hash changed, UI renders.
- API server healthy on :3001.
- Sample lease file present.
- If showing telemetry, export `FL_TELEMETRY=1` before running the loop.
