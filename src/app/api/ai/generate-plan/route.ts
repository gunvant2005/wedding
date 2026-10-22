import { generateFastContent, isAiConfigured } from "@/lib/ai/client";
import { getSession } from "@/lib/auth/session";
import { buildPlanSystemPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { aiPlanSchema, createEventSchema } from "@/lib/validations/event";
import { DEFAULT_TEMPLATES, type EventTypeKey } from "@/lib/templates";
import { delimitUserContent } from "@/lib/security/sanitize";
import { verifyCsrf, csrfError } from "@/lib/security/csrf";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";

export const maxDuration = 60;

function createTemplatePlan(input: {
  type: string;
  title: string;
  location?: string | null;
  guestCount?: number | null;
  theme?: string | null;
}) {
  const typeKey = (input.type as EventTypeKey) || "wedding";
  const template = DEFAULT_TEMPLATES[typeKey] || DEFAULT_TEMPLATES.wedding;

  return {
    timelineTasks: template.timelineTasks.map((t) => ({
      title: t.title,
      description: `Task curated for ${input.title || "your celebration"} (${t.daysBeforeEvent > 0 ? `${t.daysBeforeEvent} days before event` : "day of event"}).`,
      daysBeforeEvent: t.daysBeforeEvent,
      milestone: "milestone" in t ? Boolean(t.milestone) : false,
    })),
    budgetCategories: template.budgetCategories.map((c) => ({
      name: c.name,
      percent: c.percent,
      items: [{ name: `${c.name} primary reservation`, estimatedPercentOfCategory: 100 }],
    })),
    vendorItems: [...template.vendorItems],
    ideas: [
      {
        title: `${input.theme || "Bespoke"} Signature Welcome`,
        description: `Open with an enchanting signature cocktail or welcoming moment tailored to ${input.theme || "the celebration"} for your ${input.guestCount || "esteemed"} guests.`,
        categoryTag: "Experience",
      },
      {
        title: "Curated Architectural Photography Vignette",
        description: `Stage an editorial backdrop honoring ${input.location || "the venue architecture"} to capture timeless patron portraits.`,
        categoryTag: "Decor",
      },
      {
        title: "Artisanal Hospitality & Regional Repertoire",
        description: `Infuse authentic local culinary and musical elements inspired by ${input.location || "the destination"} into the evening schedule.`,
        categoryTag: "Hospitality",
      },
    ],
  };
}

export async function POST(req: Request) {
  if (!verifyCsrf(req)) return csrfError();

  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = checkRateLimit(session.user.id, "generate-plan");
  if (!limit.ok) {
    return Response.json(
      { error: "Rate limit exceeded. Try again shortly." },
      { status: 429 },
    );
  }

  let input;
  try {
    const body = await readJsonBody(req, 8_192);
    input = createEventSchema.parse(body);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Invalid event data" }, { status: 400 });
  }

  if (!isAiConfigured()) {
    const templatePlan = createTemplatePlan(input);
    return Response.json({ plan: aiPlanSchema.parse(templatePlan), source: "template" });
  }

  try {
    const promptText = `You are an expert luxury celebration planner. Generate a bespoke, highly refined planning package for this event:
Type: ${input.type}
${delimitUserContent("Title", input.title)}
Date: ${input.eventDate}
${delimitUserContent("Location", input.location || "TBD")}
Guests: ${input.guestCount}
Budget (USD cents): ${input.budgetTotalCents} ($${(input.budgetTotalCents / 100).toFixed(0)})
${delimitUserContent("Theme", input.theme || "open")}
${delimitUserContent("Notes", input.notes || "none")}

Return ONLY a valid raw JSON object (no markdown block, no conversational preamble) matching this schema:
{
  "timelineTasks": [
    { "title": "string", "description": "string", "daysBeforeEvent": 180, "milestone": true }
  ],
  "budgetCategories": [
    { "name": "string", "percent": 30, "items": [{ "name": "string", "estimatedPercentOfCategory": 50 }] }
  ],
  "vendorItems": [
    { "name": "string", "category": "string" }
  ],
  "ideas": [
    { "title": "string", "description": "string (at least 20 chars)", "categoryTag": "string" }
  ]
}

Strict requirements:
- timelineTasks: 6 to 12 items. daysBeforeEvent must be integer (positive = before event, 0 = day of).
- budgetCategories: 5 to 8 items. All category percent numbers MUST sum to approximately 100 (between 95 and 105).
- vendorItems: 5 to 10 items.
- ideas: 3 to 5 unique, creative luxury ideas with rich descriptions.`;

    const text = await generateFastContent(
      promptText,
      buildPlanSystemPrompt(input.type),
      4000, // Strict 4-second budget to keep UI snappy
    );

    let rawJson = text.trim();
    if (rawJson.startsWith("```")) {
      rawJson = rawJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    const jsonStart = rawJson.indexOf("{");
    const jsonEnd = rawJson.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      rawJson = rawJson.slice(jsonStart, jsonEnd + 1);
    }

    const candidate = JSON.parse(rawJson);

    // Normalize budget categories percent if needed to ensure valid sum
    if (Array.isArray(candidate.budgetCategories) && candidate.budgetCategories.length >= 3) {
      const sum = candidate.budgetCategories.reduce(
        (acc: number, c: { percent?: number }) => acc + (Number(c.percent) || 0),
        0
      );
      if (sum > 0 && (sum < 90 || sum > 110)) {
        candidate.budgetCategories = candidate.budgetCategories.map((c: { name: string; percent: number }) => ({
          ...c,
          percent: Math.round((c.percent / sum) * 100),
        }));
      }
    }

    // Ensure ideas array has at least 3 items with valid descriptions
    if (!Array.isArray(candidate.ideas) || candidate.ideas.length < 3) {
      candidate.ideas = createTemplatePlan(input).ideas;
    } else {
      candidate.ideas = candidate.ideas.map((idea: { title?: string; description?: string; categoryTag?: string }, idx: number) => ({
        title: idea.title || `Curated Atelier Detail ${idx + 1}`,
        description: idea.description && idea.description.length >= 10
          ? idea.description
          : `A bespoke celebration moment honoring the ${input.theme || "vision"} for all gathered guests.`,
        categoryTag: idea.categoryTag || "Experience",
      }));
    }

    const validated = aiPlanSchema.safeParse(candidate);
    if (validated.success) {
      return Response.json({ plan: validated.data, source: "ai" });
    }

    console.warn("AI plan schema validation fallback:", validated.error);
    const fallbackPlan = createTemplatePlan(input);
    return Response.json({
      plan: aiPlanSchema.parse(fallbackPlan),
      source: "template-fallback",
      warning: "Custom plan generated from atelier templates.",
    });
  } catch (error) {
    console.warn("generate-plan encountered error, falling back cleanly:", error);
    const fallbackPlan = createTemplatePlan(input);
    return Response.json({
      plan: aiPlanSchema.parse(fallbackPlan),
      source: "template-fallback",
      warning: "AI unavailable; applied atelier template.",
    });
  }
}
