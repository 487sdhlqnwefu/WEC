import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WLAT_NAME } from "@/wlat/assets";

export default function WlatLogin() {
  const [email, setEmail] = useState("demo-a-organiser@wlat.demo");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/throwdown/me";
  const magic = trpc.wlat.requestMagicLink.useMutation();
  const dev = trpc.wlat.devLogin.useMutation();
  const seed = trpc.wlat.seedDemos.useMutation();

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-sand-400 mb-8">
        Free WEC member profile required for every active role. {WLAT_NAME} uses a magic link now and is ready for WEC SSO later.
      </p>
      <label className="text-sm text-sand-300" htmlFor="email">Email</label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 mb-4 bg-[#1b140f] border-[#3a2a1f]"
      />
      <div className="flex flex-col gap-2">
        <Button
          className="bg-cinnamon-600"
          onClick={async () => {
            const result = await magic.mutateAsync({ email });
            setMessage(result.devUrl ? `Dev magic link: ${result.devUrl}` : "Check your email for a sign-in link.");
          }}
        >
          Email me a magic link
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await seed.mutateAsync();
            await dev.mutateAsync({ email });
            navigate(next);
          }}
        >
          Local / demo sign-in
        </Button>
      </div>
      {message && <p className="mt-4 text-sm text-sand-300 break-all">{message}</p>}
      <div className="mt-10 text-sm text-sand-500 space-y-2">
        <p>Demo shortcuts (seeds the three demo events, then signs in):</p>
        {[
          ["demo-a-organiser@wlat.demo", "Demo A organiser"],
          ["demo-a-steward@wlat.demo", "Demo A Blind Steward"],
          ["demo-a-judge-0@wlat.demo", "Demo A judge"],
          ["platform@wlat.demo", "Platform Admin"],
        ].map(([value, label]) => (
          <button
            key={value}
            className="block text-left text-cinnamon-300 hover:underline"
            onClick={() => setEmail(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
