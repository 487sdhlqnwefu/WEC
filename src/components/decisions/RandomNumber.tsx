import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [noRepeats, setNoRepeats] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const [value, setValue] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const generate = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const pool: number[] = [];
    for (let n = lo; n <= hi; n++) {
      if (!noRepeats || !used.includes(n)) pool.push(n);
    }
    if (pool.length === 0) {
      setUsed([]);
      setValue(null);
      return;
    }

    setAnimating(true);
    let ticks = 0;
    const interval = window.setInterval(() => {
      setValue(pool[Math.floor(Math.random() * pool.length)]);
      ticks += 1;
      if (ticks >= 12) {
        window.clearInterval(interval);
        const result = pool[Math.floor(Math.random() * pool.length)];
        setValue(result);
        if (noRepeats) setUsed((prev) => [...prev, result]);
        setAnimating(false);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 max-w-md mx-auto w-full">
      <p className="text-sand-400 text-center">
        Pick a number from a range. Great for giveaways, groups, and quick picks.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div>
          <Label htmlFor="rng-min" className="text-sand-300 text-xs uppercase tracking-wider">
            Min
          </Label>
          <Input
            id="rng-min"
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="mt-1.5 wec-input"
          />
        </div>
        <div>
          <Label htmlFor="rng-max" className="text-sand-300 text-xs uppercase tracking-wider">
            Max
          </Label>
          <Input
            id="rng-max"
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="mt-1.5 wec-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 self-start">
        <Switch
          id="rng-no-repeats"
          checked={noRepeats}
          onCheckedChange={(checked) => {
            setNoRepeats(checked);
            setUsed([]);
          }}
        />
        <Label htmlFor="rng-no-repeats" className="text-sand-300 text-sm">
          No repeats
        </Label>
      </div>

      <div
        className={`text-6xl sm:text-7xl font-bold text-sand-100 tabular-nums min-h-[5rem] flex items-center justify-center ${
          animating ? "opacity-70" : "animate-fade-in"
        }`}
      >
        {value ?? "—"}
      </div>

      {noRepeats && used.length > 0 && (
        <p className="text-xs text-sand-500 text-center">
          Used: {used.join(", ")}{" "}
          <button
            type="button"
            className="text-cinnamon-400 underline ml-1"
            onClick={() => setUsed([])}
          >
            Reset
          </button>
        </p>
      )}

      <Button
        size="lg"
        onClick={generate}
        disabled={animating}
        className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-10 wec-glow"
      >
        {animating ? "Generating…" : "Generate"}
      </Button>
    </div>
  );
}
