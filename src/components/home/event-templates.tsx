import { CalendarDays, Heart, Users, Wallet } from "lucide-react";
import { DEFAULT_TEMPLATES, type EventTypeKey } from "@/lib/templates";

const eventTypes: {
  id: EventTypeKey;
  title: string;
  description: string;
  icon: typeof Heart;
}[] = [
  {
    id: "wedding",
    title: "Wedding",
    description: "A starter checklist for venue, catering, attire, photography, and the wedding day.",
    icon: Heart,
  },
  {
    id: "birthday",
    title: "Birthday celebration",
    description: "Plan the venue, food, entertainment, invitations, and event-day setup.",
    icon: Users,
  },
  {
    id: "community",
    title: "Community event",
    description: "Organize venue and permits, promotion, AV, hospitality, and event operations.",
    icon: CalendarDays,
  },
];

export function EventTemplates() {
  return (
    <div id="event-templates" className="space-y-8 scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
          Planning starters
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7] sm:text-4xl">
          Start with a practical checklist
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#948B79]">
          Each event type includes editable budget categories, timeline tasks, and a vendor checklist.
          These are starting points, not vendor quotes or booked services.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {eventTypes.map(({ id, title, description, icon: Icon }) => {
          const template = DEFAULT_TEMPLATES[id];

          return (
            <article
              key={id}
              className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#121216]/80 p-6"
            >
              <Icon className="h-6 w-6 text-[#DFB15B]" aria-hidden="true" />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
                {title}
              </h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-[#948B79]">
                {description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[rgba(197,160,89,0.12)] pt-4 text-xs text-[#B6AD9C]">
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-[#C5A059]" aria-hidden="true" />
                  {template.budgetCategories.length} budget categories
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#C5A059]" aria-hidden="true" />
                  {template.timelineTasks.length} timeline tasks
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
