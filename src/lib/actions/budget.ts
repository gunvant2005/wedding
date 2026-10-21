"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { budgetCategories, budgetItems } from "@/db/schema";
import {
  getBudgetItemForUser,
  getEventForUser,
} from "@/lib/db/queries";
import {
  budgetCategorySchema,
  budgetItemSchema,
} from "@/lib/validations/event";

export async function addBudgetCategoryAction(eventId: string, raw: unknown) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const [maxRow] = await db
    .select({
      maxSort: sql<number>`coalesce(max(${budgetCategories.sortOrder}), -1)`,
    })
    .from(budgetCategories)
    .where(eq(budgetCategories.eventId, eventId));
  const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

  const parsed = budgetCategorySchema.parse(raw);
  await db.insert(budgetCategories).values({
    id: nanoid(),
    eventId,
    name: parsed.name,
    allocatedCents: parsed.allocatedCents,
    sortOrder: nextSort,
  });
  revalidatePath(`/events/${eventId}/budget`);
}

export async function updateBudgetCategoryAction(
  categoryId: string,
  eventId: string,
  raw: Partial<{ name: string; allocatedCents: number }>,
) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  await db
    .update(budgetCategories)
    .set({
      ...(raw.name !== undefined ? { name: raw.name } : {}),
      ...(raw.allocatedCents !== undefined
        ? { allocatedCents: raw.allocatedCents }
        : {}),
    })
    .where(
      and(
        eq(budgetCategories.id, categoryId),
        eq(budgetCategories.eventId, eventId),
      ),
    );
  revalidatePath(`/events/${eventId}/budget`);
}

export async function deleteBudgetCategoryAction(
  categoryId: string,
  eventId: string,
) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  await db
    .delete(budgetCategories)
    .where(
      and(
        eq(budgetCategories.id, categoryId),
        eq(budgetCategories.eventId, eventId),
      ),
    );
  revalidatePath(`/events/${eventId}/budget`);
}

export async function addBudgetItemAction(eventId: string, raw: unknown) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const parsed = budgetItemSchema.parse(raw);
  await db.insert(budgetItems).values({
    id: nanoid(),
    eventId,
    categoryId: parsed.categoryId,
    name: parsed.name,
    estimatedCents: parsed.estimatedCents,
    actualCents: parsed.actualCents,
    paid: parsed.paid,
  });
  revalidatePath(`/events/${eventId}/budget`);
}

export async function updateBudgetItemAction(
  itemId: string,
  raw: Partial<{
    name: string;
    estimatedCents: number;
    actualCents: number;
    paid: boolean;
  }>,
) {
  const session = await requireSession();
  const item = await getBudgetItemForUser(itemId, session.user.id);
  if (!item) throw new Error("Item not found");

  await db
    .update(budgetItems)
    .set({
      ...(raw.name !== undefined ? { name: raw.name } : {}),
      ...(raw.estimatedCents !== undefined
        ? { estimatedCents: raw.estimatedCents }
        : {}),
      ...(raw.actualCents !== undefined
        ? { actualCents: raw.actualCents }
        : {}),
      ...(raw.paid !== undefined ? { paid: raw.paid } : {}),
    })
    .where(eq(budgetItems.id, itemId));

  revalidatePath(`/events/${item.eventId}/budget`);
  return { eventId: item.eventId };
}

export async function deleteBudgetItemAction(itemId: string) {
  const session = await requireSession();
  const item = await getBudgetItemForUser(itemId, session.user.id);
  if (!item) throw new Error("Item not found");

  await db.delete(budgetItems).where(eq(budgetItems.id, itemId));
  revalidatePath(`/events/${item.eventId}/budget`);
}
