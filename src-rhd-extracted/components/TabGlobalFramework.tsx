import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Database, Scale, Users, FileSearch, ArrowRight, ArrowDown, Network, Lock, Zap, Search } from 'lucide-react';

export const TabGlobalFramework: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          Sovereign Vulnerability Audit Framework
        </h2>
        <p className="text-sm text-slate-600">
          A generalized top-level methodology for replicating systemic risk extraction research across any national jurisdiction. This decision tree maps the forensic pathway from initial data acquisition through to mapping geopolitical capital capture.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Core Process Flow */}
        <div className="xl:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">
            Phase 1-4: Forensic Discovery Pipeline
          </h3>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0 hidden md:block"></div>
            
            <div className="space-y-6 relative z-10">
              
              {/* Phase 1 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-900 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <Database className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1 bg-slate-50/80 border border-slate-200 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">1. Macro Data Ingestion</h4>
                    <span className="text-[10px] font-mono text-sky-700 border border-sky-200 bg-sky-50 px-2 py-0.5 rounded">PHASE 1</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Identify national demographic vectors vs. available resource baselines.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-blue-500">Population Growth & Migration</div>
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-blue-500">Tax Base & GDP Trajectory</div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-950 border border-orange-900 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <Scale className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 bg-slate-50/80 border border-slate-200 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">2. Statutory Liability Audit</h4>
                    <span className="text-[10px] font-mono text-orange-400 border border-orange-900/50 bg-orange-950/30 px-2 py-0.5 rounded">PHASE 2</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Map legally mandated spending against available local/federal funding streams. Identify un-funded mandates.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-orange-500">Constitutional Care Obligations</div>
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-orange-500">Public Sector Pension Liabilities</div>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-12 h-12 rounded-full bg-red-950 border border-teal-300 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <Zap className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 bg-slate-50/80 border border-slate-200 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">3. Infrastructure Deficit Mapping</h4>
                    <span className="text-[10px] font-mono text-teal-700 border border-teal-200 bg-teal-50 px-2 py-0.5 rounded">PHASE 3</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Cross-reference physical capacity ceilings against projected demand (Phase 1).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-red-500">Energy Grid vs AI/Industrial Load</div>
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-red-500">Housing Supply vs Migration Math</div>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 bg-slate-50/80 border border-slate-200 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">4. Shadow State & Capital Extraction</h4>
                    <span className="text-[10px] font-mono text-emerald-400 border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 rounded">PHASE 4</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Trace the flow of public capital into private or foreign state hands via procurement and privatization architectures.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-emerald-500">BPO Cartel Dependency</div>
                    <div className="bg-white p-2 rounded border border-slate-200 border-l-2 border-l-emerald-500">Foreign Sovereign Wealth Ownership</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Process Variances */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              Jurisdiction Variances
            </h3>
            
            <div className="space-y-4">
              
              {/* Data & Legal */}
              <div className="bg-white/40 border border-slate-200 p-4 rounded-lg border-t-2 border-t-indigo-500">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <FileSearch className="w-4 h-4 text-indigo-400" /> Data & Legal Transparency
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  Adapt discovery methods based on local Freedom of Information (FOI) laws.
                </p>
                <ul className="text-xs text-slate-500 space-y-1 ml-4 list-disc marker:text-indigo-900">
                  <li><strong>High Transparency (UK/Nordics):</strong> Direct access to municipal ledgers.</li>
                  <li><strong>Opaque (Emerging Markets):</strong> Use proxy indicators (e.g., currency outflows, satellite infra data).</li>
                </ul>
              </div>

              {/* Demographic */}
              <div className="bg-white/40 border border-slate-200 p-4 rounded-lg border-t-2 border-t-rose-500">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-rose-400" /> Demographic Divergence
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  The primary stressor dictates the fragility model.
                </p>
                <ul className="text-xs text-slate-500 space-y-1 ml-4 list-disc marker:text-rose-900">
                  <li><strong>Aging (Japan/Italy):</strong> Pension liability & healthcare infrastructure collapse.</li>
                  <li><strong>Youth Bulge (MENA):</strong> Housing, employment, and agricultural resource stress.</li>
                </ul>
              </div>

              {/* Financial Architecture */}
              <div className="bg-white/40 border border-slate-200 p-4 rounded-lg border-t-2 border-t-amber-500">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-amber-700" /> Capital Sovereignty
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  Identify who owns the national debt and infrastructure.
                </p>
                <ul className="text-xs text-slate-500 space-y-1 ml-4 list-disc marker:text-amber-900">
                  <li><strong>Sovereign Debt (US):</strong> Inflationary monetization risk.</li>
                  <li><strong>Foreign Debt (Developing):</strong> Currency collapse & IMF austerity lock-in.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
