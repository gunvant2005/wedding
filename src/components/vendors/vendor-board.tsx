"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addVendorAction,
  deleteVendorAction,
  updateVendorStatusAction,
} from "@/lib/actions/vendors";
import type { VendorItem } from "@/db/schema";

const STATUSES = ["researching", "contacted", "booked", "paid"] as const;

export function VendorBoard({
  eventId,
  vendors,
}: {
  eventId: string;
  vendors: VendorItem[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");

  const grouped = useMemo(() => {
    const map = new Map<string, VendorItem[]>();
    for (const v of vendors) {
      const list = map.get(v.category) ?? [];
      list.push(v);
      map.set(v.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [vendors]);

  const booked = vendors.filter(
    (v) => v.status === "booked" || v.status === "paid",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[rgba(197,160,89,0.15)] pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
          Vendor Registry
        </p>
        <span className="text-xs text-[#948B79]">
          {booked} of {vendors.length} vendors contracted or paid
        </span>
      </div>

      <form
        className="flex flex-wrap gap-2 rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/80 p-4 backdrop-blur-md"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await addVendorAction(eventId, {
              name,
              category,
              status: "researching",
            });
            setName("");
            toast.success("Vendor added to registry");
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error");
          }
        }}
      >
        <Input
          placeholder="Vendor name (e.g. Atelier Champagne & Caviar)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Input
          placeholder="Category (e.g. Sommelier, Orchestra)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48"
        />
        <Button type="submit">Add Vendor</Button>
      </form>

      <div className="space-y-5">
        {grouped.map(([cat, list]) => (
          <div
            key={cat}
            className="rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/85 p-5 backdrop-blur-md"
          >
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
              {cat}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {list.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#101014] p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#FCFBF7]">{v.name}</p>
                    {(v.contactName || v.contactEmail || v.contactPhone) && (
                      <p className="text-xs text-[#948B79]">
                        {[v.contactName, v.contactEmail, v.contactPhone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      className="rounded border border-[rgba(197,160,89,0.3)] bg-[#141418] px-2.5 py-1 text-xs text-[#DFB15B] focus:outline-none"
                      value={v.status}
                      onChange={async (e) => {
                        await updateVendorStatusAction(
                          v.id,
                          e.target.value as VendorItem["status"],
                        );
                        router.refresh();
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-[#948B79] hover:text-red-400"
                      onClick={async () => {
                        await deleteVendorAction(v.id);
                        router.refresh();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
