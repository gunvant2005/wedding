"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { vendorItems } from "@/db/schema";
import { getEventForUser, getVendorForUser } from "@/lib/db/queries";
import {
  vendorItemSchema,
  vendorStatusSchema,
} from "@/lib/validations/event";
import { z } from "zod";

export async function addVendorAction(eventId: string, raw: unknown) {
  const session = await requireSession();
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) throw new Error("Event not found");

  const [maxRow] = await db
    .select({
      maxSort: sql<number>`coalesce(max(${vendorItems.sortOrder}), -1)`,
    })
    .from(vendorItems)
    .where(eq(vendorItems.eventId, eventId));
  const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

  const parsed = vendorItemSchema.parse(raw);
  await db.insert(vendorItems).values({
    id: nanoid(),
    eventId,
    name: parsed.name,
    category: parsed.category,
    status: parsed.status,
    contactName: parsed.contactName || null,
    contactEmail: parsed.contactEmail || null,
    contactPhone: parsed.contactPhone || null,
    notes: parsed.notes || null,
    sortOrder: nextSort,
  });
  revalidatePath(`/events/${eventId}/vendors`);
}

export async function updateVendorStatusAction(
  vendorId: string,
  status: z.infer<typeof vendorStatusSchema>,
) {
  const session = await requireSession();
  const vendor = await getVendorForUser(vendorId, session.user.id);
  if (!vendor) throw new Error("Vendor not found");

  const parsed = vendorStatusSchema.parse(status);
  await db
    .update(vendorItems)
    .set({ status: parsed })
    .where(eq(vendorItems.id, vendorId));

  revalidatePath(`/events/${vendor.eventId}/vendors`);
  return { eventId: vendor.eventId };
}

export async function updateVendorAction(
  vendorId: string,
  raw: Partial<{
    name: string;
    category: string;
    status: z.infer<typeof vendorStatusSchema>;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    notes: string | null;
  }>,
) {
  const session = await requireSession();
  const vendor = await getVendorForUser(vendorId, session.user.id);
  if (!vendor) throw new Error("Vendor not found");

  await db
    .update(vendorItems)
    .set({
      ...(raw.name !== undefined ? { name: raw.name } : {}),
      ...(raw.category !== undefined ? { category: raw.category } : {}),
      ...(raw.status !== undefined ? { status: raw.status } : {}),
      ...(raw.contactName !== undefined
        ? { contactName: raw.contactName }
        : {}),
      ...(raw.contactEmail !== undefined
        ? { contactEmail: raw.contactEmail }
        : {}),
      ...(raw.contactPhone !== undefined
        ? { contactPhone: raw.contactPhone }
        : {}),
      ...(raw.notes !== undefined ? { notes: raw.notes } : {}),
    })
    .where(eq(vendorItems.id, vendorId));

  revalidatePath(`/events/${vendor.eventId}/vendors`);
}

export async function deleteVendorAction(vendorId: string) {
  const session = await requireSession();
  const vendor = await getVendorForUser(vendorId, session.user.id);
  if (!vendor) throw new Error("Vendor not found");

  await db
    .delete(vendorItems)
    .where(
      and(eq(vendorItems.id, vendorId), eq(vendorItems.eventId, vendor.eventId)),
    );
  revalidatePath(`/events/${vendor.eventId}/vendors`);
}
