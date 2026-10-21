import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { daysUntil, formatCurrency } from "@/lib/utils";
import type { Event } from "@/db/schema";

const typeLabel: Record<string, string> = {
  wedding: "Luxury Wedding",
  birthday: "Grand Birthday",
  community: "Private Gala",
};

export function EventCard({
  event,
  spentCents = 0,
}: {
  event: Event;
  spentCents?: number;
}) {
  const days = daysUntil(event.eventDate);
  const budgetPct =
    event.budgetTotalCents > 0
      ? Math.min(100, Math.round((spentCents / event.budgetTotalCents) * 100))
      : 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-2xl border border-[rgba(197,160,89,0.25)] bg-[#141418]/85 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A059]/60 hover:shadow-[0_12px_30px_rgba(197,160,89,0.15)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge className="capitalize">{typeLabel[event.type] ?? event.type}</Badge>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7] group-hover:text-[#DFB15B] transition-colors">
            {event.title}
          </h3>
          <p className="mt-1.5 text-xs text-[#948B79]">
            {format(new Date(event.eventDate), "MMMM d, yyyy")}
            {event.location ? ` · ${event.location}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-[#DFB15B]">
            {days >= 0 ? `${days}d` : "Past"}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#948B79]">Countdown</p>
        </div>
      </div>
      <div className="mt-6 border-t border-[rgba(197,160,89,0.15)] pt-4">
        <div className="mb-1.5 flex justify-between text-xs text-[#948B79]">
          <span className="uppercase tracking-wider text-[10px]">Budget Allocation</span>
          <span>
            {formatCurrency(spentCents)} / {formatCurrency(event.budgetTotalCents)}
          </span>
        </div>
        <Progress value={budgetPct} />
      </div>
    </Link>
  );
}
