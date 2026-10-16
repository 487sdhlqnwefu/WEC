import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { hashPassword } from "./passwords";
import type {
  CompetitionEvent,
  CompetitionJudge,
  CompetitionTeam,
  PlatformMember,
  PlatformState,
  ScoreCard,
} from "./types";

const DATA_PATH = path.join(process.cwd(), ".data", "wct-platform.json");

const DEMO_PASSWORD = "community";

let state: PlatformState | null = null;
let initPromise: Promise<void> | null = null;

function emptyState(): PlatformState {
  return {
    nextMemberId: 1,
    members: [],
    events: [],
    teams: [],
    judges: [],
    scorecards: [],
  };
}

function persist() {
  if (!state) return;
  mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

function loadFromDisk(): PlatformState | null {
  try {
    const raw = readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw) as PlatformState;
  } catch {
    return null;
  }
}

async function seed(s: PlatformState) {
  const now = new Date().toISOString();
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const addMember = (
    name: string,
    email: string,
    role: PlatformMember["role"] = "user",
  ): PlatformMember => {
    const member: PlatformMember = {
      id: s.nextMemberId++,
      unionId: `member:${email}`,
      name,
      email,
      avatar: null,
      role,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      lastSignInAt: now,
    };
    s.members.push(member);
    return member;
  };

  const host = addMember("Mara Community Host", "mara@wct.members");
  const rachel = addMember("Rachel Apple (demo)", "rachel@wct.members");
  const anthony = addMember("Anthony Ragler (demo)", "anthony@wct.members");
  addMember("Sean Lumpkin (demo)", "sean@wct.members");

  const community: CompetitionEvent = {
    id: nanoid(),
    slug: "people-first-cupping-circle",
    name: "People-First Cupping Circle",
    location: "Community hall, anywhere",
    date: "2026-11-02",
    description:
      "A free community event. Anyone with a member account can host one like this. Brands are optional; people come first.",
    kind: "community",
    status: "published",
    formatId: "barista_league_2026",
    hostUserId: host.id,
    sponsorFeePaid: false,
    createdAt: now,
  };

  const tbl: CompetitionEvent = {
    id: nanoid(),
    slug: "tbl-north-america-2026-demo",
    name: "Barista League North America 2026 (demo scores)",
    location: "Atlanta, Georgia",
    date: "2026-09-03",
    description:
      "Demo of The Barista League 2026 format (Concept 31% / Service 31% / Product 38%) hosted as free World Coffee Tournaments software. These scorecards are not official TBL results — they show how transparent judging would look for that format.",
    kind: "sponsored",
    status: "published",
    formatId: "barista_league_2026",
    hostUserId: host.id,
    sponsorFeePaid: true,
    createdAt: now,
  };

  s.events.push(community, tbl);

  const circleA: CompetitionTeam = {
    id: nanoid(),
    eventId: community.id,
    name: "Shift Leads",
    members: "Asha + Diego",
    city: "Portland",
    registeredByUserId: host.id,
    createdAt: now,
  };
  const circleB: CompetitionTeam = {
    id: nanoid(),
    eventId: community.id,
    name: "Open Bar",
    members: "Lin + Noor",
    city: "Chicago",
    registeredByUserId: host.id,
    createdAt: now,
  };
  s.teams.push(circleA, circleB);

  s.judges.push(
    {
      id: nanoid(),
      eventId: community.id,
      userId: rachel.id,
      displayName: rachel.name,
      createdAt: now,
    },
    {
      id: nanoid(),
      eventId: tbl.id,
      userId: rachel.id,
      displayName: rachel.name,
      createdAt: now,
    },
    {
      id: nanoid(),
      eventId: tbl.id,
      userId: anthony.id,
      displayName: anthony.name,
      createdAt: now,
    },
  );

  s.scorecards.push(
    {
      id: nanoid(),
      eventId: community.id,
      teamId: circleA.id,
      judgeUserId: rachel.id,
      scores: { concept: 8, service: 9, product: 7.5 },
      notes: "Warm room, clear story, espresso a touch tight.",
      submittedAt: now,
    },
    {
      id: nanoid(),
      eventId: community.id,
      teamId: circleB.id,
      judgeUserId: rachel.id,
      scores: { concept: 7.5, service: 8, product: 8.5 },
      notes: "Quiet service, outstanding cups.",
      submittedAt: now,
    },
  );

  const brave: CompetitionTeam = {
    id: nanoid(),
    eventId: tbl.id,
    name: "BRAVEPRO Twins",
    members: "Jorge Itriago & Julio Itriago",
    city: "Georgia & Florida",
    registeredByUserId: host.id,
    createdAt: now,
  };
  const rush: CompetitionTeam = {
    id: nanoid(),
    eventId: tbl.id,
    name: "Coffee Rush Hour",
    members: "Sean Lumpkin & Sun Le",
    city: "Georgia",
    registeredByUserId: host.id,
    createdAt: now,
  };
  const wranglers: CompetitionTeam = {
    id: nanoid(),
    eventId: tbl.id,
    name: "Bean Wranglers",
    members: "Santiago Lopez & Kristen Boldt",
    city: "Canada",
    registeredByUserId: host.id,
    createdAt: now,
  };
  s.teams.push(brave, rush, wranglers);

  const tblCards: Omit<ScoreCard, "id" | "submittedAt">[] = [
    {
      eventId: tbl.id,
      teamId: brave.id,
      judgeUserId: rachel.id,
      scores: { concept: 8, service: 8.5, product: 8 },
      notes: "Big hospitality concept; drinks consistent.",
    },
    {
      eventId: tbl.id,
      teamId: brave.id,
      judgeUserId: anthony.id,
      scores: { concept: 7.5, service: 8, product: 8.5 },
      notes: "Service polish, espresso leading.",
    },
    {
      eventId: tbl.id,
      teamId: rush.id,
      judgeUserId: rachel.id,
      scores: { concept: 9, service: 8.5, product: 8 },
      notes: "Atlanta-rooted story, energetic service.",
    },
    {
      eventId: tbl.id,
      teamId: rush.id,
      judgeUserId: anthony.id,
      scores: { concept: 8.5, service: 9, product: 7.5 },
      notes: "Room felt invited in; product a shade behind concept.",
    },
    {
      eventId: tbl.id,
      teamId: wranglers.id,
      judgeUserId: rachel.id,
      scores: { concept: 8, service: 7.5, product: 9 },
      notes: "Producer-connected cups were the highlight.",
    },
    {
      eventId: tbl.id,
      teamId: wranglers.id,
      judgeUserId: anthony.id,
      scores: { concept: 7.5, service: 8, product: 9 },
      notes: "Product excellence; concept slightly quieter.",
    },
  ];

  for (const card of tblCards) {
    s.scorecards.push({ ...card, id: nanoid(), submittedAt: now });
  }
}

