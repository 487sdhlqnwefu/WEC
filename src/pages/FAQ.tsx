import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const faqCategories = [
  {
    name: "Competition Format",
    questions: [
      {
        q: "What is ISO 5495 paired comparison methodology?",
        a: "ISO 5495:2005 is the international standard for sensory analysis — methodology of paired comparison. In WEC Scoring v3, judges choose Cup A or Cup B for Tactile (15 pts), Taste (10 pts), and Flavour (8 pts). Three judges = 99 points. 50+ wins. No visual categories, no deliberation.",
      },
      {
        q: "How many competitors participate?",
        a: "WEC 2026 Panama will feature 32 country champions competing in 5 rounds of single-elimination competition. 31 matches total. One winner.",
      },
      {
        q: "What equipment is used?",
        a: "All competitors use the exact same espresso machine, grinder, and tools. The coffee is roasted by Café Unido — same beans for everyone. The only variable is the barista.",
      },
      {
        q: "How does blind judging work?",
        a: "Judges never know whose coffee is whose. Each match presents two cups labeled A and B. Judges choose A or B independently for Tactile, Taste, and Flavour. No discussion, no deliberation. Results publish live on the public bracket.",
      },
      {
        q: "Where can I watch results live?",
        a: "The public live bracket is at /live/wec-2026-panama on this site. Match outcomes and scores update as heats complete.",
      },
      {
        q: "Is WEC only a competition?",
        a: "No. WEC is also a think tank. After each heat, competitors provide structured feedback — recipes, extraction choices, equipment notes. That insight helps the industry build better machines, grinders, water systems, and accessories. Read more at /innovation.",
      },
    ],
  },
  {
    name: "Registration",
    questions: [
      {
        q: "Who can compete?",
        a: "WEC is open to current Barista Champions attending WBC 2026, or top 3 National Espresso Champions from 2021 onwards. Limited to 1 competitor per country.",
      },
      {
        q: "How do I register as a competitor?",
        a: "Fill out the competitor registration form on the WEC 2026 Panama page. You'll need to provide your name, country, employer, qualification method, and agree to the competition rules.",
      },
      {
        q: "What does registration cost?",
        a: "Competitor registration is free. Travel and accommodation costs are the responsibility of the competitor or their sponsor.",
      },
      {
        q: "Can I register as a judge?",
        a: "Yes! Eligibility is open to Barista Champions (top 6), Cup Tasters Champions, Q Graders, and those with WCC Sensory Certification. No prior judging experience is required — we provide training.",
      },
    ],
  },
  {
    name: "Sponsorship",
    questions: [
      {
        q: "What sponsorship tiers are available?",
        a: "Presenting Partner (€15–25k), Official Partner (€7.5–12k), Supporting Partner (€2.5–5k), plus in-kind/trade by agreement. Café Unido is already confirmed as venue and roaster sponsor. Our cash target to run Panama cleanly is about €20,000.",
      },
      {
        q: "What does a presenting partner receive?",
        a: "Lead recognition ('presented with [Your Brand]'), on-site branding at Café Unido, logo on the live bracket and website, social/LinkedIn mentions, hospitality passes, and optional demo space.",
      },
      {
        q: "Can smaller brands still sponsor?",
        a: "Yes. Supporting Partner starts around €2,500, and we welcome in-kind partners (machines, water, media, travel support). Every partner that helps Panama run well matters.",
      },
    ],
  },
  {
    name: "Champion's Coffee Product",
    questions: [
      {
        q: "What is the Champion's Coffee Product?",
        a: "The winner of WEC 2026 collaborates with a sponsor to develop a seed-to-cup protocol — a repeatable recipe for an amazing beverage. The coffee is named after the champion and sold globally.",
      },
      {
        q: "How much does the champion earn?",
        a: "The champion receives 5-10% royalty on every bag sold. Estimated €7,500+ in Year 1. Within 30 days of winning, their name will be on a coffee bag.",
      },
      {
        q: "Where will the product be sold?",
        a: "Through the sponsor's retail channels, OCC's online store, and partner cafes worldwide. The champion is contractually obligated to promote the product through their personal channels.",
      },
    ],
  },
  {
    name: "Travel & Accommodation",
    questions: [
      {
        q: "Where is WEC 2026 held?",
        a: "WEC 2026 will be held on 26 October 2026 at Café Unido in Panama City, Panama. Café Unido is also the roaster sponsor for the championship.",
      },
      {
        q: "Do you cover travel costs?",
        a: "WEC does not cover travel or accommodation costs. Competitors are responsible for their own travel arrangements, though we can provide recommendation letters for visa applications.",
      },
    ],
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Competition Format");

  const activeQuestions = faqCategories.find((c) => c.name === activeCategory)?.questions ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <HelpCircle className="w-10 h-10 text-cinnamon-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
              Frequently Asked{" "}
              <span className="wec-gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl">
              Everything you need to know about competing, sponsoring,
              volunteering, and attending WEC.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                      activeCategory === cat.name
                        ? "bg-cinnamon-600 text-sand-100 font-medium"
                        : "text-sand-400 hover:text-sand-200 hover:bg-white/5"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold text-sand-100 mb-6">
                {activeCategory}
              </h2>
              <div className="space-y-3">
                {activeQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="wec-card rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenQuestion(openQuestion === `${activeCategory}-${i}` ? null : `${activeCategory}-${i}`)
                      }
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-sand-100 text-sm sm:text-base pr-4">
                        {q.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-sand-500 flex-shrink-0 transition-transform ${
                          openQuestion === `${activeCategory}-${i}`
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                    {openQuestion === `${activeCategory}-${i}` && (
                      <div className="px-5 pb-5">
                        <p className="text-sand-400 text-sm leading-relaxed pl-0 border-l-2 border-cinnamon-800/50 ml-0 pl-4">
                          {q.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Still have questions */}
          <div className="mt-16 wec-card rounded-xl p-8 text-center">
            <MessageCircle className="w-10 h-10 text-cinnamon-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sand-100 mb-2">
              Still Have Questions?
            </h3>
            <p className="text-sand-400 text-sm mb-6 max-w-md mx-auto">
              We are here to help. Reach out to us and we'll get back to you as
              soon as possible.
            </p>
            <Link to="/contact">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
