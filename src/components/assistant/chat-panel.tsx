"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import type { AiMessage } from "@/db/schema";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatPanel({
  eventId,
  initialMessages = [],
}: {
  eventId: string;
  initialMessages?: AiMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(
    initialMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const nextMessages: Msg[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, messages: nextMessages }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistant += decoder.decode(value, { stream: true });
          const snapshot = assistant;
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              role: "assistant",
              content: snapshot || "...",
            };
            return copy;
          });
        }
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[min(70vh,640px)] flex-col rounded-2xl border border-[rgba(197,160,89,0.25)] bg-[#141418]/90 backdrop-blur-xl">
      <div className="border-b border-[rgba(197,160,89,0.18)] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-[#FCFBF7]">
            Private AI Concierge
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#C5A059]">
            Context-Aware Wedding & Gala Etiquette
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-[#DFB15B]" />
      </div>

      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Concierge conversation history"
        className="flex-1 space-y-3.5 overflow-y-auto px-5 py-4"
      >
        {messages.length === 0 && (
          <div className="space-y-2 text-xs text-[#948B79] rounded-xl border border-[rgba(197,160,89,0.15)] bg-[#101014] p-4">
            <p className="font-semibold text-[#DFB15B]">Suggested inquiries for your Atelier Concierge:</p>
            <ul className="list-disc space-y-1 pl-4 text-[#DCD4C3]">
              <li>What milestones should be finalized 3 months prior?</li>
              <li>Recommend luxury floral themes pairing champagne gold with ivory</li>
              <li>Add a timeline milestone for couture dress fitting</li>
            </ul>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === "user"
                ? "ml-8 rounded-xl bg-gradient-to-r from-[#DFB15B] to-[#C5A059] px-4 py-2.5 text-xs text-[#09090B] font-medium shadow-[0_2px_12px_rgba(197,160,89,0.25)]"
                : "mr-8 rounded-xl bg-[#18181D] border border-[rgba(197,160,89,0.2)] px-4 py-3 text-xs leading-relaxed text-[#F6F3ED]"
            }
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="text-xs text-[#DFB15B] animate-soft-pulse italic">
            Composing concierge recommendation...
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="border-t border-[rgba(197,160,89,0.18)] p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your concierge about budgets, etiquette, or run-of-show..."
          className="min-h-[72px]"
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={loading || !input.trim()} size="sm">
            Send Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
