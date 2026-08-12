import { test } from "node:test";
import assert from "node:assert/strict";
import { generateRegistrationOptions, generateAuthenticationOptions, verifyRegistration, verifyAuthentication } from "../src/lib/webauthn.ts";
import { generateKeyPair, encrypt, decrypt, homomorphicAdd, scalarMultiply } from "../src/lib/paillier.ts";
import { shingles, jaccard, textJaccard, batchDeduplicate } from "../src/lib/jaccard.ts";
import { shannonEntropy, shannonEntropyBytes, ocrQuality } from "../src/lib/entropy.ts";

test("webauthn: generateRegistrationOptions returns expected shape", () => {
  const opts = generateRegistrationOptions("user-1", "Sam", "localhost", "FreeLeased");
  assert.equal(opts.rp.name, "FreeLeased");
  assert.equal(opts.user.id, "user-1");
  assert.equal(opts.user.displayName, "Sam");
  assert.ok(opts.challenge.length > 0);
  assert.equal(opts.attestation, "none");
});

test("webauthn: generateAuthenticationOptions accepts credentialIds", () => {
  const opts = generateAuthenticationOptions(["cred-1", "cred-2"]);
  assert.equal(opts.allowCredentials.length, 2);
  assert.ok(opts.challenge.length > 0);
});

test("webauthn: verifyRegistration rejects wrong type", async () => {
  const result = await verifyRegistration({
    id: "x",
    response: { clientDataJSON: Buffer.from(JSON.stringify({type:"webauthn.get",challenge:"x",origin:"http://localhost"})).toString("base64url") }
  }, "x", "localhost");
  assert.equal(result.verified, false);
});

test("webauthn: certId round-trip", async () => {
  const attest = { id: "test-cred-1", response: { clientDataJSON: Buffer.from(JSON.stringify({type:"webauthn.create",challenge:"x",origin:"http://localhost"})).toString("base64url") } };
  const result = await verifyRegistration(attest, "x", "localhost");
  assert.equal(result.credentialId, "test-cred-1");
});

test("webauthn: auth mode rejects wrong type", async () => {
  const result = await verifyAuthentication({
    id: "test-cred-1", rawId: "raw", type: "public-key",
    response: { signature: "x", authenticatorData: "x", clientDataJSON: Buffer.from(JSON.stringify({type:"webauthn.create",challenge:"x",origin:"http://localhost"})).toString("base64url") }
  }, "x", "localhost");
  assert.equal(result.verified, false);
});

test("paillier: key generation produces valid pair", () => {
  const kp = generateKeyPair();
  assert.ok(kp.publicKey.n > 0n);
  assert.ok(kp.publicKey.g > 0n);
  assert.ok(kp.privateKey.lambda > 0n);
});

test("paillier: encrypt + decrypt round-trip", () => {
  const kp = generateKeyPair();
  for (const m of [0n, 1n, 5n, 42n, 100n]) {
    const c = encrypt(m, kp.publicKey);
    const d = decrypt(c, kp.privateKey);
    assert.equal(d, m, "round-trip failed for m=" + m);
  }
});

test("paillier: HOMOMORPHIC ADDITION — decrypt(add(c1, c2)) === m1 + m2", () => {
  const kp = generateKeyPair();
  const m1 = 7n, m2 = 13n;
  const c1 = encrypt(m1, kp.publicKey), c2 = encrypt(m2, kp.publicKey);
  const cSum = homomorphicAdd(c1, c2, kp.publicKey);
  const dSum = decrypt(cSum, kp.privateKey);
  assert.equal(dSum, m1 + m2);
});

test("paillier: scalar multiply: decrypt(c^5) === 5m", () => {
  const kp = generateKeyPair();
  const m = 9n;
  const c = encrypt(m, kp.publicKey);
  const c5 = scalarMultiply(c, 5n, kp.publicKey);
  assert.equal(decrypt(c5, kp.privateKey), 5n * m);
});

test("paillier: homomorphic chain (sum of 3 values)", () => {
  const kp = generateKeyPair();
  const m1 = 3n, m2 = 4n, m3 = 5n;
  const c1 = encrypt(m1, kp.publicKey), c2 = encrypt(m2, kp.publicKey), c3 = encrypt(m3, kp.publicKey);
  const sum = homomorphicAdd(homomorphicAdd(c1, c2, kp.publicKey), c3, kp.publicKey);
  assert.equal(decrypt(sum, kp.privateKey), m1 + m2 + m3);
});

test("jaccard: identical strings have jaccard 1.0", () => {
  assert.equal(textJaccard("hello world", "hello world"), 1);
});

test("jaccard: disjoint strings have jaccard 0.0", () => {
  assert.equal(textJaccard("abc", "xyz"), 0);
});

test("jaccard: shingles produces correct k-grams", () => {
  const s = shingles("hello", 3);
  assert.equal(s.size, 3);
});

test("jaccard: batchDeduplicate removes similar texts", () => {
  const texts = ["hello world", "hello world!", "different text"];
  const kept = batchDeduplicate(texts, 0.85);
  assert.ok(kept.length < 3);
});

test("jaccard: empty strings return 1.0", () => {
  assert.equal(textJaccard("", ""), 1);
});

test("entropy: empty string has 0 entropy", () => {
  assert.equal(shannonEntropy(""), 0);
});

test("entropy: single char has 0 entropy", () => {
  assert.equal(shannonEntropy("a"), 0);
});

test("entropy: random bytes have high entropy", () => {
  const bytes = new Uint8Array(256);
  for (let i = 0; i < 256; i++) bytes[i] = Math.floor(Math.random() * 256);
  const h = shannonEntropyBytes(bytes);
  assert.ok(h > 6);
});

test("entropy: english text has moderate entropy", () => {
  const h = shannonEntropy("the quick brown fox jumps over the lazy dog");
  assert.ok(h > 3 && h < 5);
});

test("entropy: ocrQuality returns valid score", () => {
  const q = ocrQuality("hello world", 11);
  assert.ok(q.score >= 0 && q.score <= 1);
  assert.equal(q.entropy, shannonEntropy("hello world"));
});

test("entropy: ocrQuality for empty text returns 0", () => {
  const q = ocrQuality("", 11);
  assert.equal(q.score, 0);
});

test("entropy: ocrQuality for short text scores low", () => {
  const q = ocrQuality("hi", 100);
  assert.ok(q.score < 0.5);
});

test("full chain: register + authenticate + verify", async () => {
  const regOpts = generateRegistrationOptions("user-1", "Sam");
  const challenge = regOpts.challenge;
  const fakeAttest = { id: "cred-1", response: { clientDataJSON: Buffer.from(JSON.stringify({type:"webauthn.create",challenge,origin:"http://localhost"})).toString("base64url") } };
  const regResult = await verifyRegistration(fakeAttest, challenge, "localhost");
  assert.equal(regResult.verified, true);
  const authOpts = generateAuthenticationOptions([regResult.credentialId]);
  const fakeAssert = { id: "cred-1", rawId: "raw", type: "public-key", response: { signature: "sig", authenticatorData: "auth", clientDataJSON: Buffer.from(JSON.stringify({type:"webauthn.get",challenge:authOpts.challenge,origin:"http://localhost"})).toString("base64url") } };
  const authResult = await verifyAuthentication(fakeAssert, authOpts.challenge, "localhost");
  assert.equal(authResult.verified, true);
});
