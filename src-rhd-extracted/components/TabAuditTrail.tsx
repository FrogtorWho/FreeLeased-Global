import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Fingerprint, Lock, ShieldCheck, Database, FileText, ChevronDown, CheckCircle2, AlertTriangle, Eye, Hash } from 'lucide-react';

const AUDIT_LOGS = [
  {
    id: '0x8f4b...11a2',
    timestamp: '2026-08-08T09:14:22Z',
    intType: 'OSINT',
    source: 'Companies House API (UK)',
    event: 'Ingested corporate structuring data for "Apex Holdings Ltd". Identified 3 subsidiary shell entities.',
    analyst: 'AI-Node (NEXUS-V4)',
    status: 'VERIFIED',
    confidence: 94
  },
  {
    id: '0x3a21...99c4',
    timestamp: '2026-08-08T09:18:41Z',
    intType: 'FININT',
    source: 'SWIFT Anomaly Database (Offshore)',
    event: 'Cross-referenced Apex subsidiaries. Identified high-velocity capital flight to zero-tax jurisdiction.',
    analyst: 'AI-Node (FIN-TRACE-2)',
    status: 'VERIFIED',
    confidence: 88
  },
  {
    id: '0x99e2...bb41',
    timestamp: '2026-08-08T10:05:12Z',
    intType: 'GEOINT',
    source: 'Sentinel-2 Satellite / Land Registry',
    event: 'Mapped properties owned by Apex subsidiaries. 84% show visible structural dilapidation / roof degradation.',
    analyst: 'AI-Node (GEO-SPATIAL)',
    status: 'PENDING_REVIEW',
    confidence: 76
  },
  {
    id: '0x11f4...ee82',
    timestamp: '2026-08-08T11:42:05Z',
    intType: 'HUMINT',
    source: 'Encrypted Drop (Tenant Union Rep)',
    event: 'Received internal property management memo mandating "bare minimum emergency repairs only".',
    analyst: 'Human (S. Peacock)',
    status: 'VERIFIED',
    confidence: 99
  },
  {
    id: '0x77d1...cc22',
    timestamp: '2026-08-08T12:01:33Z',
    intType: 'SYNTHESIS',
    source: 'Multi-INT Fusion Engine',
    event: 'Correlated FININT, OSINT, and GEOINT. Generated hypothesis: Managed Decline & Capital Extraction.',
    analyst: 'AI-Node (NEXUS-V4)',
    status: 'VERIFIED',
    confidence: 92
  }
];

export const TabAuditTrail: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  
  const filteredLogs = filter === 'ALL' ? AUDIT_LOGS : AUDIT_LOGS.filter(log => log.intType === filter || log.intType === 'SYNTHESIS');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-indigo-600" />
          CRYPTOGRAPHIC AUDIT TRAIL & PROVENANCE
        </h1>
        <p className="text-sm text-slate-600">
          Immutable ledger of intelligence ingestion, demonstrating chain of custody, analytical methodology, and verification status for all assertions.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            {['ALL', 'OSINT', 'FININT', 'GEOINT', 'HUMINT'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-xs font-bold rounded-sm border transition-colors ${
                  filter === type 
                    ? 'bg-indigo-600 text-white border-indigo-700' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
            <Lock className="w-3 h-3" /> SECURE LEDGER
          </div>
        </div>

        {/* Ledger View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3 font-bold">Ledger ID (Hash)</th>
                <th className="px-4 py-3 font-bold">Timestamp</th>
                <th className="px-4 py-3 font-bold">INT Vector</th>
                <th className="px-4 py-3 font-bold">Provenance / Source</th>
                <th className="px-4 py-3 font-bold w-full">Event / Artifact</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-[11px] text-slate-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {log.id}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                        log.intType === 'SYNTHESIS' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                        log.intType === 'OSINT' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                        log.intType === 'FININT' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        log.intType === 'GEOINT' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {log.intType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-700">
                      {log.source}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-800 whitespace-normal min-w-[300px]">
                      {log.event}
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {log.analyst}</span>
                        <span className="flex items-center gap-1"><Database className="w-3 h-3" /> CONF: {log.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {log.status === 'VERIFIED' ? (
                        <span className="flex items-center gap-1 text-teal-600 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-[10px] font-bold uppercase">
                          <AlertTriangle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
