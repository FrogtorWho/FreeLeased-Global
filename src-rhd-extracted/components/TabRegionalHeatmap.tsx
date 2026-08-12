import React from 'react';
import { motion } from 'framer-motion';
import { Map, AlertTriangle } from 'lucide-react';
import { REGIONAL_RISK_DATA } from '../data';

const getSeverityColor = (score: number) => {
  if (score >= 90) return 'bg-teal-500';
  if (score >= 75) return 'bg-orange-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-emerald-500';
};

const getSeverityText = (score: number) => {
  if (score >= 90) return 'text-teal-600';
  if (score >= 75) return 'text-orange-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-emerald-600';
};

export const TabRegionalHeatmap: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xl mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Map className="w-5 h-5 text-indigo-500" />
          Regional Vulnerability Matrix
        </h2>
        <p className="text-sm text-slate-600">
          Geospatial concentration of systemic load across the UK. London and the South East show critical infrastructure ceilings, while the Midlands and North face acute municipal insolvency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...REGIONAL_RISK_DATA].sort((a, b) => b.overall - a.overall).map((region, idx) => (
          <div key={region.region} className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative">
            
            {region.overall >= 85 && (
              <div className="absolute top-0 right-0 m-4">
                <AlertTriangle className="w-5 h-5 text-teal-600 animate-pulse" />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{region.region}</h3>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
                Systemic Load: <span className={`font-bold ${getSeverityText(region.overall)}`}>{region.overall}%</span>
              </p>

              <div className="space-y-4">
                {/* Housing */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">Housing Stress</span>
                    <span className="text-slate-900">{region.housingStress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityColor(region.housingStress)}`} 
                      style={{ width: `${region.housingStress}%` }}
                    />
                  </div>
                </div>

                {/* Water */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">Water Deficit</span>
                    <span className="text-slate-900">{region.waterStress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityColor(region.waterStress)}`} 
                      style={{ width: `${region.waterStress}%` }}
                    />
                  </div>
                </div>

                {/* Insolvency */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">s.114 Risk</span>
                    <span className="text-slate-900">{region.insolvencyRisk}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityColor(region.insolvencyRisk)}`} 
                      style={{ width: `${region.insolvencyRisk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`h-1 w-full ${getSeverityColor(region.overall)}`} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
