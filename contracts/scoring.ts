/**
 * WEC / WBT Scoring System v3
 * Internal competition doctrine — sensory only.
 *
 * Tactile 15 (45%) · Taste 10 (30%) · Flavour 8 (24%)
 * Per judge: 33 · Three judges: 99 · 50+ wins
 */

export const SCORING_VERSION = "v3" as const;

export const CATEGORY_POINTS = {
  tactile: 15,
  taste: 10,
  flavour: 8,
} as const;

export type SensoryCategory = keyof typeof CATEGORY_POINTS;

export const POINTS_PER_JUDGE =
  CATEGORY_POINTS.tactile + CATEGORY_POINTS.taste + CATEGORY_POINTS.flavour; // 33

export const JUDGES_PER_HEAT_DEFAULT = 3;
export const MAX_MATCH_POINTS = POINTS_PER_JUDGE * JUDGES_PER_HEAT_DEFAULT; // 99
export const WIN_THRESHOLD = 50;

export type CupSide = "A" | "B";

export type CategoryBallot = {
  tactile: CupSide;
  taste: CupSide;
  flavour: CupSide;
};

export const ROUND_NAMES: Record<number, string> = {
  1: "Round of 32",
  2: "Round of 16",
  3: "Quarter-finals",
  4: "Semi-finals",
  5: "Final",
};

export const COMPETITOR_LIMIT_DEFAULT = 32;
export const TOTAL_ROUNDS = 5;
export const TOTAL_MATCHES_32 = 31;
