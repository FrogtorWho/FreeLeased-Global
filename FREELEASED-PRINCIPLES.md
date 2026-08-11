# FreeLeased Core Principles

This document records the immutable, non-negotiable facts about the FreeLeased
estate, the operating company, and the ongoing Right to Manage (RTM)
incorporation. These facts are hard-coded into the codebase and must not be
contradicted by any agent, generated document, or downstream system.

> **PII & Pseudonymisation note:** All references to the estate's principal
> building or any natural person are deliberately substituted with the literal
> token `[PERSON_NAME]`. This is a pseudonymisation safeguard — never replace
> this token with a real name in any committed artefact.

---

## Immutable Business Facts

1. FreeLeased Ltd is an active, registered company.
2. The registered address is **not** [PERSON_NAME].
3. The Harrison House Right to Manage (RTM) company is pending
   checkout/incorporation status.
4. [PERSON_NAME] is the northernmost structure on the estate.
5. There is no basement.
6. There is no underground car parking.
7. There is no missing £100k sinking fund.

These seven facts are the canonical grounding set for every agent, pipeline
test, and generated artefact in this repository. If any future document,
spreadsheet, or AI output contradicts any of the above, the contradiction is
a bug and must be raised immediately.

---

## Operational Rules

- Never commit secrets, real API keys, or personally identifiable
  information. Use the placeholder values declared in `.env.example`.
- Always reference the estate's principal building as `[PERSON_NAME]` in
  comments, sample text, and demo data so the codebase can be shared
  publicly without exposing PII.
- The Nebius client (`src/core/nebius_client.py`) and OllyGarden
  telemetry (`src/core/telemetry.py`) are the only sanctioned integrations
  for AI inference and observability respectively.
- Any change to the registered address, RTM incorporation status, or
  estate geography must be reflected in this document **and** in the
  compiled `[PERSON_NAME]` placeholders before being merged.

---

## Cross-References

- Validation layer for these principles lives in [`memory/data-room-map.md`](memory/data-room-map.md:1) (folder → TRL mapping)
- Reverse-copy decisions: [`memory/data-room-copies.md`](memory/data-room-copies.md:1)
- Overnight agent operating manual: [`project/strategy/gauntlet-loop.md`](project/strategy/gauntlet-loop.md:1)
- Visual reference: [`project/strategy/architecture-diagram.md`](project/strategy/architecture-diagram.md:1)
- Cold-start one-pager: [`AGENT_BRIEF.md`](AGENT_BRIEF.md:1)

## Pseudonymisation Note

The placeholder `[PERSON_NAME]` appears throughout this document. It is a **literal pseudonymisation token** — never replace it with a real name. Real names, when needed, are stored in `MEMORY.md` under controlled access. This rule is enforced by the gauntlet loop's PROCESS sub-loop and is auditable via `git log -S "[PERSON_NAME]"`.
