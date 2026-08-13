import { randomUUID } from "node:crypto";
import { createEngine } from "../api/throwdown/runtime";
import { MysqlUow } from "../api/throwdown/mysql-uow";
import type { ProfileRow } from "../api/throwdown/uow";
import type { ThrowdownEngine } from "../api/throwdown/engine";

const recipe = {
  doseGrams: 18,
  yieldGrams: 36,
  extractionTimeSeconds: 27,
  tds: 9.4,
  notes: "Demo recipe. Not a production result.",
};

async function person(uow: MysqlUow, email: string, name: string, admin = false): Promise<ProfileRow> {
  const existing = await uow.profiles.findOne({ email });
  if (existing) return existing;
  const row: ProfileRow = {
    id: randomUUID(),
    displayName: name,
    email,
    emailVerifiedAt: new Date(),
    country: "New Zealand",
    city: "Wellington",
    photoUrl: null,
    organisation: "Harbour Demo Roastery",
    roleTitle: "Barista",
    externalIdentityProvider: null,
    externalSubjectId: null,
    kimiUnionId: null,
    isPlatformAdmin: admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await uow.profiles.insert(row);
  return row;
}

function actor(profile: ProfileRow) {
  return { profile };
}

async function seed() {
  const uow = new MysqlUow();
  const engine = createEngine(uow);
  const org = await person(uow, "omar.organiser@demo.throwdown.test", "Omar Organiser", true);
  const steward = await person(uow, "sam.steward@demo.throwdown.test", "Sam Steward");
  const avery = await person(uow, "avery@demo.throwdown.test", "Avery Quill");
  const blair = await person(uow, "blair@demo.throwdown.test", "Blair Nettle");
  const casey = await person(uow, "casey@demo.throwdown.test", "Casey Rowan");
  const drew = await person(uow, "drew@demo.throwdown.test", "Drew Pebble");
  const jules = await person(uow, "jules@demo.throwdown.test", "Jules Hart");

  await seedFourPerson(engine, org, steward, [avery, blair, casey, drew], jules);
  await seedThreePerson(engine, org, steward, [avery, blair, casey], jules);
  await seedPremium(engine, uow, org, false);
  await seedPremium(engine, uow, org, true);
  await seedCompleted(engine, uow, org, steward, [avery, blair], jules);

  console.log(`
Espresso Throwdown demo members (fictional):
  omar.organiser@demo.throwdown.test  (organiser / platform admin)
  sam.steward@demo.throwdown.test     (Cup Steward)
  avery@demo.throwdown.test           (competitor/judge)
  blair@demo.throwdown.test
  casey@demo.throwdown.test
  drew@demo.throwdown.test
  jules@demo.throwdown.test           (judge)

Set THROWDOWN_DEV_LOGIN=true in development, request a code, then use 000000.
Never enable that flag in production.
`);
  process.exit(0);
}

async function seedFourPerson(
  engine: ThrowdownEngine,
  org: ProfileRow,
  steward: ProfileRow,
  comps: ProfileRow[],
  judge: ProfileRow,
) {
  const event = await engine.createEvent(actor(org), {
    name: "Harbour Blend Free Throwdown",
    hostName: "Harbour Demo Roastery",
    timezone: "Pacific/Auckland",
    city: "Wellington",
    country: "New Zealand",
    coffeeName: "Harbour Blend",
    coffeeType: "blend",
    espressoMachine: "Demo dual boiler",
    grinder: "Demo flat burr",
    tier: "free",
    judgingFormat: "wec_v3",
    judgeCount: 3,
  });
  for (const c of comps) await engine.addCompetitor(actor(org), event.id, c.id);
  await engine.setCupSteward(actor(org), event.id, steward.id);
  for (const p of [...comps, judge]) await engine.addJudgeToPool(actor(org), event.id, p.id);
  await engine.publishEvent(actor(org), event.id);
  await engine.lockRoster(actor(org), event.id);
  await engine.generateBracket(actor(org), event.id, () => 0.4);
}

async function seedThreePerson(
  engine: ThrowdownEngine,
  org: ProfileRow,
  steward: ProfileRow,
  comps: ProfileRow[],
  judge: ProfileRow,
) {
  const event = await engine.createEvent(actor(org), {
    name: "Single Origin Three",
    hostName: "Harbour Demo Roastery",
    timezone: "Pacific/Auckland",
    coffeeName: "North Island Demo Lot",
    coffeeType: "single_origin",
    tier: "free",
    judgingFormat: "simple_ab",
    judgeCount: 1,
  });
  for (const c of comps) await engine.addCompetitor(actor(org), event.id, c.id);
  await engine.setCupSteward(actor(org), event.id, steward.id);
  await engine.addJudgeToPool(actor(org), event.id, judge.id);
  await engine.publishEvent(actor(org), event.id);
  await engine.lockRoster(actor(org), event.id);
  await engine.generateBracket(actor(org), event.id);
}

async function seedPremium(engine: ThrowdownEngine, uow: MysqlUow, org: ProfileRow, paid: boolean) {
  const event = await engine.createEvent(actor(org), {
    name: paid ? "Paid Demo Tournament" : "Unpaid Demo Tournament",
    hostName: "Harbour Demo Roastery",
    timezone: "UTC",
    coffeeName: "Tournament Blend",
    coffeeType: "blend",
    tier: "premium",
    judgingFormat: "wec_v3",
    judgeCount: 3,
  });
  for (let i = 0; i < 8; i++) {
    const profile = await person(
      uow,
      `premium${paid ? "p" : "u"}${i}@demo.throwdown.test`,
      `Demo Barista ${i + 1}`,
    );
    await engine.addCompetitor(actor(org), event.id, profile.id);
  }
  if (paid) {
    await engine.recordCheckoutSession(actor(org), event.id, `cs_test_seed_${event.id}`, 30000);
    await engine.applyStripeWebhook(
      `evt_seed_${event.id}`,
      "checkout.session.completed",
      `cs_test_seed_${event.id}`,
      event.id,
    );
  }
}

async function seedCompleted(
  engine: ThrowdownEngine,
  uow: MysqlUow,
  org: ProfileRow,
  steward: ProfileRow,
  comps: ProfileRow[],
  judge: ProfileRow,
) {
  const event = await engine.createEvent(actor(org), {
    name: "Completed Demo Throwdown",
    hostName: "Harbour Demo Roastery",
    timezone: "UTC",
    coffeeName: "Archive Blend",
    coffeeType: "blend",
    tier: "free",
    judgingFormat: "simple_ab",
    judgeCount: 1,
  });
  for (const c of comps) await engine.addCompetitor(actor(org), event.id, c.id);
  await engine.setCupSteward(actor(org), event.id, steward.id);
  await engine.addJudgeToPool(actor(org), event.id, judge.id);
  await engine.publishEvent(actor(org), event.id);
  await engine.lockRoster(actor(org), event.id);
  await engine.generateBracket(actor(org), event.id, () => 0.1);
  const heats = (await uow.heats.list({ eventId: event.id })).filter((h) => !h.isBye);
  for (const heat of heats) {
    const attempt = heat.currentAttemptId ? await uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt || attempt.status === "complete") continue;
    const slots = await uow.heatCompetitors.list({ attemptId: attempt.id });
    if (slots.filter((s) => s.competitorEntryId).length < 2) continue;
    await engine.assignJudges(actor(org), heat.id, [judge.id]);
    await engine.stageHeat(actor(org), heat.id);
    await engine.confirmCupCodes(actor(steward), heat.id);
    await engine.startHeat(actor(org), heat.id);
    await engine.markBrewingComplete(actor(org), heat.id);
    await engine.openJudging(actor(org), heat.id);
    const ballot = await engine.getJudgeBallot(actor(judge), heat.id);
    await engine.submitBallot(actor(judge), heat.id, {
      choice: ballot.cupCodes[0],
      idempotencyKey: `seed-${heat.id}`,
    });
    await engine.revealResult(actor(org), heat.id);
    for (const slot of slots) {
      if (!slot.competitorEntryId) continue;
      const entry = await uow.entries.get(slot.competitorEntryId);
      const profile = entry ? await uow.profiles.get(entry.profileId) : null;
      if (profile) await engine.submitRecipe(actor(profile), heat.id, recipe);
    }
  }
  await engine.completeEvent(actor(org), event.id);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
