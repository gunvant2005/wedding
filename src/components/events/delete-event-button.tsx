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
          const res = await deleteEventAction(eventId);
          if (!res.success) {
            throw new Error(res.error || "Could not delete event");
          }
          toast.success("Event deleted");
          router.push("/dashboard");
          router.refresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not delete event");
        }
      }}
    >
      Delete event
    </Button>
  );
}
