import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, Copy, Shield, Database, CheckCircle2, FileText, AlertTriangle, Layers, Clock, Building2 } from 'lucide-react';

export const TabResearchBrief: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [researchTarget, setResearchTarget] = useState('Apex Holdings Ltd');
  const [targetRegion, setTargetRegion] = useState('Borough of Southwark');
  const [timeframe, setTimeframe] = useState('2019-2024');
  const [focusArea, setFocusArea] = useState('Procurement Monopolies & Capital Flight');
  
  const generatePrompt = () => {
    return `[SYSTEM DIRECTIVE: STRICT IMPARTIALITY ENFORCEMENT]
You are an independent, forensic financial researcher. You have NO prior knowledge of the target, the region, or any existing socioeconomic hypotheses (e.g., "gentrification", "managed decline", "social cleansing"). You must remain completely objective. Your only goal is to follow the capital flows and map the corporate structuring based purely on verifiable primary sources.

[INVESTIGATION PARAMETERS]
TARGET ENTITY: ${researchTarget}
OPERATIONAL REGION: ${targetRegion}
TIMEFRAME: ${timeframe}
PRIMARY FOCUS AREA: ${focusArea}

[METHODOLOGY & GUARDRAILS]
1. ZERO-HYPOTHESIS RULE: Do not attempt to prove or disprove a narrative. Document only verifiable financial and legal linkages.
2. PRIMARY SOURCES ONLY: Rely strictly on statutory filings (e.g., Companies House, Land Registry, SEC filings, SWIFT data, public tender portals).
3. VERIFIABILITY: Every assertion must be accompanied by a source citation, a cryptographic hash (or permanent URL) of the source artifact, and the date of retrieval.
4. VALIDATION LOOP: If you cannot find deterministic, verifiable data for a requested vector, state "INSUFFICIENT DATA". Do not guess or interpolate. If the data returned does not strictly follow the required output schema, the system will reject it and we will START OVER.

[REQUIRED INVESTIGATIVE VECTORS]
VECTOR A: BENEFICIAL OWNERSHIP
- Target: Map the complete corporate hierarchy of ${researchTarget}, including all holding companies and subsidiaries active in ${targetRegion} during ${timeframe}.
- Objective: Trace the ownership up to the Ultimate Beneficial Owner (UBO) or identify the exact layer where ownership becomes obfuscated (e.g., offshore trust).

VECTOR B: PROCUREMENT & ASSET ACQUISITION
- Target: Document all municipal contracts awarded to, or public property acquired by, ${researchTarget} or its subsidiaries.
- Objective: Create a ledger of public funds received versus statutory delivery/asset value.

VECTOR C: CAPITAL FLIGHT (EXIT VECTOR)
- Target: Track the velocity and destination of capital exiting the operational entities.
- Objective: Document any inter-company loans, exorbitant management fees, or dividend payouts transferred to offshore holding entities within 12 months of acquiring public assets/contracts.

[REQUIRED OUTPUT SCHEMA (JSON FORMAT)]
You MUST return your findings in the exact JSON structure below. If your output deviates from this format, the ingestion engine will fail and we will START OVER.

{
  "investigation_target": "${researchTarget}",
  "timestamp": "[ISO_8601]",
  "methodology_followed": true,
  "findings": {
    "corporate_structuring": [
      {
        "entity_name": "[STRING]",
        "jurisdiction": "[ISO_3166_2]",
        "role": "[e.g., 'OPERATIONAL_SUBSIDIARY', 'OFFSHORE_HOLDING', 'UBO']",
        "source_citation": "[STRING]"
      }
    ],
    "municipal_acquisitions": [
      {
        "asset_or_contract_name": "[STRING]",
        "value_gbp": "[DECIMAL]",
        "date_acquired": "[YYYY-MM-DD]",
        "source_citation": "[STRING]"
      }
    ],
    "capital_extraction": [
      {
        "transfer_type": "[e.g., 'DIVIDEND', 'MANAGEMENT_FEE', 'INTERCOMPANY_LOAN']",
        "value_gbp": "[DECIMAL]",
        "destination_entity": "[STRING]",
        "source_citation": "[STRING]"
      }
    ]
  },
  "confidence_score": "[1-100]",
  "analyst_notes": "[STRICTLY OBJECTIVE OBSERVATIONS ONLY]"
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12 font-sans max-w-7xl mx-auto"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <FileSignature className="w-8 h-8 text-indigo-600" />
          Evolving Research Brief Generator
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Constructs a dynamically evolving, one-shot prompt to deploy to impartial researchers (human or AI). Enforces a strict validation methodology: if the researcher deviates from the JSON schema or introduces narrative bias, the results are automatically rejected.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900">Brief Configuration</h3>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-slate-400" /> Target Entity
                </label>
                <input 
                  type="text" 
                  value={researchTarget}
                  onChange={(e) => setResearchTarget(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  placeholder="e.g., Apex Holdings Ltd"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-slate-400" /> Region
                </label>
                <input 
                  type="text" 
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  placeholder="e.g., Borough of Southwark"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-slate-400" /> Timeframe
                </label>
                <input 
                  type="text" 
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  placeholder="e.g., 2019-2024"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  <Database className="w-4 h-4 text-slate-400" /> Focus Area
                </label>
                <input 
                  type="text" 
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  placeholder="e.g., Procurement Monopolies"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white border border-slate-800">
            <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5" />
              Methodology Protocol
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              This prompt acts as a deterministic contract. It forces external researchers into a strict factual corridor to prevent confirmation bias.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-slate-800/80 p-2 rounded-lg mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                <div>
                  <strong className="text-slate-200 block text-sm font-medium mb-1">Strict Adherence</strong>
                  <span className="text-xs text-slate-400 leading-relaxed">If the researcher includes subjective narratives, the output is rejected.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-slate-800/80 p-2 rounded-lg mt-0.5"><Database className="w-4 h-4 text-indigo-400" /></div>
                <div>
                  <strong className="text-slate-200 block text-sm font-medium mb-1">Schema Enforcement</strong>
                  <span className="text-xs text-slate-400 leading-relaxed">JSON output maps data directly into the Fusion Engine. If schema breaks, we start over.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-slate-800/80 p-2 rounded-lg mt-0.5"><AlertTriangle className="w-4 h-4 text-amber-400" /></div>
                <div>
                  <strong className="text-slate-200 block text-sm font-medium mb-1">Blind Extraction</strong>
                  <span className="text-xs text-slate-400 leading-relaxed">Researcher is deprived of overarching theories to prevent seeking desired outcomes.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Output */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-slate-950 rounded-2xl shadow-xl flex flex-col h-full border border-slate-800 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-xs">research_directive_v2.txt</span>
              </div>
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500 shadow-md shadow-indigo-900/20'
                }`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard' : 'Copy Directive'}
              </button>
            </div>
            
            {/* Code / Prompt Area */}
            <div className="p-6 md:p-8 flex-1 overflow-x-auto relative">
              <pre className="text-[13px] md:text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {generatePrompt()}
              </pre>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};
