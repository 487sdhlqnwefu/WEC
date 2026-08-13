import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (Auth) ──────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Events ────────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  year: int("year").notNull(),
  date: varchar("date", { length: 100 }),
  location: varchar("location", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }),
  winner: varchar("winner", { length: 255 }),
  winnerProfileUrl: varchar("winnerProfileUrl", { length: 500 }),
  format: text("format"),
  keyHighlights: text("keyHighlights"),
  description: text("description"),
  photoUrl: text("photoUrl"),
  videoUrl: text("videoUrl"),
  championProduct: text("championProduct"),
  sponsor: varchar("sponsor", { length: 255 }),
  isUpcoming: boolean("isUpcoming").default(false),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;

// ─── Registrations (Competitors, Judges, Volunteers) ────────────
export const registrations = mysqlTable("registrations", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["competitor", "judge", "volunteer"]).notNull(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }),
  employer: varchar("employer", { length: 255 }),
  experience: text("experience"),
  qualificationMethod: varchar("qualificationMethod", { length: 255 }),
  professionalBackground: text("professionalBackground"),
  sensoryExperience: text("sensoryExperience"),
  availability: text("availability"),
  rolePreference: varchar("rolePreference", { length: 100 }),
  skills: text("skills"),
  languages: text("languages"),
  socialMedia: text("socialMedia"),
  conflictOfInterest: text("conflictOfInterest"),
  dietaryRequirements: text("dietaryRequirements"),
  emergencyContact: text("emergencyContact"),
  agreedToRules: boolean("agreedToRules").default(false),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "waitlist"]).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;

// ─── Sponsor Inquiries ─────────────────────────────────────────
export const sponsorInquiries = mysqlTable("sponsor_inquiries", {
  id: serial("id").primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  tier: mysqlEnum("tier", ["title", "green", "gold", "silver", "supporting", "custom"]).notNull(),
  budget: varchar("budget", { length: 100 }),
  message: text("message"),
  website: varchar("website", { length: 255 }),
  status: mysqlEnum("status", ["new", "contacted", "negotiating", "closed", "lost"]).default("new"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SponsorInquiry = typeof sponsorInquiries.$inferSelect;

// ─── Contact Submissions ───────────────────────────────────────
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["general", "sponsorship", "press", "competitor_support"]).default("general"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;

// ─── Products (Champion's Coffee Store) ────────────────────────
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  championName: varchar("championName", { length: 255 }),
  competitionYear: int("competitionYear"),
  origin: varchar("origin", { length: 255 }),
  tastingNotes: text("tastingNotes"),
  roastProfile: text("roastProfile"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("comparePrice", { precision: 10, scale: 2 }),
  imageUrl: text("imageUrl"),
  isLimitedEdition: boolean("isLimitedEdition").default(false),
  isSubscription: boolean("isSubscription").default(false),
  stock: int("stock").default(100),
  royaltyNote: text("royaltyNote"),
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;

// ─── Orders ────────────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }),
  shippingAddress: text("shippingAddress"),
  items: json("items").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled"]).default("pending"),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;

// ─── News Posts ────────────────────────────────────────────────
export const newsPosts = mysqlTable("news_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: mysqlEnum("category", ["press_release", "blog", "announcement", "event_coverage"]).default("blog"),
  coverImage: text("coverImage"),
  author: varchar("author", { length: 255 }),
  published: boolean("published").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsPost = typeof newsPosts.$inferSelect;

// ─── Donations ─────────────────────────────────────────────────
export const donations = mysqlTable("donations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  tier: mysqlEnum("tier", ["supporter", "advocate", "champion", "patron", "one_time"]).notNull(),
  isRecurring: boolean("isRecurring").default(false),
  message: text("message"),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;

// ─── National Organiser Applications ───────────────────────────
export const nationalOrganisers = mysqlTable("national_organisers", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }),
  organisation: varchar("organisation", { length: 255 }),
  experience: text("experience"),
  venueDescription: text("venueDescription"),
  expectedCompetitors: int("expectedCompetitors"),
  proposedDate: varchar("proposedDate", { length: 100 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NationalOrganiser = typeof nationalOrganisers.$inferSelect;

export * from "./throwdown-schema";
