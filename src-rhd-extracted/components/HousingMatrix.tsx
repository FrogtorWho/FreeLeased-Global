import React, { useState } from 'react';
import { HOUSING_DATA, DEMOGRAPHICS } from '../constants';
import { ArrowUpRight, Minus, AlertTriangle, CheckCircle2, ChevronRight, MapPin, ShieldAlert, Sparkles, Building, Flame } from 'lucide-react';
import { Demographic } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LocalRegion {
  id: string;
  name: string;
  keys: string[];
  authority: string;
  tribunal: string;
  score: 'CRITICAL' | 'HIGH RISK' | 'ELEVATED' | 'STABLE';
  scoreNum: number;
}

const REGIONS: LocalRegion[] = [
  { id: 'all', name: 'National Baseline', keys: ['National'], authority: 'Ministry of Housing (DLUHC)', tribunal: 'Residential Property Tribunal Chambers', score: 'ELEVATED', scoreNum: 65 },
  { id: 'london', name: 'Greater London', keys: ['London'], authority: 'Greater London Authority (GLA) Rogue Landlord Unit', tribunal: 'First-Tier Tribunal (London Region), Alfred Place', score: 'CRITICAL', scoreNum: 96 },
  { id: 'north', name: 'The North (Mcr / Leeds)', keys: ['Manchester', 'Leeds'], authority: 'GMCA & Leeds Council Private Housing Standards', tribunal: 'First-Tier Tribunal (Northern Region), Piccadilly', score: 'HIGH RISK', scoreNum: 84 },
  { id: 'midlands', name: 'Midlands (Birmingham)', keys: ['Birmingham'], authority: 'Birmingham Tenancy Relations Unit', tribunal: 'First-Tier Tribunal (Midlands Region), Temple Row', score: 'HIGH RISK', scoreNum: 78 },
  { id: 'southeast', name: 'South East', keys: ['South East'], authority: 'County Council Private Housing Teams', tribunal: 'First-Tier Tribunal (Southern Region), Chichester', score: 'ELEVATED', scoreNum: 71 },
  { id: 'wales', name: 'Wales (Cardiff / West)', keys: ['Wales', 'Cardiff'], authority: 'Rent Smart Wales / Llywodraeth Cymru', tribunal: 'Residential Property Tribunal Wales, Callaghan Square', score: 'HIGH RISK', scoreNum: 86 },
];

