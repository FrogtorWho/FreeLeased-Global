import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ZAxis, Cell } from 'recharts';
import { Scale, Globe, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { INTL_LAW_VECTORS } from '../data';

export const TabJurisdictionLegal: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-indigo-500" />
          Jurisdiction Legal Frameworks (International Overlay)
        </h2>
        <p className="text-sm text-slate-600">
          A dynamic template for assessing the impact of supranational legal architectures on sovereign capacity. Maps the application of international treaties and their structural pros, cons, and systemic friction effects.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Framework Decision Tree */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" />
            Legal Overlay Decision Flow
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-50/80 border border-slate-200 p-4 rounded text-sm text-slate-700">
              <div className="font-bold text-indigo-400 mb-1">1. Supranational Treaty Identification</div>
              <p className="text-xs text-slate-500">Determine binding international commitments (UN, ECHR, WTO).</p>
            </div>
            
            <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-slate-400 rotate-90" /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded text-sm text-slate-700">
                <div className="font-bold text-emerald-600 mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Applied (Enshrined)</div>
                <p className="text-xs text-slate-500">Domestic courts enforce treaty via primary legislation (e.g., Human Rights Act 1998).</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 p-4 rounded text-sm text-slate-700">
                <div className="font-bold text-teal-600 mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Unapplied / Derogated</div>
                <p className="text-xs text-slate-500">Jurisdiction opts out or faces structural sanctions/friction for non-compliance.</p>
              </div>
            </div>

            <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-slate-400 rotate-90" /></div>
            
            <div className="bg-slate-50/80 border border-slate-200 p-4 rounded text-sm text-slate-700">
              <div className="font-bold text-orange-400 mb-1">3. Sovereign Impact / Friction Analysis</div>
              <p className="text-xs text-slate-500">Assess the trade-off: International standing & individual protections vs. Executive paralysis & fiscal load.</p>
            </div>
          </div>
        </div>

        {/* Vectors Impact Analysis */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
           <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">
            International Law Vectors (Impact vs Binding Level)
          </h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="binding" type="number" name="Binding Level" domain={[60, 100]} stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="impact" type="number" name="Systemic Impact" domain={[60, 100]} stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <ZAxis dataKey="vector" name="Vector" />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                />
                <Scatter data={INTL_LAW_VECTORS} fill="#6366f1">
                  {INTL_LAW_VECTORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact > 85 ? '#0d9488' : '#0284c7'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 overflow-y-auto h-48 custom-scrollbar pr-2">
            {INTL_LAW_VECTORS.map((vector, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-200 p-3 rounded">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-800">{vector.vector}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{vector.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] uppercase text-emerald-600 font-bold block mb-0.5">Pros</span>
                    <p className="text-xs text-slate-600">{vector.pros}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-teal-600 font-bold block mb-0.5">Cons</span>
                    <p className="text-xs text-slate-600">{vector.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
