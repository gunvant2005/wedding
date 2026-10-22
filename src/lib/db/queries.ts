import { cache } from "react";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  budgetCategories,
  budgetItems,
  events,
  eventIdeas,
  timelineTasks,
  vendorItems,
  aiMessages,
  type Event,
} from "@/db/schema";

export const listEventsForUser = cache(async (userId: string) => {
  return db
    .select()
    .from(events)
    .where(eq(events.userId, userId))
    .orderBy(sql`${events.updatedAt} desc`);
});

export const getEventForUser = cache(async (eventId: string, userId: string) => {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.userId, userId)))
    .limit(1);
  return event ?? null;
});

export const getEventWorkspace = cache(async (eventId: string, userId: string) => {
  const event = await getEventForUser(eventId, userId);
  if (!event) return null;

  const [categories, items, tasks, vendors, ideas, messages] =
    await Promise.all([
      db
        .select()
        .from(budgetCategories)
        .where(eq(budgetCategories.eventId, eventId))
        .orderBy(asc(budgetCategories.sortOrder)),
      db
        .select()
        .from(budgetItems)
        .where(eq(budgetItems.eventId, eventId)),
      db
        .select()
        .from(timelineTasks)
        .where(eq(timelineTasks.eventId, eventId))
        .orderBy(asc(timelineTasks.sortOrder)),
      db
        .select()
        .from(vendorItems)
        .where(eq(vendorItems.eventId, eventId))
        .orderBy(asc(vendorItems.sortOrder)),
      db
        .select()
        .from(eventIdeas)
        .where(
          and(eq(eventIdeas.eventId, eventId), eq(eventIdeas.dismissed, false)),
        )
        .orderBy(sql`${eventIdeas.createdAt} desc`),
      db
        .select()
        .from(aiMessages)
        .where(eq(aiMessages.eventId, eventId))
        .orderBy(asc(aiMessages.createdAt))
        .limit(50),
    ]);

  return { event, categories, items, tasks, vendors, ideas, messages };
});

export async function getEventSnapshot(event: Event) {
  const now = new Date();
  const [[spent], [vendorCounts], [taskCounts]] = await Promise.all([
    db
      .select({
        total: sql<number>`coalesce(sum(${budgetItems.actualCents}), 0)`,
      })
      .from(budgetItems)
      .where(eq(budgetItems.eventId, event.id)),
    db
      .select({
        openVendors: sql<number>`count(*) filter (where ${vendorItems.status} not in ('booked', 'paid'))`,
      })
      .from(vendorItems)
      .where(eq(vendorItems.eventId, event.id)),
    db
      .select({
        totalTasks: sql<number>`count(*)`,
        overdueTasks: sql<number>`count(*) filter (where ${timelineTasks.status} != 'done' and ${timelineTasks.dueDate} < ${now})`,
      })
      .from(timelineTasks)
      .where(eq(timelineTasks.eventId, event.id)),
  ]);

  return {
    event,
    budgetSpentCents: Number(spent?.total ?? 0),
    openVendors: Number(vendorCounts?.openVendors ?? 0),
    overdueTasks: Number(taskCounts?.overdueTasks ?? 0),
    taskCount: Number(taskCounts?.totalTasks ?? 0),
  };
}

export async function getVendorForUser(vendorId: string, userId: string) {
  const [row] = await db
    .select({
      vendor: vendorItems,
      eventUserId: events.userId,
    })
    .from(vendorItems)
    .innerJoin(events, eq(vendorItems.eventId, events.id))
    .where(and(eq(vendorItems.id, vendorId), eq(events.userId, userId)))
    .limit(1);
  return row ? { ...row.vendor, userId: row.eventUserId } : null;
}

export async function getBudgetItemForUser(itemId: string, userId: string) {
  const [row] = await db
    .select({
      item: budgetItems,
      eventUserId: events.userId,
    })
    .from(budgetItems)
    .innerJoin(events, eq(budgetItems.eventId, events.id))
    .where(and(eq(budgetItems.id, itemId), eq(events.userId, userId)))
    .limit(1);
  return row ? { ...row.item, userId: row.eventUserId } : null;
}

export async function getTimelineTaskForUser(taskId: string, userId: string) {
  const [row] = await db
    .select({
      task: timelineTasks,
      eventUserId: events.userId,
    })
    .from(timelineTasks)
    .innerJoin(events, eq(timelineTasks.eventId, events.id))
    .where(and(eq(timelineTasks.id, taskId), eq(events.userId, userId)))
    .limit(1);
  return row ? { ...row.task, userId: row.eventUserId } : null;
}
