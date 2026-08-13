export class ThrowdownError extends Error {
  constructor(
    public code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT",
    message: string,
  ) {
    super(message);
    this.name = "ThrowdownError";
  }
}

export function badRequest(message: string): never {
  throw new ThrowdownError("BAD_REQUEST", message);
}

export function forbidden(message: string): never {
  throw new ThrowdownError("FORBIDDEN", message);
}

export function notFound(message: string): never {
  throw new ThrowdownError("NOT_FOUND", message);
}

export function conflict(message: string): never {
  throw new ThrowdownError("CONFLICT", message);
}

export function unauthorized(message: string): never {
  throw new ThrowdownError("UNAUTHORIZED", message);
}
