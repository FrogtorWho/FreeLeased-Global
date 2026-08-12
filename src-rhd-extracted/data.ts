export const ARBITRAGE_DATA = [
  { role: 'Cloud Architect', subRate: 535, primeRate: 1850, margin: 71 },
  { role: 'DevOps Engineer', subRate: 535, primeRate: 1550, margin: 65 },
  { role: 'AI Specialist', subRate: 575, primeRate: 2050, margin: 72 },
  { role: 'Project Director', subRate: 1085, primeRate: 2500, margin: 56 },
  { role: 'Cybersecurity Lead', subRate: 800, primeRate: 2100, margin: 62 }
];

export const HOUSING_DATA = [
  { year: '2019', starts: 191000, completions: 214000, target: 300000 },
  { year: '2023', starts: 170000, completions: 190000, target: 300000 },
  { year: '2024', starts: 134000, completions: 184000, target: 300000 },
  { year: '2025', starts: 150600, completions: 170390, target: 370000 }
];

export const DEFICIT_DATA = [
  { category: 'Public Sector Pay', amount: 9.4 },
  { category: 'Reserve Claims', amount: 8.6 },
  { category: 'Asylum/Migration', amount: 6.4 },
  { category: 'Rail Services', amount: 2.9 },
  { category: 'New Policy', amount: 2.6 },
  { category: 'Pay Overhang', amount: 2.2 },
  { category: 'Ukraine Support', amount: 1.7 }
];

export const SEND_CRISIS_DATA = [
  { council: 'Hampshire', deficit: 312, swing: -111, risk: 'Critical' },
  { council: 'London Boroughs', deficit: 500, swing: -150, risk: 'Systemic' },
  { council: 'Leeds', deficit: 50, swing: -32.5, risk: 'Severe' },
  { council: 'Bradford', deficit: 14, swing: -32, risk: 'High' },
  { council: 'Haringey', deficit: 11, swing: -23, risk: 'High' },
  { council: 'Kingston', deficit: 15, swing: -15, risk: 'High' }
];

export const WATER_INFRASTRUCTURE = [
  { company: 'South West', pcc: 275.1, leakage: 2.6 },
  { company: 'Northumbrian', pcc: 246.9, leakage: 4.4 },
  { company: 'Thames Water', pcc: 238.0, leakage: 3.5 },
  { company: 'Yorkshire', pcc: 230.4, leakage: 3.7 },
  { company: 'Anglian', pcc: 224.4, leakage: 8.8 },
  { company: 'Southern', pcc: 206.8, leakage: 3.6 }
];

export const MIGRATION_TRENDS = [
  { year: 'Mar 2023', net: 944, eu: -30, nonEu: 974, british: 0 },
  { year: 'Dec 2024', net: 331, eu: -40, nonEu: 380, british: -9 },
  { year: 'Jun 2025', net: 204, eu: -70, nonEu: 383, british: -109 },
  { year: 'Dec 2025', net: 171, eu: -42, nonEu: 350, british: -136 }
];

export const GLOBAL_TRANSIT_CAPITAL = [
  { entity: 'ALSTOM', cdpq: 17.5, frenchState: 7.5, other: 75.0 },
  { entity: 'Keolis', cdpq: 30.0, frenchState: 70.0, other: 0 },
  { entity: 'Eurostar Group', cdpq: 19.3, frenchState: 55.75, other: 24.95 }
];

export const LABOR_SHORTAGE_2026 = [
  { trade: 'Mechanical Fitters', demand: 'Critical', wageInflation: 21 },
  { trade: 'Electricians', demand: 'Critical', wageInflation: 18 },
  { trade: 'Multi-Skilled', demand: 'Very High', wageInflation: 16 },
  { trade: 'Groundworkers', demand: 'Very High', wageInflation: 14 },
  { trade: 'CSCS Labourers', demand: 'Very High', wageInflation: 12 },
  { trade: 'Plant Operators', demand: 'High', wageInflation: 11 }
];

