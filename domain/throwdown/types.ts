import type {
  EventTier,
  HeatState,
  JudgingFormat,
  LicenceStatus,
  MembershipRole,
  SensoryCategory,
} from "./constants";

export type CupCode = string;

export type WecV3BallotInput = {
  tactile: CupCode;
  taste: CupCode;
  flavour: CupCode;
};

export type SimpleAbBallotInput = {
  choice: CupCode;
};

export type ScoreBreakdown = {
  cupCode: CupCode;
  tactile: number;
  taste: number;
  flavour: number;
  total: number;
  votes: number;
};

export type HeatScoreResult = {
  format: JudgingFormat;
  totals: ScoreBreakdown[];
  winnerCupCode: CupCode;
  totalPointsAwarded: number;
};

export type BracketCompetitor = {
  entryId: string;
  seed: number;
  displayName?: string;
};

export type GeneratedHeat = {
  roundIndex: number;
  roundName: string;
  position: number;
  label: string;
  competitorEntryIds: [string | null, string | null];
  isBye: boolean;
  byeEntryId: string | null;
  feedsRoundIndex: number | null;
  feedsPosition: number | null;
  feedsSlot: 0 | 1 | null;
};

export type GeneratedBracket = {
  size: number;
  byeCount: number;
  heats: GeneratedHeat[];
  byeAssignments: { entryId: string; seed: number; roundName: string }[];
};

export type RoleContext = {
  profileId: string;
  isPlatformAdmin: boolean;
  memberships: { role: MembershipRole; status: "accepted" | "invited" | "revoked" }[];
  competingInHeat: boolean;
  assignedJudgeForHeat: boolean;
};

export type Entitlement = {
  tier: EventTier;
  licenceStatus: LicenceStatus | null;
};

export type RecipeInput = {
  doseGrams: number;
  yieldGrams: number;
  extractionTimeSeconds: number;
  waterTempC?: number | null;
  grindSetting?: string | null;
  preInfusionSeconds?: number | null;
  pressureOrFlow?: string | null;
  basket?: string | null;
  distribution?: string | null;
  tampingNotes?: string | null;
  tds?: number | null;
  notes?: string | null;
};

export type PublicRecipe = RecipeInput & {
  brewRatio: number;
  extractionYield: number | null;
};

export type AuditAction =
  | "event_created"
  | "event_updated"
  | "event_published"
  | "event_started"
  | "event_completed"
  | "role_assigned"
  | "role_revoked"
  | "cup_steward_replaced"
  | "invitation_sent"
  | "invitation_accepted"
  | "invitation_revoked"
  | "roster_locked"
  | "bracket_generated"
  | "bracket_locked"
  | "heat_staged"
  | "cup_codes_confirmed"
  | "heat_started"
  | "brewing_complete"
  | "judging_opened"
  | "ballot_submitted"
  | "result_calculated"
  | "result_revealed"
  | "recipe_submitted"
  | "recipe_correction_requested"
  | "recipe_correction_confirmed"
  | "heat_voided"
  | "heat_restarted"
  | "payment_pending"
  | "payment_paid"
  | "payment_failed"
  | "payment_expired"
  | "payment_refunded"
  | "complimentary_granted"
  | "admin_override";

export type Blocker = {
  code: string;
  message: string;
};
