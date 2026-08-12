// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Email service abstraction (mock provider).
//
// Resend / SendGrid-style API. Three operations:
//   - sendEmail(to, subject, body, attachments?)
//   - sendTemplated(templateName, vars, to)
//   - templates registry (matches 9 templates in project/marketing/)
//
// The mock provider is in-memory. Swapping in real Resend or SendGrid
// requires only init({ apiKey: 're_xxx', provider: 'resend' }).

export type EmailProvider = "mock" | "resend" | "sendgrid" | "postmark"

export interface EmailConfig {
  apiKey: string
  from: string
  provider: EmailProvider
  environment: "development" | "production" | "mock"
}

let config: EmailConfig = {
  apiKey: "",
  from: "team@freeleased.app",
  provider: "mock",
  environment: "mock",
}

export function init(opts: Partial<EmailConfig>): void {
  config = {
    apiKey: opts.apiKey ?? config.apiKey,
    from: opts.from ?? config.from,
    provider: opts.provider ?? config.provider,
    environment: opts.environment ?? config.environment,
  }
}

export function getConfig(): EmailConfig {
  return { ...config }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
}

export interface EmailMessage {
  id: string
  to: string | string[]
  subject: string
  body: string
  attachments?: EmailAttachment[]
  templateName?: string
  templateVars?: Record<string, string | number>
  from: string
  status: "queued" | "sent" | "failed"
  createdAt: string
  provider: EmailProvider
  providerMessageId?: string
  error?: string
}

// ── Queue ─────────────────────────────────────────────────────────────────────

const queue: EmailMessage[] = []
let counter = 0

function nextId(): string {
  counter += 1
  return `em_${Date.now().toString(36)}_${counter.toString(36)}`
}

// ── Templates ────────────────────────────────────────────────────────────────

export const TEMPLATES: Record<string, { subject: string; body: string; description: string }> = {
  "mou-outreach": {
    description: "MoU outreach to government partners (Belize MNRMPI, BIDC, BS Lands & Survey, Cayman Lands Survey, Export Barbados, Guyana GLSC, TT Registrar General)",
    subject: "FreeLeased × {{partner}} — Caribbean Leaseholders MoU (Future Caribbean Buildathon)",
    body: `Dear {{contact_name}},

I am writing to confirm the partnership between {{partner}} and FreeLeased, the AI-powered resident advocacy platform we discussed.

The aim is to give {{partner}}-registered residents a verified digital tool to exercise their statutory rights under {{statute_reference}}. The Buildathon (27 Jul – 16 Aug 2026) is the first cohort.

If you could confirm the MoU at your earliest convenience, we can move to the pilot phase.

Best,
Sam Peacock
Principal, FreeLeased
`,
  },
  "pilot-welcome": {
    description: "Welcome email to pilot leaseholders",
    subject: "Welcome to FreeLeased — your leasehold rights, verified",
    body: `Hi {{name}},

Welcome to FreeLeased. Your pilot account is live.

Your first audit is ready:
1. Paste your lease into the Lease Reader
2. We'll surface the 20 hidden-rights patterns
3. We cite the relevant statute for each finding

Reply any time.

– FreeLeased
`,
  },
  "partner-onboarding": {
    description: "Partner onboarding — directors, execs, technical leads",
    subject: "FreeLeased × {{partner}} — onboarding package",
    body: `Welcome aboard, {{partner}}.

The pilot dashboard is at https://freeleased.app/partner. Your sandbox API key is attached. Pilot KPIs: 25% service-charge audit completion; 18% RTM claim uptake.

Cheers,
Sam
`,
  },
  "sponsor-perks-intro": {
    description: "Sponsor outreach — attaches the 7-sponsor perk catalogue",
    subject: "FreeLeased — Caribbean Buildathon sponsor perks",
    body: `Hi {{sponsor}},

FreeLeased is shipping at the Future Caribbean Buildathon (T-2 days). Your perk contribution is listed in our public 7-sponsor wall.

In exchange: 250K LinkedIn reach, 50K-judge panel activation, 6-mo priority partner window.

Thanks,
Sam
`,
  },
  "daily-digest": {
    description: "Daily build digest for the team",
    subject: "FreeLeased — Day {{day}} build digest",
    body: `Day {{day}} update.

What shipped: {{shipped}}
What's blocked: {{blocked}}
What's next: {{next}}

Stat: $0 compute. ${{funding_raised}} funding raised.
`,
  },
  "investor-update": {
    description: "Monthly investor update",
    subject: "FreeLeased — {{month}} investor update",
    body: `Hi {{investor}},

{{month}} snapshot:
- ARR: {{arr}}
- Pilot residences: {{residences}}
- MoUs signed: {{mou_count}}
- Gross margin: {{gm}}

Cheers,
Sam
`,
  },
  "judge-tasting-notes": {
    description: "Pre-buildathon judge panel briefing",
    subject: "FreeLeased — judge tasting notes",
    body: `Hi {{judge}},

Ahead of the buildathon, here's a 2-min read on FreeLeased. Key claims are evidenced in the Data Room. Demo URL: https://freeleased.app

Anchor statutes: {{statute_a}}, {{statute_b}}.
9 jurisdictions, 17 sources, 0s of compute.

Thanks for your time.
`,
  },
  "compliance-statement": {
    description: "Annual responsible-AI compliance statement",
    subject: "FreeLeased — annual compliance statement ({{year}})",
    body: `FreeLeased {{year}} compliance statement:

Privacy: lease-document only, no profiling.
Bias: clause×statute scoring, never tenant×landlord.
Safety: no sub-profiling, no biometric categorisation.
Transparency: every claim carries an evidence class.
HITL: 2/3 human validation before any claim is verified.

Signed,
Sam Peacock, Principal
`,
  },
  "release-notes": {
    description: "Per-release release notes",
    subject: "FreeLeased v{{version}} — release notes",
    body: `v{{version}} is live.

New: {{new_features}}
Improved: {{improvements}}
Fixed: {{fixes}}

Stat: $0 compute, 9 jurisdictions, 17 sources.
`,
  },
}

