import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, ReferenceArea } from 'recharts';
import { Activity, ShieldAlert, Crosshair, TrendingUp, Zap, Home } from 'lucide-react';
import { THREAT_RADAR_DATA, PREDICTIVE_RISK_DATA } from '../data';
import { TooltipHint } from './TooltipHint';

export const TabCommandCenter: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-sans max-w-7xl mx-auto"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <Activity className="w-7 h-7 text-teal-600" />
          EXECUTIVE COMMAND CENTER
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Global threat synthesis and high-level systemic indicators aggregated from all signal intelligence and open-source data vectors.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-teal-50/60 border border-teal-200 p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600"></div>
          <h3 className="text-xs text-slate-700 font-semibold uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" /> 
            <span>Systemic Load (2029)</span>
            <TooltipHint term="Systemic Load" hint="Cumulative operational strain on municipal councils combining fixed debt, labor deficits, and asset backlog." category="METRIC" />
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-teal-900">89<span className="text-xl text-teal-600/70">%</span></p>
          <p className="text-[11px] text-teal-700 font-mono font-bold uppercase">Critical Threshold Exceeded</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600"></div>
          <h3 className="text-xs text-slate-700 font-semibold uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" /> 
            <span>Avg Prime Margin</span>
            <TooltipHint term="Prime Margin" hint="Markup charged by prime outsourcing suppliers over subcontractor day rates (labor arbitrage)." category="METRIC" />
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-amber-900">65<span className="text-xl text-amber-600/70">%</span></p>
          <p className="text-[11px] text-amber-700 font-mono font-bold uppercase">Labor Arbitrage Extraction</p>
        </div>

        <div className="bg-indigo-50/60 border border-indigo-200 p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <h3 className="text-xs text-slate-700 font-semibold uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-600" /> 
            <span>Housing Deficit</span>
            <TooltipHint term="Housing Deficit" hint="Annual gap between target housing completions vs actual net additions in statutory planning areas." category="METRIC" />
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-indigo-900">236<span className="text-xl text-indigo-600/70">k</span></p>
          <p className="text-[11px] text-indigo-700 font-mono font-bold uppercase">Annual Shortfall vs Target</p>
        </div>

        <div className="bg-sky-50/60 border border-sky-200 p-5 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-600"></div>
          <h3 className="text-xs text-slate-700 font-semibold uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-600" /> 
            <span>Grid Deficit (2030)</span>
            <TooltipHint term="Grid Deficit" hint="Projected baseload electricity shortfall caused by data center grid expansion and delayed nuclear hookups." category="METRIC" />
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-sky-900">5<span className="text-xl text-sky-600/70">GW</span></p>
          <p className="text-[11px] text-sky-700 font-mono font-bold uppercase">Projected Baseload Shortfall</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Threat Radar Summary */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-teal-600" />
              Global Threat Vector Radar
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Multi-axis synthesis of systemic fragility domains.
            </p>
          </div>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={THREAT_RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Threat Probability" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.25} strokeWidth={2} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Systemic Load */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Systemic Load vs Default Risk (2018 - 2030)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Consolidated historical actuals (2018-2024) and forecast trajectory.
            </p>
          </div>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREDICTIVE_RISK_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorLoadCc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}%`} width={40} domain={[0, 100]} tickCount={6} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                {/* Projection Demarcation */}
                <ReferenceArea x1={2018} x2={2024} fill="#0d9488" fillOpacity={0.03} />
                <ReferenceLine x={2024} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST', fill: '#475569', fontSize: 10 }} />
                
                {/* Confidence Intervals */}
                <Area type="monotone" dataKey="defaultRiskRange" stroke="none" fill="#0d9488" fillOpacity={0.15} activeDot={false} />
                <Area type="monotone" dataKey="systemicLoadRange" stroke="none" fill="#6366f1" fillOpacity={0.15} activeDot={false} />
                
                <Area type="monotone" dataKey="systemicLoad" name="Total Systemic Load" stroke="#6366f1" fillOpacity={1} fill="url(#colorLoadCc)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="defaultRisk" name="Default Risk" stroke="#0d9488" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
