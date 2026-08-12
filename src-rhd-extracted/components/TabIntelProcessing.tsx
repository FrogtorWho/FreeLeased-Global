import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Terminal, Crosshair, Radar, Wifi, Radio } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, Cell, ReferenceArea } from 'recharts';

const RAW_SIGNALS = [
  { time: '0400Z', source: 'SIGINT-UK', type: 'Financial Anomaly', severity: 95, detail: 'LDI Pension margin call pattern detected', lat: 51.5, lng: -0.1 },
  { time: '0612Z', source: 'OSINT-MUN', type: 'S.114 Proxy', severity: 88, detail: 'Emergency budget session logged in 4 Tier-1 Councils', lat: 52.4, lng: -1.9 },
  { time: '0845Z', source: 'CYBER-COM', type: 'Grid Strain', severity: 92, detail: 'M4 Corridor substation load > 98% nominal', lat: 51.4, lng: -0.9 },
  { time: '1120Z', source: 'HUMINT', type: 'Procurement Cartel', severity: 75, detail: 'Unpublished G-Cloud single-source award to Prime B', lat: 51.5, lng: -0.1 },
];

const generateClusters = () => {
  const clusters = [
    { cx: 25, cy: 75, rx: 15, ry: 15, baseRisk: 85, label: 'Financial' },
    { cx: 75, cy: 80, rx: 15, ry: 15, baseRisk: 60, label: 'Procurement' },
    { cx: 50, cy: 30, rx: 20, ry: 15, baseRisk: 30, label: 'Grid' },
  ];
  
  const nodes: any[] = [];
  clusters.forEach((cluster, cIdx) => {
    for (let i = 0; i < 15; i++) {
      nodes.push({
        id: `N-${cIdx}-${i}`,
        x: cluster.cx + (Math.random() - 0.5) * cluster.rx * 2,
        y: cluster.cy + (Math.random() - 0.5) * cluster.ry * 2,
        z: Math.random() * 400 + 100,
        risk: Math.min(100, Math.max(0, cluster.baseRisk + (Math.random() - 0.5) * 30)),
        cluster: cluster.label
      });
    }
  });
  return nodes;
};

const NODE_DATA = generateClusters();

export const TabIntelProcessing: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Terminal Window */}
        <div className="lg:col-span-3 bg-white border border-teal-100 p-1 relative overflow-hidden rounded-sm shadow-[0_0_15px_rgba(13,148,136,0.15)]">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(13,148,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          <div className="bg-slate-50 p-4 h-[400px] flex flex-col relative z-10 border border-slate-200">
            <div className="flex justify-between items-center mb-4 border-b border-teal-100 pb-2">
              <h2 className="text-teal-600 text-xs font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                SIGINT / OSINT FUSION ENGINE
              </h2>
              <span className="text-[10px] text-green-500 animate-pulse">● ACTIVE INGEST</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 text-[11px] text-green-400/80">
              {RAW_SIGNALS.map((sig, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-l-2 border-slate-200 pl-2 py-1 hover:bg-teal-50 hover:border-teal-500 transition-colors cursor-crosshair">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-slate-500 min-w-[40px]">{sig.time}</span>
                    <span className="text-sky-700 min-w-[80px]">[{sig.source}]</span>
                  </div>
                  <span className={`min-w-[100px] ${sig.severity > 90 ? 'text-teal-700 font-bold' : 'text-yellow-400'}`}>{sig.type}</span>
                  <span className="text-slate-600 flex-1 whitespace-normal sm:truncate">{sig.detail}</span>
                  <span className="text-slate-400 hidden sm:inline-block">[{sig.lat},{sig.lng}]</span>
                </div>
              ))}
              <div className="animate-pulse text-slate-500 mt-4 pl-2">_ Awaiting signal...</div>
            </div>
          </div>
        </div>

        {/* Threat Level */}
        <div className="bg-white border border-teal-100 p-4 rounded-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-50/50 pointer-events-none"></div>
          <Radar className="w-16 h-16 text-teal-600/30 absolute" />
          <h3 className="text-xs text-teal-600 font-bold mb-4 relative z-10 text-center tracking-widest">DEFCON EQUIVALENT</h3>
          <div className="text-6xl font-black text-teal-600 relative z-10 shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
            2
          </div>
          <p className="text-[9px] text-slate-500 text-center mt-4 uppercase relative z-10">Systemic Convergence Imminent</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Map */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm relative flex flex-col">
          <div className="mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-600" />
              Node Constellation (Vulnerability Matrix)
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              Topological distribution of threat vectors
            </p>
          </div>
          <div className="flex-1 h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="1 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickCount={11} tickMargin={10} />
                <YAxis type="number" dataKey="y" domain={[0, 100]} stroke="#94a3b8" fontSize={10} width={30} tickCount={11} />
                <ZAxis type="number" dataKey="z" range={[20, 200]} />
                
                {/* Cluster Zones */}
                <ReferenceArea x1={10} x2={40} y1={60} y2={90} fill="#0d9488" fillOpacity={0.05} stroke="#0d9488" strokeOpacity={0.2} strokeDasharray="3 3" />
                <ReferenceArea x1={60} x2={90} y1={65} y2={95} fill="#d97706" fillOpacity={0.05} stroke="#d97706" strokeOpacity={0.2} strokeDasharray="3 3" />
                <ReferenceArea x1={30} x2={70} y1={15} y2={45} fill="#0284c7" fillOpacity={0.05} stroke="#0284c7" strokeOpacity={0.2} strokeDasharray="3 3" />

                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #3f3f46', fontSize: '12px' }} 
                  formatter={(value: number, name: string, props: any) => {
                    if (name === 'x' || name === 'y') return [];
                    const risk = props.payload.risk;
                    const cluster = props.payload.cluster;
                    return [`Risk: ${risk.toFixed(1)} | ${cluster}`, 'Node'];
                  }}
                  labelFormatter={() => ''}
                />
                <Scatter data={NODE_DATA} shape="cross">
                  {NODE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.risk > 80 ? '#0d9488' : entry.risk > 50 ? '#d97706' : '#0284c7'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[9px] font-mono border-t border-slate-100 pt-3">
            <div className="flex gap-3 mb-2 sm:mb-0">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Monitored</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-sm"></span> Elevated</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-500 rounded-sm"></span> Critical</span>
            </div>
            <span className="text-slate-400 mt-2 sm:mt-0">SOURCE: CYBER-COM / SIGINT</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Crosshair className="w-3 h-3 text-teal-600" />
            Targeting & Interdiction
          </h3>
          <div className="space-y-2">
             <button className="w-full bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs py-2 uppercase tracking-widest flex items-center justify-between px-4 transition-colors">
                <span>Deploy Audit Probe (Financial)</span>
                <Wifi className="w-3 h-3" />
             </button>
             <button className="w-full bg-sky-50 hover:bg-blue-900/50 border border-sky-200 text-sky-700 text-xs py-2 uppercase tracking-widest flex items-center justify-between px-4 transition-colors">
                <span>Isolate Vendor Cartel Node</span>
                <Wifi className="w-3 h-3" />
             </button>
             <button className="w-full bg-slate-100/50 hover:bg-slate-100/80 border border-slate-200 text-slate-600 text-xs py-2 uppercase tracking-widest flex items-center justify-between px-4 transition-colors">
                <span>Run Null Hypothesis Sim</span>
                <Wifi className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
