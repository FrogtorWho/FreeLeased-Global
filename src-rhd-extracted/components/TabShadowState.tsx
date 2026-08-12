import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ARBITRAGE_DATA } from '../data';
import { Briefcase, Scale, Layers } from 'lucide-react';

export const TabShadowState: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Margin Arbitrage Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              T&M Subcontractor Margin Arbitrage
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Global consulting firms extract severe margins from public sector contracts by leveraging complex frameworks (G-Cloud, DOS).
            </p>
          </div>
          <div className="flex-1 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ARBITRAGE_DATA} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="role" stroke="#94a3b8" fontSize={10} tickMargin={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `£${val}`} tickLine={false} axisLine={false} width={45} tickCount={6} />
                <YAxis yAxisId="right" orientation="right" stroke="#d97706" fontSize={10} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={false} width={40} tickCount={6} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: 0 }} />
                <Bar yAxisId="left" dataKey="primeRate" name="Prime Contractor Day Rate (£)" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="subRate" name="Subcontractor Day Rate (£)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="margin" name="Arbitrage Margin (%)" stroke="#d97706" strokeWidth={3} dot={{ r: 6, fill: '#d97706' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-4 pt-2 border-t border-slate-100 flex justify-between">
            <span>Y-Axis: LHS Day Rate (£) | RHS Margin (%)</span>
            <span>SOURCE: G-CLOUD DOS ANALYSIS</span>
          </div>
        </div>

        {/* Legal & Consulting Frameworks */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Crown Commercial Service (CCS)
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2">The Panel Oligopoly</p>
            <p className="text-sm text-slate-600">
              The £600M Legal Services panel enforces a Tier-1 citadel, aggressively locking out boutique and independent firms through restrictive turnover mandates and complex procurement barriers.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tier 1 Dominance</span>
                <span className="text-teal-700 font-bold">85% of Spend</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Consulting Dependency
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2">Structural Knowledge Loss</p>
            <p className="text-sm text-slate-600">
              Continuous outsourcing of core technical architecture to "body-shops" has resulted in systemic capability loss within the civil service, rendering departments captive clients to external primes.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
