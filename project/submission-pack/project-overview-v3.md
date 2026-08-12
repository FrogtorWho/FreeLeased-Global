<!--
purpose: one-page product brief for FreeLeased / RTM Sovereign — the submission elevator pitch.
audience: buildathon judges, partner agencies, DFIs.
status: v4 (Phase 13)
last-updated: 2026-08-12
owner: Sam Peacock (principal) · Shogo (agent)
cross-links: architecture-v3.md, compliance-statement-v3.md, demo-script-v3.md, README-GITHUB.md, ../strategy/IC-MEMO-Q3-2026.md, ../../docs/MCP-INTEGRATION.md
-->

# FreeLeased / RTM Sovereign — Project Overview (v4)

**Track:** AI for Real Estate & Development.
**Naming:** FreeLeased (platform) · RTM Sovereign (flagship product) · LeaseholdInsight (engine).

## One line
RTM Sovereign is an open-source, local-first toolkit that lets residential leaseholders and condominium co-owners **audit their own service charges, assert hidden statutory rights, and coordinate collective management take-over (Right-to-Manage)** — automating what today needs surveyors and litigation counsel.

## The problem
Leaseholders and condo co-owners in shared buildings are routinely exploited by developers, freeholders, and opaque managing agents: inflated service charges, major works pushed through in breach of the statutory **s.20 (LTA 1985)** consultation threshold, litigation costs quietly passed through the service charge, and neglected building-safety obligations under the **Building Safety Act 2022** that leave residents holding operational and even criminal liability. Residents cannot afford structural surveys, actuarial analysis, or counsel. It is a coordination and intelligence gap, not a lack of rights.

## The solution
RTM Sovereign has three layers, all provenance-tracked and honesty-capped:

1. **Statutory diagnostics engine (SovereignDiagnosticsService).** Runtime checks of a lease / service-charge document against real statute: s.20 consultation breach, s.20C litigation-cost pass-through, BSA 2022 remediation liability, s.167 CLRA forfeiture limits, RTM eligibility (s.72 CLRA / LFRA 2024). Each flag cites the law, carries an evidence class (established / heuristic / contested / unfalsifiable) that caps its confidence, and abstains rather than fabricates.

2. **Resident audit + local PII redaction.** A leaseholder's documents are ingested and scrubbed of PII locally before anything leaves the device; the audit produces a per-resident dossier of hidden rights with 5-tuple provenance on every cell.

3. **Collective coordination (communes) + consensus & human sign-off.** Aggregates a building's residents to organise an RTM claim, with a codified consensus gate and a human sign-off as the only path from draft to acted-upon advice.

## Caribbean adaptation
The UK RTM, enfranchisement, and service-charge frameworks are adapted to Caribbean **condominium / strata** law (Cayman, Barbados, Jamaica), where tourism-driven multi-unit developments are the fastest-growing housing model and residents face the same opaque managing-agent dynamics. Local-first design keeps housing-equity data — and management revenue — inside local communities rather than offshore SPVs.

## Founder
Samuel Peacock — Investment Product Analyst at Schroders (10+ years); Finance, Economics, Data Science, and Resident Advocacy. A finance-and-advocacy founder operating an agent swarm that does the work of a firm — the credible profile for a legal-financial proptech product.

## Business model (who pays)
- **Institutions pay, residents free.** Housing agencies, DFIs/development banks, insurers, and lenders subscribe for building-compliance and title-integrity intelligence; **residents and resident associations use the audit + RTM tools free.**
- **Self-hosted / sovereign-edge tier** for governments and registries — every byte stays on-territory (deployable to OWC edge/sovereign hardware).
- In-region billing via a Caribbean-native gateway (Powertranz) removes foreign-processor friction.

## Honest cut (what's live vs roadmap)
Live and verified: the codified statutory-diagnostics engine, resident audit with local redaction, provenance spine (UK + Caribbean statutes), consensus gate, and human sign-off. **Roadmap, clearly labelled, not implied as built:** OpenClaw autonomous agents / Companies House scraping, Paillier homomorphic voting, CitadelDB encrypted storage, and WebAuthn passkeys. We state every capability at its true maturity — honesty is the product.

## Why it is category-defining
No open-source, resident-led leasehold-governance toolkit exists. The moat is the growing, verified, multi-jurisdiction statutory spine (a data network effect), the registry/MoU relationships, and the honesty engine (evidence-class caps + consensus gate) that a competitor cannot reproduce by prompting a general model.

## Global relevance
Leasehold/condominium exploitation and opaque service charges exist across the UK, the Caribbean, and every emerging multi-unit market. A system proven UK-first and adapted across Caribbean condominium regimes is directly portable to other common-law and strata jurisdictions worldwide.
