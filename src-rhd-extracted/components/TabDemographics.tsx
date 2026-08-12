import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import { MIGRATION_TRENDS, HOUSING_DATA, LABOR_SHORTAGE_2026 } from '../data';
import { Users, Home, HardHat } from 'lucide-react';

export const TabDemographics: React.FC = () => {
  // Compute linear regression trend for completions
  const housingDataWithTrend = useMemo(() => {
    const data = [...HOUSING_DATA];
    if (data.length === 0) return data;
    
    // Simple linear regression for completions
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    data.forEach((d, i) => {
      sumX += i;
      sumY += d.completions;
      sumXY += i * d.completions;
      sumXX += i * i;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return data.map((d, i) => ({
      ...d,
      completionTrend: Math.round(slope * i + intercept)
    }));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Migration Trends */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              Migration vs Infrastructure Demand
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Net migration vs non-EU influx fueling structural housing demand.
            </p>
          </div>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MIGRATION_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorNonEu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickMargin={10} interval="preserveStartEnd" />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}k`} width={40} tickCount={6} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: 0 }} />
                {/* Projection Demarcation */}
                <ReferenceArea x1={'Dec 2024'} x2={'Dec 2025'} fill="#0f172a" fillOpacity={0.03} />
                <ReferenceLine x={'Dec 2024'} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST', fill: '#64748b', fontSize: 10, offset: 10 }} />
                
                <Area type="monotone" dataKey="nonEu" name="Non-EU Migration" stroke="#0284c7" fillOpacity={1} fill="url(#colorNonEu)" />
                <Line type="monotone" dataKey="net" name="Net Total" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-4 pt-2 border-t border-slate-100 flex justify-between">
            <span>Y-Axis: Thousands (k)</span>
            <span>SOURCE: ONS LTIM (2024)</span>
          </div>
        </div>

        {/* Housing Deficit */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-4 h-4 text-indigo-600" />
              Housing Delivery vs Statutory Targets
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Delivery trends (starts/completions) vs mandatory mandates.
            </p>
          </div>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={housingDataWithTrend} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickMargin={10} interval="preserveStartEnd" />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val / 1000}k`} width={40} tickCount={6} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(val: number) => val.toLocaleString()}
                />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: 0 }} />
                {/* Projection Demarcation */}
                <ReferenceArea x1={'2024'} x2={'2025'} fill="#0f172a" fillOpacity={0.03} />
                <ReferenceLine x={'2024'} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST', fill: '#64748b', fontSize: 10, offset: 10 }} />
                
                <Area type="step" dataKey="target" name="Target" stroke="#7c3aed" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
                <Line type="monotone" dataKey="starts" name="Starts" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completions" name="Completions" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completionTrend" name="Delivery Trend (Linear)" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" dot={false} opacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-4 pt-2 border-t border-slate-100 flex justify-between">
            <span>Y-Axis: Thousands (k)</span>
            <span>SOURCE: DLUHC LIVE TABLES (2024)</span>
          </div>
        </div>

        {/* Labor Shortage Heatmap / List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mt-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <HardHat className="w-5 h-5 text-orange-500" />
            2026 Construction Labor Capacity Crisis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {LABOR_SHORTAGE_2026.map((labor) => (
              <div key={labor.trade} className="bg-slate-50/80 border border-slate-200 p-4 rounded text-center">
                <h4 className="text-sm font-bold text-slate-800 mb-2">{labor.trade}</h4>
                <div className={`text-xs font-mono uppercase px-2 py-1 inline-block rounded mb-3 ${
                  labor.demand === 'Critical' ? 'bg-red-950 text-teal-700' :
                  labor.demand === 'Very High' ? 'bg-orange-950 text-orange-400' :
                  'bg-yellow-950 text-yellow-400'
                }`}>
                  {labor.demand}
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  +{labor.wageInflation}%
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-1">Wage Inflation</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
