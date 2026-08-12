#!/usr/bin/env node
/**
 * Post-build static HTML shells for every public route.
 * Injects title, meta, canonical, OG/Twitter, JSON-LD, H1 and core copy
 * so crawlers see content without JavaScript. React still hydrates over #root.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist/public");
const SITE = "https://worldespressochampionship.com";

const FACTS = {
  coreLine: "The cup is the only judge.",
  identity:
    "World Espresso Championship is an independently organised community project coordinated by founder Tristan Creswick.",
  email: "tristan@worldespressochampionship.com",
  event: "WEC 2026 Panama · 26 October 2026 · Café Unido, Panama City, Panama",
  independent:
    "The fifth World Espresso Champion — and the first champion of WEC's independent era.",
  liveMessage: "Live results open on 26 October 2026",
  scoring:
    "Scoring v3: Tactile 15, Taste 10, Flavour 8 per judge · 99 points · 50+ wins. Blind Cup A vs Cup B.",
};

const NEWS = [
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
    paragraphs: [FACTS.identity],
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
];

/** @type {Array<{path:string,out:string,title:string,description:string,h1:string,paragraphs:string[],ogImage:string,noindex?:boolean,type?:string,jsonLd?:any}>} */
const ROUTES = [
  {
    path: "/",
    out: "index.html",
    title: "World Espresso Championship (WEC)",
    description:
      "The World Espresso Championship is a controlled, blind espresso competition. Same coffee. Same machine. Only the barista differs.",
    h1: "THE WORLD ESPRESSO CHAMPIONSHIP",
    paragraphs: [
      "Same coffee. Same machine. Only the barista differs.",
      FACTS.coreLine,
      FACTS.event,
    ],
    ogImage: "/assets/og/home.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "World Espresso Championship",
      alternateName: "WEC",
      url: SITE,
      logo: `${SITE}/assets/logo-white.png`,
      email: FACTS.email,
      sameAs: ["https://www.instagram.com/worldespressochampionship"],
      description: FACTS.identity,
    },
  },
  {
    path: "/panama-2026",
    out: "panama-2026/index.html",
    title: "WEC 2026 Panama | World Espresso Championship",
    description:
      "WEC 2026 Panama at Café Unido on 26 October 2026. Registration is open. Public sponsorship packages available.",
    h1: "WEC 2026 Panama",
    paragraphs: [
      FACTS.event,
      FACTS.independent,
      "Registration is open for eligible national champions. Clear partnerships with public prices.",
    ],
    ogImage: "/assets/og/panama-2026.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "WEC 2026 Panama",
      startDate: "2026-10-26",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Café Unido",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Panama City",
          addressCountry: "Panama",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "World Espresso Championship",
        url: SITE,
      },
      description: `${FACTS.independent} Registration: ${SITE}/panama-2026#competitor-registration`,
      url: `${SITE}/panama-2026`,
    },
  },
  {
    path: "/judging",
    out: "judging/index.html",
    title: "How Judging Works | World Espresso Championship",
    description:
      "Scoring v3: three independent judges, Tactile 15 / Taste 10 / Flavour 8, 99 points per heat, 50+ wins. Blind Cup A vs Cup B.",
    h1: "How the cup decides",
    paragraphs: [
      FACTS.scoring,
      "WEC is designed to reduce avoidable bias: identities are hidden, equipment and ingredients are controlled, judges ballot independently, and results are published.",
    ],
    ogImage: "/assets/og/judging.jpg",
  },
  {
    path: "/rules-and-integrity",
    out: "rules-and-integrity/index.html",
    title: "Rules & Integrity | World Espresso Championship",
    description:
      "Public rules for the World Espresso Championship: controlled variables, blind judging, Scoring v3, and partner independence.",
    h1: "Rules & Integrity",
    paragraphs: [
      FACTS.coreLine,
      "Canonical public summary of how WEC runs a heat. Items not yet final are listed clearly.",
    ],
    ogImage: "/assets/og/judging.jpg",
  },
  {
    path: "/champions",
    out: "champions/index.html",
    title: "Champions | World Espresso Championship",
    description:
      "World Espresso Champions 2022–2025. The fifth World Espresso Champion will be crowned in Panama in 2026.",
    h1: "History of Champions",
    paragraphs: [FACTS.independent],
    ogImage: "/assets/og/champions.jpg",
  },
  {
    path: "/innovation",
    out: "innovation/index.html",
    title: "Innovation Lab | World Espresso Championship",
    description:
      "Find excellence. Understand it. Build from it. The WEC Innovation Lab supports the championship with structured insight.",
    h1: "The competition is also a lab.",
    paragraphs: [
      "Find excellence. Understand it. Build from it.",
      "The Innovation Lab supports the championship. It does not replace it.",
    ],
    ogImage: "/assets/og/innovation.jpg",
  },
  {
    path: "/about",
    out: "about/index.html",
    title: "About | World Espresso Championship",
    description:
      "World Espresso Championship (WEC) — a controlled, blind espresso championship. The cup is the only judge.",
    h1: "About the World Espresso Championship",
    paragraphs: [FACTS.identity, FACTS.coreLine],
    ogImage: "/assets/og/home.jpg",
  },
  {
    path: "/history",
    out: "history/index.html",
    title: "History | World Espresso Championship",
    description:
      "WEC developed through four international championships from 2022 to 2025 with founding equipment partner Dalla Corte.",
    h1: "History of Championships",
    paragraphs: [
      "WEC developed through four international championships from 2022 to 2025 with the support of founding equipment partner Dalla Corte. In 2026, WEC begins its independent era in Panama.",
    ],
    ogImage: "/assets/og/dalla-corte.jpg",
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
  },
  {
    path: "/news",
    out: "news/index.html",
    title: "News | World Espresso Championship",
    description: "News and announcements from the World Espresso Championship.",
    h1: "News",
    paragraphs: ["Announcements and updates from the World Espresso Championship."],
    ogImage: "/assets/og/home.jpg",
  },
  {
    path: "/faq",
    out: "faq/index.html",
    title: "FAQ | World Espresso Championship",
    description:
      "Frequently asked questions about the World Espresso Championship and WEC 2026 Panama.",
    h1: "FAQ",
    paragraphs: ["Answers about format, registration, scoring and WEC 2026 Panama."],
    ogImage: "/assets/og/home.jpg",
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
      `Email: ${FACTS.email}`,
    ],
    ogImage: "/assets/og/home.jpg",
  },
  {
    path: "/privacy",
    out: "privacy/index.html",
    title: "Privacy & Data Use | World Espresso Championship",
    description:
      "How the World Espresso Championship collects and uses information from registration and contact forms.",
    h1: "Privacy & Data Use",
    paragraphs: [
      FACTS.identity,
      "This page explains what information WEC collects online, why, who can access it, and how to request access, correction or deletion.",
    ],
    ogImage: "/assets/og/home.jpg",
  },
  {
    path: "/terms",
    out: "terms/index.html",
    title: "Website & Participation Terms | World Espresso Championship",
    description:
      "Website and participation terms for the World Espresso Championship. Competition rules are published separately.",
    h1: "Website & Participation Terms",
    paragraphs: [
      FACTS.identity,
      "These terms cover website use and participation. Competition rules are at /rules-and-integrity.",
    ],
    ogImage: "/assets/og/home.jpg",
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
  },
  {
    path: "/live/wec-2026-panama",
    out: "live/wec-2026-panama/index.html",
    title: "Live Bracket · WEC 2026 Panama | World Espresso Championship",
    description: `WEC 2026 Panama live results and bracket. ${FACTS.liveMessage}`,
    h1: "Live Bracket · WEC 2026 Panama",
    paragraphs: [FACTS.event, FACTS.liveMessage, FACTS.scoring],
    ogImage: "/assets/og/live.jpg",
  },
  {
    path: "/live",
    out: "live/index.html",
    title: "Live Bracket · WEC 2026 Panama | World Espresso Championship",
    description: FACTS.liveMessage,
    h1: "Live Bracket · WEC 2026 Panama",
    paragraphs: [FACTS.liveMessage],
    ogImage: "/assets/og/live.jpg",
  },
  {
    path: "/store",
    out: "store/index.html",
    title: "Store unavailable | World Espresso Championship",
    description: "The World Espresso Championship store is not currently available.",
    h1: "Store unavailable",
    paragraphs: [
      "No Champion's Product is for sale at this time.",
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
  {
    path: "/404",
    out: "404.html",
    title: "Page not found | World Espresso Championship",
    description: "This page does not exist on the World Espresso Championship website.",
    h1: "404 — Page not found",
    paragraphs: [
      "This page is not part of the World Espresso Championship site.",
      "Try Home, WEC 2026 Panama, or Contact.",
    ],
    ogImage: "/assets/og/home.jpg",
    noindex: true,
  },
];

for (const article of NEWS) {
  ROUTES.push({
    path: `/news/${article.slug}`,
    out: `news/${article.slug}/index.html`,
    title: `${article.title} | World Espresso Championship`,
    description: article.description,
    h1: article.h1,
    paragraphs: article.paragraphs,
    ogImage: "/assets/og/panama-2026.jpg",
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.description,
      mainEntityOfPage: `${SITE}/news/${article.slug}`,
      author: { "@type": "Organization", name: "World Espresso Championship" },
    },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHead(route, templateHead) {
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  const og = `${SITE}${route.ogImage}`;
  const robots = route.noindex ? "noindex,nofollow" : "index,follow";
  const type = route.type || "website";

  let head = templateHead;
  head = head.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);

  // Replace or inject description
  if (/name="description"/.test(head)) {
    head = head.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(route.description)}" />`,
    );
  } else {
    head = head.replace(
      "</head>",
      `    <meta name="description" content="${escapeHtml(route.description)}" />\n  </head>`,
    );
  }

  if (/rel="canonical"/.test(head)) {
    head = head.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${url}" />`,
    );
  } else {
    head = head.replace("</head>", `    <link rel="canonical" href="${url}" />\n  </head>`);
  }

  const extra = `
    <meta name="robots" content="${robots}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:image" content="${og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${og}" />
    ${
      route.jsonLd
        ? `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`
        : ""
    }
`;
  head = head.replace("</head>", `${extra}  </head>`);
  return head;
}

