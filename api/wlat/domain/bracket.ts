import { FIELD_MAX, FIELD_MIN } from "./constants";
import { badRequest } from "./errors";

export function nextPowerOfTwo(n: number): number {
  if (n < 1) throw badRequest("INVALID_FIELD", "Field size must be at least 1.");
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function assertFieldSize(n: number): void {
  if (!Number.isInteger(n) || n < FIELD_MIN || n > FIELD_MAX) {
    throw badRequest(
      "INVALID_FIELD",
      `Field size must be an integer from ${FIELD_MIN} to ${FIELD_MAX}.`,
    );
  }
}

/**
 * Classic single-elimination seed placement.
 * Returns an array of seed numbers in bracket order (pairs are adjacent).
 */
export function standardSeedOrder(bracketSize: number): number[] {
  if (bracketSize < 2 || (bracketSize & (bracketSize - 1)) !== 0) {
    throw badRequest("INVALID_BRACKET", "Bracket size must be a power of two.");
  }
  const positions: number[] = [1, 2];
  while (positions.length < bracketSize) {
    const next: number[] = [];
    const half = positions.length * 2;
    for (const seed of positions) {
      next.push(seed);
      next.push(half + 1 - seed);
    }
    positions.length = 0;
    positions.push(...next);
  }
  return positions;
}

export type BracketNodePlan = {
  key: string;
  roundNumber: number;
  matchNumber: number;
  sourceKeyA: string | null;
  sourceKeyB: string | null;
  seedA: number | null;
  seedB: number | null;
  isBye: boolean;
  byeSeed: number | null;
  /** Round-1 matches that are real heats (two competitors). */
  needsHeat: boolean;
};

export type GeneratedBracket = {
  fieldSize: number;
  bracketSize: number;
  byeCount: number;
  roundCount: number;
  nodes: BracketNodePlan[];
};

function nodeKey(round: number, match: number): string {
  return `r${round}m${match}`;
}

/**
 * Generate a single-elimination bracket for any field size 8–128.
 * Non-power-of-two fields receive automatic byes distributed from seed order:
 * empty high seeds (bracketSize down) produce byes for the remaining opponent.
 */
export function generateSingleElimination(fieldSize: number): GeneratedBracket {
  assertFieldSize(fieldSize);
  const bracketSize = nextPowerOfTwo(fieldSize);
  const byeCount = bracketSize - fieldSize;
  const roundCount = Math.log2(bracketSize);
  const seedOrder = standardSeedOrder(bracketSize);
  const nodes: BracketNodePlan[] = [];

  const round1Matches = bracketSize / 2;
  for (let m = 1; m <= round1Matches; m += 1) {
    const seedA = seedOrder[(m - 1) * 2]!;
    const seedB = seedOrder[(m - 1) * 2 + 1]!;
    const aPresent = seedA <= fieldSize;
    const bPresent = seedB <= fieldSize;
    const isBye = aPresent !== bPresent;
    const bothMissing = !aPresent && !bPresent;
    nodes.push({
      key: nodeKey(1, m),
      roundNumber: 1,
      matchNumber: m,
      sourceKeyA: null,
      sourceKeyB: null,
      seedA: aPresent ? seedA : null,
      seedB: bPresent ? seedB : null,
      isBye: isBye || bothMissing,
      byeSeed: isBye ? (aPresent ? seedA : seedB) : null,
      needsHeat: aPresent && bPresent,
    });
  }

  let matchesInRound = round1Matches;
  for (let round = 2; round <= roundCount; round += 1) {
    matchesInRound = matchesInRound / 2;
    for (let m = 1; m <= matchesInRound; m += 1) {
      const sourceA = nodeKey(round - 1, (m - 1) * 2 + 1);
      const sourceB = nodeKey(round - 1, (m - 1) * 2 + 2);
      nodes.push({
        key: nodeKey(round, m),
        roundNumber: round,
        matchNumber: m,
        sourceKeyA: sourceA,
        sourceKeyB: sourceB,
        seedA: null,
        seedB: null,
        isBye: false,
        byeSeed: null,
        needsHeat: true,
      });
    }
  }

  return { fieldSize, bracketSize, byeCount, roundCount, nodes };
}

export function roundDisplayName(roundNumber: number, roundCount: number): string {
  const fromFinal = roundCount - roundNumber;
  if (fromFinal === 0) return "Final";
  if (fromFinal === 1) return "Semi-final";
  if (fromFinal === 2) return "Quarter-final";
  return `Round of ${2 ** (fromFinal + 1)}`;
}

export type Advancement = {
  winnerEntryId: string;
  nextRound: number | null;
  nextMatch: number | null;
  nextSlot: "A" | "B" | null;
};

export function nextSlotForWinner(
  roundNumber: number,
  matchNumber: number,
  roundCount: number,
): Advancement {
  if (roundNumber >= roundCount) {
    return { winnerEntryId: "", nextRound: null, nextMatch: null, nextSlot: null };
  }
  return {
    winnerEntryId: "",
    nextRound: roundNumber + 1,
    nextMatch: Math.floor((matchNumber - 1) / 2) + 1,
    nextSlot: matchNumber % 2 === 1 ? "A" : "B",
  };
}

export function heatCountForField(fieldSize: number): number {
  assertFieldSize(fieldSize);
  return fieldSize - 1;
}

export function assignSeeds<T extends { id: string }>(
  entries: T[],
  method: "random" | "manual" | "imported",
  shuffle: (items: T[]) => T[],
  manualOrder?: string[],
): Map<number, string> {
  const map = new Map<number, string>();
  let ordered: T[];
  if (method === "manual" || method === "imported") {
    if (!manualOrder || manualOrder.length !== entries.length) {
      throw badRequest("INVALID_SEEDS", "Manual seed order must include every entry once.");
    }
    const byId = new Map(entries.map((e) => [e.id, e]));
    ordered = manualOrder.map((id) => {
      const entry = byId.get(id);
      if (!entry) throw badRequest("INVALID_SEEDS", "Unknown entry in seed order.");
      return entry;
    });
  } else {
    ordered = shuffle([...entries]);
  }
  ordered.forEach((entry, index) => {
    map.set(index + 1, entry.id);
  });
  return map;
}
