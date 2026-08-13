/** World Latte Art Throwdown v1 locked product constants. */

export const PRODUCT_NAME = "World Latte Art Throwdown";
export const PRODUCT_TYPE = "latte_art_throwdown" as const;
export const RULES_VERSION = "wlat-v1.0";
export const DRAW_VERSION = "wlat-draw-v1";
export const MAPPING_VERSION = "wlat-map-v1";

export const LICENCE_AMOUNT_MINOR = 30_000;
export const LICENCE_CURRENCY = "USD" as const;

export const FIELD_MIN = 8;
export const FIELD_MAX = 128;

export const OFFICIAL_PANEL_SIZES = [1, 3, 5, 7] as const;
export type OfficialPanelSize = (typeof OFFICIAL_PANEL_SIZES)[number];

export const FEEDBACK_MIN_CHARS = 20;
export const FEEDBACK_MAX_CHARS = 2_000;

export const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1_000;
export const MAGIC_LINK_TTL_MS = 30 * 60 * 1_000;
export const MAPPING_REAUTH_TTL_MS = 15 * 60 * 1_000;
export const SIGNED_URL_TTL_SECONDS = 15 * 60;

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const JUDGING_MAX_EDGE_PX = 1600;

export const TIEBREAK_PANEL_SIZE = 3;
export const MAX_ORGANISER_RESTARTS = 1;
export const V1_STATION_COUNT = 1;

export const DEFAULT_OPEN_MEMBER = {
  targetBallots: 21,
  minimumBallots: 11,
  votingWindowSeconds: 15 * 60,
  eligibility: "approved_invitees" as const,
  preapprovedOnly: true,
};

export const DEFAULT_COACH_PERMISSIONS = {
  accessDuringPrep: true,
  verbalDuringPrep: true,
  verbalDuringCompetition: false,
  equipmentHandling: false,
  photographyAssistance: false,
} as const;

export const DEFAULT_TEAM_PERMISSIONS = {
  bothMayTouchEquipment: true,
  bothMaySteam: true,
  bothMayPour: true,
  bothMayPhotograph: true,
} as const;
