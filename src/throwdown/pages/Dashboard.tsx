import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function ThrowdownDashboard() {
  const { data: me } = trpc.throwdown.me.useQuery();
  const { data, isLoading, error } = trpc.throwdown.myAssignments.useQuery(undefined, { enabled: !!me });

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-sand-100">Sign in to see your events</h1>
        <Button asChild className="mt-6 bg-cinnamon-600 text-sand-100">
          <Link to="/throwdown/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sand-100">Hello, {me.displayName}</h1>
          <p className="text-sm text-sand-500">Free member profile · {me.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-sand-400/30">
            <Link to="/throwdown/profile">Profile</Link>
          </Button>
          <Button asChild className="bg-cinnamon-600 text-sand-100">
            <Link to="/throwdown/events/new">New event</Link>
          </Button>
        </div>
      </div>
      {isLoading && <p className="mt-8 text-sand-400">Loading your events…</p>}
      {error && <p className="mt-8 text-red-400">{error.message}</p>}
      <section className="mt-10 space-y-4">
        <h2 className="text-sm uppercase tracking-[0.18em] text-cinnamon-400">Events</h2>
        {data?.events.length === 0 && <p className="text-sand-500">No events yet. Create a free Throwdown to begin.</p>}
        {data?.events.map(({ event, roles }) => (
          <article key={event.id} className="wec-card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <Link to={`/throwdown/e/${event.slug}`} className="text-lg font-semibold text-sand-100 hover:text-gold">
                {event.name}
              </Link>
              <p className="text-xs text-sand-500">
                {event.tier === "premium" ? "Premium Espresso Tournament" : "Free Espresso Throwdown"} · {roles.join(", ")}
              </p>
            </div>
            {roles.includes("organiser") && (
              <Button asChild size="sm" className="bg-cinnamon-600 text-sand-100">
                <Link to={`/throwdown/events/${event.id}`}>Organiser desk</Link>
              </Button>
            )}
          </article>
        ))}
      </section>
      {!!data?.stewardEvents.length && (
        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.18em] text-cinnamon-400">Cup Steward</h2>
          {data.stewardEvents.map((e) => (
            <Link key={e.eventId} to={`/throwdown/steward/${e.eventId}`} className="mt-3 block wec-card p-4 hover:border-cinnamon-600">
              {e.name} — confidential coding screen
            </Link>
          ))}
        </section>
      )}
      {!!data?.judgeHeats.length && (
        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.18em] text-cinnamon-400">Judge ballots</h2>
          {data.judgeHeats.map((h) => (
            <Link key={h.heatId} to={`/throwdown/judge/${h.heatId}`} className="mt-3 block wec-card p-4 hover:border-cinnamon-600">
              {h.eventName} · {h.heatLabel} · {h.status.replace("_", " ")}
            </Link>
          ))}
        </section>
      )}
      {!!data?.recipeHeats.length && (
        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.18em] text-cinnamon-400">Recipes to submit</h2>
          {data.recipeHeats.map((h) => (
            <Link key={h.heatId} to={`/throwdown/recipe/${h.heatId}`} className="mt-3 block wec-card p-4 hover:border-cinnamon-600">
              {h.eventName} · {h.heatLabel} {h.unlocked ? "· open" : "· waiting for brewing"}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
