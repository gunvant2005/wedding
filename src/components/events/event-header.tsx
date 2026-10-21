import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { daysUntil, formatCurrency } from "@/lib/utils";
import type { Event } from "@/db/schema";

export function EventHeader({
  event,
  spentCents,
}: {
  event: Event;
  spentCents: number;
}) {
  const days = daysUntil(event.eventDate);
  const pct =
    event.budgetTotalCents > 0
      ? Math.min(100, Math.round((spentCents / event.budgetTotalCents) * 100))
      : 0;

  return (
    <div className="sticky top-0 z-20 border-b border-[rgba(197,160,89,0.22)] bg-[#09090B]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{event.type}</Badge>
              <Badge className="capitalize">{event.status}</Badge>
            </div>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7] sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-1 text-xs text-[#948B79]">
              {format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}
              {event.location ? ` · ${event.location}` : ""}
              {event.guestCount ? ` · ${event.guestCount} guests` : ""}
            </p>
          </div>
          <div className="min-w-[180px] text-right">
            <p className="text-3xl font-semibold text-[#DFB15B]">
              {days >= 0 ? `${days} Days` : "Completed"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[#948B79]">Until Celebration</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-[#948B79]">
            <span className="uppercase tracking-wider text-[10px]">Curated Budget</span>
            <span>
              {formatCurrency(spentCents)} spent of{" "}
              {formatCurrency(event.budgetTotalCents)}
            </span>
          </div>
          <Progress value={pct} />
        </div>
      </div>
    </div>
  );
}
