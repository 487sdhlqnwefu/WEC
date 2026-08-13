import { describe, expect, it } from "vitest";
import {
  assertOfficialPanelSize,
  assertOpenMemberOnlyOnline,
  feedbackQualityFlags,
  majorityWinner,
  officialPanelComplete,
  openMemberNeedsTiebreak,
  openMemberShouldClose,
  tallyBlindVotes,
  validateFeedback,
} from "./judging";
import { generateBlindMapping, presentationOrder, resolveWinnerEntry } from "./blindness";
import { drawPattern, eligiblePatternIds } from "./patterns";
import { assertRestartEligible } from "./restarts";
import { releasePolicy } from "./release";
import { judgeHasHeatConflict, rolesConflict } from "./roles";
import { bothPhotosReady } from "./photos";
import { scheduleCannotFit } from "./schedule";
import { timingPreset } from "./timing";
import { applyWebhookStatus, unlocksLiveOperation } from "./payments";

describe("official panel", () => {
  it("allows 1, 3, 5, 7 and rejects even or other counts", () => {
    for (const n of [1, 3, 5, 7]) {
      expect(() => assertOfficialPanelSize(n)).not.toThrow();
    }
    for (const n of [0, 2, 4, 6, 8, 9]) {
      expect(() => assertOfficialPanelSize(n)).toThrow(/1, 3, 5, or 7/);
    }
  });

  it("tallies majority without a hidden rubric", () => {
    const tally = tallyBlindVotes(["A", "B", "A"]);
    expect(tally.voteA).toBe(2);
    expect(tally.voteB).toBe(1);
    expect(majorityWinner(tally)).toBe("A");
    expect(officialPanelComplete(3, 3)).toBe(true);
    expect(officialPanelComplete(3, 2)).toBe(false);
  });
});

describe("open member judging", () => {
  it("closes at the odd target without exposing a tie path", () => {
    expect(openMemberShouldClose({ validBallots: 21, targetBallots: 21, windowEnded: false })).toEqual({
      close: true,
      reason: "target",
    });
  });

  it("invokes a three-judge tiebreak on even counts or ties at window close", () => {
    const even = tallyBlindVotes(["A", "B", "A", "B"]);
    expect(openMemberNeedsTiebreak(even, true, false)).toBe(true);
    const tieOddImpossible = tallyBlindVotes(["A", "B"]);
    expect(openMemberNeedsTiebreak(tieOddImpossible, true, false)).toBe(true);
    const majority = tallyBlindVotes(["A", "A", "B"]);
    expect(openMemberNeedsTiebreak(majority, false, true)).toBe(false);
  });

  it("rejects open member with physical judging", () => {
    expect(() => assertOpenMemberOnlyOnline("open_member", "physical")).toThrow(/online/i);
  });
});

describe("feedback", () => {
  it("requires comparative explanation, not empty noise", () => {
    expect(() => validateFeedback("nice")).toThrow();
    expect(() => validateFeedback("asdfasdfasdfasdfasdf")).toThrow(/preferred/);
    const ok = validateFeedback("Entry A has a cleaner heart and tighter symmetry than B.");
    expect(ok.length).toBeGreaterThanOrEqual(20);
  });

  it("flags short, non-comparative, repeated, and fast ballots without voiding them", () => {
    const flags = feedbackQualityFlags({
      text: "I like this one a lot yes.",
      submittedAt: new Date(7_000),
      openedAt: new Date(0),
      previousTexts: ["I like this one a lot yes."],
    });
    const types = flags.map((f) => f.flag);
    expect(types).toContain("possible_non_comparative");
    expect(types).toContain("repeated_text");
    expect(types).toContain("unusually_fast");
  });
});

describe("blind mapping", () => {
  it("does not infer A/B from input order", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      const mapping = generateBlindMapping(["left-seed", "right-seed"]);
      seen.add(`${mapping.entryAId}:${mapping.entryBId}`);
    }
    expect(seen.has("left-seed:right-seed")).toBe(true);
    expect(seen.has("right-seed:left-seed")).toBe(true);
    const mapping = generateBlindMapping(["e1", "e2"]);
    expect(resolveWinnerEntry(mapping, "A")).toBe(mapping.entryAId);
  });

  it("randomises presentation independently per voter", () => {
    const first = presentationOrder("secret", "h1", "r1", "voter-1");
    const second = presentationOrder("secret", "h1", "r1", "voter-2");
    const again = presentationOrder("secret", "h1", "r1", "voter-1");
    expect(again).toEqual(first);
    expect(new Set([...first, ...second]).size).toBe(2);
  });
});

