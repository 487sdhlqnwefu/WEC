import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "../db/schema";
import { desc } from "drizzle-orm";

export const ordersRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        customerName: z.string().optional(),
        shippingAddress: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          name: z.string(),
          price: z.number(),
          quantity: z.number(),
        })),
        total: z.number(),
        stripeSessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        ...input,
        items: JSON.stringify(input.items),
        total: input.total.toString(),
      });
      const insertId = (result as unknown as { insertId: number }).insertId;
      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),
});
