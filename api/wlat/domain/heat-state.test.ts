import { describe, expect, it } from "vitest";
import { canTransitionEvent, requiresPaidLicence } from "./event-state";
import {
  assertCanStartHeat,
  assertHeatTransition,
  canTransitionHeat,
  isActiveHeatState,
  nextNormalHeatState,
} from "./heat-state";

describe("event states", () => {
  it("unlocks live operation only after payment-backed states", () => {
    expect(requiresPaidLicence("draft")).toBe(false);
    expect(requiresPaidLicence("setup")).toBe(false);
    expect(requiresPaidLicence("roster_locked")).toBe(true);
    expect(requiresPaidLicence("live")).toBe(true);
  });
  it("allows draft → awaiting_payment → setup", () => {
    expect(canTransitionEvent("draft", "awaiting_payment")).toBe(true);
    expect(canTransitionEvent("awaiting_payment", "setup")).toBe(true);
    expect(canTransitionEvent("live", "draft")).toBe(false);
  });
});

describe("heat states", () => {
  it("skips pattern_reveal for freestyle", () => {
    expect(nextNormalHeatState("check_in", "freestyle")).toBe("prep");
    expect(
      canTransitionHeat("check_in", "prep", { format: "freestyle", bothCheckedIn: true }),
    ).toBe(true);
    expect(
      canTransitionHeat("check_in", "pattern_reveal", { format: "freestyle", bothCheckedIn: true }),
    ).toBe(false);
  });

  it("requires a pattern draw for Match the Pattern", () => {
    expect(nextNormalHeatState("check_in", "match_pattern")).toBe("pattern_reveal");
    expect(
      canTransitionHeat("pattern_reveal", "prep", { format: "match_pattern", patternDrawn: false }),
    ).toBe(false);
    expect(
      canTransitionHeat("pattern_reveal", "prep", { format: "match_pattern", patternDrawn: true }),
    ).toBe(true);
  });

  it("blocks judging until both photos are in", () => {
    expect(
      canTransitionHeat("awaiting_uploads", "judging_open", {
        format: "freestyle",
        bothPhotosSubmitted: false,
      }),
    ).toBe(false);
    expect(
      canTransitionHeat("awaiting_uploads", "judging_open", {
        format: "freestyle",
        bothPhotosSubmitted: true,
      }),
    ).toBe(true);
  });

  it("blocks finalisation when an incident is unresolved", () => {
    expect(
      canTransitionHeat("judging_closed", "finalized", {
        format: "freestyle",
        requiredBallotsComplete: true,
        unresolvedIncident: true,
      }),
    ).toBe(false);
    expect(() =>
      assertHeatTransition("judging_closed", "finalized", {
        format: "freestyle",
        requiredBallotsComplete: true,
        unresolvedIncident: false,
      }),
    ).not.toThrow();
  });

  it("treats paused and restart_pending as active", () => {
    expect(isActiveHeatState("paused")).toBe(true);
    expect(isActiveHeatState("restart_pending")).toBe(true);
    expect(isActiveHeatState("finalized")).toBe(false);
    expect(isActiveHeatState("scheduled")).toBe(false);
  });

  it("rejects a second concurrent heat", () => {
    expect(() =>
      assertCanStartHeat({ existingActiveHeatId: "h1", nextHeatId: "h2" }),
     ).toThrow(/already active/i);
    expect(() =>
      assertCanStartHeat({ existingActiveHeatId: "h1", nextHeatId: "h1" }),
    ).not.toThrow();
  });
});
