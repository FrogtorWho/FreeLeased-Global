import { RightData, HousingRisk, Demographic, LetterTemplate } from './types';

export const DEMOGRAPHICS: Demographic[] = [
  { code: 'F', label: 'Freeholders/Investors', type: 'beneficiary' },
  { code: 'M', label: 'Managing Agents', type: 'beneficiary' },
  { code: 'D', label: 'Developers', type: 'beneficiary' },
  { code: 'G', label: 'Ground Rent Funds', type: 'beneficiary' },
  { code: 'HA', label: 'Housing Associations', type: 'mixed' },
  { code: 'L', label: 'Leaseholders', type: 'victim' },
  { code: 'S', label: 'Shared Owners', type: 'victim' },
  { code: 'T', label: 'Social Tenants', type: 'victim' },
  { code: 'R', label: 'Private Renters', type: 'victim' },
  { code: 'P', label: 'Low-Income Households', type: 'victim' },
];

export const RIGHTS_DATA: RightData[] = [
  {
    id: 'art2',
    article: 'Art. 2',
    title: 'Right to Life',
    exception: 'Public-law immunities & intelligence secrecy',
    effect: 'Delays or non-disclosure in inquests; state action insulated by "policy" judgments.',
    beneficiaries: ['Security Services', 'State Agencies'],
    exposed: ['Victims’ Families', 'Civil Society'],
    mitigation: 'Push for transparency via civil claims, public campaigns.'
  },
  {
    id: 'art3',
    article: 'Art. 3',
    title: 'Prohibition of Torture',
    exception: 'Closed Material Procedures & Diplomatic Assurances',
    effect: 'Evidence withheld in court; risky removals justified by assurances.',
    beneficiaries: ['Home Office', 'State Security'],
    exposed: ['Asylum Seekers', 'Detainees'],
    mitigation: 'Judicial Review, NGO advocacy.'
  },
  {
    id: 'art5',
    article: 'Art. 5',
    title: 'Liberty & Security',
    exception: 'Indefinite Immigration Detention',
    effect: 'No statutory time limit; preventive regimes (TPIMs) with reduced safeguards.',
    beneficiaries: ['Detention Contractors', 'Enforcement Bodies'],
    exposed: ['Migrants', 'Refugees'],
    mitigation: 'Habeas Corpus, policy advocacy for time limits.'
  },
  {
    id: 'art6',
    article: 'Art. 6',
    title: 'Fair Trial',
    exception: 'Secret Evidence (CMP / PII)',
    effect: 'Core evidence withheld from defense; special advocates used instead.',
    beneficiaries: ['Prosecution', 'Intelligence Agencies'],
    exposed: ['Defendants', 'Minority Communities'],
    mitigation: 'Advocate for transparency reforms.'
  },
  {
    id: 'art8',
    article: 'Art. 8',
    title: 'Privacy & Family Life',
    exception: 'Investigatory Powers Act (Bulk Data)',
    effect: 'Mass data collection/retention with limited individual remedies.',
    beneficiaries: ['Intelligence Agencies', 'Data Brokers'],
    exposed: ['Journalists', 'Activists', 'Public'],
    mitigation: 'GDPR complaints, encryption.'
  },
  {
    id: 'prot1',
    article: 'Prot. 1-1',
    title: 'Property',
    exception: 'Leasehold Structure & Contract Law',
    effect: 'Onerous service charges, forfeiture threats, declining asset value.',
    beneficiaries: ['Freeholders', 'Investors'],
    exposed: ['Leaseholders', 'Shared Owners'],
    mitigation: '2024 Reforms, Collective Enfranchisement.'
  }
];

