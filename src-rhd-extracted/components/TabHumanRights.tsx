import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Users, Gavel } from 'lucide-react';
import { HUMAN_RIGHTS_APPLICATION } from '../data';

export const TabHumanRights: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-rose-500" />
          Human Rights Implementation & Friction
        </h2>
        <p className="text-sm text-slate-600">
          Evaluates how the jurisdiction applies fundamental human rights (e.g., ECHR via the Human Rights Act). Visualizes the tension between nominal compliance and the systemic friction generated when these rights intersect with constrained state resources (housing, courts, immigration).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-rose-500" />
            Compliance vs Systemic Friction
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={HUMAN_RIGHTS_APPLICATION}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="right" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
                <Radar name="State Compliance" dataKey="compliance" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                <Radar name="Systemic Friction" dataKey="friction" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                <Legend />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {HUMAN_RIGHTS_APPLICATION.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-slate-900">{item.right}</h4>
                <span className="text-[10px] font-mono text-rose-400 border border-rose-900/50 bg-rose-950/30 px-2 py-0.5 rounded">
                  FRICTION: {item.friction}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Primary Domain: <strong className="text-slate-700">{item.domain}</strong></p>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                    <span>Compliance Capability</span>
                    <span>{item.compliance}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${item.compliance}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};
