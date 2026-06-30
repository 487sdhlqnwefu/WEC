import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { newsPosts } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(newsPosts).where(eq(newsPosts.published, true)).orderBy(desc(newsPosts.createdAt));
  }),

  getBySlug: publicQuery
    .input(z.string())
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(newsPosts).where(eq(newsPosts.slug, input));
      return result[0] ?? null;
    }),
});
