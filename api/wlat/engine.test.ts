import { describe, expect, it, beforeEach } from "vitest";
import { WlatEngine, type Actor } from "./engine";
import { MemoryStore, resetStore } from "./store/memory";

function actorFor(engine: WlatEngine, email: string, admin = false): Actor {
  const member = engine.upsertMember({
    provider: "dev",
    subject: email,
    email,
    name: email.split("@")[0],
  });
  return {
    member,
    isPlatformAdmin: admin,
    requestId: "test",
    mappingReauthedAt: new Date(),
  };
}

const WHY = "Entry A shows a cleaner, tighter heart than Entry B.";

describe("WlatEngine live tournament", () => {
  let store: MemoryStore;
  let engine: WlatEngine;

  beforeEach(() => {
    store = resetStore();
    engine = new WlatEngine(store, { appSecret: "test-secret", mappingHmac: "map-secret" });
  });

  it("runs an 8-person freestyle physical event with three judges", async () => {
    const org = actorFor(engine, "org@wec.test");
    const event = engine.createDraftEvent(org, { name: "Demo Throwdown" });
    engine.markCheckoutCreated(event.id, "cs_test");
    expect(
      engine.applyPaymentWebhook({
        providerEventId: "evt_1",
        eventType: "checkout.session.completed",
        payloadHash: "abc",
        checkoutSessionId: "cs_test",
        sessionStatus: "complete",
      }).status,
    ).toBe("paid");
    expect(
      engine.applyPaymentWebhook({
        providerEventId: "evt_1",
        eventType: "checkout.session.completed",
        payloadHash: "abc",
        checkoutSessionId: "cs_test",
        sessionStatus: "complete",
      }).duplicate,
    ).toBe(true);

    engine.saveWizard(org, event.id, {
      fieldSize: 8,
      competitionFormat: "freestyle",
      judgingDeliveryMode: "physical",
      votingModel: "official_panel",
      officialJudgeCount: 3,
      equipmentMode: "competitor_complete",
    });

    const steward = actorFor(engine, "steward@wec.test");
    engine.assignRole(org, { eventId: event.id, memberId: steward.member.id, role: "blind_steward" });
    const judges = [0, 1, 2].map((i) => actorFor(engine, `judge${i}@wec.test`));
    for (const judge of judges) {
      engine.assignRole(org, { eventId: event.id, memberId: judge.member.id, role: "judge" });
    }

    const competitors = Array.from({ length: 8 }, (_, i) => actorFor(engine, `c${i}@wec.test`));
    for (const competitor of competitors) {
      engine.addEntry(org, event.id, competitor.member.displayName, [competitor.member.id]);
    }
    for (const entry of store.entries.values()) {
      engine.checkInEntry(org, event.id, entry.id);
    }

    engine.lockRoster(org, event.id);
    const ids = [...store.entries.values()].map((entry) => entry.id);
    engine.generateBracket(org, event.id, "imported", ids);

    const heats = [...store.heats.values()].sort((a, b) => a.heatNumber - b.heatNumber);
    expect(heats).toHaveLength(7);

    const first = heats[0]!;
    await engine.startHeat(org, first.id);
    await expect(engine.startHeat(org, heats[1]!.id)).rejects.toThrow(/already active/i);
    engine.restartHeat(org, first.id, "espresso_machine_failure", "Steam boiler dumped during the first heat.");
    expect(store.heats.get(first.id)?.restartNumber).toBe(1);
    expect(() =>
      engine.restartHeat(org, first.id, "espresso_machine_failure", "It happened again after the restart."),
    ).toThrow(/one organiser-approved restart/i);

    const mapping = engine.revealMapping(steward, first.id, "placement");
    const publicDto = engine.publicEventDto(event.slug);
    expect(JSON.stringify(publicDto)).not.toContain(mapping.entryAId);
    expect(publicDto.activeHeat?.ballotProgress).toBeNull();

    const node = store.nodes.get(first.bracketNodeId)!;
    engine.transitionHeat(org, first.id, "prep");
    engine.transitionHeat(org, first.id, "competition");
    await engine.operateTimer(org, first.id, "start", "competition", 0);
    await engine.operateTimer(org, first.id, "finish", "competition", 1);
    engine.transitionHeat(org, first.id, "photography");

    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16]);
    for (const entryId of [node.entryAId!, node.entryBId!]) {
      const em = [...store.entryMembers.values()].find((row) => row.entryId === entryId)!;
      const competitor = actorFor(engine, store.members.get(em.memberId)!.emailNormalized!);
      const { photo } = engine.beginPhotoUpload(competitor, first.id, entryId, "pour.jpg", "image/jpeg", 1200);
      engine.completePhotoUpload(competitor, photo.id, jpeg);
    }
    engine.transitionHeat(org, first.id, "awaiting_uploads");
    engine.transitionHeat(org, first.id, "judging_open");

    const judgeView = engine.judgeBallotDto(judges[0]!, first.id);
    expect(judgeView.prompt).toMatch(/looks better/i);
    expect(JSON.stringify(judgeView)).not.toMatch(/c0@/);

    for (const judge of judges) {
      engine.submitBallot(judge, {
        heatId: first.id,
        roundId: judgeView.roundId,
        choice: "A",
        feedback: WHY,
      });
    }
    expect(store.heats.get(first.id)?.state).toBe("judging_closed");
    await engine.finalizeHeat(org, first.id);
    await engine.finalizeHeat(org, first.id);
    expect(store.locks.get(event.id)?.activeHeatId).toBeNull();
    const winner = store.heats.get(first.id)?.winnerEntryId;
    expect(winner).toBeTruthy();

    expect(() => engine.privateFeedback(competitors[0]!, event.id)).toThrow(/after the event/i);
  });

  it("opens a three-judge tiebreak when Open Member Judging ties", async () => {
    const org = actorFor(engine, "org2@wec.test");
    const event = engine.createDraftEvent(org, { name: "Online MTP" });
    engine.markCheckoutCreated(event.id, "cs_2");
    engine.applyPaymentWebhook({
      providerEventId: "evt_2",
      eventType: "checkout.session.completed",
      payloadHash: "x",
      checkoutSessionId: "cs_2",
      sessionStatus: "complete",
    });
    engine.saveWizard(org, event.id, {
      fieldSize: 8,
      competitionFormat: "match_pattern",
      judgingDeliveryMode: "online",
      votingModel: "open_member",
      openMemberTargetBallots: 3,
      openMemberMinimumBallots: 3,
      openMemberWindowSeconds: 1,
      equipmentMode: "competitor_complete",
      patternRepeatsAllowed: true,
    });
    const steward = actorFor(engine, "st2@wec.test");
    engine.assignRole(org, { eventId: event.id, memberId: steward.member.id, role: "blind_steward" });
    const tiebreak = [0, 1, 2].map((i) => actorFor(engine, `tb${i}@wec.test`));
    for (const judge of tiebreak) {
      engine.assignRole(org, { eventId: event.id, memberId: judge.member.id, role: "tiebreak_judge" });
    }
    engine.submitPattern(org, event.id, { title: "Rosetta", storagePath: "p/1.jpg", hash: "h1" });
    engine.submitPattern(org, event.id, { title: "Swan", storagePath: "p/2.jpg", hash: "h2" });
    engine.submitPattern(org, event.id, { title: "Tulip", storagePath: "p/3.jpg", hash: "h3" });
    engine.submitPattern(org, event.id, { title: "Heart", storagePath: "p/4.jpg", hash: "h4" });
    const competitors = Array.from({ length: 8 }, (_, i) => actorFor(engine, `m${i}@wec.test`));
    for (const competitor of competitors) {
      engine.addEntry(org, event.id, competitor.member.displayName, [competitor.member.id]);
    }
    for (const entry of store.entries.values()) engine.checkInEntry(org, event.id, entry.id);
    engine.lockRoster(org, event.id);
    engine.generateBracket(org, event.id, "imported", [...store.entries.values()].map((e) => e.id));
    const heat = [...store.heats.values()].sort((a, b) => a.heatNumber - b.heatNumber)[0]!;
    await engine.startHeat(org, heat.id);
    engine.transitionHeat(org, heat.id, "pattern_reveal");
    expect(heat.patternDrawId || store.heats.get(heat.id)?.patternDrawId).toBeTruthy();
    engine.transitionHeat(org, heat.id, "prep");
    engine.transitionHeat(org, heat.id, "competition");
    engine.transitionHeat(org, heat.id, "photography");
    const node = store.nodes.get(heat.bracketNodeId)!;
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16]);
    for (const entryId of [node.entryAId!, node.entryBId!]) {
      const em = [...store.entryMembers.values()].find((row) => row.entryId === entryId)!;
      const competitor = actorFor(engine, store.members.get(em.memberId)!.emailNormalized!);
      const { photo } = engine.beginPhotoUpload(competitor, heat.id, entryId, "pour.jpg", "image/jpeg", 800);
      engine.completePhotoUpload(competitor, photo.id, jpeg);
    }
    engine.transitionHeat(org, heat.id, "awaiting_uploads");
    engine.transitionHeat(org, heat.id, "judging_open");
    const round = [...store.rounds.values()].find((r) => r.heatId === heat.id)!;
    const voters = [actorFor(engine, "v1@wec.test"), actorFor(engine, "v2@wec.test")];
    engine.assignRole(org, { eventId: event.id, memberId: voters[0]!.member.id, role: "online_member_voter" });
    engine.assignRole(org, { eventId: event.id, memberId: voters[1]!.member.id, role: "online_member_voter" });
    engine.submitBallot(voters[0]!, { heatId: heat.id, roundId: round.id, choice: "A", feedback: WHY });
    engine.submitBallot(voters[1]!, { heatId: heat.id, roundId: round.id, choice: "B", feedback: WHY });
    round.closesAt = new Date(Date.now() - 1000);
    engine.closeExpiredOpenMemberRounds();
    const tie = [...store.rounds.values()].find((r) => r.roundType === "tiebreak");
    expect(tie?.status).toBe("open");
    for (const judge of tiebreak) {
      engine.submitBallot(judge, { heatId: heat.id, roundId: tie!.id, choice: "B", feedback: WHY });
    }
    const result = await engine.finalizeHeat(org, heat.id);
    expect(result).toMatchObject({ winningBlindEntry: "B", resolutionType: "tiebreak" });
  });
});
