import type { PillarScores } from "@contracts/baristaLeagueScoring";

export type MemberRole = "user" | "admin";

export type PlatformMember = {
  id: number;
  unionId: string;
  name: string;
  email: string;
  avatar: string | null;
  role: MemberRole;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string;
};

export type EventKind = "community" | "sponsored";
export type EventStatus = "open" | "live" | "closed" | "published";

export type CompetitionEvent = {
  id: string;
  slug: string;
  name: string;
  location: string;
  date: string;
  description: string;
  kind: EventKind;
  status: EventStatus;
  formatId: "barista_league_2026";
  hostUserId: number;
  sponsorFeePaid: boolean;
  createdAt: string;
};

export type CompetitionTeam = {
  id: string;
  eventId: string;
  name: string;
  members: string;
  city: string;
  registeredByUserId: number;
  createdAt: string;
};

export type CompetitionJudge = {
  id: string;
  eventId: string;
  userId: number;
  displayName: string;
  createdAt: string;
};

export type ScoreCard = {
  id: string;
  eventId: string;
  teamId: string;
  judgeUserId: number;
  scores: PillarScores;
  notes: string;
  submittedAt: string;
};

export type PlatformState = {
  nextMemberId: number;
  members: PlatformMember[];
  events: CompetitionEvent[];
  teams: CompetitionTeam[];
  judges: CompetitionJudge[];
  scorecards: ScoreCard[];
};
