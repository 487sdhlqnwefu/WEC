import { describe, expect, it } from "vitest";
import {
  canAssignJudge,
  canSubmitBallot,
  canViewCupMappings,
  canViewHiddenRecipe,
  cupStewardConflicts,
} from "./authorization";
import { judgeBallotPayload, assertNoConfidentialFields } from "./sanitize";
import { classifyCompetitorCount, licenceUnlocksPremium, premiumActionBlockers } from "./tiers";
import { applyVerifiedPaymentWebhook, clientRedirectDoesNotUnlock, complimentaryRequiresReason } from "./payments";
import { generateHeatCupCodes, isValidCupCode } from "./cup-codes";
import { CUP_CODE_ALPHABET } from "./constants";
import { toPublicRecipe } from "./recipes";

const organiser = {
  profileId: "org",
  isPlatformAdmin: false,
  memberships: [{ role: "organiser" as const, status: "accepted" as const }],
  competingInHeat: false,
  assignedJudgeForHeat: false,
};

const steward = {
  profileId: "stew",
  isPlatformAdmin: false,
  memberships: [{ role: "cup_steward" as const, status: "accepted" as const }],
  competingInHeat: false,
  assignedJudgeForHeat: false,
};

describe("roles and privacy", () => {
  it("requires accepted memberships for participant roles", () => {
    const invitedOnly = {
      ...organiser,
      memberships: [{ role: "competitor" as const, status: "invited" as const }],
    };
    expect(canViewCupMappings(invitedOnly).allow).toBe(false);
  });

  it("Cup Steward cannot be competitor or judge", () => {
    expect(
      cupStewardConflicts({
        stewardProfileId: "s",
        competitorProfileIds: ["s"],
        judgePoolProfileIds: [],
      }).allow,
    ).toBe(false);
    expect(
      cupStewardConflicts({
        stewardProfileId: "s",
        competitorProfileIds: [],
        judgePoolProfileIds: ["s"],
      }).allow,
    ).toBe(false);
  });

  it("competitor may judge another heat but never their own", () => {
    const asJudge = {
      profileId: "c1",
      isPlatformAdmin: false,
      memberships: [
        { role: "competitor" as const, status: "accepted" as const },
        { role: "judge" as const, status: "accepted" as const },
      ],
      competingInHeat: false,
      assignedJudgeForHeat: true,
    };
    expect(canSubmitBallot(asJudge).allow).toBe(true);
    expect(canSubmitBallot({ ...asJudge, competingInHeat: true }).allow).toBe(false);
    expect(
      canAssignJudge({
        judgeProfileId: "c1",
        heatCompetitorProfileIds: ["c1", "c2"],
        cupStewardProfileId: "s",
      }).allow,
    ).toBe(false);
  });

  it("only the Cup Steward can access current mappings", () => {
    expect(canViewCupMappings(steward).allow).toBe(true);
    expect(canViewCupMappings(organiser).allow).toBe(false);
    expect(canViewCupMappings({ ...organiser, isPlatformAdmin: true }).allow).toBe(false);
  });

  it("public and organiser cannot access hidden recipe payloads", () => {
    expect(canViewHiddenRecipe(organiser, "other", false).allow).toBe(false);
    expect(canViewHiddenRecipe({ ...organiser, profileId: "me" }, "me", false).allow).toBe(true);
    expect(canViewHiddenRecipe(organiser, "other", true).allow).toBe(true);
  });

  it("judges cannot infer identity from ballot payloads", () => {
    const payload = judgeBallotPayload({
      eventName: "Harbour Blend Throwdown",
      heatLabel: "Semifinal 1",
      judgingFormat: "wec_v3",
      cupCodes: ["K7MQ", "R2TN"],
      submitted: false,
    });
    expect(payload).not.toHaveProperty("competitor");
    expect(payload).not.toHaveProperty("seed");
    expect(JSON.stringify(payload)).not.toMatch(/photo|initial|left|right/i);
    expect(() =>
      assertNoConfidentialFields(payload, ["competitorName", "seed", "profileId", "mapping", "mappings"]),
    ).not.toThrow();
  });
});

