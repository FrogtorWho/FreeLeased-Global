export interface RightData {
  id: string;
  article: string;
  title: string;
  exception: string;
  effect: string;
  beneficiaries: string[];
  exposed: string[];
  mitigation: string;
}

export interface HousingRisk {
  id: string;
  point: string;
  exploit: string;
  beneficiaries: string[]; // Demographics codes
  exposed: string[]; // Demographics codes
  trends: Record<string, 'up' | 'down' | 'stable'>;
  mitigation: string;
  scale: 'Low' | 'Moderate' | 'High';
}

export interface Demographic {
  code: string;
  label: string;
  type: 'beneficiary' | 'victim' | 'mixed';
}

export enum Section {
  INTRO = 'INTRO',
  RIGHTS = 'RIGHTS',
  HOUSING = 'HOUSING',
  TRENDS = 'TRENDS',
  ACTIONS = 'ACTIONS'
}

export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  statutoryBasis: string;
  defaultText: string;
}
