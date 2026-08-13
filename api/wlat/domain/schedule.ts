import type { TimingProfile } from "./types";
import { heatCountForField } from "./bracket";
import { badRequest } from "./errors";

export function heatDurationSeconds(timing: TimingProfile): number {
  return (
    timing.prepSeconds +
    timing.competitionSeconds +
    timing.photographySeconds +
    timing.judgingSeconds +
    timing.cleanupSeconds +
    timing.transitionSeconds
  );
}

export type DayWindow = {
  localDate: string;
  opensAt: Date;
  closesAt: Date;
};

export type HeatScheduleSlot = {
  heatIndex: number;
  estimatedStart: Date;
  estimatedEnd: Date;
  dayIndex: number;
};

export function estimateScheduleCapacity(days: DayWindow[], timing: TimingProfile): {
  usableSeconds: number;
  heatsFit: number;
  heatSeconds: number;
} {
  const heatSeconds = heatDurationSeconds(timing);
  if (heatSeconds <= 0) {
    throw badRequest("INVALID_TIMING", "Heat duration must be positive.");
  }
  let usableSeconds = 0;
  for (const day of days) {
    const span = (day.closesAt.getTime() - day.opensAt.getTime()) / 1000;
    if (span < 0) {
      throw badRequest("INVALID_SCHEDULE", "A day window closes before it opens.");
    }
    usableSeconds += span;
  }
  return {
    usableSeconds,
    heatsFit: Math.floor(usableSeconds / heatSeconds),
    heatSeconds,
  };
}

export function scheduleCannotFit(fieldSize: number, days: DayWindow[], timing: TimingProfile): boolean {
  const needed = heatCountForField(fieldSize);
  const { heatsFit } = estimateScheduleCapacity(days, timing);
  return heatsFit < needed;
}

export function assignSequentialStarts(
  heatCount: number,
  days: DayWindow[],
  timing: TimingProfile,
): HeatScheduleSlot[] {
  const heatSeconds = heatDurationSeconds(timing);
  const slots: HeatScheduleSlot[] = [];
  let dayIndex = 0;
  let cursor = days[0] ? new Date(days[0].opensAt) : new Date();

  for (let i = 0; i < heatCount; i += 1) {
    while (days[dayIndex]) {
      const day = days[dayIndex]!;
      if (cursor < day.opensAt) cursor = new Date(day.opensAt);
      const end = new Date(cursor.getTime() + heatSeconds * 1000);
      if (end.getTime() <= day.closesAt.getTime()) {
        slots.push({
          heatIndex: i,
          estimatedStart: new Date(cursor),
          estimatedEnd: end,
          dayIndex,
        });
        cursor = end;
        break;
      }
      dayIndex += 1;
      cursor = days[dayIndex] ? new Date(days[dayIndex]!.opensAt) : end;
    }
    if (!slots[i]) {
      const last = slots[slots.length - 1]?.estimatedEnd ?? cursor;
      const start = new Date(last);
      slots.push({
        heatIndex: i,
        estimatedStart: start,
        estimatedEnd: new Date(start.getTime() + heatSeconds * 1000),
        dayIndex: Math.max(0, days.length - 1),
      });
      cursor = slots[i]!.estimatedEnd;
    }
  }
  return slots;
}

export function delaySchedule(slots: HeatScheduleSlot[], delayMs: number): HeatScheduleSlot[] {
  if (delayMs === 0) return slots;
  return slots.map((slot) => ({
    ...slot,
    estimatedStart: new Date(slot.estimatedStart.getTime() + delayMs),
    estimatedEnd: new Date(slot.estimatedEnd.getTime() + delayMs),
  }));
}
