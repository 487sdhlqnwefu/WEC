import type { WlatSnapshot } from "./models";
import type {
  ArchivePour,
  AuditEvent,
  Ballot,
  BallotRound,
  Bracket,
  BracketNode,
  Entry,
  EntryMember,
  EventConflict,
  EventDay,
  EventIncident,
  EventInvitation,
  EventPayment,
  EventRoleRow,
  FeedbackFlag,
  Heat,
  HeatBlindMapping,
  HeatPhoto,
  HeatRestart,
  HeatResult,
  JudgeAssignment,
  MappingAccessLog,
  Member,
  PatternDraw,
  PatternSubmission,
  RuntimeLock,
  ShotTask,
  Station,
  TimerRun,
  TimingRow,
  WebhookEvent,
  WlatEvent,
} from "./models";

type Collection<T extends { id: string }> = Map<string, T>;

export class MemoryStore {
  members: Collection<Member> = new Map();
  events: Collection<WlatEvent> = new Map();
  payments: Collection<EventPayment> = new Map();
  webhooks: Collection<WebhookEvent> = new Map();
  roles: Collection<EventRoleRow> = new Map();
  invitations: Collection<EventInvitation> = new Map();
  conflicts: Collection<EventConflict> = new Map();
  entries: Collection<Entry> = new Map();
  entryMembers: Collection<EntryMember> = new Map();
  stations: Collection<Station> = new Map();
  days: Collection<EventDay> = new Map();
  timings: Collection<TimingRow> = new Map();
  brackets: Collection<Bracket> = new Map();
  nodes: Collection<BracketNode> = new Map();
  heats: Collection<Heat> = new Map();
  locks: Map<string, RuntimeLock> = new Map();
  timers: Collection<TimerRun> = new Map();
  mappings: Collection<HeatBlindMapping> = new Map();
  mappingLogs: Collection<MappingAccessLog> = new Map();
  patterns: Collection<PatternSubmission> = new Map();
  draws: Collection<PatternDraw> = new Map();
  photos: Collection<HeatPhoto> = new Map();
  assignments: Collection<JudgeAssignment> = new Map();
  rounds: Collection<BallotRound> = new Map();
  ballots: Collection<Ballot> = new Map();
  flags: Collection<FeedbackFlag> = new Map();
  results: Collection<HeatResult> = new Map();
  incidents: Collection<EventIncident> = new Map();
  restarts: Collection<HeatRestart> = new Map();
  audits: AuditEvent[] = [];
  shots: Collection<ShotTask> = new Map();
  archives: Collection<ArchivePour> = new Map();

  private mutexes = new Map<string, Promise<void>>();

  async withLock<T>(key: string, fn: () => Promise<T> | T): Promise<T> {
    const prev = this.mutexes.get(key) ?? Promise.resolve();
    let release: () => void = () => undefined;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.mutexes.set(
      key,
      prev.then(() => current),
    );
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }

  put<T extends { id: string }>(col: Collection<T>, row: T): T {
    col.set(row.id, row);
    return row;
  }

  eventHeats(eventId: string): Heat[] {
    return [...this.heats.values()].filter((h) => h.eventId === eventId);
  }

  eventRoles(eventId: string, memberId?: string): EventRoleRow[] {
    return [...this.roles.values()].filter(
      (r) => r.eventId === eventId && r.status !== "revoked" && (!memberId || r.memberId === memberId),
    );
  }

  eventEntries(eventId: string): Entry[] {
    return [...this.entries.values()].filter((e) => e.eventId === eventId && e.status !== "withdrawn");
  }

  membersOfEntry(entryId: string): EntryMember[] {
    return [...this.entryMembers.values()].filter((m) => m.entryId === entryId);
  }

  activeMapping(heatId: string): HeatBlindMapping | undefined {
    return [...this.mappings.values()].find((m) => m.heatId === heatId && !m.voidedAt);
  }

  activePhotos(heatId: string): HeatPhoto[] {
    return [...this.photos.values()].filter((p) => p.heatId === heatId && !p.voidedAt);
  }

  snapshot(): WlatSnapshot {
    const values = <T,>(m: Map<string, T>) => [...m.values()];
    return {
      members: values(this.members),
      events: values(this.events),
      payments: values(this.payments),
      webhooks: values(this.webhooks),
      roles: values(this.roles),
      invitations: values(this.invitations),
      conflicts: values(this.conflicts),
      entries: values(this.entries),
      entryMembers: values(this.entryMembers),
      stations: values(this.stations),
      days: values(this.days),
      timings: values(this.timings),
      brackets: values(this.brackets),
      nodes: values(this.nodes),
      heats: values(this.heats),
      locks: [...this.locks.values()],
      timers: values(this.timers),
      mappings: values(this.mappings),
      mappingLogs: values(this.mappingLogs),
      patterns: values(this.patterns),
      draws: values(this.draws),
      photos: values(this.photos),
      assignments: values(this.assignments),
      rounds: values(this.rounds),
      ballots: values(this.ballots),
      flags: values(this.flags),
      results: values(this.results),
      incidents: values(this.incidents),
      restarts: values(this.restarts),
      audits: [...this.audits],
      shots: values(this.shots),
      archives: values(this.archives),
    };
  }
}

let singleton: MemoryStore | null = null;

export function getStore(): MemoryStore {
  if (!singleton) singleton = new MemoryStore();
  return singleton;
}

export function resetStore(next?: MemoryStore): MemoryStore {
  singleton = next ?? new MemoryStore();
  return singleton;
}
