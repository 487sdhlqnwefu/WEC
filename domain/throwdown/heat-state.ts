import type { HeatState } from "./constants";

const TRANSITIONS: Record<HeatState, HeatState[]> = {
  scheduled: ["staged", "void"],
  staged: ["brewing", "void"],
  brewing: ["brewing_complete", "void"],
  brewing_complete: ["judging_open", "void"],
  judging_open: ["ballots_complete", "void"],
  ballots_complete: ["result_revealed", "void"],
  result_revealed: ["recipes_complete", "void"],
  recipes_complete: ["complete"],
  complete: [],
  void: [],
};

export function canTransition(from: HeatState, to: HeatState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: HeatState, to: HeatState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Heat cannot move from ${from} to ${to}.`);
  }
}

export function recipesUnlocked(state: HeatState, brewingCompletedAt: Date | null): boolean {
  if (state === "void") return false;
  if (brewingCompletedAt) return true;
  return (
    state === "brewing_complete" ||
    state === "judging_open" ||
    state === "ballots_complete" ||
    state === "result_revealed" ||
    state === "recipes_complete" ||
    state === "complete"
  );
}

export function judgingOpen(state: HeatState): boolean {
  return state === "judging_open";
}

export function resultVisible(state: HeatState): boolean {
  return (
    state === "result_revealed" ||
    state === "recipes_complete" ||
    state === "complete"
  );
}

export type HeatReadiness = {
  canStage: boolean;
  canStart: boolean;
  canMarkBrewingComplete: boolean;
  canOpenJudging: boolean;
  canReveal: boolean;
  canComplete: boolean;
  blockers: string[];
};

export function evaluateHeatReadiness(input: {
  state: HeatState;
  isBye: boolean;
  judgeCountRequired: number;
  judgesAssigned: number;
  anyJudgeIsCompetitor: boolean;
  cupCodesGenerated: boolean;
  stewardConfirmed: boolean;
  ballotsSubmitted: number;
  recipesLocked: number;
  recipesRequired: number;
  previousHeatsBlocking: string[];
}): HeatReadiness {
  const blockers: string[] = [...input.previousHeatsBlocking];

  if (input.isBye) {
    return {
      canStage: false,
      canStart: false,
      canMarkBrewingComplete: false,
      canOpenJudging: false,
      canReveal: false,
      canComplete: input.state !== "complete" && input.state !== "void",
      blockers: input.state === "complete" ? [] : blockers,
    };
  }

  if (input.anyJudgeIsCompetitor) {
    blockers.push("This judge is competing in the current heat.");
  }
  if (input.judgesAssigned !== input.judgeCountRequired) {
    blockers.push(
      `Assign exactly ${input.judgeCountRequired} eligible ${input.judgeCountRequired === 1 ? "judge" : "judges"}.`,
    );
  }
  if (input.state === "staged" && !input.stewardConfirmed) {
    blockers.push("Cup Steward has not confirmed the cup codes.");
  }
  if (!input.cupCodesGenerated && (input.state === "scheduled" || input.state === "staged")) {
    blockers.push("Cup codes have not been generated for this heat.");
  }
  if (input.state === "ballots_complete" && input.ballotsSubmitted < input.judgeCountRequired) {
    blockers.push("Waiting for every assigned ballot.");
  }
  if (
    (input.state === "result_revealed" || input.state === "recipes_complete") &&
    input.recipesLocked < input.recipesRequired
  ) {
    blockers.push("Waiting for both competitors to lock their recipes.");
  }

  return {
    canStage:
      input.state === "scheduled" &&
      input.judgesAssigned === input.judgeCountRequired &&
      !input.anyJudgeIsCompetitor &&
      input.previousHeatsBlocking.length === 0,
    canStart: input.state === "staged" && input.stewardConfirmed && input.cupCodesGenerated,
    canMarkBrewingComplete: input.state === "brewing",
    canOpenJudging: input.state === "brewing_complete",
    canReveal:
      input.state === "ballots_complete" && input.ballotsSubmitted === input.judgeCountRequired,
    canComplete:
      input.state === "recipes_complete" && input.recipesLocked >= input.recipesRequired,
    blockers,
  };
}

export type PreviousHeatGate = {
  label: string;
  state: HeatState;
  competitorNamesMissingRecipes: string[];
  isByeSkipped?: boolean;
};

export function nextHeatBlockedBy(previous: PreviousHeatGate): string | null {
  if (previous.state === "void") return null;
  if (previous.state === "complete" || previous.state === "recipes_complete") return null;
  if (previous.isByeSkipped) return null;
  if (previous.competitorNamesMissingRecipes.length > 0) {
    const names = previous.competitorNamesMissingRecipes;
    if (names.length === 1) {
      return `Waiting for ${names[0]}'s recipe submission from ${previous.label}.`;
    }
    return `Waiting for recipe submissions from ${previous.label}: ${names.join(" and ")}.`;
  }
  return `The next heat cannot start until ${previous.label} is complete, including locked recipes.`;
}
