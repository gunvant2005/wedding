"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-40 shadow-lg"
          size="lg"
          aria-label="Open AI Planner Concierge"
        >
          <MessageCircle className="h-5 w-5" />
          Ask planner
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--surface)] shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <Dialog.Title className="font-semibold text-[#FCFBF7]">
              AI planner
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Interactive AI event concierge to help coordinate wedding timeline, budget, and vendors.
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close AI Planner dialog">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <ChatPanel eventId={eventId} initialMessages={initialMessages} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
