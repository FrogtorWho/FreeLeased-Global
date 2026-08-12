export function shingles(text: string, k: number = 3): Set<string> {
  const s = text.toLowerCase().replace(/\s+/g, " ").trim();
  const out = new Set<string>();
  if (s.length < k) return out;
  for (let i = 0; i <= s.length - k; i++) out.add(s.slice(i, i + k));
  return out;
}

export function jaccard<T>(a: Set<T>, b: Set<T>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const x of a) if (b.has(x)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function textJaccard(a: string, b: string, k: number = 3): number {
  return jaccard(shingles(a, k), shingles(b, k));
}

export function batchDeduplicate(texts: string[], threshold: number = 0.85): number[] {
  const kept: { idx: number; vec: Set<string> }[] = [];
  for (let i = 0; i < texts.length; i++) {
    const vec = shingles(texts[i]);
    let isDup = false;
    for (const k of kept) {
      if (jaccard(vec, k.vec) >= threshold) { isDup = true; break; }
    }
    if (!isDup) kept.push({ idx: i, vec });
  }
  return kept.map((k) => k.idx);
}
