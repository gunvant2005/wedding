import "dotenv/config";
import { generateText } from "ai";
import { getAiModel, isAiConfigured } from "../src/lib/ai/client";

async function main() {
  console.log("Checking AI configuration...");

  if (!isAiConfigured()) {
    console.error("❌ FAILED: No API key found in .env.local!");
    console.log("Please ensure OPENAI_API_KEY or NEON_AI_GATEWAY_API_KEY is set in .env.local.");
    process.exit(1);
  }

  const rawKey =
    process.env.NEON_AI_GATEWAY_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "";

  console.log(`Key detected: configured (${rawKey.length} characters; value not displayed)`);
  console.log(`Target model: ${process.env.AI_MODEL || "gpt-4o-mini"}`);
  console.log("Sending a test query to OpenAI / AI Gateway...");

  try {
    const model = getAiModel();
    const result = await generateText({
      model,
      prompt: "Reply with exactly: 'API key is active and working properly.'",
    });

    console.log("✅ SUCCESS! The API key is valid and working.");
    console.log(`AI Response: "${result.text.trim()}"`);
  } catch (error: unknown) {
    console.error("❌ FAILED: Error communicating with AI provider.");
    const msg = error instanceof Error ? error.message : String(error);
    // Sanitize any accidental key leak in error message
    const sanitizedMsg = rawKey ? msg.split(rawKey).join("[REDACTED_API_KEY]") : msg;
    console.error(`Details: ${sanitizedMsg}`);
    process.exitCode = 1;
  }
}

main();
