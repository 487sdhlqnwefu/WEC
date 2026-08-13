export type ProfileRow = {
  id: string;
  displayName: string;
  email: string;
  emailVerifiedAt: Date | null;
  country: string;
  city: string | null;
  photoUrl: string | null;
  organisation: string | null;
  roleTitle: string | null;
  externalIdentityProvider: string | null;
  externalSubjectId: string | null;
  kimiUnionId: string | null;
  isPlatformAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OtpRow = {
  id: string;
  email: string;
  codeHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
};

export type EventRow = {
  id: string;
  slug: string;
  organiserProfileId: string;
  cupStewardProfileId: string | null;
  name: string;
  hostName: string;
  hostLogoUrl: string | null;
  startsAt: Date | null;
  timezone: string;
  venue: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  coffeeName: string;
  coffeeType: "blend" | "single_origin";
  coffeeNotes: string | null;
  espressoMachine: string | null;
  grinder: string | null;
  basket: string | null;
  waterSpec: string | null;
  otherControls: string | null;
  tier: "free" | "premium";
  judgingFormat: "wec_v3" | "simple_ab";
  judgeCount: number;
  status: "draft" | "published" | "live" | "completed" | "cancelled";
  seedingMode: "random" | "manual";
  rosterLockedAt: Date | null;
  bracketLockedAt: Date | null;
  judgingFormatLockedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  championEntryId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LicenceRow = {
  id: string;
  eventId: string;
  status: "unpaid" | "pending" | "paid" | "complimentary" | "refunded" | "failed" | "expired";
  grantedByProfileId: string | null;
  grantReason: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentRow = {
  id: string;
  eventId: string;
  licenceId: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  amountCents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "expired" | "refunded";
  paidAt: Date | null;
  createdAt: Date;
};

export type MembershipRow = {
  id: string;
  eventId: string;
  profileId: string;
  role: "organiser" | "cup_steward" | "competitor" | "judge";
  status: "invited" | "accepted" | "declined" | "revoked";
  createdAt: Date;
};

export type InvitationRow = {
  id: string;
  eventId: string;
  email: string;
  role: "organiser" | "cup_steward" | "competitor" | "judge";
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  acceptedAt: Date | null;
  acceptedByProfileId: string | null;
  createdByProfileId: string;
  createdAt: Date;
};

export type EntryRow = {
  id: string;
  eventId: string;
  profileId: string;
  seed: number | null;
  createdAt: Date;
};

export type BracketRow = {
  id: string;
  eventId: string;
  size: number;
  lockedAt: Date | null;
  generatedAt: Date;
};

export type RoundRow = {
  id: string;
  bracketId: string;
  eventId: string;
  roundIndex: number;
  name: string;
  size: number;
};

export type HeatRow = {
  id: string;
  eventId: string;
  roundId: string;
  label: string;
  position: number;
  isBye: boolean;
  feedsHeatId: string | null;
  feedsSlot: number | null;
  currentAttemptId: string | null;
  createdAt: Date;
};

export type AttemptRow = {
  id: string;
  heatId: string;
  eventId: string;
  attemptNumber: number;
  status:
    | "scheduled"
    | "staged"
    | "brewing"
    | "brewing_complete"
    | "judging_open"
    | "ballots_complete"
    | "result_revealed"
    | "recipes_complete"
    | "complete"
    | "void";
  voidReason: string | null;
  voidedAt: Date | null;
  voidedByProfileId: string | null;
  codesConfirmedAt: Date | null;
  brewingCompletedAt: Date | null;
  judgingOpenedAt: Date | null;
  resultRevealedAt: Date | null;
  winnerEntryId: string | null;
  winnerCupCode: string | null;
  scorePayload: unknown;
  createdAt: Date;
};

export type HeatCompetitorRow = {
  id: string;
  heatId: string;
  attemptId: string;
  competitorEntryId: string | null;
  slot: number;
  isBye: boolean;
  advancedFromHeatId: string | null;
};

export type MappingRow = {
  id: string;
  eventId: string;
  heatAttemptId: string;
  competitorEntryId: string;
  cupCode: string;
  createdAt: Date;
};

export type JudgeAssignmentRow = {
  id: string;
  heatAttemptId: string;
  eventId: string;
  profileId: string;
  createdAt: Date;
};

export type BallotRow = {
  id: string;
  heatAttemptId: string;
  judgeAssignmentId: string;
  idempotencyKey: string;
  submittedAt: Date;
};

export type SelectionRow = {
  id: string;
  ballotId: string;
  category: "tactile" | "taste" | "flavour" | "overall";
  cupCode: string;
  points: number;
};

export type RecipeRow = {
  id: string;
  heatAttemptId: string;
  competitorEntryId: string;
  doseGrams: number;
  yieldGrams: number;
  extractionTimeSeconds: number;
  waterTempC: number | null;
  grindSetting: string | null;
  preInfusionSeconds: number | null;
  pressureOrFlow: string | null;
  basket: string | null;
  distribution: string | null;
  tampingNotes: string | null;
  tds: number | null;
  notes: string | null;
  lockedAt: Date;
  correctionRequestedAt: Date | null;
  correctionRequestedBy: string | null;
  correctionNote: string | null;
  createdAt: Date;
};

export type PublicationRow = {
  id: string;
  eventId: string;
  publishedAt: Date | null;
  recipesReleasedAt: Date | null;
  publicPath: string;
};

export type AuditRow = {
  id: string;
  eventId: string | null;
  actorProfileId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  payload: unknown;
  createdAt: Date;
};

export type StripeEventRow = {
  id: string;
  type: string;
  createdAt: Date;
};

export type ConfigRow = {
  id: string;
  premiumPriceCents: number;
  premiumCurrency: string;
  throwdownPublicUrl: string | null;
  updatedAt: Date;
};

export interface Table<T extends { id: string }> {
  get(id: string): Promise<T | undefined>;
  insert(row: T): Promise<void>;
  update(id: string, patch: Partial<T>): Promise<void>;
  remove(id: string): Promise<void>;
  list(filter?: Partial<T>): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | undefined>;
}

export interface ThrowdownUow {
  profiles: Table<ProfileRow>;
  otps: Table<OtpRow>;
  events: Table<EventRow>;
  licences: Table<LicenceRow>;
  payments: Table<PaymentRow>;
  memberships: Table<MembershipRow>;
  invitations: Table<InvitationRow>;
  entries: Table<EntryRow>;
  brackets: Table<BracketRow>;
  rounds: Table<RoundRow>;
  heats: Table<HeatRow>;
  attempts: Table<AttemptRow>;
  heatCompetitors: Table<HeatCompetitorRow>;
  mappings: Table<MappingRow>;
  judgeAssignments: Table<JudgeAssignmentRow>;
  ballots: Table<BallotRow>;
  selections: Table<SelectionRow>;
  recipes: Table<RecipeRow>;
  publications: Table<PublicationRow>;
  audits: Table<AuditRow>;
  stripeEvents: Table<StripeEventRow>;
  config: Table<ConfigRow>;
  transaction<T>(fn: (uow: ThrowdownUow) => Promise<T>): Promise<T>;
}

class MemoryTable<T extends { id: string }> implements Table<T> {
  rows: T[] = [];

  async get(id: string) {
    return this.rows.find((r) => r.id === id);
  }

  async insert(row: T) {
    this.rows.push(structuredClone(row));
  }

  async update(id: string, patch: Partial<T>) {
    const i = this.rows.findIndex((r) => r.id === id);
    if (i < 0) throw new Error(`Row ${id} not found`);
    this.rows[i] = { ...this.rows[i]!, ...patch };
  }

  async remove(id: string) {
    this.rows = this.rows.filter((r) => r.id !== id);
  }

  async list(filter?: Partial<T>) {
    if (!filter || Object.keys(filter).length === 0) return this.rows.map((r) => ({ ...r }));
    return this.rows
      .filter((r) => Object.entries(filter).every(([k, v]) => (r as Record<string, unknown>)[k] === v))
      .map((r) => ({ ...r }));
  }

  async findOne(filter: Partial<T>) {
    const rows = await this.list(filter);
    return rows[0];
  }
}

export class MemoryUow implements ThrowdownUow {
  profiles = new MemoryTable<ProfileRow>();
  otps = new MemoryTable<OtpRow>();
  events = new MemoryTable<EventRow>();
  licences = new MemoryTable<LicenceRow>();
  payments = new MemoryTable<PaymentRow>();
  memberships = new MemoryTable<MembershipRow>();
  invitations = new MemoryTable<InvitationRow>();
  entries = new MemoryTable<EntryRow>();
  brackets = new MemoryTable<BracketRow>();
  rounds = new MemoryTable<RoundRow>();
  heats = new MemoryTable<HeatRow>();
  attempts = new MemoryTable<AttemptRow>();
  heatCompetitors = new MemoryTable<HeatCompetitorRow>();
  mappings = new MemoryTable<MappingRow>();
  judgeAssignments = new MemoryTable<JudgeAssignmentRow>();
  ballots = new MemoryTable<BallotRow>();
  selections = new MemoryTable<SelectionRow>();
  recipes = new MemoryTable<RecipeRow>();
  publications = new MemoryTable<PublicationRow>();
  audits = new MemoryTable<AuditRow>();
  stripeEvents = new MemoryTable<StripeEventRow>();
  config = new MemoryTable<ConfigRow>();

  async transaction<T>(fn: (uow: ThrowdownUow) => Promise<T>): Promise<T> {
    return fn(this);
  }
}
