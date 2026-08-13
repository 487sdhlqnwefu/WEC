import type { JudgingDeliveryMode } from "./types";

export type ReleaseDecision = {
  showCompetitorNames: boolean;
  showWinner: boolean;
  showVoteSplit: boolean;
  showIndividualBallots: boolean;
  showFeedbackToCompetitor: boolean;
  showFeedbackPublic: boolean;
  showNamedArchive: boolean;
  showPhysicalPhotos: boolean;
  showOnlineJudgingImages: boolean;
  showBlindMapping: boolean;
  showPartialTotals: boolean;
};

export function releasePolicy(params: {
  heatFinalized: boolean;
  eventPublished: boolean;
  judgingDelivery: JudgingDeliveryMode;
  judgingOpen: boolean;
  voteSplitPublicPolicy: boolean;
}): ReleaseDecision {
  const done = params.eventPublished;
  const heatDone = params.heatFinalized;
  return {
    showCompetitorNames: true,
    showWinner: heatDone,
    showVoteSplit: heatDone && params.voteSplitPublicPolicy,
    showIndividualBallots: false,
    showFeedbackToCompetitor: done,
    showFeedbackPublic: false,
    showNamedArchive: done,
    showPhysicalPhotos: params.judgingDelivery === "physical" ? done : done,
    showOnlineJudgingImages: params.judgingDelivery === "online" && params.judgingOpen,
    showBlindMapping: false,
    showPartialTotals: false,
  };
}

export function publicBallotProgress(submitted: number, required: number): {
  submitted: number;
  required: number;
  label: string;
} {
  return {
    submitted,
    required,
    label: `${submitted} of ${required} ballots received`,
  };
}
