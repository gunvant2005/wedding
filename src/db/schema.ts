import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventTypeEnum = pgEnum("event_type", [
  "wedding",
  "birthday",
  "community",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "planning",
  "confirmed",
  "completed",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

export const vendorStatusEnum = pgEnum("vendor_status", [
  "researching",
  "contacted",
  "booked",
  "paid",
]);

/* —— Better Auth tables —— */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/* —— App tables —— */
export const templatePacks = pgTable("template_packs", {
  id: text("id").primaryKey(),
  eventType: eventTypeEnum("event_type").notNull().unique(),
  name: text("name").notNull(),
  budgetCategories: jsonb("budget_categories").$type<
    { name: string; percent: number }[]
  >().notNull(),
  timelineTasks: jsonb("timeline_tasks").$type<
    {
      title: string;
      description?: string;
      daysBeforeEvent: number;
      milestone?: boolean;
    }[]
  >().notNull(),
  vendorItems: jsonb("vendor_items").$type<
    { name: string; category: string }[]
  >().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: eventTypeEnum("type").notNull(),
    title: text("title").notNull(),
    eventDate: timestamp("event_date").notNull(),
    location: text("location"),
    guestCount: integer("guest_count").default(0),
    budgetTotalCents: integer("budget_total_cents").notNull().default(0),
    theme: text("theme"),
    notes: text("notes"),
    status: eventStatusEnum("status").notNull().default("planning"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("events_user_updated_idx").on(t.userId, t.updatedAt)],
);

export const budgetCategories = pgTable(
  "budget_categories",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    allocatedCents: integer("allocated_cents").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("budget_categories_event_idx").on(t.eventId)],
);

export const budgetItems = pgTable(
  "budget_items",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => budgetCategories.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    estimatedCents: integer("estimated_cents").notNull().default(0),
    actualCents: integer("actual_cents").notNull().default(0),
    paid: boolean("paid").notNull().default(false),
  },
  (t) => [index("budget_items_event_idx").on(t.eventId)],
);

export const timelineTasks = pgTable(
  "timeline_tasks",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    status: taskStatusEnum("status").notNull().default("todo"),
    sortOrder: integer("sort_order").notNull().default(0),
    milestone: boolean("milestone").notNull().default(false),
  },
  (t) => [index("timeline_tasks_event_idx").on(t.eventId)],
);

export const vendorItems = pgTable(
  "vendor_items",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull().default("General"),
    status: vendorStatusEnum("status").notNull().default("researching"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    notes: text("notes"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("vendor_items_event_idx").on(t.eventId)],
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ai_messages_event_idx").on(t.eventId)],
);

export const eventIdeas = pgTable(
  "event_ideas",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    categoryTag: text("category_tag"),
    dismissed: boolean("dismissed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("event_ideas_event_idx").on(t.eventId)],
);

export const eventsRelations = relations(events, ({ many }) => ({
  budgetCategories: many(budgetCategories),
  budgetItems: many(budgetItems),
  timelineTasks: many(timelineTasks),
  vendorItems: many(vendorItems),
  aiMessages: many(aiMessages),
  eventIdeas: many(eventIdeas),
}));

export const budgetCategoriesRelations = relations(
  budgetCategories,
  ({ one, many }) => ({
    event: one(events, {
      fields: [budgetCategories.eventId],
      references: [events.id],
    }),
    items: many(budgetItems),
  }),
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type TimelineTask = typeof timelineTasks.$inferSelect;
export type VendorItem = typeof vendorItems.$inferSelect;
export type EventIdea = typeof eventIdeas.$inferSelect;
export type AiMessage = typeof aiMessages.$inferSelect;
