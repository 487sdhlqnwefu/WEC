import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WlatCreate() {
  const [name, setName] = useState("World Latte Art Throwdown");
  const create = trpc.wlat.createEvent.useMutation();
  const navigate = useNavigate();
  const me = trpc.wlat.me.useQuery();

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Create a throwdown</h1>
      <p className="text-sand-400 mb-6">
        USD 300 per tournament. Payment is confirmed by Stripe webhook, never by the success URL alone.
        v1 is one station and one active heat.
      </p>
      {me.isError && (
        <p className="mb-4 text-sm">
          <Link to="/throwdown/login?next=/throwdown/create" className="text-cinnamon-300">
            Sign in
          </Link>{" "}
          with a free WEC member profile first.
        </p>
      )}
      <label htmlFor="name" className="text-sm">Event name</label>
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 mb-4 bg-[#1b140f] border-[#3a2a1f]"
      />
      <Button
        className="bg-cinnamon-600"
        disabled={create.isPending || me.isError}
        onClick={async () => {
          const event = await create.mutateAsync({ name });
          navigate(`/throwdown/organise/${event.id}`);
        }}
      >
        Create draft event
      </Button>
    </div>
  );
}
