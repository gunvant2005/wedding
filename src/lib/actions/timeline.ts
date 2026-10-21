"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { timelineTasks } from "@/db/schema";
import {
  getEventForUser,
  getTimelineTaskForUser,
} from "@/lib/db/queries";
import { timelineTaskSchema, taskStatusSchema } from "@/lib/validations/event";
import { z } from "zod";

export async function addTimelineTaskAction(eventId: string, raw: unknown) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const [maxRow] = await db
    .select({
      maxSort: sql<number>`coalesce(max(${timelineTasks.sortOrder}), -1)`,
    })
    .from(timelineTasks)
    .where(eq(timelineTasks.eventId, eventId));
  const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

  const parsed = timelineTaskSchema.parse(raw);
  await db.insert(timelineTasks).values({
    id: nanoid(),
    eventId,
    title: parsed.title,
    description: parsed.description ?? null,
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
    status: parsed.status,
    milestone: parsed.milestone,
    sortOrder: nextSort,
  });
  revalidatePath(`/events/${eventId}/timeline`);
  revalidatePath(`/events/${eventId}`);
}

export async function updateTimelineTaskAction(
  taskId: string,
  raw: Partial<{
    title: string;
    description: string | null;
    dueDate: string | null;
    status: z.infer<typeof taskStatusSchema>;
    milestone: boolean;
  }>,
) {
  const session = await requireSession();
  const task = await getTimelineTaskForUser(taskId, session.user.id);
  if (!task) throw new Error("Task not found");

  await db
    .update(timelineTasks)
    .set({
      ...(raw.title !== undefined ? { title: raw.title } : {}),
      ...(raw.description !== undefined
        ? { description: raw.description }
        : {}),
      ...(raw.dueDate !== undefined
        ? { dueDate: raw.dueDate ? new Date(raw.dueDate) : null }
        : {}),
      ...(raw.status !== undefined ? { status: raw.status } : {}),
      ...(raw.milestone !== undefined ? { milestone: raw.milestone } : {}),
    })
    .where(eq(timelineTasks.id, taskId));

  revalidatePath(`/events/${task.eventId}/timeline`);
  return { eventId: task.eventId };
}

export async function reorderTimelineTasksAction(
  eventId: string,
  orderedIds: string[],
) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(timelineTasks)
        .set({ sortOrder: index })
        .where(
          and(eq(timelineTasks.id, id), eq(timelineTasks.eventId, eventId)),
        ),
    ),
  );
  revalidatePath(`/events/${eventId}/timeline`);
}

export async function deleteTimelineTaskAction(taskId: string) {
  const session = await requireSession();
  const task = await getTimelineTaskForUser(taskId, session.user.id);
  if (!task) throw new Error("Task not found");

  await db.delete(timelineTasks).where(eq(timelineTasks.id, taskId));
  revalidatePath(`/events/${task.eventId}/timeline`);
}
