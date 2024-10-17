import { createId } from '@paralleldrive/cuid2';
import FutureDate from '../../../shared/helpers/future-date';
import { IInvoice } from '../../../shared/types';
import { customerValidationSchema, subscriptionPlanValidationSchema } from '../../../shared/validation';
import { KV_PREFIXES } from '../config';
import { IGenerateInvoiceInput } from '../types';

const GenerateInvoice = async ({ data, INVOICING }: { data: IGenerateInvoiceInput, INVOICING: KVNamespace }) => {
  try {
    if (!data.customer || !data.subscriptionPlan) {
      return {
        error: 'Customer and Plan data is required to generate invoice',
        success: false
      }
    }
    const { customer, subscriptionPlan } = data
    subscriptionPlanValidationSchema.parse(subscriptionPlan);
    customerValidationSchema.parse(customer);

    const id = createId()
    const withIdPrefix = `${KV_PREFIXES.INVOICE}${id}`
    const withCustomerIdPrefix = `${KV_PREFIXES.INVOICE_CUSTOMER_ID}${customer.id}`

    const dueDate = FutureDate(5);

    const invoice: IInvoice = {
      id,
      customer_id: customer.id,
      amount: subscriptionPlan.price,
      due_date: dueDate.date,
      payment_status: 'generated'
    }

    /* Helps filter by ID */
    await INVOICING.put(withIdPrefix, JSON.stringify(invoice))
    /* Help fitler invocies by customerid */
    await INVOICING.put(withCustomerIdPrefix, invoice.id)

    return {
      success: true,
      data: invoice
    }
  } catch (error) {
    throw error
  }
}


export default GenerateInvoice;