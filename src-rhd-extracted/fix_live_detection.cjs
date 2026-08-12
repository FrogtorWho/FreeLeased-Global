const fs = require('fs');
let code = fs.readFileSync('components/TabLiveDetection.tsx', 'utf8');

// Add DOCTRINE vector
code = code.replace(/const VECTORS = \['FINANCIAL', 'INFRASTRUCTURE', 'CYBER', 'SOCIAL', 'LOGISTICS'\];/, "const VECTORS = ['FINANCIAL', 'INFRASTRUCTURE', 'CYBER', 'SOCIAL', 'LOGISTICS', 'DOCTRINE'];");

// Update interface
code = code.replace(/message: string;\n}/, "message: string;\n  doctrineMatch?: string;\n  tacticalResponse?: string;\n}");

// Update generator
const oldMessages = `  const messages = {
    FINANCIAL: ['Anomalous municipal bond sell-off', 'S114 declaration risk elevated', 'Shadow banking liquidity constraint detected'],
    INFRASTRUCTURE: ['Grid frequency deviation', 'Water network pressure drop', 'Datacenter SLA renegotiation blocked'],
    CYBER: ['Coordinated DDoS on public sector portal', 'BGP hijacking attempt mitigated', 'Ransomware lateral movement pattern matched'],
    SOCIAL: ['Sentiment NLP flags localized unrest', 'Social media velocity spike on "strikes"', 'Public transport boycott trending'],
    LOGISTICS: ['Port throughput down 15%', 'HGV driver shortage peak threshold crossed', 'Cold chain integrity alert'],
  };`;

const newMessages = `  const messages = {
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
  };`;

code = code.replace(oldMessages, newMessages);

code = code.replace(/confidence: Math\.floor\(Math\.random\(\) \* 40\) \+ 60,\n    message,\n  \};/g, `confidence: Math.floor(Math.random() * 40) + 60,
    message,
    doctrineMatch: vector === 'DOCTRINE' ? doctrineMatches[Math.floor(Math.random() * doctrineMatches.length)] : undefined,
    tacticalResponse: tacticalResponses[vector as keyof typeof tacticalResponses],
  };`);

// Update UI rendering
const oldUI = `<div className="flex-1 font-sans font-medium text-[13px]">
                    {sig.message}
                  </div>`;

const newUI = `<div className="flex-1 font-sans font-medium text-[13px] flex flex-col gap-1">
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
                  </div>`;

code = code.replace(oldUI, newUI);

fs.writeFileSync('components/TabLiveDetection.tsx', code);
