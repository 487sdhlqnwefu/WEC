/**
 * Barista League 2026 format as published by TBL:
 * Concept + Service together are 62%; Product is 38%.
 * Concept and Service are weighted equally (31% each).
 *
 * Judges score each pillar 0–10. The weighted total is 0–100.
 * Event rank uses the mean of submitted judge totals.
 */

export const SCORING_FORMAT_ID = "barista_league_2026" as const;

export const PILLAR_WEIGHTS = {
  concept: 0.31,
  service: 0.31,
  product: 0.38,
} as const;

export type Pillar = keyof typeof PILLAR_WEIGHTS;

export const PILLARS: Pillar[] = ["concept", "service", "product"];

export const SCORE_MIN = 0;
export const SCORE_MAX = 10;
export const SCORE_STEP = 0.5;

export type PillarScores = {
  concept: number;
  service: number;
  product: number;
};

export type WeightedScore = PillarScores & {
  total: number;
  breakdown: { pillar: Pillar; raw: number; weighted: number }[];
};

export function isValidPillarScore(value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if (value < SCORE_MIN || value > SCORE_MAX) return false;
  const steps = value / SCORE_STEP;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

export function weightedTotal(scores: PillarScores): WeightedScore {
  for (const pillar of PILLARS) {
    if (!isValidPillarScore(scores[pillar])) {
      throw new Error(`Invalid ${pillar} score: ${scores[pillar]}`);
    }
  }

  const breakdown = PILLARS.map((pillar) => ({
    pillar,
    raw: scores[pillar],
    weighted: round2(scores[pillar] * PILLAR_WEIGHTS[pillar] * 10),
  }));

  const total = round2(breakdown.reduce((sum, row) => sum + row.weighted, 0));

  return {
    concept: scores.concept,
    service: scores.service,
    product: scores.product,
    total,
    breakdown,
  };
}

export type TeamStanding = {
  teamId: string;
  judgeCount: number;
  meanTotal: number;
  meanConcept: number;
  meanService: number;
  meanProduct: number;
  rank: number;
};

export function rankTeams(
  teamIds: string[],
  cards: { teamId: string; scores: PillarScores }[],
): TeamStanding[] {
  const byTeam = new Map<string, WeightedScore[]>();
  for (const id of teamIds) byTeam.set(id, []);

  for (const card of cards) {
    const list = byTeam.get(card.teamId);
    if (!list) continue;
    list.push(weightedTotal(card.scores));
  }

  const standings: Omit<TeamStanding, "rank">[] = teamIds.map((teamId) => {
    const list = byTeam.get(teamId) ?? [];
    if (list.length === 0) {
      return {
        teamId,
        judgeCount: 0,
        meanTotal: 0,
        meanConcept: 0,
        meanService: 0,
        meanProduct: 0,
      };
    }
    const n = list.length;
    return {
      teamId,
      judgeCount: n,
      meanTotal: round2(list.reduce((s, x) => s + x.total, 0) / n),
      meanConcept: round2(list.reduce((s, x) => s + x.concept, 0) / n),
      meanService: round2(list.reduce((s, x) => s + x.service, 0) / n),
      meanProduct: round2(list.reduce((s, x) => s + x.product, 0) / n),
    };
  });

  standings.sort((a, b) => {
    if (b.meanTotal !== a.meanTotal) return b.meanTotal - a.meanTotal;
    if (b.judgeCount !== a.judgeCount) return b.judgeCount - a.judgeCount;
    return a.teamId.localeCompare(b.teamId);
  });

  return standings.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export const SPONSORED_EVENT_FEE_USD = 150;
