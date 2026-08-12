import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { GLOBAL_TRANSIT_CAPITAL } from '../data';
import { Train, Globe, GitMerge, Activity } from 'lucide-react';

export const TabGlobalTransit: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Transit Cartel Capital Flow */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Train className="w-5 h-5 text-emerald-600" />
              The Franco-Canadian Transit Citadel
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            UK rail infrastructure is systematically captured by a tight nexus of the French State (SNCF) and Canadian pension capital (CDPQ). This architecture extracts UK taxpayer subsidies to fund foreign state pensions, obfuscated through complex holding structures like Govia and Keolis.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GLOBAL_TRANSIT_CAPITAL} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="entity" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="cdpq" stackId="a" name="CDPQ (Canada)" fill="#059669" />
                <Bar dataKey="frenchState" stackId="a" name="SNCF / French State" fill="#0284c7" />
                <Bar dataKey="other" stackId="a" name="Public/Other" fill="#334155" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nodes of Hegemony */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl relative overflow-hidden">
            {/* Animated Flow Lines Background */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-100,50 Q200,200 500,50 T1000,100" stroke="#059669" strokeWidth="2" fill="none">
                <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M-50,150 Q100,50 300,150 T800,200" stroke="#0284c7" strokeWidth="2" fill="none">
                <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="4s" repeatCount="indefinite" />
              </path>
            </svg>

            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2">
              <Activity className="w-4 h-4 inline mr-1 text-emerald-600" /> Capital Extraction Flow
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2 relative z-10">The CDPQ Arbitrage</p>
            <p className="text-sm text-slate-600 relative z-10">
              The Caisse de dépôt et placement du Québec (CDPQ) holds massive debt and equity positions across Alstom, Keolis, and Eurostar. By leveraging UK infrastructure contracts, CDPQ guarantees stable, inflation-linked yields for Canadian retirees, directly subsidized by UK commuters and taxpayers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-[0.03]">
              <Globe className="w-48 h-48" />
            </div>
            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2 relative z-10">
              <GitMerge className="w-4 h-4" /> Structural Vendor Lock-In
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2 relative z-10">ALSTOM's Rolling Stock Monopoly</p>
            <p className="text-sm text-slate-600 relative z-10">
              Alstom operates as the sole-source provider for critical UK rail rolling stock. By threatening factory closures (e.g., Litchurch Lane in Derby), they force the Department for Transport into bespoke, non-competitive procurement cycles, effectively holding UK domestic manufacturing hostage.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
