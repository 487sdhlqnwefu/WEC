import * as jose from "jose";
import * as cookie from "cookie";
import { getSessionCookieOptions } from "../lib/cookies";

export const WLAT_COOKIE = "wlat_sid";

export async function signWlatSession(memberId: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.APP_SECRET || "wlat-dev-secret");
  return new jose.SignJWT({ memberId, aud: "wlat" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyWlatSession(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(process.env.APP_SECRET || "wlat-dev-secret");
    const { payload } = await jose.jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.memberId === "string" ? payload.memberId : null;
  } catch {
    return null;
  }
}

export function serializeWlatCookie(token: string, headers: Headers): string {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(WLAT_COOKIE, token, {
    httpOnly: opts.httpOnly,
    path: "/",
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearWlatCookie(headers: Headers): string {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(WLAT_COOKIE, "", {
    httpOnly: opts.httpOnly,
    path: "/",
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: 0,
  });
}
