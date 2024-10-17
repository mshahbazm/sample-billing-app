/**
 * Subscription Plan Controller
 * ----------------------------
 * This file contains route handlers for managing subscription plans.
 * It includes routes for creating, updating, and retrieving subscription plans.
 *
 * Endpoints:
 * - POST /subscription-plans: Create a new subscription plan.
 * - GET /subscription-plans: Retrieve all subscription plans (without pagination).
 * - GET /subscription-plans/:id: Retrieve a specific subscription plan by ID.
 * - PUT /subscription-plans/:id: Update a subscription plan by ID (Can't update price and billing_cycle, which can cause issues for active subscribers)
 * - DELETE /subscription-plans/:id: Delete a subscription plan by ID.

 */

import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { z } from 'zod';
import { IResponse, ISubscriptionPlan, ISubscriptionPlanValue } from '../../../shared/types';
import { subscriptionPlanUpdateValidationSchema, subscriptionPlanValidationSchema } from '../../../shared/validation';
import { KV_PREFIXES } from '../config';
import { Env, } from '../types';

const plans = new Hono<Env>()

/* =========================================
Create a new Plan
============================================*/
plans.post('/', async (c) => {
  try {

    const body = await c.req.json();
    const inputData = subscriptionPlanValidationSchema.parse(body);

    const id = `${KV_PREFIXES.SUBSCRIPTION_PLAN}${createId()}`
    await c.env.SUBSCRIPTION_MANAGEMENT.put(id, JSON.stringify(inputData))

    return c.json(
      {
        success: true,
        data: {
          id: id.replace(KV_PREFIXES.SUBSCRIPTION_PLAN, ''),
          ...inputData
        } satisfies ISubscriptionPlan
      } satisfies IResponse<ISubscriptionPlan>,
      201
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        } satisfies IResponse,
        400
      );
    }
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
})

/* =========================================
Get All Plans
============================================*/
plans.get('/', async (c) => {
  try {

    const prefix = KV_PREFIXES.SUBSCRIPTION_PLAN; // Assuming you have a prefix defined
    const { keys } = await c.env.SUBSCRIPTION_MANAGEMENT.list({ prefix });

    const plans = await Promise.all(
      keys.map(async (key) => {
        const data = await c.env.SUBSCRIPTION_MANAGEMENT.get(key.name, 'json');
        return {
          id: key.name.replace(KV_PREFIXES.SUBSCRIPTION_PLAN, ''),
          ...data as ISubscriptionPlanValue
        }
      })
    )

    return c.json(
      {
        success: true,
        data: plans satisfies ISubscriptionPlan[]
      } satisfies IResponse<ISubscriptionPlan[]>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
})

/* =========================================
Get Plan by ID
============================================*/
plans.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const plan = await c.env.SUBSCRIPTION_MANAGEMENT.get(`${KV_PREFIXES.SUBSCRIPTION_PLAN}${id}`, 'json') as ISubscriptionPlanValue;
    if (!plan) {
      return c.json(
        {
          success: false,
          error: 'Subscription plan not found',
        } satisfies IResponse<ISubscriptionPlan>,
        404
      );
    }

    return c.json(
      {
        success: true,
        data: {
          id,
          ...plan
        }
      } satisfies IResponse<ISubscriptionPlan>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
})

/* =========================================
Update plan by ID
============================================*/
plans.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    let plan = await c.env.SUBSCRIPTION_MANAGEMENT.get(`${KV_PREFIXES.SUBSCRIPTION_PLAN}${id}`, 'json') as ISubscriptionPlanValue;
    if (!plan) {
      return c.json(
        {
          success: false,
          error: 'Subscription plan not found',
        } satisfies IResponse,
        404
      );
    }

    const body = await c.req.json();
    const inputData = subscriptionPlanUpdateValidationSchema.parse(body);

    if (inputData.name !== plan.name || inputData.status !== plan.status) {
      plan = {
        ...plan,
        name: inputData.name?.length ? inputData.name : plan.name,
        status: inputData.status?.length ? inputData.status : plan.status,
      }
      await c.env.SUBSCRIPTION_MANAGEMENT.put(`${KV_PREFIXES.SUBSCRIPTION_PLAN}${id}`, JSON.stringify(plan))
    }

    return c.json(
      {
        success: true,
        data: {
          id,
          ...plan
        } satisfies ISubscriptionPlan
      } satisfies IResponse<ISubscriptionPlan>,
      201
    );


  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        } satisfies IResponse,
        400
      );
    }
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }

});


export default plans;