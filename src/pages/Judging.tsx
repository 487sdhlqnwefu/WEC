import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { CATEGORY_POINTS, WIN_THRESHOLD } from "@contracts/scoring";
import {
  Eye,
  Scale,
  ArrowRight,
  Trophy,
  Handshake,
} from "lucide-react";

export default function Judging() {
  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/assets/logo-white.png"
                alt="WEC"
                className="h-12 w-12 object-contain"
              />
              <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                Scoring v3
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mb-6">
              How the cup{" "}
              <span className="wec-gradient-text">decides</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed">
              Same coffee. Same machine. Blind cups. No stories. No politics.
              Built so sponsors, competitors, and the public can trust the
              result.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                title: "Tactile",
                pts: CATEGORY_POINTS.tactile,
                pct: "45%",
                desc: "Most objective. Texture is what consumers notice first and remember longest.",
              },
              {
                title: "Taste",
                pts: CATEGORY_POINTS.taste,
                pct: "30%",
                desc: "Sour, bitter, balance — clear signals a trained judge and a customer can both recognise.",
              },
              {
                title: "Flavour",
                pts: CATEGORY_POINTS.flavour,
                pct: "24%",
                desc: "Still matters — but cannot decide a close heat alone. The tie-breaker, not the decider.",
              },
            ].map((c) => (
              <div key={c.title} className="wec-card rounded-xl p-6">
                <p className="text-gold text-sm font-medium mb-1">{c.pct}</p>
                <h2 className="text-xl font-bold text-sand-100 mb-2">
                  {c.title}{" "}
                  <span className="text-sand-500 text-base font-normal">
                    ({c.pts} pts)
                  </span>
                </h2>
                <p className="text-sm text-sand-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-sand-500 mt-6">
            Three judges · {CATEGORY_POINTS.tactile + CATEGORY_POINTS.taste + CATEGORY_POINTS.flavour}{" "}
            points each · 99 total · <span className="text-sand-300">{WIN_THRESHOLD}+ wins</span>
          </p>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Eye className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl font-bold text-sand-100 mb-4">
                Blind paired comparison
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                Two espressos. Labeled A and B. Judges never know who made which.
                They choose A or B for Tactile, Taste, and Flavour — immediately,
                with no deliberation. Results publish on the public live board.
              </p>
              <ul className="space-y-3">
                {[
                  "No latte art in the sensory score",
                  "No brand advantage from glassware",
                  "No score drift or closed-door changes",
                  "Public live bracket for the whole industry to see",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-sand-300"
                  >
                    <Scale className="w-4 h-4 text-cinnamon-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="wec-card rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-sand-100 mb-4">
                What this means for sponsors
              </h3>
              <p className="text-sm text-sand-400 leading-relaxed mb-6">
                Your brand sits next to a format people can verify. Not a private
                score sheet. Not a story competition. A public, scientific
                preference test — the same idea used in food science labs
                worldwide (ISO 5495).
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/panama-2026#sponsors">
                  <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                    <Handshake className="mr-2 w-4 h-4" />
                    Sponsor WEC 2026
                  </Button>
                </Link>
                <Link to="/live/wec-2026-panama">
                  <Button
                    variant="outline"
                    className="border-sand-400/30 text-sand-200"
                  >
                    <Trophy className="mr-2 w-4 h-4" />
                    See live board
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container text-center">
          <p className="text-sand-500 text-sm mb-2">Next championship</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-2">
            Café Unido · Panama City · 26 October 2026
          </h2>
          <p className="text-sand-400 mb-8 max-w-xl mx-auto">
            Café Unido is our venue and roaster sponsor. We are building the
            remaining partner stack around equipment, water, media, and
            supporting brands.
          </p>
          <Link to="/panama-2026">
            <Button className="bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold">
              WEC 2026 Panama
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
