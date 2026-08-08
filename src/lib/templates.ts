// Correspondence Templates — jurisdiction-specific letter templates.
//
// Open-source templates for UK + Caribbean leasehold/governance correspondence.
// Each template has {{variable}} placeholders, legal references, and tier gating.
//
// Premium integrations (tier: "pro"/"enterprise") use the same template engine
// but add solicitor-reviewed content, automated filing, and compliance checking.

// ── Types ──────────────────────────────────────────────────────

export interface TemplateVariable {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea";
  required: boolean;
  options?: string[];        // for select type
  defaultValue?: string;
  helpText?: string;
}

export interface CorrespondenceTemplate {
  id: string;
  name: string;
  jurisdictionCode: "UK" | "KY" | "BB" | "JM";
  category: "rtm" | "service_charge" | "building_safety" | "enfranchisement" | "general";
  subject: string;
  body: string;
  legalRefs: string[];
  variables: TemplateVariable[];
  tier: "free" | "pro" | "enterprise";
  isOss: boolean;
}

// ── Template Library ───────────────────────────────────────────

export const TEMPLATES: CorrespondenceTemplate[] = [
  // ─── UK Templates ───────────────────────────────────────────
  {
    id: "uk_s20_notice",
    name: "Section 20 Consultation Notice",
    jurisdictionCode: "UK",
    category: "service_charge",
    subject: "Section 20 Consultation — Proposed Major Works",
    body: `Dear {{recipient_name}},

NOTICE UNDER SECTION 20 OF THE LANDLORD AND TENANT ACT 1985

We write in connection with proposed major works to the building at {{building_address}}.

In accordance with Section 20 of the Landlord and Tenant Act 1985, we are required to consult you before carrying out works costing more than {{cost_threshold}} per leaseholder in any twelve-month period.

Description of Proposed Works:
{{works_description}}

Estimated Cost: {{estimated_cost}}
Estimated Duration: {{estimated_duration}}
Proposed Start Date: {{start_date}}

You have the right to make observations within {{consultation_period}} of the date of this notice. Please direct any observations to {{management_address}}.

Yours sincerely,
{{sender_name}}
{{sender_title}}`,
    legalRefs: [
      "Landlord and Tenant Act 1985, s.20",
      "Landlord and Tenant Act 1985, s.20ZA",
      "Service Charges (Consultation Requirements) Regulations 2003",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name", type: "text", required: true },
      { name: "building_address", label: "Building Address", type: "text", required: true },
      { name: "cost_threshold", label: "Cost Threshold", type: "text", required: true, defaultValue: "£250" },
      { name: "works_description", label: "Description of Works", type: "textarea", required: true },
      { name: "estimated_cost", label: "Estimated Total Cost", type: "text", required: true },
      { name: "estimated_duration", label: "Estimated Duration", type: "text", required: true },
      { name: "start_date", label: "Proposed Start Date", type: "date", required: true },
      { name: "consultation_period", label: "Consultation Period", type: "text", required: true, defaultValue: "30 days" },
      { name: "management_address", label: "Management Address", type: "text", required: true },
      { name: "sender_name", label: "Your Name", type: "text", required: true },
      { name: "sender_title", label: "Your Title/Role", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },
  {
    id: "uk_rtm_notice",
    name: "Notice of Intent to Exercise RTM",
    jurisdictionCode: "UK",
    category: "rtm",
    subject: "Notice of Claim to Exercise Right to Manage",
    body: `To: {{freeholder_name}}
Address: {{freeholder_address}}

NOTICE PURSUANT TO SECTION 72 OF THE COMMONHOLD AND LEASEHOLD REFORM ACT 2002

Dear Sir/Madam,

We, the qualifying tenants of {{building_address}}, hereby give notice that we intend to exercise the Right to Manage in respect of the above premises pursuant to Part 2 of the Commonhold and Leasehold Reform Act 2002.

Building Name: {{building_name}}
Address: {{building_address}}
Number of flats in premises: {{total_flats}}
Number of qualifying tenants claiming RTM: {{qualifying_tenants}}

Our nominated RTM company is:
Company Name: {{company_name}}
Registered Office: {{company_address}}

The grounds on which we claim are:
1. The premises are a self-contained building or part of a building.
2. At least two-thirds of the flats are held by qualifying tenants.
3. None of the flats are held by a freeholder who is also a qualifying tenant.
4. The RTM company satisfies the requirements of sections 73-76 of the 2002 Act.

We request that you provide the prescribed information within {{response_period}} of service of this notice.

Yours faithfully,
{{signatory_name}}
On behalf of {{company_name}}`,
    legalRefs: [
      "Commonhold and Leasehold Reform Act 2002, Part 2, ss.72-96",
      "Right to Manage (Prescribed Particulars and Forms) Regulations 2009",
    ],
    variables: [
      { name: "freeholder_name", label: "Freeholder Name", type: "text", required: true },
      { name: "freeholder_address", label: "Freeholder Address", type: "textarea", required: true },
      { name: "building_name", label: "Building Name", type: "text", required: true },
      { name: "building_address", label: "Building Address", type: "textarea", required: true },
      { name: "total_flats", label: "Total Number of Flats", type: "number", required: true },
      { name: "qualifying_tenants", label: "Qualifying Tenants (count)", type: "number", required: true },
      { name: "company_name", label: "RTM Company Name", type: "text", required: true },
      { name: "company_address", label: "RTM Company Registered Office", type: "textarea", required: true },
      { name: "response_period", label: "Response Period", type: "text", required: true, defaultValue: "2 months" },
      { name: "signatory_name", label: "Signatory Name", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },
  {
    id: "uk_service_charge_query",
    name: "Service Charge Query / Demand Challenge",
    jurisdictionCode: "UK",
    category: "service_charge",
    subject: "Query Regarding Service Charge Demand",
    body: `Dear {{recipient_name}},

Re: Service Charge Demand — {{building_address}} / Flat {{flat_number}}

I write in response to the service charge demand dated {{demand_date}} for the period {{charge_period}}.

The amount demanded is {{amount_demanded}}.

I have the following queries regarding this demand:

{{query_details}}

Under Section 21 of the Landlord and Tenant Act 1985, I am entitled to request a summary of the costs making up the service charge, including copies of accounts, receipts, and contracts.

Under Section 22, I am entitled to withhold payment pending resolution of any reasonably contested matter.

I look forward to your response within {{response_period}}.

Yours faithfully,
{{sender_name}}
{{flat_number}}, {{building_address}}`,
    legalRefs: [
      "Landlord and Tenant Act 1985, s.21 (right to information)",
      "Landlord and Tenant Act 1985, s.22 (withholding payment)",
      "Service Charges (Consultation Requirements) Regulations 2003",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name", type: "text", required: true },
      { name: "building_address", label: "Building Address", type: "text", required: true },
      { name: "flat_number", label: "Flat Number", type: "text", required: true },
      { name: "demand_date", label: "Demand Date", type: "date", required: true },
      { name: "charge_period", label: "Charge Period", type: "text", required: true },
      { name: "amount_demanded", label: "Amount Demanded", type: "text", required: true },
      { name: "query_details", label: "Your Query Details", type: "textarea", required: true },
      { name: "response_period", label: "Expected Response Period", type: "text", required: true, defaultValue: "30 days" },
      { name: "sender_name", label: "Your Name", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },
  {
    id: "uk_building_safety_notice",
    name: "Building Safety Act Concern Notice",
    jurisdictionCode: "UK",
    category: "building_safety",
    subject: "Building Safety Concern — {{building_address}}",
    body: `Dear {{recipient_name}},

RE: BUILDING SAFETY CONCERN — {{building_address}}

I am writing to raise a building safety concern regarding the above premises under the Building Safety Act 2022.

The concern relates to: {{concern_description}}

Specific safety issues identified:
{{safety_issues}}

Under Section 92 of the Building Safety Act 2022, the building safety case must demonstrate that risks to the safety of all people in or about the building have been identified and are being, or will be, properly managed.

I request that:
1. This concern is logged in the building safety case.
2. A remediation assessment is conducted within {{assessment_timeline}}.
3. I am kept informed of actions taken.

Yours faithfully,
{{sender_name}}
{{flat_number}}, {{building_address}}`,
    legalRefs: [
      "Building Safety Act 2022, ss.88-92",
      "Building Safety Act 2022, Part 4 (Higher-Risk Buildings)",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name", type: "text", required: true },
      { name: "building_address", label: "Building Address", type: "textarea", required: true },
      { name: "concern_description", label: "Concern Description", type: "textarea", required: true },
      { name: "safety_issues", label: "Specific Safety Issues", type: "textarea", required: true },
      { name: "assessment_timeline", label: "Assessment Timeline", type: "text", required: true, defaultValue: "28 days" },
      { name: "sender_name", label: "Your Name", type: "text", required: true },
      { name: "flat_number", label: "Flat Number", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },

  // ─── Caribbean Templates ────────────────────────────────────
  {
    id: "ky_strata_bylaws_request",
    name: "Strata Bylaws Information Request",
    jurisdictionCode: "KY",
    category: "general",
    subject: "Request for Strata Bylaws and Financial Records",
    body: `Dear {{recipient_name}},

Re: {{building_name}} — Request for Strata Information

Pursuant to the Strata Corporations Act (2019 Revision), I am a unit owner in {{building_name}} and request the following:

1. A current copy of the strata bylaws and rules.
2. The audited financial statements for the last {{financial_years}} fiscal years.
3. The minutes of the last {{meeting_count}} general meetings.
4. A schedule of all common expenses and assessments.

As a unit owner, I am entitled to inspect and copy these records under Section 33 of the Strata Corporations Act.

Please provide these documents within {{response_period}}.

Yours faithfully,
{{sender_name}}
Unit {{unit_number}}, {{building_name}}`,
    legalRefs: [
      "Strata Corporations Act (2019 Revision), s.33",
      "Strata Corporations Act (2019 Revision), s.47",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name (Strata Manager)", type: "text", required: true },
      { name: "building_name", label: "Building/Strata Name", type: "text", required: true },
      { name: "financial_years", label: "Number of Financial Years", type: "number", required: true, defaultValue: "2" },
      { name: "meeting_count", label: "Number of General Meetings", type: "number", required: true, defaultValue: "3" },
      { name: "response_period", label: "Response Period", type: "text", required: true, defaultValue: "14 days" },
      { name: "sender_name", label: "Your Name", type: "text", required: true },
      { name: "unit_number", label: "Your Unit Number", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },
  {
    id: "bb_management_complaint",
    name: "Common Area Management Complaint",
    jurisdictionCode: "BB",
    category: "service_charge",
    subject: "Formal Complaint — Common Area Maintenance",
    body: `Dear {{recipient_name}},

Re: {{building_name}} — Formal Complaint re: Common Area Maintenance

I write to formally complain about the state of the common areas at {{building_name}}.

The specific issues are:
{{complaint_details}}

Under the Condominium Act of Barbados, the corporation has a duty to maintain, repair, and replace common property (Section {{section_ref}}).

I request:
1. Acknowledgment of this complaint within {{acknowledgment_period}}.
2. A remediation plan within {{remediation_timeline}}.
3. An update on any insurance claims related to these issues.

If this matter is not resolved satisfactorily, I reserve the right to escalate to the relevant authorities.

Yours faithfully,
{{sender_name}}
Unit {{unit_number}}, {{building_name}}`,
    legalRefs: [
      "Condominium Act of Barbados, s.24 (maintenance duties)",
      "Condominium Act of Barbados, s.31 (corporation obligations)",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name", type: "text", required: true },
      { name: "building_name", label: "Building Name", type: "text", required: true },
      { name: "complaint_details", label: "Complaint Details", type: "textarea", required: true },
      { name: "section_ref", label: "Legal Section Reference", type: "text", required: true, defaultValue: "24" },
      { name: "acknowledgment_period", label: "Acknowledgment Period", type: "text", required: true, defaultValue: "7 days" },
      { name: "remediation_timeline", label: "Remediation Timeline", type: "text", required: true, defaultValue: "30 days" },
      { name: "sender_name", label: "Your Name", type: "text", required: true },
      { name: "unit_number", label: "Your Unit Number", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },
  {
    id: "jm_strata_notice",
    name: "Strata Corporation Meeting Notice",
    jurisdictionCode: "JM",
    category: "general",
    subject: "Notice of Extraordinary General Meeting",
    body: `NOTICE OF EXTRAORDINARY GENERAL MEETING

TO: All Members of {{strata_name}}

Date: {{meeting_date}}
Time: {{meeting_time}}
Venue: {{meeting_venue}}

NOTICE IS HEREBY GIVEN pursuant to Section 17 of the Registration of Titles Act and the Strata Plans regulations, that an Extraordinary General Meeting of the members of {{strata_name}} will be held at the time and place specified above.

AGENDA:
1. Adoption of {{agenda_item_1}}
2. {{agenda_item_2}}
3. {{agenda_item_3}}
4. Any Other Business

{{additional_notes}}

By Order of the Board,
{{secretary_name}}
Secretary, {{strata_name}}`,
    legalRefs: [
      "Registration of Titles Act, s.53",
      "Strata Plans regulations",
    ],
    variables: [
      { name: "strata_name", label: "Strata/Corporation Name", type: "text", required: true },
      { name: "meeting_date", label: "Meeting Date", type: "date", required: true },
      { name: "meeting_time", label: "Meeting Time", type: "text", required: true },
      { name: "meeting_venue", label: "Meeting Venue", type: "text", required: true },
      { name: "agenda_item_1", label: "Agenda Item 1", type: "text", required: true },
      { name: "agenda_item_2", label: "Agenda Item 2", type: "text", required: false },
      { name: "agenda_item_3", label: "Agenda Item 3", type: "text", required: false },
      { name: "additional_notes", label: "Additional Notes", type: "textarea", required: false },
      { name: "secretary_name", label: "Secretary Name", type: "text", required: true },
    ],
    tier: "free",
    isOss: true,
  },

  // ─── Premium Templates (Pro tier) ──────────────────────────
  {
    id: "uk_forfeiture_defence",
    name: "Forfeiture Defence Letter (Solicitor Draft)",
    jurisdictionCode: "UK",
    category: "general",
    subject: "Defence Against Notice of Forfeiture",
    body: `PROFESSIONAL CORRESPONDENCE — SOLICITOR DRAFT

[This template is reviewed by qualified solicitors. Premium tier.]

Dear {{recipient_name}},

Re: {{building_address}} / Flat {{flat_number}} — Defence Against Forfeiture

We act on behalf of {{client_name}} in connection with the above matter.

We have reviewed the Notice of Forfeiture dated {{forfeiture_date}} and note the following:

1. {{defence_point_1}}
2. {{defence_point_2}}
3. {{defence_point_3}}

Under Section 146 of the Law of Property Act 1925, a landlord cannot exercise the right of forfeiture without first serving a notice giving the tenant a reasonable opportunity to remedy the breach.

Furthermore, under the Leasehold Reform, Housing and Urban Development Act 1993, s.138, the court has discretion to grant relief from forfeiture.

We reserve our client's rights and remedies under statute and at common law.

We look forward to your response within {{response_period}}.

Yours faithfully,
{{solicitor_name}}
{{firm_name}}`,
    legalRefs: [
      "Law of Property Act 1925, s.146",
      "Leasehold Reform, Housing and Urban Development Act 1993, s.138",
      "Administration of Justice Act 1973, s.38",
    ],
    variables: [
      { name: "recipient_name", label: "Recipient Name", type: "text", required: true },
      { name: "building_address", label: "Building Address", type: "text", required: true },
      { name: "flat_number", label: "Flat Number", type: "text", required: true },
      { name: "client_name", label: "Client Name", type: "text", required: true },
      { name: "forfeiture_date", label: "Forfeiture Notice Date", type: "date", required: true },
      { name: "defence_point_1", label: "Defence Point 1", type: "textarea", required: true },
      { name: "defence_point_2", label: "Defence Point 2", type: "textarea", required: true },
      { name: "defence_point_3", label: "Defence Point 3", type: "textarea", required: true },
      { name: "response_period", label: "Response Period", type: "text", required: true, defaultValue: "14 days" },
      { name: "solicitor_name", label: "Solicitor Name", type: "text", required: true },
      { name: "firm_name", label: "Law Firm Name", type: "text", required: true },
    ],
    tier: "pro",
    isOss: false,
  },
  {
    id: "uk_enfranchisement_claim",
    name: "Collective Enfranchisement Claim",
    jurisdictionCode: "UK",
    category: "enfranchisement",
    subject: "Claim to Exercise Collective Enfranchisement",
    body: `PROFESSIONAL CORRESPONDENCE — SOLICITOR DRAFT

To: {{freeholder_name}}
Address: {{freeholder_address}}

NOTICE OF CLAIM TO EXERCISE COLLECTIVE ENFRANCHISEMENT

Pursuant to Part I, Chapter II of the Leasehold Reform, Housing and Urban Development Act 1993, we act on behalf of the qualifying tenants of {{building_address}}.

We hereby give notice that our clients, being qualifying tenants of not less than two-thirds of the flats in the building, claim to exercise the right to collective enfranchisement.

Building: {{building_address}}
Total flats: {{total_flats}}
Qualifying tenants: {{qualifying_tenants}}
Nominated purchaser: {{purchaser_company}}

The price offered for the freehold is {{offered_price}} based on the formula in Schedule 6 to the 1993 Act.

We request that the freeholder confirms receipt and provides the prescribed information within {{response_period}}.

Yours faithfully,
{{solicitor_name}}
{{firm_name}}`,
    legalRefs: [
      "Leasehold Reform, Housing and Urban Development Act 1993, ss.1-64",
      "Leasehold Reform, Housing and Urban Development Act 1993, Schedule 6",
    ],
    variables: [
      { name: "freeholder_name", label: "Freeholder Name", type: "text", required: true },
      { name: "freeholder_address", label: "Freeholder Address", type: "textarea", required: true },
      { name: "building_address", label: "Building Address", type: "textarea", required: true },
      { name: "total_flats", label: "Total Number of Flats", type: "number", required: true },
      { name: "qualifying_tenants", label: "Qualifying Tenants (count)", type: "number", required: true },
      { name: "purchaser_company", label: "Nominated Purchaser Company", type: "text", required: true },
      { name: "offered_price", label: "Offered Price", type: "text", required: true },
      { name: "response_period", label: "Response Period", type: "text", required: true, defaultValue: "2 months" },
      { name: "solicitor_name", label: "Solicitor Name", type: "text", required: true },
      { name: "firm_name", label: "Law Firm Name", type: "text", required: true },
    ],
    tier: "enterprise",
    isOss: false,
  },
];

// ── Template Engine ────────────────────────────────────────────

/**
 * Render a template by substituting {{variables}} with provided values.
 * Returns the rendered text with any unfilled required variables flagged.
 */
export function renderTemplate(
  template: CorrespondenceTemplate,
  values: Record<string, string>,
): { text: string; missingRequired: string[] } {
  let text = template.body;
  const missingRequired: string[] = [];

  for (const variable of template.variables) {
    const value = values[variable.name] || variable.defaultValue || "";
    if (!value && variable.required) {
      missingRequired.push(variable.name);
    }
    const placeholder = `{{${variable.name}}}`;
    text = text.replaceAll(placeholder, value || `[${variable.label}]`);
  }

  return { text, missingRequired };
}

/**
 * Filter templates by jurisdiction, category, and tier.
 */
export function filterTemplates(
  jurisdictionCode?: string,
  category?: string,
  tier?: string,
): CorrespondenceTemplate[] {
  return TEMPLATES.filter(t => {
    if (jurisdictionCode && t.jurisdictionCode !== jurisdictionCode) return false;
    if (category && t.category !== category) return false;
    if (tier === "free" && t.tier !== "free") return false;
    if (tier === "pro" && t.tier === "enterprise") return false;
    return true;
  });
}

/**
 * Get available jurisdictions from template library.
 */
export function getJurisdictions(): Array<{ code: string; name: string; templateCount: number }> {
  const names: Record<string, string> = {
    UK: "United Kingdom",
    KY: "Cayman Islands",
    BB: "Barbados",
    JM: "Jamaica",
  };
  const counts: Record<string, number> = {};
  for (const t of TEMPLATES) {
    counts[t.jurisdictionCode] = (counts[t.jurisdictionCode] || 0) + 1;
  }
  return Object.entries(counts).map(([code, templateCount]) => ({
    code,
    name: names[code] || code,
    templateCount,
  }));
}
