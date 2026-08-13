import { describe, expect, it } from "vitest";
import { ThrowdownEngine } from "./engine";
import { MemoryUow, type ProfileRow } from "./uow";
import { ThrowdownError } from "./errors";
import { assertNoConfidentialFields } from "@throwdown/sanitize";

function engineWithPeek() {
  const uow = new MemoryUow();
  const original = uow.otps.insert.bind(uow.otps);
  const codes = new Map<string, string>();
  uow.otps.insert = async (row) => {
    await original(row);
  };
  const engine = new ThrowdownEngine(uow, {
    sendOtp: async (email, code) => {
      codes.set(email, code);
    },
    sendInvite: async () => {},
  });
  return { engine, uow, codes };
}

async function signIn(ctx: ReturnType<typeof engineWithPeek>, email: string, name?: string) {
  await ctx.engine.requestOtp(email);
  const profile = await ctx.engine.verifyOtp(email, ctx.codes.get(email)!);
  if (name) {
    await ctx.engine.updateProfile({ profile }, { displayName: name, country: "Australia" });
    return (await ctx.uow.profiles.get(profile.id))!;
  }
  return profile;
}

function actor(profile: ProfileRow) {
  return { profile };
}

const recipe = {
  doseGrams: 18,
  yieldGrams: 36,
  extractionTimeSeconds: 28,
  tds: 9.2,
};

