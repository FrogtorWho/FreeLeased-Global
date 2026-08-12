import React, { ReactNode, useState } from 'react';
import { LIVE_THREAT_TICKER } from '../data';
import { Activity, Database, Network, Scale, Menu, X, Search, Download, Shield } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ExportDossierModal } from './ExportDossierModal';
import { TooltipHint } from './TooltipHint';

interface Props {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const groupedTabs = [
    {
      title: "Tactical & Simulation",
      icon: <Activity className="w-4 h-4" />,
      tabs: [
        { id: 'live_detection', label: 'Live SIGINT Feed' },
        { id: 'war_gaming', label: 'War-Gaming Sandbox' },
        { id: 'military_doctrine', label: 'Doctrine Translation' },
      ]
    },
    {
      title: "Intelligence Integration",
      icon: <Network className="w-4 h-4" />,
      tabs: [
        { id: 'multi_int_fusion', label: 'Multi-INT Fusion' },
        { id: 'audit_trail', label: 'Provenance Ledger' },
        { id: 'research_brief', label: 'Impartial Research Brief' },
      ]
    },
    {
      title: "Executive Summary",
      icon: <Activity className="w-4 h-4" />,
      tabs: [
        { id: 'command_center', label: 'Command Center' },
      ]
    },
    {
      title: "Methodology & Framework",
      icon: <Activity className="w-4 h-4" />,
      tabs: [
        { id: 'global_framework', label: 'Audit Framework' },
        { id: 'nexus_storyboard', label: 'Forensic Storyboard' },
      ]
    },
    {
      title: "Structural Vectors",
      icon: <Database className="w-4 h-4" />,
      tabs: [
        { id: 'demographics', label: 'Demographics & Housing' },
        { id: 'municipal_cascade', label: 'Municipal Cascade' },
        { id: 'infrastructure', label: 'Municipal & Utilities' },
        { id: 'grid_energy', label: 'Grid & Energy' },
      ]
    },
    {
      title: "Capital & Capture",
      icon: <Network className="w-4 h-4" />,
      tabs: [
        { id: 'procurement_cartel', label: 'Procurement Cartel' },
        { id: 'sovereign_capital', label: 'Sovereign Capital' },
        { id: 'shadow_state', label: 'Shadow State' },
        { id: 'global_transit', label: 'Corporate Capture' },
      ]
    },
    {
      title: "Jurisdiction & Overlays",
      icon: <Scale className="w-4 h-4" />,
      tabs: [
        { id: 'jurisdiction_legal', label: 'Legal Frameworks' },
        { id: 'human_rights', label: 'Human Rights' },
        { id: 'modern_slavery', label: 'Structural Coercion' },
      ]
    },
    {
      title: "Synthesis & Simulation",
      icon: <Activity className="w-4 h-4" />,
      tabs: [
        { id: 'intel_processing', label: 'Signal Fusion Engine' },
        { id: 'nexus', label: 'Systemic Nexus' },
        { id: 'regional_heatmap', label: 'Regional Heatmap' },
        { id: 'predictive_risk', label: 'Predictive Risk & Algorithms' },
        { id: 'war_room', label: 'Policy War Room' },
        { id: 'future_research', label: 'Roadmap & Knowledge Base' },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-700 selection:bg-teal-200 selection:text-teal-900 font-sans antialiased relative">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 45s linear infinite;
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 1);
          border-left: 1px solid rgba(39, 39, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.9);
        }
      `}</style>
      
      {/* Tactical CRT Overlay */}
      <div className="print:hidden pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
      <div className="print:hidden pointer-events-none fixed inset-0 z-50 animate-scanline h-[20vh] bg-gradient-to-b from-transparent via-red-900/10 to-transparent opacity-30"></div>

      {/* Global Search & Export Dossier Modals */}
      <GlobalSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />
      <ExportDossierModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeTab={activeTab}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white/80 z-[55] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`print:hidden fixed lg:static inset-y-0 left-0 z-[60] w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 h-screen transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.8)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Branding Sticky Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-100 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Activity className="w-24 h-24 text-teal-600" />
          </div>
          <button 
            className="lg:hidden absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-sm z-20 text-slate-600 hover:text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-sm bg-white border border-teal-200 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.8)]" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-teal-600/80 block leading-none mb-1">
                J-2 INTEL PROCESSING
              </span>
              <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-slate-900 leading-none">
                SYSTEMIC FRAGILITY
              </h1>
            </div>
          </div>
          <div className="bg-teal-50 border border-teal-200 p-2 rounded-sm text-center relative z-10">
            <p className="font-sans text-[9px] text-teal-700 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping absolute left-2"></span>
              <TooltipHint term="TS // NOFORN // FVEY" hint="Top Secret // No Foreign Dissemination // Five Eyes Alliance Intelligence Access Level." category="SECURITY" />
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] bg-opacity-10">
          {groupedTabs.map((group, idx) => (
            <div key={idx} className="relative">
              <h3 className="flex items-center gap-2 font-sans text-[9px] text-slate-500 uppercase tracking-widest mb-2 px-2 border-b border-slate-100 pb-1">
                <span className="text-teal-600/70">{group.icon}</span> {group.title}
              </h3>
              <div className="space-y-0.5 border-l border-slate-100 ml-3 pl-2">
                {group.tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }} 
                    className={`w-full text-left px-3 py-1.5 rounded-sm text-[11px] font-sans transition-all border border-transparent ${
                      activeTab === tab.id 
                        ? 'bg-teal-50 text-teal-900 border-teal-200 shadow-[inset_2px_0_0_rgba(13,148,136,1)] font-semibold' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 hover:border-slate-200'
                    }`}
                  >
                    {activeTab === tab.id && <span className="mr-2 text-teal-600 opacity-80">▶</span>}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative lg:w-[calc(100%-16rem)] print:h-auto print:overflow-visible print:w-full print:block">
        {/* Decorative Corner Markers */}
        <div className="print:hidden absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-300/50 pointer-events-none z-10 m-2 hidden lg:block"></div>
        <div className="print:hidden absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-300/50 pointer-events-none z-10 m-2 hidden lg:block"></div>
        
        {/* Top Global Utility Header */}
        <div className="print:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 transition-all shadow-xs group"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-sans">Search Dossier & Entities...</span>
              <kbd className="hidden sm:inline-block font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded ml-2">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>J-2 LIVE FUSION</span>
            </div>

            {/* Export Dossier Modal Trigger */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-indigo-500 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Live Threat Ticker (Sticky Top) */}
        <div className="print:hidden bg-white/90 border-b border-teal-100 flex overflow-hidden whitespace-nowrap py-1.5 shrink-0 relative z-20 backdrop-blur-sm">
          <div className="flex animate-ticker w-max">
            {[...LIVE_THREAT_TICKER, ...LIVE_THREAT_TICKER, ...LIVE_THREAT_TICKER].map((text, i) => (
              <span key={i} className="text-[10px] font-sans text-teal-700/80 mx-8 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-sm mr-2 opacity-70"></span> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-20 print:overflow-visible print:h-auto">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 min-h-full flex flex-col print:p-0 print:max-w-none print:m-0">
            
            <div className="flex-1 relative">
              {children}
            </div>

            <footer className="border-t border-slate-200 pt-8 mt-16 pb-8 shrink-0 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-4 text-slate-400">
                <Database className="w-4 h-4" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
                <div>
                  <h4 className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400"></span> METHODOLOGY
                  </h4>
                  <p className="text-slate-500 text-[11px] font-sans max-w-sm leading-relaxed">
                    SIGINT & OSINT fusion. Cross-sector algorithmic analysis derived from raw municipal, corporate, and structural data spanning housing targets, procurement frameworks, demographic vectors, and critical infrastructure deficits.
                  </p>
                </div>
                <div>
                  <h4 className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400"></span> DATA PROVENANCE
                  </h4>
                  <p className="text-slate-500 text-[11px] font-sans max-w-sm leading-relaxed">
                    Authentic, brutally honest research unconstrained by political narrative or corporate PR. All vectors represent structural mathematical realities mapped against adversarial extraction models.
                  </p>
                </div>
                <div className="lg:text-right">
                  <h4 className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-3">CLASSIFICATION LEVEL</h4>
                  <div className="inline-block border border-teal-200 bg-teal-50 px-3 py-1.5">
                    <p className="text-teal-600 text-xs font-sans font-bold tracking-widest">
                      TS // NOFORN // FVEY
                    </p>
                  </div>
                  <p className="text-slate-400 text-[9px] mt-3 font-sans">
                    SYS-TIME: {new Date().toISOString()}
                  </p>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </main>

    </div>
  );
};
