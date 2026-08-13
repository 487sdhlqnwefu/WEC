import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { formatMs } from "@/wlat/formatMs";

export default function WlatBoard() {
  const { slug } = useParams();
  const { data } = trpc.wlat.publicEvent.useQuery(
    { slug: slug || "" },
    { refetchInterval: 1000, enabled: Boolean(slug) },
  );
  const heat = data?.activeHeat;
  return (
    <div className="min-h-screen bg-[#0e0907] text-sand-100 p-8 flex flex-col">
      <div className="text-sm uppercase tracking-[0.3em] text-cinnamon-400">{data?.event.name}</div>
      <div className="text-xl text-sand-400 mt-2">
        {heat ? `Heat ${heat.heatNumber} · ${heat.state.replaceAll("_", " ")}` : "Waiting for the next heat"}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
          {heat ? `${heat.entryAName}  vs  ${heat.entryBName}` : "World Latte Art Throwdown"}
        </div>
        <div className="text-[12vw] leading-none font-semibold tabular-nums text-gold" aria-live="polite">
          {heat?.timer ? formatMs(heat.timer.remainingMs) : "--:--"}
        </div>
        <div className="text-2xl mt-4 uppercase tracking-[0.2em] text-sand-400">
          {heat?.timer?.phase ?? heat?.state ?? "standby"}
        </div>
        {heat?.ballotProgress && (
          <div className="mt-8 text-2xl">{heat.ballotProgress.submitted} / {heat.ballotProgress.required} ballots</div>
        )}
      </div>
      <div className="text-sand-500 text-sm">
        Next: {data?.upcoming[0] ? `${data.upcoming[0].entryAName} vs ${data.upcoming[0].entryBName}` : "—"}
      </div>
    </div>
  );
}
