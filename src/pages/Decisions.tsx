import { useState } from "react";
import { Dices, CircleDot, Hash, Coins, Hand } from "lucide-react";
import type { DecisionTool } from "@/types/decisions";
import WheelPanel from "@/components/decisions/WheelPanel";
import CoinFlip from "@/components/decisions/CoinFlip";
import RandomNumber from "@/components/decisions/RandomNumber";
import FingerPicker from "@/components/decisions/FingerPicker";

const TOOLS: {
  id: DecisionTool;
  label: string;
  icon: typeof Dices;
  blurb: string;
}[] = [
  {
    id: "wheel",
    label: "Spin Wheel",
    icon: CircleDot,
    blurb: "Custom wheels with weights & no-repeats",
  },
  {
    id: "finger",
    label: "Finger Pick",
    icon: Hand,
    blurb: "Drop markers or multi-touch to choose",
  },
  {
    id: "number",
    label: "Random Number",
    icon: Hash,
    blurb: "Generate from any range",
  },
  {
    id: "coin",
    label: "Coin Flip",
    icon: Coins,
    blurb: "Heads or tails, WEC style",
  },
];

export default function Decisions() {
  const [tool, setTool] = useState<DecisionTool>("wheel");

  return (
    <div className="relative overflow-hidden">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(153,77,39,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 30%, rgba(196,141,73,0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(62,63,36,0.25), transparent 50%)",
        }}
      />

      <section className="relative wec-container pt-10 sm:pt-14 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo-white.png"
                alt="World Espresso Championship"
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cinnamon-400">
                  World Espresso Championship
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-sand-100 leading-tight">
                  Tiny Decisions
                </h1>
              </div>
            </div>
            <p className="text-sand-400 text-base sm:text-lg leading-relaxed">
              Spin, pick, flip — settle the small calls so you can focus on the
              perfect espresso.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sand-600 text-sm">
            <Dices className="w-4 h-4 text-gold" />
            Happy deciding
          </div>
        </div>

        {/* Tool switcher */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-10"
          role="tablist"
          aria-label="Decision tools"
        >
          {TOOLS.map((item) => {
            const active = tool === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTool(item.id)}
                className={`text-left rounded-xl border px-4 py-3 transition-all duration-300 ${
                  active
                    ? "border-cinnamon-500 bg-cinnamon-950/40 shadow-[0_0_24px_rgba(153,77,39,0.2)]"
                    : "border-[#3a2a1f] bg-[#231a14]/50 hover:border-cinnamon-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${active ? "text-gold" : "text-sand-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      active ? "text-sand-100" : "text-sand-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-sand-500 leading-snug hidden sm:block">
                  {item.blurb}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative wec-container pb-16 sm:pb-24">
        <div className="rounded-2xl border border-[#3a2a1f]/80 bg-[#1a1410]/60 backdrop-blur-sm p-4 sm:p-8">
          {tool === "wheel" && <WheelPanel />}
          {tool === "finger" && <FingerPicker />}
          {tool === "number" && <RandomNumber />}
          {tool === "coin" && <CoinFlip />}
        </div>
      </section>
    </div>
  );
}
