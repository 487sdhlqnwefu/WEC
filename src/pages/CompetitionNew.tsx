import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SPONSORED_EVENT_FEE_USD } from "@contracts/baristaLeagueScoring";

export default function CompetitionNew() {
  const { isAuthenticated, isLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const navigate = useNavigate();
  const [kind, setKind] = useState<"community" | "sponsored">("community");
  const [error, setError] = useState<string | null>(null);
  const create = trpc.competitions.create.useMutation({
    onSuccess: (event) => navigate(`/competitions/${event.slug}`),
    onError: (err) => setError(err.message),
  });

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="wec-container py-16 max-w-xl">
      <p className="text-xs tracking-[0.2em] uppercase text-cinnamon-400 mb-3">
        Host
      </p>
      <h1 className="text-3xl font-bold text-sand-100 mb-3">New event</h1>
      <p className="text-sand-400 mb-8 leading-relaxed">
        Community events are free. Sponsored events pay a ${SPONSORED_EVENT_FEE_USD}{" "}
        software fee before public results go live. Scoring uses the Barista
        League 2026 pillars for every event in this MVP.
      </p>
      <form
        className="space-y-4 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const data = new FormData(e.currentTarget);
          create.mutate({
            name: String(data.get("name") || ""),
            location: String(data.get("location") || ""),
            date: String(data.get("date") || ""),
            description: String(data.get("description") || ""),
            kind,
          });
        }}
      >
        <div>
          <Label htmlFor="name">Event name</Label>
          <Input id="name" name="name" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="location">City / venue</Label>
          <Input id="location" name="location" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" placeholder="2026-11-02" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">What is this for?</Label>
          <Textarea id="description" name="description" rows={4} className="mt-1" />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-sand-200">Who is this for?</legend>
          <label className="flex gap-3 items-start text-sm text-sand-300">
            <input
              type="radio"
              name="kind"
              checked={kind === "community"}
              onChange={() => setKind("community")}
              className="mt-1"
            />
            <span>
              <strong className="text-sand-100">Community</strong> — people-run,
              free software, results public as soon as judges score.
            </span>
          </label>
          <label className="flex gap-3 items-start text-sm text-sand-300">
            <input
              type="radio"
              name="kind"
              checked={kind === "sponsored"}
              onChange={() => setKind("sponsored")}
              className="mt-1"
            />
            <span>
              <strong className="text-sand-100">Sponsored</strong> — brand-backed
              host. ${SPONSORED_EVENT_FEE_USD} fee recorded before public
              results (invoice outside this MVP).
            </span>
          </label>
        </fieldset>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-cinnamon-600 hover:bg-cinnamon-500"
            disabled={create.isPending}
          >
            Create event
          </Button>
          <Link to="/competitions">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
