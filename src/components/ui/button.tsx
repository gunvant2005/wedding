import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#DFB15B] via-[#C5A059] to-[#AA833E] text-[#09090B] shadow-[0_4px_18px_rgba(197,160,89,0.25)] hover:shadow-[0_6px_26px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-[0.99]",
        secondary:
          "bg-[#1A1A1E] text-[#F6F3ED] border border-[rgba(197,160,89,0.3)] hover:bg-[#222228] hover:border-[#C5A059]",
        ghost:
          "text-[#DCD4C3] hover:text-[#FCFBF7] hover:bg-[#C5A059]/10",
        outline:
          "border border-[#C5A059]/40 bg-transparent text-[#DFB15B] hover:bg-[#C5A059]/15 hover:border-[#C5A059]",
        danger:
          "bg-red-950/80 text-red-200 border border-red-700/50 hover:bg-red-900",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded px-3 text-[11px]",
        lg: "h-12 rounded px-7 text-sm tracking-widest",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
