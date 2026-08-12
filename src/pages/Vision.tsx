import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import ChampionsProductModule from "@/components/ChampionsProductModule";
import { FOUNDER_EMAIL, FOUNDER_MAILTO } from "@/lib/contact";
import { WEC_FACTS } from "@/data/wecFacts";
import {
  Target,
  FlaskConical,
  TrendingUp,
  BookOpen,
  Award,
  Eye,
  ArrowRight,
  Zap,
  Heart,
} from "lucide-react";

export default function Vision() {
  return (
    <div>
      <Seo
        title="Vision | World Espresso Championship"
        description="Find excellence. Understand it. Build from it. WEC's vision for a controlled, blind espresso championship that publishes what won."
        path="/vision"
      />
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              Find excellence. Understand it.{" "}
              <span className="wec-gradient-text">Build from it.</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed max-w-3xl">
              The World Espresso Championship (WEC) is a controlled, blind espresso competition
              built to reduce avoidable bias, publish results, and return useful value to coffee —
              through transparent methods, the Innovation Lab, and a conditional Champion&apos;s
              Product model.
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
                desc: "Define quality with blinded paired comparison and published results.",
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

      {/* What WEC commits to */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="text-center mb-12">
            <Zap className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              What WEC commits to
            </h2>
            <p className="text-sand-400 max-w-2xl mx-auto">
              {WEC_FACTS.scoring.biasNote}
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              "Blinded two-alternative forced-choice Scoring v3",
              "Controlled coffee, roast, grinder, water and machine platform",
              "Independent ballots — no deliberation",
              "Results locked and published on the public live board",
              "Innovation Lab beside the championship, not instead of it",
              "Champion's Product only when agreements allow — status published",
              WEC_FACTS.scoring.methodologyNote,
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-sand-300 wec-card rounded-xl p-5"
              >
                <Check className="w-4 h-4 text-cinnamon-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Good Coffee Was Never Meant to Stay on Stage */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Sharing principle
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-100 mt-3 mb-6">
              Good Coffee Was Never Meant to{" "}
              <span className="wec-gradient-text">Stay on Stage</span>
            </h2>
            <p className="text-sand-400 leading-relaxed mb-6">
              The discoveries made under competition pressure are not meant to
              die in a private score sheet. They are meant to ripple outward —
              to baristas, cafes, producers, and anyone who wants to make a
              better cup.
            </p>
            <p className="text-sand-400 leading-relaxed mb-8">
              That is why WEC publishes what matters: the format, the live
              bracket, and — through the Champion&apos;s Coffee Product and the
              Innovation Lab — a path from winning protocol to coffee the world
              can actually drink and learn from.
            </p>
            <div className="wec-card rounded-xl p-6 text-left space-y-3">
              {[
                "Winning methods published under controlled conditions",
                "Public live results — ballots independent, outcomes locked",
                "Champion's Product: transparent value when agreements allow",
                "Innovation Lab: structured insight beside the championship",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-start gap-3 text-sm text-sand-300"
                >
                  <Check className="w-4 h-4 text-cinnamon-400 mt-0.5 flex-shrink-0" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChampionsProductModule className="bg-[#1a1410]" />

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
                If competition data is shared, baristas can learn from it. Subjective composite
                scores are hard to act on. When results are a clear Cup A / Cup B choice under
                controlled conditions — and methods can be published — learning becomes possible.
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
                This is how competition can make coffee better: publish what was controlled,
                what was chosen, and what won — so others can learn. When a Champion&apos;s
                Product is created under signed agreements, WEC will publish status and
                delivery transparently.
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
            WEC 2026 Panama produces{" "}
            {WEC_FACTS.event2026.independentEraNote.replace(/^The /, "the ")}. Registration is
            open for eligible national champions.
          </p>
          <p className="text-xl text-sand-200 mb-10">You are invited to join us.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 min-h-11"
            >
              <Link to="/panama-2026#competitor-registration">
                <Target className="mr-2 w-5 h-5" />
                Register
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8 min-h-11"
            >
              <Link to="/contact">
                Email Tristan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <a
            href={FOUNDER_MAILTO}
            className="text-sm text-sand-500 hover:text-cinnamon-400 mt-4 inline-block"
          >
            {FOUNDER_EMAIL}
          </a>
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

