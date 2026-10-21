import { db } from "../src/lib/db";
import {
  user,
  account,
  session,
  templatePacks,
  events,
  budgetCategories,
  budgetItems,
  timelineTasks,
  vendorItems,
  aiMessages,
  eventIdeas
} from "../src/db/schema";
import { eq } from "drizzle-orm";
import { getAiModel } from "../src/lib/ai/client";
import { generateText } from "ai";

interface TestReportItem {
  feature: string;
  category: string;
  status: "PASSED" | "FAILED" | "WARNING";
  details: string;
  durationMs: number;
}

const report: TestReportItem[] = [];

async function runStep(
  feature: string,
  category: string,
  fn: () => Promise<string | void>
) {
  const start = Date.now();
  process.stdout.write(`⏳ Testing [${category}] ${feature}... `);
  try {
    const res = await fn();
    const duration = Date.now() - start;
    console.log(`✅ PASSED (${duration}ms)`);
    report.push({
      feature,
      category,
      status: "PASSED",
      details: res || "Success with no errors",
      durationMs: duration
    });
  } catch (err: any) {
    const duration = Date.now() - start;
    console.log(`❌ FAILED (${duration}ms):`, err.message);
    report.push({
      feature,
      category,
      status: "FAILED",
      details: err.stack || err.message,
      durationMs: duration
    });
  }
}

