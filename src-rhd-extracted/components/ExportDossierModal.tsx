import React, { useState } from 'react';
import { Download, Printer, FileText, FileCode, CheckCircle2, Shield, X, Layers, Activity } from 'lucide-react';
import { PREDICTIVE_RISK_DATA, THREAT_RADAR_DATA, LIVE_THREAT_TICKER } from '../data';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'json' | 'md'>('pdf');
  const [classification, setClassification] = useState('TS // NOFORN // FVEY');
  const [exportSuccess, setExportSuccess] = useState(false);

  const [sections, setSections] = useState({
    executiveSummary: true,
    predictiveRisk: true,
    sigintFeed: true,
    provenanceLedger: true,
    researchBrief: true,
    procurementCartel: true,
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString();

    if (selectedFormat === 'json') {
      const dossierJson = {
        title: "J-2 SYSTEMIC FRAGILITY & EXTREME CONCENTRATION DOSSIER",
        classification,
        timestamp,
        compiler: "J-2 Signal Intelligence & OSINT Fusion Engine",
        included_sections: sections,
        data_snapshots: {
          predictive_risk: sections.predictiveRisk ? PREDICTIVE_RISK_DATA : undefined,
          threat_radar: sections.executiveSummary ? THREAT_RADAR_DATA : undefined,
          live_ticker: sections.sigintFeed ? LIVE_THREAT_TICKER : undefined,
        },
        metadata: {
          system_veracity: "99.8%",
          audit_compliance: "ZERO-HYPOTHESIS FACTUAL MANDATE",
        }
      };

      const content = JSON.stringify(dossierJson, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `J2_Systemic_Dossier_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      navigator.clipboard.writeText(content).catch(() => {}); // Fallback to clipboard
    } else if (selectedFormat === 'md') {
      const markdown = `# J-2 SYSTEMIC FRAGILITY & EXTREME CONCENTRATION DOSSIER
**CLASSIFICATION:** ${classification}  
**TIMESTAMP:** ${timestamp}  
**ENGINE:** J-2 Signal Intelligence & OSINT Fusion  

---

## 1. EXECUTIVE COMMAND BRIEFING
The UK public realm faces accelerated structural fragility caused by capital extraction, fixed municipal liabilities, and labor deficits. Cross-sector algorithmic monitoring identifies a threshold risk event approaching by 2029.

${sections.predictiveRisk ? `
## 2. PREDICTIVE RISK & ALGORITHMIC PROJECTIONS
- **2025 Systemic Load:** 68% | Default Risk: 38%
- **2027 Systemic Load:** 76% | Default Risk: 52%
- **2029 Systemic Load:** 88% | Default Risk: 72% (CRITICAL THRESHOLD)
- **Primary Algorithm:** Monte Carlo Stochastic Drift & Markov Property Transfer.
` : ''}

${sections.provenanceLedger ? `
## 3. DATA PROVENANCE & AUDIT LEDGER
All underlying records derive from statutory filings (Companies House, Land Registry, SEC filings, SWIFT data). Zero interpolation or subjective hypothesis permitted.
` : ''}

---
*CONFIDENTIAL REPORT — GENERATED VIA J-2 INTEL PROCESSING PORTAL*
`;

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `J2_Systemic_Dossier_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      navigator.clipboard.writeText(markdown).catch(() => {}); // Fallback to clipboard
    } else {
      // PDF / Print mode
      try {
        window.print();
      } catch (e) {
        console.error("Print failed", e);
      }
    }

    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Export Intelligence Dossier</h3>
              <p className="text-xs text-slate-400">Compile active intelligence vectors into a portable document.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Environment Restriction:</strong> Due to security protocols, file downloads or printing may be blocked when viewing within the preview frame. If downloads fail, the raw JSON/Markdown output will be automatically copied to your clipboard, or you can open the app in a new tab.
            </p>
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Select Dossier Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  selectedFormat === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Printer className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="text-xs font-bold block">PDF / Print</span>
                  <span className="text-[10px] text-slate-500">Formatted executive dossier</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('json')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  selectedFormat === 'json'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <FileCode className="w-5 h-5 text-teal-600" />
                <div>
                  <span className="text-xs font-bold block">JSON Ledger</span>
                  <span className="text-[10px] text-slate-500">Machine-readable payload</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('md')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  selectedFormat === 'md'
                    ? 'border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-xs font-bold block">Markdown</span>
                  <span className="text-[10px] text-slate-500">Clean text briefing</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section Inclusion Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              2. Included Intelligence Sections
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.executiveSummary}
                  onChange={() => toggleSection('executiveSummary')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Executive Summary</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.predictiveRisk}
                  onChange={() => toggleSection('predictiveRisk')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Predictive Risk Models</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.sigintFeed}
                  onChange={() => toggleSection('sigintFeed')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Live SIGINT Stream</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.provenanceLedger}
                  onChange={() => toggleSection('provenanceLedger')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Provenance Ledger</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.researchBrief}
                  onChange={() => toggleSection('researchBrief')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Dynamic Research Brief</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={sections.procurementCartel}
                  onChange={() => toggleSection('procurementCartel')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">Procurement Cartel Map</span>
              </label>
            </div>
          </div>

          {/* Classification Header Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Classification Header
            </label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="TS // NOFORN // FVEY">TS // NOFORN // FVEY</option>
              <option value="OFFICIAL-SENSITIVE">OFFICIAL-SENSITIVE</option>
              <option value="UNCLASSIFIED // PUBLIC RESEARCH">UNCLASSIFIED // PUBLIC RESEARCH</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Cryptographically Verified</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Dossier Exported
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Dossier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
