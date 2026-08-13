export class WlatError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  readonly publicMessage: string;

  constructor(code: string, publicMessage: string, httpStatus = 400) {
    super(publicMessage);
    this.name = "WlatError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.publicMessage = publicMessage;
  }
}

export function badRequest(code: string, message: string): WlatError {
  return new WlatError(code, message, 400);
}

export function forbidden(code: string, message: string): WlatError {
  return new WlatError(code, message, 403);
}

export function notFound(code: string, message: string): WlatError {
  return new WlatError(code, message, 404);
}

export function conflict(code: string, message: string): WlatError {
  return new WlatError(code, message, 409);
}

export function unauthorized(message = "Authentication required"): WlatError {
  return new WlatError("UNAUTHENTICATED", message, 401);
}
