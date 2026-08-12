import { SITE, absoluteUrl } from "@/config/site";

export type OgImageKey =
  | "home"
  | "panama-2026"
  | "how-it-works"
  | "champions"
  | "innovation-lab"
  | "live"
  | "dalla-corte";

export type PublicRouteMeta = {
  path: string;
  /** Output directory under dist/public (no leading slash). "" = site root. */
  outDir: string;
  title: string;
  description: string;
  h1: string;
  /** Short no-JS core copy (plain text paragraphs). */
  coreCopy: string[];
  ogImage: OgImageKey;
  /** Schema.org @type for JSON-LD */
  schemaType: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  noindex?: boolean;
};

export const OG_IMAGE_FILES: Record<OgImageKey, string> = {
  home: "/og/home.jpg",
  "panama-2026": "/og/panama-2026.jpg",
  "how-it-works": "/og/how-it-works.jpg",
  champions: "/og/champions.jpg",
  "innovation-lab": "/og/innovation-lab.jpg",
  live: "/og/live.jpg",
  "dalla-corte": "/og/dalla-corte.jpg",
};

/** Stable public routes that are statically prerendered for crawlers & true 200s. */
export const PUBLIC_ROUTES: PublicRouteMeta[] = [
  {
    path: "/",
    outDir: "",
    title: `${SITE.name} | Objective Espresso Competition`,
    description: SITE.defaultDescription,
    h1: "The World Espresso Championship",
    coreCopy: [
      SITE.tagline,
      "The most objective competition in coffee. Blind paired comparison. Winner takes a career — not just a trophy.",
      "WEC 2026 Panama — the first independent championship — welcomes national espresso champions for a single-elimination finals.",
    ],
    ogImage: "home",
    schemaType: "WebPage",
  },
  {
    path: "/about",
    outDir: "about",
    title: `About | ${SITE.name}`,
    description:
      "Learn how the World Espresso Championship uses blind ISO 5495 paired comparison to find the best espresso maker on Earth.",
    h1: "The World's Most Objective Espresso Competition",
    coreCopy: [
      "The World Espresso Championship exists to find the best espresso maker on Earth through blind, paired-comparison testing.",
      "Same coffee. Same machine. Only the barista differs. Public recipe data. A Champion's Coffee product that builds careers.",
    ],
    ogImage: "how-it-works",
    schemaType: "AboutPage",
  },
  {
    path: "/how-it-works",
    outDir: "how-it-works",
    title: `How It Works & Judging | ${SITE.name}`,
    description:
      "From national qualifier to world champion: single-elimination matches judged by ISO 5495 blind paired comparison.",
    h1: "How It Works & Judging",
    coreCopy: [
      "Five steps from qualification to champion: national qualifier, world finals, single elimination, blind judging, and crowning.",
      "Judging uses ISO 5495:2005 paired comparison. Two espressos. Same coffee and equipment. The judge chooses. No scores. No politics.",
    ],
    ogImage: "how-it-works",
    schemaType: "WebPage",
  },
  {
    path: "/history",
    outDir: "history",
    title: `History | ${SITE.name}`,
    description:
      "From a Melbourne proof of concept to a global movement — the story of every World Espresso Championship.",
    h1: "History of Championships",
    coreCopy: [
      "From a proof of concept in Melbourne to a global movement. Every event built on the last, driven by competitor feedback and a vision for transparent competition.",
    ],
    ogImage: "champions",
    schemaType: "CollectionPage",
  },
  {
    path: "/champions",
    outDir: "champions",
    title: `Champions | ${SITE.name}`,
    description:
      "Meet the baristas who proved themselves under the most objective espresso format in coffee.",
    h1: "WEC Champions",
    coreCopy: [
      "WEC champions earn more than a title. They prove skill under identical conditions — and from 2026, the winner launches a Champion's Coffee product with real royalties.",
    ],
    ogImage: "champions",
    schemaType: "CollectionPage",
  },
  {
    path: "/panama-2026",
    outDir: "panama-2026",
    title: `WEC 2026 Panama | ${SITE.name}`,
    description:
      "Register for WEC 2026 Panama — the first independent World Espresso Championship. Competitors, judges, volunteers, and sponsors welcome.",
    h1: "WEC 2026 Panama",
    coreCopy: [
      "The first independent World Espresso Championship. National champions compete head-to-head in Panama for the title and the Champion's Coffee product.",
      "Register as a competitor, judge, or volunteer — or enquire about sponsorship.",
    ],
    ogImage: "panama-2026",
    schemaType: "WebPage",
  },
  {
    path: "/vision",
    outDir: "vision",
    title: `Vision | ${SITE.name}`,
    description:
      "What a coffee industry body should actually do: objective standards, research, fair competitions, and careers — not gatekeeping.",
    h1: "What a Coffee Industry Body Should Actually Do",
    coreCopy: [
      "The specialty coffee industry deserves an organisation that serves its people — creating value, sharing knowledge, and paying the people who make the industry better.",
    ],
    ogImage: "innovation-lab",
    schemaType: "WebPage",
  },
  {
    path: "/innovation-lab",
    outDir: "innovation-lab",
    title: `Innovation Lab | ${SITE.name}`,
    description:
      "WEC Innovation Lab — extraction science, sensory methodology, and open data for the coffee community.",
    h1: "Innovation Lab",
    coreCopy: [
      "The Innovation Lab is where WEC turns competition into progress: open recipe data, sensory research, and tools that raise the floor for every barista.",
    ],
    ogImage: "innovation-lab",
    schemaType: "WebPage",
  },
  {
    path: "/live",
    outDir: "live",
    title: `Live Results | ${SITE.name}`,
    description:
      "Live brackets and results from the World Espresso Championship. Follow matches as they happen.",
    h1: "Live Results",
    coreCopy: [
      "Follow brackets and match results when the championship is live. Between events, explore past championships and register for the next finals.",
    ],
    ogImage: "live",
    schemaType: "WebPage",
  },
  {
    path: "/store",
    outDir: "store",
    title: `Store | ${SITE.name}`,
    description:
      "Champion's Coffee and official World Espresso Championship merchandise.",
    h1: "Champion's Coffee Store",
    coreCopy: [
      "Official WEC merchandise and the Champion's Coffee product — supporting the competition and the baristas who win it.",
    ],
    ogImage: "home",
    schemaType: "CollectionPage",
  },
  {
    path: "/news",
    outDir: "news",
    title: `News & Media | ${SITE.name}`,
    description:
      "Announcements, media updates, and stories from the World Espresso Championship community.",
    h1: "News & Media",
    coreCopy: [
      "Announcements and media from the World Espresso Championship community.",
    ],
    ogImage: "home",
    schemaType: "CollectionPage",
  },
  {
    path: "/faq",
    outDir: "faq",
    title: `FAQ | ${SITE.name}`,
    description:
      "Frequently asked questions about eligibility, judging, registration, and the Champion's Coffee product.",
    h1: "Frequently Asked Questions",
    coreCopy: [
      "Answers about competitor and judge eligibility, blind judging, registration, and the Champion's Coffee product.",
    ],
    ogImage: "how-it-works",
    schemaType: "FAQPage",
  },
  {
    path: "/contact",
    outDir: "contact",
    title: `Contact | ${SITE.name}`,
    description:
      "Contact the World Espresso Championship team for media, sponsorship, or general enquiries.",
    h1: "Contact",
    coreCopy: [
      `Reach the WEC team at ${SITE.contactEmail} for media, sponsorship, and general enquiries.`,
    ],
    ogImage: "home",
    schemaType: "ContactPage",
  },
  {
    path: "/decisions",
    outDir: "decisions",
    title: `Tiny Decisions | ${SITE.name}`,
    description:
      "WEC Tiny Decisions — spin wheels, coin flips, random numbers, and finger pickers with championship style.",
    h1: "Tiny Decisions",
    coreCopy: [
      "Spin wheels, flip coins, pick numbers, and settle group choices — lightweight decision tools with WEC style.",
    ],
    ogImage: "home",
    schemaType: "WebPage",
  },
  {
    path: "/thanks/dalla-corte",
    outDir: "thanks/dalla-corte",
    title: `Thank You, Dalla Corte | ${SITE.name}`,
    description:
      "WEC thanks Dalla Corte for supporting objective espresso competition with world-class equipment.",
    h1: "Thank You, Dalla Corte",
    coreCopy: [
      "The World Espresso Championship thanks Dalla Corte for equipment partnership that keeps the competition fair: same machines, same standard, for every barista.",
    ],
    ogImage: "dalla-corte",
    schemaType: "WebPage",
  },
  {
    path: "/privacy",
    outDir: "privacy",
    title: `Privacy Policy | ${SITE.name}`,
    description:
      "Privacy Policy for the World Espresso Championship website and related services.",
    h1: "Privacy Policy",
    coreCopy: [
      "This Privacy Policy explains how the World Espresso Championship processes personal data. Full controller details are published when organisational identity is confirmed.",
    ],
    ogImage: "home",
    schemaType: "WebPage",
  },
  {
    path: "/terms",
    outDir: "terms",
    title: `Terms of Service | ${SITE.name}`,
    description:
      "Terms of Service for the World Espresso Championship website and related services.",
    h1: "Terms of Service",
    coreCopy: [
      "These Terms govern use of the World Espresso Championship website and related services. Full legal entity details are published when organisational identity is confirmed.",
    ],
    ogImage: "home",
    schemaType: "WebPage",
  },
];

export function getRouteMeta(pathname: string): PublicRouteMeta | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return PUBLIC_ROUTES.find((r) => r.path === normalized);
}

export function buildJsonLd(route: PublicRouteMeta): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": route.schemaType,
    name: route.h1,
    description: route.description,
    url: absoluteUrl(route.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.origin,
    },
  };
}
