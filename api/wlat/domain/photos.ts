import { createHash } from "node:crypto";
import { ALLOWED_IMAGE_MIME, MAX_IMAGE_BYTES } from "./constants";
import { badRequest } from "./errors";
import type { JudgingDeliveryMode, PhotoSubmissionStatus } from "./types";

export function assertImageUpload(params: {
  mimeType: string;
  byteLength: number;
  originalFilename: string;
}): void {
  const mime = params.mimeType.toLowerCase();
  if (!(ALLOWED_IMAGE_MIME as readonly string[]).includes(mime)) {
    throw badRequest("UNSUPPORTED_IMAGE", "Upload a JPEG, PNG, or WebP photograph.");
  }
  if (params.byteLength <= 0 || params.byteLength > MAX_IMAGE_BYTES) {
    throw badRequest("IMAGE_SIZE", "Photograph must be 12 MB or smaller.");
  }
  const name = params.originalFilename.toLowerCase();
  if (name.endsWith(".svg") || name.endsWith(".html") || name.endsWith(".js")) {
    throw badRequest("UNSUPPORTED_IMAGE", "That file type is not allowed.");
  }
}

export function canReplacePhoto(status: PhotoSubmissionStatus, photographyOpen: boolean): boolean {
  if (!photographyOpen) return false;
  return status === "uploaded" || status === "verified" || status === "submitted" || status === "processing";
}

export function bothPhotosReady(
  photos: { entryId: string; submissionStatus: PhotoSubmissionStatus; voidedAt: Date | null }[],
  entryIds: [string, string],
): boolean {
  return entryIds.every((entryId) =>
    photos.some(
      (p) =>
        p.entryId === entryId &&
        p.voidedAt === null &&
        (p.submissionStatus === "submitted" || p.submissionStatus === "verified"),
    ),
  );
}

export function publicPhotoVisible(params: {
  eventPublished: boolean;
  judgingDelivery: JudgingDeliveryMode;
  heatFinalized: boolean;
}): boolean {
  if (params.judgingDelivery === "physical") {
    return params.eventPublished;
  }
  if (params.eventPublished) return true;
  return false;
}

export function judgingImagesVisible(params: {
  judgingDelivery: JudgingDeliveryMode;
  judgingOpen: boolean;
}): boolean {
  return params.judgingDelivery === "online" && params.judgingOpen;
}

export function feedbackVisibleToCompetitor(eventCompletedAndPublished: boolean): boolean {
  return eventCompletedAndPublished;
}

export function hashFilename(original: string): string {
  return createHash("sha256").update(original).digest("hex");
}

export function safeObjectKey(params: {
  eventId: string;
  heatId: string;
  kind: "original" | "judging" | "public" | "pattern";
  id: string;
  ext: string;
}): string {
  const ext = params.ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `wlat/${params.eventId}/${params.kind}/${params.heatId}/${params.id}.${ext}`;
}

export function mimeToExt(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export function sniffImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}
