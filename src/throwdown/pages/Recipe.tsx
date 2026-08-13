import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { brewRatio, extractionYieldPercent } from "@throwdown/recipes";

type Draft = {
  doseGrams: string;
  yieldGrams: string;
  extractionTimeSeconds: string;
  waterTempC: string;
  grindSetting: string;
  preInfusionSeconds: string;
  pressureOrFlow: string;
  basket: string;
  distribution: string;
  tampingNotes: string;
  tds: string;
  notes: string;
};

const empty: Draft = {
  doseGrams: "18",
  yieldGrams: "36",
  extractionTimeSeconds: "28",
  waterTempC: "",
  grindSetting: "",
  preInfusionSeconds: "",
  pressureOrFlow: "",
  basket: "",
  distribution: "",
  tampingNotes: "",
  tds: "",
  notes: "",
};

export default function RecipeForm() {
  const { heatId = "" } = useParams();
  const storageKey = `throwdown-recipe-${heatId}`;
  const { data, error, isLoading, refetch } = trpc.throwdown.competitorRecipe.useQuery({ heatId });
  const [draft, setDraft] = useState<Draft>(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  });
  const [confirm, setConfirm] = useState(false);
  const submit = trpc.throwdown.submitRecipe.useMutation({
    onSuccess: () => {
      localStorage.removeItem(storageKey);
      toast.success("Recipe locked");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, storageKey]);

  const dose = Number(draft.doseGrams);
  const yieldG = Number(draft.yieldGrams);
  const tds = draft.tds ? Number(draft.tds) : null;
  const ratio = useMemo(() => (dose > 0 && yieldG > 0 ? brewRatio(dose, yieldG) : null), [dose, yieldG]);
  const ey = useMemo(() => extractionYieldPercent(dose, yieldG, tds), [dose, yieldG, tds]);

  if (isLoading) return <p className="p-8">Loading recipe form…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Recipe form unavailable</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
      </div>
    );
  }

  if (data?.recipe && !data.recipe.correctionRequestedAt) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold text-sand-100">Recipe locked</h1>
        <p className="mt-2 text-sand-400">
          {data.heatLabel}. Dose {data.recipe.doseGrams} g · yield {data.recipe.yieldGrams} g · {data.recipe.extractionTimeSeconds} s
        </p>
      </div>
    );
  }

  if (!data?.unlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold text-sand-100">{data?.heatLabel}</h1>
        <p className="mt-3 text-sand-400">Recipe entry opens when brewing time is marked complete.</p>
      </div>
    );
  }

  function num(v: string) {
    return v === "" ? undefined : Number(v);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold text-sand-100">Your recipe</h1>
      <p className="text-sm text-sand-400">
        {data.eventName} · {data.heatLabel}
        {data.opponentName ? ` · vs ${data.opponentName}` : ""}
      </p>
      {data.recipe?.correctionRequestedAt && (
        <p className="mt-3 rounded border border-gold/40 p-3 text-sm text-gold">{data.recipe.correctionNote}</p>
      )}
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!confirm) {
            setConfirm(true);
            return;
          }
          submit.mutate({
            heatId,
            doseGrams: Number(draft.doseGrams),
            yieldGrams: Number(draft.yieldGrams),
            extractionTimeSeconds: Number(draft.extractionTimeSeconds),
            waterTempC: num(draft.waterTempC) ?? null,
            grindSetting: draft.grindSetting || null,
            preInfusionSeconds: num(draft.preInfusionSeconds) ?? null,
            pressureOrFlow: draft.pressureOrFlow || null,
            basket: draft.basket || null,
            distribution: draft.distribution || null,
            tampingNotes: draft.tampingNotes || null,
            tds: num(draft.tds) ?? null,
            notes: draft.notes || null,
          });
        }}
      >
        <Num label="Dose (g)" value={draft.doseGrams} onChange={(doseGrams) => setDraft({ ...draft, doseGrams })} />
        <Num label="Beverage yield (g)" value={draft.yieldGrams} onChange={(yieldGrams) => setDraft({ ...draft, yieldGrams })} />
        <Num label="Extraction time (s)" value={draft.extractionTimeSeconds} onChange={(extractionTimeSeconds) => setDraft({ ...draft, extractionTimeSeconds })} />
        <p className="text-sm text-sand-400">
          Brew ratio {ratio ? ratio.toFixed(2) : "—"}
          {ey != null ? ` · extraction yield ${ey.toFixed(1)}%` : ""}
        </p>
        <Num label="Water temperature (°C)" value={draft.waterTempC} onChange={(waterTempC) => setDraft({ ...draft, waterTempC })} />
        <Text label="Grind setting" value={draft.grindSetting} onChange={(grindSetting) => setDraft({ ...draft, grindSetting })} />
        <Num label="Pre-infusion (s)" value={draft.preInfusionSeconds} onChange={(preInfusionSeconds) => setDraft({ ...draft, preInfusionSeconds })} />
        <Text label="Pressure or flow" value={draft.pressureOrFlow} onChange={(pressureOrFlow) => setDraft({ ...draft, pressureOrFlow })} />
        <Text label="Basket" value={draft.basket} onChange={(basket) => setDraft({ ...draft, basket })} />
        <Text label="Distribution / preparation" value={draft.distribution} onChange={(distribution) => setDraft({ ...draft, distribution })} />
        <Text label="Tamping notes" value={draft.tampingNotes} onChange={(tampingNotes) => setDraft({ ...draft, tampingNotes })} />
        <Num label="Measured TDS (%)" value={draft.tds} onChange={(tds) => setDraft({ ...draft, tds })} />
        <div>
          <Label>Notes</Label>
          <Textarea className="mt-1 bg-[#1a1410]" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
        </div>
        <Button type="submit" className="min-h-12 w-full bg-cinnamon-600 text-sand-100" disabled={submit.isPending}>
          {submit.isPending ? "Saving…" : confirm ? "Confirm and lock recipe" : "Review and lock"}
        </Button>
      </form>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input inputMode="decimal" type="number" step="0.1" className="mt-1 bg-[#1a1410]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1 bg-[#1a1410]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
