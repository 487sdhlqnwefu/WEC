import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function PublicEventPage() {
  const { slug = "" } = useParams();
  const { data, error, isLoading, isFetching, dataUpdatedAt } = trpc.throwdown.publicEvent.useQuery(
    { slug },
    { refetchInterval: 4000 },
  );

  if (isLoading) return <p className="p-8 text-sand-400">Loading event…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Event not found</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
      </div>
    );
  }
  if (!data) return null;
  const stale = Date.now() - dataUpdatedAt > 15_000;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        {data.live && (
          <span className="rounded-full border border-cinnamon-600 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cinnamon-300">
            Live
          </span>
        )}
        {stale && !isFetching && <span className="text-xs text-gold">Board may be stale — reconnecting</span>}
      </div>
      <h1 className="mt-4 text-4xl font-bold text-sand-100">{data.name}</h1>
      <p className="mt-2 text-sand-400">
        {data.hostName}
        {data.venue ? ` · ${data.venue}` : ""}
        {data.city ? ` · ${data.city}` : ""}
        {data.country ? `, ${data.country}` : ""}
      </p>
      <p className="mt-1 text-sm text-sand-500">
        {data.tier === "premium" ? "Premium Espresso Tournament" : "Free Espresso Throwdown"} ·{" "}
        {data.judgingFormat === "wec_v3" ? "Official WEC Scoring v3" : "Simple Blind A/B"}
      </p>
      <p className="mt-4 max-w-2xl text-sand-300">{data.judgingExplanation}</p>
      {data.description && <p className="mt-4 max-w-2xl text-sand-400">{data.description}</p>}

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="wec-card p-5">
          <h2 className="font-semibold text-sand-100">Coffee</h2>
          <p className="mt-2 text-sand-300">{data.coffeeName} · {data.coffeeType.replace("_", " ")}</p>
          {data.coffeeNotes && <p className="mt-2 text-sm text-sand-500">{data.coffeeNotes}</p>}
        </article>
        <article className="wec-card p-5">
          <h2 className="font-semibold text-sand-100">Shared controls</h2>
          <p className="mt-2 text-sm text-sand-400">
            {[data.espressoMachine, data.grinder, data.basket, data.waterSpec, data.otherControls].filter(Boolean).join(" · ") || "—"}
          </p>
        </article>
      </section>

      {data.champion && (
        <section className="mt-8 wec-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Champion</p>
          <h2 className="mt-2 text-3xl font-bold text-sand-100">{data.champion}</h2>
          {data.completedAt && <p className="mt-2 text-xs text-sand-500">Completed {new Date(data.completedAt).toISOString()}</p>}
        </section>
      )}

      {data.currentHeat && (
        <section className="mt-8 wec-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cinnamon-400">Current heat</p>
          <h2 className="mt-2 text-2xl text-sand-100">{data.currentHeat.label}</h2>
          <p className="mt-2">{data.currentHeat.competitors.join(" vs ")}</p>
          {data.currentHeat.ballotProgress && (
            <p className="mt-2 text-sm text-sand-400">
              {data.currentHeat.ballotProgress.submitted} of {data.currentHeat.ballotProgress.required} ballots submitted
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-sand-100">Roster</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.roster.map((p) => (
            <li key={p.displayName} className="wec-card p-3 text-sm">
              {p.displayName}
              {p.organisation ? ` · ${p.organisation}` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-sand-100">Bracket</h2>
        <div className="mt-4 space-y-3">
          {data.heats.map((heat) => (
            <article key={heat.id} className="wec-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-sand-100">{heat.label}</h3>
                <span className="text-xs uppercase text-sand-500">{heat.status.replaceAll("_", " ")}</span>
              </div>
              <p className="mt-1 text-sand-300">{heat.competitors.join(" vs ")}</p>
              {heat.winnerName && <p className="mt-1 text-gold">Winner: {heat.winnerName}</p>}
              {heat.totals && <p className="text-xs text-sand-500">Totals recorded after reveal.</p>}
              {heat.recipes.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {heat.recipes.map((recipe) => (
                    <div key={recipe.competitorName} className="rounded border border-[#3a2a1f] p-3 text-sm">
                      <p className="font-medium text-sand-100">{recipe.competitorName}</p>
                      <p>
                        {recipe.doseGrams} g in · {recipe.yieldGrams} g out · {recipe.extractionTimeSeconds} s
                      </p>
                      <p className="text-sand-500">Ratio {recipe.brewRatio.toFixed(2)}{recipe.extractionYield != null ? ` · EY ${recipe.extractionYield.toFixed(1)}%` : ""}</p>
                      {recipe.notes && <p className="mt-2 text-sand-400">{recipe.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
