import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function WlatAuthCallback() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const consume = trpc.wlat.consumeMagicLink.useMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    void consume.mutateAsync({ token }).then(() => navigate("/throwdown/me"));
    // Intentionally run once when the token is present.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <div className="p-10 text-sand-300">Signing you in…</div>;
}
