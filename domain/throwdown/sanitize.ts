const CONFIDENTIAL_KEYS = [
  "mapping",
  "mappings",
  "cupCodeMappings",
  "codeToCompetitor",
  "competitorToCode",
  "competitorEntryIdForCode",
] as const;

export function assertNoConfidentialFields(
  payload: unknown,
  extraForbidden: string[] = [],
): void {
  const forbidden = new Set<string>([...CONFIDENTIAL_KEYS, ...extraForbidden]);
  walk(payload, forbidden, "$");
}

function walk(value: unknown, forbidden: Set<string>, path: string): void {
  if (value == null) return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, forbidden, `${path}[${i}]`));
    return;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (forbidden.has(key)) {
        throw new Error(`Confidential field "${key}" leaked at ${path}.${key}`);
      }
      walk(child, forbidden, `${path}.${key}`);
    }
  }
}

export function publicHeatView<T extends Record<string, unknown>>(heat: T): Omit<T, never> {
  const {
    mappings: _m,
    cupCode: _c,
    cupCodes: _cs,
    ballots: _b,
    recipes: _r,
    ...rest
  } = heat as T & {
    mappings?: unknown;
    cupCode?: unknown;
    cupCodes?: unknown;
    ballots?: unknown;
    recipes?: unknown;
  };
  return rest;
}

export function judgeBallotPayload(input: {
  eventName: string;
  heatLabel: string;
  judgingFormat: "wec_v3" | "simple_ab";
  cupCodes: [string, string];
  submitted: boolean;
}): {
  eventName: string;
  heatLabel: string;
  judgingFormat: "wec_v3" | "simple_ab";
  cupCodes: [string, string];
  submitted: boolean;
  instructions: string;
} {
  return {
    eventName: input.eventName,
    heatLabel: input.heatLabel,
    judgingFormat: input.judgingFormat,
    cupCodes: input.cupCodes,
    submitted: input.submitted,
    instructions:
      input.judgingFormat === "wec_v3"
        ? "Choose one coded cup in each category. Award the full points. You will not see who made which espresso."
        : "Choose the coded cup that tastes better. You will not see who made which espresso.",
  };
}

export function organiserRecipeStatus(locked: boolean, competitorName: string): { locked: boolean; competitorName: string } {
  return { locked, competitorName };
}
