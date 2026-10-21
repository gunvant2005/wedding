"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Flame, MapPin, DollarSign, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Event } from "@/db/schema";

interface CountdownSpotlightProps {
  event: Event;
}

export function CountdownSpotlight({ event }: CountdownSpotlightProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(event.eventDate).getTime();

    function updateTimer() {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event.eventDate]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#C5A059]/35 bg-gradient-to-r from-[#15151B] via-[#101014] to-[#15151B] p-6 sm:p-8 shadow-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#DFB15B]/60 to-transparent" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#DFB15B]/15 text-[#E8C87E] border-[#DFB15B]/30">
              <Flame className="h-3 w-3 mr-1 text-[#DFB15B]" />
              Next Upcoming Highlight
            </Badge>
            <span className="text-xs text-[#9E9685]">
              {format(new Date(event.eventDate), "MMMM d, yyyy")}
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#FAF8F5]">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#D6D0C2]">
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#DFB15B]" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#DFB15B]" />
              Budget: {formatCurrency(event.budgetTotalCents)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#DFB15B]" />
              {event.guestCount} Guests
            </span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 sm:gap-4" role="timer" aria-label="Time remaining until event">
          <div className="flex flex-col items-center rounded-2xl border border-[#C5A059]/30 bg-[#0A0A0D]/90 p-3 sm:p-4 min-w-[64px] sm:min-w-[76px] text-center shadow-lg">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#9E9685] mt-1">Days</span>
          </div>
          <div aria-hidden="true" className="text-xl font-bold text-[#C5A059]">:</div>
          <div className="flex flex-col items-center rounded-2xl border border-[#C5A059]/30 bg-[#0A0A0D]/90 p-3 sm:p-4 min-w-[64px] sm:min-w-[76px] text-center shadow-lg">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#9E9685] mt-1">Hours</span>
          </div>
          <div aria-hidden="true" className="text-xl font-bold text-[#C5A059]">:</div>
          <div className="flex flex-col items-center rounded-2xl border border-[#C5A059]/30 bg-[#0A0A0D]/90 p-3 sm:p-4 min-w-[64px] sm:min-w-[76px] text-center shadow-lg">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#9E9685] mt-1">Mins</span>
          </div>
          <div aria-hidden="true" className="text-xl font-bold text-[#C5A059]">:</div>
          <div className="flex flex-col items-center rounded-2xl border border-[#C5A059]/30 bg-[#0A0A0D]/90 p-3 sm:p-4 min-w-[64px] sm:min-w-[76px] text-center shadow-lg">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#DFB15B]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#DFB15B] mt-1">Secs</span>
          </div>

          <Button asChild size="default" className="ml-2 hidden sm:inline-flex">
            <Link href={`/events/${event.id}`}>
              Manage Event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
