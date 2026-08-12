import React from 'react';
import { motion } from 'framer-motion';
import { Search, Database, Fingerprint, ShieldQuestion, FileWarning, Eye, AlertTriangle, Book, Terminal, TableProperties, Network, GitBranch, ArrowRight, Library, FileText, Anchor } from 'lucide-react';

export const TabFutureResearch: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 font-mono pb-20"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Book className="w-6 h-6 text-indigo-600" />
          SYSTEM ROADMAP & KNOWLEDGE BASE
        </h1>
        <p className="text-sm text-slate-600">
          Master documentation for buildout, implementation timelines, database schemas, and intelligence appendices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-6 bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Table of Contents</h3>
            <a href="#schema" className="block text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-2"><Database className="w-3 h-3" /> Database Schema</a>
            <a href="#roadmap" className="block text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-2"><GitBranch className="w-3 h-3" /> Implementation Roadmap</a>
            <a href="#research" className="block text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-2"><Search className="w-3 h-3" /> Research Vectors</a>
            <a href="#wiki" className="block text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-2"><Library className="w-3 h-3" /> Wiki & Glossary</a>
            <a href="#appendix" className="block text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-2"><Anchor className="w-3 h-3" /> Appendix & Papertrail</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* SECTION: DATABASE SCHEMA */}
          <section id="schema" className="scroll-mt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <TableProperties className="w-5 h-5 text-teal-600" />
              I. Primary Database Schema (PostgreSQL/Supabase)
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm overflow-x-auto">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Table: intel_signals</h4>
                <pre className="text-[10px] text-slate-600 leading-relaxed">
{`CREATE TABLE intel_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingest_timestamp TIMESTAMPTZ DEFAULT NOW(),
  vector VARCHAR(50) NOT NULL, -- e.g., 'FINANCIAL', 'DOCTRINE'
  region VARCHAR(50),
  severity VARCHAR(20),
  confidence_score DECIMAL(5,2),
  raw_message TEXT,
  doctrine_match VARCHAR(100),
  tactical_response TEXT,
  source_id UUID REFERENCES intel_sources(id)
);

CREATE INDEX idx_intel_vector ON intel_signals(vector);
CREATE INDEX idx_intel_severity ON intel_signals(severity);`}
                </pre>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm overflow-x-auto">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Table: structural_nodes (Graph DB Mapping)</h4>
                <pre className="text-[10px] text-slate-600 leading-relaxed">
{`CREATE TABLE structural_nodes (
  node_id UUID PRIMARY KEY,
  entity_name VARCHAR(255),
  entity_type VARCHAR(50), -- e.g., 'MUNICIPALITY', 'CONTRACTOR', 'GRID_ASSET'
  vulnerability_score DECIMAL(5,2),
  dependencies JSONB, -- Array of dependent node_ids
  financial_exposure DECIMAL(15,2),
  last_audit_date DATE
);`}
                </pre>
              </div>
            </div>
          </section>

          {/* SECTION: IMPLEMENTATION ROADMAP */}
          <section id="roadmap" className="scroll-mt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              II. Implementation & Buildout Roadmap
            </h2>
            
            <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white"></span>
                <h3 className="text-sm font-bold text-slate-900">Phase 1: Ingestion & Parsing (Q3 2026)</h3>
                <p className="text-xs text-slate-600 mt-2">Deploy distributed OSINT scrapers and dark-web telemetry listeners. Implement NLP parsing for military doctrine keywords (e.g., "Gerasimov", "MDO", "Gray Zone").</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white"></span>
                <h3 className="text-sm font-bold text-slate-900">Phase 2: Graph Analysis & Nexus Engine (Q4 2026)</h3>
                <p className="text-xs text-slate-600 mt-2">Correlate disparate signals using Neo4j/Graph capabilities. Identify convergence points between municipal financial failure and infrastructure vulnerability.</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white"></span>
                <h3 className="text-sm font-bold text-slate-900">Phase 3: Automated Tactical Response (Q1 2027)</h3>
                <p className="text-xs text-slate-600 mt-2">Integrate automated SOAR (Security Orchestration, Automation, and Response) playbooks based on identified military doctrines.</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white"></span>
                <h3 className="text-sm font-bold text-slate-900">Phase 4: Predictive War-Gaming (Q2 2027)</h3>
                <p className="text-xs text-slate-600 mt-2">Expand the War-Gaming Sandbox to utilize live Monte Carlo simulations powered by real-world data feeds rather than static assumptions.</p>
              </div>
            </div>
          </section>

          {/* SECTION: WIKI & GLOSSARY */}
          <section id="wiki" className="scroll-mt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <Library className="w-5 h-5 text-emerald-600" />
              III. Wiki, Glossary & Doctrine Models
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                <h4 className="text-xs font-bold text-emerald-700 mb-2 uppercase">Gerasimov Doctrine</h4>
                <p className="text-[11px] text-slate-600">
                  Concept of non-linear warfare blending conventional and asymmetrical tactics. Emphasizes information warfare, economic subversion, and deployment of unacknowledged actors.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Detection Signatures</span>
                  <ul className="text-[10px] text-slate-500 list-disc pl-4 mt-1">
                    <li>Disinformation velocity spikes</li>
                    <li>Paramilitary proxy mobilization</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                <h4 className="text-xs font-bold text-sky-700 mb-2 uppercase">Multi-Domain Operations (MDO)</h4>
                <p className="text-[11px] text-slate-600">
                  Simultaneous and sequential operations across all domains (Land, Sea, Air, Space, Cyber) to create windows of advantage and overwhelm adversary decision-making.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Detection Signatures</span>
                  <ul className="text-[10px] text-slate-500 list-disc pl-4 mt-1">
                    <li>Cross-domain synchronicity</li>
                    <li>C2 (Command & Control) disruption</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                <h4 className="text-xs font-bold text-amber-700 mb-2 uppercase">Section 114 (S114)</h4>
                <p className="text-[11px] text-slate-600">
                  A notice issued by a local authority in the UK when it cannot balance its budget, effectively freezing non-essential spending.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                <h4 className="text-xs font-bold text-purple-700 mb-2 uppercase">Reflexive Control</h4>
                <p className="text-[11px] text-slate-600">
                  A Soviet-era psychological warfare concept designed to manipulate an adversary into making decisions that ultimately favor the attacker.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: APPENDIX & PAPERTRAIL */}
          <section id="appendix" className="scroll-mt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <Anchor className="w-5 h-5 text-slate-700" />
              IV. Appendix, Sources & Papertrail
            </h2>

            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase">Document Papertrail</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                <li className="p-4 flex items-start gap-4">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">NATO Cooperative Cyber Defence Centre of Excellence (CCDCOE)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Tallinn Manual 2.0 on the International Law Applicable to Cyber Operations.</p>
                    <a href="#" className="text-[10px] text-indigo-600 mt-2 inline-flex items-center gap-1 hover:underline">View Extract <ArrowRight className="w-3 h-3"/></a>
                  </div>
                </li>
                <li className="p-4 flex items-start gap-4">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">UK National Grid ESO</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Future Energy Scenarios (FES) 2024 - Grid resilience capacity under hyperscale data center strain.</p>
                    <a href="#" className="text-[10px] text-indigo-600 mt-2 inline-flex items-center gap-1 hover:underline">View Extract <ArrowRight className="w-3 h-3"/></a>
                  </div>
                </li>
                <li className="p-4 flex items-start gap-4">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">HM Treasury - WGA</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Whole of Government Accounts 2022-2023 - Municipal debt liabilities and PFI shadow ledgers.</p>
                    <a href="#" className="text-[10px] text-indigo-600 mt-2 inline-flex items-center gap-1 hover:underline">View Extract <ArrowRight className="w-3 h-3"/></a>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-sm">
              <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> CLASSIFICATION NOTICE</h4>
              <p className="text-[11px] text-amber-700">
                Data presented in this application framework constitutes a simulation based on publicly available open-source intelligence (OSINT). While methodologies mirror production-grade analytical platforms, all predictions and structural assessments are synthetic models generated for demonstration purposes.
              </p>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
