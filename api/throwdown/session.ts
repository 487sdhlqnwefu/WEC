import * as jose from "jose";
import * as cookie from "cookie";
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import type { ProfileRow } from "./uow";
import { MysqlUow } from "./mysql-uow";

export const THROWDOWN_COOKIE = "wec_throwdown_sid";
const JWT_ALG = "HS256";

export async function signThrowdownToken(profileId: string): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret || "dev-throwdown-secret");
  return new jose.SignJWT({ profileId, kind: "throwdown" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyThrowdownToken(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(env.appSecret || "dev-throwdown-secret");
    const { payload } = await jose.jwtVerify(token, secret, { algorithms: [JWT_ALG] });
    if (payload.kind !== "throwdown" || typeof payload.profileId !== "string") return null;
    return payload.profileId;
  } catch {
    return null;
  }
}

export async function loadThrowdownProfile(headers: Headers): Promise<ProfileRow | undefined> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[THROWDOWN_COOKIE];
  if (!token) return undefined;
  const profileId = await verifyThrowdownToken(token);
  if (!profileId) return undefined;
  const uow = new MysqlUow();
  return uow.profiles.get(profileId);
}

export function setThrowdownCookie(headers: Headers, resHeaders: Headers, token: string) {
  const opts = getSessionCookieOptions(headers);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(THROWDOWN_COOKIE, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 30 * 24 * 60 * 60,
    }),
  );
}

export function clearThrowdownCookie(headers: Headers, resHeaders: Headers) {
  const opts = getSessionCookieOptions(headers);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(THROWDOWN_COOKIE, "", {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 0,
    }),
  );
}
