import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Finger = {
  id: number;
  x: number;
  y: number;
};

const COLORS = ["#994D27", "#C48D49", "#214966", "#3E3F24", "#BDA088", "#DECCA7"];

export default function FingerPicker() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<number[]>([]);
  const [picking, setPicking] = useState(false);
  const nextId = useRef(1);

  const addAt = useCallback((clientX: number, clientY: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setWinners([]);
    setFingers((prev) => [
      ...prev,
      { id: nextId.current++, x: Math.min(92, Math.max(8, x)), y: Math.min(92, Math.max(8, y)) },
    ]);
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setWinners([]);
      const rect = el.getBoundingClientRect();
      const next: Finger[] = [];
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const x = ((t.clientX - rect.left) / rect.width) * 100;
        const y = ((t.clientY - rect.top) / rect.height) * 100;
        next.push({
          id: nextId.current++,
          x: Math.min(92, Math.max(8, x)),
          y: Math.min(92, Math.max(8, y)),
        });
      }
      setFingers(next);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", onTouchStart);
  }, []);

  const pick = () => {
    if (fingers.length === 0 || picking) return;
    setPicking(true);
    setWinners([]);

    let flashes = 0;
    const interval = window.setInterval(() => {
      const shuffled = [...fingers].sort(() => Math.random() - 0.5);
      setWinners(shuffled.slice(0, Math.min(winnerCount, fingers.length)).map((f) => f.id));
      flashes += 1;
      if (flashes >= 10) {
        window.clearInterval(interval);
        const final = [...fingers]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(winnerCount, fingers.length))
          .map((f) => f.id);
        setWinners(final);
        setPicking(false);
      }
    }, 120);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="text-sand-400 text-center max-w-lg mx-auto">
        On a phone, place multiple fingers on the pad. On desktop, click to drop
        markers — then pick a winner.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Label htmlFor="winner-count" className="text-sand-300 text-sm">
          Winners
        </Label>
        <Input
          id="winner-count"
          type="number"
          min={1}
          max={10}
          value={winnerCount}
          onChange={(e) =>
            setWinnerCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
          }
          className="wec-input w-20 h-9"
        />
      </div>

      <div
        ref={areaRef}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-finger]")) return;
          addAt(e.clientX, e.clientY);
        }}
        className="relative mx-auto w-full max-w-lg aspect-square rounded-2xl border border-[#3a2a1f] bg-[radial-gradient(ellipse_at_center,_#2a1f18_0%,_#1a1410_70%)] overflow-hidden touch-none cursor-crosshair"
        role="application"
        aria-label="Finger picker pad"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #994D27 0%, transparent 40%), radial-gradient(circle at 80% 70%, #C48D49 0%, transparent 35%)",
          }}
        />

        {fingers.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-sand-600 text-sm pointer-events-none px-6 text-center">
            Tap or click to place players
          </p>
        )}

        {fingers.map((finger, index) => {
          const isWinner = winners.includes(finger.id);
          const color = COLORS[index % COLORS.length];
          return (
            <button
              key={finger.id}
              type="button"
              data-finger
              onClick={(e) => {
                e.stopPropagation();
                setFingers((prev) => prev.filter((f) => f.id !== finger.id));
                setWinners([]);
              }}
              className={`absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200 ${
                isWinner
                  ? "scale-125 border-gold shadow-[0_0_24px_rgba(196,141,73,0.7)]"
                  : "border-sand-200/40"
              }`}
              style={{
                left: `${finger.x}%`,
                top: `${finger.y}%`,
                backgroundColor: color,
              }}
              aria-label={`Player ${index + 1}${isWinner ? " (winner)" : ""}`}
            >
              <span
                className={`text-xs font-bold ${
                  color === "#DECCA7" || color === "#BDA088"
                    ? "text-[#1a1410]"
                    : "text-sand-100"
                }`}
              >
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          onClick={pick}
          disabled={fingers.length === 0 || picking}
          className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow"
        >
          {picking ? "Picking…" : "Pick Winner"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setFingers([]);
            setWinners([]);
          }}
          className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
        >
          Clear
        </Button>
      </div>

      {winners.length > 0 && !picking && (
        <p className="text-center text-xl font-semibold text-sand-100 animate-fade-in">
          Winner{winners.length > 1 ? "s" : ""}:{" "}
          {winners
            .map((id) => {
              const idx = fingers.findIndex((f) => f.id === id);
              return idx >= 0 ? `Player ${idx + 1}` : "";
            })
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
    </div>
  );
}
