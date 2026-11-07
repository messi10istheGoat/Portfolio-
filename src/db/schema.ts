import { index, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Messages submitted through the contact form.
 * Written by POST /api/contact, read by the local "inbox" API.
 */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    subject: varchar("subject", { length: 180 }).notNull(),
    message: text("message").notNull(),
    source: varchar("source", { length: 40 }).default("portfolio").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("contact_messages_created_at_idx").on(table.createdAt)],
);

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
