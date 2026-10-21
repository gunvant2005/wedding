import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getEventWorkspace } from "@/lib/db/queries";
import { SiteHeader } from "@/components/site-header";
import { EventHeader } from "@/components/events/event-header";
import { EventTabs } from "@/components/events/event-tabs";
import { AssistantDrawer } from "@/components/assistant/assistant-drawer";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await requireSession();
  const workspace = await getEventWorkspace(eventId, session.user.id);
  if (!workspace) notFound();

  const spentCents = workspace.items.reduce((s, i) => s + i.actualCents, 0);

  return (
    <div className="page-shell">
      <SiteHeader session={session} />
      <EventHeader event={workspace.event} spentCents={spentCents} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <EventTabs eventId={eventId} />
        <main className="py-8 pb-28">{children}</main>
      </div>
      <AssistantDrawer
        eventId={eventId}
        initialMessages={workspace.messages}
      />
    </div>
  );
}
