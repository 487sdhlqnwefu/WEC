import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import { ArrowRight, Eye, Scale, Coffee } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "National Qualifier",
    desc: "Win your country's national espresso competition.",
  },
  {
    step: "02",
    title: "World Finals",
    desc: "Join other national champions at the world finals.",
  },
  {
    step: "03",
    title: "Single Elimination",
    desc: "Head-to-head matches with the same coffee and equipment.",
  },
  {
    step: "04",
    title: "Blind Judging",
    desc: "ISO 5495 paired comparison. No bias. No politics.",
  },
  {
    step: "05",
    title: "Champion Crowned",
    desc: "Title, prize, and from 2026 — the Champion's Coffee product.",
  },
];

export default function HowItWorks() {
  return (
    <PageShell
      eyebrow="Format & Judging"
      title="How It Works & Judging"
      lead="Five steps from qualification to champion. Every match uses the same coffee, the same machine, and blind paired comparison — so the cup decides."
    >
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-cinnamon-400">
                    {item.step}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-sand-100 mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-sand-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Scale,
                title: "ISO 5495 Paired Comparison",
                body: "Two espressos. One preference. Binary sensory science used worldwide — not score sheets that drift between judges.",
              },
              {
                icon: Eye,
                title: "100% Blind",
                body: "Judges never know who pulled the shot. Names, nations, and reputations stay off the cup.",
              },
              {
                icon: Coffee,
                title: "Identical Conditions",
                body: "Same green coffee, same roast protocol, same machine. Only the barista differs.",
              },
            ].map((item) => (
              <div key={item.title} className="wec-card rounded-xl p-6">
                <item.icon className="w-8 h-8 text-cinnamon-400 mb-4" />
                <h2 className="text-xl font-semibold text-sand-100 mb-3">
                  {item.title}
                </h2>
                <p className="text-sand-400 leading-relaxed text-sm">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/panama-2026">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                Register for WEC 2026
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
              >
                About WEC
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
