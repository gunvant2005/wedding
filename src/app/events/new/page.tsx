import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { requireSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/site-header";
import { EventWizard } from "@/components/events/event-wizard";

export default async function NewEventPage() {
  await requireSession();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="px-4 py-10 sm:px-6">
        <Suspense fallback={<div className="text-center py-20 text-[#DFB15B]">Initializing Atelier...</div>}>
          <EventWizard />
        </Suspense>
      </main>
    </div>
  );
}
