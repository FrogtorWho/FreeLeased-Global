// Real Paillier homomorphic encryption. Tiny primes for demo; production = 2048-bit.

export interface PaillierPublicKey { n: bigint; g: bigint }
export interface PaillierPrivateKey { n: bigint; lambda: bigint; mu: bigint }
export interface PaillierKeyPair { publicKey: PaillierPublicKey; privateKey: PaillierPrivateKey }

function modExp(b: bigint, e: bigint, m: bigint): bigint {
  let result = 1n;
  b = b % m;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    e >>= 1n;
    b = (b * b) % m;
  }
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) { [a, b] = [b, a % b] }
  return a;
}

function lcm(a: bigint, b: bigint): bigint {
  return (a / gcd(a, b)) * b;
}

function modInverse(a: bigint, m: bigint): bigint {
  // Extended Euclidean: a*x + m*y = gcd(a,m); for prime m, a^(m-2) ≡ a^-1
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  // oldR = gcd; oldS = a^-1 mod m (may be negative; normalize)
  return ((oldS % m) + m) % m;
}

export function generateKeyPair(): PaillierKeyPair {
  const p = 61n, q = 53n;
  const n = p * q;
  const lambda = lcm(p - 1n, q - 1n);
  const g = n + 1n;
  // mu = L(g^lambda mod n^2)^(-1) mod n
  const n2 = n * n;
  const lVal = (modExp(g, lambda, n2) - 1n) / n;
  const mu = modInverse(lVal, n);
  return { publicKey: { n, g }, privateKey: { n, lambda, mu } };
}

export function encrypt(m: bigint, pub: PaillierPublicKey): bigint {
  const r = 7n;
  return (modExp(pub.g, m, pub.n * pub.n) * modExp(r, pub.n, pub.n * pub.n)) % (pub.n * pub.n);
}

export function decrypt(c: bigint, priv: PaillierPrivateKey): bigint {
  const n2 = priv.n * priv.n;
  const l = (modExp(c, priv.lambda, n2) - 1n) / priv.n;
  return (l * priv.mu) % priv.n;
}

export function homomorphicAdd(c1: bigint, c2: bigint, pub: PaillierPublicKey): bigint {
  return (c1 * c2) % (pub.n * pub.n);
}

export function scalarMultiply(c: bigint, scalar: bigint, pub: PaillierPublicKey): bigint {
  return modExp(c, scalar, pub.n * pub.n);
}
