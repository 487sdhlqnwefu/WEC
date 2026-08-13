import type { EquipmentMode, TimingProfile } from "./types";

export function timingPreset(mode: EquipmentMode): TimingProfile {
  if (mode === "central_shot_service") {
    return {
      prepSeconds: 3 * 60,
      competitionSeconds: 3 * 60,
      photographySeconds: 90,
      judgingSeconds: 4 * 60,
      cleanupSeconds: 60,
      transitionSeconds: 60,
    };
  }
  return {
    prepSeconds: 4 * 60,
    competitionSeconds: 5 * 60,
    photographySeconds: 90,
    judgingSeconds: 4 * 60,
    cleanupSeconds: 90,
    transitionSeconds: 75,
  };
}

export function assertTiming(profile: TimingProfile): TimingProfile {
  const keys: (keyof TimingProfile)[] = [
    "prepSeconds",
    "competitionSeconds",
    "photographySeconds",
    "judgingSeconds",
    "cleanupSeconds",
    "transitionSeconds",
  ];
  for (const key of keys) {
    const value = profile[key];
    if (!Number.isInteger(value) || value < 15 || value > 60 * 60) {
      throw new Error(`Timing ${key} must be between 15 seconds and 1 hour.`);
    }
  }
  return profile;
}
