"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A1F] border border-[rgba(197,160,89,0.2)]",
        className,
      )}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFB15B] shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-all duration-500"
        style={{ transform: `translateX(-${100 - Math.min(100, value)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
