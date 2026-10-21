import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-3xl border border-[rgba(197,160,89,0.3)] bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(197,160,89,0.4)] bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_20px_rgba(197,160,89,0.2)]">
          <Compass className="h-7 w-7" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
          404 — Not Found
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#FCFBF7]">
          Uncharted Territory
        </h1>
        <p className="mt-3 text-xs text-[#B8B09F] leading-relaxed">
          The affair or resource you requested could not be located in our salon archives.
        </p>

        <div className="mt-6 flex justify-center">
          <Button asChild size="default">
            <Link href="/dashboard">
              Return to Salon Dashboard
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
