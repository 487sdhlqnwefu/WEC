import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "../middleware";
import { ThrowdownError } from "./errors";
import { runThrowdown } from "./runtime";
import { clearThrowdownCookie, setThrowdownCookie, signThrowdownToken } from "./session";
import type { Actor } from "./engine";
import type { TrpcContext } from "../context";
import { stripe, isStripeEnabled } from "../lib/stripe";
import { PREMIUM_CURRENCY, PREMIUM_PRICE_CENTS } from "@throwdown/constants";
import { ALLOWED_IMAGE_MIMES, MAX_LOGO_BYTES } from "@throwdown/constants";

const hits = new Map<string, number[]>();

function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before trying again." });
  }
  arr.push(now);
  hits.set(key, arr);
}

function mapError(err: unknown): never {
  if (err instanceof ThrowdownError) {
    const code =
      err.code === "UNAUTHORIZED"
        ? "UNAUTHORIZED"
        : err.code === "FORBIDDEN"
          ? "FORBIDDEN"
          : err.code === "NOT_FOUND"
            ? "NOT_FOUND"
            : err.code === "CONFLICT"
              ? "CONFLICT"
              : "BAD_REQUEST";
    throw new TRPCError({ code, message: err.message });
  }
  throw err;
}

function actorFrom(ctx: TrpcContext): Actor {
  if (!ctx.throwdownProfile) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in to continue." });
  }
  return {
    profile: {
      ...ctx.throwdownProfile,
      isPlatformAdmin: ctx.throwdownProfile.isPlatformAdmin || ctx.user?.role === "admin",
    },
  };
}

