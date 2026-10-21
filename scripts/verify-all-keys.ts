import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { generateText } from "ai";
import { getAiModel, isAiConfigured } from "../src/lib/ai/client";
import { normalizeDatabaseUrl } from "../src/lib/db/connection-string";

async function verifyAll() {
  console.log("==================================================");
  console.log("   GATHERLY ATELIER — FULL API & KEYS DIAGNOSTIC  ");
  console.log("==================================================\n");

  let allPassed = true;

  // 1. Check Database (DATABASE_URL)
  console.log("1. DATABASE_URL (Neon Postgres)");
  const rawDbUrl = process.env.DATABASE_URL?.trim();
  if (!rawDbUrl) {
    console.error("   ❌ NOT CONFIGURED: DATABASE_URL is missing.");
    allPassed = false;
  } else if (rawDbUrl.includes("user:pass@host")) {
    console.error("   ❌ INVALID: DATABASE_URL is still placeholder text.");
    allPassed = false;
  } else {
    try {
      const sql = neon(normalizeDatabaseUrl(rawDbUrl));
      const res = await sql.query("SELECT 1 as connected");
      if (res && res.length > 0) {
        console.log("   ✅ CONNECTED: Successfully queried Neon PostgreSQL database!");
      } else {
        console.warn("   ⚠️ Connected, but unexpected query response.");
      }
    } catch (dbErr: unknown) {
      console.error("   ❌ CONNECTION FAILED:", dbErr instanceof Error ? dbErr.message : String(dbErr));
      allPassed = false;
    }
  }

  // 2. Check Auth Secret (BETTER_AUTH_SECRET)
  console.log("\n2. BETTER_AUTH_SECRET (Better Auth Security)");
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (!secret || secret === "replace-with-a-long-random-secret") {
    console.error("   ❌ NOT CONFIGURED: Default or empty secret detected.");
    allPassed = false;
  } else if (secret.length < 24) {
    console.warn("   ⚠️ WARNING: Secret is shorter than recommended 32 characters.");
  } else {
    console.log(`   ✅ CONFIGURED: Active and secure (${secret.length} characters).`);
  }

  // 3. Check AI API Key (OPENAI_API_KEY or Neon AI Gateway)
  console.log("\n3. AI API KEY (OpenAI / Neon AI Gateway)");
  if (!isAiConfigured()) {
    console.log("   ❌ NOT CONFIGURED: OPENAI_API_KEY is empty in .env.local.");
    console.log("      (If you just pasted it in VS Code/editor, make sure to press Ctrl+S to save the file!)");
    allPassed = false;
  } else {
    const rawAiKey =
      process.env.NEON_AI_GATEWAY_API_KEY ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      "";

    console.log(`   Detected Key: configured (${rawAiKey.length} characters; value not displayed)`);
    console.log(`   Target Model: ${process.env.AI_MODEL || "gpt-4o-mini"}`);
    console.log("   Testing query to AI model...");

    try {
      const model = getAiModel();
      const result = await generateText({
        model,
        prompt: "Reply with the word: 'Connected'",
      });
      console.log(`   ✅ SUCCESS: AI model is active and responding! Response: "${result.text.trim()}"`);
    } catch (aiErr: unknown) {
      console.error("   ❌ CONNECTION FAILED: Unable to authenticate with AI provider.");
      const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
      const sanitized = rawAiKey ? msg.split(rawAiKey).join("[REDACTED_API_KEY]") : msg;
      console.error(`      Error details: ${sanitized}`);
      allPassed = false;
    }
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("   STATUS: ALL SERVICES & KEYS ARE ACTIVE! 🎉");
  } else {
    console.log("   STATUS: SOME KEYS NEED ATTENTION (SEE ABOVE)");
  }
  console.log("==================================================");
}

verifyAll();
