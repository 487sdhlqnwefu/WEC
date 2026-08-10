import { z } from "zod";
import { eq, and, asc, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  tournaments,
  tournamentCompetitors,
  tournamentJudges,
  tournamentMatches,
  tournamentBallots,
  events,
} from "../db/schema";
import {
  ROUND_NAMES,
  SCORING_VERSION,
  WIN_THRESHOLD,
} from "@contracts/scoring";
import {
  assignBlindCups,
  generateBracket,
  nextRoundSlot,
  scoreMatch,
} from "../contracts/tournamentMath";

const cupSide = z.enum(["A", "B"]);

async function getTournamentOrThrow(slugOrId: { slug?: string; id?: number }) {
  const db = getDb();
  const rows = slugOrId.slug
    ? await db.select().from(tournaments).where(eq(tournaments.slug, slugOrId.slug))
    : await db.select().from(tournaments).where(eq(tournaments.id, slugOrId.id!));
  const tournament = rows[0];
  if (!tournament) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Tournament not found" });
  }
  return tournament;
}

export const tournamentRouter = createRouter({
  /** Public: list tournaments */
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
  }),

  /** Public: full live board for a tournament */
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const tournament = await getTournamentOrThrow({ slug: input.slug });
      const competitors = await db
        .select()
        .from(tournamentCompetitors)
        .where(eq(tournamentCompetitors.tournamentId, tournament.id))
        .orderBy(asc(tournamentCompetitors.seed));
      const matches = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.tournamentId, tournament.id))
        .orderBy(asc(tournamentMatches.round), asc(tournamentMatches.matchNumber));
      const judges = await db
        .select()
        .from(tournamentJudges)
        .where(eq(tournamentJudges.tournamentId, tournament.id));

      const matchIds = matches.map((m) => m.id);
      let ballots: (typeof tournamentBallots.$inferSelect)[] = [];
      if (matchIds.length > 0) {
        // Fetch ballots for all matches in this tournament
        const allBallots = await db.select().from(tournamentBallots);
        ballots = allBallots.filter((b) => matchIds.includes(b.matchId));
      }

      const competitorMap = Object.fromEntries(competitors.map((c) => [c.id, c]));

      return {
        tournament,
        competitors,
        judges,
        matches: matches.map((m) => ({
          ...m,
          roundName: ROUND_NAMES[m.round] ?? `Round ${m.round}`,
          competitorA: m.competitorAId ? competitorMap[m.competitorAId] ?? null : null,
          competitorB: m.competitorBId ? competitorMap[m.competitorBId] ?? null : null,
          winner: m.winnerId ? competitorMap[m.winnerId] ?? null : null,
          ballotCount: ballots.filter((b) => b.matchId === m.id).length,
          submittedJudgeSlots: ballots
            .filter((b) => b.matchId === m.id)
            .map((b) => b.judgeSlot),
        })),
        liveMatch:
          matches.find((m) => m.status === "in_progress") ??
          matches.find((m) => m.status === "ready") ??
          null,
      };
    }),

  /** Public: single match detail — judge view hides competitor identities */
  matchPublic: publicQuery
    .input(z.object({ matchId: z.number(), revealIdentities: z.boolean().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });

      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, match.tournamentId));

      const competitors = await db
        .select()
        .from(tournamentCompetitors)
        .where(eq(tournamentCompetitors.tournamentId, match.tournamentId));
      const map = Object.fromEntries(competitors.map((c) => [c.id, c]));

      const ballots = await db
        .select()
        .from(tournamentBallots)
        .where(eq(tournamentBallots.matchId, match.id))
        .orderBy(asc(tournamentBallots.judgeSlot));

      const reveal = Boolean(input.revealIdentities) || match.status === "completed";

      return {
        tournament,
        match: {
          ...match,
          roundName: ROUND_NAMES[match.round] ?? `Round ${match.round}`,
        },
        // Blind: judges only see Cup A / Cup B until reveal
        cups: reveal
          ? {
              A: match.cupACompetitorId ? map[match.cupACompetitorId] : null,
              B: match.cupBCompetitorId ? map[match.cupBCompetitorId] : null,
            }
          : { A: { label: "Cup A" }, B: { label: "Cup B" } },
        competitors: reveal
          ? {
              A: match.competitorAId ? map[match.competitorAId] : null,
              B: match.competitorBId ? map[match.competitorBId] : null,
            }
          : null,
        ballots: reveal
          ? ballots
          : ballots.map((b) => ({
              judgeSlot: b.judgeSlot,
              judgeName: b.judgeName,
              submittedAt: b.submittedAt,
              // Hide choices from public mid-heat? Actually public transparency
              // after submit is OK for trust — keep choices visible once cast
              tactileChoice: b.tactileChoice,
              tasteChoice: b.tasteChoice,
              flavourChoice: b.flavourChoice,
            })),
        scoring: {
          version: SCORING_VERSION,
          tactile: 15,
          taste: 10,
          flavour: 8,
          winThreshold: WIN_THRESHOLD,
        },
      };
    }),

  // ─── Admin ───────────────────────────────────────────────────

  ensurePanama2026: adminQuery.mutation(async () => {
    const db = getDb();
    const existing = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, "wec-2026-panama"));
    if (existing[0]) return existing[0];

    // Align event record
    const eventRows = await db.select().from(events).where(eq(events.year, 2026));
    const event = eventRows.find((e) => e.isUpcoming) ?? eventRows[0];
    if (event) {
      await db
        .update(events)
        .set({
          date: "26 October 2026",
          venue: "Café Unido",
          location: "Panama City, Panama",
          sponsor: "Café Unido (roaster sponsor)",
          format:
            "32 competitors, single elimination, ISO 5495 paired comparison, Scoring v3 (Tactile 45% / Taste 30% / Flavour 24%)",
          description:
            "WEC 2026 Panama at Café Unido. Blind sensory championship under Scoring v3. First independently-run WEC.",
        })
        .where(eq(events.id, event.id));
    }

    const [created] = await db.insert(tournaments).values({
      eventId: event?.id,
      slug: "wec-2026-panama",
      name: "WEC 2026 Panama",
      brand: "wec",
      family: "sensory",
      drinkFormat: "espresso",
      venue: "Café Unido",
      location: "Panama City, Panama",
      eventDate: "26 October 2026",
      roasterSponsor: "Café Unido",
      status: "draft",
      competitorLimit: 32,
      judgesPerHeat: 3,
      winThreshold: 50,
      scoringVersion: SCORING_VERSION,
    });

    // mysql2/drizzle may not return insert id consistently — re-fetch
    const [row] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, "wec-2026-panama"));
    void created;
    return row;
  }),

  seedCompetitors: adminQuery
    .input(
      z.object({
        tournamentId: z.number(),
        competitors: z
          .array(
            z.object({
              seed: z.number().min(1).max(32),
              displayName: z.string().min(1),
              country: z.string().min(1),
              registrationId: z.number().optional(),
            }),
          )
          .min(2)
          .max(32),
        replace: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const tournament = await getTournamentOrThrow({ id: input.tournamentId });
      if (tournament.status === "live" || tournament.status === "completed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot reseat competitors while tournament is live or completed",
        });
      }

      if (input.replace) {
        await db
          .delete(tournamentCompetitors)
          .where(eq(tournamentCompetitors.tournamentId, tournament.id));
      }

      for (const c of input.competitors) {
        await db.insert(tournamentCompetitors).values({
          tournamentId: tournament.id,
          seed: c.seed,
          displayName: c.displayName,
          country: c.country,
          registrationId: c.registrationId,
          status: "active",
        });
      }

      await db
        .update(tournaments)
        .set({ status: "seeding" })
        .where(eq(tournaments.id, tournament.id));

      return { success: true, count: input.competitors.length };
    }),

  seedDemoField: adminQuery
    .input(z.object({ tournamentId: z.number() }))
    .mutation(async ({ input }) => {
      const countries = [
        "Panama", "Australia", "Japan", "Italy", "Brazil", "Colombia", "Ethiopia", "Kenya",
        "USA", "UK", "Korea", "Taiwan", "Thailand", "Singapore", "Germany", "France",
        "Spain", "Netherlands", "Sweden", "Norway", "Canada", "Mexico", "Costa Rica", "Guatemala",
        "Indonesia", "Vietnam", "China", "India", "UAE", "New Zealand", "Greece", "Poland",
      ];
      const competitors = countries.map((country, i) => ({
        seed: i + 1,
        displayName: `Competitor ${String(i + 1).padStart(2, "0")}`,
        country,
      }));

      const db = getDb();
      // Clear matches then competitors for this tournament
      const existingMatches = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.tournamentId, input.tournamentId));
      for (const m of existingMatches) {
        await db.delete(tournamentBallots).where(eq(tournamentBallots.matchId, m.id));
      }
      await db
        .delete(tournamentMatches)
        .where(eq(tournamentMatches.tournamentId, input.tournamentId));
      await db
        .delete(tournamentCompetitors)
        .where(eq(tournamentCompetitors.tournamentId, input.tournamentId));

      for (const c of competitors) {
        await db.insert(tournamentCompetitors).values({
          tournamentId: input.tournamentId,
          ...c,
          status: "active",
        });
      }
      await db
        .update(tournaments)
        .set({ status: "seeding", championCompetitorId: null })
        .where(eq(tournaments.id, input.tournamentId));

      return { success: true, count: 32 };
    }),

  generateBracket: adminQuery
    .input(z.object({ tournamentId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const tournament = await getTournamentOrThrow({ id: input.tournamentId });
      const competitors = await db
        .select()
        .from(tournamentCompetitors)
        .where(eq(tournamentCompetitors.tournamentId, tournament.id))
        .orderBy(asc(tournamentCompetitors.seed));

      if (competitors.length !== tournament.competitorLimit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Need exactly ${tournament.competitorLimit} competitors (have ${competitors.length})`,
        });
      }

      // Clear prior matches/ballots
      const existingMatches = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.tournamentId, tournament.id));
      for (const m of existingMatches) {
        await db.delete(tournamentBallots).where(eq(tournamentBallots.matchId, m.id));
      }
      await db
        .delete(tournamentMatches)
        .where(eq(tournamentMatches.tournamentId, tournament.id));

      const seedMap = new Map(competitors.map((c) => [c.seed, c.id]));
      const generated = generateBracket(seedMap, tournament.competitorLimit);

      for (const g of generated) {
        await db.insert(tournamentMatches).values({
          tournamentId: tournament.id,
          round: g.round,
          matchNumber: g.matchNumber,
          competitorAId: g.competitorAId,
          competitorBId: g.competitorBId,
          status: g.round === 1 && g.competitorAId && g.competitorBId ? "ready" : "pending",
        });
      }

      await db
        .update(tournaments)
        .set({ status: "ready" })
        .where(eq(tournaments.id, tournament.id));

      return { success: true, matches: generated.length };
    }),

  startMatch: adminQuery
    .input(z.object({ matchId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
      if (!match.competitorAId || !match.competitorBId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Match does not have both competitors yet" });
      }

      // Only one in_progress at a time
      const live = await db
        .select()
        .from(tournamentMatches)
        .where(
          and(
            eq(tournamentMatches.tournamentId, match.tournamentId),
            eq(tournamentMatches.status, "in_progress"),
          ),
        );
      if (live.length > 0 && live[0].id !== match.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Another match is already in progress",
        });
      }

      const cups = assignBlindCups(match.competitorAId, match.competitorBId);
      await db
        .update(tournamentMatches)
        .set({
          status: "in_progress",
          cupACompetitorId: cups.cupACompetitorId,
          cupBCompetitorId: cups.cupBCompetitorId,
          startedAt: new Date(),
          scoreA: 0,
          scoreB: 0,
          winnerId: null,
        })
        .where(eq(tournamentMatches.id, match.id));

      // Clear any prior ballots
      await db.delete(tournamentBallots).where(eq(tournamentBallots.matchId, match.id));

      await db
        .update(tournaments)
        .set({ status: "live" })
        .where(eq(tournaments.id, match.tournamentId));

      return { success: true, cups };
    }),

  submitBallot: adminQuery
    .input(
      z.object({
        matchId: z.number(),
        judgeSlot: z.number().min(1).max(5),
        judgeName: z.string().optional(),
        tactile: cupSide,
        taste: cupSide,
        flavour: cupSide,
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
      if (match.status !== "in_progress") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Match is not in progress" });
      }

      const existing = await db
        .select()
        .from(tournamentBallots)
        .where(
          and(
            eq(tournamentBallots.matchId, match.id),
            eq(tournamentBallots.judgeSlot, input.judgeSlot),
          ),
        );
      if (existing[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Judge slot ${input.judgeSlot} already submitted — void match to re-enter`,
        });
      }

      await db.insert(tournamentBallots).values({
        matchId: match.id,
        judgeSlot: input.judgeSlot,
        judgeName: input.judgeName ?? `Judge ${input.judgeSlot}`,
        tactileChoice: input.tactile,
        tasteChoice: input.taste,
        flavourChoice: input.flavour,
      });

      return { success: true };
    }),

  finalizeMatch: adminQuery
    .input(z.object({ matchId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
      if (match.status !== "in_progress") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Match is not in progress" });
      }

      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, match.tournamentId));

      const ballots = await db
        .select()
        .from(tournamentBallots)
        .where(eq(tournamentBallots.matchId, match.id))
        .orderBy(asc(tournamentBallots.judgeSlot));

      if (ballots.length < (tournament?.judgesPerHeat ?? 3)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Need ${tournament?.judgesPerHeat ?? 3} complete ballots (have ${ballots.length})`,
        });
      }

      const result = scoreMatch(
        ballots.map((b) => ({
          tactile: b.tactileChoice,
          taste: b.tasteChoice,
          flavour: b.flavourChoice,
        })),
      );

      if (result.winnerSide === "tie") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tie score — resolve with admin override or additional protocol",
        });
      }

      if (!match.cupACompetitorId || !match.cupBCompetitorId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Blind cups not assigned" });
      }

      const winnerId =
        result.winnerSide === "A" ? match.cupACompetitorId : match.cupBCompetitorId;
      const loserId =
        result.winnerSide === "A" ? match.cupBCompetitorId : match.cupACompetitorId;

      await db
        .update(tournamentMatches)
        .set({
          status: "completed",
          winnerId,
          scoreA: result.scoreA.total,
          scoreB: result.scoreB.total,
          scoreATactile: result.scoreA.tactile,
          scoreATaste: result.scoreA.taste,
          scoreAFlavour: result.scoreA.flavour,
          scoreBTactile: result.scoreB.tactile,
          scoreBTaste: result.scoreB.taste,
          scoreBFlavour: result.scoreB.flavour,
          completedAt: new Date(),
        })
        .where(eq(tournamentMatches.id, match.id));

      await db
        .update(tournamentCompetitors)
        .set({ status: "eliminated" })
        .where(eq(tournamentCompetitors.id, loserId));

      // Advance winner
      const slot = nextRoundSlot(match.round, match.matchNumber);
      if (slot) {
        const nextMatches = await db
          .select()
          .from(tournamentMatches)
          .where(
            and(
              eq(tournamentMatches.tournamentId, match.tournamentId),
              eq(tournamentMatches.round, slot.round),
              eq(tournamentMatches.matchNumber, slot.matchNumber),
            ),
          );
        const next = nextMatches[0];
        if (next) {
          const patch =
            slot.slot === "A"
              ? { competitorAId: winnerId }
              : { competitorBId: winnerId };
          const bothReady =
            slot.slot === "A"
              ? Boolean(next.competitorBId)
              : Boolean(next.competitorAId);
          await db
            .update(tournamentMatches)
            .set({
              ...patch,
              status: bothReady ? "ready" : next.status,
            })
            .where(eq(tournamentMatches.id, next.id));
        }
      } else {
        // Final — crown champion
        await db
          .update(tournamentCompetitors)
          .set({ status: "champion" })
          .where(eq(tournamentCompetitors.id, winnerId));
        await db
          .update(tournaments)
          .set({ status: "completed", championCompetitorId: winnerId })
          .where(eq(tournaments.id, match.tournamentId));

        const [champ] = await db
          .select()
          .from(tournamentCompetitors)
          .where(eq(tournamentCompetitors.id, winnerId));
        if (tournament?.eventId && champ) {
          await db
            .update(events)
            .set({ winner: champ.displayName })
            .where(eq(events.id, tournament.eventId));
        }
      }

      return {
        success: true,
        winnerId,
        scoreA: result.scoreA,
        scoreB: result.scoreB,
      };
    }),

  voidMatch: adminQuery
    .input(z.object({ matchId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });

      await db.delete(tournamentBallots).where(eq(tournamentBallots.matchId, match.id));
      await db
        .update(tournamentMatches)
        .set({
          status:
            match.competitorAId && match.competitorBId ? "ready" : "pending",
          cupACompetitorId: null,
          cupBCompetitorId: null,
          winnerId: null,
          scoreA: 0,
          scoreB: 0,
          scoreATactile: 0,
          scoreATaste: 0,
          scoreAFlavour: 0,
          scoreBTactile: 0,
          scoreBTaste: 0,
          scoreBFlavour: 0,
          startedAt: null,
          completedAt: null,
          notes: input.reason ?? match.notes,
        })
        .where(eq(tournamentMatches.id, match.id));

      return { success: true };
    }),

  overrideWinner: adminQuery
    .input(
      z.object({
        matchId: z.number(),
        winnerCompetitorId: z.number(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(tournamentMatches)
        .where(eq(tournamentMatches.id, input.matchId));
      if (!match) throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
      if (
        input.winnerCompetitorId !== match.competitorAId &&
        input.winnerCompetitorId !== match.competitorBId
      ) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Winner must be in this match" });
      }

      const loserId =
        input.winnerCompetitorId === match.competitorAId
          ? match.competitorBId
          : match.competitorAId;

      await db
        .update(tournamentMatches)
        .set({
          status: "completed",
          winnerId: input.winnerCompetitorId,
          completedAt: new Date(),
          notes: input.notes ?? "Admin override",
        })
        .where(eq(tournamentMatches.id, match.id));

      if (loserId) {
        await db
          .update(tournamentCompetitors)
          .set({ status: "eliminated" })
          .where(eq(tournamentCompetitors.id, loserId));
      }

      const slot = nextRoundSlot(match.round, match.matchNumber);
      if (slot) {
        const nextMatches = await db
          .select()
          .from(tournamentMatches)
          .where(
            and(
              eq(tournamentMatches.tournamentId, match.tournamentId),
              eq(tournamentMatches.round, slot.round),
              eq(tournamentMatches.matchNumber, slot.matchNumber),
            ),
          );
        const next = nextMatches[0];
        if (next) {
          const patch =
            slot.slot === "A"
              ? { competitorAId: input.winnerCompetitorId }
              : { competitorBId: input.winnerCompetitorId };
          const bothReady =
            slot.slot === "A"
              ? Boolean(next.competitorBId)
              : Boolean(next.competitorAId);
          await db
            .update(tournamentMatches)
            .set({ ...patch, status: bothReady ? "ready" : next.status })
            .where(eq(tournamentMatches.id, next.id));
        }
      }

      return { success: true };
    }),
});
