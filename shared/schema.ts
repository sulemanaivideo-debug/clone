import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Attachment type for the JSONB column
export const attachmentSchema = z.object({
  type: z.enum(["pdf", "image", "other"]),
  name: z.string(),
  url: z.string().optional(),
});

export type Attachment = z.infer<typeof attachmentSchema>;

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  senderInitial: text("sender_initial").notNull(), // For the avatar if no image
  senderAvatar: text("sender_avatar"), // New field for image URL
  senderColor: text("sender_color").notNull(), // Tailwind class or hex for avatar bg
  subject: text("subject").notNull(),
  snippet: text("snippet").notNull(),
  timeDisplay: text("time_display").notNull(), // e.g. "8:22 am", "3 Jan"
  body: text("body"), // Full email content
  isUnread: boolean("is_unread").default(true),
  isStarred: boolean("is_starred").default(false),
  hasAttachments: boolean("has_attachments").default(false),
  attachments: jsonb("attachments").$type<Attachment[]>().default([]),
  labels: jsonb("labels").$type<string[]>().default([]), // e.g. ["Important"]
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSchema = createInsertSchema(emails).omit({ 
  id: true, 
  createdAt: true 
});

export type Email = typeof emails.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;

export type EmailResponse = Email;
