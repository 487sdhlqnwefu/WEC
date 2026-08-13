import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { formatMs } from "@/wlat/formatMs";

export default function WlatCompete() {
  const { eventId } = useParams();
  const data = trpc.wlat.competitorHeat.useQuery({ eventId: eventId || "" }, { enabled: Boolean(eventId), refetchInterval: 1000 });
  const begin = trpc.wlat.beginPhotoUpload.useMutation();
  const heat = data.data?.heat;
  const event = data.data?.event;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{event?.name}</h1>
      <p className="text-sand-400 text-sm mb-6">
        Format {event?.format}. Coach rules: prep advice {event?.coachPermissions.verbalDuringPrep ? "yes" : "no"}, competition talk {event?.coachPermissions.verbalDuringCompetition ? "yes" : "no"}.
      </p>
      {!heat && <p>You are not in the active heat. Watch the shared schedule on the public board.</p>}
      {heat && (
        <>
          <div className="text-sm text-sand-500">Heat {heat.heatNumber} · {heat.state}</div>
          <div className="text-6xl font-semibold tabular-nums text-gold my-4" aria-live="polite">
            {heat.timer ? formatMs(heat.timer.remainingMs) : "--:--"}
          </div>
          {heat.referencePattern && (
            <img src={heat.referencePattern.imagePath || ""} alt="Reference pattern" className="rounded-xl border border-[#3a2a1f] mb-4 max-h-64" />
          )}
          {(heat.state === "photography" || heat.state === "awaiting_uploads") && heat.myEntryId && (
            <label className="block rounded-xl border border-dashed border-cinnamon-700 p-6 text-center">
              <span className="block mb-2">Capture or upload your finished beverage</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !heat.myEntryId) return;
                  const started = await begin.mutateAsync({
                    heatId: heat.id,
                    entryId: heat.myEntryId,
                    filename: "pour.jpg",
                    mimeType: file.type || "image/jpeg",
                    byteLength: file.size,
                  });
                  await fetch(`/api/wlat/photos/${started.photo.id}/complete`, {
                    method: "POST",
                    body: file,
                    credentials: "include",
                  });
                }}
              />
              {heat.photo && <p className="mt-3 text-sm text-green-300">Upload status: {heat.photo.submissionStatus}</p>}
            </label>
          )}
        </>
      )}
      <Button variant="outline" className="mt-8" onClick={() => data.refetch()}>Refresh</Button>
    </div>
  );
}
