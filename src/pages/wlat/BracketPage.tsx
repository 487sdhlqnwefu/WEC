import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function WlatBracket() {
  const { slug } = useParams();
  const { data } = trpc.wlat.publicEvent.useQuery({ slug: slug || "" }, { enabled: Boolean(slug) });
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{data?.event.name} bracket</h1>
      <div className="space-y-3">
        {(data?.bracket ?? []).map((node) => (
          <div key={node.id} className="rounded-lg border border-[#3a2a1f] p-3 flex justify-between">
            <span>{node.roundName} · {node.entryA} vs {node.entryB}</span>
            <span className="text-gold">{node.winner ?? node.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
