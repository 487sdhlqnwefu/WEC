import { DEFAULT_COACH_PERMISSIONS, DEFAULT_TEAM_PERMISSIONS } from "./constants";
import { badRequest, forbidden } from "./errors";
import type {
  CoachPermissions,
  EventRole,
  StaffCapability,
  TeamPermissions,
} from "./types";

export const INCOMPATIBLE_WITH_BLIND_STEWARD: readonly EventRole[] = [
  "competitor",
  "coach",
  "team_member",
  "judge",
  "tiebreak_judge",
  "online_member_voter",
];

export const INCOMPATIBLE_WITH_COMPETITOR: readonly EventRole[] = [
  "judge",
  "tiebreak_judge",
  "blind_steward",
];

export function rolesConflict(existing: EventRole[], incoming: EventRole): EventRole | null {
  if (incoming === "blind_steward") {
    return existing.find((r) => INCOMPATIBLE_WITH_BLIND_STEWARD.includes(r)) ?? null;
  }
  if (INCOMPATIBLE_WITH_BLIND_STEWARD.includes(incoming) && existing.includes("blind_steward")) {
    return "blind_steward";
  }
  if (incoming === "judge" || incoming === "tiebreak_judge") {
    if (existing.includes("competitor") || existing.includes("team_member")) {
      return existing.includes("competitor") ? "competitor" : "team_member";
    }
  }
  if ((incoming === "competitor" || incoming === "team_member") &&
      (existing.includes("judge") || existing.includes("tiebreak_judge"))) {
    return existing.includes("judge") ? "judge" : "tiebreak_judge";
  }
  return null;
}

export function assertRoleCompatible(existing: EventRole[], incoming: EventRole): void {
  const conflict = rolesConflict(existing, incoming);
  if (conflict) {
    throw forbidden(
      "ROLE_CONFLICT",
      `Role ${incoming} is incompatible with ${conflict} on the same event.`,
    );
  }
}

export function canViewBlindMapping(roles: EventRole[], isPlatformAdmin: boolean): boolean {
  return isPlatformAdmin || roles.includes("blind_steward");
}

export function canOperateTimer(roles: EventRole[], capabilities: StaffCapability[]): boolean {
  return (
    roles.includes("lead_organiser") ||
    roles.includes("co_organiser") ||
    capabilities.includes("timer_operator")
  );
}

export function canManageRoster(roles: EventRole[], capabilities: StaffCapability[]): boolean {
  return (
    roles.includes("lead_organiser") ||
    roles.includes("co_organiser") ||
    capabilities.includes("roster_desk")
  );
}

export function isOrganiser(roles: EventRole[]): boolean {
  return roles.includes("lead_organiser") || roles.includes("co_organiser");
}

export function assertExactlyOneBlindSteward(activeStewardCount: number): void {
  if (activeStewardCount !== 1) {
    throw badRequest(
      "BLIND_STEWARD_REQUIRED",
      "Exactly one active Blind Steward must be assigned before the bracket can start.",
    );
  }
}

export function mergeCoachPermissions(
  overrides?: Partial<CoachPermissions>,
): CoachPermissions {
  return { ...DEFAULT_COACH_PERMISSIONS, ...overrides };
}

export function mergeTeamPermissions(overrides?: Partial<TeamPermissions>): TeamPermissions {
  return { ...DEFAULT_TEAM_PERMISSIONS, ...overrides };
}

export function organiserJudgeWarning(roles: EventRole[]): string | null {
  if (roles.includes("lead_organiser") && (roles.includes("judge") || roles.includes("tiebreak_judge"))) {
    return "Platform policy recommends a separate Blind Steward and strongly warns against combining organiser and judge roles. The organiser must have no mapping access.";
  }
  return null;
}

export type JudgeConflictInput = {
  judgeMemberId: string;
  heatEntryMemberIds: string[];
  coachedEntryIds: string[];
  heatEntryIds: string[];
  affiliationNames: string[];
  heatAffiliationNames: string[];
  declaredConflicts: { relatedMemberId: string | null; relatedEntryId: string | null; affiliationName: string | null }[];
};

export function judgeHasHeatConflict(input: JudgeConflictInput): boolean {
  if (input.heatEntryMemberIds.includes(input.judgeMemberId)) return true;
  if (input.coachedEntryIds.some((id) => input.heatEntryIds.includes(id))) return true;
  const aff = new Set(input.affiliationNames.map((a) => a.trim().toLowerCase()).filter(Boolean));
  if (input.heatAffiliationNames.some((a) => aff.has(a.trim().toLowerCase()))) return true;
  return input.declaredConflicts.some((c) => {
    if (c.relatedMemberId && input.heatEntryMemberIds.includes(c.relatedMemberId)) return true;
    if (c.relatedEntryId && input.heatEntryIds.includes(c.relatedEntryId)) return true;
    if (c.affiliationName && aff.has(c.affiliationName.trim().toLowerCase())) return true;
    return false;
  });
}
