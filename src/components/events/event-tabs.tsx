"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "", label: "Overview" },
  { href: "/budget", label: "Budget" },
  { href: "/timeline", label: "Timeline" },
  { href: "/vendors", label: "Vendors" },
  { href: "/assistant", label: "AI Concierge" },
];

export function EventTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const base = `/events/${eventId}`;

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-[rgba(197,160,89,0.2)] pt-2">
      {tabs.map((tab) => {
        const href = `${base}${tab.href}`;
        const active =
          tab.href === ""
            ? pathname === base
            : pathname.startsWith(href);
        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              "whitespace-nowrap px-5 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200",
              active
                ? "border-b-2 border-[#C5A059] text-[#DFB15B]"
                : "text-[#948B79] hover:text-[#FCFBF7]",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
