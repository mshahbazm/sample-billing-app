import { Hono } from 'hono';
import { z } from 'zod';
import { IResponse } from '../../shared/types';
import GenerateInvoice from './lib/generate-invoice';
import { Env, IGenerateInvoiceInput } from './types';

const invoices = new Hono<Env>()

/*==================
Generate Invoice
=====================*/
invoices.post('/', async (c) => {
  try {
    const data = await c.req.json() as IGenerateInvoiceInput;

    const genInvoice = GenerateInvoice({ data, INVOICING: c.env.INVOICING })

    /* Trigger Notification Service */

    /* Return */
    return c.json({

    })
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

/*==================
Generate Invoice
=====================*/
invoices.get('/:customerId', async (c) => {

})

export default invoices
