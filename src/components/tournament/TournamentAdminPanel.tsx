import { useMemo, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Trophy,
  Play,
  CheckCircle,
  RotateCcw,
  Eye,
  Users,
  GitBranch,
  AlertTriangle,
} from "lucide-react";
import { CATEGORY_POINTS, ROUND_NAMES } from "@contracts/scoring";

type CupSide = "A" | "B";

export default function TournamentAdminPanel() {
  const utils = trpc.useUtils();
  const { data: board, isLoading, refetch } = trpc.tournament.bySlug.useQuery(
    { slug: "wec-2026-panama" },
    { retry: false },
  );

  const ensure = trpc.tournament.ensurePanama2026.useMutation({
    onSuccess: async () => {
      toast.success("WEC 2026 Panama tournament ready");
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const seedDemo = trpc.tournament.seedDemoField.useMutation({
    onSuccess: async () => {
      toast.success("Demo field of 32 seeded");
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const genBracket = trpc.tournament.generateBracket.useMutation({
    onSuccess: async (r) => {
      toast.success(`Bracket generated (${r.matches} matches)`);
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const startMatch = trpc.tournament.startMatch.useMutation({
    onSuccess: async () => {
      toast.success("Match started — cups blinded");
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const submitBallot = trpc.tournament.submitBallot.useMutation({
    onSuccess: async () => {
      toast.success("Ballot recorded");
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const finalize = trpc.tournament.finalizeMatch.useMutation({
    onSuccess: async (r) => {
      toast.success(`Match finalized — Cup scores ${r.scoreA.total}–${r.scoreB.total}`);
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const voidMatch = trpc.tournament.voidMatch.useMutation({
    onSuccess: async () => {
      toast.success("Match reset");
      await utils.tournament.bySlug.invalidate({ slug: "wec-2026-panama" });
    },
    onError: (e) => toast.error(e.message),
  });

  const [ballot, setBallot] = useState<{
    judgeSlot: number;
    judgeName: string;
    tactile: CupSide | "";
    taste: CupSide | "";
    flavour: CupSide | "";
  }>({ judgeSlot: 1, judgeName: "", tactile: "", taste: "", flavour: "" });

  const liveMatch = board?.matches.find((m) => m.status === "in_progress");
  const readyMatches = board?.matches.filter((m) => m.status === "ready") ?? [];

  const ballotSlotsUsed = useMemo(() => {
    if (!liveMatch) return new Set<number>();
    return new Set(liveMatch.submittedJudgeSlots ?? []);
  }, [liveMatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="wec-card rounded-xl p-8 text-center space-y-4">
        <Trophy className="w-10 h-10 text-cinnamon-400 mx-auto" />
        <h2 className="text-xl font-semibold text-sand-100">WEC Tournament Engine</h2>
        <p className="text-sand-400 text-sm max-w-md mx-auto">
          Create the WEC 2026 Panama tournament (Scoring v3 · Café Unido · 26 October 2026).
        </p>
        <Button
          className="bg-cinnamon-600 hover:bg-cinnamon-500"
          onClick={() => ensure.mutate()}
          disabled={ensure.isPending}
        >
          Initialize Tournament
        </Button>
      </div>
    );
  }

  const { tournament, competitors, matches } = board;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="wec-card rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src="/assets/logo-white.png" alt="WEC" className="h-10 w-10 object-contain" />
            <div>
              <h2 className="text-xl font-bold text-sand-100">{tournament.name}</h2>
              <p className="text-xs text-sand-500">
                {tournament.eventDate} · {tournament.venue} · Roaster: {tournament.roasterSponsor}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusPill label={tournament.status} />
            <span className="text-xs px-2 py-1 rounded bg-[#1a1410] text-sand-400 border border-[#3a2a1f]">
              Scoring {tournament.scoringVersion} · {CATEGORY_POINTS.tactile}/{CATEGORY_POINTS.taste}/{CATEGORY_POINTS.flavour} · 50+ wins
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/live/wec-2026-panama" target="_blank">
            <Button variant="outline" className="border-sand-400/30 text-sand-200">
              <Eye className="w-4 h-4 mr-2" />
              Public Live Board
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => refetch()} className="text-sand-400">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Setup actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <SetupCard
          icon={Users}
          title="1. Seed field"
          desc={`${competitors.length} / ${tournament.competitorLimit} competitors`}
          actionLabel="Load demo 32"
          onAction={() => seedDemo.mutate({ tournamentId: tournament.id })}
          pending={seedDemo.isPending}
          disabled={tournament.status === "live" || tournament.status === "completed"}
        />
        <SetupCard
          icon={GitBranch}
          title="2. Generate bracket"
          desc={`${matches.length} matches · 31 for full field`}
          actionLabel="Generate bracket"
          onAction={() => genBracket.mutate({ tournamentId: tournament.id })}
          pending={genBracket.isPending}
          disabled={competitors.length !== tournament.competitorLimit}
        />
        <SetupCard
          icon={Play}
          title="3. Run heats"
          desc="Blind A/B · 3 judges · finalize advances"
          actionLabel="Scroll to control"
          onAction={() => document.getElementById("match-control")?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      {/* Live match control */}
      <div id="match-control" className="wec-card rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-sand-100 flex items-center gap-2">
          <Play className="w-5 h-5 text-cinnamon-400" />
          Match Control
        </h3>

        {liveMatch ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-cinnamon-400 font-medium">
                  {ROUND_NAMES[liveMatch.round]} · Match {liveMatch.matchNumber}
                </p>
                <p className="text-sand-100 font-semibold mt-1">
                  {liveMatch.competitorA?.displayName ?? "TBD"} vs {liveMatch.competitorB?.displayName ?? "TBD"}
                </p>
                <p className="text-xs text-sand-500 mt-1">
                  Blind service active — judges see Cup A / Cup B only
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gold/40 text-gold"
                  onClick={() => voidMatch.mutate({ matchId: liveMatch.id, reason: "Admin reset" })}
                  disabled={voidMatch.isPending}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Void / Reset
                </Button>
                <Button
                  className="bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold"
                  onClick={() => finalize.mutate({ matchId: liveMatch.id })}
                  disabled={finalize.isPending || liveMatch.ballotCount < tournament.judgesPerHeat}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalize ({liveMatch.ballotCount}/{tournament.judgesPerHeat})
                </Button>
              </div>
            </div>

            {/* Ballot form */}
            <div className="bg-[#1a1410] rounded-lg p-5 border border-[#3a2a1f] space-y-4">
              <p className="text-sm font-medium text-sand-200">Enter judge ballot (complete — all 3 categories required)</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  className="wec-input w-full px-3 py-2 rounded-lg text-sm"
                  value={ballot.judgeSlot}
                  onChange={(e) => setBallot((b) => ({ ...b, judgeSlot: Number(e.target.value) }))}
                >
                  {[1, 2, 3].map((s) => (
                    <option key={s} value={s} disabled={ballotSlotsUsed.has(s)}>
                      Judge slot {s}{ballotSlotsUsed.has(s) ? " (submitted)" : ""}
                    </option>
                  ))}
                </select>
                <input
                  className="wec-input w-full px-3 py-2 rounded-lg text-sm"
                  placeholder="Judge name (optional)"
                  value={ballot.judgeName}
                  onChange={(e) => setBallot((b) => ({ ...b, judgeName: e.target.value }))}
                />
              </div>
              {(["tactile", "taste", "flavour"] as const).map((cat) => (
                <div key={cat} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-sand-300 capitalize w-28">
                    {cat}{" "}
                    <span className="text-sand-500">({CATEGORY_POINTS[cat]})</span>
                  </span>
                  <div className="flex gap-2">
                    {(["A", "B"] as const).map((side) => (
                      <button
                        key={side}
                        type="button"
                        onClick={() => setBallot((b) => ({ ...b, [cat]: side }))}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          ballot[cat] === side
                            ? "bg-cinnamon-600 border-cinnamon-500 text-sand-100"
                            : "bg-[#231a14] border-[#3a2a1f] text-sand-400 hover:border-cinnamon-700"
                        }`}
                      >
                        Cup {side}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                className="w-full bg-cinnamon-600 hover:bg-cinnamon-500"
                disabled={
                  submitBallot.isPending ||
                  !ballot.tactile ||
                  !ballot.taste ||
                  !ballot.flavour
                }
                onClick={() => {
                  if (!ballot.tactile || !ballot.taste || !ballot.flavour) return;
                  submitBallot.mutate({
                    matchId: liveMatch.id,
                    judgeSlot: ballot.judgeSlot,
                    judgeName: ballot.judgeName || undefined,
                    tactile: ballot.tactile,
                    taste: ballot.taste,
                    flavour: ballot.flavour,
                  });
                  setBallot((b) => ({
                    ...b,
                    judgeSlot: Math.min(3, b.judgeSlot + 1),
                    tactile: "",
                    taste: "",
                    flavour: "",
                  }));
                }}
              >
                Submit Ballot
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-sand-400">No match in progress. Start a ready heat:</p>
            {readyMatches.length === 0 ? (
              <p className="text-sm text-sand-500">No ready matches. Generate bracket or wait for winners to advance.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {readyMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => startMatch.mutate({ matchId: m.id })}
                    className="text-left p-3 rounded-lg border border-[#3a2a1f] bg-[#1a1410] hover:border-cinnamon-700 transition-colors"
                  >
                    <span className="text-xs text-cinnamon-400">
                      {ROUND_NAMES[m.round]} · M{m.matchNumber}
                    </span>
                    <p className="text-sm text-sand-100 mt-1">
                      {m.competitorA?.displayName ?? "TBD"} vs {m.competitorB?.displayName ?? "TBD"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bracket snapshot */}
      <div className="wec-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-sand-100 mb-4">Bracket Snapshot</h3>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((round) => {
            const roundMatches = matches.filter((m) => m.round === round);
            if (roundMatches.length === 0) return null;
            return (
              <div key={round}>
                <p className="text-xs uppercase tracking-wider text-cinnamon-400 mb-2">
                  {ROUND_NAMES[round]}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {roundMatches.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border text-sm ${
                        m.status === "in_progress"
                          ? "border-cinnamon-500 bg-cinnamon-950/30"
                          : m.status === "completed"
                            ? "border-[#3a2a1f] bg-[#1a1410]"
                            : "border-[#3a2a1f] bg-[#231a14]"
                      }`}
                    >
                      <div className="flex justify-between text-xs text-sand-500 mb-1">
                        <span>M{m.matchNumber}</span>
                        <span className="capitalize">{m.status.replace("_", " ")}</span>
                      </div>
                      <p className={m.winnerId === m.competitorAId ? "text-gold" : "text-sand-200"}>
                        {m.competitorA?.displayName ?? "—"}
                        {m.status === "completed" && m.scoreA != null ? ` (${m.scoreA})` : ""}
                      </p>
                      <p className={m.winnerId === m.competitorBId ? "text-gold" : "text-sand-200"}>
                        {m.competitorB?.displayName ?? "—"}
                        {m.status === "completed" && m.scoreB != null ? ` (${m.scoreB})` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 text-cinnamon-300 capitalize">
      {label}
    </span>
  );
}

function SetupCard({
  icon: Icon,
  title,
  desc,
  actionLabel,
  onAction,
  pending,
  disabled,
}: {
  icon: typeof Users;
  title: string;
  desc: string;
  actionLabel: string;
  onAction: () => void;
  pending?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="wec-card rounded-xl p-5 flex flex-col">
      <Icon className="w-6 h-6 text-cinnamon-400 mb-3" />
      <h4 className="font-semibold text-sand-100 mb-1">{title}</h4>
      <p className="text-xs text-sand-500 mb-4 flex-1">{desc}</p>
      <Button
        size="sm"
        className="bg-cinnamon-600 hover:bg-cinnamon-500"
        onClick={onAction}
        disabled={pending || disabled}
      >
        {pending ? "Working…" : actionLabel}
      </Button>
    </div>
  );
}
