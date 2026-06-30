import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Target,
  FlaskConical,
  TrendingUp,
  BookOpen,
  Award,
  Eye,
  ArrowRight,
  AlertTriangle,
  Zap,
  Heart,
} from "lucide-react";

export default function Vision() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              What a Coffee Industry Body{" "}
              <span className="wec-gradient-text">Should Actually Do</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed max-w-3xl">
              The specialty coffee industry deserves an organisation that serves
              its people. Not one that extracts fees in exchange for prestige. A
              real industry body should create value, share knowledge, and pay
              the people who make the industry better.
            </p>
          </div>
        </div>
      </section>

      {/* What Should Be */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FlaskConical,
                title: "Set Objective Standards",
                desc: "Define quality using science, not opinion. ISO 5495 paired comparison methodology.",
              },
              {
                icon: TrendingUp,
                title: "Fund Research",
                desc: "Invest in extraction science, sensory methodology, and agronomy.",
              },
              {
                icon: Heart,
                title: "Support Careers",
                desc: "Create pathways from barista to business owner, with real training and credentials.",
              },
              {
                icon: Eye,
                title: "Promote Transparency",
                desc: "Share data openly. Recipes, extraction parameters, pricing. No gatekeeping.",
              },
              {
                icon: Award,
                title: "Host Fair Competitions",
                desc: "Judge coffee by what's in the cup, not who's in the room.",
              },
              {
                icon: BookOpen,
                title: "Educate Without Gatekeeping",
                desc: "Make knowledge accessible, not expensive. Free education for every barista.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="wec-card rounded-xl p-6 wec-card-hover"
              >
                <item.icon className="w-8 h-8 text-cinnamon-400 mb-4" />
                <h3 className="text-lg font-semibold text-sand-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Contrast */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="text-center mb-12">
            <AlertTriangle className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              How Legacy Organisations Fall Short
            </h2>
            <p className="text-sand-400 max-w-2xl mx-auto">
              The gap between what should be and what is. Not aggressive. Just
              clear.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="wec-card rounded-xl p-8">
              <h3 className="text-lg font-semibold text-sand-300 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sand-500" />
                The Status Quo
              </h3>
              <ul className="space-y-4">
                {[
                  "Subjective judging with score drift",
                  "Secret deliberation processes",
                  "Same winners year after year",
                  "Expensive, outdated certification courses",
                  "Data hidden behind paywalls",
                  "Trophy and a photo for champions",
                  "Concerned with own survival over progress",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sand-500">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sand-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="wec-card rounded-xl p-8 border-cinnamon-800/50">
              <h3 className="text-lg font-semibold text-cinnamon-400 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                The WEC Way
              </h3>
              <ul className="space-y-4">
                {[
                  "ISO 5495 binary preference testing",
                  "Blind judging — no bias possible",
                  "Best recipe wins, period",
                  "Free, open education for all baristas",
                  "All competition data published publicly",
                  "Product, revenue stream, global audience",
                  "Competition as innovation and transparency",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sand-300">
                    <Check className="w-4 h-4 text-cinnamon-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Champion's Coffee Is The Model */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-3xl mx-auto text-center">
            <Coffee className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">
              The Champion's Coffee Product Is the Model
            </h2>
            <p className="text-sand-400 leading-relaxed mb-6">
              The Champion's Coffee Product is the standard for how competitions
              should work. It is transparent, innovative, and commercially
              viable. The winner doesn't just get a trophy — they get a career.
            </p>
            <p className="text-sand-400 leading-relaxed mb-8">
              This is what a real industry body does: it creates value. It
              doesn't just charge for access to a word. It builds products,
              shares knowledge, and pays the people who make the industry
              better.
            </p>
            <div className="wec-card rounded-xl p-6 inline-block">
              <p className="text-sand-300 text-sm">
                SCA champions get a trophy and a photo. WEC champions get a
                product, a revenue stream, and a global audience.
              </p>
              <p className="text-gold font-medium mt-2">
                This is the difference between managing a problem and solving it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Argument */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Eye className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                The Transparency Argument
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                If competition data is actually shared, every barista can learn
                from it. Currently, this data is hidden or useless because the
                scoring is subjective. What can you learn from a score of 87.5?
                Nothing.
              </p>
              <p className="text-sand-400 leading-relaxed mb-6">
                But when the data is a binary choice — A is better than B — and
                the recipes are public, you can learn:
              </p>
              <ul className="space-y-3">
                {[
                  "What grind setting they used",
                  "What yield ratio they preferred",
                  "What temperature they extracted at",
                  "What pre-infusion time they chose",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sand-300">
                    <FlaskConical className="w-5 h-5 text-cinnamon-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="wec-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-sand-100 mb-4">
                Real, Actionable Information
              </h3>
              <p className="text-sand-400 text-sm leading-relaxed mb-6">
                This is how competition makes the industry better. When data is
                shared, everyone improves. When the champion's product is sold,
                the industry gets better coffee. When competition is objective,
                the results are trustworthy.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1410]">
                  <span className="text-sm text-sand-400">Grind Setting</span>
                  <span className="text-sm font-mono text-cinnamon-400">
                    #4.2 (EKK43)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1410]">
                  <span className="text-sm text-sand-400">Yield Ratio</span>
                  <span className="text-sm font-mono text-cinnamon-400">
                    1:2.4
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1410]">
                  <span className="text-sm text-sand-400">Temperature</span>
                  <span className="text-sm font-mono text-cinnamon-400">
                    93.5°C
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1410]">
                  <span className="text-sm text-sand-400">Pre-infusion</span>
                  <span className="text-sm font-mono text-cinnamon-400">
                    8 seconds
                  </span>
                </div>
              </div>
              <p className="text-xs text-sand-500 mt-4">
                *Example data — actual champion recipes published after each
                competition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation */}
      <section className="wec-section bg-gradient-to-b from-[#140f0b] to-[#1a1410]">
        <div className="wec-container text-center">
          <Heart className="w-10 h-10 text-cinnamon-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">
            An Invitation to Imagine Something Better
          </h2>
          <p className="text-sand-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Here is what an industry body could be. Here is what we have
            instead. Here is what we are building.
          </p>
          <p className="text-xl text-sand-200 mb-10">You are invited to join us.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/panama-2026">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8"
              >
                <Target className="mr-2 w-5 h-5" />
                Join WEC 2026
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8"
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Coffee({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6.01" y1="2" y2="2" />
      <line x1="10" x2="10.01" y1="2" y2="2" />
      <line x1="14" x2="14.01" y1="2" y2="2" />
    </svg>
  );
}
