import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { createRouter, publicQuery } from "./middleware";
import { getSessionCookieOptions } from "./lib/cookies";
import { env } from "./lib/env";
import { signSessionToken } from "./kimi/session";
import { verifyPassword } from "./platform/passwords";
import {
  createMember,
  findMemberByEmail,
  touchSignIn,
} from "./platform/store";
import type { PlatformMember } from "./platform/types";
import type { User } from "@db/schema";

export function memberToUser(member: PlatformMember): User {
  return {
    id: member.id,
    unionId: member.unionId,
    name: member.name,
    email: member.email,
    avatar: member.avatar,
    role: member.role,
    createdAt: new Date(member.createdAt),
    updatedAt: new Date(member.updatedAt),
    lastSignInAt: new Date(member.lastSignInAt),
  };
}

async function setSession(resHeaders: Headers, req: Request, member: PlatformMember) {
  const token = await signSessionToken({
    unionId: member.unionId,
    clientId: env.appId || "wct-members",
  });
  const opts = getSessionCookieOptions(req.headers);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

export const membersRouter = createRouter({
  signup: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(120),
        email: z.string().email(),
        password: z.string().min(8).max(200),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const member = await createMember(input);
        await setSession(ctx.resHeaders, ctx.req, member);
        return memberToUser(member);
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: error instanceof Error ? error.message : "Could not create account",
        });
      }
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const member = await findMemberByEmail(input.email);
      if (!member || !(await verifyPassword(input.password, member.passwordHash))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email or password is incorrect",
        });
      }
      await touchSignIn(member.id);
      await setSession(ctx.resHeaders, ctx.req, member);
      return memberToUser(member);
    }),
});
