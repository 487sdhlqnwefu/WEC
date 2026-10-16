import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Join() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const signup = trpc.members.signup.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/competitions");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <div className="wec-container py-16 max-w-lg">
      <p className="text-xs tracking-[0.2em] uppercase text-cinnamon-400 mb-3">
        Free member account
      </p>
      <h1 className="text-3xl font-bold text-sand-100 mb-3">Join the software</h1>
      <p className="text-sand-400 mb-8 leading-relaxed">
        Competition software on World Coffee Tournaments is free to use.
        Community events stay free. Sponsored events pay a host fee. People
        first, brands last.
      </p>
      <form
        className="space-y-4 bg-[#231a14] border border-[#3a2a1f] rounded-xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const data = new FormData(e.currentTarget);
          signup.mutate({
            name: String(data.get("name") || ""),
            email: String(data.get("email") || ""),
            password: String(data.get("password") || ""),
          });
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password (8+ characters)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-cinnamon-600 hover:bg-cinnamon-500"
          disabled={signup.isPending}
        >
          Create free account
        </Button>
      </form>
      <p className="text-sm text-sand-500 mt-6">
        Already a member?{" "}
        <Link to="/login" className="text-cinnamon-400 hover:text-cinnamon-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
