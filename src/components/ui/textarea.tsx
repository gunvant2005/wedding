import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[88px] w-full rounded-md border border-[rgba(197,160,89,0.25)] bg-[#121216]/90 px-3.5 py-2 text-sm text-[#FCFBF7] placeholder:text-[#8E8675] focus-visible:outline-none focus-visible:border-[#C5A059] focus-visible:ring-1 focus-visible:ring-[#C5A059]/60 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
