import { Trophy, Sparkles } from "lucide-react";

/** Marketing screenshot — champion crowned / career moment */
export default function PreviewChampionMoment() {
  return (
    <div className="min-h-screen bg-[#1a1410] text-sand-100 flex items-center">
      <div className="wec-container py-20">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/assets/logo-white.png"
            alt="WEC"
            className="h-16 w-16 object-contain mx-auto mb-8"
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">Final · Scoring v3 · 66–33</span>
          </div>
          <Trophy className="w-14 h-14 text-gold mx-auto mb-6" />
          <p className="text-sm uppercase tracking-[0.25em] text-cinnamon-400 mb-3">
            2026 World Espresso Champion
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold mb-3 wec-gradient-text">
            Diego Morales
          </h1>
          <p className="text-xl text-sand-400 mb-10">Panama · Café Unido</p>

          <div className="wec-card rounded-2xl p-8 text-left max-w-xl mx-auto mb-10">
            <h2 className="text-lg font-semibold mb-4 text-sand-100">What the champion wins</h2>
            <ul className="space-y-3 text-sm text-sand-300">
              <li className="flex gap-3">
                <span className="text-gold">●</span>
                Title: World Espresso Champion 2026
              </li>
              <li className="flex gap-3">
                <span className="text-gold">●</span>
                Public recipe & extraction data — industry learns from the win
              </li>
              <li className="flex gap-3">
                <span className="text-gold">●</span>
                Path to Champion&apos;s Coffee Product (royalties on every bag)
              </li>
            </ul>
          </div>

          <p className="text-sand-500 text-sm">
            Blind. Fair. Objective. Every heat published live.
          </p>
        </div>
      </div>
    </div>
  );
}
