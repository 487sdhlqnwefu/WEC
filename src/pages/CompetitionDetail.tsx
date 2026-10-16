import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PILLAR_WEIGHTS } from "@contracts/baristaLeagueScoring";

export default function CompetitionDetail() {
  const { slug = "" } = useParams();
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.competitions.get.useQuery({ slug });
  const register = trpc.competitions.registerTeam.useMutation({
    onSuccess: () => utils.competitions.get.invalidate({ slug }),
  });
  const volunteer = trpc.competitions.volunteerJudge.useMutation({
    onSuccess: () => utils.competitions.get.invalidate({ slug }),
  });
  const publish = trpc.competitions.publish.useMutation({
    onSuccess: () => utils.competitions.get.invalidate({ slug }),
  });
  const recordFee = trpc.competitions.recordSponsorFee.useMutation({
    onSuccess: () => utils.competitions.get.invalidate({ slug }),
  });

  if (isLoading) {
    return <div className="wec-container py-16 text-sand-500">Loading event…</div>;
  }
  if (error || !data) {
    return <div className="wec-container py-16 text-sand-500">Event not found.</div>;
  }

  const { event, teams, standings, scorecards, resultsVisible, viewer, feeMessage } = data;
  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="wec-container py-16">
      <Link to="/competitions" className="text-sm text-cinnamon-400 hover:text-cinnamon-300">
        ← All competitions
      </Link>
      <div className="flex flex-wrap gap-2 mt-6 mb-4">
        <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded bg-cinnamon-950 text-cinnamon-300">
          {event.kind}
        </span>
        <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded bg-[#231a14] text-sand-400">
          {event.status}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-sand-100 mb-3">{event.name}</h1>
      <p className="text-sand-400 mb-2">
        {event.location} · {event.date} · Host {event.hostName}
      </p>
      <p className="text-sand-400 max-w-3xl leading-relaxed mb-8">{event.description}</p>

      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {(
          [
            ["Concept", PILLAR_WEIGHTS.concept],
            ["Service", PILLAR_WEIGHTS.service],
            ["Product", PILLAR_WEIGHTS.product],
          ] as const
        ).map(([label, weight]) => (
          <div key={label} className="bg-[#231a14] border border-[#3a2a1f] rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-sand-500">{label}</p>
            <p className="text-2xl font-semibold text-sand-100">{Math.round(weight * 100)}%</p>
          </div>
        ))}
      </div>

      {feeMessage && (
        <p className="mb-8 text-sm text-sand-300 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-4">
          {feeMessage}
        </p>
      )}

      {viewer.isHost && (
        <div className="flex flex-wrap gap-3 mb-10">
          {event.kind === "sponsored" && !event.sponsorFeePaid && (
            <Button
              onClick={() => recordFee.mutate({ slug })}
              className="bg-cinnamon-600 hover:bg-cinnamon-500"
            >
              Record ${event.sponsorFeeUsd} host fee as paid
            </Button>
          )}
          {event.status !== "published" && (
            <Button variant="outline" onClick={() => publish.mutate({ slug })}>
              Publish results
            </Button>
          )}
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-sand-100 mb-4">Standings</h2>
        {!resultsVisible && (
          <p className="text-sand-500 text-sm">
            Public standings are held until the sponsored host fee is recorded.
          </p>
        )}
        {resultsVisible && standings.length === 0 && (
          <p className="text-sand-500 text-sm">No teams yet.</p>
        )}
        {resultsVisible && standings.length > 0 && (
          <div className="overflow-x-auto border border-[#3a2a1f] rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-[#140f0b] text-sand-500 text-left">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Concept</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Judges</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr key={row.teamId} className="border-t border-[#3a2a1f]">
                    <td className="px-4 py-3 text-sand-100">{row.rank}</td>
                    <td className="px-4 py-3 text-sand-200">{teamName(row.teamId)}</td>
                    <td className="px-4 py-3 text-cinnamon-300 font-medium">
                      {row.judgeCount ? row.meanTotal.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sand-400">{row.meanConcept.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sand-400">{row.meanService.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sand-400">{row.meanProduct.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sand-500">{row.judgeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-sand-100 mb-4">Scorecards</h2>
        {!resultsVisible && (
          <p className="text-sand-500 text-sm">Scorecards stay with the host and judges until the fee is paid.</p>
        )}
        {resultsVisible &&
          scorecards.map((card) => (
            <article
              key={card.id}
              className="mb-3 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-4"
            >
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <p className="text-sand-100 font-medium">
                  {teamName(card.teamId)} · {card.total.toFixed(2)}
                </p>
                <p className="text-xs text-sand-500">{card.judgeName}</p>
              </div>
              <p className="text-sm text-sand-400">
                Concept {card.scores.concept} · Service {card.scores.service} · Product {card.scores.product}
              </p>
              {card.notes && <p className="text-sm text-sand-500 mt-2">{card.notes}</p>}
            </article>
          ))}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-sand-100 mb-4">Teams</h2>
        <ul className="space-y-2 mb-6">
          {teams.map((team) => (
            <li key={team.id} className="text-sand-300">
              <span className="text-sand-100">{team.name}</span> — {team.members} ({team.city})
            </li>
          ))}
        </ul>
        {isAuthenticated && event.status !== "published" && event.status !== "closed" ? (
          <form
            className="grid sm:grid-cols-2 gap-3 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              register.mutate({
                slug,
                name: String(data.get("name") || ""),
                members: String(data.get("members") || ""),
                city: String(data.get("city") || ""),
              });
              form.reset();
            }}
          >
            <Input name="name" placeholder="Team name" required />
            <Input name="members" placeholder="Baristas on the team" required />
            <Input name="city" placeholder="City" required />
            <Button type="submit" disabled={register.isPending} className="bg-cinnamon-600 hover:bg-cinnamon-500">
              Register team
            </Button>
            {register.error && (
              <p className="sm:col-span-2 text-sm text-red-400">{register.error.message}</p>
            )}
          </form>
        ) : (
          !isAuthenticated && (
            <p className="text-sm text-sand-500">
              <Link to="/join" className="text-cinnamon-400">
                Create a free member account
              </Link>{" "}
              to register a team.
            </p>
          )
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-sand-100 mb-4">Judges</h2>
        <ul className="space-y-1 mb-4 text-sand-300">
          {data.judges.map((judge) => (
            <li key={judge.id}>{judge.displayName}</li>
          ))}
        </ul>
        {isAuthenticated && !viewer.isJudge && (
          <Button variant="outline" onClick={() => volunteer.mutate({ slug })}>
            Volunteer as judge
          </Button>
        )}
        {viewer.isJudge && (
          <Link to={`/competitions/${slug}/judge`}>
            <Button className="bg-cinnamon-600 hover:bg-cinnamon-500">Open scorepad</Button>
          </Link>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-sand-500">
            Sign in as a member to judge. Demo judge: rachel@wct.members / community
          </p>
        )}
        {user && viewer.isJudge && (
          <p className="text-xs text-sand-600 mt-2">Scoring as {user.name}</p>
        )}
      </section>
    </div>
  );
}
