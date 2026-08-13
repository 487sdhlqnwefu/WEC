import { useState } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WlatJudge() {
  const { eventId } = useParams();
  const ballot = trpc.wlat.liveBallot.useQuery(
    { eventId: eventId || "" },
    { enabled: Boolean(eventId), refetchInterval: 2000 },
  );
  const submit = trpc.wlat.submitBallot.useMutation();
  const [choice, setChoice] = useState<"A" | "B" | "">("");
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-3">Ballot recorded</h1>
        <p className="text-sand-400">
          Thank you. You will not see other votes or the result while this heat is open.
        </p>
      </div>
    );
  }

  if (!ballot.data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-2">Judge ballot</h1>
        <p className="text-sand-400">No open blind ballot is assigned to you right now.</p>
      </div>
    );
  }

  const data = ballot.data;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Blind comparison</h1>
      <p className="text-sand-300 mb-6">{data.prompt}</p>
      {data.referencePattern && (
        <div className="mb-6">
          <p className="text-sm text-sand-500 mb-2">Reference pattern</p>
          {data.referencePattern.imagePath ? (
            <img
              src={data.referencePattern.imagePath}
              alt="Reference pattern"
              className="max-h-64 rounded-lg border border-[#3a2a1f]"
            />
          ) : (
            <div className="h-40 rounded-lg border border-[#3a2a1f] grid place-items-center text-sand-500">
              Reference on the table
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {data.entries.map((entry) => (
          <button
            key={entry.label}
            onClick={() => setChoice(entry.label)}
            className={`min-h-44 rounded-2xl border p-4 text-left ${choice === entry.label ? "border-gold bg-gold/10" : "border-[#3a2a1f] bg-[#1b140f]"}`}
            aria-pressed={choice === entry.label}
            aria-label={`Latte art Entry ${entry.label}`}
          >
            <div className="text-sm text-sand-500 mb-2">Entry {entry.label}</div>
            {entry.imagePath ? (
              <img src={entry.imagePath} alt={entry.alt} className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div className="h-40 rounded-lg bg-[#140e0a] grid place-items-center text-3xl font-bold">
                {entry.label}
              </div>
            )}
          </button>
        ))}
      </div>
      <label htmlFor="fb" className="text-sm text-sand-400">
        Why is the selected entry preferred? (min 20 characters)
      </label>
      <Textarea
        id="fb"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="mt-1 mb-4 bg-[#1b140f] border-[#3a2a1f] min-h-28"
      />
      <Button
        className="w-full bg-cinnamon-600 h-12"
        disabled={!choice || submit.isPending}
        onClick={async () => {
          await submit.mutateAsync({
            heatId: data.heatId,
            roundId: data.roundId,
            choice: choice as "A" | "B",
            feedback,
          });
          setDone(true);
        }}
      >
        Submit immutable ballot
      </Button>
    </div>
  );
}
