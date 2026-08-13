import { badRequest } from "./errors";
import type { EventState, PaymentStatus } from "./types";

const EVENT_TRANSITIONS: Record<EventState, readonly EventState[]> = {
  draft: ["awaiting_payment", "cancelled"],
  awaiting_payment: ["setup", "cancelled"],
  setup: ["registration_open", "roster_locked", "cancelled"],
  registration_open: ["setup", "roster_locked", "cancelled"],
  roster_locked: ["bracket_ready", "setup", "cancelled"],
  bracket_ready: ["live", "roster_locked", "cancelled"],
  live: ["completed", "cancelled"],
  completed: ["archived"],
  archived: [],
  cancelled: [],
};

export function canTransitionEvent(from: EventState, to: EventState): boolean {
  if (from === to) return true;
  return EVENT_TRANSITIONS[from].includes(to);
}

export function assertEventTransition(from: EventState, to: EventState): void {
  if (!canTransitionEvent(from, to)) {
    throw badRequest(
      "ILLEGAL_EVENT_TRANSITION",
      `Cannot move event from ${from} to ${to}.`,
    );
  }
}

export function eventStateAfterPayment(status: PaymentStatus): EventState | null {
  if (status === "paid") return "setup";
  return null;
}

export const LIVE_OPERATION_STATES: readonly EventState[] = [
  "roster_locked",
  "bracket_ready",
  "live",
];

export function requiresPaidLicence(state: EventState): boolean {
  return (
    state === "roster_locked" ||
    state === "bracket_ready" ||
    state === "live" ||
    state === "completed" ||
    state === "archived"
  );
}

export function isPublicEventState(state: EventState): boolean {
  return state !== "draft" && state !== "awaiting_payment" && state !== "cancelled";
}

export function archivesPublished(state: EventState, publishedAt: Date | null): boolean {
  return (state === "completed" || state === "archived") && publishedAt !== null;
}
