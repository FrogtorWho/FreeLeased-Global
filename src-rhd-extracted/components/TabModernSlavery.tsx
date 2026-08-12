import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Link, AlertOctagon } from 'lucide-react';
import { MODERN_SLAVERY_SCORING } from '../data';

export const TabModernSlavery: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Link className="w-5 h-5 text-orange-500" />
          Structural Coercion & "Modern Slavery" Dynamics
        </h2>
        <p className="text-sm text-slate-600">
          Applying the identifying criteria of modern slavery (coercion, financial control, restriction of movement, exploitation) to domestic policies affecting residents and benefit-claimers. This unmasks how state mechanisms (like welfare conditionality and temporary housing) structurally mirror exploitative control vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Matrix */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-orange-500" />
            Cohort Coercion Matrix
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODERN_SLAVERY_SCORING} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="cohort" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="financialControl" name="Financial Control" stackId="a" fill="#0284c7" />
                <Bar dataKey="coercion" name="Threats/Coercion" stackId="a" fill="#f59e0b" />
                <Bar dataKey="restrictionOfMovement" name="Movement Restriction" stackId="a" fill="#0d9488" />
                <Bar dataKey="exploitation" name="Exploitation" stackId="a" fill="#a855f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="space-y-4">
          <div className="bg-orange-950/20 border border-orange-900/50 p-5 rounded-lg">
            <h4 className="text-sm font-bold text-orange-400 mb-2">Defining the Criteria (Overlay)</h4>
            <p className="text-xs text-slate-600 mb-4">
              Standard ILO indicators of forced labor transposed onto state/corporate systems:
            </p>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex gap-2">
                <span className="text-sky-600 font-bold shrink-0">Financial Control:</span> 
                <span>Sanction regimes withholding basic subsistence (Universal Credit conditionalities) generating pure dependency.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold shrink-0">Coercion/Threats:</span> 
                <span>Threat of eviction, destitution, or deportation used to force compliance into unfavorable labor or housing.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold shrink-0">Restriction of Move:</span> 
                <span>Temporary accommodation placement hundreds of miles from support networks; visa-tied labor preventing employer changes.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold shrink-0">Exploitation:</span> 
                <span>Zero-hour contracts transferring all demand-risk to the individual while maintaining monopolistic labor control.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50/80 border border-slate-200 p-5 rounded-lg">
             <h4 className="text-sm font-bold text-slate-900 mb-3">Overall Structural Risk Scores</h4>
             <div className="space-y-3">
               {[...MODERN_SLAVERY_SCORING].sort((a,b) => b.overallRisk - a.overallRisk).map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <div className="w-1/2 text-xs text-slate-600 truncate" title={item.cohort}>{item.cohort}</div>
                    <div className="w-1/2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.overallRisk > 80 ? 'bg-teal-500' : item.overallRisk > 70 ? 'bg-orange-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${item.overallRisk}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{item.overallRisk}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
