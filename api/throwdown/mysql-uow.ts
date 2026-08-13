import { and, eq } from "drizzle-orm";
import { getDb } from "../queries/connection";
import * as tables from "@db/throwdown-schema";
import type {
  AttemptRow,
  AuditRow,
  BallotRow,
  BracketRow,
  ConfigRow,
  EntryRow,
  EventRow,
  HeatCompetitorRow,
  HeatRow,
  InvitationRow,
  JudgeAssignmentRow,
  LicenceRow,
  MappingRow,
  MembershipRow,
  OtpRow,
  PaymentRow,
  ProfileRow,
  PublicationRow,
  RecipeRow,
  RoundRow,
  SelectionRow,
  StripeEventRow,
  Table,
  ThrowdownUow,
} from "./uow";

type Db = ReturnType<typeof getDb>;

class DrizzleTable<T extends { id: string }> implements Table<T> {
  constructor(
    private db: Db,
    private table: Record<string, unknown> & { id: unknown },
    private fromDb: (row: Record<string, unknown>) => T = (row) => row as T,
    private toDb: (row: T | Partial<T>) => Record<string, unknown> = (row) => row as Record<string, unknown>,
  ) {}

  async get(id: string) {
    const rows = await this.db.select().from(this.table as never).where(eq(this.table.id as never, id as never));
    const row = rows[0] as Record<string, unknown> | undefined;
    return row ? this.fromDb(row) : undefined;
  }

  async insert(row: T) {
    await this.db.insert(this.table as never).values(this.toDb(row) as never);
  }

  async update(id: string, patch: Partial<T>) {
    await this.db
      .update(this.table as never)
      .set(this.toDb(patch) as never)
      .where(eq(this.table.id as never, id as never));
  }

  async remove(id: string) {
    await this.db.delete(this.table as never).where(eq(this.table.id as never, id as never));
  }

  async list(filter?: Partial<T>) {
    const conds = Object.entries(filter ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => eq((this.table as Record<string, never>)[k], v as never));
    const query = this.db.select().from(this.table as never);
    const rows = conds.length
      ? await query.where(conds.length === 1 ? conds[0]! : and(...conds))
      : await query;
    return (rows as Record<string, unknown>[]).map((r) => this.fromDb(r));
  }

  async findOne(filter: Partial<T>) {
    const rows = await this.list(filter);
    return rows[0];
  }
}

function num(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function numOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;
  return Number(value);
}

function recipeFromDb(row: Record<string, unknown>): RecipeRow {
  return {
    ...(row as unknown as RecipeRow),
    doseGrams: num(row.doseGrams),
    yieldGrams: num(row.yieldGrams),
    extractionTimeSeconds: num(row.extractionTimeSeconds),
    waterTempC: numOrNull(row.waterTempC),
    preInfusionSeconds: numOrNull(row.preInfusionSeconds),
    tds: numOrNull(row.tds),
  };
}

function recipeToDb(row: Partial<RecipeRow>) {
  const out: Record<string, unknown> = { ...row };
  if (row.doseGrams != null) out.doseGrams = String(row.doseGrams);
  if (row.yieldGrams != null) out.yieldGrams = String(row.yieldGrams);
  if (row.extractionTimeSeconds != null) out.extractionTimeSeconds = String(row.extractionTimeSeconds);
  if (row.waterTempC !== undefined) out.waterTempC = row.waterTempC == null ? null : String(row.waterTempC);
  if (row.preInfusionSeconds !== undefined) {
    out.preInfusionSeconds = row.preInfusionSeconds == null ? null : String(row.preInfusionSeconds);
  }
  if (row.tds !== undefined) out.tds = row.tds == null ? null : String(row.tds);
  return out;
}

export class MysqlUow implements ThrowdownUow {
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

  constructor(
    private db: Db = getDb(),
    private nested = false,
  ) {
    this.profiles = new DrizzleTable(db, tables.profiles as never);
    this.otps = new DrizzleTable(db, tables.authOtps as never);
    this.events = new DrizzleTable(db, tables.throwdownEvents as never);
    this.licences = new DrizzleTable(db, tables.eventLicences as never);
    this.payments = new DrizzleTable(db, tables.throwdownPayments as never);
    this.memberships = new DrizzleTable(db, tables.eventMemberships as never);
    this.invitations = new DrizzleTable(db, tables.throwdownInvitations as never);
    this.entries = new DrizzleTable(db, tables.competitorEntries as never);
    this.brackets = new DrizzleTable(db, tables.throwdownBrackets as never);
    this.rounds = new DrizzleTable(db, tables.throwdownRounds as never);
    this.heats = new DrizzleTable(db, tables.throwdownHeats as never);
    this.attempts = new DrizzleTable(db, tables.heatAttempts as never);
    this.heatCompetitors = new DrizzleTable(db, tables.heatCompetitors as never);
    this.mappings = new DrizzleTable(db, tables.cupCodeMappings as never);
    this.judgeAssignments = new DrizzleTable(db, tables.judgeAssignments as never);
    this.ballots = new DrizzleTable(db, tables.throwdownBallots as never);
    this.selections = new DrizzleTable(db, tables.ballotSelections as never);
    this.recipes = new DrizzleTable(db, tables.throwdownRecipes as never, recipeFromDb, recipeToDb);
    this.publications = new DrizzleTable(db, tables.eventPublications as never);
    this.audits = new DrizzleTable(db, tables.throwdownAuditLog as never);
    this.stripeEvents = new DrizzleTable(db, tables.processedStripeEvents as never);
    this.config = new DrizzleTable(db, tables.platformConfig as never);
  }

  async transaction<T>(fn: (uow: ThrowdownUow) => Promise<T>): Promise<T> {
    if (this.nested) return fn(this);
    return this.db.transaction(async (tx) => fn(new MysqlUow(tx as unknown as Db, true)));
  }
}
