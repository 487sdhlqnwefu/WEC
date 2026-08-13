import type { PublicRecipe, RecipeInput } from "./types";

export function brewRatio(doseGrams: number, yieldGrams: number): number {
  if (doseGrams <= 0) throw new Error("Dose must be greater than zero.");
  return yieldGrams / doseGrams;
}

/** Extraction yield % = TDS% × (yield / dose) when TDS is provided. */
export function extractionYieldPercent(
  doseGrams: number,
  yieldGrams: number,
  tdsPercent: number | null | undefined,
): number | null {
  if (tdsPercent == null || Number.isNaN(tdsPercent)) return null;
  if (doseGrams <= 0) return null;
  return (tdsPercent * yieldGrams) / doseGrams;
}

export function validateRecipe(input: RecipeInput): RecipeInput {
  if (!Number.isFinite(input.doseGrams) || input.doseGrams <= 0 || input.doseGrams > 100) {
    throw new Error("Dose must be a positive number of grams, typically between 7 and 25.");
  }
  if (!Number.isFinite(input.yieldGrams) || input.yieldGrams <= 0 || input.yieldGrams > 200) {
    throw new Error("Beverage yield must be a positive number of grams.");
  }
  if (
    !Number.isFinite(input.extractionTimeSeconds) ||
    input.extractionTimeSeconds <= 0 ||
    input.extractionTimeSeconds > 120
  ) {
    throw new Error("Extraction time must be a positive number of seconds.");
  }
  if (input.tds != null && (input.tds < 0 || input.tds > 30)) {
    throw new Error("Measured TDS must be a percentage between 0 and 30.");
  }
  if (input.waterTempC != null && (input.waterTempC < 70 || input.waterTempC > 100)) {
    throw new Error("Water temperature should be between 70 and 100 °C.");
  }
  return input;
}

export function toPublicRecipe(input: RecipeInput): PublicRecipe {
  const valid = validateRecipe(input);
  return {
    ...valid,
    brewRatio: brewRatio(valid.doseGrams, valid.yieldGrams),
    extractionYield: extractionYieldPercent(valid.doseGrams, valid.yieldGrams, valid.tds),
  };
}

export function recipesPublishedTogether(eventStatus: string, recipesReleasedAt: Date | null): boolean {
  return eventStatus === "completed" && recipesReleasedAt != null;
}
