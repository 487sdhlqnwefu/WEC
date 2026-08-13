import { PREMIUM_CURRENCY, PREMIUM_PRICE_CENTS, type LicenceStatus } from "./constants";

export type PaymentRecord = {
  id: string;
  eventId: string;
  stripeSessionId: string;
  amountCents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "expired" | "refunded";
};

export type LicenceRecord = {
  eventId: string;
  status: LicenceStatus;
};

export type WebhookEvent = {
  type: string;
  stripeSessionId: string;
  paymentIntentId?: string | null;
  amountCents?: number;
  currency?: string;
  metadataEventId?: string | null;
  alreadyProcessed?: boolean;
};

export type PaymentApplyResult = {
  unlockEventId: string | null;
  licenceStatus: LicenceStatus;
  ignored: boolean;
  reason: string;
};

export function assertCheckoutAmount(amountCents: number, currency: string): void {
  if (amountCents !== PREMIUM_PRICE_CENTS) {
    throw new Error(`Premium Espresso Tournament licence must be exactly ${PREMIUM_PRICE_CENTS} cents.`);
  }
  if (currency.toLowerCase() !== PREMIUM_CURRENCY) {
    throw new Error(`Premium Espresso Tournament licence must be charged in ${PREMIUM_CURRENCY.toUpperCase()}.`);
  }
}

/**
 * Verified webhook is the source of truth. Client redirects never unlock.
 * Duplicate deliveries are ignored. One session unlocks only its event.
 */
export function applyVerifiedPaymentWebhook(input: {
  payment: PaymentRecord;
  event: WebhookEvent;
}): PaymentApplyResult {
  if (input.event.alreadyProcessed) {
    return {
      unlockEventId: null,
      licenceStatus: input.payment.status === "paid" ? "paid" : "pending",
      ignored: true,
      reason: "Duplicate webhook ignored.",
    };
  }

  if (input.event.metadataEventId && input.event.metadataEventId !== input.payment.eventId) {
    return {
      unlockEventId: null,
      licenceStatus: input.payment.status === "paid" ? "paid" : "pending",
      ignored: true,
      reason: "Payment metadata does not match this event. One payment cannot unlock another event.",
    };
  }

  if (input.event.type === "checkout.session.expired") {
    return {
      unlockEventId: null,
      licenceStatus: "expired",
      ignored: false,
      reason: "Checkout expired.",
    };
  }

  if (input.event.type === "charge.refunded" || input.event.type === "charge.dispute.created") {
    return {
      unlockEventId: null,
      licenceStatus: "refunded",
      ignored: false,
      reason: "Payment refunded.",
    };
  }

  if (
    input.event.type === "checkout.session.completed" ||
    input.event.type === "payment_intent.succeeded"
  ) {
    if (input.payment.status === "paid") {
      return {
        unlockEventId: null,
        licenceStatus: "paid",
        ignored: true,
        reason: "Payment already applied.",
      };
    }
    return {
      unlockEventId: input.payment.eventId,
      licenceStatus: "paid",
      ignored: false,
      reason: "Verified payment unlocks this tournament.",
    };
  }

  if (input.event.type === "payment_intent.payment_failed") {
    return {
      unlockEventId: null,
      licenceStatus: "failed",
      ignored: false,
      reason: "Payment failed.",
    };
  }

  return {
    unlockEventId: null,
    licenceStatus: input.payment.status === "paid" ? "paid" : "pending",
    ignored: true,
    reason: "Unhandled event type ignored.",
  };
}

export function clientRedirectDoesNotUnlock(): { unlock: false; reason: string } {
  return {
    unlock: false,
    reason: "Client checkout redirects are not a source of truth. Wait for the verified webhook.",
  };
}

export function complimentaryRequiresReason(reason: string | null | undefined): void {
  if (!reason || reason.trim().length < 8) {
    throw new Error("Complimentary access requires a WEC platform administrator and a recorded reason.");
  }
}
