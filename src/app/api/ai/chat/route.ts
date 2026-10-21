import { streamText, tool } from "ai";
import { z } from "zod";
import { and, desc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth/session";
import { getAiModel, isAiConfigured } from "@/lib/ai/client";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import {
  getBudgetItemForUser,
  getEventForUser,
  getEventSnapshot,
  getVendorForUser,
} from "@/lib/db/queries";
import { db } from "@/lib/db";
import { aiMessages } from "@/db/schema";
import { updateBudgetItemAction } from "@/lib/actions/budget";
import { addTimelineTaskAction } from "@/lib/actions/timeline";
import { updateVendorStatusAction } from "@/lib/actions/vendors";
import { vendorStatusSchema } from "@/lib/validations/event";
import { verifyCsrf, csrfError } from "@/lib/security/csrf";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";

import { chatRequestSchema } from "@/lib/validations/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!verifyCsrf(req)) return csrfError();

  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = checkRateLimit(session.user.id, "chat");
  if (!limit.ok) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let parsed;
  try {
    const body = await readJsonBody(req, 8_192);
    parsed = chatRequestSchema.parse(body);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { eventId, message } = parsed;

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db.insert(aiMessages).values({
    id: nanoid(),
    eventId,
    role: "user",
    content: message,
  });

  if (!isAiConfigured()) {
    const reply =
      "AI is not configured yet. Add OPENAI_API_KEY or Neon AI Gateway credentials to enable the copilot. Meanwhile, use the Budget, Timeline, and Vendors tabs to organize manually.";
    await db.insert(aiMessages).values({
      id: nanoid(),
      eventId,
      role: "assistant",
      content: reply,
    });
    return new Response(reply, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const snapshot = await getEventSnapshot(event);
  const history = await db
    .select({ role: aiMessages.role, content: aiMessages.content })
    .from(aiMessages)
    .where(
      and(
        eq(aiMessages.eventId, eventId),
        inArray(aiMessages.role, ["user", "assistant"]),
      ),
    )
    .orderBy(desc(aiMessages.createdAt))
    .limit(30);

  const result = streamText({
    model: getAiModel(),
    system: buildChatSystemPrompt(snapshot),
    messages: history.reverse().map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    tools: {
      updateBudgetItem: tool({
        description: "Update a budget line item's actual spend or paid flag",
        inputSchema: z.object({
          itemId: z.string().min(1).max(100),
          actualCents: z.number().int().min(0).max(2_000_000_000).optional(),
          paid: z.boolean().optional(),
          name: z.string().min(1).max(120).optional(),
        }),
        execute: async (args) => {
          const item = await getBudgetItemForUser(args.itemId, session.user.id);
          if (!item || item.eventId !== eventId) {
            throw new Error("Budget item not found in this event");
          }
          await updateBudgetItemAction(args.itemId, args);
          return { ok: true, ...args };
        },
      }),
      addTimelineTask: tool({
        description: "Add a timeline task to this event",
        inputSchema: z.object({
          title: z.string().min(1).max(160),
          description: z.string().max(1000).optional(),
          dueDate: z
            .string()
            .max(40)
            .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
            .optional(),
          milestone: z.boolean().optional(),
        }),
        execute: async (args) => {
          await addTimelineTaskAction(eventId, {
            title: args.title,
            description: args.description,
            dueDate: args.dueDate,
            status: "todo",
            milestone: args.milestone ?? false,
          });
          return { ok: true, ...args };
        },
      }),
      setVendorStatus: tool({
        description: "Update a vendor checklist status",
        inputSchema: z.object({
          vendorId: z.string().min(1).max(100),
          status: vendorStatusSchema,
        }),
        execute: async (args) => {
          const vendor = await getVendorForUser(args.vendorId, session.user.id);
          if (!vendor || vendor.eventId !== eventId) {
            throw new Error("Vendor not found in this event");
          }
          await updateVendorStatusAction(args.vendorId, args.status);
          return { ok: true, ...args };
        },
      }),
      suggestIdeas: tool({
        description: "Suggest personalized ideas without saving them yet",
        inputSchema: z.object({
          ideas: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              categoryTag: z.string().optional(),
            }),
          ),
        }),
        execute: async (args) => args,
      }),
    },
    onFinish: async ({ text }) => {
      if (text) {
        try {
          await db.insert(aiMessages).values({
            id: nanoid(),
            eventId,
            role: "assistant",
            content: text.slice(0, 50_000),
          });
        } catch (err) {
          console.error("Failed to persist AI message:", err);
        }
      }
    },
  });

  return result.toTextStreamResponse();
}
