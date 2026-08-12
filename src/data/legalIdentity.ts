/**
 * Central organisational identity for Privacy, Terms, and public disclosures.
 * Update this object if WEC later adopts a formal legal structure.
 *
 * Current status: independently organised community project — not an
 * incorporated company, charity, or registered nonprofit.
 */

export const LEGAL_IDENTITY = {
  /** Public project name */
  projectName: "World Espresso Championship",
  shortName: "WEC",

  /**
   * Plain-language status. Do not imply company, charity, company number,
   * registered office, or corporate postal address unless these fields are filled.
   */
  status: "community_project" as const,
  identityStatement:
    "World Espresso Championship is an independently organised community project coordinated by founder Tristan Creswick.",

  founderName: "Tristan Creswick",
  privacyContactEmail: "tristan@worldespressochampionship.com",
  generalContactEmail: "tristan@worldespressochampionship.com",

  /** Leave null until a formal structure exists — never invent values. */
  legalEntityName: null as string | null,
  registrationNumber: null as string | null,
  countryOfEstablishment: null as string | null,
  officialBusinessAddress: null as string | null,

  siteUrl: "https://worldespressochampionship.com",
  lastUpdated: "2026-08-12",

  /** Actual processors used by the current marketing site */
  processors: [
    {
      name: "Netlify, Inc.",
      role: "Website hosting and Netlify Forms (form storage / notifications)",
    },
  ],

  /**
   * Retention practice WEC can genuinely follow today.
   * Not a statutory claim — operational practice.
   */
  retentionPractice:
    "Registration and enquiry records are kept while they are needed to plan and run WEC 2026 and for a short follow-up period afterward, then deleted or anonymised when no longer needed.",
} as const;

export type LegalIdentity = typeof LEGAL_IDENTITY;