export const PREDICTIVE_RISK_DATA = [
  { year: 2018, defaultRisk: 2, defaultRiskRange: [2, 2], arbitrageExtraction: 18, systemicLoad: 12, systemicLoadRange: [12, 12], historical: true },
  { year: 2020, defaultRisk: 3, defaultRiskRange: [3, 3], arbitrageExtraction: 24, systemicLoad: 15, systemicLoadRange: [15, 15], historical: true },
  { year: 2022, defaultRisk: 4, defaultRiskRange: [4, 4], arbitrageExtraction: 32, systemicLoad: 18, systemicLoadRange: [18, 18], historical: true },
  { year: 2024, defaultRisk: 5, defaultRiskRange: [5, 5], arbitrageExtraction: 40, systemicLoad: 20, systemicLoadRange: [20, 20], historical: true },
  { year: 2025, defaultRisk: 12, defaultRiskRange: [10, 15], arbitrageExtraction: 45, systemicLoad: 30, systemicLoadRange: [28, 33], historical: false },
  { year: 2026, defaultRisk: 28, defaultRiskRange: [22, 35], arbitrageExtraction: 52, systemicLoad: 45, systemicLoadRange: [40, 52], historical: false },
  { year: 2027, defaultRisk: 45, defaultRiskRange: [35, 58], arbitrageExtraction: 61, systemicLoad: 62, systemicLoadRange: [55, 72], historical: false },
  { year: 2028, defaultRisk: 68, defaultRiskRange: [55, 82], arbitrageExtraction: 70, systemicLoad: 78, systemicLoadRange: [68, 90], historical: false },
  { year: 2029, defaultRisk: 82, defaultRiskRange: [65, 95], arbitrageExtraction: 79, systemicLoad: 89, systemicLoadRange: [78, 100], historical: false },
  { year: 2030, defaultRisk: 95, defaultRiskRange: [75, 100], arbitrageExtraction: 85, systemicLoad: 98, systemicLoadRange: [85, 100], historical: false },
];

export const THREAT_RADAR_DATA = [
  { subject: 'Municipal Solvency', A: 95, fullMark: 100 },
  { subject: 'Infrastructure Deficit', A: 85, fullMark: 100 },
  { subject: 'Consultancy Capture', A: 90, fullMark: 100 },
  { subject: 'Housing Shortage', A: 88, fullMark: 100 },
  { subject: 'Energy Grid Capacity', A: 75, fullMark: 100 },
  { subject: 'Water Network Collapse', A: 92, fullMark: 100 },
];

export const MONEY_FLOW_DATA = {
  nodes: [
    { name: "UK Taxpayer Base" },
    { name: "HM Treasury" },
    { name: "Local Government" },
    { name: "Dept for Transport" },
    { name: "NHS / Health" },
    { name: "Big-4 Consultancies" },
    { name: "SNCF (French State)" },
    { name: "CDPQ (Canadian Pensions)" },
    { name: "Grey Belt Speculators" }
  ],
  links: [
    { source: 0, target: 1, value: 1000 },
    { source: 1, target: 2, value: 250 },
    { source: 1, target: 3, value: 150 },
    { source: 1, target: 4, value: 400 },
    { source: 2, target: 5, value: 80 },
    { source: 2, target: 8, value: 120 },
    { source: 3, target: 6, value: 70 },
    { source: 3, target: 7, value: 50 },
    { source: 4, target: 5, value: 100 }
  ]
};

export const REGIONAL_RISK_DATA = [
  { region: 'London', housingStress: 98, waterStress: 85, insolvencyRisk: 75, overall: 86 },
  { region: 'South East', housingStress: 92, waterStress: 95, insolvencyRisk: 82, overall: 89 },
  { region: 'Midlands', housingStress: 75, waterStress: 60, insolvencyRisk: 94, overall: 76 },
  { region: 'North West', housingStress: 68, waterStress: 45, insolvencyRisk: 88, overall: 67 },
  { region: 'South West', housingStress: 85, waterStress: 70, insolvencyRisk: 80, overall: 78 },
  { region: 'North East', housingStress: 55, waterStress: 40, insolvencyRisk: 90, overall: 61 },
  { region: 'East of England', housingStress: 80, waterStress: 88, insolvencyRisk: 70, overall: 79 },
  { region: 'Yorkshire', housingStress: 60, waterStress: 50, insolvencyRisk: 85, overall: 65 },
];

export const LIVE_THREAT_TICKER = [
  "ALERT: Hampshire County Council signals potential s.114 notice by 2026",
  "METRIC: Net migration revised figures impact Q3 housing starts by -14%",
  "INFRASTRUCTURE: Thames Water debt-to-capital ratio reaches 80% threshold",
  "PROCUREMENT: Top 4 consultancies secure £2.1B in new direct-award contracts",
  "HOUSING: Grey belt land valuation spikes 400% in Home Counties following planning reforms",
  "DEFICIT: Public sector pay mandates generate un-funded £9.4Bn black hole",
  "ENERGY: South East grid capacity warnings issued for 2027 winter peak"
];

