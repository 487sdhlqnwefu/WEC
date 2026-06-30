import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { events } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const eventsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(events).orderBy(events.sortOrder);
  }),

  getById: publicQuery.input((val: unknown) => {
    const id = Number(val);
    if (isNaN(id)) throw new Error("Invalid ID");
    return id;
  }).query(async ({ input }) => {
    const db = getDb();
    const result = await db.select().from(events).where(eq(events.id, input));
    return result[0] ?? null;
  }),

  getUpcoming: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(events).where(eq(events.isUpcoming, true));
  }),

  getPast: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(events).where(eq(events.isUpcoming, false)).orderBy(desc(events.year));
  }),
});
