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
      "Held at Café Unido, Panama City, on 26 October 2026 — the first independent WEC.",
    championProduct: "To be announced — Champion's Coffee Product",
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
    format: "Single elimination, ISO 5495 paired comparison",
    keyHighlights:
      "Held at Bobino Milano. The manufacturer's home territory — and the turning point toward independence.",
    description:
      "The event that proved WEC needed to become independent. Champion: Muhammad Aga (Indonesia).",
    championProduct: "Pre-product era",
    sponsor: "Italian espresso machine manufacturer",
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
    format: "Single elimination, ISO 5495 paired comparison",
    keyHighlights:
      "Biggest event yet. More SCA and WBC judges than ever before.",
    description:
      "The event that proved WEC had outgrown its original sponsor.",
    championProduct: "Pre-product era",
    sponsor: "Italian espresso machine manufacturer",
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
    format: "Single elimination, ISO 5495 paired comparison",
    keyHighlights:
      "First event held alongside WBC. Increased visibility across the community.",
    description: "Held during the WBC in Athens. The word began to spread.",
    championProduct: "Pre-product era",
    sponsor: "Italian espresso machine manufacturer",
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
    format: "Single elimination, ISO 5495 paired comparison",
    keyHighlights:
      "The inaugural event. Competitors and judges gave overwhelmingly positive feedback.",
    description:
      "The first World Espresso Championship. A proof of concept that became a movement.",
    championProduct: "Pre-product era",
    sponsor: "Italian espresso machine manufacturer",
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
    title: "WEC 2026 Panama: The Inaugural Year of Champion's Coffee",
    slug: "wec-2026-panama-champions-coffee",
    excerpt:
      "This year changes everything. The winner of WEC 2026 will have their name on a coffee bag within 30 days of winning.",
    content:
      "The World Espresso Championship is proud to announce the inaugural year of the Champion's Coffee Product. This unprecedented initiative transforms the competition from a title chase into a career-defining opportunity.",
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
      "After years of being held back, WEC is finally free to become what it was always meant to be.",
    content:
      "The World Espresso Championship has officially become an independent organization. Founded by Tristan Creswick in 2022, WEC is building the most objective, transparent, and commercially innovative coffee competition in the world.",
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
      "Café Unido is confirmed as venue and roaster sponsor for the World Espresso Championship 2026. Panama City. Blind paired comparison. Live public bracket. Inaugural Champion's Coffee Product year. Read the full story on /truth.",
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
