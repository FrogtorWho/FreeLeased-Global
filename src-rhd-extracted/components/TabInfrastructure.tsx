import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine } from 'recharts';
import { SEND_CRISIS_DATA, WATER_INFRASTRUCTURE } from '../data';
import { Droplets, Building2 } from 'lucide-react';

export const TabInfrastructure: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SEND Crisis */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Municipal Solvency: SEND Cliff Edge
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            The statutory override hiding dedicated schools grant (DSG) deficits ends in March 2026. Without intervention, 42 councils face instant Section 114 bankruptcy, obliterating local statutory services.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEND_CRISIS_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `£${Math.abs(val)}M`} />
                <YAxis dataKey="council" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend />
                <ReferenceLine x={0} stroke="#52525b" />
                <Bar dataKey="deficit" name="Deficit 2026 (£M)" fill="#0d9488" radius={[0, 4, 4, 0]} />
                <Bar dataKey="swing" name="YOY Swing (£M)" fill="#f97316" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Infrastructure */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              Utility Fragility: Water Grids
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            The South East grid operates on severe structural deficits. Unmitigated leakage rates combined with record per-capita consumption (PCC) creates an insurmountable supply/demand gap by 2030 amidst population growth.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WATER_INFRASTRUCTURE} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="company" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="#0284c7" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#e11d48" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#0f172a' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="pcc" name="Per Capita Consumption (Liters/day)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="leakage" name="Leakage Rate (%)" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
