"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/lib/actions/events";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={async () => {
        if (!confirm("Delete this event and all related data?")) return;
        try {
          await deleteEventAction(eventId);
          toast.success("Event deleted");
          router.push("/dashboard");
          router.refresh();
        } catch {
          toast.error("Could not delete event");
        }
      }}
    >
      Delete event
    </Button>
  );
}
