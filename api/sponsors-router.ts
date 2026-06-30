import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { sponsorInquiries } from "../db/schema";
import { desc } from "drizzle-orm";
import { sendSponsorInquiryNotification, sendSponsorConfirmation } from "./lib/resend";

export const sponsorsRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        companyName: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        tier: z.enum(["title", "green", "gold", "silver", "supporting", "custom"]),
        budget: z.string().optional(),
        message: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(sponsorInquiries).values(input);
      const insertId = (result as unknown as { insertId: number }).insertId;

      // Send email notifications (non-blocking)
      try {
        await sendSponsorInquiryNotification({
          companyName: input.companyName,
          contactName: input.contactName,
          email: input.email,
          tier: input.tier,
        });
        await sendSponsorConfirmation({
          companyName: input.companyName,
          contactName: input.contactName,
          email: input.email,
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(sponsorInquiries).orderBy(desc(sponsorInquiries.createdAt));
  }),
});
