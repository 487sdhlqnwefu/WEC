import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import Seo from "@/components/Seo";
import { WEC_FACTS, SITE_URL } from "@/data/wecFacts";
import { Calendar, MapPin, Trophy, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LiveTournament() {
  const { slug } = useParams<{ slug?: string }>();
  const boardSlug = slug || "wec-2026-panama";
  const ev = WEC_FACTS.event2026;
  const state = WEC_FACTS.event2026.liveBoardState;

  const { data, isLoading, isError, refetch, dataUpdatedAt } =
    trpc.tournament.bySlug.useQuery(
      { slug: boardSlug },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: state === "live" || state === "fault" || state === "post_event",
        refetchInterval: state === "live" ? 5000 : false,
      },
    );

  const title =
    state === "post_event"
      ? `Results · ${ev.name}`
      : `Live Bracket · ${ev.name}`;

  return (
    <div>
      <Seo
        title={`${title} | World Espresso Championship`}
        description={`${ev.name} live results and bracket. ${ev.liveMessage}`}
        path={`/live/${boardSlug}`}
        image={`${SITE_URL}/assets/og/live.jpg`}
        noindex={state === "fault"}
      />
      <div className="wec-section min-h-[60vh]">
        <div className="wec-container max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">{title}</h1>

          {state === "pre_event" && (
            <div className="space-y-6">
              <p className="text-sand-400 leading-relaxed">
                {ev.name} · {ev.dateDisplay} · {ev.addressDisplay}
              </p>
              <div className="flex flex-wrap gap-4 text-sand-400 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cinnamon-400" aria-hidden />
                  {ev.dateDisplay} ({ev.timezone})
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cinnamon-400" aria-hidden />
                  {ev.venue}
                </span>
              </div>
              <p className="text-cinnamon-300 font-medium" role="status">
                {ev.liveMessage}
              </p>
              <div className="wec-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-sand-100 mb-2">
                  {WEC_FACTS.scoring.version} summary
                </h2>
                <p className="text-sm text-sand-400 mb-3">{WEC_FACTS.scoring.biasNote}</p>
                <ul className="text-sm text-sand-400 space-y-1">
                  <li>
                    Tactile {WEC_FACTS.scoring.tactile}/33 — {WEC_FACTS.scoring.percentages.tactile.exact}{" "}
                    ({WEC_FACTS.scoring.percentages.tactile.rounded} rounded)
                  </li>
                  <li>
                    Taste {WEC_FACTS.scoring.taste}/33 — {WEC_FACTS.scoring.percentages.taste.exact}{" "}
                    ({WEC_FACTS.scoring.percentages.taste.rounded} rounded)
                  </li>
                  <li>
                    Flavour {WEC_FACTS.scoring.flavour}/33 — {WEC_FACTS.scoring.percentages.flavour.exact}{" "}
                    ({WEC_FACTS.scoring.percentages.flavour.rounded} rounded)
                  </li>
                </ul>
                <p className="text-xs text-sand-500 mt-3">Percentages rounded; the points govern.</p>
              </div>
              <div className="wec-card rounded-xl p-6 border-dashed">
                <p className="text-sand-500 text-sm mb-2">Bracket / field placeholder</p>
                <p className="text-sand-400 text-sm">
                  Planned field: {ev.fieldSize} national champions. Confirmed so far:{" "}
                  {ev.confirmedCompetitors}. The public bracket opens when heats begin.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/judging"
                  className="inline-flex min-h-11 items-center px-4 rounded-md bg-cinnamon-600 text-sand-100 text-sm"
                >
                  How judging works
                </Link>
                <Link
                  to="/panama-2026#competitor-registration"
                  className="inline-flex min-h-11 items-center px-4 rounded-md border border-sand-400/30 text-sand-200 text-sm"
                >
                  Register
                </Link>
              </div>
              <noscript>
                <p>
                  Live results for {ev.name} open on {ev.dateDisplay} at {SITE_URL}
                  {ev.livePath}.
                </p>
              </noscript>
            </div>
          )}

          {state === "live" && (
            <div className="space-y-4" aria-live="polite">
              {isLoading && <p className="text-sand-400">Loading live board…</p>}
              {isError && (
                <div className="wec-card p-6 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-gold mb-2" aria-hidden />
                  <p className="text-sand-300 mb-3">
                    Connection error. The last successful update may be unavailable.
                  </p>
                  <Button onClick={() => refetch()} className="min-h-11">
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden />
                    Retry
                  </Button>
                </div>
              )}
              {data && (
                <pre className="text-xs text-sand-500 overflow-auto wec-card p-4 rounded-xl">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
              {!isLoading && !isError && !data && (
                <p className="text-sand-400">Waiting for the first locked heat…</p>
              )}
            </div>
          )}

          {state === "fault" && (
            <div className="wec-card rounded-xl p-6">
              <AlertTriangle className="w-8 h-8 text-gold mb-3" aria-hidden />
              <h2 className="text-xl font-semibold text-sand-100 mb-2">Live board temporarily unavailable</h2>
              <p className="text-sand-400 mb-4">
                We are working to restore the public feed. On-site results remain authoritative for
                the heat in progress.
              </p>
              {dataUpdatedAt ? (
                <p className="text-xs text-sand-500 mb-4">
                  Last client attempt: {new Date(dataUpdatedAt).toLocaleString()}
                </p>
              ) : null}
              <Button onClick={() => refetch()} className="min-h-11">
                Retry
              </Button>
            </div>
          )}

          {state === "post_event" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-gold" aria-hidden />
                <p className="text-sand-300">{ev.independentEraNote}</p>
              </div>
              <p className="text-sand-400">
                Full published results archive and heat records will appear here after the event,
                including {WEC_FACTS.scoring.version}.
              </p>
              <Link to="/champions" className="text-cinnamon-400 hover:text-cinnamon-300">
                Champions archive →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
