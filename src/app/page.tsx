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
  Star,
  ArrowRight,
  Heart,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { InteractiveCalculator } from "@/components/home/interactive-calculator";
import { EventTemplates } from "@/components/home/event-templates";
import { TimelinePreview } from "@/components/home/timeline-preview";

const FEATURES = [
  {
    icon: Wallet,
    title: "Budget tracking",
    copy: "Organize planned categories and compare estimated amounts with actual costs down to the cent.",
    color: "#C5A059",
  },
  {
    icon: CalendarDays,
    title: "Planning timeline",
    copy: "Organize tasks by due date, set milestones, and reorder the checklist as plans evolve.",
    color: "#DFB15B",
  },
  {
    icon: ListChecks,
    title: "Vendor tracking",
    copy: "Keep vendor names, contact details, notes, and booking status all in one place.",
    color: "#C5A059",
  },
  {
    icon: Sparkles,
    title: "AI-assisted planning",
    copy: "Generate a starter plan or ask event-aware questions when an AI provider is configured.",
    color: "#DFB15B",
  },
];

const STATS = [
  { value: "3", label: "Starter templates", suffix: "" },
  { value: "100+", label: "Timeline tasks", suffix: "" },
  { value: "5", label: "Budget categories", suffix: "+" },
  { value: "24/7", label: "AI availability", suffix: "" },
];

