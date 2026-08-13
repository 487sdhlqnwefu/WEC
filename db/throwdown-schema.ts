import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  json,
  uniqueIndex,
  index,
  decimal,
} from "drizzle-orm/mysql-core";

const uuid = (name: string) => varchar(name, { length: 36 });
const emailCol = (name: string) => varchar(name, { length: 320 });

export const profiles = mysqlTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    displayName: varchar("displayName", { length: 255 }).notNull(),
    email: emailCol("email").notNull(),
    emailVerifiedAt: timestamp("emailVerifiedAt"),
    country: varchar("country", { length: 100 }).notNull().default(""),
    city: varchar("city", { length: 100 }),
    photoUrl: text("photoUrl"),
    organisation: varchar("organisation", { length: 255 }),
    roleTitle: varchar("roleTitle", { length: 255 }),
    externalIdentityProvider: varchar("externalIdentityProvider", { length: 100 }),
    externalSubjectId: varchar("externalSubjectId", { length: 255 }),
    kimiUnionId: varchar("kimiUnionId", { length: 255 }),
    isPlatformAdmin: boolean("isPlatformAdmin").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("profiles_email_uq").on(t.email),
    uniqueIndex("profiles_kimi_uq").on(t.kimiUnionId),
    uniqueIndex("profiles_external_uq").on(t.externalIdentityProvider, t.externalSubjectId),
  ],
);

