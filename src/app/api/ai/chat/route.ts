import { streamText, tool } from "ai";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth/session";
import { getAiModel, isAiConfigured } from "@/lib/ai/client";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getEventForUser, getEventSnapshot } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { aiMessages } from "@/db/schema";
import { updateBudgetItemAction } from "@/lib/actions/budget";
import { addTimelineTaskAction } from "@/lib/actions/timeline";
import { updateVendorStatusAction } from "@/lib/actions/vendors";
import { vendorStatusSchema } from "@/lib/validations/event";
import { verifyCsrf, csrfError } from "@/lib/security/csrf";

const chatRequestSchema = z.object({
  eventId: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.string().max(10_000),
      }),
    )
    .min(1)
    .max(100),
});

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
    const body = await req.json();
    parsed = chatRequestSchema.parse(body);
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { eventId, messages } = parsed;

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    await db.insert(aiMessages).values({
      id: nanoid(),
      eventId,
      role: "user",
      content: lastUser.content,
    });
  }

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

  const result = streamText({
    model: getAiModel(),
    system: buildChatSystemPrompt(snapshot),
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    tools: {
      updateBudgetItem: tool({
        description: "Update a budget line item's actual spend or paid flag",
        inputSchema: z.object({
          itemId: z.string(),
          actualCents: z.number().int().optional(),
          paid: z.boolean().optional(),
          name: z.string().optional(),
        }),
        execute: async (args) => {
          await updateBudgetItemAction(args.itemId, args);
          return { ok: true, ...args };
        },
      }),
      addTimelineTask: tool({
        description: "Add a timeline task to this event",
        inputSchema: z.object({
          title: z.string(),
          description: z.string().optional(),
          dueDate: z.string().optional(),
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
          vendorId: z.string(),
          status: vendorStatusSchema,
        }),
        execute: async (args) => {
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
