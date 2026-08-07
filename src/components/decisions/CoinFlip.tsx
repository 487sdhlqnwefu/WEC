import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CoinFlip() {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [rotation, setRotation] = useState(0);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    const next = Math.random() < 0.5 ? "Heads" : "Tails";
    const flips = 8 + Math.floor(Math.random() * 4);
    const endRotation =
      rotation + flips * 180 + (next === "Heads" ? 0 : 180);
    setRotation(endRotation);
    window.setTimeout(() => {
      setResult(next);
      setFlipping(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <p className="text-sand-400 text-center max-w-md">
        No coin? Flip a WEC coin and let heads or tails settle it.
      </p>

      <div className="relative w-40 h-40 [perspective:800px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            transition: flipping
              ? "transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        >
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-gold bg-gradient-to-br from-cinnamon-500 to-cinnamon-700 shadow-xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-sand-100 font-bold text-lg tracking-widest">
              WEC
            </span>
          </div>
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-taupe bg-gradient-to-br from-sand-300 to-sand-500 shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-[#1a1410] font-bold text-sm tracking-wider text-center px-2">
              ESPRESSO
            </span>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[2.5rem]">
        {result && !flipping && (
          <p className="text-2xl font-bold text-sand-100 animate-fade-in">
            {result}
          </p>
        )}
        {flipping && (
          <p className="text-sand-500 text-sm tracking-wide uppercase">
            Flipping…
          </p>
        )}
      </div>

      <Button
        size="lg"
        onClick={flip}
        disabled={flipping}
        className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-10 wec-glow"
      >
        {flipping ? "Flipping…" : "Flip Coin"}
      </Button>
    </div>
  );
}
