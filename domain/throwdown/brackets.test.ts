import { describe, expect, it } from "vitest";
import { assignRandomSeeds, generateSingleEliminationBracket, nextPowerOfTwo } from "./brackets";
import { classifyCompetitorCount } from "./tiers";

function entries(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    entryId: `e${i + 1}`,
    seed: i + 1,
  }));
}

describe("free throwdown brackets", () => {
  it("2-person free final", () => {
    const bracket = generateSingleEliminationBracket(entries(2));
    expect(bracket.size).toBe(2);
    expect(bracket.byeCount).toBe(0);
    expect(bracket.heats).toHaveLength(1);
    expect(bracket.heats[0]!.label).toBe("Final");
    expect(bracket.heats[0]!.competitorEntryIds).toEqual(["e1", "e2"]);
  });

  it("3-person free bracket with one random bye", () => {
    const seeds = assignRandomSeeds(["a", "b", "c"], () => 0.2);
    expect(seeds.map((s) => s.seed).sort()).toEqual([1, 2, 3]);
    const bracket = generateSingleEliminationBracket(seeds);
    expect(bracket.size).toBe(4);
    expect(bracket.byeCount).toBe(1);
    expect(bracket.byeAssignments).toHaveLength(1);
    const semis = bracket.heats.filter((h) => h.roundName === "Semifinal");
    expect(semis).toHaveLength(2);
    expect(semis.filter((h) => h.isBye)).toHaveLength(1);
    expect(bracket.heats.some((h) => h.label === "Final")).toBe(true);
  });

  it("4-person free bracket", () => {
    const bracket = generateSingleEliminationBracket(entries(4));
    expect(bracket.byeCount).toBe(0);
    expect(bracket.heats.filter((h) => h.roundName === "Semifinal")).toHaveLength(2);
    expect(bracket.heats.filter((h) => h.label === "Final")).toHaveLength(1);
  });
});

describe("premium brackets", () => {
  it("rejects 5–7 competitors", () => {
    expect(classifyCompetitorCount(5).ok).toBe(false);
    expect(classifyCompetitorCount(6).ok).toBe(false);
    expect(classifyCompetitorCount(7).ok).toBe(false);
    if (!classifyCompetitorCount(5).ok) {
      expect(classifyCompetitorCount(5).code).toBe("unavailable_5_to_7");
    }
  });

  it("8-person premium uses a full round of 8", () => {
    const bracket = generateSingleEliminationBracket(entries(8));
    expect(bracket.size).toBe(8);
    expect(bracket.byeCount).toBe(0);
    expect(bracket.heats.filter((h) => h.roundIndex === 0)).toHaveLength(4);
  });

  it("non-power-of-two premium roster creates fair byes", () => {
    const bracket = generateSingleEliminationBracket(entries(10));
    expect(nextPowerOfTwo(10)).toBe(16);
    expect(bracket.size).toBe(16);
    expect(bracket.byeCount).toBe(6);
    expect(bracket.byeAssignments).toHaveLength(6);
    const firstRound = bracket.heats.filter((h) => h.roundIndex === 0);
    expect(firstRound.filter((h) => h.isBye)).toHaveLength(6);
    expect(firstRound.every((h) => !(h.competitorEntryIds[0] == null && h.competitorEntryIds[1] == null))).toBe(
      true,
    );
  });
});
