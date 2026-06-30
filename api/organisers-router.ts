import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { nationalOrganisers } from "../db/schema";
import { desc } from "drizzle-orm";
import { sendOrganiserNotification } from "./lib/resend";

export const organiserRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        country: z.string().min(1),
        city: z.string().optional(),
        organisation: z.string().optional(),
        experience: z.string().optional(),
        venueDescription: z.string().optional(),
        expectedCompetitors: z.number().optional(),
        proposedDate: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(nationalOrganisers).values(input);
      const insertId = (result as unknown as { insertId: number }).insertId;

      // Send email notification (non-blocking)
      try {
        await sendOrganiserNotification({
          fullName: input.fullName,
          email: input.email,
          country: input.country,
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(nationalOrganisers).orderBy(desc(nationalOrganisers.createdAt));
  }),
});
