import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { listEventsForUser } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { budgetItems } from "@/db/schema";
import { inArray, sql } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Gatherly Luxury Atelier",
  description: "Manage your curated luxury events, budgets, timelines, and vendor portfolios.",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const events = await listEventsForUser(session.user.id);

  const spentMap: Record<string, number> = {};
  if (events.length > 0) {
    const eventIds = events.map((e) => e.id);
    const rows = await db
      .select({
        eventId: budgetItems.eventId,
        total: sql<number>`coalesce(sum(${budgetItems.actualCents}), 0)`,
      })
      .from(budgetItems)
      .where(inArray(budgetItems.eventId, eventIds))
      .groupBy(budgetItems.eventId);

    for (const row of rows) {
      spentMap[row.eventId] = Number(row.total);
    }
  }

  return (
    <div className="page-shell">
      <SiteHeader session={session} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <DashboardClient
          events={events}
          spentMap={spentMap}
          userName={session.user.name || "Esteemed Patron"}
        />
      </main>
    </div>
  );
}
