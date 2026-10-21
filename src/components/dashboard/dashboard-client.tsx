"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Sparkles,
  Crown,
  Calendar,
  DollarSign,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  MapPin,
  Users,
  Copy,
  LayoutGrid,
  List,
  Flame,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, daysUntil } from "@/lib/utils";
import type { Event } from "@/db/schema";
import { CountdownSpotlight } from "@/components/dashboard/countdown-spotlight";

interface DashboardClientProps {
  events: Event[];
  spentMap: Record<string, number>;
  userName: string;
  aiConfigured: boolean;
}

const LUXURY_PRESETS = [
  {
    title: "Lake Como Villa Reception",
    type: "wedding",
    budget: 85000,
    guests: 120,
    theme: "Bellagio Champagne & Ivy",
    location: "Lake Como, Italy",
    tag: "Italian Riviera",
  },
  {
    title: "Monaco Casino Royale Gala",
    type: "community",
    budget: 150000,
    guests: 200,
    theme: "Black Tie Noir & Gold Foil",
    location: "Monte Carlo, Monaco",
    tag: "Society Gala",
  },
  {
    title: "Tuscan Sunset Vineyard Vows",
    type: "wedding",
    budget: 48000,
    guests: 90,
    theme: "Rustic Olive & Terracotta Luxe",
    location: "Val d'Orcia, Tuscany",
    tag: "Estate Romance",
  },
  {
    title: "Kyoto Royal Garden Pavilion",
    type: "birthday",
    budget: 65000,
    guests: 80,
    theme: "Minimalist Gold Leaf & Cedar",
    location: "Kyoto, Japan",
    tag: "Zen Milestone",
  },
];

