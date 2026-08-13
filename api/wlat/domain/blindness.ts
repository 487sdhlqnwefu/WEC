import { createHmac } from "node:crypto";
import { MAPPING_VERSION } from "./constants";
import { secureShuffle } from "./crypto";
import { badRequest } from "./errors";
import type { BlindEntry } from "./types";

export type BlindMapping = {
  mappingVersion: string;
  entryAId: string;
  entryBId: string;
};

export function generateBlindMapping(entryIds: [string, string]): BlindMapping {
  if (entryIds[0] === entryIds[1]) {
    throw badRequest("INVALID_MAPPING", "A heat requires two distinct entries.");
  }
  const [first, second] = secureShuffle(entryIds);
  return {
    mappingVersion: MAPPING_VERSION,
    entryAId: first,
    entryBId: second,
  };
}

export function resolveWinnerEntry(mapping: BlindMapping, winningBlind: BlindEntry): string {
  return winningBlind === "A" ? mapping.entryAId : mapping.entryBId;
}

export function resolveLoserEntry(mapping: BlindMapping, winningBlind: BlindEntry): string {
  return winningBlind === "A" ? mapping.entryBId : mapping.entryAId;
}

export function blindLabelForEntry(mapping: BlindMapping, entryId: string): BlindEntry {
  if (mapping.entryAId === entryId) return "A";
  if (mapping.entryBId === entryId) return "B";
  throw badRequest("MAPPING_MISS", "Entry is not part of this heat mapping.");
}

/**
 * Independent left/right placement per voter while ballot values stay bound to A/B.
 * Deterministic per (heat, round, voter) so a refresh does not flip sides.
 */
export function presentationOrder(
  secret: string,
  heatId: string,
  ballotRoundId: string,
  voterMemberId: string,
): [BlindEntry, BlindEntry] {
  const digest = createHmac("sha256", secret)
    .update(`${heatId}:${ballotRoundId}:${voterMemberId}:present`)
    .digest("hex");
  const bit = Number.parseInt(digest.slice(0, 2), 16) % 2;
  return bit === 0 ? ["A", "B"] : ["B", "A"];
}

export function physicalPlacementHint(mappingVersion: string, heatId: string): {
  tableLeft: BlindEntry;
  tableRight: BlindEntry;
  note: string;
} {
  const digest = createHmac("sha256", mappingVersion).update(`${heatId}:table`).digest("hex");
  const bit = Number.parseInt(digest.slice(0, 2), 16) % 2;
  const left: BlindEntry = bit === 0 ? "A" : "B";
  const right: BlindEntry = left === "A" ? "B" : "A";
  return {
    tableLeft: left,
    tableRight: right,
    note: `Place Entry ${left} on the steward-left mark and Entry ${right} on steward-right. Do not announce competitor names.`,
  };
}

export function mappingIsSensitiveField(key: string): boolean {
  const k = key.toLowerCase();
  return (
    k.includes("entry_a") ||
    k.includes("entrya") ||
    k.includes("entry_b") ||
    k.includes("entryb") ||
    k.includes("mapping") ||
    k.includes("blind")
  );
}

export function stripMappingFromPublic<T extends Record<string, unknown>>(payload: T): T {
  const blocked = new Set([
    "entryAId",
    "entryBId",
    "entry_a_id",
    "entry_b_id",
    "mapping",
    "heatBlindMapping",
    "blindMapping",
  ]);
  const out = { ...payload };
  for (const key of Object.keys(out)) {
    if (blocked.has(key) || mappingIsSensitiveField(key)) {
      delete out[key];
    }
  }
  return out;
}
