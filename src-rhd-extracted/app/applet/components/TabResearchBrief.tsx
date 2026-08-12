import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, Download, Copy, Shield, Search, Database, Scale, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const TabResearchBrief: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const briefContent = `INDEPENDENT INVESTIGATION DIRECTIVE: FINANCIAL PROVENANCE & BENEFICIAL OWNERSHIP

1. DIRECTIVE OVERVIEW
This brief authorizes an independent, impartial investigation into the capital flows, corporate structuring, and beneficial ownership networks interacting with municipal housing and local authority procurement. 
Crucially, the researcher must possess NO PRIOR KNOWLEDGE of existing hypotheses (e.g., "Managed Decline" or "Procurement Cartels") to prevent confirmation bias. The objective is strictly data-driven: Follow the money.

2. METHODOLOGICAL CONSTRAINTS (IMPARTIALITY FRAMEWORK)
- Zero-Hypothesis Rule: Do not seek to prove or disprove a narrative. Only document verifiable financial and legal linkages.
- Primary Sources Only: Reliance strictly on statutory filings (Companies House, Land Registry, SEC, SWIFT data, public tender databases).
- Artifact Retention: Every assertion must be accompanied by a cryptographic hash of the source document and a timestamp of retrieval.

3. REQUIRED INVESTIGATIVE VECTORS
VECTOR A: BENEFICIAL OWNERSHIP (THE "SHADOW" STRUCTURE)
- Target: Map the complete corporate hierarchy of the top 5 private entities acquiring municipal property in the target zone over the last 36 months.
- Deliverable: A graph database schema linking shell companies to their Ultimate Beneficial Owners (UBOs) and mapping offshore tax jurisdiction routing.

VECTOR B: PROCUREMENT & SERVICE CONTRACTS (THE "EXTRACTION" LAYER)
- Target: Analyze all outsourced housing maintenance and management contracts awarded by the target local authority.
- Deliverable: A ledger of contract values vs. actual statutory delivery. Identify margin extraction mechanisms (e.g., inter-company dividend payouts while under-delivering on SLAs).

VECTOR C: CAPITAL FLIGHT (THE "EXIT" VECTOR)
- Target: Track the velocity and destination of capital exiting the municipal ecosystem.
- Deliverable: Document the volume of public funds transferred from local operational subsidiaries to offshore holding entities within 90 days of contract award or property acquisition.

4. STRUCTURED OUTPUT FORMAT (JSON/CSV COMPLIANT)
All findings must be returned in the following structured schema for ingestion into the Multi-INT Fusion Engine:
{
  "entity_id": "[UUID]",
  "legal_name": "[STRING]",
  "jurisdiction": "[ISO_3166_2]",
  "public_funds_received_gbp": "[DECIMAL]",
  "funds_transferred_offshore_gbp": "[DECIMAL]",
  "ultimate_beneficial_owner": "[STRING | 'OBFUSCATED']",
  "source_artifact_hash": "[SHA-256]"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-mono pb-12"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <FileSignature className="w-6 h-6 text-indigo-600" />
          IMPARTIAL RESEARCH BRIEF
        </h1>
        <p className="text-sm text-slate-600">
          A standardized, blind-investigation framework designed to instruct independent analysts to "follow the money" without exposing them to prior hypotheses, ensuring unbiased, auditable intelligence gathering.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Explainer & Guardrails */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-600" />
              Epistemic Guardrails
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To maintain the integrity of the multi-INT fusion engine, external researchers must operate in a "clean room" environment. Exposing them to existing theories (e.g., Doctrine Translation) risks confirmation bias.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900">Blind Allocation:</strong> Researcher is given targets, not theories.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900">Follow the Money:</strong> Strictly forensic financial accounting.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900">Deterministic Output:</strong> Findings must fit the structured ingestion schema.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-4">
              <Database className="w-5 h-5" />
              Targeted Vectors
            </h3>
            <div className="space-y-4">
              <div className="border-l-2 border-indigo-500 pl-3">
                <h4 className="text-xs font-bold text-slate-100 uppercase">Corporate Structuring</h4>
                <p className="text-[10px] text-slate-400 mt-1">UBO (Ultimate Beneficial Owner) mapping across zero-tax jurisdictions.</p>
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <h4 className="text-xs font-bold text-slate-100 uppercase">Procurement Monopolies</h4>
                <p className="text-[10px] text-slate-400 mt-1">Cartel identification within municipal service contracts.</p>
              </div>
              <div className="border-l-2 border-rose-500 pl-3">
                <h4 className="text-xs font-bold text-slate-100 uppercase">Capital Extraction</h4>
                <p className="text-[10px] text-slate-400 mt-1">Tracking velocity of public funds exiting local ecosystems.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: The Brief Document */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText className="w-4 h-4 text-slate-500" />
                Standardized_Research_Brief_v1.txt
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'COPIED' : 'COPY BRIEF'}
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-[#fafafa] flex-1 overflow-x-auto rounded-b-xl relative group">
              <pre className="text-[11px] text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                {briefContent}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
