import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { PROCUREMENT_CARTEL } from '../data';
import { Briefcase, ShieldAlert, FileWarning } from 'lucide-react';

export const TabProcurementCartel: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          The Procurement Oligopoly
        </h2>
        <p className="text-sm text-slate-600">
          State capture via systemic IT and BPO procurement frameworks. A consolidated tier of 4-6 vendors extract billions in risk-free capital while maintaining failure rates exceeding 30%.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl">
          <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-6">
            Vendor Contract Value (£Bn) vs Failure Rate (%)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROCUREMENT_CARTEL} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="vendor" type="category" stroke="#94a3b8" fontSize={12} width={120} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend />
                <Bar dataKey="value" name="Contract Value (£Bn)" fill="#0284c7" radius={[0, 4, 4, 0]} />
                <Bar dataKey="failRate" name="Failure/Delay Rate (%)" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-sky-50 border border-sky-200 p-6 rounded-lg relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <FileWarning className="w-24 h-24 text-sky-600" />
            </div>
            <h3 className="font-mono text-[10px] text-sky-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              Systemic Risk: Vendor Lock-in
            </h3>
            <ul className="space-y-4 relative z-10 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">♦</span>
                <span><strong>Crown Commercial Service (CCS) loopholes:</strong> Frameworks favor massive bid-teams over technical competence. SMEs are systemically excluded.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">♦</span>
                <span><strong>Sunk Cost Extortion:</strong> Once embedded into NHS or MoD legacy systems, prime contractors negotiate 40-60% margin uplifts on renewals due to the impossibility of extraction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">♦</span>
                <span><strong>Revolving Door:</strong> Civil servants who write the procurement specifications routinely exit into directorships at the winning vendor firms.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