const TESTIMONIALS = [
  {
    quote: "Gatherly made our wedding planning feel effortless. The budget tracker alone saved us thousands.",
    author: "Priya & Arjun",
    event: "Garden Wedding · 180 guests",
  },
  {
    quote: "I planned our entire fundraiser gala in under an hour. The timeline templates are incredible.",
    author: "Marcus T.",
    event: "Community Fundraiser · 240 guests",
  },
  {
    quote: "The AI suggestions were spot-on. It felt like having a professional planner at my side.",
    author: "Sophia K.",
    event: "Birthday Celebration · 75 guests",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="pb-24">

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section
          className="hero-plane relative overflow-hidden border-b border-[rgba(197,160,89,0.2)]"
          aria-label="Hero"
        >
          {/* Floating particles */}
          <span
            className="particle h-2 w-2"
            style={
              {
                top: "18%",
                left: "12%",
                "--duration": "8s",
                "--delay": "0s",
              } as React.CSSProperties
            }
          />
          <span
            className="particle h-3 w-3"
            style={
              {
                top: "42%",
                left: "7%",
                "--duration": "11s",
                "--delay": "1.5s",
              } as React.CSSProperties
            }
          />
          <span
            className="particle h-1.5 w-1.5"
            style={
              {
                top: "65%",
                right: "10%",
                "--duration": "9s",
                "--delay": "3s",
              } as React.CSSProperties
            }
          />
          <span
            className="particle h-2.5 w-2.5"
            style={
              {
                top: "25%",
                right: "18%",
                "--duration": "13s",
                "--delay": "0.8s",
              } as React.CSSProperties
            }
          />
          <span
            className="particle h-2 w-2"
            style={
              {
                bottom: "20%",
                left: "22%",
                "--duration": "10s",
                "--delay": "2s",
              } as React.CSSProperties
            }
          />

          <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
            {/* Eyebrow */}
            <div className="animate-fade-up flex items-center gap-2">
              <span className="h-px w-8 bg-[#C5A059]" />
              <span className="badge-glow">
                <Star className="h-2.5 w-2.5" aria-hidden="true" />
                Haute Couture Event Atelier
              </span>
              <span className="h-px w-8 bg-[#C5A059]" />
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up mt-8 font-[family-name:var(--font-display)] text-5xl font-normal tracking-tight text-[#FCFBF7] sm:text-7xl md:text-8xl lg:text-[5.5rem]">
              Plan with{" "}
              <span className="shimmer-text italic font-light">clarity</span>
            </h1>

            <p className="animate-fade-up-delay mt-6 max-w-2xl text-xl font-light leading-relaxed text-[#DCD4C3] sm:text-2xl">
              Plan weddings, celebrations, and community events in one organized
              workspace.
            </p>

            <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[#948B79]">
              Track budgets, timeline tasks, vendors, and event details. Optional
              AI assistance can help draft plans and ideas when configured.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="group relative overflow-hidden">
                <Link href="/sign-up">
                  <Crown className="h-4 w-4" />
                  Start planning free
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <a
                href="#interactive-calculator"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#DFB15B] hover:text-[#FCFBF7] transition-colors px-2 py-3"
              >
                <span>Try the budget estimator</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick spec highlights */}
            <div className="mt-14 pt-8 border-t border-[rgba(197,160,89,0.15)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#948B79]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
                <span>Budget tracking in cents</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#DFB15B]" aria-hidden="true" />
                <span>Optional AI assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
                <span>Reorderable timeline tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#DFB15B]" aria-hidden="true" />
                <span>Three event starter templates</span>
              </div>
            </div>
          </div>

          {/* Ambient glow orb */}
          <div className="animate-soft-pulse pointer-events-none absolute -right-16 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute left-1/2 bottom-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
        </section>

        {/* ─── STATS BAND ───────────────────────────────────────────── */}
        <section
          className="border-b border-[rgba(197,160,89,0.15)] bg-[#0C0C0F]/90 py-10"
          aria-label="Platform statistics"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#948B79]">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-[#DFB15B]">
                    {stat.value}
                    <span className="text-xl text-[#C5A059]">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── BUDGET CALCULATOR ────────────────────────────────────── */}
        <section
          id="interactive-calculator"
          className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 sm:mt-32 scroll-mt-24"
        >
          <InteractiveCalculator />
        </section>

        {/* ─── EVENT TEMPLATES ──────────────────────────────────────── */}
        <section
          id="event-templates"
          className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 sm:mt-32 scroll-mt-24"
        >
          <EventTemplates />
        </section>

        {/* ─── FEATURE PILLARS ──────────────────────────────────────── */}
        <section
          className="border-y border-[rgba(197,160,89,0.2)] bg-[#0C0C0F]/90 mt-24 sm:mt-32 py-20"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
                  The Atelier Suite
                </p>
                <h2
                  id="features-heading"
                  className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#FCFBF7]"
                >
                  Precision Meets Opulence
                </h2>
              </div>
              <p className="max-w-md text-sm text-[#948B79]">
                Keep the details of an event together, from the first estimate to
                the final task.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group gradient-border p-6 rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60 transition-all duration-300 hover:bg-[#16161C]/80 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8),0_0_20px_-4px_rgba(197,160,89,0.12)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10 transition-all duration-300 group-hover:border-[#C5A059]/60 group-hover:bg-[#C5A059]/20 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.25)]"
                    style={{ color: f.color }}
                  >
                    <f.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[#FCFBF7] group-hover:text-[#DFB15B] transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#948B79] group-hover:text-[#B6AD9C] transition-colors">
                    {f.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TIMELINE PREVIEW ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 sm:mt-32">
          <TimelinePreview />
        </section>

        {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 sm:mt-32"
          aria-labelledby="testimonials-heading"
        >
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
              Loved by planners
            </p>
            <h2
              id="testimonials-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7] sm:text-4xl"
            >
              Stories from the Atelier
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.author}
                className="group rounded-2xl border border-[rgba(197,160,89,0.18)] bg-[#121216]/80 p-6 transition-all duration-300 hover:border-[#C5A059]/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7),0_0_20px_-4px_rgba(197,160,89,0.1)]"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#DFB15B] text-[#DFB15B]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-[#DCD4C3] italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-[rgba(197,160,89,0.12)]">
                  <p className="text-xs font-semibold text-[#DFB15B]">{t.author}</p>
                  <p className="mt-0.5 text-[10px] text-[#948B79] uppercase tracking-wider">
                    {t.event}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA BAND ───────────────────────────────────────── */}
        <section
          className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 sm:mt-32"
          aria-label="Call to action"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(197,160,89,0.3)] bg-gradient-to-br from-[#141419] via-[#101014] to-[#0A0A0D] p-10 sm:p-16 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* Ambient orbs */}
            <div className="pointer-events-none absolute -top-16 left-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.1)_0%,transparent_70%)] blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <span className="badge-glow">
                <Heart className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                Your perfect event awaits
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl text-[#FCFBF7]">
                Ready to start planning?
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-[#948B79]">
                Create your free account and start building your event plan in
                minutes. No credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    <Crown className="h-4 w-4" />
                    Create free account
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ───────────────────────────────────────────────── */}
        <footer className="mx-auto max-w-6xl px-4 sm:px-6 mt-24 pt-12 border-t border-[rgba(197,160,89,0.15)]">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 pb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B]">
                  <span className="font-[family-name:var(--font-display)] text-sm font-bold">G</span>
                </div>
                <span className="font-[family-name:var(--font-display)] text-lg tracking-wider text-[#FCFBF7]">
                  GATHERLY
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#706859]">
                A luxury event planning workspace for weddings, celebrations, and community gatherings.
              </p>
            </div>

            {/* Product links */}
            <nav aria-label="Product links">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
                Product
              </p>
              <ul className="space-y-2.5 text-xs text-[#948B79]">
                <li><a href="#interactive-calculator" className="hover:text-[#DFB15B] transition-colors">Budget Estimator</a></li>
                <li><a href="#event-templates" className="hover:text-[#DFB15B] transition-colors">Templates</a></li>
                <li><a href="#timeline-preview" className="hover:text-[#DFB15B] transition-colors">Timeline</a></li>
                <li><Link href="/sign-up" className="hover:text-[#DFB15B] transition-colors">Get Started</Link></li>
              </ul>
            </nav>

            {/* Account links */}
            <nav aria-label="Account links">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
                Account
              </p>
              <ul className="space-y-2.5 text-xs text-[#948B79]">
                <li><Link href="/sign-in" className="hover:text-[#DFB15B] transition-colors">Sign In</Link></li>
                <li><Link href="/sign-up" className="hover:text-[#DFB15B] transition-colors">Create Account</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#DFB15B] transition-colors">Dashboard</Link></li>
              </ul>
            </nav>

            {/* Event types */}
            <nav aria-label="Event types">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
                Events
              </p>
              <ul className="space-y-2.5 text-xs text-[#948B79]">
                <li><span>Weddings</span></li>
                <li><span>Birthday Celebrations</span></li>
                <li><span>Community Events</span></li>
                <li><span>Custom Gatherings</span></li>
              </ul>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[rgba(197,160,89,0.1)] text-xs text-[#706859]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A059]/30" />
              <span className="font-[family-name:var(--font-display)] text-sm text-[#C5A059]">
                GATHERLY ATELIER
              </span>
              <span className="h-px w-8 bg-[#C5A059]/30" />
            </div>
            <p>© 2026 Gatherly · Event planning workspace · Plan · Budget · Coordinate</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
