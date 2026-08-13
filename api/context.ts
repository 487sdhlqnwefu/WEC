import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import type { Member } from "./wlat/store/models";
import { verifyWlatSession, WLAT_COOKIE } from "./wlat/session";
import { getEngine } from "./wlat/instance";
import { getStore } from "./wlat/store/memory";
import * as cookie from "cookie";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  wlatMember?: Member;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Kimi authentication is optional
  }

  const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
  const token = cookies[WLAT_COOKIE];
  if (token) {
    const memberId = await verifyWlatSession(token);
    if (memberId) {
      ctx.wlatMember = getStore().members.get(memberId);
    }
  }

  if (ctx.user && !ctx.wlatMember) {
    ctx.wlatMember = getEngine().upsertMember({
      provider: "kimi",
      subject: ctx.user.unionId,
      email: ctx.user.email,
      name: ctx.user.name,
      avatarUrl: ctx.user.avatar,
      authUserId: ctx.user.id,
    });
  }

  return ctx;
}
