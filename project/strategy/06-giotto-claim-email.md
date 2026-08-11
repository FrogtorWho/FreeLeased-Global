# Giotto.ai — Claim Email Template

**Send to:** Daniel Alvarez (Gioto.ai)
**From:** Sam Peacock <sam@freeleased.app>
**Date drafted:** 2026-08-11
**Status:** Ready to send

---

```
Subject: Future Caribbean Buildathon — Giotto.ai API access request (Sam Peacock, FreeLeased)

Hi Daniel,

I'm Sam Peacock, solo founder of FreeLeased (a leaseholder-rights platform in the Future Caribbean Buildathon, Track 9). Building in 6 days for the 16 Aug demo.

FreeLeased ships a 9-jurisdiction legal spine + 4 deterministic dossier engines + a consensus gate. The next step is wiring real multimodal extraction for leaseholder scans. Giotto's compact reasoning model + multimodal inputs are a perfect fit — cheaper + faster than the alternatives for our per-resident call volume.

Could you confirm my access? Project handles:
- Repo: https://github.com/FrogtorWho/FreeLeased-Global
- Submission: Future Caribbean Global AI Buildathon 2026
- Use case: leaseholder document classification + multimodal extraction
- Volume estimate: ~100-1000 calls/day during pilot, scaling to 10k/day post-launch

Happy to share the architecture diagram if useful.

Thanks,
Sam
```

---

## Notes for Sam

- Replace the placeholder email above with the verified address for Daniel Alvarez (the contact we have from the Buildathon pack — confirm before sending).
- If you have a Giotto.ai reference / invite link, paste it into the "Confirm my access" line: *"Could you confirm access using [link]?"*
- **CC yourself** so you have a paper trail.
- **Attach** the architecture swimlane diagram ([`project/strategy/architecture-swimlane.md`](../strategy/architecture-swimlane.md)) as a PDF if you want a reply that's more likely to land.
- Once access is granted, paste the API key into `.env` as `GIOTTO_API_KEY` and the confirmed base URL as `GIOTTO_BASE_URL`. Update [`project/strategy/giotto-integration-research.md`](giotto-integration-research.md) section 5 with the confirmed endpoint.

## Follow-up tasks (after key receipt)

- [ ] Run `bun scripts/test-giotto.ts` with the live key — should pass all 20 checks
- [ ] Update `giotto-integration-research.md` section 5 — replace "TBD" with confirmed base URL
- [ ] Add Giotto to the live-call integration test (`scripts/test-all.ts`)
- [ ] Update [`moonshot-roadmap-10-10.md`](moonshot-roadmap-10-10.md) sponsor list count if it changes
- [ ] Update the demo script's sponsor stack slide (`project/demo/demo-video-script.md`)
