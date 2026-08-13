import { randomInt } from "node:crypto";
import { CUP_CODE_ALPHABET, CUP_CODE_LENGTH } from "./constants";

export function generateCupCode(
  existing: Iterable<string> = [],
  randomDigit: (max: number) => number = (max) => randomInt(max),
): string {
  const taken = new Set(existing);
  for (let attempt = 0; attempt < 10_000; attempt++) {
    let code = "";
    for (let i = 0; i < CUP_CODE_LENGTH; i++) {
      code += CUP_CODE_ALPHABET[randomDigit(CUP_CODE_ALPHABET.length)]!;
    }
    if (!taken.has(code)) return code;
  }
  throw new Error("Unable to generate a unique cup code for this event.");
}

export function generateHeatCupCodes(existing: Iterable<string> = []): [string, string] {
  const first = generateCupCode(existing);
  const second = generateCupCode([...existing, first]);
  if (first === second) {
    throw new Error("Cup codes for a heat must be distinct.");
  }
  return [first, second];
}

export function isValidCupCode(code: string): boolean {
  if (code.length !== CUP_CODE_LENGTH) return false;
  return [...code].every((ch) => CUP_CODE_ALPHABET.includes(ch));
}
