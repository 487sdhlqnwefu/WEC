import { DRAW_VERSION } from "./constants";
import { pickSecure } from "./crypto";
import { badRequest } from "./errors";

export type PatternDrawInput = {
  approvedPatternIds: string[];
  previouslySelectedIds: string[];
  allowRepeat: boolean;
  voidedDrawIds?: string[];
};

export type PatternDrawResult = {
  selectedPatternId: string;
  eligiblePatternIds: string[];
  randomDrawVersion: string;
};

export function eligiblePatternIds(input: PatternDrawInput): string[] {
  const voided = new Set(input.voidedDrawIds ?? []);
  const used = new Set(input.previouslySelectedIds.filter((id) => !voided.has(id)));
  let eligible = input.approvedPatternIds;
  if (!input.allowRepeat) {
    eligible = eligible.filter((id) => !used.has(id));
    if (eligible.length === 0) {
      eligible = input.approvedPatternIds;
    }
  }
  return eligible;
}

export function drawPattern(input: PatternDrawInput): PatternDrawResult {
  const eligible = eligiblePatternIds(input);
  if (eligible.length === 0) {
    throw badRequest(
      "PATTERN_POOL_EMPTY",
      "No approved patterns are available for this heat.",
    );
  }
  return {
    selectedPatternId: pickSecure(eligible),
    eligiblePatternIds: eligible,
    randomDrawVersion: DRAW_VERSION,
  };
}

export function assertCanRedraw(reason: string): void {
  const trimmed = reason.trim();
  if (trimmed.length < 12) {
    throw badRequest(
      "INVALID_REDRAW",
      "An authorised redraw requires a documented invalid-pattern reason.",
    );
  }
}

export function patternsNeeded(fieldSize: number, allowRepeat: boolean, heats: number): number {
  if (allowRepeat) return 1;
  return Math.min(heats, fieldSize);
}