export const ENERGY_GRID_DATA = [
  { year: 2024, capacity: 60, demand: 58, aiDemand: 2, deficit: 0 },
  { year: 2026, capacity: 62, demand: 61, aiDemand: 5, deficit: 0 },
  { year: 2028, capacity: 64, demand: 66, aiDemand: 10, deficit: 2 },
  { year: 2030, capacity: 67, demand: 72, aiDemand: 18, deficit: 5 },
];

export const MUNICIPAL_CASCADE_DATA = [
  { council: 'Birmingham', status: 'S114 Declared', deficit: 843, year: 2023, riskScore: 100 },
  { council: 'Nottingham', status: 'S114 Declared', deficit: 53, year: 2023, riskScore: 100 },
  { council: 'Somerset', status: 'S114 Imminent', deficit: 100, year: 2024, riskScore: 95 },
  { council: 'Hampshire', status: 'Critical Risk', deficit: 132, year: 2025, riskScore: 88 },
  { council: 'Bradford', status: 'Critical Risk', deficit: 120, year: 2025, riskScore: 85 },
  { council: 'Kent', status: 'Severe Risk', deficit: 86, year: 2026, riskScore: 78 },
  { council: 'Surrey', status: 'Severe Risk', deficit: 74, year: 2026, riskScore: 75 },
];

export const PENSION_CAPITAL_FLOW = [
  { sector: 'Domestic Infrastructure', allocation: 4, label: 'UK Infra' },
  { sector: 'Foreign Equities (US)', allocation: 45, label: 'Global Eq' },
  { sector: 'Global Bonds & Debt', allocation: 35, label: 'Global Debt' },
  { sector: 'Alternative/PE (Global)', allocation: 16, label: 'Alt/PE' },
];

export const PROCUREMENT_CARTEL = [
  { vendor: 'BPO Giant A', contracts: 340, value: 2.1, failRate: 28 },
  { vendor: 'Defense Prime B', contracts: 89, value: 4.5, failRate: 22 },
  { vendor: 'IT Outsourcer C', contracts: 210, value: 1.8, failRate: 41 },
  { vendor: 'Consultancy D', contracts: 145, value: 3.2, failRate: 35 },
];

export const INTL_LAW_VECTORS = [
  { vector: 'ECHR (Human Rights)', status: 'Applied (High Friction)', pros: 'Protects individual liberties, sets baseline standards', cons: 'Constrains sovereign executive action, limits deportation', impact: 85, binding: 100 },
  { vector: 'UN Refugee Convention (1951)', status: 'Applied (Contested)', pros: 'Maintains international soft power and standing', cons: 'Uncapped liability for municipal housing/services', impact: 92, binding: 90 },
  { vector: 'ILO Labor Standards', status: 'Applied', pros: 'Prevents extreme labor exploitation', cons: 'Increases structural costs for domestic industry', impact: 70, binding: 80 },
  { vector: 'Paris Climate Agreement', status: 'Applied (Legally Enshrined)', pros: 'Attracts ESG capital, forces transition', cons: 'Deindustrialization, aggressive energy inflation', impact: 88, binding: 100 },
  { vector: 'WTO Procurement Rules', status: 'Applied', pros: 'Global market access for domestic firms', cons: 'Prevents state-aid and domestic protectionism', impact: 75, binding: 95 }
];

export const HUMAN_RIGHTS_APPLICATION = [
  { right: 'Art. 8 (Private/Family Life)', compliance: 60, friction: 90, domain: 'Immigration & Evictions' },
  { right: 'Art. 1, P1 (Property)', compliance: 80, friction: 40, domain: 'Taxation & Compulsory Purchase' },
  { right: 'Art. 3 (Inhuman/Degrading)', compliance: 75, friction: 85, domain: 'Asylum & Prison Overcrowding' },
  { right: 'Art. 6 (Fair Trial)', compliance: 50, friction: 70, domain: 'Severe Court Backlogs (4+ years)' },
  { right: 'Art. 10 (Expression)', compliance: 65, friction: 60, domain: 'Digital Safety & Public Order' },
];

export const MODERN_SLAVERY_SCORING = [
  { cohort: 'Universal Credit (Sanction Regime)', coercion: 85, financialControl: 95, restrictionOfMovement: 40, exploitation: 60, overallRisk: 70 },
  { cohort: 'Zero-Hour / Gig Economy', coercion: 70, financialControl: 80, restrictionOfMovement: 20, exploitation: 85, overallRisk: 63 },
  { cohort: 'Temporary Housing Residents', coercion: 90, financialControl: 75, restrictionOfMovement: 85, exploitation: 50, overallRisk: 75 },
  { cohort: 'Visa-Tied Migrant Labor', coercion: 95, financialControl: 90, restrictionOfMovement: 90, exploitation: 95, overallRisk: 92 },
  { cohort: 'Mandatory Work Programs', coercion: 80, financialControl: 85, restrictionOfMovement: 60, exploitation: 75, overallRisk: 75 },
];

