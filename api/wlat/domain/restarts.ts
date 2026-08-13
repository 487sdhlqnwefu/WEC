import { MAX_ORGANISER_RESTARTS } from "./constants";
import { badRequest, forbidden } from "./errors";
import {
  NON_RESTARTABLE_REASONS,
  type RestartReasonType,
} from "./types";

export function assertRestartEligible(params: {
  reason: RestartReasonType;
  notes: string;
  existingRestartCount: number;
  isPlatformAdmin: boolean;
}): void {
  if ((NON_RESTARTABLE_REASONS as readonly string[]).includes(params.reason)) {
    throw badRequest(
      "RESTART_NOT_QUALIFYING",
      "Competitor mistakes, texture, spills, missed steps, photography technique, or an unattractive pour are not normally restartable.",
    );
  }
  if (params.notes.trim().length < 12) {
    throw badRequest("RESTART_NOTES", "Mandatory notes are required for a restart.");
  }
  if (params.existingRestartCount >= MAX_ORGANISER_RESTARTS && !params.isPlatformAdmin) {
    throw forbidden(
      "RESTART_LIMIT",
      "Only one organiser-approved restart is allowed. Further failures require Platform Admin resolution.",
    );
  }
}

export function restartVoids(params: {
  patternInvalid: boolean;
}): {
  voidTimer: boolean;
  voidPhotos: boolean;
  voidBallots: boolean;
  voidPattern: boolean;
  voidMapping: boolean;
} {
  return {
    voidTimer: true,
    voidPhotos: true,
    voidBallots: true,
    voidPattern: params.patternInvalid,
    voidMapping: true,
  };
}
