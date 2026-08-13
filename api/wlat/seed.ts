import { getEngine } from "./instance";
import { getStore } from "./store/memory";
import type { Actor } from "./engine";

function actor(email: string, name: string, admin = false): Actor {
  const member = getEngine().upsertMember({
    provider: "dev",
    subject: email,
    email,
    name,
  });
  member.givenName = name.split(" ")[0] ?? name;
  member.familyName = name.split(" ").slice(1).join(" ") || "Member";
  member.countryCode = "PA";
  member.city = "Panama City";
  member.affiliationName = "Demo Cafe";
  member.profileCompletedAt = new Date();
  member.publicProfileConsent = true;
  return { member, isPlatformAdmin: admin, requestId: "seed", mappingReauthedAt: new Date() };
}

export async function seedWlatDemos(force = false): Promise<{ seeded: boolean; slugs: string[] }> {
  const store = getStore();
  if (!force && [...store.events.values()].some((e) => e.slug.startsWith("demo-"))) {
    return { seeded: false, slugs: [...store.events.values()].map((e) => e.slug) };
  }
  const engine = getEngine();
  const slugs: string[] = [];

  slugs.push(await seedDemoA(engine));
  slugs.push(await seedDemoB(engine));
  slugs.push(seedDemoC(engine));

  return { seeded: true, slugs };
}

async function seedDemoA(engine: ReturnType<typeof getEngine>): Promise<string> {
  const org = actor("demo-a-organiser@wlat.demo", "Amina Organiser");
  const event = engine.createDraftEvent(org, { name: "Demo A — Freestyle Physical" });
  engine.saveWizard(org, event.id, {
    slug: "demo-a-freestyle",
    description: "Eight solo competitors, three judges, central shot service. Demo placeholders only.",
    venueName: "WEC Lab Station",
    city: "Panama City",
    countryCode: "PA",
    fieldSize: 8,
    competitionFormat: "freestyle",
    judgingDeliveryMode: "physical",
    votingModel: "official_panel",
    officialJudgeCount: 3,
    equipmentMode: "central_shot_service",
    participationStructure: "solo",
  });
  event.slug = "demo-a-freestyle";
  engine.markCheckoutCreated(event.id, "cs_demo_a");
  engine.applyPaymentWebhook({
    providerEventId: "evt_demo_a",
    eventType: "checkout.session.completed",
    payloadHash: "demo-a",
    checkoutSessionId: "cs_demo_a",
    sessionStatus: "complete",
  });
  const steward = actor("demo-a-steward@wlat.demo", "Sam Steward");
  engine.assignRole(org, { eventId: event.id, memberId: steward.member.id, role: "blind_steward" });
  const barista = actor("demo-a-shots@wlat.demo", "Bea Barista");
  engine.assignRole(org, { eventId: event.id, memberId: barista.member.id, role: "shot_barista" });
  const judges = ["Jules Judge", "Kai Judge", "Ren Judge"].map((name, i) =>
    actor(`demo-a-judge-${i}@wlat.demo`, name),
  );
  for (const judge of judges) {
    engine.assignRole(org, { eventId: event.id, memberId: judge.member.id, role: "judge" });
  }
  const names = ["Lina", "Omar", "Priya", "Diego", "Hana", "Mateo", "Sofi", "Niko"];
  for (const name of names) {
    const competitor = actor(`demo-a-${name.toLowerCase()}@wlat.demo`, `${name} Pour`);
    engine.addEntry(org, event.id, `${name} Pour`, [competitor.member.id]);
  }
  for (const entry of getStore().entries.values()) {
    if (entry.eventId === event.id) engine.checkInEntry(org, event.id, entry.id);
  }
  engine.lockRoster(org, event.id);
  engine.generateBracket(org, event.id, "imported", [...getStore().entries.values()].filter((e) => e.eventId === event.id).map((e) => e.id));
  const heats = [...getStore().heats.values()].filter((h) => h.eventId === event.id).sort((a, b) => a.heatNumber - b.heatNumber);
  const first = heats[0]!;
  await engine.startHeat(org, first.id);
  engine.transitionHeat(org, first.id, "prep");
  engine.transitionHeat(org, first.id, "competition");
  await engine.operateTimer(org, first.id, "start", "competition", 0);
  return "demo-a-freestyle";
}

