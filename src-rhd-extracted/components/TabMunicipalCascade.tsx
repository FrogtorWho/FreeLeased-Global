import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ZAxis, Cell } from 'recharts';
import { MUNICIPAL_CASCADE_DATA } from '../data';
import { Building, Flame, Skull } from 'lucide-react';

export const TabMunicipalCascade: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Municipal Insolvency Cascade (Section 114)
        </h2>
        <p className="text-sm text-slate-600">
          The domino effect of local authority bankruptcies. Driven by statutory SEND (Special Educational Needs) obligations, social care costs, and un-funded pay mandates outstripping flat council tax yields.
        </p>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
        <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">
          Deficit vs Risk Timeline
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" type="number" domain={[2022, 2027]} tickCount={6} name="Year" stroke="#94a3b8" />
              <YAxis dataKey="deficit" type="number" name="Deficit (£M)" stroke="#94a3b8" />
              <ZAxis dataKey="riskScore" type="number" range={[200, 1000]} name="Risk Severity" />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                itemStyle={{ color: '#0f172a' }}
                formatter={(value: number, name: string) => [name === 'deficit' ? `£${value}M` : value, name]}
              />
              <Legend />
              <Scatter name="Councils" data={MUNICIPAL_CASCADE_DATA}>
                {MUNICIPAL_CASCADE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.riskScore > 90 ? '#0d9488' : entry.riskScore > 80 ? '#f97316' : '#d97706'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...MUNICIPAL_CASCADE_DATA].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3).map(council => (
          <div key={council.council} className="bg-slate-50/80 border border-slate-200 p-6 rounded-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building className="w-16 h-16 text-slate-900" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">{council.council}</h4>
            <p className="text-xs font-mono text-teal-700 font-bold uppercase tracking-widest mb-4">
              Status: {council.status}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 text-sm">Deficit</span>
                <span className="text-slate-900 font-mono">£{council.deficit}M</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500 text-sm">Critical Year</span>
                <span className="text-slate-900 font-mono">{council.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
