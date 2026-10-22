import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";
import { Sparkles, Crown } from "lucide-react";

type SessionResult = Awaited<ReturnType<typeof getSession>>;

export async function SiteHeader({
  session: propSession,
}: {
  session?: SessionResult | null;
} = {}) {
  const session = propSession !== undefined ? propSession : await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(197,160,89,0.2)] bg-[#09090B]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B] shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-all group-hover:border-[#C5A059] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold">G</span>
          </div>
          <div>
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-[#FCFBF7] group-hover:text-[#DFB15B] transition-colors">
              GATHERLY
            </span>
            <span className="block text-[9px] font-semibold tracking-[0.25em] text-[#C5A059] uppercase">
              Luxury Atelier
            </span>
          </div>
        </Link>

        {!session?.user && (
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#B6AD9C]">
            <Link href="/#interactive-calculator" className="hover:text-[#DFB15B] transition-colors">
              Estimator
            </Link>
            <Link href="/#event-templates" className="hover:text-[#DFB15B] transition-colors">
              Templates
            </Link>
            <Link href="/#timeline-preview" className="hover:text-[#DFB15B] transition-colors">
              Timeline
            </Link>
          </nav>
        )}

        <nav aria-label="User navigation" className="flex items-center gap-2 sm:gap-4">
          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/events/new">
                  <Sparkles className="h-3.5 w-3.5" />
                  New Event
                </Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">
                  <Crown className="h-3.5 w-3.5 mr-1" />
                  Create Account
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
