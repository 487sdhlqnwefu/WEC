import { trpc } from "@/providers/trpc";
import { Link } from "react-router";

export default function WlatAdmin() {
  const summary = trpc.wlat.platformSummary.useQuery();
  if (summary.isError) {
    return <div className="p-10">Platform Admin only.</div>;
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Platform Admin</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {(summary.data?.events ?? []).map((event) => (
          <div key={event.id} className="rounded-xl border border-[#3a2a1f] p-4">
            <div className="font-semibold">{event.name}</div>
            <div className="text-sm text-sand-500">{event.status} · {event.payment}</div>
            <Link className="text-cinnamon-300 text-sm" to={`/throwdown/organise/${event.id}`}>Open</Link>
          </div>
        ))}
      </div>
      <h2 className="font-semibold mb-2">Recent audit</h2>
      <div className="space-y-1 text-xs font-mono text-sand-400 max-h-80 overflow-auto">
        {(summary.data?.audits ?? []).map((row) => (
          <div key={row.id}>{row.createdAt.toString()} {row.action} {row.entityType}</div>
        ))}
      </div>
    </div>
  );
}
