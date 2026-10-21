import { generateObject } from "ai";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getAiModel, isAiConfigured } from "@/lib/ai/client";
import { buildIdeasPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getEventForUser } from "@/lib/db/queries";
import { saveIdeasAction } from "@/lib/actions/events";

import { verifyCsrf, csrfError } from "@/lib/security/csrf";

const ideasSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      categoryTag: z.string().optional(),
    }),
  ),
});

const ideasRequestSchema = z.object({
  eventId: z.string().min(1),
});

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!verifyCsrf(req)) return csrfError();

  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = checkRateLimit(session.user.id, "ideas");
  if (!limit.ok) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let eventId: string;
  try {
    const body = await req.json();
    const parsed = ideasRequestSchema.parse(body);
    eventId = parsed.eventId;
  } catch {
    return Response.json({ error: "eventId required and must be valid" }, { status: 400 });
  }

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (!isAiConfigured()) {
    const ideas = [
      {
        title: "Signature detail",
        description: `Add one memorable detail tied to your ${event.theme || event.type} theme.`,
        categoryTag: "Theme",
      },
      {
        title: "Guest connection",
        description:
          "Include a short activity that helps guests mingle in the first 30 minutes.",
        categoryTag: "Experience",
      },
      {
        title: "Budget-smart upgrade",
        description:
          "Reallocate a small percent of misc budget toward one high-impact visual moment.",
        categoryTag: "Budget",
      },
    ];
    await saveIdeasAction(eventId, ideas);
    return Response.json({ ideas, source: "template" });
  }

  try {
    const { object } = await generateObject({
      model: getAiModel(),
      schema: ideasSchema,
      prompt: buildIdeasPrompt(event),
    });
    await saveIdeasAction(eventId, object.ideas);
    return Response.json({ ideas: object.ideas, source: "ai" });
  } catch (error) {
    console.error("ideas failed", error);
    return Response.json(
      { error: "Failed to generate ideas" },
      { status: 500 },
    );
  }
}
