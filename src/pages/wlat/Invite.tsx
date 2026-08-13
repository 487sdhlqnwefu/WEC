import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function WlatInvite() {
  const { token } = useParams();
  const accept = trpc.wlat.acceptInvite.useMutation();
  const me = trpc.wlat.me.useQuery();
  const navigate = useNavigate();
  if (me.isError) {
    navigate(`/throwdown/login?next=/throwdown/invite/${token}`);
  }
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Accept invitation</h1>
      <p className="text-sand-400 mb-6">This grants only the invited role for a single event.</p>
      <Button
        className="bg-cinnamon-600"
        onClick={async () => {
          await accept.mutateAsync({ token: token || "" });
          navigate("/throwdown/me");
        }}
      >
        Accept
      </Button>
    </div>
  );
}
