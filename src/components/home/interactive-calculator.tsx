"use client";

import { useState } from "react";
import {
  Users,
  Sparkles,
  UtensilsCrossed,
  Crown,
  Building2,
  Flower2,
} from "lucide-react";

export function InteractiveCalculator() {
  const [guests, setGuests] = useState<number>(140);
  const [budgetInput, setBudgetInput] = useState("35000");
  const parsedBudget = Number(budgetInput);
  const totalBudget =
    Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : 0;

  // Category distributions
  const categories = [
    { name: "Venue", percent: 35, icon: Building2 },
    { name: "Food and drinks", percent: 30, icon: UtensilsCrossed },
    { name: "Flowers and decor", percent: 14, icon: Flower2 },
    { name: "Attire", percent: 12, icon: Crown },
    { name: "Production and entertainment", percent: 9, icon: Sparkles },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(197,160,89,0.3)] bg-gradient-to-b from-[#141419]/90 to-[#0A0A0D]/95 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.1)_0%,transparent_70%)] blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(197,160,89,0.2)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C5A059]">
              Example budget estimate
            </span>
          </div>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#FCFBF7]">
            Estimate a starting budget
          </h2>
          <p className="mt-1 text-xs text-[#948B79]">
            Enter your own budget and guest count. The category amounts are an illustrative split, not vendor quotes.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Guest slider */}
          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#17171C]/70 p-5">
            <div className="flex items-center justify-between">
              <label htmlFor="guest-slider" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DCD4C3]">
                <Users className="h-4 w-4 text-[#C5A059]" />
                Guest count
              </label>
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#DFB15B]">
                {guests} <span className="text-xs font-sans font-normal text-[#948B79]">guests</span>
              </span>
            </div>

            <input
              id="guest-slider"
              type="range"
              min={30}
              max={450}
              step={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#25252D] accent-[#DFB15B]"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#948B79] uppercase tracking-wider">
              <span>30</span>
              <span>240</span>
              <span>450</span>
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#17171C]/70 p-5">
            <label
              htmlFor="budget-input"
              className="text-xs font-semibold uppercase tracking-wider text-[#DCD4C3]"
            >
              Overall budget (USD)
            </label>
            <div className="relative mt-3">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#948B79]">
                $
              </span>
              <input
                id="budget-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                onBlur={() => setBudgetInput(String(totalBudget))}
                className="h-11 w-full rounded-lg border border-[rgba(197,160,89,0.2)] bg-[#111116] pl-8 pr-3 text-sm text-[#FCFBF7] outline-none focus:border-[#DFB15B]"
              />
            </div>
            <p className="mt-2 text-[11px] text-[#948B79]">
              Change this amount to see an example category split.
            </p>
          </div>

        </div>

        {/* Right Column: Capital Breakdown & Grand Total */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-[rgba(197,160,89,0.25)] bg-[#15151B] p-6 sm:p-7 shadow-inner">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#948B79]">
              <span>Total budget (USD)</span>
            </div>

            {/* Grand Total Display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold tracking-tight text-[#FCFBF7]"
              >
                ${totalBudget.toLocaleString("en-US")}
              </span>
              <span className="text-xs text-[#C5A059] font-medium uppercase tracking-wider">
                {guests} guests
              </span>
            </div>

            {/* Allocation Breakdown bars */}
            <div className="mt-6 space-y-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#DCD4C3]">
                Example allocation
              </p>
              {categories.map((cat) => {
                const amount = Math.round((totalBudget * cat.percent) / 100);
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-[#DCD4C3]">
                        <cat.icon className="h-3.5 w-3.5 text-[#C5A059]" />
                        {cat.name}
                      </span>
                      <span className="font-semibold text-[#FCFBF7]">
                        ${amount.toLocaleString("en-US")}{" "}
                        <span className="text-[10px] text-[#948B79]">({cat.percent}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#202028]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#DFB15B] transition-all duration-500"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-8 border-t border-[rgba(197,160,89,0.2)] pt-5 text-xs leading-relaxed text-[#948B79]">
            The category percentages are examples only, not a recommended budget or a quote.
          </p>
        </div>
      </div>
    </div>
  );
}
