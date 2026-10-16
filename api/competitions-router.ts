import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  PILLARS,
  SPONSORED_EVENT_FEE_USD,
  isValidPillarScore,
  rankTeams,
  weightedTotal,
} from "@contracts/baristaLeagueScoring";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import {
  createEvent,
  getEventBySlug,
  judgesFor,
  listEvents,
  markSponsorFeePaid,
  memberPublic,
  publishEvent,
  registerTeam,
  scorecardsFor,
  teamsFor,
  upsertScore,
  volunteerJudge,
} from "./platform/store";

const pillarScores = z.object({
  concept: z.number(),
  service: z.number(),
  product: z.number(),
});

function assertScores(scores: { concept: number; service: number; product: number }) {
  for (const pillar of PILLARS) {
    if (!isValidPillarScore(scores[pillar])) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `${pillar} must be 0–10 in half-point steps`,
      });
    }
  }
}

async function eventPayload(slug: string, viewerId?: number) {
  const event = await getEventBySlug(slug);
  if (!event) return null;
  const [teams, judges, cards, host] = await Promise.all([
    teamsFor(event.id),
    judgesFor(event.id),
    scorecardsFor(event.id),
    memberPublic(event.hostUserId),
  ]);

  const isHost = viewerId === event.hostUserId;
  const isJudge = judges.some((j) => j.userId === viewerId);
  const resultsVisible =
    event.kind === "community" || event.sponsorFeePaid || isHost || isJudge;

  const standings = rankTeams(
    teams.map((t) => t.id),
    cards.map((c) => ({ teamId: c.teamId, scores: c.scores })),
  );

  const publicCards = resultsVisible
    ? cards.map((c) => {
        const scored = weightedTotal(c.scores);
        const judge = judges.find((j) => j.userId === c.judgeUserId);
        return {
          id: c.id,
          teamId: c.teamId,
          judgeName: judge?.displayName ?? "Judge",
          judgeUserId: c.judgeUserId,
          scores: c.scores,
          total: scored.total,
          breakdown: scored.breakdown,
          notes: c.notes,
          submittedAt: c.submittedAt,
        };
      })
    : [];

  return {
    event: {
      ...event,
      hostName: host?.name ?? "Host",
      sponsorFeeUsd: event.kind === "sponsored" ? SPONSORED_EVENT_FEE_USD : 0,
    },
    teams,
    judges: judges.map((j) => ({
      id: j.id,
      userId: j.userId,
      displayName: j.displayName,
    })),
    standings: resultsVisible ? standings : [],
    scorecards: publicCards,
    resultsVisible,
    viewer: {
      isHost,
      isJudge,
    },
    feeMessage:
      event.kind === "sponsored" && !event.sponsorFeePaid
        ? `Sponsored events pay a $${SPONSORED_EVENT_FEE_USD} software fee before public results publish. Community events stay free.`
        : null,
  };
}

export const competitionsRouter = createRouter({
  list: publicQuery.query(async () => {
    const events = await listEvents();
    return events.map((event) => ({
      slug: event.slug,
      name: event.name,
      location: event.location,
      date: event.date,
      kind: event.kind,
      status: event.status,
      formatId: event.formatId,
    }));
  }),

  get: publicQuery
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return eventPayload(input.slug, ctx.user?.id);
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(3).max(160),
        location: z.string().min(2).max(160),
        date: z.string().min(4).max(40),
        description: z.string().max(2000).default(""),
        kind: z.enum(["community", "sponsored"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return createEvent({ ...input, hostUserId: ctx.user.id });
    }),

  registerTeam: authedQuery
    .input(
      z.object({
        slug: z.string(),
        name: z.string().min(2).max(120),
        members: z.string().min(2).max(200),
        city: z.string().min(2).max(120),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const event = await getEventBySlug(input.slug);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      try {
        return await registerTeam({
          eventId: event.id,
          name: input.name,
          members: input.members,
          city: input.city,
          registeredByUserId: ctx.user.id,
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Could not register",
        });
      }
    }),

  volunteerJudge: authedQuery
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const event = await getEventBySlug(input.slug);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      try {
        return await volunteerJudge({
          eventId: event.id,
          userId: ctx.user.id,
          displayName: ctx.user.name || ctx.user.email || "Judge",
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Could not join as judge",
        });
      }
    }),

  submitScore: authedQuery
    .input(
      z.object({
        slug: z.string(),
        teamId: z.string(),
        scores: pillarScores,
        notes: z.string().max(1000).default(""),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      assertScores(input.scores);
      const event = await getEventBySlug(input.slug);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      try {
        const card = await upsertScore({
          eventId: event.id,
          teamId: input.teamId,
          judgeUserId: ctx.user.id,
          scores: input.scores,
          notes: input.notes,
        });
        return { ...card, total: weightedTotal(card.scores).total };
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error instanceof Error ? error.message : "Could not save score",
        });
      }
    }),

  publish: authedQuery
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const event = await getEventBySlug(input.slug);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      try {
        return await publishEvent(event.id, ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Could not publish",
        });
      }
    }),

  recordSponsorFee: authedQuery
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const event = await getEventBySlug(input.slug);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      try {
        return await markSponsorFeePaid(event.id, ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Could not record fee",
        });
      }
    }),
});
