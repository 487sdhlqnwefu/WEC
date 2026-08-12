import { useEffect } from "react";
import { useLocation } from "react-router";
import { SITE, absoluteUrl } from "@/config/site";
import {
  OG_IMAGE_FILES,
  buildJsonLd,
  getRouteMeta,
  type PublicRouteMeta,
} from "@/seo/routeMeta";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  const id = "wec-jsonld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applyRouteMeta(route: PublicRouteMeta) {
  const url = absoluteUrl(route.path);
  const ogImage = absoluteUrl(OG_IMAGE_FILES[route.ogImage]);

  document.title = route.title;
  upsertMeta("name", "description", route.description);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", route.title);
  upsertMeta("name", "twitter:description", route.description);
  upsertMeta("name", "twitter:image", ogImage);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE.name);
  upsertMeta("property", "og:locale", SITE.locale);
  upsertMeta("property", "og:title", route.title);
  upsertMeta("property", "og:description", route.description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertLink("canonical", url);

  if (route.noindex) {
    upsertMeta("name", "robots", "noindex, nofollow");
  } else {
    const robots = document.head.querySelector('meta[name="robots"]');
    robots?.remove();
  }

  upsertJsonLd(buildJsonLd(route));
}

/** Client-side head sync; prerender already embeds the same tags in static HTML. */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = getRouteMeta(pathname);
    if (route) {
      applyRouteMeta(route);
      return;
    }
    document.title = `Page Not Found | ${SITE.name}`;
    upsertMeta("name", "robots", "noindex, nofollow");
  }, [pathname]);

  return null;
}
