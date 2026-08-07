import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinWheel from "./SpinWheel";
import WheelEditor from "./WheelEditor";
import { useDecisionWheels } from "@/hooks/useDecisionWheels";
import {
  buildSegments,
  pickWeightedOption,
  rotationForWinner,
} from "@/lib/decisionMath";
import { DEFAULT_TEMPLATES } from "@/types/decisions";

export default function WheelPanel() {
  const {
    wheels,
    activeWheel,
    excludedIds,
    addWheel,
    deleteWheel,
    selectWheel,
    updateActive,
    resetExclusions,
    markExcluded,
  } = useDecisionWheels();

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!activeWheel) return null;

  const eligibleCount = activeWheel.options.filter(
    (o) => !excludedIds.includes(o.id),
  ).length;

  const spin = () => {
    if (spinning) return;
    if (eligibleCount === 0) {
      toast.message("All options used — reset to spin again");
      return;
    }

    const winner = pickWeightedOption(activeWheel.options, excludedIds);
    if (!winner) return;

    // Pick with true weights; land on display segments so the pointer matches the wheel face
    // (including equal slices when hideWeights is on).
    const displaySegments = buildSegments(
      activeWheel.options,
      activeWheel.hideWeights,
    ).map((segment) => ({
      ...segment,
      startAngle: segment.displayStart,
      endAngle: segment.displayEnd,
      sweep: segment.displaySweep,
      midAngle: (segment.displayStart + segment.displayEnd) / 2,
    }));
    const nextRotation = rotationForWinner(
      displaySegments,
      winner.id,
      rotation,
    );

    setSpinning(true);
    setResult(null);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setResult(winner.label);
      if (activeWheel.noRepeats) markExcluded(winner.id);
      toast.success(`Decision: ${winner.label}`);
    }, 4600);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-cinnamon-400">
            Spin the wheel
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 text-balance">
            {activeWheel.title || "Untitled decision"}
          </h2>
        </div>

        <div className="w-full max-w-[340px] aspect-square">
          <SpinWheel
            options={activeWheel.options}
            hideWeights={activeWheel.hideWeights}
            excludedIds={excludedIds}
            rotation={rotation}
            spinning={spinning}
            size={320}
          />
        </div>

        <div className="min-h-[3rem] text-center">
          {result && !spinning && (
            <p className="text-2xl font-bold wec-gradient-text animate-fade-in">
              {result}
            </p>
          )}
          {spinning && (
            <p className="text-sand-500 text-sm uppercase tracking-wider">
              Deciding…
            </p>
          )}
          {activeWheel.noRepeats && excludedIds.length > 0 && !spinning && (
            <p className="text-xs text-sand-500 mt-2">
              {excludedIds.length} used · {eligibleCount} left
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={spin}
            disabled={spinning || eligibleCount === 0}
            className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-10 text-base wec-glow"
          >
            {spinning ? "Spinning…" : "Spin"}
          </Button>
          {activeWheel.noRepeats && excludedIds.length > 0 && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                resetExclusions();
                setResult(null);
              }}
              className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset picks
            </Button>
          )}
        </div>
      </div>

      <aside className="space-y-6 rounded-xl border border-[#3a2a1f] bg-[#231a14]/80 p-5">
        <div className="space-y-2">
          <label className="text-sand-300 text-xs uppercase tracking-wider">
            Your wheels
          </label>
          <Select value={activeWheel.id} onValueChange={selectWheel}>
            <SelectTrigger className="wec-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#231a14] border-[#3a2a1f] text-sand-100">
              {wheels.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.title || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
              onClick={() => {
                addWheel();
                setResult(null);
                resetExclusions();
              }}
            >
              New wheel
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-sand-500 hover:text-red-400"
              onClick={() => {
                deleteWheel(activeWheel.id);
                setResult(null);
              }}
              aria-label="Delete wheel"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sand-300 text-xs uppercase tracking-wider mb-2">
            Templates
          </p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_TEMPLATES.map((template) => (
              <button
                key={template.title}
                type="button"
                onClick={() => {
                  addWheel(template);
                  setResult(null);
                  resetExclusions();
                  toast.message(`Loaded “${template.title}”`);
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-[#3a2a1f] text-sand-300 hover:border-cinnamon-600 hover:text-sand-100 transition-colors"
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>

        <WheelEditor wheel={activeWheel} onChange={updateActive} />
      </aside>
    </div>
  );
}