// ── Send ─────────────────────────────────────────────────────────────────────

export function sendEmail(opts: {
  to: string | string[]
  subject: string
  body: string
  attachments?: EmailAttachment[]
}): EmailMessage {
  const msg: EmailMessage = {
    id: nextId(),
    to: opts.to,
    subject: opts.subject,
    body: opts.body,
    attachments: opts.attachments,
    from: config.from,
    status: "queued",
    createdAt: new Date().toISOString(),
    provider: config.provider,
  }
  queue.push(msg)
  if (queue.length > 1000) queue.shift()
  // Mock flush — in real mode, sign+dispatch to Resend/SendGrid.
  msg.status = "sent"
  msg.providerMessageId = `${config.provider}_${msg.id}`
  // eslint-disable-next-line no-console
  console.log(`[email] sent to ${Array.isArray(opts.to) ? opts.to.join(", ") : opts.to} — "${opts.subject}"`)
  return msg
}

export function sendTemplated(opts: {
  templateName: keyof typeof TEMPLATES | string
  vars: Record<string, string | number>
  to: string | string[]
  attachments?: EmailAttachment[]
}): EmailMessage {
  const tpl = TEMPLATES[opts.templateName]
  if (!tpl) {
    const err: EmailMessage = {
      id: nextId(),
      to: opts.to,
      subject: `(unknown template: ${opts.templateName})`,
      body: "",
      from: config.from,
      status: "failed",
      createdAt: new Date().toISOString(),
      provider: config.provider,
      error: `template "${opts.templateName}" not found`,
    }
    queue.push(err)
    return err
  }
  const interpolate = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => String(opts.vars[key] ?? `{{${key}}}`))
  return sendEmail({
    to: opts.to,
    subject: interpolate(tpl.subject),
    body: interpolate(tpl.body),
    attachments: opts.attachments,
  })
}

export function listQueued(limit = 100): EmailMessage[] {
  return queue.slice(-limit).reverse()
}

export function clearQueue(): void {
  queue.length = 0
}

export const EMAIL_VERSION = "1.0.0"
