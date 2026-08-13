import { describe, expect, it } from "vitest";
import {
  assignSeeds,
  generateSingleElimination,
  heatCountForField,
  nextPowerOfTwo,
  nextSlotForWinner,
  roundDisplayName,
  standardSeedOrder,
} from "./bracket";

const FIELD_SIZES = [8, 9, 15, 16, 31, 32, 63, 64, 127, 128] as const;

describe("nextPowerOfTwo", () => {
  it("returns the same value for powers of two", () => {
    expect(nextPowerOfTwo(8)).toBe(8);
    expect(nextPowerOfTwo(16)).toBe(16);
    expect(nextPowerOfTwo(128)).toBe(128);
  });
  it("rounds non-powers up", () => {
    expect(nextPowerOfTwo(9)).toBe(16);
    expect(nextPowerOfTwo(15)).toBe(16);
    expect(nextPowerOfTwo(31)).toBe(32);
    expect(nextPowerOfTwo(33)).toBe(64);
    expect(nextPowerOfTwo(127)).toBe(128);
  });
});

describe("standardSeedOrder", () => {
  it("places 1 vs last in the first pairing", () => {
    const order = standardSeedOrder(8);
    expect(order[0]).toBe(1);
    expect(order[1]).toBe(8);
  });
  it("contains each seed once", () => {
    for (const size of [8, 16, 32, 64, 128]) {
      const order = standardSeedOrder(size);
      expect(new Set(order).size).toBe(size);
      expect(order).toHaveLength(size);
    }
  });
});

describe("generateSingleElimination", () => {
  it.each(FIELD_SIZES)("builds a valid bracket for %i entries", (fieldSize) => {
    const bracket = generateSingleElimination(fieldSize);
    expect(bracket.fieldSize).toBe(fieldSize);
    expect(bracket.bracketSize).toBe(nextPowerOfTwo(fieldSize));
    expect(bracket.byeCount).toBe(bracket.bracketSize - fieldSize);
    expect(bracket.roundCount).toBe(Math.log2(bracket.bracketSize));
    expect(heatCountForField(fieldSize)).toBe(fieldSize - 1);

    const round1 = bracket.nodes.filter((n) => n.roundNumber === 1);
    expect(round1).toHaveLength(bracket.bracketSize / 2);
    const heats = round1.filter((n) => n.needsHeat);
    const byes = round1.filter((n) => Boolean(n.byeSeed));
    expect(heats.length).toBe(fieldSize - bracket.bracketSize / 2);
    expect(byes.length).toBe(bracket.byeCount);

    const seeded = new Set<number>();
    for (const node of round1) {
      if (node.seedA) seeded.add(node.seedA);
      if (node.seedB) seeded.add(node.seedB);
      if (node.needsHeat) {
        expect(node.seedA).not.toBeNull();
        expect(node.seedB).not.toBeNull();
        expect(node.isBye).toBe(false);
      }
    }
    expect(seeded.size).toBe(fieldSize);
    for (let s = 1; s <= fieldSize; s += 1) {
      expect(seeded.has(s)).toBe(true);
    }

    const final = bracket.nodes.filter((n) => n.roundNumber === bracket.roundCount);
    expect(final).toHaveLength(1);
    expect(roundDisplayName(bracket.roundCount, bracket.roundCount)).toBe("Final");
  });

  it("gives 7 byes and 1 opening heat for a 9-entry field", () => {
    const bracket = generateSingleElimination(9);
    const round1 = bracket.nodes.filter((n) => n.roundNumber === 1);
    expect(round1.filter((n) => n.needsHeat)).toHaveLength(1);
    expect(round1.filter((n) => n.byeSeed)).toHaveLength(7);
    expect(bracket.byeCount).toBe(7);
  });

  it("has no byes for power-of-two fields", () => {
    for (const size of [8, 16, 32, 64, 128]) {
      const bracket = generateSingleElimination(size);
      expect(bracket.byeCount).toBe(0);
      expect(bracket.nodes.filter((n) => n.roundNumber === 1 && n.needsHeat)).toHaveLength(size / 2);
    }
  });

  it("advances winners into the next slot once", () => {
    const slot = nextSlotForWinner(1, 1, 3);
    expect(slot.nextRound).toBe(2);
    expect(slot.nextMatch).toBe(1);
    expect(slot.nextSlot).toBe("A");
    const other = nextSlotForWinner(1, 2, 3);
    expect(other.nextMatch).toBe(1);
    expect(other.nextSlot).toBe("B");
    expect(nextSlotForWinner(3, 1, 3).nextRound).toBeNull();
  });

  it("rejects field sizes outside 8–128", () => {
    expect(() => generateSingleElimination(7)).toThrow(/8/);
    expect(() => generateSingleElimination(129)).toThrow(/128/);
  });
});

describe("assignSeeds", () => {
  const entries = [1, 2, 3, 8].map((n) => ({ id: `e${n}` }));
  it("uses shuffle for random seeding", () => {
    const map = assignSeeds(entries, "random", (items) => [...items].reverse());
    expect(map.get(1)).toBe("e8");
    expect(map.size).toBe(4);
  });
  it("honours manual order", () => {
    const map = assignSeeds(entries, "manual", (i) => i, ["e3", "e2", "e1", "e8"]);
    expect([...map.values()]).toEqual(["e3", "e2", "e1", "e8"]);
  });
});
