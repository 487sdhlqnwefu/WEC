import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

export default function WlatDirectory() {
  const events = trpc.wlat.publicEvents.useQuery();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Public throwdowns</h1>
      <div className="space-y-3">
        {(events.data ?? []).map((event) => (
          <Link key={event.id} to={`/throwdown/e/${event.slug}`} className="block rounded-xl border border-[#3a2a1f] p-4 hover:border-cinnamon-600/50">
            <div className="font-semibold">{event.name}</div>
            <div className="text-sm text-sand-500">{event.status} · {event.format} · {event.city}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
