import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { formatMs } from "@/wlat/formatMs";

export default function WlatPublicEvent() {
  const { slug } = useParams();
  const { data } = trpc.wlat.publicEvent.useQuery({ slug: slug || "" }, { refetchInterval: 2000, enabled: Boolean(slug) });
  if (!data) return <div className="p-10 text-sand-400">Loading event…</div>;
  const event = data.event;
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-cinnamon-400 mb-2">{event.status}</p>
      <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
      <p className="text-sand-400 mb-8">
        {event.venueName} · {event.city} · {event.format === "match_pattern" ? "Match the Pattern" : "Freestyle"} · {event.judgingDelivery} judging
      </p>
      <div className="flex gap-3 mb-10">
        <Link to={`/throwdown/e/${event.slug}/board`} className="px-4 py-2 rounded-md bg-cinnamon-600">Large board</Link>
        <Link to={`/throwdown/e/${event.slug}/bracket`} className="px-4 py-2 rounded-md border border-[#3a2a1f]">Bracket</Link>
      </div>
      {data.activeHeat && (
        <section className="rounded-2xl border border-[#3a2a1f] bg-[#1b140f] p-6 mb-8">
          <div className="text-sm text-sand-500">Heat {data.activeHeat.heatNumber} · {data.activeHeat.state.replaceAll("_", " ")}</div>
          <div className="text-3xl font-bold mt-2">
            {data.activeHeat.entryAName} vs {data.activeHeat.entryBName}
          </div>
          {data.activeHeat.timer && (
            <div className="mt-4 text-5xl font-semibold tabular-nums text-gold" aria-live="polite">
              {formatMs(data.activeHeat.timer.remainingMs)}
              <span className="text-base ml-3 text-sand-400">{data.activeHeat.timer.phase}</span>
            </div>
          )}
          {data.activeHeat.ballotProgress && (
            <p className="mt-3 text-sand-300">{data.activeHeat.ballotProgress.submitted} of {data.activeHeat.ballotProgress.required} ballots received</p>
          )}
          {data.activeHeat.winnerName && <p className="mt-3">Winner: {data.activeHeat.winnerName}</p>}
        </section>
      )}
      <h2 className="text-xl font-semibold mb-3">Bracket</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {data.bracket.map((node) => (
          <div key={node.id} className="rounded-lg border border-[#3a2a1f] p-3 text-sm">
            <div className="text-xs text-sand-500">{node.roundName} · Match {node.matchNumber}</div>
            <div>{node.entryA} vs {node.entryB}</div>
            {node.winner && <div className="text-gold">Winner: {node.winner}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
