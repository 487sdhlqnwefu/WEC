export const EVENT_STATES = [
  "draft",
  "awaiting_payment",
  "setup",
  "registration_open",
  "roster_locked",
  "bracket_ready",
  "live",
  "completed",
  "archived",
  "cancelled",
] as const;
export type EventState = (typeof EVENT_STATES)[number];

export const HEAT_STATES = [
  "scheduled",
  "check_in",
  "pattern_reveal",
  "prep",
  "competition",
  "photography",
  "awaiting_uploads",
  "judging_open",
  "judging_closed",
  "finalized",
  "paused",
  "void",
  "restart_pending",
  "restarted",
] as const;
export type HeatState = (typeof HEAT_STATES)[number];

/** States that occupy the v1 single active-heat lease. */
export const ACTIVE_HEAT_STATES: readonly HeatState[] = [
  "check_in",
  "pattern_reveal",
  "prep",
  "competition",
  "photography",
  "awaiting_uploads",
  "judging_open",
  "judging_closed",
  "paused",
  "restart_pending",
];

export const TIMER_PHASES = [
  "prep",
  "competition",
  "photography",
  "judging",
  "cleanup",
  "transition",
] as const;
export type TimerPhase = (typeof TIMER_PHASES)[number];

export const TIMER_RUN_STATUSES = [
  "pending",
  "running",
  "paused",
  "ended",
  "voided",
] as const;
export type TimerRunStatus = (typeof TIMER_RUN_STATUSES)[number];

export const COMPETITION_FORMATS = ["freestyle", "match_pattern"] as const;
export type CompetitionFormat = (typeof COMPETITION_FORMATS)[number];

export const JUDGING_DELIVERY_MODES = ["physical", "online"] as const;
export type JudgingDeliveryMode = (typeof JUDGING_DELIVERY_MODES)[number];

export const VOTING_MODELS = ["official_panel", "open_member"] as const;
export type VotingModel = (typeof VOTING_MODELS)[number];

export const PARTICIPATION_STRUCTURES = [
  "solo",
  "solo_with_coach",
  "team",
] as const;
export type ParticipationStructure = (typeof PARTICIPATION_STRUCTURES)[number];

export const EQUIPMENT_MODES = [
  "central_shot_service",
  "competitor_complete",
] as const;
export type EquipmentMode = (typeof EQUIPMENT_MODES)[number];

export const PAYMENT_STATUSES = [
  "unpaid",
  "checkout_created",
  "processing",
  "paid",
  "payment_failed",
  "refunded",
  "partially_refunded",
  "disputed",
  "cancelled",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const EVENT_ROLES = [
  "lead_organiser",
  "co_organiser",
  "event_staff",
  "blind_steward",
  "competitor",
  "coach",
  "team_member",
  "judge",
  "tiebreak_judge",
  "shot_barista",
  "online_member_voter",
  "platform_admin",
] as const;
export type EventRole = (typeof EVENT_ROLES)[number];

export const STAFF_CAPABILITIES = [
  "roster_desk",
  "timer_operator",
  "photo_support",
  "public_display",
  "equipment_support",
] as const;
export type StaffCapability = (typeof STAFF_CAPABILITIES)[number];

export const BLIND_ENTRIES = ["A", "B"] as const;
export type BlindEntry = (typeof BLIND_ENTRIES)[number];

export const BALLOT_ROUND_TYPES = [
  "official",
  "open_member",
  "tiebreak",
] as const;
export type BallotRoundType = (typeof BALLOT_ROUND_TYPES)[number];

export const BALLOT_STATUSES = ["submitted", "voided"] as const;
export type BallotStatus = (typeof BALLOT_STATUSES)[number];

export const CONFLICT_TYPES = [
  "same_event_competitor",
  "same_event_coach",
  "same_event_blind_steward",
  "coached_entry",
  "affiliation",
  "employer",
  "team",
  "family",
  "declared_other",
] as const;
export type ConflictType = (typeof CONFLICT_TYPES)[number];

export const RESTART_REASON_TYPES = [
  "espresso_machine_failure",
  "grinder_failure",
  "steam_failure",
  "electrical_failure",
  "water_failure",
  "incorrect_supplied_coffee",
  "incorrect_supplied_milk",
  "incorrect_supplied_cup",
  "incorrect_supplied_shot",
  "staff_interference",
  "platform_timer_failure",
  "verified_upload_failure",
  "confirmed_blindness_breach",
  "admin_force_majeure",
] as const;
export type RestartReasonType = (typeof RESTART_REASON_TYPES)[number];

export const NON_RESTARTABLE_REASONS = [
  "competitor_mistake",
  "poor_milk_texture",
  "competitor_spill",
  "missed_step",
  "bad_photography_technique",
  "unattractive_pour",
] as const;

export const PATTERN_SUBMITTERS = [
  "organiser_only",
  "competitors_only",
  "both",
] as const;
export type PatternSubmitterPolicy = (typeof PATTERN_SUBMITTERS)[number];

export const SEEDING_METHODS = ["random", "manual", "imported"] as const;
export type SeedingMethod = (typeof SEEDING_METHODS)[number];

export const OPEN_MEMBER_ELIGIBILITY = [
  "approved_invitees",
  "event_members",
  "signed_in_members",
] as const;
export type OpenMemberEligibility = (typeof OPEN_MEMBER_ELIGIBILITY)[number];

export const IDENTITY_PROVIDERS = [
  "kimi",
  "magic_link",
  "wec_oidc",
  "dev",
] as const;
export type IdentityProvider = (typeof IDENTITY_PROVIDERS)[number];

export const FEEDBACK_FLAG_TYPES = [
  "too_short",
  "repeated_text",
  "possible_non_comparative",
  "unusually_fast",
] as const;
export type FeedbackFlagType = (typeof FEEDBACK_FLAG_TYPES)[number];

export const PHOTO_SUBMISSION_STATUSES = [
  "pending_upload",
  "uploaded",
  "processing",
  "verified",
  "submitted",
  "replaced",
  "voided",
  "failed",
] as const;
export type PhotoSubmissionStatus = (typeof PHOTO_SUBMISSION_STATUSES)[number];

export const INCIDENT_TYPES = [
  "blindness_breach",
  "equipment",
  "timer",
  "upload",
  "staff",
  "judge_unavailable",
  "other",
] as const;
export type IncidentType = (typeof INCIDENT_TYPES)[number];

export type CoachPermissions = {
  accessDuringPrep: boolean;
  verbalDuringPrep: boolean;
  verbalDuringCompetition: boolean;
  equipmentHandling: boolean;
  photographyAssistance: boolean;
};

export type TeamPermissions = {
  bothMayTouchEquipment: boolean;
  bothMaySteam: boolean;
  bothMayPour: boolean;
  bothMayPhotograph: boolean;
};

export type TimingProfile = {
  prepSeconds: number;
  competitionSeconds: number;
  photographySeconds: number;
  judgingSeconds: number;
  cleanupSeconds: number;
  transitionSeconds: number;
};

export type WizardProgress = {
  identity?: boolean;
  fieldSchedule?: boolean;
  format?: boolean;
  judgingDelivery?: boolean;
  voting?: boolean;
  participation?: boolean;
  equipment?: boolean;
  timings?: boolean;
  patterns?: boolean;
  staff?: boolean;
  review?: boolean;
};
