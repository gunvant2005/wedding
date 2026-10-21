import { z } from "zod";

export const chatRequestSchema = z.object({
  eventId: z.string().min(1).max(100),
  message: z.string().trim().min(1).max(4_000),
});