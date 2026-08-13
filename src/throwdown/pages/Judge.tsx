import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JudgeBallot() {
  const { heatId = "" } = useParams();
  const { data, error, isLoading, refetch } = trpc.throwdown.judgeBallot.useQuery({ heatId });
  const [tactile, setTactile] = useState<string>();
  const [taste, setTaste] = useState<string>();
  const [flavour, setFlavour] = useState<string>();
  const [choice, setChoice] = useState<string>();
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failure">("idle");
  const idempotencyKey = useMemo(() => `${heatId}-${crypto.randomUUID()}`, [heatId]);
  const submit = trpc.throwdown.submitBallot.useMutation({
    onMutate: () => setStatus("pending"),
    onSuccess: () => {
      setStatus("success");
      toast.success("Ballot locked");
      refetch();
    },
    onError: (err) => {
      setStatus("failure");
      toast.error(err.message);
    },
  });

  if (isLoading) return <p className="p-8">Loading ballot…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Ballot unavailable</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
      </div>
    );
  }
  if (!data) return null;

  const codes = data.cupCodes;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <p className="text-xs uppercase tracking-[0.18em] text-cinnamon-400">{data.eventName}</p>
      <h1 className="mt-2 text-2xl font-bold text-sand-100">{data.heatLabel}</h1>
      <p className="mt-3 text-sm text-sand-400">{data.instructions}</p>
      {data.submitted || status === "success" ? (
        <p className="mt-10 rounded-lg border border-gold/40 bg-gold/10 p-6 text-center text-gold">
          Your ballot is locked. Thank you.
        </p>
      ) : data.judgingFormat === "wec_v3" ? (
        <div className="mt-8 space-y-8">
          <Category label="Tactile · 15" value={tactile} onChange={setTactile} codes={codes} />
          <Category label="Taste · 10" value={taste} onChange={setTaste} codes={codes} />
          <Category label="Flavour · 8" value={flavour} onChange={setFlavour} codes={codes} />
          <Button
            className="min-h-14 w-full bg-cinnamon-600 text-lg text-sand-100"
            disabled={!tactile || !taste || !flavour || status === "pending"}
            onClick={() =>
              submit.mutate({ heatId, tactile, taste, flavour, idempotencyKey })
            }
          >
            {status === "pending" ? "Submitting…" : "Lock ballot"}
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <Category label="Which cup tastes better?" value={choice} onChange={setChoice} codes={codes} />
          <Button
            className="min-h-14 w-full bg-cinnamon-600 text-lg text-sand-100"
            disabled={!choice || status === "pending"}
            onClick={() => submit.mutate({ heatId, choice, idempotencyKey })}
          >
            {status === "pending" ? "Submitting…" : "Lock ballot"}
          </Button>
        </div>
      )}
      {status === "failure" && (
        <p className="mt-4 text-center text-sm text-red-400">The ballot was not saved. You can retry without creating a second vote.</p>
      )}
    </div>
  );
}

function Category({
  label,
  value,
  onChange,
  codes,
}: {
  label: string;
  value?: string;
  onChange: (code: string) => void;
  codes: [string, string];
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-sand-200">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        {codes.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={`min-h-24 rounded-xl border px-3 py-4 font-mono text-2xl tracking-[0.15em] ${
              value === code
                ? "border-gold bg-gold/15 text-gold"
                : "border-[#3a2a1f] text-sand-100"
            }`}
            aria-pressed={value === code}
          >
            {code}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
