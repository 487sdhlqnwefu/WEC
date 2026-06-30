import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { registrations, sponsorInquiries, contacts, orders, events, products, newsPosts, users } from "../db/schema";
import { eq, desc, count } from "drizzle-orm";

export const adminRouter = createRouter({
  // Dashboard stats
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [competitors] = await db.select({ count: count() }).from(registrations).where(eq(registrations.type, "competitor"));
    const [judges] = await db.select({ count: count() }).from(registrations).where(eq(registrations.type, "judge"));
    const [volunteers] = await db.select({ count: count() }).from(registrations).where(eq(registrations.type, "volunteer"));
    const [sponsors] = await db.select({ count: count() }).from(sponsorInquiries);
    const [ordersCount] = await db.select({ count: count() }).from(orders);
    const [contactsCount] = await db.select({ count: count() }).from(contacts);
    const [userCount] = await db.select({ count: count() }).from(users);
    return {
      competitors: competitors.count,
      judges: judges.count,
      volunteers: volunteers.count,
      sponsors: sponsors.count,
      orders: ordersCount.count,
      contacts: contactsCount.count,
      users: userCount.count,
    };
  }),

  // Registrations management
  registrations: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }),

  updateRegistration: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected", "waitlist"]), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(registrations).set({ status: input.status, notes: input.notes }).where(eq(registrations.id, input.id));
      return { success: true };
    }),

  // Sponsors management
  sponsors: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(sponsorInquiries).orderBy(desc(sponsorInquiries.createdAt));
  }),

  updateSponsor: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "contacted", "negotiating", "closed", "lost"]), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(sponsorInquiries).set({ status: input.status, notes: input.notes }).where(eq(sponsorInquiries.id, input.id));
      return { success: true };
    }),

  // Contacts management
  contacts: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),

  updateContact: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "read", "replied", "archived"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contacts).set({ status: input.status }).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  // Products management
  products: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).orderBy(desc(products.createdAt));
  }),

  createProduct: adminQuery
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.string(),
      stock: z.number().optional(),
      isActive: z.boolean().optional(),
      isLimitedEdition: z.boolean().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(products).values(input);
      return { success: true };
    }),

  updateProduct: adminQuery
    .input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      stock: z.number().optional(),
      isActive: z.boolean().optional(),
    }) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(products).set(input.data).where(eq(products.id, input.id));
      return { success: true };
    }),

  // News management
  newsPosts: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(newsPosts).orderBy(desc(newsPosts.createdAt));
  }),

  createNewsPost: adminQuery
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      category: z.enum(["press_release", "blog", "announcement", "event_coverage"]).optional(),
      author: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(newsPosts).values(input);
      return { success: true };
    }),

  // Events management
  events: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(events).orderBy(events.sortOrder);
  }),

  updateEvent: adminQuery
    .input(z.object({ id: z.number(), data: z.object({
      name: z.string().optional(),
      winner: z.string().optional().nullable(),
      description: z.string().optional(),
      isUpcoming: z.boolean().optional(),
    }) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(events).set(input.data).where(eq(events.id, input.id));
      return { success: true };
    }),

  // Users management
  users: adminQuery.query(async () => {
    const db = getDb();
    return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt));
  }),

  updateUserRole: adminQuery
    .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
      return { success: true };
    }),
});
