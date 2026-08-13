import { badRequest } from "./errors";
import type { CompetitionFormat, HeatState } from "./types";
import { ACTIVE_HEAT_STATES } from "./types";

export function isActiveHeatState(state: HeatState): boolean {
  return (ACTIVE_HEAT_STATES as readonly string[]).includes(state);
}

type TransitionContext = {
  format: CompetitionFormat;
  bothCheckedIn?: boolean;
  patternDrawn?: boolean;
  bothPhotosSubmitted?: boolean;
  requiredBallotsComplete?: boolean;
  unresolvedIncident?: boolean;
};

const BASE_FORWARD: Partial<Record<HeatState, HeatState>> = {
  scheduled: "check_in",
  prep: "competition",
  competition: "photography",
  photography: "awaiting_uploads",
  awaiting_uploads: "judging_open",
  judging_open: "judging_closed",
  judging_closed: "finalized",
};

export function nextNormalHeatState(
  current: HeatState,
  format: CompetitionFormat,
): HeatState | null {
  if (current === "check_in") {
    return format === "match_pattern" ? "pattern_reveal" : "prep";
  }
  if (current === "pattern_reveal") return "prep";
  return BASE_FORWARD[current] ?? null;
}

export function legalHeatTargets(current: HeatState, format: CompetitionFormat): HeatState[] {
  const targets: HeatState[] = [];
  const next = nextNormalHeatState(current, format);
  if (next) targets.push(next);

  if (current === "photography" && format) {
    targets.push("judging_open");
  }

  if (isActiveHeatState(current) && current !== "paused") {
    targets.push("paused", "restart_pending", "void");
  }
  if (current === "paused") {
    targets.push("restart_pending", "void");
  }
  if (current === "restart_pending") {
    targets.push("check_in", "void");
  }
  if (current === "restarted") {
    targets.push("check_in");
  }
  if (current === "scheduled") {
    targets.push("void");
  }
  return [...new Set(targets)];
}

export function canTransitionHeat(
  from: HeatState,
  to: HeatState,
  ctx: TransitionContext,
): boolean {
  if (from === to) return true;
  if (from === "finalized" || from === "void") return false;

  if (to === "paused") {
    return isActiveHeatState(from) && from !== "paused";
  }
  if (from === "paused") {
    return to === "restart_pending" || to === "void" || isActiveHeatState(to);
  }
  if (to === "void") {
    return true;
  }
  if (to === "restart_pending") {
    return isActiveHeatState(from);
  }
  if (from === "restart_pending" && (to === "check_in" || to === "restarted")) {
    return true;
  }
  if (from === "restarted" && to === "check_in") return true;

  if (from === "check_in" && to === "pattern_reveal") {
    return ctx.format === "match_pattern" && ctx.bothCheckedIn === true;
  }
  if (from === "check_in" && to === "prep") {
    return ctx.format === "freestyle" && ctx.bothCheckedIn === true;
  }
  if (from === "pattern_reveal" && to === "prep") {
    return ctx.format === "match_pattern" && ctx.patternDrawn === true;
  }
  if (from === "awaiting_uploads" && to === "judging_open") {
    return ctx.bothPhotosSubmitted === true;
  }
  if (from === "photography" && to === "judging_open") {
    return ctx.bothPhotosSubmitted === true;
  }
  if (from === "judging_closed" && to === "finalized") {
    return ctx.requiredBallotsComplete === true && ctx.unresolvedIncident !== true;
  }

  const expected = nextNormalHeatState(from, ctx.format);
  return expected === to;
}

export function assertHeatTransition(
  from: HeatState,
  to: HeatState,
  ctx: TransitionContext,
): void {
  if (!canTransitionHeat(from, to, ctx)) {
    throw badRequest(
      "ILLEGAL_HEAT_TRANSITION",
      `Cannot move heat from ${from} to ${to} for ${ctx.format}.`,
    );
  }
}

export function assertSingleActiveHeat(activeHeatIds: string[]): void {
  if (activeHeatIds.length > 1) {
    throw badRequest(
      "ONE_ACTIVE_HEAT",
      "v1 permits exactly one active heat per tournament.",
    );
  }
}

export function assertCanStartHeat(params: {
  existingActiveHeatId: string | null;
  nextHeatId: string;
}): void {
  if (params.existingActiveHeatId && params.existingActiveHeatId !== params.nextHeatId) {
    throw badRequest(
      "ONE_ACTIVE_HEAT",
      "A heat is already active. Finalise or resolve it before starting the next heat.",
    );
  }
}
