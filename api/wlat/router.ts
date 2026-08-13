import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicQuery, wlatAuthed } from "../middleware";
import { WlatError } from "./domain/errors";
import { getEngine } from "./instance";
import { seedWlatDemos } from "./seed";
import type { Actor } from "./engine";
import type { TrpcContext } from "../context";
import { getStore } from "./store/memory";
import { serializeWlatCookie, signWlatSession } from "./session";
import { LICENCE_LINE } from "./domain/payments";
import type { EventRole, HeatState, RestartReasonType, TimerPhase } from "./domain/types";

function toTrpc(err: unknown): never {
  if (err instanceof WlatError) {
    const code =
      err.httpStatus === 401
        ? "UNAUTHORIZED"
        : err.httpStatus === 403
          ? "FORBIDDEN"
          : err.httpStatus === 404
            ? "NOT_FOUND"
            : err.httpStatus === 409
              ? "CONFLICT"
              : "BAD_REQUEST";
    throw new TRPCError({ code, message: err.publicMessage });
  }
  throw err;
}

function actorFrom(ctx: TrpcContext): Actor {
  const engine = getEngine();
  if (ctx.wlatMember) {
    const adminEmail = (process.env.WLAT_ADMIN_EMAIL || "platform@wlat.demo").toLowerCase();
    return {
      member: ctx.wlatMember,
      isPlatformAdmin: ctx.user?.role === "admin" || ctx.wlatMember.emailNormalized === adminEmail,
      requestId: ctx.req.headers.get("x-request-id") || "req",
      sessionFingerprint: ctx.req.headers.get("user-agent")?.slice(0, 120) ?? undefined,
      mappingReauthedAt: ctx.wlatMember.lastIdentitySyncAt,
    };
  }
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  const member = engine.upsertMember({
    provider: "kimi",
    subject: ctx.user.unionId,
    email: ctx.user.email,
    name: ctx.user.name,
    avatarUrl: ctx.user.avatar,
    authUserId: ctx.user.id,
  });
  return {
    member,
    isPlatformAdmin: ctx.user.role === "admin",
    requestId: ctx.req.headers.get("x-request-id") || "req",
    sessionFingerprint: ctx.req.headers.get("user-agent")?.slice(0, 120) ?? undefined,
    mappingReauthedAt: member.lastIdentitySyncAt,
  };
}

const roleEnum = z.enum([
  "lead_organiser",
  "co_organiser",
  "event_staff",
  "blind_steward",
  "competitor",
  "coach",
  "team_member",
  "judge",
  "tiebreak_judge",
  "shot_barista",
  "online_member_voter",
  "platform_admin",
]);

