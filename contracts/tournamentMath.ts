import {
  CATEGORY_POINTS,
  type CategoryBallot,
  type CupSide,
  WIN_THRESHOLD,
  POINTS_PER_JUDGE,
} from "./scoring";

export type ScoreBreakdown = {
  tactile: number;
  taste: number;
  flavour: number;
  total: number;
};

export type MatchScoreResult = {
  scoreA: ScoreBreakdown;
  scoreB: ScoreBreakdown;
  winnerSide: CupSide | "tie";
  meetsThreshold: boolean;
};

/** Award category points from one judge ballot to cup A / B totals. */
export function applyBallot(
  ballot: CategoryBallot,
  scoreA: ScoreBreakdown,
  scoreB: ScoreBreakdown,
): void {
  const award = (side: CupSide, points: number) => {
    if (side === "A") scoreA.total += points;
    else scoreB.total += points;
  };

  if (ballot.tactile === "A") scoreA.tactile += CATEGORY_POINTS.tactile;
  else scoreB.tactile += CATEGORY_POINTS.tactile;
  award(ballot.tactile, CATEGORY_POINTS.tactile);

  if (ballot.taste === "A") scoreA.taste += CATEGORY_POINTS.taste;
  else scoreB.taste += CATEGORY_POINTS.taste;
  award(ballot.taste, CATEGORY_POINTS.taste);

  if (ballot.flavour === "A") scoreA.flavour += CATEGORY_POINTS.flavour;
  else scoreB.flavour += CATEGORY_POINTS.flavour;
  award(ballot.flavour, CATEGORY_POINTS.flavour);
}

export function emptyBreakdown(): ScoreBreakdown {
  return { tactile: 0, taste: 0, flavour: 0, total: 0 };
}

/** Aggregate 1–N complete judge ballots into match scores (v3). */
export function scoreMatch(ballots: CategoryBallot[]): MatchScoreResult {
  if (ballots.length === 0) {
    throw new Error("At least one complete ballot is required");
  }

  const scoreA = emptyBreakdown();
  const scoreB = emptyBreakdown();

  for (const ballot of ballots) {
    if (!ballot.tactile || !ballot.taste || !ballot.flavour) {
      throw new Error("Incomplete ballot rejected — all three categories required");
    }
    applyBallot(ballot, scoreA, scoreB);
  }

  let winnerSide: CupSide | "tie" = "tie";
  if (scoreA.total > scoreB.total) winnerSide = "A";
  else if (scoreB.total > scoreA.total) winnerSide = "B";

  const winnerTotal = Math.max(scoreA.total, scoreB.total);
  return {
    scoreA,
    scoreB,
    winnerSide,
    meetsThreshold: winnerTotal >= WIN_THRESHOLD,
  };
}

/** Points one judge awards to a single cup side from their ballot. */
export function pointsForSide(ballot: CategoryBallot, side: CupSide): number {
  let total = 0;
  if (ballot.tactile === side) total += CATEGORY_POINTS.tactile;
  if (ballot.taste === side) total += CATEGORY_POINTS.taste;
  if (ballot.flavour === side) total += CATEGORY_POINTS.flavour;
  return total;
}

export type BracketSeed = {
  seed: number;
  competitorId: number;
};

export type GeneratedMatch = {
  round: number;
  matchNumber: number;
  /** Competitor id or null (TBD from previous round) */
  competitorAId: number | null;
  competitorBId: number | null;
  /** Feeds into this match index in next round (0-based within round) */
  feedsMatchNumber: number | null;
};

/**
 * Classic single-elim seeding for power-of-2 fields.
 * Round 1 pairing: 1v32, 16v17, 8v25, 9v24, 4v29, 13v20, 5v28, 12v21,
 *                  2v31, 15v18, 7v26, 10v23, 3v30, 14v19, 6v27, 11v22
 */
export function standardBracketPairings(size: number): [number, number][] {
  if (size < 2 || (size & (size - 1)) !== 0) {
    throw new Error("Competitor count must be a power of 2");
  }

  // Build bracket positions via recursive seed placement
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

  const pairings: [number, number][] = [];
  for (let i = 0; i < positions.length; i += 2) {
    pairings.push([positions[i], positions[i + 1]]);
  }
  return pairings;
}

/**
 * Generate all matches for a single-elim tournament.
 * Round 1 has competitor IDs; later rounds have null until winners advance.
 */
export function generateBracket(
  competitorIdsBySeed: Map<number, number>,
  size = 32,
): GeneratedMatch[] {
  const pairings = standardBracketPairings(size);
  const matches: GeneratedMatch[] = [];
  const rounds = Math.log2(size);

  // Round 1
  pairings.forEach(([seedA, seedB], index) => {
    const competitorAId = competitorIdsBySeed.get(seedA) ?? null;
    const competitorBId = competitorIdsBySeed.get(seedB) ?? null;
    matches.push({
      round: 1,
      matchNumber: index + 1,
      competitorAId,
      competitorBId,
      feedsMatchNumber: Math.floor(index / 2) + 1,
    });
  });

  // Later rounds
  let matchesInRound = size / 2;
  for (let round = 2; round <= rounds; round++) {
    matchesInRound = matchesInRound / 2;
    for (let m = 1; m <= matchesInRound; m++) {
      matches.push({
        round,
        matchNumber: m,
        competitorAId: null,
        competitorBId: null,
        feedsMatchNumber: round < rounds ? Math.floor((m - 1) / 2) + 1 : null,
      });
    }
  }

  return matches;
}

/** Randomly assign which competitor is Cup A vs Cup B for blind service. */
export function assignBlindCups(
  competitorAId: number,
  competitorBId: number,
  random: () => number = Math.random,
): { cupACompetitorId: number; cupBCompetitorId: number } {
  if (random() < 0.5) {
    return { cupACompetitorId: competitorAId, cupBCompetitorId: competitorBId };
  }
  return { cupACompetitorId: competitorBId, cupBCompetitorId: competitorAId };
}

export function nextRoundSlot(
  round: number,
  matchNumber: number,
): { round: number; matchNumber: number; slot: "A" | "B" } | null {
  const rounds = 5; // 32-field
  if (round >= rounds) return null;
  return {
    round: round + 1,
    matchNumber: Math.floor((matchNumber - 1) / 2) + 1,
    slot: matchNumber % 2 === 1 ? "A" : "B",
  };
}

export { POINTS_PER_JUDGE, WIN_THRESHOLD };
