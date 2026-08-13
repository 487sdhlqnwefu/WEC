import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StewardScreen() {
  const { eventId = "" } = useParams();
  const { data, error, isLoading, refetch } = trpc.throwdown.stewardView.useQuery(
    { eventId },
    { refetchInterval: 3000 },
  );
  const confirm = trpc.throwdown.confirmCodes.useMutation({
    onSuccess: () => {
      toast.success("Cup codes confirmed");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <p className="p-8">Loading Cup Steward screen…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-sand-100">This screen is restricted</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-gold">Cup Steward only</p>
      <h1 className="mt-2 text-3xl font-bold text-sand-100">{data?.eventName}</h1>
      <p className="mt-2 text-sm text-sand-400">
        Code the cups exactly as shown. Do not share these mappings with organisers, judges, or competitors.
      </p>
      <div className="mt-8 space-y-6">
        {data?.heats.length === 0 && <p className="text-sand-500">No heat is waiting for coding.</p>}
        {data?.heats.map((heat) => (
          <article key={heat.heatId} className="wec-card p-6">
            <h2 className="text-xl font-semibold text-sand-100">{heat.heatLabel}</h2>
            <p className="text-xs uppercase text-sand-500">{heat.status.replaceAll("_", " ")}</p>
            <ul className="mt-4 space-y-3">
              {heat.cups.map((cup) => (
                <li key={cup.cupCode} className="rounded-lg border border-[#3a2a1f] p-4">
                  <p className="font-mono text-4xl tracking-[0.2em] text-gold">{cup.cupCode}</p>
                  <p className="mt-2 text-sand-200">{cup.competitorName}</p>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 min-h-12 w-full bg-cinnamon-600 text-sand-100"
              disabled={heat.confirmed || confirm.isPending}
              onClick={() => confirm.mutate({ heatId: heat.heatId })}
            >
              {heat.confirmed ? "Cups confirmed" : "Confirm cups are coded"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
