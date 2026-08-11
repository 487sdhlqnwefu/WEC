import { CATEGORY_POINTS, ROUND_NAMES } from "@contracts/scoring";
import { Play, CheckCircle, AlertTriangle, Eye, GitBranch, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_MATCHES, DEMO_TOURNAMENT } from "./demoData";

/** Marketing screenshot — admin match control during a live heat */
export default function PreviewAdminControl() {
  const live = DEMO_MATCHES.find((m) => m.status === "in_progress")!;
  const ready = DEMO_MATCHES.filter((m) => m.status === "ready");

  return (
    <div className="min-h-screen bg-[#1a1410] text-sand-100">
      <div className="bg-[#140f0b] border-b border-[#3a2a1f]">
        <div className="wec-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-white.png" alt="WEC" className="h-8 w-8 object-contain" />
            <h1 className="text-lg font-semibold">Admin Dashboard · Tournament</h1>
          </div>
          <span className="text-xs text-sand-500">Founder admin</span>
        </div>
      </div>

      <div className="wec-container py-8 space-y-8">
        <div className="wec-card rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/assets/logo-white.png" alt="WEC" className="h-10 w-10 object-contain" />
              <div>
                <h2 className="text-xl font-bold">{DEMO_TOURNAMENT.name}</h2>
                <p className="text-xs text-sand-500">
                  {DEMO_TOURNAMENT.eventDate} · {DEMO_TOURNAMENT.venue} · Roaster:{" "}
                  {DEMO_TOURNAMENT.roasterSponsor}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 text-cinnamon-300">
                live
              </span>
              <span className="text-xs px-2 py-1 rounded bg-[#1a1410] text-sand-400 border border-[#3a2a1f]">
                Scoring v3 · {CATEGORY_POINTS.tactile}/{CATEGORY_POINTS.taste}/
                {CATEGORY_POINTS.flavour} · 50+ wins
              </span>
            </div>
          </div>
          <Button variant="outline" className="border-sand-400/30 text-sand-200">
            <Eye className="w-4 h-4 mr-2" />
            Public Live Board
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "1. Seed field", desc: "32 / 32 competitors" },
            { icon: GitBranch, title: "2. Generate bracket", desc: "31 matches ready" },
            { icon: Play, title: "3. Run heats", desc: "Blind A/B · 3 judges" },
          ].map((c) => (
            <div key={c.title} className="wec-card rounded-xl p-5">
              <c.icon className="w-6 h-6 text-cinnamon-400 mb-3" />
              <h4 className="font-semibold mb-1">{c.title}</h4>
              <p className="text-xs text-sand-500">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="wec-card rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Play className="w-5 h-5 text-cinnamon-400" />
            Match Control
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-cinnamon-400 font-medium">
                {ROUND_NAMES[live.round]} · Match {live.matchNumber}
              </p>
              <p className="font-semibold mt-1">
                {live.competitorA.displayName} vs {live.competitorB.displayName}
              </p>
              <p className="text-xs text-sand-500 mt-1">
                Blind service active — judges see Cup A / Cup B only
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gold/40 text-gold">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Void / Reset
              </Button>
              <Button className="bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold">
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalize ({live.ballotCount}/3)
              </Button>
            </div>
          </div>

          <div className="bg-[#1a1410] rounded-lg p-5 border border-[#3a2a1f] space-y-4">
            <p className="text-sm font-medium text-sand-200">
              Enter judge ballot (complete — all 3 categories required)
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="wec-input px-3 py-2 rounded-lg text-sm">Judge slot 3</div>
              <div className="wec-input px-3 py-2 rounded-lg text-sm text-sand-500">
                Judge name (optional)
              </div>
            </div>
            {(
              [
                ["tactile", CATEGORY_POINTS.tactile, "A"],
                ["taste", CATEGORY_POINTS.taste, "B"],
                ["flavour", CATEGORY_POINTS.flavour, "A"],
              ] as const
            ).map(([cat, pts, selected]) => (
              <div key={cat} className="flex items-center justify-between gap-4">
                <span className="text-sm text-sand-300 capitalize w-28">
                  {cat} <span className="text-sand-500">({pts})</span>
                </span>
                <div className="flex gap-2">
                  {(["A", "B"] as const).map((side) => (
                    <div
                      key={side}
                      className={`px-6 py-2 rounded-lg text-sm font-semibold border ${
                        selected === side
                          ? "bg-cinnamon-600 border-cinnamon-500 text-sand-100"
                          : "bg-[#231a14] border-[#3a2a1f] text-sand-400"
                      }`}
                    >
                      Cup {side}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-full bg-cinnamon-600 hover:bg-cinnamon-500">Submit Ballot</Button>
          </div>

          <div>
            <p className="text-sm text-sand-400 mb-3">Up next</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {ready.map((m) => (
                <div
                  key={m.id}
                  className="text-left p-3 rounded-lg border border-[#3a2a1f] bg-[#1a1410]"
                >
                  <span className="text-xs text-cinnamon-400">
                    {ROUND_NAMES[m.round]} · M{m.matchNumber}
                  </span>
                  <p className="text-sm mt-1">
                    {m.competitorA.displayName} vs {m.competitorB.displayName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
