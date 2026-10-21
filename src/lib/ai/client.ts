import { createOpenAI } from "@ai-sdk/openai";

/**
 * Prefer Neon AI Gateway when env is present; fall back to OpenAI BYOK for local/dev.
 */
export function getAiModel(modelId?: string) {
  const baseURL =
    process.env.NEON_AI_GATEWAY_BASE_URL ||
    process.env.AI_GATEWAY_BASE_URL ||
    undefined;
  const apiKey =
    process.env.NEON_AI_GATEWAY_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No AI API key configured. Set NEON_AI_GATEWAY_API_KEY (via neon env pull) or OPENAI_API_KEY.",
    );
  }

  const openai = createOpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });

  const model =
    modelId ||
    process.env.AI_MODEL ||
    "gemini-2.5-flash";

  // Using openai.chat() routes to /chat/completions directly, compatible with OpenAI, Groq, and Gemini OpenAI endpoints
  return openai.chat(model);
}

export function isAiConfigured() {
  return Boolean(
    process.env.NEON_AI_GATEWAY_API_KEY ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY,
  );
}
