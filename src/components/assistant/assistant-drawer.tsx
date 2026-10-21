"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/assistant/chat-panel";
import type { AiMessage } from "@/db/schema";

export function AssistantDrawer({
  eventId,
  initialMessages,
}: {
  eventId: string;
  initialMessages: AiMessage[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-40 shadow-lg"
        size="lg"
        onClick={() => setOpen(true)}
        aria-label="Open AI Planner Concierge"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <MessageCircle className="h-5 w-5" />
        Ask planner
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI Planner Concierge"
            className="flex h-full w-full max-w-md flex-col bg-[var(--surface)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <p className="font-semibold text-[#FCFBF7]">AI planner</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close AI Planner dialog"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <ChatPanel eventId={eventId} initialMessages={initialMessages} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
