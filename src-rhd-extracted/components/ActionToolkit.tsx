import React, { useState, useEffect } from 'react';
import { LETTER_TEMPLATES } from '../constants';
import { Copy, Check, FileText, ListChecks, Printer, Settings, ShieldAlert, Sparkles, RefreshCw, FileSignature } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ActionToolkit: React.FC = () => {
  const [activeTemplateId, setActiveTemplateId] = useState('s21_22');
  const [copied, setCopied] = useState(false);
  
  // Interactive inputs for the letter
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [agentName, setAgentName] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  
  // Specific params
  const [period, setPeriod] = useState('2025/2026');
  const [demandDate, setDemandDate] = useState('15/05/2026');
  const [amount, setAmount] = useState('£2,450.00');
  const [buildingName, setBuildingName] = useState('Sentinel Heights Block A');
  
  // Checklist State
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(8).fill(false));

  const items = [
    "Obtain full lease & supplementary deeds",
    "Request last 3 years of service charge demands",
    "Verify S.20 consultation notices for major works",
    "Request landlord direct company register statement",
    "Check for 'Linked-Party' transactions in accounts",
    "Verify building insurance schedule & commissions",
    "Confirm demand compliance with summary of rights rules",
    "Request administrative fee schedule under Schedule 11"
  ];

  const toggleCheck = (idx: number) => {
    const next = [...checkedItems];
    next[idx] = !next[idx];
    setCheckedItems(next);
  };

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const activeTemplate = LETTER_TEMPLATES.find(t => t.id === activeTemplateId) || LETTER_TEMPLATES[0];

  // Dynamically replace text fields
  const getCompiledText = () => {
    let t = activeTemplate.defaultText;
    
    // Core details
    t = t.replace(/\[Your Name\]/g, name || '[Enter Your Name]');
    t = t.replace(/\[Property Address\]/g, address || '[Enter Property Address]');
    t = t.replace(/\[Date\]/g, date || '[Enter Date]');
    t = t.replace(/\[Managing Agent \/ Freeholder Name\]/g, agentName || '[Enter Managing Agent]');
    t = t.replace(/\[Address\]/g, agentAddress || '[Enter Managing Agent Address]');
    
    // Conditional replacements based on active template variables
    t = t.replace(/\[Specify Period\]/g, period || '[Accounting Period]');
    t = t.replace(/\[Specify Period, e.g., 2024\/2025\]/g, period || '[Accounting Period]');
    t = t.replace(/\[Date of Demand\]/g, demandDate || '[Date of Demand]');
    t = t.replace(/\[Amount\]/g, amount || '[Amount Charged]');
    t = t.replace(/\[Building Name\]/g, buildingName || '[Building Name]');
    
    return t;
  };

  const compiledText = getCompiledText();

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Statutory Challenge Draft - Printed</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                padding: 40px;
                color: #000;
                line-height: 1.6;
                white-space: pre-wrap;
                font-size: 14px;
              }
            </style>
          </head>
          <body>${compiledText.replace(/\n/g, '<br />')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Reset helper
  const handleReset = () => {
    setName('');
    setAddress('');
    setAgentName('');
    setAgentAddress('');
    setPeriod('2025/2026');
    setDemandDate('15/05/2026');
    setAmount('£2,450.00');
    setBuildingName('Sentinel Heights Block A');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT: Checklist & Form controls (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Investigation Audit Checklist Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border bg-surface p-6 rounded-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ListChecks className="text-accent" />
              <h3 className="text-xl font-bold font-sans">Investigation Verification</h3>
            </div>
            <span className="font-mono text-xs text-slate-500 bg-void px-2 py-1 rounded">
              S.20 / LTA 1985 Scope
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
            Cross-reference landlord disclosures systematically. Gather documents to prove systemic non-compliance.
          </p>

          {/* Progress Indicators */}
          <div className="mb-4 bg-void p-3 rounded border border-border">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-600">AUDIT PREPAREDNESS SCORE:</span>
              <span className={progressPercent === 100 ? "text-green-400 font-bold" : "text-accent"}>
                {progressPercent}%
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${progressPercent === 100 ? 'bg-green-500' : 'bg-teal-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <label 
                key={idx} 
                className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-all border
                  ${checkedItems[idx] 
                    ? 'border-green-900 bg-green-950/10 hover:bg-green-950/20' 
                    : 'border-transparent hover:bg-slate-100/50 hover:border-slate-200'
                  }
                `}
              >
                <input 
                  type="checkbox" 
                  checked={checkedItems[idx]}
                  onChange={() => toggleCheck(idx)}
                  className="mt-1 w-4 h-4 accent-accent rounded border-zinc-600 bg-void cursor-pointer" 
                />
                <span className={`text-xs transition-colors leading-tight ${checkedItems[idx] ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>

          <AnimatePresence>
            {progressPercent === 100 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-dashed border-green-800/50 mt-4 text-xs text-green-400 font-mono flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-pulse flex-shrink-0" />
                <span>Statutory evidence package fully pre-composed! Click print on the right to compile.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Draft Form Customizer Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border bg-surface p-6 rounded-lg relative"
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="text-slate-500 w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-600">Interactive Inputs</h3>
            <button 
              onClick={handleReset}
              className="ml-auto text-[10px] font-mono text-slate-500 hover:text-accent flex items-center gap-1 transition-colors"
              title="Reset fields to placeholders"
            >
              <RefreshCw className="w-3 h-3" />
              RESET
            </button>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Your Name (Leaseholder)</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance" 
                className="w-full bg-void border border-border rounded p-2 text-xs text-slate-800 outline-none focus:border-zinc-500 transition-colors"
                id="leaseholder_name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Property Demised Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. Flat 14, Sentinel Heights, Manchester, M1 4PP" 
                className="w-full bg-void border border-border rounded p-2 text-xs text-slate-800 outline-none focus:border-zinc-500 transition-colors"
                id="leaseholder_address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Managing Agent / Landlord</label>
                <input 
                  type="text" 
                  value={agentName} 
                  onChange={e => setAgentName(e.target.value)}
                  placeholder="e.g. Apex Property Trust Ltd" 
                  className="w-full bg-void border border-border rounded p-2 text-xs text-slate-800 outline-none focus:border-zinc-500 transition-colors"
                  id="agent_name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Agent Office Address</label>
                <input 
                  type="text" 
                  value={agentAddress} 
                  onChange={e => setAgentAddress(e.target.value)}
                  placeholder="e.g. 100 Pall Mall, London, SW1Y 5NQ" 
                  className="w-full bg-void border border-border rounded p-2 text-xs text-slate-800 outline-none focus:border-zinc-500 transition-colors"
                  id="agent_address"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Statutory Context Variables</span>
              
              {activeTemplateId === 's20_breach' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-0.5">DEMAND DATE</label>
                    <input 
                      type="text" 
                      value={demandDate} 
                      onChange={e => setDemandDate(e.target.value)}
                      className="w-full bg-void border border-border rounded p-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-0.5">AMOUNT DEMANDED</label>
                    <input 
                      type="text" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-void border border-border rounded p-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-0.5">COURTYARD / BLOCK</label>
                    <input 
                      type="text" 
                      value={buildingName} 
                      onChange={e => setBuildingName(e.target.value)}
                      className="w-full bg-void border border-border rounded p-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-0.5">DISPUTED ACCOUNTING PERIOD</label>
                  <input 
                    type="text" 
                    value={period} 
                    onChange={e => setPeriod(e.target.value)}
                    placeholder="e.g. 2024/2025" 
                    className="w-full bg-void border border-border rounded p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Document Draft Builder (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full border border-border bg-void rounded-lg overflow-hidden">
        
        {/* Template Switching Tabs */}
        <div className="flex border-b border-border bg-surface p-1 overflow-x-auto gap-1">
          {LETTER_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setActiveTemplateId(tmpl.id)}
              className={`flex-1 min-w-[130px] text-center px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-all rounded duration-200
                ${activeTemplateId === tmpl.id 
                  ? 'bg-zinc-100 text-black font-semibold' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                }
              `}
              id={`tab_${tmpl.id}`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Template Meta bar */}
        <div className="bg-surface/50 p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              <FileSignature className="w-3 h-3" />
              {activeTemplate.statutoryBasis}
            </span>
            <p className="text-xs text-slate-600 mt-1 font-sans leading-snug">
              {activeTemplate.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-zinc-700 text-xs font-mono uppercase tracking-wider rounded transition-colors text-slate-800"
              title="Copy prepared letter to clipboard"
              id="copy_letter_btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Draft'}
            </button>

            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-zinc-700 text-xs font-mono uppercase tracking-wider rounded transition-colors text-slate-800 border border-zinc-700"
              title="Print letter or export to PDF"
              id="print_letter_btn"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* live typewriter display box */}
        <div className="flex-1 p-6 bg-slate-50 font-mono text-xs leading-relaxed text-slate-600 overflow-y-auto h-[480px] custom-scrollbar border-b border-border">
          <div className="max-w-prose mx-auto whitespace-pre-wrap select-all font-mono antialiased text-[11px] md:text-xs">
            {compiledText}
          </div>
        </div>

        {/* Notice/Alert footer */}
        <div className="p-3 bg-slate-50/80 flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-accent animate-pulse" />
          <span>Note: Statutory notices carry strict legal timelines under UK Tribunal civil procedures.</span>
        </div>
      </div>

    </div>
  );
};
