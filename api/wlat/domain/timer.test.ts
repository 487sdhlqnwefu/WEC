import { describe, expect, it } from "vitest";
import {
  clientRemainingMs,
  finishRun,
  pauseRun,
  remainingMs,
  resumeRun,
  startRun,
  toTimerDisplay,
  type TimerRunSnapshot,
} from "./timer";

function pending(): TimerRunSnapshot {
  return {
    id: "t1",
    heatId: "h1",
    phase: "competition",
    status: "pending",
    startedAt: null,
    expectedEndAt: null,
    pausedAt: null,
    accumulatedPauseMs: 0,
    endedAt: null,
    version: 0,
  };
}

describe("authoritative timer", () => {
  it("counts down from server timestamps, not a browser interval", () => {
    const t0 = new Date("2026-08-13T12:00:00.000Z");
    const running = startRun(pending(), t0, 60_000, 0);
    const t30 = new Date(t0.getTime() + 30_000);
    expect(remainingMs(running, t30)).toBe(30_000);
    const display = toTimerDisplay(running, t30);
    expect(display.remainingMs).toBe(30_000);
    expect(display.version).toBe(1);
  });

  it("freezes remaining time while paused and resumes with pause duration added", () => {
    const t0 = new Date("2026-08-13T12:00:00.000Z");
    const running = startRun(pending(), t0, 60_000, 0);
    const t10 = new Date(t0.getTime() + 10_000);
    const paused = pauseRun(running, t10, 1);
    const t40 = new Date(t0.getTime() + 40_000);
    expect(remainingMs(paused, t40)).toBe(50_000);
    const resumed = resumeRun(paused, t40, 2);
    expect(resumed.accumulatedPauseMs).toBe(30_000);
    expect(remainingMs(resumed, t40)).toBe(50_000);
    const t50 = new Date(t0.getTime() + 50_000);
    expect(remainingMs(resumed, t50)).toBe(40_000);
  });

  it("rejects stale versions to prevent double starts", () => {
    const t0 = new Date("2026-08-13T12:00:00.000Z");
    const running = startRun(pending(), t0, 60_000, 0);
    expect(() => startRun(pending(), t0, 60_000, 3)).toThrow(/another device/i);
    expect(() => pauseRun(running, t0, 0)).toThrow(/another device/i);
  });

  it("survives refresh by deriving remaining from last sync + client clock", () => {
    const display = {
      phase: "prep" as const,
      status: "running" as const,
      remainingMs: 20_000,
      elapsedMs: 10_000,
      durationMs: 30_000,
      serverNow: "2026-08-13T12:00:00.000Z",
      version: 2,
    };
    const lastSync = new Date(display.serverNow);
    const clientNow = new Date(lastSync.getTime() + 5_000);
    expect(clientRemainingMs(display, clientNow, lastSync)).toBe(15_000);
  });

  it("finishes to zero remaining", () => {
    const t0 = new Date("2026-08-13T12:00:00.000Z");
    const running = startRun(pending(), t0, 60_000, 0);
    const ended = finishRun(running, new Date(t0.getTime() + 60_000), 1);
    expect(ended.status).toBe("ended");
    expect(remainingMs(ended, new Date())).toBe(0);
  });
});
