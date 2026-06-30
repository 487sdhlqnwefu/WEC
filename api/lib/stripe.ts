import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey || secretKey.includes("your_stripe_secret_key")) {
  console.warn("⚠️ STRIPE_SECRET_KEY not configured. Stripe payments will use mock mode.");
}

export const stripe = secretKey && !secretKey.includes("your_stripe_secret_key")
  ? new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" })
  : null;

export function isStripeEnabled(): boolean {
  return !!stripe;
}
