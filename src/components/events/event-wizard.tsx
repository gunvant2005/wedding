"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Sparkles, Crown, Heart, Award } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createEventAction } from "@/lib/actions/events";
import { dollarsToCents, formatCurrency } from "@/lib/utils";
import type { AiPlan } from "@/lib/validations/event";

const TYPES = [
  {
    id: "wedding",
    icon: Heart,
    title: "Luxury Wedding",
    blurb: "Multi-day celebrations, estate receptions, high-jewelry, and fine dining.",
  },
  {
    id: "birthday",
    icon: Crown,
    title: "Milestone Celebration",
    blurb: "Jubilees, private estate soirees, sommelier tastings, and private entertainment.",
  },
  {
    id: "community",
    icon: Award,
    title: "Grand Society Gala",
    blurb: "Black-tie charity banquets, royal galas, cultural patron evenings, and run-of-show logistics.",
  },
];

export function EventWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(() => (searchParams?.get("title") ? 1 : 0));
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [creating, setCreating] = useState(false);
  const [planSource, setPlanSource] = useState<"ai" | "template" | null>(null);
  const [plan, setPlan] = useState<AiPlan | null>(null);

  const [form, setForm] = useState(() => ({
    title: searchParams?.get("title") || "",
    type: ["wedding", "birthday", "community"].includes(searchParams?.get("type") || "")
      ? searchParams?.get("type") || "wedding"
      : "wedding",
    eventDate: format(new Date(Date.now() + 180 * 86400000), "yyyy-MM-dd"),
    location: searchParams?.get("location") || "",
    budgetDollars: Math.min(20_000_000, Math.max(0, Number(searchParams?.get("budget")) || 50000)),
    guestCount: Math.min(100_000, Math.max(0, Number(searchParams?.get("guests")) || 150)),
    theme: searchParams?.get("theme") || "Art Deco Champagne & Noir",
    notes: searchParams?.get("notes") || "",
  }));

  async function generatePlan() {
    setLoadingPlan(true);
    try {
      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budgetTotalCents: dollarsToCents(form.budgetDollars),
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as {
        plan: AiPlan;
        source: "ai" | "template";
      };
      setPlan(data.plan);
      setPlanSource(data.source);
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating plan");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleFinalCreate() {
    setCreating(true);
    try {
      const res = await createEventAction(
        {
          ...form,
          budgetTotalCents: dollarsToCents(form.budgetDollars),
        },
        plan ?? null,
      );

      if (!res.success) {
        throw new Error(res.error || "Creation failed");
      }

      toast.success("Bespoke event orchestrated");
      router.push(`/events/${res.data?.eventId}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      className="mx-auto max-w-2xl rounded-2xl border border-[rgba(197,160,89,0.3)] bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl"
      role="main"
      aria-labelledby="wizard-title"
    >
      <div className="mb-6 flex items-center justify-between border-b border-[rgba(197,160,89,0.18)] pb-4">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059]"
          aria-hidden="true"
        >
          Phase {step + 1} of 3
        </span>
        <span className="text-xs text-[#948B79]" role="status" aria-live="polite">
          {step === 0 && "Curated Format"}
          {step === 1 && "Atelier Specifications"}
          {step === 2 && "Plan Review"}
        </span>
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <h1
            id="wizard-title"
            className="font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7]"
          >
            Select Celebration Format
          </h1>
          <div className="grid gap-4" role="radiogroup" aria-label="Celebration format">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={form.type === t.id}
                onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                className={
                  form.type === t.id
                    ? "rounded-xl border border-[#C5A059] bg-[#C5A059]/15 p-5 text-left shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-all cursor-pointer ring-2 ring-[#C5A059]/50"
                    : "rounded-xl border border-[rgba(197,160,89,0.2)] bg-[#141418] p-5 text-left hover:border-[#C5A059]/50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
                }
              >
                <div className="flex items-center gap-3">
                  <t.icon className="h-5 w-5 text-[#DFB15B]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
                    {t.title}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#948B79]">{t.blurb}</p>
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => setStep(1)}
            aria-label="Continue to Specifications"
          >
            Continue to Specifications
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5" role="form" aria-labelledby="step-1-title">
          <h1
            id="step-1-title"
            className="font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7]"
          >
            Celebration Specifications
          </h1>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
              Celebration Title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Burkay & Eleonora Wedding Gala"
              aria-required="true"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
                Estate / Venue Location
              </Label>
              <Input
                id="loc"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Villa d'Este, Lake Como"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
                Estimated Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                min={100}
                value={form.budgetDollars}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    budgetDollars: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
                Guest Count
              </Label>
              <Input
                id="guests"
                type="number"
                min={1}
                value={form.guestCount}
                onChange={(e) => setForm((f) => ({ ...f, guestCount: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
              Design & Floral Palette
            </Label>
            <Input
              id="theme"
              value={form.theme}
              onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="e.g. Art Deco Gold & Ivory Velvet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
              Atelier Vision & Wishes
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Specific requests, dietary restrictions, musical repertoire..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(0)} aria-label="Go back to format selection">
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={
                !form.title.trim() ||
                !form.eventDate ||
                !Number.isFinite(form.budgetDollars) ||
                form.budgetDollars < 0 ||
                form.budgetDollars > 20_000_000 ||
                !Number.isInteger(form.guestCount) ||
                form.guestCount < 0 ||
                form.guestCount > 100_000 ||
                loadingPlan
              }
              onClick={generatePlan}
              aria-busy={loadingPlan}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {loadingPlan ? "Orchestrating Plan..." : "Generate AI Plan"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5" aria-labelledby="step-2-title">
          <h1
            id="step-2-title"
            className="font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7]"
          >
            Review & Orchestrate
          </h1>
          <div className="rounded-xl border border-[rgba(197,160,89,0.25)] bg-[#101014] p-4 text-xs">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">{form.title}</h2>
            <p className="mt-1 text-[#948B79]">
              {form.type} · {form.eventDate} · {formatCurrency(dollarsToCents(form.budgetDollars))} ·{" "}
              {form.guestCount} guests
            </p>
            {planSource && <Badge className="mt-2">Plan Source: {planSource.toUpperCase()}</Badge>}
          </div>

          {plan && (
            <div className="space-y-3 text-xs">
              <div
                className="rounded-xl border border-[rgba(197,160,89,0.18)] bg-[#101014] p-4"
                role="region"
                aria-label="Timeline Milestones"
              >
                <p className="font-semibold text-[#DFB15B]">
                  Couture Timeline ({plan.timelineTasks.length} Milestones)
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[#DCD4C3]">
                  {plan.timelineTasks
                    .slice(0, 6)
                    .map((t: { title: string; daysBeforeEvent: number }) => (
                      <li key={t.title}>
                        {t.title}{" "}
                        <span className="text-[#948B79]">({t.daysBeforeEvent}d prior)</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div
                className="rounded-xl border border-[rgba(197,160,89,0.18)] bg-[#101014] p-4"
                role="region"
                aria-label="Budget Allocations"
              >
                <p className="font-semibold text-[#DFB15B]">
                  Budget Allocations ({plan.budgetCategories.length} Categories)
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[#DCD4C3]">
                  {plan.budgetCategories.map((c: { name: string; percent: number }) => (
                    <li key={c.name}>
                      {c.name} — {c.percent}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} aria-label="Modify event specifications">
              Modify Specs
            </Button>
            <Button
              className="flex-1"
              disabled={creating}
              onClick={handleFinalCreate}
              aria-busy={creating}
            >
              {creating ? "Saving Atelier Event..." : "Launch Event Workspace"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
