/**
 * Public route metadata used by Seo components and the static prerender script.
 * Keep titles, descriptions, H1s and OG paths aligned with visible page content.
 */

import { SITE_URL, WEC_FACTS } from "./wecFacts";
import { LEGAL_IDENTITY } from "./legalIdentity";

export type PublicRouteMeta = {
  path: string;
  /** Output path relative to dist/public (directory index or file) */
  out: string;
  title: string;
  description: string;
  h1: string;
  /** Short no-JS / crawler body paragraphs */
  paragraphs: string[];
  ogImage: string;
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "World Espresso Championship",
  alternateName: "WEC",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-white.png`,
  email: WEC_FACTS.organisation.founderEmail,
  sameAs: ["https://www.instagram.com/worldespressochampionship"],
  description: LEGAL_IDENTITY.identityStatement,
};

function breadcrumb(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: SITE_URL + path,
      },
    ],
  };
}

export const PUBLIC_ROUTES: PublicRouteMeta[] = [
  {
    path: "/",
    out: "index.html",
    title: "World Espresso Championship (WEC)",
    description:
      "The World Espresso Championship is a controlled, blind espresso competition. Same coffee. Same machine. Only the barista differs.",
    h1: "THE WORLD ESPRESSO CHAMPIONSHIP",
    paragraphs: [
      "Same coffee. Same machine. Only the barista differs.",
      WEC_FACTS.organisation.coreLine,
      `WEC 2026 Panama · ${WEC_FACTS.event2026.dateDisplay} · ${WEC_FACTS.event2026.addressDisplay}.`,
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: orgLd,
  },
  {
    path: "/panama-2026",
    out: "panama-2026/index.html",
    title: "WEC 2026 Panama | World Espresso Championship",
    description: `WEC 2026 Panama at Café Unido on ${WEC_FACTS.event2026.dateDisplay}. Registration is open. Public sponsorship packages available.`,
    h1: "WEC 2026 Panama",
    paragraphs: [
      `${WEC_FACTS.event2026.dateDisplay} · ${WEC_FACTS.event2026.addressDisplay}.`,
      WEC_FACTS.event2026.independentEraNote,
      "Registration is open for eligible national champions. Clear partnerships with public prices.",
    ],
    ogImage: "/assets/og/panama-2026.jpg",
    jsonLd: [
      breadcrumb("/panama-2026", "WEC 2026 Panama"),
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: WEC_FACTS.event2026.name,
        startDate: WEC_FACTS.event2026.dateISO,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: WEC_FACTS.event2026.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: WEC_FACTS.event2026.city,
            addressCountry: WEC_FACTS.event2026.country,
          },
        },
        organizer: {
          "@type": "Organization",
          name: "World Espresso Championship",
          url: SITE_URL,
        },
        description: `${WEC_FACTS.event2026.independentEraNote} Registration: ${SITE_URL}${WEC_FACTS.event2026.registrationPath}`,
        url: `${SITE_URL}/panama-2026`,
      },
    ],
  },
  {
    path: "/judging",
    out: "judging/index.html",
    title: "How Judging Works | World Espresso Championship",
    description:
      "Scoring v3: three independent judges, Tactile 15 / Taste 10 / Flavour 8, 99 points per heat, 50+ wins. Blind Cup A vs Cup B.",
    h1: "How the cup decides",
    paragraphs: [
      "Same coffee. Same machine. Blind cups. No deliberation.",
      WEC_FACTS.scoring.biasNote,
      WEC_FACTS.scoring.methodologyNote,
    ],
    ogImage: "/assets/og/judging.jpg",
    jsonLd: breadcrumb("/judging", "How Judging Works"),
  },
  {
    path: "/rules-and-integrity",
    out: "rules-and-integrity/index.html",
    title: "Rules & Integrity | World Espresso Championship",
    description:
      "Public rules for the World Espresso Championship: controlled variables, blind judging, Scoring v3, and partner independence.",
    h1: "Rules & Integrity",
    paragraphs: [
      WEC_FACTS.organisation.coreLine,
      "Canonical public summary of how WEC runs a heat. Items not yet final are listed clearly — we do not invent policy.",
    ],
    ogImage: "/assets/og/judging.jpg",
    jsonLd: breadcrumb("/rules-and-integrity", "Rules & Integrity"),
  },
  {
    path: "/champions",
    out: "champions/index.html",
    title: "Champions | World Espresso Championship",
    description:
      "World Espresso Champions 2022–2025. The fifth World Espresso Champion will be crowned in Panama in 2026.",
    h1: "History of Champions",
    paragraphs: [
      "Past World Espresso Champions and the path to WEC 2026 Panama.",
      WEC_FACTS.event2026.independentEraNote,
    ],
    ogImage: "/assets/og/champions.jpg",
    jsonLd: breadcrumb("/champions", "Champions"),
  },
  {
    path: "/innovation",
    out: "innovation/index.html",
    title: "Innovation Lab | World Espresso Championship",
    description:
      "Find excellence. Understand it. Build from it. The WEC Innovation Lab supports the championship with structured insight.",
    h1: "The competition is also a lab.",
    paragraphs: [
      WEC_FACTS.organisation.innovationLine,
      "The Innovation Lab supports the championship. It does not replace it.",
    ],
    ogImage: "/assets/og/innovation.jpg",
    jsonLd: breadcrumb("/innovation", "Innovation Lab"),
  },
  {
    path: "/about",
    out: "about/index.html",
    title: "About | World Espresso Championship",
    description:
      "World Espresso Championship (WEC) — a controlled, blind espresso championship. The cup is the only judge.",
    h1: "About the World Espresso Championship",
    paragraphs: [
      LEGAL_IDENTITY.identityStatement,
      WEC_FACTS.scoring.biasNote,
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/about", "About"),
  },
  {
    path: "/history",
    out: "history/index.html",
    title: "History | World Espresso Championship",
    description:
      "WEC developed through four international championships from 2022 to 2025 with founding equipment partner Dalla Corte. In 2026, WEC begins its independent era in Panama.",
    h1: "History of Championships",
    paragraphs: [
      "WEC developed through four international championships from 2022 to 2025 with the support of founding equipment partner Dalla Corte, host venues, judges, competitors and local communities. In 2026, WEC begins its independent era in Panama.",
    ],
    ogImage: "/assets/og/dalla-corte.jpg",
    jsonLd: breadcrumb("/history", "History"),
  },
  {
    path: "/vision",
    out: "vision/index.html",
    title: "Vision | World Espresso Championship",
    description:
      "Find excellence. Understand it. Build from it. WEC's vision for a controlled, blind espresso championship that publishes what won.",
    h1: "Find excellence. Understand it. Build from it.",
    paragraphs: [
      "The World Espresso Championship (WEC) is a controlled, blind espresso competition built to reduce avoidable bias, publish results, and return useful value to coffee.",
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/vision", "Vision"),
  },
  {
    path: "/news",
    out: "news/index.html",
    title: "News | World Espresso Championship",
    description: "News and announcements from the World Espresso Championship.",
    h1: "News",
    paragraphs: ["Announcements and updates from the World Espresso Championship."],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/news", "News"),
  },
  {
    path: "/faq",
    out: "faq/index.html",
    title: "FAQ | World Espresso Championship",
    description: "Frequently asked questions about the World Espresso Championship and WEC 2026 Panama.",
    h1: "FAQ",
    paragraphs: ["Answers about format, registration, scoring and WEC 2026 Panama."],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/faq", "FAQ"),
  },
  {
    path: "/contact",
    out: "contact/index.html",
    title: "Contact | World Espresso Championship",
    description:
      "Your message reaches Tristan Creswick, WEC founder, directly. Competitors, partners and media are welcome.",
    h1: "Get in Touch",
    paragraphs: [
      "Your message reaches Tristan Creswick, WEC founder, directly. Competitors, partners and media are welcome.",
      `Email: ${WEC_FACTS.organisation.founderEmail}`,
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/contact", "Contact"),
  },
  {
    path: "/privacy",
    out: "privacy/index.html",
    title: "Privacy & Data Use | World Espresso Championship",
    description:
      "How the World Espresso Championship collects and uses information from registration and contact forms.",
    h1: "Privacy & Data Use",
    paragraphs: [
      LEGAL_IDENTITY.identityStatement,
      "This page explains what information WEC collects online, why, who can access it, and how to request access, correction or deletion.",
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/privacy", "Privacy & Data Use"),
  },
  {
    path: "/terms",
    out: "terms/index.html",
    title: "Website & Participation Terms | World Espresso Championship",
    description:
      "Website and participation terms for the World Espresso Championship. Competition rules are published separately.",
    h1: "Website & Participation Terms",
    paragraphs: [
      LEGAL_IDENTITY.identityStatement,
      "These terms cover website use and participation. Competition rules are at /rules-and-integrity.",
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: breadcrumb("/terms", "Website & Participation Terms"),
  },
  {
    path: "/partners/dalla-corte-2022-2025",
    out: "partners/dalla-corte-2022-2025/index.html",
    title: "Thank You, Dalla Corte | WEC 2022–2025",
    description:
      "World Espresso Championship thanks founding equipment partner Dalla Corte for four years of support across WEC 2022, 2023, 2024 and 2025.",
    h1: "Four years that helped build WEC.",
    paragraphs: [
      "From 2022 through 2025, Dalla Corte supported the first four World Espresso Championships as WEC's founding equipment partner.",
      "Thank you to the Dalla Corte team for four good years.",
    ],
    ogImage: "/assets/og/dalla-corte.jpg",
    jsonLd: breadcrumb("/partners/dalla-corte-2022-2025", "Thank You, Dalla Corte"),
  },
  {
    path: "/live/wec-2026-panama",
    out: "live/wec-2026-panama/index.html",
    title: `Live Bracket · ${WEC_FACTS.event2026.name} | World Espresso Championship`,
    description: `${WEC_FACTS.event2026.name} live results and bracket. ${WEC_FACTS.event2026.liveMessage}`,
    h1: `Live Bracket · ${WEC_FACTS.event2026.name}`,
    paragraphs: [
      `${WEC_FACTS.event2026.name} · ${WEC_FACTS.event2026.dateDisplay} · ${WEC_FACTS.event2026.addressDisplay}`,
      WEC_FACTS.event2026.liveMessage,
      `${WEC_FACTS.scoring.version}: Tactile ${WEC_FACTS.scoring.tactile}, Taste ${WEC_FACTS.scoring.taste}, Flavour ${WEC_FACTS.scoring.flavour} — ${WEC_FACTS.scoring.winThreshold}+ of ${WEC_FACTS.scoring.pointsPerHeat} wins.`,
    ],
    ogImage: "/assets/og/live.jpg",
    jsonLd: breadcrumb("/live/wec-2026-panama", "Live Bracket"),
  },
  {
    path: "/live",
    out: "live/index.html",
    title: `Live Bracket · ${WEC_FACTS.event2026.name} | World Espresso Championship`,
    description: WEC_FACTS.event2026.liveMessage,
    h1: `Live Bracket · ${WEC_FACTS.event2026.name}`,
    paragraphs: [WEC_FACTS.event2026.liveMessage],
    ogImage: "/assets/og/live.jpg",
  },
  {
    path: "/store",
    out: "store/index.html",
    title: "Store unavailable | World Espresso Championship",
    description: "The World Espresso Championship store is not currently available.",
    h1: "Store unavailable",
    paragraphs: [
      "No Champion's Product is for sale at this time. When a product exists under signed agreements, WEC will publish status and how to buy it.",
    ],
    ogImage: "/assets/og/home.jpg",
    noindex: true,
  },
  {
    path: "/login",
    out: "login/index.html",
    title: "Admin sign-in | World Espresso Championship",
    description: "Restricted sign-in for WEC administrators.",
    h1: "Admin access",
    paragraphs: ["Restricted to authorised WEC administrators."],
    ogImage: "/assets/og/home.jpg",
    noindex: true,
  },
];

/** News article routes generated from static content slugs */
export const NEWS_ROUTE_SEEDS = [
  {
    slug: "cafe-unido-confirmed-wec-2026",
    title: "Café Unido confirmed: venue and roaster for WEC 2026 Panama",
    description:
      "26 October 2026 at Café Unido, Panama City. Same coffee for every competitor.",
    h1: "Café Unido confirmed: venue and roaster for WEC 2026 Panama",
    paragraphs: [
      "Café Unido is confirmed as venue and roaster sponsor for the World Espresso Championship 2026.",
    ],
  },
  {
    slug: "wec-becomes-independent",
    title: "WEC Becomes Independent: A New Chapter Begins",
    description:
      "WEC begins its independent era in Panama in 2026, building on four championships supported by founding equipment partner Dalla Corte.",
    h1: "WEC Becomes Independent: A New Chapter Begins",
    paragraphs: [
      "The World Espresso Championship continues as an independently organised community project coordinated by founder Tristan Creswick.",
    ],
  },
  {
    slug: "wec-tournament-software",
    title: "First-of-its-kind tournament software for transparent espresso",
    description:
      "Blind heats. Live public brackets. Structured post-heat insight. WEC’s competition software is built for trust.",
    h1: "First-of-its-kind tournament software for transparent espresso",
    paragraphs: [
      "WEC has built purpose-built tournament software: Scoring v3 ballots, blind Cup A/B service, and public live boards.",
    ],
  },
  {
    slug: "wec-2026-panama-champions-coffee",
    title: "WEC 2026 Panama and the Champion's Product ambition",
    description:
      "WEC 2026 Panama advances a transparent Champion's Product ambition — only if agreements can be made responsibly.",
    h1: "WEC 2026 Panama and the Champion's Product ambition",
    paragraphs: [
      "No product, launch date, royalty or distribution is guaranteed before agreements are signed.",
    ],
  },
] as const;

export function ogAbsolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}

export function findRouteMeta(path: string): PublicRouteMeta | undefined {
  const normalised = path === "" ? "/" : path;
  return PUBLIC_ROUTES.find((r) => r.path === normalised);
}
