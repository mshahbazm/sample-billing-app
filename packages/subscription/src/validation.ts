import { z } from 'zod';

/* ===========================
Subscription Plan Validation
=============================== */

export const subscriptionPlanValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billing_cycle: z.enum(["monthly", "yearly"]),
  price: z.number().positive(),
  status: z.enum(["active", "inactive"]),
});

export const subscriptionPlanUpdateValidationSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  price: z.number().optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
}).refine(data => !(data.price || data.billing_cycle), {
  message: 'Price and billing_cycle can not be updated, please create a new subscription plan.',
  path: ['price', 'billing_cycle'],
});


/* =================================================
Customer Validation
=================================================== */
export const customerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  subscription_plan_id: z.string(),
  subscription_status: z.enum(["active", "cancelled", "past_due", "unpaid"]).optional(),
}).refine(data => !(data.subscription_status), {
  message: 'Can not set subscription_status, it will be updated once the payment has been made against invoice',
  path: ['subscription_status'],
});

