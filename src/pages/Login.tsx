import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/providers/trpc";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  if (!kimiAuthUrl || !appID) return null;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const oauthUrl = getOAuthUrl();
  const login = trpc.members.login.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/competitions");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm bg-[#231a14] border-[#3a2a1f]">
        <CardHeader className="text-center">
          <CardTitle>Member sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              const data = new FormData(e.currentTarget);
              login.mutate({
                email: String(data.get("email") || ""),
                password: String(data.get("password") || ""),
              });
            }}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="mt-1" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-cinnamon-600 hover:bg-cinnamon-500"
              disabled={login.isPending}
            >
              Sign in
            </Button>
          </form>
          <p className="text-xs text-sand-500 leading-relaxed">
            Free accounts. Demo host mara@wct.members, judge rachel@wct.members,
            password <span className="text-sand-300">community</span>.
          </p>
          <p className="text-sm text-sand-400 text-center">
            New here?{" "}
            <Link to="/join" className="text-cinnamon-400">
              Create a free member account
            </Link>
          </p>
          {oauthUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = oauthUrl;
              }}
            >
              Sign in with Kimi
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
