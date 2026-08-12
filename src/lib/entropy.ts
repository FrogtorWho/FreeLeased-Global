export function shannonEntropy(text: string): number {
  if (text.length === 0) return 0;
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  let h = 0;
  for (const c of freq.values()) {
    const p = c / text.length;
    h -= p * Math.log2(p);
  }
  return h;
}

export function shannonEntropyBytes(bytes: Uint8Array): number {
  if (bytes.length === 0) return 0;
  const freq = new Map<number, number>();
  for (const b of bytes) freq.set(b, (freq.get(b) ?? 0) + 1);
  let h = 0;
  for (const c of freq.values()) {
    const p = c / bytes.length;
    h -= p * Math.log2(p);
  }
  return h;
}

export function ocrQuality(text: string, expectedLength: number): {
  score: number; entropy: number; lengthRatio: number
} {
  const entropy = shannonEntropy(text);
  const lengthRatio = expectedLength === 0 ? 0 : Math.min(text.length / expectedLength, 1);
  const entropyScore = Math.min(entropy / 4.5, 1);
  const score = (entropyScore * 0.6) + (lengthRatio * 0.4);
  return { score, entropy, lengthRatio };
}
