import type { DecisionOption } from "@/types/decisions";

export type WeightedSegment = {
  option: DecisionOption;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  sweep: number;
  displaySweep: number;
  displayStart: number;
  displayEnd: number;
};

/** Convert angle (degrees, 0 at top, clockwise) to SVG path coords */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function buildSegments(
  options: DecisionOption[],
  hideWeights: boolean,
): WeightedSegment[] {
  if (options.length === 0) return [];

  const totalWeight = options.reduce((sum, o) => sum + Math.max(1, o.weight), 0);
  const equalSweep = 360 / options.length;

  let cursor = 0;
  let displayCursor = 0;

  return options.map((option) => {
    const weight = Math.max(1, option.weight);
    const sweep = (weight / totalWeight) * 360;
    const displaySweep = hideWeights ? equalSweep : sweep;
    const startAngle = cursor;
    const endAngle = cursor + sweep;
    const displayStart = displayCursor;
    const displayEnd = displayCursor + displaySweep;

    cursor = endAngle;
    displayCursor = displayEnd;

    return {
      option,
      startAngle,
      endAngle,
      midAngle: startAngle + sweep / 2,
      sweep,
      displaySweep,
      displayStart,
      displayEnd,
    };
  });
}

/** Pick a winner from eligible options using true weights */
export function pickWeightedOption(
  options: DecisionOption[],
  excludedIds: string[] = [],
): DecisionOption | null {
  const eligible = options.filter((o) => !excludedIds.includes(o.id));
  if (eligible.length === 0) return null;

  const total = eligible.reduce((sum, o) => sum + Math.max(1, o.weight), 0);
  let roll = Math.random() * total;
  for (const option of eligible) {
    roll -= Math.max(1, option.weight);
    if (roll <= 0) return option;
  }
  return eligible[eligible.length - 1];
}

/**
 * Given a winner, compute a target rotation so the pointer (top) lands
 * on that option's weighted segment. Returns degrees the wheel should rotate to.
 */
export function rotationForWinner(
  segments: WeightedSegment[],
  winnerId: string,
  currentRotation: number,
): number {
  const segment = segments.find((s) => s.option.id === winnerId);
  if (!segment) return currentRotation;

  // Land somewhere in the middle 60% of the segment to avoid edges
  const pad = segment.sweep * 0.2;
  const landAngle =
    segment.startAngle + pad + Math.random() * (segment.sweep - pad * 2 || 0.01);

  // Pointer is at top (0°). Wheel rotates clockwise visually via CSS.
  // A segment at landAngle should end up at 0, so rotate by (360 - landAngle).
  const base = 360 - landAngle;
  const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
  const delta = (base - normalizedCurrent + 360) % 360;
  const spins = 5 + Math.floor(Math.random() * 3); // 5–7 full spins
  return currentRotation + spins * 360 + delta;
}

export function randomInt(min: number, max: number): number {
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