export async function ensureStore(): Promise<PlatformState> {
  if (state) return state;
  if (!initPromise) {
    initPromise = (async () => {
      const existing = loadFromDisk();
      if (existing?.members?.length) {
        state = existing;
        return;
      }
      const s = emptyState();
      await seed(s);
      state = s;
      persist();
    })();
  }
  await initPromise;
  return state!;
}

function save(s: PlatformState) {
  state = s;
  persist();
}

export async function getState(): Promise<PlatformState> {
  return ensureStore();
}

export async function findMemberByEmail(email: string) {
  const s = await ensureStore();
  const needle = email.trim().toLowerCase();
  return s.members.find((m) => m.email.toLowerCase() === needle) ?? null;
}

export async function findMemberByUnionId(unionId: string) {
  const s = await ensureStore();
  return s.members.find((m) => m.unionId === unionId) ?? null;
}

export async function createMember(input: {
  name: string;
  email: string;
  password: string;
}) {
  const s = await ensureStore();
  const email = input.email.trim().toLowerCase();
  if (s.members.some((m) => m.email.toLowerCase() === email)) {
    throw new Error("An account with that email already exists");
  }
  const now = new Date().toISOString();
  const member: PlatformMember = {
    id: s.nextMemberId++,
    unionId: `member:${email}`,
    name: input.name.trim(),
    email,
    avatar: null,
    role: "user",
    passwordHash: await hashPassword(input.password),
    createdAt: now,
    updatedAt: now,
    lastSignInAt: now,
  };
  s.members.push(member);
  save(s);
  return member;
}