describe("patterns", () => {
  it("avoids repeats until the pool is exhausted", () => {
    const eligible = eligiblePatternIds({
      approvedPatternIds: ["p1", "p2"],
      previouslySelectedIds: ["p1"],
      allowRepeat: false,
    });
    expect(eligible).toEqual(["p2"]);
    const exhausted = eligiblePatternIds({
      approvedPatternIds: ["p1"],
      previouslySelectedIds: ["p1"],
      allowRepeat: false,
    });
    expect(exhausted).toEqual(["p1"]);
    const drawn = drawPattern({
      approvedPatternIds: ["only"],
      previouslySelectedIds: [],
      allowRepeat: false,
    });
    expect(drawn.selectedPatternId).toBe("only");
  });
});

describe("restarts", () => {
  it("allows one qualifying restart and blocks a second organiser restart", () => {
    expect(() =>
      assertRestartEligible({
        reason: "espresso_machine_failure",
        notes: "Steam boiler dumped mid-pour.",
        existingRestartCount: 0,
        isPlatformAdmin: false,
      }),
    ).not.toThrow();
    expect(() =>
      assertRestartEligible({
        reason: "espresso_machine_failure",
        notes: "Happened again after restart.",
        existingRestartCount: 1,
        isPlatformAdmin: false,
      }),
    ).toThrow(/one organiser-approved restart/i);
    expect(() =>
      assertRestartEligible({
        reason: "admin_force_majeure",
        notes: "Venue power grid failed after the first restart.",
        existingRestartCount: 1,
        isPlatformAdmin: true,
      }),
    ).not.toThrow();
  });
});

describe("release policy", () => {
  it("hides feedback, mappings, and physical photos until publication", () => {
    const live = releasePolicy({
      heatFinalized: false,
      eventPublished: false,
      judgingDelivery: "physical",
      judgingOpen: true,
      voteSplitPublicPolicy: true,
    });
    expect(live.showFeedbackToCompetitor).toBe(false);
    expect(live.showBlindMapping).toBe(false);
    expect(live.showPartialTotals).toBe(false);
    expect(live.showPhysicalPhotos).toBe(false);
    expect(live.showIndividualBallots).toBe(false);

    const published = releasePolicy({
      heatFinalized: true,
      eventPublished: true,
      judgingDelivery: "physical",
      judgingOpen: false,
      voteSplitPublicPolicy: true,
    });
    expect(published.showFeedbackToCompetitor).toBe(true);
    expect(published.showNamedArchive).toBe(true);
    expect(published.showWinner).toBe(true);
  });
});

describe("roles and photos", () => {
  it("blocks steward/competitor and competitor/judge overlaps", () => {
    expect(rolesConflict(["competitor"], "blind_steward")).toBe("competitor");
    expect(rolesConflict(["competitor"], "judge")).toBe("competitor");
    expect(rolesConflict(["lead_organiser"], "judge")).toBeNull();
  });

  it("detects a coach judging their own entry", () => {
    expect(
      judgeHasHeatConflict({
        judgeMemberId: "j1",
        heatEntryMemberIds: ["c1"],
        coachedEntryIds: ["entry-1"],
        heatEntryIds: ["entry-1"],
        affiliationNames: [],
        heatAffiliationNames: [],
        declaredConflicts: [],
      }),
    ).toBe(true);
  });

  it("requires both final photos", () => {
    expect(
      bothPhotosReady(
        [
          { entryId: "a", submissionStatus: "submitted", voidedAt: null },
          { entryId: "b", submissionStatus: "uploaded", voidedAt: null },
        ],
        ["a", "b"],
      ),
    ).toBe(false);
    expect(
      bothPhotosReady(
        [
          { entryId: "a", submissionStatus: "submitted", voidedAt: null },
          { entryId: "b", submissionStatus: "verified", voidedAt: null },
        ],
        ["a", "b"],
      ),
    ).toBe(true);
  });
});

describe("schedule and payment", () => {
  it("warns when the window cannot fit all heats", () => {
    const timing = timingPreset("central_shot_service");
    const opens = new Date("2026-08-13T10:00:00Z");
    const closes = new Date("2026-08-13T10:20:00Z");
    expect(
      scheduleCannotFit(8, [{ localDate: "2026-08-13", opensAt: opens, closesAt: closes }], timing),
    ).toBe(true);
  });

  it("does not unlock from checkout_created", () => {
    expect(unlocksLiveOperation("checkout_created")).toBe(false);
    expect(unlocksLiveOperation("paid")).toBe(true);
    expect(applyWebhookStatus({ current: "checkout_created", stripeSessionStatus: "complete" })).toBe(
      "paid",
    );
  });
});
