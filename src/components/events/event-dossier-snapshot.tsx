"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Crown,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Palette,
  Clock,
  ExternalLink,
  Copy,
  CheckCircle2,
  FileText,
  ChevronRight,
  Wine,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, daysUntil } from "@/lib/utils";
import type { Event, BudgetCategory, TimelineTask, VendorItem } from "@/db/schema";

interface EventDossierProps {
  event: Event;
  categories: BudgetCategory[];
  tasks: TimelineTask[];
  vendors: VendorItem[];
}

export function EventDossierSnapshot({
  event,
  categories,
  tasks,
  vendors,
}: EventDossierProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "hospitality" | "milestones">("specs");

  const days = daysUntil(event.eventDate);
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const bookedVendors = vendors.filter(
    (v) => v.status === "booked" || v.status === "paid",
  ).length;
  const allocated = categories.reduce((s, c) => s + c.allocatedCents, 0);
  const taskPct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const remainingBudget = Math.max(0, event.budgetTotalCents - allocated);
  const perGuest = Math.round(
    (event.budgetTotalCents || 0) / Math.max(1, event.guestCount || 1),
  );

  // Next 3 pending tasks
  const pendingTasks = tasks
    .filter((t) => t.status !== "done")
    .slice(0, 3);

  // Estimated table counts
  const tablesCount = Math.ceil((event.guestCount || 100) / 10);

  async function copyDossier() {
    const text = [
      `🏛️ GATHERLY ATELIER DOSSIER: ${event.title.toUpperCase()}`,
      `Type: ${event.type.toUpperCase()} | Status: ${event.status.toUpperCase()}`,
      `Date: ${format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")} (${days >= 0 ? `${days} days left` : "Concluded"})`,
      `Location: ${event.location || "Private Venue (TBD)"}`,
      `Guest Count: ${event.guestCount} guests (~${tablesCount} tables of 10)`,
      `Total Budget: ${formatCurrency(event.budgetTotalCents)}`,
      `Allocated Capital: ${formatCurrency(allocated)} (${remainingBudget > 0 ? `${formatCurrency(remainingBudget)} reserve` : "Fully Allocated"})`,
      `Aesthetic Theme: ${event.theme || "Haute Couture Bespoke"}`,
      `Planning Progress: ${doneTasks}/${tasks.length} tasks completed (${taskPct}%)`,
      `Vendors Contracted: ${bookedVendors}/${vendors.length} vendors secured`,
      ``,
      `Atelier Notes:`,
      event.notes || "No additional parameters specified.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Full Event Dossier copied to clipboard!");
    } catch {
      toast.error("Failed to copy dossier to clipboard");
    }
  }

  async function copyLocation() {
    if (!event.location) return;
    try {
      await navigator.clipboard.writeText(event.location);
      toast.success("Venue address copied!");
    } catch {
      toast.error("Failed to copy venue address");
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* 1. Animated Executive Metrics Grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        {/* Metric 1: Tasks & Milestones */}
        <div className="card-detail p-5 group hover:border-[#DFB15B]/60">
          <div className="flex items-center justify-between text-xs text-[#9E9685]">
            <span className="uppercase tracking-widest text-[10px]">Milestones & Tasks</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#FAF8F5]">
              {doneTasks} <span className="text-lg text-[#9E9685]">/ {tasks.length}</span>
            </p>
            <span className="text-xs font-semibold text-[#DFB15B]">{taskPct}% Complete</span>
          </div>
          <Progress value={taskPct} className="mt-3 h-1.5" />
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A89F8E]">
            <span className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${taskPct >= 50 ? "bg-emerald-400" : "bg-[#DFB15B]"}`} />
              {taskPct >= 50 ? "Ahead of Schedule" : "In Active Orchestration"}
            </span>
            <Link
              href={`/events/${event.id}/timeline`}
              className="text-[#DFB15B] hover:underline flex items-center gap-0.5"
            >
              Timeline <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Vetted Vendors */}
        <div className="card-detail p-5 group hover:border-[#DFB15B]/60">
          <div className="flex items-center justify-between text-xs text-[#9E9685]">
            <span className="uppercase tracking-widest text-[10px]">Contracted Vendors</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B]">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#FAF8F5]">
              {bookedVendors} <span className="text-lg text-[#9E9685]">/ {vendors.length}</span>
            </p>
            <span className="text-xs font-semibold text-[#E8C87E]">
              {vendors.length > 0 ? Math.round((bookedVendors / vendors.length) * 100) : 0}% Secured
            </span>
          </div>
          <Progress
            value={vendors.length > 0 ? (bookedVendors / vendors.length) * 100 : 0}
            className="mt-3 h-1.5"
          />
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A89F8E]">
            <span>{vendors.filter((v) => v.status === "contacted").length} In Discussion</span>
            <Link
              href={`/events/${event.id}/vendors`}
              className="text-[#DFB15B] hover:underline flex items-center gap-0.5"
            >
              Vendors <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Budget & Investment */}
        <div className="card-detail p-5 group hover:border-[#DFB15B]/60">
          <div className="flex items-center justify-between text-xs text-[#9E9685]">
            <span className="uppercase tracking-widest text-[10px]">Capital Allocation</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-normal text-[#FAF8F5]">
              {formatCurrency(allocated)}
            </p>
            <span className="text-xs font-semibold text-[#DFB15B]">
              {formatCurrency(event.budgetTotalCents)} cap
            </span>
          </div>
          <Progress
            value={
              event.budgetTotalCents > 0
                ? Math.min(100, (allocated / event.budgetTotalCents) * 100)
                : 0
            }
            className="mt-3 h-1.5"
          />
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A89F8E]">
            <span>{formatCurrency(perGuest)} / guest</span>
            <Link
              href={`/events/${event.id}/budget`}
              className="text-[#DFB15B] hover:underline flex items-center gap-0.5"
            >
              Budget <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Detailed Celebration Blueprint & Intelligence Dossier */}
      <section className="relative overflow-hidden rounded-3xl border border-[rgba(197,160,89,0.25)] bg-[#101015]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Subtle Ambient Aura */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(223,177,91,0.08)_0%,transparent_70%)] blur-2xl" />

        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(197,160,89,0.18)] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B]">
                <FileText className="h-3 w-3" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
                Atelier Blueprint & Dossier
              </p>
            </div>
            <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#FAF8F5]">
              Celebration Intelligence
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#9E9685]">
              Architectural parameters, hospitality specifications, and aesthetic styling notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyDossier}
              className="border-[#C5A059]/30 text-[#FAF8F5] hover:border-[#DFB15B] hover:text-[#DFB15B] transition-all cursor-pointer text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy Dossier
            </Button>
          </div>
        </div>

        {/* Interactive Detail Tabs */}
        <div
          aria-label="Event dossier sections"
          className="mt-6 flex items-center gap-2 border-b border-[rgba(197,160,89,0.12)] pb-4"
        >
          {[
            { id: "specs", label: "Aesthetic & Venue Specs" },
            { id: "hospitality", label: "Hospitality & Seating" },
            { id: "milestones", label: `Urgent Milestones (${pendingTasks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as "specs" | "hospitality" | "milestones")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border border-[#DFB15B] bg-[#DFB15B]/15 text-[#FAF8F5] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  : "border border-transparent text-[#9E9685] hover:text-[#FAF8F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Aesthetic & Venue Specs */}
        {activeTab === "specs" && (
          <div
            className="mt-6 grid gap-6 sm:grid-cols-2 animate-fade-up"
          >
            {/* Spec 1: Aesthetic Theme */}
            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685] flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-[#DFB15B]" />
                  Aesthetic Theme & Mood
                </span>
                <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#E8C87E]">
                  Curated
                </span>
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[#FAF8F5]">
                {event.theme || "Haute Couture Bespoke"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] text-[#A89F8E]">Palette Harmony:</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded-full bg-[#DFB15B] border border-white/20 shadow-sm" title="Imperial Gold" />
                  <span className="h-4 w-4 rounded-full bg-[#111116] border border-[#DFB15B]/40 shadow-sm" title="Noir Obsidian" />
                  <span className="h-4 w-4 rounded-full bg-[#FAF8F5] border border-white/20 shadow-sm" title="Matte Ivory" />
                  <span className="h-4 w-4 rounded-full bg-[#8C6D48] border border-white/20 shadow-sm" title="Antique Bronze" />
                </div>
              </div>
            </div>

            {/* Spec 2: Scheduled Chronology */}
            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#DFB15B]" />
                  Calendar & Chronology
                </span>
                <span className="text-xs font-semibold text-[#DFB15B]">
                  {days >= 0 ? `${days} Days Countdown` : "Concluded"}
                </span>
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[#FAF8F5]">
                {format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}
              </p>
              <p className="mt-2 text-xs text-[#9E9685]">
                Target Season: <span className="text-[#D6D0C2]">Golden Hour Reception Window</span>
              </p>
            </div>

            {/* Spec 3: Venue Location & Map */}
            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#DFB15B]" />
                  Venue & Coordinates
                </span>
                {event.location && (
                  <button
                    onClick={copyLocation}
                    className="text-[10px] text-[#DFB15B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy Address
                  </button>
                )}
              </div>
              <p className="mt-3 font-medium text-base text-[#FAF8F5]">
                {event.location || "Venue Under Private Curation"}
              </p>
              {event.location ? (
                <div className="mt-3">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#DFB15B] hover:text-[#E8C87E] transition-colors"
                  >
                    View on Satellite Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#9E9685]">
                  Our AI Concierge can suggest estate venues based on your theme.
                </p>
              )}
            </div>

            {/* Spec 4: Atelier Notes & Vision */}
            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#DFB15B]" />
                Atelier Executive Notes
              </span>
              <p className="mt-3 text-xs sm:text-sm text-[#D6D0C2] leading-relaxed italic border-l-2 border-[#DFB15B]/50 pl-3">
                &ldquo;{event.notes || "No special directives logged. Everything calibrated according to haute etiquette."}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Hospitality & Seating Experience */}
        {activeTab === "hospitality" && (
          <div
            className="mt-6 grid gap-6 sm:grid-cols-3 animate-fade-up"
          >
            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] mb-3">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685]">
                Confirmed Guest Roster
              </span>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#FAF8F5]">
                {event.guestCount || 0}
              </p>
              <p className="mt-1 text-xs text-[#9E9685]">VIP & Patron Invites</p>
            </div>

            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] mb-3">
                <Utensils className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685]">
                Table & Floor Layout
              </span>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#FAF8F5]">
                ~{tablesCount}
              </p>
              <p className="mt-1 text-xs text-[#9E9685]">Banqueting Rounds (10-top)</p>
            </div>

            <div className="rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-5 backdrop-blur-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] mb-3">
                <Wine className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9685]">
                Hospitality Ratio
              </span>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#FAF8F5]">
                1 : 12
              </p>
              <p className="mt-1 text-xs text-[#9E9685]">Server-to-guest luxury standard</p>
            </div>
          </div>
        )}

        {/* Tab 3: Urgent Upcoming Milestones Radar */}
        {activeTab === "milestones" && (
          <div
            className="mt-6 space-y-3 animate-fade-up"
          >
            {pendingTasks.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-[rgba(197,160,89,0.15)] bg-[#14141A]/60">
                <CheckCircle2 className="h-8 w-8 text-[#DFB15B] mx-auto mb-2" />
                <p className="text-sm text-[#FAF8F5] font-medium">All Milestones Up-to-Date</p>
                <p className="text-xs text-[#9E9685] mt-1">Outstanding tasks have been successfully concluded.</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-[rgba(197,160,89,0.18)] bg-[#14141A]/80 p-4 transition-all hover:border-[#DFB15B]/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#DFB15B]/40 bg-[#DFB15B]/10 text-[#DFB15B] text-xs">
                      <Clock className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#FAF8F5]">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-[#9E9685] line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-0.5 text-[10px] text-[#DFB15B] uppercase tracking-wider">
                      {task.dueDate ? `${daysUntil(task.dueDate)}d left` : "Priority Task"}
                    </span>
                    <Link
                      href={`/events/${event.id}/timeline`}
                      className="text-xs text-[#DFB15B] hover:underline"
                    >
                      Resolve
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
