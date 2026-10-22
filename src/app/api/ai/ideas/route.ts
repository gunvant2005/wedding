import { generateText } from "ai";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getAiModel, isAiConfigured } from "@/lib/ai/client";
import { buildIdeasPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getEventForUser } from "@/lib/db/queries";
import { saveIdeasAction } from "@/lib/actions/events";
import { eventIdeasSchema } from "@/lib/validations/event";

import { verifyCsrf, csrfError } from "@/lib/security/csrf";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";

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
    const body = await readJsonBody(req, 1_024);
    const parsed = ideasRequestSchema.parse(body);
    eventId = parsed.eventId;
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "eventId required and must be valid" }, { status: 400 });
  }

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const fallbackIdeas = [
    {
      title: "Signature Welcome Repertoire",
      description: `Incorporate a signature moment celebrating your ${event.theme || event.type} theme as guests arrive.`,
      categoryTag: "Theme",
    },
    {
      title: "Atmospheric Visual Vignette",
      description: "Create an intentional focal backdrop or lounge area for memorable guest photography.",
      categoryTag: "Decor",
    },
    {
      title: "Curated Hospitality Touch",
      description: `Introduce a personalized sensory detail inspired by ${event.location || "your venue"}.`,
      categoryTag: "Hospitality",
    },
  ];

  if (!isAiConfigured()) {
    await saveIdeasAction(eventId, fallbackIdeas);
    return Response.json({ ideas: fallbackIdeas, source: "template" });
  }

  try {
    const { text } = await generateText({
      model: getAiModel(),
      system: "You are an expert luxury event concept curator. Return ONLY a raw JSON array of 3 to 6 ideas without markdown blocks.",
      prompt: `${buildIdeasPrompt(event)}
Format:
[
  { "title": "...", "description": "...", "categoryTag": "..." }
]`,
    });

    let rawJson = text.trim();
    if (rawJson.startsWith("```")) {
      rawJson = rawJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    const jsonStart = rawJson.indexOf("[");
    const jsonEnd = rawJson.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      rawJson = rawJson.slice(jsonStart, jsonEnd + 1);
    }

    const candidate = JSON.parse(rawJson);
    const validated = eventIdeasSchema.safeParse(candidate);

    if (validated.success && validated.data.length >= 3) {
      await saveIdeasAction(eventId, validated.data);
      return Response.json({ ideas: validated.data, source: "ai" });
    }

    await saveIdeasAction(eventId, fallbackIdeas);
    return Response.json({ ideas: fallbackIdeas, source: "template-fallback" });
  } catch (error) {
    console.warn("ideas generation note, using fallback:", error);
    await saveIdeasAction(eventId, fallbackIdeas);
    return Response.json({ ideas: fallbackIdeas, source: "template-fallback" });
  }
}
