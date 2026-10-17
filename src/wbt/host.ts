export const WBT_CANONICAL_HOSTS = [
  "worldbaristatournament.com",
  "www.worldbaristatournament.com",
] as const;

export const UMBRELLA_HOSTS = [
  "worldcoffeetournaments.com",
  "www.worldcoffeetournaments.com",
] as const;

export const WEC_PUBLIC_URL = "https://worldespressochampionship.com";
export const WBT_PUBLIC_HOST = "worldbaristatournament.com";
/** Live umbrella. Prefer www; they are fixing the apex. */
export const UMBRELLA_PUBLIC_HOST = "www.worldcoffeetournaments.com";
export const UMBRELLA_PUBLIC_URL = "https://www.worldcoffeetournaments.com";
export const SCC_PUBLIC_URL = "https://specialtycoffeecommunity.com";

export type WbtSlug =
  | "home"
  | "how"
  | "sitters"
  | "festival"
  | "results"
  | "competitors"
  | "luck"
  | "wec"
  | "contact";

export const WBT_SLUGS: Record<WbtSlug, string> = {
  home: "",
  how: "/how-it-works",
  sitters: "/sitters",
  festival: "/festival",
  results: "/results",
  competitors: "/competitors",
  luck: "/luck",
  wec: "/wec",
  contact: "/contact",
};

export function currentHostname(): string {
  if (typeof window === "undefined") return "";
  return window.location.hostname;
}

function hostIn(list: readonly string[], hostname: string): boolean {
  return list.includes(hostname);
}

/** Canonical WBT site: pages sit at `/`. */
export function isWbtRootHost(hostname = currentHostname()): boolean {
  return hostIn(WBT_CANONICAL_HOSTS, hostname);
}

/** Umbrella for WEC + WBT. WEC `/` stays WEC; WBT is `/wbt` until the WBT host is live. */
export function isUmbrellaHost(hostname = currentHostname()): boolean {
  return hostIn(UMBRELLA_HOSTS, hostname);
}

export function wbtHref(slug: WbtSlug, hostname = currentHostname()): string {
  const rest = WBT_SLUGS[slug];
  if (isWbtRootHost(hostname)) return rest || "/";
  return `/wbt${rest}`;
}

export function wecHomeHref(hostname = currentHostname()): string {
  return isWbtRootHost(hostname) ? WEC_PUBLIC_URL : "/";
}

export function isWecExternal(hostname = currentHostname()): boolean {
  return wecHomeHref(hostname).startsWith("http");
}

export function wbtPathKey(pathname: string): string {
  if (pathname === "/wbt" || pathname === "/wbt/") return "/";
  if (pathname.startsWith("/wbt/")) return pathname.slice(4);
  return pathname || "/";
}

export function isActiveWbtPath(pathname: string, slug: WbtSlug): boolean {
  const key = wbtPathKey(pathname);
  const rest = WBT_SLUGS[slug];
  if (!rest) return key === "/";
  return key === rest;
}
