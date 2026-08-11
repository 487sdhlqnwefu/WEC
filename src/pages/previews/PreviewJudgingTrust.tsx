import { CATEGORY_POINTS, WIN_THRESHOLD } from "@contracts/scoring";
import { Eye, Scale } from "lucide-react";

/** Marketing screenshot — blind judging explainer / trust panel */
export default function PreviewJudgingTrust() {
  return (
    <div className="min-h-screen bg-[#1a1410] text-sand-100 flex items-center">
      <div className="wec-container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <img src="/assets/logo-white.png" alt="WEC" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-xs tracking-[0.2em] text-cinnamon-400 uppercase">
                World Espresso Championship
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold">How the cup decides</h1>
            </div>
          </div>

          <p className="text-lg text-sand-400 mb-10 max-w-2xl">
            Same coffee. Same machine. Blind cups. No stories. No politics. Scoring v3 —
            built so sponsors, competitors, and the public can trust the result.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              {
                title: "Tactile",
                pts: CATEGORY_POINTS.tactile,
                pct: "45%",
                desc: "Most objective. Texture the consumer remembers.",
              },
              {
                title: "Taste",
                pts: CATEGORY_POINTS.taste,
                pct: "30%",
                desc: "Sour, bitter, balance — clear and consumer-relevant.",
              },
              {
                title: "Flavour",
                pts: CATEGORY_POINTS.flavour,
                pct: "24%",
                desc: "Present but cannot decide a heat alone.",
              },
            ].map((c) => (
              <div key={c.title} className="wec-card rounded-xl p-6">
                <p className="text-gold text-sm font-medium mb-1">{c.pct}</p>
                <h3 className="text-xl font-bold mb-1">
                  {c.title}{" "}
                  <span className="text-sand-500 text-base font-normal">({c.pts})</span>
                </h3>
                <p className="text-sm text-sand-400">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="wec-card rounded-2xl p-8 border-cinnamon-800/40">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center">
                <Eye className="w-6 h-6 text-cinnamon-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Blind paired comparison</h2>
                <p className="text-sand-400 text-sm leading-relaxed">
                  Three judges. Cup A or Cup B per category. No deliberation. 99 points
                  total. <span className="text-sand-200">{WIN_THRESHOLD}+ wins</span>. Results
                  publish live for the whole room — and the whole industry — to see.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "No latte art in the sensory score",
                "No brand advantage from glassware",
                "No score drift or closed-door changes",
                "Public live bracket on worldespressochampionship.com",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-sand-300 bg-[#1a1410] rounded-lg px-4 py-3 border border-[#3a2a1f]"
                >
                  <Scale className="w-4 h-4 text-cinnamon-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sand-500 text-sm mt-10">
            Café Unido · Panama City · 26 October 2026
          </p>
        </div>
      </div>
    </div>
  );
}
