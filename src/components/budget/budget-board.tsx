"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addBudgetCategoryAction,
  addBudgetItemAction,
  deleteBudgetCategoryAction,
  deleteBudgetItemAction,
} from "@/lib/actions/budget";
import { centsToDollars, dollarsToCents, formatCurrency } from "@/lib/utils";
import type { BudgetCategory, BudgetItem } from "@/db/schema";

const LUXURY_GOLD_PALETTE = [
  "#DFB15B",
  "#C5A059",
  "#9E7D3B",
  "#8C6D48",
  "#E8C87E",
  "#5A4432",
  "#B89758",
];

export function BudgetBoard({
  eventId,
  categories,
  items,
  budgetTotalCents,
}: {
  eventId: string;
  categories: BudgetCategory[];
  items: BudgetItem[];
  budgetTotalCents: number;
}) {
  const router = useRouter();
  const [catName, setCatName] = useState("");
  const [catAlloc, setCatAlloc] = useState(0);

  const itemsByCat = useMemo(() => {
    const map = new Map<string, BudgetItem[]>();
    for (const item of items) {
      const list = map.get(item.categoryId) ?? [];
      list.push(item);
      map.set(item.categoryId, list);
    }
    return map;
  }, [items]);

  const chartData = useMemo(() => {
    return categories.map((c) => ({
      name: c.name,
      value: centsToDollars(c.allocatedCents),
    }));
  }, [categories]);

  const allocatedTotal = categories.reduce((s, c) => s + c.allocatedCents, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/85 p-6 backdrop-blur-md">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7]">
            Allocation Overview
          </h2>
          <p className="mt-1 text-xs text-[#948B79]">
            Allocated {formatCurrency(allocatedTotal)} of{" "}
            {formatCurrency(budgetTotalCents)}
          </p>
          <div className="mt-4 h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    stroke="#141418"
                    strokeWidth={2}
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={LUXURY_GOLD_PALETTE[i % LUXURY_GOLD_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#18181C",
                      border: "1px solid rgba(197,160,89,0.4)",
                      borderRadius: "8px",
                      color: "#FCFBF7",
                    }}
                    formatter={(v) => formatCurrency(dollarsToCents(Number(v ?? 0)))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-xs text-[#948B79]">
                Add categories to view the luxury allocation breakdown
              </p>
            )}
          </div>
        </div>

        <form
          className="rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/85 p-6 backdrop-blur-md"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!catName.trim()) return;
            try {
              await addBudgetCategoryAction(eventId, {
                name: catName.trim(),
                allocatedCents: dollarsToCents(catAlloc),
              });
              setCatName("");
              setCatAlloc(0);
              toast.success("Category added");
              router.refresh();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Error");
            }
          }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7]">
            New Budget Category
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#948B79]">Category Name</label>
              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Couture Gown, Floral Installation"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#948B79]">Allocated Amount ($)</label>
              <Input
                type="number"
                min={0}
                value={catAlloc || ""}
                onChange={(e) => setCatAlloc(Number(e.target.value))}
                placeholder="5000"
              />
            </div>
            <Button type="submit" className="w-full">
              Add Category
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/80 p-5 backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(197,160,89,0.15)] pb-3">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#948B79]">
                  Allocated {formatCurrency(cat.allocatedCents)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await deleteBudgetCategoryAction(cat.id, eventId);
                  router.refresh();
                }}
              >
                Remove
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {(itemsByCat.get(cat.id) ?? []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[rgba(197,160,89,0.12)] bg-[#101014] px-4 py-2 text-sm"
                >
                  <span className="text-[#DCD4C3]">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#DFB15B]">
                      {formatCurrency(item.actualCents)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-[#948B79]"
                      onClick={async () => {
                        await deleteBudgetItemAction(item.id);
                        router.refresh();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex flex-wrap gap-2 pt-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const name = String(form.get("name") || "");
                const dollars = Number(form.get("dollars") || 0);
                if (!name.trim()) return;
                await addBudgetItemAction(eventId, {
                  categoryId: cat.id,
                  name: name.trim(),
                  actualCents: dollarsToCents(dollars),
                });
                (e.target as HTMLFormElement).reset();
                router.refresh();
              }}
            >
              <Input
                name="name"
                placeholder="Item name (e.g. Deposit)"
                className="h-8 flex-1 min-w-[160px] text-xs"
              />
              <Input
                name="dollars"
                type="number"
                min={0}
                placeholder="Cost ($)"
                className="h-8 w-28 text-xs"
              />
              <Button size="sm" type="submit">
                Add Item
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
