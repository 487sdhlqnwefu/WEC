/** Static content so Netlify (no API) still shows History, News, Past Championships */

export type StaticEvent = {
  id: number;
  name: string;
  year: number;
  date: string | null;
  location: string;
  venue: string | null;
  winner: string | null;
  winnerProfileUrl: string | null;
  format: string | null;
  keyHighlights: string | null;
  description: string | null;
  championProduct: string | null;
  sponsor: string | null;
  isUpcoming: boolean | null;
  sortOrder: number | null;
  photoUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
};

export type StaticNewsPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: "press_release" | "blog" | "announcement" | "event_coverage" | null;
  coverImage: string | null;
  author: string | null;
  published: boolean | null;
  createdAt: Date;
};

export const STATIC_EVENTS: StaticEvent[] = [
  {
    id: 5,
    name: "WEC 2026 Panama",
    year: 2026,
    date: "26 October 2026",
    location: "Panama City, Panama",
    venue: "Café Unido",
    winner: null,
    winnerProfileUrl: null,
    format: "32 competitors, single elimination, Scoring v3",
    keyHighlights:
      "First independently-run WEC at Café Unido. Roaster sponsor: Café Unido. Live transparent bracket.",
    description:
      "Held at Café Unido, Panama City, on 26 October 2026 — the fifth World Espresso Championship and the first of WEC's independent era.",
    championProduct: null,
    sponsor: "Café Unido (roaster sponsor)",
    isUpcoming: true,
    sortOrder: 1,
    photoUrl: "/assets/event-36.jpg",
    videoUrl: null,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: 4,
    name: "WEC 2025",
    year: 2025,
    date: "22 October 2025",
    location: "Milan, Italy",
    venue: "Bobino Milano",
    winner: "Muhammad Aga",
    winnerProfileUrl: "https://www.instagram.com/muhammadaga/",
    format: "Single elimination, Scoring v3 blind paired comparison",
    keyHighlights:
      "Held at Bobino Milano with founding equipment partner Dalla Corte supporting the championship.",
    description:
      "WEC 2025 in Milan. Champion: Muhammad Aga (Indonesia).",
    championProduct: null,
    sponsor: "Dalla Corte (founding equipment partner)",
    isUpcoming: false,
    sortOrder: 2,
    photoUrl: "/assets/champions/2025-muhammad-aga.jpg",
    videoUrl: null,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 3,
    name: "WEC 2024",
    year: 2024,
    date: "2024",
    location: "Busan, South Korea",
    venue: "Momos Coffee HQ",
    winner: "Ian Kissick",
    winnerProfileUrl: "https://www.instagram.com/ian_kissick/",
    format: "Single elimination, Scoring v3 blind paired comparison",
    keyHighlights:
      "Biggest event yet. More international judges and guests than ever before.",
    description:
      "A landmark year for the World Espresso Championship community.",
    championProduct: null,
    sponsor: "Dalla Corte (founding equipment partner)",
    isUpcoming: false,
    sortOrder: 3,
    photoUrl: "/assets/champions/2024-ian-kissick.jpg",
    videoUrl: null,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "WEC 2023",
    year: 2023,
    date: "2023",
    location: "Athens, Greece",
    venue: "360 Athens",
    winner: "Jack Simpson",
    winnerProfileUrl: "https://www.instagram.com/jacksimpson32/",
    format: "Single elimination, Scoring v3 blind paired comparison",
    keyHighlights:
      "Increased visibility across the specialty coffee community.",
    description: "Held in Athens. The word began to spread.",
    championProduct: null,
    sponsor: "Dalla Corte (founding equipment partner)",
    isUpcoming: false,
    sortOrder: 4,
    photoUrl: "/assets/champions/2023-jack-simpson.jpg",
    videoUrl: null,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: 1,
    name: "WEC 2022",
    year: 2022,
    date: "2022",
    location: "Melbourne, Australia",
    venue: "Code Black Coffee HQ",
    winner: "Junior Vargas",
    winnerProfileUrl: "https://www.instagram.com/jr.coffeeman/",
    format: "Single elimination, Scoring v3 blind paired comparison",
    keyHighlights:
      "The inaugural event. Competitors and judges gave overwhelmingly positive feedback.",
    description:
      "The first World Espresso Championship. A proof of concept that became a movement.",
    championProduct: null,
    sponsor: "Dalla Corte (founding equipment partner)",
    isUpcoming: false,
    sortOrder: 5,
    photoUrl: "/assets/champions/2022-junior-vargas.jpg",
    videoUrl: null,
    createdAt: new Date("2022-01-01"),
  },
];

export const STATIC_NEWS: StaticNewsPost[] = [
  {
    id: 1,
    title: "WEC 2026 Panama and the Champion's Product ambition",
    slug: "wec-2026-panama-champions-coffee",
    excerpt:
      "WEC 2026 Panama advances a transparent Champion's Product ambition — only if agreements can be made responsibly.",
    content:
      "The World Espresso Championship is preparing for WEC 2026 Panama and a transparent Champion's Product model. No product, launch date, royalty or distribution is guaranteed before agreements are signed. When a product is created, WEC will publish who participates and what has been delivered.",
    category: "announcement",
    coverImage: null,
    author: "WEC Team",
    published: true,
    createdAt: new Date("2026-06-01"),
  },
  {
    id: 2,
    title: "WEC Becomes Independent: A New Chapter Begins",
    slug: "wec-becomes-independent",
    excerpt:
      "WEC begins its independent era in Panama in 2026, building on four championships supported by founding equipment partner Dalla Corte.",
    content:
      "The World Espresso Championship continues as an independent organization. Founded by Tristan Creswick in 2022, WEC is building a controlled, blind espresso championship with public results and a transparent approach to commercial value.",
    category: "announcement",
    coverImage: null,
    author: "WEC Team",
    published: true,
    createdAt: new Date("2026-03-01"),
  },
  {
    id: 3,
    title: "First-of-its-kind tournament software for transparent espresso",
    slug: "wec-tournament-software",
    excerpt:
      "Blind heats. Live public brackets. Structured post-heat insight. WEC’s competition software is built for trust.",
    content:
      "WEC has built purpose-built tournament software: Scoring v3 ballots, blind Cup A/B service, public live boards, and the foundation for the Innovation Lab. This is not a generic spreadsheet — it is the operating system of the championship.",
    category: "press_release",
    coverImage: null,
    author: "WEC Team",
    published: true,
    createdAt: new Date("2026-08-01"),
  },
  {
    id: 4,
    title: "Café Unido confirmed: venue and roaster for WEC 2026 Panama",
    slug: "cafe-unido-confirmed-wec-2026",
    excerpt:
      "26 October 2026 at Café Unido, Panama City. Same coffee for every competitor. The first independent WEC has a home.",
    content:
      "Café Unido is confirmed as venue and roaster sponsor for the World Espresso Championship 2026. Panama City. Blind paired comparison. Live public bracket. Read the full announcement on /news/cafe-unido-confirmed-wec-2026.",
    category: "announcement",
    coverImage: null,
    author: "WEC Team",
    published: true,
    createdAt: new Date("2026-07-01"),
  },
];

/** Fallback when API has no registration count yet — marketing-confirmed field size */
export const REGISTRATION_FALLBACK = {
  confirmedCompetitors: 7,
  competitorLimit: 32,
};
