import type { Context } from "hono";
import { stripe, isStripeEnabled } from "../lib/stripe";
import { runThrowdown } from "./runtime";

export async function handleThrowdownStripeWebhook(c: Context) {
  if (!isStripeEnabled() || !stripe) {
    return c.json({ error: "Stripe is not configured" }, 503);
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return c.json({ error: "STRIPE_WEBHOOK_SECRET is not configured" }, 503);
  }
  const raw = await c.req.text();
  const signature = c.req.header("stripe-signature");
  if (!signature) return c.json({ error: "Missing stripe-signature" }, 400);
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return c.json({ error: "Invalid signature" }, 400);
  }
  const obj = event.data.object as {
    id?: string;
    metadata?: { eventId?: string; product?: string };
    payment_intent?: string;
  };
  const sessionId = event.type.startsWith("checkout.session") ? obj.id : undefined;
  if (obj.metadata?.product && obj.metadata.product !== "throwdown_premium") {
    return c.json({ received: true, ignored: true });
  }
  if (!sessionId) return c.json({ received: true, ignored: true });
  const result = await runThrowdown((engine) =>
    engine.applyStripeWebhook(event.id, event.type, sessionId, obj.metadata?.eventId),
  );
  return c.json({ received: true, ...result });
}
