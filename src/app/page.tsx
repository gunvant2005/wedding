import Link from "next/link";
import {
  CalendarDays,
  ListChecks,
  Sparkles,
  Wallet,
  Heart,
  Crown,
  Gem,
  Award,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero-plane relative overflow-hidden border-b border-[rgba(197,160,89,0.2)]">
          <div className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
            <div className="animate-fade-up flex items-center gap-2">
              <span className="h-px w-8 bg-[#C5A059]" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#C5A059]">
                Haute Couture Event Planning
              </span>
              <span className="h-px w-8 bg-[#C5A059]" />
            </div>

            <p className="animate-fade-up mt-6 font-[family-name:var(--font-display)] text-5xl font-normal tracking-tight text-[#FCFBF7] sm:text-7xl md:text-8xl">
              Curating <span className="italic font-light text-[#DFB15B]">Timeless</span> Vows
            </p>

            <h1 className="animate-fade-up-delay mt-6 max-w-2xl text-xl font-light leading-relaxed text-[#DCD4C3] sm:text-2xl">
              The premier digital atelier for high-end weddings, bespoke anniversaries, and grand celebrations.
            </h1>

            <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[#948B79]">
              Precision budget allocation, couture timeline orchestration, elite vendor curation, and an AI planner with the etiquette and finesse of a private luxury concierge.
            </p>

            <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  <Crown className="h-4 w-4" />
                  Begin Bespoke Plan
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-in">Atelier Sign In</Link>
              </Button>
            </div>

            <div className="animate-soft-pulse pointer-events-none absolute -right-16 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-2xl" />
          </div>
        </section>

        {/* Collection Showcase */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
              Exquisite Gatherings
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[#FCFBF7] sm:text-5xl">
              Crafted for Extraordinary Milestones
            </h2>
            <div className="gold-divider max-w-xs mx-auto">
              <Gem className="h-4 w-4 text-[#C5A059]" />
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Heart,
                badge: "Haute Couture",
                title: "Luxury Weddings",
                copy: "Multi-day celebrations, destination estates, opulent floral registries, and solemn ceremony runs.",
              },
              {
                icon: Crown,
                badge: "Grand Galas",
                title: "Bespoke Soirées",
                copy: "Private vineyard galas, black-tie milestone galas, fine-dining itineraries, and sommelier services.",
              },
              {
                icon: Award,
                badge: "Private Societies",
                title: "Exclusive Gatherings",
                copy: "Private club gatherings, charity balls, high-society banquets, and VIP concierge logistics.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="luxury-card p-8 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="h-8 w-8 text-[#C5A059] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#948B79]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7] group-hover:text-[#DFB15B] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#948B79]">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Section */}
        <section className="border-y border-[rgba(197,160,89,0.2)] bg-[#0C0C0F]/90 py-24">
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
                Every detail orchestrated in single harmony — from the first floral tasting to the midnight departure.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Wallet,
                  title: "Grand Budgets",
                  copy: "Visual allocations, payment schedules, luxury tier limits, and live spend analytics.",
                },
                {
                  icon: CalendarDays,
                  title: "Couture Timelines",
                  copy: "Drag-and-drop chronological sequencing with custom milestone alerts and rehearsals.",
                },
                {
                  icon: ListChecks,
                  title: "Vendor Registry",
                  copy: "Couture florists, Michelin-starred caterers, orchestra, and photographer contracts.",
                },
                {
                  icon: Sparkles,
                  title: "AI Concierge",
                  copy: "Trained on high-society etiquette, seating charts, and personalized bespoke ideas.",
                },
              ].map((f) => (
                <div key={f.title} className="p-6 rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#121216]/60">
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

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-4 py-12 text-center text-xs text-[#948B79] sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-[#C5A059]/30" />
            <span className="font-[family-name:var(--font-display)] text-lg text-[#C5A059]">GATHERLY ATELIER</span>
            <span className="h-px w-12 bg-[#C5A059]/30" />
          </div>
          <p>© 2026 Gatherly Atelier · Luxury Wedding & Celebration Planning Architecture</p>
        </footer>
      </main>
    </div>
  );
}
