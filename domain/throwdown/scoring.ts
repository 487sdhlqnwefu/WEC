import {
  CATEGORY_POINTS,
  POINTS_PER_JUDGE,
  SIMPLE_AB_ALLOWED_JUDGE_COUNTS,
  WEC_V3_JUDGE_COUNT,
  WEC_V3_TOTAL_POINTS,
  WEC_V3_WIN_THRESHOLD,
  type JudgingFormat,
  type SimpleAbJudgeCount,
} from "./constants";
import type { CupCode, HeatScoreResult, ScoreBreakdown, SimpleAbBallotInput, WecV3BallotInput } from "./types";

export function assertWecV3JudgeCount(count: number): void {
  if (count !== WEC_V3_JUDGE_COUNT) {
    throw new Error(
      `Official WEC Scoring v3 requires exactly ${WEC_V3_JUDGE_COUNT} judges per heat. ${count} is not permitted.`,
    );
  }
}

export function assertSimpleAbJudgeCount(count: number): asserts count is SimpleAbJudgeCount {
  if (!(SIMPLE_AB_ALLOWED_JUDGE_COUNTS as readonly number[]).includes(count)) {
    throw new Error(
      `Simple Blind A/B requires exactly 1, 3, or 5 judges per heat. ${count} is not permitted.`,
    );
  }
}

export function assertJudgeCount(format: JudgingFormat, count: number): void {
  if (format === "wec_v3") assertWecV3JudgeCount(count);
  else assertSimpleAbJudgeCount(count);
}

export function validateWecV3Ballot(
  ballot: WecV3BallotInput,
  cupCodes: [CupCode, CupCode],
): void {
  const allowed = new Set(cupCodes);
  const fields: (keyof WecV3BallotInput)[] = ["tactile", "taste", "flavour"];
  for (const field of fields) {
    const value = ballot[field];
    if (!value) {
      throw new Error("All three category selections are required before a ballot can be submitted.");
    }
    if (!allowed.has(value)) {
      throw new Error("Ballot selections must be one of the two heat cup codes.");
    }
  }
}

export function validateSimpleAbBallot(
  ballot: SimpleAbBallotInput,
  cupCodes: [CupCode, CupCode],
): void {
  if (!ballot.choice) {
    throw new Error("A cup choice is required before a ballot can be submitted.");
  }
  if (!cupCodes.includes(ballot.choice)) {
    throw new Error("Ballot selections must be one of the two heat cup codes.");
  }
}

function emptyBreakdown(cupCode: CupCode): ScoreBreakdown {
  return { cupCode, tactile: 0, taste: 0, flavour: 0, total: 0, votes: 0 };
}

export function scoreWecV3(
  ballots: WecV3BallotInput[],
  cupCodes: [CupCode, CupCode],
): HeatScoreResult {
  assertWecV3JudgeCount(ballots.length);
  for (const ballot of ballots) {
    validateWecV3Ballot(ballot, cupCodes);
  }

  const [a, b] = cupCodes;
  const totals = new Map<CupCode, ScoreBreakdown>([
    [a, emptyBreakdown(a)],
    [b, emptyBreakdown(b)],
  ]);

  for (const ballot of ballots) {
    const tactile = totals.get(ballot.tactile)!;
    tactile.tactile += CATEGORY_POINTS.tactile;
    tactile.total += CATEGORY_POINTS.tactile;

    const taste = totals.get(ballot.taste)!;
    taste.taste += CATEGORY_POINTS.taste;
    taste.total += CATEGORY_POINTS.taste;

    const flavour = totals.get(ballot.flavour)!;
    flavour.flavour += CATEGORY_POINTS.flavour;
    flavour.total += CATEGORY_POINTS.flavour;
  }

  const list = [...totals.values()];
  const winner = list.reduce((best, cur) => (cur.total > best.total ? cur : best));
  if (winner.total < WEC_V3_WIN_THRESHOLD) {
    throw new Error(
      `Official WEC Scoring v3 requires a cup to reach ${WEC_V3_WIN_THRESHOLD} or more points. This result is invalid.`,
    );
  }
  const other = list.find((t) => t.cupCode !== winner.cupCode)!;
  if (winner.total === other.total) {
    throw new Error("Official WEC Scoring v3 cannot produce a tied result from three complete ballots.");
  }

  const totalPointsAwarded = list.reduce((sum, t) => sum + t.total, 0);
  if (totalPointsAwarded !== WEC_V3_TOTAL_POINTS) {
    throw new Error(`Three complete Official WEC Scoring v3 ballots must total ${WEC_V3_TOTAL_POINTS} points.`);
  }

  return {
    format: "wec_v3",
    totals: list,
    winnerCupCode: winner.cupCode,
    totalPointsAwarded,
  };
}

export function scoreSimpleAb(
  ballots: SimpleAbBallotInput[],
  cupCodes: [CupCode, CupCode],
): HeatScoreResult {
  assertSimpleAbJudgeCount(ballots.length);
  for (const ballot of ballots) {
    validateSimpleAbBallot(ballot, cupCodes);
  }

  const [a, b] = cupCodes;
  const totals = new Map<CupCode, ScoreBreakdown>([
    [a, emptyBreakdown(a)],
    [b, emptyBreakdown(b)],
  ]);

  for (const ballot of ballots) {
    const row = totals.get(ballot.choice)!;
    row.votes += 1;
    row.total += 1;
  }

  const list = [...totals.values()];
  const winner = list.reduce((best, cur) => (cur.votes > best.votes ? cur : best));
  const other = list.find((t) => t.cupCode !== winner.cupCode)!;
  if (winner.votes === other.votes) {
    throw new Error("Simple Blind A/B cannot tie when every required odd-count ballot is present.");
  }

  return {
    format: "simple_ab",
    totals: list,
    winnerCupCode: winner.cupCode,
    totalPointsAwarded: ballots.length,
  };
}

export function pointsPerJudge(): number {
  return POINTS_PER_JUDGE;
}
