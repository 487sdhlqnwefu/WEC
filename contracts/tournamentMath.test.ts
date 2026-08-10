import { describe, expect, it } from "vitest";
import {
  CATEGORY_POINTS,
  MAX_MATCH_POINTS,
  POINTS_PER_JUDGE,
  WIN_THRESHOLD,
} from "./scoring";
import {
  assignBlindCups,
  generateBracket,
  pointsForSide,
  scoreMatch,
  standardBracketPairings,
} from "./tournamentMath";

describe("scoring v3 constants", () => {
  it("weights tactile / taste / flavour correctly", () => {
    expect(CATEGORY_POINTS.tactile).toBe(15);
    expect(CATEGORY_POINTS.taste).toBe(10);
    expect(CATEGORY_POINTS.flavour).toBe(8);
    expect(POINTS_PER_JUDGE).toBe(33);
    expect(MAX_MATCH_POINTS).toBe(99);
    expect(WIN_THRESHOLD).toBe(50);
  });
});

describe("scoreMatch", () => {
  it("awards full sweep to cup A across 3 judges", () => {
    const ballot = { tactile: "A" as const, taste: "A" as const, flavour: "A" as const };
    const result = scoreMatch([ballot, ballot, ballot]);
    expect(result.scoreA.total).toBe(99);
    expect(result.scoreB.total).toBe(0);
    expect(result.winnerSide).toBe("A");
    expect(result.meetsThreshold).toBe(true);
  });

  it("lets tactile+taste dominate flavour (philosophy check)", () => {
    // A wins tactile+taste every judge (75), B wins all flavour (24) → A has 75
    const ballots = [
      { tactile: "A" as const, taste: "A" as const, flavour: "B" as const },
      { tactile: "A" as const, taste: "A" as const, flavour: "B" as const },
      { tactile: "A" as const, taste: "A" as const, flavour: "B" as const },
    ];
    const result = scoreMatch(ballots);
    expect(result.scoreA.total).toBe(75);
    expect(result.scoreB.total).toBe(24);
    expect(result.winnerSide).toBe("A");
  });

  it("rejects incomplete ballots", () => {
    expect(() =>
      scoreMatch([
        { tactile: "A", taste: "A", flavour: undefined as unknown as "A" },
      ]),
    ).toThrow(/Incomplete/);
  });

  it("computes pointsForSide", () => {
    const ballot = { tactile: "A" as const, taste: "B" as const, flavour: "A" as const };
    expect(pointsForSide(ballot, "A")).toBe(23);
    expect(pointsForSide(ballot, "B")).toBe(10);
  });
});

describe("bracket generation", () => {
  it("pairs 32 seeds in standard single-elim order", () => {
    const pairings = standardBracketPairings(32);
    expect(pairings).toHaveLength(16);
    expect(pairings[0]).toEqual([1, 32]);
    // 1 and 2 should be on opposite halves
    const flat = pairings.flat();
    expect(flat).toHaveLength(32);
    expect(new Set(flat).size).toBe(32);
  });

  it("generates 31 matches for a 32-competitor field", () => {
    const seeds = new Map<number, number>();
    for (let s = 1; s <= 32; s++) seeds.set(s, 1000 + s);
    const matches = generateBracket(seeds, 32);
    expect(matches).toHaveLength(31);
    expect(matches.filter((m) => m.round === 1)).toHaveLength(16);
    expect(matches.filter((m) => m.round === 5)).toHaveLength(1);
    expect(matches.find((m) => m.round === 1 && m.matchNumber === 1)?.competitorAId).toBe(1001);
  });
});

describe("blind cups", () => {
  it("can flip cup assignment", () => {
    expect(assignBlindCups(1, 2, () => 0.1)).toEqual({
      cupACompetitorId: 1,
      cupBCompetitorId: 2,
    });
    expect(assignBlindCups(1, 2, () => 0.9)).toEqual({
      cupACompetitorId: 2,
      cupBCompetitorId: 1,
    });
  });
});
