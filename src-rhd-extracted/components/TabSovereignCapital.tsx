import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PENSION_CAPITAL_FLOW } from '../data';
import { Landmark, ArrowRightLeft, TrendingDown } from 'lucide-react';

const COLORS = ['#0d9488', '#0284c7', '#059669', '#f59e0b'];

export const TabSovereignCapital: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Landmark className="w-5 h-5 text-emerald-600" />
          Sovereign Capital Flight
        </h2>
        <p className="text-sm text-slate-600">
          The structural diversion of £3 Trillion in UK pension capital into foreign equities and debt, starving domestic infrastructure of patient capital while Canadian/Australian funds acquire prime UK state assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">
            UK Pension Allocation (%)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PENSION_CAPITAL_FLOW}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="allocation"
                  nameKey="label"
                  stroke="none"
                >
                  {PENSION_CAPITAL_FLOW.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-lg relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <ArrowRightLeft className="w-24 h-24 text-emerald-600" />
            </div>
            <h3 className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              The Arbitrage Trap
            </h3>
            <p className="text-xl font-bold text-slate-900 mb-4 relative z-10">4% Domestic vs 96% Foreign</p>
            <p className="text-sm text-slate-600 relative z-10 mb-4">
              UK DB/DC pensions hold merely 4% in domestic infrastructure and equities. Meanwhile, UK water grids, ports, and grid networks are owned by Ontario Teachers' Pension Plan and Macquarie, extracting guaranteed yields backed by the UK taxpayer.
            </p>
            <div className="p-4 bg-slate-50/80 rounded border border-slate-200">
              <p className="text-xs font-mono text-slate-500">Result:</p>
              <p className="text-sm text-teal-700 font-bold">Taxpayer underwrites risk; foreign state-pensions extract the yield.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
