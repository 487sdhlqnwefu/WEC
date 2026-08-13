import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function WlatDashboard() {
  const me = trpc.wlat.me.useQuery();
  const events = trpc.wlat.myEvents.useQuery();
  const seed = trpc.wlat.seedDemos.useMutation();
  const utils = trpc.useUtils();

  if (me.isError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <p className="mb-4">Sign in to manage events and roles.</p>
        <Link to="/throwdown/login" className="text-cinnamon-300">Go to sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Member dashboard</h1>
          <p className="text-sand-400">{me.data?.member.displayName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              await seed.mutateAsync();
              await utils.wlat.myEvents.invalidate();
              await utils.wlat.publicEvents.invalidate();
            }}
          >
            Load demo events
          </Button>
          <Link to="/throwdown/create">
            <Button className="bg-cinnamon-600">New throwdown</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-3">
        {(events.data ?? []).map((event) => (
          <div key={event.id} className="rounded-xl border border-[#3a2a1f] bg-[#1b140f] p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{event.name}</div>
              <div className="text-xs text-sand-500">
                {event.status} · {event.roles.join(", ") || "owner"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link className="text-cinnamon-300" to={`/throwdown/e/${event.slug}`}>Public</Link>
              <Link className="text-cinnamon-300" to={`/throwdown/e/${event.slug}/board`}>Board</Link>
              {event.owner || event.roles.includes("lead_organiser") ? (
                <Link className="text-cinnamon-300" to={`/throwdown/organise/${event.id}`}>Control</Link>
              ) : null}
              {event.roles.includes("blind_steward") ? (
                <Link className="text-cinnamon-300" to={`/throwdown/steward/${event.id}`}>Steward</Link>
              ) : null}
              {event.roles.includes("judge") || event.roles.includes("tiebreak_judge") ? (
                <Link className="text-cinnamon-300" to={`/throwdown/judge/${event.id}`}>Judge</Link>
              ) : null}
              {event.roles.includes("competitor") || event.roles.includes("team_member") ? (
                <Link className="text-cinnamon-300" to={`/throwdown/compete/${event.id}`}>Compete</Link>
              ) : null}
            </div>
          </div>
        ))}
        {!events.data?.length && <p className="text-sand-500">No event roles yet.</p>}
      </div>
      {me.data?.isPlatformAdmin && (
        <Link to="/throwdown/admin" className="inline-block mt-8 text-gold">Platform Admin →</Link>
      )}
    </div>
  );
}
