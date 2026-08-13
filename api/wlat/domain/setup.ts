import { FIELD_MAX, FIELD_MIN } from "./constants";
import { heatCountForField } from "./bracket";
import { estimateScheduleCapacity } from "./schedule";
import { assertOfficialPanelSize, assertOpenMemberOnlyOnline } from "./judging";
import { assertExactlyOneBlindSteward } from "./roles";
import type {
  CompetitionFormat,
  EquipmentMode,
  EventState,
  JudgingDeliveryMode,
  ParticipationStructure,
  PaymentStatus,
  TimingProfile,
  VotingModel,
} from "./types";

export type SetupSnapshot = {
  name: string;
  slug: string;
  fieldSize: number;
  competitionFormat: CompetitionFormat;
  judgingDelivery: JudgingDeliveryMode;
  votingModel: VotingModel;
  officialJudgeCount: number;
  openMemberTarget?: number;
  openMemberMinimum?: number;
  participation: ParticipationStructure;
  equipmentMode: EquipmentMode;
  timing: TimingProfile;
  paymentStatus: PaymentStatus;
  eventState: EventState;
  blindStewardCount: number;
  assignedJudgeCount: number;
  tiebreakJudgeCount: number;
  approvedPatternCount: number;
  patternRepeatsAllowed: boolean;
  completeEntries: number;
  unresolvedJudgeConflicts: number;
  days: { opensAt: Date; closesAt: Date; localDate: string }[];
  shotBaristaAssigned: boolean;
};

export type SetupWarning = { code: string; message: string; blocking: boolean };

export function validateSetup(snapshot: SetupSnapshot): SetupWarning[] {
  const warnings: SetupWarning[] = [];
  if (!snapshot.name.trim()) {
    warnings.push({ code: "NAME", message: "Event name is required.", blocking: true });
  }
  if (!snapshot.slug.trim()) {
    warnings.push({ code: "SLUG", message: "Public slug is required.", blocking: true });
  }
  if (snapshot.fieldSize < FIELD_MIN || snapshot.fieldSize > FIELD_MAX) {
    warnings.push({
      code: "FIELD",
      message: `Field size must be ${FIELD_MIN}–${FIELD_MAX}.`,
      blocking: true,
    });
  }
  try {
    assertOpenMemberOnlyOnline(snapshot.votingModel, snapshot.judgingDelivery);
  } catch (err) {
    warnings.push({
      code: "OPEN_MEMBER",
      message: err instanceof Error ? err.message : "Invalid judging configuration.",
      blocking: true,
    });
  }
  if (snapshot.votingModel === "official_panel") {
    try {
      assertOfficialPanelSize(snapshot.officialJudgeCount);
    } catch (err) {
      warnings.push({
        code: "PANEL",
        message: err instanceof Error ? err.message : "Invalid panel size.",
        blocking: true,
      });
    }
    if (snapshot.assignedJudgeCount < snapshot.officialJudgeCount) {
      warnings.push({
        code: "JUDGES",
        message: `Assign ${snapshot.officialJudgeCount} judges before lock.`,
        blocking: true,
      });
    }
  } else {
    if ((snapshot.openMemberTarget ?? 0) % 2 === 0 || (snapshot.openMemberTarget ?? 0) < 3) {
      warnings.push({
        code: "TARGET",
        message: "Open Member Judging needs an odd target ballot count of at least 3.",
        blocking: true,
      });
    }
    if (snapshot.tiebreakJudgeCount < 3) {
      warnings.push({
        code: "TIEBREAK",
        message: "Assign three eligible tiebreak judges.",
        blocking: true,
      });
    }
  }
  try {
    assertExactlyOneBlindSteward(snapshot.blindStewardCount);
  } catch (err) {
    warnings.push({
      code: "STEWARD",
      message: err instanceof Error ? err.message : "Blind Steward required.",
      blocking: true,
    });
  }
  if (snapshot.paymentStatus !== "paid") {
    warnings.push({
      code: "PAYMENT",
      message: "USD 300 licence is unpaid. Roster lock and live operation stay closed.",
      blocking: true,
    });
  }
  if (snapshot.completeEntries < snapshot.fieldSize) {
    warnings.push({
      code: "ROSTER",
      message: `Need ${snapshot.fieldSize} complete entries; ${snapshot.completeEntries} ready.`,
      blocking: true,
    });
  }
  if (snapshot.unresolvedJudgeConflicts > 0) {
    warnings.push({
      code: "CONFLICTS",
      message: "Unresolved judge conflicts must be replaced before judging opens.",
      blocking: true,
    });
  }
  if (snapshot.competitionFormat === "match_pattern") {
    const heats = heatCountForField(snapshot.fieldSize);
    const needed = snapshot.patternRepeatsAllowed ? 1 : heats;
    if (snapshot.approvedPatternCount < needed) {
      warnings.push({
        code: "PATTERNS",
        message: `Match the Pattern needs at least ${needed} approved pattern(s) for the repeat policy.`,
        blocking: true,
      });
    }
  }
  if (snapshot.equipmentMode === "central_shot_service" && !snapshot.shotBaristaAssigned) {
    warnings.push({
      code: "SHOT_BARISTA",
      message: "Assign a shot barista for central shot service.",
      blocking: true,
    });
  }
  if (snapshot.days.length > 0) {
    const { heatsFit } = estimateScheduleCapacity(snapshot.days, snapshot.timing);
    const needed = heatCountForField(snapshot.fieldSize);
    if (heatsFit < needed) {
      warnings.push({
        code: "SCHEDULE",
        message: `Configured windows fit about ${heatsFit} heats; ${needed} heats are possible.`,
        blocking: false,
      });
    }
  }
  return warnings;
}

export function canLockRoster(warnings: SetupWarning[]): boolean {
  return warnings.every((w) => !w.blocking);
}