describe("throwdown engine", () => {
  it("runs a 4-person free Official WEC Scoring v3 throwdown end to end", async () => {
    const ctx = engineWithPeek();
    const org = await signIn(ctx, "org@demo.test", "Omar Organiser");
    const steward = await signIn(ctx, "steward@demo.test", "Sam Steward");
    const c1 = await signIn(ctx, "c1@demo.test", "Avery");
    const c2 = await signIn(ctx, "c2@demo.test", "Blair");
    const c3 = await signIn(ctx, "c3@demo.test", "Casey");
    const c4 = await signIn(ctx, "c4@demo.test", "Drew");
    const j1 = await signIn(ctx, "j1@demo.test", "Jules");

    const event = await ctx.engine.createEvent(actor(org), {
      name: "Harbour Blend Throwdown",
      hostName: "Demo Roastery",
      timezone: "Australia/Sydney",
      coffeeName: "Harbour Blend",
      coffeeType: "blend",
      tier: "free",
      judgingFormat: "wec_v3",
      judgeCount: 3,
    });

    await ctx.engine.addCompetitor(actor(org), event.id, c1.id);
    await ctx.engine.addCompetitor(actor(org), event.id, c2.id);
    await ctx.engine.addCompetitor(actor(org), event.id, c3.id);
    await ctx.engine.addCompetitor(actor(org), event.id, c4.id);
    await ctx.engine.setCupSteward(actor(org), event.id, steward.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, j1.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, c1.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, c2.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, c3.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, c4.id);

    await ctx.engine.publishEvent(actor(org), event.id);
    await ctx.engine.lockRoster(actor(org), event.id);
    await ctx.engine.generateBracket(actor(org), event.id, () => 0.3);

    const heats = await ctx.uow.heats.list({ eventId: event.id });
    const semis = heats.filter((h) => h.label.startsWith("Semifinal"));
    expect(semis).toHaveLength(2);
    const final = heats.find((h) => h.label === "Final")!;

    async function runHeat(
      heatId: string,
      judges: ProfileRow[],
      pick: "first" | "second",
    ) {
      const heat = (await ctx.uow.heats.get(heatId))!;
      const attempt = (await ctx.uow.attempts.get(heat.currentAttemptId!))!;
      const comps = await ctx.uow.heatCompetitors.list({ attemptId: attempt.id });
      const competitorProfiles: ProfileRow[] = [];
      for (const c of comps) {
        const entry = await ctx.uow.entries.get(c.competitorEntryId!);
        competitorProfiles.push((await ctx.uow.profiles.get(entry!.profileId))!);
      }
      await ctx.engine.assignJudges(
        actor(org),
        heatId,
        judges.map((j) => j.id),
      );
      await ctx.engine.stageHeat(actor(org), heatId);
      const mapping = await ctx.engine.getStewardView(actor(steward), event.id);
      expect(mapping.heats[0]?.cups).toHaveLength(2);
      await expect(ctx.engine.getStewardView(actor(org), event.id)).rejects.toBeInstanceOf(ThrowdownError);
      await ctx.engine.confirmCupCodes(actor(steward), heatId);
      await ctx.engine.startHeat(actor(org), heatId);
      await ctx.engine.markBrewingComplete(actor(org), heatId);
      await ctx.engine.openJudging(actor(org), heatId);

      const ballot = await ctx.engine.getJudgeBallot(actor(judges[0]!), heatId);
      expect(ballot.cupCodes).toHaveLength(2);
      expect(JSON.stringify(ballot)).not.toMatch(/Avery|Blair|Casey|Drew/);
      assertNoConfidentialFields(ballot, ["mapping", "competitorName", "profileId"]);

      const winnerCode = pick === "first" ? ballot.cupCodes[0]! : ballot.cupCodes[1]!;
      for (const judge of judges) {
        await ctx.engine.submitBallot(actor(judge), heatId, {
          tactile: winnerCode,
          taste: winnerCode,
          flavour: winnerCode,
          idempotencyKey: `${heatId}-${judge.id}`,
        });
      }
      await expect(
        ctx.engine.submitBallot(actor(judges[0]!), heatId, {
          tactile: winnerCode,
          taste: winnerCode,
          flavour: winnerCode,
          idempotencyKey: `${heatId}-${judges[0]!.id}-retry`,
        }),
      ).rejects.toMatchObject({ code: "CONFLICT" });

      await ctx.engine.revealResult(actor(org), heatId);
      for (const competitor of competitorProfiles) {
        await ctx.engine.submitRecipe(actor(competitor), heatId, recipe);
      }
    }

    const sf1 = semis[0]!;
    const sf1Attempt = (await ctx.uow.attempts.get(sf1.currentAttemptId!))!;
    const sf1Comps = await ctx.uow.heatCompetitors.list({ attemptId: sf1Attempt.id });
    const sf1ProfileIds: string[] = [];
    for (const c of sf1Comps) {
      const entry = await ctx.uow.entries.get(c.competitorEntryId!);
      sf1ProfileIds.push(entry!.profileId);
    }
    const otherJudges = [c1, c2, c3, c4].filter((p) => !sf1ProfileIds.includes(p.id));
    await runHeat(sf1.id, [j1, otherJudges[0]!, otherJudges[1]!], "first");

    await expect(ctx.engine.stageHeat(actor(org), final.id)).rejects.toMatchObject({ code: "FORBIDDEN" });

    const sf2 = semis[1]!;
    const sf2Attempt = (await ctx.uow.attempts.get(sf2.currentAttemptId!))!;
    const sf2Comps = await ctx.uow.heatCompetitors.list({ attemptId: sf2Attempt.id });
    const sf2ProfileIds: string[] = [];
    for (const c of sf2Comps) {
      const entry = await ctx.uow.entries.get(c.competitorEntryId!);
      sf2ProfileIds.push(entry!.profileId);
    }
    const sf2Judges = [c1, c2, c3, c4].filter((p) => !sf2ProfileIds.includes(p.id));
    await runHeat(sf2.id, [j1, sf2Judges[0]!, sf2Judges[1]!], "first");

    const refreshedFinal = (await ctx.uow.heats.get(final.id))!;
    const finalAttempt = (await ctx.uow.attempts.get(refreshedFinal.currentAttemptId!))!;
    const finalComps = await ctx.uow.heatCompetitors.list({ attemptId: finalAttempt.id });
    expect(finalComps.filter((c) => c.competitorEntryId).length).toBe(2);
    const finalProfileIds: string[] = [];
    for (const c of finalComps) {
      const entry = await ctx.uow.entries.get(c.competitorEntryId!);
      finalProfileIds.push(entry!.profileId);
    }
    const finalJudges = [c1, c2, c3, c4].filter((p) => !finalProfileIds.includes(p.id));
    await runHeat(final.id, [j1, finalJudges[0]!, finalJudges[1]!], "first");

    const publicLive = await ctx.engine.getPublicEvent(event.slug);
    expect(publicLive.heats.every((h) => h.recipes.length === 0)).toBe(true);
    expect(JSON.stringify(publicLive)).not.toMatch(/cupCode|mapping/i);

    const hidden = await ctx.uow.recipes.list();
    await expect(ctx.engine.getHiddenRecipe(actor(org), hidden[0]!.id)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });

    await ctx.engine.completeEvent(actor(org), event.id);
    const done = await ctx.engine.getPublicEvent(event.slug);
    expect(done.champion).toBeTruthy();
    expect(done.recipesReleased).toBe(true);
    expect(done.heats.filter((h) => !h.isBye).every((h) => h.recipes.length === 2)).toBe(true);
  });

  it("builds a 3-person free Simple Blind A/B bracket with one random bye", async () => {
    const ctx = engineWithPeek();
    const org = await signIn(ctx, "org3@demo.test", "Organiser");
    const steward = await signIn(ctx, "st3@demo.test", "Steward");
    const a = await signIn(ctx, "a3@demo.test", "Ada");
    const b = await signIn(ctx, "b3@demo.test", "Bea");
    const c = await signIn(ctx, "c3@demo.test", "Cam");
    const event = await ctx.engine.createEvent(actor(org), {
      name: "Three Cup",
      hostName: "Cafe",
      timezone: "UTC",
      coffeeName: "Origin",
      coffeeType: "single_origin",
      tier: "free",
      judgingFormat: "simple_ab",
      judgeCount: 1,
    });
    await ctx.engine.addCompetitor(actor(org), event.id, a.id);
    await ctx.engine.addCompetitor(actor(org), event.id, b.id);
    await ctx.engine.addCompetitor(actor(org), event.id, c.id);
    await ctx.engine.setCupSteward(actor(org), event.id, steward.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, org.id);
    await ctx.engine.lockRoster(actor(org), event.id);
    await ctx.engine.publishEvent(actor(org), event.id);
    await ctx.engine.generateBracket(actor(org), event.id);
    const heats = await ctx.uow.heats.list({ eventId: event.id });
    expect(heats.filter((h) => h.isBye)).toHaveLength(1);
    expect(heats.some((h) => h.label === "Final")).toBe(true);
  });

  it("rejects 5–7 competitors and unpaid premium publish/start", async () => {
    const ctx = engineWithPeek();
    const org = await signIn(ctx, "orgp@demo.test", "Organiser");
    const event = await ctx.engine.createEvent(actor(org), {
      name: "Premium Draft",
      hostName: "Cafe",
      timezone: "UTC",
      coffeeName: "Blend",
      coffeeType: "blend",
      tier: "premium",
      judgingFormat: "simple_ab",
      judgeCount: 3,
    });
    const ids = [];
    for (let i = 0; i < 5; i++) {
      const p = await signIn(ctx, `p${i}@demo.test`, `P${i}`);
      ids.push(p.id);
      await ctx.engine.addCompetitor(actor(org), event.id, p.id);
    }
    await expect(ctx.engine.lockRoster(actor(org), event.id)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    await expect(ctx.engine.publishEvent(actor(org), event.id)).rejects.toMatchObject({ code: "FORBIDDEN" });

    const paid = await ctx.engine.createEvent(actor(org), {
      name: "Eight",
      hostName: "Cafe",
      timezone: "UTC",
      coffeeName: "Blend",
      coffeeType: "blend",
      tier: "premium",
      judgingFormat: "wec_v3",
      judgeCount: 3,
    });
    for (let i = 0; i < 8; i++) {
      const p = await signIn(ctx, `eight${i}@demo.test`, `E${i}`);
      await ctx.engine.addCompetitor(actor(org), paid.id, p.id);
    }
    await ctx.engine.recordCheckoutSession(actor(org), paid.id, "cs_test_other", 30000);
    const result = await ctx.engine.applyStripeWebhook("evt_1", "checkout.session.completed", "cs_test_other", paid.id);
    expect(result.unlockEventId).toBe(paid.id);
    const dup = await ctx.engine.applyStripeWebhook("evt_1", "checkout.session.completed", "cs_test_other", paid.id);
    expect(dup.ignored).toBe(true);
    const other = await ctx.engine.applyStripeWebhook("evt_2", "checkout.session.completed", "cs_test_other", "someone-else");
    expect(other.unlockEventId).toBeNull();
    expect(ctx.engine.clientRedirectStatus().unlock).toBe(false);
  });

  it("blocks a competitor from judging their own heat", async () => {
    const ctx = engineWithPeek();
    const org = await signIn(ctx, "orgj@demo.test", "Organiser");
    const steward = await signIn(ctx, "stj@demo.test", "Steward");
    const a = await signIn(ctx, "aj@demo.test", "Ada");
    const b = await signIn(ctx, "bj@demo.test", "Bea");
    const event = await ctx.engine.createEvent(actor(org), {
      name: "Pair",
      hostName: "Cafe",
      timezone: "UTC",
      coffeeName: "Blend",
      coffeeType: "blend",
      tier: "free",
      judgingFormat: "simple_ab",
      judgeCount: 1,
    });
    await ctx.engine.addCompetitor(actor(org), event.id, a.id);
    await ctx.engine.addCompetitor(actor(org), event.id, b.id);
    await ctx.engine.setCupSteward(actor(org), event.id, steward.id);
    await ctx.engine.addJudgeToPool(actor(org), event.id, a.id);
    await ctx.engine.lockRoster(actor(org), event.id);
    await ctx.engine.generateBracket(actor(org), event.id);
    const heat = (await ctx.uow.heats.list({ eventId: event.id }))[0]!;
    await expect(ctx.engine.assignJudges(actor(org), heat.id, [a.id])).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
