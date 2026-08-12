import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, AlertOctagon, Activity } from 'lucide-react';

export const TabWarRoom: React.FC = () => {
  const [rates, setRates] = useState(5.25);
  const [migration, setMigration] = useState(350);
  const [payRise, setPayRise] = useState(5.5);

  const systemicLoad = Math.min(100, Math.max(0, (rates * 4) + (migration * 0.05) + (payRise * 6)));
  const yearOfCollapse = 2035 - Math.floor(systemicLoad / 15);

  const getLoadColor = (load: number) => {
    if (load >= 90) return 'text-teal-600';
    if (load >= 70) return 'text-orange-500';
    if (load >= 50) return 'text-amber-500';
    return 'text-emerald-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Settings2 className="w-5 h-5 text-indigo-500" />
          Interactive Policy Simulation
        </h2>
        <p className="text-sm text-slate-600">
          Adjust macroeconomic levers to observe real-time impacts on systemic load and projected state infrastructure viability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-800">Base Interest Rate (%)</label>
              <span className="font-mono text-slate-600">{rates.toFixed(2)}%</span>
            </div>
            <input 
              type="range" 
              min="1" max="10" step="0.25" 
              value={rates} 
              onChange={(e) => setRates(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <p className="text-xs text-slate-500 mt-2">Impacts: Debt servicing, housing starts, Grey Belt RLV.</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-800">Net Migration Demand (Thousands)</label>
              <span className="font-mono text-slate-600">{migration}k</span>
            </div>
            <input 
              type="range" 
              min="100" max="800" step="10" 
              value={migration} 
              onChange={(e) => setMigration(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-slate-500 mt-2">Impacts: Housing deficit, water infrastructure capacity, labor shortage.</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-800">Public Sector Pay Award (%)</label>
              <span className="font-mono text-slate-600">{payRise.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" step="0.5" 
              value={payRise} 
              onChange={(e) => setPayRise(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-xs text-slate-500 mt-2">Impacts: Municipal bankruptcy (s.114), margin arbitrage exploitation.</p>
          </div>

        </div>

        {/* Readout */}
        <div className="bg-slate-50/80 border border-slate-200 p-6 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
          {systemicLoad >= 85 && (
            <div className="absolute inset-0 bg-teal-50/50 animate-pulse pointer-events-none" />
          )}
          
          <Activity className={`w-12 h-12 mb-4 ${getLoadColor(systemicLoad)}`} />
          
          <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">
            Total Systemic Load
          </h3>
          <div className={`text-6xl font-black mb-8 ${getLoadColor(systemicLoad)}`}>
            {systemicLoad.toFixed(1)}%
          </div>
          
          <div className="w-full bg-white border border-slate-200 p-4 rounded text-center">
            <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1">
              Projected Critical Failure
            </h4>
            <div className={`text-2xl font-bold ${yearOfCollapse <= 2027 ? 'text-teal-600' : 'text-slate-900'}`}>
              Q3 {yearOfCollapse}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
