import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import { Target, Activity, Settings, TrendingUp, TrendingDown, Scale } from 'lucide-react';

export const TabWarGaming: React.FC = () => {
  // Scenario Levers (0-100)
  const [levers, setLevers] = useState({
    austerity: 50,      // 0 = Stimulus, 100 = Hard Austerity
    gridInvestment: 30, // 0 = Neglect, 100 = Hyper-Investment
    migration: 60,      // 0 = Closed Borders, 100 = Open Labor Market
  });

  const handleLeverChange = (name: keyof typeof levers, value: number) => {
    setLevers(prev => ({ ...prev, [name]: value }));
  };

  // Generate synthetic projection based on levers
  const projectionData = useMemo(() => {
    const baseYear = 2024;
    const data = [];
    
    // Starting baselines
    let resilience = 60; 
    let defaultRisk = 20;

    for (let i = 0; i <= 6; i++) {
      const year = baseYear + i;
      
      if (i > 0) {
        // Calculate deltas based on levers
        
        // Austerity increases default risk in short term, but maybe stabilizes long term?
        const austerityImpact = (levers.austerity - 50) / 10; 
        
        // Grid investment boosts resilience
        const gridImpact = (levers.gridInvestment - 50) / 8;
        
        // Migration solves labor but adds infrastructure strain
        const migrationLaborImpact = (levers.migration - 50) / 12; // Boosts resilience
        const migrationInfraImpact = (levers.migration - 50) / 15; // Increases default risk (cost)

        resilience += gridImpact + migrationLaborImpact - (austerityImpact * 0.5);
        defaultRisk += austerityImpact + migrationInfraImpact - (gridImpact * 0.3);

        // Add some random noise and bounds
        resilience = Math.max(10, Math.min(100, resilience + (Math.random() * 4 - 2)));
        defaultRisk = Math.max(5, Math.min(95, defaultRisk + (Math.random() * 4 - 2)));
      }

      data.push({
        year,
        resilience: Math.round(resilience * 10) / 10,
        defaultRisk: Math.round(defaultRisk * 10) / 10,
      });
    }
    return data;
  }, [levers]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Target className="w-6 h-6 text-teal-600" />
          WAR-GAMING & STRATEGIC DOCTRINE
        </h1>
        <p className="text-sm text-slate-600">
          Interactive Monte Carlo simulator. Adjust macroeconomic and policy levers to forecast systemic outcomes through 2030.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Levers Panel */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-slate-500" />
            POLICY LEVERS
          </h2>

          {/* Lever 1 */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-700">FISCAL DOCTRINE</label>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {levers.austerity < 40 ? 'STIMULUS' : levers.austerity > 70 ? 'HARD AUSTERITY' : 'BALANCED'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={levers.austerity}
              onChange={(e) => handleLeverChange('austerity', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 uppercase">
              <span>Expansionary</span>
              <span>Contractionary</span>
            </div>
          </div>

          {/* Lever 2 */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-700">GRID INVESTMENT</label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {levers.gridInvestment} / 100
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={levers.gridInvestment}
              onChange={(e) => handleLeverChange('gridInvestment', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 uppercase">
              <span>Managed Decline</span>
              <span>Hyper-Scale</span>
            </div>
          </div>

          {/* Lever 3 */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-700">MIGRATION / LABOR TAPS</label>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {levers.migration} / 100
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={levers.migration}
              onChange={(e) => handleLeverChange('migration', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 uppercase">
              <span>Restrictionist</span>
              <span>Liberalized</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={() => setLevers({ austerity: 50, gridInvestment: 30, migration: 60 })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 rounded transition-colors"
            >
              RESET TO BASELINE
            </button>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                SYSTEMIC OUTCOME PROJECTION (2024-2030)
              </h2>
              <p className="text-xs text-slate-500 mt-1">Live calculation based on selected policy parameters.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">
                {projectionData[projectionData.length - 1].resilience.toFixed(1)}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">2030 Resilience Score</div>
            </div>
          </div>

          <div className="flex-1 h-80 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResilience" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                
                <ReferenceArea x1={2024} x2={2030} fill="#0f172a" fillOpacity={0.02} />
                
                <Area 
                  type="monotone" 
                  dataKey="resilience" 
                  name="Systemic Resilience" 
                  stroke="#0d9488" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorResilience)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="defaultRisk" 
                  name="Default & Cascade Risk" 
                  stroke="#e11d48" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
