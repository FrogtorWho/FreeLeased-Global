// A.U.R.I Resident Advocacy Platform — data spine
// PROVENANCE: statutes, sources, patterns and jurisdictions below are REAL and
// carry their published citations + public URLs (encoded from the FC briefs'
// primary sources). Resident records (see fixtures.ts) are pseudonymous pilot
// fixtures, NOT real individuals. See PROJECT-JOURNAL.md §0.

export type Conviction =
  | "confirmed" // 🔥
  | "verified" // ✅
  | "primary" // ⭐
  | "quantitative" // 📊
  | "inference" // 💭
  | "pending"; // ⏳

export type JurisdictionCode = "UK" | "BB" | "JM" | "KY" | "TT" | "BS" | "GY" | "BZ" | "VG";

export interface Jurisdiction {
  code: JurisdictionCode;
  name: string;
  capital: string;
  tenureSystem: string;
  registry: { name: string; url: string; conviction: Conviction };
  statisticalOffice: { name: string; url: string };
  centralBank?: { name: string; url: string };
  climate: string;
  inPilot: boolean; // sprint pilot (BB/JM/KY) vs 5-year expansion
  pilotResidents: number;
}

export interface Statute {
  id: string;
  jurisdiction: JurisdictionCode | "UK";
  shortTitle: string;
  citation: string;
  url: string;
  covers: string;
  conviction: Conviction;
  note?: string;
}

export interface DataSource {
  id: string;
  tier: 0 | 1 | 1.5 | 2 | 3 | 4;
  name: string;
  gives: string;
  url: string;
  license: string;
  cadence: "daily" | "weekly" | "monthly" | "on-demand" | "release";
  conviction: Conviction;
  jurisdiction?: JurisdictionCode;
}

// A hidden right is the resident-facing flip of an exploitation pattern.
export interface HiddenRight {
  id: number;
  title: string;
  plain: string; // plain-English explanation for the resident
  statuteIds: string[]; // anchors into STATUTES
  jurisdictions: (JurisdictionCode)[]; // where it applies in the pilot/roadmap
  remedy: string;
  limitationPeriod?: string;
  axis: "resident" | "tenure_building" | "contracts" | "hidden_rights";
  exploitationCounterpart?: string; // the researched exploitation pattern it defends against
  conviction: Conviction;
}

