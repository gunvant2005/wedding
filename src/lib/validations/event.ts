import { z } from "zod";

export const eventTypeSchema = z.enum(["wedding", "birthday", "community"]);
export const eventStatusSchema = z.enum(["planning", "confirmed", "completed"]);
export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const vendorStatusSchema = z.enum([
  "researching",
  "contacted",
  "booked",
  "paid",
]);

export const createEventSchema = z.object({
  type: eventTypeSchema,
  title: z.string().min(2).max(120),
  eventDate: z.iso.date(),
  location: z.string().max(200).optional(),
  guestCount: z.coerce.number().int().min(0).max(100000).default(0),
  budgetTotalCents: z.coerce.number().int().min(0).max(2_000_000_000).default(0),
  theme: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  useAiPlan: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: eventStatusSchema.optional(),
});

export const budgetCategorySchema = z.object({
  name: z.string().min(1).max(80),
  allocatedCents: z.coerce.number().int().min(0).max(2_000_000_000),
});
export const updateBudgetCategorySchema = budgetCategorySchema.partial();

export const budgetItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(120),
  estimatedCents: z.coerce.number().int().min(0).max(2_000_000_000).default(0),
  actualCents: z.coerce.number().int().min(0).max(2_000_000_000).default(0),
  paid: z.boolean().default(false),
});
export const updateBudgetItemSchema = budgetItemSchema
  .omit({ categoryId: true })
  .partial();

export const timelineTaskSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  dueDate: z.string().max(40).refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date").optional().nullable(),
  status: taskStatusSchema.default("todo"),
  milestone: z.boolean().default(false),
});
export const updateTimelineTaskSchema = timelineTaskSchema.partial();

export const vendorItemSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(80).default("General"),
  status: vendorStatusSchema.default("researching"),
  contactName: z.string().max(120).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
  notes: z.string().max(1000).optional(),
});
export const updateVendorItemSchema = vendorItemSchema.partial();

export const aiPlanSchema = z.object({
  timelineTasks: z
    .array(
      z.object({
        title: z.string().min(1).max(160),
        description: z.string().max(1000).optional(),
        daysBeforeEvent: z.number().int().min(-3650).max(3650),
        milestone: z.boolean().optional(),
      }),
    )
    .min(5)
    .max(20),
  budgetCategories: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        percent: z.number().min(0).max(100),
        items: z
          .array(
            z.object({
              name: z.string().min(1).max(120),
              estimatedPercentOfCategory: z.number().min(0).max(100).optional(),
            }),
          )
          .max(25)
          .optional(),
      }),
    )
    .min(3)
    .max(15)
    .superRefine((categories, ctx) => {
      const totalPercent = categories.reduce(
        (sum, category) => sum + category.percent,
        0,
      );
      if (totalPercent < 90 || totalPercent > 110) {
        ctx.addIssue({
          code: "custom",
          message: "Budget category percentages must total between 90 and 110.",
        });
      }
      categories.forEach((category, index) => {
        const itemPercent = (category.items ?? []).reduce(
          (sum, item) => sum + (item.estimatedPercentOfCategory ?? 0),
          0,
        );
        if (itemPercent > 100) {
          ctx.addIssue({
            code: "custom",
            path: [index, "items"],
            message: "Budget item percentages cannot exceed their category allocation.",
          });
        }
      });
    }),
  vendorItems: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        category: z.string().min(1).max(80),
      }),
    )
    .min(4)
    .max(25),
  ideas: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        description: z.string().min(1).max(1000),
        categoryTag: z.string().max(80).optional(),
      }),
    )
    .min(3)
    .max(12),
});

export const eventIdeasSchema = z.array(
  z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(1000),
    categoryTag: z.string().max(80).optional(),
  }),
).max(12);

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type AiPlan = z.infer<typeof aiPlanSchema>;
