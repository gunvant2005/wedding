import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession, requireSession } from "@/lib/auth/session";
import { getEventForUser, getEventWorkspace } from "@/lib/db/queries";
import { EventDossierSnapshot } from "@/components/events/event-dossier-snapshot";
import { IdeasPanel } from "@/components/events/ideas-panel";
import { DeleteEventButton } from "@/components/events/delete-event-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const session = await getSession();
  if (!session?.user) return { title: "Event Dossier — Gatherly" };
  const event = await getEventForUser(eventId, session.user.id);
  if (!event) return { title: "Event — Gatherly" };
  return {
    title: `${event.title} — Dossier | Gatherly`,
    description: `Atelier planning dossier for ${event.title} (${event.type}) at ${event.location || "Private Venue"}.`,
  };
}

export default async function EventOverviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await requireSession();
  const workspace = await getEventWorkspace(eventId, session.user.id);
  if (!workspace) notFound();

  const { event, categories, tasks, vendors, ideas } = workspace;

  return (
    <div className="space-y-10">
      {/* Animated Information Dossier & Intelligence Snapshot */}
      <EventDossierSnapshot
        event={event}
        categories={categories}
        tasks={tasks}
        vendors={vendors}
      />

      {/* AI Idea Brainstorming Studio */}
      <IdeasPanel eventId={eventId} ideas={ideas} />

      {/* Danger Zone */}
      <div className="pt-6 border-t border-[rgba(197,160,89,0.15)] flex justify-end">
        <DeleteEventButton eventId={eventId} />
      </div>
    </div>
  );
}
