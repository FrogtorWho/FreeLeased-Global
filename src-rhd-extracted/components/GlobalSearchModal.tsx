import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight, Activity, Network, Scale, Database, ShieldAlert, Sparkles, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  tabId: string;
  title: string;
  description: string;
  category: 'Tabs' | 'Entities' | 'Doctrines' | 'Vectors' | 'Metrics';
  tags: string[];
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

const SEARCH_INDEX: SearchResult[] = [
  // Tabs
  { id: 't1', tabId: 'command_center', title: 'Executive Command Center', description: 'Global threat synthesis and high-level systemic metrics.', category: 'Tabs', tags: ['kpi', 'load', 'overview', 'executive'] },
  { id: 't2', tabId: 'live_detection', title: 'Live SIGINT Feed', description: 'Real-time signal intelligence monitoring & municipal alert log.', category: 'Tabs', tags: ['sigint', 'feed', 'live', 'signals', 'alerts'] },
  { id: 't3', tabId: 'war_gaming', title: 'War-Gaming Sandbox', description: 'Interactive policy stress testing and adversarial simulation.', category: 'Tabs', tags: ['sandbox', 'simulation', 'stress', 'policy'] },
  { id: 't4', tabId: 'military_doctrine', title: 'Doctrine Translation', description: 'Translating military strategy principles to municipal defense.', category: 'Tabs', tags: ['doctrine', 'military', 'defense', 'strategy'] },
  { id: 't5', tabId: 'multi_int_fusion', title: 'Multi-INT Fusion Engine', description: 'Fusing SIGINT, OSINT, GEOINT, and FININT dataset vectors.', category: 'Tabs', tags: ['fusion', 'osint', 'geoint', 'finint', 'multiint'] },
  { id: 't6', tabId: 'audit_trail', title: 'Provenance Ledger', description: 'Cryptographic hash trail of all raw municipal data source artifacts.', category: 'Tabs', tags: ['provenance', 'ledger', 'audit', 'hash', 'blockchain'] },
  { id: 't7', tabId: 'research_brief', title: 'Impartial Research Brief', description: 'Dynamic one-shot prompts enforcing zero-hypothesis research.', category: 'Tabs', tags: ['brief', 'research', 'prompt', 'one-shot', 'impartial'] },
  { id: 't8', tabId: 'predictive_risk', title: 'Predictive Risk & Algorithms', description: 'Advanced mathematical collapse projections and stochastic models.', category: 'Tabs', tags: ['predictive', 'algorithms', 'monte carlo', 'risk', 'forecast'] },
  { id: 't9', tabId: 'procurement_cartel', title: 'Procurement Cartel', description: 'Cartel network mapping of public tender allocations.', category: 'Tabs', tags: ['procurement', 'cartel', 'tenders', 'monopoly'] },
  { id: 't10', tabId: 'sovereign_capital', title: 'Sovereign Capital Flight', description: 'Tracking dividend payouts and offshore capital extraction.', category: 'Tabs', tags: ['capital', 'flight', 'offshore', 'tax', 'dividends'] },

  // Entities
  { id: 'e1', tabId: 'research_brief', title: 'Apex Holdings Ltd', description: 'Target corporate holding entity mapped in Southwark procurement.', category: 'Entities', tags: ['apex', 'corporate', 'southwark', 'holding'] },
  { id: 'e2', tabId: 'procurement_cartel', title: 'Capita / Serco / Mitie Consortium', description: 'Major outsourcing suppliers managing municipal services.', category: 'Entities', tags: ['capita', 'serco', 'mitie', 'supplier'] },
  { id: 'e3', tabId: 'sovereign_capital', title: 'SNCF / CDPQ Infrastructure', description: 'Foreign state sovereign wealth entity acquiring UK transit assets.', category: 'Entities', tags: ['sncf', 'cdpq', 'transit', 'sovereign'] },
  { id: 'e4', tabId: 'demographics', title: 'Borough of Southwark', description: 'Primary municipal study area for housing displacement vectors.', category: 'Entities', tags: ['southwark', 'borough', 'london', 'housing'] },

  // Vectors & Metrics
  { id: 'v1', tabId: 'predictive_risk', title: 'Systemic Collapse Index (2029)', description: 'Critical 80%+ load threshold indicating multi-point service failure.', category: 'Metrics', tags: ['collapse', 'load', '2029', 'threshold'] },
  { id: 'v2', tabId: 'multi_int_fusion', title: 'Section 114 Insolvency Warning', description: 'Automated signal trigger for council bankruptcy vulnerability.', category: 'Vectors', tags: ['section 114', 'insolvency', 'bankruptcy', 'council'] },
  { id: 'v3', tabId: 'military_doctrine', title: 'Anti-Access / Area Denial (A2/AD)', description: 'Defensive framework preventing predatory capital acquisition.', category: 'Doctrines', tags: ['a2ad', 'defense', 'area denial', 'doctrine'] },
  { id: 'v4', tabId: 'grid_energy', title: 'Grid Load Deficit Vector', description: 'Power constraint mapping against data center expansion.', category: 'Vectors', tags: ['grid', 'energy', 'power', 'deficit'] },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or container
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'Tabs', 'Entities', 'Doctrines', 'Vectors', 'Metrics'];

  const filteredResults = useMemo(() => {
    return SEARCH_INDEX.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesText =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesText;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tabs, corporate targets, doctrines, risk metrics..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ESC
          </span>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto flex-1 custom-scrollbar space-y-2">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-medium text-slate-600">No matching intelligence nodes found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "Apex", "SIGINT", "2029", or "Procurement"</p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.tabId);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.category === 'Tabs' ? 'bg-indigo-100 text-indigo-700' :
                      item.category === 'Entities' ? 'bg-teal-100 text-teal-700' :
                      item.category === 'Doctrines' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-1 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{filteredResults.length} index nodes matched</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-teal-500" /> J-2 Intelligence Search Index
          </span>
        </div>
      </div>
    </div>
  );
};
