"use client";

import { useState } from "react";
import { CalendarDays, Circle, Flag } from "lucide-react";

const stages = [
  {
    label: "12–18 months",
    title: "Set the foundation",
    note: "Confirm the venue capacity, accessibility, and included services before signing.",
    tasks: [
      { title: "Set a budget and draft the guest list", milestone: true },
      { title: "Research venues and review availability" },
      { title: "Choose a date and book the venue", milestone: true },
      { title: "Start researching key vendors" },
    ],
  },
  {
    label: "6–12 months",
    title: "Book vendors",
    note: "Review vendor contracts, payment dates, and cancellation terms.",
    tasks: [
      { title: "Book photography and catering", milestone: true },
      { title: "Choose music and entertainment" },
      { title: "Plan attire and schedule fittings" },
      { title: "Send save-the-dates", milestone: true },
    ],
  },
  {
    label: "1–3 months",
    title: "Confirm the details",
    note: "Share the schedule and important contacts with everyone involved.",
    tasks: [
      { title: "Send invitations and track responses", milestone: true },
      { title: "Confirm the menu and final guest count" },
      { title: "Draft the event-day schedule" },
      { title: "Confirm delivery and setup times with vendors" },
    ],
  },
  {
    label: "Event week",
    title: "Final checks",
    note: "Keep a printed or shared copy of the schedule and key contact numbers.",
    tasks: [
      { title: "Reconfirm times and final counts", milestone: true },
      { title: "Prepare payments, tips, and contact list" },
      { title: "Complete rehearsal or venue walkthrough" },
      { title: "Event-day setup and checklist", milestone: true },
    ],
  },
] as const;

export function TimelinePreview() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];

  return (
    <section
      id="timeline-preview"
      aria-labelledby="timeline-preview-title"
      className="scroll-mt-24 rounded-2xl border border-[rgba(197,160,89,0.25)] bg-[#121217]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
    >
      <div className="flex flex-col gap-5 border-b border-[rgba(197,160,89,0.2)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Sample timeline
          </div>
          <h2
            id="timeline-preview-title"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7] sm:text-3xl"
          >
            A typical planning timeline
          </h2>
          <p className="mt-1 text-xs text-[#948B79]">
            Example tasks for a wedding. Your event timeline is editable.
          </p>
        </div>

        <div role="group" className="flex flex-wrap gap-2" aria-label="Timeline stages">
          {stages.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={activeStage === index}
              onClick={() => setActiveStage(index)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${
                activeStage === index
                  ? "bg-[#DFB15B] text-[#09090B]"
                  : "bg-[#181820] text-[#B6AD9C] hover:text-[#FCFBF7]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#DFB15B]">
            {stage.title}
          </h3>
          {stage.tasks.map((task) => (
            <div
              key={task.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#17171F]/80 p-3.5"
            >
              <div className="flex items-start gap-3">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#948B79]" aria-hidden="true" />
                <span className="text-xs text-[#FCFBF7] sm:text-sm">{task.title}</span>
              </div>
              {"milestone" in task && task.milestone && (
                <span className="flex shrink-0 items-center gap-1 rounded border border-[#C5A059]/30 bg-[#C5A059]/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#DFB15B]">
                  <Flag className="h-2.5 w-2.5" aria-hidden="true" />
                  Milestone
                </span>
              )}
            </div>
          ))}
        </div>

        <aside className="rounded-xl border border-[rgba(197,160,89,0.2)] bg-[#191922]/70 p-6 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#DFB15B]">
            Planning note
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#DCD4C3]">
            {stage.note}
          </p>
          <p className="mt-5 border-t border-[rgba(197,160,89,0.15)] pt-4 text-xs leading-relaxed text-[#948B79]">
            This is an example only. It is not linked to an account, calendar, or vendor schedule.
          </p>
        </aside>
      </div>
    </section>
  );
}
