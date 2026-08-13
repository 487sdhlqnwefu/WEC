import {
  FREE_COMPETITOR_COUNTS,
  PREMIUM_COMPETITOR_HARD_CEILING,
  PREMIUM_COMPETITOR_MAX_V1,
  PREMIUM_COMPETITOR_MIN,
  PREMIUM_PRICE_CENTS,
  type EventTier,
  type LicenceStatus,
} from "./constants";
import type { Blocker, Entitlement } from "./types";

export type TierDecision =
  | { ok: true; tier: EventTier }
  | { ok: false; code: "unavailable_5_to_7" | "too_few" | "too_many"; message: string };

export function classifyCompetitorCount(count: number, max = PREMIUM_COMPETITOR_MAX_V1): TierDecision {
  if (count < 2) {
    return {
      ok: false,
      code: "too_few",
      message: "An Espresso Throwdown needs at least two competitors.",
    };
  }
  if ((FREE_COMPETITOR_COUNTS as readonly number[]).includes(count)) {
    return { ok: true, tier: "free" };
  }
  if (count >= 5 && count <= 7) {
    return {
      ok: false,
      code: "unavailable_5_to_7",
      message:
        "A free Espresso Throwdown is limited to four competitors so a café can finish it efficiently. A Premium Espresso Tournament begins at eight competitors and uses a full single-elimination bracket.",
    };
  }
  if (count >= PREMIUM_COMPETITOR_MIN && count <= max) {
    return { ok: true, tier: "premium" };
  }
  if (count > max && count <= PREMIUM_COMPETITOR_HARD_CEILING) {
    return {
      ok: false,
      code: "too_many",
      message: `Version one supports up to ${max} competitors. The bracket engine can later raise this limit without rewriting the event model.`,
    };
  }
  return {
    ok: false,
    code: "too_many",
    message: `This field size is not supported.`,
  };
}

export function assertTierMatchesCount(tier: EventTier, count: number): void {
  const decision = classifyCompetitorCount(count);
  if (!decision.ok) throw new Error(decision.message);
  if (decision.tier !== tier) {
    throw new Error(
      tier === "free"
        ? "Free Espresso Throwdown is only available for 2, 3, or 4 competitors."
        : "Premium Espresso Tournament requires 8 or more competitors.",
    );
  }
}

export function licenceUnlocksPremium(status: LicenceStatus | null | undefined): boolean {
  return status === "paid" || status === "complimentary";
}

export function premiumActionBlockers(
  entitlement: Entitlement,
  action: "publish" | "invite" | "lock_roster" | "generate_bracket" | "start_event",
): Blocker[] {
  if (entitlement.tier !== "premium") return [];
  if (licenceUnlocksPremium(entitlement.licenceStatus)) return [];

  const waiting =
    entitlement.licenceStatus === "pending"
      ? "Waiting for Premium Tournament payment confirmation."
      : entitlement.licenceStatus === "refunded"
        ? "This tournament licence was refunded. A new payment is required before the event can continue."
        : entitlement.licenceStatus === "expired"
          ? "The previous checkout expired. Pay the USD 300 tournament licence to continue."
          : entitlement.licenceStatus === "failed"
            ? "Payment failed. Pay the USD 300 tournament licence to continue."
            : "Waiting for Premium Tournament payment confirmation.";

  const labels: Record<typeof action, string> = {
    publish: "This Premium Espresso Tournament cannot be published until the USD 300 licence is paid.",
    invite: "Live participant invitations cannot be sent until the USD 300 licence is paid.",
    lock_roster: "The roster cannot be locked until the USD 300 licence is paid.",
    generate_bracket: "The final bracket cannot be generated until the USD 300 licence is paid.",
    start_event: "This Premium Espresso Tournament cannot start until the USD 300 licence is paid.",
  };

  return [{ code: "premium_unpaid", message: `${labels[action]} ${waiting}` }];
}

export function formatPremiumPrice(cents = PREMIUM_PRICE_CENTS): string {
  return `USD ${(cents / 100).toFixed(0)}`;
}