export const HOUSING_DATA: HousingRisk[] = [
  {
    id: 'h1',
    point: 'Service Charges & Major Works',
    exploit: 'Inflated tenders, opaque invoices, failure to consult, lump-sum bills.',
    beneficiaries: ['F', 'M', 'G'],
    exposed: ['L', 'S', 'P'],
    trends: { London: 'up', Manchester: 'up', Leeds: 'up', Bristol: 'up' },
    mitigation: 'Demand full accounts; apply to Tribunal for caps; form residents’ group.',
    scale: 'High'
  },
  {
    id: 'h2',
    point: 'Managing Agent Regulation',
    exploit: 'Hidden commissions, tied contracts, padding admin fees.',
    beneficiaries: ['M', 'F'],
    exposed: ['L', 'S', 'R'],
    trends: { London: 'up', 'South East': 'up', Birmingham: 'up' },
    mitigation: 'Request fee schedules; Right to Manage; Trading Standards reports.',
    scale: 'High'
  },
  {
    id: 'h3',
    point: 'Forfeiture & Rentcharges',
    exploit: 'Threats of home loss for arrears; aggressive third-party enforcement.',
    beneficiaries: ['G', 'F'],
    exposed: ['L', 'P'],
    trends: { 'South East': 'up', Wales: 'stable' },
    mitigation: 'Check deeds; urgent legal advice; relief from forfeiture claims.',
    scale: 'Moderate'
  },
  {
    id: 'h4',
    point: 'Short Leases & Extensions',
    exploit: 'Escalating premiums; marriage value traps; shared-ownership exclusions.',
    beneficiaries: ['D', 'F', 'G'],
    exposed: ['L', 'S'],
    trends: { London: 'up', Manchester: 'up' },
    mitigation: 'Statutory extension rights (2024 Act); independent valuation.',
    scale: 'High'
  },
  {
    id: 'h5',
    point: 'Shared Ownership Pitfalls',
    exploit: 'Staircasing limits, 100% liability for 25% equity, resale restrictions.',
    beneficiaries: ['HA', 'D'],
    exposed: ['S', 'P'],
    trends: { London: 'up', National: 'up' },
    mitigation: 'Scrutinise lease; demand major works transparency; Regulator complaints.',
    scale: 'High'
  },
  {
    id: 'h6',
    point: 'New Build Retention',
    exploit: 'Developers retain freeholds, create puppet RMCs, inflate insurance.',
    beneficiaries: ['D', 'F'],
    exposed: ['L', 'R'],
    trends: { London: 'up', Manchester: 'up', Birmingham: 'up', Cardiff: 'up' },
    mitigation: 'New Homes Ombudsman; withhold completion funds; RMC takeover.',
    scale: 'High'
  }
];

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 's21_22',
    name: 'S.21 & 22 Service Charge Audit',
    description: 'Demand a written summary of accounts, invoices, and receipts supporting the annual service charge under the Landlord and Tenant Act 1985.',
    statutoryBasis: 'Sections 21 & 22, Landlord and Tenant Act 1985',
    defaultText: `[Your Name]
[Property Address]
[Date]

[Managing Agent / Freeholder Name]
[Address]

Re: FORMAL REQUEST FOR SERVICE CHARGE ACCOUNTS — S.21 & S.22 LTA 1985

Dear Sir/Madam,

I am the leaseholder of [Property Address].

Pursuant to Section 21 of the Landlord and Tenant Act 1985, I hereby request that you provide me with a written summary of the costs incurred in respect of the service charges for the last accounting period [Specify Period, e.g., 2024/2025]. 

Furthermore, once the summary is provided, please consider this a formal notice under Section 22 of the Landlord and Tenant Act 1985. I require you to provide reasonable facilities for inspecting the accounts, receipts, and all other documents supporting the summary, and for taking copies of them.

Pursuant to Section 25 of the Landlord and Tenant Act 1985, please be advised that failing to provide this information without a reasonable excuse within the statutory 21-day period (or 1 month from the end of the accounting period, whichever is later) is a summary offence.

I look forward to your response within 21 days.

Yours faithfully,

[Signature]`
  },
  {
    id: 'ins_commission',
    name: 'Insurance Commissions RFI',
    description: 'Demand full transparency on hidden broker commissions, placement fees, and kickbacks pocketed by your freeholder or managing agent.',
    statutoryBasis: 'Section 21B, Landlord and Tenant Act 1985 / RICS Service Charge Code',
    defaultText: `[Your Name]
[Property Address]
[Date]

[Managing Agent / Freeholder Name]
[Address]

Re: REQUEST FOR DISCLOSURE OF INSURANCE COMMISSIONS AND REBATES

Dear Sir/Madam,

I am the leaseholder of [Property Address]. 

I am writing with reference to the building insurance premium included in the recent service charge accounts for [Specify Period]. Under the RICS Service Charge Residential Management Code and the FCA Insurance Conduct of Business Sourcebook (ICOBS), agents and freeholders are required to maintain complete transparency regarding commissions.

Please provide a detailed breakdown of:
1. The gross premium charged by the insurer.
2. Any broker commissions, placement fees, or administrative fees retained by you, your group companies, or associated parties.
3. Any reward, rebate, or soft commission received directly or indirectly for placing this insurance.
4. Proof of competitive market-testing undertaken to secure this premium.

If this information is withheld, I reserve the right to apply to the First-Tier Tribunal (Property Chamber) under Section 27A of the Landlord and Tenant Act 1985 to dispute the reasonableness of these management fees and insurance costs.

I look forward to your response within 14 days.

Yours faithfully,

[Signature]`
  },
  {
    id: 's20_breach',
    name: 'S.20 Consultation Breach Objection',
    description: 'Object to service charges for major building works of over £250 per unit where the landlord failed to run a statutory Section 20 consultation.',
    statutoryBasis: 'Section 20, Landlord and Tenant Act 1985',
    defaultText: `[Your Name]
[Property Address]
[Date]

[Managing Agent / Freeholder Name]
[Address]

Re: CHALLENGE TO MAJOR WORKS CONTRIBUTION — BREACH OF SECTION 20 CONSULTATION LIMITS

Dear Sir/Madam,

I am the leaseholder of [Property Address].

I refer to the service charge demand dated [Date of Demand] in the sum of [Amount] in respect of major works completed/planned at [Building Name]. 

According to Section 20 of the Landlord and Tenant Act 1985 (as amended by the Commonhold and Leasehold Reform Act 2002), a landlord must consult leaseholders if the contribution of any single leaseholder to major works exceeds £250. 

As you have failed to:
- Serve a statutory Stage 1 Notice of Intention
- Serve a statutory Stage 2 Notice of Estimates and Proposals
- Adequately consult on the selection of qualifying contractors

The statutory consultation requirements have been breached. Unless you have obtained an express dispensation of compliance from the First-Tier Tribunal (Property Chamber) under Section 20ZA, your recovery of costs is capped by law at exactly £250 per leaseholder.

I therefore tender the sum of £250 in full and final settlement of my contribution towards these works. Any balance demanded is disputed and irrecoverable under statutory limits.

Yours faithfully,

[Signature]`
  }
];
