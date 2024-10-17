/**
 * Customers Controller
 * ----------------------------
 * This file contains route handlers for managing Customers.
 * It includes routes for creating, updating, and retrieving customers.
 *
 * Endpoints:
 * - POST /customers: Create a new customer.
 * - GET /customers: Retrieve all customers (without pagination).
 * - POST /customers/:id/assign-plan: Change customer subscription plan 
 * - GET /customers/:id: Get Customer details

 */

import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { z } from 'zod';
import { ICustomer, IResponse, ISubscriptionPlan } from '../../../shared/types';
import { customerValidationSchema } from '../../../shared/validation';
import { KV_PREFIXES } from '../config';
import { Env } from '../types';

const customers = new Hono<Env>();

/* =========================================
Create a new Customer
============================================*/
customers.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const inputData = customerValidationSchema.parse(body);

    const customerId = await c.env.SUBSCRIPTION_MANAGEMENT.get(`${KV_PREFIXES.CUSTOMER_EMAIL}${inputData.email}`);
    if (customerId) {
      return c.json(
        {
          success: false,
          error: `Customer with email ${inputData.email} already exists`
        } satisfies IResponse,
        409
      );
    }

    const plan = await c.env.SUBSCRIPTION_MANAGEMENT.get(`${KV_PREFIXES.SUBSCRIPTION_PLAN}${inputData.subscription_plan_id}`, 'json') as ISubscriptionPlan;

    if (!plan || plan.status === 'inactive') {
      const error = !plan ? 'Invalid Subscription plan id' : 'Can not subscribe to an inactive plan'
      return c.json(
        {
          success: false,
          error,
        } satisfies IResponse,
        400
      );
    }

    const id = createId();
    const idWithPrefix = `${KV_PREFIXES.CUSTOMER}${id}`;
    const customerStub = c.env.CUSTOMER.get(c.env.CUSTOMER.idFromName(id));
    await customerStub.putCustomerData(inputData);

    /* Helps filter customer by id */
    await c.env.SUBSCRIPTION_MANAGEMENT.put(idWithPrefix, JSON.stringify({ subscription_status: inputData.subscription_status }));
    /* Helps filter customer by email */
    await c.env.SUBSCRIPTION_MANAGEMENT.put(`${KV_PREFIXES.CUSTOMER_EMAIL}${inputData.email}`, id);

    return c.json(
      {
        success: true,
        data: {
          id,
          ...inputData,
        },
      } satisfies IResponse,
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

/* =========================================
Get All Customers
============================================*/
customers.get('/', async (c) => {
  try {
    const prefix = KV_PREFIXES.CUSTOMER;
    const { keys } = await c.env.SUBSCRIPTION_MANAGEMENT.list({ prefix });

    const customersData = await Promise.all(
      keys.map(async (key) => {
        const id = key.name.replace(KV_PREFIXES.CUSTOMER, '');
        const stub = c.env.CUSTOMER.get(c.env.CUSTOMER.idFromName(id));
        return stub.getCustomer().then((customerData) => ({
          id,
          ...customerData,
        }));
      })
    );

    return c.json(
      {
        success: true,
        data: customersData,
      } satisfies IResponse<ICustomer[]>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
});

/* =========================================
Assign Subscription Plan to Customer
============================================*/
customers.post('/:id/assign-plan', async (c) => {
  try {
    const customerId = c.req.param('id');
    const body = await c.req.json();
    const { subscription_plan_id } = body;

    if (!subscription_plan_id) {
      return c.json(
        {
          success: false,
          error: 'Subscription plan ID is required.',
        } satisfies IResponse,
        400
      );
    }

    const customerStub = c.env.CUSTOMER.get(c.env.CUSTOMER.idFromName(customerId));
    const updatedCustomer = await customerStub.putCustomerData({ subscription_plan_id });

    return c.json(
      {
        success: true,
        data: updatedCustomer,
      } satisfies IResponse<ICustomer>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
});

/* =========================================
Get Customer Details
============================================*/
customers.get('/:id', async (c) => {
  try {
    const customerId = c.req.param('id');

    const customerStub = c.env.CUSTOMER.get(c.env.CUSTOMER.idFromName(customerId));
    if (!customerStub) {
      return c.json(
        {
          success: false,
          error: "Customer not found",
        } satisfies IResponse,
        404
      );
    }
    const customerData = await customerStub.getCustomer();

    return c.json(
      {
        success: true,
        data: {
          id: customerId,
          ...customerData
        },
      } satisfies IResponse<ICustomer>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
});

export default customers;
