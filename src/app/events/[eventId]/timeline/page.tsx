import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getEventWorkspace } from "@/lib/db/queries";
import { TimelineBoard } from "@/components/timeline/timeline-board";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await requireSession();
  const workspace = await getEventWorkspace(eventId, session.user.id);
  if (!workspace) notFound();

  return (
    <div>
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        Timeline
      </h2>
      <TimelineBoard eventId={eventId} tasks={workspace.tasks} />
    </div>
  );
}
