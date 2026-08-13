import type {
  BallotRoundType,
  BallotStatus,
  BlindEntry,
  CoachPermissions,
  CompetitionFormat,
  ConflictType,
  EquipmentMode,
  EventRole,
  EventState,
  HeatState,
  IdentityProvider,
  IncidentType,
  JudgingDeliveryMode,
  ParticipationStructure,
  PaymentStatus,
  PhotoSubmissionStatus,
  RestartReasonType,
  SeedingMethod,
  StaffCapability,
  TeamPermissions,
  TimerPhase,
  TimerRunStatus,
  TimingProfile,
  VotingModel,
} from "../domain/types";

export type Member = {
  id: string;
  authUserId: number | null;
  identityProvider: IdentityProvider;
  externalSubject: string | null;
  externalMemberId: string | null;
  lastIdentitySyncAt: Date | null;
  emailNormalized: string | null;
  displayName: string;
  givenName: string | null;
  familyName: string | null;
  countryCode: string | null;
  city: string | null;
  preferredLanguage: string;
  avatarPath: string | null;
  publicBio: string | null;
  affiliationName: string | null;
  publicProfileConsent: boolean;
  profileCompletedAt: Date | null;
  suspendedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WlatEvent = {
  id: string;
  productType: "latte_art_throwdown";
  name: string;
  slug: string;
  description: string | null;
  ownerMemberId: string;
  organisationName: string | null;
  venueName: string | null;
  city: string | null;
  countryCode: string | null;
  timezone: string;
  startsAt: Date | null;
  endsAt: Date | null;
  status: EventState;
  fieldSize: number;
  competitionFormat: CompetitionFormat;
  judgingDeliveryMode: JudgingDeliveryMode;
  votingModel: VotingModel;
  officialJudgeCount: number;
  participationStructure: ParticipationStructure;
  equipmentMode: EquipmentMode;
  rulesVersion: string;
  openMemberEligibility: string;
  openMemberTargetBallots: number;
  openMemberMinimumBallots: number;
  openMemberWindowSeconds: number;
  openMemberPreapprovedOnly: boolean;
  patternSubmitterPolicy: string;
  patternRepeatsAllowed: boolean;
  patternsVisibleBeforeEvent: boolean;
  patternApprovalRequired: boolean;
  voteSplitPublic: boolean;
  heroImagePath: string | null;
  privateNotes: string | null;
  equipmentNotes: Record<string, unknown>;
  coachPermissions: CoachPermissions;
  teamPermissions: TeamPermissions;
  wizard: Record<string, unknown>;
  rosterLockedAt: Date | null;
  bracketLockedAt: Date | null;
  completedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EventPayment = {
  id: string;
  eventId: string;
  provider: "stripe";
  status: PaymentStatus;
  amountMinor: number;
  currency: string;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  paidAt: Date | null;
  refundedAmountMinor: number;
  createdAt: Date;
  updatedAt: Date;
};

export type WebhookEvent = {
  id: string;
  providerEventId: string;
  eventType: string;
  payloadHash: string;
  processingStatus: "processed" | "duplicate" | "failed";
  processedAt: Date | null;
  errorMessage: string | null;
};

export type EventRoleRow = {
  id: string;
  eventId: string;
  memberId: string;
  role: EventRole;
  capabilities: StaffCapability[];
  status: "invited" | "accepted" | "revoked";
  invitedByMemberId: string | null;
  acceptedAt: Date | null;
  revokedAt: Date | null;
};

export type EventInvitation = {
  id: string;
  eventId: string;
  emailNormalized: string;
  memberId: string | null;
  role: EventRole;
  entryId: string | null;
  tokenHash: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
};

export type EventConflict = {
  id: string;
  eventId: string;
  memberId: string;
  relatedMemberId: string | null;
  relatedEntryId: string | null;
  affiliationName: string | null;
  conflictType: ConflictType;
  notes: string | null;
  declaredAt: Date;
  resolvedAt: Date | null;
  resolvedByMemberId: string | null;
};

export type Entry = {
  id: string;
  eventId: string;
  entryType: "solo" | "team";
  displayName: string;
  seed: number | null;
  status: "invited" | "complete" | "checked_in" | "withdrawn";
  checkedInAt: Date | null;
  rulesAcknowledgedAt: Date | null;
  createdAt: Date;
};

export type EntryMember = {
  id: string;
  entryId: string;
  memberId: string;
  entryRole: "competitor" | "team_member" | "coach";
  permissions: Record<string, unknown>;
  acceptedAt: Date | null;
};

export type Station = {
  id: string;
  eventId: string;
  name: string;
  ordinal: number;
  status: "enabled" | "disabled";
  isEnabled: boolean;
  createdAt: Date;
};

export type EventDay = {
  id: string;
  eventId: string;
  localDate: string;
  opensAt: Date;
  closesAt: Date;
  notes: string | null;
};

export type TimingRow = TimingProfile & {
  id: string;
  eventId: string;
  version: number;
};

export type Bracket = {
  id: string;
  eventId: string;
  version: number;
  generationMethod: SeedingMethod;
  lockedAt: Date | null;
  createdByMemberId: string;
};

export type BracketNode = {
  id: string;
  bracketId: string;
  roundNumber: number;
  matchNumber: number;
  sourceNodeAId: string | null;
  sourceNodeBId: string | null;
  entryAId: string | null;
  entryBId: string | null;
  winnerEntryId: string | null;
  byeEntryId: string | null;
  heatId: string | null;
  status: "pending" | "bye" | "ready" | "complete";
};

export type Heat = {
  id: string;
  eventId: string;
  stationId: string;
  bracketNodeId: string;
  heatNumber: number;
  scheduledAt: Date | null;
  state: HeatState;
  stateVersion: number;
  restartNumber: number;
  patternDrawId: string | null;
  activeTimerRunId: string | null;
  judgingRound: string;
  winnerBlindEntry: BlindEntry | null;
  winnerEntryId: string | null;
  pausedFromState: HeatState | null;
  finalizedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RuntimeLock = {
  eventId: string;
  stationId: string;
  activeHeatId: string | null;
  activeTimerRunId: string | null;
  version: number;
};

export type TimerRun = {
  id: string;
  heatId: string;
  phase: TimerPhase;
  status: TimerRunStatus;
  startedAt: Date | null;
  expectedEndAt: Date | null;
  pausedAt: Date | null;
  accumulatedPauseMs: number;
  endedAt: Date | null;
  version: number;
  operatedByMemberId: string | null;
  voidedAt: Date | null;
  voidReason: string | null;
};

export type HeatBlindMapping = {
  id: string;
  heatId: string;
  mappingVersion: string;
  entryAId: string;
  entryBId: string;
  generatedAt: Date;
  voidedAt: Date | null;
};

export type MappingAccessLog = {
  id: string;
  heatBlindMappingId: string;
  memberId: string;
  accessedAt: Date;
  accessReason: string;
  sessionFingerprint: string | null;
};

export type PatternSubmission = {
  id: string;
  eventId: string;
  submittedByMemberId: string;
  sourceType: "organiser" | "competitor";
  title: string;
  description: string | null;
  originalStoragePath: string;
  judgingDerivativePath: string | null;
  contentHash: string;
  status: "pending" | "approved" | "rejected";
  difficultyLabel: string | null;
  approvedByMemberId: string | null;
  approvedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
};

export type PatternDraw = {
  id: string;
  eventId: string;
  heatId: string;
  eligiblePatternIdsSnapshot: string[];
  selectedPatternSubmissionId: string;
  randomDrawVersion: string;
  drawnAt: Date;
  drawnByMemberId: string | null;
  voidedAt: Date | null;
  voidReason: string | null;
};

export type HeatPhoto = {
  id: string;
  heatId: string;
  entryId: string;
  uploadedByMemberId: string;
  originalStoragePath: string | null;
  judgingStoragePath: string | null;
  publicStoragePath: string | null;
  originalFilenameHash: string;
  contentHash: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
  processingStatus: "pending" | "ready" | "failed";
  submissionStatus: PhotoSubmissionStatus;
  submittedAt: Date | null;
  replacedAt: Date | null;
  voidedAt: Date | null;
  voidReason: string | null;
  restartNumber: number;
};

export type JudgeAssignment = {
  id: string;
  eventId: string;
  heatId: string | null;
  memberId: string;
  assignmentType: "official" | "tiebreak" | "open_member";
  status: "assigned" | "replaced";
  conflictCheckedAt: Date | null;
};

export type BallotRound = {
  id: string;
  heatId: string;
  roundType: BallotRoundType;
  status: "pending" | "open" | "closed";
  targetBallots: number;
  minimumBallots: number;
  opensAt: Date | null;
  closesAt: Date | null;
  closedAt: Date | null;
  resultBlindEntry: BlindEntry | null;
};

export type Ballot = {
  id: string;
  ballotRoundId: string;
  heatId: string;
  voterMemberId: string;
  selectedBlindEntry: BlindEntry;
  feedbackText: string;
  presentationOrder: BlindEntry[];
  referencePatternSubmissionId: string | null;
  judgingPhotoAId: string | null;
  judgingPhotoBId: string | null;
  submittedAt: Date;
  status: BallotStatus;
  voidedAt: Date | null;
  voidReason: string | null;
};

export type FeedbackFlag = {
  id: string;
  ballotId: string;
  flagType: string;
  flagSource: "system" | "human";
  details: Record<string, unknown>;
  reviewedByMemberId: string | null;
  reviewedAt: Date | null;
  resolution: string | null;
};

export type HeatResult = {
  id: string;
  heatId: string;
  resultVersion: number;
  winningBlindEntry: BlindEntry;
  winnerEntryId: string;
  loserEntryId: string;
  voteACount: number;
  voteBCount: number;
  decidingBallotRoundId: string;
  resolutionType: "majority" | "tiebreak" | "manual_override";
  finalizedByMemberId: string | null;
  finalizedAt: Date;
  supersededAt: Date | null;
};

export type EventIncident = {
  id: string;
  eventId: string;
  heatId: string | null;
  incidentType: IncidentType;
  severity: "low" | "medium" | "high";
  status: "open" | "resolved";
  description: string;
  reportedByMemberId: string;
  resolvedByMemberId: string | null;
  resolution: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
};

export type HeatRestart = {
  id: string;
  heatId: string;
  restartNumber: number;
  reasonType: RestartReasonType;
  reasonNotes: string;
  approvedByMemberId: string;
  createdAt: Date;
};

export type AuditEvent = {
  id: string;
  eventId: string | null;
  heatId: string | null;
  actorMemberId: string | null;
  actorType: "member" | "system" | "webhook";
  action: string;
  entityType: string;
  entityId: string;
  beforeJson: unknown;
  afterJson: unknown;
  reason: string | null;
  requestId: string | null;
  createdAt: Date;
};

export type ShotTask = {
  id: string;
  heatId: string;
  entryId: string;
  status: "queued" | "ready" | "delivered" | "remade" | "failed";
  updatedAt: Date;
};

export type ArchivePour = {
  id: string;
  memberId: string;
  eventId: string;
  heatId: string;
  entryId: string;
  photoId: string;
  opponentEntryId: string | null;
  format: CompetitionFormat;
  patternId: string | null;
  outcome: "win" | "loss" | "champion";
  roundName: string;
  publishedAt: Date;
};

export type WlatSnapshot = {
  members: Member[];
  events: WlatEvent[];
  payments: EventPayment[];
  webhooks: WebhookEvent[];
  roles: EventRoleRow[];
  invitations: EventInvitation[];
  conflicts: EventConflict[];
  entries: Entry[];
  entryMembers: EntryMember[];
  stations: Station[];
  days: EventDay[];
  timings: TimingRow[];
  brackets: Bracket[];
  nodes: BracketNode[];
  heats: Heat[];
  locks: RuntimeLock[];
  timers: TimerRun[];
  mappings: HeatBlindMapping[];
  mappingLogs: MappingAccessLog[];
  patterns: PatternSubmission[];
  draws: PatternDraw[];
  photos: HeatPhoto[];
  assignments: JudgeAssignment[];
  rounds: BallotRound[];
  ballots: Ballot[];
  flags: FeedbackFlag[];
  results: HeatResult[];
  incidents: EventIncident[];
  restarts: HeatRestart[];
  audits: AuditEvent[];
  shots: ShotTask[];
  archives: ArchivePour[];
};