describe("payments", () => {
  const payment = {
    id: "pay1",
    eventId: "evt-a",
    stripeSessionId: "cs_test_1",
    amountCents: 30000,
    currency: "usd",
    status: "pending" as const,
  };

  it("successful verified webhook unlocks one event", () => {
    const result = applyVerifiedPaymentWebhook({
      payment,
      event: { type: "checkout.session.completed", stripeSessionId: "cs_test_1", metadataEventId: "evt-a" },
    });
    expect(result.unlockEventId).toBe("evt-a");
    expect(result.licenceStatus).toBe("paid");
  });

  it("client redirect without webhook does not unlock", () => {
    expect(clientRedirectDoesNotUnlock().unlock).toBe(false);
  });

  it("duplicate webhook is harmless", () => {
    const first = applyVerifiedPaymentWebhook({
      payment,
      event: { type: "checkout.session.completed", stripeSessionId: "cs_test_1" },
    });
    const second = applyVerifiedPaymentWebhook({
      payment: { ...payment, status: "paid" },
      event: { type: "checkout.session.completed", stripeSessionId: "cs_test_1", alreadyProcessed: true },
    });
    expect(first.unlockEventId).toBe("evt-a");
    expect(second.ignored).toBe(true);
    expect(second.unlockEventId).toBeNull();
  });

  it("one payment cannot unlock another event", () => {
    const result = applyVerifiedPaymentWebhook({
      payment,
      event: { type: "checkout.session.completed", stripeSessionId: "cs_test_1", metadataEventId: "evt-b" },
    });
    expect(result.unlockEventId).toBeNull();
    expect(result.reason).toMatch(/cannot unlock another event/);
  });

  it("complimentary access requires platform administrator reason", () => {
    expect(() => complimentaryRequiresReason("")).toThrow(/reason/);
    expect(() => complimentaryRequiresReason("comp for cafe")).not.toThrow();
  });

  it("unpaid premium events cannot publish or start", () => {
    const blockers = premiumActionBlockers({ tier: "premium", licenceStatus: "unpaid" }, "publish");
    expect(blockers.length).toBeGreaterThan(0);
    expect(licenceUnlocksPremium("unpaid")).toBe(false);
    expect(licenceUnlocksPremium("paid")).toBe(true);
  });
});

describe("cup codes and recipes", () => {
  it("generates two non-sequential codes without ambiguous characters", () => {
    const used = new Set<string>();
    const [a, b] = generateHeatCupCodes(used);
    expect(a).not.toBe(b);
    expect(isValidCupCode(a)).toBe(true);
    expect(isValidCupCode(b)).toBe(true);
    expect([...a, ...b].every((ch) => CUP_CODE_ALPHABET.includes(ch))).toBe(true);
    expect(a).not.toMatch(/[01ILOS5]/);
  });

  it("calculates brew ratio and extraction yield from stored grams", () => {
    const recipe = toPublicRecipe({
      doseGrams: 18,
      yieldGrams: 36,
      extractionTimeSeconds: 28,
      tds: 9.5,
    });
    expect(recipe.brewRatio).toBe(2);
    expect(recipe.extractionYield).toBeCloseTo(19, 5);
  });
});

describe("tiers", () => {
  it("maps 2–4 free, 8+ premium", () => {
    expect(classifyCompetitorCount(2)).toEqual({ ok: true, tier: "free" });
    expect(classifyCompetitorCount(4)).toEqual({ ok: true, tier: "free" });
    expect(classifyCompetitorCount(8)).toEqual({ ok: true, tier: "premium" });
    expect(classifyCompetitorCount(64)).toEqual({ ok: true, tier: "premium" });
  });
});
