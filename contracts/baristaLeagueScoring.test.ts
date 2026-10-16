import { describe, expect, it } from "vitest";
import {
  PILLAR_WEIGHTS,
  isValidPillarScore,
  rankTeams,
  weightedTotal,
} from "./baristaLeagueScoring";

describe("TBL 2026 weights", () => {
  it("gives Concept + Service 62% and Product 38%", () => {
    expect(PILLAR_WEIGHTS.concept + PILLAR_WEIGHTS.service).toBeCloseTo(0.62, 8);
    expect(PILLAR_WEIGHTS.product).toBeCloseTo(0.38, 8);
    expect(PILLAR_WEIGHTS.concept).toBeCloseTo(PILLAR_WEIGHTS.service, 8);
  });
});

describe("weightedTotal", () => {
  it("maps a perfect 10/10/10 card to 100", () => {
    const result = weightedTotal({ concept: 10, service: 10, product: 10 });
    expect(result.total).toBe(100);
    expect(result.breakdown.find((b) => b.pillar === "product")?.weighted).toBe(38);
    expect(result.breakdown.find((b) => b.pillar === "concept")?.weighted).toBe(31);
  });

  it("weights product more than a single experience pillar", () => {
    const highProduct = weightedTotal({ concept: 5, service: 5, product: 10 });
    const highConcept = weightedTotal({ concept: 10, service: 5, product: 5 });
    expect(highProduct.total).toBeGreaterThan(highConcept.total);
  });

  it("rejects scores outside 0–10 half-points", () => {
    expect(isValidPillarScore(7.5)).toBe(true);
    expect(isValidPillarScore(7.25)).toBe(false);
    expect(() =>
      weightedTotal({ concept: 11, service: 5, product: 5 }),
    ).toThrow(/Invalid concept/);
  });
});

describe("rankTeams", () => {
  it("averages judges and ranks the higher mean first", () => {
    const standings = rankTeams(
      ["alpha", "bravo"],
      [
        { teamId: "alpha", scores: { concept: 8, service: 7, product: 6 } },
        { teamId: "alpha", scores: { concept: 6, service: 7, product: 8 } },
        { teamId: "bravo", scores: { concept: 9, service: 9, product: 9 } },
      ],
    );
    expect(standings[0].teamId).toBe("bravo");
    expect(standings[0].rank).toBe(1);
    expect(standings[1].teamId).toBe("alpha");
    expect(standings[1].meanConcept).toBe(7);
    expect(standings[1].judgeCount).toBe(2);
  });

  it("keeps teams with no cards at the bottom with zero means", () => {
    const standings = rankTeams(["scored", "waiting"], [
      { teamId: "scored", scores: { concept: 8, service: 8, product: 8 } },
    ]);
    expect(standings[1].teamId).toBe("waiting");
    expect(standings[1].judgeCount).toBe(0);
    expect(standings[1].meanTotal).toBe(0);
  });
});
