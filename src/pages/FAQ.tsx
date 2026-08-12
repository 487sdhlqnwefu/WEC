import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { WEC_FACTS } from "@/data/wecFacts";

const faqCategories = [
  {
    name: "Competition Format",
    questions: [
      {
        q: "How does Scoring v3 work?",
        a: `${WEC_FACTS.scoring.methodologyNote} Per judge: Tactile ${WEC_FACTS.scoring.tactile}, Taste ${WEC_FACTS.scoring.taste}, Flavour ${WEC_FACTS.scoring.flavour}. Three judges = ${WEC_FACTS.scoring.pointsPerHeat} points. ${WEC_FACTS.scoring.winThreshold}+ wins. Flavour matters, but its ${WEC_FACTS.scoring.flavour} points cannot win a heat on its own. Percentages rounded; the points govern.`,
      },
      {
        q: "How many competitors participate?",
        a: `WEC 2026 Panama plans a field of ${WEC_FACTS.event2026.fieldSize} national champions in single elimination.`,
      },
      {
        q: "What is controlled in each heat?",
        a: "Same coffee, same roast, same grinder platform, same water, same machine platform. Only barista execution changes. Judges compare blinded Cup A and Cup B.",
      },
      {
        q: "How does blind judging work?",
        a: WEC_FACTS.scoring.biasNote,
      },
    ],
  },
  {
    name: "Registration",
    questions: [
      {
        q: "Who can register as a competitor?",
        a: WEC_FACTS.eligibility.competitor,
      },
      {
        q: "How do I register?",
        a: "Use Register on the site. It opens the competitor registration form on the WEC 2026 Panama page. Registration is open; no closing date is published yet.",
      },
      {
        q: "Can I register as a judge?",
        a: WEC_FACTS.eligibility.judge,
      },
    ],
  },
  {
    name: "Sponsorship",
    questions: [
      {
        q: "What are the public sponsorship packages?",
        a: WEC_FACTS.sponsorship.packages
          .map((p) => `${p.name} (${p.price})`)
          .join("; "),
      },
      {
        q: "Do partners influence judging?",
        a: WEC_FACTS.sponsorship.independencePrinciple,
      },
    ],
  },
  {
    name: "Champion's Product",
    questions: [
      {
        q: "What is the Champion's Product transparency model?",
        a: WEC_FACTS.championsProduct.publicCopy.replace(/\n\n/g, " "),
      },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <Seo
        title="FAQ | World Espresso Championship"
        description="Answers about Scoring v3, registration, sponsorship packages, and the Champion's Product transparency model."
        path="/faq"
      />
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <HelpCircle className="w-10 h-10 text-cinnamon-400 mb-4" aria-hidden />
          <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
            Frequently Asked <span className="wec-gradient-text">Questions</span>
          </h1>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container max-w-3xl">
          {faqCategories.map((cat) => (
            <div key={cat.name} className="mb-10">
              <h2 className="text-xl font-semibold text-sand-100 mb-4">{cat.name}</h2>
              <div className="space-y-2">
                {cat.questions.map((item) => {
                  const id = `${cat.name}-${item.q}`;
                  const open = openId === id;
                  return (
                    <div key={id} className="wec-card rounded-xl overflow-hidden">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-11"
                        aria-expanded={open}
                        aria-controls={`faq-${id}`}
                        onClick={() => setOpenId(open ? null : id)}
                      >
                        <span className="text-sand-100 font-medium text-sm sm:text-base">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-sand-500 transition-transform ${open ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      <div
                        id={`faq-${id}`}
                        role="region"
                        hidden={!open}
                        className="px-5 pb-4 text-sm text-sand-400 leading-relaxed"
                      >
                        {item.a}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-16 wec-card rounded-xl p-8 text-center">
            <MessageCircle className="w-10 h-10 text-cinnamon-400 mx-auto mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-sand-100 mb-2">Still have questions?</h3>
            <p className="text-sand-400 text-sm mb-4 max-w-md mx-auto">
              Your message reaches Tristan Creswick, WEC founder, directly. Email{" "}
              <a
                href={WEC_FACTS.organisation.founderMailto}
                className="text-cinnamon-400 hover:text-cinnamon-300"
              >
                {WEC_FACTS.organisation.founderEmail}
              </a>
              .
            </p>
            <Link to="/contact">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 min-h-11">
                Contact Tristan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
