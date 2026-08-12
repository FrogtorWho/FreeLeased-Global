import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ScrollText,
  BookOpen,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Leaf,
  Github,
  ExternalLink,
} from 'lucide-react';
import { cn } from './lib/cn';
import LeaseReader from './tabs/LeaseReader';
import StatuteAtlas from './tabs/StatuteAtlas';
import RightsChecker from './tabs/RightsChecker';
import RtmWizard from './tabs/RtmWizard';
import HonestGaps from './tabs/HonestGaps';

type TabId = 'lease' | 'atlas' | 'rights' | 'rtm' | 'gaps';

interface TabDef {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  blurb: string;
  section: 'INTRO' | 'RIGHTS' | 'HOUSING' | 'TRENDS' | 'ACTIONS';
}

const TABS: TabDef[] = [
  { id: 'lease', label: 'Lease Reader', shortLabel: 'Lease', icon: <ScrollText className="w-4 h-4" />, blurb: 'Paste a lease. Get the 20-pattern verdict.', section: 'ACTIONS' },
  { id: 'atlas', label: 'Statute Atlas', shortLabel: 'Atlas', icon: <BookOpen className="w-4 h-4" />, blurb: 'Cap. 224A BB, LFRA 2024 UK, 9-jurisdiction spine.', section: 'HOUSING' },
  { id: 'rights', label: 'Rights Checker', shortLabel: 'Rights', icon: <ShieldCheck className="w-4 h-4" />, blurb: 'The 20 hidden-rights patterns, per jurisdiction.', section: 'RIGHTS' },
  { id: 'rtm', label: 'RTM Wizard', shortLabel: 'RTM', icon: <Compass className="w-4 h-4" />, blurb: 'UK s.99 LFRA 2024 Right to Manage — eligibility.', section: 'ACTIONS' },
  { id: 'gaps', label: "Honest Gaps", shortLabel: 'Gaps', icon: <AlertTriangle className="w-4 h-4" />, blurb: "What's verified, what's unverified, what's missing.", section: 'INTRO' },
];

function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="w-9 h-9 rounded-lg gradient-emerald flex items-center justify-center shadow-md">
        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 23V9h3l4 9 4-9h3v14h-3v-8l-3 7h-2l-3-7v8z" fill="#a7f3d0" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700/80">
          Veridian FreeLeased
        </p>
        <h1 className="text-sm font-bold text-emerald-950">
          Caribbean Lease Reader
        </h1>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabId>('lease');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top utility bar */}
      <header className="gradient-emerald text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/sam-peacock/FreeLeased-Global"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/60 transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">source</span>
            </a>
            <a
              href="#gaps"
              onClick={(e) => { e.preventDefault(); setTab('gaps'); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition"
            >
              <Leaf className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">honesty report</span>
            </a>
          </div>
        </div>

        {/* Marquee */}
        <div className="bg-emerald-950/40 border-t border-emerald-800/60 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee w-max py-1.5">
            {[...Array(2)].flatMap((_, i) => (
              [
                <span key={`a${i}`} className="text-[10px] font-mono text-emerald-200/80 mx-8 uppercase tracking-widest">v3 dataset · 9 jurisdictions · 20 patterns · 25 statutes</span>,
                <span key={`b${i}`} className="text-[10px] font-mono text-emerald-200/80 mx-8 uppercase tracking-widest">BB · JM · KY · TT · BS · GY · BZ · VG · UK</span>,
                <span key={`c${i}`} className="text-[10px] font-mono text-emerald-200/80 mx-8 uppercase tracking-widest">paste any lease · regex pattern match · cite statute · log to evidence</span>,
              ]
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
        {/* Sidebar nav */}
        <aside className="lg:sticky lg:top-6 self-start">
          <nav className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                FreeLeased taxonomy
              </p>
              <p className="text-xs text-slate-700 mt-0.5">1 jurisdiction · 1 document · 1 statute</p>
            </div>
            <ul className="p-1.5 space-y-0.5">
              {TABS.map((t) => {
                const active = t.id === tab;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setTab(t.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-all border',
                        active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-[inset_3px_0_0_theme(--color-emerald-600)]'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      <span className={cn('mt-0.5 shrink-0', active ? 'text-emerald-600' : 'text-slate-400')}>{t.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-semibold leading-tight">{t.label}</span>
                        <span className="block text-[10.5px] text-slate-500 leading-snug mt-0.5">{t.blurb}</span>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                          {t.section}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug">
            <p className="font-bold uppercase tracking-widest text-[10px] text-amber-700 mb-1">
              Honest disclaimer
            </p>
            Regex pattern match is not legal advice. For real disputes, verify against the cited statute + consult a qualified practitioner.
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={mounted ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="animate-fade-in"
            >
              {tab === 'lease' && <LeaseReader />}
              {tab === 'atlas' && <StatuteAtlas />}
              {tab === 'rights' && <RightsChecker />}
              {tab === 'rtm' && <RtmWizard />}
              {tab === 'gaps' && <HonestGaps />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <BrandMark className="opacity-80 scale-90 origin-left" />
            <span className="text-slate-400">·</span>
            <span>open source · Apache-2.0</span>
          </div>
          <div className="font-mono">
            dataset v229v3 · {new Date().toISOString().slice(0, 10)}
          </div>
          <a
            href="https://legislation.gov.uk/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-emerald-700"
          >
            cite source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}