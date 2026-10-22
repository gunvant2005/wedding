"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveIdeasAction } from "@/lib/actions/events";
import type { EventIdea } from "@/db/schema";

export function IdeasPanel({
  eventId,
  ideas,
}: {
  eventId: string;
  ideas: EventIdea[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function fetchIdeas() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { ideas: EventIdea[] };
      const saveRes = await saveIdeasAction(
        eventId,
        data.ideas.map((i) => ({
          title: i.title,
          description: i.description,
          categoryTag: i.categoryTag ?? undefined,
        })),
      );
      if (!saveRes.success) {
        throw new Error(saveRes.error || "Could not save ideas");
      }
      toast.success("Curated ideas generated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[rgba(197,160,89,0.22)] bg-[#141418]/85 p-6 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(197,160,89,0.15)] pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7]">
            Atelier Inspiration & Concepts
          </h2>
          <p className="text-xs text-[#948B79]">
            AI-generated creative motifs and bespoke details
          </p>
        </div>
        <Button onClick={fetchIdeas} disabled={loading} size="sm">
          <Sparkles className="h-3.5 w-3.5" />
          {loading ? "Composing..." : "Generate Concepts"}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {ideas.length === 0 ? (
          <p className="text-xs text-[#948B79] sm:col-span-2 py-6 text-center">
            No concepts recorded yet. Click &quot;Generate Concepts&quot; to prompt your private AI concierge.
          </p>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.title}
              className="rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#101014] p-4"
            >
              <h3 className="font-medium text-[#DFB15B]">{idea.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#DCD4C3]">
                {idea.description}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
