import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getEventWorkspace } from "@/lib/db/queries";
import { VendorBoard } from "@/components/vendors/vendor-board";

export default async function VendorsPage({
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
        Vendors
      </h2>
      <VendorBoard eventId={eventId} vendors={workspace.vendors} />
    </div>
  );
}