export function DashboardClient({ events, spentMap, userName, aiConfigured }: DashboardClientProps) {
  const router = useRouter();
  const [now] = useState(() => Date.now());

  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc" | "budget-desc" | "title">("date-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // New Feature: AI Quick Vision State
  const [customVision, setCustomVision] = useState("");

  // Compute nearest upcoming event
  const nearestUpcoming = useMemo(() => {
    const upcoming = events
      .filter((e) => new Date(e.eventDate).getTime() >= now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    return upcoming[0] || events[0] || null;
  }, [events, now]);

  // Portfolio Totals
  const totalBudget = useMemo(
    () => events.reduce((acc, curr) => acc + (curr.budgetTotalCents || 0), 0),
    [events],
  );

  const totalSpent = useMemo(
    () => events.reduce((acc, curr) => acc + (spentMap[curr.id] || 0), 0),
    [events, spentMap],
  );

  const totalGuests = useMemo(
    () => events.reduce((acc, curr) => acc + (curr.guestCount || 0), 0),
    [events],
  );

  // Filtered & Sorted events
  const filteredEvents = useMemo(() => {
    const list = events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.theme && e.theme.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "all" || e.type === selectedType;
      return matchesSearch && matchesType;
    });

    list.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
      if (sortBy === "date-desc") {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      }
      if (sortBy === "budget-desc") {
        return (b.budgetTotalCents || 0) - (a.budgetTotalCents || 0);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [events, searchQuery, selectedType, sortBy]);

  function launchVision(preset: typeof LUXURY_PRESETS[0]) {
    const params = new URLSearchParams({
      title: preset.title,
      type: preset.type,
      budget: String(preset.budget),
      guests: String(preset.guests),
      theme: preset.theme,
      location: preset.location,
    });
    router.push(`/events/new?${params.toString()}`);
  }

  function launchCustomVision() {
    if (!customVision.trim()) {
      toast.error("Please enter your event vision first");
      return;
    }
    const params = new URLSearchParams({
      title: customVision.slice(0, 48),
      notes: customVision,
      type: "wedding",
      budget: "60000",
      guests: "120",
      theme: "Bespoke Haute Elegance",
    });
    router.push(`/events/new?${params.toString()}`);
  }

  async function copyExecutiveSummary() {
    if (events.length === 0) {
      toast.error("No events to summarize yet");
      return;
    }
    const lines = [
      `🏛️ GATHERLY EXECUTIVE EVENT PORTFOLIO`,
      `Client / Host: ${userName}`,
      `Total Orchestrated Budget: ${formatCurrency(totalBudget)}`,
      `Total Spent / Committed: ${formatCurrency(totalSpent)}`,
      `Total Guest Count: ${totalGuests.toLocaleString()}`,
      `Events Count: ${events.length}`,
      ``,
      ...events.map(
        (e, i) =>
          `${i + 1}. ${e.title} (${format(new Date(e.eventDate), "MMM d, yyyy")}) — Budget: ${formatCurrency(e.budgetTotalCents)} | Location: ${e.location || "TBD"}`,
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Executive portfolio summary copied to clipboard!");
    } catch {
      toast.error("Unable to access the clipboard. Check browser permissions.");
    }
  }

  return (
    <div className="space-y-12">
      {/* Top Hero Atelier Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(197,160,89,0.25)] bg-gradient-to-b from-[#131318] via-[#0E0E12] to-[#0A0A0E] p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Ambient Gold Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(223,177,91,0.12)_0%,transparent_70%)] blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)] blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-[#E8C87E] uppercase shadow-[0_0_12px_rgba(197,160,89,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DFB15B] animate-ping" />
                Atelier Workspace
              </span>
              <span className="text-xs text-[#9E9685]">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl tracking-wide text-[#FAF8F5]">
              Welcome back, <span className="gold-gradient-text">{userName}</span>
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-[#D6D0C2] leading-relaxed">
              Your bespoke event portfolio is synchronized. Monitor budgets, review timeline milestones, and consult the AI copilot for immediate orchestration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={copyExecutiveSummary}
              className="border-[#C5A059]/30 text-[#FAF8F5] hover:border-[#DFB15B] hover:text-[#DFB15B] transition-all cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              Copy Summary
            </Button>

            <Button asChild size="default" className="cursor-pointer shadow-[0_0_24px_rgba(212,175,55,0.3)]">
              <Link href="/events/new">
                <Sparkles className="h-4 w-4" />
                Orchestrate New Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Executive KPI Ribbon */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-[rgba(197,160,89,0.15)] pt-8 sm:grid-cols-4">
          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#141419]/80 p-4 backdrop-blur-md transition-all hover:border-[#C5A059]/40">
            <div className="flex items-center justify-between text-xs text-[#9E9685]">
              <span className="uppercase tracking-widest text-[10px]">Portfolio Budget</span>
              <DollarSign className="h-4 w-4 text-[#DFB15B]" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5]">
              {formatCurrency(totalBudget)}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#A89F8E]">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span className="text-[#DFB15B]">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#141419]/80 p-4 backdrop-blur-md transition-all hover:border-[#C5A059]/40">
            <div className="flex items-center justify-between text-xs text-[#9E9685]">
              <span className="uppercase tracking-widest text-[10px]">Curated Events</span>
              <Layers className="h-4 w-4 text-[#DFB15B]" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5]">
              {events.length}
            </p>
            <p className="mt-2 text-[11px] text-[#A89F8E]">
              {events.filter((e) => e.type === "wedding").length} Weddings · {events.filter((e) => e.type === "community").length} Galas
            </p>
          </div>

          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#141419]/80 p-4 backdrop-blur-md transition-all hover:border-[#C5A059]/40">
            <div className="flex items-center justify-between text-xs text-[#9E9685]">
              <span className="uppercase tracking-widest text-[10px]">Expected Guests</span>
              <Users className="h-4 w-4 text-[#DFB15B]" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5]">
              {totalGuests.toLocaleString()}
            </p>
            <p className="mt-2 text-[11px] text-[#A89F8E]">Across all active affairs</p>
          </div>

          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#141419]/80 p-4 backdrop-blur-md transition-all hover:border-[#C5A059]/40">
            <div className="flex items-center justify-between text-xs text-[#9E9685]">
              <span className="uppercase tracking-widest text-[10px]">AI Copilot Engine</span>
              <Sparkles className="h-4 w-4 text-[#DFB15B]" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${aiConfigured ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400"}`} />
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5]">
                {aiConfigured ? "Active" : "Unavailable"}
              </p>
            </div>
            <p className="mt-2 text-[11px] text-[#A89F8E]">
              {aiConfigured ? "AI provider configured" : "Using event planning templates"}
            </p>
          </div>
        </div>

        {/* Portfolio Detailing & Intelligence Drawer */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[rgba(197,160,89,0.12)] pt-5">
          <div className="flex items-center gap-3 rounded-lg bg-[#0C0C10]/60 px-3.5 py-2.5 border border-[rgba(197,160,89,0.1)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#9E9685]">Average Per Guest</p>
              <p className="text-xs font-semibold text-[#FAF8F5]">
                {totalGuests > 0 ? formatCurrency(Math.round(totalBudget / totalGuests)) : "$0"} / patron
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#0C0C10]/60 px-3.5 py-2.5 border border-[rgba(197,160,89,0.1)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] text-xs">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#9E9685]">Reserve Liquidity</p>
              <p className="text-xs font-semibold text-[#E8C87E]">
                {formatCurrency(Math.max(0, totalBudget - totalSpent))} Unallocated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#0C0C10]/60 px-3.5 py-2.5 border border-[rgba(197,160,89,0.1)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFB15B]/10 text-[#DFB15B] text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#9E9685]">Planning Velocity</p>
              <p className="text-xs font-semibold text-emerald-400">
                100% Architecture Integrity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE A: Spotlight Upcoming Event with Live Animated Countdown */}
      {nearestUpcoming && <CountdownSpotlight event={nearestUpcoming} />}

      {/* FEATURE B: Bespoke AI Vision Studio & Preset Vault */}
      <div className="rounded-3xl border border-[rgba(197,160,89,0.25)] bg-[#111116]/90 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#DFB15B]" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059]">
                AI Vision Studio
              </p>
            </div>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#FAF8F5]">
              Instant Event Vision & Presets
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#9E9685]">
              Choose a signature high-society template or describe your customized affair to jumpstart the AI orchestrator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="border-[#C5A059]/40 bg-[#C5A059]/10 text-[#E8C87E]">
              1-Click Orchestration
            </Badge>
          </div>
        </div>

        {/* Custom Prompt Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9685]" />
            <Input
              aria-label="Describe your event vision"
              value={customVision}
              onChange={(e) => setCustomVision(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && launchCustomVision()}
              placeholder="e.g. Candlelit Venetian palace celebration for 140 guests with chamber orchestra & champagne tower..."
              className="pl-10 h-11 border-[rgba(197,160,89,0.25)] bg-[#0A0A0D] text-[#FAF8F5] placeholder:text-[#6C6558] focus-visible:border-[#DFB15B]"
            />
          </div>
          <Button
            onClick={launchCustomVision}
            size="default"
            className="h-11 px-6 whitespace-nowrap cursor-pointer shadow-[0_0_15px_rgba(197,160,89,0.2)]"
          >
            <Sparkles className="h-4 w-4" />
            Orchestrate Vision
          </Button>
        </div>

        {/* Signature Presets Carousel */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LUXURY_PRESETS.map((preset) => (
            <div
              key={preset.title}
              role="button"
              tabIndex={0}
              aria-label={`Orchestrate ${preset.title} preset`}
              onClick={() => launchVision(preset)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  launchVision(preset);
                }
              }}
              className="group cursor-pointer rounded-2xl border border-[rgba(197,160,89,0.2)] bg-[#15151B]/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#DFB15B]/60 hover:bg-[#1A1A22] hover:shadow-[0_8px_25px_rgba(197,160,89,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFB15B]"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-[#DFB15B] uppercase">
                  {preset.tag}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#9E9685] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#DFB15B]" />
              </div>

              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg text-[#FAF8F5] group-hover:text-[#DFB15B] transition-colors">
                {preset.title}
              </h3>

              <p className="mt-1 text-xs text-[#9E9685] flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#C5A059]" />
                {preset.location}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-[rgba(197,160,89,0.1)] pt-3 text-xs text-[#D6D0C2]">
                <span>{formatCurrency(preset.budget * 100)}</span>
                <span>{preset.guests} Guests</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Events Portfolio Section */}
      <div className="space-y-6">
        {/* Search, Filter & View Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#FAF8F5]">
              Curated Event Portfolio
            </h2>
            <p className="text-xs text-[#9E9685]">
              Showing {filteredEvents.length} of {events.length} planned affairs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9685]" />
              <Input
                aria-label="Search events by title, venue, or theme"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or venue..."
                className="pl-8.5 h-9 text-xs border-[rgba(197,160,89,0.2)] bg-[#111116] text-[#FAF8F5] placeholder:text-[#6C6558]"
              />
            </div>

            {/* Sort Selector */}
            <select
              aria-label="Sort events"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 rounded-md border border-[rgba(197,160,89,0.25)] bg-[#111116] px-3 text-xs text-[#FAF8F5] outline-none focus:border-[#DFB15B]"
            >
              <option value="date-asc">Date: Soonest First</option>
              <option value="date-desc">Date: Latest First</option>
              <option value="budget-desc">Budget: Highest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-md border border-[rgba(197,160,89,0.2)] bg-[#111116] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#C5A059]/25 text-[#DFB15B]"
                    : "text-[#9E9685] hover:text-[#FAF8F5]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-[#C5A059]/25 text-[#DFB15B]"
                    : "text-[#9E9685] hover:text-[#FAF8F5]"
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Affairs" },
            { id: "wedding", label: "Luxury Weddings" },
            { id: "community", label: "Society Galas" },
            { id: "birthday", label: "Milestones" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              aria-pressed={selectedType === pill.id}
              onClick={() => setSelectedType(pill.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all cursor-pointer ${
                selectedType === pill.id
                  ? "border border-[#DFB15B] bg-[#DFB15B]/15 text-[#FAF8F5] shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                  : "border border-[rgba(197,160,89,0.15)] bg-[#111116]/60 text-[#9E9685] hover:border-[#C5A059]/40 hover:text-[#FAF8F5]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Events Display */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-[rgba(197,160,89,0.2)] bg-[#111116]/60 px-6 py-20 text-center backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl text-[#FAF8F5]">
              {events.length === 0 ? "No Curated Events In Portfolio" : "No Matching Affairs Found"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#9E9685]">
              {events.length === 0
                ? "Begin orchestrating your bespoke luxury wedding, gala, or milestone celebration with our automated AI engine."
                : "Try adjusting your search criteria or filter tags."}
            </p>
            {events.length === 0 && (
              <Button asChild className="mt-8">
                <Link href="/events/new">Orchestrate Your First Event</Link>
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const spent = spentMap[event.id] ?? 0;
              const days = daysUntil(event.eventDate);
              const budgetPct =
                event.budgetTotalCents > 0
                  ? Math.min(100, Math.round((spent / event.budgetTotalCents) * 100))
                  : 0;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#121217]/90 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#DFB15B]/70 hover:shadow-[0_12px_35px_rgba(197,160,89,0.2)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full border border-[#C5A059]/35 bg-[#C5A059]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#E8C87E] uppercase">
                        {event.type}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#DFB15B]">
                          {days >= 0 ? `${days}d left` : "Concluded"}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[#FAF8F5] group-hover:text-[#DFB15B] transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-[#9E9685] flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-[#C5A059]" />
                      {format(new Date(event.eventDate), "MMMM d, yyyy")}
                    </p>

                    {event.location && (
                      <p className="mt-1 text-xs text-[#9E9685] flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-[#C5A059]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </p>
                    )}

                    {event.theme && (
                      <p className="mt-2 text-[11px] text-[#A89F8E] italic line-clamp-1">
                        &ldquo;{event.theme}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-[rgba(197,160,89,0.15)] pt-4">
                    <div className="mb-2 flex justify-between text-xs text-[#D6D0C2]">
                      <span className="uppercase tracking-widest text-[10px] text-[#9E9685]">
                        Budget Allocation
                      </span>
                      <span>
                        {formatCurrency(spent)} / {formatCurrency(event.budgetTotalCents)}
                      </span>
                    </div>
                    <Progress value={budgetPct} className="h-2" />
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#9E9685]">
                      <span>{event.guestCount || 0} Guests</span>
                      <span className="group-hover:text-[#DFB15B] flex items-center gap-1 transition-colors">
                        Enter Atelier <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const spent = spentMap[event.id] ?? 0;
              const days = daysUntil(event.eventDate);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[rgba(197,160,89,0.2)] bg-[#121217]/90 p-4 transition-all duration-200 hover:border-[#DFB15B]/60 hover:bg-[#16161D]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B]">
                      <Crown className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-[family-name:var(--font-display)] text-lg text-[#FAF8F5] group-hover:text-[#DFB15B] transition-colors">
                          {event.title}
                        </h3>
                        <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#E8C87E]">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#9E9685] flex items-center gap-2 mt-0.5">
                        <span>{format(new Date(event.eventDate), "MMM d, yyyy")}</span>
                        {event.location && <span>· {event.location}</span>}
                        <span>· {event.guestCount} Guests</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#FAF8F5]">
                        {formatCurrency(spent)} / {formatCurrency(event.budgetTotalCents)}
                      </p>
                      <p className="text-[10px] text-[#9E9685] uppercase tracking-wider">
                        {days >= 0 ? `${days} Days Countdown` : "Concluded"}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      Manage <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
