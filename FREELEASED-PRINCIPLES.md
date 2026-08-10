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