export const FORENSIC_ROADMAP = [
  { 
    step: 1, 
    phase: "Surface Anomaly Detection", 
    description: "Monitor disparate municipal failures (s.114), infrastructure delays (water/grid), and procurement overspends. Strip away political/media narratives.", 
    outcome: "Identified non-random clustering of systemic stress across supposedly independent domains.", 
    status: "Verified",
    risk: 40
  },
  { 
    step: 2, 
    phase: "Vector Isolation & Math", 
    description: "Isolate pure mathematical data for demographics (migration/aging), energy grid capacity (MW vs demand), and sovereign capital flow (£ Trillions).", 
    outcome: "Isolated 4 distinct, mathematically irreconcilable collapse vectors.", 
    status: "Verified",
    risk: 60
  },
  { 
    step: 3, 
    phase: "Cross-Vector Correlation", 
    description: "Test if Vector A (e.g., Sovereign Capital Flight) directly accelerates Vector B (e.g., Infrastructure Deficit) without external forcing.", 
    outcome: "High systemic correlation (r > 0.85) discovered across all primary structural vectors.", 
    status: "Verified",
    risk: 80
  },
  { 
    step: 4, 
    phase: "Nexus Singularity Targeting", 
    description: "Search for a single statutory, financial, or demographic fulcrum that forces the correlated vectors into an unavoidable failure cascade.", 
    outcome: "Candidate Target: Unfunded Supranational Obligations colliding with Sovereign Capital Leakage.", 
    status: "Active Investigation",
    risk: 95
  },
  { 
    step: 5, 
    phase: "Falsifiability & Stress Test", 
    description: "Apply the Null Hypothesis: If the proposed Nexus is removed/inverted, does the mathematical model stabilize? This proves the 'Path to Truth'.", 
    outcome: "Awaiting final sandbox compilation.", 
    status: "Pending",
    risk: 0
  }
];

export const NEXUS_5M_RADAR = [
  { subject: 'Architects', A: 95, fullMark: 100 },
  { subject: 'Methods', A: 90, fullMark: 100 },
  { subject: 'Motives', A: 85, fullMark: 100 },
  { subject: 'Money Flow', A: 100, fullMark: 100 },
  { subject: 'Motivation', A: 80, fullMark: 100 },
];

export const NEXUS_5M_DETAILS = [
  {
    m: 'Architects',
    title: 'The System Designers',
    description: 'The supranational bodies, Big-Four consultancies, global asset managers, and non-governmental entities authoring the frameworks.',
    keywords: ['Asset Managers', 'Tier 1 Consultancies', 'Supranational NGOs'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-950/20',
    borderColor: 'border-purple-900/50'
  },
  {
    m: 'Methods',
    title: 'Execution Vectors',
    description: 'Procurement frameworks (G-Cloud), statutory compliance mandates, ESG requirements, and the deliberate privatization of profits vs socialization of risk.',
    keywords: ['Procurement Cartels', 'Statutory Overrides', 'Regulatory Moats'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-900/50'
  },
  {
    m: 'Motives',
    title: 'Practical Intent',
    description: 'Wealth extraction, structural dependency generation, and the systemic transfer of sovereign capacity into private rentier monopolies.',
    keywords: ['Wealth Extraction', 'Structural Dependency', 'Monopolization'],
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-950/20',
    borderColor: 'border-emerald-900/50'
  },
  {
    m: 'Money Flow',
    title: 'Capital Routing',
    description: 'The precise mechanism of capital flight: Taxpayer base → Local Authority / Central Gov → Cartel Subcontractor → Offshore Private Equity.',
    keywords: ['Sovereign Wealth Transfer', 'Tax Arbitrage', 'Public-to-Private Syphon'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-950/20',
    borderColor: 'border-orange-900/50'
  },
  {
    m: 'Motivation',
    title: 'Ideological Drive',
    description: 'The ultimate philosophical forcing function: Managed decline, post-national technocratic governance, and neo-feudal rentier capitalism.',
    keywords: ['Technocracy', 'Managed Decline', 'Neo-Feudalism'],
    color: 'text-red-500',
    bgColor: 'bg-red-950/20',
    borderColor: 'border-red-900/50'
  }
];
