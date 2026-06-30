import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contacts } from "../db/schema";
import { desc } from "drizzle-orm";
import { sendContactNotification, sendContactConfirmation } from "./lib/resend";

export const contactsRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        type: z.enum(["general", "sponsorship", "press", "competitor_support"]).optional(),
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().optional(),
        message: z.string().min(1),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contacts).values({
        ...input,
        type: input.type ?? "general",
      });
      const insertId = (result as unknown as { insertId: number }).insertId;

      // Send email notifications (non-blocking)
      try {
        await sendContactNotification({
          type: input.type ?? "general",
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
        });
        await sendContactConfirmation({
          name: input.name,
          email: input.email,
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),
});
