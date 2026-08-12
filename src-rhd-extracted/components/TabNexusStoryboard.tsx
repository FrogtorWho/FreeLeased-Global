import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, ReferenceArea } from 'recharts';
import { Route, Search, FunctionSquare, Network, Crosshair, FlaskConical, CheckCircle2, Clock, Activity } from 'lucide-react';
import { FORENSIC_ROADMAP } from '../data';

export const TabNexusStoryboard: React.FC = () => {
  // Mock data for the convergence graph
  const convergenceData = [
    { time: 'T-0', vectors: 4, correlation: 10, confidence: 0, confRange: [0, 5], corrRange: [5, 15] },
    { time: 'T-1', vectors: 4, correlation: 30, confidence: 20, confRange: [10, 30], corrRange: [20, 40] },
    { time: 'T-2', vectors: 4, correlation: 65, confidence: 50, confRange: [35, 65], corrRange: [55, 75] },
    { time: 'T-3', vectors: 4, correlation: 88, confidence: 80, confRange: [70, 90], corrRange: [80, 95] },
    { time: 'Nexus (T-4)', vectors: 1, correlation: 100, confidence: 95, confRange: [92, 98], corrRange: [98, 100] },
  ];

  const getIcon = (step: number) => {
    switch(step) {
      case 1: return <Search className="w-5 h-5 text-sky-600" />;
      case 2: return <FunctionSquare className="w-5 h-5 text-emerald-600" />;
      case 3: return <Network className="w-5 h-5 text-indigo-600" />;
      case 4: return <Crosshair className="w-5 h-5 text-teal-600" />;
      case 5: return <FlaskConical className="w-5 h-5 text-orange-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Route className="w-5 h-5 text-indigo-500" />
          Forensic Storyboard: The Path to the Nexus
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Visualizing the investigative roadmap. The path to the truth is as critical as the truth itself in order to prove it. This matrix maps our transition from observing surface anomalies, to isolating structural vectors, to identifying the ultimate systemic singularity (or proving it does not exist via falsifiability).
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Timeline Storyboard */}
        <div className="xl:col-span-2 space-y-6 relative">
          {/* Vertical Track Line */}
          <div className="absolute left-7 top-4 bottom-8 w-px bg-slate-100 z-0"></div>

          {FORENSIC_ROADMAP.map((item, idx) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative z-10 flex gap-6"
            >
              {/* Node Icon */}
              <div className="shrink-0 w-14 h-14 rounded-full bg-[#09090b] border-2 border-slate-200 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {getIcon(item.step)}
              </div>
              
              {/* Content Box */}
              <div className={`flex-1 p-5 rounded-lg border ${
                item.status === 'Active Investigation' ? 'bg-teal-50 border-teal-200 shadow-[0_0_20px_rgba(220,38,38,0.05)]' :
                item.status === 'Verified' ? 'bg-white border-slate-200' :
                'bg-slate-50/80 border-slate-100 opacity-70'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">PHASE {item.step}:</span>
                    {item.phase}
                  </h3>
                  <div className="flex items-center gap-1">
                    {item.status === 'Verified' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {item.status === 'Active Investigation' && <Activity className="w-4 h-4 text-teal-600 animate-pulse" />}
                    {item.status === 'Pending' && <Clock className="w-4 h-4 text-slate-500" />}
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${
                      item.status === 'Verified' ? 'text-emerald-600' :
                      item.status === 'Active Investigation' ? 'text-teal-600' : 'text-slate-500'
                    }`}>{item.status}</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="bg-white/40 p-3 rounded border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Vector Outcome:</span>
                  <p className="text-xs text-slate-700 font-mono">{item.outcome}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytical Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Convergence Trajectory
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Mathematical confidence model tracking the probability that the isolated vectors share a singular root nexus, vs being independent failures.
              </p>
            </div>
            
            <div className="flex-1 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={convergenceData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickMargin={10} interval="preserveStartEnd" />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickFormatter={(val) => `${val}%`} width={40} tickCount={6} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                    formatter={(value: any, name: string, props: any) => {
                      if (name === 'confRange' || name === 'corrRange') return [];
                      if (name === 'Nexus Prob') {
                        return [`${value}% (CI: ${props.payload.confRange[0]}-${props.payload.confRange[1]}%)`, name];
                      }
                      if (name === 'Correlation') {
                        return [`${value}% (CI: ${props.payload.corrRange[0]}-${props.payload.corrRange[1]}%)`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <ReferenceLine x="Nexus (T-4)" stroke="#0d9488" strokeDasharray="3 3" />
                  
                  {/* Projection Demarcation */}
                  <ReferenceArea x1="T-2" x2="Nexus (T-4)" fill="#0f172a" fillOpacity={0.03} />
                  <ReferenceLine x="T-2" stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST', fill: '#64748b', fontSize: 10, offset: 10 }} />
                  
                  {/* Confidence Intervals */}
                  <Area type="monotone" dataKey="confRange" stroke="none" fill="#0d9488" fillOpacity={0.15} activeDot={false} />
                  <Area type="monotone" dataKey="corrRange" stroke="none" fill="#6366f1" fillOpacity={0.15} activeDot={false} />
                  
                  <Line type="monotone" dataKey="confidence" name="Nexus Prob" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: '#0d9488' }} />
                  <Line type="monotone" dataKey="correlation" name="Correlation" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-2 border-t border-slate-100 justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm bg-teal-500"></div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase">Nexus Prob</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm bg-purple-500"></div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase">Correlation</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50/80 px-2 py-0.5 rounded uppercase self-start sm:self-auto">SOURCE: J-2 SYNTHESIS MODEL</span>
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-lg">
            <h3 className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              The Null Hypothesis Test
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              To prove a Nexus Point structurally exists, we must model its inversion. 
              <br/><br/>
              <strong>Condition:</strong> If the suspected core legal/financial constraint is removed, do the demographic, housing, and infrastructure vectors organically stabilize within 60 months?
              <br/><br/>
              <span className="text-slate-600">If Yes = True Nexus proven.<br/>If No = Anomalies remain independent.</span>
            </p>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