async function seedDemoB(engine: ReturnType<typeof getEngine>): Promise<string> {
  const org = actor("demo-b-organiser@wlat.demo", "Bram Organiser");
  const event = engine.createDraftEvent(org, { name: "Demo B — Match the Pattern Online" });
  event.slug = "demo-b-match-pattern";
  engine.saveWizard(org, event.id, {
    slug: "demo-b-match-pattern",
    description: "Sixteen entries, approved pattern pool, official panel with a tiebreak example.",
    fieldSize: 16,
    competitionFormat: "match_pattern",
    judgingDeliveryMode: "online",
    votingModel: "official_panel",
    officialJudgeCount: 3,
    equipmentMode: "competitor_complete",
    patternRepeatsAllowed: true,
    patternsVisibleBeforeEvent: true,
  });
  engine.markCheckoutCreated(event.id, "cs_demo_b");
  engine.applyPaymentWebhook({
    providerEventId: "evt_demo_b",
    eventType: "checkout.session.completed",
    payloadHash: "demo-b",
    checkoutSessionId: "cs_demo_b",
    sessionStatus: "complete",
  });
  engine.assignRole(org, {
    eventId: event.id,
    memberId: actor("demo-b-steward@wlat.demo", "Stevie Steward").member.id,
    role: "blind_steward",
  });
  for (let i = 0; i < 3; i += 1) {
    engine.assignRole(org, {
      eventId: event.id,
      memberId: actor(`demo-b-judge-${i}@wlat.demo`, `Panel ${i}`).member.id,
      role: "judge",
    });
    engine.assignRole(org, {
      eventId: event.id,
      memberId: actor(`demo-b-tie-${i}@wlat.demo`, `Tie ${i}`).member.id,
      role: "tiebreak_judge",
    });
  }
  for (const title of ["Rosetta", "Swan", "Tulip", "Heart", "Phoenix", "Fern"]) {
    engine.submitPattern(org, event.id, { title, storagePath: `demo/pattern/${title}.jpg`, hash: title });
  }
  for (let i = 1; i <= 16; i += 1) {
    const competitor = actor(`demo-b-c${i}@wlat.demo`, `Patternist ${i}`);
    engine.addEntry(org, event.id, `Patternist ${i}`, [competitor.member.id]);
  }
  for (const entry of getStore().entries.values()) {
    if (entry.eventId === event.id) engine.checkInEntry(org, event.id, entry.id);
  }
  engine.lockRoster(org, event.id);
  engine.generateBracket(
    org,
    event.id,
    "imported",
    [...getStore().entries.values()].filter((e) => e.eventId === event.id).map((e) => e.id),
  );
  const days = [
    { localDate: "2026-10-26", opensAt: "2026-10-26T13:00:00.000Z", closesAt: "2026-10-26T21:00:00.000Z" },
    { localDate: "2026-10-27", opensAt: "2026-10-27T13:00:00.000Z", closesAt: "2026-10-27T21:00:00.000Z" },
  ];
  engine.saveWizard(org, event.id, { days });
  return "demo-b-match-pattern";
}

function seedDemoC(engine: ReturnType<typeof getEngine>): string {
  const org = actor("demo-c-organiser@wlat.demo", "Cora Organiser");
  const event = engine.createDraftEvent(org, { name: "Demo C — 128 Field Planning" });
  event.slug = "demo-c-128";
  engine.saveWizard(org, event.id, {
    slug: "demo-c-128",
    description: "Maximum-scale locked bracket for schedule and rendering tests. Placeholder field only.",
    fieldSize: 128,
    competitionFormat: "freestyle",
    judgingDeliveryMode: "physical",
    votingModel: "official_panel",
    officialJudgeCount: 1,
    equipmentMode: "competitor_complete",
  });
  engine.markCheckoutCreated(event.id, "cs_demo_c");
  engine.applyPaymentWebhook({
    providerEventId: "evt_demo_c",
    eventType: "checkout.session.completed",
    payloadHash: "demo-c",
    checkoutSessionId: "cs_demo_c",
    sessionStatus: "complete",
  });
  engine.assignRole(org, {
    eventId: event.id,
    memberId: actor("demo-c-steward@wlat.demo", "Max Steward").member.id,
    role: "blind_steward",
  });
  engine.assignRole(org, {
    eventId: event.id,
    memberId: actor("demo-c-judge@wlat.demo", "Solo Judge").member.id,
    role: "judge",
  });
  for (let i = 1; i <= 128; i += 1) {
    const competitor = actor(`demo-c-c${i}@wlat.demo`, `Entry ${i}`);
    engine.addEntry(org, event.id, `Entry ${String(i).padStart(3, "0")}`, [competitor.member.id]);
  }
  for (const entry of getStore().entries.values()) {
    if (entry.eventId === event.id) engine.checkInEntry(org, event.id, entry.id);
  }
  engine.lockRoster(org, event.id);
  engine.generateBracket(
    org,
    event.id,
    "imported",
    [...getStore().entries.values()].filter((e) => e.eventId === event.id).map((e) => e.id),
  );
  return "demo-c-128";
}
