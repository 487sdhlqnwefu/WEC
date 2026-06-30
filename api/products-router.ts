import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";

export const productsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).where(eq(products.isActive, true));
  }),

  getBySlug: publicQuery
    .input(z.string())
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.slug, input));
      return result[0] ?? null;
    }),

  getById: publicQuery
    .input(z.number())
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.id, input));
      return result[0] ?? null;
    }),
});
