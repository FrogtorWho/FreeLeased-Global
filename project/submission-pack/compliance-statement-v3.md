<!--
purpose: explicit compliance posture — GDPR, UK DPA 2018, Caribbean data-protection regimes, evidence-class honest framing.
audience: buildathon judges, partner agencies, regulators.
status: v3 (Phase 13)
last-updated: 2026-08-12
owner: Sam Peacock (principal) · Shogo (agent)
cross-links: README-GITHUB.md, architecture-v3.md, project-overview-v3.md, ../../docs/PRIVACY.md, ../../docs/SECURITY.md, ../../docs/THREAT-MODEL.md
-->

# Compliance & Responsible AI Statement

**FreeLeased — Future Caribbean Global AI Buildathon**
**Track 9: AI for Real Estate & Development**
**Prepared: August 2026 · Word count: 487**

---

## Privacy & Data Protection

FreeLeased processes lease and contract documents — never biometric, emotional, or behavioural data about individuals. All analysis is document-only: clauses are scored against statutory floors, never people against norms. The platform operates under a privacy-by-design model. Resident PII is scrubbed by the Redaction Protocol before any dossier reaches the consensus gate, and the Cryptographic Communes layer enforces k-anonymity (k≥5) before any aggregate data is surfaced. No personal data is stored beyond the active session unless the resident explicitly opts in to a persistent audit record.

## Bias & Fairness

The fairness engine scores lease clauses against statute. It does not profile tenants or landlords. Each fairness check carries an evidence class — established (primary source), heuristic (case law), contested (secondary analysis), or unfalsifiable — that caps the displayed confidence. Advisory results are explicitly labelled as such. The system never makes automated decisions about individuals; it produces advisory outputs that require human sign-off (HITL) before any action is taken. The data spine covers 9 jurisdictions with 40+ verified statutes; Caribbean adaptations are based on structural analogies with UK law and are flagged as requiring in-territory legal review.

## Safety & Prohibited Practices

FreeLeased does not engage in: subliminal manipulation, exploitation of vulnerabilities, social scoring, emotion recognition, biometric categorisation, or predictive profiling. The platform's adversary intelligence layer (retired from active use per Code of Conduct compliance review) was designed strictly for defensive analysis of manipulation patterns in legal language — not for profiling individuals or groups. It has been scoped down to transparent, HITL-gated defensive-only functionality. All outputs carry explicit confidence bounds and provenance trails.

## Transparency & Human Oversight

All AI-generated content carries provenance markers. The consensus gate requires 2/3 human validation before any claim surfaces as "verified". The system's confidence levels are bounded by evidence class, and uncertain results are flagged for human review rather than presented as authoritative. Residents retain full opt-out capability and can revoke consent at any point in the workflow. The platform discloses its AI nature during all user interactions, per Code of Conduct §4 (transparency of automated decision-making).

## Synthetic Content & Disclosure

All AI-generated text within FreeLeased is marked as synthetic content per Code of Conduct §5. When the platform interacts with users, it clearly discloses its AI nature. Audit trails are immutable and available for inspection. No content is published externally without explicit human approval through the 1-click approval workflow.

## License & Open Source

FreeLeased will be released under the Apache 2.0 permissive open-source license, enabling community audit and adaptation across jurisdictions. The complete source code, data models, and test suites will be publicly available on GitHub.

## Limitations

This is a TRL Level 4→5 prototype (working prototype, first real-user test in progress). Statutory data is based on verified primary sources for pilot jurisdictions, but coverage is not yet comprehensive across all Caribbean jurisdictions. Caribbean legal adaptations are based on structural analogies with UK leasehold law — they require in-territory legal review before deployment. The platform is advisory, not a substitute for legal counsel. Compute spend is $0 (deterministic engines, local SQLite) which limits scalability until cloud infrastructure is adopted.
