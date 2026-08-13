import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ThrowdownSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const request = trpc.throwdown.requestOtp.useMutation({
    onSuccess: () => {
      setSent(true);
      toast.success("Check your email for a one-time code. In local development it is also logged in the server console.");
    },
    onError: (err) => toast.error(err.message),
  });
  const verify = trpc.throwdown.verifyOtp.useMutation({
    onSuccess: () => navigate("/throwdown/dashboard"),
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-sand-100">Sign in</h1>
      <p className="mt-3 text-sm text-sand-400">
        Espresso Throwdown uses an email one-time code. No password is stored. This member identity
        is designed so WEC single sign-on can replace it later without changing event history.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!sent) request.mutate({ email });
          else verify.mutate({ email, code });
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 bg-[#1a1410]"
          />
        </div>
        {sent && (
          <div>
            <Label htmlFor="code">One-time code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 bg-[#1a1410] tracking-[0.4em]"
            />
          </div>
        )}
        <Button type="submit" className="w-full bg-cinnamon-600 text-sand-100" disabled={request.isPending || verify.isPending}>
          {sent ? (verify.isPending ? "Checking…" : "Verify and continue") : request.isPending ? "Sending…" : "Send code"}
        </Button>
      </form>
    </div>
  );
}