export const authOtps = mysqlTable(
  "auth_otps",
  {
    id: uuid("id").primaryKey(),
    email: emailCol("email").notNull(),
    codeHash: varchar("codeHash", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    consumedAt: timestamp("consumedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [index("auth_otps_email_idx").on(t.email)],
);

export const platformConfig = mysqlTable("platform_config", {
  id: varchar("id", { length: 32 }).primaryKey().default("default"),
  premiumPriceCents: int("premiumPriceCents").notNull().default(30000),
  premiumCurrency: varchar("premiumCurrency", { length: 8 }).notNull().default("usd"),
  throwdownPublicUrl: varchar("throwdownPublicUrl", { length: 500 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const throwdownEvents = mysqlTable(
  "throwdown_events",
  {
    id: uuid("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    organiserProfileId: uuid("organiserProfileId").notNull(),
    cupStewardProfileId: uuid("cupStewardProfileId"),
    name: varchar("name", { length: 255 }).notNull(),
    hostName: varchar("hostName", { length: 255 }).notNull(),
    hostLogoUrl: text("hostLogoUrl"),
    startsAt: timestamp("startsAt"),
    timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
    venue: varchar("venue", { length: 255 }),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    description: text("description"),
    coffeeName: varchar("coffeeName", { length: 255 }).notNull().default(""),
    coffeeType: mysqlEnum("coffeeType", ["blend", "single_origin"]).default("blend").notNull(),
    coffeeNotes: text("coffeeNotes"),
    espressoMachine: varchar("espressoMachine", { length: 255 }),
    grinder: varchar("grinder", { length: 255 }),
    basket: varchar("basket", { length: 255 }),
    waterSpec: varchar("waterSpec", { length: 255 }),
    otherControls: text("otherControls"),
    tier: mysqlEnum("tier", ["free", "premium"]).notNull(),
    judgingFormat: mysqlEnum("judgingFormat", ["wec_v3", "simple_ab"]).notNull(),
    judgeCount: int("judgeCount").notNull(),
    status: mysqlEnum("status", ["draft", "published", "live", "completed", "cancelled"])
      .default("draft")
      .notNull(),
    seedingMode: mysqlEnum("seedingMode", ["random", "manual"]).default("random").notNull(),
    rosterLockedAt: timestamp("rosterLockedAt"),
    bracketLockedAt: timestamp("bracketLockedAt"),
    judgingFormatLockedAt: timestamp("judgingFormatLockedAt"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    championEntryId: uuid("championEntryId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("throwdown_events_slug_uq").on(t.slug),
    index("throwdown_events_org_idx").on(t.organiserProfileId),
    index("throwdown_events_status_idx").on(t.status),
  ],
);

export const eventLicences = mysqlTable(
  "event_licences",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    status: mysqlEnum("status", [
      "unpaid",
      "pending",
      "paid",
      "complimentary",
      "refunded",
      "failed",
      "expired",
    ])
      .default("unpaid")
      .notNull(),
    grantedByProfileId: uuid("grantedByProfileId"),
    grantReason: text("grantReason"),
    paidAt: timestamp("paidAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("event_licences_event_uq").on(t.eventId)],
);

export const throwdownPayments = mysqlTable(
  "throwdown_payments",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    licenceId: uuid("licenceId").notNull(),
    stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull(),
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
    amountCents: int("amountCents").notNull(),
    currency: varchar("currency", { length: 8 }).notNull(),
    status: mysqlEnum("status", ["pending", "paid", "failed", "expired", "refunded"])
      .default("pending")
      .notNull(),
    paidAt: timestamp("paidAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("throwdown_payments_session_uq").on(t.stripeSessionId),
    index("throwdown_payments_event_idx").on(t.eventId),
  ],
);

export const eventMemberships = mysqlTable(
  "event_memberships",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    profileId: uuid("profileId").notNull(),
    role: mysqlEnum("role", ["organiser", "cup_steward", "competitor", "judge"]).notNull(),
    status: mysqlEnum("status", ["invited", "accepted", "declined", "revoked"])
      .default("invited")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("event_memberships_role_uq").on(t.eventId, t.profileId, t.role),
    index("event_memberships_profile_idx").on(t.profileId),
  ],
);

export const throwdownInvitations = mysqlTable(
  "throwdown_invitations",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    email: emailCol("email").notNull(),
    role: mysqlEnum("role", ["organiser", "cup_steward", "competitor", "judge"]).notNull(),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    revokedAt: timestamp("revokedAt"),
    acceptedAt: timestamp("acceptedAt"),
    acceptedByProfileId: uuid("acceptedByProfileId"),
    createdByProfileId: uuid("createdByProfileId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("throwdown_invitations_token_uq").on(t.tokenHash),
    index("throwdown_invitations_event_idx").on(t.eventId),
  ],
);

export const competitorEntries = mysqlTable(
  "competitor_entries",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    profileId: uuid("profileId").notNull(),
    seed: int("seed"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("competitor_entries_event_profile_uq").on(t.eventId, t.profileId)],
);

export const throwdownBrackets = mysqlTable(
  "throwdown_brackets",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    size: int("size").notNull(),
    lockedAt: timestamp("lockedAt"),
    generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("throwdown_brackets_event_uq").on(t.eventId)],
);

export const throwdownRounds = mysqlTable(
  "throwdown_rounds",
  {
    id: uuid("id").primaryKey(),
    bracketId: uuid("bracketId").notNull(),
    eventId: uuid("eventId").notNull(),
    roundIndex: int("roundIndex").notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    size: int("size").notNull(),
  },
  (t) => [uniqueIndex("throwdown_rounds_bracket_idx_uq").on(t.bracketId, t.roundIndex)],
);

export const throwdownHeats = mysqlTable(
  "throwdown_heats",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    roundId: uuid("roundId").notNull(),
    label: varchar("label", { length: 64 }).notNull(),
    position: int("position").notNull(),
    isBye: boolean("isBye").default(false).notNull(),
    feedsHeatId: uuid("feedsHeatId"),
    feedsSlot: int("feedsSlot"),
    currentAttemptId: uuid("currentAttemptId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [index("throwdown_heats_event_idx").on(t.eventId)],
);

export const heatAttempts = mysqlTable(
  "heat_attempts",
  {
    id: uuid("id").primaryKey(),
    heatId: uuid("heatId").notNull(),
    eventId: uuid("eventId").notNull(),
    attemptNumber: int("attemptNumber").notNull().default(1),
    status: mysqlEnum("status", [
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
    ])
      .default("scheduled")
      .notNull(),
    voidReason: text("voidReason"),
    voidedAt: timestamp("voidedAt"),
    voidedByProfileId: uuid("voidedByProfileId"),
    codesConfirmedAt: timestamp("codesConfirmedAt"),
    brewingCompletedAt: timestamp("brewingCompletedAt"),
    judgingOpenedAt: timestamp("judgingOpenedAt"),
    resultRevealedAt: timestamp("resultRevealedAt"),
    winnerEntryId: uuid("winnerEntryId"),
    winnerCupCode: varchar("winnerCupCode", { length: 8 }),
    scorePayload: json("scorePayload"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("heat_attempts_heat_number_uq").on(t.heatId, t.attemptNumber)],
);

export const heatCompetitors = mysqlTable(
  "heat_competitors",
  {
    id: uuid("id").primaryKey(),
    heatId: uuid("heatId").notNull(),
    attemptId: uuid("attemptId").notNull(),
    competitorEntryId: uuid("competitorEntryId"),
    slot: int("slot").notNull(),
    isBye: boolean("isBye").default(false).notNull(),
    advancedFromHeatId: uuid("advancedFromHeatId"),
  },
  (t) => [uniqueIndex("heat_competitors_attempt_slot_uq").on(t.attemptId, t.slot)],
);

export const cupCodeMappings = mysqlTable(
  "cup_code_mappings",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    heatAttemptId: uuid("heatAttemptId").notNull(),
    competitorEntryId: uuid("competitorEntryId").notNull(),
    cupCode: varchar("cupCode", { length: 8 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("cup_code_mappings_event_code_uq").on(t.eventId, t.cupCode),
    uniqueIndex("cup_code_mappings_attempt_entry_uq").on(t.heatAttemptId, t.competitorEntryId),
  ],
);

export const judgeAssignments = mysqlTable(
  "judge_assignments",
  {
    id: uuid("id").primaryKey(),
    heatAttemptId: uuid("heatAttemptId").notNull(),
    eventId: uuid("eventId").notNull(),
    profileId: uuid("profileId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("judge_assignments_attempt_profile_uq").on(t.heatAttemptId, t.profileId)],
);

export const throwdownBallots = mysqlTable(
  "throwdown_ballots",
  {
    id: uuid("id").primaryKey(),
    heatAttemptId: uuid("heatAttemptId").notNull(),
    judgeAssignmentId: uuid("judgeAssignmentId").notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 64 }).notNull(),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("throwdown_ballots_assignment_uq").on(t.judgeAssignmentId),
    uniqueIndex("throwdown_ballots_idem_uq").on(t.idempotencyKey),
  ],
);

export const ballotSelections = mysqlTable("ballot_selections", {
  id: uuid("id").primaryKey(),
  ballotId: uuid("ballotId").notNull(),
  category: mysqlEnum("category", ["tactile", "taste", "flavour", "overall"]).notNull(),
  cupCode: varchar("cupCode", { length: 8 }).notNull(),
  points: int("points").notNull(),
});

export const throwdownRecipes = mysqlTable(
  "throwdown_recipes",
  {
    id: uuid("id").primaryKey(),
    heatAttemptId: uuid("heatAttemptId").notNull(),
    competitorEntryId: uuid("competitorEntryId").notNull(),
    doseGrams: decimal("doseGrams", { precision: 6, scale: 2 }).notNull(),
    yieldGrams: decimal("yieldGrams", { precision: 6, scale: 2 }).notNull(),
    extractionTimeSeconds: decimal("extractionTimeSeconds", { precision: 6, scale: 2 }).notNull(),
    waterTempC: decimal("waterTempC", { precision: 5, scale: 2 }),
    grindSetting: varchar("grindSetting", { length: 255 }),
    preInfusionSeconds: decimal("preInfusionSeconds", { precision: 6, scale: 2 }),
    pressureOrFlow: text("pressureOrFlow"),
    basket: varchar("basket", { length: 255 }),
    distribution: varchar("distribution", { length: 255 }),
    tampingNotes: text("tampingNotes"),
    tds: decimal("tds", { precision: 5, scale: 2 }),
    notes: text("notes"),
    lockedAt: timestamp("lockedAt").notNull(),
    correctionRequestedAt: timestamp("correctionRequestedAt"),
    correctionRequestedBy: uuid("correctionRequestedBy"),
    correctionNote: text("correctionNote"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("throwdown_recipes_attempt_entry_uq").on(t.heatAttemptId, t.competitorEntryId)],
);

export const eventPublications = mysqlTable(
  "event_publications",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId").notNull(),
    publishedAt: timestamp("publishedAt"),
    recipesReleasedAt: timestamp("recipesReleasedAt"),
    publicPath: varchar("publicPath", { length: 255 }).notNull(),
  },
  (t) => [uniqueIndex("event_publications_event_uq").on(t.eventId)],
);

export const processedStripeEvents = mysqlTable("processed_stripe_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const throwdownAuditLog = mysqlTable(
  "throwdown_audit_log",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("eventId"),
    actorProfileId: uuid("actorProfileId"),
    action: varchar("action", { length: 64 }).notNull(),
    entityType: varchar("entityType", { length: 64 }).notNull(),
    entityId: varchar("entityId", { length: 64 }),
    payload: json("payload"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [index("throwdown_audit_event_idx").on(t.eventId), index("throwdown_audit_created_idx").on(t.createdAt)],
);

export type Profile = typeof profiles.$inferSelect;
export type ThrowdownEvent = typeof throwdownEvents.$inferSelect;
export type EventLicence = typeof eventLicences.$inferSelect;
export type HeatAttempt = typeof heatAttempts.$inferSelect;
export type CupCodeMapping = typeof cupCodeMappings.$inferSelect;
export type ThrowdownBallot = typeof throwdownBallots.$inferSelect;
export type ThrowdownRecipe = typeof throwdownRecipes.$inferSelect;
