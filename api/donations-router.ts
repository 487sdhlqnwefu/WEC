import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { donations } from "../db/schema";
import { desc } from "drizzle-orm";

export const donationsRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        amount: z.number().positive(),
        tier: z.enum(["supporter", "advocate", "champion", "patron", "one_time"]),
        isRecurring: z.boolean().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(donations).values({
        ...input,
        amount: input.amount.toString(),
      });
      const insertId = (result as unknown as { insertId: number }).insertId;
      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(donations).orderBy(desc(donations.createdAt));
  }),
});