function buildBodyShell(route) {
  const paras = route.paragraphs
    .map((p) => `<p style="margin:0 0 1rem;color:#c4b59a;line-height:1.6;max-width:42rem">${escapeHtml(p)}</p>`)
    .join("\n");
  const links = `
    <p style="margin-top:1.5rem">
      <a href="/" style="color:#c4783a;margin-right:1rem">Home</a>
      <a href="/panama-2026" style="color:#c4783a;margin-right:1rem">WEC 2026</a>
      <a href="/judging" style="color:#c4783a;margin-right:1rem">How It Works</a>
      <a href="/contact" style="color:#c4783a">Contact</a>
    </p>`;
  return `<div id="root"><main id="main-content" data-wec-prerender="true" style="min-height:60vh;background:#1a1410;color:#f5ecd8;font-family:Lexend,system-ui,sans-serif;padding:3rem 1.25rem">
  <div style="max-width:56rem;margin:0 auto">
    <p style="color:#c4783a;letter-spacing:.08em;text-transform:uppercase;font-size:.8rem;margin:0 0 .75rem">World Espresso Championship</p>
    <h1 style="font-size:clamp(1.75rem,4vw,3rem);line-height:1.1;margin:0 0 1.25rem;color:#f5ecd8">${escapeHtml(route.h1)}</h1>
    ${paras}
    ${links}
    <noscript><p style="margin-top:2rem;color:#a89478;font-size:.9rem">JavaScript is disabled. Core page content is shown above.</p></noscript>
  </div>
</main></div>`;
}

