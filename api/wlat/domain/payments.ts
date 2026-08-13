import { LICENCE_AMOUNT_MINOR, LICENCE_CURRENCY } from "./constants";
import { badRequest } from "./errors";
import type { PaymentStatus } from "./types";

export function isPaidStatus(status: PaymentStatus): boolean {
  return status === "paid";
}

export function unlocksLiveOperation(status: PaymentStatus): boolean {
  return status === "paid";
}

export function assertPaidEntitlement(status: PaymentStatus, action: string): void {
  if (!unlocksLiveOperation(status)) {
    throw badRequest(
      "PAYMENT_REQUIRED",
      `The USD 300 event licence must be paid before ${action}. Checkout success is not enough — the webhook must confirm payment.`,
    );
  }
}

export function applyWebhookStatus(params: {
  current: PaymentStatus;
  stripeSessionStatus: string;
  paymentIntentStatus?: string | null;
}): PaymentStatus {
  const s = params.stripeSessionStatus;
  if (s === "complete" || params.paymentIntentStatus === "succeeded") return "paid";
  if (s === "expired") return "cancelled";
  if (params.paymentIntentStatus === "requires_payment_method") return "payment_failed";
  if (params.paymentIntentStatus === "processing") return "processing";
  if (s === "open") return "checkout_created";
  return params.current;
}

export function applyRefund(params: {
  current: PaymentStatus;
  amountMinor: number;
  refundedMinor: number;
}): PaymentStatus {
  if (params.refundedMinor <= 0) return params.current;
  if (params.refundedMinor >= params.amountMinor) return "refunded";
  return "partially_refunded";
}

export const LICENCE_LINE = {
  amountMinor: LICENCE_AMOUNT_MINOR,
  currency: LICENCE_CURRENCY,
  name: "World Latte Art Throwdown — tournament licence",
  description:
    "One-time USD 300 licence to run a single-station blind latte art throwdown for 8–128 entries.",
} as const;
