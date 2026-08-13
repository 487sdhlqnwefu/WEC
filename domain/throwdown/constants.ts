/** Official WEC Scoring v3 — sensory only, full category awards. */
export const SCORING_VERSION = "Official WEC Scoring v3" as const;

export const CATEGORY_POINTS = {
  tactile: 15,
  taste: 10,
  flavour: 8,
} as const;

export type SensoryCategory = keyof typeof CATEGORY_POINTS;

export const POINTS_PER_JUDGE =
  CATEGORY_POINTS.tactile + CATEGORY_POINTS.taste + CATEGORY_POINTS.flavour; // 33

export const WEC_V3_JUDGE_COUNT = 3;
export const WEC_V3_TOTAL_POINTS = POINTS_PER_JUDGE * WEC_V3_JUDGE_COUNT; // 99
export const WEC_V3_WIN_THRESHOLD = 50;

export const SIMPLE_AB_ALLOWED_JUDGE_COUNTS = [1, 3, 5] as const;
export type SimpleAbJudgeCount = (typeof SIMPLE_AB_ALLOWED_JUDGE_COUNTS)[number];

export const FREE_COMPETITOR_COUNTS = [2, 3, 4] as const;
export const PREMIUM_COMPETITOR_MIN = 8;
export const PREMIUM_COMPETITOR_MAX_V1 = 64;
/** Bracket engine supports raising this without rewriting the event model. */
export const PREMIUM_COMPETITOR_HARD_CEILING = 256;

export const PREMIUM_PRICE_CENTS = 30_000;
export const PREMIUM_CURRENCY = "usd" as const;

export const CUP_CODE_LENGTH = 4;
/** Exclude 0/O, 1/I/L, 5/S — easy to read aloud, hard to infer. */
export const CUP_CODE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXYZ2346789";

export const HEAT_STATES = [
  "scheduled",
  "staged",
  "brewing",
  "brewing_complete",
  "judging_open",
  "ballots_complete",
  "result_revealed",
  "recipes_complete",
  "complete",
  "void",
] as const;

export type HeatState = (typeof HEAT_STATES)[number];

export const EVENT_STATUSES = [
  "draft",
  "published",
  "live",
  "completed",
  "cancelled",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_TIERS = ["free", "premium"] as const;
export type EventTier = (typeof EVENT_TIERS)[number];

export const JUDGING_FORMATS = ["wec_v3", "simple_ab"] as const;
export type JudgingFormat = (typeof JUDGING_FORMATS)[number];

export const LICENCE_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "complimentary",
  "refunded",
  "failed",
  "expired",
] as const;
export type LicenceStatus = (typeof LICENCE_STATUSES)[number];

export const MEMBERSHIP_ROLES = [
  "organiser",
  "cup_steward",
  "competitor",
  "judge",
] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const OTP_TTL_MS = 10 * 60 * 1000;
export const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp"] as const;
