import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  isApproved: boolean("is_approved").default(false),
  approvedBy: text("approved_by"),
  createdAt: text("created_at").notNull(),
});

export const signatures = pgTable("signatures", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

export const logos = pgTable("logos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  isActive: boolean("is_active").default(false),
  isArchived: boolean("is_archived").default(false),
  uploadedAt: text("uploaded_at").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  fileSize: integer("file_size").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
});

export const approveUserSchema = createInsertSchema(users).pick({
  isApproved: true,
  approvedBy: true,
});

export const insertSignatureSchema = createInsertSchema(signatures).pick({
  name: true,
  title: true,
  email: true,
  phone: true,
});

export const insertLogoSchema = createInsertSchema(logos).pick({
  filename: true,
  originalName: true,
  width: true,
  height: true,
  fileSize: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ApproveUser = z.infer<typeof approveUserSchema>;
export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type Signature = typeof signatures.$inferSelect;
export type InsertLogo = z.infer<typeof insertLogoSchema>;
export type Logo = typeof logos.$inferSelect;
