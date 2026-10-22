import Link from "next/link";
import {
  CalendarDays,
  ListChecks,
  Sparkles,
  Wallet,
  Crown,
  ChevronRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { InteractiveCalculator } from "@/components/home/interactive-calculator";
import { EventTemplates } from "@/components/home/event-templates";
import { TimelinePreview } from "@/components/home/timeline-preview";

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="space-y-24 sm:space-y-32 pb-24">
        {/* Hero Section */}
        <section className="hero-plane relative overflow-hidden border-b border-[rgba(197,160,89,0.2)]">
          <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
            <div className="animate-fade-up flex items-center gap-2">
              <span className="h-px w-8 bg-[#C5A059]" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#C5A059]">
                Haute Couture Event Atelier
              </span>
              <span className="h-px w-8 bg-[#C5A059]" />
            </div>

            <p className="animate-fade-up mt-6 font-[family-name:var(--font-display)] text-5xl font-normal tracking-tight text-[#FCFBF7] sm:text-7xl md:text-8xl">
              Plan with <span className="italic font-light text-[#DFB15B]">clarity</span>
            </p>

            <h1 className="animate-fade-up-delay mt-6 max-w-2xl text-xl font-light leading-relaxed text-[#DCD4C3] sm:text-2xl">
              Plan weddings, celebrations, and community events in one organized workspace.
            </h1>

            <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[#948B79]">
              Track budgets, timeline tasks, vendors, and event details. Optional AI assistance can help draft plans and ideas when configured.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  <Crown className="h-4 w-4" />
                  Start planning
                </Link>
              </Button>
              <a
                href="#interactive-calculator"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#DFB15B] hover:text-[#FCFBF7] transition-colors px-2 py-3"
              >
                <span>Try the budget estimate</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Spec Highlights */}
            <div className="mt-14 pt-8 border-t border-[rgba(197,160,89,0.15)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#948B79]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
                <span>Budget tracking in cents</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#DFB15B]" />
                <span>Optional AI assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#C5A059]" />
                <span>Reorderable timeline tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#DFB15B]" />
                <span>Three event starter templates</span>
              </div>
            </div>

            <div className="animate-soft-pulse pointer-events-none absolute -right-16 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-2xl" />
          </div>
        </section>

        {/* Example budget estimator */}
        <section id="interactive-calculator" className="mx-auto max-w-6xl px-4 sm:px-6">
          <InteractiveCalculator />
        </section>

        {/* Built-in event starter templates */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <EventTemplates />
        </section>

        {/* Pillars Section: The Atelier Suite */}
        <section className="border-y border-[rgba(197,160,89,0.2)] bg-[#0C0C0F]/90 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
                  The Atelier Suite
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#FCFBF7]">
                  Precision Meets Opulence
                </h2>
              </div>
              <p className="max-w-md text-sm text-[#948B79]">
                Keep the details of an event together, from the first estimate to the final task.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Wallet,
                  title: "Budget tracking",
                  copy: "Organize planned categories and compare estimated amounts with actual costs.",
                },
                {
                  icon: CalendarDays,
                  title: "Planning timeline",
                  copy: "Organize tasks by due date, set milestones, and reorder the checklist as plans change.",
                },
                {
                  icon: ListChecks,
                  title: "Vendor tracking",
                  copy: "Keep vendor names, contact details, notes, and booking status together.",
                },
                {
                  icon: Sparkles,
                  title: "AI-assisted planning",
                  copy: "Generate a starter plan or ask event-aware questions when an AI provider is configured. Built-in templates remain available.",
                },
              ].map((f) => (
                <div key={f.title} className="p-6 rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 transition-all hover:border-[#C5A059]/40 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFB15B]">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#948B79]">{f.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <TimelinePreview />
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-4 pt-12 text-center text-xs text-[#948B79] sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-[#C5A059]/30" />
            <span className="font-[family-name:var(--font-display)] text-lg text-[#C5A059]">GATHERLY ATELIER</span>
            <span className="h-px w-12 bg-[#C5A059]/30" />
          </div>
          <p>© 2026 Gatherly · Event planning workspace</p>
          <p className="mt-1 text-[11px] text-[#706859]">Plan · Budget · Coordinate</p>
        </footer>
      </main>
    </div>
  );
}
