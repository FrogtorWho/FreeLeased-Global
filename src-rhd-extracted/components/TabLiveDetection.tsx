import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle, Cpu, Eye, ShieldAlert, Target, Crosshair } from 'lucide-react';

const VECTORS = ['FINANCIAL', 'INFRASTRUCTURE', 'CYBER', 'SOCIAL', 'LOGISTICS', 'DOCTRINE'];
const REGIONS = ['LONDON', 'MIDLANDS', 'NORTH', 'SCOTLAND', 'WALES'];

interface Signal {
  id: string;
  timestamp: Date;
  vector: string;
  region: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  message: string;
  doctrineMatch?: string;
  tacticalResponse?: string;
}

const generateSignal = (): Signal => {
  const vector = VECTORS[Math.floor(Math.random() * VECTORS.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const rand = Math.random();
  let severity: Signal['severity'] = 'low';
  if (rand > 0.95) severity = 'critical';
  else if (rand > 0.8) severity = 'high';
  else if (rand > 0.5) severity = 'medium';

  const messages = {
    FINANCIAL: ['Anomalous municipal bond sell-off', 'S114 declaration risk elevated', 'Shadow banking liquidity constraint detected'],
    INFRASTRUCTURE: ['Grid frequency deviation', 'Water network pressure drop', 'Datacenter SLA renegotiation blocked'],
    CYBER: ['Coordinated DDoS on public sector portal', 'BGP hijacking attempt mitigated', 'Ransomware lateral movement pattern matched'],
    SOCIAL: ['Sentiment NLP flags localized unrest', 'Social media velocity spike on "strikes"', 'Public transport boycott trending'],
    LOGISTICS: ['Port throughput down 15%', 'HGV driver shortage peak threshold crossed', 'Cold chain integrity alert'],
    DOCTRINE: ['Sub-threshold hybrid aggression signatures', 'Information space saturation attempt', 'Critical node gray-zone targeting'],
  };
  
  const doctrineMatches = [
    'Gerasimov Doctrine (Non-Linear War)',
    'Multi-Domain Operations (MDO)',
    'Unrestricted Warfare (Qiao Liang / Wang Xiangsui)',
    'Active Measures / Reflexive Control'
  ];
  
  const tacticalResponses = {
    FINANCIAL: 'Audit shadow liquidity exposure; hedge municipal positions.',
    INFRASTRUCTURE: 'Isolate SCADA networks; reroute non-essential load.',
    CYBER: 'Initiate zero-trust strict mode; block known malicious ASNs.',
    SOCIAL: 'Deploy strategic communication counter-narratives; bolster local resilience.',
    LOGISTICS: 'Activate secondary supply routes; requisition strategic reserves.',
    DOCTRINE: 'Elevate defensive posture across all domains; initiate counter-intelligence protocols.'
  };

  const vectorMessages = messages[vector as keyof typeof messages];
  const message = vectorMessages[Math.floor(Math.random() * vectorMessages.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    vector,
    region,
    severity,
    confidence: Math.floor(Math.random() * 40) + 60,
    message,
    doctrineMatch: vector === 'DOCTRINE' ? doctrineMatches[Math.floor(Math.random() * doctrineMatches.length)] : undefined,
    tacticalResponse: tacticalResponses[vector as keyof typeof tacticalResponses],
  };
};

export const TabLiveDetection: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Initial load
    const initial = Array.from({ length: 5 }).map(generateSignal);
    setSignals(initial);

    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setSignals(prev => {
          const newSignal = generateSignal();
          const next = [newSignal, ...prev];
          if (next.length > 20) next.pop(); // keep last 20
          return next;
        });
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [isScanning]);

  const getSeverityColor = (severity: Signal['severity']) => {
    switch (severity) {
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'high': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'medium': return 'text-sky-600 bg-sky-50 border-sky-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Radio className="w-6 h-6 text-teal-600" />
            DYNAMIC THREAT DETECTION
          </h1>
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`px-4 py-2 text-xs font-bold rounded-sm border transition-colors flex items-center gap-2 ${
              isScanning 
                ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-[inset_0_0_10px_rgba(13,148,136,0.1)]' 
                : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            {isScanning ? (
              <><span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> SCANNING ACTIVE</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-slate-400" /> SYSTEM PAUSED</>
            )}
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Real-time SIGINT & OSINT synthesis. Automated triage via multi-vector anomaly detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Algorithmic Confidence
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900">94.2</span>
              <span className="text-sm text-slate-500 mb-1">%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[94.2%]"></div>
            </div>
            <p className="text-[10px] text-slate-500">Model: NEXUS-V4 (Trained on 2010-2025 systemic cascades)</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-teal-600" />
              Vector Saturation
            </h3>
            <div className="space-y-3">
              {VECTORS.map(v => (
                <div key={v} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] uppercase">
                    <span className="text-slate-600">{v}</span>
                    <span className="text-slate-900 font-bold">{Math.floor(Math.random() * 60 + 20)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
            <h2 className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              LIVE INGESTION STREAM
            </h2>
            <div className="text-[10px] text-slate-500 flex gap-4">
              <span>{signals.length} EVENTS BUFFERED</span>
              <span>LATENCY: 12ms</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
            <AnimatePresence>
              {signals.map((sig) => (
                <motion.div
                  key={sig.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`border rounded-sm p-3 text-xs flex flex-col sm:flex-row sm:items-center gap-3 ${getSeverityColor(sig.severity)}`}
                >
                  <div className="flex flex-col shrink-0 sm:w-24 border-r border-current/20 pr-3">
                    <span className="font-bold opacity-80">{sig.timestamp.toLocaleTimeString()}</span>
                    <span className="text-[9px] opacity-60 uppercase">{sig.id}</span>
                  </div>
                  
                  <div className="flex flex-col shrink-0 sm:w-32">
                    <span className="font-bold">{sig.vector}</span>
                    <span className="text-[9px] opacity-80">{sig.region}</span>
                  </div>

                  <div className="flex-1 font-sans font-medium text-[13px] flex flex-col gap-1">
                    <span>{sig.message}</span>
                    {sig.doctrineMatch && (
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm inline-block w-max mt-1 border border-teal-200">
                        PATTERN MATCH: {sig.doctrineMatch}
                      </span>
                    )}
                    {sig.tacticalResponse && (
                      <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> RESP: {sig.tacticalResponse}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-4 border-l border-current/20 pl-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase opacity-70">AI CONF</span>
                      <span className="font-bold">{sig.confidence}%</span>
                    </div>
                    {sig.severity === 'critical' && (
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {signals.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                Awaiting incoming signals...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
