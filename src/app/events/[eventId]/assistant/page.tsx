import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getEventWorkspace } from "@/lib/db/queries";
import { ChatPanel } from "@/components/assistant/chat-panel";

export default async function AssistantPage({
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
        AI assistant
      </h2>
      <ChatPanel eventId={eventId} initialMessages={workspace.messages} />
    </div>
  );
}
