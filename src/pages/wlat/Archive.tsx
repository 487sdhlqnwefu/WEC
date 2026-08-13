import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function WlatArchive() {
  const { memberId } = useParams();
  const data = trpc.wlat.memberArchive.useQuery({ memberId: memberId || "" }, { enabled: Boolean(memberId) });
  if (!data.data) return <div className="p-10">Loading archive…</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{data.data.member.displayName}</h1>
      <p className="text-sand-400 mb-8">Permanent latte art archive. Judge feedback stays private.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {data.data.pours.map((pour) => (
          <article key={pour.id} className="rounded-xl border border-[#3a2a1f] overflow-hidden">
            {pour.photoPath && <img src={pour.photoPath} alt={`Latte art from ${pour.eventName}`} className="w-full h-48 object-cover" />}
            <div className="p-4 text-sm">
              <div className="font-semibold">{pour.eventName}</div>
              <div className="text-sand-500">{pour.roundName} · {pour.format} · {pour.outcome}</div>
              {pour.opponent && <div>vs {pour.opponent}</div>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
