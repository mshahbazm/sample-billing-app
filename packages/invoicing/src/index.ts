/**
 * Invoicing API
 * ----------------------------
 * This file contains route handlers for managing Invoice generations and getting all invoices for a particular customer.
 *
 * Endpoints:
 * - POST /invoices/subscription-plans: Generate new Invoice.
 * - GET /invoices/:customerId: Retrieve all invoices for particular customer by id

 */

import { Hono } from 'hono';
import { IInvoice, IInvoiceValue, IResponse } from '../../shared/types';
import { KV_PREFIXES } from './config';
import GenerateInvoice from './lib/generate-invoice';
import { Env, IGenerateInvoiceInput } from './types';

const invoices = new Hono<Env>().basePath('/invoices/')

/*==================
Generate Invoice
=====================*/
invoices.post('/', async (c) => {
  try {
    const data = await c.req.json() as IGenerateInvoiceInput;

    const newInvoice = await GenerateInvoice({ data, INVOICING: c.env.INVOICING })

    if (!newInvoice.data || !newInvoice.success) {
      return c.json(newInvoice satisfies IResponse)
    }

    await c.env.NOTIFICATION_QUEUE.send({
      type: 'invoice',
      id: newInvoice.data.id,
      variant: 'success',
      invoice: newInvoice.data,
      customer: data.customer
    });

    return c.json({
      success: true,
      data: {
        ...newInvoice.data
      }
    }, 200)
  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
})

/*==================
Generate Invoice
=====================*/
invoices.get('/:customerId', async (c) => {
  try {

    const customerId = c.req.param('id');

    const prefix = `${KV_PREFIXES.INVOICE_CUSTOMER_ID}${customerId}`;
    const { keys } = await c.env.INVOICING.list({ prefix });

    const invoices = await Promise.all(
      keys.map(async (key) => {
        const invoiceId = await c.env.INVOICING.get(key.name, 'text');
        if (!invoiceId?.length) return;
        const invoice = await c.env.INVOICING.get(invoiceId, 'json');
        return {
          id: key.name.replace(KV_PREFIXES.INVOICE, ''),
          ...invoice as IInvoiceValue
        }
      })
    )


    return c.json(
      {
        success: true,
        data: invoices.filter((item) => item !== undefined) satisfies IInvoice[]
      } satisfies IResponse<IInvoice[]>,
      200
    );

  } catch (error) {
    console.log(error);
    return c.json({ error: 'Internal Server Error', success: false } satisfies IResponse, 500);
  }
})

export default invoices
