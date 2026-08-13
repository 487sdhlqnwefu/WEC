import {
  FEEDBACK_MAX_CHARS,
  FEEDBACK_MIN_CHARS,
  OFFICIAL_PANEL_SIZES,
  TIEBREAK_PANEL_SIZE,
} from "./constants";
import { badRequest } from "./errors";
import type { BlindEntry, FeedbackFlagType, VotingModel } from "./types";
import type { OfficialPanelSize } from "./constants";

export function assertOfficialPanelSize(n: number): asserts n is OfficialPanelSize {
  if (!(OFFICIAL_PANEL_SIZES as readonly number[]).includes(n)) {
    throw badRequest(
      "INVALID_PANEL",
      "Official Panel must have exactly 1, 3, 5, or 7 judges.",
    );
  }
}

export function assertOpenMemberOnlyOnline(
  votingModel: VotingModel,
  judgingDelivery: "physical" | "online",
): void {
  if (votingModel === "open_member" && judgingDelivery !== "online") {
    throw badRequest(
      "OPEN_MEMBER_ONLINE_ONLY",
      "Open Member Judging is available only with online image judging.",
    );
  }
}

export function validateFeedback(text: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length < FEEDBACK_MIN_CHARS) {
    throw badRequest(
      "FEEDBACK_TOO_SHORT",
      `Explain why the selected entry was preferred (at least ${FEEDBACK_MIN_CHARS} characters).`,
    );
  }
  if (trimmed.length > FEEDBACK_MAX_CHARS) {
    throw badRequest("FEEDBACK_TOO_LONG", "Feedback is too long.");
  }
  const meaningless = /^((asdf)+|(test)+|ok+|good+|nice+|idk+|n\/a|na|\.+|-+)$/i;
  if (meaningless.test(trimmed.replace(/\s/g, ""))) {
    throw badRequest(
      "FEEDBACK_MEANINGLESS",
      "Feedback must explain why the selected entry was preferred to the other entry.",
    );
  }
  return trimmed;
}

export function feedbackQualityFlags(params: {
  text: string;
  submittedAt: Date;
  openedAt: Date | null;
  previousTexts: string[];
}): { flag: FeedbackFlagType; details: string }[] {
  const flags: { flag: FeedbackFlagType; details: string }[] = [];
  const text = params.text.trim();
  if (text.length < FEEDBACK_MIN_CHARS + 8) {
    flags.push({ flag: "too_short", details: "Feedback is only slightly above the minimum." });
  }
  const comparative =
    /\b(better|clearer|closer|more|than|versus|vs|compared|cleaner|sharper|stronger|weaker|messier|tighter)\b/i;
  if (!comparative.test(text)) {
    flags.push({
      flag: "possible_non_comparative",
      details: "No obvious comparative language detected. For human review only.",
    });
  }
  const normalized = text.toLowerCase();
  if (params.previousTexts.some((prev) => prev.trim().toLowerCase() === normalized)) {
    flags.push({ flag: "repeated_text", details: "Identical to another ballot by this voter." });
  }
  if (params.openedAt) {
    const elapsed = params.submittedAt.getTime() - params.openedAt.getTime();
    if (elapsed >= 0 && elapsed < 8_000) {
      flags.push({ flag: "unusually_fast", details: `Submitted in ${Math.round(elapsed / 1000)}s.` });
    }
  }
  return flags;
}

export type Tally = {
  voteA: number;
  voteB: number;
  winner: BlindEntry | "tie";
  total: number;
};

export function tallyBlindVotes(selections: BlindEntry[]): Tally {
  let voteA = 0;
  let voteB = 0;
  for (const s of selections) {
    if (s === "A") voteA += 1;
    else voteB += 1;
  }
  const total = voteA + voteB;
  let winner: BlindEntry | "tie" = "tie";
  if (voteA > voteB) winner = "A";
  else if (voteB > voteA) winner = "B";
  return { voteA, voteB, winner, total };
}

export function officialPanelComplete(judgeCount: number, submitted: number): boolean {
  assertOfficialPanelSize(judgeCount);
  return submitted === judgeCount;
}

export function openMemberShouldClose(params: {
  validBallots: number;
  targetBallots: number;
  windowEnded: boolean;
}): { close: boolean; reason: "target" | "window" | null } {
  if (params.validBallots >= params.targetBallots) {
    return { close: true, reason: "target" };
  }
  if (params.windowEnded) {
    return { close: true, reason: "window" };
  }
  return { close: false, reason: null };
}

export function openMemberNeedsTiebreak(tally: Tally, windowEnded: boolean, targetReached: boolean): boolean {
  if (targetReached && tally.winner !== "tie") return false;
  if (!windowEnded && !targetReached) return false;
  if (tally.total === 0) return true;
  if (tally.total % 2 === 0) return true;
  return tally.winner === "tie";
}

export function assertTiebreakPanel(size: number): void {
  if (size !== TIEBREAK_PANEL_SIZE) {
    throw badRequest(
      "INVALID_TIEBREAK",
      `Tiebreak requires exactly ${TIEBREAK_PANEL_SIZE} preassigned eligible judges.`,
    );
  }
}

export function majorityWinner(tally: Tally): BlindEntry {
  if (tally.winner === "tie") {
    throw badRequest("TIED_RESULT", "A tied tally cannot finalise without a tiebreak.");
  }
  return tally.winner;
}

export function judgingPrompt(format: "freestyle" | "match_pattern"): string {
  return format === "match_pattern"
    ? "Which entry matches the reference pattern better?"
    : "Which entry looks better?";
}

export function assertBallotChoice(value: string): asserts value is BlindEntry {
  if (value !== "A" && value !== "B") {
    throw badRequest("INVALID_CHOICE", "A ballot must choose Entry A or Entry B only.");
  }
}
