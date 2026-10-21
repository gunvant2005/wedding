import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import {
  budgetCategories,
  budgetItems,
  eventIdeas,
  events,
  timelineTasks,
  vendorItems,
} from "@/db/schema";
import { DEFAULT_TEMPLATES, type EventTypeKey } from "@/lib/templates";
import type { AiPlan, CreateEventInput } from "@/lib/validations/event";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function createEventFromInput(
  userId: string,
  input: CreateEventInput,
  aiPlan?: AiPlan | null,
) {
  const eventId = nanoid();
  const eventDate = new Date(input.eventDate);
  const type = input.type as EventTypeKey;
  const template = DEFAULT_TEMPLATES[type];

  await db.insert(events).values({
    id: eventId,
    userId,
    type: input.type,
    title: input.title,
    eventDate,
    location: input.location || null,
    guestCount: input.guestCount ?? 0,
    budgetTotalCents: input.budgetTotalCents ?? 0,
    theme: input.theme || null,
    notes: input.notes || null,
    status: "planning",
  });

  const budgetSource =
    aiPlan?.budgetCategories ??
    template.budgetCategories.map((c) => ({
      name: c.name,
      percent: c.percent,
      items: [] as { name: string; estimatedPercentOfCategory?: number }[],
    }));

  const total = input.budgetTotalCents ?? 0;

  // Prepare batch categories and items
  const categoriesToInsert: (typeof budgetCategories.$inferInsert)[] = [];
  const itemsToInsert: (typeof budgetItems.$inferInsert)[] = [];

  for (let i = 0; i < budgetSource.length; i++) {
    const cat = budgetSource[i];
    const catId = nanoid();
    const allocated = Math.round((cat.percent / 100) * total);

    categoriesToInsert.push({
      id: catId,
      eventId,
      name: cat.name,
      allocatedCents: allocated,
      sortOrder: i,
    });

    const lineItems =
      "items" in cat && cat.items?.length
        ? cat.items
        : [{ name: `${cat.name} estimate`, estimatedPercentOfCategory: 100 }];

    for (const item of lineItems) {
      const pct = item.estimatedPercentOfCategory ?? 100 / lineItems.length;
      itemsToInsert.push({
        id: nanoid(),
        categoryId: catId,
        eventId,
        name: item.name,
        estimatedCents: Math.round((pct / 100) * allocated),
        actualCents: 0,
        paid: false,
      });
    }
  }

  if (categoriesToInsert.length > 0) {
    await db.insert(budgetCategories).values(categoriesToInsert);
  }
  if (itemsToInsert.length > 0) {
    await db.insert(budgetItems).values(itemsToInsert);
  }

  const taskSource =
    aiPlan?.timelineTasks ??
    template.timelineTasks.map((t) => ({
      title: t.title,
      description: undefined as string | undefined,
      daysBeforeEvent: t.daysBeforeEvent,
      milestone: "milestone" in t ? Boolean(t.milestone) : false,
    }));

  const tasksToInsert: (typeof timelineTasks.$inferInsert)[] = taskSource.map(
    (t, i) => ({
      id: nanoid(),
      eventId,
      title: t.title,
      description: t.description ?? null,
      dueDate: addDays(eventDate, -t.daysBeforeEvent),
      status: "todo",
      sortOrder: i,
      milestone: Boolean(t.milestone),
    }),
  );

  if (tasksToInsert.length > 0) {
    await db.insert(timelineTasks).values(tasksToInsert);
  }

  const vendorSource = aiPlan?.vendorItems ?? [...template.vendorItems];
  const vendorsToInsert: (typeof vendorItems.$inferInsert)[] = vendorSource.map(
    (v, i) => ({
      id: nanoid(),
      eventId,
      name: v.name,
      category: v.category,
      status: "researching",
      sortOrder: i,
    }),
  );

  if (vendorsToInsert.length > 0) {
    await db.insert(vendorItems).values(vendorsToInsert);
  }

  if (aiPlan?.ideas?.length) {
    const ideasToInsert: (typeof eventIdeas.$inferInsert)[] = aiPlan.ideas.map(
      (idea) => ({
        id: nanoid(),
        eventId,
        title: idea.title,
        description: idea.description,
        categoryTag: idea.categoryTag ?? null,
        dismissed: false,
      }),
    );
    await db.insert(eventIdeas).values(ideasToInsert);
  }

  return eventId;
}