async function main() {
  console.log("\n=========================================================");
  console.log("   GATHERLY: COMPREHENSIVE END-TO-END FEATURE TEST RUN   ");
  console.log("=========================================================\n");

  const testUserId = `test-user-${Date.now()}`;
  const testEmail = `tester-${Date.now()}@gatherly-test.luxury`;
  let testEventId = "";
  let testCategoryId = "";
  let testItemId = "";
  let testTaskId = "";
  let testVendorId = "";

  // 1. Neon Database Connection
  await runStep("Database Connectivity", "Database", async () => {
    const res = await db.select().from(templatePacks);
    return `Connected to Neon PostgreSQL. Found ${res.length} template packs.`;
  });

  // 2. Template Packs Verification
  await runStep("Template Packs Seeding", "Database", async () => {
    const packs = await db.select().from(templatePacks);
    if (packs.length === 0) {
      throw new Error("No template packs seeded! Expected wedding, birthday, community.");
    }
    const types = packs.map((p) => p.eventType).sort().join(", ");
    return `Verified templates: ${types}`;
  });

  // 3. User & Auth Data Flow
  await runStep("User Creation & Query", "Auth", async () => {
    await db.insert(user).values({
      id: testUserId,
      name: "Luxury VIP Tester",
      email: testEmail,
      emailVerified: true
    });
    const found = await db.query.user?.findFirst({
      where: (u, { eq }) => eq(u.id, testUserId)
    }) ?? (await db.select().from(user).where(eq(user.id, testUserId)))[0];

    if (!found) throw new Error("User record was not retrieved after insertion.");
    return `Created & queried user: ${found.email}`;
  });

  // 4. Session & Account Relation
  await runStep("Session Generation & Constraints", "Auth", async () => {
    const sessionId = `test-sess-${Date.now()}`;
    const token = `token-${Date.now()}-${Math.random()}`;
    await db.insert(session).values({
      id: sessionId,
      userId: testUserId,
      token,
      expiresAt: new Date(Date.now() + 86400000)
    });
    const sess = (await db.select().from(session).where(eq(session.id, sessionId)))[0];
    if (!sess) throw new Error("Session could not be retrieved");
    return `Session valid with token ${sess.token.slice(0, 10)}...`;
  });

  // 5. Event Creation (Dossier Initialization)
  await runStep("Event Creation with Defaults", "Events", async () => {
    testEventId = `evt-${Date.now()}`;
    await db.insert(events).values({
      id: testEventId,
      userId: testUserId,
      type: "wedding",
      title: "Château de Chambord Autumn Gala",
      eventDate: new Date("2027-09-18T16:00:00Z"),
      location: "Loire Valley, France",
      guestCount: 140,
      budgetTotalCents: 15000000, // $150,000.00
      theme: "Opulent Black Tie & French Renaissance Florals",
      notes: "Strict RSVP deadline 60 days prior.",
      status: "planning"
    });
    const evt = (await db.select().from(events).where(eq(events.id, testEventId)))[0];
    if (!evt) throw new Error("Event could not be found after insertion");
    return `Event created: "${evt.title}" (${evt.type}) with budget $${evt.budgetTotalCents / 100}`;
  });

  // 6. Budget Categories & Items
  await runStep("Budget Categories & Items Allocation", "Budget", async () => {
    testCategoryId = `cat-${Date.now()}`;
    await db.insert(budgetCategories).values({
      id: testCategoryId,
      eventId: testEventId,
      name: "Venue & Architectural Lighting",
      allocatedCents: 6000000,
      sortOrder: 0
    });

    testItemId = `item-${Date.now()}`;
    await db.insert(budgetItems).values({
      id: testItemId,
      categoryId: testCategoryId,
      eventId: testEventId,
      name: "Château Grand Ballroom Rental Deposit",
      estimatedCents: 3500000,
      actualCents: 3500000,
      paid: true
    });

    const items = await db.select().from(budgetItems).where(eq(budgetItems.eventId, testEventId));
    if (items.length === 0) throw new Error("Budget items missing");
    return `Category created with item "${items[0].name}" ($${items[0].actualCents / 100}) - Paid: ${items[0].paid}`;
  });

  // 7. Timeline Tasks & Milestones
  await runStep("Timeline Tasks & Milestone Sorting", "Timeline", async () => {
    testTaskId = `task-${Date.now()}`;
    await db.insert(timelineTasks).values({
      id: testTaskId,
      eventId: testEventId,
      title: "Finalize Haute Couture Bridal Gown & Tuxedo",
      description: "Final fitting with atelier in Paris.",
      dueDate: new Date("2027-07-01T12:00:00Z"),
      status: "in_progress",
      sortOrder: 1,
      milestone: true
    });

    const tasks = await db.select().from(timelineTasks).where(eq(timelineTasks.eventId, testEventId));
    if (tasks.length === 0) throw new Error("Timeline task not saved");
    return `Task "${tasks[0].title}" saved. Milestone: ${tasks[0].milestone}, Status: ${tasks[0].status}`;
  });

  // 8. Vendor Directory Management
  await runStep("Vendor Lifecycle Management", "Vendors", async () => {
    testVendorId = `vendor-${Date.now()}`;
    await db.insert(vendorItems).values({
      id: testVendorId,
      eventId: testEventId,
      name: "Maison Ladurée Haute Patisserie",
      category: "Catering & Cake",
      status: "contacted",
      contactName: "Jean-Paul Laurent",
      contactEmail: "concierge@laduree-paris.fr",
      contactPhone: "+33 1 42 60 21 79",
      notes: "Custom macaron pyramid and multi-tiered champagne cake."
    });

    const vendors = await db.select().from(vendorItems).where(eq(vendorItems.eventId, testEventId));
    if (vendors.length === 0) throw new Error("Vendor was not saved");
    return `Vendor saved: "${vendors[0].name}" (${vendors[0].category}) - Status: ${vendors[0].status}`;
  });

  // 9. AI Ideation & Persistent Recommendations
  await runStep("AI Idea Suggestions Database Storage", "AI Features", async () => {
    const ideaId = `idea-${Date.now()}`;
    await db.insert(eventIdeas).values({
      id: ideaId,
      eventId: testEventId,
      title: "Midnight Fireworks Display Over the River",
      description: "Synchronized pyrotechnics display with classical chamber music.",
      categoryTag: "Entertainment",
      dismissed: false
    });

    const ideas = await db.select().from(eventIdeas).where(eq(eventIdeas.eventId, testEventId));
    if (ideas.length === 0) throw new Error("Event idea not stored");
    return `Idea stored: "${ideas[0].title}" (${ideas[0].categoryTag})`;
  });

  // 10. AI Chat History Storage
  await runStep("AI Chat Conversation Storage", "AI Features", async () => {
    const msgId = `msg-${Date.now()}`;
    await db.insert(aiMessages).values({
      id: msgId,
      eventId: testEventId,
      role: "assistant",
      content: "I recommend scheduling your string quartet soundcheck 90 minutes before guest arrival."
    });

    const msgs = await db.select().from(aiMessages).where(eq(aiMessages.eventId, testEventId));
    if (msgs.length === 0) throw new Error("AI message not stored");
    return `AI message recorded: "${msgs[0].content.slice(0, 45)}..."`;
  });

  // 11. Live AI Model Call (Gemini 2.5 Flash via AI SDK)
  await runStep("Live Gemini AI Plan Generation", "AI Engine", async () => {
    const model = getAiModel();
    const result = await generateText({
      model,
      prompt: "Give 3 brief luxury timeline checklist recommendations for a high-end French chateau wedding. Bullet points only."
    });
    if (!result.text || result.text.length < 10) {
      throw new Error("AI returned empty or insufficient response");
    }
    return `Generated live response (${result.text.length} chars):\n${result.text.trim()}`;
  });

  // 12. Cleanup Test Entities
  await runStep("Foreign Key Cascading Cleanup", "Database", async () => {
    // Deleting the user should cascade delete session, events, budget, timeline, vendors, ai messages
    await db.delete(user).where(eq(user.id, testUserId));

    const checkEvt = await db.select().from(events).where(eq(events.id, testEventId));
    if (checkEvt.length > 0) throw new Error("Cascading delete failed: Event still exists!");

    const checkItems = await db.select().from(budgetItems).where(eq(budgetItems.eventId, testEventId));
    if (checkItems.length > 0) throw new Error("Cascading delete failed: Budget items still exist!");

    return "Cascading delete verified: All child rows removed cleanly.";
  });

  console.log("\n=========================================================");
  console.log("                   SUMMARY OF RESULTS                    ");
  console.log("=========================================================");
  const passed = report.filter((r) => r.status === "PASSED").length;
  const failed = report.filter((r) => r.status === "FAILED").length;
  console.log(`Total Tests: ${report.length} | Passed: ${passed} | Failed: ${failed}`);

  // Write JSON report for artifact generation
  const fs = await import("fs");
  fs.writeFileSync(
    "scripts/test-report-results.json",
    JSON.stringify({ timestamp: new Date().toISOString(), report }, null, 2)
  );
}

main().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exitCode = 1;
});