export async function touchSignIn(memberId: number) {
  const s = await ensureStore();
  const member = s.members.find((m) => m.id === memberId);
  if (!member) return;
  member.lastSignInAt = new Date().toISOString();
  save(s);
}

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "event"}-${nanoid(6)}`;
}

export async function createEvent(input: {
  name: string;
  location: string;
  date: string;
  description: string;
  kind: CompetitionEvent["kind"];
  hostUserId: number;
}) {
  const s = await ensureStore();
  const event: CompetitionEvent = {
    id: nanoid(),
    slug: slugify(input.name),
    name: input.name.trim(),
    location: input.location.trim(),
    date: input.date.trim(),
    description: input.description.trim(),
    kind: input.kind,
    status: "open",
    formatId: "barista_league_2026",
    hostUserId: input.hostUserId,
    sponsorFeePaid: input.kind === "community",
    createdAt: new Date().toISOString(),
  };
  s.events.push(event);
  save(s);
  return event;
}

export async function listEvents() {
  const s = await ensureStore();
  return [...s.events].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "community" ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getEventBySlug(slug: string) {
  const s = await ensureStore();
  return s.events.find((e) => e.slug === slug) ?? null;
}

export async function registerTeam(input: {
  eventId: string;
  name: string;
  members: string;
  city: string;
  registeredByUserId: number;
}) {
  const s = await ensureStore();
  const event = s.events.find((e) => e.id === input.eventId);
  if (!event) throw new Error("Event not found");
  if (event.status === "closed" || event.status === "published") {
    throw new Error("Registration is closed for this event");
  }
  const team: CompetitionTeam = {
    id: nanoid(),
    eventId: input.eventId,
    name: input.name.trim(),
    members: input.members.trim(),
    city: input.city.trim(),
    registeredByUserId: input.registeredByUserId,
    createdAt: new Date().toISOString(),
  };
  s.teams.push(team);
  save(s);
  return team;
}

export async function volunteerJudge(input: {
  eventId: string;
  userId: number;
  displayName: string;
}) {
  const s = await ensureStore();
  const event = s.events.find((e) => e.id === input.eventId);
  if (!event) throw new Error("Event not found");
  if (s.judges.some((j) => j.eventId === input.eventId && j.userId === input.userId)) {
    throw new Error("You are already a judge on this event");
  }
  const judge: CompetitionJudge = {
    id: nanoid(),
    eventId: input.eventId,
    userId: input.userId,
    displayName: input.displayName,
    createdAt: new Date().toISOString(),
  };
  s.judges.push(judge);
  if (event.status === "open") event.status = "live";
  save(s);
  return judge;
}

export async function upsertScore(input: {
  eventId: string;
  teamId: string;
  judgeUserId: number;
  scores: ScoreCard["scores"];
  notes: string;
}) {
  const s = await ensureStore();
  const event = s.events.find((e) => e.id === input.eventId);
  if (!event) throw new Error("Event not found");
  const isJudge = s.judges.some(
    (j) => j.eventId === input.eventId && j.userId === input.judgeUserId,
  );
  if (!isJudge) throw new Error("Only assigned judges can submit scores");
  const team = s.teams.find((t) => t.id === input.teamId && t.eventId === input.eventId);
  if (!team) throw new Error("Team not found");

  const existing = s.scorecards.find(
    (c) =>
      c.eventId === input.eventId &&
      c.teamId === input.teamId &&
      c.judgeUserId === input.judgeUserId,
  );
  const now = new Date().toISOString();
  if (existing) {
    existing.scores = input.scores;
    existing.notes = input.notes;
    existing.submittedAt = now;
    save(s);
    return existing;
  }
  const card: ScoreCard = {
    id: nanoid(),
    eventId: input.eventId,
    teamId: input.teamId,
    judgeUserId: input.judgeUserId,
    scores: input.scores,
    notes: input.notes,
    submittedAt: now,
  };
  s.scorecards.push(card);
  if (event.status === "open") event.status = "live";
  save(s);
  return card;
}

export async function publishEvent(eventId: string, actorUserId: number) {
  const s = await ensureStore();
  const event = s.events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event not found");
  if (event.hostUserId !== actorUserId) throw new Error("Only the host can publish");
  if (event.kind === "sponsored" && !event.sponsorFeePaid) {
    throw new Error("Sponsored events must record the host fee before publishing");
  }
  event.status = "published";
  save(s);
  return event;
}

export async function markSponsorFeePaid(eventId: string, actorUserId: number) {
  const s = await ensureStore();
  const event = s.events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event not found");
  if (event.hostUserId !== actorUserId) throw new Error("Only the host can record the fee");
  if (event.kind !== "sponsored") throw new Error("Community events do not pay a software fee");
  event.sponsorFeePaid = true;
  save(s);
  return event;
}

export async function teamsFor(eventId: string) {
  const s = await ensureStore();
  return s.teams.filter((t) => t.eventId === eventId);
}

export async function judgesFor(eventId: string) {
  const s = await ensureStore();
  return s.judges.filter((j) => j.eventId === eventId);
}

export async function scorecardsFor(eventId: string) {
  const s = await ensureStore();
  return s.scorecards.filter((c) => c.eventId === eventId);
}

export async function memberPublic(id: number) {
  const s = await ensureStore();
  const m = s.members.find((x) => x.id === id);
  if (!m) return null;
  return { id: m.id, name: m.name, email: m.email };
}

export const DEMO_PASSWORD_HINT = DEMO_PASSWORD;
