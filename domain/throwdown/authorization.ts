import type { MembershipRole } from "./constants";
import type { Blocker, Entitlement, RoleContext } from "./types";
import { premiumActionBlockers } from "./tiers";

export type AuthzDecision = { allow: true } | { allow: false; reason: string };

function deny(reason: string): AuthzDecision {
  return { allow: false, reason };
}

const allow: AuthzDecision = { allow: true };

function hasAccepted(ctx: RoleContext, role: MembershipRole): boolean {
  return ctx.memberships.some((m) => m.role === role && m.status === "accepted");
}

export function canViewCupMappings(ctx: RoleContext): AuthzDecision {
  if (ctx.isPlatformAdmin) {
    return deny("Platform administrators do not receive cup-code mappings. Break-glass access is not available in this interface.");
  }
  if (!hasAccepted(ctx, "cup_steward")) {
    return deny("Only the designated Cup Steward may see competitor-to-code mappings.");
  }
  return allow;
}

export function canViewHiddenRecipe(
  ctx: RoleContext,
  recipeOwnerProfileId: string,
  eventCompleted: boolean,
): AuthzDecision {
  if (eventCompleted) return allow;
  if (ctx.profileId === recipeOwnerProfileId) return allow;
  return deny("Recipes belonging to others are not available until the event is complete.");
}

export function canSubmitBallot(ctx: RoleContext): AuthzDecision {
  if (ctx.competingInHeat) {
    return deny("A competitor must never judge their own heat.");
  }
  if (!ctx.assignedJudgeForHeat) {
    return deny("Only an assigned judge may submit a ballot for this heat.");
  }
  if (hasAccepted(ctx, "cup_steward")) {
    return deny("The Cup Steward cannot judge in this event.");
  }
  return allow;
}

export function canAssignJudge(input: {
  judgeProfileId: string;
  heatCompetitorProfileIds: string[];
  cupStewardProfileId: string | null;
}): AuthzDecision {
  if (input.cupStewardProfileId && input.judgeProfileId === input.cupStewardProfileId) {
    return deny("The Cup Steward cannot judge in this event.");
  }
  if (input.heatCompetitorProfileIds.includes(input.judgeProfileId)) {
    return deny("This judge is competing in the current heat.");
  }
  return allow;
}

export function cupStewardConflicts(input: {
  stewardProfileId: string;
  competitorProfileIds: string[];
  judgePoolProfileIds: string[];
}): AuthzDecision {
  if (input.competitorProfileIds.includes(input.stewardProfileId)) {
    return deny("The Cup Steward cannot compete in the same event.");
  }
  if (input.judgePoolProfileIds.includes(input.stewardProfileId)) {
    return deny("The Cup Steward cannot judge in the same event.");
  }
  return allow;
}

export function canReplaceCupSteward(ctx: RoleContext, eventStarted: boolean): AuthzDecision {
  if (!eventStarted && hasAccepted(ctx, "organiser")) return allow;
  if (ctx.isPlatformAdmin) return allow;
  if (eventStarted) {
    return deny("A mid-event Cup Steward replacement requires a WEC platform administrator action.");
  }
  return deny("Only the organiser may replace the Cup Steward before the event starts.");
}

export function canOrganiserEditBallot(): AuthzDecision {
  return deny("The organiser cannot edit or enter a ballot on a judge's behalf.");
}

export function canViewLiveBallots(ctx: RoleContext, heatFinalised: boolean): AuthzDecision {
  if (heatFinalised) return allow;
  if (ctx.assignedJudgeForHeat) {
    return deny("Judges may not see other judges' choices or live totals before the heat is finalised.");
  }
  return deny("Individual ballot selections are not available before the heat is finalised.");
}

export function canPublishOrStart(entitlement: Entitlement, action: "publish" | "start_event"): Blocker[] {
  return premiumActionBlockers(entitlement, action);
}

export function publicMustNotSee(field: "mappings" | "ballots" | "recipes", eventCompleted: boolean, heatRevealed: boolean): boolean {
  if (field === "mappings") return true;
  if (field === "ballots") return !heatRevealed;
  if (field === "recipes") return !eventCompleted;
  return true;
}

export function canStewardCalculateResults(): AuthzDecision {
  return deny("The Cup Steward cannot calculate results or alter recipes.");
}
