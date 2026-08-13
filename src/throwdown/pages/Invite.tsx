import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InviteAccept() {
  const { token = "" } = useParams();
  const { data: me } = trpc.throwdown.me.useQuery();
  const { data, error, isLoading } = trpc.throwdown.previewInvite.useQuery({ token });
  const accept = trpc.throwdown.acceptInvite.useMutation({
    onSuccess: () => toast.success("Invitation accepted"),
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <p className="p-8">Checking invitation…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Invitation expired or invalid</h1>
        <p className="mt-3 text-sand-400">{error.message}</p>
        <Button asChild className="mt-6 bg-cinnamon-600"><Link to="/throwdown">Espresso Throwdown</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">You're invited</h1>
      <p className="mt-3 text-sand-300">
        {data?.eventName} · {data?.role.replace("_", " ")}
      </p>
      <p className="mt-2 text-sm text-sand-500">Invited email: {data?.email}</p>
      {!me ? (
        <Button asChild className="mt-8 bg-cinnamon-600 text-sand-100">
          <Link to="/throwdown/sign-in">Sign in to accept</Link>
        </Button>
      ) : (
        <Button className="mt-8 bg-cinnamon-600 text-sand-100" disabled={accept.isPending} onClick={() => accept.mutate({ token })}>
          {accept.isPending ? "Accepting…" : "Accept this role"}
        </Button>
      )}
      {accept.isSuccess && (
        <Button asChild variant="outline" className="mt-4">
          <Link to="/throwdown/dashboard">Go to my events</Link>
        </Button>
      )}
    </div>
  );
}
