"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { events, eventIdeas } from "@/db/schema";
import { createEventFromInput } from "@/lib/db/seed-event";
import { getEventForUser } from "@/lib/db/queries";
import {
  createEventSchema,
  updateEventSchema,
  type AiPlan,
} from "@/lib/validations/event";
import { normalizeTitle } from "@/lib/utils";

export async function createEventAction(
  raw: unknown,
  aiPlan?: AiPlan | null,
) {
  const session = await requireSession();
  const parsed = createEventSchema.parse(raw);
  const eventId = await createEventFromInput(
    session.user.id,
    parsed,
    aiPlan ?? null,
  );
  revalidatePath("/dashboard");
  return { eventId };
}

export async function updateEventAction(eventId: string, raw: unknown) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const parsed = updateEventSchema.parse(raw);
  await db
    .update(events)
    .set({
      ...(parsed.title !== undefined ? { title: parsed.title } : {}),
      ...(parsed.type !== undefined ? { type: parsed.type } : {}),
      ...(parsed.eventDate !== undefined
        ? { eventDate: new Date(parsed.eventDate) }
        : {}),
      ...(parsed.location !== undefined ? { location: parsed.location } : {}),
      ...(parsed.guestCount !== undefined
        ? { guestCount: parsed.guestCount }
        : {}),
      ...(parsed.budgetTotalCents !== undefined
        ? { budgetTotalCents: parsed.budgetTotalCents }
        : {}),
      ...(parsed.theme !== undefined ? { theme: parsed.theme } : {}),
      ...(parsed.notes !== undefined ? { notes: parsed.notes } : {}),
      ...(parsed.status !== undefined ? { status: parsed.status } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(events.id, eventId), eq(events.userId, session.user.id)));

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
}

export async function deleteEventAction(eventId: string) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  await db
    .delete(events)
    .where(and(eq(events.id, eventId), eq(events.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function saveIdeasAction(
  eventId: string,
  ideas: { title: string; description: string; categoryTag?: string }[],
) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const existing = await db
    .select()
    .from(eventIdeas)
    .where(eq(eventIdeas.eventId, eventId));

  const existingTitles = new Set(
    existing.map((i) => normalizeTitle(i.title)),
  );

  const toInsert: (typeof eventIdeas.$inferInsert)[] = [];
  for (const idea of ideas) {
    if (existingTitles.has(normalizeTitle(idea.title))) continue;
    toInsert.push({
      id: nanoid(),
      eventId,
      title: idea.title,
      description: idea.description,
      categoryTag: idea.categoryTag ?? null,
      dismissed: false,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(eventIdeas).values(toInsert);
  }

  revalidatePath(`/events/${eventId}`);
}

export async function dismissIdeaAction(ideaId: string, eventId: string) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  await db
    .update(eventIdeas)
    .set({ dismissed: true })
    .where(and(eq(eventIdeas.id, ideaId), eq(eventIdeas.eventId, eventId)));

  revalidatePath(`/events/${eventId}`);
}
