import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";
import { templatePacks } from "../src/db/schema";
import { DEFAULT_TEMPLATES } from "../src/lib/templates";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL required");
  }
  const db = drizzle(neon(process.env.DATABASE_URL));

  for (const [eventType, pack] of Object.entries(DEFAULT_TEMPLATES)) {
    await db
      .insert(templatePacks)
      .values({
        id: nanoid(),
        eventType: eventType as "wedding" | "birthday" | "community",
        name: pack.name,
        budgetCategories: [...pack.budgetCategories],
        timelineTasks: pack.timelineTasks.map((t) => ({
          title: t.title,
          daysBeforeEvent: t.daysBeforeEvent,
          milestone: "milestone" in t ? Boolean(t.milestone) : false,
        })),
        vendorItems: [...pack.vendorItems],
      })
      .onConflictDoUpdate({
        target: templatePacks.eventType,
        set: {
          name: pack.name,
          budgetCategories: [...pack.budgetCategories],
          timelineTasks: pack.timelineTasks.map((t) => ({
            title: t.title,
            daysBeforeEvent: t.daysBeforeEvent,
            milestone: "milestone" in t ? Boolean(t.milestone) : false,
          })),
          vendorItems: [...pack.vendorItems],
        },
      });
    console.log(`Seeded template: ${eventType}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
