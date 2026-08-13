import { useState } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WlatSteward() {
  const { eventId } = useParams();
  const overview = trpc.wlat.organiserOverview.useQuery({ eventId: eventId || "" }, { enabled: Boolean(eventId) });
  const reveal = trpc.wlat.revealMapping.useMutation();
  const breach = trpc.wlat.reportBreach.useMutation();
  const [reason, setReason] = useState("Placement for physical judging");
  const [notes, setNotes] = useState("");
  const heatId = overview.data?.activeHeat?.id || overview.data?.heats.find((h) => h.state === "scheduled")?.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Blind Steward</h1>
      <p className="text-sand-400 mb-6">
        Mapping access is audited. Re-authentication is required on a device before the first reveal.
        You cannot compete, coach, judge, or vote.
      </p>
      <Textarea value={reason} onChange={(e) => setReason(e.target.value)} className="bg-[#1b140f] border-[#3a2a1f] mb-3" />
      <Button
        className="bg-cinnamon-600 mb-6"
        disabled={!heatId}
        onClick={() => heatId && reveal.mutate({ heatId, reason })}
      >
        Reveal A/B mapping
      </Button>
      {reveal.data && (
        <div className="rounded-xl border border-gold/40 p-4 mb-6">
          <p>Entry A → {reveal.data.entryAId}</p>
          <p>Entry B → {reveal.data.entryBId}</p>
          <p className="mt-2 text-sand-300">{reveal.data.placement.note}</p>
          <ul className="mt-4 list-disc pl-5 text-sm text-sand-400">
            {reveal.data.blindnessChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {reveal.error && <p className="text-red-300 mb-4">{reveal.error.message}</p>}
      <h2 className="font-semibold mb-2">Report a blindness breach</h2>
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-[#1b140f] border-[#3a2a1f] mb-3" />
      <Button
        variant="destructive"
        disabled={!heatId}
        onClick={() => heatId && breach.mutate({ heatId, description: notes || "Identity leak observed on the floor." })}
      >
        Report breach
      </Button>
    </div>
  );
}
