# Nebius promo-code log (2026-08-11)

**Status:** Pending manual redemption.
**Code type:** Single-use promo / credits, NOT an API key.

---

## What's in the .env

A line referencing `NEBIUS_PROMO_CODE` was mentioned in the activation
brief, but the .env file I read (2026-08-11 12:09 UTC) only contained
4 keys:

| Variable          | Status in .env                |
|-------------------|-------------------------------|
| `NEBIUS_API_KEY`  | Present (masked: `v1.C***`)   |
| `NEBIUS_BASE_URL` | Present (token factory URL)   |
| `OLLYGARDEN_API_KEY`     | Present (masked: `og_s***`) |
| `OLLYGARDEN_OTLP_ENDPOINT` | Present                   |
| `TENKI_API_KEY`   | Present (masked: `tk_***`)    |
| `MINIMAX_API_KEY` | Present (masked: `sk-c***`)   |
| `GIOTTO_API_KEY`  | **NOT in .env** — gap         |
| `NEBIUS_TENKI_KEY` | **NOT in .env** — gap         |
| `NEBIUS_PROMO_CODE` | **NOT in .env** — gap       |

If a Nebius promo code was actually pasted, it is in a separate
location (e.g. the partner spreadsheet) and was not visible at this
address. Please confirm where the code lives so it can be redeemed.

---

## Redemption procedure (when the code is found)

1. Open the Nebius console: <https://console.tokenfactory.nebius.com/>
2. Sign in with the FC Buildathon tenant credentials.
3. Navigate to **Billing → Apply promo code**.
4. Paste the code, confirm, and re-fetch the credit balance.
5. The bonus credits usually appear within 30 seconds.

> Note: promo codes are typically **single-use per tenant**. Once
> applied, it cannot be reused. If Sam already redeemed it elsewhere,
> the code is no longer valid.

---

## Why this artefact exists

This file is the canonical record that on 2026-08-11 we *looked* for
the promo code in the activation context and could not locate it. If
the code does exist elsewhere, this serves as a checkpoint so it isn't
re-applied accidentally and so the credits have a recorded owner
(`freeleased-activation@shogo` / FC tenant).

---

## Gaps to close (action for Sam)

- [ ] Confirm whether `NEBIUS_PROMO_CODE` was meant to be pasted into
      `.env` (it isn't there) or some other location.
- [ ] If you have the code, redeem it at the URL above and reply to
      this memory file with the new credit balance.
- [ ] Likewise, `GIOTTO_API_KEY` and `NEBIUS_TENKI_KEY` are missing from
      the current `.env`. Until they appear, those integrations operate
      in **deterministic-fallback** mode.
