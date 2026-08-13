import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function WlatShots() {
  const { eventId } = useParams();
  const queue = trpc.wlat.shotQueue.useQuery({ eventId: eventId || "" }, { enabled: Boolean(eventId), refetchInterval: 2000 });
  const update = trpc.wlat.updateShot.useMutation();
  const utils = trpc.useUtils();
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shot barista queue</h1>
      <div className="space-y-3">
        {(queue.data ?? []).map((shot) => (
          <div key={shot.id} className="rounded-lg border border-[#3a2a1f] p-3">
            <div>Heat {shot.heatNumber} · {shot.status}</div>
            <div className="flex gap-2 mt-2">
              {(["ready", "delivered", "remade", "failed"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await update.mutateAsync({ shotId: shot.id, status });
                    utils.wlat.shotQueue.invalidate();
                  }}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
