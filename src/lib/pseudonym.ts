// src/lib/pseudonym.ts — Generate `[PERSON_NAME-XXXX]` pseudonyms for pilot sessions.
//
// Why this exists:
//   AGENTS.md requires every audit row to use `[PERSON_NAME]` discipline
//   (no real names, no PII). The pilot audit needs a way to assign a unique
//   pseudonym per leaseholder that:
//     1. Looks like `[PERSON_NAME-XXXX]` so it passes the convention
//     2. Is collision-resistant over a small population (<1000)
//     3. Is reversible only by the operator who holds the mapping
//        (the mapping is in `memory/pilot-pseudonym-map.md`, NOT in git)
//
// Cross-references:
//   - project/pilot-audit/real-pilot-onboarding.md
//   - project/pilot-audit/consent-template.md
//   - project/pilot-audit/mock-pilot-session-2026-08-11.md

/** Character set for the 4-char pseudonym suffix. Excludes 0/O/1/I/l for readability. */
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate a single pseudonym. Format: `[PERSON_NAME-XXXX]` where XXXX
 * is 4 chars from a 32-char unambiguous set.
 *
 * Deterministic when `seed` is provided (used by tests). Without a seed,
 * uses Math.random (acceptable for low-stakes pilot assignment; not for
 * cryptographic identity).
 */
export function generatePseudonym(seed?: number): string {
  const rng = typeof seed === "number" ? mulberry32(seed) : Math.random;
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += CHARSET[Math.floor(rng() * CHARSET.length)];
  }
  return `[PERSON_NAME-${suffix}]`;
}

/**
 * Generate a batch of N pseudonyms. Guarantees uniqueness within the batch.
 *
 * @param n — how many to generate (default 1, max 1000)
 * @param seed — optional seed for deterministic generation
 */
export function generatePseudonyms(n: number = 1, seed?: number): string[] {
  if (n < 1) throw new Error("n must be ≥ 1");
  if (n > 1000) throw new Error("n must be ≤ 1000 (collision risk)");
  const seen = new Set<string>();
  const out: string[] = [];
  const baseRng = typeof seed === "number" ? mulberry32(seed) : Math.random;
  let attempt = 0;
  while (out.length < n && attempt < n * 100) {
    const rng = typeof seed === "number" ? mulberry32(seed + attempt) : baseRng;
    const candidate = generatePseudonym(rng);
    if (!seen.has(candidate)) {
      seen.add(candidate);
      out.push(candidate);
    }
    attempt++;
  }
  return out;
}

/** Validate that a string matches the `[PERSON_NAME-XXXX]` shape. */
export function isValidPseudonym(s: string): boolean {
  return /^\[PERSON_NAME-[A-Z2-9]{4}\]$/.test(s);
}

/** Strip the brackets; return just the 4-char suffix. */
export function pseudonymSuffix(s: string): string {
  const m = s.match(/^\[PERSON_NAME-([A-Z2-9]{4})\]$/);
  return m ? m[1] : "";
}

/** Generate a session id (used by the audit ledger for `ReviewItem.id`). */
export function generateSessionId(seed?: number): string {
  const rng = typeof seed === "number" ? mulberry32(seed) : Math.random;
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += CHARSET[Math.floor(rng() * CHARSET.length)];
  }
  return `session_${Date.now().toString(36)}_${suffix}`;
}

// ── Internal: tiny seeded PRNG (mulberry32) for deterministic tests ──
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Total possible pseudonyms (32^4 = ~1M). */
export const PSEUDONYM_SPACE = 32 * 32 * 32 * 32;