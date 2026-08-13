import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ThrowdownAdmin() {
  const { data, error, refetch } = trpc.throwdown.adminEvents.useQuery();
  const grant = trpc.throwdown.grantComplimentary.useMutation({
    onSuccess: () => {
      toast.success("Complimentary access recorded");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const [reason, setReason] = useState("");
  const [eventId, setEventId] = useState("");

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Administrator access required</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">WEC administrator</h1>
      <p className="mt-2 text-sm text-sand-500">
        Platform support for price, flagged events, and complimentary licences. Cup-code mappings are
        not shown here.
      </p>
      <form
        className="mt-8 wec-card space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          grant.mutate({ eventId, reason });
        }}
      >
        <h2 className="font-semibold">Grant complimentary tournament access</h2>
        <Input required placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} className="bg-[#1a1410]" />
        <Input required minLength={8} placeholder="Reason (required, audited)" value={reason} onChange={(e) => setReason(e.target.value)} className="bg-[#1a1410]" />
        <Button type="submit" className="bg-cinnamon-600 text-sand-100">Grant and record</Button>
      </form>
      <ul className="mt-8 space-y-2">
        {data?.map((event) => (
          <li key={event.id} className="wec-card flex justify-between p-4 text-sm">
            <span>
              {event.name} · {event.tier} · {event.status}
              <span className="block text-xs text-sand-500">{event.id}</span>
            </span>
            <Link className="text-cinnamon-300" to={`/throwdown/e/${event.slug}`}>
              Public
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
