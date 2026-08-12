import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, FileText, Satellite, Users, Radio, Globe, Activity, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

const FUSION_CASES = [
  {
    id: 'case_001',
    name: 'Operation Empty Estate (Managed Decline)',
    description: 'Systematic dilapidation of high-density social housing to justify demolition and land-grab.',
    overallConfidence: 94,
    vectors: [
      {
        type: 'FININT',
        icon: <Activity className="w-4 h-4" />,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        summary: 'Capital Extraction',
        detail: 'Analysis of corporate accounts reveals £45M extracted via internal dividend payouts while maintenance budgets were cut by 40%.',
      },
      {
        type: 'OSINT',
        icon: <Globe className="w-4 h-4" />,
        color: 'text-sky-600 bg-sky-50 border-sky-200',
        summary: 'Planning & Media',
        detail: 'Local council planning minutes indicate pre-emptive rezoning discussions 2 years prior to public consultation.',
      },
      {
        type: 'GEOINT',
        icon: <Satellite className="w-4 h-4" />,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        summary: 'Physical Degradation',
        detail: 'Time-series satellite & drone imagery confirms localized roof failures exclusively in blocks marked for eventual redevelopment.',
      },
      {
        type: 'HUMINT',
        icon: <Users className="w-4 h-4" />,
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        summary: 'Tenant Reports',
        detail: 'Coordinated reports from tenant unions confirm systematic refusal of emergency repairs. Evidence of informal eviction pressure.',
      }
    ]
  },
  {
    id: 'case_002',
    name: 'Procurement Cartel Structuring',
    description: 'Monopolization of municipal service contracts through hidden subsidiary networks.',
    overallConfidence: 89,
    vectors: [
      {
        type: 'FININT',
        icon: <Activity className="w-4 h-4" />,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        summary: 'Beneficial Ownership',
        detail: 'Three supposedly competing bidders share the same ultimate holding company based in a zero-tax jurisdiction.',
      },
      {
        type: 'OSINT',
        icon: <Globe className="w-4 h-4" />,
        color: 'text-sky-600 bg-sky-50 border-sky-200',
        summary: 'Public Contracts',
        detail: 'Scraping of government tender portals shows anomalous win-rates for this specific network of subsidiaries.',
      },
      {
        type: 'CYBINT',
        icon: <Cpu className="w-4 h-4" />,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        summary: 'Digital Infrastructure',
        detail: 'IP analysis of bidding submission timestamps indicates automated, coordinated bid pacing from the same server blocks.',
      }
    ]
  }
];

export const TabMultiIntFusion: React.FC = () => {
  const [activeCase, setActiveCase] = useState(FUSION_CASES[0].id);

  const selectedCase = FUSION_CASES.find(c => c.id === activeCase) || FUSION_CASES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-mono pb-12"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Network className="w-6 h-6 text-indigo-600" />
          MULTI-INT FUSION ENGINE
        </h1>
        <p className="text-sm text-slate-600">
          Cross-disciplinary intelligence synthesis. Correlating Open Source, Financial, Geospatial, and Human Intelligence to defeat compartmentalized threat actors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Case Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4" /> Active Syntheses
          </h3>
          {FUSION_CASES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCase(c.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeCase === c.id 
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-md' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold leading-tight">{c.name}</h4>
                {activeCase === c.id && <ArrowRight className="w-4 h-4 text-indigo-300 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${activeCase === c.id ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  CONF: {c.overallConfidence}%
                </span>
                <span className={`text-[10px] ${activeCase === c.id ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {c.vectors.length} Vectors
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Fusion Display */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedCase.name}</h2>
                  <p className="text-sm text-slate-600">{selectedCase.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-bold text-indigo-600">{selectedCase.overallConfidence}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Synthesis Confidence</div>
                </div>
              </div>

              <div className="relative">
                {/* Central connection line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>

                <div className="space-y-6 relative">
                  {selectedCase.vectors.map((vector, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-6 relative"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10 ${vector.color}`}>
                        {vector.icon}
                      </div>
                      <div className={`flex-1 border rounded-lg p-5 ${vector.color.replace('text-', 'border-').split(' ')[0]} bg-white/50 backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold uppercase tracking-widest">{vector.type}</h4>
                          <span className="text-xs font-bold opacity-80">{vector.summary}</span>
                        </div>
                        <p className="text-sm font-medium opacity-90 leading-relaxed">
                          {vector.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 p-4 rounded-lg flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Analyst Conclusion (NEXUS-V4)</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    The intersection of these isolated data silos confirms a coordinated, multi-domain strategy. Relying on single-source intelligence (e.g., only OSINT or only GEOINT) would fail to establish the necessary intent required for legal counter-measures.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
