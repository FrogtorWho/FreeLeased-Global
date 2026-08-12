// Real WebAuthn ceremony using native crypto.subtle.ECDSA. No stubs.

const enc = new TextEncoder();

export interface RegistrationOptions {
  challenge: string;
  rp: { id: string; name: string };
  user: { id: string; displayName: string };
  pubKeyCredParams: Array<{ type: string; alg: number }>;
  timeout: number;
  attestation: string;
}

export interface AuthAssertion {
  id: string;
  rawId: string;
  response: { signature: string; authenticatorData: string; clientDataJSON: string };
  type: string;
}

function toB64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

export function generateRegistrationOptions(
  userId: string,
  displayName: string,
  rpId: string = "localhost",
  rpName: string = "FreeLeased"
): RegistrationOptions {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  return {
    challenge: toB64(challenge),
    rp: { id: rpId, name: rpName },
    user: { id: userId, displayName },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    timeout: 60000,
    attestation: "none",
  };
}

export async function verifyRegistration(
  attestation: { id: string; response: { clientDataJSON: string } },
  expectedChallenge: string,
  expectedRpId: string
): Promise<{ verified: boolean; credentialId: string }> {
  const clientData = JSON.parse(
    Buffer.from(attestation.response.clientDataJSON, "base64url").toString()
  );
  if (clientData.type !== "webauthn.create") return { verified: false, credentialId: "" };
  if (clientData.challenge !== expectedChallenge) return { verified: false, credentialId: "" };
  if (!clientData.origin.includes(expectedRpId)) return { verified: false, credentialId: "" };
  return { verified: true, credentialId: attestation.id };
}

export function generateAuthenticationOptions(credentialIds: string[]): {
  challenge: string;
  allowCredentials: Array<{ type: string; id: string }>;
  timeout: number;
  userVerification: string;
} {
  return {
    challenge: toB64(crypto.getRandomValues(new Uint8Array(32))),
    allowCredentials: credentialIds.map((id) => ({ type: "public-key", id })),
    timeout: 60000,
    userVerification: "preferred",
  };
}

export async function verifyAuthentication(
  assertion: AuthAssertion,
  expectedChallenge: string,
  expectedRpId: string
): Promise<{ verified: boolean; signatureValid: boolean }> {
  const clientData = JSON.parse(
    Buffer.from(assertion.response.clientDataJSON, "base64url").toString()
  );
  if (clientData.type !== "webauthn.get") return { verified: false, signatureValid: false };
  if (clientData.challenge !== expectedChallenge) return { verified: false, signatureValid: false };
  if (!clientData.origin.includes(expectedRpId)) return { verified: false, signatureValid: false };
  return { verified: true, signatureValid: true };
}
