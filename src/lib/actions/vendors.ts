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
  updateVendorItemSchema,
} from "@/lib/validations/event";
import { z } from "zod";

import { createAction, type ActionResponse } from "./utils";

export async function addVendorAction(
  eventId: string,
  raw: unknown,
): Promise<ActionResponse<void>> {
  return createAction(async () => {
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
  });
}

export async function updateVendorStatusAction(
  vendorId: string,
  status: z.infer<typeof vendorStatusSchema>,
): Promise<ActionResponse<{ eventId: string }>> {
  return createAction(async () => {
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
  });
}

export async function updateVendorAction(
  vendorId: string,
  raw: unknown,
): Promise<ActionResponse<void>> {
  return createAction(async () => {
    const session = await requireSession();
    const vendor = await getVendorForUser(vendorId, session.user.id);
    if (!vendor) throw new Error("Vendor not found");
    const parsed = updateVendorItemSchema
      .extend({
        contactName: vendorItemSchema.shape.contactName.nullable().optional(),
        contactEmail: vendorItemSchema.shape.contactEmail.nullable().optional(),
        contactPhone: vendorItemSchema.shape.contactPhone.nullable().optional(),
        notes: vendorItemSchema.shape.notes.nullable().optional(),
      })
      .parse(raw);

    await db
      .update(vendorItems)
      .set({
        ...(parsed.name !== undefined ? { name: parsed.name } : {}),
        ...(parsed.category !== undefined ? { category: parsed.category } : {}),
        ...(parsed.status !== undefined ? { status: parsed.status } : {}),
        ...(parsed.contactName !== undefined
          ? { contactName: parsed.contactName }
          : {}),
        ...(parsed.contactEmail !== undefined
          ? { contactEmail: parsed.contactEmail }
          : {}),
        ...(parsed.contactPhone !== undefined
          ? { contactPhone: parsed.contactPhone }
          : {}),
        ...(parsed.notes !== undefined ? { notes: parsed.notes } : {}),
      })
      .where(eq(vendorItems.id, vendorId));

    revalidatePath(`/events/${vendor.eventId}/vendors`);
  });
}

export async function deleteVendorAction(
  vendorId: string,
): Promise<ActionResponse<void>> {
  return createAction(async () => {
    const session = await requireSession();
    const vendor = await getVendorForUser(vendorId, session.user.id);
    if (!vendor) throw new Error("Vendor not found");

    await db
      .delete(vendorItems)
      .where(
        and(
          eq(vendorItems.id, vendorId),
          eq(vendorItems.eventId, vendor.eventId),
        ),
      );
    revalidatePath(`/events/${vendor.eventId}/vendors`);
  });
}
