import { PREMIUM_COMPETITOR_HARD_CEILING } from "./constants";
import type { BracketCompetitor, GeneratedBracket, GeneratedHeat } from "./types";

export function nextPowerOfTwo(n: number): number {
  if (n < 2) return 2;
  let size = 2;
  while (size < n) size *= 2;
  return size;
}

export function roundName(matchesInRound: number, isFinal = matchesInRound === 1): string {
  if (isFinal || matchesInRound === 1) return "Final";
  if (matchesInRound === 2) return "Semifinal";
  if (matchesInRound === 4) return "Quarterfinal";
  return `Round of ${matchesInRound * 2}`;
}

/**
 * Standard single-elimination seed placement.
 * Positions grow by pairing each seed with (size + 1 - seed).
 */
export function standardSeedPositions(size: number): number[] {
  if (size < 2 || (size & (size - 1)) !== 0) {
    throw new Error("Bracket size must be a power of two.");
  }
  if (size > PREMIUM_COMPETITOR_HARD_CEILING) {
    throw new Error("Bracket size exceeds the engine ceiling.");
  }
  const positions: number[] = [1, 2];
  while (positions.length < size) {
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

function heatLabel(name: string, position: number, matchesInRound: number): string {
  if (matchesInRound === 1) return "Final";
  return `${name} ${position + 1}`;
}

export function generateSingleEliminationBracket(
  competitors: BracketCompetitor[],
): GeneratedBracket {
  if (competitors.length < 2) {
    throw new Error("A bracket requires at least two competitors.");
  }
  const unique = new Set(competitors.map((c) => c.entryId));
  if (unique.size !== competitors.length) {
    throw new Error("Each competitor may appear only once in a bracket.");
  }

  const sorted = [...competitors].sort((a, b) => a.seed - b.seed);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i]!.seed !== i + 1) {
      throw new Error("Seeds must be contiguous starting at 1.");
    }
  }

  const size = nextPowerOfTwo(sorted.length);
  const byeCount = size - sorted.length;
  const bySeed = new Map(sorted.map((c) => [c.seed, c]));
  const positions = standardSeedPositions(size);

  const heats: GeneratedHeat[] = [];
  const byeAssignments: GeneratedBracket["byeAssignments"] = [];

  const firstRoundMatches = size / 2;
  const firstRoundName = roundName(firstRoundMatches);

  for (let i = 0; i < firstRoundMatches; i++) {
    const seedA = positions[i * 2]!;
    const seedB = positions[i * 2 + 1]!;
    const entryA = bySeed.get(seedA)?.entryId ?? null;
    const entryB = bySeed.get(seedB)?.entryId ?? null;
    const isBye = !entryA || !entryB;
    if (!entryA && !entryB) {
      throw new Error("Two bye positions were paired. Reseed to avoid this.");
    }
    const byeEntryId = isBye ? (entryA ?? entryB) : null;
    if (isBye && byeEntryId) {
      const comp = sorted.find((c) => c.entryId === byeEntryId)!;
      byeAssignments.push({
        entryId: byeEntryId,
        seed: comp.seed,
        roundName: firstRoundName,
      });
    }
    heats.push({
      roundIndex: 0,
      roundName: firstRoundName,
      position: i,
      label: heatLabel(firstRoundName, i, firstRoundMatches),
      competitorEntryIds: [entryA, entryB],
      isBye,
      byeEntryId,
      feedsRoundIndex: firstRoundMatches === 1 ? null : 1,
      feedsPosition: firstRoundMatches === 1 ? null : Math.floor(i / 2),
      feedsSlot: firstRoundMatches === 1 ? null : i % 2 === 0 ? 0 : 1,
    });
  }

  let matchesInRound = firstRoundMatches / 2;
  let roundIndex = 1;
  while (matchesInRound >= 1) {
    const name = roundName(matchesInRound);
    for (let i = 0; i < matchesInRound; i++) {
      heats.push({
        roundIndex,
        roundName: name,
        position: i,
        label: heatLabel(name, i, matchesInRound),
        competitorEntryIds: [null, null],
        isBye: false,
        byeEntryId: null,
        feedsRoundIndex: matchesInRound === 1 ? null : roundIndex + 1,
        feedsPosition: matchesInRound === 1 ? null : Math.floor(i / 2),
        feedsSlot: matchesInRound === 1 ? null : i % 2 === 0 ? 0 : 1,
      });
    }
    if (matchesInRound === 1) break;
    matchesInRound /= 2;
    roundIndex += 1;
  }

  return { size, byeCount, heats, byeAssignments };
}

export function assignRandomSeeds(entryIds: string[], random: () => number = Math.random): BracketCompetitor[] {
  const shuffled = [...entryIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.map((entryId, index) => ({ entryId, seed: index + 1 }));
}
