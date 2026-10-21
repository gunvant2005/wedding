import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(197,160,89,0.35)] bg-[#C5A059]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase text-[#E8C87E]",
        className,
      )}
      {...props}
    />
  );
}
