import { describe, expect, it } from "vitest";
import {
  buildSegments,
  pickWeightedOption,
  randomInt,
  rotationForWinner,
} from "./decisionMath";
import type { DecisionOption } from "@/types/decisions";

const options: DecisionOption[] = [
  { id: "a", label: "A", weight: 1 },
  { id: "b", label: "B", weight: 3 },
  { id: "c", label: "C", weight: 0 },
];

describe("buildSegments", () => {
  it("allocates sweeps by weight", () => {
    const segments = buildSegments(options, false);
    expect(segments).toHaveLength(3);
    const total = segments.reduce((s, seg) => s + seg.sweep, 0);
    expect(total).toBeCloseTo(360, 5);
    // weights 1+3+1 = 5 (0 becomes 1)
    expect(segments[0].sweep).toBeCloseTo(72, 5);
    expect(segments[1].sweep).toBeCloseTo(216, 5);
    expect(segments[2].sweep).toBeCloseTo(72, 5);
  });

  it("uses equal display sweeps when hideWeights is true", () => {
    const segments = buildSegments(options, true);
    expect(segments[0].displaySweep).toBeCloseTo(120, 5);
    expect(segments[1].displaySweep).toBeCloseTo(120, 5);
    expect(segments[2].displaySweep).toBeCloseTo(120, 5);
    // true weights still differ
    expect(segments[1].sweep).toBeGreaterThan(segments[0].sweep);
  });
});

describe("pickWeightedOption", () => {
  it("never returns excluded options", () => {
    for (let i = 0; i < 40; i++) {
      const pick = pickWeightedOption(options, ["b", "c"]);
      expect(pick?.id).toBe("a");
    }
  });

  it("returns null when all excluded", () => {
    expect(pickWeightedOption(options, ["a", "b", "c"])).toBeNull();
  });
});

describe("rotationForWinner", () => {
  it("increases rotation by several full spins", () => {
    const segments = buildSegments(options, false);
    const next = rotationForWinner(segments, "b", 10);
    expect(next).toBeGreaterThan(10 + 360 * 4);
  });
});

describe("randomInt", () => {
  it("stays within inclusive bounds", () => {
    for (let i = 0; i < 50; i++) {
      const n = randomInt(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
  });
});
