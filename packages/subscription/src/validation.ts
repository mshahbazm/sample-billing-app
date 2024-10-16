import { z } from 'zod';

// Zod schema for Subscription Plan
export const subscriptionPlanValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billing_cycle: z.enum(["monthly", "yearly"]),
  price: z.number().positive(),
  status: z.enum(["active", "inactive"]),
});

// Zod schema for Subscription Plan update: Don't allow price,
export const subscriptionPlanUpdateValidationSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  price: z.number().optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
}).refine(data => !(data.price || data.billing_cycle), {
  message: 'Price and billing_cycle can not be updated, please create a new subscription plan.',
  path: ['price', 'billing_cycle'],
});
