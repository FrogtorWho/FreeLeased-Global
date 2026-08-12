import React, { useState } from 'react';
import { RIGHTS_DATA } from '../constants';
import { ShieldAlert, Scale, Gavel, Eye, HelpCircle, ArrowRight, ShieldCheck, FileWarning, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IdentityProfile {
  id: string;
  label: string;
  matches: string[];
  gapTitle: string;
  gapText: string;
  severity: 'Critical' | 'Severe' | 'Elevated' | 'Baseline';
  colorClass: string;
}

const IDENTITIES: IdentityProfile[] = [
  {
    id: 'all',
    label: 'Full Spectrum Analysis',
    matches: [],
    gapTitle: 'National Baseline Statutory Gap',
    gapText: 'UK statutory frameworks prioritize parliamentary supremacy, allowing secondary legislation and secret judicial processes to consistently override ECHR articles.',
    severity: 'Baseline',
    colorClass: 'border-slate-200 text-slate-600 bg-void/50'
  },
  {
    id: 'leaseholder',
    label: 'Leaseholders & Homeowners',
    matches: ['Leaseholders', 'Shared Owners'],
    gapTitle: 'Article 1 Protocol 1 Property Protection Gap',
    gapText: 'Critical Exposure. Historic English leasehold tenure strips ownership of absolute land rights, subordinating home security to freeholder possession & administrative charges.',
    severity: 'Critical',
    colorClass: 'border-accent bg-accent/10 text-accent'
  },
  {
    id: 'migrant',
    label: 'Asylum Seekers & Detainees',
    matches: ['Asylum Seekers', 'Detainees', 'Migrants', 'Refugees'],
    gapTitle: 'Articles 3 & 5 Human Liberty Gap',
    gapText: 'Critical Exposure. Closed Material Procedures combined with diplomatic assurance treaties allow indefinite detention and deportation without hearing vital evidence.',
    severity: 'Critical',
    colorClass: 'border-accent bg-accent/10 text-accent animate-pulse'
  },
  {
    id: 'activist',
    label: 'Journalists & Activists',
    matches: ['Journalists', 'Activists', 'Public', 'Civil Society'],
    gapTitle: 'Article 8 Privacy & Speech Gap',
    gapText: 'Severe Exposure. Bulk interception protocols legalized in the Investigatory Powers Acts exclude journalists and investigative groups from core secrecy protections.',
    severity: 'Severe',
    colorClass: 'border-amber-700 bg-amber-50 text-amber-600'
  },
  {
    id: 'defendant',
    label: 'Minority & Legal Defendants',
    matches: ['Defendants', 'Minority Communities'],
    gapTitle: 'Article 6 Fair Trial Gap',
    gapText: 'Elevated Exposure. Public Interest Immunity (PII) certificates allow the crown to redact evidence crucial to compiling defenses, relying heavily on proxy special advocates.',
    severity: 'Severe',
    colorClass: 'border-orange-850 bg-amber-950/10 text-orange-400'
  }
];

export const RightsGrid: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('all');

  const selectedIdentity = IDENTITIES.find(i => i.id === selectedIdentityId) || IDENTITIES[0];

  // Logic to determine if a loophole is highly relevant to the selected identity
  const isLoopholeCriticalForIdentity = (lExposed: string[]) => {
    if (selectedIdentity.id === 'all') return false;
    return selectedIdentity.matches.some(m => 
      lExposed.some(le => le.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(le.toLowerCase()))
    );
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Dynamic Profile Selection Bar */}
      <div className="p-6 border border-border bg-surface rounded-lg relative overflow-hidden">
        <h3 className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Gavel className="w-4 h-4 text-accent" />
          ESTABLISH DIAGNOSTIC EXPOSURE PERSPECTIVE
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mb-6">
          Systemic legal gaps target specific social compartments. Choose a demographic profile below to calculate the protective gap and reveal the statutory overrides that affect them directly.
        </p>

        {/* Buttons to switch identities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {IDENTITIES.map((idProfile) => (
            <button
              key={idProfile.id}
              onClick={() => {
                setSelectedIdentityId(idProfile.id);
                setActiveId(null); // Reset active accordion card to avoid confusion
              }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all duration-300
                ${selectedIdentityId === idProfile.id 
                  ? 'bg-zinc-100 border-zinc-100 text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'bg-void border-slate-200 text-slate-500 hover:border-zinc-600 hover:text-slate-800'
                }
              `}
              id={`identity_btn_${idProfile.id}`}
            >
              {idProfile.label}
            </button>
          ))}
        </div>

        {/* Dynamic Warning Alert Card for selected identity */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedIdentityId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`p-4 border rounded flex flex-col md:flex-row gap-4 items-start md:items-center
              ${selectedIdentity.id === 'all' ? 'bg-void/50 border-border text-slate-600' : 'bg-teal-50/50 border-accent/30 text-slate-700'}
            `}
          >
            {selectedIdentity.id === 'all' ? (
              <ShieldCheck className="w-6 h-6 text-slate-500 mt-1 md:mt-0 flex-shrink-0" />
            ) : (
              <FileWarning className="w-6 h-6 text-accent mt-1 md:mt-0 flex-shrink-0 animate-bounce" />
            )}
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-mono uppercase font-bold text-white">
                  {selectedIdentity.gapTitle}
                </p>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border
                  ${selectedIdentity.severity === 'Critical' ? 'border-accent bg-accent/20 text-accent' : ''}
                  ${selectedIdentity.severity === 'Severe' ? 'border-amber-700 bg-amber-955 bg-amber-900/20 text-amber-600' : ''}
                  ${selectedIdentity.severity === 'Baseline' ? 'border-slate-200 text-slate-500' : ''}
                `}>
                  {selectedIdentity.severity} GAP OVERLAY
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-normal font-sans">
                {selectedIdentity.gapText}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid of Loopholes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RIGHTS_DATA.map((right) => {
          const isActive = activeId === right.id;
          const isCritical = isLoopholeCriticalForIdentity(right.exposed);
          
          return (
            <motion.div 
              layout
              key={right.id}
              onClick={() => setActiveId(isActive ? null : right.id)}
              className={`group relative p-6 border transition-all duration-300 cursor-pointer overflow-hidden rounded-lg flex flex-col justify-between
                ${isActive 
                  ? 'border-accent bg-void shadow-[0_0_20px_rgba(239,68,68,0.06)]' 
                  : isCritical
                    ? 'border-accent/40 bg-accent/[0.02] shadow-[0_0_10px_rgba(239,68,68,0.03)]'
                    : 'border-border bg-surface/50 hover:bg-surface hover:border-zinc-700'
                }
              `}
              id={`right_card_${right.id}`}
            >
              <div>
                {/* Loophole critical state badge overlay */}
                {isCritical && (
                  <div className="absolute top-0 right-0 bg-accent/90 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-bl uppercase animate-pulse">
                    HIGH TARGET EXPOSURE
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {right.article}
                  </span>
                  {isActive ? (
                    <ShieldAlert className="text-accent w-4.5 h-4.5" />
                  ) : isCritical ? (
                    <ShieldAlert className="text-accent/60 w-4.5 h-4.5 animate-pulse" />
                  ) : (
                    <Scale className="text-slate-400 w-4.5 h-4.5 group-hover:text-zinc-450 group-hover:text-slate-700 transition-colors" />
                  )}
                </div>

                <h3 className="text-lg font-bold mb-3 text-slate-900">{right.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-accent uppercase tracking-wider block mb-1">UK STATUTORY EXCEPTION / LOOPHOLE</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{right.exception}</p>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 pt-4 border-t border-dashed border-border/70 mt-4 overflow-hidden"
                      >
                        <div>
                          <span className="text-[9px] font-mono text-zinc-550 text-slate-500 uppercase tracking-wider block mb-1">PRACTICAL CONSEQUENTIAL EFFECT</span>
                          <p className="text-xs text-slate-600 font-sans leading-relaxed">{right.effect}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="bg-slate-50 p-3 rounded border border-green-950 text-green-400">
                            <span className="text-[8px] font-mono uppercase tracking-widest block mb-1">INSULATED ENFORCERS</span>
                            <ul className="text-[10px] list-disc list-inside space-y-0.5 font-mono">
                              {right.beneficiaries.map(b => (
                                <li key={b} className="line-clamp-1">{b}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-slate-50 p-3 rounded border border-red-950 text-accent">
                            <span className="text-[8px] font-mono uppercase tracking-widest block mb-1">EXPOSED DEMOGRAPHICS</span>
                            <ul className="text-[10px] list-disc list-inside space-y-0.5 font-mono">
                              {right.exposed.map(e => (
                                <li key={e} className="line-clamp-1">{e}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">ESCAlATION & MITIGATION</span>
                          <p className="text-xs text-zinc-250 font-sans font-medium text-slate-900">{right.mitigation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!isActive && (
                <div className="mt-4 pt-3 border-t border-slate-200 border-dashed flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase">
                  <span>ANALYSIS STATUS: LOCKED</span>
                  <span className="text-zinc-650 group-hover:text-slate-900 transition-colors flex items-center gap-1">
                    ANALYZE LOOPHOLE
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
