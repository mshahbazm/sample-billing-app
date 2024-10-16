import { z } from 'zod';

// Define the Zod schema for Subscription Plan
export const subscriptionPlanValidationSchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensure name is not empty
  billing_cycle: z.enum(["monthly", "yearly"]), // Limit to specific billing cycles
  price: z.number().positive(), // Ensure price is a positive number
  status: z.enum(["active", "inactive"]), // Limit to specific statuses
});

