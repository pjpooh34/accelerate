import { pgTable, text, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Google authentication fields
  firebaseId: text("firebase_id").unique(),
  email: text("email"),
  photoURL: text("photo_url"),
  // Stripe subscription fields
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  subscriptionStatus: text("subscription_status").default("free"), // free, active, past_due, canceled
  subscriptionEndDate: timestamp("subscription_end_date"),
  // AI model preferences
  preferredAiModel: text("preferred_ai_model").default("openai"), // openai, claude
  aiUsageCount: integer("ai_usage_count").default(0),
  aiUsageResetDate: timestamp("ai_usage_reset_date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
  })
  .extend({
    firebaseId: z.string().optional(),
    email: z.string().email().optional(),
    photoURL: z.string().url().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Content table
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  contentType: varchar("content_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  category: text("category"),
  imageUrl: text("image_url"),
  isPosted: boolean("is_posted").notNull().default(false),
  postId: text("post_id"),
  platformUrl: text("platform_url"),
  postedAt: timestamp("posted_at"),
});

export const insertContentSchema = createInsertSchema(contents)
  .omit({ id: true, createdAt: true, isPosted: true, postId: true, platformUrl: true, postedAt: true })
  .extend({
    userId: z.number().nullable().optional(),
    category: z.string().optional(),
  });

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

// Saved content table for favorites
export const savedContents = pgTable("saved_contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentId: integer("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const insertSavedContentSchema = createInsertSchema(savedContents)
  .omit({ id: true, savedAt: true });

export type InsertSavedContent = z.infer<typeof insertSavedContentSchema>;
export type SavedContent = typeof savedContents.$inferSelect;

// API schemas
// Advanced options schema for content generation
export const advancedOptionsSchema = z.object({
  creativity: z.number().min(0).max(1).default(0.7),
  maxLength: z.number().min(10).max(2000).default(280),
  includeEmojis: z.boolean().default(true),
  includeCTA: z.boolean().default(true),
  includeHashtags: z.boolean().default(true),
  customHashtags: z.array(z.string()).default([]),
  avoidWords: z.array(z.string()).default([]),
  contentStyle: z.string().default("balanced"),
  languageModel: z.enum(["openai", "claude"]).default("openai"),
}).optional().default({
  creativity: 0.7,
  maxLength: 280,
  includeEmojis: true,
  includeCTA: true,
  includeHashtags: true,
  customHashtags: [],
  avoidWords: [],
  contentStyle: "balanced",
  languageModel: "openai",
});

// Subscription schemas
export const subscriptionPlanSchema = z.object({
  plan: z.enum(["free", "pro"]),
});

export const updateUserPreferencesSchema = z.object({
  preferredAiModel: z.enum(["openai", "claude"]).optional(),
});

export const generateContentSchema = z.object({
  topic: z.string().min(3).max(100),
  tone: z.string(),
  keywords: z.string().optional(),
  audience: z.string(),
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  contentType: z.enum(["postWithImage", "carousel", "story", "textOnly"]),
  category: z.string().optional(),
  advancedOptions: advancedOptionsSchema.optional(),
});

export const generateMoreVariationsSchema = z.object({
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  contentType: z.enum(["postWithImage", "carousel", "story", "textOnly"]),
  baseContent: z.object({
    title: z.string(),
    content: z.string(),
  }),
  advancedOptions: advancedOptionsSchema,
});

export const saveContentSchema = z.object({
  contentId: z.number(),
});

export const unsaveContentSchema = z.object({
  contentId: z.number(),
});

// Post to social media schema
export const postToSocialMediaSchema = z.object({
  contentId: z.number(),
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  imageUrl: z.string().optional(),
});