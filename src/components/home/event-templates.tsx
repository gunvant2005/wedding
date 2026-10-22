import Link from "next/link";
import { CalendarDays, Heart, Users, Wallet, ArrowRight } from "lucide-react";
import { DEFAULT_TEMPLATES, type EventTypeKey } from "@/lib/templates";

const eventTypes: {
  id: EventTypeKey;
  title: string;
  description: string;
  icon: typeof Heart;
  accentColor: string;
  ctaLabel: string;
}[] = [
  {
    id: "wedding",
    title: "Wedding",
    description:
      "A starter checklist for venue, catering, attire, photography, and the wedding day.",
    icon: Heart,
    accentColor: "#E8C87E",
    ctaLabel: "Plan a Wedding",
  },
  {
    id: "birthday",
    title: "Birthday Celebration",
    description:
      "Plan the venue, food, entertainment, invitations, and event-day setup.",
    icon: Users,
    accentColor: "#DFB15B",
    ctaLabel: "Plan a Birthday",
  },
  {
    id: "community",
    title: "Community Event",
    description:
      "Organize venue and permits, promotion, AV, hospitality, and event operations.",
    icon: CalendarDays,
    accentColor: "#C5A059",
    ctaLabel: "Plan a Community Event",
  },
];

export function EventTemplates() {
  return (
    <div id="event-templates" className="space-y-12 scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
          Planning starters
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7] sm:text-4xl">
          Start with a practical checklist
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#948B79]">
          Each event type includes editable budget categories, timeline tasks, and
          a vendor checklist. These are starting points, not vendor quotes or
          booked services.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {eventTypes.map(({ id, title, description, icon: Icon, accentColor, ctaLabel }) => {
          const template = DEFAULT_TEMPLATES[id];

          return (
            <article
              key={id}
              className="group relative flex flex-col rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#121216]/80 p-6 transition-all duration-300 hover:border-[#C5A059]/50 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8),0_0_24px_-4px_rgba(197,160,89,0.15)] overflow-hidden"
            >
              {/* Subtle corner glow on hover */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(223,177,91,0.12)_0%,transparent_70%)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(197,160,89,0.3)] bg-[rgba(197,160,89,0.1)] transition-all duration-300 group-hover:border-[rgba(197,160,89,0.6)] group-hover:bg-[rgba(197,160,89,0.2)] group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                style={{ color: accentColor }}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>

              {/* Content */}
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[#FCFBF7] group-hover:text-[#DFB15B] transition-colors">
                {title}
              </h3>
              <p className="mt-2 flex-1 min-h-12 text-sm leading-relaxed text-[#948B79] group-hover:text-[#B6AD9C] transition-colors">
                {description}
              </p>

              {/* Stats row */}
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

              {/* CTA */}
              <Link
                href="/sign-up"
                className="mt-5 flex items-center justify-between rounded-lg border border-[rgba(197,160,89,0.2)] bg-[rgba(197,160,89,0.06)] px-4 py-2.5 text-xs font-semibold text-[#DFB15B] transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-[rgba(197,160,89,0.12)] hover:text-[#FCFBF7] group/cta"
                aria-label={`Get started with ${title} template`}
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
