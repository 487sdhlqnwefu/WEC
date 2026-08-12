import { getDb } from "../api/queries/connection";
import { events, products, newsPosts } from "./schema";

async function seed() {
  const db = getDb();

  // Seed Events
  const existingEvents = await db.select().from(events);
  if (existingEvents.length === 0) {
    await db.insert(events).values([
      {
        name: "WEC 2022",
        year: 2022,
        date: "2022",
        location: "Melbourne, Australia",
        venue: "Code Black Coffee HQ",
        winner: "Junior Vargas",
        winnerProfileUrl: "https://www.instagram.com/jr.coffeeman/",
        format: "Single elimination, ISO 5495 paired comparison",
        keyHighlights: "The inaugural event. Competitors and judges gave overwhelmingly positive feedback.",
        description: "The first World Espresso Championship. A proof of concept that became a movement.",
        championProduct: "Pre-product era",
        sponsor: "Italian espresso machine manufacturer",
        isUpcoming: false,
        sortOrder: 5,
      },
      {
        name: "WEC 2023",
        year: 2023,
        date: "2023",
        location: "Athens, Greece",
        venue: "360 Athens",
        winner: "Jack Simpson",
        winnerProfileUrl: "https://www.instagram.com/jacksimpson32/",
        format: "Single elimination, ISO 5495 paired comparison",
        keyHighlights: "First event held alongside WBC. Increased visibility. More SCA and WBC judges attended.",
        description: "Held during the WBC in Athens. The community started to grow. The word began to spread.",
        championProduct: "Pre-product era",
        sponsor: "Italian espresso machine manufacturer",
        isUpcoming: false,
        sortOrder: 4,
      },
      {
        name: "WEC 2024",
        year: 2024,
        date: "2024",
        location: "Busan, South Korea",
        venue: "Momos Coffee HQ",
        winner: "Ian Kissick",
        winnerProfileUrl: "https://www.instagram.com/ian_kissick/",
        format: "Single elimination, ISO 5495 paired comparison",
        keyHighlights: "Biggest event yet. More SCA judges and WBC judges than ever before. The community was growing.",
        description: "The event that proved WEC had outgrown its original sponsor. The community demanded more.",
        championProduct: "Pre-product era",
        sponsor: "Italian espresso machine manufacturer",
        isUpcoming: false,
        sortOrder: 3,
      },
      {
        name: "WEC 2025",
        year: 2025,
        date: "22 October 2025",
        location: "Milan, Italy",
        venue: "Bobino Milano",
        winner: "Muhammad Aga",
        winnerProfileUrl: "https://www.instagram.com/muhammadaga/",
        format: "Single elimination, ISO 5495 paired comparison",
        keyHighlights: "Held at Bobino Milano. The manufacturer's home territory — and the turning point toward independence.",
        description: "The event that proved the manufacturer could not see what the competitors saw. WEC became independent. Champion: Muhammad Aga.",
        championProduct: "Pre-product era",
        sponsor: "Italian espresso machine manufacturer",
        isUpcoming: false,
        sortOrder: 2,
      },
      {
        name: "WEC 2026 Panama",
        year: 2026,
        date: "26 October 2026",
        location: "Panama City, Panama",
        venue: "Café Unido",
        winner: null,
        format: "32 competitors, single elimination, ISO 5495 paired comparison, Scoring v3",
        keyHighlights: "First independently-run WEC at Café Unido. Roaster sponsor: Café Unido. Scoring v3 — Tactile 45% / Taste 30% / Flavour 24%. Live transparent bracket.",
        description: "This is the first year. There will never be another first. Held at Café Unido, Panama City, on 26 October 2026.",
        championProduct: "To be announced - first ever Champion's Coffee Product",
        sponsor: "Café Unido (roaster sponsor)",
        isUpcoming: true,
        sortOrder: 1,
      },
    ]);
    console.log("Seeded events");
  }

  // Seed Products (placeholder products for the store)
  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    await db.insert(products).values([
      {
        name: "WEC 2026 Champion Espresso",
        slug: "wec-2026-champion-espresso",
        description: "The official espresso blend created in collaboration with the WEC 2026 World Champion. This limited edition represents the winning recipe, roasted to perfection.",
        championName: "TBD - 2026 Champion",
        competitionYear: 2026,
        origin: "Panama",
        tastingNotes: "To be determined by the champion's winning recipe",
        roastProfile: "Champion's winning profile",
        price: "24.99",
        comparePrice: "29.99",
        isLimitedEdition: true,
        isSubscription: true,
        stock: 100,
        royaltyNote: "5-10% of every sale goes directly to the champion",
        isActive: true,
      },
      {
        name: "WEC Limited Edition Merch Bundle",
        slug: "wec-merch-bundle",
        description: "Support the World Espresso Championship with this exclusive merch bundle including a WEC t-shirt, tote bag, and enamel pin.",
        price: "45.00",
        stock: 200,
        royaltyNote: "Proceeds support the championship",
        isActive: true,
      },
      {
        name: "Champion's Signature Cup",
        slug: "champions-signature-cup",
        description: "The official tasting cup used in the World Espresso Championship. Professionally designed for optimal espresso tasting.",
        price: "18.00",
        stock: 500,
        isActive: true,
      },
    ]);
    console.log("Seeded products");
  }

  // Seed News Posts
  const existingPosts = await db.select().from(newsPosts);
  if (existingPosts.length === 0) {
    await db.insert(newsPosts).values([
      {
        title: "WEC 2026 Panama: The Inaugural Year of Champion's Coffee",
        slug: "wec-2026-panama-champions-coffee",
        excerpt: "This year changes everything. The winner of WEC 2026 will have their name on a coffee bag within 30 days of winning.",
        content: "The World Espresso Championship is proud to announce the inaugural year of the Champion's Coffee Product. This unprecedented initiative transforms the competition from a title chase into a career-defining opportunity. The winner collaborates with a sponsor to develop a seed-to-cup protocol, earning 5-10% royalties on every bag sold. This is the future of coffee competitions.",
        category: "announcement",
        author: "WEC Team",
        published: true,
      },
      {
        title: "WEC Becomes Independent: A New Chapter Begins",
        slug: "wec-becomes-independent",
        excerpt: "After years of being held back, WEC is finally free to become what it was always meant to be.",
        content: "The World Espresso Championship has officially become an independent organization. Founded by Tristan Creswick in 2022, WEC spent its first years under the umbrella of an Italian espresso machine manufacturer who never truly understood the competition's potential. Now, free from that constraint, WEC is building the most objective, transparent, and commercially innovative coffee competition in the world.",
        category: "announcement",
        author: "WEC Team",
        published: true,
      },
    ]);
    console.log("Seeded news posts");
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(console.error);
