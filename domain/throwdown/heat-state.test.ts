import { describe, expect, it } from "vitest";
import {
  assertTransition,
  canTransition,
  evaluateHeatReadiness,
  nextHeatBlockedBy,
  recipesUnlocked,
} from "./heat-state";

describe("heat state machine", () => {
  it("allows the operational path and rejects skips", () => {
    expect(canTransition("scheduled", "staged")).toBe(true);
    expect(canTransition("staged", "brewing")).toBe(true);
    expect(canTransition("brewing", "brewing_complete")).toBe(true);
    expect(canTransition("brewing_complete", "judging_open")).toBe(true);
    expect(canTransition("judging_open", "ballots_complete")).toBe(true);
    expect(canTransition("ballots_complete", "result_revealed")).toBe(true);
    expect(canTransition("result_revealed", "recipes_complete")).toBe(true);
    expect(canTransition("recipes_complete", "complete")).toBe(true);
    expect(() => assertTransition("scheduled", "complete")).toThrow(/cannot move/);
    expect(canTransition("complete", "void")).toBe(false);
    expect(canTransition("judging_open", "void")).toBe(true);
  });

  it("unlocks recipes after brewing is marked complete", () => {
    expect(recipesUnlocked("brewing", null)).toBe(false);
    expect(recipesUnlocked("brewing_complete", new Date())).toBe(true);
    expect(recipesUnlocked("judging_open", new Date())).toBe(true);
  });

  it("blocks the next heat until both preceding recipes are locked", () => {
    const message = nextHeatBlockedBy({
      label: "Semifinal 1",
      state: "result_revealed",
      competitorNamesMissingRecipes: ["Jordan"],
    });
    expect(message).toBe("Waiting for Jordan's recipe submission from Semifinal 1.");
  });

  it("does not start a heat without the required judges and steward confirmation", () => {
    const staged = evaluateHeatReadiness({
      state: "staged",
      isBye: false,
      judgeCountRequired: 3,
      judgesAssigned: 3,
      anyJudgeIsCompetitor: false,
      cupCodesGenerated: true,
      stewardConfirmed: false,
      ballotsSubmitted: 0,
      recipesLocked: 0,
      recipesRequired: 2,
      previousHeatsBlocking: [],
    });
    expect(staged.canStart).toBe(false);
    expect(staged.blockers).toContain("Cup Steward has not confirmed the cup codes.");
  });
});