function main() {
  const templatePath = path.join(OUT, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Missing dist/public/index.html — run vite build first");
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, "utf8");
  const headMatch = template.match(/<head[\s\S]*?<\/head>/i);
  const scriptTags = [...template.matchAll(/<script[^>]*src="[^"]+"[^>]*><\/script>/g)].map((m) => m[0]);
  const linkCss = [...template.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  if (!headMatch) {
    console.error("Could not parse <head> from index.html");
    process.exit(1);
  }

  // Ensure assets referenced by OG exist
  for (const route of ROUTES) {
    const ogDisk = path.join(OUT, route.ogImage.replace(/^\//, ""));
    if (!fs.existsSync(ogDisk)) {
      console.warn(`WARN: missing OG image ${route.ogImage}`);
    }
  }

  let count = 0;
  for (const route of ROUTES) {
    const head = buildHead(route, headMatch[0]);
    // Keep module scripts + css from the built index
    let finalHead = head;
    // Ensure css/js from build remain (already in template head)
    for (const tag of [...linkCss, ...scriptTags]) {
      if (!finalHead.includes(tag)) {
        finalHead = finalHead.replace("</head>", `    ${tag}\n  </head>`);
      }
    }

    const html = `<!doctype html>
<html lang="en">
  ${finalHead}
  <body>
    ${buildBodyShell(route)}
  </body>
</html>
`;
    const dest = path.join(OUT, route.out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, html);
    count += 1;
  }

  // Netlify-friendly: also copy 404.html already written
  console.log(`Prerendered ${count} HTML shells into ${OUT}`);
}

main();
