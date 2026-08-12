/**
 * Single source of truth for mutable WEC public facts.
 * Visible copy, metadata, and UI status must read from here.
 */

export type ChampionsProductStatus =
  | "ambition"
  | "in_development"
  | "contracted"
  | "launched"
  | "reported";

export type LiveBoardState = "pre_event" | "live" | "fault" | "post_event";

export type PackageAvailability = "open" | "limited" | "filled";

export const SITE_URL = "https://worldespressochampionship.com";

export const WEC_FACTS = {
  organisation: {
    legalName: "World Espresso Championship",
    shortName: "WEC",
    founderName: "Tristan Creswick",
    founderEmail: "tristan@worldespressochampionship.com",
    founderMailto: "mailto:tristan@worldespressochampionship.com",
    coreLine: "The cup is the only judge.",
    innovationLine: "Find excellence. Understand it. Build from it.",
  },

  features: {
    storeEnabled: false as boolean,
    registrationOpen: true as boolean,
  },

  event2026: {
    name: "WEC 2026 Panama",
    dateDisplay: "26 October 2026",
    dateISO: "2026-10-26",
    timezone: "America/Panama",
    venue: "Café Unido",
    city: "Panama City",
    country: "Panama",
    addressDisplay: "Café Unido, Panama City, Panama",
    fieldSize: 32,
    confirmedCompetitors: 7,
    registrationStatus: "open" as const,
    registrationPath: "/panama-2026#competitor-registration",
    livePath: "/live/wec-2026-panama",
    liveBoardState: "pre_event" as LiveBoardState,
    liveMessage: "Live results open on 26 October 2026",
    championOrdinal: "fifth",
    independentEraNote:
      "The fifth World Espresso Champion — and the first champion of WEC's independent era.",
  },

  eligibility: {
    competitor:
      "Open to national barista or espresso champions (or equivalent verified national title holders). Limited to one competitor per country or territory for WEC 2026.",
    judge:
      "Open to experienced sensory professionals, Q Graders, cup tasters, and trained sensory judges. WEC provides format-specific training.",
    volunteer:
      "Open to anyone who can support the event on site. Previous event experience preferred but not required.",
  },

  scoring: {
    version: "Scoring v3",
    judgesPerHeat: 3,
    tactile: 15,
    taste: 10,
    flavour: 8,
    pointsPerJudge: 33,
    pointsPerHeat: 99,
    winThreshold: 50,
    percentages: {
      tactile: { exact: "45.45%", rounded: "45%" },
      taste: { exact: "30.30%", rounded: "30%" },
      flavour: { exact: "24.24%", rounded: "24%" },
    },
    methodologyNote:
      "Scoring v3 uses a blinded two-alternative forced-choice structure informed by paired-comparison sensory methodology, including ISO 5495 principles.",
    biasNote:
      "WEC is designed to reduce avoidable bias: identities are hidden, equipment and ingredients are controlled, judges ballot independently, and results are published.",
  },

  championsProduct: {
    status: "ambition" as ChampionsProductStatus,
    heading: "From winning method to transparent value.",
    publicCopy:
      "WEC's ambition is to help translate championship knowledge into a commercial coffee product when the champion, producer and partners agree it can be done responsibly. No product, launch date, royalty or distribution is guaranteed before agreements are signed.\n\nWhen a Champion's Product is created, WEC will publish who participates, how value is shared, what is measured and what has been delivered—subject only to legitimate personal and commercial confidentiality.",
    publishList: [
      "participating champion, producer and commercial partners",
      "product and agreement status",
      "the royalty basis and confirmation that the champion's share is higher than WEC's",
      "producer payment or premium where the producer permits publication",
      "units or reporting basis where contractually publishable",
      "reporting period and last update",
      "what has actually been paid or delivered, once verified",
    ],
    governingPrinciple:
      "When a commercial product exists, the champion's royalty/share must be higher than WEC's.",
  },

  prize: {
    publicSummary:
      "WEC 2026 awards the World Espresso Champion title, trophy, and recognition. Any Champion's Product arrangement is conditional on signed agreements and will be published transparently if created.",
  },

  partners: {
    current: [
      {
        name: "Café Unido",
        role: "Venue and roaster sponsor · WEC 2026",
        href: "https://www.cafeunido.com",
      },
      {
        name: "Objective Coffee Community (OCC)",
        role: "Partner",
        href: "https://objectivecoffeecommunity.com",
      },
      {
        name: "Specialty Coffee Community",
        role: "Partner",
        href: "https://www.specialtycoffeecommunity.com",
      },
      {
        name: "Specialty Coffee Education",
        role: "Partner",
        href: "https://www.specialtycoffee.education",
      },
    ],
    foundingEquipment: {
      name: "Dalla Corte",
      years: "2022–2025",
      pagePath: "/partners/dalla-corte-2022-2025",
      label: "Founding equipment partner, 2022–2025",
    },
  },

  sponsorship: {
    heading: "Clear partnerships. Public prices.",
    intro:
      "WEC publishes sponsorship prices so partners can understand the scale, role and contribution before a conversation begins. Every package should make clear what it funds, what the partner receives and what WEC will report after the event.",
    independencePrinciple:
      "Commercial partners support the platform. They do not influence judging, ballots, seeding or results.",
    packages: [
      {
        id: "presenting",
        name: "Presenting Partner",
        price: "€150,000+",
        availability: "open" as PackageAvailability,
        description:
          "Lead presenting partner. Closest association with the live, blind format and the WEC brand.",
        funds: "Championship operations, staging, and public live results platform.",
        deliverables: [
          "'WEC 2026 presented with [Your Brand]' recognition",
          "Category exclusivity as lead partner",
          "On-site branding at Café Unido",
          "Logo on live bracket + website",
          "Social + LinkedIn campaign package",
          "4–6 team passes / hospitality",
          "Optional machine or product demo zone",
          "Priority access to Competition Intelligence (by agreement)",
        ],
        reportedAfter:
          "Partner recognition delivered, on-site presence, and campaign activity summary.",
        highlighted: true,
        formTier: "title",
      },
      {
        id: "official",
        name: "Official Partner",
        price: "€70,000+",
        availability: "open" as PackageAvailability,
        description:
          "Strong visibility for grinders, water, milk, or media brands that fit the sensory story.",
        funds: "Category support and live-event delivery.",
        deliverables: [
          "Category exclusivity where possible",
          "Logo on website + event materials",
          "Live-board mention during finals",
          "Social media package",
          "2–3 team passes",
        ],
        reportedAfter: "Logo placement, mentions, and pass utilisation summary.",
        highlighted: false,
        formTier: "gold",
      },
      {
        id: "supporting",
        name: "Supporting Partner",
        price: "€15,000+",
        availability: "open" as PackageAvailability,
        description:
          "Accessible entry for roasters, tools, and regional brands who want to stand with WEC.",
        funds: "Programme and community visibility.",
        deliverables: [
          "Logo on website sponsor wall",
          "Social thank-you posts",
          "Name in event programme",
          "1–2 team passes",
        ],
        reportedAfter: "Logo and programme credits delivered.",
        highlighted: false,
        formTier: "supporting",
      },
      {
        id: "community",
        name: "Community Partner",
        price: "€5,000+",
        availability: "open" as PackageAvailability,
        description:
          "Entry-level partnership for tools, media, or regional brands — cash or high-value in-kind.",
        funds: "Community outreach and event support.",
        deliverables: [
          "Logo on website sponsor wall",
          "Social thank-you credit",
          "Name in event programme",
          "Warm intro to competitor & judge network",
        ],
        reportedAfter: "Credits and introductions completed.",
        highlighted: false,
        formTier: "silver",
      },
    ],
  },

  nav: {
    primary: [
      { label: "WEC 2026", href: "/panama-2026" },
      { label: "How It Works", href: "/judging" },
      { label: "Champions", href: "/champions" },
      { label: "Innovation Lab", href: "/innovation" },
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Register", href: "/panama-2026#competitor-registration" },
    ],
  },
} as const;

export type WecFacts = typeof WEC_FACTS;
