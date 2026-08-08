// Community Signing — multi-resident digital signature system.
//
// Manages signing ceremonies for collective correspondence.
// Each resident signs with a pseudonymised identity. Full audit trail.
// Open-source: click-to-sign + typed signatures (no third-party e-sign provider).
// Premium tier: integration with qualified e-signature providers (eIDAS-compliant).

// ── Types ──────────────────────────────────────────────────────

export interface SigningCeremony {
  documentId: string;
  title: string;
  requiredSigs: number;
  collectedSigs: number;
  status: "draft" | "collecting_signatures" | "ready" | "sent" | "archived";
  signatories: SignatoryRecord[];
  created: Date;
}

export interface SignatoryRecord {
  memberId: string;
  displayName: string;
  signed: boolean;
  signedAt?: Date;
  method: "click" | "drawn" | "typed";
}

export interface SignatureAuditEntry {
  documentId: string;
  memberId: string;
  displayName: string;
  action: "signed" | "viewed" | "declined";
  timestamp: Date;
  method: string;
  ipAddressHash?: string;
}

/**
 * Create a signing ceremony from a rendered document and a group's members.
 */
export function createSigningCeremony(
  documentId: string,
  title: string,
  requiredSigs: number,
  members: Array<{ id: string; displayName: string }>,
): SigningCeremony {
  return {
    documentId,
    title,
    requiredSigs,
    collectedSigs: 0,
    status: "collecting_signatures",
    signatories: members.map(m => ({
      memberId: m.id,
      displayName: m.displayName,
      signed: false,
      method: "click" as const,
    })),
    created: new Date(),
  };
}

/**
 * Record a signature in the ceremony.
 * Returns updated ceremony state.
 */
export function recordSignature(
  ceremony: SigningCeremony,
  memberId: string,
  method: "click" | "drawn" | "typed" = "click",
): { ceremony: SigningCeremony; success: boolean; error?: string } {
  const signatory = ceremony.signatories.find(s => s.memberId === memberId);
  if (!signatory) {
    return { ceremony, success: false, error: "Member is not a signatory for this document" };
  }
  if (signatory.signed) {
    return { ceremony, success: false, error: "Member has already signed" };
  }

  signatory.signed = true;
  signatory.signedAt = new Date();
  signatory.method = method;
  ceremony.collectedSigs = ceremony.signatories.filter(s => s.signed).length;

  if (ceremony.collectedSigs >= ceremony.requiredSigs) {
    ceremony.status = "ready";
  }

  return { ceremony, success: true };
}

/**
 * Check if the ceremony has enough signatures to proceed.
 */
export function isReadyToSend(ceremony: SigningCeremony): boolean {
  return ceremony.collectedSigs >= ceremony.requiredSigs;
}

/**
 * Generate a signing summary for the document.
 */
export function signingSummary(ceremony: SigningCeremony): {
  total: number;
  signed: number;
  pending: number;
  percentage: number;
  ready: boolean;
} {
  const total = ceremony.signatories.length;
  const signed = ceremony.signatories.filter(s => s.signed).length;
  const pending = total - signed;
  return {
    total,
    signed,
    pending,
    percentage: total > 0 ? Math.round((signed / total) * 100) : 0,
    ready: signed >= ceremony.requiredSigs,
  };
}
