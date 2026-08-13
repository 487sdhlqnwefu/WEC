import { randomInt, randomBytes, createHash, createHmac } from "node:crypto";

export function newId(): string {
  return crypto.randomUUID();
}

export function sha256Hex(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256Hex(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Cryptographically secure integer in [0, maxExclusive). */
export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error("maxExclusive must be positive");
  }
  return randomInt(0, maxExclusive);
}

export function secureShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

export function pickSecure<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list");
  }
  return items[secureRandomInt(items.length)]!;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return slug || "event";
}

export function nowUtc(): Date {
  return new Date();
}
