import type { TimerPhase, TimerRunStatus } from "./types";
import { badRequest } from "./errors";

export type TimerRunSnapshot = {
  id: string;
  heatId: string;
  phase: TimerPhase;
  status: TimerRunStatus;
  startedAt: Date | null;
  expectedEndAt: Date | null;
  pausedAt: Date | null;
  accumulatedPauseMs: number;
  endedAt: Date | null;
  version: number;
};

export type TimerDisplay = {
  phase: TimerPhase;
  status: TimerRunStatus;
  remainingMs: number;
  elapsedMs: number;
  durationMs: number;
  serverNow: string;
  version: number;
};

export function durationMsForPhase(
  phase: TimerPhase,
  seconds: Record<TimerPhase, number>,
): number {
  return Math.max(0, seconds[phase] * 1000);
}

export function remainingMs(run: TimerRunSnapshot, now: Date): number {
  if (run.status === "ended" || run.status === "voided" || run.status === "pending") {
    return run.status === "pending" && run.expectedEndAt && run.startedAt
      ? Math.max(0, run.expectedEndAt.getTime() - run.startedAt.getTime())
      : 0;
  }
  if (!run.expectedEndAt) return 0;
  if (run.status === "paused") {
    const pausedAt = run.pausedAt ?? now;
    return Math.max(0, run.expectedEndAt.getTime() - pausedAt.getTime());
  }
  return Math.max(0, run.expectedEndAt.getTime() - now.getTime());
}

export function elapsedMs(run: TimerRunSnapshot, now: Date): number {
  if (!run.startedAt) return 0;
  const endBound =
    run.status === "ended" && run.endedAt
      ? run.endedAt
      : run.status === "paused" && run.pausedAt
        ? run.pausedAt
        : now;
  const raw = endBound.getTime() - run.startedAt.getTime() - run.accumulatedPauseMs;
  return Math.max(0, raw);
}

export function toTimerDisplay(run: TimerRunSnapshot, now: Date): TimerDisplay {
  const duration =
    run.startedAt && run.expectedEndAt
      ? run.expectedEndAt.getTime() -
        run.startedAt.getTime() +
        (run.status === "paused" ? 0 : 0)
      : 0;
  const remaining = remainingMs(run, now);
  const elapsed = elapsedMs(run, now);
  const inferredDuration =
    run.startedAt && run.expectedEndAt
      ? Math.max(duration, remaining + elapsed)
      : remaining + elapsed;
  return {
    phase: run.phase,
    status: run.status,
    remainingMs: remaining,
    elapsedMs: elapsed,
    durationMs: inferredDuration,
    serverNow: now.toISOString(),
    version: run.version,
  };
}

export function startRun(
  run: TimerRunSnapshot,
  now: Date,
  durationMs: number,
  expectedVersion: number,
): TimerRunSnapshot {
  assertVersion(run.version, expectedVersion);
  if (run.status !== "pending") {
    throw badRequest("TIMER_STATE", "Timer can only start from pending.");
  }
  return {
    ...run,
    status: "running",
    startedAt: now,
    expectedEndAt: new Date(now.getTime() + durationMs),
    pausedAt: null,
    accumulatedPauseMs: 0,
    endedAt: null,
    version: run.version + 1,
  };
}

export function pauseRun(
  run: TimerRunSnapshot,
  now: Date,
  expectedVersion: number,
): TimerRunSnapshot {
  assertVersion(run.version, expectedVersion);
  if (run.status !== "running") {
    throw badRequest("TIMER_STATE", "Only a running timer can be paused.");
  }
  return {
    ...run,
    status: "paused",
    pausedAt: now,
    version: run.version + 1,
  };
}

export function resumeRun(
  run: TimerRunSnapshot,
  now: Date,
  expectedVersion: number,
): TimerRunSnapshot {
  assertVersion(run.version, expectedVersion);
  if (run.status !== "paused" || !run.pausedAt || !run.expectedEndAt) {
    throw badRequest("TIMER_STATE", "Only a paused timer can be resumed.");
  }
  const pauseMs = now.getTime() - run.pausedAt.getTime();
  return {
    ...run,
    status: "running",
    expectedEndAt: new Date(run.expectedEndAt.getTime() + pauseMs),
    accumulatedPauseMs: run.accumulatedPauseMs + pauseMs,
    pausedAt: null,
    version: run.version + 1,
  };
}

export function finishRun(
  run: TimerRunSnapshot,
  now: Date,
  expectedVersion: number,
): TimerRunSnapshot {
  assertVersion(run.version, expectedVersion);
  if (run.status !== "running" && run.status !== "paused") {
    throw badRequest("TIMER_STATE", "Timer is not active.");
  }
  return {
    ...run,
    status: "ended",
    endedAt: now,
    pausedAt: run.status === "paused" ? run.pausedAt : null,
    version: run.version + 1,
  };
}

export function voidRun(run: TimerRunSnapshot, now: Date, expectedVersion: number): TimerRunSnapshot {
  assertVersion(run.version, expectedVersion);
  return {
    ...run,
    status: "voided",
    endedAt: now,
    version: run.version + 1,
  };
}

function assertVersion(actual: number, expected: number): void {
  if (actual !== expected) {
    throw badRequest(
      "TIMER_VERSION_CONFLICT",
      "Timer was updated on another device. Refresh and try again.",
    );
  }
}

/** Apply client clock skew using a server timestamp from the last snapshot. */
export function clientRemainingMs(
  display: TimerDisplay,
  clientNow: Date,
  lastSyncAt: Date,
): number {
  if (display.status !== "running") return display.remainingMs;
  const elapsedSinceSync = clientNow.getTime() - lastSyncAt.getTime();
  return Math.max(0, display.remainingMs - elapsedSinceSync);
}
