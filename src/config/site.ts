/** Canonical public site identity (non-legal). */
export const SITE = {
  name: "World Espresso Championship",
  shortName: "WEC",
  /** Production origin — used for canonical URLs and absolute OG image links. */
  origin: "https://worldespressochampionship.com",
  tagline: "Same coffee. Same machine. Only the barista differs.",
  defaultDescription:
    "The World Espresso Championship is the world's most objective espresso competition — blind paired comparison, public recipe data, and a career-defining Champion's Coffee product.",
  locale: "en_US",
  twitterHandle: "@worldespressochampionship",
  instagramUrl: "https://www.instagram.com/worldespressochampionship",
  contactEmail: "hello@worldespressochampionship.com",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return SITE.origin;
  return `${SITE.origin}${normalized.replace(/\/$/, "")}`;
}