// ─────────────────────────────────────────────────────────────────────────────
// JURISDICTIONS (Brief 02) — 3 pilot + 4 roadmap
// ─────────────────────────────────────────────────────────────────────────────
export const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "UK", name: "United Kingdom", capital: "London",
    tenureSystem: "Freehold & leasehold; registered title under the Land Registration Act 2002 (HM Land Registry)",
    registry: { name: "HM Land Registry", url: "https://www.gov.uk/government/organisations/land-registry", conviction: "verified" },
    statisticalOffice: { name: "Office for National Statistics (ONS)", url: "https://www.ons.gov.uk/" },
    centralBank: { name: "Bank of England", url: "https://www.bankofengland.co.uk/" },
    climate: "Temperate; surface-water & river/coastal flood exposure (Environment Agency flood maps)",
    inPilot: true, pilotResidents: 0,
  },
  {
    code: "BB", name: "Barbados", capital: "Bridgetown",
    tenureSystem: "Title by registration (Torrens-style), Registration of Titles Act Cap. 320",
    registry: { name: "Barbados Land Registry", url: "https://landregistry.gov.bb/", conviction: "verified" },
    statisticalOffice: { name: "Barbados Statistical Service", url: "https://stats.gov.bb/" },
    centralBank: { name: "Central Bank of Barbados", url: "https://www.centralbank.org.bb/" },
    climate: "Atlantic-basin tropical storm & hurricane exposure",
    inPilot: true, pilotResidents: 20,
  },
  {
    code: "JM", name: "Jamaica", capital: "Kingston",
    tenureSystem: "Torrens system, Registration of Titles Act (1889, revised)",
    registry: { name: "National Land Agency (NLA) — eLandjamaica", url: "https://elandjamaica.nla.gov.jm/elandjamaica/", conviction: "verified" },
    statisticalOffice: { name: "Statistical Institute of Jamaica (STATIN)", url: "https://statinja.gov.jm/" },
    centralBank: { name: "Bank of Jamaica", url: "https://www.boj.org.jm/" },
    climate: "Severe Atlantic hurricane exposure (southern edge of basin)",
    inPilot: true, pilotResidents: 15,
  },
  {
    code: "KY", name: "Cayman Islands", capital: "George Town",
    tenureSystem: "Title by registration, Land Registration Act (2011 Revision)",
    registry: { name: "Cayman Lands and Survey Department", url: "https://www.gov.ky/", conviction: "inference" },
    statisticalOffice: { name: "Economics and Statistics Office (ESO)", url: "https://www.eso.ky/" },
    climate: "Severe Atlantic hurricane exposure (primary basin)",
    inPilot: true, pilotResidents: 15,
  },
  {
    code: "TT", name: "Trinidad and Tobago", capital: "Port of Spain",
    tenureSystem: "Title by registration via Registrar General",
    registry: { name: "Trinidad and Tobago Registrar General", url: "https://www.registrargeneral.gov.tt/", conviction: "verified" },
    statisticalOffice: { name: "Central Statistical Office (CSO)", url: "https://cso.gov.tt/" },
    centralBank: { name: "Central Bank of Trinidad and Tobago", url: "https://www.central-bank.org.tt/" },
    climate: "Atlantic hurricane exposure (southern edge); also seismic",
    inPilot: false, pilotResidents: 0,
  },
  {
    code: "BS", name: "The Bahamas", capital: "Nassau",
    tenureSystem: "Department of Lands and Surveys",
    registry: { name: "Department of Lands and Surveys, Government of The Bahamas", url: "https://www.bahamas.gov.bs/", conviction: "inference" },
    statisticalOffice: { name: "Bahamas National Statistical Institute", url: "https://www.bahamas.gov.bs/" },
    climate: "Severe Atlantic hurricane exposure",
    inPilot: false, pilotResidents: 0,
  },
  {
    code: "GY", name: "Guyana", capital: "Georgetown",
    tenureSystem: "Guyana Lands and Surveys Commission (GLSC)",
    registry: { name: "Guyana Land Registry", url: "https://www.landregistry.gov.gy/", conviction: "inference" },
    statisticalOffice: { name: "Bureau of Statistics Guyana", url: "https://statisticsguyana.gov.gy/" },
    climate: "Coastal flood exposure; below-sea-level capital",
    inPilot: false, pilotResidents: 0,
  },
  {
    code: "BZ", name: "Belize", capital: "Belmopan",
    tenureSystem: "Belize Land Registry, Ministry of Natural Resources",
    registry: { name: "Belize Land Registry", url: "https://www.landregistry.gov.bz/", conviction: "inference" },
    statisticalOffice: { name: "Statistical Institute of Belize", url: "https://sib.org.bz/" },
    climate: "Atlantic hurricane & coastal flood exposure",
    inPilot: false, pilotResidents: 0,
  },
  {
    code: "VG", name: "British Virgin Islands", capital: "Road Town",
    tenureSystem: "UK Overseas Territory; title by registration under the Registered Land Act (Cap. 229)",
    registry: { name: "BVI Land Registry (Ministry of Natural Resources & Labour)", url: "https://www.bvi.gov.vg/", conviction: "inference" },
    statisticalOffice: { name: "BVI Central Statistics Office", url: "https://bvi.gov.vg/central-statistics-office" },
    climate: "Severe Atlantic hurricane exposure (Cat-5 Irma, 2017)",
    inPilot: false, pilotResidents: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUTES (Brief 02 / Brief 04) — real citations + public URLs
// ─────────────────────────────────────────────────────────────────────────────
export const STATUTES: Statute[] = [
  { id: "bb-condo", jurisdiction: "BB", shortTitle: "Condominium Act", citation: "Cap. 224A, L.R.O. 1989",
    url: "https://www.barbadosparliament-laws.com/", covers: "Condominium tenure, body-corporate voting thresholds, common-property rules",
    conviction: "verified", note: "Citation corrected 4 Aug 2026 per V3." },
  { id: "bb-rot", jurisdiction: "BB", shortTitle: "Registration of Titles Act", citation: "Cap. 320",
    url: "https://landregistry.gov.bb/", covers: "Title by registration (Torrens)", conviction: "verified" },
  { id: "bb-landtax", jurisdiction: "BB", shortTitle: "Land Tax Act", citation: "Cap. 78A",
    url: "https://stats.gov.bb/", covers: "Annual land-tax band", conviction: "verified" },
  { id: "jm-rot", jurisdiction: "JM", shortTitle: "Registration of Titles Act", citation: "1889, revised",
    url: "https://www.nla.gov.jm/", covers: "Torrens title by registration", conviction: "verified" },
  { id: "jm-strata", jurisdiction: "JM", shortTitle: "Registration (Strata Titles) Act", citation: "Act No. 42 of 1968 (candidate)",
    url: "https://www.nla.gov.jm/", covers: "Strata / condominium ownership",
    conviction: "pending", note: "Candidate only; MoJ portal JS-rendered. Re-source via Jamaica Law Revision Secretariat before citing. 1958 Condominium Act ref dropped 4 Aug 2026 per V3." },
  { id: "jm-nla-act", jurisdiction: "JM", shortTitle: "National Land Agency Act", citation: "2001",
    url: "https://www.nla.gov.jm/", covers: "Defines the NLA remit", conviction: "verified" },
  { id: "ky-strata", jurisdiction: "KY", shortTitle: "Strata Titles Registration Law, 2013 Revision", citation: "Law 14 of 1973",
    url: "https://legislation.gov.ky/cms/images/LEGISLATION/PRINCIPAL/1973/1973-0014/1973-0014_2013%20Revision.pdf",
    covers: "Strata/condominium; unanimous resolution (100%) for Schedule 1 structural; super-majority resolution otherwise",
    conviction: "verified", note: "Corrected 4 Aug 2026 per V3; no 75% threshold in the body of the Law." },
  { id: "ky-lra", jurisdiction: "KY", shortTitle: "Land Registration Act (2011 Revision)", citation: "2011 Revision",
    url: "https://legislation.gov.ky/", covers: "Title by registration", conviction: "verified", note: "Revision year corrected 4 Aug 2026." },
  { id: "ky-buildcode", jurisdiction: "KY", shortTitle: "Cayman Islands Building Code (2013 revision)", citation: "2013 revision",
    url: "https://www.gov.ky/", covers: "Building compliance, hurricane standards", conviction: "verified" },
  { id: "tt-aoa", jurisdiction: "TT", shortTitle: "Apartment Ownership Act", citation: "Ch. 59:01",
    url: "https://agla.gov.tt/", covers: "Apartment/strata ownership", conviction: "verified", note: "Portal at agla.gov.tt per V14." },
  { id: "tt-clpa", jurisdiction: "TT", shortTitle: "Conveyancing and Law of Property Act", citation: "Ch. 56:01",
    url: "https://agla.gov.tt/", covers: "Conveyancing", conviction: "verified" },
  // UK test-case spine (methodology back-port)
  { id: "uk-clra", jurisdiction: "UK", shortTitle: "Commonhold and Leasehold Reform Act 2002 (CLRA 2002)", citation: "s.78 RTM, s.79(3) threshold",
    url: "https://www.legislation.gov.uk/ukpga/2002/15/contents", covers: "Right to Manage, participation threshold", conviction: "verified" },
  { id: "uk-lfra", jurisdiction: "UK", shortTitle: "Leasehold and Freehold Reform Act 2024 (LFRA 2024)", citation: "s.49 (RTM non-residential limit 25%→50%); s.50–52; no-fault RTM",
    url: "https://www.legislation.gov.uk/uksi/2025/131/made", covers: "RTM non-residential limit raised from 25% to 50%; RTM costs; enfranchisement", conviction: "verified", note: "s.49–52 commenced 3 Mar 2025 by SI 2025/131 (Commencement No. 3) — verified against legislation.gov.uk 5 Aug 2026." },
  { id: "uk-lta", jurisdiction: "UK", shortTitle: "Landlord and Tenant Act 1985 (LTA 1985)", citation: "s.19/s.20/s.21/s.21B/s.27A",
    url: "https://www.legislation.gov.uk/ukpga/1985/70/contents", covers: "Service-charge reasonableness, consultation, summary, 6-year limitation, tribunal determination", conviction: "verified" },
  { id: "uk-bsa", jurisdiction: "UK", shortTitle: "Building Safety Act 2022 (BSA 2022)", citation: "ss.80-82 Golden Thread",
    url: "https://www.legislation.gov.uk/ukpga/2022/30/contents", covers: "Golden Thread building-safety information for high-risk buildings", conviction: "verified" },
  { id: "uk-aja", jurisdiction: "UK", shortTitle: "Administration of Justice Act 1970 (AJA 1970)", citation: "s.40",
    url: "https://www.legislation.gov.uk/ukpga/1970/31/section/40", covers: "Protection against harassment of debtors", conviction: "verified" },
  // UK residential-tenancy spine (renting) — launch-market codification
  { id: "uk-ha1988", jurisdiction: "UK", shortTitle: "Housing Act 1988", citation: "Part I; s.21 (assured shorthold)",
    url: "https://www.legislation.gov.uk/ukpga/1988/50/contents", covers: "Assured & assured shorthold tenancies, possession grounds", conviction: "verified" },
  { id: "uk-tfa2019", jurisdiction: "UK", shortTitle: "Tenant Fees Act 2019", citation: "s.1; Sch.1 (deposit cap 5 weeks' rent)",
    url: "https://www.legislation.gov.uk/ukpga/2019/4/contents", covers: "Ban on letting fees; tenancy deposit capped at 5 weeks' rent (6 weeks if annual rent ≥ £50,000)", conviction: "verified" },
  { id: "uk-ha2004", jurisdiction: "UK", shortTitle: "Housing Act 2004", citation: "Part 6 (deposit protection); Part 2 (HMO licensing)",
    url: "https://www.legislation.gov.uk/ukpga/2004/34/contents", covers: "Tenancy deposit protection schemes; HMO licensing; housing health & safety rating (HHSRS)", conviction: "verified" },
  { id: "uk-pea1977", jurisdiction: "UK", shortTitle: "Protection from Eviction Act 1977", citation: "ss.1-3",
    url: "https://www.legislation.gov.uk/ukpga/1977/43/contents", covers: "Unlawful eviction and harassment of residential occupiers; requirement for court order", conviction: "verified" },
  { id: "uk-lta1985-s11", jurisdiction: "UK", shortTitle: "Landlord and Tenant Act 1985 (repairs)", citation: "s.11",
    url: "https://www.legislation.gov.uk/ukpga/1985/70/section/11", covers: "Landlord's non-excludable repairing obligation (structure, exterior, installations)", conviction: "verified" },
  { id: "uk-hfhha2018", jurisdiction: "UK", shortTitle: "Homes (Fitness for Human Habitation) Act 2018", citation: "amends LTA 1985 s.9A",
    url: "https://www.legislation.gov.uk/ukpga/2018/34/contents", covers: "Implied covenant that a dwelling is fit for human habitation throughout the tenancy", conviction: "verified" },
  { id: "uk-rra2025", jurisdiction: "UK", shortTitle: "Renters' Rights Act 2025", citation: "abolition of s.21; periodic tenancies",
    url: "https://www.legislation.gov.uk/", covers: "Abolition of 'no-fault' s.21 eviction; move to periodic assured tenancies; rent-increase controls",
    conviction: "inference", note: "Commencement/Royal Assent status must be verified against legislation.gov.uk before citing a live section; treat as transitional." },
  // British Virgin Islands (UK Overseas Territory) — roadmap
  { id: "vg-rla", jurisdiction: "VG", shortTitle: "Registered Land Act", citation: "Cap. 229",
    url: "https://www.bvi.gov.vg/", covers: "Title by registration", conviction: "inference",
    note: "Citation to be verified against the BVI Gazette / laws portal before display." },
  { id: "vg-condo", jurisdiction: "VG", shortTitle: "Condominium Act", citation: "candidate",
    url: "https://www.bvi.gov.vg/", covers: "Condominium / strata ownership", conviction: "pending",
    note: "Candidate only; confirm existence and citation via BVI Attorney General's Chambers before citing." },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA SOURCES — Tier 0 (supra-national) / 1 (registries) / 1.5 (OSM+Overture)
//   / 2 (statutes) / 3 (climate+macro) / 4 (test cases)  (Brief 04 / 05)
// ─────────────────────────────────────────────────────────────────────────────
export const SOURCES: DataSource[] = [
  { id: "ccccc", tier: 0, name: "Caribbean Community Climate Change Centre (CCCCC)", gives: "Hurricane, flood, sea-level rise", url: "https://www.caribbeanclimate.bz/", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "cdb", tier: 0, name: "Caribbean Development Bank (CDB)", gives: "Macro indicators, property price index, GDP per capita", url: "https://www.caribank.org/", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "ccrif", tier: 0, name: "CCRIF SPC", gives: "Parametric insurance payouts, country-level risk", url: "https://www.ccrif.org/", license: "public", cadence: "weekly", conviction: "verified" },
  { id: "wb-ckp", tier: 0, name: "World Bank Climate Knowledge Portal", gives: "Country-level climate projections", url: "https://climateknowledgeportal.worldbank.org/country-profiles", license: "CC-BY 4.0", cadence: "monthly", conviction: "verified" },
  { id: "emdat", tier: 0, name: "EM-DAT (CRED / UCLouvain)", gives: "Historical disaster events", url: "https://www.emdat.be/", license: "public/academic", cadence: "monthly", conviction: "verified" },
  { id: "ccj", tier: 0, name: "Caribbean Court of Justice (CCJ)", gives: "Original & appellate judgments", url: "https://www.ccj.org/", license: "public", cadence: "on-demand", conviction: "verified" },
  { id: "caricom-stats", tier: 0, name: "CARICOM Regional Statistics", gives: "Cross-Caribbean statistics", url: "https://statistics.caricom.org/", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "unhabitat", tier: 0, name: "UN-Habitat Caribbean", gives: "Housing policy, tenure data", url: "https://unhabitat.org/caribbean", license: "public", cadence: "on-demand", conviction: "verified" },
  // Tier 1 registries + statistical offices (pilot)
  { id: "bidc", tier: 1, name: "Barbados Investment and Development Corporation (BIDC)", gives: "Economic indicators; gateway to Barbados Land Registry", url: "https://www.bidc.org/", license: "public", cadence: "daily", conviction: "verified", jurisdiction: "BB" },
  { id: "bss", tier: 1, name: "Barbados Statistical Service", gives: "Population, housing, property price index", url: "https://stats.gov.bb/", license: "public", cadence: "monthly", conviction: "verified", jurisdiction: "BB" },
  { id: "nla-jamprop", tier: 1, name: "NLA JAMPROP (Jamaica Property Sales Data)", gives: "Public property sales records, comparables", url: "https://jampropsales.nla.gov.jm/", license: "public", cadence: "daily", conviction: "verified", jurisdiction: "JM" },
  { id: "nla-eland", tier: 1, name: "NLA eLandjamaica", gives: "Electronic land registry portal", url: "https://elandjamaica.nla.gov.jm/elandjamaica/", license: "public", cadence: "daily", conviction: "verified", jurisdiction: "JM" },
  { id: "statin", tier: 1, name: "Statistical Institute of Jamaica (STATIN)", gives: "Population, housing, CPI, GDP", url: "https://statinja.gov.jm/", license: "public", cadence: "monthly", conviction: "verified", jurisdiction: "JM" },
  { id: "cima", tier: 1, name: "Cayman Islands Monetary Authority (CIMA)", gives: "Company registry, beneficial ownership", url: "https://www.cima.ky/", license: "public", cadence: "weekly", conviction: "verified", jurisdiction: "KY" },
  { id: "eso", tier: 1, name: "Cayman Economics and Statistics Office (ESO)", gives: "Population, housing, CPI, GDP", url: "https://www.eso.ky/", license: "public", cadence: "monthly", conviction: "verified", jurisdiction: "KY" },
  // UK launch-market sources
  { id: "uk-hmlr-ppd", tier: 1, name: "HM Land Registry — Price Paid Data", gives: "Sold-price transactions (England & Wales), comparables", url: "https://www.gov.uk/government/statistical-data-sets/price-paid-data", license: "OGL v3 (attribution required)", cadence: "monthly", conviction: "verified", jurisdiction: "UK" },
  { id: "uk-ons", tier: 1, name: "Office for National Statistics (ONS)", gives: "Private rental prices, house price index, CPI, housing stock", url: "https://www.ons.gov.uk/economy/inflationandpriceindices", license: "OGL v3 (attribution required)", cadence: "monthly", conviction: "verified", jurisdiction: "UK" },
  { id: "uk-legislation", tier: 2, name: "legislation.gov.uk (The National Archives)", gives: "Primary statute & SI full text (revised)", url: "https://www.legislation.gov.uk/", license: "OGL v3 (attribution required)", cadence: "on-demand", conviction: "verified", jurisdiction: "UK" },
  { id: "uk-ea-flood", tier: 3, name: "Environment Agency — Flood Risk", gives: "Surface-water, river & coastal flood risk", url: "https://www.gov.uk/check-long-term-flood-risk", license: "OGL v3 (attribution required)", cadence: "monthly", conviction: "verified", jurisdiction: "UK" },
  // BVI (roadmap)
  { id: "vg-cso", tier: 1, name: "BVI Central Statistics Office", gives: "Population, housing, CPI", url: "https://bvi.gov.vg/central-statistics-office", license: "public", cadence: "monthly", conviction: "inference", jurisdiction: "VG" },
  // Tier 1.5 workaround (Brief 05)
  { id: "osm", tier: 1.5, name: "OpenStreetMap (Overpass API)", gives: "Building & landuse footprints", url: "https://overpass-api.de/", license: "ODbL / CC-BY-SA", cadence: "daily", conviction: "verified" },
  { id: "overture", tier: 1.5, name: "Overture Maps (buildings release)", gives: "Building footprints (MS/Meta/Amazon/TomTom open data)", url: "https://overturemaps.org/", license: "ODbL", cadence: "release", conviction: "verified" },
  // Tier 3 climate + macro
  { id: "noaa", tier: 3, name: "NOAA HURDAT2", gives: "Historical Atlantic hurricane tracks", url: "https://www.nhc.noaa.gov/data/", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "cimh", tier: 3, name: "Caribbean Institute for Meteorology and Hydrology (CIMH)", gives: "Regional meteorology & hydrology", url: "https://www.cimh.edu.bb/", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "imf-weo", tier: 3, name: "IMF World Economic Outlook", gives: "Macro projections", url: "https://www.imf.org/en/Publications/WEO", license: "public", cadence: "monthly", conviction: "verified" },
  { id: "wb-ppi", tier: 3, name: "World Bank property price / CPI indicator", gives: "Property price index, CPI", url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG", license: "CC-BY 4.0", cadence: "monthly", conviction: "verified" },
];

export { HIDDEN_RIGHTS } from "./patterns.ts";
