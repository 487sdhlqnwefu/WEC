import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { CATEGORY_POINTS, ROUND_NAMES, WIN_THRESHOLD } from "@contracts/scoring";
import { Eye, Trophy, MapPin, Calendar, Coffee, ArrowRight, RefreshCw } from "lucide-react";

export default function LiveTournament() {
  const { slug = "wec-2026-panama" } = useParams();
  const { data: board, isLoading, isError, refetch, isFetching } =
    trpc.tournament.bySlug.useQuery(
      { slug },
      { refetchInterval: 5000 },
    );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="wec-section">
        <div className="wec-container text-center max-w-lg mx-auto">
          <Trophy className="w-12 h-12 text-cinnamon-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-sand-100 mb-3">Live board not ready</h1>
          <p className="text-sand-400 mb-6">
            The public tournament board will appear here once WEC 2026 Panama is initialized.
          </p>
          <Link to="/panama-2026">
            <Button className="bg-cinnamon-600 hover:bg-cinnamon-500">
              WEC 2026 Panama
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { tournament, matches, competitors } = board;
  const live = matches.find((m) => m.status === "in_progress");
  const champion = competitors.find((c) => c.status === "champion");

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-b border-[#3a2a1f]">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/30 to-transparent" />
        <div className="wec-container relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/logo-white.png"
                  alt="World Espresso Championship"
                  className="h-14 w-14 object-contain"
                />
                <div>
                  <p className="text-xs tracking-[0.2em] text-cinnamon-400 uppercase">
                    World Espresso Championship
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-sand-100">
                    {tournament.name}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-sand-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cinnamon-400" />
                  {tournament.eventDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cinnamon-400" />
                  {tournament.venue}, {tournament.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-gold" />
                  Roaster: {tournament.roasterSponsor}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
                  tournament.status === "live"
                    ? "bg-cinnamon-950/50 border-cinnamon-600 text-cinnamon-300"
                    : "bg-[#231a14] border-[#3a2a1f] text-sand-400"
                }`}
              >
                {tournament.status === "live" ? "● Live" : tournament.status}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-sand-400"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring legend */}
      <section className="bg-[#140f0b] border-b border-[#3a2a1f] py-4">
        <div className="wec-container">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-sand-500">
            <span className="flex items-center gap-1.5 text-sand-300">
              <Eye className="w-3.5 h-3.5 text-cinnamon-400" />
              Blind · ISO 5495 · Scoring v3
            </span>
            <span>Tactile {CATEGORY_POINTS.tactile} (45%)</span>
            <span>Taste {CATEGORY_POINTS.taste} (30%)</span>
            <span>Flavour {CATEGORY_POINTS.flavour} (24%)</span>
            <span>{WIN_THRESHOLD}+ / 99 wins</span>
            <span>No visual categories · The cup decides</span>
          </div>
        </div>
      </section>

      {/* Champion banner */}
      {champion && (
        <section className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 py-8">
          <div className="wec-container text-center">
            <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-sm text-gold uppercase tracking-wider mb-1">2026 World Espresso Champion</p>
            <h2 className="text-3xl font-bold text-sand-100">{champion.displayName}</h2>
            <p className="text-sand-400 mt-1">{champion.country}</p>
          </div>
        </section>
      )}

      {/* Current heat */}
      {live && (
        <section className="wec-section !py-12">
          <div className="wec-container">
            <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-2">
              Now judging
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-2">
              {ROUND_NAMES[live.round]} · Match {live.matchNumber}
            </h2>
            <p className="text-sand-400 mb-8">
              Identities hidden from judges. Public board shows competitors; cups are blinded at the table.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
              <CompetitorCard
                name={live.competitorA?.displayName ?? "TBD"}
                country={live.competitorA?.country}
                side="Seed side A"
              />
              <CompetitorCard
                name={live.competitorB?.displayName ?? "TBD"}
                country={live.competitorB?.country}
                side="Seed side B"
              />
            </div>
            <p className="text-xs text-sand-500 mt-4">
              Ballots submitted: {live.ballotCount} / 3
            </p>
          </div>
        </section>
      )}

      {/* Full bracket */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-8">
            Tournament Bracket
          </h2>
          <div className="space-y-10">
            {[1, 2, 3, 4, 5].map((round) => {
              const roundMatches = matches.filter((m) => m.round === round);
              if (roundMatches.length === 0) return null;
              return (
                <div key={round}>
                  <h3 className="text-sm uppercase tracking-wider text-cinnamon-400 mb-4">
                    {ROUND_NAMES[round]}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {roundMatches.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-xl border p-4 ${
                          m.status === "in_progress"
                            ? "border-cinnamon-500 bg-cinnamon-950/20 wec-glow"
                            : "border-[#3a2a1f] bg-[#231a14]"
                        }`}
                      >
                        <div className="flex justify-between text-[10px] uppercase tracking-wide text-sand-500 mb-3">
                          <span>Match {m.matchNumber}</span>
                          <span className="capitalize">{m.status.replace("_", " ")}</span>
                        </div>
                        <PlayerRow
                          name={m.competitorA?.displayName}
                          country={m.competitorA?.country}
                          score={m.status === "completed" ? m.scoreA : null}
                          won={m.winnerId === m.competitorAId}
                        />
                        <div className="h-px bg-[#3a2a1f] my-2" />
                        <PlayerRow
                          name={m.competitorB?.displayName}
                          country={m.competitorB?.country}
                          score={m.status === "completed" ? m.scoreB : null}
                          won={m.winnerId === m.competitorBId}
                        />
                        {m.status === "completed" && (
                          <p className="text-[10px] text-sand-500 mt-3">
                            Cup totals /99 · threshold {WIN_THRESHOLD}+
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Field */}
      <section className="wec-section">
        <div className="wec-container">
          <h2 className="text-2xl font-bold text-sand-100 mb-6">The Field</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {competitors.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border p-3 text-center ${
                  c.status === "champion"
                    ? "border-gold/50 bg-gold/10"
                    : c.status === "eliminated"
                      ? "border-[#3a2a1f] bg-[#1a1410] opacity-50"
                      : "border-[#3a2a1f] bg-[#231a14]"
                }`}
              >
                <p className="text-[10px] text-sand-500">#{c.seed}</p>
                <p className="text-xs font-medium text-sand-100 truncate">{c.displayName}</p>
                <p className="text-[10px] text-sand-500 truncate">{c.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CompetitorCard({
  name,
  country,
  side,
}: {
  name: string;
  country?: string;
  side: string;
}) {
  return (
    <div className="wec-card rounded-xl p-6">
      <p className="text-xs text-sand-500 mb-2">{side}</p>
      <p className="text-xl font-bold text-sand-100">{name}</p>
      {country && <p className="text-sm text-sand-400 mt-1">{country}</p>}
    </div>
  );
}

function PlayerRow({
  name,
  country,
  score,
  won,
}: {
  name?: string | null;
  country?: string | null;
  score?: number | null;
  won?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className={`text-sm truncate ${won ? "text-gold font-semibold" : "text-sand-200"}`}>
          {name ?? "TBD"}
        </p>
        {country && <p className="text-[10px] text-sand-500 truncate">{country}</p>}
      </div>
      {score != null && (
        <span className={`text-sm font-mono ${won ? "text-gold" : "text-sand-400"}`}>
          {score}
        </span>
      )}
    </div>
  );
}
