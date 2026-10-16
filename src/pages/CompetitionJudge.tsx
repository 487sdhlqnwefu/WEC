import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { PILLARS, weightedTotal } from "@contracts/baristaLeagueScoring";
import type { Pillar } from "@contracts/baristaLeagueScoring";

const empty = { concept: 7, service: 7, product: 7 };

export default function CompetitionJudge() {
  const { slug = "" } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const utils = trpc.useUtils();
  const { data } = trpc.competitions.get.useQuery({ slug });
  const [teamId, setTeamId] = useState<string>("");
  const [scores, setScores] = useState(empty);
  const [notes, setNotes] = useState("");
  const submit = trpc.competitions.submitScore.useMutation({
    onSuccess: () => {
      utils.competitions.get.invalidate({ slug });
      setNotes("");
    },
  });

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!data) return <div className="wec-container py-16 text-sand-500">Loading…</div>;
  if (!data.viewer.isJudge) {
    return (
      <div className="wec-container py-16">
        <p className="text-sand-400 mb-4">You are not a judge on this event.</p>
        <Link to={`/competitions/${slug}`} className="text-cinnamon-400">
          Back to event
        </Link>
      </div>
    );
  }

  const selected = teamId || data.teams[0]?.id || "";
  const preview = weightedTotal(scores);

  return (
    <div className="wec-container py-16 max-w-xl">
      <Link to={`/competitions/${slug}`} className="text-sm text-cinnamon-400">
        ← {data.event.name}
      </Link>
      <h1 className="text-3xl font-bold text-sand-100 mt-6 mb-2">Scorepad</h1>
      <p className="text-sand-400 mb-8">
        Half-point scores, 0–10. Totals are Concept 31% + Service 31% + Product 38%.
        Your card is visible on the event page as soon as you save (community and
        fee-paid sponsored events).
      </p>

      <div className="space-y-6 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-6">
        <div>
          <Label>Team</Label>
          <select
            className="mt-1 w-full bg-[#1a1410] border border-[#3a2a1f] rounded-md px-3 py-2 text-sand-100"
            value={selected}
            onChange={(e) => setTeamId(e.target.value)}
          >
            {data.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {PILLARS.map((pillar: Pillar) => (
          <div key={pillar}>
            <div className="flex justify-between mb-2">
              <Label className="capitalize">{pillar}</Label>
              <span className="text-sand-200">{scores[pillar].toFixed(1)}</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.5}
              value={[scores[pillar]]}
              onValueChange={(value) =>
                setScores((prev) => ({ ...prev, [pillar]: value[0] ?? 0 }))
              }
            />
          </div>
        ))}

        <p className="text-sand-100">
          Weighted total <span className="text-cinnamon-300">{preview.total.toFixed(2)}</span>
        </p>

        <div>
          <Label htmlFor="notes">Public notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {submit.error && <p className="text-sm text-red-400">{submit.error.message}</p>}
        {submit.isSuccess && <p className="text-sm text-cinnamon-300">Saved.</p>}

        <Button
          className="bg-cinnamon-600 hover:bg-cinnamon-500"
          disabled={!selected || submit.isPending}
          onClick={() =>
            submit.mutate({
              slug,
              teamId: selected,
              scores,
              notes,
            })
          }
        >
          Save scorecard
        </Button>
      </div>
    </div>
  );
}