const recipeInput = z.object({
  doseGrams: z.number(),
  yieldGrams: z.number(),
  extractionTimeSeconds: z.number(),
  waterTempC: z.number().nullable().optional(),
  grindSetting: z.string().nullable().optional(),
  preInfusionSeconds: z.number().nullable().optional(),
  pressureOrFlow: z.string().nullable().optional(),
  basket: z.string().nullable().optional(),
  distribution: z.string().nullable().optional(),
  tampingNotes: z.string().nullable().optional(),
  tds: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const throwdownRouter = createRouter({
  config: publicQuery.query(() =>
    runThrowdown((e) => Promise.resolve(e.getConfig())).catch(mapError),
  ),

  requestOtp: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      rateLimit(`otp:${input.email}:${ctx.req.headers.get("x-forwarded-for") ?? "ip"}`, 5, 15 * 60_000);
      return runThrowdown((e) => e.requestOtp(input.email)).catch(mapError);
    }),

  verifyOtp: publicQuery
    .input(z.object({ email: z.string().email(), code: z.string().min(4).max(8) }))
    .mutation(async ({ input, ctx }) => {
      rateLimit(`otp-verify:${input.email}`, 10, 15 * 60_000);
      const profile = await runThrowdown((e) => e.verifyOtp(input.email, input.code)).catch(mapError);
      const token = await signThrowdownToken(profile.id);
      setThrowdownCookie(ctx.req.headers, ctx.resHeaders, token);
      return { profile };
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    clearThrowdownCookie(ctx.req.headers, ctx.resHeaders);
    return { success: true };
  }),

  me: publicQuery.query(({ ctx }) => ctx.throwdownProfile ?? null),

  updateProfile: publicQuery
    .input(
      z.object({
        displayName: z.string().min(2).optional(),
        country: z.string().optional(),
        city: z.string().nullable().optional(),
        photoUrl: z.string().nullable().optional(),
        organisation: z.string().nullable().optional(),
        roleTitle: z.string().nullable().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.updateProfile(actorFrom(ctx), input)).catch(mapError),
    ),

  createEvent: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        hostName: z.string().min(2),
        hostLogoUrl: z.string().nullable().optional(),
        startsAt: z.date().nullable().optional(),
        timezone: z.string(),
        venue: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        coffeeName: z.string().min(1),
        coffeeType: z.enum(["blend", "single_origin"]),
        coffeeNotes: z.string().nullable().optional(),
        espressoMachine: z.string().nullable().optional(),
        grinder: z.string().nullable().optional(),
        basket: z.string().nullable().optional(),
        waterSpec: z.string().nullable().optional(),
        otherControls: z.string().nullable().optional(),
        tier: z.enum(["free", "premium"]),
        judgingFormat: z.enum(["wec_v3", "simple_ab"]),
        judgeCount: z.number().int(),
      }),
    )
    .mutation(({ ctx, input }) => runThrowdown((e) => e.createEvent(actorFrom(ctx), input)).catch(mapError)),

  updateEvent: publicQuery
    .input(z.object({ eventId: z.string(), patch: z.record(z.string(), z.unknown()) }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.updateEvent(actorFrom(ctx), input.eventId, input.patch as never)).catch(mapError),
    ),

  myEvents: publicQuery.query(({ ctx }) =>
    runThrowdown((e) => e.listMyEvents(actorFrom(ctx))).catch(mapError),
  ),

  myAssignments: publicQuery.query(({ ctx }) =>
    runThrowdown((e) => e.myAssignments(actorFrom(ctx))).catch(mapError),
  ),

  dashboard: publicQuery
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) =>
      runThrowdown((e) => e.getOrganiserDashboard(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  addCompetitor: publicQuery
    .input(z.object({ eventId: z.string(), profileId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.addCompetitor(actorFrom(ctx), input.eventId, input.profileId)).catch(mapError),
    ),

  addJudgeToPool: publicQuery
    .input(z.object({ eventId: z.string(), profileId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.addJudgeToPool(actorFrom(ctx), input.eventId, input.profileId)).catch(mapError),
    ),

  setCupSteward: publicQuery
    .input(z.object({ eventId: z.string(), profileId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.setCupSteward(actorFrom(ctx), input.eventId, input.profileId)).catch(mapError),
    ),

  invite: publicQuery
    .input(
      z.object({
        eventId: z.string(),
        email: z.string().email(),
        role: z.enum(["cup_steward", "competitor", "judge"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      rateLimit(`invite:${input.eventId}`, 30, 60_000);
      return runThrowdown((e) =>
        e.createInvitation(actorFrom(ctx), input.eventId, input.email, input.role),
      ).catch(mapError);
    }),

  revokeInvite: publicQuery
    .input(z.object({ invitationId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.revokeInvitation(actorFrom(ctx), input.invitationId)).catch(mapError),
    ),

  previewInvite: publicQuery
    .input(z.object({ token: z.string() }))
    .query(({ input }) => runThrowdown((e) => e.previewInvitation(input.token)).catch(mapError)),

  acceptInvite: publicQuery
    .input(z.object({ token: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.acceptInvitation(actorFrom(ctx), input.token)).catch(mapError),
    ),

  publish: publicQuery
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.publishEvent(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  lockRoster: publicQuery
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.lockRoster(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  setSeeds: publicQuery
    .input(
      z.object({
        eventId: z.string(),
        seeds: z.array(z.object({ entryId: z.string(), seed: z.number() })),
      }),
    )
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.setSeeds(actorFrom(ctx), input.eventId, input.seeds)).catch(mapError),
    ),

  generateBracket: publicQuery
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.generateBracket(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  assignJudges: publicQuery
    .input(z.object({ heatId: z.string(), profileIds: z.array(z.string()) }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.assignJudges(actorFrom(ctx), input.heatId, input.profileIds)).catch(mapError),
    ),

  stageHeat: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.stageHeat(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  confirmCodes: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.confirmCupCodes(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  stewardView: publicQuery
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) =>
      runThrowdown((e) => e.getStewardView(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  startHeat: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.startHeat(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  markBrewingComplete: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.markBrewingComplete(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  openJudging: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.openJudging(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  judgeBallot: publicQuery
    .input(z.object({ heatId: z.string() }))
    .query(({ ctx, input }) =>
      runThrowdown((e) => e.getJudgeBallot(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  submitBallot: publicQuery
    .input(
      z.object({
        heatId: z.string(),
        tactile: z.string().optional(),
        taste: z.string().optional(),
        flavour: z.string().optional(),
        choice: z.string().optional(),
        idempotencyKey: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      rateLimit(`ballot:${input.heatId}:${ctx.throwdownProfile?.id ?? "anon"}`, 8, 60_000);
      return runThrowdown((e) => e.submitBallot(actorFrom(ctx), input.heatId, input)).catch(mapError);
    }),

  revealResult: publicQuery
    .input(z.object({ heatId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.revealResult(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  competitorRecipe: publicQuery
    .input(z.object({ heatId: z.string() }))
    .query(({ ctx, input }) =>
      runThrowdown((e) => e.getRecipeForCompetitor(actorFrom(ctx), input.heatId)).catch(mapError),
    ),

  submitRecipe: publicQuery
    .input(z.object({ heatId: z.string() }).and(recipeInput))
    .mutation(({ ctx, input }) => {
      const { heatId, ...recipe } = input;
      return runThrowdown((e) => e.submitRecipe(actorFrom(ctx), heatId, recipe)).catch(mapError);
    }),

  requestRecipeCorrection: publicQuery
    .input(z.object({ recipeId: z.string(), note: z.string().min(8) }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.requestRecipeCorrection(actorFrom(ctx), input.recipeId, input.note)).catch(mapError),
    ),

  voidHeat: publicQuery
    .input(z.object({ heatId: z.string(), reason: z.string().min(8) }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.voidHeat(actorFrom(ctx), input.heatId, input.reason)).catch(mapError),
    ),

  completeEvent: publicQuery
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.completeEvent(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  publicEvent: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => runThrowdown((e) => e.getPublicEvent(input.slug)).catch(mapError)),

  auditLog: publicQuery
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) =>
      runThrowdown((e) => e.getAuditLog(actorFrom(ctx), input.eventId)).catch(mapError),
    ),

  adminEvents: publicQuery.query(({ ctx }) =>
    runThrowdown((e) => e.listAdminEvents(actorFrom(ctx))).catch(mapError),
  ),

  grantComplimentary: publicQuery
    .input(z.object({ eventId: z.string(), reason: z.string().min(8) }))
    .mutation(({ ctx, input }) =>
      runThrowdown((e) => e.grantComplimentary(actorFrom(ctx), input.eventId, input.reason)).catch(mapError),
    ),

  createCheckout: publicQuery
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      rateLimit(`pay:${input.eventId}`, 8, 60_000);
      const actor = actorFrom(ctx);
      const frontend = process.env.THROWDOWN_PUBLIC_URL || process.env.FRONTEND_URL || "http://localhost:3000";
      const base = frontend.replace(/\/throwdown\/?$/, "");
      if (!isStripeEnabled() || !stripe) {
        if (process.env.NODE_ENV === "production") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Stripe is not configured. Premium licences cannot be charged in this environment.",
          });
        }
        const sessionId = `mock_throwdown_${input.eventId}_${Date.now()}`;
        await runThrowdown((e) => e.recordCheckoutSession(actor, input.eventId, sessionId, PREMIUM_PRICE_CENTS));
        return {
          url: `${base}/throwdown/events/${input.eventId}/pay?pending=1`,
          sessionId,
          isMock: true,
        };
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: PREMIUM_CURRENCY,
              product_data: {
                name: "Premium Espresso Tournament licence",
                description: "One-time USD 300 licence for this tournament only. Not a subscription.",
              },
              unit_amount: PREMIUM_PRICE_CENTS,
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/throwdown/events/${input.eventId}/pay?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/throwdown/events/${input.eventId}/pay?cancelled=1`,
        metadata: { eventId: input.eventId, product: "throwdown_premium" },
      });
      await runThrowdown((e) =>
        e.recordCheckoutSession(actor, input.eventId, session.id, PREMIUM_PRICE_CENTS),
      );
      return { url: session.url, sessionId: session.id, isMock: false };
    }),

  paymentStatus: publicQuery
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const dash = await runThrowdown((e) => e.getOrganiserDashboard(actorFrom(ctx), input.eventId)).catch(mapError);
      return {
        licence: dash.licence,
        redirectDoesNotUnlock: true,
        message:
          dash.licence?.status === "paid" || dash.licence?.status === "complimentary"
            ? "Licence confirmed."
            : "Payment is confirmed only after the verified Stripe webhook arrives — not from the checkout return URL.",
      };
    }),

  validateLogo: publicQuery
    .input(z.object({ mime: z.string(), size: z.number() }))
    .mutation(({ input }) => {
      if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(input.mime)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Use a PNG, JPEG, or WebP logo." });
      }
      if (input.size > MAX_LOGO_BYTES) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Logos must be 2 MB or smaller." });
      }
      return { ok: true };
    }),
});
