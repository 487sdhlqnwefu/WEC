import { describe, expect, it } from "vitest";
import {
  isLegalIdentityComplete,
  legalIdentity,
  legalIdentityMissingFields,
  type LegalIdentity,
} from "./legalIdentity";

describe("legalIdentity", () => {
  it("is incomplete until Tristan supplies controller details", () => {
    expect(isLegalIdentityComplete(legalIdentity)).toBe(false);
    expect(legalIdentityMissingFields(legalIdentity)).toEqual(
      expect.arrayContaining([
        "controllerName",
        "registrationApplicable",
        "countryOfEstablishment",
        "businessAddress",
        "privacyEmail",
      ]),
    );
  });

  it("requires registrationNumber only when registration applies", () => {
    const base: LegalIdentity = {
      controllerName: "Example Entity",
      registrationNumber: "",
      registrationApplicable: false,
      countryOfEstablishment: "Australia",
      businessAddress: "1 Example St, Example City",
      privacyEmail: "privacy@example.com",
    };
    expect(isLegalIdentityComplete(base)).toBe(true);

    const needsNumber: LegalIdentity = {
      ...base,
      registrationApplicable: true,
    };
    expect(legalIdentityMissingFields(needsNumber)).toContain(
      "registrationNumber",
    );
  });
});
