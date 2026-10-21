import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getEventWorkspace } from "@/lib/db/queries";
import { BudgetBoard } from "@/components/budget/budget-board";

export default async function BudgetPage({
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
        Budget
      </h2>
      <BudgetBoard
        eventId={eventId}
        categories={workspace.categories}
        items={workspace.items}
        budgetTotalCents={workspace.event.budgetTotalCents}
      />
    </div>
  );
}
