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

/**
 * Ultra-fast direct Gemini generation with strict timeout (default 5s)
 * Prevents 15-60s network hangs and proxy disconnects.
 */
export async function generateFastContent(
  prompt: string,
  systemPrompt?: string,
  timeoutMs: number = 5000,
): Promise<string> {
  const apiKey =
    process.env.NEON_AI_GATEWAY_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("No AI API key configured");
  }

  const model = process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

  if (systemPrompt) {
    contents.push(
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I will strictly follow all instructions and return raw JSON format only." }] },
    );
  }

  contents.push({ role: "user", parts: [{ text: prompt }] });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`AI status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) {
      throw new Error("Empty AI response received");
    }
    return output;
  } finally {
    clearTimeout(timer);
  }
}