export const wlatRouter = createRouter({
  health: publicQuery.query(() => ({
    ok: true,
    product: "World Latte Art Throwdown",
    licence: LICENCE_LINE,
  })),

  seedDemos: publicQuery.mutation(async () => seedWlatDemos()),

  publicEvents: publicQuery.query(() => getEngine().listPublicEvents()),

  publicEvent: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      try {
        return getEngine().publicEventDto(input.slug);
      } catch (err) {
        toTrpc(err);
      }
    }),

  memberArchive: publicQuery
    .input(z.object({ memberId: z.string() }))
    .query(({ input }) => {
      try {
        return getEngine().memberArchive(input.memberId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  me: wlatAuthed.query(({ ctx }) => {
    const actor = actorFrom(ctx);
    return { member: actor.member, isPlatformAdmin: actor.isPlatformAdmin };
  }),

  updateProfile: wlatAuthed
    .input(
      z.object({
        displayName: z.string().min(2).optional(),
        givenName: z.string().optional(),
        familyName: z.string().optional(),
        countryCode: z.string().optional(),
        city: z.string().optional(),
        preferredLanguage: z.string().optional(),
        publicBio: z.string().optional(),
        affiliationName: z.string().optional(),
        publicProfileConsent: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => getEngine().updateProfile(actorFrom(ctx), input)),

  lookupMembers: wlatAuthed
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => getEngine().lookupMembers(actorFrom(ctx), input.query)),

  myEvents: wlatAuthed.query(({ ctx }) => {
    const actor = actorFrom(ctx);
    const store = getStore();
    const ids = new Set(
      [...store.roles.values()]
        .filter((r) => r.memberId === actor.member.id && r.status === "accepted")
        .map((r) => r.eventId),
    );
    for (const event of store.events.values()) {
      if (event.ownerMemberId === actor.member.id) ids.add(event.id);
    }
    return [...ids].map((id) => {
      const event = store.events.get(id)!;
      const roles = store.eventRoles(id, actor.member.id).map((r) => r.role);
      return {
        id: event.id,
        name: event.name,
        slug: event.slug,
        status: event.status,
        roles,
        owner: event.ownerMemberId === actor.member.id,
      };
    });
  }),

  createEvent: wlatAuthed
    .input(z.object({ name: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().createDraftEvent(actorFrom(ctx), input);
      } catch (err) {
        toTrpc(err);
      }
    }),

  saveWizard: wlatAuthed
    .input(z.object({ eventId: z.string(), patch: z.record(z.string(), z.unknown()) }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().saveWizard(actorFrom(ctx), input.eventId, input.patch as never);
      } catch (err) {
        toTrpc(err);
      }
    }),

  setupWarnings: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      const actor = actorFrom(ctx);
      getEngine().assertOrganiser(actor, getEngine().getEvent(input.eventId));
      return getEngine().setupWarnings(input.eventId);
    }),

  organiserOverview: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      try {
        return getEngine().organiserOverview(actorFrom(ctx), input.eventId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  invite: wlatAuthed
    .input(
      z.object({
        eventId: z.string(),
        email: z.string().email(),
        role: roleEnum,
        entryId: z.string().nullable().optional(),
        memberId: z.string().nullable().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        const result = getEngine().invite(actorFrom(ctx), { ...input, role: input.role as EventRole });
        return { invitationId: result.invitation.id, token: result.token, expiresAt: result.invitation.expiresAt };
      } catch (err) {
        toTrpc(err);
      }
    }),

  assignRole: wlatAuthed
    .input(z.object({ eventId: z.string(), memberId: z.string(), role: roleEnum }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().assignRole(actorFrom(ctx), { ...input, role: input.role as EventRole });
      } catch (err) {
        toTrpc(err);
      }
    }),

  acceptInvite: wlatAuthed
    .input(z.object({ token: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().acceptInvite(actorFrom(ctx), input.token);
      } catch (err) {
        toTrpc(err);
      }
    }),

  addEntry: wlatAuthed
    .input(
      z.object({
        eventId: z.string(),
        displayName: z.string().min(2),
        memberIds: z.array(z.string()),
        coachMemberId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().addEntry(actorFrom(ctx), input.eventId, input.displayName, input.memberIds, input.coachMemberId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  checkIn: wlatAuthed
    .input(z.object({ eventId: z.string(), entryId: z.string() }))
    .mutation(({ ctx, input }) => getEngine().checkInEntry(actorFrom(ctx), input.eventId, input.entryId)),

  acknowledgeRules: wlatAuthed
    .input(z.object({ eventId: z.string(), entryId: z.string() }))
    .mutation(({ ctx, input }) => getEngine().acknowledgeRules(actorFrom(ctx), input.eventId, input.entryId)),

  lockRoster: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().lockRoster(actorFrom(ctx), input.eventId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  generateBracket: wlatAuthed
    .input(
      z.object({
        eventId: z.string(),
        method: z.enum(["random", "manual", "imported"]),
        manualOrder: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().generateBracket(actorFrom(ctx), input.eventId, input.method, input.manualOrder);
      } catch (err) {
        toTrpc(err);
      }
    }),

  submitPattern: wlatAuthed
    .input(z.object({ eventId: z.string(), title: z.string(), description: z.string().optional(), storagePath: z.string(), hash: z.string() }))
    .mutation(({ ctx, input }) => getEngine().submitPattern(actorFrom(ctx), input.eventId, input)),

  approvePattern: wlatAuthed
    .input(z.object({ patternId: z.string() }))
    .mutation(({ ctx, input }) => getEngine().approvePattern(actorFrom(ctx), input.patternId)),

  startHeat: wlatAuthed
    .input(z.object({ heatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await getEngine().startHeat(actorFrom(ctx), input.heatId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  transitionHeat: wlatAuthed
    .input(z.object({ heatId: z.string(), to: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().transitionHeat(actorFrom(ctx), input.heatId, input.to as HeatState);
      } catch (err) {
        toTrpc(err);
      }
    }),

  operateTimer: wlatAuthed
    .input(
      z.object({
        heatId: z.string(),
        action: z.enum(["start", "pause", "resume", "finish"]),
        phase: z.enum(["prep", "competition", "photography", "judging", "cleanup", "transition"]),
        version: z.number(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await getEngine().operateTimer(
          actorFrom(ctx),
          input.heatId,
          input.action,
          input.phase as TimerPhase,
          input.version,
          input.reason,
        );
      } catch (err) {
        toTrpc(err);
      }
    }),

  timer: publicQuery
    .input(z.object({ heatId: z.string() }))
    .query(({ input }) => getEngine().timerDisplay(input.heatId)),

  revealMapping: wlatAuthed
    .input(z.object({ heatId: z.string(), reason: z.string().min(4) }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().revealMapping(actorFrom(ctx), input.heatId, input.reason);
      } catch (err) {
        toTrpc(err);
      }
    }),

  reportBreach: wlatAuthed
    .input(z.object({ heatId: z.string(), description: z.string().min(12) }))
    .mutation(({ ctx, input }) => getEngine().reportBreach(actorFrom(ctx), input.heatId, input.description)),

  beginPhotoUpload: wlatAuthed
    .input(
      z.object({
        heatId: z.string(),
        entryId: z.string(),
        filename: z.string(),
        mimeType: z.string(),
        byteLength: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().beginPhotoUpload(
          actorFrom(ctx),
          input.heatId,
          input.entryId,
          input.filename,
          input.mimeType,
          input.byteLength,
        );
      } catch (err) {
        toTrpc(err);
      }
    }),

  judgeBallot: wlatAuthed
    .input(z.object({ heatId: z.string() }))
    .query(({ ctx, input }) => {
      try {
        return getEngine().judgeBallotDto(actorFrom(ctx), input.heatId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  submitBallot: wlatAuthed
    .input(
      z.object({
        heatId: z.string(),
        roundId: z.string(),
        choice: z.enum(["A", "B"]),
        feedback: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().submitBallot(actorFrom(ctx), input);
      } catch (err) {
        toTrpc(err);
      }
    }),

  finalizeHeat: wlatAuthed
    .input(z.object({ heatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await getEngine().finalizeHeat(actorFrom(ctx), input.heatId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  restartHeat: wlatAuthed
    .input(
      z.object({
        heatId: z.string(),
        reason: z.string(),
        notes: z.string(),
        patternInvalid: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().restartHeat(
          actorFrom(ctx),
          input.heatId,
          input.reason as RestartReasonType,
          input.notes,
          input.patternInvalid,
        );
      } catch (err) {
        toTrpc(err);
      }
    }),

  completeEvent: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        return getEngine().completeEvent(actorFrom(ctx), input.eventId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  competitorHeat: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => getEngine().competitorHeatDto(actorFrom(ctx), input.eventId)),

  liveBallot: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      const lock = getStore().locks.get(input.eventId);
      if (!lock?.activeHeatId) return null;
      try {
        return getEngine().judgeBallotDto(actorFrom(ctx), lock.activeHeatId);
      } catch {
        return null;
      }
    }),

  privateFeedback: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      try {
        return getEngine().privateFeedback(actorFrom(ctx), input.eventId);
      } catch (err) {
        toTrpc(err);
      }
    }),

  shotQueue: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => getEngine().shotQueue(actorFrom(ctx), input.eventId)),

  updateShot: wlatAuthed
    .input(z.object({ shotId: z.string(), status: z.enum(["queued", "ready", "delivered", "remade", "failed"]) }))
    .mutation(({ ctx, input }) => getEngine().updateShot(actorFrom(ctx), input.shotId, input.status)),

  createCheckout: wlatAuthed
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const actor = actorFrom(ctx);
      const engine = getEngine();
      const event = engine.getEvent(input.eventId);
      engine.assertOrganiser(actor, event);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const { stripe, isStripeEnabled } = await import("../lib/stripe");
      if (!isStripeEnabled() || !stripe) {
        const sessionId = `mock_wlat_${event.id}`;
        engine.markCheckoutCreated(event.id, sessionId);
        engine.applyPaymentWebhook({
          providerEventId: `mock_${sessionId}`,
          eventType: "checkout.session.completed",
          payloadHash: sessionId,
          checkoutSessionId: sessionId,
          sessionStatus: "complete",
        });
        return {
          url: `${frontendUrl}/throwdown/organise/${event.id}?paid=mock`,
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
              currency: LICENCE_LINE.currency.toLowerCase(),
              unit_amount: LICENCE_LINE.amountMinor,
              product_data: { name: LICENCE_LINE.name, description: LICENCE_LINE.description },
            },
            quantity: 1,
          },
        ],
        success_url: `${frontendUrl}/throwdown/organise/${event.id}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/throwdown/organise/${event.id}?checkout=cancelled`,
        metadata: { product: "wlat_licence", eventId: event.id },
      });
      engine.markCheckoutCreated(event.id, session.id);
      return { url: session.url, sessionId: session.id, isMock: false };
    }),

  platformSummary: wlatAuthed.query(({ ctx }) => getEngine().platformSummary(actorFrom(ctx))),

  refund: wlatAuthed
    .input(z.object({ eventId: z.string(), amountMinor: z.number().positive(), reason: z.string().min(8) }))
    .mutation(({ ctx, input }) =>
      getEngine().adminRefund(actorFrom(ctx), input.eventId, input.amountMinor, input.reason),
    ),

  manualOverride: wlatAuthed
    .input(z.object({ heatId: z.string(), winnerEntryId: z.string(), reason: z.string().min(12) }))
    .mutation(({ ctx, input }) =>
      getEngine().manualOverride(actorFrom(ctx), input.heatId, input.winnerEntryId, input.reason),
    ),

  requestMagicLink: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input }) => {
      const { token, expiresAt } = getEngine().createMagicLink(input.email);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const url = `${frontendUrl}/throwdown/auth/callback?token=${token}`;
      console.log(`\nWLAT magic link for ${input.email}: ${url}\n`);
      return { sent: true, expiresAt, devUrl: process.env.NODE_ENV === "production" ? undefined : url };
    }),

  consumeMagicLink: publicQuery
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = getEngine().consumeMagicLink(input.token);
      const token = await signWlatSession(member.id);
      ctx.resHeaders.append("set-cookie", serializeWlatCookie(token, ctx.req.headers));
      return { memberId: member.id, displayName: member.displayName };
    }),

  devLogin: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const enabled = process.env.WLAT_DEV_AUTH === "true" || process.env.NODE_ENV !== "production";
      const member = getEngine().devLogin(input.email, enabled);
      const token = await signWlatSession(member.id);
      ctx.resHeaders.append("set-cookie", serializeWlatCookie(token, ctx.req.headers));
      return { memberId: member.id, displayName: member.displayName, email: member.emailNormalized };
    }),
});
