import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function WlatFeedback() {
  const { eventId } = useParams();
  const data = trpc.wlat.privateFeedback.useQuery({ eventId: eventId || "" }, { enabled: Boolean(eventId), retry: false });
  if (data.isError) {
    return <div className="p-10 text-sand-400">{data.error.message}</div>;
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Private anonymised feedback</h1>
      {(data.data ?? []).map((heat) => (
        <section key={heat.heatNumber} className="mb-6 rounded-xl border border-[#3a2a1f] p-4">
          <h2 className="font-semibold">Heat {heat.heatNumber} · {heat.outcome}</h2>
          <ul className="mt-2 space-y-2 text-sm text-sand-300">
            {heat.feedback.map((row, i) => (
              <li key={i}>{row.preferredYou ? "Preferred your entry: " : "Preferred the other entry: "}{row.text}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
