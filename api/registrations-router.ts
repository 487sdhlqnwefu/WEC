import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { registrations } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { sendRegistrationNotification, sendRegistrationConfirmation } from "./lib/resend";

export const registrationsRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        type: z.enum(["competitor", "judge", "volunteer"]),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        country: z.string().min(1),
        city: z.string().optional(),
        employer: z.string().optional(),
        experience: z.string().optional(),
        qualificationMethod: z.string().optional(),
        professionalBackground: z.string().optional(),
        sensoryExperience: z.string().optional(),
        availability: z.string().optional(),
        rolePreference: z.string().optional(),
        skills: z.string().optional(),
        languages: z.string().optional(),
        socialMedia: z.string().optional(),
        conflictOfInterest: z.string().optional(),
        dietaryRequirements: z.string().optional(),
        emergencyContact: z.string().optional(),
        agreedToRules: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(registrations).values(input);
      const insertId = (result as unknown as { insertId: number }).insertId;

      // Send email notifications (non-blocking)
      try {
        await sendRegistrationNotification({
          type: input.type,
          fullName: input.fullName,
          email: input.email,
          country: input.country,
        });
        await sendRegistrationConfirmation({
          type: input.type,
          fullName: input.fullName,
          email: input.email,
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }

      return { success: true, id: Number(insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }),

  getByType: publicQuery
    .input(z.enum(["competitor", "judge", "volunteer"]))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(registrations).where(eq(registrations.type, input)).orderBy(desc(registrations.createdAt));
    }),
});
