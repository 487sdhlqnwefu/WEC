import { Link, useParams, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ThrowdownPay() {
  const { eventId = "" } = useParams();
  const [params] = useSearchParams();
  const { data } = trpc.throwdown.paymentStatus.useQuery({ eventId }, { refetchInterval: 3000 });
  const checkout = trpc.throwdown.createCheckout.useMutation({
    onSuccess: (res) => {
      if (res.url) window.location.href = res.url;
    },
    onError: (err) => toast.error(err.message),
  });
  const pendingRedirect = params.get("session_id") || params.get("pending");

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">Premium Tournament licence</h1>
      <p className="mt-3 text-sand-400">
        USD 300 once for this tournament. This is not a subscription. Payment is confirmed by a
        verified Stripe webhook, not by returning from checkout.
      </p>
      <p className="mt-4 capitalize text-gold">{data?.licence?.status ?? "unpaid"}</p>
      {pendingRedirect && data?.licence?.status !== "paid" && (
        <p className="mt-4 rounded border border-gold/40 p-3 text-sm text-gold">
          Returned from checkout. Waiting for verified payment confirmation…
        </p>
      )}
      {data?.licence?.status !== "paid" && data?.licence?.status !== "complimentary" && (
        <Button className="mt-6 bg-gold text-[#1a1410]" disabled={checkout.isPending} onClick={() => checkout.mutate({ eventId })}>
          {checkout.isPending ? "Opening Stripe…" : "Pay USD 300"}
        </Button>
      )}
      <Button asChild variant="outline" className="mt-4 ml-3">
        <Link to={`/throwdown/events/${eventId}`}>Back to desk</Link>
      </Button>
    </div>
  );
}
