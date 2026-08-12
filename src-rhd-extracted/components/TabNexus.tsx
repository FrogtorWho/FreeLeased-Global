import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from 'recharts';
import { Network, Users, Wrench, Target, Banknote, Flame } from 'lucide-react';
import { NEXUS_5M_RADAR, NEXUS_5M_DETAILS } from '../data';

export const TabNexus: React.FC = () => {
  const getIcon = (m: string) => {
    switch(m) {
      case 'Architects': return <Users className="w-5 h-5 text-indigo-600" />;
      case 'Methods': return <Wrench className="w-5 h-5 text-sky-600" />;
      case 'Motives': return <Target className="w-5 h-5 text-emerald-600" />;
      case 'Money Flow': return <Banknote className="w-5 h-5 text-orange-500" />;
      case 'Motivation': return <Flame className="w-5 h-5 text-teal-600" />;
      default: return <Network className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
          <Network className="w-6 h-6 text-teal-600" />
          The True Nexus Point: The 5 Ms
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mx-auto">
          Discarding symptom-level distractions, the true systemic singularity is defined by five converging dimensions. To deconstruct the cascading failures across municipal, demographic, and infrastructure vectors, we must map exactly who is designing the collapse, how capital is extracted, and what ideology drives it.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Radar Map */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl flex flex-col justify-center">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Network className="w-4 h-4 text-slate-600" />
            The 5M Convergence Radar
          </h3>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="55%" data={NEXUS_5M_RADAR}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Systemic Weight (0-100)" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono border-t border-slate-100 pt-4 mt-2">
            <p className="text-center sm:text-left text-slate-600 mb-2 sm:mb-0 max-w-xs">
              Systemic gravity heavily weighted towards absolute Money Flow & Architecture design.
            </p>
            <span className="text-slate-400 bg-slate-50/80 px-2 py-1 rounded">SOURCE: J-2 SYNTHESIS // Q3</span>
          </div>
        </div>

        {/* 5M Breakdown List */}
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[500px]">
          {NEXUS_5M_DETAILS.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${item.bgColor} border ${item.borderColor} p-5 rounded-lg`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50/80 border border-slate-100 flex flex-shrink-0 items-center justify-center">
                  {getIcon(item.m)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-lg font-bold text-slate-900">{item.m}</h4>
                    <span className={`text-[10px] uppercase font-mono font-bold ${item.color}`}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-white/40 border border-black/20 text-slate-600 text-[10px] rounded uppercase font-mono tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </motion.div>
  );
};
