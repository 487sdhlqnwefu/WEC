import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, orders, donations } from "../db/schema";
import { eq } from "drizzle-orm";
import { stripe, isStripeEnabled } from "./lib/stripe";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export const stripeRouter = createRouter({
  // Create a checkout session for product purchase
  createCheckoutSession: publicQuery
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const product = await db.select().from(products).where(eq(products.id, input.productId));
      const p = product[0];
      if (!p) throw new Error("Product not found");

      const unitPrice = Math.round(parseFloat(p.price) * 100); // Convert to cents

      // If Stripe is not configured, return mock session
      if (!isStripeEnabled() || !stripe) {
        const mockSessionId = `mock_${Date.now()}_${input.productId}`;
        await db.insert(orders).values({
          email: "pending@checkout.com",
          items: JSON.stringify([{
            productId: input.productId,
            name: p.name,
            price: parseFloat(p.price),
            quantity: input.quantity,
          }]),
          total: (parseFloat(p.price) * input.quantity).toString(),
          stripeSessionId: mockSessionId,
          status: "pending",
        });
        return {
          sessionId: mockSessionId,
          url: `${frontendUrl}/store?success=true&session_id=${mockSessionId}`,
          isMock: true,
        };
      }

      // Create real Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: p.name,
                description: p.description || undefined,
                images: p.imageUrl ? [p.imageUrl] : undefined,
              },
              unit_amount: unitPrice,
            },
            quantity: input.quantity,
          },
        ],
        mode: "payment",
        success_url: `${frontendUrl}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/store?cancelled=true`,
        metadata: {
          productId: input.productId.toString(),
        },
      });

      // Create order record
      await db.insert(orders).values({
        email: "pending@checkout.com",
        items: JSON.stringify([{
          productId: input.productId,
          name: p.name,
          price: parseFloat(p.price),
          quantity: input.quantity,
        }]),
        total: (parseFloat(p.price) * input.quantity).toString(),
        stripeSessionId: session.id,
        status: "pending",
      });

      return {
        sessionId: session.id,
        url: session.url || `${frontendUrl}/store`,
        isMock: false,
      };
    }),

  // Create a donation checkout session
  createDonationSession: publicQuery
    .input(
      z.object({
        amount: z.number().positive(),
        name: z.string(),
        email: z.string().email(),
        tier: z.enum(["supporter", "advocate", "champion", "patron", "one_time"]),
        isRecurring: z.boolean().default(false),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // If Stripe is not configured, return mock session
      if (!isStripeEnabled() || !stripe) {
        const mockSessionId = `mock_donation_${Date.now()}`;
        await db.insert(donations).values({
          name: input.name,
          email: input.email,
          amount: input.amount.toString(),
          tier: input.tier,
          isRecurring: input.isRecurring,
          message: input.message,
          stripeSessionId: mockSessionId,
          status: "pending",
        });
        return {
          sessionId: mockSessionId,
          url: `${frontendUrl}/contact?success=true&session_id=${mockSessionId}`,
          isMock: true,
        };
      }

      const amountInCents = Math.round(input.amount * 100);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `WEC ${input.tier.charAt(0).toUpperCase() + input.tier.slice(1)} Support`,
                description: input.message || `Thank you for supporting WEC!`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${frontendUrl}/contact?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/contact?cancelled=true`,
        customer_email: input.email,
        metadata: {
          type: "donation",
          tier: input.tier,
        },
      });

      // Create donation record
      await db.insert(donations).values({
        name: input.name,
        email: input.email,
        amount: input.amount.toString(),
        tier: input.tier,
        isRecurring: input.isRecurring,
        message: input.message,
        stripeSessionId: session.id,
        status: "pending",
      });

      return {
        sessionId: session.id,
        url: session.url || `${frontendUrl}/contact`,
        isMock: false,
      };
    }),

  // Verify a checkout session (called on success page)
  verifySession: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      if (!isStripeEnabled() || !stripe || input.sessionId.startsWith("mock_")) {
        return { status: "complete", isMock: true };
      }

      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        status: session.payment_status,
        isMock: false,
        customerEmail: session.customer_email,
      };
    }),
});
