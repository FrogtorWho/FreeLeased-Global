import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Bar, ReferenceArea, ReferenceLine } from 'recharts';
import { ENERGY_GRID_DATA } from '../data';
import { Zap, Server, AlertTriangle } from 'lucide-react';

export const TabGridEnergy: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Grid Capacity vs Tech Demand
        </h2>
        <p className="text-sm text-slate-600">
          Structural energy deficits driven by rapid hyperscaler (AI) data center expansion against stagnant national grid capacity. Projected brownouts in critical South East corridors by 2028.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Capacity Projection (GW)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Base capacity vs demand against AI datacenter spikes.
            </p>
          </div>
          <div className="flex-1 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ENERGY_GRID_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickMargin={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={40} tickCount={6} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: 0 }} />
                {/* Projection Demarcation */}
                <ReferenceArea x1={2026} x2={2030} fill="#0f172a" fillOpacity={0.03} />
                <ReferenceLine x={2026} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST', fill: '#64748b', fontSize: 10, offset: 10 }} />
                
                <Area type="monotone" dataKey="capacity" name="Base Capacity" fill="#22c55e" stroke="#16a34a" fillOpacity={0.1} />
                <Line type="monotone" dataKey="demand" name="Base Demand" stroke="#e11d48" strokeWidth={2} dot={false} />
                <Bar dataKey="aiDemand" name="AI/DC Spike" fill="#a855f7" stackId="a" opacity={0.8} />
                <Bar dataKey="deficit" name="Deficit" fill="#0d9488" stackId="a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-4 pt-2 border-t border-slate-100 flex justify-between">
            <span>Y-Axis: Gigawatts (GW)</span>
            <span>SOURCE: NATIONAL GRID ESO (2024)</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Server className="w-16 h-16 text-indigo-600" />
            </div>
            <h3 className="font-mono text-[10px] text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
              Hyperscale Parasitism
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2 relative z-10">Data vs Housing</p>
            <p className="text-sm text-slate-600 relative z-10">
              A single 100MW AI data center consumes the equivalent power of 120,000 homes. Grid connections for domestic housing are being paused to prioritize corporate DC capacity in the M4 corridor.
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <AlertTriangle className="w-16 h-16 text-teal-600" />
            </div>
            <h3 className="font-mono text-[10px] text-teal-700 uppercase tracking-widest mb-2 flex items-center gap-2">
              Grid Collapse Risk
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-2 relative z-10">2028 Horizon</p>
            <p className="text-sm text-slate-600 relative z-10">
              Failure to build high-voltage transmission lines (HVDC) due to local planning objections ensures base demand + AI load exceeds generation capacity by Q4 2028.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
