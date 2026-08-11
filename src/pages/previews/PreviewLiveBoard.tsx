import { CATEGORY_POINTS, ROUND_NAMES, WIN_THRESHOLD } from "@contracts/scoring";
import { Eye, Trophy, MapPin, Calendar, Coffee, RefreshCw } from "lucide-react";
import { DEMO_COMPETITORS, DEMO_MATCHES, DEMO_TOURNAMENT } from "./demoData";

/** Marketing screenshot page — demo live board mid-championship */
export default function PreviewLiveBoard() {
  const live = DEMO_MATCHES.find((m) => m.status === "in_progress")!;
  const qf = DEMO_MATCHES.filter((m) => m.round === 3);
  const r16 = DEMO_MATCHES.filter((m) => m.round === 2);

  return (
    <div className="min-h-screen bg-[#1a1410] text-sand-100">
      <section className="relative py-14 border-b border-[#3a2a1f]">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/30 to-transparent" />
        <div className="wec-container relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/logo-white.png" alt="WEC" className="h-14 w-14 object-contain" />
                <div>
                  <p className="text-xs tracking-[0.2em] text-cinnamon-400 uppercase">
                    World Espresso Championship
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold">{DEMO_TOURNAMENT.name}</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-sand-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cinnamon-400" />
                  {DEMO_TOURNAMENT.eventDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cinnamon-400" />
                  {DEMO_TOURNAMENT.venue}, {DEMO_TOURNAMENT.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-gold" />
                  Roaster: {DEMO_TOURNAMENT.roasterSponsor}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-full border bg-cinnamon-950/50 border-cinnamon-600 text-cinnamon-300">
                ● Live
              </span>
              <RefreshCw className="w-4 h-4 text-sand-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#140f0b] border-b border-[#3a2a1f] py-4">
        <div className="wec-container flex flex-wrap gap-x-6 gap-y-2 text-xs text-sand-500">
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
      </section>

      <section className="py-12">
        <div className="wec-container">
          <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-2">
            Now judging
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {ROUND_NAMES[live.round]} · Match {live.matchNumber}
          </h2>
          <p className="text-sand-400 mb-8">
            Identities hidden from judges. Cups are blinded at the table.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div className="wec-card rounded-xl p-6">
              <p className="text-xs text-sand-500 mb-2">Competitor</p>
              <p className="text-xl font-bold">{live.competitorA.displayName}</p>
              <p className="text-sm text-sand-400 mt-1">{live.competitorA.country}</p>
            </div>
            <div className="wec-card rounded-xl p-6">
              <p className="text-xs text-sand-500 mb-2">Competitor</p>
              <p className="text-xl font-bold">{live.competitorB.displayName}</p>
              <p className="text-sm text-sand-400 mt-1">{live.competitorB.country}</p>
            </div>
          </div>
          <p className="text-xs text-sand-500 mt-4">Ballots submitted: {live.ballotCount} / 3</p>
        </div>
      </section>

      <section className="py-12 bg-[#140f0b]">
        <div className="wec-container space-y-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold" />
            Tournament Bracket
          </h2>

          <RoundBlock title={ROUND_NAMES[3]} matches={qf} />
          <RoundBlock title={ROUND_NAMES[2]} matches={r16} />
        </div>
      </section>

      <section className="py-12">
        <div className="wec-container">
          <h2 className="text-2xl font-bold mb-6">The Field</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {DEMO_COMPETITORS.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border p-3 text-center ${
                  c.status === "eliminated"
                    ? "border-[#3a2a1f] bg-[#1a1410] opacity-50"
                    : "border-[#3a2a1f] bg-[#231a14]"
                }`}
              >
                <p className="text-[10px] text-sand-500">#{c.seed}</p>
                <p className="text-xs font-medium truncate">{c.displayName}</p>
                <p className="text-[10px] text-sand-500 truncate">{c.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function RoundBlock({
  title,
  matches,
}: {
  title: string;
  matches: typeof DEMO_MATCHES;
}) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wider text-cinnamon-400 mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {matches.map((m) => (
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
            <Player
              name={m.competitorA.displayName}
              country={m.competitorA.country}
              score={m.status === "completed" ? m.scoreA : null}
              won={m.winnerId === m.competitorAId}
            />
            <div className="h-px bg-[#3a2a1f] my-2" />
            <Player
              name={m.competitorB.displayName}
              country={m.competitorB.country}
              score={m.status === "completed" ? m.scoreB : null}
              won={m.winnerId === m.competitorBId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Player({
  name,
  country,
  score,
  won,
}: {
  name: string;
  country: string;
  score: number | null;
  won: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className={`text-sm truncate ${won ? "text-gold font-semibold" : "text-sand-200"}`}>
          {name}
        </p>
        <p className="text-[10px] text-sand-500 truncate">{country}</p>
      </div>
      {score != null && (
        <span className={`text-sm font-mono ${won ? "text-gold" : "text-sand-400"}`}>{score}</span>
      )}
    </div>
  );
}
