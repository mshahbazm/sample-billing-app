import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { z } from 'zod';
import { KV_PREFIXES } from './config';
import { Env, ISubscriptionPlan } from './types';
import { subscriptionPlanValidationSchema } from './validation';


const app = new Hono<{ Bindings: Env }>()


/* ==========================
Subscription Plans Routes 
==========================*/
app.post('/subscription-plans', async (c) => {
  try {

    const data = await c.req.parseBody();
    const planData = subscriptionPlanValidationSchema.parse(data);

    const id = `${KV_PREFIXES.SUBSCRIPTION_PLAN}_${createId()}`

    await c.env.SUBSCRIPTION_MANAGEMENT.put(id, JSON.stringify(planData))


    return c.json(
      {
        message: 'Subscription plan created successfully',
        data: {
          id,
          ...planData
        } satisfies ISubscriptionPlan
      },
      201
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        400
      );
    }
  }
})

app.get('/subscription-plans', (c) => {
  return c.text('Hello Subscription!')
})

app.patch('/subscription-plans', (c) => {
  return c.text('Hello Subscription!')
});

export default app

