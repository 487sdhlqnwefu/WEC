/**
 * Central legal controller / entity identity for Privacy & Terms.
 *
 * DEPLOYMENT BLOCKER — Tristan must supply every required field below before
 * a production Netlify deploy is allowed. Do not invent addresses or company
 * numbers. Do not use a residential address unless expressly authorised.
 *
 * Leave fields as empty strings until confirmed. `isLegalIdentityComplete()`
 * gates both document rendering and the production build assert.
 */
export type LegalIdentity = {
  /** Legal controller / entity name (e.g. registered company or trading entity). */
  controllerName: string;
  /** Company / registration number if applicable; empty string if none. */
  registrationNumber: string;
  /** Whether a registration number applies (false = sole trader / unregistered). */
  registrationApplicable: boolean | null;
  /** Country of establishment (ISO-friendly English name, e.g. "Australia"). */
  countryOfEstablishment: string;
  /** Official business / service address (not residential unless authorised). */
  businessAddress: string;
  /** Dedicated privacy contact email. */
  privacyEmail: string;
};

export const legalIdentity: LegalIdentity = {
  controllerName: "",
  registrationNumber: "",
  registrationApplicable: null,
  countryOfEstablishment: "",
  businessAddress: "",
  privacyEmail: "",
};

/** Fields Tristan must complete before production publish of legal pages. */
export const LEGAL_IDENTITY_REQUIRED_FIELDS = [
  "controllerName",
  "registrationApplicable",
  "countryOfEstablishment",
  "businessAddress",
  "privacyEmail",
] as const satisfies ReadonlyArray<keyof LegalIdentity>;

export function legalIdentityMissingFields(
  identity: LegalIdentity = legalIdentity,
): string[] {
  const missing: string[] = [];
  if (!identity.controllerName.trim()) missing.push("controllerName");
  if (identity.registrationApplicable === null) {
    missing.push("registrationApplicable");
  } else if (
    identity.registrationApplicable &&
    !identity.registrationNumber.trim()
  ) {
    missing.push("registrationNumber");
  }
  if (!identity.countryOfEstablishment.trim()) {
    missing.push("countryOfEstablishment");
  }
  if (!identity.businessAddress.trim()) missing.push("businessAddress");
  if (!identity.privacyEmail.trim()) missing.push("privacyEmail");
  return missing;
}

export function isLegalIdentityComplete(
  identity: LegalIdentity = legalIdentity,
): boolean {
  return legalIdentityMissingFields(identity).length === 0;
}