export const HousingMatrix: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'beneficiary' | 'victim'>('all');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  const getDemographicBadge = (code: string) => {
    const dem = DEMOGRAPHICS.find(d => d.code === code);
    if (!dem) return null;
    
    const isBeneficiary = dem.type === 'beneficiary';
    const isVictim = dem.type === 'victim';
    
    const dimmed = (filter === 'beneficiary' && !isBeneficiary) || (filter === 'victim' && !isVictim);

    return (
      <div 
        key={code} 
        className={`inline-flex items-center justify-center w-8 h-8 mr-1 mb-1 rounded border text-[11px] font-bold cursor-help transition-all duration-300
          ${dimmed ? 'opacity-15 grayscale border-slate-200 bg-slate-50/80 text-slate-400' : 'scale-100'}
          ${isBeneficiary ? 'bg-green-950/30 border-green-800 text-green-400 font-mono ring-1 ring-green-900/40' : ''}
          ${isVictim ? 'bg-teal-50 border-red-800 text-teal-700 font-mono ring-1 ring-red-900/40' : ''}
          ${dem.type === 'mixed' ? 'bg-amber-950/30 border-amber-800 text-amber-700 font-mono ring-1 ring-amber-900/40' : ''}
        `}
        title={dem.label}
        id={`badge_${code}`}
      >
        {code}
      </div>
    );
  };

  // Check if a card has active trend acceleration in the selected region
  const checkRegionTrendAccelerating = (trends: Record<string, 'up' | 'down' | 'stable'>) => {
    if (selectedRegion.id === 'all') return false;
    return selectedRegion.keys.some(k => trends[k] === 'up');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Regional HUB Dashboard Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 border border-border bg-surface rounded-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 border border-accent/20 rounded text-accent">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Jurisdictional Risk Radar</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mt-0.5">
                Housing enforcement and First-Tier leasehold tribunal procedures vary dramatically across boundaries. Select a region:
              </p>
            </div>
          </div>

          {/* Region selector pills */}
          <div className="flex flex-wrap gap-1.5 bg-void p-1 rounded-md border border-border/60">
            {REGIONS.map(reg => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all duration-200
                  ${selectedRegionId === reg.id 
                    ? 'bg-zinc-100 text-black font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                  }
                `}
                id={`reg_btn_${reg.id}`}
              >
                {reg.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Regional Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-6 border-t border-dashed border-border/80">
          
          {/* Exposure Meter (4 cols) */}
          <div className="md:col-span-4 bg-void/50 p-4 rounded border border-border flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase">LOCAL SEVERITY COEFFICIENT</span>
            <div className="flex items-baseline gap-3 my-1">
              <span className="text-3xl font-black font-mono text-white tracking-tighter">
                {selectedRegion.scoreNum}/100
              </span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold
                ${selectedRegion.score === 'CRITICAL' ? 'border-accent bg-accent/10 text-accent animate-pulse' : ''}
                ${selectedRegion.score === 'HIGH RISK' ? 'border-amber-700 bg-amber-900/10 text-amber-600' : ''}
                ${selectedRegion.score === 'ELEVATED' ? 'border-zinc-700 bg-slate-100/20 text-slate-600' : ''}
              `}>
                {selectedRegion.score}
              </span>
            </div>
            {/* Minimal Bar chart representation */}
            <div className="w-full bg-white h-1 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full ${selectedRegion.score === 'CRITICAL' ? 'bg-accent' : 'bg-amber-500'}`} 
                style={{ width: `${selectedRegion.scoreNum}%` }}
              />
            </div>
          </div>

          {/* Local Authority (4 cols) */}
          <div className="md:col-span-4 bg-void/50 p-4 rounded border border-border flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-500" />
              STATUTORY ENFORCEMENT POWER
            </span>
            <div className="my-2">
              <p className="text-sm font-bold text-slate-800 line-clamp-1">{selectedRegion.authority}</p>
              <p className="text-[10px] text-slate-600 leading-tight mt-1 font-mono">
                Submit complaints for Rogue Landlord Listing / Housing Standard Breaches.
              </p>
            </div>
          </div>

          {/* Legal Escalation (4 cols) */}
          <div className="md:col-span-4 bg-void/50 p-4 rounded border border-border flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-accent" />
              ESCAlATION PREFERRED CHAMBER
            </span>
            <div className="my-2">
              <p className="text-sm font-bold text-slate-800 line-clamp-1">{selectedRegion.tribunal.split(',')[0]}</p>
              <p className="text-[10px] text-slate-500 font-mono leading-none truncate mt-1">
                {selectedRegion.tribunal.split(',')[1] || 'Address specified'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Demographic Overview Filter Buttons */}
      <div className="flex gap-4 p-4 bg-surface/50 border border-border rounded-lg justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 hidden md:block">PERSPECTIVE FILTER:</span>
          <div className="flex gap-1.5 bg-void p-1 rounded border border-slate-200">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors rounded ${filter === 'all' ? 'bg-zinc-150 text-black bg-white' : 'text-slate-500 hover:text-slate-900'}`}
              id="filter_all"
            >
              Systemic Baseline
            </button>
            <button 
              onClick={() => setFilter('beneficiary')}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors rounded ${filter === 'beneficiary' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-green-500'}`}
              id="filter_beneficiary"
            >
              Aggressors / Gainers
            </button>
            <button 
              onClick={() => setFilter('victim')}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors rounded ${filter === 'victim' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-teal-600'}`}
              id="filter_victim"
            >
              Exposed Victims
            </button>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {HOUSING_DATA.length} Systems Analyzed
        </span>
      </div>

      {/* 3. Demographic Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-[10px] font-mono text-slate-500 bg-void/50 p-4 border border-border rounded">
        {DEMOGRAPHICS.map(d => (
          <div key={d.code} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full 
              ${d.type === 'beneficiary' ? 'bg-green-500' : d.type === 'victim' ? 'bg-accent' : 'bg-amber-500'}
            `}></span>
            <span><strong className="text-slate-700 font-mono">{d.code}</strong>: {d.label.split('/')[0]}</span>
          </div>
        ))}
      </div>

      {/* 4. Matrix Cards */}
      <div className="space-y-4">
        {HOUSING_DATA.map((item) => {
          const isAcceleratingInSelectedRegion = checkRegionTrendAccelerating(item.trends);
          
          return (
            <motion.div 
              key={item.id} 
              layout
              transition={{ duration: 0.2 }}
              className={`border transition-all duration-300 p-6 rounded-lg relative overflow-hidden backdrop-blur-sm
                ${isAcceleratingInSelectedRegion 
                  ? 'border-accent/80 bg-accent/[0.03] shadow-[0_0_15px_rgba(239,68,68,0.05)]' 
                  : 'border-border bg-surface/50 hover:bg-surface hover:border-zinc-700'
                }
              `}
              id={`card_${item.id}`}
            >
              {/* Highlight ribbon for regional critical velocity */}
              {isAcceleratingInSelectedRegion && (
                <div className="absolute top-0 right-0 bg-accent text-white font-mono text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-bl font-semibold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" />
                  Velocity Surge in {selectedRegion.name.split(' ')[0]}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left: Description */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{item.point}</h3>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border tracking-widest uppercase font-semibold
                        ${item.scale === 'High' ? 'border-red-950 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600'}
                      `}>
                        {item.scale} Exposure
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 font-sans">{item.exploit}</p>
                  </div>

                  {/* Active Mitigation path */}
                  <div className="bg-void/80 p-3 rounded border border-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">PREVAILING MITIGATION VECTOR</span>
                      <p className="text-xs text-slate-700 leading-normal mt-0.5">{item.mitigation}</p>
                    </div>
                  </div>
                </div>

                {/* Middle: Associated Entities */}
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-550 bg-green-500" />
                      Rentiers / Beneficiary Classes
                    </p>
                    <div className="flex flex-wrap pr-4">
                      {item.beneficiaries.map(code => getDemographicBadge(code))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Target classes / Exposed Group
                    </p>
                    <div className="flex flex-wrap pr-4">
                      {item.exposed.map(code => getDemographicBadge(code))}
                    </div>
                  </div>
                </div>

                {/* Right: Regional Trends table */}
                <div className="w-full md:w-1/4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3">Systemic Trend Grid</p>
                    <div className="space-y-1.5">
                      {Object.entries(item.trends).map(([regionName, trendValue]) => {
                        const isCurrentActiveKey = selectedRegion.keys.includes(regionName) || (selectedRegion.id === 'all' && regionName === 'National');
                        return (
                          <div 
                            key={regionName} 
                            className={`flex justify-between items-center text-[10px] font-mono p-1 rounded transition-colors
                              ${isCurrentActiveKey ? 'bg-white border border-slate-200' : 'text-slate-600'}
                            `}
                          >
                            <span className={isCurrentActiveKey ? 'text-slate-800 font-bold' : ''}>
                              {regionName}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              <span className={`text-[9px] uppercase font-mono font-bold
                                ${trendValue === 'up' ? 'text-accent' : 'text-slate-500'}
                              `}>
                                {trendValue === 'up' ? 'ACCEL' : 'STABLE'}
                              </span>
                              {trendValue === 'up' ? (
                                <ArrowUpRight className="w-3 h-3 text-accent" />
                              ) : (
                                <Minus className="w-3 h-3 text-zinc-650 text-slate-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
