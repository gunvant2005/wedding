import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="page-shell flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B] shadow-[0_0_30px_rgba(197,160,89,0.25)] animate-soft-pulse">
          <Sparkles className="h-7 w-7 text-[#DFB15B]" />
        </div>
        <p className="font-[family-name:var(--font-display)] text-xl tracking-wider text-[#FCFBF7]">
          Gatherly Atelier
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] animate-pulse">
          Calibrating Bespoke Experience...
        </p>
      </div>
    </div>
  );
}
