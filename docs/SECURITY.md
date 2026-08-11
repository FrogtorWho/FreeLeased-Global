# Security Disclosure Policy

**FreeLeased — Open-source Leasehold Governance Platform**
**Effective:** 2026-08-11 · **Version:** 1.0

> **TL;DR** — Found a security issue? Email
> `sam.peacock1@gmail.com` with subject `SECURITY` and
> PGP-key-encrypted details (key fingerprint below).
> We respond within **72 hours** and pay bounties where
> applicable.

FreeLeased takes the security of its hosted Service, code,
data, and users seriously. This policy describes:

1. How to report a vulnerability
2. What to expect from us
3. Our scope (what's in / what's out)
4. Our bounty programme (small but real)
5. Safe-harbour clauses for good-faith researchers

---

## 1. Reporting a vulnerability

| Channel | Address | When to use |
|---|---|---|
| **Email (preferred)** | `sam.peacock1@gmail.com` subject `SECURITY:` + short title | All reports |
| **PGP-encrypted** | Same address; see key below | Anything containing exploit code or live PII |
| **GitHub Security Advisories** | https://github.com/sam-peacock/FreeLeased-Global/security/advisories/new | Code-only issues |
| **Signal** | `+44 7700 900000` (Sam to confirm before externalising) | Voice/urgent |

**Please do NOT** open a public GitHub issue for security
reports. Open issues let attackers see what we're fixing.

---

## 2. PGP key

> The production PGP key is rotated quarterly. Current:

```
Fingerprint: 0000 0000 0000 0000 0000  0000 0000 0000 0000 0000
UID:          Sam Peacock <sam.peacock1@gmail.com>
Type:         ed25519
Expires:      2027-08-11
```

**Note on this template:** The fingerprint above is a
placeholder. When the project goes public on GitHub, the
real fingerprint will be published at
[`docs/SECURITY.md`](SECURITY.md:1) and the GitHub Security
Advisories flow.

---

## 3. What to include in your report

A great report looks like:

1. **Summary** — one sentence.
2. **Affected component** — file:line, endpoint, or surface.
3. **Severity estimate** — Critical / High / Medium / Low.
4. **Steps to reproduce** — minimal, copy-pasteable.
5. **Impact** — what the attacker achieves.
6. **Suggested fix** — optional, appreciated.

Please redact any PII you see in your report. We'd rather
receive a placeholder than your own data.

---

## 4. Our commitments (and timeline)

| Stage | Time | Action |
|---|---|---|
| Acknowledge | ≤ **72 hours** | Reply with confirmation + ticket ID |
| Triage | ≤ **7 days** | Severity, scope, in-s/out-of-s |
| Status update | Every 14 days | Until resolution |
| Patch (Critical) | ≤ **7 days** | Coordinated disclosure |
| Patch (High) | ≤ **30 days** | Same |
| Patch (Medium/Low) | ≤ **90 days** | Batched into next minor |
| Public disclosure | On patch | GitHub Security Advisory + `CHANGELOG.md` entry |

We follow **coordinated disclosure**. We ask that you give
us the agreed time-window before going public.

---

## 5. Scope

### 5.1 In scope

- The FreeLeased hosted Service (`*.freeleased.org`,
  including the API, web UI, and PWA)
- The FreeLeased marketing site (`freeleased.org`)
- The FreeLeased GitHub repository
  (`github.com/sam-peacock/FreeLeased-Global`)
- The inference endpoints at `inference.freeleased.org`
  (Nebius / Giotto / MiniMax fallbacks; **only**
  vulnerabilities where FreeLeased introduces the issue)
- OllyGarden OTLP export endpoint — vulnerabilities in
  the exporter **only**

### 5.2 Out of scope (be a good neighbour)

- Third-party providers (Vercel, Supabase, Nebius, Giotto,
  MiniMax, OllyGarden) — report directly to them
- Open ports on a researcher's own devices
- Denial-of-service attacks on production (we run rate limits;
  don't burn our budget)
- Social engineering of the Founder or any contributor
- Physical attacks
- "Theoretical" vulnerabilities without a proof-of-concept
- Issues only reproducible on outdated browsers we don't
  support (we support current Chrome / Firefox / Safari /
  Edge; +1 previous major version)

### 5.3 Not vulnerabilities

- The fact that lease uploads to the cloud LLM make claim
  text visible to the inference provider — that is
  **documented and consent-gated** in
  [`PRIVACY.md` §3](PRIVACY.md#3-lawful-basis-uk-gdpr-article-6).
- The fact that the public marketing site has no JS
  fingerprinting — that's a feature.
- The fact that self-hosted deployments inherit all of the
  operator's choices — that's the licence.

---

## 6. Bounty programme

| Severity | Reward | Notes |
|---|---|---|
| Critical (RCE, full account takeover) | **£500 + credit** | Subject to grant funding availability |
| High (auth bypass, PII leak) | **£200 + credit** | |
| Medium (XSS, CSRF on signed form) | **£50 + credit** | |
| Low (info disclosure, missing header) | **Credit only** | Recognised in `CREDITS.md` |

Bounties are paid via bank transfer, Wise, or a public-good
donation in your name. We do not yet have a HackerOne or
Bugcrowd account; we're an early-stage project.

The "credit" line goes in [`CREDITS.md`](../CREDITS.md) and
in [`CHANGELOG-public.md`](CHANGELOG-public.md) on the patch
release, with your permission.

---

## 7. Safe harbour

We will not pursue legal action against, request law
enforcement investigation of, or restrict your account for,
research conducted in good-faith accordance with this policy
and coordinated disclosure.

If a third party (e.g., a regulator) takes action against
you in connection with your good-faith research, we will
make clear that you were operating under our safe-harbour.

---

## 8. Recognition

Researchers who have reported valid vulnerabilities:

> The list will populate after the first report.

---

## 9. Related

- [`docs/THREAT-MODEL.md`](THREAT-MODEL.md:1) — STRIDE-style
  threat model
- [`docs/PRIVACY.md`](PRIVACY.md:1) — how we handle data
- [`docs/TERMS.md`](TERMS.md:1) — Terms of Use, including §6
  acceptable use
- [`SECURITY-AUDIT.md`](../SECURITY-AUDIT.md:1) —
  self-audit against OWASP Top 10

— Sam Peacock, Founder, FreeLeased
2026-08-11
