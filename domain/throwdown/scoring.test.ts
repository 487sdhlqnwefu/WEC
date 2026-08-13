import { describe, expect, it } from "vitest";
import {
  CATEGORY_POINTS,
  POINTS_PER_JUDGE,
  WEC_V3_TOTAL_POINTS,
  WEC_V3_WIN_THRESHOLD,
} from "./constants";
import {
  assertJudgeCount,
  scoreSimpleAb,
  scoreWecV3,
  validateSimpleAbBallot,
  validateWecV3Ballot,
} from "./scoring";

const CUPS: [string, string] = ["K7MQ", "R2TN"];

describe("Official WEC Scoring v3", () => {
  it("awards 15/10/8 correctly per judge", () => {
    const result = scoreWecV3(
      [
        { tactile: "K7MQ", taste: "R2TN", flavour: "K7MQ" },
        { tactile: "K7MQ", taste: "K7MQ", flavour: "R2TN" },
        { tactile: "R2TN", taste: "K7MQ", flavour: "K7MQ" },
      ],
      CUPS,
    );
    const a = result.totals.find((t) => t.cupCode === "K7MQ")!;
    const b = result.totals.find((t) => t.cupCode === "R2TN")!;
    expect(a.tactile).toBe(30);
    expect(a.taste).toBe(20);
    expect(a.flavour).toBe(16);
    expect(a.total).toBe(66);
    expect(b.total).toBe(33);
    expect(result.winnerCupCode).toBe("K7MQ");
    expect(CATEGORY_POINTS.tactile).toBe(15);
    expect(CATEGORY_POINTS.taste).toBe(10);
    expect(CATEGORY_POINTS.flavour).toBe(8);
    expect(POINTS_PER_JUDGE).toBe(33);
  });

  it("three complete ballots total 99 points", () => {
    const sweep = { tactile: "K7MQ", taste: "K7MQ", flavour: "K7MQ" } as const;
    const result = scoreWecV3([sweep, sweep, sweep], CUPS);
    expect(result.totalPointsAwarded).toBe(WEC_V3_TOTAL_POINTS);
    expect(result.totals.find((t) => t.cupCode === "K7MQ")!.total).toBe(99);
  });

  it("a cup with 50+ wins", () => {
    const ballots = [
      { tactile: "K7MQ", taste: "K7MQ", flavour: "R2TN" },
      { tactile: "K7MQ", taste: "R2TN", flavour: "K7MQ" },
      { tactile: "R2TN", taste: "K7MQ", flavour: "K7MQ" },
    ];
    const result = scoreWecV3(ballots, CUPS);
    const winner = result.totals.find((t) => t.cupCode === result.winnerCupCode)!;
    expect(winner.total).toBeGreaterThanOrEqual(WEC_V3_WIN_THRESHOLD);
  });

  it("cannot run with 1 or 5 judges", () => {
    expect(() => assertJudgeCount("wec_v3", 1)).toThrow(/exactly 3/);
    expect(() => assertJudgeCount("wec_v3", 5)).toThrow(/exactly 3/);
    const one = [{ tactile: "K7MQ", taste: "K7MQ", flavour: "K7MQ" }];
    expect(() => scoreWecV3(one, CUPS)).toThrow(/exactly 3/);
  });

  it("incomplete ballots cannot submit", () => {
    expect(() =>
      validateWecV3Ballot({ tactile: "K7MQ", taste: "", flavour: "K7MQ" }, CUPS),
    ).toThrow(/All three category/);
  });
});

describe("Simple Blind A/B", () => {
  it("accepts only 1, 3, or 5 judges", () => {
    expect(() => assertJudgeCount("simple_ab", 1)).not.toThrow();
    expect(() => assertJudgeCount("simple_ab", 3)).not.toThrow();
    expect(() => assertJudgeCount("simple_ab", 5)).not.toThrow();
    expect(() => assertJudgeCount("simple_ab", 2)).toThrow(/1, 3, or 5/);
    expect(() => assertJudgeCount("simple_ab", 4)).toThrow(/1, 3, or 5/);
  });

  it("computes majority correctly", () => {
    const result = scoreSimpleAb(
      [{ choice: "K7MQ" }, { choice: "R2TN" }, { choice: "K7MQ" }],
      CUPS,
    );
    expect(result.winnerCupCode).toBe("K7MQ");
    expect(result.totals.find((t) => t.cupCode === "K7MQ")!.votes).toBe(2);
  });

  it("single judge awards the heat", () => {
    expect(scoreSimpleAb([{ choice: "R2TN" }], CUPS).winnerCupCode).toBe("R2TN");
  });

  it("rejects an incomplete choice", () => {
    expect(() => validateSimpleAbBallot({ choice: "" }, CUPS)).toThrow(/required/);
  });
});
